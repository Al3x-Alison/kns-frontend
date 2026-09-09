"use client";

import { Modal } from "./Modal";

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  danger,
  loading,
  error,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-foreground-muted">{message}</p>
      {error && (
        <div className="mt-3 rounded-lg border border-danger-soft-border bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground-muted hover:bg-surface-secondary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
            danger
              ? "bg-danger text-white hover:brightness-110"
              : "bg-accent text-accent-foreground hover:bg-accent-hover"
          }`}
        >
          {loading ? "Please wait…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
