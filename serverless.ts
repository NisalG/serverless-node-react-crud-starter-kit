/**
 * See Serverless.yml Reference:
 * https://www.serverless.com/framework/docs/providers/aws/guide/serverless.yml
 * for all available properties in serverless.yml
 */

import type { AWS } from "@serverless/typescript";

import { safeguards } from './src/aws/resources/safeguards';
import { ProviderIAMRoles } from './src/aws/serverless/ProviderIAMRoles';
import { SQSQueues } from './src/aws/sqs';
import { autoswagger } from './src/types/swagger.config';

// import hello from "@functions/hello";
import { functions } from "./src/functions";

const serverlessConfiguration: AWS = {
  service: "aws-serverless-typescript-crud1",
  frameworkVersion: "3",
  useDotenv: true,
  params: {
    dev: {
      // customDomain: "dev.${aws:region}.api.aws-serverless-typescript-crud1.com",
      // certificate: 'dev.${aws:region}.api.aws-serverless-typescript-crud1.com',
      basePath: "/${sls:stage}",
    },
    prod: {
      // customDomain: "${aws:region}.api.aws-serverless-typescript-crud1.com",
            // certificate: 'dev.${aws:region}.api.aws-serverless-typescript-crud1.com',
      basePath: "",
    },
  },
  plugins: [
    "serverless-auto-swagger",
    "serverless-esbuild",
    "serverless-offline",
    "serverless-plugin-log-retention",
    '@serverless/safeguards-plugin',
    // 'serverless-domain-manager',
    'serverless-prune-plugin',
    'serverless-plugin-warmup',
    'serverless-plugin-split-stacks',
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    stage: "${sls:stage}",
    iamRoleStatements: ProviderIAMRoles,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    logs: {
      restApi: true,
    },
    logRetentionInDays: 30,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",

      MYSQL_HOST: "${ssm:/${sls:stage}/mysql-host}",
      MYSQL_USERNAME: "${ssm:/${sls:stage}/mysql-username}",
      MYSQL_PASSWORD: "${ssm:/${sls:stage}/mysql-password}",
      MYSQL_DBNAME: "${ssm:/${sls:stage}/mysql-dbname}",
      MONGODB_URL: "${ssm:/${sls:stage}/mongo-db-uri}",

      EMAIL_QUEUE_URL: { Ref: "EmailQueue" },
      SMS_QUEUE_URL: { Ref: "SMSQueue" },

      API_AWS_REGION: "${aws:region}",

      STAGE: "${sls:stage}",
    },
  },
  resources: {
    Resources: {
      ...SQSQueues,
    },
  },
  // functions: { hello },
  functions,
  package: { individually: true },
  custom: {
    // AWS_ACCESS_ID: { 'Fn::ImportValue': 'CartClientSecurityGroup-${sls:stage}' },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    autoswagger,
    warmup: {
      default: {
        enabled: false,
        concurrency: 2,
        prewarm: true,
        cleanFolder: false,
        package: {
          individually: true,
          patterns: ['!**', '.warmup/default/index.js'],
        },
        events: [{ schedule: 'cron(0/5 12-22 ? * MON-FRI *)' }], //EST 08-18 (UTC times are given here)
      },
    },
    logRetentionInDays: 30,
    splitStacks: {
      perFunction: false,
      perType: false,
      perGroupFunction: true,
      nestedStackCount: 5, // Do not change
    },
    safeguards,
    // customDomain: {
    //   domainName: "${param:customDomain}",
    //   // certificateName: '${param:certificate}',
    //   createRoute53Record: true,
    // },
    snsTopicArn: 'arn:aws:sns:us-east-1:588032612315:crud-sns-topic-send-sms'
  },
};

module.exports = serverlessConfiguration;
