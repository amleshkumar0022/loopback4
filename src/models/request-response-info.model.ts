import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class RequestResponseInfo extends Model {
  @property({
    type: 'object',
    required: true,
  })
  Request: object;

  @property({
    type: 'object',
    required: true,
  })
  Response: object;

  @property({
    type: 'date',
    id: true,
    defaultFn:'now',
  })
  timestamp?: string;


  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<RequestResponseInfo>) {
    super(data);
  }
}

export interface RequestResponseInfoRelations {
  // describe navigational properties here
}

export type RequestResponseInfoWithRelations = RequestResponseInfo & RequestResponseInfoRelations;
