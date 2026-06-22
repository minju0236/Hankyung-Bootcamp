#!/usr/bin/env bash
set -e
sudo apt update -y
sudo apt install -y openjdk-21-jdk mariadb-server redis-server nginx curl unzip wget ca-certificates gnupg lsof
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt install -y nodejs
fi
if ! command -v gradle >/dev/null 2>&1 || ! gradle -v | grep -q "Gradle 8"; then
  cd /tmp
  wget -q https://services.gradle.org/distributions/gradle-8.10.2-bin.zip -O gradle.zip
  sudo rm -rf /opt/gradle-8.10.2 /opt/gradle
  sudo unzip -q gradle.zip -d /opt
  sudo ln -s /opt/gradle-8.10.2 /opt/gradle
  echo 'export PATH=/opt/gradle/bin:$PATH' | sudo tee /etc/profile.d/gradle.sh >/dev/null
  export PATH=/opt/gradle/bin:$PATH
fi
java -version
node -v
npm -v
gradle -v | head -5
