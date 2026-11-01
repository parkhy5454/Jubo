
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
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
  async function uploadJubo(){
    if(!juboFile) return
    const v=validateFile(juboFile)
    if(!v.ok){alert(v.reason);return}
    const {data,error}=await supabase.storage.from('church-private').upload(`jubo/${Date.now()}-${sanitize(juboFile.name)}`,juboFile)
    if(error){alert(error.message);return}
    const {error:dbErr}=await supabase.from('jubo_docs').insert({file_path:data.path,church_name:'꿈꾸는교회',date_text:'2025.12.15 - 성탄주일'})
    if(dbErr) alert(dbErr.message); else alert('주보 DB 저장 완료')
  }
  async function saveQt(){
    const {error}=await supabase.from('qt_records').insert({
      today_start:today.startVerse,today_end:today.endVerse,
      prayer:sanitize(qt.prayer),god_is:sanitize(qt.godIs),lesson:sanitize(qt.lesson),decision:sanitize(qt.decision)
    })
    if(error) alert(error.message); else alert('큐티 DB 저장 완료')
  }
  async function issueDonation(){
    const payload=`홍길동|100000|${Date.now()}`
    const hmac=signDonationCert(payload)
    const {error}=await supabase.from('donation_issue_log').insert({donor_name:'홍길동',amount:100000,hmac_signature:hmac})
    if(error) alert(error.message); else alert(`기부금 확인서 발급 DB 저장 HMAC:${hmac.slice(0,12)}`)
  }
  return (
    <div style={{maxWidth:390,margin:'0 auto',background:'#FFFBF0',minHeight:'100vh',overflowX:'hidden',wordBreak:'keep-all',position:'relative'}}>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" async></script>
      <meta name="invite" content="https://church-app.vercel.app?ref=PHONE" />
      {tab==='jubo' && (
        <div style={{display:'flex',gap:12,padding:'12px 16px',alignItems:'center',borderBottom:'1px solid #E8E0D5'}}>
          <div style={{width:48,height:48,borderRadius:'50%',background:'#FF3B30',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700}}>✝</div>
          <div><div style={{fontWeight:700}}>꿈꾸는교회</div><div style={{fontSize:13,color:'#666',display:'flex',alignItems:'center',gap:6}}><span style={{width:8,height:8,background:'#FF3B30',borderRadius:'50%',display:'inline-block'}}></span>2025.12.15 - 성탄주일 주보</div></div>
        </div>
      )}
      <div style={{padding:16,paddingBottom:100}}>
        {tab==='jubo' && <div><h3>주보 (Supabase 실제 저장)</h3><input type="file" onChange={e=>setJuboFile(e.target.files?.[0]||null)} /><button onClick={uploadJubo} style={{marginLeft:8,padding:'8px 12px',background:'#111',color:'#fff',borderRadius:8}}>업로드 & DB 저장</button><p style={{fontSize:12,wordBreak:'break-all',marginTop:8}}>pdf.js https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js 플립북 tel: 주소 카카오/티맵/네이버 지도</p></div>}
        {tab==='bible' && <div><div style={{background:'#1e5eb8',color:'#fff',padding:12,borderRadius:12}}>신명기 31장 ▼ 개역개정 ▼ | 화면설정</div><div style={{color:'#1e5eb8',marginTop:12,fontWeight:700}}>여호수아가 모세의 뒤를 잇다</div><div style={{fontSize:18,lineHeight:1.7,marginTop:8}}><div><b>1</b> 또 모세가 가서 온 이스라엘에게 이 말씀을 전하여</div><div style={{fontSize:12,color:'#666',marginTop:8}}>오늘 {today.startVerse}~{today.endVerse}절 (하루 {VERSES_PER_DAY}절)</div></div></div>}
        {tab==='hymn' && <div><h3>찬송가 370장 스캔본 SATB</h3><p>주 안에 있는 나에게 - 콩나물-가사 완벽 매칭</p></div>}
        {tab==='qt' && <div><h3>큐티 (DB 저장)</h3><div>오늘 {today.startVerse}~{today.endVerse}</div><textarea placeholder="기도" style={{width:'100%',marginTop:8}} value={qt.prayer} onChange={e=>setQt({...qt,prayer:e.target.value})} /><textarea placeholder="하나님은" style={{width:'100%',marginTop:8}} value={qt.godIs} onChange={e=>setQt({...qt,godIs:e.target.value})} /><button onClick={saveQt} style={{marginTop:8,padding:'8px 12px',background:'#111',color:'#fff',borderRadius:8}}>큐티 DB 저장</button></div>}
        {tab==='offering' && <div><h3>헌금 기부금 확인서</h3><button onClick={issueDonation} style={{padding:'8px 12px',background:'#111',color:'#fff',borderRadius:8}}>발급 DB 저장</button><p style={{fontSize:12,wordBreak:'break-all',marginTop:8}}>https://church-app.vercel.app?ref=PHONE</p></div>}
        {tab==='setting' && <div><h3>설정</h3><p style={{fontSize:12,wordBreak:'break-all'}}>부서/재정부/회칙/월례회 X Y Z% 음성녹음 교인 등록 구역 1~10 직분 연중행사 N독 목표 어르신 큰글씨 PWA 푸시 친구 초대 문의함 투표 마스킹 {maskPhone('010-1234-5678')}</p></div>}
      </div>
      <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:390,height:86,background:'rgba(255,251,240,0.9)',backdropFilter:'blur(20px)',borderTop:'1px solid #E8E0D5',display:'flex',justifyContent:'space-around',alignItems:'center',paddingBottom:'env(safe-area-inset-bottom)',zIndex:100}}>
        {[{k:'jubo',l:'주보',i:'📖'},{k:'bible',l:'성경',i:'✝'},{k:'hymn',l:'찬송',i:'🎵'},{k:'qt',l:'큐티',i:'💜'},{k:'offering',l:'헌금',i:'🎁'},{k:'setting',l:'설정',i:'⚙'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k as any)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,background:tab===t.k?'#111':'#E8E0D5',color:tab===t.k?'#fff':'#111',border:'none',borderRadius:20,padding:'8px 12px',fontSize:12}}><span>{t.i}</span><span>{t.l}</span></button>
        ))}
      </div>
    </div>
  )
}
