import {Entity, Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class RequestInfo extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  requestId: string;

  @property({
    type: 'string',
    required: true,
  })
  timestamp: string;

  @property({
    type: 'string',
    required: false
  })
  transactionId: string

  @property({
    type: 'string',
    required: false
  })
  expireAt:string

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

constructor(data?: Partial<RequestInfo>) {
    super(data);
  }
}

export interface RequestInfoRelations {
  // describe navigational properties here
  
}

export type RequestInfoWithRelations = RequestInfo & RequestInfoRelations;
