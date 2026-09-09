"use client";

import { useEffect, useRef, useState } from "react";
import { apiErrorMessage, apiFetch } from "@/lib/api";
import type { AssistantChatMessage, ChatMessage, QueryResult } from "@/lib/types";
import { useCompanies } from "@/hooks/useCompanies";
import { CompanySelect } from "@/components/company/CompanySelect";
import { AssistantMessage } from "./AssistantMessage";
import { LoadingIndicator } from "./LoadingIndicator";
import { AlertCircleIcon, SendIcon } from "@/components/ui/icons";

const LAST_COMPANY_KEY = "wisabi_last_company_id";

export function ChatPanel() {
  const { companies, loading: companiesLoading, error: companiesError } = useCompanies();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // First read of a persisted, per-viewer preference — not a props-derive
    // cascade, so this is the intentional sync-to-render-state step.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompanyId(localStorage.getItem(LAST_COMPANY_KEY));
  }, []);

  function selectCompany(id: string | null) {
    setCompanyId(id);
    if (id) localStorage.setItem(LAST_COMPANY_KEY, id);
    else localStorage.removeItem(LAST_COMPANY_KEY);
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  async function runQuery(query: string, companyIdOverride?: string | null) {
    setError("");
    setLoading(true);
    scrollToBottom();

    const effectiveCompanyId = companyIdOverride !== undefined ? companyIdOverride : companyId;

    try {
      const data: QueryResult = await apiFetch("/api/query/search", {
        method: "POST",
        body: JSON.stringify({
          query,
          top_k: 3,
          ...(effectiveCompanyId ? { company_id: effectiveCompanyId } : {}),
        }),
      });
      const assistantMessage: AssistantChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        data,
        forQuery: query,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const assistantMessage: AssistantChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        data: { type: "error", error: apiErrorMessage(err) },
        forQuery: query,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: query }]);
    setInput("");
    await runQuery(query);
  }

  function handleConfirmClarification(confirmedCompanyId: string, question: string) {
    selectCompany(confirmedCompanyId);
    runQuery(question, confirmedCompanyId);
  }

  function handleSelectMatch(matchCompanyId: string, question: string) {
    selectCompany(matchCompanyId);
    runQuery(question, matchCompanyId);
  }

  function handleSelectCompanyFromFormatError(pickedCompanyId: string) {
    selectCompany(pickedCompanyId);
  }

  function handleRetry(query: string) {
    runQuery(query);
  }

  const selectedCompany = companies.find((c) => c.id === companyId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-end gap-3 border-b border-border p-4 md:px-6">
        <div className="w-full max-w-xs">
          <CompanySelect
            id="chat-company"
            label="Company"
            companies={companies}
            value={companyId}
            onChange={selectCompany}
            loading={companiesLoading}
            error={companiesError}
            placeholder="All companies / type 'Company: question'"
          />
        </div>
      </div>

      <div
        ref={listRef}
        className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6"
        aria-live="polite"
      >
        {messages.length === 0 && !loading && (
          <div className="flex h-full flex-col items-center justify-center text-center text-foreground-muted">
            <p className="text-sm">
              {selectedCompany
                ? `Ask a question about ${selectedCompany.name}.`
                : "Pick a company, or ask with the 'Company: question' format."}
            </p>
          </div>
        )}

        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl bg-accent px-4 py-3 text-sm leading-relaxed text-accent-foreground shadow-sm md:max-w-[70%]">
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ) : (
            <div key={message.id} className="flex justify-start">
              <AssistantMessage
                message={message}
                companies={companies}
                onConfirm={handleConfirmClarification}
                onSelectMatch={handleSelectMatch}
                onSelectCompany={handleSelectCompanyFromFormatError}
                onRetry={handleRetry}
              />
            </div>
          )
        )}

        {loading && (
          <div className="flex justify-start">
            <LoadingIndicator companyLabel={selectedCompany?.name} />
          </div>
        )}
      </div>

      {error && (
        <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg border border-danger-soft-border bg-danger-soft px-3 py-2 text-sm text-danger md:mx-6">
          <AlertCircleIcon className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-end gap-2 border-t border-border p-4 md:p-6">
        <label htmlFor="chat-input" className="sr-only">
          Ask a question
        </label>
        <textarea
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          rows={1}
          placeholder={selectedCompany ? "Ask a question…" : "Try 'Freetown Digital Solutions: what services do you provide?'"}
          className="min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message"
          className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendIcon className="h-4 w-4" />
          Send
        </button>
      </form>
    </div>
  );
}
