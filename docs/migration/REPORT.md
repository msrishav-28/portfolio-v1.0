# Migration checkpoint — verification blocked

## Status

**Incomplete; not production approved.** The execution environment became unavailable during the last rebuild and development-mode check. This commit preserves the current application implementation on the authorized migration branch. It does not establish that the definition of done has been met.

Reference source: `main` at `39ead5c713ab02fd3aeffa154c44aa29fbaa34ed`.
Stack base: `copilot/commit-bonsai-activity` at `0d6342c9afd9a38c3ae82e3a46ebe0620fa28532`.

Both original remote refs were checked through GitHub after the interruption and remained identical to those SHAs. Neither original branch was modified.

## 1. Implementation and mapping

| Original | Migration |
| --- | --- |
| One static document, navigation, hero, skills marquee, two experience entries, contacts, footer, back-to-top, bottom blur | Original ordered markup in `src/portfolio-body.html`; existing HTML-to-React parser pattern, React App fragment |
| Original stylesheet | Root `style.css`, retaining active rule order, nested selectors, specificity, exact values and four breakpoints |
| Static images, favicon, inactive MP3 | Same blobs and public URLs through `public/static` |
| Scroll listener | React effect with cleanup; original add/remove behavior and threshold strictly greater than 1600 |
| Original head | Existing Vite entry retains title, language, charset, viewport, favicon and Google Fonts reference; bundler script/stylesheet URLs are infrastructure |

A small Vite HTML transform emits the source document before React runs. Hydration preserves native initial fragment positioning and JavaScript-disabled content without adding a framework, server runtime, router, or production dependency. The established display-contents root remains.

The bootstrap canonicalizes inline styles for React's hydration comparison, then App refs retain their original attribute strings. **This final bootstrap adjustment was not verified before the environment interruption.**

Vite uses static/MPA routing so missing URLs, including absent `robots.txt`, return 404 instead of the SPA entry. CSS minification is disabled because the minifier changed five custom-property strings, including font-stack whitespace and `0.75rem` spelling. The source stylesheet itself is unchanged in active rules. Only comments containing inactive code and an empty CSS rule were removed.

## 2. Stack versus excluded feature code

Retained infrastructure: npm package/lockfile, React 19, TypeScript strict configuration, Vite React/Tailwind plugins, aliases, shadcn `components.json`, generic `lib/utils.ts`, functional component/effect conventions, original HTML parser, source layout, global stylesheet, explicit omission of Preflight, and public asset convention.

Excluded: `components/activity-section.tsx`, `components/ui/commit-bonsai.tsx`, contribution API and data validation, heatmap/Bonsai tabs, Activity navigation anchor, Activity mount, associated stylesheet rules/tokens, and Activity README claims. These have no counterpart in main.

No ambiguous stack/feature classification was identified. No production dependencies were added or upgraded.

## 3. Work and verification observed before interruption

The full binary-aware branch diff was generated and inspected before application edits. Discovery found 2,156 source elements, 227 CSS rule/at-rule entries, 24 original custom properties, 19 links/head references, two image elements, and four static asset files.

A complete element/CSS/asset inventory and acceptance checklist were generated in the local workspace. Repeatable Playwright tooling captured full-page images, DOM, all standard computed CSS properties plus original custom properties, boxes, network requests and console events. **Those local inventory/QA files, screenshots and raw results are not included in this recovery checkpoint and are not safely delivered. Their recovery depends on the unavailable workspace.**

The tested viewport matrix was 320, 375, 479, 480, 481, 767, 768, 769, 1024, 1025, 1026, 1280, 1439, 1440, 1441, 1920 and 2048 pixels, at 900px viewport height and DPR 1. The state matrix added 29 hover/focus/active/animation cases per engine. Separate tests covered JavaScript-disabled rendering at 375 and 1440 and visited-link rendering.

Observed results apply to the candidate immediately before the final bootstrap adjustment, **not to a fully verified final release**:

