import { AWS } from '@serverless/typescript';

export const ProviderIAMRoles: AWS['provider']['iamRoleStatements'] =
    [
        {
            "Effect": "Allow",
            "Action": [
                "sqs:*"
            ],
            "Resource": { "Fn::GetAtt": ["EmailQueue", "Arn"] }
        },
        {
            "Effect": "Allow",
            "Action": [
                "sqs:*"
            ],
            "Resource": { "Fn::GetAtt": ["SMSQueue", "Arn"] }
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": "*" //TODO Get only buckets needed
        },
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:*",
                "cognito-identity:*"
            ],
            "Resource": "*"
        },
    ]
