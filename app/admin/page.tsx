"use client";

import { useCallback, useEffect, useState } from "react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import { UserFormModal } from "@/components/admin/UserFormModal";
import { UsersTable } from "@/components/admin/UsersTable";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { apiErrorMessage, apiFetch, getToken } from "@/lib/api";
import { getSelfIdentifiers } from "@/lib/jwt";
import type { User } from "@/lib/types";

type Tab = "users" | "chat";

function AdminPageContent() {
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState<{ mode: "add" | "edit"; user?: User } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const self = getSelfIdentifiers(getToken());
  const isSelf = useCallback(
    (user: User) => (self.id && self.id === user.id) || (self.email && self.email === user.email) || false,
    [self.id, self.email]
  );

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/auth/users");
      setUsers(Array.isArray(data) ? data : (data?.users ?? []));
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial data load on mount — fetchUsers manages its own loading/error
    // state internally, this isn't a synchronous derive-from-props cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await apiFetch(`/api/auth/users/${pendingDelete.id}`, { method: "DELETE" });
      setPendingDelete(null);
      fetchUsers();
    } catch (err) {
      setDeleteError(apiErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex h-full flex-col p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-50">Admin</h1>
        <div className="flex gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          {(["users", "chat"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-indigo-500 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {t === "users" ? "User management" : "AI chat"}
            </button>
          ))}
        </div>
      </div>

      {tab === "users" ? (
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setModal({ mode: "add" })}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            >
              Add user
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-900/50 bg-red-950/50 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-zinc-900" />
              ))}
            </div>
          ) : (
            <UsersTable users={users} isSelf={isSelf} onEdit={(u) => setModal({ mode: "edit", user: u })} onDelete={setPendingDelete} />
          )}
        </div>
      ) : (
        <div className="min-h-0 flex-1 rounded-xl border border-zinc-800">
          <ChatPanel />
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === "add" ? "Add user" : "Edit user"} onClose={() => setModal(null)}>
          <UserFormModal
            mode={modal.mode}
            user={modal.user}
            onClose={() => setModal(null)}
            onSaved={fetchUsers}
          />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete user"
          message={`Are you sure you want to delete ${pendingDelete.full_name}? This can't be undone.`}
          confirmLabel="Delete"
          danger
          loading={deleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={() => {
            setPendingDelete(null);
            setDeleteError("");
          }}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedPage allowedRoles={["admin"]}>
      <AdminPageContent />
    </ProtectedPage>
  );
}
