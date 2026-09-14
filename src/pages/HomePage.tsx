import { Link } from "react-router-dom";
import MinistryMatrix from "../components/MinistryMatrix";
import ParishBulletin from "../components/ParishBulletin";
import { MINISTRY_INTRO, MINISTRY_SUMMARIES } from "../data/ministries";

const heroParishImage = "/hero-landscape.jpg";
const aboutParishImage = "/about-parish.jpg";
const communityBaccalaureateImage = "/community-at-baccalaureate-mass.jpg";
const communityClubDayImage = "/community-at-club-day.jpg";
const communityParishImage = "/community-at-sacred-heart.jpg";

const MASS_SCHEDULE = [
  { day: "Sunday", times: ["06:30 AM (Cebuano)", "08:00 AM (English)", "09:30 AM (English-Chinese)", "11:00 AM (English)", "04:00 PM (Cebuano)", "05:30 PM (English)"] },
  { day: "Monday", times: ["06:00 AM (English)", "05:30 PM (English)"] },
  { day: "Tuesday", times: ["06:00 AM (Cebuano)", "05:30 PM (Cebuano)"] },
  { day: "Wednesday", times: ["06:00 AM (English)", "12:00 PM (English)", "05:30 PM (English)"] },
  { day: "Thursday", times: ["06:00 AM", "05:30 PM"] },
  { day: "Friday", times: ["Novena to the Most Sacred Heart of Jesus - all scheduled Masses"] },
  { day: "Saturday", times: ["06:00 AM"] },
];

const EVENTS = [
  {
    date: "Oct 4",
    title: "Vocation Jamboree",
    description: "A joyful gathering celebrating the call to religious life - featuring talks, music, and prayer for vocations in our parish.",
    category: "Formation",
  },
  {
    date: "Oct 7",
    title: "Human Rosary",
    description: "Parishioners come together to form a living Rosary in prayer and unity, honoring Our Lady on her feast.",
    category: "Devotion",
  },
  {
    date: "Nov 2",
    title: "Recollections",
    description: "A day of guided reflection and silent prayer to renew the spirit and deepen one's relationship with God.",
    category: "Spirituality",
  },
  {
    date: "Dec 20",
    title: "Christmas Party",
    description: "The parish family gathers in festive celebration - food, fellowship, and gratitude as we welcome the season of Christ's birth.",
    category: "Community",
  },
];

const COMMITTEES = [
  {
    title: "Music Committee",
    monogram: "MC",
    description: "Coordinating sacred music and the liturgical choir to enrich worship at every Mass. New voices are always welcome.",
  },
  {
    title: "Mass Preparation Committee",
    monogram: "MP",
    description: "Ensuring every liturgical celebration is prayerfully and beautifully prepared - from readings and decor to hospitality.",
  },
  {
    title: "Food Committee",
    monogram: "FC",
    description: "Organizing meals and refreshments for parish gatherings, feasts, and outreach events that nourish body and community.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden text-center" style={{ backgroundColor: "#0e0a06" }}>
        <img
          src={heroParishImage}
          alt="Sacred Heart of Jesus Parish landscape"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ opacity: 0.45 }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,16,8,0.92) 0%, rgba(61,43,26,0.55) 50%, rgba(26,16,8,0.65) 100%)" }} />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24">
          <div className="cross-ornament mb-8" style={{ color: "var(--color-gold-light)", opacity: 0.8 }}>
            EST. 1967
          </div>

          <h1
            className="mb-6"
            style={{
              color: "var(--color-parchment)",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              fontWeight: 400,
              lineHeight: 1.08,
            }}
          >
            Come, Rest, and <em>Find</em>
            <br />
            Your Place at the Table
          </h1>

          <div className="gold-rule mx-auto mb-8" />

          <p className="mx-auto mb-10 text-lg leading-relaxed" style={{ color: "rgba(247,237,216,0.78)", maxWidth: "520px" }}>
            A welcoming Catholic community in the heart of Obrero, Davao City - rooted in the Eucharist, alive in service, and united by love.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#mass-times" className="btn-primary">
              Plan Your Visit
            </a>
            <a href="#about" className="btn-ghost">
              Our Story
            </a>
          </div>
        </div>
      </section>

      <div className="text-center" style={{ backgroundColor: "var(--color-burgundy)", paddingBlock: "1.25rem" }}>
        <p style={{ color: "var(--color-parchment)", fontFamily: "var(--font-display)", fontSize: "1.05rem", fontStyle: "italic", letterSpacing: "0.03em" }}>
          "Come to me, all you who are weary and burdened, and I will give you rest." - Matthew 11:28
        </p>
      </div>

      <section id="about" className="px-6 py-24 md:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          <div>
            <div className="cross-ornament mb-6" style={{ color: "var(--color-gold)" }}>
              About Our Parish
            </div>
            <h2 className="mb-6" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, lineHeight: 1.15 }}>
              A Community of
              <br />
              <em>Faith, Hope & Charity</em>
            </h2>
            <div className="gold-rule mb-8" />
            <p className="mb-5 text-base leading-loose" style={{ color: "var(--color-ink-light)" }}>
              Since 1967, Sacred Heart of Jesus Parish has been a spiritual home for families in Barrio Obrero, Davao City. Our parish is a vibrant community united in worship, service, and the pursuit of holiness.
            </p>
            <p className="mb-8 text-base leading-loose" style={{ color: "var(--color-ink-light)" }}>
              Our priest and parish family invite all people - whether lifelong Catholics, curious seekers, or those returning to the faith - to encounter the living Christ in our community.
            </p>
            <a href="#contact" className="btn-primary">
              Meet Our Priest
            </a>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-2xl">
              <img
                src={aboutParishImage}
                alt="Sacred Heart of Jesus Parish community"
                className="block h-full w-full object-cover object-center"
                loading="lazy"
                style={{ filter: "saturate(1.1)" }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,16,8,0.3) 0%, transparent 60%)" }} />
            </div>
            <div
              className="absolute -bottom-6 -left-6 hidden flex-col items-center justify-center rounded-full md:flex"
              style={{ backgroundColor: "var(--color-burgundy)", boxShadow: "0 8px 30px rgba(107,30,47,0.4)", height: "130px", width: "130px" }}
            >
              <span style={{ color: "var(--color-parchment)", fontFamily: "var(--font-display)", fontSize: "2.2rem", lineHeight: 1 }}>59</span>
              <span style={{ color: "rgba(247,237,216,0.7)", fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.15em", marginTop: "4px", textTransform: "uppercase" }}>
                Years of Faith
              </span>
            </div>
          </div>
        </div>
      </section>

      <MassTimesSection />
      <MinistriesSection />
      <MinistryMatrix />
      <QuoteSection />
      <ParishBulletin />
      <EventsSection />
      <CommunitySection />
      <ContactSection />
    </>
  );
}

