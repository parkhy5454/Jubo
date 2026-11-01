import { neon } from '@neondatabase/serverless'
export function getNeonClient(){
  const url = process.env.DATABASE_URL!
  if(!url) throw new Error('Missing DATABASE_URL - Neon connection string')
  return neon(url)
}
