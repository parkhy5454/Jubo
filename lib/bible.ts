export const TOTAL_VERSES = 31102
export const VERSES_PER_DAY = 85 // 31102 / 365
export function getTodayPassage(dayOfYear: number){
  const start = (dayOfYear - 1) * VERSES_PER_DAY + 1
  return { startVerse: start, endVerse: start + VERSES_PER_DAY - 1 }
}
