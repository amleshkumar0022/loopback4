import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const url = 'https://gatewayapi.smallcase.com/gateway';
const GatewayName = "plan360degree";
const secrett = "plan360degree_b769953d42804f03874ad9339a4a496f";
const API_secret = "plan360degree_fdc1222d6a90457287aa43cfa9c0c03a";

const authId = uuidv4();
console.log("Auth ID:", authId);

function createAuthToken(id: any) {
  const secret = secrett;
  const expiresIn = "1d";
  if (id) {
    return jwt.sign({
      smallcaseAuthId: authId,
    }, secret, { expiresIn });
  }
  return jwt.sign({
    guest: true,
  }, secret, { expiresIn });
}
const jwwt = createAuthToken(null);
console.log("JWT:", jwwt);
console.log("API Secret:", API_secret);

const config = {
  name: 'transactionapi',
  connector: 'rest',
  baseURL: 'https://gatewayapi.smallcase.com',
  crud: true,
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-gateway-secret': API_secret,
      'x-gateway-authtoken': jwwt.toString(),
    },
  },
  operations: [
    {
      template: {
        method: 'POST',
        url: `https://gatewayapi.smallcase.com/gateway/${GatewayName}/transaction`,
        body: {
          "intent": "TRANSACTION",
          "orderConfig": {
            "type": "SECURITIES",
            "securities": [
              {
                "ticker": "{ticker}",
                "quantity": "{quantity}",
                "type": "{type}"
              }
            ]
          }
        }
      },
      functions: {
        fetchData: ["ticker", "quantity", "type"]
      },
      requestInterceptor: (request: any, context: any) => {
        console.log("Inside Request Interceptor");
        console.log("Request:", JSON.stringify(request, null, 2));
        return request;
      },
      responseInterceptor: (response: any, context: any) => {
        console.log("Inside Response Interceptor");
        console.log("Response:", JSON.stringify(response, null, 2));
        return response;
      },
    },
  ],
};

@lifeCycleObserver('datasource')
export class TransactionapiDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'transactionapi';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.transactionapi', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}