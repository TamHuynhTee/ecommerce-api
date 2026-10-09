import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

enum Gender {
  MALE,
  FEMALE,
}

export class CreateUserDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: string;

  @IsString()
  @IsEmail()
  email: string;
}
