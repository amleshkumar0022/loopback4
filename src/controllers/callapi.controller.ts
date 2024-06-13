// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {OrderDetails, Smallcaseapiservice, TransactionDetails} from '../services';
import {intercept} from '@loopback/core';
import jwt from "jsonwebtoken"
import {HttpErrors, RawBodyParser, Request, ResponseObject, RestBindings, get, param, post, requestBody, response} from '@loopback/rest'
import {Null, repository} from '@loopback/repository';
import {RequestInfoRepository} from '../repositories/request-info.repository';
import {IncomingReqRes, RequestInfo} from '../models';
import * as https from 'https';
import {URL} from 'url';
import {authenticate} from '@loopback/authentication';
import {TransactionapiDataSource} from '../datasources';
import moment from 'moment'
import {LoggingBindings, WinstonLogger, logInvocation} from '@loopback/logging';
import {IncomingReqResRepository} from '../repositories';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';

const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};
const GatewayName = "plan360degree";
const secrett = "plan360degree_b769953d42804f03874ad9339a4a496f";
const API_secret = "plan360degree_fdc1222d6a90457287aa43cfa9c0c03a";

// Generate auth ID and JWT token
const authId = uuidv4();
console.log("Auth ID:", authId);

function createAuthToken(id: any) {
  const secret = secrett;
  const expiresIn = "1d";
  if (id) {
    return jwt.sign({
      smallcaseAuthId: authId,
    }, secret, {expiresIn});
  }
  return jwt.sign({
    guest: true,
  }, secret, {expiresIn});
}
const jwwt = createAuthToken(null);
console.log("JWT:", jwwt);
console.log("API Secret:", API_secret);

// Configure Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://gatewayapi.smallcase.com',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    'x-gateway-secret': API_secret,
    'x-gateway-authtoken': jwwt.toString(),
  },
});
const baseURL1 = 'https://gatewayapi.smallcase.com';
const headers1 = {
  accept: 'application/json',
  'content-type': 'application/json',
  'x-gateway-secret': API_secret,
  'x-gateway-authtoken': jwwt.toString(),
};
export class CallapiController {
  [x: string]: any;
  constructor(
    // @inject(RestBindings.Http.RESPONSE) private response: Response,
    @inject('services.Smallcaseapiservice')
    protected smallcaseService: Smallcaseapiservice,
    // @inject('services.jwt.service') public jwtservice: JWTservice,
    @inject('services.OrderDetails')
    protected OrderService: OrderDetails,
    @inject('services.TransactionDetails')
    protected TransactionService: TransactionDetails,

    // @inject(LoggingBindings.WINSTON_LOGGER)
    // private logger: WinstonLogger,

    @repository(RequestInfoRepository) public requestInfoRepo: RequestInfoRepository,
    @repository(IncomingReqResRepository) public incomingReqresRepo: IncomingReqResRepository
  ) { }
  // @post('genToken')
  // async credential(){
  //   // const token=await this.jwtservice.generateToken('Spring@123')
  //   // return token
  // }



  @post('/webhook')
  async handleWebhook(
    @requestBody({
      description: 'The webhook payload',
      required: true,
      content: {
        'application/json': {
          schema: {type: 'object'},
        },
      },
    })
    payload: object,
  ): Promise<string> {
    console.log('Webhook received:', payload);

    // You can add your business logic here to handle the webhook event

    return 'Webhook received';
  }

  @get(`/transactionDetails`)
  // @logInvocation()
  async getDetails(
    @param.query.string("transactionId") transactionId: string
  ): Promise<any> {
    try {
      const tDetails = await this.TransactionService.fetchTransactionDetails(transactionId)
      console.log('transaction details: ' + JSON.stringify(tDetails));
      return {
        statusCode: 200,
        desc: 'success',
        data: tDetails
      }
    }
    catch (error) {
      console.log('error:' + error)
      return {
        statuscode: 502,
        desc: 'error'
      }
    }
  }


  @get(`OrderDetails`)
  async myOrderDetails(
    @param.query.string("transactionId") transationId: string
  ): Promise<any> {
    try {
      const details = await this.OrderService.getOrderDetails(transationId)
      console.log("orderDetails: " + JSON.stringify(details))
      return {
        statusCode: 200,
        desc: 'success',
        data: details
      }
    }

    catch (error) {
      console.error('Error fetching data:', error);
    }
    return {
      statusCode: 501
    }
  }

