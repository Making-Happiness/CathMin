import type { MinistryDetail } from "../data/ministries";
import { MINISTRY_INTRO } from "../data/ministries";
import MinistryMatrix from "../components/MinistryMatrix";

interface MinistryPageProps {
  ministry: MinistryDetail;
}

export default function MinistryPage({ ministry }: MinistryPageProps) {
  const mailtoHref = buildMailto(ministry);

  return (
    <>
      <section className="px-6 pb-20 pt-36 md:px-12" style={{ backgroundColor: "var(--color-ink)", color: "var(--color-parchment)" }}>
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_280px] md:items-center">
          <div>
            <p className="mb-6 max-w-3xl text-sm leading-loose" style={{ color: "rgba(247,237,216,0.72)", fontFamily: "var(--font-body)" }}>
              {MINISTRY_INTRO}
            </p>
            <div className="cross-ornament mb-6" style={{ color: "var(--color-gold-light)" }}>
              {ministry.shortName}
            </div>
            <h1 className="mb-6" style={{ color: "var(--color-parchment)", fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 400, lineHeight: 1.08 }}>
              {ministry.pageTitle}
            </h1>
            <div className="gold-rule mb-8" />
            <p className="max-w-3xl text-lg leading-loose" style={{ color: "rgba(247,237,216,0.82)" }}>
              {ministry.introduction}
            </p>
          </div>

          <div className="mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center rounded-lg border bg-[#fff9f0] p-8 shadow-2xl" style={{ borderColor: "rgba(212,168,67,0.35)" }}>
            <img src={ministry.logo} alt={`${ministry.name} logo`} className="h-full w-full object-contain object-center" />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <InfoPanel title="Mission Objective" text={ministry.missionObjective} />
          <InfoPanel title="Core Initiatives" text={ministry.coreInitiatives} />
          <InfoPanel title="Target Audience" text={ministry.targetAudience} />
          <InfoPanel title="Membership & Recruitment" text={ministry.recruitment} />
        </div>
      </section>

      <MinistryMatrix />

      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-4xl border p-8 text-center shadow-xl md:p-12" style={{ background: "linear-gradient(135deg, #fff9f0, var(--color-parchment))", borderColor: "rgba(184,137,42,0.3)" }}>
          <div className="cross-ornament mb-5" style={{ color: "var(--color-gold)" }}>
            Join Us
          </div>
          <h2 className="mb-4" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400 }}>
            Membership Inquiry
          </h2>
          <p className="mx-auto mb-8 max-w-2xl leading-loose" style={{ color: "var(--color-ink-light)" }}>
            Begin your formal application by sending a letter of intent to the ministry leadership team.
          </p>
          <a href={mailtoHref} className="btn-primary inline-block">
            Submit Your Application Form Here
          </a>
        </div>
      </section>
    </>
  );
}

interface InfoPanelProps {
  title: string;
  text: string;
}

function InfoPanel({ title, text }: InfoPanelProps) {
  return (
    <article className="border p-7" style={{ background: "linear-gradient(135deg, #fff9f0, var(--color-parchment))", borderColor: "rgba(184,137,42,0.25)" }}>
      <h2 className="mb-3" style={{ color: "var(--color-burgundy)", fontFamily: "var(--font-display)", fontSize: "1.45rem", fontWeight: 500 }}>
        {title}
      </h2>
      <p className="leading-loose" style={{ color: "var(--color-stone)" }}>
        {text}
      </p>
    </article>
  );
}

function buildMailto(ministry: MinistryDetail) {
  const subject = encodeURIComponent("Formal Membership Application");
  const body = encodeURIComponent(
    `Dear ${ministry.name} Leadership Team,\n\nI respectfully submit this formal letter of intent to apply for membership in ${ministry.name}.\n\nFull Name:\nCourse / Year Level:\nContact Number:\nReason for Joining:\n\nThank you for considering my application.\n\nRespectfully,\n`
  );

  return `mailto:${ministry.email}?subject=${subject}&body=${body}`;
}
