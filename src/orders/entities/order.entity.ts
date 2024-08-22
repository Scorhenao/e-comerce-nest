import { HasOne } from "sequelize-typescript";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int'})
    userId: number;

    @Column({ type: 'int'})
    products: number;

    @Column({ type: 'decimal', precision: 10, scale: 2  })
    totalPrice: number;

    @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' })
    user: User;

    @ManyToMany(() => Product)
    @JoinTable()
    product: Product[];
}