"use client";

import { useEffect, useRef } from "react";

// A full-page connected line grid with a traveling wave and magnetic cursor response.
const BASE_DOT_COLOR = [174, 177, 184];
const RIPPLE_DOT_COLOR = [32, 64, 231]; // #2040E7
const DOT_SPACING = 64;
const MAGNET_RADIUS = 210;
const MAGNET_STRENGTH = 30;
const WAVE_SPATIAL_RATE = 0.008;
const WAVE_SPEED = 0.0025;
const WAVE_AMPLITUDE = 5;

type Dot = { x: number; y: number; currentX: number; currentY: number };

export default function HeroParticles({
  className = "",
  animationSpeed = 1,
  fixed = false,
}: {
  className?: string;
  animationSpeed?: number;
  fixed?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let columns = 0;
    let dots: Dot[] = [];
    let frame = 0;
    let hovering = false;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.ceil(width / DOT_SPACING) + 2;
      const rows = Math.ceil(height / DOT_SPACING) + 2;
      dots = Array.from({ length: columns * rows }, (_, index) => {
        const x = (index % columns) * DOT_SPACING - DOT_SPACING / 2;
        const y = Math.floor(index / columns) * DOT_SPACING - DOT_SPACING / 2;
        return { x, y, currentX: x, currentY: y };
      });
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const now = performance.now();
      const animationTime = now * animationSpeed;
      const centerVisibilityAt = (x: number) => {
        const normalizedX = Math.min(1, Math.abs(x - width / 2) / Math.max(width / 2, 1));
        return 0.08 + Math.pow(normalizedX, 1.6) * 0.92;
      };
      const waveAt = (x: number, y: number) => {
        const phase = (x + y * 0.65) * WAVE_SPATIAL_RATE - animationTime * WAVE_SPEED;
        return Math.pow(Math.max(0, Math.sin(phase)), 4) * 0.78 * centerVisibilityAt(x);
      };
      const hoverAt = (x: number, y: number) => {
        if (!hovering) return 0;
        const distance = Math.hypot(mouse.x - x, mouse.y - y);
        return Math.pow(Math.max(0, 1 - distance / MAGNET_RADIUS), 0.7) * centerVisibilityAt(x);
      };
      const intensityAt = (x: number, y: number) => Math.max(waveAt(x, y), hoverAt(x, y));

      for (const dot of dots) {
        const phase = (dot.x + dot.y * 0.65) * WAVE_SPATIAL_RATE - animationTime * WAVE_SPEED;
        const visibility = centerVisibilityAt(dot.x);
        const waveX = Math.cos(phase) * WAVE_AMPLITUDE * 0.3 * visibility;
        const waveY = Math.sin(phase) * WAVE_AMPLITUDE * visibility;
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const distance = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - distance / MAGNET_RADIUS);
        const pull = influence * MAGNET_STRENGTH * visibility;
        const targetX = dot.x + (distance > 0 ? (dx / distance) * pull : 0) + waveX;
        const bob = hovering && !reduceMotion
          ? Math.sin(animationTime * 0.003 + dot.x * 0.05 + dot.y * 0.03) * influence * 2.5 * visibility
          : 0;
        const targetY = dot.y + (distance > 0 ? (dy / distance) * pull : 0) + waveY + bob;

        if (!reduceMotion) {
          dot.currentX += (targetX - dot.currentX) * 0.16;
          dot.currentY += (targetY - dot.currentY) * 0.16;
        }

      }

      // Connect each dot to its horizontal and vertical neighbors.
      ctx.lineWidth = 1;
      for (let index = 0; index < dots.length; index++) {
        const dot = dots[index];
        const neighbors: Dot[] = [];
        if (index % columns < columns - 1) neighbors.push(dots[index + 1]);
        if (index + columns < dots.length) neighbors.push(dots[index + columns]);
        for (const neighbor of neighbors) {
          const x = (dot.currentX + neighbor.currentX) / 2;
          const y = (dot.currentY + neighbor.currentY) / 2;
          const intensity = intensityAt(x, y);
          const red = Math.round(BASE_DOT_COLOR[0] + (RIPPLE_DOT_COLOR[0] - BASE_DOT_COLOR[0]) * intensity);
          const green = Math.round(BASE_DOT_COLOR[1] + (RIPPLE_DOT_COLOR[1] - BASE_DOT_COLOR[1]) * intensity);
          const blue = Math.round(BASE_DOT_COLOR[2] + (RIPPLE_DOT_COLOR[2] - BASE_DOT_COLOR[2]) * intensity);
          ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${(0.16 + intensity * 0.35) * centerVisibilityAt(x)})`;
          ctx.beginPath();
          ctx.moveTo(dot.currentX, dot.currentY);
          ctx.lineTo(neighbor.currentX, neighbor.currentY);
          ctx.stroke();
        }
      }

    };

    const step = () => {
      draw();
      frame = requestAnimationFrame(step);
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      hovering = true;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      hovering = false;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting && !reduceMotion) frame = requestAnimationFrame(step);
    });
    intersectionObserver.observe(canvas);

    const host = canvas.parentElement;
    host?.addEventListener("mousemove", onMouseMove);
    host?.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host?.removeEventListener("mousemove", onMouseMove);
      host?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [animationSpeed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-0 w-full h-full ${className}`}
    />
  );
}
