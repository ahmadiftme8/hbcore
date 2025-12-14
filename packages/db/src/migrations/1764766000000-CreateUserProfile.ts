import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserProfile1764766000000 implements MigrationInterface {
  name = 'CreateUserProfile1764766000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create user_profiles table
    await queryRunner.query(`
      CREATE TABLE "user_profiles" (
        "id" SERIAL NOT NULL,
        "user_id" INTEGER NOT NULL,
        "email" VARCHAR(255),
        "phone" VARCHAR(20),
        "name" VARCHAR(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_user_profiles_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_profiles_user_id" FOREIGN KEY ("user_id") 
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_user_profiles_user_id" UNIQUE ("user_id")
      )
    `);

    // Add index for user_id lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_user_profiles_user_id" 
      ON "user_profiles" ("user_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_profiles_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_profiles"`);
  }
}
