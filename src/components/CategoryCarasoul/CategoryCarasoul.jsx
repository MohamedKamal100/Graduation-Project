"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { PulseLoader } from "react-spinners"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { FaBasketballBall, FaMusic, FaTheaterMasks, FaUsers, FaCalendarAlt } from "react-icons/fa"

// استيراد الصور من الـ assets
import sportsImage from "../../assets/sports.jpeg"
import concertImage from "../../assets/concert.webp"
import theaterImage from "../../assets/theatre.jpeg"
import conferenceImage from "../../assets/conference.jpeg"
import defaultImage from "../../assets/logo.jpeg"

const CategoryCarasoul = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const API_URL = "http://127.0.0.1:8000/api/events"
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        const uniqueCategories = [...new Set(response.data.map((event) => event.category))]
        const categoryList = uniqueCategories.map((category, index) => ({
          id: index,
          name: category,
          image: getCategoryImage(category),
          icon: getCategoryIcon(category),
          count: response.data.filter((event) => event.category === category).length,
        }))

        setCategories(categoryList)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching events:", error.response?.data || error.message)
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // دالة لإرجاع الصورة المناسبة من الـ assets
  const getCategoryImage = (category) => {
    switch (category?.toLowerCase()) {
      case "sports":
        return sportsImage
      case "concert":
        return concertImage
      case "theater":
        return theaterImage
      case "conference":
        return conferenceImage
      default:
        return defaultImage
    }
  }

  // دالة لإرجاع الأيقونة المناسبة لكل فئة
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "sports":
        return FaBasketballBall
      case "concert":
        return FaMusic
      case "theater":
        return FaTheaterMasks
      case "conference":
        return FaUsers
      default:
        return FaCalendarAlt
    }
  }

  const handleCategoryClick = (category) => {
    navigate(`/events?category=${category.name}`)
  }

  // الأسهم المخصصة للتنقل
  const CustomArrow = ({ onClick, direction }) => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`absolute top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md cursor-pointer hover:bg-gray-100 ${direction === "left" ? "left-2" : "right-2"
        }`}
      onClick={onClick}
    >
      {direction === "left" ? <FaArrowLeft /> : <FaArrowRight />}
    </motion.div>
  )

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center gap-1 mt-4"> {dots} </ul>
      </div>
    ),
    customPaging: () => <div className="w-2 h-2 bg-gray-300 rounded-full hover:bg-purple-400 transition-colors"></div>,
  }

  // Simple animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  // Category colors for the circles
  const categoryColors = [
    "bg-purple-100 text-purple-600",
    "bg-blue-100 text-blue-600",
    "bg-pink-100 text-pink-600",
    "bg-green-100 text-green-600",
    "bg-amber-100 text-amber-600",
    "bg-red-100 text-red-600",
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Browse by Category</h2>
        <Link to="/events" className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
          View All
          <FaArrowRight className="ml-1" />
        </Link>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <PulseLoader color="#8B5CF6" size={15} />
        </div>
      ) : (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
          <Slider {...settings}>
            {categories.map((category, index) => {
              const colorClass = categoryColors[index % categoryColors.length]
              const Icon = category.icon

              return (
                <motion.div key={category.id} variants={itemVariants} className="px-2 py-2">
                  <div className="flex flex-col items-center">
                    <motion.div
                      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => handleCategoryClick(category)}
                      className={`relative flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full cursor-pointer ${colorClass} mb-3`}
                    >
                      <Icon className="text-3xl md:text-4xl" />
                    </motion.div>
                    <span className="text-sm font-medium text-center">{category.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{category.count} Events</span>
                  </div>
                </motion.div>
              )
            })}
          </Slider>
        </motion.div>
      )}
    </div>
  )
}

export default CategoryCarasoul
