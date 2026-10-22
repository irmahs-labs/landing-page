/**
 * My master CV, everything the chat bot can say about my experience, projects,
 * skills and studies. Kept from Irma_Houver_Sing_Master_CV_EN.md without my
 * phone number or the private app's name; update both together.
 */
export const MASTER_CV = `
# Master CV: Irma Houver Sing

irma.houversing@gmail.com | Courbevoie (92), France
Website: https://irmahs.dev | Portfolio: https://irmahs.github.io/Portfolio/ | LinkedIn: https://www.linkedin.com/in/irma-hs/ | GitHub: https://github.com/irmahs

Job titles: she presents herself as Software Engineer for Euro Informations and La Banque Postale, and Test Automation Engineer for Sogeti. Her French contract titles (Analyste Développeur, Concepteur Développeur, Consultant Testeur) are given only when someone asks for them.

---

## PROFESSIONAL EXPERIENCE

## Euro Informations (Crédit Mutuel Group), via EFOR | Analyste Développeur, CV title: Software Engineer (Strasbourg, August 2025 to April 2026)

**Context**: EFOR consultant on assignment at Euro Informations, the IT division of the Crédit Mutuel group. Hired for C# on Devbooster, a proprietary internal framework based on .NET. Joined a team dedicated to a healthcare application that handles care reimbursement exchanges through FSE (Feuilles de Soins Électroniques, electronic care claims) between mandatory health insurers, supplementary health insurers and healthcare professionals.

**Products worked on**: several products of the ActivFSE range, including WebActivFSE (online portal where healthcare professionals track their FSE transmissions, rejections and payments), ProActivFSE and ActivFSE. These tools are used by the 66,000+ healthcare professionals who are Crédit Mutuel clients. Fixed many production bugs across these products.

**Tools and tech**: C#, Devbooster (internal framework, .NET), C, encryption certificates, AI tools (Claude Code, ChatGPT, Copilot)

### Achievement: faster, more reliable switching of healthcare payment terminal providers

- **Situation**: when a healthcare professional changes healthcare payment terminal provider, for example from Sephira to Saficard, the information must be updated both in the database and in internal applications. The process required coordinating 4 stakeholders (technical team, field engineer who swaps the terminal, back-office team in contact with the healthcare professional) and took about a week.
- **Task**: shorten this delay and make the information update more reliable.
- **Action**: designed a simplified process where the back-office validates directly in the application, which triggers the actual switch of the information within one day once the "go" is given.
- **Result**: processing time cut from one week to 2-3 business days, the remaining delay depending mostly on the healthcare professional's availability for the field visit.

### Achievement: internal incident-monitoring tool built from scratch

- **Situation**: the team needed visibility on incidents blocking exchanges between Euro Informations and an insurer, or between Euro Informations and a healthcare professional.
- **Task**: learn the internal framework while meeting this need.
- **Action**: designed and built an incident-monitoring tool in C# from scratch, used as a ramp-up project on the framework.
- **Result**: working incident-tracking tool, and command of the company's internal framework.

### Achievement: maintaining and evolving C modules with no prior experience of the language

- **Situation**: took over many legacy C modules, each handling a different step of the FSE exchange chain, with little documentation and in a language I had not used before.
- **Task**: ramp up quickly in C, handle faulty documents sent by payment terminals (badly encrypted, badly formatted, failed transmissions) and make the modules more reliable.
- **Action**: accelerated self-training in C using AI; took ownership of many modules; added automatic notifications when a module crashed, for case-by-case handling; thoroughly updated the technical documentation.
- **Result**: more reliable and better documented modules, proactive incident detection, and a concrete example of using AI to speed up learning.

### Achievement: diagnosing and securing encryption certificates

- **Situation**: in charge of updating the certificates used to encrypt exchanges; a malfunction occurred in production.
- **Task**: find the root cause and make the process durably safer.
- **Action**: designed a method to identify the certificate actually used in production; documented the issues encountered for future reference.
- **Result**: incident resolved and process documented to anticipate similar cases.

---

## La Banque Postale | Concepteur Développeur (apprenticeship), CV title: Software Engineer (Gradignan, September 2022 to October 2024)

**Context**: 2-year apprenticeship on La Banque Postale's mobile app (10M+ customers), in a large-scale Agile organization structured in release trains (SAFe, Scaled Agile Framework). Team of 6 to 7 developers with a tech lead, a Scrum Master and a dedicated agile tester.
- Year 1: development on FWAD, an internal framework based on AngularJS, on the legacy mobile app
- Year 2: development in React Native / TypeScript on the new mobile app, with the team's internal framework

**Practices and tools**: led sprint retrospectives; build and deployment through CI/CD (Continuous Integration and Continuous Deployment) pipelines on GitHub; testing on iOS and Android; Jira; Agile / Scrum at scale.

### Achievement: transfer history and standing orders (year 2, React Native)

- **Situation**: the transfer history and standing order flow lacked usability and had no search feature.
- **Task**: build the standing orders display, make the flow more intuitive and implement search.
- **Action**: built the standing orders display; redesigned the flow's screens with the Product Owner; designed and built search across transfer history and standing orders.
- **Result**: more intuitive flow and search feature shipped.

### Achievement: display bug on international transfers

- **Situation**: spotted a bug on incoming transfers from foreign accounts: the origin country text did not fit the base design.
- **Task**: get the display fixed, even though the issue was partly a design problem.
- **Action**: took the initiative to raise it with the Product Owner and the front-end developer to rework the design together. Same proactive approach on other team-specific designs: worked with him, tested, then gave the go / no-go before release.
- **Result**: display fixed and validated, and a recognized role as a bridge between development, product and design.

### Achievement: accessibility referent (RGAA), years 1 and 2

- **Situation**: about 20% of the app's users relied on accessibility features (enlarged text, VoiceOver / TalkBack screen readers, etc.), internal figure. Additional context: La Banque Postale counts 1.1 million customers in its banking accessibility program (launched in September 2021).
- **Task**: act as the team's accessibility referent and ensure RGAA (Référentiel Général d'Amélioration de l'Accessibilité, the French accessibility standard) compliance of the features developed.
- **Action**: fixed many accessibility issues; tested systematically with VoiceOver (iOS) and TalkBack (Android); took charge of every accessibility topic in the team.
- **Result**: a more accessible app for a large share of users.

---

## Sogeti (Capgemini Group) | Consultant Testeur, CV title: Test Automation Engineer, internship (Pessac, April 2022 to June 2022)

Actual job title: Consultant Testeur (Test Consultant).

**Context**: role at an IT services company (ESN, Entreprise de Services du Numérique), several clients handled in parallel:
- **Seb** (home appliances): IoT (Internet of Things) testing, apps paired with connected products
- **Leclerc Drive**: offshore development team in Morocco
- **FDJ (Française des Jeux, the French national lottery)**: Euromillions project

Agile team with a daily stand-up every morning to split test campaigns client by client. Worked in English with offshore development teams (Morocco, India).

**Daily work**: designing and running unit tests and test campaigns (several hundred tests a day); IoT testing; writing test reports; test automation with Selenium and Appium.

**Tools**: Jira, Squash (test campaign management), Confluence, Microsoft Teams, Selenium, Appium

### Achievement: automated date calculation on the Euromillions project (FDJ)

- **Situation**: some bet types are not available depending on the draw day (Monday to Sunday, months of 28 to 31 days).
- **Task**: ensure reliable test campaigns on these cases without slowing down their preparation.
- **Action**: the team edited date variables by hand for each test case; designed a mechanism that automatically calculates the date and weekday, handling months of varying length.
- **Result**: no more manual variable edits, more reliable campaigns that are faster to prepare.

---

## PERSONAL PROJECTS

### Alsace Arena Tournament App (2026) | app: https://alsace-arena-spike-tournament.vercel.app | venue: https://alsacearena.com | repo irmahs/alsace-arena-spike-tournament
**Stack**: Next.js, React, Tailwind CSS, Supabase (PostgreSQL and authentication), Claude API (Anthropic SDK), Vercel, GitHub Actions

- Score keeping web app for the monthly Valorant tournaments ("Spikes") of Alsace Arena, the first dedicated esports venue in Alsace (Strasbourg, Colmar), automating score tracking previously done by hand
- Leaderboard, player, match stats and admin pages; Supabase sessions kept in cookies so the Next.js server knows who is signed in
- **LLM integration**: the Claude API reads a screenshot of the in-game scoreboard and turns it into stats, instead of typing them in by hand
- Versioned database migrations deployed automatically through GitHub Actions
- Planned evolution: move off Vercel to irmahs.dev, and turn it into a platform any Valorant organization can use (per-organization color and logo, configurable stats and bonuses, data isolated between organizations)

### Personal App Hub: Irma HS Labs (2026) | https://irmahs.dev | https://github.com/irmahs-labs

My personal lab: a GitHub organization (9 public repos and 1 private) holding web apps, all hosted on irmahs.dev with one app per subdomain, plus the platform pieces they share. Set up from scratch from October 2 to 5, 2026, and extended continuously since. Built with substantial help from Claude Code. Every procedure (first deployment, new app, private app, migration, rename, removal, tests, chat bot) is documented in my Obsidian notes.

**Stack**: TypeScript, React 19, Next.js 16, Vite, Hono, zod, PostgreSQL 17, dbmate, Docker, Docker Compose, Caddy, Hetzner server, Cloudflare, GitHub Actions, OpenRouter (GPT-4o)

#### Apps

- **irmahs.dev** (landing-page repo): retro-desktop home page in Next.js 16: draggable windows, weather (Open-Meteo), time and an animated sky for Paris or Phnom Penh, now playing through the Spotify API (with a 10-second cache), profile, socials and downloadable CV, sign-in through the SSO, a resizable apps window, Tokkae (a pixel art gecko I drew, with its own behaviors, an in-app changelog and Coq the rooster as an optional playmate), respects reduced-motion settings. The Spotify and OpenRouter keys stay on the server (server-only fails the build if they ever reach the browser). Vitest and React Testing Library tests, plus a smoke test of the built server in CI.
- **"Ask me" chat bot on irmahs.dev** (LLM integration, October 20, 2026): visitors ask questions about my background and an LLM answers from my CV.
  - Server-side Next.js route /api/chat calling OpenRouter (openai/gpt-4o by default, switchable through an environment variable), in OpenAI's chat completions format
  - System prompt built from my profile (experience, projects, skills, apps and socials, the last two generated automatically from the page's app list) with rules: answer only from the profile, in the visitor's language, in 2 to 4 sentences, decline off-topic questions and private details, ignore any prompt injection attempt
  - Safeguards: strict validation of the conversation before any call (400), 8 questions per minute per visitor (429), only the last 12 messages sent, max_tokens capped at 400, a spending limit on the key, Cache-Control: no-store on answers, graceful fallback when OpenRouter is down (502)
  - ask_me.exe window: greeting, three suggested questions, input capped at 500 characters, clear error messages
  - Tests for the route, validation, rate limit and component, with fetch faked so tests never call OpenRouter; the CI smoke test checks that an empty conversation is refused
- **What's in my pantry?** (pantry-spinner repo, pantry-spinner.irmahs.dev): slot-machine meal planner: three reels (protein, vegetables, starch) drawn from actual pantry stock, weighted so items closest to expiring come up first. React 19 + Vite, Hono API validated with zod, PostgreSQL 17, server bundled with esbuild. All vocabulary (categories, cooking methods, diet rules) lives in the database; per-user data isolation enforced down to the foreign keys; transactional diff-based saves; CSRF (Cross-Site Request Forgery) protection through origin checks; guest mode with a demo pantry; Vitest tests on the reel engine and a dedicated CI workflow for migrations. Migrated from Supabase / Vercel.
- **Album Cover Maker** (album-cover-maker repo, album-cover-maker.irmahs.dev): turns a photo into an album cover (3000 x 3000 PNG) and a music player mock-up (1080 x 1440), drawn with Canvas 2D using the same code for preview and export, with color suggestions drawn from the photo; self-hosted fonts (Fontsource) and photos that never leave the device. Vitest unit and component tests (including a fake canvas that records every draw call) and Playwright end-to-end tests in CI.
- **Mini Games** (minigames repo, minigames.irmahs.dev, October 15, 2026): browser games, each loaded only when opened. A customizable Wheel of Fortune (2 to 16 slices, up to 8 named wheels) and Super Tic-Tac-Toe (nine planets, ported from my old Electron game). Games saved in localStorage and read back through zod (a damaged save falls back to defaults instead of breaking the page); no backend; static site served by a Caddy container running as an unprivileged user; game rules written as pure functions and tested with Vitest.
- **Private app** (private repo, live since October 19, 2026): a personal website only two invited Google accounts can open. Next.js 16 and Postgres 17; content written as Markdown and YAML files validated with zod, reloaded into the database in one transaction on every start (Next.js instrumentation); a new piece of content is a pull request; tests load the real content, so an invalid file fails the PR and names the faulty file and field.

#### Shared platform

- **proxy**: shared Caddy server in front of all 6 sites: automatic HTTPS (Let's Encrypt), security headers and compression, routes each subdomain to its container over the shared Docker network without any app opening a port, reloads without downtime, common security.txt; Cloudflare-proxied DNS in Full (strict) mode.
- **auth**: Google SSO (Single Sign-On) for every app, with Better Auth, Hono and its own Postgres database: session cookie shared across *.irmahs.dev, redirects limited to irmahs.dev and its subdomains, no passwords stored, no app ever sees the Google secret, Cute Matcha sign-in and "This app is private" pages. Access control for private apps: Caddy calls the /api/access/:app endpoint before each request (forward auth), only lets in the Google emails listed for that app in the APP_ACCESS secret, and passes the user's ID and email to the app in headers; an app missing from the list, or an unavailable service, locks everyone out (fails closed). Tests on who can enter a private app.
- **template** (October 20, 2026): GitHub template repo every new repo starts from: shared rules (CLAUDE.md: branches, pull requests, checks before pushing, then the app's own description and design), Claude Code hooks, Ultracite, CI, CodeQL, Dependabot, a deploy workflow, branch rules (ruleset.json to import) and a small placeholder Node app with a Dockerfile and compose.yaml.
- **workflows** (October 20, 2026): reusable GitHub Actions workflows called by every repo, so one change reaches all repos on their next run. app-ci.yml runs one job per check (lint and format, type-check, tests, build, compose validation and Docker build); each repo adds its own jobs (Playwright, migrations, smoke test) and ends with a checks job, the only one branch rules require, which fails if any job failed, was cancelled or skipped. codeql.yml for code security scanning.
- **.github** (October 20, 2026): the organization's public profile page, listing the apps.

#### Timeline

| Date (2026) | Milestone |
|---|---|
| October 2 | First deployment: a static page on irmahs.dev, proving the whole chain of DNS, server, certificate and GitHub Actions |
| October 3 | Landing page rewritten in Next.js; CI on every PR; Caddy moved into a shared proxy |
| October 3 to 5 | Single sign-on service; meal planner migrated off Vercel + Supabase |
| October 5 | main protection rules on every repo |
| October 9 and 10 | Sleepy Spinner renamed What's in my pantry? without data loss |
| October 11 | Album Cover Maker; testing strategy (Vitest, Testing Library, Playwright) |
| October 15 | Mini Games; Light and Dark Matcha themes in every app |
| October 18 and 19 | Private apps (forward auth, APP_ACCESS, deploy keys); first private app live |
| October 20 | template, workflows and .github; Ultracite 8 now blocks merging; LLM chat bot on irmahs.dev |

#### Technical milestones

- **Shared proxy cutover**: Caddy, first bundled with the landing page, moved into its own repo; a cutover script created the shared Docker network and copied the existing certificates, for only a few seconds of downtime
- **Migration from Vercel + Supabase to my server** (the meal planner): Supabase Postgres replaced by Postgres 17 and dbmate, Row Level Security replaced by a Hono API that scopes every query to the signed-in account, email magic links replaced by Google sign-in; one pull request per step, with the Vercel version kept live until the last one
- **Rename without data loss**: display name, subdomain and repo renamed, internal names (server folder, volume and database) deliberately kept
- **Private apps**: access restricted through Caddy forward auth and the auth service, code in a private repo; GitHub Free plan limits accepted (no CodeQL or branch rules on a private repo, so the PR-only rule is carried by its CLAUDE.md)
- **Standardized repos**: shared template and workflows so every repo has the same rules, the same CI and the same security checks from its first commit
- **Lessons learned**: percent-encode passwords in Postgres URLs, never rename a server folder (it holds the data volume), mount the Caddy folder rather than the single file, never require a check that only runs on some paths
- **Next steps** for the chat bot: streamed answers, a cheaper model, anonymous question logging, reuse on other apps

#### Tests by repo

| Repo | Unit and component | End-to-end | Other CI checks |
|---|---|---|---|
| landing-page | Yes (including the chat bot) | No | Smoke test of the built server (page, image, CV, /api/now-playing, /api/chat) |
| album-cover-maker | Yes | Playwright | Report uploaded on failure |
| pantry-spinner | Reel engine | No | Database workflow (migrations, fixtures) |
| minigames | Game rules | No | None |
| auth | Private app access | No | Migrations, Better Auth schema |
| private app | Loads the real content | No | Migrations, smoke test with Postgres |

#### How I work on it

- Shared "Cute Matcha" design system: every app in Light Matcha and Dark Matcha, colors as role tokens (ground, panel, text, accent...) rather than hex codes, theme applied before first paint and a sun / moon toggle in the header
- Every change goes through a pull request that I merge, with branches and commits named by type (feat/, fix/, chore/, docs/, refactor/); required lint, type-check, tests and Docker build; main protected by branch rules
- Security and dependencies: CodeQL on every PR, every push and weekly; monthly Dependabot (minor updates grouped, majors separate, Docker images deliberately excluded)
- Continuous deployment: every merge to main deploys over SSH to the server (docker compose up --build --wait, which waits for the healthcheck so a broken app fails the deploy), with organization-level secrets
- Versioned database migrations (dbmate), checked in CI (apply, rollback, schema consistency)
- Shared changes go into template or workflows first, then roll out as one pull request per repo
- Code quality: strict TypeScript, Ultracite 8 (oxlint, oxfmt, anti-slop rules) blocking merges, a Claude Code hook that fixes, checks and type-checks every edited file; the same npm scripts in every repo (check, typecheck, test, build, start)

### Other personal projects (irmahs account)

- **Portfolio** (https://irmahs.github.io/Portfolio/): portfolio styled as an iPhone app, in HTML, CSS and JavaScript, hosted on GitHub Pages: mobile or web view, remembered light or dark theme, English / French toggle
- **Learning projects (2025, not online)**:
  - WellnessWitch: mix ingredients into wellness shots; ASP.NET Core (Razor Pages), C#, JSON data
  - FrigoHS: a fridge app; React (axios) and a Spring Boot REST API (Spring Data JPA, Lombok, springdoc OpenAPI docs, Maven), MySQL 8 with Docker Compose
  - Lunar-Calendar: a lunar calendar; Ember.js and Ruby on Rails
  - Super Tic-Tac-Toe (planet-themed) and Pokemon Sleep Help App (recipe helper, discontinued): Electron desktop apps; Super Tic-Tac-Toe now also lives in Mini Games
- **Algorithms**: NeetCode / LeetCode practice in Python (arrays and hashing: Two Sum, Group Anagrams, Top K Frequent Elements, Longest Consecutive Sequence, Valid Sudoku, Product of Array Except Self, Encode and Decode Strings, etc.), with written notes for each problem

### Events and continuous learning

- AI Engineer Paris 2026 and AI Builders meetups, with notes on the talks: Mistral AI (Lélio Renard Lavaud, Han Heloir, Joffrey Thomas), Algolia, Langfuse, AuthZed, Neo4j, SGLang, Daytona, Dust, tinkerer.club; personal AI glossary

---

## VOLUNTEERING AND COMMUNITY

### Alsace Arena (esports venue), volunteer
- Score keeping for the monthly "Spikes" Valorant tournaments
- Balancing teams for competitive and fair matches
- Playing in the tournaments
- Building the score keeping app (see Projects)

### Junior MIAGE Bordeaux, Communications team (2021 to 2024)
- Organized a professional photo shoot so every member had a professional headshot
- Designed and printed end-of-year greeting cards sent to past clients to maintain the relationship
- Created social media content to bring the community together and share advice
- Designed a mascot (ultimately not used)
- Connected with other Junior MIAGE chapters across France

### Association MIAGE Bordeaux (AMB), volunteer (2021 to 2024)
- Helped organize events and manage inventory
- Logistics and hands-on setup during events
- Cooked for events of 100+ people

---

## EDUCATION

### Master's in Business Informatics (MIAGE, Méthodes Informatiques Appliquées à la Gestion des Entreprises), Université de Bordeaux (September 2022 to August 2024)

Program combining software development, data management, machine learning, eco-design and project leadership.

**Skills covered**: OOP (Object-Oriented Programming: Java, Python, C++), web and mobile development (HTML, CSS, JavaScript, Android), databases and data warehousing (SQL, NoSQL), Machine Learning and Big Data (Python), software engineering, systems and networks, BI (Business Intelligence) and data visualization, digital eco-design, IT governance, data ethics and legal aspects, Agile project management, professional communication and negotiation in English.

**Projects and internships**: collaborative software projects; apprenticeship at La Banque Postale (2 years).

### Bachelor's in Business Informatics (MIAGE), Université de Bordeaux (September 2021 to August 2022)

Program combining computer science and business management.

**Skills covered**: full-stack development (Java, Spring, Angular), business analysis and information systems, databases (SQL, PL/SQL, Oracle), project management (Agile, Scrum, Gantt, BPMN), software engineering (UML, design patterns), IT governance, ERP, BI.

**Projects**: team-built business web application; case studies and business modeling; workshops with partner companies.

### DUT in Computer Science (Diplôme Universitaire de Technologie, a 2-year technical degree), Université de Lorraine, Metz (September 2019 to August 2021)

**Skills covered**: OOP (Java, Python, C++), web and mobile development (HTML, CSS, JS, Android), databases (SQL, NoSQL), software engineering (Agile, UML, Git), system and network administration (Linux), REST APIs, security, virtualization.

**Projects and internships**: collaborative software projects; final internship; Erasmus+ exchange.

### Erasmus+ exchange, VIA University College, Horsens, Denmark (February to June 2021)

Bachelor's degree, ICT (Information and Communication Technology): mobile and web development, agile teamwork, cross-cultural collaboration.

- Solo-built Android travel app (calendar, to-do list, photos)
- Team-built vegan fitness app with Flutter
- Interactive website

---

## TECHNICAL SKILLS

### Full list (to pick from depending on the offer)
- **Languages**: TypeScript, JavaScript, C#, Java, C, Python, C++, SQL / PL-SQL, HTML/CSS, Dart (Flutter, academic)
- **Frameworks and libraries**: React, React Native, Next.js, Vite, Tailwind CSS, Angular, AngularJS, .NET, ASP.NET Core, Devbooster (internal), Hono, Electron, Spring / Spring Boot, Flutter, native Android, Selenium, Appium; exposure: Ember.js, Ruby on Rails
- **Databases**: PostgreSQL, Supabase, dbmate (migrations), localStorage validated with zod, Oracle, SQL Server, MySQL, MongoDB, Neo4j
- **Infrastructure and deployment**: Docker, Docker Compose, CI/CD (GitHub Actions), Caddy (reverse proxy), Let's Encrypt, Hetzner Linux server, SSH, Cloudflare, Vercel, GitHub Pages
- **Testing and quality**: unit tests, test campaigns, automation (Selenium, Appium), Vitest, React Testing Library, Playwright, IoT testing, accessibility testing (VoiceOver, TalkBack), test reports
- **Accessibility**: RGAA, responsive design, accessibility referent
- **Tools and methods**: Git, Jira, Confluence, Squash, Microsoft Teams, Agile / Scrum / SAFe, retrospectives, UML, design patterns, BPMN, REST APIs
- **Systems and security**: Linux, networks, virtualization, encryption certificates
- **AI**: AI-assisted development (Claude Code, GitHub Copilot, ChatGPT); LLM (Large Language Model) integration: "ask me" chat bot on irmahs.dev (OpenRouter, GPT-4o, system prompt, rate limiting, prompt injection defense) and the Claude API reading scoreboard screenshots in the Alsace Arena app
- **Data and BI (academic)**: Machine Learning, Big Data, BI, data visualization, data warehousing

**Demonstrated soft skills**: adaptability (stack, language, team size, country), leadership (leading retrospectives), initiative, technical argumentation, multi-stakeholder coordination, cross-cultural communication (offshore teams in Morocco and India), fast self-learning.

## LANGUAGES

- French: bilingual (C2)
- English: bilingual (C2)
- Khmer: native
`.trim();
