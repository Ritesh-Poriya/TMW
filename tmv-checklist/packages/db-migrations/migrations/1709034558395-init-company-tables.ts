import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitCompanyTables1709034558395 implements MigrationInterface {
  name = 'InitCompanyTables1709034558395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "billing_contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_48de48046d2489668bf5f3afaea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company_tenant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenantName" character varying NOT NULL, "renewalDate" TIMESTAMP NOT NULL, "maxUsers" integer NOT NULL, "active" boolean NOT NULL DEFAULT true, "tenantMasterAdminEmail" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_1aa8af5388068da8b3cf539008d" UNIQUE ("tenantName"), CONSTRAINT "PK_d37ba2ef0271f80021e0b6ef926" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "billingContactId" uuid, "companyTenantId" uuid, CONSTRAINT "REL_32010e086f41ac1e78e36fd87c" UNIQUE ("billingContactId"), CONSTRAINT "REL_b1c149768bbe55e5f41aa24b89" UNIQUE ("companyTenantId"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "FK_32010e086f41ac1e78e36fd87cd" FOREIGN KEY ("billingContactId") REFERENCES "billing_contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "FK_b1c149768bbe55e5f41aa24b89a" FOREIGN KEY ("companyTenantId") REFERENCES "company_tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "FK_b1c149768bbe55e5f41aa24b89a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "FK_32010e086f41ac1e78e36fd87cd"`,
    );
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "company_tenant"`);
    await queryRunner.query(`DROP TABLE "billing_contact"`);
  }
}
