
import { Logger } from '../../src/common/logger';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { BadRequestError, UnAuthorizedError } from '../../src/common/ErrorTypes';
import * as db from '../../src/data/mySQL';
import { Repository } from 'typeorm';
import * as ItemService from '../../src/functions/item/item.service';
import { main } from '../../src/functions/item/item/handler';
import { addItemHttp } from '../../src/functions/item/item/addItem';
import { AddItemInput } from '../../src/functions/item/item.model';

describe('[Add Item - HTTP]', function () {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('handles valid request', async () => {
    const logger = new Logger('test-logger');
    jest.spyOn(logger, 'Info');
    jest.spyOn(logger, 'Warning');

    const addItemInput: AddItemInput ={
        "description": "des4",
        "name": "name4",
        "price": 10
    }
    const event: APIGatewayProxyEvent = {
      httpMethod: 'POST',
      body: {
        addItemInput
      }
    } as any;

    const context: Context = {
      awsRequestId: 'test',
    } as any;

    // const claims = {
    //   'custom:role': 'USER',
    // };

    const addItemOutput = {

    }

    jest.spyOn(db, 'MySQLDbCon').mockReturnValueOnce(Promise.resolve());
    jest.spyOn(ItemService, 'addItem').mockReturnValueOnce(Promise.resolve(addItemInput));
  
    const result = await main(event, context);
    console.log('result: ', result);

    expect(result.statusCode).toEqual(200);
    // expect(logger.Info).toHaveBeenCalledWith({ message: "Adding Item" });
    expect(logger.Warning).toBeCalledTimes(0);

    console.log('JSON.parse(result.body).data.item: ', JSON.parse(result.body).data.item);
    // expect(result).toEqual(addItemOutput);
    // expect(result).toBe(addItemOutput);
    expect(JSON.parse(result.body).data.item).toStrictEqual(addItemInput);
  });
});
