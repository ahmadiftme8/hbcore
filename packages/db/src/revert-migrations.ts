import dataSource from "./data-source";

async function main() {
	console.log("🔄 Reverting last migration...\n");

	try {
		if (!dataSource.isInitialized) {
			await dataSource.initialize();
		}

		await dataSource.undoLastMigration();
		console.log("✅ Reverted last migration");

		await dataSource.destroy();
		console.log("\n✨ Migration revert completed!");
		process.exit(0);
	} catch (error) {
		console.error("💥 Fatal error during migration revert:", error);
		if (dataSource.isInitialized) {
			await dataSource.destroy();
		}
		process.exit(1);
	}
}

main();
