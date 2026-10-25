// A white block with an optional kicker pill and an H3 title (text, or a link as on the homepage's guide list).
export default function Block({ kicker, title, id, children }: { kicker?: string; title?: React.ReactNode; id?: string; children: React.ReactNode }) {
  return (
    <div className="block" id={id}>
      {kicker && <span className="k">{kicker}</span>}
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
