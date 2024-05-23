import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {TransactionDetailsDataSource} from '../datasources';

export interface TransactionDetails {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  fetchTransactionDetails(transactionId:string):Promise<any>
}

export class TransactionDetailsProvider implements Provider<TransactionDetails> {
  constructor(
    // transactionDetails must match the name property in the datasource json file
    @inject('datasources.transactionDetails')
    protected dataSource: TransactionDetailsDataSource = new TransactionDetailsDataSource(),
  ) {}

  value(): Promise<TransactionDetails> {
    return getService(this.dataSource);
  }
}
