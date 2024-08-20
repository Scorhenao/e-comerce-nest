import { HasOne } from "sequelize-typescript";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @HasOne(() => User)
}