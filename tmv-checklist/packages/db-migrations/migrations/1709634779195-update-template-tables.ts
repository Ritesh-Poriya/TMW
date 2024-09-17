import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTemplateTables1709634779195 implements MigrationInterface {
  name = 'UpdateTemplateTables1709634779195';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" ADD "companyId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ADD "companyId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "companyId"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "companyId"`);
  }
}
