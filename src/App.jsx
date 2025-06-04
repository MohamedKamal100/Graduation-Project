import "./App.css";
import "./variables.css";
// Import component styles
import "./components/CategoryCarasoul/CategoryCarasoul.css";
import "./components/EventCard/EventCard.css";
import "./components/HotEvents/HotEvents.css";
import "./components/ReviewStars/ReviewStars.css";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Tickets from "./components/Tickets/Tickets";
import Register from "./components/Register/Register";
import NotFound from "./components/NotFound/NotFound";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Landing from "./components/Landing/Landing";
import Layout from "./components/Layout/Layout";
import Events from "./components/Events/Events";
import Favorite from "./components/Favorite/Favorite";
import Dashboard from "./components/admin/Dashboard";
import EventsManagement from "./components/admin/EventsManagement";
import UsersManagement from "./components/admin/UserManagement";
import EventForm from "./components/admin/EventForm";
import UserContextProvider from "./context/UserContext";
import EventsProvider from "./context/EventsContext";
import ToastProvider from "./context/ToastContext";
import BookingProvider from "./context/BookingContext";
import ReviewProvider from "./context/ReviewContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute/AdminProtectedRoute";
import EventDetails from "./components/EventDetails/EventDetails";
import Profile from "./components/Profile/Profile";
import WishlistProvider from "./context/WishlistContext";
import CartContextProvider from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import AdminLayout from "./components/admin/AdminLayout";
import Checkout from "./components/Checkout/Checkout";
import CheckoutConfirmation from "./components/Checkout/CheckoutConfirmation";
import { ApiProvider } from "./context/ApiContext";
import TicketsManagement from "./components/admin/TicketsManagment";

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
});

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
          path: "/checkout/:id",
          element: (
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          ),
        },
        {
          path: "/checkout/confirmation/:id",
          element: (
            <ProtectedRoute>
              <CheckoutConfirmation />
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
        { path: "", index: true, element: <Landing /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "*", element: <NotFound /> },
      ],
    },
    // Admin routes in a separate layout
    {
      path: "/admin",
      element: (
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      ),
      children: [
        { index: true, element: <Dashboard /> }, // Default admin page
        { path: "dashboard", element: <Dashboard /> },
        { path: "events", element: <EventsManagement /> },
        { path: "events/create", element: <EventForm isEditing={false} /> },
        {
          path: "events/edit/:eventId",
          element: <EventForm isEditing={true} />,
        },
        { path: "users", element: <UsersManagement /> },
        { path: "tickets", element: <TicketsManagement /> },
      ],
    },
    // Redirect /dashboard to /admin for convenience
    {
      path: "/dashboard",
      element: <Navigate to="/admin" replace />,
    },
  ]);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ApiProvider>
            <UserContextProvider>
              <EventsProvider>
                <BookingProvider>
                  <CartContextProvider>
                    <WishlistProvider>
                      <ReviewProvider>
                        <RouterProvider router={router} />
                      </ReviewProvider>
                    </WishlistProvider>
                  </CartContextProvider>
                </BookingProvider>
              </EventsProvider>
            </UserContextProvider>
          </ApiProvider>
        </ToastProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
