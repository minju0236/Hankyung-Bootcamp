# mobile-bank 검증 기준

- 빌드 도구는 Gradle만 사용한다.
- Maven 파일 사용 금지: pom.xml, mvnw, .mvn 없음.
- Spring Boot API: 3004
- Next Admin: 3001
- Next Mobile View: 3002
- Next Mobile Action: 3003
- Nginx: 3000
- MariaDB: chungjeong_db / testuser / 1234
- Redis: 6379

## 반영 수정

- JwtAuthenticationFilter는 기존 프로젝트의 JwtService / AppPrincipal 이름을 사용한다.
- /api/health, /api/auth/register, /api/auth/login은 JWT 필터를 우회한다.
- scripts/10-test-api-flow.sh는 HTTP 상태와 응답 본문을 먼저 출력하고 JSON 파싱한다.
- scripts/02-setup-mariadb.sh는 실습 검증을 위해 chungjeong_db를 새로 생성한다.
