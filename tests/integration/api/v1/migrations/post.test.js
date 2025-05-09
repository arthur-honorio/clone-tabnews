import database from "infra/database";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("DROP SCHEMA public cascade; CREATE SCHEMA public;");
});

test("The first POST to api/v1/migrations should get at least one migration", async () => {
  const firstResponse = await migrationPostRequest();
  expect(firstResponse.status).toBe(201);

  const firstResponseBody = await firstResponse.json();
  expect(Array.isArray(firstResponseBody)).toBe(true);
  expect(firstResponseBody.length).toBeGreaterThan(0);
});

test("The second POST to api/v1/migrations should get 0 migrations left", async () => {
  const secondResponse = await migrationPostRequest();
  expect(secondResponse.status).toBe(200);

  const secondResponseBody = await secondResponse.json();
  expect(Array.isArray(secondResponseBody)).toBe(true);
  expect(secondResponseBody.length).toEqual(0);
});

async function migrationPostRequest() {
  const migrationsApiURL = "http://localhost:3000/api/v1/migrations";
  return await fetch(migrationsApiURL, {
    method: "POST",
  });
}
