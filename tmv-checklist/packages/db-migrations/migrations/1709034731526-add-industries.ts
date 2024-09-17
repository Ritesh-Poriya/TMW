import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndustries1709034731526 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO industry (name, description, "logoUrl") VALUES ('Garage', 'Description of garage service goes here', 'https://raw.githubusercontent.com/JayminPatel007/test-repo/master/car.svg'), ('Plumbing', 'Description of plumbing service goes here', 'https://raw.githubusercontent.com/JayminPatel007/test-repo/master/water.svg'), ('HVAC', 'Heating, ventilation, and air conditioning', 'https://raw.githubusercontent.com/JayminPatel007/test-repo/master/fire.svg');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM industry WHERE name IN('Garage', 'Plumbing', 'HVAC')`,
    );
  }
}
