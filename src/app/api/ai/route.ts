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
    } else if (action === "parse-resume") {
      prompt = `You are an expert resume parser.
Extract all structured data from the following raw resume text and return it STRICTLY as valid JSON matching the exact TypeScript schema provided below.

Schema:
{
  "personalInfo": {
    "name": "Candidate Full Name",
    "title": "Professional Title / Headline",
    "email": "email@example.com",
    "phone": "+1 (555) 000-0000",
    "location": "City, State or Country",
    "website": "portfolio or personal website URL",
    "linkedin": "linkedin URL or handle",
    "github": "github URL or handle"
  },
  "summary": "Concise professional summary",
  "experience": [
    {
      "id": "exp-1",
      "role": "Job Title",
      "company": "Company Name",
      "location": "City, State or Remote",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "current": false,
      "bullets": "• Bullet point 1\\n• Bullet point 2"
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "name": "Project Name",
      "role": "Creator or Role",
      "link": "https://...",
      "technologies": "React, TypeScript, Node.js",
      "bullets": "• Bullet point 1\\n• Bullet point 2"
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "school": "University or School Name",
      "degree": "B.S. in Computer Science",
      "location": "City, State",
      "startDate": "Year",
      "endDate": "Year",
      "detail": "GPA: 3.9/4.0, Honors, Relevant Coursework"
    }
  ],
  "skills": [
    {
      "id": "skill-1",
      "category": "Languages",
      "skills": "JavaScript, TypeScript, Python, SQL"
    }
  ],
  "sectionOrder": ["summary", "experience", "projects", "education", "skills"]
}

Rules:
1. Return ONLY the JSON object. Do NOT wrap in \`\`\`json markdown blocks, and do NOT add any conversational explanation.
2. If any field is missing or not mentioned, set it to "" or [] (do NOT invent fake information).
3. Format each bullet point on its own line starting with "• ".
4. Ensure the JSON is 100% syntactically valid.

Raw Resume Text:
"""
${content || ""}
"""`;
    } else if (action === "tailor-resume") {
      const resume = context?.resumeData;
      if (!resume) {
        return NextResponse.json(
          { success: false, error: "Resume data is required for tailoring." },
          { status: 400 }
        );
      }

      prompt = `You are a world-class executive recruiter, hiring manager, and ATS algorithm specialist.
Analyze the candidate's resume against the target Job Description (JD).
Perform an in-depth ATS keyword match & gap analysis, and re-tailor the resume's summary, experience bullet points, and skills to maximize ATS alignment for this specific position.

Target Job Description:
"""
${content || ""}
"""

Candidate's Current Resume:
${JSON.stringify(resume, null, 2)}

Instructions:
1. ATS Score & Keywords:
   - Calculate an objective ATS match score (0 to 100) based on title relevance, required skills, tools, and experience level.
   - Identify up to 10 "matchedKeywords" (hard skills/tools present in both resume and JD).
   - Identify up to 10 "missingKeywords" (critical skills/terms in the JD that the candidate should emphasize).
   - Write a 1-2 sentence "summaryAnalysis" from a hiring manager's perspective.
2. Tailored Professional Summary:
   - Rewrite the candidate's professional summary to directly pitch their background to this specific role and company, incorporating key terminology from the JD while maintaining authentic truth.
3. Tailored Experience Bullet Points:
   - For each work experience entry in the resume, rewrite the bullets to highlight achievements and responsibilities that directly relate to the target JD's requirements.
   - Use Google's XYZ formula ("Accomplished [X] measured by [Y] by doing [Z]") starting each bullet with an active, powerful verb.
   - IMPORTANT: Keep the exact same "id", "role", and "company" from the original experience list so they map 1:1.
4. Suggested Skills Additions:
   - List up to 8 high-priority hard skills or tools from the JD that the candidate should highlight.

Output Schema:
Return STRICTLY valid JSON with this exact structure:
{
  "matchScore": number,
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "summaryAnalysis": string,
  "tailoredSummary": string,
  "tailoredExperiences": [
    {
      "id": string (must match original experience id),
      "role": string,
      "company": string,
      "originalBullets": string,
      "tailoredBullets": string (clean bullets with • on each line)
    }
  ],
  "suggestedSkillsAdditions": string[]
}

Rules:
- Return ONLY the raw JSON object. Do NOT wrap in markdown code blocks like \`\`\`json.
- Do NOT invent completely fictitious companies or degrees; elevate the candidate's real work to resonate with the target position.`;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action requested." },
        { status: 400 }
      );
    }

    // Dynamic token allocation
    const maxTokens =
      action === "parse-resume" || action === "tailor-resume" ? 3500 : 800;

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
            temperature:
              action === "parse-resume" || action === "tailor-resume"
                ? 0.2
                : 0.4,
            maxOutputTokens: maxTokens,
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
          temperature:
            action === "parse-resume" || action === "tailor-resume"
              ? 0.2
              : 0.4,
          max_tokens: maxTokens,
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

    if (action === "parse-resume") {
      try {
        let clean = result.trim();
        // Remove markdown backticks if present
        if (clean.startsWith("```")) {
          clean = clean.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
        }
        const parsed = JSON.parse(clean);
        const normalized = normalizeParsedResume(parsed);
        return NextResponse.json({ success: true, parsedResume: normalized, result: clean });
      } catch (parseErr: any) {
        console.error("Failed to parse JSON response from AI:", result);
        throw new Error("The AI returned a response that could not be parsed as valid JSON. Please try again.");
      }
    }

    if (action === "tailor-resume") {
      try {
        let clean = result.trim();
        if (clean.startsWith("```")) {
          clean = clean.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
        }
        const parsed = JSON.parse(clean);
        const tailorResult = {
          matchScore: Math.min(100, Math.max(0, Number(parsed?.matchScore) || 50)),
          matchedKeywords: Array.isArray(parsed?.matchedKeywords)
            ? parsed.matchedKeywords.map(String)
            : [],
          missingKeywords: Array.isArray(parsed?.missingKeywords)
            ? parsed.missingKeywords.map(String)
            : [],
          summaryAnalysis: String(parsed?.summaryAnalysis || "").trim(),
          tailoredSummary: String(parsed?.tailoredSummary || "").trim(),
          tailoredExperiences: Array.isArray(parsed?.tailoredExperiences)
            ? parsed.tailoredExperiences.map((exp: any) => ({
                id: String(exp?.id || ""),
                role: String(exp?.role || ""),
                company: String(exp?.company || ""),
                originalBullets: String(exp?.originalBullets || ""),
                tailoredBullets: Array.isArray(exp?.tailoredBullets)
                  ? exp.tailoredBullets
                      .map((b: string) =>
                        b.trim().startsWith("•") ? b.trim() : `• ${b.trim()}`
                      )
                      .join("\n")
                  : String(exp?.tailoredBullets || "").trim(),
              }))
            : [],
          suggestedSkillsAdditions: Array.isArray(parsed?.suggestedSkillsAdditions)
            ? parsed.suggestedSkillsAdditions.map(String)
            : [],
        };
        return NextResponse.json({ success: true, tailorResult, result: clean });
      } catch (parseErr: any) {
        console.error("Failed to parse tailoring JSON from AI:", result);
        throw new Error("AI returned a response that could not be parsed as valid JSON. Please try again.");
      }
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

function normalizeParsedResume(raw: any) {
  const genId = (p: string) => `${p}-${Math.random().toString(36).substring(2, 9)}`;
  return {
    personalInfo: {
      name: String(raw?.personalInfo?.name || "").trim(),
      title: String(raw?.personalInfo?.title || "").trim(),
      email: String(raw?.personalInfo?.email || "").trim(),
      phone: String(raw?.personalInfo?.phone || "").trim(),
      location: String(raw?.personalInfo?.location || "").trim(),
      website: String(raw?.personalInfo?.website || "").trim(),
      linkedin: String(raw?.personalInfo?.linkedin || "").trim(),
      github: String(raw?.personalInfo?.github || "").trim(),
    },
    summary: String(raw?.summary || "").trim(),
    experience: Array.isArray(raw?.experience)
      ? raw.experience.map((exp: any) => ({
          id: exp?.id || genId("exp"),
          role: String(exp?.role || "").trim(),
          company: String(exp?.company || "").trim(),
          location: String(exp?.location || "").trim(),
          startDate: String(exp?.startDate || "").trim(),
          endDate: String(exp?.endDate || "").trim(),
          current: Boolean(exp?.current),
          bullets: Array.isArray(exp?.bullets)
            ? exp.bullets
                .map((b: string) =>
                  b.trim().startsWith("•") ? b.trim() : `• ${b.trim()}`
                )
                .join("\n")
            : String(exp?.bullets || "").trim(),
        }))
      : [],
    projects: Array.isArray(raw?.projects)
      ? raw.projects.map((proj: any) => ({
          id: proj?.id || genId("proj"),
          name: String(proj?.name || "").trim(),
          role: String(proj?.role || "").trim(),
          link: String(proj?.link || "").trim(),
          technologies: Array.isArray(proj?.technologies)
            ? proj.technologies.join(", ")
            : String(proj?.technologies || "").trim(),
          bullets: Array.isArray(proj?.bullets)
            ? proj.bullets
                .map((b: string) =>
                  b.trim().startsWith("•") ? b.trim() : `• ${b.trim()}`
                )
                .join("\n")
            : String(proj?.bullets || "").trim(),
        }))
      : [],
    education: Array.isArray(raw?.education)
      ? raw.education.map((edu: any) => ({
          id: edu?.id || genId("edu"),
          school: String(edu?.school || "").trim(),
          degree: String(edu?.degree || "").trim(),
          location: String(edu?.location || "").trim(),
          startDate: String(edu?.startDate || "").trim(),
          endDate: String(edu?.endDate || "").trim(),
          detail: String(edu?.detail || "").trim(),
        }))
      : [],
    skills: Array.isArray(raw?.skills)
      ? raw.skills.map((s: any) => ({
          id: s?.id || genId("skill"),
          category: String(s?.category || "Skills").trim(),
          skills: Array.isArray(s?.skills)
            ? s.skills.join(", ")
            : String(s?.skills || "").trim(),
        }))
      : [],
    sectionOrder:
      Array.isArray(raw?.sectionOrder) && raw.sectionOrder.length > 0
        ? raw.sectionOrder
        : ["summary", "experience", "projects", "education", "skills"],
  };
}
