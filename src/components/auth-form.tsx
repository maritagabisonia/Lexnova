import type { AuthActionState } from "@/app/auth/actions";

export function AuthMessage({ state }: { state: AuthActionState }) {
  if (state.error) {
    return (
      <p
        role="alert"
        className="border-l-4 border-accent bg-paper-muted px-3 py-2 text-sm text-ink"
      >
        {state.error}
      </p>
    );
  }

  if (state.success) {
    return (
      <p
        role="status"
        className="border-l-4 border-ink bg-paper-muted px-3 py-2 text-sm text-ink"
      >
        {state.success}
      </p>
    );
  }

  return null;
}

export function Field({
  id,
  label,
  type = "text",
  autoComplete,
  required = true,
  defaultValue,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-accent"
      />
    </div>
  );
}
