import { NextResponse } from "next/server";
import { pinata, getFileUrl } from "@/utils/config";
import { ElevenLabsClient } from "elevenlabs";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

// Add Edge runtime directive
export const runtime = "edge";

// Add config for longer timeout (optional, depends on your hosting platform)
export const maxDuration = 300; // 5 minutes in seconds

// Helper function to generate audio content
async function createAudioFromText(text: string, voiceId: string = "Rachel") {
  try {
    console.log("Starting audio generation with ElevenLabs...");
    const audio = await client.generate({
      voice: voiceId,
      model_id: "eleven_multilingual_v2",
      text,
    });
    console.log("Audio stream received from ElevenLabs");

    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    console.log("Audio chunks collected successfully");
    return Buffer.concat(chunks);
  } catch (error) {
    console.error("Error in createAudioFromText:", error);
    throw new Error(`Audio generation failed`);
  }
}

// Helper function to get or create public group
async function getOrCreatePublicGroup(groupName = "Public Files") {
  try {
    const groups = await pinata.groups.list().isPublic(true);
    const existingGroup = groups.groups.find(
      (group) => group.name === groupName && group.is_public
    );

    if (existingGroup) {
      return existingGroup.id;
    }

    const newGroup = await pinata.groups.create({
      name: groupName,
      isPublic: true,
    });
    return newGroup.id;
  } catch (error) {
    console.error("Error managing group:", error);
    throw error;
  }
}

// New helper function to handle common text-to-speech logic
async function handleTextToSpeech(
  text: string,
  groupName?: string | null,
  voiceId?: string
) {
  // Validate input
  if (!text || typeof text !== "string" || text.trim() === "") {
    throw new Error("Invalid input: 'text' is required and must be a string.");
  }

  // Get or create group
  const groupId = await getOrCreatePublicGroup(groupName || undefined);

  // Generate audio from text
  const audioContent = await createAudioFromText(text, voiceId);
  const fileName = `generated-audio-${Date.now()}.mp3`;
  const audioFile = new File([audioContent], fileName, {
    type: "audio/mpeg",
  });

  // Upload to Pinata
  const uploadResponse = await pinata.upload.file(audioFile).group(groupId);
  return getFileUrl(uploadResponse.cid);
}

/**
 * Handler for POST requests to generate speech from text.
 * Expects a JSON body with a 'text' field.
 * Returns a JSON response with the Pinata URL of the uploaded audio file.
 */
export async function POST(request: Request) {
  try {
    const { text, groupName, voiceId } = await request.json();
    // Check for text
    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json(
        { error: "Invalid input: 'text' is required and must be a string." },
        { status: 400 }
      );
    }
    const fileUrl = await handleTextToSpeech(text, groupName, voiceId);
    return NextResponse.json({ fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Error in public-text2speech POST route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate or upload audio.",
      },
      { status: 500 }
    );
  }
}

/**
 * Handler for GET requests to generate speech from text.
 * Expects a 'text' query parameter in the URL.
 * Returns a JSON response with the Pinata URL of the uploaded audio file.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");
    const groupName = searchParams.get("groupName");
    const voiceId = searchParams.get("voiceId");

    // Check for text
    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json(
        { error: "Invalid input: 'text' is required and must be a string." },
        { status: 400 }
      );
    }

    const fileUrl = await handleTextToSpeech(
      text,
      groupName || undefined,
      voiceId || undefined
    );
    return NextResponse.json({ fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Detailed error in GET route:", JSON.stringify(error));
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate or upload audio.",
      },
      { status: 500 }
    );
  }
}
