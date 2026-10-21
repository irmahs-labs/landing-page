import { describe, expect, it } from "vitest";

import { CONTACT_EMAIL, SYSTEM_PROMPT } from "./about-me";

describe("SYSTEM_PROMPT", () => {
  it("gives visitors my email to contact me", () => {
    expect(CONTACT_EMAIL).toBe("irma.houversing@gmail.com");
    expect(SYSTEM_PROMPT).toContain(CONTACT_EMAIL);
  });

  it("never holds my phone number", () => {
    // Any run of 9 or more digits, however they're spaced or dotted
    expect(SYSTEM_PROMPT).not.toMatch(/(?:\+?\d[\s.-]?){9,}/u);
  });
});
