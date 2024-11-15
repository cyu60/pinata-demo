export const createAudioStreamFromText = async (
  text: string,
  voice_model: string,
  audioContextRef: AudioContext
) => {
  try {
    const response = await fetch("/api/get-elevenlabs-audio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, voice_model }),
    });

    const data = await response.json();

    if (response.ok) {
      const audioBuffer = Uint8Array.from(atob(data.audio), (c) =>
        c.charCodeAt(0)
      ).buffer;

      const audioContext = audioContextRef;
      const buffer = await audioContext.decodeAudioData(audioBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);

      source.start(0);

      // Return the audio source
      return source;
    } else {
      console.error("Error generating audio:", data.error);
    }
  } catch (error) {
    console.error("Error generating audio:", error);
  }
};
