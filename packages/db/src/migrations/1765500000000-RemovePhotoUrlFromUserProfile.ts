import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePhotoUrlFromUserProfile1765500000000 implements MigrationInterface {
  name = 'RemovePhotoUrlFromUserProfile1765500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the photo_url column from user_profiles table
    await queryRunner.query(`
      ALTER TABLE "user_profiles" 
      DROP COLUMN IF EXISTS "photo_url"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore the photo_url column in case of rollback
    await queryRunner.query(`
      ALTER TABLE "user_profiles" 
      ADD COLUMN "photo_url" VARCHAR(512)
    `);
  }
}

