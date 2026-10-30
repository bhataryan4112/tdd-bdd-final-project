const express = require('express');
const { Product, Category } = require('../models/product');
const { validateProduct, checkContentType } = require('../middleware/validation');

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 200, message: 'OK' });
});

/**
 * CREATE A NEW PRODUCT
 */
router.post('/', checkContentType('application/json'), validateProduct, async (req, res) => {
  try {

    
    const product = await Product.create(req.body);

    
    const location = `/api/products/${product.id}`;
    res.status(201)
       .location(location)
       .json(product.serialize());
       
  } catch (error) {

    res.status(400).json({ 
      error: 'Bad Request', 
      message: error.message 
    });
  }
});


/** LIST ALL / LIST BY NAME / LIST BY CATEGORY / LIST BY AVAILABILITY */
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

/** READ A PRODUCT */
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

/** UPDATE A PRODUCT */
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

/** DELETE A PRODUCT: repeated deletes also return 204. */
router.delete('/:id(\\d+)', async (req, res, next) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
