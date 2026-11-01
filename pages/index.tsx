import { useEffect, useState } from 'react'
import { sanitize, maskPhone, signDonationCert, validateFile } from '../lib/security'
import { getTodayPassage, VERSES_PER_DAY } from '../lib/bible'

export default function ChurchApp(){
  const [tab,setTab]=useState<'jubo'|'bible'|'hymn'|'qt'|'offering'|'setting'>('jubo')
  const [juboFile,setJuboFile]=useState<File|null>(null)
  const [qt,setQt]=useState({prayer:'',godIs:'',lesson:'',decision:''})
  const [today,setToday]=useState({startVerse:1,endVerse:85})

  useEffect(()=>{
    const day=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0).getTime())/86400000)
    setToday(getTodayPassage(day))
  },[])

  async function callNeon(sql:string, params:any[]=[]){
    const res = await fetch('/api/neon-query',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sql,params})})
    return res.json()
  }

  async function uploadJubo(){
    if(!juboFile) return alert('파일을 선택하세요')
    const v=validateFile(juboFile)
    if(!v.ok) return alert(v.reason)
    const filePath=`jubo/${Date.now()}-${sanitize(juboFile.name)}`
    const r=await callNeon('INSERT INTO jubo_docs (file_path, church_name, date_text) VALUES ($1,$2,$3)',[filePath,'꿈꾸는교회','2025.12.15 - 성탄주일'])
    if(r.error) alert(r.error); else alert('✅ 주보 Neon DB 저장 완료!')
  }

  async function saveQt(){
    const r=await callNeon('INSERT INTO qt_records (today_start,today_end,prayer,god_is,lesson,decision) VALUES ($1,$2,$3,$4,$5,$6)',[today.startVerse,today.endVerse,sanitize(qt.prayer),sanitize(qt.godIs),sanitize(qt.lesson),sanitize(qt.decision)])
    if(r.error) alert(r.error); else alert('✅ 큐티 Neon DB 저장 완료!')
  }

  async function issueDonation(){
    const payload=`홍길동|100000|${Date.now()}`
    const hmac=signDonationCert(payload)
    const r=await callNeon('INSERT INTO donation_issue_log (donor_name,amount,hmac_signature) VALUES ($1,$2,$3)',['홍길동',100000,hmac])
    if(r.error) alert(r.error); else alert(`✅ 기부금 확인서 저장 HMAC:${hmac.slice(0,12)}`)
  }

  return (
    <div style={{maxWidth:390,margin:'0 auto',background:'#FFFBF0',minHeight:'100vh',overflowX:'hidden',wordBreak:'keep-all',position:'relative',fontFamily:'-apple-system,BlinkMacSystemFont,system-ui'}}>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" async></script>
      {tab==='jubo' && (
        <div style={{display:'flex',gap:12,padding:'12px 16px',alignItems:'center',borderBottom:'1px solid #E8E0D5',background:'#FFFBF0'}}>
          <div style={{width:48,height:48,borderRadius:'50%',background:'#FF3B30',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:20}}>✝</div>
          <div>
            <div style={{fontWeight:700,fontSize:16}}>꿈꾸는교회</div>
            <div style={{fontSize:13,color:'#666',display:'flex',alignItems:'center',gap:6}}><span style={{width:8,height:8,background:'#FF3B30',borderRadius:'50%',display:'inline-block'}}></span>2025.12.15 - 성탄주일 주보</div>
          </div>
        </div>
      )}
      <div style={{padding:16,paddingBottom:110}}>
        {tab==='jubo' && <div><h3>주보 (Neon DB 실제 저장)</h3><input type="file" accept=".pdf,.jpg,.png" onChange={e=>setJuboFile(e.target.files?.[0]||null)} /><button onClick={uploadJubo} style={{marginLeft:8,padding:'10px 14px',background:'#111',color:'#fff',borderRadius:10,border:'none'}}>업로드 & 저장</button><p style={{fontSize:11,color:'#888',marginTop:12,wordBreak:'break-all'}}>pdf.js https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js<br/>Invite: https://church-app.vercel.app?ref=PHONE</p></div>}
        {tab==='bible' && <div><div style={{background:'#1e5eb8',color:'#fff',padding:12,borderRadius:12,fontWeight:700}}>신명기 31장 - 오늘 {today.startVerse}~{today.endVerse}절</div><div style={{color:'#1e5eb8',marginTop:12,fontWeight:700}}>여호수아가 모세의 뒤를 잇다</div><div style={{fontSize:18,lineHeight:1.8,marginTop:8}}><b>1</b> 또 모세가 가서 온 이스라엘에게 이 말씀을 전하여</div><div style={{fontSize:12,color:'#666',marginTop:8}}>하루 {VERSES_PER_DAY}절 / 전체 31,102절</div></div>}
        {tab==='hymn' && <div><h3>찬송가 370장 스캔본</h3><p style={{fontSize:14,lineHeight:1.6}}>주 안에 있는 나에게 - SATB 4부 콩나물-가사 1:1 매칭<br/>305장 나 같은 죄인 검색 → 305장 자동 이동</p></div>}
        {tab==='qt' && <div><h3>큐티 (Neon DB 저장)</h3><div style={{fontSize:13,color:'#666'}}>오늘 본문 {today.startVerse}~{today.endVerse}</div><textarea placeholder="기도" style={{width:'100%',marginTop:8,padding:8,borderRadius:8,border:'1px solid #E8E0D5'}} value={qt.prayer} onChange={e=>setQt({...qt,prayer:e.target.value})} /><textarea placeholder="하나님은 어떤 분" style={{width:'100%',marginTop:8,padding:8,borderRadius:8,border:'1px solid #E8E0D5'}} value={qt.godIs} onChange={e=>setQt({...qt,godIs:e.target.value})} /><button onClick={saveQt} style={{marginTop:10,padding:'10px 14px',background:'#111',color:'#fff',borderRadius:10,border:'none',width:'100%'}}>큐티 Neon DB 저장</button></div>}
        {tab==='offering' && <div><h3>헌금 / 기부금 확인서</h3><button onClick={issueDonation} style={{padding:'10px 14px',background:'#111',color:'#fff',borderRadius:10,border:'none'}}>기부금 확인서 발급 & Neon 저장</button><p style={{fontSize:11,color:'#888',marginTop:12,wordBreak:'break-all'}}>https://church-app.vercel.app?ref=PHONE - 카톡 전송 + QR HMAC 검증</p></div>}
        {tab==='setting' && <div><h3>설정</h3><p style={{fontSize:12,lineHeight:1.7,wordBreak:'break-all'}}>부서/재정부/회칙/월례회 정원 X중 Y Z%<br/>교인 등록 구역 1~10 직분<br/>마스킹 예시 {maskPhone('010-1234-5678')}<br/>Neon DB 무료 Postgres - 완전 무료<br/>PWA 오프라인 / 푸시 / 친구 초대</p></div>}
      </div>
      <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:390,height:86,background:'rgba(255,251,240,0.92)',backdropFilter:'blur(20px)',borderTop:'1px solid #E8E0D5',display:'flex',justifyContent:'space-around',alignItems:'center',zIndex:100,paddingBottom:'env(safe-area-inset-bottom)'}}>
        {[{k:'jubo',l:'주보',i:'📖'},{k:'bible',l:'성경',i:'✝'},{k:'hymn',l:'찬송',i:'🎵'},{k:'qt',l:'큐티',i:'💜'},{k:'offering',l:'헌금',i:'🎁'},{k:'setting',l:'설정',i:'⚙'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k as any)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,background:tab===t.k?'#111':'#E8E0D5',color:tab===t.k?'#fff':'#111',border:'none',borderRadius:20,padding:'8px 12px',fontSize:11,fontWeight:tab===t.k?700:400}}><span style={{fontSize:14}}>{t.i}</span><span>{t.l}</span></button>
        ))}
      </div>
    </div>
  )
}
