import type { MinistryContent } from "../../admin/types";

export default function ContentFeed({ content }: { content: MinistryContent[] }) {
  if (!content.length) return <div className="border p-8 text-center" style={{ borderColor: "rgba(184,137,42,0.25)" }}><p style={{ color: "var(--color-stone)" }}>No ministry updates have been published yet.</p></div>;
  return <div className="grid gap-5 md:grid-cols-2">{content.map((item) => <ContentCard item={item} key={item.id} />)}</div>;
}

export function ContentCard({ item }: { item: MinistryContent }) {
  return (
    <article className="border p-6" style={{ background: "linear-gradient(135deg, #fff9f0, var(--color-parchment))", borderColor: "rgba(184,137,42,0.25)" }}>
      {item.imageDataUrl && <img className="mb-5 aspect-[16/9] w-full object-cover" src={item.imageDataUrl} alt="" />}
      <div className="mb-3 flex items-center justify-between gap-3 text-xs uppercase" style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}><span>{item.ministry} · {item.kind}</span><span>{new Date(item.publishedAt).toLocaleDateString()}</span></div>
      <h3 className="text-2xl" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>{item.title}</h3>
      <p className="mt-3 whitespace-pre-line text-sm leading-7" style={{ color: "var(--color-stone)" }}>{item.body}</p>
    </article>
  );
}
