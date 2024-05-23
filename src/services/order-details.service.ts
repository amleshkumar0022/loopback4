import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {SstOrderDetailsDataSource} from '../datasources';

export interface OrderDetails {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getOrderDetails(transactionId:string):Promise<any>
}

export class OrderDetailsProvider implements Provider<OrderDetails> {
  constructor(
    // sst_order_details must match the name property in the datasource json file
    @inject('datasources.sst_order_details')
    protected dataSource: SstOrderDetailsDataSource = new SstOrderDetailsDataSource(),
  ) {}

  value(): Promise<OrderDetails> {
    return getService(this.dataSource);
  }
}
