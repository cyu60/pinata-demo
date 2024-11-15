import axios from "axios";

/**
 * Sends a request to the backend API to generate an audio file from the provided text.
 * @param text - The text to convert to audio.
 * @returns A promise that resolves to the URL of the generated audio.
 */
export const createAudioFileFromText = async (text: string): Promise<Blob> => {
  console.log("Creating audio file from text at utils/audioUtils.ts:", text);
  try {
    const response = await axios.post(
      "/api/create-elevenlabs-audio",
      { text },
      {
        responseType: "blob", // Important: tell axios to expect binary data
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to generate audio.");
    }

    // Create a blob URL from the audio data
    const audioBlob = new Blob([response.data], { type: "audio/mpeg" });

    return audioBlob;
  } catch (error) {
    console.error("Error in createAudioFileFromText:", error);
    throw error;
  }
};
