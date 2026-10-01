export const site = {
  name: "LexNova",
  tagline: "Legal education for a more informed public.",
  email: "lexnova.center@gmail.com",
  phone: "+995 555 33 25 53",
  address: {
    ka: "მ. კოსტავას 67, თბილისი",
    en: "67 M. Kostava Street, Tbilisi, Georgia",
  },
} as const;

export const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/lexnova_center?stkn=MXZnaG83eHZjcWMzbA%3D%3D&utm_source=qr",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/19gEsDk4Qc/?mibextid=wwXIfr",
  },
] as const;

export function phoneHref(phone = site.phone) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function siteAddress(locale: string) {
  return locale === "ka" ? site.address.ka : site.address.en;
}

export const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
] as const;

export const authNav = [
  { href: "/login", label: "Log In" },
  { href: "/register", label: "Register" },
] as const;
