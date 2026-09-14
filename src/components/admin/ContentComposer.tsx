import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import type { ContentKind } from "../../admin/types";

interface ContentComposerProps {
  onPublish: (input: { body: string; imageDataUrl?: string; kind: ContentKind; title: string }) => void;
}

const contentTypes: { label: string; value: ContentKind }[] = [
  { label: "Official announcement", value: "announcement" },
  { label: "Blog article", value: "article" },
  { label: "Photo post", value: "photo" },
];

export default function ContentComposer({ onPublish }: ContentComposerProps) {
  const [kind, setKind] = useState<ContentKind>("announcement");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string>();
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setError("Choose an image file smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(typeof reader.result === "string" ? reader.result : undefined);
    reader.readAsDataURL(file);
    setError("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Add both a title and a message before publishing.");
      return;
    }
    if (kind === "photo" && !imageDataUrl) {
      setError("A photo post needs an image.");
      return;
    }
    onPublish({ body: body.trim(), imageDataUrl, kind, title: title.trim() });
    setTitle("");
    setBody("");
    setImageDataUrl(undefined);
    setError("");
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <form className="border p-6 sm:p-8" style={{ backgroundColor: "#fff9f0", borderColor: "rgba(184,137,42,0.3)" }} onSubmit={submit}>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase" style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", letterSpacing: "0.16em" }}>Ministry publication desk</p>
          <h2 className="mt-1 text-3xl" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>Publish to the parish</h2>
        </div>
        <span className="text-sm" style={{ color: "var(--color-stone)" }}>Your ministry is applied automatically.</span>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Publication type">
          <select className="admin-input" value={kind} onChange={(event) => setKind(event.target.value as ContentKind)}>
            {contentTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </Field>
        <Field label="Photo attachment">
          <input ref={fileInput} className="admin-input file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium" accept="image/png,image/jpeg,image/webp" onChange={handleFile} type="file" />
        </Field>
      </div>
      <div className="mt-5"><Field label="Title"><input className="admin-input" maxLength={120} onChange={(event) => setTitle(event.target.value)} value={title} /></Field></div>
      <div className="mt-5"><Field label="Message"><textarea className="admin-input min-h-36 resize-y" maxLength={6000} onChange={(event) => setBody(event.target.value)} value={body} /></Field></div>
      {imageDataUrl && <img className="mt-5 aspect-video w-full max-w-sm object-cover" src={imageDataUrl} alt="Selected upload preview" />}
      {error && <p className="mt-4 text-sm" role="alert" style={{ color: "var(--color-burgundy)" }}>{error}</p>}
      <button className="btn-primary mt-6 min-h-11 cursor-pointer" type="submit">Publish {kind}</button>
    </form>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return <label className="block text-xs uppercase" style={{ color: "var(--color-stone)", fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}><span className="mb-2 block">{label}</span>{children}</label>;
}
