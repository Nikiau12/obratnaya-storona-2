# Second stage: quotations, objects and video

## Implemented

- Client quote: «Мы уже завели наши часы».
- Exact attribution: «Икозамерон. Джакомо Казанова, «Носорог» №19»; internal destination `/books/nosorog-19`.
- Source confirmation: https://nosorog.media/tproduct/418921535-569446907952-nosorog-19
- №19 added to the catalog with original cover, year 2024 and 208 pages. No price or purchase claim.
- Client-supplied video: https://t.me/nosorogmagazine/3108. The post identifies «Игуана», Анна-Мария Ортезе, and the painting «Костюм» by Николай Алексеев.
- Book metadata and cover: https://nosorog.media/tproduct/418921535-692505374082-iguana
- `public/katya/iguana-film.mp4`: original 1280×908 clip, 4.868 seconds, no audio stream (verified with ffprobe). No autoplay. Uses text controls, no arrow/play-triangle icons. `iguana-film-poster.jpg` is the supplied post's thumbnail.
- The video links to `/books/iguana`; both added editions are searchable in the full eight-item catalog. The main shelf remains the original six.
- `public/katya/engraving.png`: cleaned cutout, no new caption. Source edition unknown; the user also cannot identify it. Temporary destination is the general `/books` catalog, not an invented book association. Confirm the intended edition with Katya later.
- Quote disclosure supports hover, focus, touch activation, Escape, focus leaving, and tapping outside.

## Image preparation

Built-in image_gen, background-extraction. User-supplied engraving used as edit target. Prompt:

> Use case: background-extraction. Prepare this supplied antique engraving for a literary website. Extract the spiky spherical object together with its complete rectangular pedestal as one cutout. Remove the outer picture frame, all surrounding background hatch marks, paper yellowing and stains. Preserve the original black engraved strokes, irregular silhouette, proportions, spikes and pedestal details. Make the paper inside the object clean white; actual transparent background outside the object. Do not invent details, text, labels, arrows or additional objects. Tight framing with small clear margins.

## Deferred

- A separate audio recording has not been supplied; no invented recording or false audio control.
- Ambient animation and falling objects remain a later pass after this composition is reviewed.
- No publication through ChatGPT Sites. Source is pushed to the primary GitHub repository; public hosting migration is separate.
