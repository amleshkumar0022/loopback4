import {Entity, model, property} from '@loopback/repository';
import { UUID } from 'crypto';

@model()
export class IncomingReqRes extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: false,
  })
  x_sp_req_id: String;

  @property({
    type: 'string',
    required: false,

  })
  source_customer_name: string

  @property({
    type: 'number',
    required: false,
  })
  source_customer_id: number

  @property({
    type: 'string',
    required: false,
  })
  req_http_method: string;

  @property({
    type: 'date',
    required: false,
  })
  req_timestamp: Date;

  @property({
    type: 'string',
    required: false,
  })
  req_url: string;

  @property({
    type: 'string',
    required: false,
  })
  req_api_name: string;

  @property({
    type: 'string',
    required: false,
  })
  req_source_partner: string;

  @property({
    type: 'string',
    required: false,
  })
  req_source_IP: string;

  @property({
    type: 'object',
    required: false,
  })
  req_headers: Object;

  @property({
    type: 'object',
    required: false,
  })
  req_body: Object;

  @property({
    type: 'string',
    required: false,
  })
  resonse_id: string;

  @property({
    type: 'string',
    required: false
  })
  transactionId: string;

  @property({
    type: 'object',
    required: false
  })
  res_headers?: object;

  @property({
    type: 'object',
    required: false,
  })
  res_body: object;

  @property({
    type: 'string',
    required: false,
  })
  res_http_statuscode: string;

  @property({
    type: 'date',
    required: false,
  })
  res_timestamp: Date;

  @property({
    type: 'string',
    required: false,
  })
  res_status_text: string;

  @property({
    type: 'string',
    required: false,
  })
  res_error_stacktrace: string;

  [prop: string]: any;
  constructor(data?: Partial<IncomingReqRes>) {
    super(data);
  }
}

export interface IncomingReqResRelations {
  // describe navigational properties here
}

export type IncomingReqResWithRelations = IncomingReqRes & IncomingReqResRelations;
