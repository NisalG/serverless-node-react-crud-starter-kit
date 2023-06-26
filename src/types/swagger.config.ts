export const autoswagger = {
  // basePath: '${param:basePath}',
  apiKeyHeaders: ['Authorization'],
  typefiles: [ //Array of strings which defines where to find the typescript types to use for the request and response bodies
    './src/types/commonTypes.ts',
    './src/functions/item/item.model.ts',
    './src/functions/invoice/invoice.model.ts',
    './src/functions/cartUser/cartUser.model.ts',
    './src/functions/cartAuth/cartAuth.model.ts',
  ],
  apiType: 'http',
};