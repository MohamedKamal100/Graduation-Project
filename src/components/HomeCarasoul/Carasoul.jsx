"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faArrowLeft, faCalendarAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons"

export default function Carasoul() {
  const [currentImage, setCurrentImage] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Enhanced event data with titles and descriptions
  const events = [
    {
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
      title: "Summer Music Festival",
      description: "Experience the ultimate music festival with top artists from around the world",
      date: "July 15-17, 2025",
      location: "Central Park, New York",
    },
    {
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
      title: "Tech Conference 2025",
      description: "Join industry leaders and innovators at the biggest tech event of the year",
      date: "August 10-12, 2025",
      location: "Convention Center, San Francisco",
    },
    {
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
      title: "Food & Wine Festival",
      description: "Taste exquisite cuisine and fine wines from renowned chefs and wineries",
      date: "September 5-7, 2025",
      location: "Riverfront Plaza, Chicago",
    },
    {
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop",
      title: "International Art Exhibition",
      description: "Discover breathtaking artworks from talented artists across the globe",
      date: "October 20-25, 2025",
      location: "Metropolitan Museum, London",
    },
  ]

  // Automated image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % events.length)
        setIsVisible(true)
      }, 500)
    }, 6000)

    return () => clearInterval(interval)
  }, [events.length])

  const prevImage = () => {
    setIsVisible(false)
    setTimeout(() => {
      setCurrentImage((prev) => (prev - 1 + events.length) % events.length)
      setIsVisible(true)
    }, 500)
  }

  const nextImage = () => {
    setIsVisible(false)
    setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % events.length)
      setIsVisible(true)
    }, 500)
  }

  // Animation variants
  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-b from-purple-900 to-indigo-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRtMC0xMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNG0xMCA1YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00bS0xMC01YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00bS0xMCA1YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
      </div>

      {/* Carousel container */}
      <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
        <div className="w-full max-w-6xl relative">
          {/* Previous button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white text-3xl bg-purple-600 p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </motion.button>

          {/* Image and content container */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl h-[400px] md:h-[500px]">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-indigo-900/60 to-transparent z-10"></div>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                exit="exit"
                variants={imageVariants}
                className="absolute inset-0"
              >
                <img
                  src={events[currentImage].image || "/placeholder.svg"}
                  alt={events[currentImage].title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                exit="exit"
                variants={textVariants}
                className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 text-white"
              >
                <motion.div variants={textVariants} className="max-w-xl">
                  <motion.span
                    variants={textVariants}
                    className="inline-block bg-purple-600 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4"
                  >
                    Featured Event
                  </motion.span>
                  <motion.h1
                    variants={textVariants}
                    className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg"
                  >
                    {events[currentImage].title}
                  </motion.h1>
                  <motion.p variants={textVariants} className="text-lg md:text-xl mb-6 text-purple-100">
                    {events[currentImage].description}
                  </motion.p>
                  <motion.div variants={textVariants} className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex items-center text-purple-200">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      <span>{events[currentImage].date}</span>
                    </div>
                    <div className="flex items-center text-purple-200">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      <span>{events[currentImage].location}</span>
                    </div>
                  </motion.div>
                  <motion.button
                    variants={textVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white text-3xl bg-purple-600 p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </motion.button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(() => {
                    setCurrentImage(index)
                    setIsVisible(true)
                  }, 500)
                }}
                className={`w-3 h-3 rounded-full transition-all ${currentImage === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
