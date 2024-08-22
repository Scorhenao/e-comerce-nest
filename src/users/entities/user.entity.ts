import { Order } from "src/orders/entities/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {type:'varchar', length:'255'} )
    email: string;

    @Column({type:'varchar', length:'255'})
    password: string;

    @Column({type:'varchar', length:'10'})
    role: string;

    @OneToMany(() => Order, order => order.user)
    orders: Order[];
}