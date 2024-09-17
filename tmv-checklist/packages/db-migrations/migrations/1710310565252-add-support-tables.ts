import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSupportTables1710310565252 implements MigrationInterface {
  name = 'AddSupportTables1710310565252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "support" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "raisedBy" character varying NOT NULL, "status" character varying NOT NULL, "resolvedOn" TIMESTAMP, "resolveNote" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_54c6021e6f6912eaaee36b3045d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "support"`);
  }
}
