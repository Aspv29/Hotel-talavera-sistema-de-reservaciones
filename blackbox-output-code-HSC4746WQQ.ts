import React, { useState, useMemo, useRef } from "react";
import {
  BookingData,
  BookingSummary,
  RoomType,
  getRoomPrice,
} from "./types";
import BookingForm from "./components/BookingForm";
import LivePreview from "./components/LivePreview";
import LockScreen from "./components/LockScreen";
import { generateConfirmationPDF } from "./services/pdfGenerator";
import { Building2, Lock } from "lucide-react";
import html2canvas from "html2canvas";

const ADMIN_PASSWORD = "Talavera2026";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    checkIn: "",
    checkOut: "",
    roomType: RoomType.STANDARD,
    numberOfRooms: 1,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleUnlock = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLock = () => {
    setIsAuthenticated(false);
  };

  const summary = useMemo<BookingSummary>(() => {
    let folio = "---";
    if (bookingData.lastName && bookingData.checkIn) {
      const cleanLastName = bookingData.lastName.trim().toUpperCase().replace(/\s+/g, "");
      const [y, m, d] = bookingData.checkIn.split("-");
      folio = `${cleanLastName}${d}${m}${y}`;
    }

    let nights = 0;
    if (bookingData.checkIn && bookingData.checkOut) {
      const start = new Date(bookingData.checkIn);
      const end = new Date(bookingData.checkOut);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      nights = diffDays > 0 ? diffDays : 0;
    }

    const pricePerNight = getRoomPrice(bookingData.roomType, bookingData.checkIn);
    const totalCost = nights * pricePerNight * (bookingData.numberOfRooms || 1);

    return { folio, nights, pricePerNight, totalCost };
  }, [bookingData]);

  const isValid = useMemo(() => {
    return (
      bookingData.firstName.trim().length > 0 &&
      bookingData.lastName.trim().length > 0 &&
      bookingData.checkIn !== "" &&
      bookingData.checkOut !== "" &&
      summary.nights > 0 &&
      (bookingData.numberOfRooms || 0) > 0
    );
  }, [bookingData, summary.nights]);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setTimeout(async () => {
      try {
        await generateConfirmationPDF(bookingData, summary);
      } catch (error) {
        console.error(error);
        alert("Error al generar el PDF");
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  const handleGenerateImage = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Reservacion_${summary.folio}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Image generation failed", error);
      alert("Error al generar la imagen");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="text-gold-600 w-8 h-8" />
            <div>
              <h1 className="text-xl font-serif font-bold text-gray-900 leading-none">
                HOTEL TALAVERA
              </h1>
              <p className="text-xs text-gold-600 tracking-wider">
                SISTEMA DE RESERVACIONES
              </p>
            </div>
          </div>
          <button
            onClick={handleLock}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors px-2"
            title="Bloquear Aplicación"
          >
            <Lock size={20} />
            <span className="hidden sm:inline text-sm font-medium">Bloquear</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Booking Form */}
          <div className="h-full">
            <BookingForm
              data={bookingData}
              onChange={setBookingData}
              onGenerate={handleGeneratePDF}
              onGenerateImage={handleGenerateImage}
              isValid={isValid}
              isGenerating={isGenerating}
            />
          </div>

          {/* Live Preview */}
          <div className="h-full min-h-[500px] lg:min-h-0" ref={previewRef}>
            <LivePreview data={bookingData} summary={summary} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center text-sm text-gray-400">
          <div>&copy; {new Date().getFullYear()} Hotel Talavera. Todos los derechos reservados.</div>
          <div className="text-xs text-gray-300">ASPV ENTERPRISE SECURE SYSTEM</div>
        </div>
      </footer>
    </div>
  );
};

export default App;