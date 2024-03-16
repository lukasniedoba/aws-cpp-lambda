#!/usr/bin/env bash
# Check if a function name has been provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <function-name>"
  exit 1
fi

FUNCTION_NAME=$1

# Create a temporary file
TEMP_FILE=$(mktemp)

# Ensure the temporary file is deleted on exit
trap "rm -f $TEMP_FILE" EXIT

# Invoke my lambda
aws lambda invoke \
    --function-name $FUNCTION_NAME \
    --cli-binary-format raw-in-base64-out \
    --payload '{ "some": "Payload" }' \
    --no-cli-pager \
    $TEMP_FILE

# Display the response
echo "Response:"
cat $TEMP_FILE
echo ""