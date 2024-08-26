import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { OrderProduct } from '../order-product/entities/order-product.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module'; // Importa el módulo de usuarios si es necesario
import { OrdersController } from './orders.controller';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, OrderProduct, User]),
    ProductsModule,
    UsersModule, // Importa el módulo de usuarios si es necesario
  ],
  providers: [OrdersService],
  controllers: [OrdersController], // Incluye el controlador aquí
  exports: [OrdersService],
})
export class OrdersModule {}
