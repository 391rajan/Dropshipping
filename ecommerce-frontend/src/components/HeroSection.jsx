// src/components/HeroSection.jsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // For navigation arrows
import { Link } from "react-router-dom"; // For CTA button

const heroSlides = [
  {
    image: "/images/banner1.webp", // Use different, high-quality banner images
    title: "Discover Your Next Favorite Product",
    subtitle: "Curated collections for every need.",
    ctaText: "Shop New Arrivals",
    ctaLink: "/shop/new-arrivals",
  },
  {
    image: "/images/banner2.webp",
    title: "Unbeatable Deals This Week!",
    subtitle: "Don't miss out on limited-time offers.",
    ctaText: "Explore Deals",
    ctaLink: "/offers",
  },
  {
    image: "/images/banner3.webp",
    title: "Quality Products, Delivered Fast",
    subtitle: "Your dropshipping journey starts here.",
    ctaText: "Find Your Style",
    ctaLink: "/shop/clothing",
  },
];

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, []);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-gray-100 mb-12 sm:mb-16">
      <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] xl:h-[650px]"> {/* Responsive height */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Overlay for text readability and visual depth */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-center p-4">
              <div className="text-white max-w-2xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl mb-8 drop-shadow-md">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.ctaLink}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-40 p-2 rounded-full text-white hover:bg-opacity-60 transition-colors duration-200 z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft size={30} />
        </button>
        <button
          onClick={goToNextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-40 p-2 rounded-full text-white hover:bg-opacity-60 transition-colors duration-200 z-10"
          aria-label="Next slide"
        >
          <ChevronRight size={30} />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-gray-400 bg-opacity-70"
              } transition-colors duration-300`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;