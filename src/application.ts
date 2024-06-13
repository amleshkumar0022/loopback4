import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import { OrderDetailsProvider } from './services/order-details.service';
import { SstOrderDetailsDataSource } from './datasources';
import {LoggingComponent} from '@loopback/logging';

// import { JWTservice } from './services/jwt.service';

export {ApplicationConfig};

export class SmallcaseApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);


    // this.bind('services.jwt.service').toClass(JWTservice);
    // Set up the custom sequence
    // this.bind('services.OrderDetails').toProvider(OrderDetailsProvider);
    // this.dataSource(SstOrderDetailsDataSource, 'datasources.sst_order_details');
    // this.component(LoggingComponent);
    this.sequence(MySequence);


    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js','.controller.ts'],
        nested: true,
      },
    };
  }
  setupBindings(): void {
    // this.bind('services.jwt.service').toClass(JWTservice)
  }
}
