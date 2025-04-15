import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderService from '../../services/orderService';
import LoadingSpinner from '../LoadingSpinner';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(id);
        toast.success('Order cancelled successfully');
        fetchOrders();
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

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h2>Orders</h2>
        </Col>
        <Col className="text-end">
          <Link to="/orders/new">
            <Button variant="primary">Create New Order</Button>
          </Link>
        </Col>
      </Row>

      {orders.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No Orders Found</Card.Title>
            <Card.Text>
              There are no orders available. Click the button above to create a new order.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 8)}...</td>
                <td>{order.customerId}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>{getPaymentStatusBadge(order.paymentStatus)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/orders/${order._id}`}>
                    <Button variant="info" size="sm" className="me-2">
                      View
                    </Button>
                  </Link>
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancel(order._id)}
                    >
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrderList;
