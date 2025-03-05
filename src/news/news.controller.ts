import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = parseInt(page ?? '1', 10);
    const limitNum = parseInt(limit ?? '10', 10);
    return this.newsService.getNews(pageNum, limitNum);
  }

  @Get('statistics')
  async getTickerStatistics(
    @Query('ticker') ticker: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!ticker || !startDate || !endDate) {
      return { error: 'ticker, startDate, and endDate are required' };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.newsService.getTickerStatistics(ticker, start, end);
  }
}
