
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { PulseLoader } from "react-spinners"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { FaBasketballBall, FaMusic, FaTheaterMasks, FaUsers, FaCalendarAlt } from "react-icons/fa"
import { useEvents } from "../../context/EventsContext"

// Import the dedicated CSS file
import "./CategoryCarasoul.css"

const CategoryCarousel = () => {
  const navigate = useNavigate()
  const { events, loading } = useEvents()
  const [categories, setCategories] = useState([])

  // Extract unique categories from events
  useEffect(() => {
    if (events && events.length > 0) {
      const uniqueCategories = [...new Set(events.map((event) => event.category).filter(Boolean))]
      const categoryList = uniqueCategories.map((category, index) => ({
        id: index,
        name: category,
        count: events.filter((event) => event.category === category).length,
      }))
      setCategories(categoryList)
    }
  }, [events])

  // Function to return the appropriate icon for each category
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

  // Custom arrows for navigation
  const CustomArrow = ({ onClick, direction }) => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`custom-arrow ${direction === "left" ? "left" : "right"}`}
      onClick={onClick}
    >
      {direction === "left" ? <FaArrowLeft /> : <FaArrowRight />}
    </motion.div>
  )

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    // nextArrow: <CustomArrow direction="right" />,
    // prevArrow: <CustomArrow direction="left" />,
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

  // Animation variants
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
    "category-color-1",
    "category-color-2",
    "category-color-3",
    "category-color-4",
    "category-color-5",
    "category-color-6",
  ]

  return (
    <div className="category-carousel-container container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="category-carousel-header"
      >
        <h2 className="category-carousel-title">Browse by Category</h2>
        <Link to="/events" className="category-carousel-link">
          View All
          <FaArrowRight className="ml-1" />
        </Link>
      </motion.div>

      {loading ? (
        <div className="category-loading">
          <PulseLoader color="#8B5CF6" size={15} />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="category-carousel"
        >
          <Slider {...settings}>
            {categories.map((category, index) => {
              const colorClass = categoryColors[index % categoryColors.length]
              const Icon = getCategoryIcon(category.name)

              return (
                <motion.div key={category.id} variants={itemVariants} className="category-fade-in">
                  <div className="category-item">
                    <motion.div
                      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => handleCategoryClick(category)}
                      className={`category-circle ${colorClass}`}
                    >
                      <Icon className="text-3xl md:text-4xl" />
                    </motion.div>
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">{category.count} Events</span>
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

export default CategoryCarousel
