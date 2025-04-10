import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PulseLoader } from "react-spinners";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// استيراد الصور من الـ assets
import sportsImage from "../../assets/sports.jpeg";
import concertImage from "../../assets/concert.webp";
import theaterImage from "../../assets/theatre.jpeg";
import conferenceImage from "../../assets/conference.jpeg";
import defaultImage from "../../assets/logo.jpeg";

const CategoryCarasoul = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://127.0.0.1:8000/api/events";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const uniqueCategories = [...new Set(response.data.map(event => event.category))];
        const categoryList = uniqueCategories.map((category, index) => ({
          id: index,
          name: category,
          image: getCategoryImage(category), // استخدام الصور من الـ assets
          count: response.data.filter(event => event.category === category).length
        }));

        setCategories(categoryList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error.response?.data || error.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // دالة لإرجاع الصورة المناسبة من الـ assets
  const getCategoryImage = (category) => {

    switch (category?.toLowerCase()) {
      case "sports":
        return sportsImage;
      case "concert":
        return concertImage;
      case "theater":
        return theaterImage;
      case "conference":
        return conferenceImage;
      default:
        return defaultImage;
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/events?category=${category.name}`);
  };

  // الأسهم المخصصة للتنقل
  const CustomArrow = ({ onClick, direction }) => (
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md cursor-pointer hover:bg-gray-100 ${direction === "left" ? "left-4" : "right-4"
        }`}
      onClick={onClick}
    >
      {direction === "left" ? <FaArrowLeft /> : <FaArrowRight />}
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        }
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex justify-between items-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse by Category</h2>
        <Link to="/events" className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
          View All
          <FaArrowRight className="ml-1" />
        </Link>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <PulseLoader color="#6D28D9" size={15} />
        </div>
      ) : (
        <Slider {...settings}>
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="block group cursor-pointer px-2">
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex flex-col items-center p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-full h-48 rounded-lg overflow-hidden mb-3"
                  >
                    <img
                      src={category.image} // استخدام الصورة المستوردة
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <span className="text-sm font-medium text-gray-900 text-center">{category.name}</span>
                  <span className="text-xs text-gray-500 mt-1">{category.count} Events</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default CategoryCarasoul;