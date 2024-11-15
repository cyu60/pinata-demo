"use client";

import { useState } from "react";
// import { createAudioStreamFromText } from "@/utils/elevenlabsTTS";
import { pinata } from "@/utils/config";
import { createAudioFileFromText } from "@/utils/audioUtils";

export default function STTStorage() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  //   const audioContextRef = useRef<AudioContext>(new AudioContext());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const audioBlob = await createAudioFileFromText(text);
      const audioFile = new File([audioBlob], "generated-audio.mp3", {
        type: "audio/mpeg",
      });

      const keyRequest = await fetch("/api/key");
      if (!keyRequest.ok) {
        throw new Error("Failed to fetch API key");
      }
      const keyData = await keyRequest.json();

      const uploadResponse = await pinata.upload
        .file(audioFile)
        .key(keyData.JWT);
      const urlRequest = await fetch("/api/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cid: uploadResponse.cid }),
      });
      const url = await urlRequest.json();
      setAudioUrl(url);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to generate or upload audio.");
      setUploading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          STT Storage
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to audio"
            className="w-full px-4 py-2 border rounded-md"
          />
          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium
              ${
                uploading
                  ? "bg-blue-400 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors`}
          >
            {uploading ? "Generating Audio..." : "Submit"}
          </button>
        </form>

        {audioUrl && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Generated Audio
            </h2>
            <audio src={audioUrl} controls className="w-full" />
            <a
              href={audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm mt-2 inline-block"
            >
              View on Pinata
            </a>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
