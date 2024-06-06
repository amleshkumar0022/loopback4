import { MiddlewareSequence, Request, RequestContext, Response, ResponseObject, response } from '@loopback/rest';
import { time } from 'console';
import moment from 'moment'
import { request } from 'http';
import { v4 as uuidv4 } from 'uuid';
import crypto, { verify } from 'crypto';
import jwt from 'jsonwebtoken';
import {
  AuthenticateFn,
  AuthenticationBindings,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import { inject } from '@loopback/core';
import { Null } from '@loopback/repository';
import { resolve } from 'path';
// import { JWTservice } from './services/jwt.service';






// Function to generate a secure random key
// function generateSecretKey(): string {
//   // Generate a random buffer
//   const buffer = crypto.randomBytes(32); // You can adjust the byte length based on your security needs

//   // Convert the buffer to a hexadecimal string
//   const secretKey = buffer.toString('hex');

//   return secretKey;
// }
// const secretKey=generateSecretKey();


const name = 'SpringMoney@123'
const secrett = 'anceeef342';

// Function to create an authentication token given an ID
function createAuthToken(username: string): string {
  // Define your secret key for signing the token
  const secret = secrett;

  // Define token payload
  const payload = {
    name: name
    // You can add more data to the payload if needed
  };

  // Define token expiration (optional)
  const expiresIn = '1d'; // Token will expire in 1 day

  // Generate and return the token
  return jwt.sign(payload, secret, { expiresIn });
}
const auth_token = createAuthToken(name);
console.log("auth_token: " + auth_token);



export class MySequence extends MiddlewareSequence {

  async handle(context: RequestContext) {
    
    try {


      // Check if the request path matches the route that requires authentication
      if (context.request.path === '/transaction') {
        // Call the authentication middleware only for the protected route
        await this.Authentication(context);
      }
      // Add your logging middleware logic here
      //   console.log("headers: "+JSON.stringify(context.request.headers))
      console.log("body: " + JSON.stringify(context.request.body))
      //   console.log(`[${new Date().toISOString()}] ${context.request.method} ${context.request.path}`);
      //calling my wrapReq middleware


      await this.wrapReq(context)


      await this.wrapAPIreq(context);
      await this.addIp(context);
      await this.wrapResponse(context);  

      // Call the super method to continue the sequence
      const result = await super.handle(context);

      // Optionally, you can log the response status code
      //   console.log(`[${new Date().toISOString()}] Response status code: ${context.response.statusCode}`);

      return result;
    } catch (err) {
      // Handle errors
      console.error(`[${new Date().toISOString()}] Error occurred: ${err.message}`);
      throw err;
    }
  }

  async Authentication(context: RequestContext) {
    const request = context.request;

    let authToken = request.headers['authentication'];

    // if (!authToken) {
    //   // throw new Error('Unauthorized: Authentication token is missing');/
      
    // }
    // if (Array.isArray(authToken)) {
    //   authToken = authToken[0];
    // }

    // try {
    //   // Verify and decode the token
    //   const decoded = jwt.verify(authToken, secrett);

    //   // Attach the decoded payload to the context object for further use
    //   context.bind('user').to(decoded);
    //   console.log('Authentication successful:', decoded);

    // } catch (error) {
    //   // Handle token verification errors
    //   throw new Error(`statusCode: 401 Unauthorized: invalid or expired authentication token`)
    // }

    if (Array.isArray(authToken)) {
      // Assuming you want to use the first element of the array
      authToken = authToken[0];
    }
    
    if(authToken){
      try{
        const decoded=jwt.verify(authToken,secrett);
        context.bind('user').to(decoded);
        console.log('Authentication successful:',decoded)
      }
      catch(error){
      
        context.response.status(401)
        context.response.send({
          
          statuscode:401,
          message:'Unauthorized: Invalid or expired authentication token'
        })
      }
    }
    if(!authToken){
      context.response.statusCode=401
      context.response.send({
        statusode:401,
        message:'Authentication token is missing'
      })
    }

  }



  async wrapReq(context: RequestContext) {
    const request_id = uuidv4();
    context.request.headers['x-sp-request-id'] = request_id
    
    const timestamp  = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    
    context.request.headers['timestamp'] =timestamp;


    // const jwt=createAuthToken(payload);
    // context.request.headers['authToken']=jwt
    // const tickerrr=context.request.query["ticker"];
    // context.request.body["ticker"]=tickerrr;


    console.log(`Meathod "${context.request.method}" URL: "${context.request.url}" headers: "${JSON.stringify(context.request.headers)}"`)
    // console.log(context.response.json)
    // console.log(context.request)

    // console.log("headers updated:"+JSON.stringify(context.request.headers))
    // console.log("body: "+JSON.parse(JSON.stringify(context.request.body)))
  }

  async addIp(context:RequestContext){
    const IP_adress=context.request.ip
    console.log("ip address: "+IP_adress)
    context.request.headers['IP_adress']=IP_adress;
  }

  async wrapResponse(context:RequestContext){
    context.response.setHeader('responseId',(String(uuidv4())))
    console.log("header is added"+context.response.getHeader("responseId"))
    console.log(context.response.statusCode)
    // console.log(JSON.stringify(context.response))
    console.log("header object "+JSON.stringify(context.response.getHeaders()))
    console.log(context.response.statusCode)
  }



  // async Authentication(context:RequestContext){
  //   const authheader=context.request.headers['authToken'];


  // }

  async wrapAPIreq(context: RequestContext) {
    console.log("almost there");
    const request = context.request as Request;

    if (request.url.startsWith('https://gatewayapi.smallcase.com')) {
      console.log("Request to third-party API: ", request.headers);
      // Perform actions specific to requests to the third-party API
    }
  }
}
