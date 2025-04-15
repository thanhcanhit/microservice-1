import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="text-center py-5 bg-light rounded">
            <h1>Microservices Demo</h1>
            <p className="lead">
              A React frontend for interacting with Product, Order, and Customer microservices through Kong Gateway
            </p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Header as="h5">Products</Card.Header>
            <Card.Body>
              <Card.Title>Manage Products</Card.Title>
              <Card.Text>
                Create, view, update, and delete products. Manage product inventory, pricing, and details.
              </Card.Text>
              <Link to="/products">
                <Button variant="primary">Go to Products</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Header as="h5">Orders</Card.Header>
            <Card.Body>
              <Card.Title>Manage Orders</Card.Title>
              <Card.Text>
                View orders, update order status, manage payment status, and track order details.
              </Card.Text>
              <Link to="/orders">
                <Button variant="primary">Go to Orders</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Header as="h5">Customers</Card.Header>
            <Card.Body>
              <Card.Title>Manage Customers</Card.Title>
              <Card.Text>
                Create and manage customer profiles, including contact information and shipping addresses.
              </Card.Text>
              <Link to="/customers">
                <Button variant="primary">Go to Customers</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="bg-light">
            <Card.Body>
              <Card.Title>About This Application</Card.Title>
              <Card.Text>
                This React application interacts exclusively with the Kong Gateway, which routes requests to the appropriate microservices:
              </Card.Text>
              <ul>
                <li>Product Service: Manages product information (name, price, description, inventory)</li>
                <li>Order Service: Manages orders (create, view, cancel orders)</li>
                <li>Customer Service: Manages customer information (name, address, contact info)</li>
              </ul>
              <Card.Text>
                All API requests are sent to the Kong Gateway (http://localhost:8000), which then routes them to the appropriate service.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
