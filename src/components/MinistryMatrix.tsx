import { MINISTRY_MATRIX } from "../data/ministries";

export default function MinistryMatrix() {
  return (
    <section className="px-6 py-16 md:px-12" style={{ backgroundColor: "var(--color-parchment-dark)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="cross-ornament mb-5" style={{ color: "var(--color-gold)" }}>
            Ministry Discernment
          </div>
          <h2 style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 400 }}>
            Comparative Ministry Matrix
          </h2>
        </div>

        <div className="overflow-x-auto border bg-[#fff9f0]" style={{ borderColor: "rgba(184,137,42,0.25)" }}>
          <table className="min-w-[820px] w-full border-collapse text-left">
            <thead style={{ backgroundColor: "var(--color-ink)", color: "var(--color-parchment)" }}>
              <tr>
                {["Ministry / Organization", "Primary Charism & Focus", "Institutional Function", "Ideal Alignment"].map((heading) => (
                  <th key={heading} className="px-5 py-4 text-sm font-normal uppercase" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MINISTRY_MATRIX.map((row) => (
                <tr key={row.organization} className="border-t" style={{ borderColor: "rgba(184,137,42,0.2)" }}>
                  <td className="px-5 py-5 align-top font-semibold" style={{ color: "var(--color-burgundy)", fontFamily: "var(--font-display)" }}>
                    {row.organization}
                  </td>
                  <td className="px-5 py-5 align-top" style={{ color: "var(--color-ink-light)" }}>
                    {row.charism}
                  </td>
                  <td className="px-5 py-5 align-top" style={{ color: "var(--color-ink-light)" }}>
                    {row.function}
                  </td>
                  <td className="px-5 py-5 align-top" style={{ color: "var(--color-stone)" }}>
                    {row.alignment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
