const request = require('supertest');
const app = require('../../src/app');
const { Product, Category } = require('../../src/models/product');
const { ProductFactory } = require('../factories');
const BASE_URL = '/api/products';

describe('Product Routes', () => {

  
  /**
   * Utility function to bulk create products
   */
  async function createProducts(count = 1) {
    const products = [];
    for (let i = 0; i < count; i++) {
      const productData = ProductFactory.build();
      const product = await Product.create(productData);
      products.push(product);
    }
    return products;
  }
  
  /**
   * Utility function to get product count
   */
  async function getProductCount() {
    const response = await request(app)
      .get(BASE_URL)
      .expect(200);
    return response.body.length;
  }
  
  describe('Basic Endpoints', () => {
    test('should return the index page', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toContain('Product Catalog Administration');
    });
    
    test('should be healthy', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/health`)
        .expect(200);
      
      expect(response.body.message).toBe('OK');
    });
  });

  
  
  describe('CREATE Product', () => {
    test('should create a new product', async () => {
      const testProduct = ProductFactory.build();

      
      const response = await request(app)
        .post(BASE_URL)
        .send(testProduct)
        .expect(201);
      
      // Make sure location header is set
      expect(response.headers.location).toBeDefined();
      
      // Check the data is correct
      const newProduct = response.body;
      expect(newProduct.name).toBe(testProduct.name);
      expect(newProduct.description).toBe(testProduct.description);
      expect(newProduct.price).toBe(testProduct.price);
      expect(newProduct.available).toBe(testProduct.available);
      expect(newProduct.category).toBe(testProduct.category);
      
      
      
      
    });
    
    test('should not create a product without a name', async () => {
      const productData = ProductFactory.build();
      delete productData.name;
      

      
      const response = await request(app)
        .post(BASE_URL)
        .send(productData)
        .expect(400);
      
      expect(response.body.error).toBe('Validation Error');
    });
    
    test('should not create a product with no Content-Type', async () => {
      await request(app)
        .post(BASE_URL)
        .send('bad data')
        .expect(415);
    });
    
    test('should not create a product with wrong Content-Type', async () => {
      await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'text/plain')
        .send('some plain text data')
        .expect(415);
    });

    test('should proceed if content type is correct but has extra parameters', async () => {
      const productData = ProductFactory.build();
      const response = await request(app)
        .post(BASE_URL)
        .set('Content-Type', 'application/json; charset=utf-8')
        .send(productData);

      // We expect a 201, not a 415, because the base type is correct.
      expect(response.status).toBe(201);
    });
  });


  test('READ: returns the product and reports missing products', async () => {
    const [product] = await createProducts();
    const response = await request(app).get(`${BASE_URL}/${product.id}`).expect(200);
    expect(response.body).toEqual(product.serialize());
    await request(app).get(`${BASE_URL}/999999`).expect(404);
  });

  test('UPDATE: saves all changed fields', async () => {
    const [product] = await createProducts();
    const changes = ProductFactory.build({ name: 'Updated Hat', available: false });
    const response = await request(app).put(`${BASE_URL}/${product.id}`)
      .send(changes).expect(200);
    expect(response.body).toEqual({ id: product.id, ...changes });
    expect((await Product.findByPk(product.id)).serialize()).toEqual(response.body);
    expect(await getProductCount()).toBe(1);
  });

  test('UPDATE: rejects missing products, invalid bodies, and wrong media types', async () => {
    const [product] = await createProducts();
    await request(app).put(`${BASE_URL}/999999`).send(ProductFactory.build()).expect(404);
    await request(app).put(`${BASE_URL}/${product.id}`).send({ name: '' }).expect(400);
    await request(app).put(`${BASE_URL}/${product.id}`)
      .set('Content-Type', 'text/plain').send('invalid').expect(415);
    expect((await Product.findByPk(product.id)).serialize()).toEqual(product.serialize());
  });

  test('DELETE: removes the product and is idempotent', async () => {
    const [product, retained] = await createProducts(2);
    const response = await request(app).delete(`${BASE_URL}/${product.id}`).expect(204);
    expect(response.text).toBe('');
    expect(await Product.findByPk(product.id)).toBeNull();
    expect(await Product.findByPk(retained.id)).not.toBeNull();
    await request(app).delete(`${BASE_URL}/${product.id}`).expect(204);
    await request(app).get(`${BASE_URL}/${product.id}`).expect(404);
  });

  test('LIST ALL: returns all products or an empty array', async () => {
    expect((await request(app).get(BASE_URL).expect(200)).body).toEqual([]);
    const products = await createProducts(3);
    const response = await request(app).get(BASE_URL).expect(200);
    expect(response.body).toEqual(expect.arrayContaining(products.map(p => p.serialize())));
    expect(response.body).toHaveLength(3);
  });

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

  test('LIST BY CATEGORY: excludes products in other categories', async () => {
    const first = await ProductFactory.create({ category: Category.CLOTHS });
    const second = await ProductFactory.create({ category: Category.CLOTHS });
    await ProductFactory.create({ category: Category.FOOD });
    const response = await request(app).get(BASE_URL)
      .query({ category: Category.CLOTHS }).expect(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(expect.arrayContaining([first.serialize(), second.serialize()]));
  });

  test('LIST BY AVAILABILITY: supports true and false filters', async () => {
    const available = await ProductFactory.create({ available: true });
    const unavailable = await ProductFactory.create({ available: false });
    for (const product of [available, unavailable]) {
      const response = await request(app).get(BASE_URL)
        .query({ availability: String(product.available) }).expect(200);
      expect(response.body).toEqual([product.serialize()]);
    }
  });

  test('LIST: combines filters and rejects invalid query values', async () => {
    const match = await ProductFactory.create({ name: 'Hat', category: Category.CLOTHS, available: false });
    await ProductFactory.create({ name: 'Hat', category: Category.CLOTHS, available: true });
    const response = await request(app).get(BASE_URL)
      .query({ name: 'Hat', category: Category.CLOTHS, availability: 'false' }).expect(200);
    expect(response.body).toEqual([match.serialize()]);
    await request(app).get(BASE_URL).query({ availability: 'invalid' }).expect(400);
    await request(app).get(BASE_URL).query({ category: 'INVALID' }).expect(400);
  });
  
  
});