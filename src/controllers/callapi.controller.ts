// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/core';
import { Smallcaseapiservice } from '../services';
import {intercept} from '@loopback/core';
import { RawBodyParser, Request, ResponseObject, RestBindings, get, param, requestBody, response } from '@loopback/rest'
import { repository } from '@loopback/repository';
import { RequestInfoRepository } from '../repositories/request-info.repository';
import { RequestInfo } from '../models';


export class CallapiController {
  constructor(
    @inject('services.Smallcaseapiservice')
    protected smallcaseService: Smallcaseapiservice,
    @repository(RequestInfoRepository) private requestInfoRepo: RequestInfoRepository
  ) { }
  @get(`callsmallcaseapi/{ticker}/{quantity}/{type}`)
  async getData(
    @param.path.string('ticker') ticker: string,
    @param.path.string('quantity') quantity: number,
    @param.path.string('type') type: string,
    @inject(RestBindings.Http.REQUEST) request: Request,
   
  ): Promise<object> {
    try {
      // console.log("trying ticker is  "+  ticker + " quantity is  "+quantity + "   type is "+type)
      const response = await this.smallcaseService.fetchData(ticker,quantity,type,request.headers["x-sp-request-id"] as string);
      console.log("got data   response is   "+JSON.stringify(response))
      // console.log("Response body " + JSON.stringify(response));
      
      // console.log("transactioid:"+response.data["transactionId"])
      const requestId=String(request.headers["x-sp-request-id"]);
      const timestamp=String(request.headers["timestamp"]);
      const transactionId=JSON.stringify(response.data["transactionId"]);
      const expireAt=response.data["expireAt"];
      
      console.log("requestId: "+requestId);
      console.log("time: "+timestamp);
      // const body=request.body;
      const combineData={requestId,timestamp,transactionId,expireAt};
      console.log("done")
      
      const newData=new RequestInfo(combineData);
      
      const save =await this.requestInfoRepo.create(newData);
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
        description: "internal server error",
        error: 'Internal Server Error',

      };
    }
  }
}

