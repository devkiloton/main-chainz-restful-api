import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
})
export class ArticlesModule {}
