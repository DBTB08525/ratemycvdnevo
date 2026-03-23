import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as pdfParse from "npm:pdf-parse@1.1.1";
import * as mammoth from "npm:mammoth@1.8.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an experienced recruiter and CV reviewer. Your job is to give a thorough, fair, recruiter-style assessment of a CV.

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
    {
      "name": "Structure & Layout",
      "score": 0,
      "summary": "",
      "strengths": [""],
      "improvements": [""]
    },
    {
      "name": "Formatting & Consistency",
      "score": 0,
      "summary": "",
      "strengths": [""],
      "improvements": [""]
    },
    {
      "name": "Professional Presentation",
      "score": 0,
      "summary": "",
      "strengths": [""],
      "improvements": [""]
    },
    {
      "name": "Achievement Focus",
      "score": 0,
      "summary": "",
      "strengths": [""],
      "improvements": [""]
    },
    {
      "name": "Specificity & Strength of Language",
      "score": 0,
      "summary": "",
      "strengths": [""],
      "improvements": [""]
    },
    {
      "name": "Clarity & Conciseness",
      "score": 0,
      "summary": "",
      "strengths": [""],
      "improvements": [""]
    },
    {
      "name": "Keyword Use",
      "score": 0,
      "summary": "",
      "strengths": [""],
      "improvements": [""]
    },
    {
      "name": "Spelling, Grammar & Accuracy",
      "score": 0,
      "summary": "",
      "strengths": [""],
      "improvements": [""]
    },
    {
      "name": "AI-Sounding Language",
      "score": 0,
      "summary": "",
      "strengths": [""],
      "improvements": [""]
    }
  ],
  "topStrengths": ["", "", ""],
  "mainIssues": ["", "", ""],
  "quickWins": ["", "", ""],
  "rewriteExamples": [
    {
      "weak": "",
      "better": ""
    }
  ]
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileData, fileName, fileType, rawText } = await req.json();

    let text = "";

    if (rawText) {
      text = rawText;
    } else if (fileData) {
      const buffer = Uint8Array.from(atob(fileData), (c) => c.charCodeAt(0));
      const isPdf =
        fileType === "application/pdf" || fileName?.toLowerCase().endsWith(".pdf");

      if (isPdf) {
        const result = await pdfParse.default(buffer);
        text = result.text;
      } else {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      }
    } else {
      return new Response(JSON.stringify({ error: "No CV data provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    text = text.trim();
    if (!text || text.length < 50) {
      return new Response(
        JSON.stringify({
          error:
            "We couldn't read enough text from this CV to review it properly.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (text.length > 8000) text = text.substring(0, 8000);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: text },
          ],
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || "";

    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({
        error:
          "Something went wrong while reviewing your CV. Please try again.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
