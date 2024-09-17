import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInputTypes1709034737532 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO input_type (name, options) VALUES ('Status Button', '{"type":"STATUS_BUTTON","order":1}'), ('Single Select', '{"type":"SINGLE_SELECT","order":2}'), ('Multiple Choice', '{"type":"MULTIPLE_CHOICE","order":3}'), ('Custom Text', '{"type":"CUSTOM_TEXT","order":4}');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM input_type WHERE name IN ('Status Button', 'Single Select', 'Multiple Choice', 'Custom Text');`,
    );
  }
}
