type SectionBox = { top: number; height: number };

// Adjacent stories can share a loose row and have different heights. Give each
// an ordered reading interval, including the last row near the end of the page.
export function readingStops(sections: SectionBox[], viewportHeight: number, maxScroll: number) {
  if (!sections.length) return [];
  const gap = Math.min(100, viewportHeight * .12);
  const stops = [0];
  for (const section of sections.slice(1)) {
    stops.push(Math.max(stops[stops.length - 1] + gap, section.top + Math.min(section.height * .5, viewportHeight * .25) - viewportHeight * .5));
  }
  const end = Math.max(0, maxScroll - Math.min(56, maxScroll * .1));
  const last = stops[stops.length - 1];
  return last > end ? stops.map(stop => stop * end / last) : stops;
}

export function readingIndex(scrollTop: number, stops: number[]) {
  if (!stops.length || stops[stops.length - 1] === 0) return 0;
  let index = 0;
  for (let i = 1; i < stops.length; i++) if (scrollTop >= stops[i]) index = i;
  return index;
}
