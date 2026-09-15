import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { CookieNotice } from "@/components/cookie-notice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { COOKIE_NOTICE_NAME } from "@/lib/cookie-notice";
import { getSiteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.tagline,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const cookieStore = await cookies();
  const cookieNoticeDismissed =
    cookieStore.get(COOKIE_NOTICE_NAME)?.value === "1";

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = profile?.role === "admin";
  }

  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${sourceSerif.variable} h-full`}
    >
      <body
        className={`flex min-h-full flex-col ${
          cookieNoticeDismissed ? "" : "pb-36 sm:pb-28"
        }`}
      >
        <SiteHeader isLoggedIn={Boolean(user)} isAdmin={isAdmin} />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
        <CookieNotice dismissed={cookieNoticeDismissed} />
      </body>
    </html>
  );
}
