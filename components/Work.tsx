import { getProjects } from "@/lib/content";
import { WorkRail } from "./WorkRail";

export async function Work() {
  const projects = await getProjects();
  return <WorkRail projects={projects} />;
}
