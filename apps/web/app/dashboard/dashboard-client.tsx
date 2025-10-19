'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Activity, ArrowUp, Plus, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/chat-message";
import type { DiagnosisAttachment, DiagnosisChatMessage } from "@/components/chat/types";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDashboardSidebar } from "./dashboard-context";

interface DashboardClientProps {
  chatId: string;
  initialMessages: DiagnosisChatMessage[];
}

const DEFAULT_UPLOAD_PROMPT = "Please analyze this medical image.";

export function DashboardClient({ chatId, initialMessages }: DashboardClientProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"Auto" | "Agent" | "Manual">("Auto");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerNewChatHandler } = useDashboardSidebar();

  const {
    messages,
    sendMessage,
    status,
    setMessages,
  } = useChat<DiagnosisChatMessage>({
    id: chatId,
    messages: initialMessages,
    experimental_throttle: 50,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          chatId,
          messages,
        },
      }),
    }),
    onFinish: () => {
      // Invalidate chat history when AI finishes responding (title may have been updated)
      queryClient.invalidateQueries({
        queryKey: trpc.chatHistory.queryKey(),
      });
    },
  });

  const [input, setInput] = useState("");

  const createNewChat = useCallback(async () => {
    const response = await fetch("/api/chat/new", {
      method: "POST",
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { chatId: string; title?: string; description?: string };
    queryClient.invalidateQueries({
      queryKey: trpc.chatHistory.queryKey(),
    });
    const params = new URLSearchParams(searchParams?.toString());
    params.set("chatId", data.chatId);
    router.push(`/dashboard?${params.toString()}`);
  }, [router, searchParams, queryClient, trpc.chatHistory]);

  useEffect(() => registerNewChatHandler(createNewChat), [registerNewChatHandler, createNewChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      filePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [filePreviewUrls]);

  const isAnalyzing = status === "submitted" || status === "streaming";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      setPendingFiles(filesArray);

      // Create preview URLs for images
      const urls = filesArray.map(file => URL.createObjectURL(file));
      setFilePreviewUrls(urls);
    }
  };

  const clearPendingFiles = () => {
    // Revoke all object URLs to prevent memory leaks
    filePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setFilePreviewUrls([]);
    setPendingFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    // Revoke the specific URL
    URL.revokeObjectURL(filePreviewUrls[index]);

    // Remove from both arrays
    setFilePreviewUrls(prev => prev.filter((_, i) => i !== index));
    setPendingFiles(prev => prev.filter((_, i) => i !== index));

    // Reset file input if no files left
    if (pendingFiles.length === 1 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const stampLatestUserMessage = useCallback(
    (isoTimestamp: string) => {
      setMessages((prevMessages) => {
        const updated = [...prevMessages];
        for (let index = updated.length - 1; index >= 0; index -= 1) {
          const message = updated[index];
          if (message.role === "user") {
            updated[index] = {
              ...message,
              metadata: {
                ...(message.metadata ?? {}),
                timestamp: isoTimestamp,
              },
            };
            break;
          }
        }
        return updated;
      });
    },
    [setMessages],
  );

  const handleSend = useCallback(async () => {
    const trimmed = input?.trim() || "";
    const hasFiles = pendingFiles.length > 0;

    if (!trimmed && !hasFiles) {
      return;
    }

    const userTimestamp = new Date().toISOString();
    const text = trimmed || (hasFiles ? DEFAULT_UPLOAD_PROMPT : "");

    const fileList = (() => {
      if (!hasFiles) {
        return undefined;
      }

      const transfer = new DataTransfer();
      pendingFiles.forEach((file) => transfer.items.add(file));
      return transfer.files;
    })();

    try {
      await sendMessage(
        fileList
          ? {
              text,
              files: fileList,
            }
          : { text },
      );

      stampLatestUserMessage(userTimestamp);
      setInput("");
      clearPendingFiles();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [input, pendingFiles, sendMessage, setInput, stampLatestUserMessage]);

  const handleUpdateLabels = useCallback(
    async (messageId: string, labels: DiagnosisAttachment["labels"]) => {
      const targetMessage = messages.find((message) => message.id === messageId);
      if (!targetMessage) {
        return;
      }

      const updatedAttachments = (targetMessage.metadata?.attachments ?? []).map((attachment) => ({
        ...attachment,
        labels,
      }));

      const updatedMetadata: DiagnosisChatMessage["metadata"] = {
        ...(targetMessage.metadata ?? {}),
        image: {
          ...(targetMessage.metadata?.image ?? {}),
          labels,
        },
        attachments: updatedAttachments,
      };

      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                metadata: updatedMetadata,
              }
            : message,
        ),
      );

      await fetch("/api/chat/message", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          messageId,
          metadata: updatedMetadata,
          attachments: updatedAttachments,
        }),
      });
    },
    [chatId, messages, setMessages],
  );

  const disabled = isAnalyzing || (!input?.trim() && pendingFiles.length === 0);

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <header className="flex-shrink-0 border-b border-black p-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[1px] bg-black md:hidden">
                <Activity className="h-5 w-5 text-white" />
              </div>

              <div>
                <h1 className="text-lg">Medical Image Analysis</h1>
                <p className="text-xs opacity-60">AI-Powered Diagnosis Assistant</p>
              </div>
            </div>
          </div>


        </div>
      </header>

      <ScrollArea className="flex-1 overflow-auto">
        <div className="mx-auto flex max-w-4xl flex-col space-y-6 p-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onImageLabelsChange={(messageId, labels) => {
                handleUpdateLabels(messageId, labels);
              }}
            />
          ))}

          {isAnalyzing && (
            <div className="flex justify-start gap-3">
              <Avatar className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[1px] bg-black">
                <Activity className="h-5 w-5 text-white" />
              </Avatar>
              <div className="rounded-[1px] border border-black bg-white p-4">
                <div className="flex gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-black" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-black" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-black" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="flex-shrink-0 border-t border-black p-4">
        <div className="mx-auto max-w-4xl">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            multiple
          />
          <InputGroup>
            {pendingFiles.length > 0 && (
              <InputGroupAddon align="block-start" className="gap-2">
                {filePreviewUrls.map((url, index) => (
                  <div key={url} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-[60px] w-[60px] rounded-[1px] border border-black object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white hover:bg-black/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </InputGroupAddon>
            )}
            <InputGroupTextarea
              placeholder="Ask, Search or Chat..."
              value={input || ""}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              disabled={isAnalyzing}
              rows={1}
            />
            <InputGroupAddon align="block-end" className="justify-between">
              <div className="flex items-center gap-2">
                <InputGroupButton
                  variant="outline"
                  className="rounded-full"
                  size="icon-xs"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                >
                  <Plus className="h-4 w-4" />
                </InputGroupButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <InputGroupButton variant="ghost">{mode}</InputGroupButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="[--radius:0.95rem]">
                    <DropdownMenuItem onClick={() => setMode("Auto")}>Auto</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setMode("Agent")}>Agent</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setMode("Manual")}>Manual</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                <Separator orientation="vertical" className="!h-4" />
                <InputGroupButton
                  variant="default"
                  className="rounded-full"
                  size="icon-xs"
                  disabled={disabled}
                  onClick={handleSend}
                >
                  <ArrowUp className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </InputGroupButton>
              </div>
            </InputGroupAddon>
          </InputGroup>
          <p className="mt-2 text-center text-xs opacity-60">
            DiagnosisAI can make mistakes. Verify important information with healthcare professionals.
          </p>
        </div>
      </div>
    </div>
  );
}
