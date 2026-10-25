// Position tips on the drive: one open at a time, opened by hover (mouse), tap or keyboard, and closed by a tap
// anywhere else, Escape (focus stays on the player), or the drive moving on to another lesson. Each tip's text is
// already in the page, in .tips inside the window; this only shows and hides it. The panel sits along the window's
// bottom (drive.css), so there is nothing to position. It fades with a CSS transition on .info.on.
const FADE = 200;

export function bindTips(root: HTMLElement): () => void {
  // a tip opened by hovering closes when the mouse leaves; clicking it pins it open until the next click or tap
  let open: { btn: HTMLElement; tip: HTMLElement; hover: boolean } | null = null;
  const timers = new Map<HTMLElement, number>();
  const buttons = Array.from(root.querySelectorAll<HTMLElement>("button.pl"));

  function show(btn: HTMLElement, hover = false) {
    hide();
    // the player's tip changes as the drive moves, so read it now
    const tip = document.getElementById(btn.getAttribute("aria-controls")!);
    if (!tip) return;
    clearTimeout(timers.get(tip));
    tip.hidden = false;
    void tip.offsetWidth; // so the fade starts from the hidden state
    tip.classList.add("on");
    btn.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
    open = { btn, tip, hover };
  }

  function hide() {
    if (!open) return;
    const { btn, tip } = open;
    open = null;
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    tip.classList.remove("on");
    timers.set(tip, window.setTimeout(() => { tip.hidden = true; }, FADE));
  }

  const inTip = (n: EventTarget | null) => n instanceof Node && !!open && open.tip.contains(n);
  // hovering the player whose tip is already open (pinned by a click, say) leaves it as it is
  const onEnter = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && open?.btn !== e.currentTarget) show(e.currentTarget as HTMLElement, true);
  };
  // the panel can appear under the mouse, so moving onto it is not leaving
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && open?.hover && !inTip(e.relatedTarget)) hide();
  };
  const onTipLeave = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && open?.hover && !open.btn.contains(e.relatedTarget as Node | null)) hide();
  };
  const onClick = (e: MouseEvent) => {
    const btn = e.currentTarget as HTMLElement;
    if (open?.btn !== btn) show(btn);
    else if (open.hover) open.hover = false;
    else hide();
  };
  // a tap anywhere else closes the open tip
  const onDown = (e: PointerEvent) => {
    const t = e.target as Node;
    if (open && !open.btn.contains(t) && !open.tip.contains(t)) hide();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Escape" || !open) return;
    const btn = open.btn;
    hide();
    btn.focus();
  };

  const tips = Array.from(root.querySelectorAll<HTMLElement>(".info"));
  buttons.forEach((b) => {
    b.addEventListener("pointerenter", onEnter);
    b.addEventListener("pointerleave", onLeave);
    b.addEventListener("click", onClick);
  });
  tips.forEach((t) => t.addEventListener("pointerleave", onTipLeave));
  root.addEventListener("drive:lesson", hide); // does not bubble, so on the section itself
  document.addEventListener("pointerdown", onDown);
  document.addEventListener("keydown", onKey);

  return () => {
    buttons.forEach((b) => {
      b.removeEventListener("pointerenter", onEnter);
      b.removeEventListener("pointerleave", onLeave);
      b.removeEventListener("click", onClick);
    });
    tips.forEach((t) => t.removeEventListener("pointerleave", onTipLeave));
    root.removeEventListener("drive:lesson", hide);
    document.removeEventListener("pointerdown", onDown);
    document.removeEventListener("keydown", onKey);
    timers.forEach((id) => clearTimeout(id));
    hide();
    tips.forEach((t) => { t.hidden = true; t.classList.remove("on"); });
  };
}
