# This part describes the deployment of the XML Security app

- It is described using `AWS CDK` and `TypeScript` language.
- If you do not know `AWS CDK` try to google it then you are probably interested in following files:
    - `lib/aws-cpp-lambda-stack.ts` - the stack description
    - `config/config.ts` - configuration

## Requirements

- `node:20` - I suggest to use `nvm` - node version manager

## How to deploy

If you are deploying to blank AWS account where no CDK app has been deployed, you need to run `npx cdk bootstrap` first. And
only once. More about bootstrapping [here](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html)

```bash
# build the cpp app first including the zip package target
npm install
npx cdk bootstrap
npx cdk deploy
```

Or use `bin/deploy.sh` in devcontainer where everything is already prepared and installed.
