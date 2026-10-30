const { Product, Category } = require('../../src/models/product');
const { ProductFactory } = require('../factories');

describe('Product Model', () => {


  
  describe('Product Creation', () => {
    test('should create a product and assert that it exists', () => {
      const productData = {
        name: 'Fedora',
        description: 'A red hat',
        price: 12.50,
        available: true,
        category: Category.CLOTHS
      };
      
      const product = new Product(productData);
      
      expect(product).toBeDefined();
      expect(product.id).toBeNull(); // Not saved yet
      expect(product.name).toBe('Fedora');
      expect(product.description).toBe('A red hat');
      expect(product.available).toBe(true);
      expect(product.price).toBe(12.50);
      expect(product.category).toBe(Category.CLOTHS);
    });
    
    test('should add a product to the database', async () => {
      // Check database is empty
      const products = await Product.findAll();
      expect(products).toEqual([]);
      
      // Create product using factory
      const productData = ProductFactory.build();
      delete productData.id; // Remove ID so database assigns one
      
      const product = await Product.create(productData);
      
      // Assert that it was assigned an id and shows up in the database
      expect(product.id).toBeDefined();
      
      const allProducts = await Product.findAll();
      expect(allProducts.length).toBe(1);
      
      // Check that it matches the original product
      const newProduct = allProducts[0];
      expect(newProduct.name).toBe(productData.name);
      expect(newProduct.description).toBe(productData.description);
      expect(parseFloat(newProduct.price)).toBe(productData.price);
      expect(newProduct.available).toBe(productData.available);
      expect(newProduct.category).toBe(productData.category);
    });
  });
  
  test('READ: finds a saved product by ID', async () => {
    const original = await ProductFactory.create();
    const found = await Product.findByPk(original.id);
    expect(found.serialize()).toEqual(original.serialize());
    expect(await Product.findByPk(original.id + 1000)).toBeNull();
  });

  test('UPDATE: persists changed product fields', async () => {
    const product = await ProductFactory.create();
    const changes = ProductFactory.build({ name: 'Updated Hat', available: false });
    await product.update(changes);
    const found = await Product.findByPk(product.id);
    expect(found.serialize()).toEqual({ id: product.id, ...changes });
    expect(await Product.count()).toBe(1);
  });

  test('DELETE: removes only the selected product', async () => {
    const product = await ProductFactory.create();
    const retained = await ProductFactory.create();
    await product.destroy();
    expect(await Product.findByPk(product.id)).toBeNull();
    expect(await Product.findByPk(retained.id)).not.toBeNull();
    expect(await Product.count()).toBe(1);
  });

  test('LIST ALL: returns every product and handles an empty catalog', async () => {
    expect(await Product.findAll()).toEqual([]);
    const products = await Promise.all([
      ProductFactory.create(), ProductFactory.create(), ProductFactory.create()
    ]);
    const found = await Product.findAll();
    expect(found.map(product => product.id).sort()).toEqual(
      products.map(product => product.id).sort()
    );
  });

  test('FIND BY NAME: returns all exact matches', async () => {
    const first = await ProductFactory.create({ name: 'Hat' });
    const second = await ProductFactory.create({ name: 'Hat' });
    await ProductFactory.create({ name: 'Shoes' });
    const found = await Product.findByName('Hat');
    expect(found.map(product => product.id).sort()).toEqual([first.id, second.id].sort());
    expect(await Product.findByName('Missing')).toEqual([]);
  });

  test('FIND BY CATEGORY: excludes products in other categories', async () => {
    const first = await ProductFactory.create({ category: Category.CLOTHS });
    const second = await ProductFactory.create({ category: Category.CLOTHS });
    await ProductFactory.create({ category: Category.FOOD });
    const found = await Product.findByCategory(Category.CLOTHS);
    expect(found.map(product => product.id).sort()).toEqual([first.id, second.id].sort());
    expect(await Product.findByCategory(Category.TOOLS)).toEqual([]);
  });

  test('FIND BY AVAILABILITY: supports both true and false', async () => {
    const available = await ProductFactory.create({ available: true });
    const unavailable = await ProductFactory.create({ available: false });
    expect((await Product.findByAvailability(true)).map(product => product.id))
      .toEqual([available.id]);
    expect((await Product.findByAvailability(false)).map(product => product.id))
      .toEqual([unavailable.id]);
  });

  
  
});