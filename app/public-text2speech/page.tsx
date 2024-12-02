"use client";

import { useState } from "react";

export default function Text2SpeechStorage() {
  const [text, setText] = useState("");
  const [groupName, setGroupName] = useState("");
  const [voiceId, setVoiceId] = useState("Rachel");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const response = await fetch("/api/public-text2speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, groupName, voiceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const data = await response.json();
      setAudioUrl(data.fileUrl);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to generate audio.");
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
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group Name (optional)"
              className="px-4 py-2 border rounded-md"
            />
            <select
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="Rachel">Rachel</option>
              <option value="Chinat">Chinat</option>
              <option value="Bill">Bill</option>
              <option value="Charlie">Charlie</option>
              <option value="Charlotte">Charlotte</option>
            </select>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to audio"
            className="w-full px-4 py-2 border rounded-md resize-y min-h-[100px]"
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
          <div className="mt-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Generated Audio
            </h2>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <audio controls className="w-full" key={audioUrl}>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <a
                href={audioUrl}
                download
                className="text-blue-600 hover:text-blue-800 underline text-sm mt-2 block"
              >
                Download Audio
              </a>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
