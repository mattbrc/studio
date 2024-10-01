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

  return {
    calories: Math.round(adjustedTDEE),
    protein: Math.round(proteinGrams),
    carbs: Math.round(carbsGrams),
    fat: Math.round(fatGrams),
  };
}