"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

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

const orbitTerms = [
  "TRUST",
  "STRATEGY",
  "CULTURE",
  "ALIGNMENT",
  "INTELLIGENCE",
  "LEADERSHIP",
];

function Stars() {
  const positions = useMemo(() => {
    const values = new Float32Array(180);
    for (let index = 0; index < values.length; index += 3) {
      const seed = index * 13.37;
      values[index] = Math.sin(seed) * 7;
      values[index + 1] = Math.cos(seed * 0.73) * 4.5;
      values[index + 2] = -1.5 - ((index * 0.17) % 4);
    }
    return values;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c8a86b" size={0.018} transparent opacity={0.45} />
    </points>
  );
}

function Finger({
  position,
  rotation,
  color,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <capsuleGeometry args={[0.12, 0.68, 10, 18]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.92}
        roughness={0.18}
        clearcoat={1}
        clearcoatRoughness={0.12}
      />
    </mesh>
  );
}

function HandshakeSculpture({ progress, active }: { progress: number; active: number }) {
  const sculpture = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const gold = "#d1a35d";
  const platinum = "#b9c4c8";

  useFrame(({ clock, camera }, delta) => {
    if (!sculpture.current || !orbit.current) return;
    const time = clock.getElapsedTime();
    const desiredY = -0.42 + progress * Math.PI * 1.18;
    const desiredX = Math.sin(progress * Math.PI * 2.2) * 0.16 - 0.08;
    sculpture.current.rotation.y = THREE.MathUtils.damp(
      sculpture.current.rotation.y,
      desiredY,
      3.1,
      delta,
    );
    sculpture.current.rotation.x = THREE.MathUtils.damp(
      sculpture.current.rotation.x,
      desiredX,
      3.1,
      delta,
    );
    sculpture.current.rotation.z = Math.sin(time * 0.42) * 0.025;
    sculpture.current.position.y = Math.sin(time * 0.7) * 0.07;
    const desiredOffset = active === 0 ? 0.72 : active % 2 === 1 ? -1.05 : 1.05;
    sculpture.current.position.x = THREE.MathUtils.damp(
      sculpture.current.position.x,
      desiredOffset,
      2.7,
      delta,
    );
    orbit.current.position.x = THREE.MathUtils.damp(
      orbit.current.position.x,
      desiredOffset * 0.35,
      2.2,
      delta,
    );
    orbit.current.rotation.z = time * 0.055 + progress * Math.PI * 0.8;
    orbit.current.rotation.y = progress * Math.PI * 0.35;

    const cameraX = Math.sin(progress * Math.PI * 2) * 0.42;
    const cameraY = Math.cos(progress * Math.PI * 1.6) * 0.16;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, cameraX, 2.4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraY, 2.4, delta);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <Stars />
      <group ref={orbit}>
        <mesh rotation={[Math.PI / 2.4, 0.18, 0]}>
          <torusGeometry args={[3.15, 0.008, 8, 180]} />
          <meshBasicMaterial color="#9c6d3c" transparent opacity={0.48} />
        </mesh>
        <mesh rotation={[Math.PI / 2.08, -0.5, Math.PI / 3]}>
          <torusGeometry args={[2.65, 0.004, 8, 180]} />
          <meshBasicMaterial color="#d9c295" transparent opacity={0.24} />
        </mesh>
      </group>

      <group ref={sculpture} scale={1.08}>
        <mesh position={[-2.2, 0.33, 0.06]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.58, 0.78, 2.55, 32]} />
          <meshPhysicalMaterial color="#080b13" metalness={0.68} roughness={0.26} />
        </mesh>
        <mesh position={[2.2, -0.26, -0.04]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.58, 0.78, 2.55, 32]} />
          <meshPhysicalMaterial color="#10141d" metalness={0.72} roughness={0.23} />
        </mesh>

        <mesh position={[-1.02, 0.24, 0.05]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.64, 0.59, 0.42, 32]} />
          <meshPhysicalMaterial color="#ece2cd" metalness={0.34} roughness={0.24} />
        </mesh>
        <mesh position={[1.02, -0.17, -0.04]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.64, 0.59, 0.42, 32]} />
          <meshPhysicalMaterial color="#d7dde0" metalness={0.48} roughness={0.2} />
        </mesh>

        <mesh position={[-0.42, 0.08, 0.12]} rotation={[0.05, 0.08, -0.25]} scale={[1.25, 0.68, 0.82]} castShadow>
          <sphereGeometry args={[0.58, 40, 28]} />
          <meshPhysicalMaterial color={gold} metalness={0.94} roughness={0.16} clearcoat={1} />
        </mesh>
        <mesh position={[0.42, -0.04, -0.12]} rotation={[-0.05, -0.08, -0.25]} scale={[1.25, 0.68, 0.82]} castShadow>
          <sphereGeometry args={[0.58, 40, 28]} />
          <meshPhysicalMaterial color={platinum} metalness={0.96} roughness={0.14} clearcoat={1} />
        </mesh>

        {[-0.34, -0.12, 0.1, 0.32].map((offset, index) => (
          <Finger
            key={`gold-${offset}`}
            position={[0.12 + index * 0.08, -0.34 + index * 0.055, 0.34 + offset]}
            rotation={[0.08, 0.18, -1.02]}
            color={gold}
          />
        ))}
        {[-0.34, -0.12, 0.1, 0.32].map((offset, index) => (
          <Finger
            key={`silver-${offset}`}
            position={[-0.08 - index * 0.075, 0.33 - index * 0.05, -0.34 - offset]}
            rotation={[-0.08, -0.18, 1.02]}
            color={platinum}
          />
        ))}

        <Finger position={[-0.04, 0.35, 0.42]} rotation={[0.32, 0.2, -0.62]} color={gold} />
        <Finger position={[0.04, -0.28, -0.42]} rotation={[-0.32, -0.2, -0.62]} color={platinum} />

        <mesh position={[0, -1.73, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.22, 0.035, 12, 96]} />
          <meshStandardMaterial color="#af7d43" emissive="#6a3c1d" emissiveIntensity={1.1} />
        </mesh>
        <mesh position={[0, -1.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.05, 64]} />
          <meshStandardMaterial color="#080a10" metalness={0.9} roughness={0.24} />
        </mesh>
      </group>
    </>
  );
}

