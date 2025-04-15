"use client"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { useTheme } from "../../context/ThemeContext"

export default function Footer() {
  const { colors } = useTheme()

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r ${colors.primary} text-white py-8 px-4`}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Event Dictionary</h3>
            <p className="text-sm opacity-80">
              Your gateway to the most exciting events, gatherings, and experiences around you.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/events" className="text-sm hover:underline">
                  Events
                </a>
              </li>
              <li>
                <a href="/tickets" className="text-sm hover:underline">
                  My Tickets
                </a>
              </li>
              <li>
                <a href="/favorite" className="text-sm hover:underline">
                  Favorites
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Connect With Us</h4>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-gray-200"
              >
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-gray-200"
              >
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-gray-200"
              >
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-gray-200"
              >
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <p className="text-sm opacity-80">© {new Date().getFullYear()} Event Dictionary. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  )
}
