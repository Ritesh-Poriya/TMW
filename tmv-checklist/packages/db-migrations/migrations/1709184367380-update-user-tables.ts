import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTables1709184367380 implements MigrationInterface {
  name = 'UpdateUserTables1709184367380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('SUPER_ADMIN', 'MASTER_ADMIN', 'ADMIN', 'TECHNICIAN')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum" USING "role"::"text"::"public"."user_role_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'SUPER_ADMIN'`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_role_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum_old" AS ENUM('ADMIN', 'SUPER_ADMIN', 'MASTER_ADMIN')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum_old" USING "role"::"text"::"public"."user_role_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'SUPER_ADMIN'`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_role_enum_old" RENAME TO "user_role_enum"`,
    );
  }
}
