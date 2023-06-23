import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookStoreDto } from '../dtos/book-store.dto';
import { BookStoreService } from './book-store.service';

@Controller('books')
export class BookController {
  private logger = new Logger(BookController.name);
  constructor(private readonly bookStoreService: BookStoreService) {}
  @Post()
  async createbook(@Body() dto: BookStoreDto) {
    return this.bookStoreService.insertBook(dto);
  }
  @Get()
  async getBooks() {
    return this.bookStoreService.getBookList();
  }
  @Get('/:id')
  async getBookById(@Param('id') id: string) {
    this.logger.log({ id });
    return this.bookStoreService.getBookById(id);
  }
  @Put('/:id')
  async updateBookById(@Param('id') id: string, @Body() dto: BookStoreDto) {
    this.logger.log({ id, dto });
    return this.bookStoreService.updateById(id, dto);
  }
  @Delete('/:id')
  async deleteBookById(@Param('id') id: string) {
    this.logger.log({ id });
    return this.bookStoreService.deleteById(id);
  }
}
