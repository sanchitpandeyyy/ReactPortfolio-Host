import type { ReactNode } from "react";
import { Ambience } from "@/components/Ambience";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SiteFooter } from "@/components/Footer";
import { NotesHeader } from "@/components/NotesHeader";

/** Same chrome as the notes pages — used by contact, project, and community pages. */
export function SubpageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Ambience />
      <Cursor />
      <SmoothScroll />
      <NotesHeader />
      <main className="np-main">{children}</main>
      <SiteFooter />
    </>
  );
}
