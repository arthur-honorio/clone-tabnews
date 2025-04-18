import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(req, res) {
  const dbClient = await database.getNewClient();
  const migrationsConfig = {
    dbClient,
    migrationsTable: "pgmigrations",
    direction: "up",
    dir: join("infra", "migrations"),
    verbose: true,
  };

  if (req.method == "GET") {
    migrationsConfig.dryRun = true;
    const pendingMigrations = await migrationRunner(migrationsConfig);
    dbClient.end();
    return res.status(200).json(pendingMigrations);
  }

  if (req.method == "POST") {
    const migratedMigrations = await migrationRunner(migrationsConfig);
    dbClient.end();

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }

    return res.status(200).json(migratedMigrations);
  }

  return res.status(405).end();
}
