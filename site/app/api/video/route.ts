import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { prompt, size = "1280x720", seconds = "8", model = "sora-2" } =
    await req.json();

  // 1) Start a render job
  const job = await fetch("https://api.openai.com/v1/videos", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, prompt, size, seconds }),
  }).then(r => r.json());

  if (!job?.id) {
    return NextResponse.json({ error: job }, { status: 400 });
  }

  // 2) Poll status (simple backoff). You can offload this to a queue/cron.
  let status = job.status;
  let attempts = 0;
  while (status && status !== "completed" && status !== "failed" && attempts < 60) {
    await new Promise(r => setTimeout(r, 4000));
    const res = await fetch(`https://api.openai.com/v1/videos/${job.id}`, {
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
    }).then(r => r.json());
    status = res.status;
    if (status === "completed") {
      return NextResponse.json({
        id: job.id,
        status: "completed",
        // 3) Client can stream/download the MP4 via our GET route below
        url: `/api/video/${job.id}`, 
        meta: res, // includes duration, size, etc.
      });
    }
    if (status === "failed") {
      return NextResponse.json({ id: job.id, status, error: res }, { status: 500 });
    }
    attempts++;
  }

  // Fallback: return job id so the client can poll later
  return NextResponse.json({ id: job.id, status: status ?? "unknown" });
}
