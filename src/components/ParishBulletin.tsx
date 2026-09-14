import { useAdmin } from "../admin/AdminContext";
import { ContentCard } from "./admin/ContentFeed";

export default function ParishBulletin() {
  const { content } = useAdmin();
  if (!content.length) return null;
  return <section className="px-6 py-24 md:px-12" style={{ backgroundColor: "var(--color-parchment-dark)" }}><div className="mx-auto max-w-5xl"><div className="mb-10 text-center"><div className="cross-ornament mb-5">From Our Ministries</div><h2 style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 400 }}>Parish Bulletin</h2><div className="gold-rule mx-auto mt-5" /></div><div className="grid gap-6 sm:grid-cols-2">{content.slice(0, 6).map((item) => <ContentCard item={item} key={item.id} />)}</div></div></section>;
}
