import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeNameMultiChoiseToMultiSelect1709701590416
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE input_type SET name = 'Multi Select' WHERE name = 'Multiple Choice'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE input_type SET name = 'Multiple Choice' WHERE name = 'Multi Select'`,
    );
  }
}
