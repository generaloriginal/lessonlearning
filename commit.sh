#!/bin/bash

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

COMMIT_MSG="${1:-Update Lesson Learning public site}"

echo "Staging public site changes..."
git add -A -- ':!*.DS_Store' 2>/dev/null || true

if git diff --staged --quiet; then
  echo "No changes to commit. Everything is up to date."
  exit 0
fi

echo ""
echo "Files to be committed:"
git --no-pager diff --staged --name-status

echo ""
echo "Committing with message: '$COMMIT_MSG'"
git commit -m "$COMMIT_MSG"

if git remote | grep -q "origin"; then
  echo ""
  echo "Pushing public site to GitHub..."
  git push origin main
fi

echo ""
echo "Repository status:"
git --no-pager status --short
