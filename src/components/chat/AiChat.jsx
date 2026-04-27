"use client";

import { useChat } from "@ai-sdk/react";
import ChatWindow from "./ChatWindow";
import { DefaultChatTransport } from "ai";

const AiChat = () => {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai-search",
    }),
  });

  const handleSubmit = (message) => {
    if (!message.text) return;
    sendMessage({ text: message.text });
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      {/* Header */}
      <div className="flex-shrink-0 mb-4 pb-3 border-b border-border">
        <p className="font-semibold">AI Web Search</p>
        <p className="text-sm text-muted-foreground">
          Search the web and get AI-summarized answers
        </p>
      </div>
      {/* ChatWindow takes remaining height */}
      <ChatWindow
        handleSubmit={handleSubmit}
        messages={messages}
        status={status}
        placeholder="Search anything... e.g. Roadmap to learn Web3"
      />
    </div>
  );
};

export default AiChat;
