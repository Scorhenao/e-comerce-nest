import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;

  @IsNotEmpty()
  @IsArray()
  readonly products: number[];

  @IsNotEmpty()
  @IsNumber()
  readonly totalPrice: number;
}
