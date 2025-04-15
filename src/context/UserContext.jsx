"use client"

import { createContext, useState, useEffect } from "react"

export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  // Initialize user data from localStorage
  const [userLogin, setUserLogin] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  })

  const [userData, setUserData] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem("userData")
      return storedUserData ? JSON.parse(storedUserData) : null
    }
    return null
  })

  // Update localStorage when token changes
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      setUserLogin(localStorage.getItem("token"))
    }
  }, [])

  // Function to handle user login
  const handleLogin = (token, user) => {
    // Store token
    localStorage.setItem("token", token)
    setUserLogin(token)

    // Store user role
    if (user.role) {
      localStorage.setItem("role", user.role)
    }

    // Store user ID
    if (user.id) {
      localStorage.setItem("userId", user.id)
    }

    // Store full user data
    localStorage.setItem("userData", JSON.stringify(user))
    setUserData(user)
  }

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("userId")
    localStorage.removeItem("userData")
    setUserLogin(null)
    setUserData(null)
  }

  // Function to update user data
  const updateUserData = (newData) => {
    const updatedData = { ...userData, ...newData }
    localStorage.setItem("userData", JSON.stringify(updatedData))
    setUserData(updatedData)
  }

  return (
    <UserContext.Provider
      value={{
        userLogin,
        userData,
        handleLogin,
        handleLogout,
        updateUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
