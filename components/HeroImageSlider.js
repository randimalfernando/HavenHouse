"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ImagePlaceholder from "@/components/ImagePlaceholder";

const SLIDES = [
  { src: "/images/hero/hero-1.jpg", alt: "Haven House photo 1" },
  { src: "/images/hero/hero-2.jpg", alt: "Haven House photo 2" },
  { src: "/images/hero/hero-3.jpg", alt: "Haven House photo 3" },
];

const INTERVAL_MS = 5000;

export default function HeroImageSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [erroredSlides, setErroredSlides] = useState({});
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || paused) return;

    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="group"
      aria-label="Haven House photos"
    >
      {SLIDES.map((slide, index) => (
        <div
          key={slide.src}
          className={"hero-slider__slide" + (index === activeIndex ? " is-active" : "")}
          aria-hidden={index !== activeIndex}
        >
          {erroredSlides[index] ? (
            <div className="hero-slider__placeholder-wrap">
              <ImagePlaceholder label={slide.alt} ratio="banner" />
            </div>
          ) : (
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
              priority={index === 0}
              onError={() => setErroredSlides((prev) => ({ ...prev, [index]: true }))}
            />
          )}
        </div>
      ))}

      <div className="hero-slider__overlay" aria-hidden="true" />

      <div className="hero-slider__dots">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            className={"hero-slider__dot" + (index === activeIndex ? " is-active" : "")}
            aria-label={`Show photo ${index + 1}`}
            aria-current={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}