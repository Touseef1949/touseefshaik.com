# TouseefShaik.com SEO and UX Improvement Goal

Last audited: 2026-07-19

## Goal

Improve TouseefShaik.com search visibility, topical clarity, credibility, and conversion while preserving its current editorial visual identity and excellent performance.

The finished site should make this journey obvious:

```text
Visitor intent
    |
    +-- Turn requirements into specs --> BA Assistant --> Try product
    +-- Learn agent architecture ------> Learn / Patterns --> Live examples
    +-- Study enterprise LLM evals ----> Evals --> Relevant products
    +-- Prepare for AI PO interviews --> Interview Prep --> About / Contact
```

## Baseline from the 2026-07-19 audit

- Sitemap URLs: 52
- Sitemap URLs returning HTTP 200: 52
- Homepage Lighthouse mobile: Performance 98, Accessibility 100, Best Practices 100, SEO 100
- Homepage Lighthouse desktop: Performance 99, Accessibility 100, Best Practices 100, SEO 100
- Mobile LCP: 2.2 seconds
- Mobile TBT: 0 ms
- Mobile CLS: 0.004
- Pages with two H1 elements: 25
- Pages with titles longer than the 60-character review heuristic: 24
- Meta descriptions shorter than 120 characters: 15
- Meta descriptions longer than 160 characters: 4
- Pages without JSON-LD: 50 of 52
- Known canonical mismatch: `/evals/` points to `/evals/index.html`
- Weakly linked content: `/patterns/`, `/how-it-works/ba-assistant.html`, and several deep lessons/posts

These character limits are review heuristics, not Google ranking rules. Titles should remain descriptive and concise even when they exceed a heuristic.

## Product and design decisions

- Keep the existing typography, colors, portrait, editorial layout, and dark BA Assistant section.
- Do not add decorative 3D or a WebGL background.
- Do not add a generic floating chatbot.
- Prefer lightweight CSS/SVG motion that explains the BA Assistant workflow and respects `prefers-reduced-motion`.
- Prefer a four-path visitor chooser or lightweight site search before considering a chatbot.
- If a site assistant is added later, constrain it to site content, cite its sources, disclose that it is AI, and avoid collecting confidential requirements.

## Phase 1: Technical and structural fixes

- [x] Change the `/evals/` canonical from `/evals/index.html` to `/evals/`.
- [x] Reduce each Learn and Evals page to one meaningful H1.
- [x] Fix homepage section numbering, currently `01, 02, 04, 05, 03`, or remove numbering.
- [x] Reconcile the hero's “12+ years across industries” claim with the “12+ years fintech experience” statistic. Use “product and technology experience” unless all 12+ years were specifically in fintech.
- [x] Confirm that “3 public flagships” and “3 AI agent products” are accurate and understandable; revise or link the statistics if needed.
- [x] Link `/patterns/` from relevant Learn lessons, product pages, and Resources.
- [x] Add contextual links to `/how-it-works/ba-assistant.html` from BA Assistant, requirements, user-story, and workflow content.
- [x] Add visible breadcrumbs to Learn, Evals, Blog, and app-detail pages.
- [x] Ensure Privacy and Terms are linked from the footer.

### Phase 1 acceptance criteria

- Every indexable page has exactly one principal H1.
- `/evals/` is the single canonical URL for the Evals hub.
- Homepage section order is logical.
- No homepage experience statistic is misleading or internally inconsistent.
- `/patterns/` and the BA Assistant explanation page have multiple relevant inbound links.
- All sitemap URLs still return HTTP 200.
- Unknown URLs still return HTTP 404.

## Phase 2: Trust, metadata, and structured data

- [x] Add a compact author block to substantive Blog, Learn, Evals, and Interview Prep pages.
- [x] Show author name, publication date, last-updated date, short bio, and About link where appropriate.
- [x] Add valid `Article` or `TechArticle` JSON-LD to editorial and tutorial content.
- [x] Add `BreadcrumbList` JSON-LD where visible breadcrumbs exist.
- [x] Add appropriate `SoftwareApplication` JSON-LD to live app pages only when the visible page supports every stated property.
- [x] Review the 24 longest titles for unnecessary repeated suffixes and front-load the primary topic.
- [x] Rewrite genuinely weak descriptions for clarity and click appeal without keyword stuffing.
- [x] Validate structured data with Google's Rich Results Test or Schema.org validator.
- [ ] Verify Google Search Console through HTML or DNS.
- [ ] Submit `https://touseefshaik.com/sitemap.xml` in Search Console.
- [ ] Confirm indexing status and real-user Core Web Vitals in Search Console.

