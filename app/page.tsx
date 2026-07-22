"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const chapters = [
  "The Partnership",
  "Our Perspective",
  "The Search System",
  "Leadership Expertise",
  "Three Alignments",
  "Why Bravero",
  "Decision Moments",
  "Confidential Conversation",
];

const spatialTerms = [
  "TRUST",
  "STRATEGY",
  "CULTURE",
  "ALIGNMENT",
  "INTELLIGENCE",
  "LEADERSHIP",
  "INSIGHT",
  "DISCRETION",
  "PRECISION",
  "PARTNERSHIP",
  "COURAGE",
  "IMPACT",
];

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
                } as React.CSSProperties
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
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const experienceRef = useRef<HTMLElement>(null);
  const motionRef = useRef({
    current: {
      progress: 0.04,
      shift: 12,
      panX: 0,
      panY: 0,
      scale: 1,
      rotate: 0,
      yaw: 0,
      pitch: 0,
      pointerYaw: 0,
      pointerPitch: 0,
      pointerPanX: 0,
      pointerPanY: 0,
    },
    target: {
      progress: 0.04,
      shift: 12,
      panX: 0,
      panY: 0,
      scale: 1,
      rotate: 0,
      yaw: 0,
      pitch: 0,
      pointerYaw: 0,
      pointerPitch: 0,
      pointerPanX: 0,
      pointerPanY: 0,
    },
  });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = experienceRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const keys = [
      "progress",
      "shift",
      "panX",
      "panY",
      "scale",
      "rotate",
      "yaw",
      "pitch",
      "pointerYaw",
      "pointerPitch",
      "pointerPanX",
      "pointerPanY",
    ] as const;
    let animationFrame = 0;
    let lastTime = performance.now();

    const updateTargets = () => {
      const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const nextProgress = Math.min(Math.max(window.scrollY / total, 0), 1);
      const nextActive = Math.min(
        chapters.length - 1,
        Math.round(window.scrollY / window.innerHeight),
      );
      const arc = nextProgress * Math.PI * 4.6 - Math.PI * 0.35;
      const target = motionRef.current.target;

      target.progress = Math.max(0.04, nextProgress);
      target.shift = nextActive === 0 ? 12 : nextActive % 2 === 1 ? -13 : 13;
      target.panX = Math.sin(arc) * 2.35;
      target.panY = Math.cos(arc * 0.78) * 1.1;
      target.scale = 1 + Math.cos(arc) * 0.018;
      target.rotate = Math.sin(arc) * 0.75;
      target.yaw = Math.sin(arc * 0.68) * 5.4;
      target.pitch = Math.cos(arc * 0.52) * 2.2;
      setActive((current) => (current === nextActive ? current : nextActive));
    };

    const renderMotion = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const ease = reducedMotion ? 1 : 1 - Math.exp(-delta * 5.4);
      const { current, target } = motionRef.current;

      keys.forEach((key) => {
        current[key] += (target[key] - current[key]) * ease;
      });

      const floatY = reducedMotion ? 0 : Math.sin(time * 0.00072) * 3.5;
      root.style.setProperty("--page-progress", current.progress.toFixed(4));
      root.style.setProperty("--scene-shift", `${current.shift.toFixed(3)}vw`);
      root.style.setProperty("--fallback-pan-x", `${current.panX.toFixed(3)}vw`);
      root.style.setProperty("--fallback-pan-y", `${current.panY.toFixed(3)}vh`);
      root.style.setProperty("--fallback-scale", current.scale.toFixed(5));
      root.style.setProperty("--fallback-rotate", `${current.rotate.toFixed(3)}deg`);
      root.style.setProperty("--asset-yaw", `${current.yaw.toFixed(3)}deg`);
      root.style.setProperty("--asset-pitch", `${current.pitch.toFixed(3)}deg`);
      root.style.setProperty("--pointer-yaw", `${current.pointerYaw.toFixed(3)}deg`);
      root.style.setProperty("--pointer-pitch", `${current.pointerPitch.toFixed(3)}deg`);
      root.style.setProperty("--pointer-pan-x", `${current.pointerPanX.toFixed(3)}vw`);
      root.style.setProperty("--pointer-pan-y", `${current.pointerPanY.toFixed(3)}vh`);
      root.style.setProperty("--float-y", `${floatY.toFixed(2)}px`);
      animationFrame = window.requestAnimationFrame(renderMotion);
    };

    updateTargets();
    Object.assign(motionRef.current.current, motionRef.current.target);
    animationFrame = window.requestAnimationFrame(renderMotion);
    window.addEventListener("scroll", updateTargets, { passive: true });
    window.addEventListener("resize", updateTargets);
    return () => {
      window.removeEventListener("scroll", updateTargets);
      window.removeEventListener("resize", updateTargets);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const jumpTo = (index: number) => {
    document.getElementById(`chapter-${index + 1}`)?.scrollIntoView({ behavior: "smooth" });
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main
      ref={experienceRef}
      className="experience"
      onPointerMove={(event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        const target = motionRef.current.target;
        target.pointerYaw = x * 3.8;
        target.pointerPitch = y * -2.4;
        target.pointerPanX = x * 0.38;
        target.pointerPanY = y * 0.3;
      }}
      onPointerLeave={() => {
        const target = motionRef.current.target;
        target.pointerYaw = 0;
        target.pointerPitch = 0;
        target.pointerPanX = 0;
        target.pointerPanY = 0;
      }}
    >
      <div className="scene" aria-label="Detailed midnight-blue and platinum handshake">
        <div className="scene-fallback" aria-hidden="true" />
      </div>
      <div className="ambient" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <FallbackTextOrbit active={active} />

      <header className="site-header">
        <button className="brand" onClick={() => jumpTo(0)} aria-label="Bravero home">
          BRAVERO<span>.AI</span>
        </button>
        <nav aria-label="Primary navigation">
          <button onClick={() => jumpTo(1)}>About</button>
          <button onClick={() => jumpTo(2)}>Search</button>
          <button onClick={() => jumpTo(3)}>Expertise</button>
          <button className="nav-cta" onClick={() => jumpTo(7)}>
            Start a conversation <Arrow />
          </button>
        </nav>
      </header>

      <aside className="chapter-rail" aria-label="Page sections">
        <span className="rail-label">{String(active + 1).padStart(2, "0")}</span>
        <div className="rail-track">
          <i />
        </div>
        <span className="rail-label">08</span>
      </aside>

      <div className="scroll-cue" aria-hidden="true">
        <span>SCROLL TO EXPLORE</span>
        <i />
      </div>

      <section id="chapter-1" className={`chapter hero ${active === 0 ? "is-active" : ""}`}>
        <div className="chapter-copy align-left">
          <p className="eyebrow">EXECUTIVE SEARCH · LEADERSHIP ADVISORY</p>
          <h1>
            Exceptional leaders
            <span>shape what comes next.</span>
          </h1>
          <p className="lead">
            Strategic talent partnerships for the leadership decisions that define an organisation&apos;s future.
          </p>
          <button className="primary-cta" onClick={() => jumpTo(7)}>
            Begin a confidential conversation <Arrow />
          </button>
        </div>
        <div className="hero-proof">
          <strong>40+</strong>
          <span>YEARS OF CUMULATIVE EXPERIENCE</span>
        </div>
      </section>

      <section id="chapter-2" className={`chapter ${active === 1 ? "is-active" : ""}`}>
        <div className="chapter-copy align-right">
          <p className="eyebrow">01 · OUR PERSPECTIVE</p>
          <h2>
            Four decades of insight.
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
          <p className="eyebrow">02 · EXECUTIVE SEARCH ADVISORY</p>
          <h2>
            Search, treated as
            <span>a strategic decision.</span>
          </h2>
          <p className="lead">A senior-led, research-driven system from mandate to appointment.</p>
          <div className="process-grid">
            {["Understand", "Map", "Engage", "Assess", "Align", "Appoint"].map((item, index) => (
              <div key={item}><small>{String(index + 1).padStart(2, "0")}</small><span>{item}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section id="chapter-4" className={`chapter ${active === 3 ? "is-active" : ""}`}>
        <div className="chapter-copy align-right wide">
          <p className="eyebrow">03 · LEADERSHIP EXPERTISE</p>
          <h2>
            Leadership for the
            <span>moments that matter.</span>
          </h2>
          <div className="role-cloud">
            {[
              "CEO", "MD", "COO", "CTO", "CIO", "CHRO", "CFO", "GCC LEADERS",
              "BUSINESS UNIT HEADS", "DIGITAL", "PRODUCT", "OPERATIONS",
            ].map((role) => <span key={role}>{role}</span>)}
          </div>
          <p className="sector-line">TECHNOLOGY · GCCs · ITES · PHARMA · MANUFACTURING · ENGINEERING · EPC</p>
        </div>
      </section>

      <section id="chapter-5" className={`chapter ${active === 4 ? "is-active" : ""}`}>
        <div className="chapter-copy align-left wide">
          <p className="eyebrow">04 · OUR ENGAGEMENT MODEL</p>
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
        <div className="chapter-copy align-right proof-copy">
          <p className="eyebrow">05 · WHY BRAVERO</p>
          <h2>
            Built on trust.
            <span>Proven through outcomes.</span>
          </h2>
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
          <p className="eyebrow">06 · PARTNER WITH US</p>
          <h2>
            Your next leadership
            <span>decision starts here.</span>
          </h2>
          <div className="decision-grid">
            <button onClick={() => jumpTo(7)}>Appoint a C-suite executive <Arrow /></button>
            <button onClick={() => jumpTo(7)}>Strengthen the leadership bench <Arrow /></button>
            <button onClick={() => jumpTo(7)}>Build a GCC leadership team <Arrow /></button>
            <button onClick={() => jumpTo(7)}>Find mission-critical talent <Arrow /></button>
          </div>
        </div>
      </section>

      <section id="chapter-8" className={`chapter contact ${active === 7 ? "is-active" : ""}`}>
        <div className="chapter-copy align-right contact-copy">
          <p className="eyebrow">07 · CONFIDENTIAL CONVERSATION</p>
          <h2>
            Let&apos;s begin with
            <span>a conversation.</span>
          </h2>
          <form onSubmit={submitContact}>
            <label><span>FULL NAME</span><input name="name" autoComplete="name" placeholder="Your name" /></label>
            <label><span>CORPORATE EMAIL</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" /></label>
            <label className="full-field">
              <span>I AM LOOKING FOR</span>
              <select name="interest" defaultValue="">
                <option value="" disabled>Select an option</option>
                <option>Executive Search Services</option>
                <option>Leadership Hiring</option>
                <option>Building a GCC Leadership Team</option>
                <option>Career Opportunities</option>
              </select>
            </label>
            <button type="submit" className="primary-cta full-field">Connect with our team <Arrow /></button>
          </form>
        </div>
        <footer>
          <span>EXECUTIVE SEARCH · LEADERSHIP ADVISORY · STRATEGIC TALENT PARTNERSHIPS</span>
          <span>MIDNIGHT BLUE · PLATINUM · BRAVERO SIGNATURE</span>
        </footer>
      </section>
    </main>
  );
}
