"use client";

import { useEffect, useRef } from "react";
import { applyPose, measureLabels } from "@/lib/drive/apply";
import { installChecks, type DriveDebug } from "@/lib/drive/checks";
import { SCENES, WINDOW_YARDS, poseAt, showsLines } from "@/lib/drive/pose";
import { progress, refLine } from "@/lib/drive/scroll";

// The phone layout (the window pinned on top of the lessons), as in drive.css
const PHONE = "(max-width: 1000px)";

// An element's top in document coordinates. offsetTop, not getBoundingClientRect: the lesson cards are tilted, and
// a tilted card's bounding box starts above its real top.
function docTop(el: HTMLElement): number {
  let y = el.offsetTop;
  for (let p = el.offsetParent as HTMLElement | null; p; p = p.offsetParent as HTMLElement | null) y += p.offsetTop + p.clientTop;
  return y;
}

// The root of the homepage drive. The scroll position is the only clock: each frame it picks the lesson and the
// moment in its play, and puts that pose on the server-rendered field. Adds .ready once everything is placed
// (until then drive.css hides what it would place). On each new lesson it fires "drive:lesson" on section.drive.
export default function DriveEngine({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const win = root.querySelector<HTMLElement>(".window")!;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".lesson"));
    const phone = matchMedia(PHONE);
    let tops: number[] = [], bottom = 0, scale = 1, height = 0, winH = 0;
    let frame = 0, onScreen = false, lesson = -1;
    let state: ReturnType<DriveDebug["state"]> | null = null;

    // Layout reads, all here: the lesson tops, the window's size, and the text the labels are placed around
    const measure = () => {
      tops = cards.map(docTop);
      const last = cards[cards.length - 1];
      bottom = docTop(last) + last.offsetHeight;
      scale = win.clientWidth / WINDOW_YARDS;
      height = win.clientHeight;
      winH = win.offsetHeight;
      measureLabels(root);
    };
    const update = () => {
      const at = progress(scrollY + refLine(innerHeight, winH, !phone.matches), tops, bottom);
      const pose = poseAt(at.lesson, at.t);
      applyPose(root, pose, scale, { height, lines: showsLines(SCENES[at.lesson]) });
      state = { ...at, tag: pose.tag, ball: [pose.ball.x, pose.ball.y], los: pose.los, firstDown: pose.firstDown };
      if (at.lesson !== lesson) {
        const first = lesson < 0;
        lesson = at.lesson;
        if (!first) root.dispatchEvent(new CustomEvent("drive:lesson", { detail: lesson }));
      }
    };
    const remeasure = () => { measure(); update(); };

    // at most one frame's work per frame, however many scroll events arrive, and none while the drive is off screen
    const onScroll = () => {
      if (frame || !onScreen) return;
      frame = requestAnimationFrame(() => { frame = 0; update(); });
    };
    const visible = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1].isIntersecting; // the newest, if it left and came straight back
      if (onScreen) update(); // it may have scrolled a long way while resting
    });
    // a phone turned on its side, a desktop window resized, a card that grows: the lesson tops move
    const resize = new ResizeObserver(remeasure);
    // a web font arriving late changes every card's height
    const fonts = document.fonts;
    let cancelled = false;

    remeasure();
    root.classList.add("ready");
    addEventListener("scroll", onScroll, { passive: true });
    // a phone's address bar showing or hiding changes the screen's height, and with it where lessons are read,
    // without resizing the window or the lessons
    addEventListener("resize", remeasure);
    visible.observe(root);
    resize.observe(win);
    resize.observe(root.querySelector<HTMLElement>(".lessons")!);
    fonts.addEventListener("loadingdone", remeasure);
    fonts.ready.then(() => { if (!cancelled) remeasure(); });
    installChecks(root, { state: () => state!, running: () => onScreen });

    return () => {
      cancelled = true;
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", remeasure);
      visible.disconnect();
      resize.disconnect();
      fonts.removeEventListener("loadingdone", remeasure);
      cancelAnimationFrame(frame);
      root.classList.remove("ready");
      delete window.__drive;
    };
  }, []);

  return <section className="drive" ref={ref}>{children}</section>;
}
