
// import './App.css'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Tickets from './components/Tickets/Tickets';
// import Register from './components/Register/Register';
// import NotFound from './components/NotFound/NotFound';
// import Login from './components/Login/Login'
// import Home from './components/Home/Home'
// import Landing from './components/Landing/Landing';
// import Layout from './components/Layout/Layout';
// import Events from './components/Events/Events';
// import Favorite from './components/Favorite/Favorite';
// import Dashboard from './components/admin/dashboard';
// import UserContextProvider from './context/UserContext';
// import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
// import AdminProtectedRoute from './components/AdminProtectedRoute/AdminProtectedRoute';
// import EventDetails from './components/EventDetails/EventDetails';




// function App() {

//   let router = createBrowserRouter([
//     {
//       path: '', element: <Layout />, children: [
//         { path: 'home', element: <ProtectedRoute><Home /></ProtectedRoute> },
//         { path: 'dashboard', element: <AdminProtectedRoute><Dashboard /></AdminProtectedRoute> },
//         { path: 'tickets', element: <ProtectedRoute><Tickets /></ProtectedRoute> },
//         { path: 'events', element: <ProtectedRoute><Events /></ProtectedRoute> },
//         { path: '/eventDetails/:id', element: <ProtectedRoute><EventDetails /></ProtectedRoute> },

//         { path: 'Favorite', element: <ProtectedRoute><Favorite /></ProtectedRoute> },
//         { index: true, element: <Landing /> },
//         { path: 'login', element: <Login /> },
//         { path: 'register', element: <Register /> },
//         { path: '*', element: <NotFound /> },
//       ]
//     }
//   ])

//   return (
//     <>
//       <UserContextProvider> <RouterProvider router={router}>

//       </RouterProvider></UserContextProvider>

//     </>
//   )
// }

// export default App
// import "./App.css"
// import { createBrowserRouter, RouterProvider } from "react-router-dom"
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
// import Tickets from "./components/Tickets/Tickets"
// import Register from "./components/Register/Register"
// import NotFound from "./components/NotFound/NotFound"
// import Login from "./components/Login/Login"
// import Home from "./components/Home/Home"
// import Landing from "./components/Landing/Landing"
// import Layout from "./components/Layout/Layout"
// import Events from "./components/Events/Events"
// import Favorite from "./components/Favorite/Favorite"
// import Dashboard from "./components/admin/dashboard"
// import UserContextProvider from "./context/UserContext"
// import EventsProvider from "./context/EventsContext"
// import ToastProvider from "./context/ToastContext"
// import BookingProvider from "./context/BookingContext"
// import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
// import AdminProtectedRoute from "./components/AdminProtectedRoute/AdminProtectedRoute"
// import EventDetails from "./components/EventDetails/EventDetails"
// import Profile from "./components/Profile/Profile"
// import WishlistProvider from "./context/WishlistContext"
// import CartContextProvider from "./context/CartContext"
// // Create React Query client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
//       cacheTime: 1000 * 60 * 30, // Data remains in cache for 30 minutes
//       refetchOnWindowFocus: false, // Don't refetch when window regains focus
//       retry: 1, // Only retry once on failure
//     },
//   },
// })

// function App() {
//   const router = createBrowserRouter([
//     {
//       path: "",
//       element: <Layout />,
//       children: [
//         {
//           path: "home",
//           element: (
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           ),
//         },
//         {
//           path: "dashboard",
//           element: (
//             <AdminProtectedRoute>
//               <Dashboard />
//             </AdminProtectedRoute>
//           ),
//         },
//         {
//           path: "tickets",
//           element: (
//             <ProtectedRoute>
//               <Tickets />
//             </ProtectedRoute>
//           ),
//         },
//         {
//           path: "events",
//           element: (
//             <ProtectedRoute>
//               <Events />
//             </ProtectedRoute>
//           ),
//         },
//         {
//           path: "/eventDetails/:id",
//           element: (
//             <ProtectedRoute>
//               <EventDetails />
//             </ProtectedRoute>
//           ),
//         },
//         {
//           path: "favorite",
//           element: (
//             <ProtectedRoute>
//               <Favorite />
//             </ProtectedRoute>
//           ),
//         },
//         {
//           path: "profile",
//           element: (
//             <ProtectedRoute>
//               <Profile />
//             </ProtectedRoute>
//           ),
//         },
//         { index: true, element: <Landing /> },
//         { path: "login", element: <Login /> },
//         { path: "register", element: <Register /> },
//         { path: "*", element: <NotFound /> },
//       ],
//     },
//   ])

