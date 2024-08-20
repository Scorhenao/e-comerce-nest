import { HasMany } from "sequelize-typescript";
import { Order } from "src/orders/entities/order.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {type:'string', length:'255'} )
    email: string;

    @Column({type:'string', length:'255'})
    password: string;

    @Column({type:'string', length:'10'})
    role: string;

    @HasMany(() => Order)
}