- Production build and strict TypeScript check passed without compiler/bundler warnings. The most recent bootstrap adjustment still requires a new build.
- Source AST checks passed for ordered elements, attributes, meaningful text, active CSS cascade/declarations, original asset hashes, feature exclusions and original refs.
- Every integer width from 320 through 2048 (1,729 per engine) matched original HTML/SVG-root geometry and overflow in Chromium, Firefox and WebKit after disabling CSS minification.
- Behavior checks passed in all three engines: native fragment clicks, initial deep links including unknown/malformed hashes, keyboard link metadata, scroll threshold, back-to-top, and marquee hover pause.
- Nine HTTP(S) links and two mailto links per site/engine were exercised. HTTP navigation responses were intercepted; mail-client handoff was prevented. Destination and native new-tab behavior matched. External availability and email delivery were not tested.
- All six no-JavaScript pixel comparisons passed across the three engines.
- Four asset HTTP/SHA-256 checks passed, including favicon and the inactive MP3.
- Chromium CLS was measured as zero for both versions. Firefox/WebKit did not expose the layout-shift observer entry type; those CLS measurements were recorded as unavailable.
- All 17 ordinary Chromium viewport comparisons had zero changed pixels and zero recorded element/style/layout differences, including original custom-property strings.
- The 49-case Chromium run still had four interaction capture differences: 22 pixels in 1440 focus, 22 in 1440 hover case 4, 165 in 1440 hover case 5 (including two arrow transform/box differences), and 86 in 768 hover case 5. These were not accepted or ignored. Diagnostics implicated animation/compositor and hover-transition timing; capture controls were being corrected and a complete rerun is required.
- Full Firefox/WebKit captures were generated, but their final comprehensive pixel/computed-style comparison was not completed.
- A development-mode smoke check exposed SVG inline-style hydration serialization warnings. The bootstrap adjustment in this checkpoint is intended to resolve them without suppressing warnings, but that adjustment and its regression checks remain unverified.

Earlier local Lighthouse measurements:

| Category | Original | Earlier hydrated candidate |
| --- | ---: | ---: |
| Performance | 61 | 91 |
| Accessibility | 93 | 93 |
| Best practices | 96 | 96 |
| SEO | 91 | 91 |

These are historical candidate measurements. **The checkpoint's final CSS/boot configuration has not received an isolated Lighthouse rerun.**

## 4. Decisions and source quirks

Original content, names, spelling, duplicate SVG ids, dimensions, class tokens, inactive audio behavior, system UI font stacks and absent SEO metadata were preserved. The requested Google Inter stylesheet is retained even though the active source stack uses system UI. The original invalid `:nth-child` selector and original contrast/heading/SVG accessibility quirks were retained rather than redesigned.

Required infrastructure differences are the React root, module/bundler assets, build-time markup emission/hydration, static routing option, and CSS minification setting. Public content assets reuse the exact original Git blobs.

## 5. Unfinished acceptance gates

- Recover or regenerate and deliver the complete inventory/checklist, repeatable QA scripts and raw evidence.
- Verify the latest bootstrap adjustment: build, strict typecheck, zero hydration warnings/errors in development and production.
- Complete the full three-engine pixel, DOM, computed-style, interaction and responsive rerun after the final adjustments.
- Investigate every remaining difference and retain zero tolerance for pixels and geometry.
- Run isolated Lighthouse for the final configuration.
- Rewalk and check off the complete acceptance inventory.
- Produce the final evidence archive and completed report.

The original Google Fonts request fails in the restricted environment and generated an inherited Chromium console/network failure. It was preserved because changing the head would violate source fidelity. Therefore the literal zero-failed-requests condition was not met in that environment. No local asset failure or unrelated contribution API request remained in the tested candidate.

Testing covered Linux Chromium 158, Firefox 153 and WebKit 26.5 at DPR 1. Physical devices, other operating systems/device scales and live deployment were not verified.

## 6. Run/build/test

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npm run preview
```

The target had no existing lint/formatter configuration or test suite. The isolated Playwright/PNG/Lighthouse harness and its results are currently in the unavailable workspace, so its full reproducible commands cannot be delivered as a runnable suite in this checkpoint. Completing that delivery is an outstanding requirement, not a passed gate.
