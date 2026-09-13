"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BLUR_PLACEHOLDER } from "@/lib/image";

export interface ProductSliderApi {
  scrollTo: (index: number) => void;
}

interface ProductSliderProps {
  images: string[];
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  onApiChange?: (api: ProductSliderApi | null) => void;
  onSlideChange?: (index: number) => void;
}

export default function ProductSlider({
  images,
  alt,
  className,
  imageClassName,
  priority = false,
  onApiChange,
  onSlideChange,
}: ProductSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const idx = emblaApi.selectedScrollSnap();
      setSelectedIndex(idx);
      onSlideChange?.(idx);
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSlideChange]);

  useEffect(() => {
    if (!onApiChange) return;
    onApiChange(emblaApi ? { scrollTo } : null);
  }, [emblaApi, onApiChange, scrollTo]);

  useEffect(() => {
    if (!emblaApi || images.length <= 1) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 2500);
    return () => clearInterval(interval);
  }, [emblaApi, images.length]);

  return (
    <div className={cn("group relative overflow-hidden rounded-2xl bg-muted", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div key={src} className="relative min-w-0 flex-[0_0_100%]">
              <div className={cn("relative aspect-3/4 w-full", imageClassName)}>
                <Image
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority={priority && i === 0}
                  loading={priority && i === 0 ? undefined : "lazy"}
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              scrollPrev();
            }}
            className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              scrollNext();
            }}
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="size-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollTo(i);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === selectedIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
