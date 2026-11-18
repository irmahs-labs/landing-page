import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  description: LEGAL.en.privacy.lead,
  title: "Privacy policy · irmahs.dev",
};

const Page = () => <LegalPage slug="privacy" />;

export default Page;
