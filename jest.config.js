const dotenv = require("dotenv");
dotenv.config({ path: ".env.development" });

const nextJest = require("next/jest");

/** @type {import('jest').Config} */
const jestConfigFactory = nextJest({
  dir: ".",
});
const jestConfig = jestConfigFactory({
  moduleDirectories: ["node_modules", "<rootDir>"],
});

module.exports = jestConfig;
