#!/usr/bin/env bash
set -e
sudo fuser -k 3004/tcp 2>/dev/null || true
pkill -f "mobile-bank-api" || true
sleep 2
JAR_FILE=$(ls backend-spring-api/build/libs/*.jar 2>/dev/null | grep -v plain | head -n 1 || true)
if [ -z "$JAR_FILE" ]; then
  echo "JAR 파일이 없습니다. 먼저 bash scripts/04-build-backend.sh 실행"
  exit 1
fi
nohup java -jar "$JAR_FILE" > backend.log 2>&1 &
for i in {1..30}; do
  if curl -s http://localhost:3004/api/health >/tmp/mobile-bank-health.json 2>/dev/null; then
    cat /tmp/mobile-bank-health.json
    echo
    exit 0
  fi
  sleep 1
done
echo "백엔드 실행 실패"
tail -n 120 backend.log
exit 1
