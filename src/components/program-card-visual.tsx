import type { ReactNode } from "react";
import {
  programIconName,
  type ProgramIconName,
} from "@/lib/program-card-icon";
import type { ProgramSummary } from "@/lib/program-display";

const iconClass = "h-7 w-7 text-accent";

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={iconClass}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function ProgramSubjectIcon({ name }: { name: ProgramIconName }) {
  switch (name) {
    case "chip":
      return (
        <IconFrame>
          <rect x="7" y="7" width="10" height="10" rx="1.2" />
          <path d="M9.5 10.5h5M9.5 13.5h3.5M7 10v.01M7 14v.01M17 10v.01M17 14v.01M10 7V5M14 7V5M10 17v2M14 17v2" />
        </IconFrame>
      );
    case "tax":
      return (
        <IconFrame>
          <path d="M12 3v3M8 6.5h8" />
          <path d="M7 10.5 12 8l5 2.5-5 2.5-5-2.5Z" />
          <circle cx="8.5" cy="17.5" r="2.4" />
          <circle cx="15.5" cy="18.2" r="2" />
        </IconFrame>
      );
    case "columns":
      return (
        <IconFrame>
          <path d="M4 20h16M5 8h14M7 8v12M12 8v12M17 8v12M6 5.5 12 3l6 2.5" />
        </IconFrame>
      );
    case "shield":
      return (
        <IconFrame>
          <path d="M12 3.5 19 6v6.2c0 4.2-2.9 7.2-7 8.3-4.1-1.1-7-4.1-7-8.3V6l7-2.5Z" />
          <path d="M9.5 12.2 11.4 14l3.3-3.6" />
        </IconFrame>
      );
    case "contract":
      return (
        <IconFrame>
          <path d="M8 4.5h6.5L18 8v11.5H8A1.5 1.5 0 0 1 6.5 18V6A1.5 1.5 0 0 1 8 4.5Z" />
          <path d="M14.5 4.5V8H18M9 12h6M9 15h4" />
        </IconFrame>
      );
    case "handshake":
      return (
        <IconFrame>
          <path d="M4 11.5 8 8l3 2.5 3-2 4.5 3.5" />
          <path d="M8 8 6 6.2M16 8.5l2-1.8M8.2 13.5c1.4 1.6 3.4 1.8 5 .4" />
          <path d="M5 16.5c.8 1.6 2.2 2.5 4 2.5M15 19c1.8 0 3.2-.9 4-2.5" />
        </IconFrame>
      );
    case "corporate":
      return (
        <IconFrame>
          <path d="M4.5 20h15" />
          <path d="M6 20V8.5h6V20" />
          <path d="M12 12h6.5V20" />
          <path d="M8 11.5h2M8 14.5h2M14.5 15h2" />
        </IconFrame>
      );
    case "transport":
      return (
        <IconFrame>
          <path d="M4 14.5h16l-1.4-5.2A2 2 0 0 0 16.7 8H8.8A2 2 0 0 0 6.9 9.3L4 14.5Z" />
          <path d="M6.5 17.5a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2ZM17.5 17.5a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z" />
          <path d="M8.2 14.5h7.6" />
        </IconFrame>
      );
    case "energy":
      return (
        <IconFrame>
          <path d="M13.5 3 7 13h5l-1.5 8L17 11h-5l1.5-8Z" />
        </IconFrame>
      );
    case "broadcast":
      return (
        <IconFrame>
          <circle cx="12" cy="16.5" r="1.6" />
          <path d="M8.2 13.2a5.4 5.4 0 0 1 7.6 0M6 10.4a8.4 8.4 0 0 1 12 0" />
          <path d="M12 14.8V7.5M10 5.5h4" />
        </IconFrame>
      );
    case "education":
      return (
        <IconFrame>
          <path d="M3.5 10 12 6l8.5 4L12 14 3.5 10Z" />
          <path d="M7.5 12v4.2c1.4 1 3 1.5 4.5 1.5s3.1-.5 4.5-1.5V12" />
          <path d="M19.5 10.2V16" />
        </IconFrame>
      );
    case "children":
      return (
        <IconFrame>
          <circle cx="12" cy="7.2" r="2.2" />
          <path d="M8 20v-3.2A4 4 0 0 1 12 12.8a4 4 0 0 1 4 4V20" />
          <path d="M9.2 11.4 7 13.2M14.8 11.4 17 13.2" />
        </IconFrame>
      );
    case "leaf":
      return (
        <IconFrame>
          <path d="M5 18.5S7 8 18.5 5.5C18 16.8 8.2 19.2 5 18.5Z" />
          <path d="M9 15.2c2-1.8 4.4-4.8 6.2-8.2" />
        </IconFrame>
      );
    case "briefcase":
      return (
        <IconFrame>
          <rect x="3.5" y="8" width="17" height="11" rx="1.4" />
          <path d="M9 8V6.4A1.4 1.4 0 0 1 10.4 5h3.2A1.4 1.4 0 0 1 15 6.4V8M3.5 13h17" />
        </IconFrame>
      );
    case "negotiate":
      return (
        <IconFrame>
          <path d="M5 8.5h6.5a1.5 1.5 0 0 1 1.5 1.5v3.2a1.5 1.5 0 0 1-1.5 1.5H8.2L5 17.2V8.5Z" />
          <path d="M13.2 6.2H18a1.4 1.4 0 0 1 1.4 1.4v3a1.4 1.4 0 0 1-1.4 1.4h-1.4" />
        </IconFrame>
      );
    case "brain":
      return (
        <IconFrame>
          <path d="M9.2 6.2a3 3 0 0 0-3.7 2.8c0 .7.2 1.3.6 1.8A2.6 2.6 0 0 0 5 13.4c0 1.4 1.1 2.5 2.5 2.6M14.8 6.2a3 3 0 0 1 3.7 2.8c0 .7-.2 1.3-.6 1.8A2.6 2.6 0 0 1 19 13.4c0 1.4-1.1 2.5-2.5 2.6" />
          <path d="M12 5.8c-1.3 0-2.2.9-2.4 2-.7.2-1.3.8-1.3 1.7 0 .5.2 1 .6 1.3-.4.3-.6.8-.6 1.3 0 1 .8 1.7 1.8 1.8M12 5.8c1.3 0 2.2.9 2.4 2 .7.2 1.3.8 1.3 1.7 0 .5-.2 1-.6 1.3.4.3.6.8.6 1.3 0 1-.8 1.7-1.8 1.8" />
          <path d="M12 8.2v8.6" />
        </IconFrame>
      );
    case "podium":
      return (
        <IconFrame>
          <path d="M8 20h8M9.2 16.5h5.6L16 20H8l1.2-3.5Z" />
          <circle cx="12" cy="7" r="2.2" />
          <path d="M9.2 16.2C9.2 13 12 12.2 12 12.2S14.8 13 14.8 16.2" />
        </IconFrame>
      );
    case "network":
      return (
        <IconFrame>
          <circle cx="6.2" cy="8" r="1.7" />
          <circle cx="17.8" cy="8" r="1.7" />
          <circle cx="12" cy="16.8" r="1.7" />
          <circle cx="12" cy="6.2" r="1.4" />
          <path d="M7.7 8.7 10.8 15M16.3 8.7 13.2 15M12 7.6v7.4M7.9 8h8.2" />
        </IconFrame>
      );
    case "journal":
      return (
        <IconFrame>
          <path d="M7 4.5h9.5A1.5 1.5 0 0 1 18 6v13.2H8.2A2.2 2.2 0 0 0 6 21.2" />
          <path d="M6 21.2V6.6A2.1 2.1 0 0 1 8.1 4.5" />
          <path d="M10 9h5M10 12.5h5M10 16h3.2" />
        </IconFrame>
      );
    case "scroll":
      return (
        <IconFrame>
          <path d="M7.2 6.2h9.2a1.6 1.6 0 0 1 0 3.2H8.4" />
          <path d="M8.4 9.4v7.2c0 1.4-1.3 2.2-2.4 1.6" />
          <path d="M16.4 9.4v6.2a2 2 0 0 1-2 2H8.6" />
          <path d="M10.2 12.6h4M10.2 15.2h2.6" />
        </IconFrame>
      );
    case "ethics":
      return (
        <IconFrame>
          <circle cx="12" cy="12" r="8" />
          <path d="m8.6 12.2 2.4 2.4 4.5-5" />
        </IconFrame>
      );
    case "laptop":
      return (
        <IconFrame>
          <rect x="5.5" y="6" width="13" height="9" rx="1.2" />
          <path d="M3.5 18h17l-2-3H5.5l-2 3Z" />
        </IconFrame>
      );
    case "investigate":
      return (
        <IconFrame>
          <circle cx="10.5" cy="10.5" r="4.8" />
          <path d="m14.2 14.2 5 5" />
        </IconFrame>
      );
    case "book":
      return (
        <IconFrame>
          <path d="M12 6.2c-2-1.2-4.4-1.6-6.8-1.2v13c2.4-.4 4.8 0 6.8 1.2 2-1.2 4.4-1.6 6.8-1.2v-13c-2.4-.4-4.8 0-6.8 1.2Z" />
          <path d="M12 6.2v13" />
        </IconFrame>
      );
  }
}

export function ProgramCardVisual({ program }: { program: ProgramSummary }) {
  const name = programIconName(program);

  return (
    <div
      className="relative flex h-14 items-center justify-center overflow-hidden border-b border-ink/10 bg-paper-muted"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(176,141,87,0.16),transparent_58%)]"
      />
      <div
        className="absolute inset-0 bg-[repeating-linear-gradient(-18deg,transparent_0_10px,rgba(18,38,58,0.04)_10px_11px)]"
      />
      <div className="relative">
        <ProgramSubjectIcon name={name} />
      </div>
    </div>
  );
}
