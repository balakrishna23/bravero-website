"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  FormEvent,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
  "JUDGEMENT",
  "DISCRETION",
  "PRECISION",
  "PARTNERSHIP",
  "COURAGE",
  "IMPACT",
];

function makeTextTexture(label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(214, 177, 113, 0.72)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(18, 64);
  context.lineTo(94, 64);
  context.stroke();
  context.fillStyle = "rgba(241, 234, 220, 0.96)";
  context.font = "600 38px Arial, sans-serif";
  context.textBaseline = "middle";
  context.fillText(label, 118, 66);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

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
  const modelGroup = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const textOrbit = useRef<THREE.Group>(null);
  const textSprites = useRef<Array<THREE.Sprite | null>>([]);
  const cameraTarget = useRef(new THREE.Vector3());
  const gltf = useLoader(GLTFLoader, "/bravero-handshake-sculpted.glb");
  const handshakeScene = useMemo(() => {
    const scene = gltf.scene.clone(true);

    ["Cube_21", "Cube001_51", "Cube.001_51"].forEach((name) => {
      scene.getObjectByName(name)?.removeFromParent();
    });

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const source = child.material as THREE.MeshStandardMaterial;
      const isCuff = source.name === "Material.012" || source.name === "Material";
      const isPlatinumHand = source.name === "Material.004";
      const material = new THREE.MeshPhysicalMaterial({
        color: isCuff ? "#111319" : isPlatinumHand ? "#d5d9dc" : "#b8752d",
        metalness: isCuff ? 0.72 : 0.84,
        roughness: isCuff ? 0.24 : 0.2,
        clearcoat: isCuff ? 0.9 : 0.58,
        clearcoatRoughness: 0.16,
        envMapIntensity: 1.45,
      });
      child.material = material;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    return scene;
  }, [gltf.scene]);

  useLayoutEffect(() => {
    const group = modelGroup.current;
    if (!group) return;

    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);
    group.scale.set(1, 1, 1);
    handshakeScene.position.set(0, 0, 0);
    group.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(group);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z);

    handshakeScene.position.copy(center).multiplyScalar(-1);
    group.scale.setScalar(4.95 / longestSide);
    group.rotation.set(0.08, Math.PI / 2, -0.04);
    group.updateMatrixWorld(true);
  }, [handshakeScene]);

  const textTextures = useMemo(
    () => spatialTerms.map((term) => makeTextTexture(term)),
    [],
  );

  useFrame(({ clock, camera, pointer }, delta) => {
    if (!modelGroup.current || !orbit.current || !textOrbit.current) return;
    const time = clock.getElapsedTime();
    const cameraArc = progress * Math.PI * 4.6 - Math.PI * 0.35;
    const desiredY = Math.PI / 2 + time * 0.22 + progress * Math.PI * 3.2 + pointer.x * 0.18;
    const desiredX = 0.08 + Math.sin(time * 0.31 + progress * Math.PI * 2.1) * 0.2 - pointer.y * 0.12;
    modelGroup.current.rotation.y = THREE.MathUtils.damp(
      modelGroup.current.rotation.y,
      desiredY,
      2.7,
      delta,
    );
    modelGroup.current.rotation.x = THREE.MathUtils.damp(
      modelGroup.current.rotation.x,
      desiredX,
      2.7,
      delta,
    );
    modelGroup.current.rotation.z = THREE.MathUtils.damp(
      modelGroup.current.rotation.z,
      -0.04 + Math.sin(time * 0.38 + progress * Math.PI) * 0.07,
      2.7,
      delta,
    );
    const desiredOffset = active === 0 ? 0.68 : active % 2 === 1 ? -0.92 : 0.92;
    modelGroup.current.position.x = THREE.MathUtils.damp(
      modelGroup.current.position.x,
      desiredOffset + pointer.x * 0.12,
      2.7,
      delta,
    );
    modelGroup.current.position.y = THREE.MathUtils.damp(
      modelGroup.current.position.y,
      Math.sin(time * 0.64) * 0.09 + pointer.y * 0.07,
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
    textOrbit.current.position.x = THREE.MathUtils.damp(
      textOrbit.current.position.x,
      desiredOffset,
      2.7,
      delta,
    );

    textSprites.current.forEach((sprite, index) => {
      if (!sprite) return;
      const angle = time * 0.18 + progress * Math.PI * 0.8 + (index / spatialTerms.length) * Math.PI * 2;
      const depth = (Math.sin(angle) + 1) / 2;
      const radius = 3.05 + (index % 3) * 0.22;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle * 1.62 + index * 0.43) * (1.25 + (index % 2) * 0.34);
      const z = Math.sin(angle) * 1.46;
      const scale = 0.62 + depth * 0.48;
      const width = Math.min(2.35, 0.96 + spatialTerms[index].length * 0.105);

      sprite.position.set(x, y, z);
      sprite.scale.set(width * scale, 0.34 * scale, 1);
      const material = sprite.material as THREE.SpriteMaterial;
      material.opacity = 0.15 + depth * 0.7;
      material.color.set(depth > 0.54 ? "#f1eadc" : "#8e8375");
    });

    const cameraX = desiredOffset * 0.2 + Math.sin(cameraArc) * 0.52;
    const cameraY = Math.cos(cameraArc * 0.78) * 0.3;
    const cameraZ = 7.35 + Math.cos(cameraArc) * 0.3;
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

      <group ref={textOrbit}>
        {textTextures.map((map, index) =>
          map ? (
            <sprite
              key={spatialTerms[index]}
              ref={(sprite) => {
                textSprites.current[index] = sprite;
              }}
            >
              <spriteMaterial
                map={map}
                transparent
                opacity={0}
                depthTest
                depthWrite={false}
                toneMapped={false}
              />
            </sprite>
          ) : null,
        )}
      </group>

      <group ref={modelGroup} name="modelGroup">
        <primitive object={handshakeScene} />
      </group>
    </>
  );
}

function Scene({ progress, active }: { progress: number; active: number }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 7.4], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      shadows
    >
      <fog attach="fog" args={["#06070b", 7.5, 13]} />
      <hemisphereLight args={["#dce9f2", "#2b1608", 1.15]} />
      <directionalLight position={[-4, 5, 5]} intensity={4.8} color="#ffd39a" castShadow />
      <directionalLight position={[4, -1, 3]} intensity={3.8} color="#c7e3f2" />
      <spotLight position={[0, 5, -4]} intensity={14} angle={0.48} penumbra={0.8} color="#f3c477" />
      <pointLight position={[0, -2, 4]} intensity={6} distance={10} color="#8d552e" />
      <Suspense fallback={null}>
        <HandshakeSculpture progress={progress} active={active} />
      </Suspense>
    </Canvas>
  );
}

function FallbackTextOrbit() {
  const midpoint = Math.ceil(spatialTerms.length / 2);
  const rings = [spatialTerms.slice(0, midpoint), spatialTerms.slice(midpoint)];

  return (
    <div className="fallback-text-space" aria-hidden="true">
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
      {!webglReady ? <FallbackTextOrbit /> : null}

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
        <footer>
          <span>EXECUTIVE SEARCH · LEADERSHIP ADVISORY · STRATEGIC TALENT PARTNERSHIPS</span>
          <a
            href="https://sketchfab.com/3d-models/handshake-ramadhan-series-a784711be28440a1b0251cc21d904202"
            target="_blank"
            rel="noreferrer"
          >
            3D HANDSHAKE · HANDOKO BINTORO · CC BY
          </a>
        </footer>
      </section>
    </main>
  );
}
