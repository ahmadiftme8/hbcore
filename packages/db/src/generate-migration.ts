import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import dataSource from './data-source';

/**
 * Gets migration timestamp (same logic as TypeORM's CommandUtils.getTimestamp)
 */
function getTimestamp(): number {
  return Date.now();
}

async function main() {
  const migrationName = process.argv[2];

  if (!migrationName) {
    console.error('❌ Migration name is required');
    console.error('Usage: bun run src/generate-migration.ts <MigrationName>');
    process.exit(1);
  }

  try {
    const timestamp = getTimestamp();
    const migrationsDir = resolve(process.cwd(), 'src/migrations');
    const filename = `${timestamp}-${migrationName}.ts`;
    const fullPath = resolve(migrationsDir, filename);

    console.log(`🔄 Generating migration: ${migrationName}...\n`);

    // Initialize data source
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    // Generate SQL diff
    const sqlInMemory = await dataSource.driver.createSchemaBuilder().log();

    if (sqlInMemory.upQueries.length === 0) {
      console.log('✅ No changes in database schema were found.');
      await dataSource.destroy();
      process.exit(0);
    }

    // Build migration file content
    const upSqls: string[] = [];
    const downSqls: string[] = [];

    sqlInMemory.upQueries.forEach((upQuery) => {
      upSqls.push(
        `        await queryRunner.query(\`${upQuery.query.replace(
          /`/g,
          '\\`',
        )}\`${upQuery.parameters?.length ? `, ${JSON.stringify(upQuery.parameters)}` : ''});`,
      );
    });

    sqlInMemory.downQueries.forEach((downQuery) => {
      downSqls.push(
        `        await queryRunner.query(\`${downQuery.query.replace(
          /`/g,
          '\\`',
        )}\`${downQuery.parameters?.length ? `, ${JSON.stringify(downQuery.parameters)}` : ''});`,
      );
    });

    // Convert migration name to PascalCase
    const pascalCaseName = migrationName
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    const className = `${pascalCaseName}${timestamp}`;

    const fileContent = `import { MigrationInterface, QueryRunner } from "typeorm";

export class ${className} implements MigrationInterface {
	name = "${className}";

	public async up(queryRunner: QueryRunner): Promise<void> {
${upSqls.join('\n')}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
${downSqls.join('\n')}
	}
}
`;

    // Write migration file
    writeFileSync(fullPath, fileContent, 'utf8');

    console.log(`✅ Migration file has been generated: ${filename}`);
    console.log(`   Location: ${fullPath}\n`);

    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('💥 Failed to generate migration:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

main();
