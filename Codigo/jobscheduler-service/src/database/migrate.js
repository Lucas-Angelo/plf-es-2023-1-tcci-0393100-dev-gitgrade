/* eslint-disable @typescript-eslint/no-var-requires */
require("ts-node/register");

require("./umzug").migrator.runAsCLI();

// How to create: npm run migrate:create -- migrationsName.ts
