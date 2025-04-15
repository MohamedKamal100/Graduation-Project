import { motion } from "framer-motion"
import Carasoul from "../HomeCarasoul/Carasoul"
import CategoryCarasoul from "../CategoryCarasoul/CategoryCarasoul"
import HotEvents from "../HotEvents/HotEvents"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarCheck, faTicketAlt, faUsers, faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons"

export default function Home() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Carousel */}
      <Carasoul />

      {/* Features Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl"
        >
          <FontAwesomeIcon icon={faCalendarCheck} className="text-4xl mb-4" />
          <h3 className="text-xl font-bold mb-2">Discover Events</h3>
          <p className="text-purple-100">Find amazing events happening around you and never miss out on the fun.</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl"
        >
          <FontAwesomeIcon icon={faTicketAlt} className="text-4xl mb-4" />
          <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
          <p className="text-pink-100">Book tickets in seconds with our streamlined checkout process.</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl"
        >
          <FontAwesomeIcon icon={faUsers} className="text-4xl mb-4" />
          <h3 className="text-xl font-bold mb-2">Connect with Others</h3>
          <p className="text-blue-100">Meet like-minded people who share your interests and passions.</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl"
        >
          <FontAwesomeIcon icon={faMapMarkedAlt} className="text-4xl mb-4" />
          <h3 className="text-xl font-bold mb-2">Explore Venues</h3>
          <p className="text-amber-100">Discover new and exciting venues for unforgettable experiences.</p>
        </motion.div>
      </motion.div>

      {/* Categories Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 py-8 rounded-t-[3rem] shadow-inner">
        <CategoryCarasoul />
      </div>

      {/* Hot Events Section */}
      <div className="bg-white dark:bg-gray-900 py-8">
        <HotEvents />
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 px-4 rounded-b-[3rem] shadow-lg"
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience Amazing Events?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who discover and book events through our platform every day.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-700 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Explore All Events
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
