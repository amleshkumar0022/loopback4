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


const name='SpringMoney@123'
const secrett = 'anceeef342';

// Function to create an authentication token given an ID
function createAuthToken(username: string): string {
  // Define your secret key for signing the token
  const secret = secrett;

  // Define token payload
  const payload = {
    name:name
    // You can add more data to the payload if needed
  };

  // Define token expiration (optional)
  const expiresIn = '1d'; // Token will expire in 1 day

  // Generate and return the token
  return jwt.sign(payload, secret, { expiresIn });
}
const auth_token=createAuthToken(name);
console.log("auth_token: "+auth_token);



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
  
  async Authentication(context: RequestContext) {
    const request = context.request;

    // Your authentication middleware logic goes here
    // For example, check for presence of authentication token in headers
    let authToken = request.headers['authentication'];

    if (!authToken) {
      throw new Error('Authentication Token is missing');
    }
    if (Array.isArray(authToken)) {
      authToken = authToken[0];
    }

    try {
      // Verify and decode the token
      const decoded = jwt.verify(authToken, secrett);
      
      // Attach the decoded payload to the context object for further use
      context.bind('user').to(decoded);
      console.log('Authentication successful:', decoded);
      
    } catch (error) {
      // Handle token verification errors
      throw new Error('Invalid or expired token');
    }
    
    

    // Optionally, you can validate the token or perform other authentication checks
    // For simplicity, let's assume the presence of a token is sufficient for authentication
    // console.log('Authentication successful');
  }



  async wrapReq(context:RequestContext){
    const request_id=uuidv4();
    context.request.headers['x-sp-request-id']=request_id
    const timestamp=new Date().toLocaleString();
    context.request.headers['timestamp']=timestamp;
    
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


  // async Authentication(context:RequestContext){
  //   const authheader=context.request.headers['authToken'];
    

  // }
   
  async  wrapAPIreq(context: RequestContext) {
    console.log("almost there");
    const request = context.request as Request;

    if (request.url.startsWith('https://gatewayapi.smallcase.com')) {
        console.log("Request to third-party API: ",request.headers);
        // Perform actions specific to requests to the third-party API
    }
}
}
