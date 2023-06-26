import * as ItemService from '../../src/functions/item/item.service';
import { Logger } from '../../src/common/logger';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { main } from '../../src/functions/item/items/handler';

describe('[ItemById]', function () {
  it('dummy pass', async () => {
    
  });

  // it('deleteItemById > handles valid request', async () => {
  //   const validItemId = {
  //     itemId: 'test-item-id',
  //   };
  //   jest.spyOn(ItemService, 'deleteItemService').mockReturnValueOnce(Promise.resolve(validItemId));

  //   const event: APIGatewayProxyEvent = {
  //     httpMethod: 'DELETE',
  //     pathParameters: {
  //       itemId: 'test-item-id',
  //     },
  //     requestContext: {
  //       authorizer: {
  //         claims: {
  //           'custom:role': 'ADMIN',
  //           email: 'nisal@lasantha.net',
  //         },
  //       },
  //     },
  //   } as any;

  //   const context: Context = {
  //     awsRequestId: 'test',
  //   } as any;

  //   const result = await main(event, context);

  //   // console.log('result:', result);
  //   expect(result.statusCode).toEqual(200);
  //   expect(result.body.data).not.toBeNull();
  //   // console.log('JSON result:', JSON.parse(result.body.data.deleteItem.itemId));
  //   // expect(JSON.parse(result.body).data.item).toEqual(validItemId);
  // });

  // it('deleteItemById > handles itemId null', async () => {
  //   const validItemId = {
  //     itemId: 'test-item-id',
  //   };
  //   jest.spyOn(ItemService, 'deleteItemService').mockReturnValueOnce(Promise.resolve(validItemId));

  //   const event: APIGatewayProxyEvent = {
  //     httpMethod: 'DELETE',
  //     pathParameters: {},
  //     requestContext: {
  //       authorizer: {
  //         claims: {
  //           'custom:role': 'ADMIN',
  //           email: 'nisal@lasantha.net',
  //         },
  //       },
  //     },
  //   } as any;

  //   const context: Context = {
  //     awsRequestId: 'test',
  //   } as any;

  //   const result = await main(event, context);

  //   console.log('result:', result);

  //   expect(result.statusCode).toEqual(500);
  //   // expect(result.body.data).not.toBeNull();
  //   // expect(JSON.parse(result.body).message).toEqual('itemId query param not present in the request');
  // });

  // it('getItemById', async () => {
  //   console.log('verifies successful response when get Item for CRM');

  //   const validItemId = {
  //     itemId: '04a2c0f4-214b-4023-ab8a-2b02c938c0ca',
  //   };
  //   jest.spyOn(ItemService, 'getItemByIdService').mockReturnValueOnce(Promise.resolve(validItemId));

  //   const event: APIGatewayProxyEvent = {
  //     httpMethod: 'GET',
  //     pathParameters: {
  //       itemId: '04a2c0f4-214b-4023-ab8a-2b02c938c0ca',
  //     },
  //     requestContext: {
  //       authorizer: {
  //         claims: {
  //           'custom:role': 'ADMIN',
  //           email: 'nisal@lasantha.net',
  //         },
  //       },
  //     },
  //   } as any;

  //   const context: Context = {
  //     awsRequestId: 'test-aws-request-id',
  //   } as any;

  //   const result = await main(event, context);

  //   expect(result).toBeDefined();
  //   expect(result.statusCode).toEqual(200);
  //   expect(result.body.data).not.toBeNull();
  // });
});