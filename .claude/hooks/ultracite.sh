#!/usr/bin/env bash
# PostToolUse hook: format + lint the edited file with Ultracite (oxfmt + oxlint + anti-slop).
# Exit 2 feeds remaining lint errors back to Claude so it fixes them.
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
payload=$(cat)

if [ ! -x node_modules/.bin/ultracite ]; then
  echo "ultracite hook skipped: run 'npm install' to enable it" >&2
  exit 0
fi

if ! output=$(printf '%s' "$payload" | node_modules/.bin/ultracite fix --hook 2>&1); then
  printf 'Ultracite found issues it could not auto-fix. Fix them before continuing:\n%s\n' "$output" >&2
  exit 2
fi
exit 0
