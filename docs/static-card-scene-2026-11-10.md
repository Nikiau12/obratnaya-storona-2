# Static business-card composition on the homepage

- Adapted the hole geometry from the parent business-card `src/main.js`: flat ellipse, soft shadow and four floor-plane rings.
- Reused the original stone, scissors, figure and paper cutouts already tracked under `public/card/assets`.
- No labels, lettering, new copy, animation, timers or canvas loop. Existing link to the business card remains functional.
- After review, removed the full-height editorial divider and the page-wide diagonal. Corner lines are confined to the small scene around the hole.
- Both themes and 390px viewport reviewed in the browser; no horizontal page overflow.
- This is a static adaptation for homepage review, not a frame-exact capture of the animated card. The business-card source itself is unchanged.
- GitHub only; no public hosting deployment.

## Motion pass approved after static review

- Four original cutouts now converge on the hole, shrink and disappear on staggered 18-second cycles. The ring group breathes slightly over 9 seconds.
- The eye blinks briefly every 8.7 seconds. Video preview tilts subtly once per 13 seconds, stops moving during playback or interaction, and never autoplays.
- Engraving responds to hover or keyboard focus. Headlines, books and room lines remain stationary.
- A single pause/resume button freezes ambient animations; reduced-motion preference removes animations and restores the original static objects.
- No separate audio supplied or fabricated. The existing video has no audio track.
