import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookStoreService } from './book-store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookStoreEntity } from './book-store.entity';
import { UserModule } from './user/user.module';
// import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookStoreEntity]), UserModule],
  controllers: [BookController],
  providers: [BookStoreService],
})
export class BookStoreModule {}
