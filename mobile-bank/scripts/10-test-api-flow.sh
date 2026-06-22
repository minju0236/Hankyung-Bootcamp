#!/usr/bin/env bash
set -e

BASE=${BASE:-http://localhost:3000}
USER_NAME=${USER_NAME:-user$(date +%s)}
PASSWORD=${PASSWORD:-1234}

TMP_BODY=/tmp/mobile-bank-api-body.json
TMP_HEADERS=/tmp/mobile-bank-api-headers.txt

request_json() {
  local method="$1"
  local url="$2"
  local body="${3:-}"
  local auth="${4:-}"

  if [ -n "$auth" ]; then
    STATUS=$(curl -s -o "$TMP_BODY" -D "$TMP_HEADERS" -w "%{http_code}" \
      -X "$method" "$url" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $auth" \
      ${body:+-d "$body"})
  else
    STATUS=$(curl -s -o "$TMP_BODY" -D "$TMP_HEADERS" -w "%{http_code}" \
      -X "$method" "$url" \
      -H "Content-Type: application/json" \
      ${body:+-d "$body"})
  fi

  echo "HTTP_STATUS=$STATUS"
  cat "$TMP_BODY"
  echo

  if [ "$STATUS" -lt 200 ] || [ "$STATUS" -ge 300 ]; then
    echo "요청 실패: $method $url"
    echo "응답 헤더:"
    cat "$TMP_HEADERS"
    echo "응답 본문:"
    cat "$TMP_BODY"
    echo
    exit 1
  fi
}

extract_token() {
  python3 - <<'PY'
import json, sys
path = "/tmp/mobile-bank-api-body.json"
raw = open(path, encoding="utf-8").read().strip()
if not raw:
    print("")
    sys.exit(0)
data = json.loads(raw)
print(data.get("token", ""))
PY
}

echo "BASE=$BASE USER=$USER_NAME"

echo "1. API health"
curl -i "$BASE/api/health"
echo

echo "2. 회원가입"
request_json POST "$BASE/api/auth/register" "{\"username\":\"$USER_NAME\",\"password\":\"$PASSWORD\",\"name\":\"테스트사용자\"}"
TOKEN=$(extract_token)

if [ -z "$TOKEN" ]; then
  echo "회원가입 응답에 token이 없습니다. 로그인으로 전환합니다."
  request_json POST "$BASE/api/auth/login" "{\"username\":\"$USER_NAME\",\"password\":\"$PASSWORD\"}"
  TOKEN=$(extract_token)
fi

if [ -z "$TOKEN" ]; then
  echo "TOKEN 추출 실패"
  cat "$TMP_BODY"
  exit 1
fi

echo "TOKEN=${TOKEN:0:40}..."

echo "3. 계좌 조회"
request_json GET "$BASE/api/bank/account" "" "$TOKEN" | python3 -m json.tool || true

echo "4. 입금"
request_json POST "$BASE/api/bank/deposit" '{"amount":10000,"memo":"테스트 입금"}' "$TOKEN"

echo "5. 출금"
request_json POST "$BASE/api/bank/withdraw" '{"amount":5000,"memo":"테스트 출금"}' "$TOKEN"

echo "6. 단일 송금"
request_json POST "$BASE/api/bank/transfer" '{"toAccountNumber":"110-100-000002","amount":3000,"memo":"테스트 송금"}' "$TOKEN"

echo "7. 다중 송금"
request_json POST "$BASE/api/bank/multi-transfer" '{"memo":"다중송금","targets":[{"toAccountNumber":"110-100-000002","amount":1000},{"toAccountNumber":"110-100-000003","amount":1000}]}' "$TOKEN"

echo "8. 거래내역"
request_json GET "$BASE/api/bank/transactions" "" "$TOKEN"

echo "9. Redis 확인"
redis-cli keys 'auth:*'
redis-cli keys 'cache:*'
redis-cli keys 'recent:*'
redis-cli llen audit:logs

echo "테스트 완료"
