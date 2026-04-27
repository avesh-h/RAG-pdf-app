"use client";

import { useState, useEffect } from "react";
import { getUserFiles, deleteFile } from "@/actions/files";
import FileChat from "@/components/chat/FileChat";

export default function ChatPage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    setLoading(true);
    const result = await getUserFiles();
    if (result.success) setFiles(result.files);
    setLoading(false);
  }

  async function handleDelete(fileId) {
    const result = await deleteFile(fileId);
    if (result.success) {
      if (selectedFile?.id === fileId) setSelectedFile(null);
      loadFiles();
    }
  }

  function handleSelectFile(file) {
    setSelectedFile(file);
    setSidebarOpen(false); // close drawer on mobile after selecting
  }

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">Loading your files...</div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden relative">
      {/* ── Mobile overlay backdrop ────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside
        className={`
          fixed top-[52px] left-0 h-[calc(100vh-52px)] w-72 z-30
          bg-card border-r border-border
          flex flex-col p-4 gap-3
          transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:z-auto md:flex-shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Your Files</h2>
          {/* Close button — mobile only */}
          <button
            className="md:hidden text-muted-foreground hover:text-foreground p-1"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {files.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-4">
            No files uploaded yet. Go to the upload page to add a PDF.
          </p>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all ${
                  selectedFile?.id === file.id
                    ? "bg-accent border-primary"
                    : "hover:bg-accent border-transparent"
                }`}
              >
                <div
                  className="flex-1 min-w-0"
                  onClick={() => handleSelectFile(file)}
                >
                  <p className="text-sm font-medium truncate">
                    {file.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="text-destructive hover:text-destructive/80 text-xs ml-2 flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* ── Main chat area ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar — shows selected file + open sidebar button */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-lg">☰</span>
            <span>
              {selectedFile ? selectedFile.filename : "Select a file"}
            </span>
          </button>
        </div>

        {/* Chat content */}
        <div className="flex-1 overflow-hidden">
          {selectedFile ? (
            <FileChat file={selectedFile} />
          ) : (
            <div className="flex items-center justify-center h-full p-4 text-center text-muted-foreground text-sm">
              <div>
                <p className="mb-2">No file selected</p>
                {/* Mobile hint */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden text-primary text-sm underline"
                >
                  Tap here to choose a file
                </button>
                {/* Desktop hint */}
                <p className="hidden md:block">
                  Select a file from the left to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
