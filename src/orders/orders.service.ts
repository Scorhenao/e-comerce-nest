import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, products: productIds, totalPrice } = createOrderDto;

    // Buscar usuario
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Buscar productos
    const products = await this.productRepository.findByIds(productIds);
    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    const order = this.orderRepository.create({
      user,
      products,
      totalPrice,
    });

    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['user', 'products'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'products'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { userId, products: productIds, totalPrice } = updateOrderDto;

    // Find and assign user if provided
    let user: User | undefined;
    if (userId) {
      user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
    }

    // Find and assign products if provided
    let products: Product[] | undefined;
    if (productIds && productIds.length > 0) {
      products = await this.productRepository.findBy({
        id: In(productIds),
      });
      if (products.length !== productIds.length) {
        throw new NotFoundException('One or more products not found');
      }
    }

    // Preload the order with provided ID and updated properties
    const order = await this.orderRepository.preload({
      id,
      ...(user ? { user } : {}),
      ...(products ? { products } : {}),
      totalPrice,
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return await this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}
