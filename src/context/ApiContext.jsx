"use client"

import { createContext, useContext, useState, useCallback } from "react"
import axios from "axios"

const ApiContext = createContext()

export const useApi = () => useContext(ApiContext)

export const ApiProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false)
  const [globalError, setGlobalError] = useState(null)

  const API_URL = import.meta.env?.REACT_APP_API_URL || window.env?.REACT_APP_API_URL || "http://127.0.0.1:8000/api"

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // Add request interceptor to include auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // Generic fetch function with loading state
  const fetchData = useCallback(async (endpoint, options = {}) => {
    const { showLoader = true, errorMessage = "Failed to fetch data" } = options

    if (showLoader) setGlobalLoading(true)
    setGlobalError(null)

    try {
      const response = await api.get(endpoint)
      return response.data
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      setGlobalError(errorMessage)
      throw error
    } finally {
      if (showLoader) setGlobalLoading(false)
    }
  }, [])

  // Generic post function
  const postData = useCallback(async (endpoint, data, options = {}) => {
    const { showLoader = true, errorMessage = "Failed to submit data" } = options

    if (showLoader) setGlobalLoading(true)
    setGlobalError(null)

    try {
      const response = await api.post(endpoint, data)
      return response.data
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error)
      setGlobalError(errorMessage)
      throw error
    } finally {
      if (showLoader) setGlobalLoading(false)
    }
  }, [])

  // Generic update function
  const updateData = useCallback(async (endpoint, data, options = {}) => {
    const { showLoader = true, errorMessage = "Failed to update data" } = options

    if (showLoader) setGlobalLoading(true)
    setGlobalError(null)

    try {
      const response = await api.put(endpoint, data)
      return response.data
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error)
      setGlobalError(errorMessage)
      throw error
    } finally {
      if (showLoader) setGlobalLoading(false)
    }
  }, [])

  // Generic delete function
  const deleteData = useCallback(async (endpoint, options = {}) => {
    const { showLoader = true, errorMessage = "Failed to delete data" } = options

    if (showLoader) setGlobalLoading(true)
    setGlobalError(null)

    try {
      const response = await api.delete(endpoint)
      return response.data
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error)
      setGlobalError(errorMessage)
      throw error
    } finally {
      if (showLoader) setGlobalLoading(false)
    }
  }, [])

  const value = {
    globalLoading,
    globalError,
    setGlobalError,
    fetchData,
    postData,
    updateData,
    deleteData,
    api,
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}
