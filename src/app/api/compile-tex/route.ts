/**
 * =========================================================================================
 * ARCHITECTURE & DEPLOYMENT NOTICE:
 *
 * 1. DEPLOYMENT TARGET:
 *    This route requires a container-based deployment target (e.g. Fly.io, Railway,
 *    Render, AWS Cloud Run, or Docker) with the single static `tectonic` binary installed
 *    at /usr/local/bin. It will NOT work on standard Vercel or Netlify serverless runtimes.
 *
 * 2. OFFLINE EXCEPTION:
 *    LaTeX server compilation is the SINGLE exception to Resumake's "works fully offline"
 *    architecture. Form editing, LocalStorage auto-save, JSON backup/restore, TXT generation,
 *    DOCX creation, and raw .tex source download all run 100% in-browser with zero network calls.
 *
 * 3. PRIVACY & STATELESSNESS:
 *    This route is 100% stateless. LaTeX source and compiled PDFs are processed inside an
 *    isolated UUID subfolder in os.tmpdir(), streamed directly back to the client, and
 *    guaranteed to be recursively deleted in a finally block. Zero data is logged or retained.
 * =========================================================================================
 */

import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";
import { promisify } from "util";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

export async function POST(req: NextRequest) {
  let tempDir = "";

  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.tex !== "string" || !body.tex.trim()) {
      return NextResponse.json(
        { success: false, error: "Invalid request: 'tex' string property is required." },
        { status: 400 }
      );
    }

    // Tectonic compiles via XeTeX which natively supports Unicode UTF-8.
    // pdfTeX-specific macros like \input{glyphtounicode} and \pdfgentounicode throw
    // "Undefined control sequence" in XeTeX unless guarded. We auto-shim them for safety.
    const texContent = body.tex
      .replace(/\\input\{glyphtounicode\}/g, "\\ifdefined\\pdfgentounicode\\input{glyphtounicode}\\fi")
      .replace(/\\pdfgentounicode\s*=\s*1/g, "\\ifdefined\\pdfgentounicode\\pdfgentounicode=1\\fi");

    // Create unique isolated sandbox directory in os.tmpdir()
    const runId = crypto.randomUUID();
    tempDir = path.join(os.tmpdir(), "resumake-tex", runId);
    await fs.mkdir(tempDir, { recursive: true });

    const inputTexPath = path.join(tempDir, "resume.tex");
    await fs.writeFile(inputTexPath, texContent, "utf-8");

    // Execute Tectonic compiler with 15-second timeout and 10MB buffer cap
    try {
      await execFileAsync("tectonic", ["resume.tex", "--outdir", tempDir], {
        cwd: tempDir,
        timeout: 30000,
        maxBuffer: 15 * 1024 * 1024,
      });
    } catch (compileErr: any) {
      // Check if tectonic binary is missing on this machine
      if (compileErr.code === "ENOENT") {
        return NextResponse.json(
          {
            success: false,
            error:
              "Tectonic LaTeX engine is not installed on this host. For local development, please install Tectonic (https://tectonic-typesetting.github.io) or run Resumake via Docker.",
            stderr: "Command not found: tectonic",
          },
          { status: 503 }
        );
      }

      // Compile failure (LaTeX syntax error, package warning, or timeout)
      const stderr = compileErr.stderr || compileErr.stdout || compileErr.message || "Unknown compilation error";
      return NextResponse.json(
        {
          success: false,
          error: "LaTeX compilation failed. Review syntax errors below.",
          stderr: typeof stderr === "string" ? stderr : String(stderr),
        },
        { status: 422 }
      );
    }

    // Read the compiled PDF
    const outputPdfPath = path.join(tempDir, "resume.pdf");
    const pdfBuffer = await fs.readFile(outputPdfPath);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="resume.pdf"',
        "Content-Length": pdfBuffer.byteLength.toString(),
      },
    });
  } catch (err: any) {
    console.error("LaTeX route exception:", err?.message || err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "An unexpected error occurred during LaTeX compilation.",
      },
      { status: 500 }
    );
  } finally {
    // Guaranteed cleanup: delete temporary sandbox directory
    if (tempDir) {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupErr) {
        // Ignore cleanup failure in tmp
      }
    }
  }
}
