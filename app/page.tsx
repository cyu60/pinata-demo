"use client";

import { useState, useEffect } from "react";
import { pinata, getGatewayUrl } from "@/utils/config";
import Link from "next/link";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [files, setFiles] = useState<FileListItem[]>([]);
  const [error, setError] = useState<string>("");

  interface FileListItem {
    id: string;
    name: string;
    cid: string;
    size: number;
    mime_type: string;
    created_at: string;
  }

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files");
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }
      const data = await response.json();
      setFiles(data.data.files);
    } catch (e) {
      console.log(e);
      setError("Error fetching files");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const uploadFile = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const keyRequest = await fetch("/api/key");
      const keyData = await keyRequest.json();
      const upload = await pinata.upload.file(file).key(keyData.JWT);
      const urlRequest = await fetch("/api/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cid: upload.cid }),
      });
      const url = await urlRequest.json();
      setUrl(url);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0] || null);
  };

  const renderContent = () => {
    if (!url) return null;

    const fileType = file?.type || "";

    if (fileType.startsWith("image/")) {
      return (
        <img src={url} alt="Uploaded content" className="max-w-full h-auto" />
      );
    }
    if (fileType.startsWith("video/")) {
      return <video src={url} controls className="max-w-full" />;
    }
    if (fileType.startsWith("audio/")) {
      return (
        <div className="w-full max-w-md">
          <audio src={url} controls className="w-full" />
          <p className="mt-2 text-sm text-gray-500 text-center">
            {file?.name} ({((file?.size ?? 0) / (1024 * 1024)).toFixed(2)} MB)
          </p>
        </div>
      );
    }
    return <a href={url}>Download File</a>;
  };

  return (
    <main className="w-full min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          File Upload to IPFS
        </h1>

        <div className="space-y-6">
          {/* File Input Section */}
          <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*,video/*,audio/*,application/pdf"
              onChange={handleChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Upload Button */}
          <button
            disabled={uploading || !file}
            onClick={uploadFile}
            className={`w-full py-2 px-4 rounded-md text-white font-medium
              ${
                !file
                  ? "bg-gray-300 cursor-not-allowed"
                  : uploading
                  ? "bg-blue-400 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors`}
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload to IPFS"
            )}
          </button>

          {/* Preview Section */}
          {url && (
            <div className="mt-8 border rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Preview
              </h2>
              <div className="flex justify-center">{renderContent()}</div>
              <div className="mt-4 text-center">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  View on IPFS
                </a>
              </div>
            </div>
          )}

          {/* Files List Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Your Files
            </h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="space-y-4">
              {files.length === 0 && !error && (
                <p className="text-gray-500">No files uploaded yet.</p>
              )}
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{file.name || "Unnamed File"}</p>
                    <p className="text-sm text-gray-500">CID: {file.cid}</p>
                    <p className="text-sm text-gray-500">
                      Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded At: {new Date(file.created_at).toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={getGatewayUrl(file.cid)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Button */}
          <Link
            href="/stt-storage"
            className="mt-6 block w-full py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition-colors text-center"
          >
            Go to STT Storage
          </Link>
        </div>
      </div>
    </main>
  );
}
