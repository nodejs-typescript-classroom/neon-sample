import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookStoreService } from './book-store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookStoreEntity } from './book-store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookStoreEntity])],
  controllers: [BookController],
  providers: [BookStoreService],
})
export class BookStoreModule {}
