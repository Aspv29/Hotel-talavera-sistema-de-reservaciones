import React, { forwardRef } from "react";
import { BookingData, BookingSummary } from "../types";

interface LivePreviewProps {
  data: BookingData;
  summary: BookingSummary;
}

const LivePreview = forwardRef<HTMLDivElement, LivePreviewProps>(
  ({ data, summary }, ref) => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "--/--/----";
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <div
        ref={ref}
        className="card flex flex-col p-6 min-h-[400px]"
        aria-label="Vista previa de confirmación de reserva"
      >
        <h2 className="text-2xl font-serif font-bold mb-6 text-gold">
          Resumen de la reserva
        </h2>

        <div className="flex flex-col gap-3 font-mono text-gray-700">
          <div>
            <strong>No. Folio:</strong> {summary.folio}
          </div>
          <div>
            <strong>Nombre:</strong> {data.firstName} {data.lastName}
          </div>
          <div>
            <strong>Entrada:</strong> {formatDate(data.checkIn)}
          </div>
          <div>
            <strong>Salida:</strong> {formatDate(data.checkOut)}
          </div>
          <div>
            <strong>Noches:</strong> {summary.nights}
          </div>
          <div>
            <strong>Hab:</strong> {data.numberOfRooms}
          </div>
          <div>
            <strong>Tipo:</strong> {data.roomType}
          </div>
          <div>
            <strong>Precio/Noche:</strong> ${summary.pricePerNight.toFixed(2)}
          </div>

          <div className="border-t border-gray-400 pt-3 mt-4 font-semibold text-lg text-gold">
            Total: ${summary.totalCost.toFixed(2)}
          </div>
        </div>

        <footer className="mt-auto text-center mt-8 font-serif text-xs text-gray-500">
          Gracias por su preferencia - Hotel Talavera
        </footer>
      </div>
    );
  }
);

LivePreview.displayName = "LivePreview";

export default LivePreview;