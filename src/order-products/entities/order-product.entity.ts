import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('order_products')
export class OrderProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.orderProducts)
    order: Order;

    @ManyToOne(() => Product, (product) => product.orderProducts)
    product: Product;

    @Column()
    quantity: number; // Opcional: Si necesitas almacenar la cantidad de cada producto en el pedido
}
