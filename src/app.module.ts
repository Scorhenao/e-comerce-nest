import { AuthGuard } from './auth/guards/auth.guard';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'ecomerce',
      username: 'root',
      password: '',
      entities: [User, Product, Order],
      synchronize: true,
    }),
    AuthModule, // Ensure AuthModule is imported
    ProductsModule,
    OrdersModule,
    UsersModule,
  ],
  providers: [AuthGuard, JwtService],
})
export class AppModule {}
