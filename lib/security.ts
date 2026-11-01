import DOMPurify from 'dompurify'
import { createHmac } from 'crypto'
export function sanitize(input: string){
  if(typeof window === 'undefined') return input.replace(/<[^>]*>/g,'')
  return DOMPurify.sanitize(input)
}
export const maskPhone = (p:string)=> p.replace(/(\d{3})-?(\d+)-?(\d{4})/,'$1-****-$3')
export const signDonationCert = (payload:string)=>{
  const secret = process.env.DONATION_HMAC_SECRET || 'change-me-32-char-secret-key!!'
  return createHmac('sha256',secret).update(payload).digest('hex')
}
export const ALLOWED_EXTS=['pdf','jpg','jpeg','png']
export const MAX_FILE_SIZE=10*1024*1024
export function validateFile(f: File){
  const ext = f.name.split('.').pop()?.toLowerCase()
  if(!ext || !ALLOWED_EXTS.includes(ext)) return {ok:false, reason:'허용되지 않는 확장자 (pdf/jpg/png만)'}
  if(f.size > MAX_FILE_SIZE) return {ok:false, reason:'10MB 이하만 가능'}
  return {ok:true}
}
