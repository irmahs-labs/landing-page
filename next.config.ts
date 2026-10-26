import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  // The built-in CV, served until one is uploaded from the page
  outputFileTracingIncludes: {
    "/cv/Irma_Houver_Sing_CV.pdf": ["./cv/*.pdf"],
  },
  poweredByHeader: false,
};

export default config;
