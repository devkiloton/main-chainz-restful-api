import { Controller, Get, Param } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get(':id/:language')
  async findOne(@Param('id') id: string, @Param('language') language: string) {
    return this.articlesService.findOne({ id, language });
  }

  @Get('trends/most-viewed/:language')
  async findMostViewed(@Param('language') language: string) {
    return await this.articlesService.findMostViewed(language);
  }

  @Get('category/:category/:language')
  async findByCategory(@Param('category') category: string, @Param('language') language: string) {
    return this.articlesService.findByCategory({ category, language });
  }
}
