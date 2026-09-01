import { createClient } from "@/lib/supabase/server";

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  return (
    url.length > 0 &&
    anonKey.length > 0 &&
    !url.includes("your-project-ref") &&
    anonKey !== "your-anon-key"
  );
}

async function getSupabaseStatus() {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message:
        "Fill in .env.local with your project URL and anon key from Supabase → Project Settings → API, then restart the dev server.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("_lexnova_connection_check")
      .select("id")
      .limit(1);

    if (!error) {
      return { ok: true, message: "Connected to Supabase." };
    }

    const details = `${error.code ?? ""} ${error.message}`.toLowerCase();
    if (
      details.includes("invalid api key") ||
      details.includes("jwt") ||
      error.code === "401"
    ) {
      return {
        ok: false,
        message:
          "Supabase rejected the anon key. Copy the anon/public key from Project Settings → API.",
      };
    }

    return { ok: true, message: "Connected to Supabase." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      ok: false,
      message: `Could not reach Supabase: ${message}`,
    };
  }
}

export default async function Home() {
  const supabaseStatus = await getSupabaseStatus();

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-20">
      <h1 className="text-center text-4xl sm:text-6xl">LexNova — coming soon</h1>
      <p className="mt-6 max-w-xl text-center text-sm text-ink-muted sm:text-base">
        {supabaseStatus.ok ? "Supabase: connected. " : "Supabase: not connected. "}
        {supabaseStatus.message}
      </p>
    </section>
  );
}
