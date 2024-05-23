import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
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
  name: 'sst_order_details',
  connector: 'rest',
  baseURL: 'https://gatewayapi.smallcase.com',
  crud: false,
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-gateway-secret': API_secret,
      'x-gateway-authtoken': jwwt.toString(),
    },
  },
  operations:[
    {
      template:
    {
      method:'GET',
      url:`https://gatewayapi.smallcase.com/v1/plan360degree/engine/orders/sst?transactionId=${'{transactionId}'}`,
      

    },
    functions :{
      getOrderDetails:["transactionId"]
    }
    }
  ]
  
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class SstOrderDetailsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'sst_order_details';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.sst_order_details', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
