"use client";

import { useEffect, useMemo, useState } from "react";

type AccountStatus = "active" | "suspended" | "disabled" | "pending" | "anonymized";
type RoleFilter = "customer" | "creator" | "admin" | "";
type StatusFilter = AccountStatus | "deleted" | "";

type UserRow = {
  user_id: string;
  display_name: string;
  email: string;
  role: string;
  account_status: AccountStatus;
  created_at: string | null;
  last_login_at: string | null;
  order_count: number;
  submission_count: number;
  total_spent?: number;
  phone_number?: string | null;
  shipping?: {
    recipient_name: string | null;
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    country: string | null;
    phone_number: string | null;
  };
  purchases?: Array<{
    order_id: string;
    order_number: string;
    order_date: string | null;
    order_status: string;
    payment_status: string;
    item_count: number;
    order_total: number;
    shipping_summary: string | null;
  }>;
  admin_notes?: string | null;
};

export function UsersClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [role, setRole] = useState<RoleFilter>("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [dangerAction, setDangerAction] = useState<"anonymize" | "delete_data" | "disable" | null>(null);
  const [confirmationText, setConfirmationText] = useState("");

  const selectedUserRole = selectedUser?.role ?? "Customer";
  const selectedUserStatus = selectedUser?.account_status ?? "active";
  const [editRole, setEditRole] = useState(selectedUserRole);
  const [editStatus, setEditStatus] = useState<AccountStatus>(selectedUserStatus);
  const [notes, setNotes] = useState("");
  const confirmationMatches = Boolean(
    selectedUser && (confirmationText.trim() === "DELETE" || confirmationText.trim().toLowerCase() === selectedUser.email.toLowerCase()),
  );

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (role) params.set("role", role);
    return params.toString();
  }, [search, status, role]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users${query ? `?${query}` : ""}`, { cache: "no-store" });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; users?: UserRow[]; error?: string };
      if (!response.ok || !result.ok) {
        setMessage(result.error ?? "Failed to load users.");
        return;
      }
      setUsers(result.users ?? []);
    } catch {
      setMessage("Network error while loading users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const loadUserDetail = async (userId: string) => {
    setSelectedUserId(userId);
    setDetailLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, { cache: "no-store" });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; user?: UserRow; error?: string };
      if (!response.ok || !result.ok || !result.user) {
        setMessage(result.error ?? "Failed to load user detail.");
        return;
      }
      setSelectedUser(result.user);
      setEditRole(result.user.role ?? "Customer");
      setEditStatus(result.user.account_status);
      setNotes(result.user.admin_notes ?? "");
    } catch {
      setMessage("Network error while loading user detail.");
    } finally {
      setDetailLoading(false);
    }
  };

  const saveUser = async () => {
    if (!selectedUserId) return;
    setMessage(null);
    const response = await fetch(`/api/admin/users/${selectedUserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: editRole, status: editStatus, notes }),
    });
    const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!response.ok || !result.ok) {
      setMessage(result.error ?? "Failed to save user.");
      return;
    }
    await loadUsers();
    await loadUserDetail(selectedUserId);
    setMessage("User updated.");
  };

  const applyDangerAction = async () => {
    if (!selectedUserId || !dangerAction) return;
    setMessage(null);
    const response = await fetch(`/api/admin/users/${selectedUserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: dangerAction,
        confirmation: confirmationText,
      }),
    });
    const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string };
    if (!response.ok || !result.ok) {
      setMessage(result.error ?? "Dangerous action failed.");
      return;
    }
    await loadUsers();
    await loadUserDetail(selectedUserId);
    setDangerAction(null);
    setConfirmationText("");
    setMessage(result.message ?? "Action completed.");
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
      <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="text-xl font-semibold text-emerald-300">Users</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50 sm:col-span-2"
          />
          <button
            type="button"
            onClick={() => void loadUsers()}
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
          >
            Search
          </button>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="disabled">Disabled</option>
            <option value="pending">Pending</option>
            <option value="anonymized">Anonymized</option>
          </select>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RoleFilter)}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="creator">Creator</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="px-2 py-2 font-semibold">Name</th>
                <th className="px-2 py-2 font-semibold">Email</th>
                <th className="px-2 py-2 font-semibold">Status</th>
                <th className="px-2 py-2 font-semibold">Role</th>
                <th className="px-2 py-2 font-semibold">Created</th>
                <th className="px-2 py-2 font-semibold">Orders</th>
                <th className="px-2 py-2 font-semibold">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.user_id}
                  onClick={() => void loadUserDetail(user.user_id)}
                  className="cursor-pointer border-b border-zinc-800/70 hover:bg-zinc-800/30"
                >
                  <td className="px-2 py-2 text-zinc-100">{user.display_name}</td>
                  <td className="px-2 py-2 text-zinc-300">{user.email}</td>
                  <td className="px-2 py-2 text-zinc-300">{user.account_status}</td>
                  <td className="px-2 py-2 text-zinc-300">{user.role}</td>
                  <td className="px-2 py-2 text-zinc-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</td>
                  <td className="px-2 py-2 text-zinc-400">{user.order_count ?? 0}</td>
                  <td className="px-2 py-2 text-zinc-400">${(user.total_spent ?? 0).toFixed(2)}</td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td className="px-2 py-3 text-zinc-400" colSpan={7}>
                    {loading ? "Loading users..." : "No users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="text-xl font-semibold text-emerald-300">User Data Management</h2>
        {!selectedUser && <p className="mt-3 text-sm text-zinc-300">Select a user to view details and manage account controls.</p>}
        {detailLoading && <p className="mt-3 text-sm text-zinc-300">Loading user details...</p>}
        {selectedUser && (
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-zinc-700 bg-zinc-950/70 p-3 text-sm text-zinc-200">
              <p className="text-sm font-semibold text-emerald-300">Customer Information</p>
              <div className="mt-2 grid gap-2 text-xs text-zinc-300 sm:grid-cols-2">
                <p><span className="text-zinc-400">Name:</span> {selectedUser.display_name || "-"}</p>
                <p><span className="text-zinc-400">Email:</span> {selectedUser.email || "-"}</p>
                <p><span className="text-zinc-400">Phone:</span> {selectedUser.phone_number || selectedUser.shipping?.phone_number || "-"}</p>
                <p><span className="text-zinc-400">Status:</span> {selectedUser.account_status || "-"}</p>
                <p><span className="text-zinc-400">Created:</span> {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : "-"}</p>
                <p><span className="text-zinc-400">Last login:</span> {selectedUser.last_login_at ? new Date(selectedUser.last_login_at).toLocaleString() : "-"}</p>
                <p><span className="text-zinc-400">Orders:</span> {selectedUser.order_count ?? 0}</p>
                <p><span className="text-zinc-400">Total spent:</span> ${(selectedUser.total_spent ?? 0).toFixed(2)}</p>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-700 bg-zinc-950/70 p-3 text-sm text-zinc-200">
              <p className="text-sm font-semibold text-emerald-300">Shipping Address</p>
              {!(selectedUser.shipping?.line1 || selectedUser.shipping?.city || selectedUser.shipping?.postal_code) ? (
                <p className="mt-2 text-xs text-zinc-400">No shipping address on file.</p>
              ) : (
                <div className="mt-2 grid gap-2 text-xs text-zinc-300 sm:grid-cols-2">
                  <p><span className="text-zinc-400">Recipient:</span> {selectedUser.shipping?.recipient_name || "-"}</p>
                  <p><span className="text-zinc-400">Phone:</span> {selectedUser.shipping?.phone_number || "-"}</p>
                  <p><span className="text-zinc-400">Line 1:</span> {selectedUser.shipping?.line1 || "-"}</p>
                  <p><span className="text-zinc-400">Line 2:</span> {selectedUser.shipping?.line2 || "-"}</p>
                  <p><span className="text-zinc-400">City:</span> {selectedUser.shipping?.city || "-"}</p>
                  <p><span className="text-zinc-400">State:</span> {selectedUser.shipping?.state || "-"}</p>
                  <p><span className="text-zinc-400">ZIP:</span> {selectedUser.shipping?.postal_code || "-"}</p>
                  <p><span className="text-zinc-400">Country:</span> {selectedUser.shipping?.country || "-"}</p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-zinc-700 bg-zinc-950/70 p-3 text-sm text-zinc-200">
              <p className="text-sm font-semibold text-emerald-300">Purchases</p>
              {!selectedUser.purchases?.length ? (
                <p className="mt-2 text-xs text-zinc-400">No purchases yet.</p>
              ) : (
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400">
                        <th className="px-2 py-2 font-semibold">Order</th>
                        <th className="px-2 py-2 font-semibold">Date</th>
                        <th className="px-2 py-2 font-semibold">Order Status</th>
                        <th className="px-2 py-2 font-semibold">Payment</th>
                        <th className="px-2 py-2 font-semibold">Items</th>
                        <th className="px-2 py-2 font-semibold">Total</th>
                        <th className="px-2 py-2 font-semibold">Shipping</th>
                        <th className="px-2 py-2 font-semibold">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser.purchases.map((purchase) => (
                        <tr key={purchase.order_id} className="border-b border-zinc-800/70">
                          <td className="px-2 py-2 text-zinc-200">{purchase.order_number || purchase.order_id}</td>
                          <td className="px-2 py-2 text-zinc-300">{purchase.order_date ? new Date(purchase.order_date).toLocaleDateString() : "-"}</td>
                          <td className="px-2 py-2 text-zinc-300">{purchase.order_status || "-"}</td>
                          <td className="px-2 py-2 text-zinc-300">{purchase.payment_status || "-"}</td>
                          <td className="px-2 py-2 text-zinc-300">{purchase.item_count ?? 0}</td>
                          <td className="px-2 py-2 text-zinc-300">${(purchase.order_total ?? 0).toFixed(2)}</td>
                          <td className="px-2 py-2 text-zinc-400">{purchase.shipping_summary || "-"}</td>
                          <td className="px-2 py-2">
                            <a href={`/admin/orders/${purchase.order_id}`} className="text-emerald-300 hover:text-emerald-200">
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-emerald-300">Role</span>
              <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100">
                <option value="Customer">Customer</option>
                <option value="Creator">Creator</option>
                <option value="Admin">Admin</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-emerald-300">Account Status</span>
              <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as AccountStatus)} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100">
                <option value="active">active</option>
                <option value="suspended">suspended</option>
                <option value="disabled">disabled</option>
                <option value="pending">pending</option>
                <option value="anonymized">anonymized</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-emerald-300">Internal Admin Notes</span>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
                placeholder="Add internal maintenance notes."
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => void saveUser()} className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300">
                Save Account Changes
              </button>
              <a href="/admin/settings" className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200">Back to Settings</a>
              <a href="/cart" className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200">View Order History Link</a>
              <a href="/submitted-designs" className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200">View Design Submissions Link</a>
              <a href="/profile" className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200">View Royalty/Profile Link</a>
            </div>

            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-sm font-semibold text-red-300">Dangerous Actions</p>
              <p className="mt-1 text-xs text-red-200">
                Type the user email or DELETE to confirm before applying an irreversible action.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => setDangerAction("disable")} className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-200">Disable Account</button>
                <button onClick={() => setDangerAction("anonymize")} className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-200">Anonymize User Data</button>
                <button onClick={() => setDangerAction("delete_data")} className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-200">Delete User Data</button>
              </div>

              {dangerAction && (
                <div className="mt-3 space-y-2">
                  <input
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder={`Type ${selectedUser.email} or DELETE`}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                  />
                  <div className="flex gap-2">
                    <button
                      disabled={!confirmationMatches}
                      onClick={() => void applyDangerAction()}
                      className="rounded-lg border border-red-500/40 bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Confirm {dangerAction}
                    </button>
                    <button onClick={() => { setDangerAction(null); setConfirmationText(""); }} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {message && <p className="mt-4 text-xs text-zinc-300">{message}</p>}
      </article>
    </section>
  );
}
