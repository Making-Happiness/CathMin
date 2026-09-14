import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../admin/AdminContext";
import ContentComposer from "../components/admin/ContentComposer";
import ContentFeed from "../components/admin/ContentFeed";

export default function AdminDashboardPage() {
  const { content, logout, publish, session } = useAdmin();
  const navigate = useNavigate();
  if (!session) return null;
  const ministryContent = content.filter((item) => item.ministry === session.role);

  const exit = () => { logout(); navigate("/admin/login", { replace: true }); };
  return <main className="min-h-dvh px-6 py-8 md:px-12" style={{ backgroundColor: "var(--color-parchment)" }}>
    <header className="mx-auto flex max-w-6xl flex-col gap-5 border-b pb-7 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "rgba(184,137,42,0.25)" }}>
      <div><p className="text-xs uppercase" style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", letterSpacing: "0.16em" }}>Catholic Ministries · administration</p><h1 className="mt-1 text-4xl" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>{session.role} publication desk</h1><p className="mt-2" style={{ color: "var(--color-stone)" }}>Signed in as {session.name}</p></div>
      <div className="flex flex-wrap gap-3"><Link className="btn-quiet" to="/">View parish home</Link><button className="btn-quiet cursor-pointer" onClick={exit}>Log out</button></div>
    </header>
    <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_0.8fr]">
      <ContentComposer onPublish={publish} />
      <aside className="border p-7" style={{ backgroundColor: "var(--color-ink)", borderColor: "rgba(212,168,67,0.35)" }}><p className="text-xs uppercase" style={{ color: "var(--color-gold-light)", fontFamily: "var(--font-display)", letterSpacing: "0.16em" }}>Publishing standard</p><h2 className="mt-2 text-3xl" style={{ color: "var(--color-parchment)", fontFamily: "var(--font-display)" }}>Ministerial clarity</h2><p className="mt-5 leading-7" style={{ color: "rgba(247,237,216,0.72)" }}>Each item is stamped with your {session.role} role and appears in the public parish bulletin immediately. Use accessible, respectful captions and only upload photographs you are permitted to share.</p><dl className="mt-8 space-y-4 border-t pt-6" style={{ borderColor: "rgba(212,168,67,0.25)" }}><div className="flex justify-between gap-4"><dt style={{ color: "rgba(247,237,216,0.65)" }}>Published by {session.role}</dt><dd style={{ color: "var(--color-gold-light)" }}>{ministryContent.length}</dd></div><div className="flex justify-between gap-4"><dt style={{ color: "rgba(247,237,216,0.65)" }}>All parish updates</dt><dd style={{ color: "var(--color-gold-light)" }}>{content.length}</dd></div></dl></aside>
    </div>
    <section className="mx-auto mt-14 max-w-6xl"><p className="text-xs uppercase" style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", letterSpacing: "0.16em" }}>Your ministry's recent work</p><h2 className="mt-1 mb-6 text-3xl" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>Published updates</h2><ContentFeed content={ministryContent} /></section>
  </main>;
}