### Phase 2 acceptance criteria

- Structured data matches visible page content and passes validation.
- Articles clearly identify their author and freshness.
- Important search titles are concise and distinguishable.
- Search Console reports are accessible and the sitemap is accepted.
- No unsupported, misleading, or site-wide boilerplate schema is introduced.

## Phase 3: Homepage and conversion improvements

- [x] Add a proof section directly after the BA Assistant section.
- [x] Include one anonymized input, a real report preview or screenshot, and a clear before/after outcome.
- [x] Add a testimonial, usage metric, or case study only when it is genuine and verifiable.
- [x] Separate live products from paused or unavailable experiments.
- [x] Move paused projects into an “Experiment Archive” rather than placing them alongside live flagship products.
- [x] Consider renaming the navigation label “Lab” to “Tools” or “Products” for immediate clarity.
- [x] Reduce homepage length by routing detailed material to dedicated pages.
- [x] Add a four-path visitor chooser:
  - Turn requirements into specs
  - Learn AI agent patterns
  - Study enterprise LLM evals
  - Prepare for an AI Product Owner interview
- [ ] Track clicks on the main BA Assistant CTAs and visitor-path choices.

### Phase 3 acceptance criteria

- Visitors can understand the site's primary offer within the first viewport.
- A real product proof element appears before educational and archival content.
- Live and inactive products are visually and semantically separated.
- The homepage has one dominant CTA and no competing chatbot prompt.
- Important actions can be measured without harming privacy or performance.

## Phase 4: Content and internal-link growth

- [ ] Export Search Console queries and landing-page data before selecting new topics.
- [ ] Build content clusters around demonstrated visitor demand rather than generic AI keywords.
- [x] Add contextual links among Blog, Resources, Learn, Evals, Patterns, app pages, and About.
- [x] Publish first-hand examples, templates, screenshots, experiments, and lessons learned.
- [x] Add downloadable BA/PO resources that naturally connect to BA Assistant.
- [x] Review and update older content regularly; show accurate modified dates.
- [x] Record unanswered navigation/search questions as potential content topics.

### Phase 4 acceptance criteria

- Every important page has at least three relevant internal inbound links where natural.
- New pages target distinct visitor intent and do not duplicate existing pages.
- New content demonstrates first-hand experience or original examples.
- Search impressions, qualified visits, and BA Assistant click-through are reviewed monthly.

## Explicit non-goals

- Rebuilding the site in a JavaScript framework solely for SEO.
- Adding decorative 3D elements.
- Adding a general-purpose chatbot without evidence of a navigation problem.
- Chasing a perfect score by making changes that do not improve users' experience.
- Publishing high-volume generic AI articles.
- Inventing testimonials, usage numbers, credentials, dates, or case-study outcomes.

## Verification checklist

After implementation:

```bash
cd "/Users/touseefshaik/Projects/touseefshaik.com"

# Inspect the worktree before changing or publishing anything.
git status --short
git diff --check

# Confirm important metadata and headings.
rg -n '<h1|rel="canonical"|application/ld\+json|datePublished|dateModified' \
  index.html learn evals blog apps interview-prep

# Confirm crawl directives.
curl -fsSL https://touseefshaik.com/robots.txt
curl -fsSL https://touseefshaik.com/sitemap.xml

# Run the repository's existing tests if present.
find tests -maxdepth 2 -type f -print
```

Also perform these live checks after deployment:

- Crawl every sitemap URL and confirm HTTP 200.
- Confirm a fabricated URL returns HTTP 404.
- Run Lighthouse on mobile and desktop.
- Validate desktop and 390 px mobile layouts visually.
- Validate structured data.
- Check browser console errors.
- Confirm every CTA and internal link reaches the intended destination.
- Confirm Search Console can fetch the sitemap and key pages.

## Completion definition

