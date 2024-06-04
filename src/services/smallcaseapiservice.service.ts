import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {TransactionapiDataSource} from '../datasources';


console.log("running")

export interface Smallcaseapiservice {
  requestInterceptor(): Promise<any>;
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  fetchData():Promise<any>;
}
console.log("function executed")

export class SmallcaseapiserviceProvider implements Provider<Smallcaseapiservice> {
  constructor(
    // transactionapi must match the name property in the datasource json file
    @inject('datasources.transactionapi')
    protected dataSource: TransactionapiDataSource = new TransactionapiDataSource(),
  ) {}

  value(): Promise<Smallcaseapiservice> {
    return getService(this.dataSource);
  }
}
