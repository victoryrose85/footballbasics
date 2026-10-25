// The scroll position is the drive's only clock. The engine measures the page; these two turn the measurements
// into a moment of the drive. Pure, so the same scroll position always gives the same moment.

// The line, in px from the top of the screen, where the lessons are read. On a phone the window is pinned at the
// top, and the line sits 40% of the way down what it leaves; on a desktop the window is beside the lessons, and
// the line is halfway down the screen.
export function refLine(vh: number, windowH: number, desktop: boolean): number {
  return desktop ? 0.5 * vh : windowH + 0.4 * (vh - windowH);
}

// y: the reading line in document coordinates (scrollY + refLine). Lesson i owns tops[i] up to tops[i + 1], and
// the last one up to lastBottom. Above the first lesson the drive waits at its start; below the last, at its end.
export function progress(y: number, tops: number[], lastBottom: number): { lesson: number; t: number } {
  const last = tops.length - 1;
  if (last < 0 || !(y >= tops[0])) return { lesson: 0, t: 0 };
  if (y >= lastBottom) return { lesson: last, t: 1 };
  let i = last;
  while (i > 0 && y < tops[i]) i--;
  const end = i < last ? tops[i + 1] : lastBottom;
  return { lesson: i, t: end > tops[i] ? Math.min(1, (y - tops[i]) / (end - tops[i])) : 1 };
}
