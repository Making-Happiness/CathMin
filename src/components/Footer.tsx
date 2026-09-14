export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--color-ink)", color: "var(--color-parchment)", paddingBlock: "3rem 2rem", paddingInline: "1.5rem" }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid gap-10 md:grid-cols-3">
          <div>
            <div style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.2em", marginBottom: "8px", textTransform: "uppercase" }}>
              Catholic Campus Ministries
            </div>
            <div style={{ color: "var(--color-parchment)", fontFamily: "var(--font-display)", fontSize: "1.4rem", lineHeight: 1.2, marginBottom: "12px" }}>
              Sacred Heart of Jesus Parish
            </div>
            <p style={{ color: "rgba(247,237,216,0.5)", fontFamily: "var(--font-body)", fontSize: "0.82rem", lineHeight: 1.7 }}>
              BEC, CFD, and YFC serving Sacred Heart of Jesus Parish in Obrero, Davao City.
            </p>
          </div>

          <div>
            <div style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.2em", marginBottom: "12px", textTransform: "uppercase" }}>
              Quick Links
            </div>
            <div className="flex flex-col gap-2">
              {["About the Parish", "Mass Times", "BEC", "CFD", "YFC", "Contact"].map((link) => (
                <a key={link} href="/#contact" style={{ color: "rgba(247,237,216,0.65)", fontFamily: "var(--font-display)", fontSize: "0.9rem" }}>
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.2em", marginBottom: "12px", textTransform: "uppercase" }}>
              Stay Connected
            </div>
            <p style={{ color: "rgba(247,237,216,0.5)", fontFamily: "var(--font-body)", fontSize: "0.82rem", lineHeight: 1.7, marginBottom: "14px" }}>
              Receive ministry bulletin updates and event announcements from BEC, CFD, and YFC.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 text-sm outline-none"
                style={{ backgroundColor: "rgba(247,237,216,0.08)", border: "1px solid rgba(184,137,42,0.3)", borderRight: "none", color: "var(--color-parchment)", fontFamily: "var(--font-body)" }}
              />
              <button className="cursor-pointer px-4 py-2.5 text-xs" style={{ backgroundColor: "var(--color-burgundy)", border: "1px solid var(--color-burgundy-dark)", color: "var(--color-parchment)", fontFamily: "var(--font-display)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-6" style={{ borderColor: "rgba(184,137,42,0.2)" }}>
          <p style={{ color: "rgba(247,237,216,0.35)", fontFamily: "var(--font-display)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
            © 2026 Sacred Heart of Jesus Parish. All rights reserved.
          </p>
          <p style={{ color: "rgba(247,237,216,0.25)", fontFamily: "var(--font-display)", fontSize: "0.72rem", fontStyle: "italic" }}>
            Deus caritas est
          </p>
        </div>
      </div>
    </footer>
  );
}
