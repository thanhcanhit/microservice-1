import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Table, Badge, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderService from '../../services/orderService';
import LoadingSpinner from '../LoadingSpinner';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(id);
      setOrder(data);
      setStatus(data.status);
      setPaymentStatus(data.paymentStatus);
    } catch (error) {
      toast.error('Failed to fetch order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    e.preventDefault();
    try {
      await orderService.updateOrderStatus(id, { status });
      toast.success('Order status updated successfully');
      fetchOrder();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handlePaymentStatusChange = async (e) => {
    e.preventDefault();
    try {
      await orderService.updatePaymentStatus(id, { paymentStatus });
      toast.success('Payment status updated successfully');
      fetchOrder();
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(id);
        toast.success('Order cancelled successfully');
        fetchOrder();
      } catch (error) {
        toast.error('Failed to cancel order');
      }
    }
  };

  const getStatusBadge = (status) => {
    let variant;
    switch (status) {
      case 'pending':
        variant = 'warning';
        break;
      case 'processing':
        variant = 'info';
        break;
      case 'shipped':
        variant = 'primary';
        break;
      case 'delivered':
        variant = 'success';
        break;
      case 'cancelled':
        variant = 'danger';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (status) => {
    let variant;
    switch (status) {
      case 'pending':
        variant = 'warning';
        break;
      case 'completed':
        variant = 'success';
        break;
      case 'failed':
        variant = 'danger';
        break;
      case 'refunded':
        variant = 'info';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{status}</Badge>;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <Container>
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>Order Not Found</Card.Title>
            <Card.Text>The order you are looking for does not exist.</Card.Text>
            <Link to="/orders">
              <Button variant="primary">Back to Orders</Button>
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
              <h2>Order Details</h2>
            </Col>
            <Col xs="auto">
              <h5>
                Order ID: <span className="text-muted">{order._id}</span>
              </h5>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <h5>Order Information</h5>
              <Table bordered>
                <tbody>
                  <tr>
                    <td><strong>Customer ID</strong></td>
                    <td>{order.customerId}</td>
                  </tr>
                  <tr>
                    <td><strong>Order Date</strong></td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Status</strong></td>
                    <td>{getStatusBadge(order.status)}</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Method</strong></td>
                    <td>{order.paymentMethod}</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Status</strong></td>
                    <td>{getPaymentStatusBadge(order.paymentStatus)}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Amount</strong></td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <h5>Shipping Address</h5>
              <Card className="mb-3">
                <Card.Body>
                  <p className="mb-1">{order.shippingAddress.street}</p>
                  <p className="mb-1">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="mb-0">{order.shippingAddress.country}</p>
                </Card.Body>
              </Card>

              {order.notes && (
                <>
                  <h5>Notes</h5>
                  <Card>
                    <Card.Body>
                      <p className="mb-0">{order.notes}</p>
                    </Card.Body>
                  </Card>
                </>
              )}
            </Col>
          </Row>

          <h5>Order Items</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="text-end">
                  <strong>Total:</strong>
                </td>
                <td>
                  <strong>${order.totalAmount.toFixed(2)}</strong>
                </td>
              </tr>
            </tbody>
          </Table>

          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <Row className="mt-4">
              <Col md={6}>
                <Card>
                  <Card.Header>Update Order Status</Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleStatusChange}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </Form.Select>
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Update Status
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>Update Payment Status</Card.Header>
                  <Card.Body>
                    <Form onSubmit={handlePaymentStatusChange}>
                      <Form.Group className="mb-3">
                        <Form.Label>Payment Status</Form.Label>
                        <Form.Select
                          value={paymentStatus}
                          onChange={(e) => setPaymentStatus(e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </Form.Select>
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Update Payment Status
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Card.Body>
        <Card.Footer>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <Button variant="danger" onClick={handleCancel}>
                Cancel Order
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default OrderDetail;
