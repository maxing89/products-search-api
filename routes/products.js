const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const getProducts = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './products.json'));
    const products = JSON.parse(data);
    if (!products.length) {
      const err = new Error('Products not found');
      err.status = 404;
      throw err;
    }
    res.json(products);
  } catch (e) {
    next(e);
  }
}

const getProduct = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './products.json'));
    const products = JSON.parse(data);
    const product = products.find(product => product.id === Number(req.params.id));
    if (!product) {
      return res.json(null);
    }
    res.json(product);
  } catch (e) {
    next(e);
  }
}

const getProductByFilter = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './products.json'));
    const products = JSON.parse(data);

    const filter = (req.query.q).toLowerCase();

    const productsFound = products.map(product => {
      const lowerCaseTitle = (product.title).toLowerCase();
      if (lowerCaseTitle.includes(filter)) {
        return product;
      }
      return null;
    });
    if (productsFound.every(prod => prod === null)) {
      return res.json([]);
    }
    res.json(productsFound.filter(product => product !== null));
  } catch (e) {
    next(e);
  }
}

router
  .route('/api/v1/products')
  .get(getProducts);

router
  .route('/api/v1/products/:id')
  .get(getProduct);

router
  .route('/api/v1/search')
  .get(getProductByFilter);



module.exports = router;