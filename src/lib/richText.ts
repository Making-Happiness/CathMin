const allowedTags = new Set(["P", "BR", "STRONG", "EM", "S", "UL", "OL", "LI", "H2", "H3", "BLOCKQUOTE", "SPAN"]);
const allowedFonts = new Set(["EB Garamond", "Lora", "Georgia", "Arial"]);

export function sanitizeRichHtml(html: string): string {
  if (typeof document === "undefined") return "";
  const source = new DOMParser().parseFromString(html, "text/html");
  const sanitizeNode = (node: Element): void => {
    [...node.children].forEach(sanitizeNode);
    if (!allowedTags.has(node.tagName)) {
      node.replaceWith(...Array.from(node.childNodes));
      return;
    }
    const style = node.getAttribute("style") ?? "";
    const alignment = style.match(/text-align:\s*(left|center|right|justify)/i)?.[1];
    const fontFamily = style.match(/font-family:\s*['\"]?([^;,'\"]+)/i)?.[1]?.trim();
    [...node.attributes].forEach((attribute) => node.removeAttribute(attribute.name));
    const safeStyles = [
      alignment ? `text-align: ${alignment.toLowerCase()}` : "",
      fontFamily && allowedFonts.has(fontFamily) ? `font-family: ${fontFamily}` : "",
    ].filter(Boolean);
    if (safeStyles.length) node.setAttribute("style", safeStyles.join("; "));
  };
  [...source.body.children].forEach(sanitizeNode);
  return source.body.innerHTML.trim();
}
