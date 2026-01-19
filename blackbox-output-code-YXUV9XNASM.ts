import React from "react";
import { BookingData, RoomType, getMaxRooms } from "../types";

interface BookingFormProps {
  data: BookingData;
  onChange: (data: BookingData) => void;
  onGenerate: () => void;
  onGenerateImage: () => void;
  isValid: boolean;
  isGenerating: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  data,
  onChange,
  onGenerate,
  onGenerateImage,
  isValid,
  isGenerating,
}) => {
  const maxRooms = getMaxRooms(data.roomType);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]:
        name === "numberOfRooms"
          ? Math.min(Math.max(parseInt(value) || 1, 1), maxRooms)
          : value,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid && !isGenerating) onGenerate();
      }}
      className="card flex flex-col gap-5"
      aria-label="Formulario para realizar reserva"
    >
      <h2 className="text-2xl font-serif font-semibold text-gold mb-4">
        Formulario de Reservas
      </h2>

      <label htmlFor="firstName">
        Nombre(s)
        <input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Juan"
          value={data.firstName}
          onChange={handleChange}
          required
          autoComplete="given-name"
          aria-required="true"
        />
      </label>

      <label htmlFor="lastName">
        Apellido(s)
        <input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Pérez"
          value={data.lastName}
          onChange={handleChange}
          required
          autoComplete="family-name"
          aria-required="true"
        />
      </label>

      <label htmlFor="checkIn">
        Fecha de entrada
        <input
          id="checkIn"
          name="checkIn"
          type="date"
          value={data.checkIn}
          onChange={handleChange}
          required
          aria-required="true"
        />
      </label>

      <label htmlFor="checkOut">
        Fecha de salida
        <input
          id="checkOut"
          name="checkOut"
          type="date"
          value={data.checkOut}
          onChange={handleChange}
          required
          aria-required="true"
        />
      </label>

      <label htmlFor="roomType">
        Tipo de habitación
        <select
          id="roomType"
          name="roomType"
          value={data.roomType}
          onChange={handleChange}
          required
          aria-required="true"
        >
          <option value={RoomType.STANDARD}>Estándar King Size</option>
          <option value={RoomType.DOUBLE}>Doble Queen Size</option>
          <option value={RoomType.SUITE}>Suite de lujo</option>
        </select>
      </label>

      <label htmlFor="numberOfRooms">
        Número de habitaciones
        <input
          id="numberOfRooms"
          name="numberOfRooms"
          type="number"
          min={1}
          max={maxRooms}
          value={data.numberOfRooms}
          onChange={handleChange}
          required
          aria-required="true"
        />
        <small className="text-xs text-gray-500">
          Capacidad máxima para esta habitación: {maxRooms}
        </small>
      </label>

      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          disabled={!isValid || isGenerating}
          className="btn btn-primary flex-grow disabled:opacity-50"
          aria-disabled={!isValid || isGenerating}
          aria-label="Generar archivo PDF de la reserva"
        >
          {isGenerating ? "Generando PDF..." : "Generar PDF"}
        </button>

        <button
          type="button"
          disabled={!isValid || isGenerating}
          onClick={onGenerateImage}
          className="btn btn-secondary flex-grow disabled:opacity-50"
          aria-disabled={!isValid || isGenerating}
          aria-label="Generar imagen de la reserva"
        >
          {isGenerating ? "Generando Imagen..." : "Guardar Imagen"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;