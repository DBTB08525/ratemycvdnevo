import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { createRequire } from "module";
import type { IncomingMessage, ServerResponse } from "http";

const require = createRequire(import.meta.url);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: { overlay: false },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      mode === "development" && localAnalyzeCvPlugin(env.ANTHROPIC_API_KEY),
    ].filter(Boolean),
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
  };
});

function buildSystemPrompt() {
  return `You are an experienced recruiter and CV reviewer. Your job is to give a thorough, fair, recruiter-style assessment of a CV.

Analyse the CV text below and score it across 9 categories, each out of 10. Then provide an overall weighted score out of 100.

Categories and weights:
1. Structure & Layout (weight 10): clean logical layout, reverse chronological, no huge text blocks, clear sections, bullet points, readability
2. Formatting & Consistency (weight 15): consistent spacing, bullet styles, date formatting, tense, alignment, no overlaps
3. Professional Presentation (weight 5): professional fonts, sensible sizing, no distracting colours or unnecessary design
4. Achievement Focus (weight 20): achievement-led not responsibility-led, evidence of impact, quantified results, outcomes
5. Specificity & Strength of Language (weight 15): specific credible wording, strong action verbs, avoids vague phrases like "helped with" or "responsible for"
6. Clarity & Conciseness (weight 10): no waffle, no clichés, no repetition, concise, easy to skim
7. Keyword Use (weight 10): relevant keywords for likely market, not stuffed, balanced for humans and ATS
8. Spelling, Grammar & Accuracy (weight 10): spelling, grammar, punctuation, consistency
9. AI-Sounding Language (weight 5): overly polished/generic/templated language, buzzwords, empty corporate wording

Date handling rules (CRITICAL):
- Today's date is ${new Date().toISOString().slice(0, 10)}. Use this as "now" for all date checks.
- Do NOT treat any year (including 2025, 2026, or later) as "future" by default. Compare the full date to today's date.
- A year on its own is never enough to flag an error.
- If a start date is on or before today, the role is valid (current or past).
- If an end date is after today, treat it as an ongoing role — this is NOT an error.
- Treat "Present", "Current", "Now" or similar as today's date. Never flag roles running into the current or next year.
- Only flag a date issue if ONE of these is genuinely true:
  (a) end date is before start date,
  (b) the timeline is clearly impossible (e.g. 50-year role at one company aged 25),
  (c) BOTH start AND end date are entirely in the future and presented as current/past.
- Never produce feedback like "using 2025/2026 dates creates confusion". Validate by logic, not by hardcoded years.

Rules:
- Do not assume the CV is bad
- Do not over-penalise if metrics are impossible to quantify
- If early-career, judge fairly in context
- Only flag AI language when it genuinely sounds generic
- Be practical and commercially realistic
- Prioritise recruiter-readability over academic perfection
- Be direct but helpful, professional, honest, not harsh

Also provide:
- A short verdict line (e.g. "Strong CV with a few areas to tighten up")
- 3 top strengths (bullet points)
- 3-5 main issues holding the CV back
- 3-5 quick wins (practical fixes they can make immediately)
- 2-4 rewrite examples turning weak phrasing into stronger achievement-led phrasing

Return ONLY valid JSON, no preamble, no markdown:

{
  "overallScore": 0,
  "verdict": "",
  "categoryScores": [
    { "name": "Structure & Layout", "score": 0, "summary": "", "strengths": [""], "improvements": [""] },
    { "name": "Formatting & Consistency", "score": 0, "summary": "", "strengths": [""], "improvements": [""] },
    { "name": "Professional Presentation", "score": 0, "summary": "", "strengths": [""], "improvements": [""] },
    { "name": "Achievement Focus", "score": 0, "summary": "", "strengths": [""], "improvements": [""] },
    { "name": "Specificity & Strength of Language", "score": 0, "summary": "", "strengths": [""], "improvements": [""] },
    { "name": "Clarity & Conciseness", "score": 0, "summary": "", "strengths": [""], "improvements": [""] },
    { "name": "Keyword Use", "score": 0, "summary": "", "strengths": [""], "improvements": [""] },
    { "name": "Spelling, Grammar & Accuracy", "score": 0, "summary": "", "strengths": [""], "improvements": [""] },
    { "name": "AI-Sounding Language", "score": 0, "summary": "", "strengths": [""], "improvements": [""] }
  ],
  "topStrengths": ["", "", ""],
  "mainIssues": ["", "", ""],
  "quickWins": ["", "", ""],
  "rewriteExamples": [{ "weak": "", "better": "" }]
}`;
}

function localAnalyzeCvPlugin(apiKey: string) {
  return {
    name: "local-analyze-cv",
    configureServer(server: any) {
      server.middlewares.use(
        "/api/analyze-cv",
        async (req: IncomingMessage, res: ServerResponse) => {
          res.setHeader("Content-Type", "application/json");

          if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return;
          }

          if (req.method !== "POST") {
            res.writeHead(405);
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
          }

          if (!apiKey) {
            res.writeHead(500);
            res.end(
              JSON.stringify({
                error:
                  "ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server.",
              }),
            );
            return;
          }

          try {
            // Read request body
            const rawBody = await new Promise<string>((resolve, reject) => {
              const chunks: Buffer[] = [];
              req.on("data", (chunk: Buffer) => chunks.push(chunk));
              req.on("end", () => resolve(Buffer.concat(chunks).toString()));
              req.on("error", reject);
            });

            const { fileData, fileName, fileType } = JSON.parse(rawBody);

            if (!fileData) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: "No CV data provided." }));
              return;
            }

            // Parse PDF or Word doc
            const buffer = Buffer.from(fileData, "base64");
            const isPdf =
              fileType === "application/pdf" ||
              fileName?.toLowerCase().endsWith(".pdf");

            let text = "";
            if (isPdf) {
              const pdfParse = require("pdf-parse");
              const result = await pdfParse(buffer);
              text = result.text;
            } else {
              const mammoth = require("mammoth");
              const result = await mammoth.extractRawText({ buffer });
              text = result.value;
            }

            text = text.trim();
            if (!text || text.length < 50) {
              res.writeHead(400);
              res.end(
                JSON.stringify({
                  error:
                    "We couldn't read enough text from this CV to review it properly.",
                }),
              );
              return;
            }
            if (text.length > 8000) text = text.substring(0, 8000);

            // Call Anthropic
            const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
              method: "POST",
              headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
              },
              body: JSON.stringify({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 4096,
                system: buildSystemPrompt(),
                messages: [{ role: "user", content: text }],
              }),
            });

            if (!aiRes.ok) {
              console.error("[local-analyze-cv] Anthropic returned", aiRes.status);
              res.writeHead(aiRes.status);
              res.end(JSON.stringify({ error: "AI analysis failed. Check your API key." }));
              return;
            }

            const aiData = await aiRes.json();
            let content = aiData.content?.[0]?.text ?? "";
            content = content
              .replace(/```json\s*/g, "")
              .replace(/```\s*/g, "")
              .trim();

            const parsed = JSON.parse(content);
            res.writeHead(200);
            res.end(JSON.stringify(parsed));
          } catch (e: any) {
            console.error("[local-analyze-cv]", e?.message ?? e);
            res.writeHead(500);
            res.end(JSON.stringify({ error: "Something went wrong while reviewing your CV. Please try again." }));
          }
        },
      );
    },
  };
}
