"use client";

import { useState, useEffect } from "react";
import { pinata, getFileUrl } from "@/utils/config";
import FilesList from "../components/FilesList";

export default function PublicFiles() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
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

  const uploadFile = async () => {
    if (!file || !groupId) {
      alert("No file selected or group not initialized");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const keyRequest = await fetch("/api/key");
      const keyData = await keyRequest.json();
      const upload = await pinata.upload
        .file(file)
        .group(groupId)
        .key(keyData.JWT);

      console.log("upload", upload);
      const publicUrl = getFileUrl(upload.cid);
      setUrl(publicUrl);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to upload file");
      setUploading(false);
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
          Public File Upload
        </h1>

        <div className="space-y-6">
          {/* File Input Section */}
          <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            <input
              type="file"
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
            {uploading ? "Uploading..." : "Upload to IPFS"}
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
              Public Files
            </h2>
            <FilesList groupId={groupId} />
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </main>
  );
}
