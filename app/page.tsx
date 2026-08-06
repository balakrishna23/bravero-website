"use client";

import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";

const PROCESS_STEPS = ["Understand", "Map", "Engage", "Assess", "Align", "Appoint"];

const LEADERSHIP_ROLES = [
  "CEO", "MD", "COO", "CTO", "CIO", "CHRO", "CFO", "GCC LEADERS",
  "BUSINESS UNIT HEADS", "DIGITAL", "PRODUCT", "OPERATIONS",
];

const DECISION_ITEMS = [
  "Appoint a C-suite executive",
  "Strengthen the leadership bench",
  "Build a GCC leadership team",
  "Find mission-critical talent",
];

const spatialTerms = [
  "TRUST",
  "STRATEGY",
  "CULTURE",
  "ALIGNMENT",
  "INTELLIGENCE",
  "LEADERSHIP",
  "JUDGEMENT",
  "DISCRETION",
  "PRECISION",
  "PARTNERSHIP",
  "COURAGE",
  "IMPACT",
];

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

function FallbackTextOrbit({ active }: { active: number }) {
  const midpoint = Math.ceil(spatialTerms.length / 2);
  const rings = [spatialTerms.slice(0, midpoint), spatialTerms.slice(midpoint)];

  return (
    <div
      className={`fallback-text-space ${active % 2 === 0 ? "copy-left" : "copy-right"}`}
      aria-hidden="true"
    >
      {rings.map((terms, ringIndex) => (
        <div className={`fallback-text-ring ring-${ringIndex + 1}`} key={ringIndex}>
          {terms.map((term, index) => (
            <span
              key={term}
              style={
                {
                  "--orbit-start": `${(index / terms.length) * 100}%`,
                  "--orbit-delay": `${index * -2.8}s`,
                } as CSSProperties
              }
            >
              <i />
              {term}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Arrow() {
  return (
    <svg className="arrow-icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
}

export default function Home() {
  const experienceRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  useEffect(() => {
    const root = experienceRef.current;
    if (!root) return;

    const chapterEls = Array.from(root.querySelectorAll<HTMLElement>(".chapter"));

    const updateActive = () => {
      const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / total, 0), 1);
      root.style.setProperty("--page-progress", Math.max(0.04, progress).toFixed(4));

      const viewportMid = window.innerHeight / 2;
      let nextActive = 0;
      for (let i = 0; i < chapterEls.length; i += 1) {
        if (chapterEls[i].getBoundingClientRect().top <= viewportMid) {
          nextActive = i;
        }
      }
      setActive((current) => (current === nextActive ? current : nextActive));
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value ?? "";
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value ?? "";
    const interest = (form.elements.namedItem("interest") as HTMLSelectElement)?.value ?? "";

    setSubmitState({ status: "submitting" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, interest }),
      });

      const payload = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "We could not send your request just now.");
      }

      form.reset();
      setSubmitState({
        status: "success",
        message:
          payload.message ??
          "Your request has been sent. We have also created a follow-up reminder.",
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not send your request just now.",
      });
    }
  };

  return (
    <main ref={experienceRef} className="experience">
      <a className="skip-link" href="#chapter-8">Skip to contact form</a>
      <div className="scene" aria-hidden="true">
        <div className="scene-fallback" />
      </div>
      <div className="ambient" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <FallbackTextOrbit active={active} />

      <header className="site-header">
        <a className="brand" href="#chapter-1" aria-label="Bravero home">
          BRAVERO<span>.AI</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#chapter-2">About</a>
          <a href="#chapter-3">Approach</a>
          <a href="#chapter-4">Expertise</a>
          <a className="nav-cta" href="#chapter-8">
            <span className="nav-cta-full">Discuss a mandate</span>
            <span className="nav-cta-short">Contact</span> <Arrow />
          </a>
        </nav>
      </header>

      <aside className="chapter-rail" aria-label="Page sections">
        <span className="rail-label">{String(active + 1).padStart(2, "0")}</span>
        <div className="rail-track">
          <i />
        </div>
        <span className="rail-label">08</span>
      </aside>

      {active < 7 ? (
        <div className="scroll-cue" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span>
          <i />
        </div>
      ) : null}

      <section id="chapter-1" className={`chapter hero ${active === 0 ? "is-active" : ""}`}>
        <div className="chapter-copy align-left">
          <p className="eyebrow">SENIOR-LED EXECUTIVE SEARCH - INDIA &amp; GLOBAL MARKETS</p>
          <h1>
            Find the leader
            <span>your next chapter demands.</span>
          </h1>
          <p className="lead">
            Executive search for C-suite, GCC and business leadership appointments where the right decision changes what comes next.
          </p>
          <div className="hero-actions">
            <a className="primary-cta" href="#chapter-8">
              Discuss a leadership mandate <Arrow />
            </a>
            <a className="secondary-cta" href="#chapter-3">Explore our approach <Arrow /></a>
          </div>
        </div>
        <div className="hero-proof">
          <strong>40+</strong>
          <span>YEARS IN EXECUTIVE SEARCH &amp; ADVISORY</span>
        </div>
      </section>

      <section id="chapter-2" className={`chapter ${active === 1 ? "is-active" : ""}`}>
        <div className="chapter-copy align-left">
          <p className="eyebrow">01 - OUR PERSPECTIVE</p>
          <h2>
            Four decades of judgement.
            <span>One uncompromising standard.</span>
          </h2>
          <p className="lead">
            We identify, engage and secure transformational leadership talent across India and global markets—with discretion, precision and deep market intelligence.
          </p>
          <div className="signature-row">
            <span>TRUST</span><span>CONFIDENTIALITY</span><span>PRECISION</span><span>PARTNERSHIP</span>
          </div>
        </div>
      </section>

      <section id="chapter-3" className={`chapter ${active === 2 ? "is-active" : ""}`}>
        <div className="chapter-copy align-left compact">
          <p className="eyebrow">02 - EXECUTIVE SEARCH ADVISORY</p>
          <h2>
            Search, treated as
            <span>a strategic decision.</span>
          </h2>
          <p className="lead">A senior-led, research-driven system from mandate to appointment.</p>
          <div className="process-grid">
            {PROCESS_STEPS.map((item, index) => (
              <div key={item}><small>{String(index + 1).padStart(2, "0")}</small><span>{item}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section id="chapter-4" className={`chapter ${active === 3 ? "is-active" : ""}`}>
        <div className="chapter-copy align-left wide">
          <p className="eyebrow">03 - LEADERSHIP EXPERTISE</p>
          <h2>
            Leadership for the
            <span>moments that matter.</span>
          </h2>
          <div className="role-cloud">
            {LEADERSHIP_ROLES.map((role) => <span key={role}>{role}</span>)}
          </div>
          <p className="sector-line"><strong>SECTOR FOCUS</strong> TECHNOLOGY - GCCs - ITES - PHARMA - MANUFACTURING - ENGINEERING - EPC</p>
        </div>
      </section>

      <section id="chapter-5" className={`chapter ${active === 4 ? "is-active" : ""}`}>
        <div className="chapter-copy align-left wide">
          <p className="eyebrow">04 - OUR ENGAGEMENT MODEL</p>
          <h2>
            The right leader aligns
            <span>on every dimension.</span>
          </h2>
          <div className="alignment-list">
            <article><b>01</b><div><h3>Strategic Role</h3><p>Capability aligned to measurable business outcomes.</p></div></article>
            <article><b>02</b><div><h3>Culture</h3><p>Leadership philosophy aligned to values and ambition.</p></div></article>
            <article><b>03</b><div><h3>Stakeholders</h3><p>Trust built across Boards, CEOs, CHROs and teams.</p></div></article>
          </div>
        </div>
      </section>

      <section id="chapter-6" className={`chapter ${active === 5 ? "is-active" : ""}`}>
        <div className="chapter-copy align-left proof-copy">
          <p className="eyebrow">05 - WHY BRAVERO</p>
          <h2>
            Built on trust.
            <span>Proven through outcomes.</span>
          </h2>
          <p className="lead proof-intro">A senior-led approach for high-stakes appointments, grounded in research, discretion and long-term partnership.</p>
          <div className="big-number">40<span>+</span></div>
          <ul className="proof-list">
            <li>Confidential mandates</li>
            <li>Deep sector intelligence</li>
            <li>Senior executive network</li>
            <li>Research-led market mapping</li>
            <li>Long-term partnerships</li>
          </ul>
        </div>
      </section>

      <section id="chapter-7" className={`chapter ${active === 6 ? "is-active" : ""}`}>
        <div className="chapter-copy align-left wide">
          <p className="eyebrow">06 - PARTNER WITH US</p>
          <h2>
            Your next leadership
            <span>decision starts here.</span>
          </h2>
          <div className="decision-grid">
            {DECISION_ITEMS.map((item) => (
              <a key={item} href="#chapter-8">{item} <Arrow /></a>
            ))}
          </div>
        </div>
      </section>

      <section id="chapter-8" className={`chapter contact ${active === 7 ? "is-active" : ""}`}>
        <div className="chapter-copy align-left contact-copy">
          <p className="eyebrow">07 - CONFIDENTIAL CONVERSATION</p>
          <h2>
            Tell us about your
            <span>leadership mandate.</span>
          </h2>
          <p className="contact-intro">Your enquiry goes directly to the Bravero team and is treated as confidential.</p>
          <form onSubmit={submitContact}>
            <label><span>FULL NAME</span><input name="name" autoComplete="name" placeholder="Your name" required /></label>
            <label><span>CORPORATE EMAIL</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></label>
            <label className="full-field">
              <span>I AM LOOKING FOR</span>
              <select name="interest" defaultValue="" required>
                <option value="" disabled>Select an option</option>
                <option>Executive Search Services</option>
                <option>Leadership Hiring</option>
                <option>Building a GCC Leadership Team</option>
                <option>Career Opportunities</option>
              </select>
            </label>
            <button
              type="submit"
              className="primary-cta full-field"
              disabled={submitState.status === "submitting"}
            >
              {submitState.status === "submitting" ? "Sending request..." : "Send confidential enquiry"} <Arrow />
            </button>
          </form>
          {submitState.status === "success" || submitState.status === "error" ? (
            <p className={`form-status ${submitState.status}`} role="status" aria-live="polite">
              {submitState.message}
            </p>
          ) : null}
        </div>
        <footer>
          <span>EXECUTIVE SEARCH - LEADERSHIP ADVISORY - STRATEGIC TALENT PARTNERSHIPS</span>
        </footer>
      </section>
    </main>
  );
}
