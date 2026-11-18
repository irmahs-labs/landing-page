"use client";

import Link from "next/link";
import { Fragment } from "react";
import type { ReactNode } from "react";

import { useCopy } from "@/lib/language";
import { LEGAL, UPDATED } from "@/lib/legal";
import type { Block, LegalSlug } from "@/lib/legal";

import { Footer } from "./footer";
import { Header } from "./header";

const COPY = {
  en: {
    back: "← back to irmahs.dev",
    updated: "Last updated",
  },
  fr: {
    back: "← retour à irmahs.dev",
    updated: "Dernière mise à jour",
  },
};

/** A list of items, as opposed to one paragraph */
const isList = (block: Block): block is readonly string[] =>
  Array.isArray(block);

/** A link written `[text](url)`: where it starts and ends, its text and its address */
const nextLink = (text: string, from: number) => {
  const open = text.indexOf("[", from);
  const middle = open === -1 ? -1 : text.indexOf("](", open);
  const close = middle === -1 ? -1 : text.indexOf(")", middle);

  return close === -1
    ? null
    : {
        end: close + 1,
        href: text.slice(middle + 2, close),
        label: text.slice(open + 1, middle),
        start: open,
      };
};

/** A paragraph's text, with its `[text](url)` links made links */
const withLinks = (text: string): ReactNode[] => {
  const parts: ReactNode[] = [];
  let last = 0;

  for (let link = nextLink(text, 0); link; link = nextLink(text, link.end)) {
    parts.push(
      text.slice(last, link.start),
      link.href.startsWith("/") ? (
        <Link key={link.start} href={link.href}>
          {link.label}
        </Link>
      ) : (
        <a key={link.start} href={link.href} rel="noreferrer" target="_blank">
          {link.label}
        </a>
      )
    );
    last = link.end;
  }

  parts.push(text.slice(last));

  return parts;
};

/**
 * One of the legal pages every irmahs.dev app links to, in the visitor's
 * language: plain, readable text in a panel. The footer under it links the
 * other legal pages.
 */
export const LegalPage = ({ slug }: { slug: LegalSlug }) => {
  const t = useCopy(COPY);
  const page = useCopy(LEGAL)[slug];

  return (
    <div className="page">
      <Header />
      <main className="legal">
        <Link className="legal__back" href="/">
          {t.back}
        </Link>
        <article className="legal__panel">
          <h2 className="legal__title">{page.title}</h2>
          <p className="legal__updated">
            {t.updated}: <time dateTime={UPDATED}>{UPDATED}</time>
          </p>
          <p className="legal__lead">{page.lead}</p>
          {page.sections.map((section) => (
            <section key={section.title}>
              <h3>{section.title}</h3>
              {section.blocks.map((block, i) => (
                <Fragment key={i}>
                  {isList(block) ? (
                    <ul>
                      {block.map((item) => (
                        <li key={item}>{withLinks(item)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{withLinks(block)}</p>
                  )}
                </Fragment>
              ))}
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </div>
  );
};
