import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDay(): number {
  const date = new Date()
  const estOffset = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
  const estDate = new Date(date.getTime() - estOffset);
  const digit = estDate.getDay(); // Use UTC day to simulate EST time zone
  console.log("est date: ", estDate)
  if (digit == 0) {
    return 6
  } else {
    const day = digit - 1;
    return day
  }
}
