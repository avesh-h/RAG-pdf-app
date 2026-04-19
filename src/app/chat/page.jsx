"use client";

import { useState, useEffect } from "react";
import { getUserFiles, deleteFile } from "@/actions/files";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    setLoading(true);
    const result = await getUserFiles();
    if (result.success) {
      setFiles(result.files);
    }
    setLoading(false);
  }

  async function handleDelete(fileId) {
    const result = await deleteFile(fileId);
    if (result.success) {
      // If deleted file was selected, clear selection
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
      }
      loadFiles();
    }
  }

  if (loading) {
    return <div className="p-6">Loading your files...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left sidebar — file list */}
      <div className="w-72 border-r flex flex-col p-4 gap-3">
        <h2 className="font-semibold text-lg">Your Files</h2>

        {files.length === 0 ? (
          <div className="text-sm text-gray-500 mt-4">
            No files uploaded yet. Go to the upload page to add a PDF.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all ${
                  selectedFile?.id === file.id
                    ? "bg-blue-50 border-blue-400"
                    : "hover:bg-gray-50 border-transparent"
                }`}
              >
                <div
                  className="flex-1 min-w-0"
                  onClick={() => setSelectedFile(file)}
                >
                  <p className="text-sm font-medium truncate">
                    {file.filename}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="text-red-400 hover:text-red-600 text-xs ml-2 flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right side — chat window */}
      <div className="flex-1">
        {selectedFile ? (
          <ChatWindow file={selectedFile} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a file from the left to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
