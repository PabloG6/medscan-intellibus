import { Activity, Download } from "lucide-react";
import { memo } from "react";
import type { FileUIPart, ReasoningUIPart } from "ai";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ImageWithLabels, type ImageLabel } from "@/components/image-with-labels";
import type { DiagnosisChatMessage } from "./types";

interface ChatMessageProps {
  message: DiagnosisChatMessage;
  className?: string;
  onImageLabelsChange?: (messageId: string, labels: ImageLabel[]) => void;
}

function isImageFile(part: FileUIPart) {
  return part.mediaType.startsWith("image/");
}

function renderNonImageFile(part: FileUIPart, index: number) {
  const filename = part.filename ?? "attachment";
  return (
    <a
      key={`file-${index}`}
      href={part.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 text-sm underline decoration-dotted underline-offset-4"
    >
      <Download className="w-4 h-4" />
      {filename}
    </a>
  );
}

function renderReasoningPart(part: ReasoningUIPart, index: number) {
  return (
    <pre key={`reasoning-${index}`} className="mt-3 rounded-[1px] bg-black/5 p-3 text-xs leading-5">
      {part.text}
    </pre>
  );
}

export const ChatMessage = memo(function ChatMessage({
  message,
  className,
  onImageLabelsChange,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const timestamp = message.metadata?.timestamp
    ? new Date(message.metadata.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : undefined;

  const bubbleClasses = cn(
    "max-w-[85%] rounded-[1px] p-4",
    isUser ? "bg-black text-white" : "bg-white border border-black"
  );

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start", className)}>
      {!isUser && (
        <Avatar className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[1px] bg-black">
          <Activity className="h-5 w-5 text-white" />
        </Avatar>
      )}

      <div className={bubbleClasses}>
        {message.parts.map((part, index) => {
          switch (part.type) {
            case "text": {
              const key = `text-${index}`;
              return (
                <p key={key} className={cn("whitespace-pre-wrap text-sm", index > 0 ? "mt-3" : undefined)}>
                  {part.text}
                </p>
              );
            }
            case "reasoning":
              return renderReasoningPart(part, index);
            case "file": {
              if (!isImageFile(part)) {
                return renderNonImageFile(part, index);
              }

              const labels = message.metadata?.image?.labels ?? [];
              const alt = message.metadata?.image?.alt ?? part.filename ?? "Image attachment";

              return (
                <div key={`image-${index}`} className="mt-4">
                  <ImageWithLabels
                    src={part.url}
                    alt={alt}
                    labels={labels}
                    editable={false}
                    onLabelsChange={(updated) => onImageLabelsChange?.(message.id, updated)}
                    className="w-full rounded-[1px]"
                  />
                </div>
              );
            }
            case "source-url": {
              const title = part.title ?? (() => {
                try {
                  return new URL(part.url).hostname;
                } catch {
                  return part.url;
                }
              })();
              return (
                <div key={`source-url-${index}`} className="mt-3 text-xs opacity-70">
                  Source:{" "}
                  <a href={part.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted">
                    {title}
                  </a>
                </div>
              );
            }
            case "source-document":
              return (
                <div key={`source-doc-${index}`} className="mt-3 text-xs opacity-70">
                  Source Document: {part.title ?? part.filename ?? `Document ${index + 1}`}
                </div>
              );
            default:
              return null;
          }
        })}

        {message.metadata?.totalTokens != null && (
          <p className="mt-3 text-xs opacity-60">Tokens: {message.metadata.totalTokens}</p>
        )}

        {timestamp && <p className="mt-2 text-xs opacity-60" suppressHydrationWarning>{timestamp}</p>}
      </div>

      {isUser && (
        <Avatar className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[1px] bg-black/10">
          <span className="text-sm">You</span>
        </Avatar>
      )}
    </div>
  );
});
