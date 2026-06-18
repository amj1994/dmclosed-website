import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* ------------------------------------------------------------------
   Nav: scrolled state + mobile toggle
------------------------------------------------------------------ */
function initNav() {
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const mobile = document.querySelector("[data-nav-mobile]");
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 24) nav.setAttribute("data-scrolled", "");
    else nav.removeAttribute("data-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const open = mobile.hasAttribute("data-open");
      if (open) { mobile.removeAttribute("data-open"); toggle.setAttribute("aria-expanded", "false"); }
      else { mobile.setAttribute("data-open", ""); toggle.setAttribute("aria-expanded", "true"); }
    });
    mobile.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobile.removeAttribute("data-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }
}

/* ------------------------------------------------------------------
   THREE.js ambient field behind the hero (decorative, lazy)
------------------------------------------------------------------ */
async function initHeroThree() {
  const canvas = document.querySelector("[data-three-hero]");
  if (!canvas || reduceMotion) return;

  let THREE;
  try { THREE = await import("three"); }
  catch { return; } // fail silent — CSS gradients remain as the backdrop

  const hero = canvas.closest(".hero") || canvas.parentElement;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch { return; }
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x140a06, 0.085);

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 9;

  // --- particle shell: orange / amber points distributed in a soft sphere ---
  const COUNT = window.innerWidth < 700 ? 900 : 1700;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const cOrange = new THREE.Color(0xff6a1f);
  const cAmber = new THREE.Color(0xffb24a);
  const cEmber = new THREE.Color(0xe2391f);
  for (let i = 0; i < COUNT; i++) {
    // distribute on/near a sphere surface with some scatter, biased to the right
    const r = 4.4 + Math.pow(Math.random(), 2) * 3.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) + 1.6;
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8;
    positions[i * 3 + 2] = r * Math.cos(phi);
    const mix = Math.random();
    const c = mix < 0.6 ? cOrange : mix < 0.86 ? cAmber : cEmber;
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.055, vertexColors: true, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // a faint wireframe icosahedron core for structure
  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.6, 1)),
    new THREE.LineBasicMaterial({ color: 0xff6a1f, transparent: true, opacity: 0.08 })
  );
  wire.position.x = 1.6;
  scene.add(wire);

  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  // pointer + scroll parallax targets
  const target = { x: 0, y: 0 };
  if (finePointer) {
    window.addEventListener("pointermove", (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5);
      target.y = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });
  }
  let scrollY = 0;
  window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

  // pause when hero is offscreen
  let visible = true;
  new IntersectionObserver(
    ([entry]) => { visible = entry.isIntersecting; },
    { threshold: 0 }
  ).observe(hero);

  let rotX = 0, rotY = 0;
  function tick(time) {
    if (visible) {
      const t = time * 0.001;
      rotY += (target.x * 0.5 - rotY) * 0.04;
      rotX += (target.y * 0.3 - rotX) * 0.04;
      points.rotation.y = t * 0.05 + rotY;
      points.rotation.x = rotX;
      wire.rotation.y = -t * 0.08 + rotY * 0.6;
      wire.rotation.x = t * 0.03;
      camera.position.y = -scrollY * 0.0016;
      renderer.render(scene, camera);
    }
  }
  gsap.ticker.add(tick);
}

/* ------------------------------------------------------------------
   Magnetic buttons + subtle card tilt (fine pointer only)
------------------------------------------------------------------ */
function initMagnetic() {
  if (!finePointer || reduceMotion) return;
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = 0.32;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      gsap.to(el, { x, y, duration: 0.5, ease: "power3.out" });
    });
    el.addEventListener("pointerleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    });
  });

  document.querySelectorAll("[data-tilt]").forEach((el) => {
    el.style.transformStyle = "preserve-3d";
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotateY: px * 6, rotateX: -py * 6, duration: 0.5, ease: "power2.out", transformPerspective: 800 });
    });
    el.addEventListener("pointerleave", () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out" });
    });
  });
}

