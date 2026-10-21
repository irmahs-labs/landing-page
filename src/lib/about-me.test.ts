import { describe, expect, it } from "vitest";

import { CONTACT_EMAIL, SYSTEM_PROMPT } from "./about-me";

describe("SYSTEM_PROMPT", () => {
  it("gives visitors my email to contact me", () => {
    expect(CONTACT_EMAIL).toBe("irma.houversing@gmail.com");
    expect(SYSTEM_PROMPT).toContain(CONTACT_EMAIL);
  });

  it("knows my master CV, without the private app's name", () => {
    expect(SYSTEM_PROMPT).toContain(
      "Achievement: internal incident-monitoring tool"
    );
    expect(SYSTEM_PROMPT).not.toContain("alma-housila");
    // Kept for interviews and for me, not for visitors
    expect(SYSTEM_PROMPT).not.toContain("technical disagreement");
    expect(SYSTEM_PROMPT).not.toContain("Server and security");
  });

  it("uses my English job titles unless asked for the French ones", () => {
    expect(SYSTEM_PROMPT).toContain('at Sogeti "Test Automation Engineer"');
  });

  it("never holds my phone number", () => {
    // Any run of 9 or more digits, however they're spaced or dotted
    expect(SYSTEM_PROMPT).not.toMatch(/(?:\+?\d[\s.-]?){9,}/u);
  });
});
