import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingCategoryDescription1727691424110
  implements MigrationInterface
{
  name = "AddingCategoryDescription1727691424110";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_category"("id", "name", "description") SELECT "id", "name", "name" AS "description" FROM "category"`
    );
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_category" RENAME TO "category"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" RENAME TO "temporary_category"`
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "category"("id", "name") SELECT "id", "name" FROM "temporary_category"`
    );
    await queryRunner.query(`DROP TABLE "temporary_category"`);
  }
}
