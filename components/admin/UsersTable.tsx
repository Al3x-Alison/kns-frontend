import type { User } from "@/lib/types";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";

export function UsersTable({
  users,
  isSelf,
  onEdit,
  onDelete,
}: {
  users: User[];
  isSelf: (user: User) => boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-foreground-muted">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-secondary text-xs uppercase tracking-wide text-foreground-muted">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Last login</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => {
            const self = isSelf(user);
            return (
              <tr key={user.id} className="text-foreground">
                <td className="px-4 py-3">
                  {user.full_name}
                  {self && <span className="ml-2 text-xs text-foreground-subtle">(you)</span>}
                </td>
                <td className="px-4 py-3 text-foreground-muted">{user.email}</td>
                <td className="px-4 py-3 capitalize text-foreground-muted">{user.role.replace("_", " ")}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      user.is_active
                        ? "border-success-soft-border bg-success-soft text-success"
                        : "border-border-strong bg-surface-secondary text-foreground-muted"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-foreground-muted">
                  {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      aria-label={`Edit ${user.full_name}`}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground-muted hover:bg-surface-secondary hover:text-foreground"
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      disabled={self}
                      aria-label={`Delete ${user.full_name}`}
                      title={self ? "You can't delete your own account" : undefined}
                      className="flex items-center gap-1.5 rounded-lg border border-danger-soft-border px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
