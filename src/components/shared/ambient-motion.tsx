"use client";

import { useEffect } from "react";

const SHIFT_LIMIT_PX = 30;
const POINTER_RANGE_X = 24;
const POINTER_RANGE_Y = 18;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function AmbientMotion() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let rafId = 0;

    let targetShiftX = 0;
    let targetShiftY = 0;
    let currentShiftX = 0;
    let currentShiftY = 0;

    let targetPointerX = 50;
    let targetPointerY = 40;
    let currentPointerX = 50;
    let currentPointerY = 40;

    const syncFromPoint = (clientX: number, clientY: number) => {
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      const normalizedX = clamp(clientX / width - 0.5, -0.5, 0.5);
      const normalizedY = clamp(clientY / height - 0.5, -0.5, 0.5);

      targetShiftX = normalizedX * SHIFT_LIMIT_PX * 2;
      targetShiftY = normalizedY * SHIFT_LIMIT_PX * 2;

      targetPointerX = 50 + normalizedX * POINTER_RANGE_X * 2;
      targetPointerY = 40 + normalizedY * POINTER_RANGE_Y * 2;
    };

    const resetTargets = () => {
      targetShiftX = 0;
      targetShiftY = 0;
      targetPointerX = 50;
      targetPointerY = 40;
    };

    const update = () => {
      currentShiftX += (targetShiftX - currentShiftX) * 0.1;
      currentShiftY += (targetShiftY - currentShiftY) * 0.1;
      currentPointerX += (targetPointerX - currentPointerX) * 0.12;
      currentPointerY += (targetPointerY - currentPointerY) * 0.12;

      const aX = currentShiftX * 0.8;
      const aY = currentShiftY * 0.6;
      const bX = currentShiftX * -0.55;
      const bY = currentShiftY * 0.75;
      const cX = currentShiftX * 0.95;
      const cY = currentShiftY * -0.6;

      root.style.setProperty("--ambient-a-x", `${aX.toFixed(2)}px`);
      root.style.setProperty("--ambient-a-y", `${aY.toFixed(2)}px`);
      root.style.setProperty("--ambient-b-x", `${bX.toFixed(2)}px`);
      root.style.setProperty("--ambient-b-y", `${bY.toFixed(2)}px`);
      root.style.setProperty("--ambient-c-x", `${cX.toFixed(2)}px`);
      root.style.setProperty("--ambient-c-y", `${cY.toFixed(2)}px`);
      root.style.setProperty("--ambient-px", `${currentPointerX.toFixed(2)}%`);
      root.style.setProperty("--ambient-py", `${currentPointerY.toFixed(2)}%`);

      rafId = window.requestAnimationFrame(update);
    };

    const onMouseMove = (event: MouseEvent) => {
      syncFromPoint(event.clientX, event.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!event.touches.length) return;
      const touch = event.touches[0];
      syncFromPoint(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", resetTargets, { passive: true });
    window.addEventListener("blur", resetTargets);
    document.addEventListener("mouseleave", resetTargets);

    update();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", resetTargets);
      window.removeEventListener("blur", resetTargets);
      document.removeEventListener("mouseleave", resetTargets);
      window.cancelAnimationFrame(rafId);

      root.style.removeProperty("--ambient-a-x");
      root.style.removeProperty("--ambient-a-y");
      root.style.removeProperty("--ambient-b-x");
      root.style.removeProperty("--ambient-b-y");
      root.style.removeProperty("--ambient-c-x");
      root.style.removeProperty("--ambient-c-y");
      root.style.removeProperty("--ambient-px");
      root.style.removeProperty("--ambient-py");
    };
  }, []);

  return null;
}
