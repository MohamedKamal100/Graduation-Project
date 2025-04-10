import React, { createContext } from 'react'
export let CartContext = createContext()
export default function CartContextProvider({ children }) {


  function addProductToCard(eventId) {
    axios.post(`http://127.0.0.1:8000/api/tickets`, {
      event_id: eventId,
      quantity,
      user_id: userId,
      price: event.price,
      type: "regular", // Changed from "standard" to "regular"
      status: "booked",
    },
    )
  }


  return <CartContext.Provider value={{}}>
    {children}
  </CartContext.Provider>
}
