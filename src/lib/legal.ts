import { site } from "@/lib/site";

export const legalNav = [
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookie-policy", label: "Cookie policy" },
] as const;

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

/**
 * PLACEHOLDER: This legal copy should be reviewed by a lawyer before real launch.
 * It describes the kinds of data LexNova currently collects (names, emails,
 * course registrations, and contact messages) and is not legal advice.
 */
export const privacyPolicy: LegalDocument = {
  title: "Privacy policy",
  lastUpdated: "15 September 2026",
  intro:
    "This placeholder policy explains, in plain language, how LexNova expects to handle personal information on this site: names, email addresses, account details, and course registrations. It is a draft for development, not a finished legal document.",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        `${site.name} is a legal-education site. For this draft, the contact point for privacy questions is ${site.email}. The postal address on the site is ${site.address}. Replace these details with the real controller name, registration, and address before launch.`,
      ],
    },
    {
      heading: "What we collect",
      paragraphs: [
        "When you create an account we store your full name, email address, and a hashed password held by our authentication provider. We also store the role of your account (student, teacher, or admin).",
        "When you register for a course or training we store which program you joined, when you registered, and whether that registration is confirmed or cancelled.",
        "When you send the contact form we store your name, email address, and message so we can reply.",
        "We do not ask for payment card numbers on this site in the current build. If payments are added later, this policy must be updated.",
      ],
    },
    {
      heading: "Why we use it",
      paragraphs: [
        "We use this information to create and secure your account, to enroll you in programs, to show you your courses and calendar, to answer messages, and to let administrators manage the catalog and registrations.",
        "We rely on steps you take (creating an account, submitting a form, or registering for a program) and on our interest in running the school. A lawyer should name the correct legal bases for the jurisdiction where LexNova launches.",
      ],
    },
    {
      heading: "Who else sees it",
      paragraphs: [
        "Site administrators can see profiles and registration history in order to run programs. Lecturers listed on public pages are a separate directory; linking a lecturer record to a login is optional.",
        "The site is hosted with a cloud provider and uses a database and authentication service. Those processors see the data needed to keep the site running. Name the actual processors in this section before launch.",
        "We do not sell your name or email. We do not currently share registrations with advertisers.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "Account and registration records stay for as long as the account exists and for a period afterwards that a lawyer should set (for example, to show who attended a course). Contact messages are kept so we can follow up, then deleted or archived on a schedule you choose before launch.",
      ],
    },
    {
      heading: "Your choices",
      paragraphs: [
        "You can update your name and password from your dashboard profile. To correct other details, close an account, or ask what we hold, email us. Depending on where you live you may have rights to access, correct, delete, or restrict processing, and to complain to a supervisory authority. Those rights need jurisdiction-specific wording before launch.",
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "This site is aimed at adults taking professional or civic education. It is not intended for children. If you believe we have collected information from a child, contact us so we can delete it.",
      ],
    },
    {
      heading: "Changes",
      paragraphs: [
        "When this draft is replaced by a reviewed policy, we will update the date on this page. Material changes should be announced in a way a lawyer recommends.",
      ],
    },
  ],
};

/**
 * PLACEHOLDER: This legal copy should be reviewed by a lawyer before real launch.
 */
export const termsOfUse: LegalDocument = {
  title: "Terms of use",
  lastUpdated: "15 September 2026",
  intro:
    "These placeholder terms describe how you may use the LexNova website, create an account, and register for courses or trainings. They are a draft for development, not a contract you can rely on, and they are not legal advice.",
  sections: [
    {
      heading: "The site",
      paragraphs: [
        `${site.name} publishes information about legal-education programs and lets signed-in users register for those programs. Teaching materials, schedules, and fees shown on the site may change. Nothing on the site is legal advice for your own matter.`,
      ],
    },
    {
      heading: "Accounts",
      paragraphs: [
        "You must provide a real name and a working email address when you register. You are responsible for keeping your password confidential and for activity on your account. We may suspend an account that is used to harm the site, other students, or the integrity of a program.",
      ],
    },
    {
      heading: "Course registrations",
      paragraphs: [
        "Submitting a registration request records your name and email against that program. Registration may close when a course is full, when a deadline passes, or when an administrator cancels a place. Completing a registration on this site does not, by itself, create a right to a certificate, a refund, or a particular timetable — those rules belong in a reviewed student agreement before launch.",
      ],
    },
    {
      heading: "Acceptable use",
      paragraphs: [
        "Do not misuse the site: no scraping that overloads our systems, no attempts to access other people's accounts or admin tools, and no posting of content you do not have the right to share. Program descriptions and news articles on the site remain our (or our licensors') materials.",
      ],
    },
    {
      heading: "Disclaimers",
      paragraphs: [
        "The site is provided as a working draft. We do not warrant that it is uninterrupted or error-free. To the extent a lawyer later permits, liability for use of this development site should be limited. Do not use these placeholder terms as a cap on liability in production.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "Name the country or state whose law applies, and the courts that would hear a dispute, before launch. This draft does not choose a jurisdiction.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        `Questions about these terms can be sent to ${site.email}.`,
      ],
    },
  ],
};

/**
 * PLACEHOLDER: This legal copy should be reviewed by a lawyer before real launch.
 */
export const cookiePolicy: LegalDocument = {
  title: "Cookie policy",
  lastUpdated: "15 September 2026",
  intro:
    "This placeholder policy describes the cookies this site sets today. LexNova does not currently run advertising or analytics cookies. A lawyer should confirm whether this notice is enough for the place you launch.",
  sections: [
    {
      heading: "What cookies we use",
      paragraphs: [
        "Essential cookies keep you signed in. They are set by our authentication provider when you log in, register, or reset a password, and they are needed for the dashboard, course registration, and admin tools to work.",
        "If you dismiss the cookie notice on this site, we store a first-party preference cookie (lexnova_cookie_notice) so we do not show that banner again on this browser. That cookie is not used for advertising.",
        "We do not currently set cookies for advertising, social-media pixels, or third-party analytics. If those are added later, this policy and the banner must be updated — and consent may be required before they run.",
      ],
    },
    {
      heading: "How long they last",
      paragraphs: [
        "Sign-in cookies last for the session length our authentication provider uses, including “remember this browser” behaviour if you stay logged in. The cookie-notice preference cookie is stored for up to one year.",
      ],
    },
    {
      heading: "How to control cookies",
      paragraphs: [
        "You can delete cookies in your browser settings. Clearing essential cookies will sign you out. Blocking all cookies may stop login and registration from working.",
        "You can read this policy again from the footer at any time. The privacy policy explains the personal data we store in our database, which is separate from these cookies.",
      ],
    },
  ],
};
