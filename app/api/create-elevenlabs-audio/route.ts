import { ElevenLabsClient } from "elevenlabs";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export const createAudioFromText = async (text: string) => {
  const audio = await client.generate({
    voice: "Rachel",
    model_id: "eleven_multilingual_v2",
    text,
  });
  const chunks = [];

  for await (const chunk of audio) {
    chunks.push(chunk);
  }

  const content = Buffer.concat(chunks);
  return content;
};

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    console.log("Creating audio file from text:", text);

    const audioContent = await createAudioFromText(text);

    // Return audio content directly with appropriate headers
    return new Response(audioContent, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioContent.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error in createAudioFileFromText:", error);
    throw error;
  }
}
