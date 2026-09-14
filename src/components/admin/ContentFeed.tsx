import { sanitizeRichHtml } from "../../lib/richText";
import type { MinistryContent } from "../../admin/types";

export default function ContentFeed({ content, emptyMessage = "No ministry updates have been published yet." }: { content: MinistryContent[]; emptyMessage?: string }) {
  if (!content.length) return <div className="border p-8 text-center" style={{ borderColor: "rgba(184,137,42,0.25)" }}><p style={{ color: "var(--color-stone)" }}>{emptyMessage}</p></div>;
  return <div className="grid gap-5 md:grid-cols-2">{content.map((item) => <ContentCard item={item} key={item.id} />)}</div>;
}

export function ContentCard({ item }: { item: MinistryContent }) {
  return (
    <article className="overflow-hidden border" style={{ background: "linear-gradient(135deg, #fff9f0, var(--color-parchment))", borderColor: "rgba(184,137,42,0.25)" }}>
      {item.imageUrl && <img className="aspect-[16/9] h-full w-full object-cover object-center" src={item.imageUrl} alt={`${item.ministry} ministry post`} loading="lazy" />}
      <div className="p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs uppercase" style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}><span>{item.ministry} Ministry · {item.kind}</span><span>{new Date(item.publishedAt).toLocaleDateString()}</span></div>
        <h3 className="text-2xl" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>{item.title}</h3>
        <div className="rich-content mt-3 text-sm leading-7" style={{ color: "var(--color-stone)" }} dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(item.bodyHtml) }} />
      </div>
    </article>
  );
}
