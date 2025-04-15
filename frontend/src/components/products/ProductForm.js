import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import productService from '../../services/productService';
import LoadingSpinner from '../LoadingSpinner';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    inventory: '',
    category: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await productService.getProductById(id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        inventory: product.inventory,
        category: product.category,
        imageUrl: product.imageUrl || ''
      });
    } catch (error) {
      toast.error('Failed to fetch product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || !formData.price || formData.inventory === '' || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Convert price and inventory to numbers
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      inventory: parseInt(formData.inventory, 10)
    };

    try {
      setLoading(true);
      if (isEditMode) {
        await productService.updateProduct(id, productData);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(productData);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update product' : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Card className="mb-4">
        <Card.Header as="h2">{isEditMode ? 'Edit Product' : 'Add New Product'}</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Inventory</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="inventory"
                value={formData.inventory}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL (optional)</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/products')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductForm;
