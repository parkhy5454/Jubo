
import { neon } from '@neondatabase/serverless'
export default async function handler(req:any, res:any){
  if(req.method!=='POST') return res.status(405).end()
  try {
    const { sql, params } = req.body
    const client = neon(process.env.DATABASE_URL!)
    const result = await client(sql, params)
    res.json({ data: result })
  } catch(e:any){
    res.status(500).json({error:e.message})
  }
}
