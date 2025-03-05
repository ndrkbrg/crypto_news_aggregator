import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { NewsService } from './news.service';
import * as fs from 'fs';
import { NewsArticleType } from 'src/types/news.types';

@Injectable()
export class NewsCronService {
  private readonly logger = new Logger(NewsCronService.name);
  private newsData: NewsArticleType[] = [];
  private currentIndex = 0;

  constructor(
    private readonly newsService: NewsService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.loadNewsData();
  }

  // Load from file
  private loadNewsData() {
    try {
      const filePath =
        process.env.NODE_ENV === 'production'
          ? '/app/data/mock_news.json'
          : 'src/data/mock_news.json';
      const data = fs.readFileSync(filePath, 'utf8');
      this.newsData = JSON.parse(data) as NewsArticleType[];
      this.logger.log(`Loaded ${this.newsData.length} news articles.`);
    } catch (error) {
      this.logger.error('Error loading news.json:', error);
    }
  }

  /**
   * Cron job that runs every minute to add news articles.
   */
  @Cron(CronExpression.EVERY_MINUTE, { name: 'newsImportJob' })
  async importNextArticle() {
    if (this.currentIndex >= this.newsData.length) {
      this.logger.log('✅ All articles have been imported. Stopping cron job.');
      this.stopCronJob();
      return;
    }

    const article = this.newsData[this.currentIndex];

    // Check if article already exists (by timestamp)
    const existingArticle = await this.newsService.findByTimestamp(
      article.date,
    );
    if (existingArticle) {
      this.logger.warn(`Skipping duplicate article: "${article.title}"`);
    } else {
      await this.newsService.create(article);
      this.logger.log(`✅ Imported article: "${article.title}"`);
    }

    this.currentIndex++;
  }

  /**
   * Stops the cron job once all articles are processed
   */
  private stopCronJob() {
    const job = this.schedulerRegistry.getCronJob('newsImportJob');
    if (job) {
      job.stop();
      this.logger.log('🛑 Cron job stopped.');
    }
  }
}
