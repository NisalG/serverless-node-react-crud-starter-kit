import { apiResponse } from "@common/apiResponse";
import { sendErrorResponse } from "@common/ErrorTypes";
import { Logger } from "@common/logger";
import { APIGatewayProxyEvent } from "aws-lambda";
import { AddInvoiceInput } from "../invoice.model";
import { addInvoice } from "../invoice.service";
import { SQS, SNS } from "aws-sdk";
import Stripe from "stripe";
import { isUserAuthorized } from "@common/services/role.service";

const sqs = new SQS();
const sns = new SNS();

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2022-11-15",
});

export const addInvoiceHttp = async (
  logger: Logger,
  event: APIGatewayProxyEvent
) => {
  logger.Info({ message: `Adding Invoice` });

  try {
    /**
     * add this after invoice save later
     * enable cognitoAuthorizer for POST
     */
    // console.log('xxxxxxxxxxxxxxxxxx invoice add hit');
    // return apiResponse._200({});
    /////////////////////////////////////////////////////////////////////

    //@ts-ignore
    const input: AddInvoiceInput = event.body;
    const claims =
      event.requestContext?.authorizer ??
      event.requestContext?.authorizer?.claims;

    console.log("claims ", claims);
    /**
       * {
        email: 'admin1@aaaaa.com',
        'custom:location': 'us-east-1',
        'custom:role': 'ADMIN',
        claims: {
          sub: '6478d408-1001-70db-a901-215f8baeb0d7',
          email_verified: true,
          iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxx',
          'cognito:username': '6478d408-xxx-xxxx-a901-xxxxxxx',
          'custom:location': 'us-east-1',
          origin_jti: 'xx-277f-451a-b228-xx',
          aud: 'xxxxxx',
          event_id: '7e643d88-ab1f-47a4-xx-xxxxx',
          token_use: 'id',
          auth_time: 1687701773,
          name: 'admin1@aaaaa.com',
          phone_number: '+3213213213213',
          exp: 1687705373,
          'custom:role': 'ADMIN',
          iat: xxxxxxxx,
          jti: 'xxxxxxxx-ab6e-xxx-8b9f-xxxxxxxxx',
          email: 'admin1@aaaaa.com'
        },
        scopes: undefined,
        principalId: 'xxxxxxx-1001-xxxxx-a901-xxxxxxxxxxxxx'
      }
      */
    // const { sub: userId, ["custom:role"]: userRole } =
    //   event.requestContext?.authorizer ??
    //   event.requestContext?.authorizer?.claims;
    const authorizer = event.requestContext && event.requestContext.authorizer;
    const userId = authorizer && authorizer.sub;
    const userRole =
      (authorizer && authorizer["custom:role"]) ??
      (authorizer && authorizer.claims
        ? authorizer.claims["custom:role"]
        : undefined);

    console.log("User ID:", userId); //User ID: 6478d408-1001-70db-a901-215f8baeb0d7
    console.log("User Role:", userRole); //User Role: ADMIN

    isUserAuthorized(logger, claims); //Error will be thrown if unauthorized

    const invoice = await addInvoice(logger, input, claims);

    return apiResponse._200({ invoice });

    // Get recipient's(customer's) email, phone number from customer MF
    const customerEmail = "nisalg@gmail.com";
    const customerPhoneNumber = "+94777426816"; //change this to another no if doesn't work
    // Get invoice details
    const invoiceData = { amount: 100.0 };

    processEmailAndSMS(customerEmail, customerPhoneNumber, invoiceData);

    const clientSecret = await makeStripePayment(customerEmail, invoiceData);

    // Return the client secret to the frontend for completing the payment

    return apiResponse._200({ clientSecret });
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, "Error when adding Invoice");
  }
};

const processEmailAndSMS = async (
  recipientEmail,
  recipientPhoneNumber,
  invoiceData
) => {
  // Prepare the message to be sent to the SQS queue
  const emailMessage = {
    recipientEmail,
    content: invoiceData,
  };

  // Send the emailMessage to the SQS queue
  await sqs
    .sendMessage({
      QueueUrl:
        "https://sqs.us-east-1.amazonaws.com/588032612315/crud1-email-queue", // change this to get from Parameter Store
      MessageBody: JSON.stringify(emailMessage),
    })
    .promise();

  // Prepare smsMessage to be sent as an SMS
  const smsMessage = {
    phoneNumber: recipientPhoneNumber,
    message: invoiceData,
  };

  // Publish the message to the SNS topic for SMS notifications
  await sns
    .publish({
      TopicArn: "arn:aws:sns:us-east-1:588032612315:crud-sns-topic-send-sms", // change this to get from Parameter Store
      Message: JSON.stringify(smsMessage),
    })
    .promise();
};

const makeStripePayment = async (customerEmail, invoiceData) => {
  try {
    // Create a customer in Stripe
    const customer = await stripe.customers.create({
      email: customerEmail,
      // Add more customer information if needed
    });

    // Create a payment intent for the invoice amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: invoiceData.amount,
      currency: "usd",
      customer: customer.id,
    });

    // Return the client secret for completing the payment
    return paymentIntent.client_secret;
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
};