//   return (
//     <>
//       <QueryClientProvider client={queryClient}>
//         <ToastProvider>
//           <UserContextProvider>
//             <EventsProvider>

//               <BookingProvider><CartContextProvider>
//                 <WishlistProvider>
//                   <RouterProvider router={router} />
//                 </WishlistProvider>
//               </CartContextProvider>
//               </BookingProvider>
//             </EventsProvider>
//           </UserContextProvider>
//         </ToastProvider>
//         <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
//       </QueryClientProvider>
//     </>
//   )
// }

// export default App



import "./App.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import Tickets from "./components/Tickets/Tickets"
import Register from "./components/Register/Register"
import NotFound from "./components/NotFound/NotFound"
import Login from "./components/Login/Login"
import Home from "./components/Home/Home"
import Landing from "./components/Landing/Landing"
import Layout from "./components/Layout/Layout"
import Events from "./components/Events/Events"
import Favorite from "./components/Favorite/Favorite"
import Dashboard from "./components/admin/Dashboard"
import EventsManagement from "./components/admin/EventsManagement"
import UsersManagement from "./components/admin/UserManagement"
import EventForm from "./components/admin/EventForm"
import UserContextProvider from "./context/UserContext"
import EventsProvider from "./context/EventsContext"
import ToastProvider from "./context/ToastContext"
import BookingProvider from "./context/BookingContext"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import AdminProtectedRoute from "./components/AdminProtectedRoute/AdminProtectedRoute"
import EventDetails from "./components/EventDetails/EventDetails"
import Profile from "./components/Profile/Profile"
import WishlistProvider from "./context/WishlistContext"
import CartContextProvider from "./context/CartContext"

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Data remains in cache for 30 minutes
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1, // Only retry once on failure
    },
  },
})

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "home",
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        // Admin routes
        {
          path: "admin",
          element: (
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          ),
        },
        {
          path: "admin/events",
          element: (
            <AdminProtectedRoute>
              <EventsManagement />
            </AdminProtectedRoute>
          ),
        },
        {
          path: "admin/events/create",
          element: (
            <AdminProtectedRoute>
              <EventForm isEditing={false} />
            </AdminProtectedRoute>
          ),
        },
        {
          path: "admin/events/edit/:eventId",
          element: (
            <AdminProtectedRoute>
              <EventForm isEditing={true} />
            </AdminProtectedRoute>
          ),
        },
        {
          path: "admin/users",
          element: (
            <AdminProtectedRoute>
              <UsersManagement />
            </AdminProtectedRoute>
          ),
        },
        {
          path: "tickets",
          element: (
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          ),
        },
        {
          path: "events",
          element: (
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          ),
        },
        {
          path: "/eventDetails/:id",
          element: (
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "favorite",
          element: (
            <ProtectedRoute>
              <Favorite />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        { index: true, element: <Landing /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <UserContextProvider>
            <EventsProvider>
              <BookingProvider>
                <CartContextProvider>
                  <WishlistProvider>
                    <RouterProvider router={router} />
                  </WishlistProvider>
                </CartContextProvider>
              </BookingProvider>
            </EventsProvider>
          </UserContextProvider>
        </ToastProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </>
  )
}

export default App
