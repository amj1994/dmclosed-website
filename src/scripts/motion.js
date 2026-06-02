import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------
   1. Nav: scrolled state + mobile toggle
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
   2. Reduced-motion: reveal everything, run nothing kinetic
------------------------------------------------------------------ */
if (reduceMotion) {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  document.querySelectorAll("[data-msg]").forEach((el) => el.classList.add("show"));
  document.querySelectorAll("[data-beat]").forEach((el) => el.classList.add("show"));
  document.querySelectorAll("[data-count]").forEach((el) => {
    // leave the static printed value as-is
  });
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
        const target = document.querySelector(id);
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -72 }); }
      }
    });
  });

  /* ---- Generic reveals ---- */
  document.querySelectorAll(".reveal").forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => el.classList.add("is-in"),
    });
  });

  /* ---- Hero conversation sequencer ---- */
  function playHeroThread() {
    const stage = document.querySelector("[data-thread]");
    if (!stage) return;
    const msgs = [...stage.querySelectorAll("[data-msg]")];
    const typing = stage.querySelector("[data-typing]");
    const scroller = stage.querySelector("[data-thread-scroll]");
    const booked = document.querySelector("[data-booked]");

    let delay = 0.4;
    const tl = gsap.timeline();
    msgs.forEach((m, i) => {
      const isAi = m.classList.contains("msg-ai");
      // show typing before AI messages
      if (isAi && typing) {
        tl.set(typing, { display: "inline-flex" }, `+=${delay}`);
        tl.to({}, { duration: 0.7 });
        tl.set(typing, { display: "none" });
      } else {
        tl.to({}, { duration: delay });
      }
      tl.fromTo(
        m,
        { autoAlpha: 0, y: 14, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out",
          onStart: () => { if (scroller) scroller.scrollTop = scroller.scrollHeight; } }
      );
      delay = 0.5;
    });
    if (booked) {
      tl.fromTo(booked, { autoAlpha: 0, y: 18, scale: 0.9 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, "+=0.3");
    }
  }
  // hero plays on load (it's above the fold)
  playHeroThread();

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

  /* ---- Subtle pointer parallax on hero pills ---- */
  const stage = document.querySelector(".hero-stage");
  if (stage && window.matchMedia("(pointer: fine)").matches) {
    const floats = [...stage.querySelectorAll("[data-float]")];
    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      floats.forEach((f, i) => {
        const depth = (i + 1) * 6;
        gsap.to(f, { x: dx * depth, y: dy * depth, duration: 0.6, ease: "power2.out" });
      });
    });
  }

  initNav();
  ScrollTrigger.refresh();
}
