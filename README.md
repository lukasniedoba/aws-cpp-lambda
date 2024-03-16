# AWS C++ lambda

Sample project to create a C++ AWS Lambda function and deploy using AWS CDK.

## Tech stack

- C++ 17
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [aws-lambda-runtime](https://github.com/awslabs/aws-lambda-cpp)
- Amazon Linux 2023
- Docker + Devcontainer
- GitHub Workflows
- AWS CDK + TypeScript
- nlohmann/json
- CMake
- AWS cli

## Usage

- Prepare your AWS credentials

```shell
cp .devcontainer/credentials.TEMPLATE .devcontainer/credentials
# fill your credentials into .devcontainer/credentials
```

- Build devcontainer
- Open the project in devcontainer
- Open shell in devcontainer
- Initialize the project

```shell
bin/init.sh
```

- Build the project

```shell
bin/build.sh
```

- Deploy the project

```shell
bin/deploy.sh
```

- Check `deploy/stack-output.json` for the deployed lambda function name
- Test the project

```shell
bin/invoke.sh <lambda-function-name>
```
