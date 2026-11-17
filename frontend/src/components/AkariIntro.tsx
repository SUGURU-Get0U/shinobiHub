import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import faceArtwork from "../../assets/akari-intro-face.webp";
import handArtwork from "../../assets/akari-intro-hand.webp";
import fullArtwork from "../../assets/akari-aura.png";
import "../../akari-intro.css";

type Props = { onFinish: () => void };

export default function AkariIntro({ onFinish }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const finish = useRef(onFinish);
  useEffect(() => { finish.current = onFinish; }, [onFinish]);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      finish.current();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skip.current?.focus();

    const context = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => finish.current() });
      tl.fromTo(".intro-face", { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: 1.25, ease: "power2.out" }, 0.1)
        .fromTo(".intro-eye-light", { autoAlpha: 0, scaleX: 0.2 }, { autoAlpha: 0.85, scaleX: 1, duration: 0.45, ease: "power2.out" }, 0.7)
        .to(".intro-eye-light", { autoAlpha: 0, duration: 0.35 }, 1.28)
        .to(".intro-face", { autoAlpha: 0, scale: 1.08, duration: 0.5, ease: "power2.inOut" }, 1.42)
        .fromTo(".intro-hand", { autoAlpha: 0, scale: 1.17, xPercent: 5 }, { autoAlpha: 1, scale: 1, xPercent: 0, duration: 0.7, ease: "power2.out" }, 1.55)
        .fromTo(".intro-orb", { autoAlpha: 0, scale: 0.15 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(1.5)" }, 1.87)
        .fromTo(".intro-ring", { autoAlpha: 0, scale: 0.1 }, { autoAlpha: 0.75, scale: 1.9, duration: 0.9, ease: "power2.out" }, 2.15)
        .to(".intro-ring", { autoAlpha: 0, duration: 0.3 }, 2.78)
        .to(".intro-flash", { autoAlpha: 0.93, duration: 0.12 }, 2.85)
        .set(".intro-wide", { autoAlpha: 1 }, 2.92)
        .set(".intro-hand", { autoAlpha: 0 }, 2.92)
        .fromTo(".intro-wide-art", { scale: 1.28, xPercent: -50, yPercent: -41, autoAlpha: 0 }, { scale: 1, xPercent: -50, yPercent: -50, autoAlpha: 1, duration: 1.3, ease: "power3.out" }, 2.94)
        .fromTo(".intro-moon", { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 0.9, duration: 1.3, ease: "power2.out" }, 2.94)
        .to(".intro-flash", { autoAlpha: 0, duration: 0.65, ease: "power2.out" }, 2.98)
        .fromTo(".intro-title", { autoAlpha: 0, y: 26, letterSpacing: "0.45em" }, { autoAlpha: 1, y: 0, letterSpacing: "0.22em", duration: 0.8, ease: "power2.out" }, 3.55)
        .to(node, { autoAlpha: 0, duration: 0.8, ease: "power2.inOut" }, 4.8);
    }, node);

    const reduce = () => { if (motion.matches) finish.current(); };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        finish.current();
      } else if (event.key === "Tab") {
        // Skip is the only control in this modal; keep focus off the inert board.
        event.preventDefault();
        skip.current?.focus();
      }
    };
    motion.addEventListener("change", reduce);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      context.revert();
      motion.removeEventListener("change", reduce);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div ref={root} className="akari-intro" role="dialog" aria-modal="true" aria-label="Akari welcome animation">
      <div className="intro-face intro-shot" aria-hidden="true">
        <img src={String(faceArtwork)} alt="" />
        <div className="intro-eye-light" />
      </div>
      <div className="intro-hand intro-shot" aria-hidden="true">
        <img src={String(handArtwork)} alt="" />
        <div className="intro-orb" />
        <div className="intro-ring" />
      </div>
      <div className="intro-wide intro-shot" aria-hidden="true">
        <div className="intro-moon" />
        <img className="intro-wide-art" src={String(fullArtwork)} alt="" />
        <div className="intro-title">ようこそ</div>
      </div>
      <div className="intro-flash" aria-hidden="true" />
      <div className="intro-vignette" aria-hidden="true" />
      <div className="intro-top-line" aria-hidden="true" />
      <div className="intro-bottom-line" aria-hidden="true" />
      <button ref={skip} className="intro-skip" onClick={() => finish.current()}>
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
