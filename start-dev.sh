#!/usr/bin/env bash
set -euo pipefail

# Start backend in background
( cd backend && mvn -q spring-boot:run ) &
BACK_PID=$!

# Ensure backend is killed when this script exits
cleanup() {
  echo ""
  echo "Stopping backend (PID $BACK_PID)..."
  kill $BACK_PID >/dev/null 2>&1 || true
  wait $BACK_PID 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Start frontend (foreground)
cd frontend
npm i
npm run dev
