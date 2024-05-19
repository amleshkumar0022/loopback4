// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/core';
import { Smallcaseapiservice } from '../services';
import {intercept} from '@loopback/core';
import { HttpErrors, RawBodyParser, Request, ResponseObject, RestBindings, get, param, post, requestBody, response } from '@loopback/rest'
import { repository } from '@loopback/repository';
import { RequestInfoRepository } from '../repositories/request-info.repository';
import { RequestInfo } from '../models';
// import { JWTservice } from '../services/jwt.service';
import { authenticate } from '@loopback/authentication';
import { TransactionapiDataSource } from '../datasources';



export class CallapiController {
  constructor(

    @inject('services.Smallcaseapiservice')
    protected smallcaseService: Smallcaseapiservice,
    // @inject('services.jwt.service') public jwtservice: JWTservice,
    
    @repository(RequestInfoRepository) public requestInfoRepo: RequestInfoRepository
  ) { }
  // @post('genToken')
  // async credential(){
  //   // const token=await this.jwtservice.generateToken('Spring@123')
  //   // return token
  // }
 
  @post(`transaction`)


  async getData(

    @requestBody({
      content: {
        'application/json': {
          schema: {
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
    })
    // @param.query.string('ticker') ticker: string,
    // @param.query.string('quantity') quantity: number,
    // @param.query.string('type') type: string,
    @inject(RestBindings.Http.REQUEST) request: Request,

    
   
  ): Promise<object> {
    
    try {
      // console.log("trying ticker is  "+  ticker + " quantity is  "+quantity + "   type is "+type)
      
      const response = await this.smallcaseService.fetchData();
      console.log("got data   response is   "+JSON.stringify(response))
      console.log(response.timestamp)
      console.log("RequestBody "+JSON.stringify(request.body));
      
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