  @post('Createtransactions')
  async bulkTrnsaction(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                investor: {type: 'string'},
                investorId: {type: 'number'},
                ticker: {type: 'string'},
                quantity: {type: 'number'},
                type: {type: 'string'},
              },
              required: ['ticker', 'quantity', 'type'],
            },
          },
        },
      },
    })
    securities: Array<{ticker: string; quantity: number; type: string}>
  ): Promise<any> {
    if (securities.length < 2) {
      return {
        statuscode: 401,
        message: 'Bad request : more than one security transaction required'

      }

    }
    try {
      const ans = await this.smallcaseService.fetchData();
      return {
        statuscode: 200,
        message: 'success',
        data: ans
      }

    }
    catch (error) {
      console.log("error in this" + error)
      return {
        statuscode: 505,
        message: 'bakchodi'
      }
    }

  }

  @get('Authtoken')
  async genJwtToken(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {

              authId: {type: 'string'},

            },
            required: ['authId'],
          },
        },
      },
    })
    @inject(RestBindings.Http.REQUEST) request: Request,


  ): Promise<any> {
    const authid = request.body.authId;
    console.log("reached")

    const secret = "plan360degree_b769953d42804f03874ad9339a4a496f";
    const expiresIn = "1d";
    console.log("initiating function")
    if (authid) {
      return jwt.sign({
        smallcaseAuthId: authid,
      }, secret, {expiresIn});

    }
    return jwt.sign({
      guest: true,
    }, secret, {expiresIn});


  }



  @post(`InitiateTransaction`)
  @response(200, PING_RESPONSE)

  async getData(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              investor_name: {type: 'string'},
              investor_id: {type: 'number'},
              securities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    ticker: {type: 'string'},
                    quantity: {type: 'number'},
                    type: {type: 'string'},
                  },
                  required: ['ticker', 'quantity', 'type'],
                },
              },
            },
            required: ['investor_name', 'investor_id', 'securities'],
          },
        },
      },
    })
    securities: {
      investor_name: string;
      investor_id: number;
      securities: Array<{ticker: string; quantity: number; type: string}>;
    },

    // @param.query.string('ticker') ticker: string,
    // @param.query.string('quantity') quantity: number,
    // @param.query.string('type') type: string,
    @inject(RestBindings.Http.REQUEST) request: Request,



  ): Promise<object> {

    try {
      // console.log("trying ticker is  "+  ticker + " quantity is  "+quantity + "   type is "+type)

      const sm_req_time = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      console.log("smallcase_re_time:" + sm_req_time);

      const response = await this.smallcaseService.fetchData();
      const response1 = await axiosInstance.post(`/gateway/${GatewayName}/transaction`, {
        intent: "TRANSACTION",
        orderConfig: {
          type: "SECURITIES",
          securities: [
            {
              ticker: 'TCS',
              quantity: 3,
              type: 'BUY'
            }
          ]
        }
      })
      //console.log(response1);
      console.log(response1);
      const resss_time = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      console.log(resss_time)
      console.log("aaabbacc" + JSON.stringify(this.smallcaseService.requestInterceptor()));

      // await this.smallcaseService.requestInterceptor()



      // console.log("time added to response")
      // console.log("timestapm for respone " + response.data["timestamp"])

      const timestamp_res = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      response.data["timestamp"] = timestamp_res
      console.log("RequestBody " + JSON.stringify(request.body));
      console.log("full structure " + JSON.stringify(response.data))
      //console.log("statuscode"+response['errors']);


      console.log("Response body " + JSON.stringify(response));


      // console.log("transactioid:"+response.data["transactionId"])
      const sml_req_time = sm_req_time;
      const x_sp_req_id = String(request.headers["x-sp-request-id"]);
      const req_http_method = String(request.method);
      const req_timestamp: any = String(request.headers["timestamp"])
      // const req_timestamp=new Date(req_timestampp)
      const req_url = request.url
      console.log("url: " + req_url)
      const req_api_name = "Initiate Transaction"
      const req_source_partner = "Safehands Fintech"
      const req_source_IP = request.ip
      console.log(request.ip)
      const req_headers = JSON.stringify(request.headers)
      const req_body = request.body
      const resonse_id = uuidv4();
      const transactionId = JSON.stringify(response.data["transactionId"]);
      const res_headers = {"headers": JSON.stringify(response.headers)}
      console.log("only response  " + JSON.stringify(response))//set and fetch res_headers
      const res_body = response.data
      const res_http_statuscode = String(response.statusCode)
      const res_timestamp = response.data["timestamp"]
      const res_status_text = "sucess"
      const res_error_stacktrace = "stacktrace"
      const source_customer_id = req_body.investor_id;

      console.log("headers  " + response.headers);
      // const response_headers=String(response.headers)
      // console.log("response headers"+ response.getHeader)
      //console.log("response_statuscode"+response.status)



      // console.log("requestId: " + requestId);
      // console.log("time: " + request_time);
      // console.log(request_body);
      // console.log(response_body);
      // console.log(response_time)
      // const body=request.body;
      const combineData = {x_sp_req_id, req_http_method, req_timestamp, req_url, req_api_name, req_source_partner, req_source_IP, req_headers, req_body, resonse_id, transactionId, res_headers, res_body, res_http_statuscode, res_timestamp, res_status_text, res_error_stacktrace, source_customer_id};
      console.log("done")

      const newData = new IncomingReqRes(combineData);

      const save = await this.incomingReqresRepo.create(newData);
      console.log("data added")




      return {

        statusCode: 200,
        description: "success",
        data: response,

      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        statusCode: 500,
        description: 'internal server error',
        error: 'internal server error',

      };
    }
  }

  @get('fetchTransactionId')
  async fetchTransactionId(
    @param.query.number('customerId') customerId: number,
  ): Promise<any> {
    const transactions = await this.incomingReqresRepo.find({
      where: {source_customer_id: customerId},
      fields: {transactionId: true}
    });
    //console.log(customerId);
    //console.log(transactions);
    return transactions;
  }
  
}

