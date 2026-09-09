import type { User } from "@/lib/types";

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
      <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center text-sm text-zinc-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60 text-xs uppercase tracking-wide text-zinc-500">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Last login</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {users.map((user) => {
            const self = isSelf(user);
            return (
              <tr key={user.id} className="text-zinc-200">
                <td className="px-4 py-3">
                  {user.full_name}
                  {self && <span className="ml-2 text-xs text-zinc-500">(you)</span>}
                </td>
                <td className="px-4 py-3 text-zinc-400">{user.email}</td>
                <td className="px-4 py-3 capitalize text-zinc-400">{user.role.replace("_", " ")}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      user.is_active
                        ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                        : "border-zinc-600/40 bg-zinc-700/20 text-zinc-400"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-400">
                  {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      disabled={self}
                      title={self ? "You can't delete your own account" : undefined}
                      className="rounded-lg border border-red-900/50 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-950/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
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
