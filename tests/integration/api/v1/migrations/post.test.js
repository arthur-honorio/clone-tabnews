import database from "infra/database";

beforeAll(cleanSchema);

async function cleanSchema() {
  await database.query("DROP SCHEMA public cascade; CREATE SCHEMA public;");
}

test("The first POST to api/v1/migrations should get at least one migration", async () => {
  const firsResponse = await migrationPostRequest();
  expect(firsResponse.status).toBe(201);

  const firsResponseBody = await firsResponse.json();
  expect(Array.isArray(firsResponseBody)).toBe(true);
  expect(firsResponseBody.length).toBeGreaterThan(0);
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
