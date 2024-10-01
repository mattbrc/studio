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

export function calculateMacros(tdee: number, weight: number, goal: 'Maintenance' | 'Cutting' | 'Bulking') {
  const fatPercent = 0.32;
  const proteinGrams = weight * 1.1;
  const proteinCals = proteinGrams * 4;

  let adjustedTDEE = tdee;
  if (goal === 'Cutting') adjustedTDEE -= 500;
  if (goal === 'Bulking') adjustedTDEE += 500;

  const fatGrams = (fatPercent * adjustedTDEE) / 9;
  const proteinPercent = proteinCals / adjustedTDEE;
  const carbsGrams = ((1 - (proteinPercent + fatPercent)) * adjustedTDEE) / 4;

  console.log("--------------------------------------")
  console.log("Calculated macros:", {
    calories: Math.round(adjustedTDEE),
    protein: Math.round(proteinGrams),
    carbs: Math.round(carbsGrams),
    fat: Math.round(fatGrams),
  });

  return {
    calories: Math.round(adjustedTDEE),
    protein: Math.round(proteinGrams),
    carbs: Math.round(carbsGrams),
    fat: Math.round(fatGrams),
  };
}