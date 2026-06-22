#!/usr/bin/env bash
set -e
export PATH=/opt/gradle/bin:$PATH
cd backend-spring-api
gradle clean bootJar --no-daemon
cd ..
ls -al backend-spring-api/build/libs
