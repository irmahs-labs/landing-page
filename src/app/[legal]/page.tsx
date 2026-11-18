import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage } from "@/components/legal-page";
import { LEGAL, LEGAL_SLUGS } from "@/lib/legal";
import type { LegalSlug } from "@/lib/legal";

interface Props {
  params: Promise<{ legal: string }>;
}

const slugOf = (value: string): LegalSlug | null =>
  LEGAL_SLUGS.find((slug) => slug === value) ?? null;

/** /legal, /privacy, /terms and /cookies, built ahead; any other address is a 404 */
export const dynamicParams = false;

export const generateStaticParams = () =>
  LEGAL_SLUGS.map((legal) => ({ legal }));

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { legal } = await params;
  const slug = slugOf(legal);

  return slug
    ? {
        description: LEGAL.en[slug].lead,
        title: `${LEGAL.en[slug].title} · irmahs.dev`,
      }
    : {};
};

const Page = async ({ params }: Props) => {
  const { legal } = await params;
  const slug = slugOf(legal);

  if (!slug) {
    notFound();
  }

  return <LegalPage slug={slug} />;
};

export default Page;
