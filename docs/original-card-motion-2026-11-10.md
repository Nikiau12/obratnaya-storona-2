# Original business-card scene restored

Replaced the four-object CSS approximation with the original canvas functions from the parent business-card `src/main.js`.

The complete eight-entry objectSpecs, getObjectState and sceneMetrics are copied verbatim. Hole drawing keeps its original geometry and timing; ring ink is made visible on the black theme. Original sprite rendering and dust retain their geometry; dark sprite ink follows the host theme and the black handwritten бу cutout is inverted on black. All five source bitmap assets already live in `public/card/assets`.

The eight objects are О, stone, scissors, cyclo-person, paper, digamma, mirrored наоборот and handwritten бу. Durations, entry delays, orbital trajectories, tumble, event-horizon slowing and fading come from the original source.

The 1200×825 design viewport scales into the existing homepage block. Only the scene is drawn: no project nodes, connecting graph, project labels or room background. Per the user's latest correction, the short corner lines remain outside the canvas.

The adapter supports pause/resume, reduced-motion still frame, offscreen/tab suspension, responsive pixel density and React cleanup. Existing eye and video animations remain.

This supersedes the earlier CSS motion description in static-card-scene-2026-11-10.md. GitHub only; no deployment through Sites.

## Eyelid refinement

The eye no longer scales vertically. Upper and lower lid paths close fully over a fixed iris using an animated clip path; lashes follow the upper lid. Closing takes about 108ms, closed hold 36ms, reopening 192ms. Five blinks have staggered gaps within a 24-second cycle. The shared pause control and reduced-motion preference still apply.
