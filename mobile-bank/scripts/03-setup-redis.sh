#!/usr/bin/env bash
set -e
sudo service redis-server start
redis-cli ping
