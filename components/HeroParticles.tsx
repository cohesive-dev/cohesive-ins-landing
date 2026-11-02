"use client";

import { useEffect, useRef } from "react";

// Subtle drifting particle network for the hero background. Dots in brand blue
// drift slowly and link with faint lines when close; the cursor gently pushes
// nearby particles away. Pauses when off-screen and stays static for users
// who prefer reduced motion. A mask limits the effect to the left and right
// edges plus a light band along the top, keeping the center clear for content.

const COLOR = "32, 64, 231"; // #2040E7 as an rgb triplet
const LINK_DIST = 125;
const MOUSE_RADIUS = 140;

// Union of two gradients: full strength at the side edges fading out by
// SIDE_FADE, plus a weaker band along the top fading out by TOP_FADE.
const SIDE_FADE = "22%";
const TOP_FADE = "18%";
const MASK = [
  `linear-gradient(to right, black, transparent ${SIDE_FADE}, transparent calc(100% - ${SIDE_FADE}), black)`,
  `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), transparent ${TOP_FADE})`,
].join(", ");

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

export default function HeroParticles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale density with area; fewer on small screens.
      const count = Math.round(Math.min(200, (width * height) / 5000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
      }));
      if (reduceMotion) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.18;
            ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = `rgba(${COLOR}, 0.55)`;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_RADIUS * MOUSE_RADIUS && d2 > 0) {
          const d = Math.sqrt(d2);
          const force = (1 - d / MOUSE_RADIUS) * 0.6;
          p.x += (dx / d) * force;
          p.y += (dy / d) * force;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;
      }
      draw();
      frame = requestAnimationFrame(step);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting && !reduceMotion) frame = requestAnimationFrame(step);
    });
    io.observe(canvas);

    // The canvas is pointer-events-none, so listen on its section.
    const host = canvas.parentElement;
    host?.addEventListener("mousemove", onMouseMove);
    host?.addEventListener("mouseleave", onMouseLeave);

    if (reduceMotion) draw();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      host?.removeEventListener("mousemove", onMouseMove);
      host?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    />
  );
}
