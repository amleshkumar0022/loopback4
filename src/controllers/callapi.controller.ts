// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/core';
import { Smallcaseapiservice } from '../services';
import {intercept} from '@loopback/core';
import { Request, ResponseObject, RestBindings, get, param, response } from '@loopback/rest'


export class CallapiController {
  constructor(
    @inject('services.Smallcaseapiservice')
    protected smallcaseService: Smallcaseapiservice,
  ) { }
  @get(`callsmallcaseapi/{ticker}/{quantity}/{type}`)
  async getData(
    @param.path.string('ticker') ticker: string,
    @param.path.string('quantity') quantity: number,
    @param.path.string('type') type: string,
    @inject(RestBindings.Http.REQUEST) request: Request,
  ): Promise<object> {
    try {
      console.log("trying ticker is  "+  ticker + " quantity is  "+quantity + "   type is "+type)
      const response = await this.smallcaseService.fetchData(ticker,quantity,type);
      console.log("got data   response is   "+JSON.stringify(response))
      console.log("Response body " + JSON.stringify(response))
      // console.log("transactioid:"+response.data["transactionId"])


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