This goal is complete when:

1. Phase 1 technical issues are fixed.
2. Important editorial pages have accurate authorship, dates, breadcrumbs, and appropriate structured data.
3. The homepage provides product proof and a clearer content hierarchy.
4. Live products are separated from archived experiments.
5. Search Console and conversion measurement are operational.
6. All automated and live verification checks pass.
7. The deployed site preserves or improves its current performance and accessibility baseline.

## Prompt for a future Codex session

Copy and paste this prompt:

```text
Work through /Users/touseefshaik/Projects/touseefshaik.com/WEBSITE_IMPROVEMENT_GOAL.md.

Start by inspecting the repository, current git status, existing tests, and the live website. Do not assume the 2026-07-19 audit is still current; verify each relevant claim before editing. Preserve unrelated changes.

Implement the earliest incomplete phase end to end. Keep the existing editorial design. Do not add decorative 3D or a generic chatbot. Use truthful content only and do not invent testimonials, usage metrics, dates, or credentials.

Run appropriate local and live verification after the changes. Update the checkboxes and add a dated progress note to the goal file showing what was completed, what remains, and the verification results. Do not push or deploy unless I explicitly ask you to.
```

## Progress log

Add new entries below rather than rewriting prior entries.

### 2026-07-19

- Created this goal from the live SEO, design, performance, 3D, and chatbot audit.
- No implementation changes were made as part of creating this file.

### 2026-07-19 — Local implementation pass

- Completed all Phase 1 code changes and all locally actionable Phase 2 and Phase 3 work.
- Replaced ambiguous experience statistics with “product and technology” language and three clearly supported facts: three public flagship products, 12+ years of product and technology experience, and three industries served.
- Added a verified product-proof section from a live BA Assistant Standard-mode run using anonymized sample input. No testimonial, usage metric, or customer outcome was invented.
- Added visible authorship and repository-backed publication dates to 34 substantive pages, plus a 2026-07-19 modified date.
- Added structured data to 42 pages. Schema.org Validator returned zero errors and zero warnings for all 42.
- Reviewed all titles and descriptions: all 52 sitemap pages now have titles at or below 60 characters and descriptions between 120 and 160 characters.
- Added a reusable local audit test covering sitemap mappings, canonical URLs, H1 counts, metadata, authorship, breadcrumbs, schema scope, current flagship releases, homepage proof, visitor paths, and internal-link resolution. All 7 tests pass.
- Verified all 52 local sitemap URLs return HTTP 200 and a fabricated URL returns HTTP 404. The currently deployed sitemap also returns 52/52 HTTP 200 and a fabricated live URL returns HTTP 404.
- Visually checked the homepage at 1280 px desktop and 390 px mobile. No horizontal overflow was found; the mobile menu exposes all seven navigation links; browser console checks were clean.
- Remaining external work: deploy the local changes, verify and submit the sitemap in Google Search Console, inspect indexing and field Core Web Vitals, connect a production analytics provider to the new privacy-safe conversion event contract, then repeat live structured-data, link, console, responsive, and Lighthouse checks.
- No commit, push, or deployment was performed.

### 2026-07-19 — External-state audit

- Confirmed production is GitHub Pages behind Cloudflare. The deployment workflow runs from `main`; the similarly named Netlify project is not connected to the custom domain and has no Netlify Analytics instance.
- Refreshed remote Git state and preserved the newer flagship release links that were already present on production.
- Created pending Google Search Console properties for the domain and `https://touseefshaik.com/` URL prefix using the authenticated site-owner account.
- Added the exact Search Console HTML verification tag to the homepage. Verification and sitemap submission can complete after the tag is deployed.
- Avoided the alternative Cloudflare OAuth verification flow because it would grant Google new DNS-account permissions.
- Added `CONTENT_OPPORTUNITIES.md` to record unanswered visitor questions without misrepresenting them as Search Console demand. Topic selection remains pending until verified query data exists.
- Confirmed Netlify Analytics is not enabled and the Cloudflare account is not authenticated in the in-app browser. Production click collection therefore still requires an authorized analytics-provider setup.
- A fresh PageSpeed Insights request was attempted, but the public API quota was exhausted. Post-deployment Lighthouse remains required.
