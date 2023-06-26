import { SQSEvent } from "aws-lambda";
import { SES } from "aws-sdk";

const ses = new SES(); //config not required when send using SQS

export const sendEmails: AWSLambda.Handler<SQSEvent> = async (
  event: SQSEvent
) => {
  try {
    for (const record of event.Records) {
      const { body } = record;
      const message = JSON.parse(body);

      const { recipientEmail, content } = message;

      // Send email using SES
      await ses
        .sendEmail({
          Source: "Your Billing System <nisal.gunawardana@gmail.com>",
          Destination: { ToAddresses: [recipientEmail] },
          Message: {
            Subject: { Data: "Payment Receipt(Invoice)" },
            Body: { Text: { Data: content } },
          },
        })
        .promise();

      console.log(`Email sent to ${recipientEmail}`);
    }

    return {
      statusCode: 200,
      body: "Emails sent successfully",
    };
  } catch (error) {
    console.error("Error sending emails:", error);
    throw error;
  }
};
