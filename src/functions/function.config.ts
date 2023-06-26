export const corsSettings = {
  headers: [
    // Specify allowed headers
    'Content-Type',
    'Authorization',
    'X-Api-Key',
    'X-Amz-Security-Token',
    'X-Amz-User-Agent',
    'Access-Control-Request-Method',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
    'X-SKIP-SPINNER-INTERCEPTOR',
    'X-LOCATION',
    'X-DOC-WALLET-API',
    'X-SIGN-UP-API',
  ],
  origin: '*',
  maxAge: 86400,
};

export const getDomainRestrictedCorsSettings = () => {
  const SHOPPING_CART_BASE_URL = process.env.SHOPPING_CART_BASE_URL;

  const acceptedDomains = [SHOPPING_CART_BASE_URL];

  const ENV = process.env.STAGE;

  if (ENV === 'dev') acceptedDomains.push('http://localhost:4200/');
  return { headers: corsSettings.headers, origins: acceptedDomains, maxAge: corsSettings.maxAge };
};

// export const corsSettings = true
