import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  description: LEGAL.en.cookies.lead,
  title: "Cookie policy · irmahs.dev",
};

const Page = () => <LegalPage slug="cookies" />;

export default Page;
