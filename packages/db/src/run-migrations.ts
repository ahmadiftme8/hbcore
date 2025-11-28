import dataSource from "./data-source";

async function main() {
	console.log("🔄 Starting database migrations...\n");

	try {
		if (!dataSource.isInitialized) {
			await dataSource.initialize();
		}

		const migrations = await dataSource.runMigrations();

		if (migrations.length === 0) {
			console.log("✅ No pending migrations");
		} else {
			console.log(`✅ Ran ${migrations.length} migration(s):`);
			for (const migration of migrations) {
				console.log(`   - ${migration.name}`);
			}
		}

		await dataSource.destroy();
		console.log("\n✨ Migrations completed!");
		process.exit(0);
	} catch (error) {
		console.error("💥 Fatal error during migrations:", error);
		if (dataSource.isInitialized) {
			await dataSource.destroy();
		}
		process.exit(1);
	}
}

main();
