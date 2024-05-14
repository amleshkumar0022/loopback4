import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MydbDataSource} from '../datasources';
import {RequestInfo, RequestInfoRelations} from '../models';

export class RequestInfoRepository extends DefaultCrudRepository<
  RequestInfo,
  typeof RequestInfo.prototype.requestId,
  RequestInfoRelations
> {
  constructor(
    @inject('datasources.mydb') dataSource: MydbDataSource,
  ) {
    super(RequestInfo, dataSource);
  }
}
