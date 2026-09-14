import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";
import * as mammoth from "mammoth";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const directText = formData.get("text") as string | null;

    if (!file && !directText) {
      return NextResponse.json(
        { success: false, error: "No file or text was provided." },
        { status: 400 }
      );
    }

    if (directText) {
      return NextResponse.json({
        success: true,
        text: directText.trim(),
        fileType: "text/plain",
        fileName: "Pasted Text",
      });
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File upload is missing." },
        { status: 400 }
      );
    }

    // Max 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File exceeds 10MB size limit." },
        { status: 400 }
      );
    }

    const fileName = file.name || "Uploaded Resume";
    const lowerName = fileName.toLowerCase();
    let extractedText = "";
    let fileType = file.type || "application/octet-stream";
    let isDirectResumeJson = false;
    let directResumeData = null;

    if (lowerName.endsWith(".pdf") || fileType.includes("pdf")) {
      fileType = "application/pdf";
      const arrayBuffer = await file.arrayBuffer();
      const pdfData = await extractText(new Uint8Array(arrayBuffer));
      if (Array.isArray(pdfData.text)) {
        extractedText = pdfData.text.join("\n\n");
      } else {
        extractedText = pdfData.text || "";
      }
    } else if (
      lowerName.endsWith(".docx") ||
      fileType.includes("wordprocessingml") ||
      fileType.includes("docx")
    ) {
      fileType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || "";
    } else if (lowerName.endsWith(".json") || fileType.includes("json")) {
      fileType = "application/json";
      extractedText = await file.text();
      try {
        const parsed = JSON.parse(extractedText);
        if (parsed && typeof parsed === "object" && parsed.personalInfo) {
          isDirectResumeJson = true;
          directResumeData = parsed;
        }
      } catch {
        // Not a JSON file or malformed, continue as raw text
      }
    } else if (
      lowerName.endsWith(".txt") ||
      lowerName.endsWith(".md") ||
      lowerName.endsWith(".rtf") ||
      fileType.includes("text")
    ) {
      fileType = "text/plain";
      extractedText = await file.text();
    } else {
      // Attempt generic text fallback
      extractedText = await file.text();
    }

    const cleaned = extractedText.trim();
    if (!cleaned && !isDirectResumeJson) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not extract any readable text from this file. If it is an image or scanned document, please copy and paste the text directly.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      text: cleaned,
      fileName,
      fileType,
      isDirectResumeJson,
      directResumeData,
    });
  } catch (err: any) {
    console.error("File parse route error:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          err?.message ||
          "Failed to process document. Please try copying and pasting the text instead.",
      },
      { status: 500 }
    );
  }
}
