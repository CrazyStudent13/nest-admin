import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { GameInfoEntity } from './entities/info.entity';
import { CreateGameInfoDto, UpdateGameInfoDto, ListGameInfoDto } from './dto/index';

@Injectable()
export class GameInfoService {
  constructor(
    @InjectRepository(GameInfoEntity)
    private readonly gameInfoEntityRep: Repository<GameInfoEntity>,
  ) {}

  async create(createGameInfoDto: CreateGameInfoDto) {
    await this.gameInfoEntityRep.save(createGameInfoDto);
    return ResultData.ok();
  }

  async findAll(query: ListGameInfoDto) {
    const entity = this.gameInfoEntityRep.createQueryBuilder('entity');
    entity.where('entity.delFlag = :delFlag', { delFlag: '0' });

    if (query.nameZh) {
      entity.andWhere(`entity.nameZh LIKE "%${query.nameZh}%"`);
    }
    if (query.nameEn) {
      entity.andWhere(`entity.nameEn LIKE "%${query.nameEn}%"`);
    }
    if (query.gameType) {
      entity.andWhere('entity.gameType = :gameType', { gameType: query.gameType });
    }

    if (query.orderByColumn && query.isAsc) {
      const key = query.isAsc === 'ascending' ? 'ASC' : 'DESC';
      entity.orderBy(`entity.${query.orderByColumn}`, key);
    }

    if (query.pageSize && query.pageNum) {
      entity.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    }

    const [list, total] = await entity.getManyAndCount();

    return ResultData.ok({
      list,
      total,
    });
  }

  async findOne(gameId: number) {
    const data = await this.gameInfoEntityRep.findOne({
      where: {
        gameId: gameId,
        delFlag: '0',
      },
    });

    return ResultData.ok(data);
  }

  async update(updateGameInfoDto: UpdateGameInfoDto) {
    await this.gameInfoEntityRep.update(
      {
        gameId: updateGameInfoDto.gameId,
      },
      updateGameInfoDto,
    );
    return ResultData.ok('修改成功');
  }

  async remove(gameIds: number[]) {
    const data = await this.gameInfoEntityRep.update(
      { gameId: In(gameIds) },
      {
        delFlag: '1',
      },
    );
    console.log(data);
    return ResultData.ok(true);
  }
}
