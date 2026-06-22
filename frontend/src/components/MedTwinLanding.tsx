"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
export default function MedTwinLanding() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [countStarted, setCountStarted] = useState(false);
  const [diseaseCount, setDiseaseCount] = useState(0);

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Counter animation for diseases stat
  useEffect(() => {
    if (!countStarted) return;
    let start = 0;
    const end = 120;
    const duration = 1800;
    const step = 16;
    const inc = end / (duration / step);
    const timer = setInterval(() => {
      start += inc;
      if (start >= end) {
        setDiseaseCount(end);
        clearInterval(timer);
      } else {
        setDiseaseCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [countStarted]);

  // Intersection observer for stats counter + reveal animations
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("med-visible");
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".med-reveal").forEach((el) => revealObserver.observe(el));

    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCountStarted(true);
          statsObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (statsRef.current) statsObserver.observe(statsRef.current);

    return () => {
      revealObserver.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  // Smooth scroll handler
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --ink:       #080D1A;
          --ink2:      #0E1525;
          --ink3:      #141C30;
          --cyan:      #00D4FF;
          --cyan-dim:  rgba(0,212,255,0.15);
          --cyan-glow: rgba(0,212,255,0.4);
          --white:     #F0F4FF;
          --muted:     rgba(240,244,255,0.5);
          --border:    rgba(0,212,255,0.12);
          --mono:      'JetBrains Mono', monospace;
          --grotesk:   'Space Grotesk', sans-serif;
          --inter:     'Inter', sans-serif;
        }

        .med-root {
          background: var(--ink);
          color: var(--white);
          font-family: var(--inter);
          overflow-x: hidden;
          line-height: 1.6;
        }

        /* ── NAVBAR ── */
        .med-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; height: 68px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          transition: background 0.3s;
        }
        .med-nav-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--grotesk); font-size: 1.25rem; font-weight: 700;
          letter-spacing: -0.02em; color: var(--white); text-decoration: none;
          cursor: pointer;
        }
        .med-logo-icon {
          width: 34px; height: 34px;
          background: var(--cyan); border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 16px var(--cyan-glow);
          animation: logoPulse 3s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes logoPulse {
          0%,100% { box-shadow: 0 0 16px var(--cyan-glow); }
          50%      { box-shadow: 0 0 28px rgba(0,212,255,0.7), 0 0 48px rgba(0,212,255,0.2); }
        }
        .med-nav-links {
          display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0;
        }
        .med-nav-links a {
          font-family: var(--inter); font-size: 0.875rem; font-weight: 400;
          color: var(--muted); text-decoration: none; transition: color 0.2s;
          cursor: pointer;
        }
        .med-nav-links a:hover { color: var(--white); }
        .med-nav-cta {
          font-family: var(--grotesk); font-size: 0.875rem; font-weight: 600;
          color: var(--ink); background: var(--cyan);
          border: none; border-radius: 8px;
          padding: 0.5rem 1.25rem; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          white-space: nowrap;
        }
        .med-nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(0,212,255,0.5);
        }
        .med-nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* ── HERO ── */
        .med-hero {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; text-align: center;
          padding: 100px 5% 80px;
          position: relative; overflow: hidden;
        }
        .med-hero-grid {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%);
        }

        /* Orb */
        .med-orb-wrapper {
          position: relative; width: 260px; height: 260px;
          margin-bottom: 3rem; z-index: 1;
        }
        .med-orb-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid var(--cyan);
          top: 50%; left: 50%; transform: translate(-50%,-50%);
          animation: ringExpand 3.5s ease-out infinite;
          opacity: 0; width: 260px; height: 260px;
        }
        .med-orb-ring:nth-child(2) { animation-delay: 1.2s; }
        .med-orb-ring:nth-child(3) { animation-delay: 2.4s; }
        @keyframes ringExpand {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.6; border-color: rgba(0,212,255,0.7); }
          100% { transform: translate(-50%,-50%) scale(2.1); opacity: 0;  border-color: rgba(0,212,255,0); }
        }
        .med-orb-core {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 180px; height: 180px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, rgba(0,212,255,0.25), rgba(0,212,255,0.05) 60%, transparent);
          border: 1.5px solid rgba(0,212,255,0.5);
          display: flex; align-items: center; justify-content: center;
          animation: orbBreathe 4s ease-in-out infinite;
        }
        @keyframes orbBreathe {
          0%,100% { transform: translate(-50%,-50%) scale(1);    box-shadow: 0 0 40px rgba(0,212,255,0.2), inset 0 0 40px rgba(0,212,255,0.05); }
          50%      { transform: translate(-50%,-50%) scale(1.04); box-shadow: 0 0 70px rgba(0,212,255,0.35), inset 0 0 60px rgba(0,212,255,0.1); }
        }
        .med-ecg-path {
          fill: none; stroke: var(--cyan); stroke-width: 2;
          stroke-linecap: round; stroke-linejoin: round;
          stroke-dasharray: 300; stroke-dashoffset: 300;
          animation: ecgDraw 2s ease-in-out infinite;
        }
        @keyframes ecgDraw {
          0%  { stroke-dashoffset: 300; opacity: 1; }
          70% { stroke-dashoffset: 0;   opacity: 1; }
          90% { opacity: 0.2; }
          100%{ stroke-dashoffset: 0;   opacity: 0; }
        }
        .med-orb-dot {
          position: absolute; border-radius: 50%;
          width: 6px; height: 6px;
          background: var(--cyan); box-shadow: 0 0 8px var(--cyan);
          top: 50%; left: 50%;
        }
        .med-orb-dot:nth-child(5) { animation: dotOrbit1 6s linear infinite; }
        .med-orb-dot:nth-child(6) { animation: dotOrbit2 8s linear infinite; }
        .med-orb-dot:nth-child(7) { animation: dotOrbit3 7s linear infinite; }
        @keyframes dotOrbit1 {
          0%   { transform: rotate(0deg)   translateX(120px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }
        @keyframes dotOrbit2 {
          0%   { transform: rotate(120deg) translateX(115px) rotate(-120deg); }
          100% { transform: rotate(480deg) translateX(115px) rotate(-480deg); }
        }
        @keyframes dotOrbit3 {
          0%   { transform: rotate(240deg) translateX(118px) rotate(-240deg); }
          100% { transform: rotate(600deg) translateX(118px) rotate(-600deg); }
        }

        /* Hero text */
        .med-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.2);
          border-radius: 100px; padding: 6px 16px; margin-bottom: 1.5rem;
          font-family: var(--mono); font-size: 0.75rem; letter-spacing: 0.08em;
          color: var(--cyan); z-index: 1; position: relative;
          animation: fadeUp 0.8s 0.2s both;
        }
        .med-badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--cyan);
          animation: badgeBlink 1.5s ease-in-out infinite;
        }
        @keyframes badgeBlink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .med-headline {
          font-family: var(--grotesk);
          font-size: clamp(2.8rem, 6vw, 5.2rem);
          font-weight: 700; line-height: 1.05;
          letter-spacing: -0.03em; margin-bottom: 1.5rem;
          z-index: 1; position: relative;
          animation: fadeUp 0.8s 0.4s both;
        }
        .med-cyan { color: var(--cyan); }
        .med-sub {
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          color: var(--muted); max-width: 560px; line-height: 1.7;
          margin-bottom: 2.5rem; z-index: 1; position: relative;
          animation: fadeUp 0.8s 0.6s both;
        }
        .med-hero-actions {
          display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
          z-index: 1; position: relative;
          animation: fadeUp 0.8s 0.8s both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Buttons */
        .med-btn-primary {
          font-family: var(--grotesk); font-weight: 600; font-size: 0.95rem;
          background: var(--cyan); color: #080D1A;
          border: none; border-radius: 10px;
          padding: 0.85rem 2rem; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          transition: transform 0.15s, box-shadow 0.2s;
          text-decoration: none;
        }
        .med-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,212,255,0.5); }
        .med-btn-ghost {
          font-family: var(--grotesk); font-weight: 500; font-size: 0.95rem;
          background: transparent; color: var(--white);
          border: 1px solid var(--border); border-radius: 10px;
          padding: 0.85rem 2rem; cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          text-decoration: none;
        }
        .med-btn-ghost:hover { background: rgba(0,212,255,0.05); border-color: rgba(0,212,255,0.35); }

        /* ── STATS BAR ── */
        .med-stats {
          display: flex; justify-content: center;
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          background: rgba(0,212,255,0.03);
        }
        .med-stat {
          flex: 1; max-width: 220px; text-align: center;
          padding: 2rem 1rem;
          border-right: 1px solid var(--border);
          transition: background 0.2s;
        }
        .med-stat:last-child { border-right: none; }
        .med-stat:hover { background: rgba(0,212,255,0.04); }
        .med-stat-num {
          font-family: var(--grotesk); font-size: 2rem; font-weight: 700;
          color: var(--cyan); letter-spacing: -0.03em; display: block;
        }
        .med-stat-label {
          font-size: 0.8rem; color: var(--muted);
          letter-spacing: 0.04em; margin-top: 4px; display: block;
        }

        /* ── SECTIONS ── */
        .med-section { padding: 7rem 5%; max-width: 1200px; margin: 0 auto; }
        .med-eyebrow {
          font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.12em;
          color: var(--cyan); margin-bottom: 1rem; display: block;
        }
        .med-title {
          font-family: var(--grotesk); font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 700; letter-spacing: -0.03em; line-height: 1.15;
          margin-bottom: 1rem;
        }
        .med-desc { color: var(--muted); max-width: 500px; font-size: 1rem; line-height: 1.7; }

        /* Steps */
        .med-steps {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5px;
          margin-top: 4rem; background: var(--border);
          border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
        }
        .med-step {
          background: var(--ink2); padding: 2.5rem 2rem;
          position: relative; overflow: hidden; transition: background 0.3s;
        }
        .med-step::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--cyan); opacity: 0; transition: opacity 0.3s;
        }
        .med-step:hover { background: var(--ink3); }
        .med-step:hover::before { opacity: 1; }
        .med-step-num {
          font-family: var(--mono); font-size: 0.72rem;
          color: rgba(0,212,255,0.45); letter-spacing: 0.1em;
          margin-bottom: 1.5rem; display: block;
        }
        .med-step-icon {
          width: 44px; height: 44px; border-radius: 10px;
          background: var(--cyan-dim); border: 1px solid rgba(0,212,255,0.2);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.5rem;
        }
        .med-step h3 {
          font-family: var(--grotesk); font-size: 1.05rem; font-weight: 600; margin-bottom: 0.6rem;
        }
        .med-step p { font-size: 0.875rem; color: var(--muted); line-height: 1.65; }

        /* Features */
        .med-features-section {
          padding: 5rem 5% 7rem;
          background: linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.03) 50%, transparent 100%);
        }
        .med-features-inner { max-width: 1200px; margin: 0 auto; }
        .med-features-grid {
          display: grid; grid-template-columns: repeat(2,1fr); gap: 1.5rem; margin-top: 3.5rem;
        }
        .med-feat-card {
          background: var(--ink2); border: 1px solid var(--border);
          border-radius: 14px; padding: 2rem;
          transition: border-color 0.3s, transform 0.2s;
          position: relative; overflow: hidden;
        }
        .med-feat-card::after {
          content: ''; position: absolute; top: -60px; right: -60px;
          width: 140px; height: 140px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .med-feat-card:hover { border-color: rgba(0,212,255,0.35); transform: translateY(-2px); }
        .med-feat-wide { grid-column: span 2; display: flex; gap: 2.5rem; align-items: center; }
        .med-feat-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: var(--cyan-dim); border: 1px solid rgba(0,212,255,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-bottom: 1.2rem;
        }
        .med-feat-wide .med-feat-icon { margin-bottom: 0; }
        .med-feat-card h3 {
          font-family: var(--grotesk); font-size: 1.05rem; font-weight: 600; margin-bottom: 0.5rem;
        }
        .med-feat-card p { font-size: 0.875rem; color: var(--muted); line-height: 1.65; }
        .med-feat-tag {
          display: inline-block; font-family: var(--mono); font-size: 0.65rem;
          letter-spacing: 0.08em; color: var(--cyan);
          background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.15);
          border-radius: 4px; padding: 2px 8px; margin-bottom: 1rem;
        }

        /* Scan viz */
        .med-scan-viz {
          flex: 1; min-width: 0;
          background: rgba(0,0,0,0.3); border: 1px solid var(--border);
          border-radius: 10px; padding: 1.2rem 1.5rem;
          display: flex; flex-direction: column; gap: 10px;
        }
        .med-scan-label {
          font-family: var(--mono); font-size: 0.65rem; letter-spacing: 0.08em;
          color: rgba(0,212,255,0.6); margin-bottom: 4px; display: block;
        }
        .med-scan-row { display: flex; align-items: center; gap: 10px; }
        .med-scan-name {
          font-size: 0.78rem; color: var(--muted); width: 90px;
          flex-shrink: 0; font-family: var(--mono);
        }
        .med-scan-bg {
          flex: 1; height: 6px; border-radius: 3px;
          background: rgba(255,255,255,0.05); overflow: hidden;
        }
        .med-scan-fill {
          height: 100%; border-radius: 3px;
          animation: barLoad 1.5s ease-out both;
        }
        @keyframes barLoad { from { width: 0; } }
        .med-scan-val {
          font-family: var(--mono); font-size: 0.75rem;
          color: var(--white); width: 36px; text-align: right; flex-shrink: 0;
        }

        /* CTA */
        .med-cta-section {
          text-align: center; padding: 7rem 5%;
          position: relative; overflow: hidden;
        }
        .med-cta-glow {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .med-cta-section h2 {
          font-family: var(--grotesk); font-size: clamp(2rem,4vw,3.2rem);
          font-weight: 700; letter-spacing: -0.03em; line-height: 1.1;
          margin-bottom: 1.2rem; position: relative;
        }
        .med-cta-section p { color: var(--muted); margin-bottom: 2.5rem; font-size: 1.05rem; position: relative; }
        .med-cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; position: relative; }

        /* Footer */
        .med-footer {
          border-top: 1px solid var(--border);
          padding: 2rem 5%;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
        }
        .med-footer-logo { font-family: var(--grotesk); font-weight: 700; font-size: 1rem; color: var(--white); }
        .med-footer p { font-size: 0.8rem; color: var(--muted); }
        .med-foot-links { display: flex; gap: 1.5rem; }
        .med-foot-links a { font-size: 0.8rem; color: var(--muted); text-decoration: none; transition: color 0.2s; cursor: pointer; }
        .med-foot-links a:hover { color: var(--cyan); }

        /* Reveal */
        .med-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .med-visible { opacity: 1; transform: translateY(0); }

        /* Responsive */
       @media (max-width: 768px) {
      .med-nav-links {
        display: none;
      }

      .med-nav {
        padding: 0 14px;
        height: auto;
        min-height: 68px;
      }

      .med-nav-actions {
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 8px;
      }

      .med-nav-cta,
      .med-btn-ghost {
        padding: 0.45rem 0.8rem;
        font-size: 0.75rem;
      }

      .med-nav-logo {
        font-size: 1rem;
      }

      .med-steps {
        grid-template-columns: 1fr;
      }

      .med-features-grid {
        grid-template-columns: 1fr;
      }

      .med-feat-wide {
        flex-direction: column;
        grid-column: span 1;
      }

      .med-stats {
        flex-wrap: wrap;
      }

  .med-stat {
    min-width: 50%;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; }
        }
      `}</style>

      <div className="med-root">

        {/* ── NAVBAR ── */}
        
        <div
  style={{
    maxWidth: "1280px",
    width: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px"
  }}
>

  {/* Left Logo */}
  <div
    className="med-nav-logo"
    onClick={() => scrollTo("home")}
  >
    <div className="med-logo-icon">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="#080D1A">
        <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 2c.55 0 1 .45 1 1v4h3c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1z"/>
      </svg>
    </div>

    MedTwin
    <span className="med-cyan">AI</span>
  </div>

  {/* Center Links */}
  <ul
    className="med-nav-links"
    style={{
      flex: 1,
      justifyContent: "center"
    }}
  >
    <li><a onClick={() => scrollTo("how")}>How it works</a></li>
    <li><a onClick={() => scrollTo("features")}>Features</a></li>
    <li><a onClick={() => scrollTo("about")}>About</a></li>
  </ul>

  {/* Right Buttons */}
  {/* Right Buttons */}
<div className="med-nav-actions">
    <button
      className="med-btn-ghost"
      onClick={() => router.push("/dashboard")}
    >
      Dashboard
    </button>

    <button
      className="med-btn-ghost"
      onClick={() => router.push("/profile")}
    >
      Profile
    </button>

    <button
      className="med-nav-cta"
      onClick={() => router.push("/auth")}
    >
      Login/Signup
    </button>
  </div>

</div>

        {/* ── HERO ── */}
        <section className="med-hero" id="home">
          <div className="med-hero-grid" />

          <div className="med-orb-wrapper">
            <div className="med-orb-ring" />
            <div className="med-orb-ring" />
            <div className="med-orb-ring" />
            <div className="med-orb-core">
              <svg width="120" height="50" viewBox="0 0 120 50" style={{ overflow: "visible" }}>
                <polyline
                  className="med-ecg-path"
                  points="0,30 18,30 24,30 28,10 32,48 36,30 42,30 52,30 56,18 60,42 64,30 80,30 84,14 88,44 92,30 120,30"
                />
              </svg>
            </div>
            <div className="med-orb-dot" />
            <div className="med-orb-dot" />
            <div className="med-orb-dot" />
          </div>

          <div className="med-badge">
            <span className="med-badge-dot" />
            AI-POWERED DIABETES RISK ANALYSIS
          </div>

          <h2 className="med-headline">
           Predict Diabetes Risk
Before It Gets Serious.
          </h2>

          <p className="med-sub">
            Upload your health metrics, analyze diabetes risk with machine learning,
get AI-generated summaries, and securely track your prediction history.
          </p>

          <div className="med-hero-actions">
            <button className="med-btn-primary" onClick={() => router.push("/auth")}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Get Started
            </button>
            <button className="med-btn-ghost" onClick={() => scrollTo("how")}>
              See how it works
            </button>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <div className="med-stats med-reveal" ref={statsRef}>
          <div className="med-stat">
            <span className="med-stat-num">84.3%</span>
            <span className="med-stat-label">MODEL ROC-AUC</span>
          </div>
          <div className="med-stat">
            <span className="med-stat-num">3</span>
            <span className="med-stat-label">ML MODELS TRAINED</span>
          </div>
          <div className="med-stat">
            <span className="med-stat-num">AI</span>
            <span className="med-stat-label">HEALTH SUMMARY</span>
          </div>
          <div className="med-stat">
            <span className="med-stat-num">JWT</span>
            <span className="med-stat-label">SECURE AUTH SYSTEM &amp; ENCRYPTED</span>
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section id="how">
          <div className="med-section med-reveal">
            <span className="med-eyebrow"> HOW IT WORKS</span>
            <h2 className="med-title">From health data to AI prediction<br />in three steps</h2>
            <p className="med-desc">
              Enter your health parameters manually and let MedTwin analyze
your diabetes risk using machine learning. Our AI handles the rest — no manual entry, no jargon.
            </p>
            <div className="med-steps">
              {[
                {
        num: "01 / 03",
        icon: (
          <svg width="22" height="22" fill="none" stroke="var(--cyan)" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          </svg>
        ),
        title: "Enter Health Metrics",
        desc: "Fill glucose, BMI, blood pressure, insulin, age and other medical values.",
      },
      {
        num: "02 / 03",
        icon: (
          <svg width="22" height="22" fill="none" stroke="var(--cyan)" strokeWidth="1.8" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"/>
          </svg>
        ),
        title: "AI Risk Prediction",
        desc: "MedTwin uses trained ML models to calculate diabetes probability.",
      },
      {
        num: "03 / 03",
        icon: (
          <svg width="22" height="22" fill="none" stroke="var(--cyan)" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        ),
        title: "Get Insights & History",
        desc: "Receive AI summary, risk factors, recommendations and save report history.",
      },].map((s) => (
                <div className="med-step" key={s.num}>
                  <span className="med-step-num">{s.num}</span>
                  <div className="med-step-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="med-features-section" id="features">
          <div className="med-features-inner med-reveal">
            <span className="med-eyebrow">CAPABILITIES</span>
            <h2 className="med-title">Built for precision,<br />designed for everyone</h2>
            <div className="med-features-grid">

              {/* Wide card */}
              <div className="med-feat-card med-feat-wide">
                <div>
                  <span className="med-feat-tag">CORE ENGINE</span>
                  <div className="med-feat-icon">
                    <svg width="24" height="24" fill="none" stroke="var(--cyan)" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="2" y="3" width="20" height="14" rx="2"/>
                      <path d="M8 21h8M12 17v4"/>
                    </svg>
                  </div>
                  <h3>Real-time biomarker analysis</h3>
                  <p>Every value in your report is cross-referenced against clinical thresholds and population percentiles. Deviations are flagged with their disease correlation weights.</p>
                </div>
                <div className="med-scan-viz">
                  <span className="med-scan-label">RISK ANALYSIS — SAMPLE OUTPUT</span>
                  {[
                    { name: "Diabetes T2",  color: "#00D4FF", width: "18%", val: "18%" },
                    { name: "Dyslipidemia", color: "#F59E0B", width: "42%", val: "42%" },
                    { name: "Anemia",       color: "#10B981", width: "8%",  val: "8%"  },
                    { name: "Hypertension", color: "#FF6B4A", width: "71%", val: "71%" },
                    { name: "Hypothyroid",  color: "#10B981", width: "11%", val: "11%" },
                  ].map((row, i) => (
                    <div className="med-scan-row" key={row.name}>
                      <span className="med-scan-name">{row.name}</span>
                      <div className="med-scan-bg">
                        <div
                          className="med-scan-fill"
                          style={{
                            background: row.color,
                            width: row.width,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      </div>
                      <span className="med-scan-val">{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {[
                {
    tag: "ML MODELS",
    icon: <svg width="24" height="24" fill="none" stroke="var(--cyan)" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>,
    title: "Risk Prediction",
    desc: "Uses Logistic Regression, Random Forest and XGBoost for diabetes risk analysis.",
  },
  {
    tag: "AI INSIGHTS",
    icon: <svg width="24" height="24" fill="none" stroke="var(--cyan)" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>,
    title: "AI Summary Generator",
    desc: "Explains why your risk is high, moderate or low using health parameters.",
  },
  {
    tag: "USER HISTORY",
    icon: <svg width="24" height="24" fill="none" stroke="var(--cyan)" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 8v4l3 3"/></svg>,
    title: "Prediction History",
    desc: "Every user gets personal prediction history with detailed reports.",
  },
  {
    tag: "REPORT EXPORT",
    icon: <svg width="24" height="24" fill="none" stroke="var(--cyan)" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 16V4"/><path d="M8 8l4-4 4 4"/></svg>,
    title: "PDF Reports",
    desc: "Download complete diabetes risk reports anytime.",
  },
              ].map((f) => (
                <div className="med-feat-card" key={f.title}>
                  <span className="med-feat-tag">{f.tag}</span>
                  <div className="med-feat-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="med-cta-section med-reveal" id="cta">
          <div className="med-cta-glow" />
          <span className="med-eyebrow" style={{ display: "block", marginBottom: "1.5rem" }}> START NOW</span>
          <h2>
           <span> Start Your Diabetes Risk Analysis Today</span>
          </h2>
          <p>Sign in securely and analyze your health with MedTwin AI.</p>
          <div className="med-cta-actions">
            <button
  className="med-btn-primary"
  onClick={() => router.push("/auth")}
>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Login / Signup
            </button>
            <button
  className="med-btn-ghost"
  onClick={() => router.push("/history")}
>
  View History
</button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="med-footer" id="about">
          <div className="med-footer-logo">
            Med<span className="med-cyan">Twin</span>
          </div>
          <p>© 2025 MedTwin. Not a substitute for medical advice.</p>
          <div className="med-foot-links">
            <a>Privacy</a>
            <a>Terms</a>
            <a>Contact</a>
          </div>
        </footer>

      </div>
    </>
  );
}
