# A complete homepage composition for review

Local preview: http://localhost:3000/preview/editorial

Initially prepared as an isolated `noindex` route and saved in GitHub. On 11 November the user requested publication: this composition now serves `/`, while the previous homepage is retained at `/preview/previous` for comparison. The `/preview/editorial` route also remains available and is excluded from indexing.

## Composition

- A larger two-line wordmark and the still business-card scene share the masthead. The short room corner is retained. The scene is not a link.
- The Epifanov headline is the leading story. The Ungaretti strip is framed more tightly in CSS, without modifying its underlying asset. Long headings use balanced wrapping.
- The Benjamin story and the original cover-review portrait form a second, smaller group. On wide screens the portrait sits beside its headline.
- Katya's quotation and the engraving form a pause between stories. The existing drawn eye remains a small, still detail; selecting an eye from a painting is deferred.
- The printer sits opposite the self-publishing headline on desktop and above it on mobile. The map headline and supplied video close the editorial section.
- The six books remain in a single vertical shelf on desktop, with no internal scrolling. Mobile uses an ordinary two/three-column shelf in page flow.

User correction during review: all negative tracking was removed across the site's CSS, including earlier previews. The new composition uses natural letter spacing and more open line spacing. The permanent typography rule is recorded in both project `AGENTS.md` files: do not tighten letters or compress text horizontally; adjust size, wrapping or available width instead.

The copy, six books, source images and destinations are reused from the current data. No body text, captions, prices, stock claims or editorial-to-book relationships have been invented. The engraving's existing link to Nosorog 19 is still a provisional example, pending Katya's confirmation.

## Behavior and implementation

Ambient CSS animations are disabled inside this preview and `CardHole` is paused. The video plays only when requested. The quote's source can be opened by mouse, touch or keyboard and closed with Escape. Both black and white themes remain available.

Resizing during review exposed a canvas `ResizeObserver` loop. The canvas now schedules backing-store updates in the next animation frame and cancels pending resize work on unmount. The preview also fixes the scene's aspect ratio independently of the canvas backing dimensions.

## Validation

- Production build and all 22 existing tests pass.
- Browser checks at 1440, 986, 768, 390 and 320 pixels, including black and white themes, source popover, keyboard focus and publication/book navigation.
- Five supplied headlines, six book links and one site header are preserved. No horizontal page overflow at the checked widths.
- The standalone TypeScript check reports four diagnostics in unchanged Cloudflare files: `cloudflare:workers`, `Fetcher` and `D1Database` types, plus an optional `env.IMAGES` binding. It reports no diagnostics in the new components. This check is not clean even though the project's production build succeeds.

Screenshots in `docs/previews/` record the desktop and mobile white-theme composition.
