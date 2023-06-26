import { SNS } from "aws-sdk";

const sns = new SNS();

const phoneNumbers = ["+1234567890", "+094777426816", "+094779121970"]; // Get recipient's(customer's) Phone Nos from DB

export const subscribeToSMSNotifications: AWSLambda.Handler = async (
  event: AWSLambda.APIGatewayEvent
) => {
  try {
    const subscriptionPromises = phoneNumbers.map(async (phoneNumber) => {
      // Subscribe to the SNS topic for SMS notifications
      const subscription = await sns
        .subscribe({
          TopicArn: "arn:aws:sns:us-east-1:588032612315:crud-sns-topic-send-sms", // change this to get from Parameter Store
          Protocol: "sms",
          Endpoint: phoneNumber,
        })
        .promise();
    });

    await Promise.all(subscriptionPromises);

    return {
      statusCode: 200,
      body: "Subscribed to SMS notifications successfully for all phone numbers",
    };
  } catch (error) {
    console.error("Error subscribing to SMS notifications:", error);
    throw error;
  }
};
