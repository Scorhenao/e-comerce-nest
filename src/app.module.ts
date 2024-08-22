import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import {TypeOrmModule} from '@nestjs/typeorm'
import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: "ecomerce",
      username: "root",
      password: "Rlwl2023.",
      entities:[User,Product,Order],
      synchronize:true
    }),
    UsersModule, ProductsModule, OrdersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
