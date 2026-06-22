#!/usr/bin/env bash
set -e
for APP in frontend-admin frontend-mobile-view frontend-mobile-action; do
  echo "install/build $APP"
  cd "$APP"
  npm install
  npm run build
  cd ..
done