function Scene({ progress, active }: { progress: number; active: number }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 7.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={["#06070b", 7.5, 13]} />
      <ambientLight intensity={0.72} color="#a5b0bd" />
      <directionalLight position={[-4, 5, 5]} intensity={4.1} color="#ffd79c" castShadow />
      <directionalLight position={[4, -1, 3]} intensity={3.4} color="#b8d9ee" />
      <pointLight position={[0, 1, 4]} intensity={8} distance={10} color="#9d6a35" />
      <HandshakeSculpture progress={progress} active={active} />
    </Canvas>
  );
}

function OrbitingTerms({ progress }: { progress: number }) {
  return (
    <div className="orbit-copy" aria-hidden="true">
      {orbitTerms.map((term, index) => {
        const angle = (index / orbitTerms.length) * Math.PI * 2 + progress * Math.PI * 1.45;
        const x = Math.cos(angle) * 38;
        const y = Math.sin(angle) * 31;
        const depth = (Math.sin(angle) + 1) / 2;
        return (
          <span
            key={term}
            style={
              {
                "--orbit-x": `${x}vw`,
                "--orbit-y": `${y}vh`,
                "--orbit-scale": 0.72 + depth * 0.48,
                "--orbit-opacity": 0.16 + depth * 0.64,
              } as React.CSSProperties
            }
          >
            {term}
          </span>
        );
      })}
    </div>
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const context =
        canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
        canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
      setWebglReady(Boolean(context));
    } catch {
      setWebglReady(false);
    }
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const nextProgress = Math.min(Math.max(window.scrollY / total, 0), 1);
      setProgress(nextProgress);
      setActive(Math.min(chapters.length - 1, Math.round(window.scrollY / window.innerHeight)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const jumpTo = (index: number) => {
    document.getElementById(`chapter-${index + 1}`)?.scrollIntoView({ behavior: "smooth" });
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="experience">
      <div
        className={`scene ${webglReady ? "has-webgl" : ""}`}
        aria-label="Interactive metallic handshake sculpture"
        style={
          {
            "--scene-shift": active === 0 ? "12vw" : active % 2 === 1 ? "-13vw" : "13vw",
          } as React.CSSProperties
        }
      >
        <div className="scene-fallback" aria-hidden="true" />
        {webglReady ? <Scene progress={progress} active={active} /> : null}
      </div>
      <div className="ambient" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <OrbitingTerms progress={progress} />

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
          <i style={{ height: `${Math.max(4, progress * 100)}%` }} />
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
        <footer>EXECUTIVE SEARCH · LEADERSHIP ADVISORY · STRATEGIC TALENT PARTNERSHIPS</footer>
      </section>
    </main>
  );
}
