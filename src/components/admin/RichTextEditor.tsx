import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";

interface RichTextEditorProps {
  onChange: (html: string) => void;
  value: string;
}

const controls = [
  { label: "Bold", command: "bold" },
  { label: "Italic", command: "italic" },
  { label: "Heading", command: "heading" },
  { label: "List", command: "bulletList" },
  { label: "Left", command: "left" },
  { label: "Center", command: "center" },
] as const;

const fontOptions = [
  { label: "Parish serif", value: "EB Garamond" },
  { label: "Body serif", value: "Lora" },
  { label: "Classic", value: "Georgia" },
  { label: "Sans serif", value: "Arial" },
];

export default function RichTextEditor({ onChange, value }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } }), TextStyle, FontFamily.configure({ types: ["textStyle"] }), TextAlign.configure({ types: ["heading", "paragraph"] })],
    content: value,
    editorProps: { attributes: { class: "rich-editor-content", "aria-label": "Post message" } },
    onUpdate: ({ editor: activeEditor }) => onChange(activeEditor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return <div className="admin-input min-h-36" />;
  const execute = (command: (typeof controls)[number]["command"]) => {
    const chain = editor.chain().focus();
    if (command === "bold") chain.toggleBold().run();
    if (command === "italic") chain.toggleItalic().run();
    if (command === "heading") chain.toggleHeading({ level: 2 }).run();
    if (command === "bulletList") chain.toggleBulletList().run();
    if (command === "left") chain.setTextAlign("left").run();
    if (command === "center") chain.setTextAlign("center").run();
  };

  return <div className="rich-editor border" style={{ borderColor: "rgba(184,137,42,0.35)" }}><div className="flex flex-wrap items-center gap-2 border-b p-2" style={{ backgroundColor: "rgba(247,237,216,0.75)", borderColor: "rgba(184,137,42,0.2)" }}>{controls.map((control) => <button className="rich-editor-button cursor-pointer" key={control.command} onClick={() => execute(control.command)} type="button">{control.label}</button>)}<label className="sr-only" htmlFor="editor-font-family">Font family</label><select className="rich-editor-select" id="editor-font-family" defaultValue="" onChange={(event) => { const value = event.target.value; if (value) editor.chain().focus().setFontFamily(value).run(); }}><option value="">Font</option>{fontOptions.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}</select></div><EditorContent editor={editor} /></div>;
}
