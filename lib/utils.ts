import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cutString(str: string, limit: number) {
  if (limit < 1) return str;
  return str.length > limit ? str.substring(0, limit) + "..." : str;
}

export function convertToAscii(inputString: string) {
  const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
  return asciiString;
}
