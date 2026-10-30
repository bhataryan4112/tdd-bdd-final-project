# JavaScript submission answers

These snippets come from the completed project files. Paste one answer into each corresponding question. Tests belong inside the existing describe blocks and rely on their file imports and helpers. Routes rely on the router and imports in src/routes/products.js. Web steps rely on the Cucumber World, By, until, and assert imports in the supplied files. Use the complete project when running tests.

Shared BDD background (keep this above the scenarios in features/products.feature):

```gherkin
Feature: The product store service back-end
    As a Product Store Owner
    I need a RESTful catalog service
    So that I can keep track of all my products

Background:
    Given the following products
        | name       | description     | price   | available | category   |
        | Hat        | A red fedora    | 59.95   | True      | CLOTHS     |
        | Shoes      | Blue shoes      | 120.50  | False     | CLOTHS     |
        | Big Mac    | 1/4 lb burger   | 5.99    | True      | FOOD       |
        | Sheets     | Full bed sheets | 87.00   | True      | HOUSEWARES |
```

## Question 1: Task 1 — ProductFactory

File: `tests/factories.js`

```javascript
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
```

## Question 2: Task 2.1 — READ

File: `tests/models/product.test.js`

```javascript
test('should read a product', async () => {
    const productData = ProductFactory.build();
    delete productData.id;
    const savedProduct = await Product.create(productData);
    expect(savedProduct.id).toBeDefined();
    expect(savedProduct.id).not.toBeNull();

    const foundProduct = await Product.findByPk(savedProduct.id);
    expect(foundProduct).not.toBeNull();
    expect(foundProduct.id).toBe(savedProduct.id);
    expect(foundProduct.name).toBe(productData.name);
    expect(foundProduct.description).toBe(productData.description);
    expect(parseFloat(foundProduct.price)).toBe(productData.price);
    expect(foundProduct.available).toBe(productData.available);
    expect(foundProduct.category).toBe(productData.category);
  });
```

## Question 3: Task 2.2 — UPDATE

File: `tests/models/product.test.js`

```javascript
test('should update a product', async () => {
    const productData = ProductFactory.build();
    delete productData.id;
    const savedProduct = await Product.create(productData);
    expect(savedProduct.id).toBeDefined();

    savedProduct.description = 'testing';
    const originalId = savedProduct.id;
    await savedProduct.save();
    expect(savedProduct.id).toBe(originalId);
    expect(savedProduct.description).toBe('testing');

    const products = await Product.findAll();
    expect(products.length).toBe(1);
    expect(products[0].id).toBe(originalId);
    expect(products[0].description).toBe('testing');
  });
```

## Question 4: Task 2.3 — DELETE

File: `tests/models/product.test.js`

```javascript
test('should delete a product', async () => {
    const productData = ProductFactory.build();
    delete productData.id;
    const savedProduct = await Product.create(productData);
    let products = await Product.findAll();
    expect(products.length).toBe(1);

    await savedProduct.destroy();
    products = await Product.findAll();
    expect(products.length).toBe(0);
    expect(await Product.findByPk(savedProduct.id)).toBeNull();
  });
```

## Question 5: Task 2.4 — LIST ALL

File: `tests/models/product.test.js`

```javascript
test('should list all products in the database', async () => {
    let products = await Product.findAll();
    expect(products.length).toBe(0);
    for (let i = 0; i < 5; i++) {
      const productData = ProductFactory.build();
      delete productData.id;
      await Product.create(productData);
    }
    products = await Product.findAll();
    expect(products.length).toBe(5);
  });
```

## Question 6: Task 2.5 — FIND BY NAME

File: `tests/models/product.test.js`

```javascript
test('should find a product by name', async () => {
    const products = await ProductFactory.createList(5);
    const name = products[0].name;
    const count = products.filter(product => product.name === name).length;
    const found = await Product.findByName(name);
    expect(found.length).toBe(count);
    for (const product of found) {
      expect(product.name).toBe(name);
    }
  });
```

## Question 7: Task 2.6 — FIND BY CATEGORY

File: `tests/models/product.test.js`

```javascript
test('should find products by category', async () => {
    const products = await ProductFactory.createList(10);
    const category = products[0].category;
    const count = products.filter(product => product.category === category).length;
    const found = await Product.findByCategory(category);
    expect(found.length).toBe(count);
    for (const product of found) {
      expect(product.category).toBe(category);
    }
  });
```

