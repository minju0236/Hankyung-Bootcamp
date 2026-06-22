# mobile-bank

GCP VM 단일 서버에서 실행하는 충정은행 분산 프론트/백엔드 실습 프로젝트입니다.

- Nginx 3000: PC/모바일/거래화면/API 라우팅
- Next Admin 3001: PC 관리자 화면
- Next Mobile View 3002: 모바일 조회 화면
- Next Mobile Action 3003: 모바일 거래 화면
- Spring Boot API 3004: 인증/계좌/거래/관리자 API
- MariaDB 3306: 영속 데이터
- Redis 6379: 세션/캐시/감사 로그/최근 송금 대상
- Cloudflared: `localhost:3000`만 외부 공개

Maven은 사용하지 않습니다. Gradle만 사용합니다.
