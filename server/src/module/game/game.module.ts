import { Module } from '@nestjs/common';
import { GameArticleModule } from './article/article.module';
import { GameInfoModule } from './info/info.module';

@Module({
  imports: [GameArticleModule, GameInfoModule],
})
export class GameModule {}
