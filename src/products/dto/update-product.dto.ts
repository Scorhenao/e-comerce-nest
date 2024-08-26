import { IsOptional, IsString, IsDecimal } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDecimal(
    { decimal_digits: '2', force_decimal: true },
    { message: 'Price must be a decimal number with two decimal places' },
  )
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
