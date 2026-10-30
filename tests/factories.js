const { faker } = require('@faker-js/faker');
const { Product, Category } = require('../src/models/product');

class ProductFactory {
  static build(overrides = {}) {
    const product = {
      id: faker.number.int({ min: 1, max: 1000 }),
      name: faker.helpers.arrayElement(['Hat', 'Shoes', 'Big Mac', 'Sheets', 'Hammer']),
      description: faker.lorem.paragraph().slice(0, 250),
      price: parseFloat(faker.commerce.price({ min: 0.5, max: 2000.0, dec: 2 })),
      available: faker.datatype.boolean(),
      category: faker.helpers.arrayElement(Object.values(Category))
    };
    return Object.assign(product, overrides);
  }

  static buildList(count, overrides = {}) {
    return Array.from({ length: count }, () => this.build(overrides));
  }

  static async create(overrides = {}) {
    const productData = this.build(overrides);
    delete productData.id;
    return Product.create(productData);
  }

  static async createList(count, overrides = {}) {
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push(await this.create(overrides));
    }
    return products;
  }
}

module.exports = { ProductFactory };
