import type { CSSProperties } from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MINISTRY_SUMMARIES } from "../data/ministries";

const homeLink = (hash: string) => `/${hash}`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [ministriesOpen, setMinistriesOpen] = useState(false);

  const closeMenus = () => {
    setMenuOpen(false);
    setMinistriesOpen(false);
  };

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
      style={{
        background: "linear-gradient(to bottom, rgba(26,16,8,0.9) 0%, rgba(26,16,8,0.1) 100%)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Link to="/" className="flex flex-col leading-none" onClick={closeMenus}>
        <span
          className="text-lg font-medium tracking-widest"
          style={{
            color: "var(--color-gold-light)",
            fontFamily: "var(--font-display)",
            fontSize: "0.8rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Catholic Ministry
        </span>
        <span
          className="text-xl"
          style={{
            color: "var(--color-parchment)",
            fontFamily: "var(--font-display)",
            fontSize: "1.35rem",
            lineHeight: 1.1,
          }}
        >
          Our Lady of Guadlupe
        </span>
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        <Link to={homeLink("#about")} className="nav-link">
          About
        </Link>

        <NavLink to="/stories" className="nav-link" onClick={closeMenus}>
          Stories
        </NavLink>

        <div
          className="relative z-50"
          onMouseEnter={() => setMinistriesOpen(true)}
          onMouseLeave={() => setMinistriesOpen(false)}
        >
          <button
            type="button"
            className="nav-link min-h-11 cursor-pointer"
            aria-expanded={ministriesOpen}
            aria-haspopup="true"
            onClick={() => setMinistriesOpen((open) => !open)}
          >
            Ministries
          </button>

          {ministriesOpen && (
            <div className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-4">
              <div
                className="border p-2 shadow-2xl transition-opacity delay-100 duration-200"
                style={{
                  backgroundColor: "rgba(26,16,8,0.98)",
                  borderColor: "rgba(212,168,67,0.35)",
                }}
              >
                {MINISTRY_SUMMARIES.map((ministry) => (
                  <NavLink
                    key={ministry.slug}
                    to={`/ministries/${ministry.slug}`}
                    className={({ isActive }) =>
                      `block px-4 py-3 transition-colors ${isActive ? "bg-[rgba(184,137,42,0.18)]" : "hover:bg-[rgba(247,237,216,0.08)]"}`
                    }
                    onClick={closeMenus}
                  >
                    <span className="block text-sm uppercase" style={{ color: "var(--color-gold-light)", fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}>
                      {ministry.shortName}
                    </span>
                    <span className="mt-1 block text-sm" style={{ color: "rgba(247,237,216,0.72)" }}>
                      {ministry.name}
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link to={homeLink("#mass-times")} className="nav-link">
          Mass Times
        </Link>
        <Link to={homeLink("#events")} className="nav-link">
          Events
        </Link>
        <Link to={homeLink("#contact")} className="nav-link">
          Contact
        </Link>
        <Link to={homeLink("#contact")} className="btn-primary" style={{ padding: "0.55rem 1.4rem" }}>
          Give
        </Link>
        <Link to="/admin/login" className="nav-link">
          Admin
        </Link>
      </div>

      <button
        className="min-h-11 min-w-11 cursor-pointer text-sm uppercase md:hidden"
        style={{ color: "var(--color-parchment)", fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? "Close" : "Menu"}
      </button>

      {menuOpen && (
        <div
          className="fixed inset-x-0 top-[74px] z-40 flex min-h-[calc(100dvh-74px)] flex-col gap-5 px-8 py-10 md:hidden"
          style={{ backgroundColor: "rgba(26,16,8,0.98)" }}
        >
          <Link to={homeLink("#about")} className="text-2xl" style={mobileLinkStyle} onClick={closeMenus}>
            About
          </Link>
          <Link to="/stories" className="text-2xl" style={mobileLinkStyle} onClick={closeMenus}>
            Stories
          </Link>
          <div>
            <p className="mb-3 text-sm uppercase" style={{ color: "var(--color-gold-light)", letterSpacing: "0.16em" }}>
              Ministries
            </p>
            <div className="grid gap-2">
              {MINISTRY_SUMMARIES.map((ministry) => (
                <Link
                  key={ministry.slug}
                  to={`/ministries/${ministry.slug}`}
                  className="border px-4 py-3"
                  style={{ borderColor: "rgba(184,137,42,0.3)", color: "var(--color-parchment)", fontFamily: "var(--font-display)" }}
                  onClick={closeMenus}
                >
                  {ministry.shortName} - {ministry.name}
                </Link>
              ))}
            </div>
          </div>
          <Link to={homeLink("#mass-times")} className="text-2xl" style={mobileLinkStyle} onClick={closeMenus}>
            Mass Times
          </Link>
          <Link to={homeLink("#events")} className="text-2xl" style={mobileLinkStyle} onClick={closeMenus}>
            Events
          </Link>
          <Link to={homeLink("#contact")} className="text-2xl" style={mobileLinkStyle} onClick={closeMenus}>
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}

const mobileLinkStyle = {
  color: "var(--color-parchment)",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.12em",
} satisfies CSSProperties;
