import { IsNotEmpty, IsString, IsDecimal } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDecimal(
    { decimal_digits: '2', force_decimal: true },
    { message: 'Price must be a decimal number with two decimal places' },
  )
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
