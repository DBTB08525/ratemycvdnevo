import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as pdfParse from "npm:pdf-parse@1.1.1";
import * as mammoth from "npm:mammoth@1.8.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an experienced recruiter. Your job is to assess how AI-written a CV looks.

Analyse the CV text below and return a score from 0 to 100 representing how AI-generated it appears. 0 means it reads as entirely human-written. 100 means it reads as entirely AI-generated.

Look for:
- Generic buzzwords and templated phrasing
- Lack of specific numbers, outcomes, or real detail
- Unnaturally consistent tone and structure throughout
- Vague responsibility-led language instead of impact-led language
- Over-polished, soulless writing with no personality

Do not accuse the candidate of lying. Frame everything as how it reads and comes across.

Return ONLY valid JSON, no preamble, no markdown:

{
  "ai_score": 0,
  "summary": "",
  "reasons": ["", "", ""],
  "fixes": ["", "", ""]
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileData, fileName, fileType } = await req.json();

    if (!fileData) {
      return new Response(JSON.stringify({ error: "No file data provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const buffer = Uint8Array.from(atob(fileData), (c) => c.charCodeAt(0));
    let text = "";

    const isPdf =
      fileType === "application/pdf" || fileName?.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      const result = await pdfParse.default(buffer);
      text = result.text;
    } else {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }

    text = text.trim();
    if (!text || text.length < 50) {
      return new Response(
        JSON.stringify({
          error:
            "We couldn't read that file. Please try a different PDF or Word doc.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Truncate to ~8000 chars to stay within limits
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

    // Strip markdown code fences if present
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
          "We couldn't read that file. Please try a different PDF or Word doc.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
