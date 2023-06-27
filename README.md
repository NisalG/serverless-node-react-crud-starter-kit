
  
  

# Serverless Node.js + React.js CRUD/ Starter-Kit

  
  

# Introduction

  

Comprehensive Node.js + Serverless Framework CRUD / Starter project Backend with React.js Hooks (Reducer, Context) Frontend

  
  

## Stack/Techs:

  

Serverless Framework, Node.js, TypeScript, React.js, Mongoose, TypeORM, Middy, AWS SES, SNS, SMS, SQS, CodePipeLine, CodeDeploy, CodeBuild, APIGateway, CloudFormation(IaC - _Infrastructure as Code_), S3, Cognito, Lambda Warm-ups, Safeguards, CI/CD - build specs, Jest, Swagger, Husky - pre commit hooks: Prettier/Linter, pre-push hooks: serverles-validate, serverless-offline, Sentry Error Monitoring etc.

  
  

# AWS configuration

  
  
  

* Get AWS IAM user Access key & Secret access key

* Set AWS credentials and configuration:

* Using AWS terminal commands: `$ aws configure`

* Or editing the credentials file is located at ~/.aws/credentials and config at ~/.aws/config on Linux or macOS, or at C:\Users\USERNAME\.aws\credentials and C:\Users\USERNAME\.aws\config on Windows

* Install AWS-SDK globally using `$ npm install aws-sdk -g`

  
  

# Serverless Framework - Initiation

  
  
  

* Install serverless package globally: `$ npm install serverless -g`

* Initialize a new serverless project: `$ serverless create --template aws-nodejs-typescript --path aws-serverless-typescript-crud1`

* Open in VSCode

*  `$ npm i`

*  `$ npm i serverless-offline serverless-dotenv-plugin serverless-bundle --save-dev`

* Added this to package.json:
```
"scripts": {
"start": "serverless offline start --allowCache --aws-profile default --stage dev",
```

*  `$ npm start`

* Use Postman to test locally

* Deployment

*  `$ npm run deploy`

*  `$ serverless deploy function -f createList`

  
  

# Serverless Framework - Plugins

  
  
  

