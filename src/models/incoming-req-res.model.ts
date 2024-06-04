import {Entity, model, property} from '@loopback/repository';

@model()
export class IncomingReqRes extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: false,
  })
  x_sp_req_id: string;

  @property({
    type: 'string',
    required: false,
  })
  req_http_method: string;

  @property({
    type: 'string',
    required: false,
  })
  req_timestamp: string;

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
    type: 'string',
    required: false,
  })
  req_headers: string;

  @property({
    type: 'string',
    required: false,
  })
  req_body: string;

  @property({
    type: 'string',
    required: false,
  })
  resonse_id: string;

  @property({
    type:'string',
    required:false
  })
  transactionId:string;
  
  @property({
    type: 'object',
    required: false
  })
  res_headers?: object;

  @property({
    type: 'string',
    required: false,
  })
  res_body: string;

  @property({
    type: 'string',
    required: false,
  })
  res_http_statuscode: string;

  @property({
    type: 'string',
    required: false,
  })
  res_timestamp: string;

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
