"use client";

import { useRef, useCallback } from "react";

export function useLongPress(onLongPress: () => void, duration = 500) {
  const cbRef = useRef(onLongPress);
  cbRef.current = onLongPress;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const posRef = useRef({ x: 0, y: 0 });

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      timerRef.current = setTimeout(() => cbRef.current(), duration);
    },
    [duration],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!timerRef.current) return;
      const dx = Math.abs(e.clientX - posRef.current.x);
      const dy = Math.abs(e.clientY - posRef.current.y);
      if (dx > 10 || dy > 10) clear();
    },
    [clear],
  );

  const onPointerUp = useCallback(() => clear(), [clear]);
  const onPointerLeave = useCallback(() => clear(), [clear]);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerLeave, clear };
}
