import { useMemo, useState } from "react";
import { useAdmin } from "../admin/AdminContext";
import type { ContentKind } from "../admin/types";
import { ContentCard } from "../components/admin/ContentFeed";

const filters: { label: string; value: "all" | ContentKind }[] = [
  { label: "All stories", value: "all" },
  { label: "Articles", value: "article" },
  { label: "Photo posts", value: "photo" },
  { label: "Announcements", value: "announcement" },
];

export default function StoriesPage() {
  const { content, loading } = useAdmin();
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const stories = useMemo(() => filter === "all" ? content : content.filter((item) => item.kind === filter), [content, filter]);

  return <><section className="px-6 pb-16 pt-36 md:px-12" style={{ backgroundColor: "var(--color-ink)" }}><div className="mx-auto max-w-6xl"><p className="text-xs uppercase" style={{ color: "var(--color-gold-light)", fontFamily: "var(--font-display)", letterSpacing: "0.16em" }}>Campus ministry social feed</p><h1 className="mt-3 max-w-3xl" style={{ color: "var(--color-parchment)", fontFamily: "var(--font-display)", fontSize: "clamp(2.8rem, 6vw, 4.6rem)", fontWeight: 400, lineHeight: 1.08 }}>Stories from the <em>community</em></h1><p className="mt-6 max-w-2xl text-lg leading-8" style={{ color: "rgba(247,237,216,0.75)" }}>Blog articles, ministry updates, and moments from BEC, CFD, and YFC in one organized place.</p></div></section><main className="min-h-dvh px-6 py-14 md:px-12" style={{ backgroundColor: "var(--color-parchment-dark)" }}><div className="mx-auto max-w-6xl"><div className="mb-8 flex flex-wrap gap-3" aria-label="Story filters">{filters.map((option) => <button className="btn-quiet cursor-pointer" key={option.value} onClick={() => setFilter(option.value)} style={filter === option.value ? { backgroundColor: "var(--color-burgundy)", color: "var(--color-parchment)" } : undefined} type="button">{option.label}</button>)}</div>{loading ? <p style={{ color: "var(--color-stone)" }}>Loading stories...</p> : stories.length ? <div className="grid gap-7 md:grid-cols-2">{stories.map((item) => <ContentCard item={item} key={item.id} />)}</div> : <div className="border p-12 text-center" style={{ borderColor: "rgba(184,137,42,0.28)", backgroundColor: "#fff9f0" }}><h2 className="text-3xl" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>No stories here yet</h2><p className="mt-3" style={{ color: "var(--color-stone)" }}>Check back for ministry news, articles, and community photographs.</p></div>}</div></main></>;
}
