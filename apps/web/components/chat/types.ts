import type { UIMessage } from "ai";
import type { ImageLabel } from "@/components/image-with-labels";

export interface DiagnosisAttachment {
  id: string;
  mediaType: string;
  dataUrl: string;
  filename?: string;
  alt?: string;
  labels?: ImageLabel[];
}

export interface DiagnosisMessageMetadata {
  /**
   * ISO timestamp of when the message was created.
   */
  timestamp?: string;
  /**
   * Optional information about associated images.
   */
  image?: {
    alt?: string;
    labels?: ImageLabel[];
    editable?: boolean;
  };
  /**
   * Optional token usage details provided by the model.
   */
  totalTokens?: number;
  /**
   * Base64 attachments persisted for the message.
   */
  attachments?: DiagnosisAttachment[];
}

export type DiagnosisChatMessage = UIMessage<DiagnosisMessageMetadata>;
