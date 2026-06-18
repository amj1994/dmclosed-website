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
  ScrollTrigger.refresh();
}
