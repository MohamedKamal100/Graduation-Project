"use client"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons"
import { useTheme } from "../../context/ThemeContext"
import { Link } from "react-router-dom"

export default function Footer() {
  const { theme } = useTheme?.() || { theme: "light" }
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const footerLinks = {
    quickLinks: [
      { name: "Home", path: "/home" },
      { name: "Events", path: "/events" },
      { name: "My Tickets", path: "/tickets" },
      { name: "Favorites", path: "/favorite" },
    ],
    support: [
      { name: "Help Center", path: "/help" },
      { name: "Contact Us", path: "/contact" },
      { name: "FAQs", path: "/faqs" },
      { name: "Privacy Policy", path: "/privacy" },
    ],
  }

  const socialLinks = [
    { icon: faFacebook, name: "Facebook", url: "#" },
    { icon: faTwitter, name: "Twitter", url: "#" },
    { icon: faInstagram, name: "Instagram", url: "#" },
    { icon: faLinkedin, name: "LinkedIn", url: "#" },
  ]

  return (
    <footer className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-900"} text-white pt-8 pb-4`}>
      <div className="container mx-auto px-4">
        {/* Top section with logo and links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 border-b border-gray-800 pb-8">
          {/* Logo and info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                EV
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                EventVibe
              </span>
            </div>
            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-400"} mb-4 text-sm`}>
              Your gateway to the most exciting events and experiences.
            </p>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-400 text-sm" />
              </div>
              <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-400"} text-sm`}>
                123 Event Street, City, Country
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-2">
                <FontAwesomeIcon icon={faPhone} className="text-purple-400 text-sm" />
              </div>
              <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-400"} text-sm`}>
                +1 (555) 123-4567
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"></span>
            </h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index} className="transition-transform duration-200 hover:translate-x-1">
                  <Link
                    to={link.path}
                    className={`${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-400 hover:text-white"} text-sm transition-colors`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 relative inline-block">
              Support
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"></span>
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index} className="transition-transform duration-200 hover:translate-x-1">
                  <Link
                    to={link.path}
                    className={`${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-400 hover:text-white"} text-sm transition-colors`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 relative inline-block">
              Newsletter
              <span className="absolute -bottom-1 left-0 w-10 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"></span>
            </h4>
            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-400"} mb-3 text-sm`}>
              Stay updated with the latest events
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                required
              />
              <button
                type="submit"
                className="absolute right-1 top-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-md text-sm"
                disabled={subscribed}
              >
                Subscribe
              </button>
            </form>
            {subscribed && <p className="text-green-400 mt-2 text-xs">Thanks for subscribing!</p>}
          </div>
        </div>

        {/* Bottom section with social links and copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-300"
                aria-label={social.name}
              >
                <FontAwesomeIcon icon={social.icon} className="text-sm" />
              </a>
            ))}
          </div>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-xs`}>
            © {new Date().getFullYear()} EventVibe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
