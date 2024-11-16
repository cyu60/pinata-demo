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

interface GroupFilesListProps {
  groupId: string;
}

export default function GroupFilesList({ groupId }: GroupFilesListProps) {
  const [files, setFiles] = useState<FileListItem[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchGroupFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/files?groupId=${groupId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch group files");
      }
      const data = await response.json();
      setFiles(data.data.files);
    } catch (e) {
      console.error(e);
      setError("Error fetching group files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroupFiles();
    }
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
      {files.length === 0 ? (
        <p className="text-gray-500">No files in this group yet.</p>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-medium max-w-[200px] truncate sm:max-w-none sm:truncate-none">
                {file.name || "Unnamed File"}
              </p>
              <p className="text-sm text-gray-500 max-w-[200px] truncate sm:max-w-none sm:truncate-none">
                CID: {file.cid}
              </p>
              <p className="text-sm text-gray-500 max-w-[200px] truncate sm:max-w-none sm:truncate-none">
                Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <p className="text-sm text-gray-500 max-w-[200px] truncate sm:max-w-none sm:truncate-none">
                Uploaded At: {new Date(file.created_at).toLocaleString()}
              </p>
            </div>
            <a
              href={getFileUrl(file.cid)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              View
            </a>
          </div>
        ))
      )}
    </div>
  );
}
