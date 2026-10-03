import type { ProgramSummary } from "@/lib/program-display";

export const programIconNames = [
  "chip",
  "tax",
  "columns",
  "shield",
  "contract",
  "handshake",
  "corporate",
  "transport",
  "energy",
  "broadcast",
  "education",
  "children",
  "leaf",
  "briefcase",
  "negotiate",
  "brain",
  "podium",
  "network",
  "journal",
  "scroll",
  "ethics",
  "laptop",
  "investigate",
  "book",
] as const;

export type ProgramIconName = (typeof programIconNames)[number];

const slugIcons: Record<string, ProgramIconName> = {
  "artificial-intelligence-law": "chip",
  "ai-and-law-training": "chip",
  "tax-law": "tax",
  "administrative-law": "columns",
  "administrative-law-for-civic-advocates": "columns",
  "criminal-law-and-investigation": "shield",
  "civil-law": "contract",
  "labor-law": "handshake",
  "corporate-and-business-entity-law": "corporate",
  "transport-law": "transport",
  "energy-law": "energy",
  "media-law": "broadcast",
  "education-law": "education",
  "childrens-rights-law": "children",
  "sustainable-development-law": "leaf",
  "business-law": "briefcase",
  "leadership-negotiation-and-communication": "negotiate",
  "law-psychology-and-behavioral-analysis": "brain",
  "public-leadership-and-governance": "podium",
  "digital-economy-law": "network",
  "academic-research-and-international-publication": "journal",
  "dissertation-in-practice": "scroll",
  "academic-integrity-and-research-ethics": "ethics",
  "legal-technology-fundamentals": "laptop",
  "workplace-investigations-workshop": "investigate",
};

const keywordIcons: [RegExp, ProgramIconName][] = [
  [/artificial intelligence|\bai\b|ხელოვნური ინტელექტ/i, "chip"],
  [/tax|საგადასახადო/i, "tax"],
  [/criminal|investigation|სისხლის|გამოძიებ/i, "shield"],
  [/labor|workplace|შრომ/i, "handshake"],
  [/child|ბავშვ/i, "children"],
  [/sustainable|მდგრადი/i, "leaf"],
  [/psycholog|behavioral|ფსიქოლოგ|ქცევ/i, "brain"],
  [/negotiat|communication|მოლაპარაკ|კომუნიკაც/i, "negotiate"],
  [/public leadership|governance|საჯარო ლიდერ|მმართველობ/i, "podium"],
  [/digital econom|ციფრული ეკონომ/i, "network"],
  [/dissertation|დისერტ/i, "scroll"],
  [/integrity|ethics|კეთილსინდისიერ|ეთიკ/i, "ethics"],
  [/research|publication|კვლევ|პუბლიკაც/i, "journal"],
  [/legal tech|technology|ტექნოლოგ/i, "laptop"],
  [/corporate|სამეწარმეო|კორპორაც/i, "corporate"],
  [/transport|სატრანსპორტო/i, "transport"],
  [/energy|ენერგეტიკ/i, "energy"],
  [/media|მედია/i, "broadcast"],
  [/education|განათლებ/i, "education"],
  [/business|ბიზნეს/i, "briefcase"],
  [/civil|სამოქალაქო/i, "contract"],
  [/administrat|ადმინისტრაც/i, "columns"],
];

function programHaystack(program: ProgramSummary) {
  return [
    program.slug,
    program.title,
    program.title_en,
    program.title_ka,
    program.short_description,
    program.short_description_en,
    program.short_description_ka,
  ]
    .filter(Boolean)
    .join("\n");
}

export function programIconName(program: ProgramSummary): ProgramIconName {
  const fromSlug = slugIcons[program.slug];
  if (fromSlug) {
    return fromSlug;
  }
  const haystack = programHaystack(program);
  for (const [pattern, name] of keywordIcons) {
    if (pattern.test(haystack)) {
      return name;
    }
  }
  return "book";
}
