import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { ContentKind, PublishContentInput } from "../../admin/types";
import RichTextEditor from "./RichTextEditor";

interface ContentComposerProps {
  onClose: () => void;
  onPublish: (input: PublishContentInput) => Promise<void>;
}

const contentTypes: { label: string; value: ContentKind }[] = [
  { label: "Official announcement", value: "announcement" },
  { label: "Blog article", value: "article" },
  { label: "Photo post", value: "photo" },
];

const MAX_IMAGE_BYTES = 30 * 1024 * 1024;

export default function ContentComposer({ onClose, onPublish }: ContentComposerProps) {
  const [kind, setKind] = useState<ContentKind>("announcement");
  const [title, setTitle] = useState("");
  const [bodyHtml, setBodyHtml] = useState("<p></p>");
  const [image, setImage] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type) || file.size > MAX_IMAGE_BYTES) {
      setError("Choose a PNG or JPEG image no larger than 30 MB.");
      event.target.value = "";
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || bodyHtml.replace(/<[^>]+>/g, "").trim().length === 0) { setError("Add both a title and a message before publishing."); return; }
    if (kind === "photo" && !image) { setError("A photo post needs an image."); return; }
    setSubmitting(true);
    setError("");
    try { await onPublish({ bodyHtml, image, kind, title: title.trim() }); onClose(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "The post could not be published. Please try again."); }
    finally { setSubmitting(false); }
  };

  return <div className="fixed inset-0 z-[100] flex items-end bg-black/55 p-0 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="composer-title"><form className="max-h-[94dvh] w-full overflow-y-auto border bg-[#fff9f0] p-6 shadow-2xl sm:max-w-3xl sm:p-9" style={{ borderColor: "rgba(212,168,67,0.45)" }} onSubmit={submit}><div className="flex items-start justify-between gap-5"><div><p className="text-xs uppercase" style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", letterSpacing: "0.16em" }}>Ministry publication desk</p><h2 id="composer-title" className="mt-1 text-3xl" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>Create a post</h2></div><button className="btn-quiet cursor-pointer" onClick={onClose} type="button">Close</button></div><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Publication type"><select className="admin-input" value={kind} onChange={(event) => setKind(event.target.value as ContentKind)}>{contentTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></Field><Field label="Photo attachment"><input ref={fileInput} className="admin-input file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium" accept=".png,.jpg,.jpeg,image/png,image/jpeg" onChange={handleFile} type="file" /></Field></div><div className="mt-5"><Field label="Title"><input className="admin-input" maxLength={120} onChange={(event) => setTitle(event.target.value)} required value={title} /></Field></div><div className="mt-5"><Field label="Message"><RichTextEditor onChange={setBodyHtml} value={bodyHtml} /></Field></div>{previewUrl && <img className="mt-5 aspect-video w-full rounded-sm object-cover object-center" src={previewUrl} alt="Selected upload preview" />}{error && <p className="mt-4 text-sm" role="alert" style={{ color: "var(--color-burgundy)" }}>{error}</p>}<button className="btn-primary mt-6 min-h-11 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "Publishing..." : `Publish ${kind}`}</button></form></div>;
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return <label className="block text-xs uppercase" style={{ color: "var(--color-stone)", fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}><span className="mb-2 block">{label}</span>{children}</label>;
}
