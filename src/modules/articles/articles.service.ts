import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(@InjectRepository(ArticleEntity) private readonly _articleRepository: Repository<ArticleEntity>) {}

  async findAll() {
    const articles = await this._articleRepository.find();
    return articles;
  }

  async findOne(data: { id: string; language: string }) {
    const options: FindOneOptions<ArticleEntity> = {
      where: { id: data.id, language: data.language },
    };

    const article = await this._articleRepository.findOne(options);
    if (!article) throw new NotFoundException('Article not found');
    this._articleRepository.update(data.id, { views: article.views + 1 });
    return article;
  }

  async findMostViewed(language: string) {
    const articles = await this._articleRepository.find({ where: { language }, order: { views: 'DESC' }, take: 10 });
    return articles;
  }

  async findByCategory(data: { category: string; language: string }) {
    const articles = await this._articleRepository.find({
      where: { category: data.category, language: data.language },
    });
    return articles;
  }
}
