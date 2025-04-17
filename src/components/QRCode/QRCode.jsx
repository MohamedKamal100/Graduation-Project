// "use client"

// import { useEffect, useState } from "react"
// import QRCode from "qrcode"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faSpinner, faTicketAlt, faQrcode } from "@fortawesome/free-solid-svg-icons"

// const TicketQRCode = ({ ticketId, eventId, userId }) => {
//   const [qrCodeUrl, setQrCodeUrl] = useState("")
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const generateQRCode = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         // Create QR code data with ticket, event, and user information
//         const qrData = `TICKET:${ticketId}|EVENT:${eventId}|USER:${userId}|TIME:${Date.now()}`

//         // Generate QR code as data URL
//         const dataUrl = await QRCode.toDataURL(qrData, {
//           errorCorrectionLevel: "H",
//           margin: 1,
//           width: 300,
//           color: {
//             dark: "#4c1d95", // Purple color for dark modules
//             light: "#ffffff", // White color for light modules
//           },
//         })

//         setQrCodeUrl(dataUrl)
//       } catch (err) {
//         console.error("Error generating QR code:", err)
//         setError("Failed to generate QR code")
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (ticketId && eventId) {
//       generateQRCode()
//     }
//   }, [ticketId, eventId, userId])

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center p-8">
//         <FontAwesomeIcon icon={faSpinner} spin className="text-purple-600 text-3xl mb-4" />
//         <p className="text-gray-600 dark:text-gray-400">Generating QR code...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center p-8">
//         <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg mb-4">
//           <p>{error}</p>
//         </div>
//         <button
//           onClick={() => window.location.reload()}
//           className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
//         >
//           Try Again
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col items-center justify-center p-4">
//       <div className="bg-white p-4 rounded-lg shadow-lg qr-code-container">
//         {qrCodeUrl ? (
//           <img src={qrCodeUrl || "/placeholder.svg"} alt="Ticket QR Code" className="w-64 h-64 object-contain" />
//         ) : (
//           <div className="w-64 h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
//             <FontAwesomeIcon icon={faQrcode} className="text-gray-400 text-5xl" />
//           </div>
//         )}
//       </div>

//       <div className="mt-6 text-center">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-center">
//           <FontAwesomeIcon icon={faTicketAlt} className="mr-2 text-purple-600" />
//           Ticket #{ticketId}
//         </h3>
//         <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Present this QR code at the event entrance</p>
//         <p className="text-xs text-gray-500 dark:text-gray-500">Valid only with a matching ID</p>
//       </div>
//     </div>
//   )
// }

// export default TicketQRCode

"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faTicketAlt, faQrcode } from "@fortawesome/free-solid-svg-icons"

const TicketQRCode = ({ ticketId, eventId, userId }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true)
        setError(null)

        // Create QR code data with ticket, event, and user information
        const qrData = `TICKET:${ticketId}|EVENT:${eventId}|USER:${userId}|TIME:${Date.now()}`

        // Generate QR code as data URL
        const dataUrl = await QRCode.toDataURL(qrData, {
          errorCorrectionLevel: "H",
          margin: 1,
          width: 300,
          color: {
            dark: "#4c1d95", // Purple color for dark modules
            light: "#ffffff", // White color for light modules
          },
        })

        setQrCodeUrl(dataUrl)
      } catch (err) {
        console.error("Error generating QR code:", err)
        setError("Failed to generate QR code")
      } finally {
        setLoading(false)
      }
    }

    if (ticketId && eventId) {
      generateQRCode()
    }
  }, [ticketId, eventId, userId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <FontAwesomeIcon icon={faSpinner} spin className="text-purple-600 text-3xl mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Generating QR code...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg qr-code-container">
        {qrCodeUrl ? (
          <img src={qrCodeUrl || "/placeholder.svg"} alt="Ticket QR Code" className="w-64 h-64 object-contain" />
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <FontAwesomeIcon icon={faQrcode} className="text-gray-400 text-5xl" />
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-center">
          <FontAwesomeIcon icon={faTicketAlt} className="mr-2 text-purple-600" />
          Ticket #{ticketId}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Present this QR code at the event entrance</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">Valid only with a matching ID</p>
      </div>
    </div>
  )
}

export default TicketQRCode