function MassTimesSection() {
  return (
    <section id="mass-times" className="px-6 py-24 md:px-12" style={{ backgroundColor: "var(--color-ink)", color: "var(--color-parchment)" }}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <div className="cross-ornament mb-6" style={{ color: "var(--color-gold)", opacity: 0.8 }}>
            Worship with Us
          </div>
          <h2 style={{ color: "var(--color-parchment)", fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 400 }}>
            Mass Schedule
          </h2>
          <div className="gold-rule mx-auto mt-6" />
        </div>

        <div className="border" style={{ borderColor: "rgba(184,137,42,0.25)" }}>
          {MASS_SCHEDULE.map((row) => (
            <div key={row.day} className="mass-row flex flex-col px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
              <span style={{ color: "var(--color-parchment)", fontFamily: "var(--font-display)", fontSize: "1.15rem", minWidth: "220px" }}>{row.day}</span>
              <div className="mt-2 flex flex-wrap gap-3 sm:mt-0">
                {row.times.map((time) => (
                  <span key={time} style={{ border: "1px solid rgba(212,168,67,0.35)", color: "var(--color-gold-light)", fontFamily: "var(--font-display)", fontSize: "0.95rem", letterSpacing: "0.05em", padding: "0.2rem 0.85rem" }}>
                    {time}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MinistriesSection() {
  return (
    <section id="ministries" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <div className="cross-ornament mb-6" style={{ color: "var(--color-gold)" }}>
            Get Involved
          </div>
          <h2 style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 400 }}>
            Ministries & Committees
          </h2>
          <p className="mx-auto mt-4 max-w-3xl leading-loose" style={{ color: "var(--color-stone)" }}>
            {MINISTRY_INTRO}
          </p>
          <div className="gold-rule mx-auto mt-6" />
        </div>

        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MINISTRY_SUMMARIES.map((ministry) => (
            <Link key={ministry.slug} to={`/ministries/${ministry.slug}`} className="ministry-card block p-8">
              <div className="mb-6 flex h-24 items-center justify-center rounded-sm bg-[#fff9f0] p-4">
                <img src={ministry.logo} alt={`${ministry.name} logo`} className="h-full w-full object-contain object-center" loading="lazy" />
              </div>
              <h3 className="mb-2" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 500 }}>
                {ministry.name}
              </h3>
              <p className="mb-4 text-sm uppercase" style={{ color: "var(--color-burgundy)", fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}>
                {ministry.charism}
              </p>
              <p style={{ color: "var(--color-stone)", fontSize: "0.9rem", lineHeight: 1.75 }}>{ministry.description}</p>
              <span className="mt-5 inline-block text-sm" style={{ borderBottom: "1px solid var(--color-burgundy)", color: "var(--color-burgundy)", fontFamily: "var(--font-display)", fontSize: "0.75rem", letterSpacing: "0.1em", paddingBottom: "1px", textTransform: "uppercase" }}>
                Visit Page
              </span>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COMMITTEES.map((committee) => (
            <article key={committee.title} className="ministry-card p-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(184,137,42,0.15)", color: "var(--color-burgundy)", fontFamily: "var(--font-display)" }}>
                {committee.monogram}
              </div>
              <h3 className="mb-3" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 500 }}>
                {committee.title}
              </h3>
              <p style={{ color: "var(--color-stone)", fontSize: "0.9rem", lineHeight: 1.75 }}>{committee.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteSection() {
  return (
    <div className="relative overflow-hidden px-6 py-20 text-center md:px-12" style={{ backgroundColor: "var(--color-parchment-dark)" }}>
      <div className="quote-mark pointer-events-none absolute left-8 top-4 hidden select-none md:block">"</div>
      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="mb-8" style={{ color: "var(--color-ink-light)", fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 3.5vw, 2.1rem)", fontStyle: "italic", fontWeight: 400, lineHeight: 1.5 }}>
          "Whether therefore ye eat or drink, or whatsoever ye do, do all to the glory of God."
        </p>
        <div className="gold-rule mx-auto mb-5" />
        <p style={{ color: "var(--color-stone)", fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          - 1 Corinthians 10:31
        </p>
      </div>
    </div>
  );
}

function EventsSection() {
  return (
    <section id="events" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="cross-ornament mb-5" style={{ color: "var(--color-gold)" }}>
              Parish Life
            </div>
            <h2 style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 400 }}>
              Highlight Events & Activities
            </h2>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {EVENTS.map((event) => (
            <article key={event.title} className="p-7 sm:p-8" style={{ background: "linear-gradient(135deg, #fff9f0, var(--color-parchment))", border: "1px solid rgba(184,137,42,0.2)" }}>
              <div className="max-w-xl">
                <span style={{ color: "var(--color-gold)", display: "inline-block", fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.15em", marginBottom: "6px", textTransform: "uppercase" }}>
                  {event.category}
                </span>
                <h3 style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 500, marginBottom: "6px" }}>{event.title}</h3>
                <p style={{ color: "var(--color-stone)", fontSize: "0.85rem", lineHeight: 1.65 }}>{event.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  const photos = [
    { src: communityBaccalaureateImage, alt: "Community gathered at Baccalaureate Mass", filter: "saturate(0.85)" },
    { src: communityClubDayImage, alt: "Community members at Club Day", filter: "saturate(0.9)" },
    { src: communityParishImage, alt: "Community at Sacred Heart of Jesus Parish", filter: "saturate(0.85)" },
  ];

  return (
    <section className="px-6 py-16 md:px-12" style={{ backgroundColor: "var(--color-ink)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 style={{ color: "var(--color-parchment)", fontFamily: "var(--font-display)", fontSize: "1.8rem", fontStyle: "italic", fontWeight: 400 }}>
            Life at Sacred Heart of Jesus Parish
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.alt} className="relative aspect-[4/3] overflow-hidden rounded-sm" style={{ backgroundColor: "#2a1a0e" }}>
              <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105" loading="lazy" style={{ filter: photo.filter }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-6xl items-start gap-16 md:grid-cols-2">
        <div>
          <div className="cross-ornament mb-6" style={{ color: "var(--color-gold)" }}>
            Find Us
          </div>
          <h2 style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 400, marginBottom: "1.5rem" }}>
            We'd Love to
            <br />
            <em>Hear from You</em>
          </h2>
          <div className="gold-rule mb-8" />

          <div className="space-y-6">
            {[
              { label: "Type", value: "Page - Religious organization" },
              { label: "Address", value: "Bo. Obrero, Inigo St, Poblacion District, Davao City, 8000 Davao del Sur, Davao City, Philippines" },
              { label: "Email", value: "bec_obrero@usep.edu.ph" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-[60px] flex-shrink-0 pt-0.5">
                  <span style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</span>
                </div>
                <p style={{ color: "var(--color-ink-light)", fontSize: "0.95rem" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border p-10" style={{ backgroundColor: "#fff9f0", borderColor: "rgba(184,137,42,0.2)" }}>
          <h3 style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)", fontSize: "1.4rem", fontStyle: "italic", marginBottom: "1.5rem" }}>
            Send Us a Message
          </h3>
          <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
            {[
              { label: "Full Name", type: "text", placeholder: "Mary Catherine O'Brien" },
              { label: "Email Address", type: "email", placeholder: "mary@example.com" },
            ].map(({ label, type, placeholder }) => (
              <div key={label}>
                <label className="mb-1.5 block text-xs uppercase" style={{ color: "var(--color-stone)", fontFamily: "var(--font-display)", letterSpacing: "0.14em" }}>
                  {label}
                </label>
                <input type={type} placeholder={placeholder} className="w-full px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2" style={{ backgroundColor: "var(--color-parchment)", border: "1px solid rgba(184,137,42,0.3)", color: "var(--color-ink)" }} />
              </div>
            ))}
            <div>
              <label className="mb-1.5 block text-xs uppercase" style={{ color: "var(--color-stone)", fontFamily: "var(--font-display)", letterSpacing: "0.14em" }}>
                Message
              </label>
              <textarea rows={4} placeholder="How can we help you?" className="w-full resize-none px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2" style={{ backgroundColor: "var(--color-parchment)", border: "1px solid rgba(184,137,42,0.3)", color: "var(--color-ink)" }} />
            </div>
            <button type="submit" className="btn-primary mt-2 w-full cursor-pointer">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
