"use client";

import { useEffect } from "react";

export default function ScrollFadeObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.12 }
    );

    // Observe existing elements
    const observe = () => {
      document.querySelectorAll("[data-fade]").forEach((el) => observer.observe(el));
    };

    observe();

    // Re-observe on DOM mutations (for dynamically rendered content)
    const mutation = new MutationObserver(observe);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return null;
}
