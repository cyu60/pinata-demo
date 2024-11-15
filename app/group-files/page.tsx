"use client";

import { useState, useEffect } from "react";
import GroupFilesList from "../components/GroupFilesList";

export default function GroupFilesPage() {
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
      }
    };

    initializeGroup();
  }, []);

  return (
    <main className="w-full min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          All Public Files
        </h1>
        {groupId ? (
          <GroupFilesList groupId={groupId} />
        ) : (
          <p className="text-gray-500 text-center">Loading group...</p>
        )}
      </div>
    </main>
  );
}
