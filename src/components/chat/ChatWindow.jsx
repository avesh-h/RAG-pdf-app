"use client";

import { Fragment } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useState } from "react";

export default function ChatWindow({ file }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    // Pass fileId with every message so API knows which file to search
    body: { fileId: file.id },
  });

  const handleSubmit = (message) => {
    if (!message.text) return;
    sendMessage(
      {
        text: message.text,
      },
      {
        body: { fileId: file.id },
      },
    );
    setInput("");
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      {/* File name header */}
      <div className="mb-4 pb-3 border-b border-border">
        <p className="text-sm text-muted-foreground">Chatting with</p>
        <p className="font-semibold truncate">{file.filename}</p>
      </div>

      <Conversation className="h-full">
        <ConversationContent>
          {messages.map((message) => (
            <div key={message.id}>
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <Fragment key={`${message.id}-${i}`}>
                        <Message from={message.role}>
                          <MessageContent>
                            <Response>{part.text}</Response>
                          </MessageContent>
                        </Message>
                      </Fragment>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          ))}
          {(status === "submitted" || status === "streaming") && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput onSubmit={handleSubmit} className="mt-4">
        <PromptInputBody>
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </PromptInputBody>
        <PromptInputToolbar>
          <PromptInputTools />
          <PromptInputSubmit disabled={!input && !status} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
