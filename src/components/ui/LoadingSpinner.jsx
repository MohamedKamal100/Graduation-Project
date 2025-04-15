"use client"
import { motion } from "framer-motion"

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.div
          animate={{
            rotate: 360,
            boxShadow: [
              "0px 0px 0px 0px rgba(129, 140, 248, 0)",
              "0px 0px 10px 3px rgba(129, 140, 248, 0.3)",
              "0px 0px 0px 0px rgba(129, 140, 248, 0)",
            ],
          }}
          transition={{
            rotate: { duration: 1.5, ease: "linear", repeat: Number.POSITIVE_INFINITY },
            boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY },
          }}
          className="w-16 h-16 rounded-full border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent"
        />
        <motion.div
          animate={{
            rotate: -360,
            boxShadow: [
              "0px 0px 0px 0px rgba(168, 85, 247, 0)",
              "0px 0px 10px 3px rgba(168, 85, 247, 0.3)",
              "0px 0px 0px 0px rgba(168, 85, 247, 0)",
            ],
          }}
          transition={{
            rotate: { duration: 2, ease: "linear", repeat: Number.POSITIVE_INFINITY },
            boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 },
          }}
          className="w-10 h-10 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-gray-600 dark:text-gray-300 font-medium mt-4"
      >
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          {text}
        </motion.span>
      </motion.p>
    </div>
  )
}

export default LoadingSpinner
