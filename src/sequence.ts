import {MiddlewareSequence, Request, RequestContext, Response} from '@loopback/rest';
import { time } from 'console';
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






// Function to generate a secure random key
function generateSecretKey(): string {
  // Generate a random buffer
  const buffer = crypto.randomBytes(32); // You can adjust the byte length based on your security needs

  // Convert the buffer to a hexadecimal string
  const secretKey = buffer.toString('hex');

  return secretKey;
}
const secretKey=generateSecretKey();


const payload='SpringMoney@123'
// Function to create an authentication token given an ID
function createAuthToken(username: string): string {
  // Define your secret key for signing the token
  const secret = secretKey;

  // Define token payload
  const payload = {
    
    // You can add more data to the payload if needed
  };

  // Define token expiration (optional)
  const expiresIn = '1d'; // Token will expire in 1 day

  // Generate and return the token
  return jwt.sign(payload, secret, { expiresIn });
}



export class MySequence extends MiddlewareSequence {
  
  async handle(context: RequestContext) {
    try {
      // Add your logging middleware logic here
    //   console.log("headers: "+JSON.stringify(context.request.headers))
      console.log("body: "+JSON.stringify(context.request.body))
    //   console.log(`[${new Date().toISOString()}] ${context.request.method} ${context.request.path}`);
      //calling my wrapReq middleware
      await this.wrapReq(context);

      await this.wrapAPIreq(context);
      
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



  async wrapReq(context:RequestContext){
    const request_id=uuidv4();
    context.request.headers['x-sp-request-id']=request_id
    const timestamp=new Date().toLocaleString();
    context.request.headers['timestamp']=timestamp;
    const jwt=createAuthToken(payload);
    context.request.headers['authToken']=jwt;

    console.log(`Meathod "${context.request.method}" URL: "${context.request.url}" headers: "${JSON.stringify(context.request.headers)}"`)
    console.log(context.response.header)
    console.log(context.response.statusCode)
    
        // console.log("headers updated:"+JSON.stringify(context.request.headers))
    console.log("going for third party")
  }


  async Authentication(context:RequestContext){
    const authheader=context.request.headers['authToken'];
    

  }
   
  async  wrapAPIreq(context: RequestContext) {
    console.log("almost there");
    const request = context.request as Request;

    if (request.url.startsWith('https://gatewayapi.smallcase.com')) {
        console.log("Request to third-party API: ",request.headers);
        // Perform actions specific to requests to the third-party API
    }
}
}
