"use client";

import { useLayoutEffect } from "react";

import {
  chooseLanguage,
  LANGUAGE_NAMES,
  LANGUAGES,
  restoreLanguage,
  useCopy,
  useLanguage,
} from "@/lib/language";

const COPY = {
  en: { label: "Language" },
  fr: { label: "Langue" },
};

/**
 * The header's EN/FR pill, beside the theme toggle: the page's language
 * pressed, the other one a press away. The profile's language pills switch
 * the same choice.
 */
export const LanguageToggle = () => {
  const language = useLanguage();
  const t = useCopy(COPY);

  useLayoutEffect(restoreLanguage, []);

  return (
    <fieldset aria-label={t.label} className="lang-toggle">
      {LANGUAGES.map((option) => (
        <button
          aria-label={LANGUAGE_NAMES[option]}
          aria-pressed={option === language}
          className="lang-toggle__option"
          key={option}
          lang={option}
          onClick={() => chooseLanguage(option)}
          title={LANGUAGE_NAMES[option]}
          type="button"
        >
          {option.toUpperCase()}
        </button>
      ))}
    </fieldset>
  );
};
