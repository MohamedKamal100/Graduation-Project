import { jsPDF } from "jspdf"
import "jspdf-autotable"

/**
 * Generate and download a PDF ticket
 * @param {Object} ticket - The ticket object with event details
 */
export const generateTicketPDF = async (ticket) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Set document properties
    doc.setProperties({
      title: `Event Ticket - ${ticket.event?.name || "Event"}`,
      subject: "Event Ticket",
      author: "Events Dashboard",
      keywords: "ticket, event, pdf",
      creator: "Events Dashboard",
    })

    // Add background color
    doc.setFillColor(245, 247, 250)
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F")

    // Add header
    doc.setFillColor(79, 70, 229) // Indigo color
    doc.rect(0, 0, doc.internal.pageSize.width, 40, "F")

    // Add title
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(24)
    doc.text("EVENT TICKET", doc.internal.pageSize.width / 2, 20, { align: "center" })

    // Add ticket details section
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(15, 50, doc.internal.pageSize.width - 30, 100, 3, 3, "F")

    // Add event name
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(18)
    doc.text(ticket.event?.name || "Event", doc.internal.pageSize.width / 2, 65, { align: "center" })

    // Add ticket details
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")

    const startY = 80
    const lineHeight = 8

    doc.text(`Ticket ID: ${ticket.id}`, 25, startY)
    doc.text(`Date: ${formatDate(ticket.event?.date)}`, 25, startY + lineHeight)
    doc.text(`Location: ${ticket.event?.location || "N/A"}`, 25, startY + lineHeight * 2)
    doc.text(`Quantity: ${ticket.quantity || 1}`, 25, startY + lineHeight * 3)
    doc.text(
      `Price: $${typeof ticket.price === "number" ? ticket.price.toFixed(2) : Number.parseFloat(ticket.price || 0).toFixed(2)}`,
      25,
      startY + lineHeight * 4,
    )
    doc.text(`Status: ${ticket.status || "Booked"}`, 25, startY + lineHeight * 5)

    // Generate QR code
    try {
      // Import QRCode dynamically to avoid server-side rendering issues
      const QRCode = await import("qrcode")
      const qrCodeDataUrl = await QRCode.default.toDataURL(
        `TICKET:${ticket.id}|EVENT:${ticket.event_id}|USER:${localStorage.getItem("userId") || "user"}|TIME:${Date.now()}`,
        {
          errorCorrectionLevel: "H",
          margin: 1,
          width: 200,
          color: {
            dark: "#4c1d95", // Purple color for dark modules
            light: "#ffffff", // White color for light modules
          },
        },
      )

      // Add QR code
      doc.addImage(qrCodeDataUrl, "PNG", doc.internal.pageSize.width - 65, startY - 10, 40, 40)
    } catch (qrError) {
      console.error("Error generating QR code:", qrError)
      // Continue without QR code if there's an error
    }

    // Add footer
    doc.setFillColor(79, 70, 229) // Indigo color
    doc.rect(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.text(
      "This ticket is valid only with a valid ID. Non-transferable.",
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" },
    )

    // Add terms and instructions
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.text("Instructions:", 25, 165)
    doc.text("1. Please arrive at least 30 minutes before the event starts.", 25, 175)
    doc.text("2. Present this ticket at the entrance (printed or on your device).", 25, 185)
    doc.text("3. This ticket is valid only with a valid ID.", 25, 195)
    doc.text("4. No refunds available after purchase.", 25, 205)

    // Add event details
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Event Details", 25, 225)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(
      `Description: ${ticket.event?.description?.substring(0, 100) || "No description available"}${ticket.event?.description?.length > 100 ? "..." : ""}`,
      25,
      235,
    )

    // Save the PDF
    doc.save(`ticket-${ticket.id}.pdf`)

    return true
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}

/**
 * Format date for display
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (e) {
    return dateString
  }
}
