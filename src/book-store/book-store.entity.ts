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
  @Column({
    name: 'is_force_withdraw',
    type: 'boolean',
    default: false,
  })
  isForceWithdraw: boolean;
}
