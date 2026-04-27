"use client";

import { useChat } from "@ai-sdk/react";
import ChatWindow from "./ChatWindow";

const FileChat = ({ file }) => {
  const { messages, sendMessage, status } = useChat({
    body: { fileId: file?.id },
  });

  const handleSubmit = (message) => {
    if (!message.text) return;
    sendMessage({ text: message.text }, { body: { fileId: file?.id } });
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      {/* Header */}
      <div className="flex-shrink-0 mb-4 pb-3 border-b border-border">
        <p className="text-sm text-muted-foreground">Chatting with</p>
        <p className="font-semibold truncate">{file?.filename}</p>
      </div>
      {/* ChatWindow takes remaining height */}
      <ChatWindow
        handleSubmit={handleSubmit}
        messages={messages}
        status={status}
        placeholder="Ask anything about this document..."
      />
    </div>
  );
};

export default FileChat;
