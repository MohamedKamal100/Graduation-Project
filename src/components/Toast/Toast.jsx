"use client"

import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faTimesCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"

// Toast types and their corresponding styles
const TOAST_TYPES = {
  SUCCESS: {
    icon: faCheckCircle,
    bgClass: "bg-green-100 dark:bg-green-900/30",
    textClass: "text-green-800 dark:text-green-200",
    iconClass: "text-green-500 dark:text-green-400",
  },
  ERROR: {
    icon: faTimesCircle,
    bgClass: "bg-red-100 dark:bg-red-900/30",
    textClass: "text-red-800 dark:text-red-200",
    iconClass: "text-red-500 dark:text-red-400",
  },
  INFO: {
    icon: faInfoCircle,
    bgClass: "bg-blue-100 dark:bg-blue-900/30",
    textClass: "text-blue-800 dark:text-blue-200",
    iconClass: "text-blue-500 dark:text-blue-400",
  },
  WARNING: {
    icon: faExclamationCircle,
    bgClass: "bg-yellow-100 dark:bg-yellow-900/30",
    textClass: "text-yellow-800 dark:text-yellow-200",
    iconClass: "text-yellow-500 dark:text-yellow-400",
  },
}

export const Toast = ({ message, type = "INFO", duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true)
  const toastStyle = TOAST_TYPES[type] || TOAST_TYPES.INFO

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        onClose && onClose()
      }, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center p-4 mb-4 rounded-lg shadow-lg transition-opacity duration-300 ${toastStyle.bgClass} ${toastStyle.textClass} ${visible ? "opacity-100" : "opacity-0"}`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3">
        <FontAwesomeIcon icon={toastStyle.icon} className={`w-5 h-5 ${toastStyle.iconClass}`} />
      </div>
      <div className="text-sm font-normal max-w-xs">{message}</div>
      <button
        type="button"
        className={`ml-3 -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${toastStyle.textClass} hover:bg-white/20 focus:ring-2 focus:ring-gray-300`}
        onClick={() => {
          setVisible(false)
          setTimeout(() => onClose && onClose(), 300)
        }}
        aria-label="Close"
      >
        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast

