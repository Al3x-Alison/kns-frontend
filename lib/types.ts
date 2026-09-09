export type Role = "admin" | "uploader" | "call_center";

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  is_active: boolean;
  last_login: string | null;
}

export type DocumentStatus = "processing" | "done" | "failed" | string;

export type DocumentSourceType = "file" | "url";

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentSourceType;
  status: DocumentStatus;
  uploaded_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  // Raw `results` array from /api/query/search — shape isn't fixed, so we
  // keep it loose and render whatever fields come back.
  sources?: Record<string, unknown>[];
}
