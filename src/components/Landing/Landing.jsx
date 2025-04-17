"use client"

import { useContext, useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendarCheck,
  faUsers,
  faMapMarkerAlt,
  faTicketAlt,
  faArrowRight,
  faStar,
  faChevronDown,
  faMusic,
  faTheaterMasks,
  faUtensils,
  faGraduationCap,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons"
import { UserContext } from "../../context/UserContext"
import { useTheme } from "../../context/ThemeContext"
import kamal from "../../assets/kamal.jpg"
import nayef from "../../assets/nayef.jpg"
import atef from "../../assets/atef.png"

const LandingPage = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const { userLogin } = useContext(UserContext)
  const { colors } = useTheme?.() || {
    colors: {
      primary: "from-purple-600 to-blue-500",
      button: "bg-gradient-to-r from-purple-600 to-blue-500",
      light: "bg-purple-100",
      text: "text-purple-600",
    },
  }
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

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

  // Categories
  const categories = [
    { icon: faMusic, name: "Concerts", color: "bg-pink-500" },
    { icon: faTheaterMasks, name: "Theater", color: "bg-purple-500" },
    { icon: faUtensils, name: "Food & Drink", color: "bg-yellow-500" },
    { icon: faGraduationCap, name: "Workshops", color: "bg-blue-500" },
    { icon: faLightbulb, name: "Conferences", color: "bg-green-500" },
  ]

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const categoryVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    hover: {
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero Section with Animated Background */}
      <motion.div ref={heroRef} className="relative min-h-screen flex items-center" style={{ opacity, scale }}>
        {/* Animated Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images[currentImage]})` }}
          ></motion.div>
          <div className={`absolute inset-0 bg-gradient-to-r ${colors.primary} opacity-70`}></div>

          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/20 backdrop-blur-sm"
                style={{
                  width: Math.random() * 30 + 10,
                  height: Math.random() * 30 + 10,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100],
                  x: [0, Math.random() * 100 - 50],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10 text-white">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Discover & Celebrate{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 animate-pulse-glow">
                Unforgettable
              </span>{" "}
              Events
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Your gateway to the most exciting events, gatherings, and experiences around you.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              {userLogin ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/home"
                    className={`px-8 py-3 ${colors.button} rounded-full text-white font-medium text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center group`}
                  >
                    Get Started
                    <motion.span
                      className="inline-block ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                    </motion.span>
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className={`px-8 py-3 ${colors.button} rounded-full text-white font-medium text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center group`}
                    >
                      Get Started
                      <motion.span
                        className="inline-block ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                      >
                        <FontAwesomeIcon icon={faArrowRight} />
                      </motion.span>
                    </Link>
                  </motion.div>

                </>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          <motion.p
            className="text-white text-sm mb-2 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            Scroll to explore
          </motion.p>
          <FontAwesomeIcon icon={faChevronDown} className="text-white text-xl animate-bounce" />
        </motion.div>
      </motion.div>

      {/* Categories Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect event that matches your interests and passions.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-8"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <motion.div key={index} className="text-center" variants={categoryVariants} whileHover="hover">
                <div
                  className={`w-24 h-24 ${category.color} rounded-full mx-auto flex items-center justify-center text-white text-3xl shadow-lg mb-3 transform transition-all duration-300 hover:scale-110 hover:shadow-xl`}
                >
                  <FontAwesomeIcon icon={category.icon} />
                </div>
                <p className="font-medium text-gray-800">{category.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose EventVibe?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're more than just an events platform. We're your companion in discovering experiences that will last a
              lifetime.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
                whileHover={{ y: -5 }}
              >
                <div
                  className={`w-16 h-16 ${colors.light} rounded-2xl flex items-center justify-center mb-6 ${colors.text} transform transition-transform duration-300 hover:rotate-6`}
                >
                  <FontAwesomeIcon icon={feature.icon} className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              { value: "10K+", label: "Events" },
              { value: "50K+", label: "Users" },
              { value: "100+", label: "Cities" },
              { value: "4.9", label: "Rating" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100"
              >
                <motion.h3
                  className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what people are saying about EventVibe.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                name: "Mohamed Atef",
                role: "Event Enthusiast",
                quote:
                  "EventVibe has completely changed how I discover events. I've attended amazing concerts and workshops I would have never found otherwise!",
                rating: 5,
                image: atef,
              },
              {
                name: "Mohamed Kamal",
                role: "Local Artist",
                quote:
                  "As an artist, I've been able to reach a wider audience for my exhibitions. The platform is intuitive and the support team is fantastic.",
                rating: 5,
                image: kamal,
              },
              {
                name: "Mohamed Nayef",
                role: "Food Blogger",
                quote:
                  "I've discovered so many food festivals and culinary events through this platform. It's become an essential tool for my blogging career.",
                rating: 4,
                image: nayef,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                whileHover={{ y: -5 }}
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
                <p className="text-gray-600 italic mb-6 text-lg">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                  />
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Events</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Check out these trending events that you won't want to miss.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Summer Music Festival",
                date: "Jun 15-18, 2025",
                location: "Central Park, New York",
                image:
                  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                category: "Music",
              },
              {
                title: "Tech Conference 2025",
                date: "Jul 10-12, 2025",
                location: "Convention Center, San Francisco",
                image:
                  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                category: "Technology",
              },
              {
                title: "Food & Wine Festival",
                date: "Aug 5-7, 2025",
                location: "Waterfront Park, Chicago",
                image:
                  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                category: "Food",
              },
            ].map((event, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                whileHover={{ y: -5 }}
              >
                <div className="relative overflow-hidden h-48">
                  <motion.img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {event.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{event.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FontAwesomeIcon icon={faCalendarCheck} className="mr-2 text-purple-500" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-purple-500" />
                    <span>{event.location}</span>
                  </div>
                  <motion.button
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link to={userLogin ? "/events" : "/register"}>
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore All Events
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* App Download Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get the EventVibe App</h2>
              <p className="text-lg text-gray-600 mb-6">
                Download our mobile app to discover events on the go, get personalized recommendations, and never miss
                out on what's happening around you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5,2H8.5L8,2.5v19L8.5,22h9l0.5-0.5v-19L17.5,2z M16,20H10V4h6V20z"></path>
                    <path d="M15,7h-4V5h4V7z"></path>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </motion.button>
                <motion.button
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.5,20.5l0.5,0.5h16l0.5-0.5v-17L20,3H4L3.5,3.5V20.5z M13.22,4h6.28v16H4.5V4H13.22z"></path>
                    <path d="M17,7h-5V5h5V7z"></path>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative mx-auto w-64 h-[500px] md:w-80">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-[3rem] transform rotate-6"></div>
                <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border-4 border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"
                    alt="EventVibe App"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-20 bg-gradient-to-r ${colors.primary} text-white`}>
        <div className="container mx-auto px-6 text-center">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Discover Amazing Events?
            </motion.h2>
            <motion.p
              className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join thousands of users who are already discovering and attending the best events in their area.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {userLogin ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/home"
                    className="px-8 py-4 bg-white text-purple-600 hover:bg-gray-100 rounded-full font-medium text-lg transition-all shadow-lg hover:shadow-xl inline-block"
                  >
                    Explore Events
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className="px-8 py-4 bg-white text-purple-600 hover:bg-gray-100 rounded-full font-medium text-lg transition-all shadow-lg hover:shadow-xl inline-block"
                    >
                      Sign Up Now
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/login"
                      className="px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white font-medium text-lg transition-all border border-white/30 shadow-lg hover:shadow-xl inline-block"
                    >
                      Learn More
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>


    </div>
  )
}

export default LandingPage
