import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (isoDate: string) => {
  // Extraire la portion horaire
  const time = isoDate.slice(9, 15); // "111700"

  // Formater en heure:minute
  const formattedTime = `${time.slice(0, 2)}:${time.slice(2, 4)}`;

  return formattedTime;
}

// TODO : change 'any' type
export const parseDeparturesRequest = async (apiDepartureResponse: any): Promise<Train[]> => {
  if (!apiDepartureResponse || !apiDepartureResponse.departures) {
    throw new Error("Invalid JSON structure");
  }

  return apiDepartureResponse.departures.map((departure: any, index: number): Train => {
    return {
      id: index + 1,
      destination: departure.display_informations.direction || "Unknown",
      departure: formatTime(departure.stop_date_time.base_departure_date_time) || "Unknown",
      platform: departure.stop_point?.physical_modes[0].name || "Unknown",
      status: (departure.stop_date_time.data_freshness == "base_schedule") ? "À l'heure" : "En retard",
      disruption: {
        cause: departure.stop_date_time.cause || "Unknown",
        new_departure: formatTime(departure.stop_date_time.departure_date_time) || "Unknown",
      },
    };
  });
}

// TODO : change 'any' type
export const parseArrivalsRequest = async (apiArrivalResponse: any): Promise<Train[]> => {
  if (!apiArrivalResponse || !apiArrivalResponse.arrivals) {
    throw new Error("Invalid JSON structure");
  }

  return apiArrivalResponse.arrivals.map((arrival: any, index: number): Train => {
    return {
      id: index + 1,
      destination: arrival.display_informations.direction || "Unknown",
      departure: formatTime(arrival.stop_date_time.base_departure_date_time) || "Unknown",
      platform: arrival.stop_point?.physical_modes[0].name || "Unknown",
      status: (arrival.stop_date_time.data_freshness == "base_schedule") ? "À l'heure" : "En retard",
      disruption: {
        cause: arrival.stop_date_time.cause || "Unknown",
        new_departure: formatTime(arrival.stop_date_time.departure_date_time) || "Unknown",
      },
    };
  });
}