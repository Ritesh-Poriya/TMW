import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTemplateTables1709034601103 implements MigrationInterface {
  name = 'InitTemplateTables1709034601103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "industry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "logoUrl" character varying, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_fc3e38485cff79e9fbba8f13831" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "isPublic" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "industryId" uuid, "parentId" uuid, "createdByUserId" uuid, "updatedByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "input_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "options" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_44bfcb298397df7f65acffa0532" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "linked_sub_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "refId" character varying, "order" integer NOT NULL, "linkedCategoryId" uuid, CONSTRAINT "PK_935039d9853a018d10fa0841ab1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "order" integer NOT NULL, "inputTypeOptions" json NOT NULL, "enableCamera" boolean NOT NULL, "enableComments" boolean NOT NULL, "enableTrainingInfo" boolean NOT NULL, "trainingInfoOptions" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "linkedCategoryId" uuid, "linkedSubCategoryId" uuid, "inputTypeId" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "linked_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refId" character varying NOT NULL, "name" character varying NOT NULL, "order" integer NOT NULL, "templateId" uuid, CONSTRAINT "PK_ab69092336d453b6d99f4e3c64e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "isPublic" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "industryId" uuid, "createdByUserId" uuid, "updatedByUserId" uuid, "deletedByUserId" uuid, CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_e7efc6a2493a9d11207e5e0a012" FOREIGN KEY ("industryId") REFERENCES "industry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_1c35552e6951d0a8654367ae3a7" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_ea6acf7716d4eb015393c1a6d6a" FOREIGN KEY ("updatedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_0714f4dd9124511468bee08926d" FOREIGN KEY ("deletedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "linked_sub_category" ADD CONSTRAINT "FK_f4e6379c9925b7286b7516e4a88" FOREIGN KEY ("linkedCategoryId") REFERENCES "linked_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_84d2b9bf2bba85c45399cded54e" FOREIGN KEY ("linkedCategoryId") REFERENCES "linked_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_0841afa065ddd9d9a45a79f55a2" FOREIGN KEY ("linkedSubCategoryId") REFERENCES "linked_sub_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_bdfa82f3ecb0f1ca69f0ce394bd" FOREIGN KEY ("inputTypeId") REFERENCES "input_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "linked_category" ADD CONSTRAINT "FK_2599a464de94c9a720a95fa625e" FOREIGN KEY ("templateId") REFERENCES "template"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ADD CONSTRAINT "FK_430963c2445f2e7f64602b46517" FOREIGN KEY ("industryId") REFERENCES "industry"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ADD CONSTRAINT "FK_d3bdec28caf58bf57762a05dfb7" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ADD CONSTRAINT "FK_c0025ffbca5072ad7d4a8f6c788" FOREIGN KEY ("updatedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" ADD CONSTRAINT "FK_57ca737ea123c08e92163e23ad4" FOREIGN KEY ("deletedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "template" DROP CONSTRAINT "FK_57ca737ea123c08e92163e23ad4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" DROP CONSTRAINT "FK_c0025ffbca5072ad7d4a8f6c788"`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" DROP CONSTRAINT "FK_d3bdec28caf58bf57762a05dfb7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "template" DROP CONSTRAINT "FK_430963c2445f2e7f64602b46517"`,
    );
    await queryRunner.query(
      `ALTER TABLE "linked_category" DROP CONSTRAINT "FK_2599a464de94c9a720a95fa625e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_bdfa82f3ecb0f1ca69f0ce394bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_0841afa065ddd9d9a45a79f55a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_84d2b9bf2bba85c45399cded54e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "linked_sub_category" DROP CONSTRAINT "FK_f4e6379c9925b7286b7516e4a88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_0714f4dd9124511468bee08926d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_ea6acf7716d4eb015393c1a6d6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_1c35552e6951d0a8654367ae3a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_e7efc6a2493a9d11207e5e0a012"`,
    );
    await queryRunner.query(`DROP TABLE "template"`);
    await queryRunner.query(`DROP TABLE "linked_category"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TABLE "linked_sub_category"`);
    await queryRunner.query(`DROP TABLE "input_type"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "industry"`);
  }
}
