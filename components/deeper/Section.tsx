// One H2 section of a deeper page; its blocks go inside.
export default function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
