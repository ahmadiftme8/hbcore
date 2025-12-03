import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFirstnameLastnameToUserProfile1764769000000 implements MigrationInterface {
  name = 'AddFirstnameLastnameToUserProfile1764769000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add firstname and lastname columns to user_profiles table
    await queryRunner.query(`
      ALTER TABLE "user_profiles"
      ADD COLUMN "firstname" VARCHAR(255),
      ADD COLUMN "lastname" VARCHAR(255)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove firstname and lastname columns
    await queryRunner.query(`
      ALTER TABLE "user_profiles"
      DROP COLUMN IF EXISTS "lastname",
      DROP COLUMN IF EXISTS "firstname"
    `);
  }
}

