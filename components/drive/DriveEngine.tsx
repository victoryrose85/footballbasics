"use client";

// The root of the homepage drive. For now it only renders section.drive around the server markup; the engine
// that places the field, the players and the ball from the scroll position goes here, and adds .ready once
// everything is placed (until then drive.css hides what it would place).
export default function DriveEngine({ children }: { children: React.ReactNode }) {
  return <section className="drive">{children}</section>;
}
