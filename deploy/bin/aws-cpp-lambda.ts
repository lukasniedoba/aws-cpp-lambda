#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {AwsCppLambdaStack} from '../lib/aws-cpp-lambda-stack';

const app = new cdk.App();
const prefix = app.node.tryGetContext('prefix');
const stackName = (prefix ? prefix : '') + 'AwsCppLambda';
new AwsCppLambdaStack(app, stackName, {
    env: {
        region: 'eu-central-1',
    }
});