import { NextRequest, NextResponse } from "next/server";
import { AiRequestPayload } from "@/types/ai";

export async function POST(req: NextRequest) {
  try {
    const payload: AiRequestPayload = await req.json();
    const { action, provider, model, ollamaUrl, content, context } = payload;

    // Resolve API Key: client BYOK first, fallback to server environment variables
    let apiKey = (payload.apiKey || "").trim();
    if (!apiKey) {
      if (provider === "gemini") apiKey = process.env.GEMINI_API_KEY || "";
      else if (provider === "openai") apiKey = process.env.OPENAI_API_KEY || "";
      else if (provider === "groq") apiKey = process.env.GROQ_API_KEY || "";
    }

    if (provider !== "ollama" && !apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: `No API key provided for ${provider}. Please configure your API key in AI Settings or provide one in your environment.`,
        },
        { status: 400 }
      );
    }

    // Build the AI Prompt based on requested action
    let prompt = "";
    if (action === "test-connection") {
      prompt = "Respond with exactly one word: 'CONNECTED'.";
    } else if (action === "enhance-bullets") {
      const roleContext = context?.role
        ? `Role: ${context.role}${context?.company ? ` at ${context.company}` : ""}`
        : "";
      const projectContext = context?.projectName
        ? `Project: ${context.projectName}`
        : "";

      prompt = `You are a world-class executive resume writer and ATS optimization specialist.
Rewrite the following resume bullet points to dramatically increase their impact.

Rules:
1. Use Google's XYZ formula: "Accomplished [X], measured by [Y], by doing [Z]".
2. Begin every single bullet point with a powerful, active past-tense verb (e.g. Engineered, Spearheaded, Accelerated, Reduced, Architected, Automated).
3. Preserve the core truth of the accomplishments, but sharpen phrasing, eliminate passive filler, and integrate realistic quantified metrics (% speedup, latency reduction, scale, efficiency, dollars) where appropriate.
4. Keep each bullet point concise (1 to 2 lines maximum).
5. Output ONLY the rewritten bullet points, one bullet point per line (starting with a clean bullet symbol •). Do NOT include preamble, greeting, markdown formatting headers, or conversational text.

${roleContext || projectContext}
Current bullets to improve:
"""
${content || ""}
"""`;
    } else if (action === "generate-summary") {
      const skillsStr = context?.skills?.join(", ") || "";
      prompt = `You are an expert resume writer and executive recruiter.
Write a punchy, high-impact 2-to-3 sentence professional resume summary for the following candidate profile.

Candidate Profile:
${context?.role ? `Target Role / Title: ${context.role}` : ""}
${context?.experienceSummary ? `Work Background: ${context.experienceSummary}` : ""}
${skillsStr ? `Key Skills: ${skillsStr}` : ""}

Rules:
1. Focus on core technical expertise, system ownership, and measurable business impact.
2. Maintain a confident, professional, and authentic voice.
3. Output ONLY the summary paragraph. Do NOT use quotation marks, introductions, or pleasantries.`;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action requested." },
        { status: 400 }
      );
    }

    // Execute provider request
    let result = "";

    if (provider === "gemini") {
      const geminiModel = model || "gemini-1.5-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 800,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData?.error?.message || `Gemini API error: ${res.statusText} (${res.status})`
        );
      }

      const data = await res.json();
      result =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    } else if (provider === "openai" || provider === "groq") {
      const isGroq = provider === "groq";
      const endpoint = isGroq
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
      const defaultModel = isGroq ? "llama-3.1-8b-instant" : "gpt-4o-mini";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || defaultModel,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
          max_tokens: 800,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData?.error?.message || `${provider} API error: ${res.statusText} (${res.status})`
        );
      }

      const data = await res.json();
      result = data?.choices?.[0]?.message?.content?.trim() || "";
    } else if (provider === "ollama") {
      const baseOllama = ollamaUrl || "http://localhost:11434";
      const endpoint = `${baseOllama.replace(/\/+$/, "")}/api/generate`;
      const defaultModel = model || "llama3";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: defaultModel,
          prompt,
          stream: false,
        }),
      });

      if (!res.ok) {
        throw new Error(
          `Ollama connection failed: ${res.statusText} (${res.status}). Ensure Ollama is running at ${baseOllama}.`
        );
      }

      const data = await res.json();
      result = data?.response?.trim() || "";
    } else {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("AI route error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
