"use client";

import { useState, useEffect } from "react";
import { pinata } from "@/utils/config";
import { createAudioFileFromText } from "@/utils/audioUtils";

export default function Text2SpeechStorage() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");

  useEffect(() => {
    const initializeGroup = async () => {
      try {
        const response = await fetch("/api/init-group");
        if (!response.ok) {
          throw new Error("Failed to initialize group");
        }
        const group = await response.json();
        setGroupId(group.id);
      } catch (err) {
        console.error(err);
        setError("Failed to initialize group");
      }
    };

    initializeGroup();
  }, []);

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
        .group(groupId)
        .key(keyData.JWT);

      const publicUrl = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/files/${uploadResponse.cid}`;
      setAudioUrl(publicUrl);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to generate or upload audio.");
      setUploading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Public Text to Speech Storage
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to audio"
            className="w-full px-4 py-2 border rounded-md sm:px-3 sm:py-1 lg:px-4 lg:py-2 resize-y min-h-[100px]"
            rows={4}
          />
          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium
              ${
                uploading
                  ? "bg-blue-400 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors sm:py-1 sm:px-3 lg:py-2 lg:px-4`}
          >
            {uploading ? "Generating Audio..." : "Submit"}
          </button>
        </form>

        {audioUrl && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 sm:text-base lg:text-lg">
              Generated Audio
            </h2>
            <audio src={audioUrl} controls className="w-full sm:w-auto" />
            <a
              href={audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm mt-2 inline-block sm:text-xs lg:text-sm truncate max-w-xs"
              title={audioUrl}
            >
              View File
            </a>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
