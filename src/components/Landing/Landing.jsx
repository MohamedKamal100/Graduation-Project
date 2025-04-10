"use client"

import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendarCheck,
  faUsers,
  faMapMarkerAlt,
  faTicketAlt,
  faArrowRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons"
import { UserContext } from "../../context/UserContext"



const LandingPage = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  let { userLogin } = useContext(UserContext)

  // Array of event images
  const images = [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop",
  ]

  // Animated image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length)
        setIsVisible(true)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Features data
  const features = [
    {
      icon: faCalendarCheck,
      title: "Discover Events",
      description: "Find exciting events happening around you. From concerts to workshops, we've got you covered.",
    },
    {
      icon: faUsers,
      title: "Connect with People",
      description: "Meet like-minded individuals who share your interests and passions.",
    },
    {
      icon: faMapMarkerAlt,
      title: "Explore Venues",
      description: "Discover new and exciting venues in your city and beyond.",
    },
    {
      icon: faTicketAlt,
      title: "Easy Booking",
      description: "Book tickets with just a few clicks and secure your spot at the hottest events.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Animated Background */}
      <div className="relative min-h-screen flex items-center">
        {/* Animated Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${images[currentImage]})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-indigo-900/70"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Discover & Celebrate <span className="text-purple-300">Unforgettable</span> Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Your gateway to the most exciting events, gatherings, and experiences around you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {userLogin ? <>    <Link
                to="/home"
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-medium text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Get Started <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Link>
              </> : <> <Link
                to="/register"
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-medium text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Get Started <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white font-medium text-lg transition-colors border border-white/30 shadow-lg hover:shadow-xl"
                >
                  Sign In
                </Link></>}

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Event Dictionary?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're more than just an events platform. We're your companion in discovering experiences that will last a
              lifetime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                  <FontAwesomeIcon icon={feature.icon} className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what people are saying about Event Dictionary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Mohamed atef",
                role: "Event Enthusiast",
                quote:
                  "Event Dictionary has completely changed how I discover events. I've attended amazing concerts and workshops I would have never found otherwise!",
                rating: 5,
              },
              {
                name: "Mohamed Kamal",
                role: "Local Artist",
                quote:
                  "As an artist, I've been able to reach a wider audience for my exhibitions. The platform is intuitive and the support team is fantastic.",
                rating: 5,
              },
              {
                name: "Mohamed Nayef",
                role: "Food Blogger",
                quote:
                  "I've discovered so many food festivals and culinary events through this platform. It's become an essential tool for my blogging career.",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className={`${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"} text-lg`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Discover Amazing Events?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already discovering and attending the best events in their area.
          </p>
          {userLogin ? <Link
            to="/home"
            className="px-8 py-3 bg-white text-purple-600 hover:bg-gray-100 rounded-full font-medium text-lg transition-colors shadow-lg hover:shadow-xl inline-block"
          >
            Get Started Today
          </Link> : <Link
            to="/login"
            className="px-8 py-3 bg-white text-purple-600 hover:bg-gray-100 rounded-full font-medium text-lg transition-colors shadow-lg hover:shadow-xl inline-block"
          >
            Get Started Today
          </Link>}
        </div>
      </div>
    </div>
  )
}

export default LandingPage

