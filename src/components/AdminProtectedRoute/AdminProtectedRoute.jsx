
// import React from 'react'
// import style from "./AdminProtectedRoute.module.css"
// import { Navigate } from 'react-router-dom';
// export default function AdminProtectedRoute({ children }) {

//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");
//   if (!token || role !== "admin") {
//     return <Navigate to="/login" />;
//   }
//   else {
//     return children
//   }


// }


"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "../../context/UserContext"

const AdminProtectedRoute = ({ children }) => {
  const { userLogin, userData, loading } = useContext(UserContext)

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Check if user is logged in and has admin role
  if (!userLogin || userData?.role !== "admin") {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AdminProtectedRoute

