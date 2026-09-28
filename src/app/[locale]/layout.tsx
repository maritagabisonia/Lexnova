import type { Metadata } from "next";
import { cookies } from "next/headers";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  Noto_Sans_Georgian,
  Noto_Serif_Georgian,
  Source_Sans_3,
  Source_Serif_4,
} from "next/font/google";
import { CookieNotice } from "@/components/cookie-notice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";
import { COOKIE_NOTICE_NAME } from "@/lib/cookie-notice";
import { getSiteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

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

// Source has no Mkhedruli glyphs; Noto is the Georgian fallback in the stack.
const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian"],
  variable: "--font-noto-sans-georgian",
  display: "swap",
});

const notoSerifGeorgian = Noto_Serif_Georgian({
  subsets: ["georgian"],
  variable: "--font-noto-serif-georgian",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return { title: site.name };
  }
  const t = await getTranslations({ locale, namespace: "brand" });
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: site.name,
      template: `%s · ${site.name}`,
    },
    description: t("tagline"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
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
      lang={locale}
      className={`${sourceSans.variable} ${sourceSerif.variable} ${notoSansGeorgian.variable} ${notoSerifGeorgian.variable} h-full`}
    >
      <body
        className={`flex min-h-full flex-col ${
          cookieNoticeDismissed ? "" : "pb-36 sm:pb-28"
        }`}
      >
        <NextIntlClientProvider messages={messages}>
          <SiteHeader isLoggedIn={Boolean(user)} isAdmin={isAdmin} />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter />
          <CookieNotice dismissed={cookieNoticeDismissed} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
