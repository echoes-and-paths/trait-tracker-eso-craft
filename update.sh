#!/usr/bin/env bash
set -e

echo "[1/5] Pull latest git commits..."
git pull --ff-only

echo "[2/5] Building fresh image (pulling base updates if any)..."
docker compose build --pull --build-arg GIT_COMMIT=$(git rev-parse --short HEAD) trait-tracker

echo "[3/5] Restarting container..."
docker compose up -d trait-tracker

echo "[4/5] Pruning dangling images..."
docker image prune -f >/dev/null || true

echo "[5/5] Done. Current image:"
docker images | grep trait-tracker | head -n 1
