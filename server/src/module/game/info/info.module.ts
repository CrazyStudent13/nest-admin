import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameInfoController } from './info.controller';
import { GameInfoService } from './info.service';
import { GameInfoEntity } from './entities/info.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([GameInfoEntity])],
  controllers: [GameInfoController],
  providers: [GameInfoService],
})
export class GameInfoModule {}
