import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export default function RelatedEvents({ categoryId, currentEventId }) {
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function getRelatedEvents(categoryId) {
    try {
      const { data } = await axios.get(`http://127.0.0.1:8000/api/events?category=${categoryId}`);
      setRelatedEvents(data.filter((event) => event._id !== currentEventId));
    } catch (error) {
      console.error("Error fetching related events:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (categoryId) {
      getRelatedEvents(categoryId);
    }
  }, [categoryId]);

  function handleEventClick(eventId) {
    navigate(`/event/${eventId}`);
  }

  return (
    <>
      {relatedEvents.length > 0 && (
        <>
          <h2 className="text-3xl font-bold mt-16 mb-6 text-center md:text-left">
            <span className="border-b-4 border-emerald-500 pb-1 text-gray-800">Related Events</span>
          </h2>
          <div className="gap-y-2 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fadeIn">
            {relatedEvents.map((event) => (
              <div
                key={event._id}
                className="cursor-pointer bg-white shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-8px] flex flex-col"
                onClick={() => handleEventClick(event._id)}
              >
                <div className="relative">
                  <img
                    src={event.imageCover || "/placeholder.svg"}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold text-emerald-600">
                    ${event.price}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{event.name}</h3>
                  <p className="text-emerald-600 font-bold mt-2">${event.price}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}