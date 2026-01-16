#!/usr/bin/env bash

set -euo pipefail

WORKOS_API_KEY="${WORKOS_API_KEY}"
BASE_URL="https://api.workos.com/user_management"

USERS=(
  "$ADMIN_USER_EMAIL"
  "$COACH_USER_EMAIL"
  "$MEMBER_USER_EMAIL"
  "$USER_EMAIL"
)

for EMAIL in "${USERS[@]}"; do
  echo "Processing $EMAIL"

  USER_ID=$(curl -s \
    --get "$BASE_URL/users" \
    --header "Authorization: Bearer $WORKOS_API_KEY" \
    --data-urlencode "email=$EMAIL" |
    jq -r '.data[0].id')

  if [[ "$USER_ID" == "null" || -z "$USER_ID" ]]; then
    echo "❌ User not found: $EMAIL"
    continue
  fi

  curl -s \
    --request PUT "$BASE_URL/users/$USER_ID" \
    --header "Authorization: Bearer $WORKOS_API_KEY" \
    --header "Content-Type: application/json" \
    --data '{
      "email_verified": true
    }'

  echo "✅ Verified $EMAIL"
done
