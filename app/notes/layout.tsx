import type { ReactNode } from "react";
import { Ambience } from "@/components/Ambience";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SiteFooter } from "@/components/Footer";
import { NotesHeader } from "@/components/NotesHeader";

export default function NotesLayout({ children }: { children: ReactNode }) {
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