* [serverless-plugin-log-retention](https://www.serverless.com/plugins/serverless-plugin-log-retention)

* [serverless-prune plugin](https://www.serverless.com/plugins/serverless-prune-plugin)

* [serverless-offline plugin](https://www.serverless.com/plugins/serverless-offline)

* [Safeguards](https://www.npmjs.com/package/@serverless/safeguards-plugin)

* [Serverless WarmUp Plugin](https://www.serverless.com/plugins/serverless-plugin-warmup)

* [serverless-domain-manager](https://www.serverless.com/plugins/serverless-domain-manager)

* [serverless-dotenv-plugin](https://www.serverless.com/plugins/serverless-dotenv-plugin)

  
  

## Serverless Plugins - Descriptions and Steps

  
  
  

* Add these additional serverless packages to package.json:

    *  `"serverless-dotenv-plugin": "^6.0.0",`

    *  `"serverless-auto-swagger": "^2.5.1",`

    *  `"serverless-newrelic-lambda-layers": "^3.3.1",`

    *  `"serverless-offline": "^8.8.0",`

    *  `"serverless-plugin-log-retention": "^2.0.0",`

    *  `"serverless-plugin-split-stacks": "^1.11.3",`

    *  `"serverless-plugin-warmup": "^8.0.0",`

    *  `"serverless-prune-plugin": "^2.0.1",` - See Serverless Prune

* [serverless-plugin-log-retention](https://www.serverless.com/plugins/serverless-plugin-log-retention)

    * Control the retention of your serverless function's cloudwatch logs.

    *  `$ npm install --save-dev serverless-plugin-log-retention`

    * serverless.ts:

        *  `plugins > serverless-prune-plugin `

        *  `provider > custom >logRetentionInDays`

* [Serverless WarmUp Plugin ](https://www.serverless.com/plugins/serverless-plugin-warmup) - Warmup Lambda Functions

    * Lambda functions are idle/cold by default. They are charged for run time, therefore we keep them in cold mode and not in warm mode.

    * How long does Lambda take to warm up?

    According to AWS docs, it can take **up to 5 seconds** (cold start) if invoking the lambda for the first time. Also, if a lambda function is kept idle for more than 15 minutes the existing container of that lambda dies.

    * We keep warm-up only the ones we need quickly spin-up to save cost.

    * [Serverless WarmUp Plugin](https://www.npmjs.com/package/serverless-plugin-warmup/v/4.9.0) / [Serverless WarmUp Plugin ](https://www.serverless.com/plugins/serverless-plugin-warmup)

        * WarmUp solves cold starts by creating a scheduled lambda that invokes all the selected service's lambdas in a configured time interval (default: 5 minutes) and forcing your containers to stay warm.

        * Install via npm in the root of your Serverless service(package.json):

            `$ npm install --save-dev serverless-plugin-warmup`

        * Add the plugin to the `plugins `array in your serverless.yaml/ts:
            ```
            `plugins: [`
                'serverless-plugin-warmup',
            ]

            ```

        * Add the configuration to the `custom > warmup` object in your serverless.yaml/ts:
        ```
        `custom : {`
            warmup: {

            }
        }
        ```
  

        * [Configuration](https://www.npmjs.com/package/serverless-plugin-warmup/v/4.9.0#configuration) list (listed only ones used in Cart app)

            *  **folderName** Folder to temporarily store the generated code (defaults to `_warmup. ./_warmup `will be generated by the plugin. Also a `./.warmup` folder will be generated by the plugin. This folder will be excluded in tsconfig.json file.

            *  **enabled** Whether your lambda should be warmed up or not. Can be a boolean, a stage for which the lambda will be warmed up or a list of stages for which your lambda will be warmed up (defaults to `false`)

            *  **concurrency** The number of times that each of your lambda functions will be called in parallel. This can be used in a best-effort attempt to force AWS to spin up more parallel containers for your lambda. (defaults to 1)

            *  **prewarm** If set to `true`, it warms up your lambdas right after deploying (defaults to `false`)

            *  **cleanFolder** Whether to automatically delete the generated code folder. You might want to keep it if you are doing some custom packaging (defaults to `true`)

            *  **package** The package configuration. Can be any [Serverless package configuration](https://serverless.com/framework/docs/providers/aws/guide/packaging#package-configuration) (defaults to `{ individually: true, exclude: ['**'], include: ['_warmup/**'] }`)

            * In CartApp: `patterns: ['!**', '.warmup/default/index.js'],`)

            *  `individually -`package functions individually

            *  `patterns: ['!**', '.warmup/default/index.js'], `- Exclude all but include `.warmup/default/index.js `which includes the functions that should be included to keep warm

            *  **events** The event that triggers the warmer lambda. Can be any [Serverless event](https://serverless.com/framework/docs/providers/aws/events/) (defaults to - `schedule: rate(5 minutes)`)

            * in CartApp: `{ schedule: 'cron(0/5 12-22 ? * MON-FRI *)' }`

            * Every 5th minute starting from the 0th minute of the hour, and range from 12th hour to 22nd hour(10pm)

            * Run only on weekdays

        * Add src\aws\resources\warmer-configs.ts

        * Ran and check - : `$ npm start`

        * See [Deployment](https://www.serverless.com/plugins/serverless-plugin-warmup)

        * Works when run: `$ serverless deploy`

        * [Packaging](https://www.serverless.com/plugins/serverless-plugin-warmup)

        * .warmup/default/index.js - see above ‘folderName’

        * Works when run: `$ serverless package`

        * Add `warmup `configs in the required function’s index.ts file

            Added and keep commented because of the possible cost in src\functions\cartAuth\index.ts

            ```
            // @ts-ignore
            warmup: {
                default: {
                    enabled: ['dev', 'stg'],
                },
            },
            ```

        * Add `warmup `in the required function’s handler.ts file

            ```
            //@ts-ignore
            if (event.source === 'serverless-plugin-warmup') {
                console.log('WarmUp - Lambda is warm!');
                event.httpMethod = 'GET';
                return 'Lambda is warm!';
            }
            ```

    * [Cost ](https://www.serverless.com/plugins/serverless-plugin-warmup)- there’s a cost for keeping Lambda functions Warmup. Therefore disable them when testing.

* [serverless-prune plugin](https://www.serverless.com/plugins/serverless-prune-plugin)

    * Following deployment, the Serverless Framework does not purge previous versions of functions from AWS, so the number of deployed versions can grow out of hand rather quickly. This plugin allows pruning of all but the most recent version(s) of managed functions from AWS.

    * [Write Sign In Serverless Pruning What is it? When and How to use it?](https://medium.com/@pjoshi_96874/serverless-pruning-what-is-it-when-and-how-to-use-it-1ac79dcb927a)

    *  `$ npm install --save-dev serverless-prune-plugin`

    * serverless.yml file:

        *  `plugins > serverless-prune-plugin `

    * Errors:

        * Run this if you get CodeBuild errors in CI/CD Pipelines(Deployments) by adding this to buildspec.yml when merging a PR. (Errors like ‘cmake’ not found): `sls prune -n 10 --stage $STAGE --region $AWS_REGION`

* [serverless-offline plugin](https://www.serverless.com/plugins/serverless-offline)

    * This Serverless plugin emulates AWS λ and API Gateway on your local machine to speed up your development cycles. To do so, it starts an HTTP server that handles the request's lifecycle like APIG does and invokes your handlers.

    *  `$ npm install serverless-offline --save-dev`

    *  `plugins > serverless-offline `

    * Add to package.json to run

        * With `$npm start`

        * With `$npm debug`

* [serverless-domain-manager](https://www.serverless.com/plugins/serverless-domain-manager)

    * Info: Disabled serverless-domain-manager setting in serverless.ts

    * Create custom domain names that your lambda can deploy to with serverless.

    *  `$ npm install serverless-domain-manager --save-dev`

    *  `plugins > serverless-domain-manager`

* [serverless-dotenv-plugin](https://www.serverless.com/plugins/serverless-dotenv-plugin)

    * Preload environment variables from `.env` into Serverless Lambda environment.

    *  `$ npm i -D serverless-dotenv-plugin`

    *  `serverless.ts: useDotenv: true`

* [Safeguards](https://www.npmjs.com/package/@serverless/safeguards-plugin)

    * Safeguards is a policy-as-code framework for Serverless Framework which enables you to inspect your serverless.yml file, and the generated Cloud Formation templates, for compliance with security, operational, and organizational best practices. Safeguards are made available as a stand-alone Serverless Framework plugin with no external dependencies.

    *  `$ npm i @serverless/safeguards-plugin --save-dev`

    *  `serverless.yml: plugins > - '@serverless/safeguards-plugin'`

    * package.json in “scripts”`> $ npm run serverless:validate`

    * Validate will run when deploy using:` $ serverless deploy`

    * Running standalone validate:` $ npm run serverless:validate`

* [serverless-plugin-split-stacks](https://www.serverless.com/plugins/serverless-plugin-split-stacks)

    * This plugin migrates CloudFormation resources into nested stacks in order to work around the 200 resource limit and create more stacks as nested within that 200 limit.

    * serverless.ts: `splitStacks`

    * package.json:

    * This will create Nested Stacks in AWS Systems Manager > Application Manager > CloudFormation stacks

        * E.g: `aws-serverless-typescript-crud1-dev-1NestedStack-1XXXXXXXXXXX`

  
  

# Databases - multiple: MySQL, MongoDB

  
  

### Summary

  
  
  

* MySQL

    * TypeORM

    * Migrations

    * Seedings

    * Database Transactions with TypeORM QueryRunner

* MongoDB

    * Mongoose

  
  

### MySQL DB in RDS

  
  
  

* RDS > Create Database

* Standard create > MariaDB > Free tier

* DB instance identifier(not the DB name): `serverless-crud-1-db`

    * Create a db using MySQL Workbench: `serverless-crud-1`

    * Set Parameter Store > /dev/mysql-dbname to: `serverless-crud-1`

* Master username: `admin `(/dev/mysql-username)

* (/dev/mysql-password) Master password: use auto generated pwd.

* Connectivity > Additional configuration > Publicly accessible

    * If cannot connect from MySQL WorkBench

        Connectivity & security > Security > VPC security groups > Select group in EC2 > Inbound rules > Edit Inbound rules > Add rule > All Traffic > Anywhere-IPv4 > Save Rules

        Try WB connecting again

* Create Database button

* After creation:

    * Endpoint: (/dev/mysql-host) `serverless-crud-1-db.xxxxxxxxx.us-east-1.rds.amazonaws.com`

    * Port: `3306`

  
  

### TypeORM + MySQL

  
  
  

* To store Items

*  `$ npm install mysql --save`

* First Create MySQL RDS DB as below and add provider.environment.MYSQL_HOST etc in serverless.ts and SSM(Systems Manager > Parameter Store)

* Schema Models(*.schema.model.ts): src\data\mySQL\models (TypeORM schema models)

* TypeORM :

    *  `$ npm i typeorm — save`

    *  `$ npm i typeorm-extension — save`

    *  `$ npm i reflect-metadata — save`

* src\data\mySQL\data-source.ts

    * Use to initiate the TypeORM DB Datasource with settings

* src\data\mySQL\index.ts

    * Use to export all TypeORM Schema Models and use above TypeORM Datasource

* src\data\mySQL\models\baseEntityAbstract.model.ts

    * Use to maintain an abstract base entity model for ActiveRecord Pattern

* TypeORM Relationships

* TypeORM Migrations:

    * src\data\mySQL\migration

    * Add fields to the model. See src\data\mySQL\models\item.schema.model.ts

    * This will generate the file in the project root. Move it in to src/data/mySQL/migration: `$ npm run typeorm migration:generate create_items_table`

    *  `$ npm run typeorm migration:run`

* Seeds

    * Uses [Typeorm Extension](https://www.npmjs.com/package/typeorm-extension) > Seed

        *  `$ npm i typeorm-extension`

    * package.json: `"seed": "ts-node ./node_modules/typeorm-extension/dist/cli/index.js seed -d ./src/data/mySQL/data-source.ts"`,

    * Add src\data\mySQL\seeding\seeds

        * src\data\mySQL\seeding\seeds\itemsSeed.ts

        * src\data\mySQL\seeding\seeds\mainSeeder.ts

    *  `$ npm run seed`

  
  

### Mongoose + MongoDB - Schema Models(.schema.model.ts)

  
  
  

* To store checked out carts(invoices)

* No migration used for MongoDB/Mongoose

* MongoDB >

    * Template: “M0 Free”

    * Provider: AWS

    * Region: us-east-1

    * Cluster Name: Cluster0

    * Create DB: cart

    * Create User

    * Create Cluster

    * Network Access > Add IP Address > Allow Access From Anywhere

        * This will add 0.0.0.0/0 to Access List

    * Connecting: Atlas > Databases > Cluster 0 > Connect

        * Access your data through tools > Compass

        * Install MongoDBCompass

        * Copy the connection string, then open MongoDB Compass.

        * New Connection

            * Paste above URI

            * Advanced Connection Options

                * General

                    * mongodb+srv

                * Authentication > Method

                    * Username/Password

        * Create Database

            * Database Name: cart

            * Collection Name: invoices

    * Connect to your application

        *  `$ npm install mongodb`

        * Add your connection string into your application code

        * Add this to Parameter Store: /dev/mongo-db-uri

* Add provider.environment.MONGODB_URL etc in serverless.ts and SSM(Systems Manager > Parameter Store)

    * Param: /dev/mongo-db-uri

    * Add value

*  `$ npm i mongoose`

* src\data\mongoDb\dbConnection.ts

* src\data\mongoDb\index.ts

* TS model: src\data\models\invoice.model.ts

* Mongoose schema model: src\data\mongoDB\models\invoice.schema.model.ts

* Create: src\functions\invoice\invoice.service.ts >> addInvoice

* Get all: src\functions\invoice\invoice.service.ts >> getInvoicesDb

* Get: src\functions\invoice\invoice.service.ts >> getInvoiceDb

* Update: src\functions\invoice\invoice.service.ts >> updateInvoiceDb

* Delete: src\functions\invoice\invoice.service.ts >> deleteInvoiceDb

* Other: src\data\mongoDb\auditLog.service.ts

  
  

# Authentication & Authorization with Cognito

  
  
  

* Cognito User CRUD, Password Setting and changing etc.

* Roles with claims for Authorization

* For the ease of this CRUD, user creation will be available without authentication.

* Order to use the end points (User flow)

    * Create user with PWD

    * Singing with user email and pwd and get the token for other requests

* AWS Cognito - Serverless initial setup:

    * Initial serverles.yml changes

        * Under resources you can manually add as below, but instead we do it CF > Create Stack as below.

            * Add `UserPool`

            * Add `UserPoolClient`

        * CF > Create Stack > Upload file > cart-cognito-dev.yml > Stack name “cart-cognito-dev”. Stacks should be created for each environment.

            * By creating the CF stack, it will also create Cognito User Pool “cart-user-pool-dev” and User Pool Client “cart-user-pool-client-dev” inside App Integrations.

        * iamRoleStatements

            * Add a new:` iam > role > statements`

            * This is done in src\aws\serverless\ProviderIAMRoles\index.ts

        ```
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:*",
                "cognito-identity:*"
            ],
            "Resource": "*"
        },
        ```

    * Deploy - `$ npm run deploy`

        * AWS > Cognito > new user pool available

        * AWS > Cognito > App clients > new app client available

    * After deploying add to serverles.yml

        * Environment - do this in all relevant index.ts files as below

            * USER_POOL - in AWS > Cognito > User Pool Id

            * USER_POOL_CLIENT

        * in all relevant index.ts files

            * E.g: src\functions\authorizer\index.ts

  

        Below code is used to get a value from an AWS CloudFormation stack that creates an Amazon Cognito User Pool. In the Serverless Framework configuration file, ${cf()} is used as an intrinsic function to retrieve the UserPoolId output value from the specified CloudFormation stack. The retrieved UserPoolId will be assigned to the environment variable named COGNITO_USER_POOL_ID.

        ```
        environment: {
            COGNITO_USER_POOL_ID:
            '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolId}',
            COGNITO_CLIENT_ID:
            '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolClientId}',
        },
        ```
  
    * Add Register function which get email and pwd

        *  `import { CognitoIdentityServiceProvider } from 'aws-sdk';`

        *  `import USER_POOL from ENV - process.env.USER_POOL`

            *  `process.env.COGNITO_USER_POOL_ID`

            * Check var name in all places

        * Add register function to functions list in src\functions\index.ts

        *  `adminCreateUser `passing params

            * `userPoolId`

            * `userEmail`

            * `userAttributes`

            * `MessageAction`

        *  `adminSetUserPassword`

            * `Password`

            * `userPoolId`

            * `userName(email)`

            * `Permanent`

        * Use Postman [[http://localhost:3000/dev/v1/cartUser](http://localhost:3000/dev/v1/cartUser)] with below params and register will response with created user

        Request:
        ```
        {
            "email": "admin1@aaaaa.com",
            "name": "name1",
            "password": "Valid_P@ssword_1234",
            "phone": "3213213213213",
            "location": "us-east-1",
            "address": "address1",
            "role": "admin"
        }
        ```

    * Add login function

        * Add login function to functions list in src\functions\index.ts

        * `adminInitiateAuth`

            * `AuthFlow - `added the one you used when creating

            * `userPoolId`

            * `ClientId`

            * `AuthParameters`

                * `UserName`

                * `Password`

        * Use Postman [[http://localhost:3000/dev/v1/cartAuth/authenticateUser](http://localhost:3000/dev/v1/cartAuth/authenticateUser)] and login will respond with `AccessToken `etc. Amazon Cognito generates JWTs but also adds additional claims to JSON Web Tokens, increasing their size.

        Request:
        ```
        {
            "username": "admin1@aaaaa.com",
            "password": "Valid_P@ssword_1234"
        }
        ```

        Response:
        ```
        {
            "data": {
                "tokens": {
                    "idToken": "xxxxx", //for authentication
                    "accessToken": "xxxxx", //for authorization
                    "refreshToken": "xxxxx"
                }
            }
        }
        ```
  

    * For private/protected routes

        * Pass COGNITO_USER_POOL_ID and `authorizer `in src\functions\XXXXXX\index.ts

        * In Postman use the above `idToken `as the `Bearer token`.

        * If you use `accessToken `instead, will get an error: `"Token use not allowed: access. Expected: id"`

* Login and register user with Serverless API and AWS Cognito FE:

    * React FE

    * Use NPM package [react-cokie](https://www.npmjs.com/package/react-cookie) > `setCookie()` to store `AccessToken `and `RefreshToken`

* Private API endpoints with Serverless and AWS Cognito:

    * Add authorizer(cognitoAuthorizer) as src\functions\authorizer\index.ts

        * Keep Register and Login functions public without adding above

        * `identitySource `- only in src\functions\notifications\webSockets\index.ts

        * `issuerUrl `- not used in Pre project

        * `audience `- not used in Pre project

    * Use above `cognitoAuthorizer `in all the private routes as in src\functions\item\index.ts

        * `authorizer: `cognitoAuthorizer`,`

    * Go to /login and get the access token and add it in Postman to access private routes

* Private routes with React router and Serverless framework API:

    * After login we have `AccessToken `and `RefreshToken` in cookies

    * Use React logic to handle private routes by using above `AccessToken` in FE Axios headers which call BE private API endpoints

    * If the tokens are not available, React Router will redirect to Login page

* AWS Cognito getUser with React and Serverless:

    * Uses Cognito `getUser `to get additional user data from Cognito after Login

    * We have `adminGetUser `in src\common\services\cognitoAuth.service.ts

* Accessing data in DB by User ID from Cognito:

    * Extracting userId from token using [aws-jwt-verify](https://www.npmjs.com/package/aws-jwt-verify)

        * src\functions\authorizer\authorizer.service.ts

        * src\functions\authorizer\cognito\handler.ts

            * `create()`

            * `verify()`

            * `CognitoJwtVerifier`

            * `CognitoIdTokenPayload`

        * We can now use this `userId `to query various user related data from the DB

* Authorization using Cognito Claims.

    * Basic claim check will be done based on the user role custom attribute we have given when creating the user

    ```
    {
        "Name": "custom:role",
        "Value": "admin"
    },
    ```

# TDD - Test cases with Jest

  
  
  

* Sample test cases in test\item

* Packages required:

    *  `$ npm i jest --save`

    *  `$ npm i babel-jest --save`

        * This is official Facebook Babel plugin for Jest

        * Add babel-jest and it will automatically compile JavaScript code using Babel.

    *  `$ npm i @types/jest -–save -dev` (This package contains type definitions for Jest)

    *  `$ npm i jest-aws-sdk-mock --save`

        * Create Jest Mocks for AWS SDK services.

        * This module was created to help test AWS Lambda functions but can be used in any situation where the AWS SDK needs to be mocked.

    * Create a new file named jest.config.js at the root of your project directory with below basic content.

  
    ```
    module.exports = {
        testEnvironment: 'node', // Use Node.js environment for tests (default)
        moduleFileExtensions: ['js'], // Only include .js files in test suite
        testMatch: ['**/*.test.js'], // Define pattern for matching test files
    };
    ```

* package.json > scripts:

    * To run automatically when commit: `"test": "jest --config=jest.config.js",`

    * To run in local: `"test:dev": "jest --config=jest.config.js --watchAll",`

    * Run tests: `$ npm run test:dev`

        * For a specific file: `$ npm test item.test`

        * For a specific file: `$ npm test -- test/item/item.test.ts`

    *  **To do:** Code coverage report generation with Jest(jest.config.js)

  
  

# Other - related:

  
  

### Middleware with [Middy](https://middy.js.org/docs/):

  

Middy is a very simple **middleware engine** that allows you to simplify your **AWS Lambda** code when using **Node.js**.

  
  
  

    * Add these to package.json:

    ```
    "@middy/core": "^2.5.3",
    "@middy/http-cors": "^3.1.0",
    "@middy/http-json-body-parser": "^2.5.3",
    "@middy/http-multipart-body-parser": "^3.1.1",
    "@middy/http-security-headers": "^3.0.3",
    ```

    * Middy wrapper: src\common\middyWrapper.ts

    * Add custom middlewares to Middy:

        * [https://javascript.plainenglish.io/how-to-start-typescript-node-aws-function-with-serverlessjs-ef4b55910127](https://javascript.plainenglish.io/how-to-start-typescript-node-aws-function-with-serverlessjs-ef4b55910127)

        * Custom middleware: src\common\middleware\errorHandlingMiddleware.ts

        * Add this to maintain a central place for error handling and add it as a middleware to all requests by adding it as a custom Middy middleware

  
  

### Eslint

  
  
  

    *  `$ npm install eslint --save-dev`

    * For Typescript support:

        *  `$ npm install --save-dev @typescript-eslint/eslint-plugin`

        *  `$ npm install --save-dev @typescript-eslint/parser`

    * Initialize an `.eslintrc` configuration file for your project using one of the following methods:

        * If you want to use a popular style guide such as Airbnb or Google, you can run `$ npx eslint --init` and select the corresponding preset from the options provided.

        * Alternatively, you can manually create an `.eslintrc.json` file at the root of your project directory and configure it according to your preferences. Here is an example configuration object that enables some basic rules:

        ```
        {
            "env": {
                "browser": true,
                "node": true,
                "es6": true
            },
            "extends": [
                "eslint:recommended"
            ],
            "parserOptions": {
                "sourceType": "module",
                "ecmaVersion": 2018
            },
            "rules":{
                "semi":["error", 'always'],
                "quotes":["error", 'single'],
                "no-console":"warn"
            }
        }
        ```

    * Add any additional plugins or configurations that are relevant to your specific application needs.

    * Run

        * Basic: `$ eslint &lt;file/directory>` on any files or directories containing JavaScript code that should be checked against these rules.

        * In this project: `$ npm run lint`

    * Optionally, integrate ESLint into your build process (e.g., via pre-commit hooks) to automatically check for errors before deploying new code changes. See the Husky pre-commit hooks section.

  
  

### Husky pre-commit & pre-push Hooks

  

Linting, Compile, Serverless validate

    * [pre-commit](https://git-scm.com/docs/githooks#_pre_commit) and [pre-push](https://git-scm.com/docs/githooks#_pre_push) are two [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) (Git has a way to fire off custom scripts when certain important actions occur). We use these events with Husky

    * [Husky NPM](https://www.npmjs.com/package/husky) | [Husky Docs](https://typicode.github.io/husky/)

        * `$ npm i husky --save-dev`

        * Add package.json >` "prepare": "husky install",`

        * `$ npm run prepare`

        * Add .husky folder with files for pre-commit and pre-push Git Hooks

        * Commands in the .husky folder will run on the commit and push events.

            * .husky\pre-commit

            ```
            # npm run prettier
            npm run compile #(or npm run tsc to compile TSC and build .lib folder content files)
            npx pretty-quick --staged
            npm run lint
            ```
            

            * .husky\pre-push

            ```
            npm test
            npm run serverless:validate
            ```

    * Also see how `lib `folder is generated

    * If committing is not allowed, run lint command and list the errors and fix them manually: `$ npm run lint`

  
  

### Swagger

  
  
  

* Used this NPM package: [serverless-auto-swagger](https://www.npmjs.com/package/serverless-auto-swagger)

*  `$ npm install -D serverless-auto-swagger`

* OR package.json > `"serverless-auto-swagger": "^2.5.1",`

* serverless.ts

*  `plugins: [`

*  `'serverless-auto-swagger', - should add to top/first array element`

*  `custom: {`

*  `autoswagger`

* src\types\swagger.config.ts

*  `typefiles`: Array of strings which defines where to find the typescript types to use for the request and response bodies

* If you do not add new model.ts files in here, Swagger models will not be added

* Swagger local access: [http://localhost:3000/dev/swagger](http://localhost:3000/dev/swagger)

  
  

### Logging

  
  
  

* Logger to use throughout the application

* Logging: src\common\logger.ts

* Types: Error, Warning, Info

* Colors and background colors

  
  

### Typescript models(types)

  
  
  

* ErrorTypes

* src\common\ErrorTypes.ts

* API Responses types

* src\common\apiResponse.ts

  
  

### serverless.ts features: [Serverless.yml Reference - all available properties in serverless.yml](https://www.serverless.com/framework/docs/providers/aws/guide/serverless.yml)

  
  
  

*  `useDotenv: true,`

*  `params`: { — for custom params

  

`dev`: {

  
  

`customDomain`:

  

*  `plugins`: [

* `'serverless-auto-swagger`', – also add to package.json and install

*  `provider`

* `iamRoleStatements: ProviderIAMRoles,`

* See [IAM Permissions For Functions](https://www.serverless.com/framework/docs/providers/aws/guide/iam)

  

AWS Lambda functions need permissions to interact with other AWS services and resources in your account. These permissions are set via an AWS IAM Role, which the Serverless Framework automatically creates for each service, and is shared by all functions in the service. The Framework allows you to modify this Role or create Function-specific Roles, easily.

  

* Format:

  

```

Effect: 'Allow'

Resource: '*'

Action: 'iam:DeleteUser'

```

  
  

* In the Cart App we include these in src\aws\serverless\ProviderIAMRoles\index.ts and import here in serverless.ts

* `apiGateway`

* `minimumCompressionSize - `Compress response when larger than specified size in bytes (must be between 0 and 10485760)

* `shouldStartNameWithService - `# Use `${service}-${stage}` naming for API Gateway. Will be `true` by default in v3.

* `logs: { `- Enable HTTP API logs

* ` restApi: true, - `Enables HTTP access logs (default: true)

* `logRetentionInDays: 30, `-Duration for CloudWatch log retention (default: forever). Overrides provider setting.

* `Environment `- Function environment variables

*  `functions `from a separate src/functions.ts file

* Use this as the example: `import { cartUserFunctions } from './cartUser';`

* Use for the CRUD src\functions\cartUser\index.ts

*  `package`

*  `custom`: {

* `AWS_ACCESS_ID` - This is used in src\functions\auth\auth.service.ts > getIdentityToken. Need in Cart auth.

* `esbuild`

* Esbuild configs from [Serverless Esbuild](https://www.serverless.com/plugins/serverless-esbuild) plugin

* Serverless plugin to bundle JavaScript and TypeScript lambdas with esbuild - an extremely fast bundler and minifier

* `autoswagger `- See swagger

* `warmup `- see “Warmup Lambda Functions”

* `logRetentionInDays`

* `splitStacks`

* Uses [serverless-plugin-split-stacks](https://www.serverless.com/plugins/serverless-plugin-split-stacks)

* `customDomain `added as customDomain

  
  

### SQS + SES + SNS

  
  

#### AWS SQS and SNS to send Email & SMS notification when an Invoice is saved:

  
  

##### Summary:

  
  
  

* Create AWS SQS, SES, SNS setups

* Update the `serverless.yml` file accordingly

* Create Invoice event(function)

* SQS - Add to SQS queue

* SNS - Publish messages

* Usage:

* SQS - sendMail() -

* Triggers when a new email message is added to the queue.

* Send the Email using SES

* SNS - subscribeToSMSNotification()

* Triggers when user SignUp(register)/SignIn

* Send SMSs to the phone nos of the user taken from the DB

  
  

##### Scenario/use case:

  

**Emails:**

  

In a Lambda app like a Billing System, SQS and SES can be used together for efficient email delivery:

  
  
  

1. Billing System: Generates invoice and publishes messages to an SQS queue, including email address and other content.

2. Email-Sending Component: Implemented as an AWS Lambda function, it periodically triggers or checks for messages in the SQS queue and retrieves a batch of messages from the SQS queue, each containing an email address and invoice content.

3. SES Integration: Uses the AWS SES API to send emails to recipients' addresses, populating them with invoice content and ensuring proper formatting.

4. Email Delivery: SES handles reliable email delivery and manages undelivered emails, including handling bounces or complaints.

  

By combining SQS and SES, you create a scalable and fault-tolerant email sending system. The billing system can generate invoices without waiting for immediate email sending. The separate email-sending component retrieves messages from the SQS queue at its own pace, allowing independent scaling based on message volume. This decoupled asynchronous approach ensures efficient email delivery without overwhelming/blocking the billing system.

  

**SMSs:**

  

Using SNS for sending SMS notifications:

  
  
  

1. Notification System: Your application generates notifications and publishes them to an SNS topic instead of directly sending SMS messages.

2. SMS-Sending Component: A separate component, such as an AWS Lambda function or worker process, is subscribed to the SNS topic to handle SMS message sending.

3. SNS Integration: When a new notification is published to the SNS topic, it automatically triggers the SMS-sending component.

4. SMS Processing: The SMS-sending component receives the notifications from SNS, extracts the recipient's phone number and message content, and processes them.

5. SMS Delivery: The component uses the AWS SNS API to send SMS messages to the recipients' phone numbers, ensuring proper formatting and relevant information.

  

By leveraging SNS for SMS sending, you create a scalable and efficient notification system. Your application publishes notifications to the SNS topic, leaving the SMS delivery process to the subscribed component. This decoupling allows independent scaling based on message volume and ensures reliable SMS delivery. It simplifies your application logic and provides a seamless user experience.

  
  

##### Setup AWS SQS to use in your Serverless application:

  
  
  

1. AWS Management Console > SQS service > Create Queue

2. Provide a name(_crud1-email-queue_) for your queue and configure any desired settings. For example, you can choose between a standard queue or a FIFO queue, set visibility timeout, message retention period, etc.

3. Once the queue is created, go to the queue details page. Find the queue's ARN (Amazon Resource Name) which uniquely identifies _AWS_ resources.

4. Update the `serverless.yml` file in your Serverless service and replace `your-aws-region`, `your-aws-account-id`, and `your-sqs-queue-name` in the `arn` property of the `sqs` event with the appropriate values.

  
  

```

events: - sqs: arn: arn:aws:sqs:us-west-2:123456789012:my-queue

```

  
  

By updating the `arn` property with the correct ARN of your SQS queue, you have configured the Serverless Framework to trigger the `sendEmail` function whenever a message is sent to that SQS queue. With these steps, your Serverless application will be set up to receive messages from the specified SQS queue and process them to send emails using AWS SES.

  
  

##### Setup AWS SES to send emails:

  
  
  

1. AWS Management Console > SES service > Choose SES region> Create identity

2. Identity type - Email - give your own email.

3. Verify your email address or domain in SES. This step ensures that SES can send emails on your behalf.

4.  ~~Create an IAM user with proper permissions for SES.~~

5.  ~~Set up SMTP credentials(username and password) to authenticate your application when sending emails via SES. ~~

6. SMTP settings provided by SES, not required when sent using SQS.

  
  

##### Setup AWS SNS to send SMSs

  
  
  

* Create an SNS topic:

* AWS Management Console > SNS > Create topic: crud-sns-topic-send-sms

* Make note of the ARN (Amazon Resource Name) for the topic.

* Subscribe to the SNS topic:

* Select topic > Create subscription

* Choose the protocol as "SMS" and enter the phone number to which you want to send the SMS notifications. For Sandbox destination phone numbers, Add Phone No.

* Confirm the subscription and validate the phone number by entering the Verification you receive. (Verification code received after several tries)

  
  

##### Update the `serverless.yml` file accordingly

  
  
  

* Add Resources in src\aws\sqs\index.ts

* Add functions in src\functions\index.ts

* createInvoice > added in src\functions\invoice\index.ts

* Add SNS Topic Arn in `custom `section

  
  

```

service: billing-system

  

provider:

name: aws

runtime: nodejs14.x

  

resources:

Resources:

InvoiceQueue:

Type: AWS::SQS::Queue

Properties:

QueueName: invoice-queue

  

functions:

createInvoice:

handler: createInvoice.handler

events:

- http:

path: create-invoice

method: post

//added in src\functions\invoice\index.ts

  

sendEmails:

handler: sendEmails.handler

events:

- sqs:

arn: !GetAtt InvoiceQueue.Arn

  

subscribeToSNS:

handler: subscribeToSNS.handler

events:

- sns:

arn: ${self:custom.snsTopicArn}

  

custom:

snsTopicArn: arn:aws:sns:us-east-1:123456789012:invoice-topic

```

  
  
  

##### Create Invoice event(function) (Handler file: `createInvoice.ts/` src\functions\invoice\index.ts & src\functions\invoice\invoice\addInvoice.ts)

  
  

```

import { SQS, SNS } from 'aws-sdk';

  

const sqs = new SQS();

const sns = new SNS();

  

export const addInvoiceHttp = async (logger: Logger, event: APIGatewayProxyEvent) => {

logger.Info({ message: `Adding Invoice` });

  

try {

// Process the invoice creation logic...

  

//@ts-ignore

const input: AddInvoiceInput = event.body;

const claims = event.requestContext?.authorizer ??

event.requestContext?.authorizer?.claims;

const invoice = await addInvoice(logger, input, claims);

  

processEmailAndSMS();

  

return apiResponse._200({ invoice });

} catch (err) {

logger.Error(err);

return sendErrorResponse(err, logger, 'Error when adding Invoice');

}

};

  

const processEmailAndSMS = async () => {

// Get recipient's(customer's) email, phone number from customer MF

const recipientEmail = 'nisalg@gmail.com';

const recipientPhoneNumber = '+94777426816';//change this to another no

// if doesn't work

// Get invoice details

const invoiceDetails = 'Invoice Amount: $100.00. Thank you.';

  

// Prepare the message to be sent to the SQS queue

const emailMessage = {

recipientEmail,

content: invoiceDetails

};

  

// Send the emailMessage to the SQS queue

await sqs.sendMessage({

QueueUrl:

'https://sqs.us-east-1.amazonaws.com/xxxxxxxxxxxx/crud1-email-queue', // change this to get from Parameter Store

MessageBody: JSON.stringify(emailMessage)

}).promise();

  

// Prepare smsMessage to be sent as an SMS

const smsMessage = {

phoneNumber: recipientPhoneNumber,

message: invoiceDetails

};

  

// Publish the message to the SNS topic for SMS notifications

await sns.publish({

TopicArn:

'arn:aws:sns:us-east-1:588032612315:crud-sns-topic-send-sms',

// change this to get from Parameter Store

Message: JSON.stringify(smsMessage)

}).promise();

}

```

  
  
  

##### SQS - sendMail() (Handler: `src\functions\common\sendEmails\handler.ts`)

  
  

```

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

Source: "Your Billing System <billing@yourdomain.com>",

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

```

  
  
  

##### SNS - subscribeToSMSNotification() (Handler: `src\functions\common\subscribeToSNS\handler.ts`)

  
  

```

import { SNS } from 'aws-sdk';

  

const sns = new SNS();

  

const phoneNumbers = ['+1234567890', '+0987654321', '+9876543210']; // get these from DB

  

export const subscribeToSMSNotifications: AWSLambda.Handler = async (event: AWSLambda.APIGatewayEvent) => {

try {

const subscriptionPromises = phoneNumbers.map(async

(phoneNumber) => {

// Subscribe to the SNS topic for SMS

notifications

const subscription = await sns.subscribe({

TopicArn: 'your-sns-topic-arn',

Protocol: 'sms',

Endpoint: phoneNumber

}).promise();

});

  

await Promise.all(subscriptionPromises);

  

return {

statusCode: 200,

body: 'Subscribed to SMS notifications successfully for

all phone numbers'

};

} catch (error) {

console.error('Error subscribing to SMS notifications:', error);

throw error;

}

};

```

  
  
  

### Stripe Integration

  
  

#### BE:

  
  
  

* Create Stripe Account

* Stripe API Keys

* [https://dashboard.stripe.com](https://dashboard.stripe.com) > Developers > API keys

*  **Publishable key:** This key is used on the client-side, typically in your frontend code, to communicate securely with Stripe. It starts with "pk_" and is safe to include in your frontend JavaScript code.

  

```

pk_test_9aJAd1SEISkblZBZ3EGa4n4m

```

  
  

* **Secret key: **This key is used on the server-side, typically in your backend code, to securely interact with Stripe's API. It starts with "sk_" and should be kept confidential. Never expose your secret key in client-side or public code.

  

```

sk_test_B33OOsnh2EWoSKOtN2Q03QvO

```

  
  

*  `$ npm install stripe --save`

* Add above Secret Key as `STRIPE_API_KEY `to Parameter Store

* Stripe function in src\functions\invoice\invoice\addInvoice.ts:

  

```

import Stripe from 'stripe';

  

const stripe = new Stripe(process.env.STRIPE_API_KEY, { apiVersion: '2022-11-15' });

  

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

  

// Return the client secret to FE for completing the payment

return paymentIntent.client_secret;

} catch (error) {

console.error("Error initiating payment:", error);

throw error;

}

};

```

  
  

* Call above Stripe function inside Handler src\functions\invoice\invoice\addInvoice.ts

  

```

export const addInvoiceHttp = async (

logger: Logger,

event: APIGatewayProxyEvent

) => {

logger.Info({ message: `Adding Invoice` });

  

try {

  

// Get recipient's(customer's) email, phone number from

customer MF

const customerEmail = "nisalg@gmail.com";

  

// Get invoice details

const invoiceData = { amount: 100.0 };

  

const clientSecret = await makeStripePayment(customerEmail,

invoiceData);

  

// Return the client secret to the frontend for completing the

payment

  

return apiResponse._200({ clientSecret });

} catch (err) {

logger.Error(err);

return sendErrorResponse(err, logger, "Error when adding Invoice");

}

};

  

```

  
  
  

#### FE: [Todo]

  
  

### Other

  
  
  

* UUID4

* Set of sample CloudFormation YAML template files for setting up AWS services

* CI/CD - sample Buildspec files

* Centralized CORS settings with Domain Restricted CORS Settings

* Schedule a Lambda to run as a CRON job with Serverless Framework

* In intended lambda function’s > src\functions\theLambda\index.ts

*  `events: [ schedule: cron(0 0 * * 0 *) ]`

* No need to do any changes in AWS Console. But you can check the schedule there.

* [Schedule Expressions for Rules - AWS Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html)

* There are some additional CRON restrictions like, you cannot add ‘*’ to both day and month. You should add ‘?’ to one of them.

*  **MongoDB Audit Log**

* MongoDB audit logs track and record database operations and events.

* They provide an audit trail for compliance and logging, security, and troubleshooting.

* Audit logs include authentication and authorization events, database operations, connection events, administrative actions, and server/database events.

* They help with user activity monitoring, security incident detection, compliance requirements, and performance troubleshooting, troubleshooting and debugging, data integrity, performance analysis.

* Enabling and configuring audit logs in MongoDB requires specific configurations and varies based on MongoDB version and deployment setup.

* CRUD project file:

* src\data\models\auditLog.model.ts

* src\data\mongoDB\models\auditLog.schema.model.ts

* src\data\mongoDB\index.ts

* src\data\mongoDb\auditLog.service.ts

* src\functions\invoice\invoice.service.ts

* ToDo later - Advanced:

* [Auditing](https://www.mongodb.com/docs/manual/core/auditing/) | [Configure Auditing in MongoDB Atlas](https://www.mongodb.com/docs/manual/tutorial/configure-auditing/)

* Add to SQS

  
  

## Common Errors and Solutions:

  
  
  

* “Cannot resolve variable at "functions.authenticateCognitoUser.environment.COGNITO_CLIENT_ID": Value not found at "cf" source”

* Fix: Upload CF template with proper name and parameter.

* This can also happen with a code error in like forgetting to add an index file for an EP etc.

* Cannot resolve variable at "functions.authenticateCognitoUser.environment.COGNITO_USER_POOL_ID": Value not found at "cf" source

* Create user Pool etc

* Function "cognitoAuthorizer" doesn't exist in this Service

* Fix: Add to src\functions\index.ts

* EntityMetadataNotFoundError2: No metadata for..

* Fix: Add to src\data\mySQL\data-source.ts > entities

* User pool us-east-1_xxxxxxxx does not exist.

* Create a user pool in Cognito and add it in the Parameter Store to read by the app.

* Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY match the account. Perhaps you are using a different account. Select correct AWS profile in VSCode

* Set > .aws > config > region

* List User Pools and check: `$ aws cognito-idp list-user-pools --region us-east-1 --max-results 10`

* Deploy the app: `$ npm run deploy`

* Still get the error

* Clear serverless cache

* Delete Application root > .serverless folder content

*  ~~Delete C:\Users\nisal\.serverless folder content ~~- not required

* This will update the Serverless Framework's cache of CloudFormation outputs: `$ sls deploy --force`

* Run again: `$ npm run deploy`

* AWS Systems Manager > Application Manager

* AppManager-CFN-cart-cognito-dev

* Deleted the stack with “us-east-1_xxxxxxxx” above

* Recreate `cart-cognito-dev` CF stack using the template

*  `$ npm run deploy`

*  `$ npm start`

*

* Error when deployed:

  

Error: V1 - Make sure the 'dev.us-east-1.api.aws-serverless-typescript-crud1.com'

  

exists. Unable to get Base Path Mappings: Invalid domain name identifier specified

  
  
  

* [https://github.com/amplify-education/serverless-domain-manager/issues/210](https://github.com/amplify-education/serverless-domain-manager/issues/210)

*  `$ sls create_domain`

*  `$ sls deploy -v`

* Disabled serverless-domain-manager setting in serverless.ts

* Cognito “User does not exist "UserNotFoundException"”

* Cognito “An account with the given email already exists”

* Mongoose error: Cannot populate path `user` because it is not in your schema. Set the `strictPopulate` option to false to override.

* Add correct document object key. E.g. ‘user’ is the related collection name. Main collection ‘cart’’s relationship id is ‘cartUser’
```
	Mongoose error: {
		"error": {
			   "code": 422,
			   "message": "Cannot populate path `items` because it is not in 
			   your schema. Set the `strictPopulate` option to false to 
			   override."
		}
	}
```
  

* Add correct document object key. E.g. “itemId” and not the related collection’s name “Item”

* Errors in compiling serverless.ts file

* Add wrapping quotations to strings like ARNs
```
	Mongoose error: {
		"error": {
			"code": 422,
			"message": "Schema hasn't been registered for model \"Item\".\nUse mongoose.model(name, schema)"
		}
	}
```
* Cannot resolve variable at "functions.authenticateCognitoUser.environment.COGNITO_USER_POOL_ID": Value not found at "cf" source

* The error specifically mentions that the value was not found at the "cf" source

* Here are a few possible reasons for this error:

* Missing or incorrect CloudFormation variable: Check if the variable `COGNITO_USER_POOL_ID `is defined correctly in your CloudFormation template. It should be defined as a parameter or an output in the template.

* Variable referencing issue: Ensure that you are referencing the variable `COGNITO_USER_POOL_ID `correctly in your Serverless Framework configuration. Double-check the path to the variable and make sure it matches the structure of your CloudFormation template.

* Build or deploy order: If you are deploying multiple CloudFormation stacks or resources, ensure that the stack containing the `COGNITO_USER_POOL_ID `variable is deployed before the stack that references it. Dependencies between stacks can cause issues if they are not deployed in the correct order.

* Check variables like userpool in src\aws\cart-cognito-dev.yml

* Check if you have created the stack using src\aws\cart-cognito-dev.yml and also Cognito UserPool and UserPoolClient created and names are correct

* Check if cart-cognito-dev values are not read because environment is not ‘dev’

* It should since we add this to package.json > scripts: serverless offline start --allowCache --aws-profile default --stage dev

* Check variables names in Join etc in src\aws\cart-cognito-dev.yml

* Create a basic stack using: src\aws\basic-sample-cognito-cfn-template.yml and check

* The CloudFormation template is invalid: Template error: instance of Fn::GetAtt references undefined resource XXXXX

* Check variables and imports in serverless.yml

* Cognito error In Postman: `"Token use not allowed: access. Expected: id"`

* If you use `accessToken`, will get this error, use the `idToken`as the `Bearer token`.

* Package oriented errors (Like “Cannot find module XXXXX”) that is hard to identify & resolve:

* If comes when testing: Clear Jest cache: `$ npx jest --clearCache`

* Remove existing `node_modules` folder:

* Ubuntu`: $ rm -rf node_modules`

* Windows VSCode/Powershell`: $ Remove-Item -Path "example-folder" -Recurse -Force`

* Windows CMD line`: $ rd /s /q node_modules`

* Reinstall all packages & dependencies afresh: `$ npm i`

* Testing error "Connection is not established with MySQL database"

* Occurring because the test is not properly mocking the database connection or the relevant database functions. To resolve this issue, you need to ensure that the necessary functions and objects related to the database connection are properly mocked in your test case.

  
  

# Still working on:

  
  
  

* Push Notifications with Websockets & AWS SNS

* Sentry Integration for Error Logging

* React FE