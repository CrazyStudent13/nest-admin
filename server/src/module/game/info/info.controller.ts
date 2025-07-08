import { Controller, Get, Post, Put, Body, Param, Query, Delete, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { GameInfoService } from './info.service';
import { CreateGameInfoDto, UpdateGameInfoDto, ListGameInfoDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-premission.decorator';

@ApiTags('游戏信息')
@Controller('game/info')
export class GameInfoController {
  constructor(private readonly gameInfoService: GameInfoService) {}

  @ApiOperation({
    summary: '游戏信息-创建',
  })
  @ApiBody({
    type: CreateGameInfoDto,
    required: true,
  })
  @RequirePermission('system:gameInfo:add')
  @Post()
  @HttpCode(200)
  create(@Body() createGameInfoDto: CreateGameInfoDto) {
    return this.gameInfoService.create(createGameInfoDto);
  }

  @ApiOperation({
    summary: '游戏信息-游客-列表',
  })
  @Get('/guest/list')
  findGuestAll(@Query() query: ListGameInfoDto) {
    return this.gameInfoService.findAll(query);
  }

  @ApiOperation({
    summary: '游戏信息-详情',
  })
  @Get('/guest/detail')
  findGuestOne(@Query('gameId') gameId: string) {
    return this.gameInfoService.findOne(+gameId);
  }

  @ApiOperation({
    summary: '游戏信息-管理员-列表',
  })
  @RequirePermission('system:gameInfo:list')
  @Get('/list')
  findAll(@Query() query: ListGameInfoDto) {
    return this.gameInfoService.findAll(query);
  }

  @ApiOperation({
    summary: '游戏信息-详情',
  })
  @RequirePermission('system:gameInfo:query')
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('id', id);
    return this.gameInfoService.findOne(+id);
  }

  @ApiOperation({
    summary: '游戏信息-更新',
  })
  @ApiBody({
    type: UpdateGameInfoDto,
    required: true,
  })
  @RequirePermission('system:gameInfo:edit')
  @Put()
  update(@Body() updateGameInfoDto: UpdateGameInfoDto) {
    return this.gameInfoService.update(updateGameInfoDto);
  }

  @ApiOperation({
    summary: '游戏信息-删除',
  })
  @RequirePermission('system:gameInfo:remove')
  @Delete(':id')
  remove(@Param('id') ids: string) {
    const gameIds = ids.split(',').map((id) => +id);
    return this.gameInfoService.remove(gameIds);
  }
}
