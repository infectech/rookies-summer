"use client";

import Image from "next/image";
import Marquee from "@/components/Marquee";
import { BLUR_PLACEHOLDER } from "@/lib/image";

const REVIEW_IMAGES = [
  "/Reviews/file_0000000013748207aa98b9641bcc9ee0.png",
  "/Reviews/file_0000000027b482069b6c42396c96affc.png",
  "/Reviews/file_00000000ac8482078b1e55a04256dfd1.png",
  "/Reviews/file_00000000f0e08211aec9858739a9a4a9.png",
  "/Reviews/file_00000000f49c82119bf6009fcc095206.png",
  "/Reviews/file_00000000f8d0820793b0e70d1479d968.png",
];

export default function ReviewsSection() {
  return (
    <section id="reviews" className="w-full bg-muted/40 py-16">
      <div className="mx-auto mb-10 w-full max-w-[1600px] px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-semibold text-black">
          What Our Customers Say
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Real conversations, real orders, real happy customers.
        </p>
      </div>

      <Marquee speed={45}>
        <div className="flex items-stretch gap-6 pr-6">
          {REVIEW_IMAGES.map((src) => (
            <div
              key={src}
              className="relative aspect-square w-[280px] shrink-0 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm sm:w-[360px]"
            >
              <Image
                src={src}
                alt="Rookies customer review"
                fill
                sizes="(max-width: 640px) 280px, 360px"
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
              />
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
}
