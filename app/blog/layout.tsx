import type { ReactNode } from "react";
import { SubpageShell } from "@/components/SubpageShell";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <SubpageShell>{children}</SubpageShell>;
}
