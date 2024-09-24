import { customAlphabet } from "nanoid";

export function formatCityInput(cityName: string) {
  // Remove leading and trailing whitespace
  cityName = cityName.trim();
  
  // Split the city name into words
  let words = cityName.split(' ');
  
  // Capitalize the first letter of each word and lowercase the rest
  words = words.map(word => {
    if (word.length > 0) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return '';
  });
  
  // Join the words back together
  return words.join(' ');
}