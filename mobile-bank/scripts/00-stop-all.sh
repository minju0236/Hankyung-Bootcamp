#!/usr/bin/env bash
set -e
for PORT in 3000 3001 3002 3003 3004; do
  sudo fuser -k ${PORT}/tcp 2>/dev/null || true
done
pkill -f "next start" || true
pkill -f "mobile-bank-api" || true
pkill -f "backend-spring-api" || true
pkill -f "cloudflared" || true
sudo service nginx stop 2>/dev/null || true
echo "stopped"
