export const site = {
  name: "LexNova",
  tagline: "Legal education for a more informed public.",
  email: "hello@lexnova.org",
  phone: "+1 (555) 010-1947",
  address: "100 Civic Place, Suite 400",
} as const;

/* PLACEHOLDER: Social links — replace hrefs when accounts exist. */
export const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/lexnova" },
  { label: "X", href: "https://x.com/lexnova" },
  { label: "YouTube", href: "https://www.youtube.com/@lexnova" },
] as const;

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
