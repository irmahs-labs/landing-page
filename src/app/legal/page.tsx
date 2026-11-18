import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  description: LEGAL.en.legal.lead,
  title: "Legal notice · irmahs.dev",
};

const Page = () => <LegalPage slug="legal" />;

export default Page;
