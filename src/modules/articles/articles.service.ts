import { Injectable } from '@nestjs/common';
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

  async findOne(id: string) {
    const options: FindOneOptions = { where: { id } };
    const article = await this._articleRepository.findOne(options);
    return article;
  }

  async findMostViewed() {
    const articles = await this._articleRepository.find({ order: { views: 'DESC' }, take: 10 });
    return articles;
  }
}
