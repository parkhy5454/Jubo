# 교회 앱 최종 원본 - 복사본 없음, 중복 0개

## 파일 구조 (10개, 최종 원본)
- package.json - Neon DB 무료 버전
- tsconfig.json
- lib/neonClient.ts - Neon 연결 1개 키
- lib/security.ts - sanitize, maskPhone, HMAC, validateFile
- lib/bible.ts - 31102절, 85절/일
- pages/index.tsx - 하단 6탭 고정 (주보/성경/찬송/큐티/헌금/설정) + 상단 로고 48x48 + 교회 이름/날짜
- pages/api/neon-query.ts - 서버 전용 Neon API
- neon.sql - 4개 테이블 생성 SQL (복사해서 Neon SQL Editor에 붙여넣기)
- .env.example
- vercel.json

## 무료 배포 3분
1. neon.tech > New Project (Singapore) > Connection string 복사 (DATABASE_URL)
2. Neon > SQL Editor > neon.sql 붙여넣기 > Run
3. vercel.com > New Project > parkhy5454/Jubo > Environment Variables:
   DATABASE_URL = postgresql://...
   DONATION_HMAC_SECRET = 랜덤 32자리
4. Deploy > https://jubo-xxx.vercel.app

## 필수 URL (유지)
https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js
https://church-app.vercel.app?ref=PHONE

## 기능 요약
- 주보: PDF 플립북 + pen + 성경/찬송 링크 + tel/kakao/tmap/nmap + Neon 저장
- 성경: 31102절, 365일 85절 자동, 파란 헤더 replica, 형광펜, TTS, 확대
- 찬송: 370장 스캔 SATB 4부 1:1 매칭, 305장 검색
- 큐티: 5단계 + Neon 저장 + 팀 나누기
- 헌금: 기부금 확인서 HMAC QR + 카톡 전송
- 설정: 부서/교인 등록 구역1-10 직분/마스킹/푸시/초대링크
