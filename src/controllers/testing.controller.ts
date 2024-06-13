import { get, param, response ,post,requestBody, HttpErrors} from '@loopback/rest';
import axios from 'axios';
import jwt from "jsonwebtoken"
import {v4 as uuidv4} from 'uuid';

const GatewayName = "plan360degree";
const secrett = "plan360degree_b769953d42804f03874ad9339a4a496f";
const API_secret = "plan360degree_fdc1222d6a90457287aa43cfa9c0c03a";

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
const authId = uuidv4();


const axiosInstance = axios.create({
  baseURL: 'https://gatewayapi.smallcase.com',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    'x-gateway-secret': API_secret,
    'x-gateway-authtoken': jwwt.toString(),
  },
});
const axiosInstancepost = axios.create({
  baseURL: 'https://api.restful-api.dev',
  headers: {
    'Content-Type': 'application/json',
  },
});

export class SmallcaseController {
  constructor() {}

  @get('/smallcase_thirdparty_api_get')
  @response(200, {
    description: 'Fetch Order Details by Transaction ID',
    content: {'application/json': {schema: {type: 'object'}}},
  })
  async smallcaseapi(
    @param.query.string('transactionId') transactionId: string,
  ): Promise<any> {
    try {
      const response = await axiosInstance.get(`/v1/plan360degree/engine/orders/sst?transactionId=${transactionId}`);
      const details = response.data;
      return {
        statusCode: 200,
        desc: 'success',
        data: details,
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        statusCode: 501,
        desc: 'error',
        data: null,
      };
    }
  }

  @post('/smallcase_thirdparty_api_post')
  async postToExternalApi(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {type: 'string'},
              name: {type: 'string'},
              data: {
                type: 'object',
                properties: {
                  color: {type: 'string'},
                  'capacity GB': {type: 'number'},
                },
                required: ['color', 'capacity GB'],
              },
            },
            required: ['id', 'name', 'data'],  // Make these fields required if necessary
          },
        },
      },
    }) body: any): Promise<any> {
    try {
      const response = await axiosInstancepost.post('/objects', body);
      console.log(body);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error while posting data to external API:', error);
      throw new HttpErrors.InternalServerError('Error while posting data to external API');
    }
  }
}
