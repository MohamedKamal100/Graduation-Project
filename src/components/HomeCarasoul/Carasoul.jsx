import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Carasoul() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Array of event images
  const images = [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop",
  ];

  // Automated image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const prevImage = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
      setIsVisible(true);
    }, 500);
  };

  const nextImage = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
      setIsVisible(true);
    }, 500);
  };

  return (
    <div className="h-72 flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 transition-opacity duration-500"
        style={{ backgroundImage: `url(${images[currentImage]})`, opacity: isVisible ? 0.3 : 0 }}
      ></div>

      {/* Carousel container */}
      <div className="relative flex items-center gap-6 p-6 w-full max-w-5xl">
        {/* Previous button */}
        <button
          onClick={prevImage}
          className="absolute left-0 text-white text-3xl bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-700 transition-transform duration-200 transform hover:scale-110 z-10"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        {/* Image container */}
        <div className="w-full h-64 flex justify-center items-center">
          <img
            src={images[currentImage]}
            alt={`Event ${currentImage + 1}`}
            className={`w-full h-full object-cover rounded-lg shadow-2xl transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"
              }`}
          />
        </div>

        {/* Next button */}
        <button
          onClick={nextImage}
          className="absolute right-0 text-white text-3xl bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-700 transition-transform duration-200 transform hover:scale-110 z-10"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
}
