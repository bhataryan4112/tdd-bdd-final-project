# Product Catalog — TDD / BDD Final Project (JavaScript)

Express and Sequelize product service with Jest/Supertest tests and Selenium/Cucumber UI scenarios.

## Run in the course lab

Use the course Cloud IDE with Node.js, PostgreSQL, Firefox and geckodriver available. Install dependencies with `npm ci`. Create a `.env` file using `.env.example` if you do not already have one, and set `DATABASE_URL` to your application database. Set `TEST_DATABASE_URL` to a **different**, dedicated test database. Both databases must already exist; the application creates its tables automatically.

For example, with PostgreSQL running using the lab's default credentials, create the test database once:

```sh
node -e 'const { Client } = require("pg"); (async () => { const client = new Client({ connectionString: "postgresql://postgres:postgres@localhost:5432/postgres" }); await client.connect(); try { await client.query("CREATE DATABASE postgres_test"); } finally { await client.end(); } })().catch(error => { console.error(error); process.exitCode = 1; });'
```

Tests reset tables in `TEST_DATABASE_URL`, which defaults to `postgresql://postgres:postgres@localhost:5432/postgres_test`. Use a database reserved for tests. Run these checks:

```sh
npm test
npm run lint
npm run bdd -- --dry-run --format summary
```

Start the application in a separate terminal:

```sh
npm start
```

Run the UI scenarios against the application:

```sh
npm run bdd -- --format summary
```

BDD reloads the four background products before each scenario. Use an application database reserved for the lab. Firefox is the default browser. To use installed Chrome instead:

```sh
BROWSER=chrome npm run bdd -- --format summary
```

`BASE_URL` defaults to `http://localhost:8080`; it can be overridden for BDD. `WAIT_SECONDS` defaults to 5.

## API

| Method | Path | Result |
| --- | --- | --- |
| POST | `/api/products` | Create a validated product; 201 and Location header |
| GET | `/api/products/:id` | Read a product; 200 or 404 |
| PUT | `/api/products/:id` | Replace product fields; 200 or 404 |
| DELETE | `/api/products/:id` | Delete; 204, including repeated deletes |
| GET | `/api/products` | List all; 200 and an array |
| GET | `/api/products?name=Hat` | Match an exact name |
| GET | `/api/products?category=CLOTHS` | Match a category |
| GET | `/api/products?availability=false` | Match availability |

Search parameters can be combined. Availability accepts the strings `true` and `false`; invalid availability or category returns 400. The API uses `availability` in the query string and `available` in product JSON, matching the supplied UI.

## Submission

`SUBMISSION_ANSWERS.md` contains all 31 answers in the same order as the assignment, including the shared Background for the feature scenarios. For AI grading, paste the relevant code block. For peer grading, link to the corresponding file after incorporating the changes into your GitHub repository.

## Verified results

- Jest: 25 tests passed across 2 suites, using real PostgreSQL 17.
- ESLint: passed.
- Cucumber dry run: all 9 scenarios and 118 steps matched.
- Full Selenium/Cucumber run: 9 scenarios and 118 steps passed with headless Chrome.
- Statement coverage of model and routes: 89.55%.

The verification used separate temporary databases for Jest and the UI service. Firefox remains supported by the configuration but was not exercised in this verification. These results are verification of the implementation, not a course grading result.
