#!/usr/bin/env bash
# Check if a function name has been provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <function-url>"
  exit 1
fi

FUNCTION_URL=$1

curl -X POST $FUNCTION_URL \
     -H 'Content-Type: application/json' \
     -d '{"key": "value"}'
echo ""