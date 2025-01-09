import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(isoDate: string) {
  // Extraire la portion horaire
  const time = isoDate.slice(9, 15); // "111700"

  // Formater en heure:minute
  const formattedTime = `${time.slice(0, 2)}:${time.slice(2, 4)}`;

  return formattedTime;
}