## Question 8: Task 2.7 — FIND BY AVAILABILITY

File: `tests/models/product.test.js`

```javascript
test('should find products by availability', async () => {
    const products = await ProductFactory.createList(10);
    const available = products[0].available;
    const count = products.filter(product => product.available === available).length;
    const found = await Product.findByAvailability(available);
    expect(found.length).toBe(count);
    for (const product of found) {
      expect(product.available).toBe(available);
    }
  });
```

## Question 9: Task 3.1 — READ

File: `tests/routes/products.test.js`

```javascript
test('READ: returns the product and reports missing products', async () => {
    const [product] = await createProducts();
    const response = await request(app).get(`${BASE_URL}/${product.id}`).expect(200);
    expect(response.body).toEqual(product.serialize());
    await request(app).get(`${BASE_URL}/999999`).expect(404);
  });
```

## Question 10: Task 3.2 — UPDATE

File: `tests/routes/products.test.js`

```javascript
test('should update an existing product', async () => {
    const productData = ProductFactory.build();
    delete productData.id;
    let response = await request(app).post(BASE_URL).send(productData).expect(201);
    const newProduct = response.body;
    const originalId = newProduct.id;
    newProduct.description = 'unknown';
    response = await request(app).put(`${BASE_URL}/${newProduct.id}`)
      .send(newProduct).expect(200);
    const updatedProduct = response.body;
    expect(updatedProduct.id).toBe(originalId);
    expect(updatedProduct.description).toBe('unknown');
    const retrieved = await request(app).get(`${BASE_URL}/${originalId}`).expect(200);
    expect(retrieved.body.description).toBe('unknown');
  });
```

## Question 11: Task 3.3 — DELETE

File: `tests/routes/products.test.js`

```javascript
test('should delete a product', async () => {
    const products = await createProducts(5);
    const initialCount = await getProductCount();
    const product = products[0];
    const response = await request(app).delete(`${BASE_URL}/${product.id}`).expect(204);
    expect(response.body).toEqual({});
    expect(response.text).toBe('');
    await request(app).get(`${BASE_URL}/${product.id}`).expect(404);
    const newCount = await getProductCount();
    expect(newCount).toBe(initialCount - 1);
  });
```

## Question 12: Task 3.4 — LIST ALL

File: `tests/routes/products.test.js`

```javascript
test('should list all products', async () => {
    await createProducts(5);
    const response = await request(app).get(BASE_URL).expect(200);
    expect(response.body.length).toBe(5);
  });
```

## Question 13: Task 3.5 — LIST BY NAME

File: `tests/routes/products.test.js`

```javascript
test('LIST BY NAME: returns every exact name match', async () => {
    const first = await ProductFactory.create({ name: 'Hat' });
    const second = await ProductFactory.create({ name: 'Hat' });
    await ProductFactory.create({ name: 'Shoes' });
    const response = await request(app).get(BASE_URL).query({ name: 'Hat' }).expect(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(expect.arrayContaining([first.serialize(), second.serialize()]));
    expect((await request(app).get(BASE_URL).query({ name: 'Missing' }).expect(200)).body)
      .toEqual([]);
  });
```

## Question 14: Task 3.6 — LIST BY CATEGORY

File: `tests/routes/products.test.js`

```javascript
test('LIST BY CATEGORY: excludes products in other categories', async () => {
    const first = await ProductFactory.create({ category: Category.CLOTHS });
    const second = await ProductFactory.create({ category: Category.CLOTHS });
    await ProductFactory.create({ category: Category.FOOD });
    const response = await request(app).get(BASE_URL)
      .query({ category: Category.CLOTHS }).expect(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(expect.arrayContaining([first.serialize(), second.serialize()]));
  });
```

## Question 15: Task 3.7 — LIST BY AVAILABILITY

File: `tests/routes/products.test.js`

```javascript
test('LIST BY AVAILABILITY: supports true and false filters', async () => {
    const available = await ProductFactory.create({ available: true });
    const unavailable = await ProductFactory.create({ available: false });
    for (const product of [available, unavailable]) {
      const response = await request(app).get(BASE_URL)
        .query({ availability: String(product.available) }).expect(200);
      expect(response.body).toEqual([product.serialize()]);
    }
  });
```

## Question 16: Task 4.1 — READ

File: `src/routes/products.js`

