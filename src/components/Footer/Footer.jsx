"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faTwitter, faInstagram, faLinkedin, faYoutube, faTiktok } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope, faPaperPlane, faPhone, faMapMarkerAlt, faHeart } from "@fortawesome/free-solid-svg-icons"
import { useTheme } from "../../context/ThemeContext"
import { Link } from "react-router-dom"

export default function Footer() {
  const { colors, theme } = useTheme?.() || {
    colors: {
      primary: "from-purple-600 to-blue-500",
      button: "bg-gradient-to-r from-purple-600 to-blue-500",
      light: "bg-purple-100",
      text: "text-purple-600",
    },
    theme: "light",
  }

  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      // Here you would typically send the email to your backend
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const footerLinks = {
    quickLinks: [
      { name: "Home", path: "/home" },
      { name: "Events", path: "/events" },
      { name: "My Tickets", path: "/tickets" },
      { name: "Favorites", path: "/favorite" },
      { name: "Categories", path: "/categories" },
    ],
    support: [
      { name: "Help Center", path: "/help" },
      { name: "Contact Us", path: "/contact" },
      { name: "FAQs", path: "/faqs" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Careers", path: "/careers" },
      { name: "Blog", path: "/blog" },
      { name: "Press", path: "/press" },
      { name: "Partners", path: "/partners" },
    ],
  }

  const socialLinks = [
    { icon: faFacebook, name: "Facebook", url: "#" },
    { icon: faTwitter, name: "Twitter", url: "#" },
    { icon: faInstagram, name: "Instagram", url: "#" },
    { icon: faLinkedin, name: "LinkedIn", url: "#" },
    { icon: faYoutube, name: "YouTube", url: "#" },
    { icon: faTiktok, name: "TikTok", url: "#" },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        {/* Top section with logo and newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 border-b border-gray-800 pb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                EV
              </div>
              <span className="text-2xl font-bold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                EventVibe
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Your gateway to the most exciting events, gatherings, and experiences around you. Discover, connect, and
              celebrate with EventVibe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-400" />
                </div>
                <span className="text-gray-400">123 Event Street, City, Country</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faPhone} className="text-purple-400" />
                </div>
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-purple-400" />
              </div>
              <span className="text-gray-400">info@eventvibe.com</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold mb-6">Subscribe to Our Newsletter</h3>
            <p className="text-gray-400 mb-6">
              Stay updated with the latest events and exclusive offers. No spam, just the good stuff!
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-6 py-4 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-16"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-2 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white"
                disabled={subscribed}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </motion.button>
            </form>
            {subscribed && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-green-400 mt-2">
                Thanks for subscribing!
              </motion.p>
            )}
            <div className="flex items-center mt-6">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <p className="text-gray-400 text-sm">We're currently active and planning new events</p>
            </div>
          </motion.div>
        </div>

        {/* Middle section with links */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link to={link.path} className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 opacity-0 group-hover:opacity-100"></span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link to={link.path} className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 opacity-0 group-hover:opacity-100"></span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Company
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link to={link.path} className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 opacity-0 group-hover:opacity-100"></span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Connect With Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"></span>
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-300"
                  aria-label={social.name}
                >
                  <FontAwesomeIcon icon={social.icon} size="lg" />
                </motion.a>
              ))}
            </div>
            <div className="mt-6 bg-gray-800 p-4 rounded-lg">
              <h5 className="font-medium text-white mb-2">Download Our App</h5>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5,2H8.5L8,2.5v19L8.5,22h9l0.5-0.5v-19L17.5,2z M16,20H10V4h6V20z"></path>
                    <path d="M15,7h-4V5h4V7z"></path>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">App Store</div>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.5,20.5l0.5,0.5h16l0.5-0.5v-17L20,3H4L3.5,3.5V20.5z M13.22,4h6.28v16H4.5V4H13.22z"></path>
                    <path d="M17,7h-5V5h5V7z"></path>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Google Play</div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              className="text-gray-400 text-sm mb-4 md:mb-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              © {new Date().getFullYear()} EventVibe. All rights reserved.
            </motion.p>
            <motion.div
              className="flex space-x-6 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </motion.div>
          </div>
          <motion.div
            className="text-center mt-6 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>
              Made with <FontAwesomeIcon icon={faHeart} className="text-red-500 mx-1" /> by EventVibe Team
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
