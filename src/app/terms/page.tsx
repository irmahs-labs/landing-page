import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  description: LEGAL.en.terms.lead,
  title: "Terms of use · irmahs.dev",
};

const Page = () => <LegalPage slug="terms" />;

export default Page;
