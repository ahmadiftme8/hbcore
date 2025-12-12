import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePhoneAuthCredential1765490694000 implements MigrationInterface {
  name = 'CreatePhoneAuthCredential1765490694000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create phone_auth_credentials table
    await queryRunner.query(`
      CREATE TABLE "phone_auth_credentials" (
        "id" SERIAL NOT NULL,
        "user_id" INTEGER NOT NULL,
        "provider" VARCHAR(20) NOT NULL DEFAULT 'phone',
        "phone" VARCHAR(20) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_phone_auth_credentials_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_phone_auth_credentials_user_id" FOREIGN KEY ("user_id") 
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_phone_auth_credentials_phone" UNIQUE ("phone")
      )
    `);

    // Create index for user_id lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_phone_auth_credentials_user_id" 
      ON "phone_auth_credentials" ("user_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_phone_auth_credentials_user_id"
    `);

    // Drop table
    await queryRunner.query(`
      DROP TABLE IF EXISTS "phone_auth_credentials"
    `);
  }
}
