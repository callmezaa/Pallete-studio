"use client";

import { useState, useEffect } from "react";

const KEY = "ps-visited";

export function useFirstVisit() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) {
      localStorage.setItem(KEY, "true");
      setShow(true);
    }
  }, []);

  return {
    show,
    dismiss: () => setShow(false),
  };
}
