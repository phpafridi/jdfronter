"use client";
import { useEffect } from "react";
import type { Script } from "@/lib/pages";

// The original theme (sliders, menus, product galleries) is jQuery-based.
// Load its scripts in order after the page HTML is in the DOM.
export default function LegacyScripts({ scripts }: { scripts: Script[] }) {
  useEffect(() => {
    let cancelled = false;
    const added: HTMLScriptElement[] = [];
    (async () => {
      for (const s of scripts) {
        if (cancelled) return;
        const el = document.createElement("script");
        if (s.src) {
          el.src = s.src;
          el.async = false;
          await new Promise<void>((res) => {
            el.onload = el.onerror = () => res();
            document.body.appendChild(el);
          });
        } else {
          el.text = s.code ?? "";
          document.body.appendChild(el);
        }
        added.push(el);
      }
      // let jQuery "ready" / window "load" handlers in the theme fire
      if (!cancelled) window.dispatchEvent(new Event("load"));
    })();
    return () => { cancelled = true; added.forEach((e) => e.remove()); };
  }, [scripts]);
  return null;
}
