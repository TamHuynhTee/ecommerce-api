import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  color: string;
}
