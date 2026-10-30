// Choose the isolated test database before importing the connection or models.
require('dotenv').config();
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/postgres_test';

const { initializeDatabase, sequelize } = require('../src/database/connection');
const { Product } = require('../src/models/product');

beforeAll(async () => {
  await initializeDatabase();
});

beforeEach(async () => {
  await Product.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
});

afterAll(async () => {
  await sequelize.close();
});

jest.setTimeout(30000);
