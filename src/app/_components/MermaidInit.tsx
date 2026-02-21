"use client";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false, theme: "default" });

export async function runMermaid() {
  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>(".mermaid:not([data-processed])")
  );
  if (nodes.length > 0) {
    try {
      await mermaid.run({ nodes });
    } catch (err) {
      console.error("mermaid render error:", err);
    }
  }
}

export default function MermaidInit() {
  return null;
}
