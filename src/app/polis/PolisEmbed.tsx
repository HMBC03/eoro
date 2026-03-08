"use client";

import { useEffect, useRef } from "react";

interface PolisEmbedProps {
  pageId: string;
}

export default function PolisEmbed({ pageId }: PolisEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create the polis div
    const polisDiv = document.createElement("div");
    polisDiv.className = "polis";
    polisDiv.setAttribute("data-page_id", pageId);
    polisDiv.setAttribute(
      "data-site_id",
      "polis_site_id_OaeOnHVtk0CCCPZxKl"
    );
    containerRef.current.appendChild(polisDiv);

    // Load the polis script
    const script = document.createElement("script");
    script.src = "https://pol.is/embed.js";
    script.async = true;
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [pageId]);

  return (
    <div
      ref={containerRef}
      className="min-h-[400px] rounded-xl bg-white overflow-hidden"
    />
  );
}
