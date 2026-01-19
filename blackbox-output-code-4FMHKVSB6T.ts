import jsPDF from "jspdf";
import { BookingData, BookingSummary } from "../types";

export const generateConfirmationPDF = async (
  bookingData: BookingData,
  bookingSummary: BookingSummary
) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor("#c68652");
  doc.text("Hotel Talavera", 105, 25, { align: "center" });

  doc.setFontSize(18);
  doc.text("Confirmación de Reservación", 105, 40, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor("#333333");
  doc.text(`Folio No: ${bookingSummary.folio}`, 20, 60);
  doc.text(
    `Nombre: ${bookingData.firstName} ${bookingData.lastName}`,
    20,
    70
  );
  doc.text(`Entrada: ${bookingData.checkIn}`, 20, 80);
  doc.text(`Salida: ${bookingData.checkOut}`, 20, 90);
  doc.text(`Tipo de habitación: ${bookingData.roomType}`, 20, 100);
  doc.text(`Número de habitaciones: ${bookingData.numberOfRooms}`, 20, 110);
  doc.text(`Noches: ${bookingSummary.nights}`, 20, 120);
  doc.text(
    `Precio por noche: $${bookingSummary.pricePerNight.toFixed(2)}`,
    20,
    130
  );
  doc.text(`Total a pagar: $${bookingSummary.totalCost.toFixed(2)}`, 20, 140);

  doc.setFontSize(10);
  doc.setTextColor("#777777");
  doc.text("Gracias por reservar con Hotel Talavera", 105, 160, {
    align: "center",
  });

  const pdfBlob = doc.output("blob");

  const pdfUrl = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = `Reservacion_${bookingSummary.folio}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(pdfUrl);
};