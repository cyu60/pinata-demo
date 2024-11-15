import { useState, useEffect } from "react";
import { getFileUrl } from "@/utils/config";

interface FileListItem {
  id: string;
  name: string;
  cid: string;
  size: number;
  mime_type: string;
  created_at: string;
}

interface FilesListProps {
  groupId?: string;
}

export default function FilesList({ groupId }: FilesListProps) {
  const [files, setFiles] = useState<FileListItem[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const url = groupId ? `/api/files?groupId=${groupId}` : "/api/files";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }
      const data = await response.json();
      setFiles(data.data.files);
    } catch (e) {
      console.error(e);
      setError("Error fetching files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [groupId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm mb-4">{error}</p>;
  }

  return (
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
            href={getFileUrl(file.cid)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            View File
          </a>
        </div>
      ))}
    </div>
  );
}