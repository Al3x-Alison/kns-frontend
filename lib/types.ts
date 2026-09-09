export type Role = "admin" | "uploader" | "call_center";

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  is_active: boolean;
  last_login: string | null;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  shortname: string;
}

export type DocumentStatus = "pending" | "processing" | "done" | "failed" | string;

/** Real shape of GET /api/docs/documents items, plus the fields we track
 * client-side for freshly-uploaded documents before their first poll lands. */
export interface DocumentItem {
  id: string;
  title: string;
  type: string;
  status: DocumentStatus;
  chunk_count?: number;
  created?: string;
  error?: string | null;
}

export interface SourceDoc {
  document_id: string;
  title: string;
  source_type: string;
  source_url: string | null;
  chunk_index: number;
  score: number;
  snippet: string;
}

/** POST /api/query/search always returns one of these seven shapes,
 * discriminated on `type`. See AGENTS build prompt §2 for sample payloads. */
export interface SearchQueryResult {
  type: "search" | "direction";
  query: string;
  question?: string;
  answer: string;
  company?: string;
  company_id?: string;
  company_shortname?: string;
  sources: SourceDoc[];
  source_count: number;
  from_cache?: boolean;
  cache_age_seconds?: number;
  cache_ttl_seconds?: number;
  cached_at?: string;
  response_ms: number;
}

export interface GreetingResult {
  type: "greeting";
  query: string;
  answer: string;
  results: unknown[];
  response_ms: number;
}

export interface NoResultsResult {
  type: "no_results";
  answer: string;
  company?: string;
  company_shortname?: string;
  sources: SourceDoc[];
  source_count: number;
  response_ms: number;
}

export interface ClarificationNeededResult {
  type: "clarification_needed";
  status?: string;
  message: string;
  suggested_company: string;
  suggested_shortname: string;
  company_id: string;
  confidence: string;
  question: string;
  action: string;
  response_ms: number;
}

export interface CompanyMatch {
  company_id: string;
  name: string;
  shortname: string;
  confidence: string;
}

export interface MultipleMatchesResult {
  type: "multiple_matches";
  message: string;
  matches: CompanyMatch[];
  question: string;
  response_ms: number;
}

export interface FormatErrorResult {
  type: "format_error";
  message: string;
  example: string;
  available_companies: string[];
  response_ms: number;
}

export interface ErrorResult {
  type: "error";
  answer?: string;
  error?: string;
  response_ms?: number;
}

export type QueryResult =
  | SearchQueryResult
  | GreetingResult
  | NoResultsResult
  | ClarificationNeededResult
  | MultipleMatchesResult
  | FormatErrorResult
  | ErrorResult;

export interface UserChatMessage {
  id: string;
  role: "user";
  content: string;
}

export interface AssistantChatMessage {
  id: string;
  role: "assistant";
  data: QueryResult;
  /** The question this reply answers — used to resend on retry. */
  forQuery: string;
}

export type ChatMessage = UserChatMessage | AssistantChatMessage;
