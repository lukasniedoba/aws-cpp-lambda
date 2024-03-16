#!/usr/bin/env bash
cd deploy
npx cdk bootstrap
npx cdk deploy --context prefix=beta --require-approval never --outputs-file stack_outputs.json