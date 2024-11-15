import { ElevenLabsClient } from "elevenlabs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, voice_model } = await request.json();

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "Missing ELEVENLABS_API_KEY in environment variables" },
        { status: 500 }
      );
    }

    const client = new ElevenLabsClient({
      apiKey: ELEVENLABS_API_KEY,
    });

    const audioStream = await client.generate({
      voice: voice_model,
      model_id: "eleven_turbo_v2_5",
      text,
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }

    const content = Buffer.concat(chunks);
    return NextResponse.json({ audio: content.toString("base64") });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
