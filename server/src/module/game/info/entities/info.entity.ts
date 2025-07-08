import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'game_info' })
export class GameInfoEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'game_id', comment: '游戏id' })
  @ApiProperty({ type: Number, description: '游戏id' })
  gameId: number;

  @Column({ type: 'varchar', length: 64, name: 'name_zh', comment: '游戏中文名' })
  @ApiProperty({ required: true, description: '游戏中文名' })
  nameZh: string;

  @Column({ type: 'varchar', length: 64, name: 'name_en', comment: '游戏英文名' })
  @ApiProperty({ required: true, description: '游戏英文名' })
  nameEn: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'desc', comment: '游戏简介' })
  @ApiProperty({ required: false, description: '游戏简介' })
  desc: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'cover', comment: '游戏封面' })
  @ApiProperty({ required: false, description: '游戏封面' })
  cover: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'desc_cover_url', comment: '游戏描述图片' })
  @ApiProperty({ required: false, description: '游戏描述图片' })
  descCoverUrl: string;

  @Column({ type: 'varchar', length: 64, nullable: true, name: 'game_type', comment: '游戏类型' })
  @ApiProperty({ required: false, description: '游戏类型' })
  gameType: string;

  @Column({ type: 'varchar', length: 32, nullable: true, name: 'version', comment: '当前版本号' })
  @ApiProperty({ required: false, description: '当前版本号' })
  version: string;

  @Column({ type: 'varchar', length: 32, nullable: true, name: 'language', comment: '支持语言（数据字典game_language）' })
  @ApiProperty({ required: false, description: '支持语言（数据字典game_language）' })
  language: string;

  @Column({ type: 'char', length: 1, default: '0', name: 'online', comment: '是否支持联机（1：是，0：否）' })
  @ApiProperty({ required: true, description: '是否支持联机（1：是，0：否）' })
  online: string;

  @Column({ type: 'varchar', length: 32, nullable: true, name: 'age_range', comment: '适龄区间' })
  @ApiProperty({ required: false, description: '适龄区间' })
  ageRange: string;

  @Column({ type: 'varchar', length: 128, nullable: true, name: 'sale_platform', comment: '发售平台' })
  @ApiProperty({ required: false, description: '发售平台' })
  salePlatform: string;

  @Column({ type: 'varchar', length: 128, nullable: true, name: 'operate_system', comment: '操作系统' })
  @ApiProperty({ required: false, description: '操作系统' })
  operateSystem: string;

  @Column({ type: 'datetime', precision: 6, nullable: true, name: 'release_date', comment: '发售日期' })
  @ApiProperty({ required: false, description: '发售日期' })
  releaseDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'price', comment: '最近价格' })
  @ApiProperty({ required: false, description: '最近价格' })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'lowest_price', comment: '史上最低价格' })
  @ApiProperty({ required: false, description: '史上最低价格' })
  lowestPrice: number;

  @Column({ type: 'varchar', length: 128, nullable: true, name: 'game_studio', comment: '游戏开发商' })
  @ApiProperty({ required: false, description: '游戏开发商' })
  gameStudio: string;

  @Column({ type: 'varchar', length: 64, default: '', name: 'create_by', comment: '创建者' })
  createBy: string;

  @CreateDateColumn({ type: 'datetime', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)', name: 'create_time', comment: '创建时间' })
  createTime: Date;

  @Column({ type: 'varchar', length: 64, default: '', name: 'update_by', comment: '更新者' })
  updateBy: string;

  @UpdateDateColumn({ type: 'datetime', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)', name: 'update_time', comment: '更新时间' })
  updateTime: Date;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'remark', comment: '备注' })
  @ApiProperty({ required: false, description: '备注' })
  remark: string;

  @Column({ type: 'char', length: 1, default: '0', name: 'del_flag', comment: '删除标志（0代表存在 1代表删除）' })
  delFlag: string;
}
