const axios = require('axios');

const productServiceBaseUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5000';

/**
 * Get product by ID from Product Service
 * @param {string} productId - The ID of the product to retrieve
 * @returns {Promise<Object>} - The product data
 */
const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${productServiceBaseUrl}/api/products/${productId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`Product service error: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('Product service is not responding');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Error: ${error.message}`);
    }
  }
};

/**
 * Check if products are in stock
 * @param {Array} items - Array of order items with productId and quantity
 * @returns {Promise<boolean>} - True if all products are in stock, false otherwise
 */
const checkProductsStock = async (items) => {
  try {
    // Check each product's inventory
    for (const item of items) {
      const product = await getProductById(item.productId);

      if (product.inventory < item.quantity) {
        throw new Error(`Product ${product.name} is out of stock. Available: ${product.inventory}`);
      }
    }

    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Update product inventory after order is placed
 * @param {Array} items - Array of order items with productId and quantity
 * @returns {Promise<void>}
 */
const updateProductInventory = async (items) => {
  try {
    for (const item of items) {
      const product = await getProductById(item.productId);

      // Update inventory
      await axios.put(`${productServiceBaseUrl}/api/products/${item.productId}`, {
        inventory: product.inventory - item.quantity
      });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getProductById,
  checkProductsStock,
  updateProductInventory
};
