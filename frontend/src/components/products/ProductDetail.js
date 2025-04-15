import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import productService from '../../services/productService';
import LoadingSpinner from '../LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      toast.error('Failed to fetch product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Product deleted successfully');
        navigate('/products');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <Container>
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>Product Not Found</Card.Title>
            <Card.Text>The product you are looking for does not exist.</Card.Text>
            <Link to="/products">
              <Button variant="primary">Back to Products</Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="mb-4">
        <Card.Header>
          <Row>
            <Col>
              <h2>{product.name}</h2>
            </Col>
            <Col xs="auto">
              <Badge bg={product.inventory > 0 ? 'success' : 'danger'} className="me-2">
                {product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
              </Badge>
              <Badge bg="info">{product.category}</Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="img-fluid rounded mb-3"
                />
              ) : (
                <div className="bg-light text-center p-5 rounded mb-3">
                  <span className="text-muted">No Image Available</span>
                </div>
              )}
            </Col>
            <Col md={8}>
              <Card.Text className="mb-4">{product.description}</Card.Text>
              <Row className="mb-3">
                <Col>
                  <strong>Price:</strong> ${product.price.toFixed(2)}
                </Col>
                <Col>
                  <strong>Inventory:</strong> {product.inventory} units
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Category:</strong> {product.category}
                </Col>
                <Col>
                  <strong>Status:</strong>{' '}
                  {product.isActive ? 'Active' : 'Inactive'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Created:</strong>{' '}
                  {new Date(product.createdAt).toLocaleDateString()}
                </Col>
                <Col>
                  <strong>Last Updated:</strong>{' '}
                  {new Date(product.updatedAt).toLocaleDateString()}
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate('/products')}>
              Back to Products
            </Button>
            <div>
              <Link to={`/products/${id}/edit`}>
                <Button variant="warning" className="me-2">
                  Edit
                </Button>
              </Link>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ProductDetail;
