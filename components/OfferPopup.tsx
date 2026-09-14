"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BLUR_PLACEHOLDER } from "@/lib/image";

export function OfferPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4"
      onClick={() => setOpen(false)}
    >
      <div className="relative max-h-[90vh] max-w-sm">
        <button
          onClick={() => setOpen(false)}
          aria-label="Close offer"
          className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg"
        >
          ✕
        </button>
        <Image
          src="/offer.png"
          alt="Special offer"
          width={600}
          height={800}
          className="max-h-[90vh] w-full rounded-lg object-contain shadow-2xl"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
        />
      </div>
    </div>
  );
}
