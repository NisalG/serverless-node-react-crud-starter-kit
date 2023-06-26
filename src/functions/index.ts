// export { default as hello } from './hello';
import { AWS } from "@serverless/typescript";
import { itemFunctions } from "./item";
import { invoiceFunctions } from "./invoice";
import { cartAuthFunctions } from "./cartAuth";
import { authorizerFunctions } from "./authorizer";
import { cartUserFunctions } from "./cartUser";

export const functions: AWS["functions"] = {
  ...itemFunctions,
  ...invoiceFunctions,
  ...cartAuthFunctions,
  ...authorizerFunctions,
  ...cartUserFunctions
};
