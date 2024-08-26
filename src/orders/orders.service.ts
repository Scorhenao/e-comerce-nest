import { User } from 'src/users/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { OrderProduct } from '../order-product/entities/order-product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Asegúrate de inyectar el repositorio de User
  ) {}

  // Método para crear un nuevo pedido
  async createOrder(
    userId: number,
    productIds: number[],
    quantities: number[],
  ): Promise<Order> {
    if (productIds.length !== quantities.length) {
      throw new BadRequestException(
        'El número de productos y cantidades no coincide',
      );
    }

    // Verificar que todos los productos existen y son válidos
    const products = await this.productRepository.findByIds(productIds);
    if (products.length !== productIds.length) {
      throw new NotFoundException('Algunos productos no se encontraron');
    }

    const totalPrice = products.reduce(
      (total, product, index) => total + product.price * quantities[index],
      0,
    );

    // Crear el pedido
    const order = this.orderRepository.create({ userId, totalPrice });
    await this.orderRepository.save(order);

    // Añadir productos al pedido
    await Promise.all(
      productIds.map((productId, index) =>
        this.orderProductRepository.save({
          orderId: order.id,
          productId,
          quantity: quantities[index],
        }),
      ),
    );

    return order;
  }

  // Método para obtener un pedido por ID
  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['products'],
    });
    if (!order) {
      throw new NotFoundException(`Pedido con ID ${orderId} no encontrado`);
    }
    return order;
  }

  // Método para añadir un producto al carrito
  async addToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<void> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    // Aquí puedes agregar lógica para verificar si el usuario tiene un carrito abierto
    let order = await this.orderRepository.findOne({
      where: { userId }, // Asegúrate de que `status` no esté aquí si no existe en la entidad
    });

    if (!order) {
      // Crear un nuevo pedido si no existe uno abierto
      order = this.orderRepository.create({
        userId,
        totalPrice: 0,
        // No uses `status` si no está definido en la entidad
      });
      await this.orderRepository.save(order);
    }

    const orderProduct = await this.orderProductRepository.findOne({
      where: { orderId: order.id, productId },
    });
    if (orderProduct) {
      orderProduct.quantity += quantity;
      await this.orderProductRepository.save(orderProduct);
    } else {
      await this.orderProductRepository.save({
        orderId: order.id,
        productId,
        quantity,
      });
    }

    // Actualizar el precio total del pedido
    const totalPrice = await this.calculateTotalPrice(order.id);
    order.totalPrice = totalPrice;
    await this.orderRepository.save(order);
  }

  // Método para calcular el precio total de un pedido
  private async calculateTotalPrice(orderId: number): Promise<number> {
    const orderProducts = await this.orderProductRepository.find({
      where: { orderId },
    });
    const productIds = orderProducts.map((op) => op.productId);
    const products = await this.productRepository.findByIds(productIds);

    return orderProducts.reduce((total, orderProduct) => {
      const product = products.find((p) => p.id === orderProduct.productId);
      return total + (product ? product.price * orderProduct.quantity : 0);
    }, 0);
  }

  // Método para crear un pedido usando un DTO
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, products: productIds, totalPrice } = createOrderDto;

    // Buscar usuario
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Buscar productos
    const products = await this.productRepository.findByIds(productIds);
    if (products.length !== productIds.length) {
      throw new NotFoundException('Uno o más productos no encontrados');
    }

    const order = this.orderRepository.create({
      user,
      products,
      totalPrice,
    });

    return await this.orderRepository.save(order);
  }

  // Método para obtener todos los pedidos
  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['user', 'products'] });
  }

  // Método para obtener un pedido por ID
  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id }, // Usa el ID directamente
      relations: ['user', 'products'], // Asegúrate de incluir relaciones necesarias
    });
    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return order;
  }

  // Método para actualizar un pedido
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { userId, products: productIds, totalPrice } = updateOrderDto;

    // Buscar usuario si se proporciona
    let user: User | undefined;
    if (userId) {
      user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }
    }

    // Buscar productos si se proporciona
    let products: Product[] | undefined;
    if (productIds && productIds.length > 0) {
      products = await this.productRepository.findBy({
        id: In(productIds),
      });
      if (products.length !== productIds.length) {
        throw new NotFoundException('Uno o más productos no encontrados');
      }
    }

    // Actualizar el pedido con los datos proporcionados
    const order = await this.orderRepository.preload({
      id,
      ...(user ? { user } : {}),
      ...(products ? { products } : {}),
      totalPrice,
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return await this.orderRepository.save(order);
  }

  // Método para eliminar un pedido
  async remove(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
  }
}
