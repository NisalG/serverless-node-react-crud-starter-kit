import { AWS } from '@serverless/typescript';
import { SERVERLESS } from 'src/constants/commonConstants'

const Tags = [
    {
        "Key": "CreatedBy",
        "Value": SERVERLESS
    },
    {
        "Key": "env",
        "Value": "cart-${sls:stage}"
    },
    {
        "Key": "application",
        "Value": "cart-api"
    }
]

export const SQSQueues: AWS['resources']['Resources'] = {
    // AuditQueue: {
    //     Type: 'AWS::SQS::Queue',
    //     Properties: {
    //         QueueName: "audit-queue-${sls:stage}",
    //         Tags,
    //         MessageRetentionPeriod: 3000,
    //     }
    // },
    
    EmailQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
            QueueName: "crud1-email-queue-${sls:stage}",
            // Tags,
            MessageRetentionPeriod: 3000,
        }
    },
    SMSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
            QueueName: "cart-sms-queue-${sls:stage}",
            Tags,
            MessageRetentionPeriod: 3000,
        }
    },

    // PushMessageQueue: {
    //     Type: 'AWS::SQS::Queue',
    //     Properties: {
    //         QueueName: "push-${sls:stage}",
    //         Tags,
    //         MessageRetentionPeriod: 3000,
    //     }
    // },
}


