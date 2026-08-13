import type { ReactNode } from "react";
import { Ambience } from "@/components/Ambience";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SiteFooter } from "@/components/Footer";
import { SubpageHeader } from "@/components/SubpageHeader";

/** Shared chrome for every subpage: writing, projects, community and contact. */
export function SubpageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Ambience />
      <Cursor />
      <SmoothScroll />
      <SubpageHeader />
      <main className="np-main">{children}</main>
      <SiteFooter />
    </>
  );
}