/* ------------------------------------------------------------------
   Reduced-motion: reveal everything, run nothing kinetic
------------------------------------------------------------------ */
if (reduceMotion) {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  document.querySelectorAll("[data-split] > *, [data-hero]").forEach((el) => { el.style.opacity = "1"; });
  document.querySelectorAll("[data-beat]").forEach((el) => el.classList.add("show"));
  document.querySelectorAll("[data-booked]").forEach((el) => el.classList.add("show"));
  initNav();
} else {
  gsap.registerPlugin(ScrollTrigger);

  /* ---- Lenis smooth scroll, synced to GSAP ---- */
  const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
  window.__lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // anchor links through Lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const targetEl = document.querySelector(id);
        if (targetEl) { e.preventDefault(); lenis.scrollTo(targetEl, { offset: -72 }); }
      }
    });
  });

  /* ---- Hero entrance choreography ---- */
  function playHeroEntrance() {
    const lines = gsap.utils.toArray("[data-split] > *");
    const bits = gsap.utils.toArray("[data-hero]");
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    if (lines.length) {
      gsap.set(lines, { yPercent: 110, opacity: 0 });
      tl.to(lines, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.12 }, 0.1);
    }
    bits.sort((a, b) => (+a.dataset.hero) - (+b.dataset.hero));
    bits.forEach((el, i) => {
      gsap.set(el, { y: 26, opacity: 0 });
      tl.to(el, { y: 0, opacity: 1, duration: 0.9 }, 0.35 + i * 0.1);
    });
    const frame = document.querySelector(".robot-frame");
    if (frame) {
      gsap.set(frame, { scale: 0.92, opacity: 0, filter: "blur(8px)" });
      tl.to(frame, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.3 }, 0.3);
    }
  }
  playHeroEntrance();

  /* ---- Generic reveals (tuned per element) ---- */
  document.querySelectorAll(".reveal").forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => el.classList.add("is-in"),
    });
  });

  /* ---- Proof thread: reveal beats on scroll, staggered ---- */
  const proof = document.querySelector("[data-proof-thread]");
  if (proof) {
    const beats = [...proof.querySelectorAll("[data-beat]")];
    gsap.set(beats, { autoAlpha: 0, y: 16 });
    ScrollTrigger.create({
      trigger: proof,
      start: "top 75%",
      once: true,
      onEnter: () =>
        gsap.to(beats, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.5, ease: "power3.out" }),
    });
  }

  /* ---- Counters ---- */
  document.querySelectorAll("[data-count]").forEach((el) => {
    const to = parseFloat(el.dataset.to);
    const suffix = el.dataset.suffix || "";
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to, duration: 1.4, ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
        });
      },
    });
  });

  /* ---- Problem bars ---- */
  document.querySelectorAll("[data-bar]").forEach((bar) => {
    const slow = bar.classList.contains("bar-slow");
    ScrollTrigger.create({
      trigger: bar,
      start: "top 92%",
      once: true,
      onEnter: () => gsap.to(bar, { width: slow ? "100%" : "12%", duration: slow ? 1.5 : 0.5, ease: "power3.out" }),
    });
  });

  /* ---- How-it-works connector fill ---- */
  const trackFill = document.querySelector("[data-track-fill]");
  if (trackFill) {
    ScrollTrigger.create({
      trigger: ".how-steps",
      start: "top 70%",
      once: true,
      onEnter: () => gsap.to(trackFill, { width: "100%", duration: 1.6, ease: "power2.inOut" }),
    });
  }

  /* ---- Subtle pointer parallax on hero floating chips ---- */
  const stage = document.querySelector(".hero-stage");
  if (stage && finePointer) {
    const floats = [...stage.querySelectorAll("[data-float]")];
    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      floats.forEach((f, i) => {
        const depth = (i + 1) * 7;
        gsap.to(f, { x: dx * depth, y: dy * depth, duration: 0.6, ease: "power2.out" });
      });
    });
  }

  /* ---- Robot video: pause when far offscreen to save battery ---- */
  const robot = document.querySelector("[data-robot]");
  if (robot) {
    const play = () => { robot.play && robot.play().catch(() => {}); };
    play();
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) play();
      else robot.pause && robot.pause();
    }, { threshold: 0 }).observe(robot);
  }

  initNav();
  initMagnetic();
  initHeroThree();
  ScrollTrigger.refresh();
}
