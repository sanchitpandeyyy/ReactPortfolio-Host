import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

/** Publication date. */
export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="1.5" y="3" width="13" height="11.5" rx="2" />
      <path d="M1.5 6.5h13M5 1.5v3M11 1.5v3" />
    </svg>
  );
}

/** Reading time. */
export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.5V8l2.5 1.5" />
    </svg>
  );
}

/** Last edited. */
export function PencilIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M11.2 1.8a1.8 1.8 0 0 1 2.6 2.6L5.5 12.7l-3.6 1 1-3.6 8.3-8.3Z" />
      <path d="M10 3 13 6" />
    </svg>
  );
}

/** Links away from this site. */
export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 1.5h4.5V6" />
      <path d="M14.5 1.5 8 8" />
      <path d="M12.5 9.5V13a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 13V5A1.5 1.5 0 0 1 3 3.5h3.5" />
    </svg>
  );
}

/** Email address. */
export function MailIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="1.5" y="3" width="13" height="10" rx="2" />
      <path d="m2 4.5 6 4.5 6-4.5" />
    </svg>
  );
}