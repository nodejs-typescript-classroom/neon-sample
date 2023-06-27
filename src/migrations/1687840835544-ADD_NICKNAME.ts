import { MigrationInterface, QueryRunner } from 'typeorm';

export class ADDNICKNAME1687840835544 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book_store" ADD "is_force_withdraw" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_store" ADD "nickname" character varying(100) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "book_store" DROP COLUMN "nickname"`);
    await queryRunner.query(
      `ALTER TABLE "book_store" DROP COLUMN "is_force_withdraw"`,
    );
  }
}