```javascript
router.get('/:id(\\d+)', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Not Found', message: `Product ${req.params.id} was not found` });
    }
    return res.status(200).json(product.serialize());
  } catch (error) {
    next(error);
  }
});
```

## Question 17: Task 4.2 — UPDATE

File: `src/routes/products.js`

```javascript
router.put('/:id(\\d+)', checkContentType('application/json'), validateProduct, async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Not Found', message: `Product ${req.params.id} was not found` });
    }
    await product.update(req.body);
    return res.status(200).json(product.serialize());
  } catch (error) {
    next(error);
  }
});
```

## Question 18: Task 4.3 — DELETE

File: `src/routes/products.js`

```javascript
router.delete('/:id(\\d+)', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Not Found', message: `Product ${req.params.id} was not found` });
    }
    await product.destroy();
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});
```

## Question 19: Task 4.4 — LIST ALL / LIST BY NAME / LIST BY CATEGORY / LIST BY AVAILABILITY

File: `src/routes/products.js`

```javascript
router.get('/', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.name !== undefined) {
      if (typeof req.query.name !== 'string') {
        return res.status(400).json({ error: 'Bad Request', message: 'name must be a string' });
      }
      where.name = req.query.name;
    }
    if (req.query.category !== undefined) {
      if (!Object.values(Category).includes(req.query.category)) {
        return res.status(400).json({ error: 'Bad Request', message: 'Invalid category' });
      }
      where.category = req.query.category;
    }
    if (req.query.availability !== undefined) {
      if (!['true', 'false'].includes(req.query.availability)) {
        return res.status(400).json({ error: 'Bad Request', message: 'availability must be true or false' });
      }
      where.available = req.query.availability === 'true';
    }
    const products = await Product.findAll({ where, order: [['id', 'ASC']] });
    return res.status(200).json(products.map(product => product.serialize()));
  } catch (error) {
    next(error);
  }
});
```

## Question 20: Task 5 — Load background products

File: `features/step_definitions/load_steps.js`

```javascript
const { Given } = require('@cucumber/cucumber');
const axios = require('axios');

Given('the following products', async function (dataTable) {
  const apiUrl = `${this.parameters.baseUrl}/api/products`;
  const response = await axios.get(apiUrl);
  for (const product of response.data) {
    await axios.delete(`${apiUrl}/${product.id}`);
  }

  for (const row of dataTable.hashes()) {
    const availability = row.available.toLowerCase();
    if (!['true', 'false'].includes(availability)) {
      throw new Error(`Invalid background availability: ${row.available}`);
    }
    await axios.post(apiUrl, {
      name: row.name,
      description: row.description,
      price: Number(row.price),
      available: availability === 'true',
      category: row.category.toUpperCase()
    });
  }
});
```

## Question 21: Task 6.1 — Read a Product

File: `features/products.feature`

```gherkin
Scenario: Read a Product
    When I visit the "Home Page"
    And I set the "Name" to "Hat"
    And I press the "Search" button
    Then I should see the message "Success"
    When I copy the "Id" field
    And I press the "Clear" button
    And I paste the "Id" field
    And I press the "Retrieve" button
    Then I should see the message "Success"
    And I should see "Hat" in the "Name" field
    And I should see "A red fedora" in the "Description" field
    And I should see "59.95" in the "Price" field
    And I should see "True" in the "Available" dropdown
    And I should see "Cloths" in the "Category" dropdown
```

## Question 22: Task 6.2 — Update a Product

File: `features/products.feature`

```gherkin
Scenario: Update a Product
    When I visit the "Home Page"
    And I set the "Name" to "Hat"
    And I press the "Search" button
    Then I should see the message "Success"
    And I should see "A red fedora" in the "Description" field
    When I change "Name" to "Fedora"
    And I press the "Update" button
    Then I should see the message "Success"
    When I copy the "Id" field
    And I press the "Clear" button
    And I paste the "Id" field
    And I press the "Retrieve" button
    Then I should see the message "Success"
    And I should see "Fedora" in the "Name" field
    When I press the "Clear" button
    And I press the "Search" button
    Then I should see the message "Success"
    And I should see "Fedora" in the results
    And I should not see "Hat" in the results
```

## Question 23: Task 6.3 — Delete a Product

File: `features/products.feature`

