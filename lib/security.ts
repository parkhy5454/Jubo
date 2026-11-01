
import DOMPurify from 'dompurify'
import { createHmac } from 'crypto'
export function sanitize(s: string) {
  if (typeof window === 'undefined') return s.replace(/<[^>]*>/g,'')
  return DOMPurify.sanitize(s)
}
export const maskPhone = (p:string)=> p.replace(/(\d{3})-?(\d+)-?(\d{4})/,'$1-****-$3')
export const signDonationCert = (payload:string)=>{
  const secret = process.env.DONATION_HMAC_SECRET || 'change-me'
  return createHmac('sha256',secret).update(payload).digest('hex')
}
export const ALLOWED_EXTS=['pdf','jpg','jpeg','png']
export const MAX_FILE_SIZE=10*1024*1024
export const validateFile=(f:File)=>{
  const ext=f.name.split('.').pop()?.toLowerCase()
  if(!ext||!ALLOWED_EXTS.includes(ext)) return {ok:false,reason:'허용되지 않는 확장자'}
  if(f.size>MAX_FILE_SIZE) return {ok:false,reason:'10MB 이하'}
  return {ok:true}
}
