"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { rand } from "@/lib/format";
import type { Theme } from "@/lib/themes";

interface Critter {
  bob: number;
  el: HTMLDivElement;
  face: 1 | -1;
  follower: boolean;
  img: HTMLImageElement;
  s: number;
  sp: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
}

const roam = (a: Critter, W: number, H: number) => {
  if (Math.hypot(a.vx, a.vy) < a.sp * 0.5) {
    const ang = Math.random() * Math.PI * 2;
    a.vx = Math.cos(ang) * a.sp;
    a.vy = Math.sin(ang) * a.sp;
  }
  if ((a.x < 0 && a.vx < 0) || (a.x > W - a.s && a.vx > 0)) {
    a.vx = -a.vx;
  }
  if ((a.y < 0 && a.vy < 0) || (a.y > H - a.s && a.vy > 0)) {
    a.vy = -a.vy;
  }
  if (Math.abs(a.vx) > 4) {
    a.face = a.vx >= 0 ? 1 : -1;
  }
};

/**
 * Little animals wandering around; one follows the pointer.
 * Runs as a requestAnimationFrame loop outside React for smooth motion.
 */
export const Critters = ({ theme }: { theme: Theme }) => {
  const box = useRef<HTMLDivElement>(null);
  const themeRef = useRef(theme);
  const list = useRef<Critter[]>([]);
  const reduceMotion = useReducedMotion();

  // Swap every animal's sprite when the theme changes, or clear them
  useEffect(() => {
    themeRef.current = theme;
    if (!(theme.animal && theme.cls)) {
      for (const a of list.current) {
        a.el.remove();
      }
      list.current = [];
      return;
    }
    for (const a of list.current) {
      a.img.src = theme.animal;
      a.img.className = theme.cls;
    }
  }, [theme]);

  useEffect(() => {
    const root = box.current;
    if (reduceMotion || !root) {
      return;
    }
    let mouse: { x: number; y: number } | null = null;
    let prev = performance.now();
    let nextSpawn = 0;
    let frame = 0;

    const spawn = (follower: boolean, th: Theme) => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const s = follower ? 120 : rand(50, 120);
      const fromLeft = Math.random() < 0.5;
      const sp = follower
        ? (th.cfg?.speed ?? 90) * 1.2
        : rand(40, 190) * (85 / s) ** 0.3;
      const el = document.createElement("div");
      el.className = "critter";
      el.style.width = `${Math.round(s)}px`;
      el.style.height = `${Math.round(s)}px`;
      const img = document.createElement("img");
      img.alt = "";
      img.decoding = "async";
      img.className = th.cls ?? "";
      img.src = th.animal ?? "";
      el.append(img);
      root.append(el);
      list.current.push({
        bob: Math.random() * 6.28,
        el,
        face: fromLeft ? 1 : -1,
        follower,
        img,
        s,
        sp,
        vx: fromLeft ? sp : -sp,
        vy: 0,
        x: fromLeft ? -s - 10 : W + 10,
        y: follower
          ? rand(H * 0.22, H * 0.67)
          : rand(60, Math.max(80, H - s - 20)),
      });
    };

    const chase = (a: Critter, m: { x: number; y: number }) => {
      const dx = m.x + 24 - a.x;
      const dy = m.y + 18 - a.y;
      const d = Math.hypot(dx, dy);
      const sp = Math.min(a.sp * 2.2, d * 3);
      a.vx = d > 1 ? (dx / d) * sp : 0;
      a.vy = d > 1 ? (dy / d) * sp : 0;
      const fx = m.x - (a.x + a.s / 2);
      if (Math.abs(fx) > 8) {
        a.face = fx > 0 ? 1 : -1;
      }
    };

    const step = (dt: number, now: number, th: Theme) => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      if (!list.current.some((a) => a.follower)) {
        spawn(true, th);
      }
      if (list.current.length < 10 && now > nextSpawn) {
        spawn(false, th);
        nextSpawn = now + rand(900, 2600);
      }
      const keep: Critter[] = [];
      for (const a of list.current) {
        if (a.follower) {
          if (mouse) {
            chase(a, mouse);
          } else {
            roam(a, W, H);
          }
          a.x += a.vx * dt;
          a.y += a.vy * dt;
          keep.push(a);
        } else {
          a.bob += dt * 3;
          a.x += a.vx * dt;
          a.y += Math.sin(a.bob) * 0.3;
          if (a.x > -a.s - 40 && a.x < W + 40) {
            keep.push(a);
          } else {
            a.el.remove();
          }
        }
      }
      list.current = keep;
      const native = th.cfg?.native ?? 1;
      for (const a of keep) {
        a.el.style.transform = `translate(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px) scaleX(${a.face * native})`;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const th = themeRef.current;
      if (th.animal) {
        step(dt, now, th);
      }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        mouse = { x: e.clientX, y: e.clientY };
      }
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        mouse = null;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
      for (const a of list.current) {
        a.el.remove();
      }
      list.current = [];
    };
  }, [reduceMotion]);

  return <div aria-hidden="true" className="critters" ref={box} />;
};
