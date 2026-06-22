#!/usr/bin/env bash
set -e
for PORT in 3001 3002 3003; do
  sudo fuser -k ${PORT}/tcp 2>/dev/null || true
done
pkill -f "next start" || true
sleep 2
cd frontend-admin
nohup npx next start -H 0.0.0.0 -p 3001 > ../next-admin.log 2>&1 &
cd ../frontend-mobile-view
nohup npx next start -H 0.0.0.0 -p 3002 > ../next-mobile-view.log 2>&1 &
cd ../frontend-mobile-action
nohup npx next start -H 0.0.0.0 -p 3003 > ../next-mobile-action.log 2>&1 &
cd ..
for PORT in 3001 3002 3003; do
  echo "check $PORT"
  for i in {1..20}; do
    if curl -s -I http://localhost:${PORT} | head -n 1 | grep -q "200"; then
      curl -s -I http://localhost:${PORT} | head -n 1
      break
    fi
    sleep 1
  done
done
