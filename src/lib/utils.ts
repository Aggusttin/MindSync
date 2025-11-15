import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Ayudante para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}