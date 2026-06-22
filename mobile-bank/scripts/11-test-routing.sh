#!/usr/bin/env bash
set -e
curl -s -A "Mozilla/5.0 Windows" http://localhost:3000 | grep -o "충정은행 관리자" || true
curl -s -A "Mozilla/5.0 iPhone Mobile" http://localhost:3000 | grep -o "충정은행" || true
curl -s -A "Mozilla/5.0 iPhone Mobile" http://localhost:3000/action | grep -o "거래하기" || true
curl -s http://localhost:3000/api/health
