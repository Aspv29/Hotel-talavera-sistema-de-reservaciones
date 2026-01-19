export enum RoomType {
  STANDARD = "ESTANDAR KING SIZE",
  DOUBLE = "DOBLE QUEEN SIZE",
  SUITE = "SUITE DE LUJO"
}

export interface BookingData {
  firstName: string;
  lastName: string;
  checkIn: string;
  checkOut: string;
  roomType: RoomType;
  numberOfRooms: number;
}

export interface BookingSummary {
  folio: string;
  nights: number;
  pricePerNight: number;
  totalCost: number;
}

export const getRoomPrice = (type: RoomType, dateStr?: string): number => {
  let isFebruary = false;
  if (dateStr) {
    const parts = dateStr.split('-');
    if (parts.length >= 2) {
      if (parts[1] === '02') {
        isFebruary = true;
      }
    }
  }
  if (isFebruary) {
    switch (type) {
      case RoomType.STANDARD: return 1136.00;
      case RoomType.DOUBLE: return 1318.00;
      case RoomType.SUITE: return 1497.00;
      default: return 0;
    }
  }
  switch (type) {
    case RoomType.STANDARD: return 1250.00;
    case RoomType.DOUBLE: return 1450.00;
    case RoomType.SUITE: return 1650.00;
    default: return 0;
  }
};

export const getMaxRooms = (type: RoomType): number => {
  switch (type) {
    case RoomType.STANDARD: return 4;
    case RoomType.SUITE: return 4;
    case RoomType.DOUBLE: return 6;
    default: return 14;
  }
};

// Logo original inicial en base64, tal como me lo proporcionaste en un principio
export const LOCK_SCREEN_LOGO =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";