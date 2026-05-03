import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export const dynamic = "force-static";
export const metadata = {
  title: "Sanity Studio",
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
