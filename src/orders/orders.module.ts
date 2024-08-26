import { Order } from 'src/orders/entities/order.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, User])],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService], // Exporta el servicio si es necesario en otros módulos
})
export class OrdersModule {}
