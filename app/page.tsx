"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
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

const spawnedTerms = [
  ["COURAGE", "CLARITY", "JUDGEMENT", "TRUST", "FUTURE", "IMPACT"],
  ["DISCRETION", "PRECISION", "PARTNERSHIP", "INDIA", "GLOBAL", "INSIGHT"],
  ["UNDERSTAND", "MAP", "ENGAGE", "ASSESS", "ALIGN", "APPOINT"],
  ["CEO", "BOARD", "C-SUITE", "TRANSFORMATION", "GROWTH", "LEADERSHIP"],
  ["STRATEGY", "CULTURE", "STAKEHOLDERS", "VALUES", "AMBITION", "OUTCOMES"],
  ["NETWORK", "INTELLIGENCE", "RESEARCH", "CONFIDENCE", "40+ YEARS", "TRUST"],
  ["MISSION-CRITICAL", "GCC", "SUCCESSION", "SCALE", "DECISION", "MOMENTUM"],
  ["CONFIDENTIAL", "CONVERSATION", "PARTNERSHIP", "BEGIN", "TOGETHER", "NEXT"],
];

const spawnLayout = [
  { x: -15, y: -25, z: 90, scale: 0.82, rotate: -4 },
  { x: 17, y: -18, z: -120, scale: 0.68, rotate: 3 },
  { x: -20, y: 2, z: -40, scale: 0.74, rotate: -2 },
  { x: 21, y: 8, z: 120, scale: 1, rotate: 4 },
  { x: -12, y: 25, z: 30, scale: 0.88, rotate: 2 },
  { x: 15, y: 27, z: -90, scale: 0.7, rotate: -3 },
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

function HandshakeSculpture({ progress, active }: { progress: number; active: number }) {
  const sculpture = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const cameraTarget = useRef(new THREE.Vector3());
  const loadedTexture = useLoader(THREE.TextureLoader, "/bravero-handshake.png");
  const texture = useMemo(() => {
    const configuredTexture = loadedTexture.clone();
    configuredTexture.colorSpace = THREE.SRGBColorSpace;
    configuredTexture.anisotropy = 8;
    configuredTexture.needsUpdate = true;
    return configuredTexture;
  }, [loadedTexture]);
  const reliefGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(6.35, 4.24, 88, 60);
    const positions = geometry.attributes.position;

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      const palmRelief = Math.exp(-Math.pow(x / 1.72, 4) - Math.pow((y + 0.08) / 0.76, 4));
      const upperRelief = Math.exp(-Math.pow(x / 2.45, 6) - Math.pow((y - 0.2) / 1.2, 4));
      const cuffRelief = Math.exp(-Math.pow((Math.abs(x) - 2.25) / 0.78, 4) - Math.pow(y / 1.08, 4));
      positions.setZ(index, palmRelief * 0.32 + upperRelief * 0.12 + cuffRelief * 0.08);
    }

    geometry.computeVertexNormals();
    return geometry;
  }, []);

  useFrame(({ clock, camera }, delta) => {
    if (!sculpture.current || !orbit.current) return;
    const time = clock.getElapsedTime();
    const cameraArc = progress * Math.PI * 4.6 - Math.PI * 0.35;
    const desiredY = Math.sin(cameraArc) * 0.18;
    const desiredX = Math.cos(cameraArc * 0.72) * 0.075 - 0.025;
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
    sculpture.current.rotation.z = Math.sin(time * 0.42) * 0.018 + (active % 2 === 0 ? -0.012 : 0.012);
    sculpture.current.position.y = Math.sin(time * 0.7) * 0.055;
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
    orbit.current.rotation.y = Math.sin(progress * Math.PI * 2) * 0.18;

    const cameraX = desiredOffset * 0.24 + Math.sin(cameraArc) * 1.18;
    const cameraY = Math.cos(cameraArc * 0.78) * 0.46;
    const cameraZ = 7.15 + Math.cos(cameraArc) * 0.62;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, cameraX, 2.4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraY, 2.4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraZ, 2.4, delta);
    cameraTarget.current.x = THREE.MathUtils.damp(
      cameraTarget.current.x,
      desiredOffset * 0.5,
      2.8,
      delta,
    );
    cameraTarget.current.y = THREE.MathUtils.damp(
      cameraTarget.current.y,
      Math.sin(cameraArc * 0.55) * 0.08,
      2.8,
      delta,
    );
    cameraTarget.current.z = 0.08;
    camera.lookAt(cameraTarget.current);
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

      <group ref={sculpture} scale={1.06}>
        <mesh geometry={reliefGeometry} position={[0.05, -0.08, -0.16]} scale={[1.035, 1.035, 1]}>
          <meshBasicMaterial
            map={texture}
            color="#07080b"
            transparent
            opacity={0.62}
            alphaTest={0.02}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        <mesh geometry={reliefGeometry} position={[0, 0, 0.02]}>
          <meshBasicMaterial
            map={texture}
            transparent
            alphaTest={0.02}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        <mesh geometry={reliefGeometry} position={[-0.035, 0.035, 0.07]} scale={[0.995, 0.995, 1]}>
          <meshBasicMaterial
            map={texture}
            color="#f8ddb0"
            transparent
            opacity={0.1}
            alphaTest={0.06}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
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
      <Suspense fallback={null}>
        <HandshakeSculpture progress={progress} active={active} />
      </Suspense>
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

function SpawnedTerms({ active }: { active: number }) {
  return (
    <div className="spawn-field" aria-hidden="true">
      <div className="spawn-field-depth" key={active}>
        {spawnedTerms[active].map((term, index) => {
          const point = spawnLayout[index];
          return (
            <span
              className="spawn-token"
              key={`${active}-${term}`}
              style={
                {
                  "--spawn-x": `${point.x}vw`,
                  "--spawn-y": `${point.y}vh`,
                  "--spawn-z": `${point.z}px`,
                  "--spawn-scale": point.scale,
                  "--spawn-rotate": `${point.rotate}deg`,
                  "--spawn-delay": `${150 + index * 115}ms`,
                } as React.CSSProperties
              }
            >
              <i />
              <b>{term}</b>
            </span>
          );
        })}
      </div>
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
    const frame = window.requestAnimationFrame(() => {
      try {
        const canvas = document.createElement("canvas");
        const context =
          canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
          canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
        if (!context || context.isContextLost()) {
          setWebglReady(false);
          return;
        }
        const renderer = String(context.getParameter(context.RENDERER) ?? "");
        context.getExtension("WEBGL_lose_context")?.loseContext();
        setWebglReady(Boolean(renderer) && !renderer.toLowerCase().includes("disabled"));
      } catch {
        setWebglReady(false);
      }
    });
    return () => window.cancelAnimationFrame(frame);
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

  const sceneShift = active === 0 ? "12vw" : active % 2 === 1 ? "-13vw" : "13vw";
  const fallbackArc = progress * Math.PI * 4.6 - Math.PI * 0.35;

  return (
    <main
      className="experience"
      style={
        {
          "--scene-shift": sceneShift,
          "--fallback-pan-x": `${Math.sin(fallbackArc) * 2.6}vw`,
          "--fallback-pan-y": `${Math.cos(fallbackArc * 0.78) * 1.35}vh`,
          "--fallback-scale": 1 + Math.cos(fallbackArc) * 0.025,
          "--fallback-rotate": `${Math.sin(fallbackArc) * 1.1}deg`,
        } as React.CSSProperties
      }
    >
      <div
        className={`scene ${webglReady ? "has-webgl" : ""}`}
        aria-label="Interactive metallic handshake sculpture"
      >
        <div className="scene-fallback" aria-hidden="true" />
        {webglReady ? <Scene progress={progress} active={active} /> : null}
      </div>
      <div className="ambient" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <OrbitingTerms progress={progress} />
      <SpawnedTerms active={active} />

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
