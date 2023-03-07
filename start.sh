#!/usr/bin/env bash
docker-compose down -v
git pull origin main
docker-compose up --force-recreate --build -d


