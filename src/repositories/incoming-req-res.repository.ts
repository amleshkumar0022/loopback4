import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MydbDataSource} from '../datasources';
import {IncomingReqRes, IncomingReqResRelations} from '../models';

export class IncomingReqResRepository extends DefaultCrudRepository<
  IncomingReqRes,
  typeof IncomingReqRes.prototype.x_sp_req_id,
  IncomingReqResRelations
> {
  constructor(
    @inject('datasources.mydb') dataSource: MydbDataSource,
  ) {
    super(IncomingReqRes, dataSource);
  }
}
