"use client";

import { useRef, useState } from "react";
import { apiErrorMessage, apiFetch } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

function SourcesSection({ sources }: { sources: Record<string, unknown>[] }) {
  const [open, setOpen] = useState(false);
  if (!sources.length) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-200"
      >
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
        </svg>
        Sources ({sources.length})
      </button>

      {open && (
        <div className="mt-2 space-y-2">
          {sources.map((source, i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-xs"
            >
              {Object.entries(source).map(([key, value]) => (
                <div key={key} className="flex gap-2 py-0.5">
                  <span className="shrink-0 font-medium text-zinc-500">{key}:</span>
                  <span className="break-words text-zinc-300">
                    {typeof value === "object" ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    setError("");
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      const data = await apiFetch("/api/query/search", {
        method: "POST",
        body: JSON.stringify({ query, top_k: 3 }),
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data?.answer ?? "No answer returned.",
        sources: Array.isArray(data?.results) ? data.results : [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
        {messages.length === 0 && !loading && (
          <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500">
            <p className="text-sm">Ask a question to get started.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm md:max-w-[70%] ${
                message.role === "user"
                  ? "bg-indigo-500 text-white"
                  : "border border-zinc-800 bg-zinc-900 text-zinc-100"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.role === "assistant" && message.sources && (
                <SourcesSection sources={message.sources} />
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" />
              </span>
              Thinking…
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mx-4 mb-2 rounded-lg border border-red-900/50 bg-red-950/50 px-3 py-2 text-sm text-red-300 md:mx-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSend}
        className="flex items-end gap-2 border-t border-zinc-800 p-4 md:p-6"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          rows={1}
          placeholder="Ask a question…"
          className="min-h-[44px] flex-1 resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
