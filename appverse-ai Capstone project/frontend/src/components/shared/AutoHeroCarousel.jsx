import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firstSlide from "../../assets/firstSlide.png";
import secondSlide from "../../assets/secondSlide.png";
import thirdSlide from "../../assets/thirdSlide.png";

const heroSlides = [
  {
    image: firstSlide,
    tag: "FEATURED APP",
    title: "CodeMentor AI",
    description: "Learn to code 10x faster with an AI tutor that adapts to your pace.",
    cta: "Install now",
    to: "/apps/6",
  },
  {
    image: secondSlide,
    tag: "NEW RELEASE",
    title: "ConnectHub",
    description: "The social space for creators - chat, share, and grow your circle.",
    cta: "Try ConnectHub",
    to: "/apps/9",
  },
  {
    image: thirdSlide,
    tag: "NEW RELEASE",
    title: "CleanMaster AI",
    description: "Smarter device cleanup powered by on-device AI. Free forever.",
    cta: "Get it free",
    to: "/apps/10",
  },
];

function ArrowIcon({ direction = "right" }) {
  const path = direction === "left" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6";
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d={path} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AutoHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % heroSlides.length);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
      <div className="relative overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(3,7,18,0.16)]">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <div
              key={slide.title}
              className="relative min-w-full overflow-hidden bg-black"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                draggable="false"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,20,0.82)_0%,rgba(5,8,20,0.50)_34%,rgba(5,8,20,0.06)_58%,rgba(5,8,20,0.02)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(255,255,255,0.08),transparent_18%)]" />

              <div className="relative flex h-[340px] flex-col overflow-hidden sm:h-[420px] lg:h-[500px] lg:flex-row">
                <div className="relative z-10 flex w-full flex-col justify-center px-6 py-10 text-white sm:px-10 lg:w-[58%] lg:px-14">
                  <span className="hero-glass-pill relative inline-flex w-fit items-center overflow-hidden rounded-full !border border-white/70 bg-white/14 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] !text-white backdrop-blur-md">
                    <span className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent opacity-90" />
                    <span className="relative">{slide.tag}</span>
                  </span>
                  <h2 className="mt-5 max-w-xl text-4xl font-extrabold tracking-tight !text-white sm:text-5xl lg:text-[4.1rem] lg:leading-[0.95]">
                    {slide.title}
                  </h2>
                  <p className="mt-5 max-w-xl text-base leading-7 !text-white sm:text-lg">
                    {slide.description}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      to={slide.to}
                      className="inline-flex items-center gap-3 rounded-full !bg-white px-6 py-3.5 text-sm font-semibold !text-slate-900 shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:scale-[1.02]"
                    >
                      {slide.cta}
                      <ArrowIcon />
                    </Link>
                    <Link
                      to="/apps"
                      className="hero-glass-pill inline-flex items-center gap-2 rounded-full border border-white/90 bg-transparent px-5 py-3 text-sm font-semibold !text-white backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition hover:bg-white/10"
                    >
                      Explore apps
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full !bg-white/85 p-3 !text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.18)] transition hover:!bg-white"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={goToNext}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full !bg-white/85 p-3 !text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.18)] transition hover:!bg-white"
        >
          <ArrowIcon />
        </button>

        <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-10 !bg-white"
                  : "w-2.5 !bg-white/45 hover:!bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
