
export const TOTAL_VERSES=31102
export const VERSES_PER_DAY=85
export function getTodayPassage(day:number){
  const start=(day-1)*VERSES_PER_DAY+1
  return {startVerse:start,endVerse:start+VERSES_PER_DAY-1}
}