```gherkin
Scenario: Delete a Product
    When I visit the "Home Page"
    And I set the "Name" to "Hat"
    And I press the "Search" button
    Then I should see the message "Success"
    And I should see "A red fedora" in the "Description" field
    When I copy the "Id" field
    And I press the "Clear" button
    And I paste the "Id" field
    And I press the "Delete" button
    Then I should see the message "Product has been Deleted!"
    When I press the "Clear" button
    And I press the "Search" button
    Then I should see the message "Success"
    And I should not see "Hat" in the results
```

## Question 24: Task 6.4 — List all Products

File: `features/products.feature`

```gherkin
Scenario: List all products
    When I visit the "Home Page"
    And I press the "Clear" button
    And I press the "Search" button
    Then I should see the message "Success"
    And I should see "Hat" in the results
    And I should see "Shoes" in the results
    And I should see "Big Mac" in the results
    And I should see "Sheets" in the results
```

## Question 25: Task 6.5 — Search Products by Category

File: `features/products.feature`

```gherkin
Scenario: Search by category
    When I visit the "Home Page"
    And I press the "Clear" button
    And I select "Food" in the "Category" dropdown
    And I press the "Search" button
    Then I should see the message "Success"
    And I should see "Big Mac" in the results
    And I should not see "Hat" in the results
    And I should not see "Shoes" in the results
    And I should not see "Sheets" in the results
```

## Question 26: Task 6.6 — Search Products by Availability

File: `features/products.feature`

```gherkin
Scenario: Search by available
    When I visit the "Home Page"
    And I press the "Clear" button
    And I select "True" in the "Available" dropdown
    And I press the "Search" button
    Then I should see the message "Success"
    And I should see "Hat" in the results
    And I should see "Big Mac" in the results
    And I should see "Sheets" in the results
    And I should not see "Shoes" in the results
```

## Question 27: Task 6.7 — Search Products by Name

File: `features/products.feature`

```gherkin
Scenario: Search by name
    When I visit the "Home Page"
    And I set the "Name" to "Hat"
    And I press the "Search" button
    Then I should see the message "Success"
    And I should see "Hat" in the "Name" field
    And I should see "A red fedora" in the "Description" field
```

## Question 28: Task 7.1 — Button click

File: `features/step_definitions/web_steps.js`

```javascript
When('I press the {string} button', async function (buttonText) {
  const button = await this.driver.findElement(By.id(buttonText.toLowerCase() + '-btn'));
  await this.driver.wait(until.elementIsVisible(button), this.parameters.waitTimeout);
  // Every API action clears the old flash message before issuing its request.
  await this.driver.executeScript("document.getElementById('flash_message').textContent = ''; ");
  await button.click();
  if (buttonText.toLowerCase() !== 'clear') {
    await this.driver.wait(async () => {
      const message = await this.driver.findElement(By.id('flash_message')).getText();
      return message.trim().length > 0;
    }, this.parameters.waitTimeout, `No response after clicking ${buttonText}`);
  }
});
```

## Question 29: Task 7.2 — Text is present

File: `features/step_definitions/web_steps.js`

```javascript
Then('I should see {string} in the results', async function (text) {
  const results = await this.driver.wait(
    until.elementLocated(By.id('search_results')), this.parameters.waitTimeout
  );
  await this.driver.wait(
    until.elementTextContains(results, text), this.parameters.waitTimeout
  );
  const resultsText = await results.getText();
  assert.ok(resultsText.includes(text), `Expected to see "${text}" in search results`);
});
```

## Question 30: Task 7.3 — Text is absent

File: `features/step_definitions/web_steps.js`

```javascript
Then('I should not see {string} in the results', async function (text) {
  const results = await this.driver.wait(
    until.elementLocated(By.id('search_results')), this.parameters.waitTimeout
  );
  await this.driver.wait(async () => !(await results.getText()).includes(text),
    this.parameters.waitTimeout);
  const resultsText = await results.getText();
  assert.ok(!resultsText.includes(text), `Expected not to see "${text}" in search results`);
});
```

## Question 31: Task 7.4 — Message is present

File: `features/step_definitions/web_steps.js`

```javascript
Then('I should see the message {string}', async function (expectedMessage) {
  await this.driver.wait(async () => {
    const message = await this.driver.findElement(By.id('flash_message')).getText();
    return message.includes(expectedMessage);
  }, this.parameters.waitTimeout, `Expected message "${expectedMessage}"`);
});
```
