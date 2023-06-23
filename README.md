# neon-sample

This repository is Example for connect to postgresql on Neon With TypeORM


## Pre-Request

1. sign up into Neon

2. setup Neon Project for create neondb

## Steps

1. install package

```shell=
yarn add @nestjs/config
yarn add class-transformer class-validator
yarn add @nestjs/typeorm typeorm pg
yarn add joi
```

2. setup typeorm configuartion

```env
DB_URI=
```
```typescript
ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: Joi.object({
    DB_URI: Joi.string().required(),
    IS_DB_SSL_MODE: Joi.boolean().required(),
  }),
}),
TypeOrmModule.forRootAsync({
  useFactory(configService: ConfigService) {
    const IS_DB_SSL_MODE = configService.getOrThrow<boolean>(
      'IS_DB_SSL_MODE',
      false,
    );
    return {
      ssl: IS_DB_SSL_MODE,
      extra: {
        ssl: IS_DB_SSL_MODE ? { rejectUnauthorized: false } : null,
        poolSize: 5,
        idleTimeoutMillis: 3600000,
      },
      type: 'postgres',
      url: configService.getOrThrow('DB_URI', ''),
      synchronize: false,
    };
  },
  inject: [ConfigService],
}),
```

3. implementation with TypeORM entity

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('book_store', { schema: 'public' })
export class BookStoreEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
  })
  id: string;
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp without time zone',
  })
  createdAt: Date;
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp without time zone',
  })
  updatedAt: Date;
  @Column({
    name: 'author',
    type: 'varchar',
    length: '100',
  })
  author: string;
  @Column({
    name: 'name',
    type: 'varchar',
    length: '100',
  })
  name: string;
  @Column({
    name: 'publication',
    type: 'varchar',
    length: '100',
  })
  publication: string;
}

```
4. setup submodule setup for TypeORM usage
   
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { BookStoreModule } from './book-store/book-store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        IS_DB_SSL_MODE: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        const IS_DB_SSL_MODE = configService.getOrThrow<boolean>(
          'IS_DB_SSL_MODE',
          false,
        );
        return {
          ssl: IS_DB_SSL_MODE,
          extra: {
            ssl: IS_DB_SSL_MODE ? { rejectUnauthorized: false } : null,
            poolSize: 5,
            idleTimeoutMillis: 3600000,
          },
          type: 'postgres',
          url: configService.getOrThrow('DB_URI', ''),
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    BookStoreModule,
  ],
  controllers: [AppController],
  providers: [AppService, TypeOrmModule],
})
export class AppModule {}

```

5. implementation all entity setup

```typescript
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BookStoreDto } from '../dtos/book-store.dto';
import { BookStoreEntity } from './book-store.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookStoreService {
  private logger = new Logger(BookStoreService.name);
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(BookStoreEntity)
    private readonly bookStoreRepo: Repository<BookStoreEntity>,
  ) {}
  async getBookList(): Promise<BookStoreDto[]> {
    try {
      const result = await this.bookStoreRepo.find();
      return result.map((book) => ({
        id: book.id,
        name: book.name,
        author: book.author,
        publication: book.publication,
        createdAt: book.createdAt.getTime(),
        updatedAt: book.updatedAt.getTime(),
      }));
    } catch (error) {
      this.logger.error({ message: 'getBookList error' }, error);
      throw error;
    }
  }
  async getBookById(id: string): Promise<BookStoreDto> {
    try {
      const book = await this.bookStoreRepo.findOne({
        where: {
          id: id,
        },
      });
      if (!book) {
        this.logger.error({ message: `book with id ${id} not found` });
        throw new NotFoundException(`book with id ${id} not found`);
      }
      return {
        id: book.id,
        author: book.author,
        name: book.name,
        publication: book.publication,
        createdAt: book.createdAt.getTime(),
        updatedAt: book.updatedAt.getTime(),
      };
    } catch (error) {
      this.logger.error({ message: 'getBookById error' }, error);
      throw error;
    }
  }
  async updateById(
    id: string,
    updateDto: Partial<BookStoreDto>,
  ): Promise<BookStoreDto> {
    try {
      const queryBuilder = this.dataSource
        .getRepository(BookStoreEntity)
        .createQueryBuilder('book_store');
      const result = await queryBuilder
        .update<BookStoreEntity>(BookStoreEntity, updateDto)
        .where('book_store.id = :id', { id })
        .returning([
          'id',
          'author',
          'name',
          'publication',
          'createdAt',
          'updatedAt',
        ])
        .updateEntity(true)
        .execute();
      const model = result.raw[0] as BookStoreEntity;
      return {
        id: model.id,
        name: model.name,
        author: model.author,
        publication: model.publication,
        createdAt: model.createdAt.getTime(),
        updatedAt: model.updatedAt.getTime(),
      };
    } catch (error) {
      this.logger.error({ message: 'updateById error' }, error);
      throw error;
    }
  }
  async insertBook(dto: BookStoreDto): Promise<BookStoreDto> {
    try {
      this.logger.log({ dto });
      const data = new BookStoreEntity();
      data.author = dto.author;
      data.name = dto.name;
      data.publication = dto.publication;
      const queryBuilder = this.dataSource
        .getRepository(BookStoreEntity)
        .createQueryBuilder('book_store');
      const result = await queryBuilder
        .insert()
        .into(BookStoreEntity)
        .values([data])
        .returning([
          'id',
          'author',
          'name',
          'publication',
          'createdAt',
          'updatedAt',
        ])
        .updateEntity(true)
        .execute();
      const model = result.raw[0] as BookStoreDto;
      model.createdAt = new Date(result.raw[0]['created_at']).getTime();
      model.updatedAt = new Date(result.raw[0]['updated_at']).getTime();
      return {
        id: model.id,
        name: model.name,
        author: model.author,
        publication: model.publication,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      };
    } catch (error) {
      this.logger.error({ message: 'insertBook error' }, error);
      throw error;
    }
  }

  async deleteById(id: string): Promise<BookStoreDto> {
    try {
      this.logger.log({ id });
      const queryBuilder = this.dataSource
        .getRepository(BookStoreEntity)
        .createQueryBuilder('book_store');
      const result = await queryBuilder
        .delete()
        .where('book_store.id = :id', { id })
        .returning([
          'id',
          'author',
          'name',
          'publication',
          'createdAt',
          'updatedAt',
        ])
        .execute();
      const model = result.raw[0] as BookStoreDto;
      model.createdAt = new Date(result.raw[0]['created_at']).getTime();
      model.updatedAt = new Date(result.raw[0]['updated_at']).getTime();
      return {
        id: model.id,
        name: model.name,
        author: model.author,
        publication: model.publication,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      };
    } catch (error) {
      this.logger.error({ message: 'deleteById error' }, error);
      throw error;
    }
  }
}

```