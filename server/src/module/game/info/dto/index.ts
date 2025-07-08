import { IsDateString, IsString, IsEnum, Length, IsOptional, IsNumber, IsBooleanString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';

export class CreateGameInfoDto {
  @ApiProperty({ required: true })
  @IsString()
  @Length(0, 64)
  nameZh: string;

  @ApiProperty({ required: true })
  @IsString()
  @Length(0, 64)
  nameEn: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  desc?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  descCoverUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  gameType?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ required: true })
  @IsBooleanString()
  online: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ageRange?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  salePlatform?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  operateSystem?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  releaseDate?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lowestPrice?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  gameStudio?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  remark?: string;
}

export class UpdateGameInfoDto extends CreateGameInfoDto {
  @ApiProperty({ required: true })
  @IsNumber()
  gameId: number;
}

export class ListGameInfoDto extends PagingDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nameZh?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nameEn?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  gameType?: string;
}