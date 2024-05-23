// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/core';
import { OrderDetails, Smallcaseapiservice, TransactionDetails } from '../services';
import { intercept } from '@loopback/core';
import { HttpErrors, RawBodyParser, Request, ResponseObject, RestBindings, get, param, post, requestBody, response } from '@loopback/rest'
import { repository } from '@loopback/repository';
import { RequestInfoRepository } from '../repositories/request-info.repository';
import { RequestInfo } from '../models';
// import { JWTservice } from '../services/jwt.service';
import { authenticate } from '@loopback/authentication';
import { TransactionapiDataSource } from '../datasources';
import moment from 'moment'
import { LoggingBindings, WinstonLogger, logInvocation } from '@loopback/logging';



export class CallapiController {
  constructor(

    @inject('services.Smallcaseapiservice')
    protected smallcaseService: Smallcaseapiservice,
    // @inject('services.jwt.service') public jwtservice: JWTservice,
    @inject('services.OrderDetails')
    protected OrderService: OrderDetails,
    @inject('services.TransactionDetails')
    protected TransactionService: TransactionDetails,
    // @inject(LoggingBindings.WINSTON_LOGGER)
    // private logger: WinstonLogger,

    @repository(RequestInfoRepository) public requestInfoRepo: RequestInfoRepository
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
          schema: { type: 'object' },
        },
      },
    })
    payload: object,
  ): Promise<string> {
    console.log('Webhook received:', payload);

    // You can add your business logic here to handle the webhook event

    return 'Webhook received';
  }

  @get(`transactionDetails`)
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

  @post(`transaction`)


  async getData(

    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ticker: { type: 'string' },
              quantity: { type: 'number' },
              type: { type: 'string' },
            },
            required: ['ticker', 'quantity', 'type'],
          },
        },
      },
    })
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
      const resss_time = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      console.log(resss_time)

      // await this.smallcaseService.requestInterceptor()



      // console.log("time added to response")
      // console.log("timestapm for respone " + response.data["timestamp"])

      const timestamp_res = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      response.data["timestamp"] = timestamp_res
      console.log("RequestBody " + JSON.stringify(request.body));


      console.log("Response body " + JSON.stringify(response));


      // console.log("transactioid:"+response.data["transactionId"])
      const sml_req_time = sm_req_time;
      const requestId = String(request.headers["x-sp-request-id"]);
      const request_time = String(request.headers["timestamp"]);
      const transactionId = JSON.stringify(response.data["transactionId"]);
      const request_body = JSON.stringify(request.body)
      const response_body = JSON.stringify(response)
      const sml_res_time = resss_time;
      const response_time = String(response.data["timestamp"])



      // console.log("requestId: " + requestId);
      // console.log("time: " + request_time);
      // console.log(request_body);
      // console.log(response_body);
      // console.log(response_time)
      // const body=request.body;
      const combineData = { requestId, request_time, sml_req_time, transactionId, request_body, response_body, sml_res_time, response_time };
      console.log("done")

      const newData = new RequestInfo(combineData);

      const save = await this.requestInfoRepo.create(newData);
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
}

