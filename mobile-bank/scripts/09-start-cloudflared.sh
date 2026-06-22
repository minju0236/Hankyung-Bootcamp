#!/usr/bin/env bash
set -e

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_FILE="$BASE_DIR/tunnel.log"

if ! command -v cloudflared >/dev/null 2>&1; then
  cd /tmp
  wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -O cloudflared.deb
  sudo dpkg -i cloudflared.deb || sudo apt -f install -y
fi

cd "$BASE_DIR"

pkill -f "cloudflared tunnel --url http://localhost:3000" 2>/dev/null || true
sleep 2

curl -I http://localhost:3000 >/dev/null

rm -f "$LOG_FILE"
touch "$LOG_FILE"

nohup cloudflared tunnel --url http://localhost:3000 > "$LOG_FILE" 2>&1 &
TUNNEL_PID=$!

sleep 8

if ! ps -p "$TUNNEL_PID" >/dev/null 2>&1; then
  echo "cloudflared 실행 실패"
  tail -n 30 "$LOG_FILE" || true
  exit 1
fi

echo "cloudflared 실행 중"
echo "PID: $TUNNEL_PID"
echo "로그 파일: $LOG_FILE"
tail -n 30 "$LOG_FILE"