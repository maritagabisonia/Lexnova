"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { AuthMessage } from "@/components/auth-form";
import {
  profileRoles,
  roleLabel,
  type AdminUserRow,
} from "@/lib/user-roles";
import { updateUserRole, type UserRoleActionState } from "./actions";

const inputClass =
  "min-h-11 w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent";

const initialState: UserRoleActionState = {};

export function UsersTable({
  users,
  currentUserId,
}: {
  users: AdminUserRow[];
  currentUserId: string;
}) {
  const [query, setQuery] = useState("");
  const [state, formAction, pending] = useActionState(
    updateUserRole,
    initialState,
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return users;
    }
    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(needle) ||
        user.email.toLowerCase().includes(needle)
      );
    });
  }, [users, query]);

  return (
    <div className="mt-8">
      <form
        className="max-w-md"
        onSubmit={(event) => event.preventDefault()}
      >
        <label
          htmlFor="user-search"
          className="block text-xs tracking-wide text-ink-muted"
        >
          Search
        </label>
        <input
          id="user-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or email"
          className={`${inputClass} mt-1.5`}
        />
      </form>

      {state.error || state.success ? (
        <div className="mt-6">
          <AuthMessage state={state} />
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">
          {users.length === 0
            ? "No users yet."
            : "No users match that search."}
        </p>
      ) : (
        <>
          <ul className="mt-6 space-y-3 sm:hidden">
            {filtered.map((user) => (
              <li
                key={user.id}
                className="border border-ink/10 bg-paper p-4 text-sm leading-relaxed"
              >
                <UserName user={user} />
                <p className="mt-1 text-ink-muted">{user.email}</p>
                <p className="mt-1 text-ink-muted">Joined {user.joinedAt}</p>
                <div className="mt-3">
                  <RoleControl
                    user={user}
                    currentUserId={currentUserId}
                    formAction={formAction}
                    pending={pending}
                    controlId={`role-mobile-${user.id}`}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 hidden overflow-x-auto sm:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink/15 text-xs tracking-wide text-ink-muted">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Role</th>
                  <th className="py-2 font-medium">Join date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-ink/10">
                    <td className="py-3 pr-4 text-ink">
                      <UserName user={user} />
                    </td>
                    <td className="py-3 pr-4 text-ink-muted">{user.email}</td>
                    <td className="py-3 pr-4">
                      <RoleControl
                        user={user}
                        currentUserId={currentUserId}
                        formAction={formAction}
                        pending={pending}
                        controlId={`role-desktop-${user.id}`}
                      />
                    </td>
                    <td className="whitespace-nowrap py-3 text-ink-muted">
                      {user.joinedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function UserName({ user }: { user: AdminUserRow }) {
  if (user.role !== "student") {
    return <span>{user.name}</span>;
  }

  return (
    <Link href={`/admin/users/${user.id}`} className="hover:text-accent">
      {user.name}
    </Link>
  );
}

function RoleControl({
  user,
  currentUserId,
  formAction,
  pending,
  controlId,
}: {
  user: AdminUserRow;
  currentUserId: string;
  formAction: (payload: FormData) => void;
  pending: boolean;
  controlId: string;
}) {
  const isSelf = user.id === currentUserId;

  if (isSelf) {
    return (
      <p className="text-sm text-ink">
        {user.roleLabel}
        <span className="mt-0.5 block text-xs text-ink-muted">Your role</span>
      </p>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={user.id} />
      <label className="sr-only" htmlFor={controlId}>
        Role for {user.name}
      </label>
      <select
        key={`${controlId}-${user.role}`}
        id={controlId}
        name="role"
        defaultValue={user.role}
        disabled={pending}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="min-h-11 rounded-sm border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent disabled:opacity-60"
      >
        {profileRoles.map((role) => (
          <option key={role} value={role}>
            {roleLabel(role)}
          </option>
        ))}
      </select>
    </form>
  );
}
