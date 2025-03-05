import { Injectable } from '@nestjs/common';
import { NewsArticle } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewsArticleType } from 'src/types/news.types';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(articleData: NewsArticleType): Promise<NewsArticle> {
    return this.prisma.newsArticle.create({
      data: {
        ...articleData,
        date: new Date(articleData.date * 1000),
      },
    });
  }

  async findByTimestamp(date: number): Promise<NewsArticle | null> {
    return this.prisma.newsArticle.findFirst({
      where: {
        date: new Date(date * 1000),
      },
    });
  }

  /**
   * @param page Current page number (default: 1)
   * @param limit Number of articles per page (default: 10)
   */
  async getNews(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: NewsArticle[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.newsArticle.findMany({
        take: limit,
        skip: skip,
        orderBy: { date: 'desc' },
      }),
      this.prisma.newsArticle.count(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * @param ticker
   * @param startDate
   * @param endDate
   */
  async getTickerStatistics(ticker: string, startDate: Date, endDate: Date) {
    const allArticles = await this.prisma.newsArticle.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const dailyStats = new Map<
      string,
      {
        total: number;
        tickerCount: number;
        sentimentSum: number;
        sentimentCount: number;
      }
    >();

    allArticles.forEach((article) => {
      const day = article.date.toISOString().split('T')[0]; // Extract "YYYY-MM-DD"

      if (!dailyStats.has(day)) {
        dailyStats.set(day, {
          total: 0,
          tickerCount: 0,
          sentimentSum: 0,
          sentimentCount: 0,
        });
      }

      const stats = dailyStats.get(day)!;
      stats.total++;

      if (article.ticker === ticker) {
        stats.tickerCount++;
        stats.sentimentSum += article.sentiment;
        stats.sentimentCount++;
      }
    });

    const statistics = Array.from(dailyStats.entries()).map(
      ([date, stats]) => ({
        date,
        avgArticlesPerDay: stats.tickerCount,
        percentageOfTotal:
          ((stats.tickerCount / stats.total) * 100).toFixed(2) + '%',
        avgSentiment: stats.sentimentCount
          ? (stats.sentimentSum / stats.sentimentCount).toFixed(2)
          : '0',
      }),
    );

    return {
      ticker,
      statistics,
    };
  }
}
