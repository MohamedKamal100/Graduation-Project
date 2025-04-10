"use client"

import { createContext, useContext, useState } from "react"
import Toast from "../components/Toast/Toast"

// Create context
export const ToastContext = createContext()

// Custom hook to use the context
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  // Add a new toast
  const showToast = (message, type = "INFO", duration = 3000) => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }])
    return id
  }

  // Remove a toast by id
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  // Shorthand methods for different toast types
  const success = (message, duration) => showToast(message, "SUCCESS", duration)
  const error = (message, duration) => showToast(message, "ERROR", duration)
  const info = (message, duration) => showToast(message, "INFO", duration)
  const warning = (message, duration) => showToast(message, "WARNING", duration)

  return (
    <ToastContext.Provider value={{ showToast, removeToast, success, error, info, warning }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider

