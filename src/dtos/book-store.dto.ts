import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BookStoreDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  id: string;
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string;
  @IsNotEmpty()
  @IsString()
  author: string;
  @IsNotEmpty()
  @IsString()
  publication: string;
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Type(() => Number)
  createdAt: number;
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Type(() => Number)
  updatedAt: number;
}
