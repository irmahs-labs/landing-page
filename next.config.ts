import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  // The built-in CVs, each served until one is uploaded from the page
  outputFileTracingIncludes: {
    "/cv/Irma_Houver_Sing_CV.pdf": ["./cv/Irma_Houver_Sing_CV.pdf"],
    "/cv/Irma_Houver_Sing_CV_FR.pdf": ["./cv/Irma_Houver_Sing_CV_FR.pdf"],
  },
  poweredByHeader: false,
};

export default config;
