import { neon } from '@neondatabase/serverless'
export default async function handler(req: any, res: any){
  if(req.method !== 'POST') return res.status(405).end()
  try{
    const { sql, params } = req.body
    if(!process.env.DATABASE_URL) return res.status(500).json({error:'Missing DATABASE_URL'})
    const client = neon(process.env.DATABASE_URL)
    const data = await client(sql, params)
    res.json({ data })
  }catch(e:any){
    res.status(500).json({error: e.message})
  }
}
