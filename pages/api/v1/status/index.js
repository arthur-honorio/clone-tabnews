import database from "infra/database.js";

async function status(req, res) {
  const updatedAt = new Date().toISOString();

  const postgresVersionResult = await database.query("SHOW server_version;");
  const postgresVersionValue = postgresVersionResult.rows[0].server_version;

  const maxDBConnectionsResult = await database.query("SHOW max_connections;");
  const maxDBConnectionsValue = +maxDBConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const currentDBConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const currentDBConnectionsValue = currentDBConnectionsResult.rows[0].count;

  res.json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: postgresVersionValue,
        max_connections: maxDBConnectionsValue,
        current_connections: currentDBConnectionsValue,
      },
    },
  });
}

export default status;
