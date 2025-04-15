import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import productService from '../../services/productService';
import LoadingSpinner from '../LoadingSpinner';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h2>Products</h2>
        </Col>
        <Col className="text-end">
          <Link to="/products/new">
            <Button variant="primary">Add New Product</Button>
          </Link>
        </Col>
      </Row>

      {products.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No Products Found</Card.Title>
            <Card.Text>
              There are no products available. Click the button above to add a new product.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Inventory</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.inventory}</td>
                <td>{product.category}</td>
                <td>
                  <Link to={`/products/${product._id}`}>
                    <Button variant="info" size="sm" className="me-2">
                      View
                    </Button>
                  </Link>
                  <Link to={`/products/${product._id}/edit`}>
                    <Button variant="warning" size="sm" className="me-2">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ProductList;
