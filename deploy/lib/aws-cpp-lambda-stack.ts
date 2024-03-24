import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as logs from 'aws-cdk-lib/aws-logs';
import {Construct} from 'constructs';
import {BaseStack} from "./base-stack";
import {getErrorEmails} from "../config/config";
import {
    Alarm,
    ComparisonOperator,
    Dashboard,
    GraphWidget,
    LogQueryVisualizationType,
    LogQueryWidget,
    Metric
} from "aws-cdk-lib/aws-cloudwatch";
import {Duration} from "aws-cdk-lib";
import {SnsAction} from "aws-cdk-lib/aws-cloudwatch-actions";

export class AwsCppLambdaStack extends BaseStack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const cppLambda = new lambda.Function(this, 'cpp-lambda', {
            runtime: lambda.Runtime.PROVIDED_AL2023,
            code: lambda.Code.fromAsset('../build/aws-cpp-lambda.zip'),
            handler: 'aws-cpp-lambda',
            timeout: cdk.Duration.seconds(15),
            memorySize: 128,
        });

        const lambdaUrl = cppLambda.addFunctionUrl({
            authType: lambda.FunctionUrlAuthType.NONE,
        });

        new logs.LogGroup(this, 'cpp-lambda-log-group', {
            logGroupName: `/aws/lambda/${cppLambda.functionName}`,
            retention: logs.RetentionDays.SIX_MONTHS,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        const errorChannel = new sns.Topic(this, 'error-channel', {
            topicName: 'errorChannel-cpp-lambda-' + this.getAppStage(),
        });
        getErrorEmails(this.getAppStage()).forEach((email) => {
            errorChannel.addSubscription(new subscriptions.EmailSubscription(email));
        });

        const errorMetric = new Metric({
            namespace: 'AWS/Lambda',
            metricName: 'Errors',
            dimensionsMap: {
                FunctionName: cppLambda.functionName,
            },
            statistic: 'sum',
            label: cppLambda.functionName,
            period: Duration.minutes(5),
        });

        const errorAlarm = new Alarm(this, 'error-alarm', {
            metric: errorMetric,
            evaluationPeriods: 1,
            threshold: 1,
            comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
            alarmDescription: `Error in function ${cppLambda.functionName}`,
        });
        errorAlarm.addAlarmAction(new SnsAction(errorChannel));

        const dashboard = new Dashboard(this, 'dashboard', {
            dashboardName: 'CppLambda-' + this.getAppStage(),
        });
        dashboard.addWidgets(
            new GraphWidget({
                title: 'Function Errors',
                width: 24,
                height: 8,
                left: [errorMetric],
            }),
            new GraphWidget({
                title: 'Function Invocations',
                width: 12,
                height: 8,
                left: [
                    new Metric({
                        namespace: 'AWS/Lambda',
                        metricName: 'Invocations',
                        dimensionsMap: {
                            FunctionName: cppLambda.functionName,
                        },
                        statistic: 'sum',
                        label: cppLambda.functionName,
                        period: Duration.minutes(5),
                    }),
                ],
            }),
            new GraphWidget({
                title: 'Function durations',
                width: 12,
                height: 8,
                left: [
                    new Metric({
                        namespace: 'AWS/Lambda',
                        metricName: 'Duration',
                        dimensionsMap: {
                            FunctionName: cppLambda.functionName,
                        },
                        statistic: 'avg',
                        label: cppLambda.functionName,
                        period: Duration.seconds(60),
                    }),
                    new Metric({
                        namespace: 'AWS/Lambda',
                        metricName: 'Duration',
                        dimensionsMap: {
                            FunctionName: cppLambda.functionName,
                        },
                        statistic: 'max',
                        label: `Max ${cppLambda.functionName}`,
                        period: Duration.seconds(60),
                    }),
                ],
            }),
            new LogQueryWidget({
                title: 'Errors from logs',
                view: LogQueryVisualizationType.TABLE,
                width: 24,
                height: 12,
                logGroupNames: [cppLambda.logGroup.logGroupName],
                queryLines: ['fields @message', 'filter @message like /(?i)error/'],
            })
        );

        new cdk.CfnOutput(this, 'FunctionArn', {
            value: cppLambda.functionArn,
        });
        new cdk.CfnOutput(this, 'FunctionName', {
            value: cppLambda.functionName,
        });
        new cdk.CfnOutput(this, 'FunctionUrl', {
            value: lambdaUrl.url,
        });
    }
}
