import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = await fetch(`https://api.openai.com/v1/videos/${params.id}/content`, {
    headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
  });
  if (!res.ok) {
    const err = await res.text();
    return new Response(err, { status: res.status });
  }
  // Proxy the MP4 stream
  return new Response(res.body, {
    headers: {
      "Content-Type": "video/mp4",
      "Cache-Control": "no-store",
    },
  });
}
