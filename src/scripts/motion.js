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
    const media = document.querySelector("[data-hero-media]");
    if (media) {
      gsap.set(media, { clipPath: "inset(0% 0% 0% 18%)", opacity: 0 });
      tl.to(media, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.4, ease: "expo.out" }, 0.25);
    }
  }
  playHeroEntrance();

  /* ---- Hero media parallax: cinematic zoom-out as you leave the hero ---- */
  const heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    // robot pushes in / comes closer as you scroll from the hero to the next section
    gsap.fromTo(heroVideo,
      { scale: 1.02, yPercent: 0 },
      { scale: 1.32, yPercent: 6, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 } }
    );
  }

  /* ---- Apple-style reveals: fade + rise + de-blur, staggered in batches ----
     Elements that enter the viewport together cascade with a small stagger,
     so each section assembles itself as you scroll into it. The animation is
     pure CSS transition — JS only toggles .is-in (timer-staggered), so content
     can never get stuck hidden by a stalled tween.                           */
  const revealEls = gsap.utils.toArray(".reveal");
  ScrollTrigger.batch(revealEls, {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      batch.forEach((el, i) => setTimeout(() => el.classList.add("is-in"), i * 95)),
  });
  // safety net: anything still hidden a moment after load gets revealed
  window.addEventListener("load", () =>
    setTimeout(() => {
      revealEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && !el.classList.contains("is-in")) el.classList.add("is-in");
      });
      ScrollTrigger.refresh();
    }, 400)
  );

  /* ---- Rotating accent word in the hero headline ---- */
  function initRotator() {
    const r = document.querySelector("[data-rotate]");
    if (!r) return;
    const words = gsap.utils.toArray(r.querySelectorAll("em"));
    if (words.length < 2) return;
    gsap.set(words, { autoAlpha: 0, yPercent: 55, filter: "blur(10px)" });
    gsap.set(words[0], { autoAlpha: 1, yPercent: 0, filter: "blur(0px)" });
    let i = 0;
    const next = () => {
      const cur = words[i];
      i = (i + 1) % words.length;
      const nxt = words[i];
      gsap.timeline({ onComplete: () => gsap.delayedCall(2.0, next) })
        .to(cur, { autoAlpha: 0, yPercent: -55, filter: "blur(10px)", duration: 0.5, ease: "power2.in" })
        .fromTo(nxt, { autoAlpha: 0, yPercent: 55, filter: "blur(10px)" },
                     { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", duration: 0.65, ease: "power3.out" }, "-=0.12");
    };
    gsap.delayedCall(2.4, next);
  }
  initRotator();

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
