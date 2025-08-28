import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingDescription31756393791060 implements MigrationInterface {
    name = 'AddingDescription31756393791060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad" ADD "description3" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad" DROP COLUMN "description3"`);
    }

}
