import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFirebaseMetadataTables1764713055980 implements MigrationInterface {
  name = 'CreateFirebaseMetadataTables1764713055980';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create firebase_auth_credentials table first
    await queryRunner.query(`
      CREATE TABLE "firebase_auth_credentials" (
        "id" SERIAL NOT NULL,
        "user_id" INTEGER NOT NULL,
        "provider" VARCHAR(20) NOT NULL DEFAULT 'firebase',
        "firebase_uid" VARCHAR(128) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_firebase_auth_credentials_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_firebase_auth_credentials_user_id" FOREIGN KEY ("user_id") 
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_firebase_auth_credentials_firebase_uid" UNIQUE ("firebase_uid")
      )
    `);

    // Create index for user_id lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_firebase_auth_credentials_user_id" 
      ON "firebase_auth_credentials" ("user_id")
    `);

    // Create firebase_user_metadata table
    await queryRunner.query(`
      CREATE TABLE "firebase_user_metadata" (
        "id" SERIAL NOT NULL,
        "firebase_auth_credential_id" INTEGER NOT NULL,
        "email_verified" BOOLEAN NOT NULL DEFAULT false,
        "disabled" BOOLEAN NOT NULL DEFAULT false,
        "firebase_created_at" TIMESTAMP,
        "firebase_last_sign_in_at" TIMESTAMP,
        "additional_metadata" JSONB,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_firebase_user_metadata_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_firebase_user_metadata_credential_id" FOREIGN KEY ("firebase_auth_credential_id") 
          REFERENCES "firebase_auth_credentials"("id") ON DELETE CASCADE
      )
    `);

    // Add unique constraint for firebase_auth_credential_id
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_firebase_user_metadata_credential_id" 
      ON "firebase_user_metadata" ("firebase_auth_credential_id") 
      WHERE "deleted_at" IS NULL
    `);

    // Create firebase_custom_claims table
    await queryRunner.query(`
      CREATE TABLE "firebase_custom_claims" (
        "id" SERIAL NOT NULL,
        "firebase_auth_credential_id" INTEGER NOT NULL,
        "claim_key" VARCHAR(255) NOT NULL,
        "claim_value" JSONB NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_firebase_custom_claims_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_firebase_custom_claims_credential_id" FOREIGN KEY ("firebase_auth_credential_id") 
          REFERENCES "firebase_auth_credentials"("id") ON DELETE CASCADE
      )
    `);

    // Add unique constraint for firebase_auth_credential_id + claim_key combination
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_firebase_custom_claims_credential_key" 
      ON "firebase_custom_claims" ("firebase_auth_credential_id", "claim_key") 
      WHERE "deleted_at" IS NULL
    `);

    // Add index for firebase_auth_credential_id lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_firebase_custom_claims_credential_id" 
      ON "firebase_custom_claims" ("firebase_auth_credential_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_firebase_custom_claims_credential_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_firebase_custom_claims_credential_key"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "firebase_custom_claims"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_firebase_user_metadata_credential_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "firebase_user_metadata"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_firebase_auth_credentials_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "firebase_auth_credentials"`);
  }
}
