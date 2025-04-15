import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import customerService from '../../services/customerService';
import LoadingSpinner from '../LoadingSpinner';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        toast.success('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to delete customer');
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
          <h2>Customers</h2>
        </Col>
        <Col className="text-end">
          <Link to="/customers/new">
            <Button variant="primary">Add New Customer</Button>
          </Link>
        </Col>
      </Row>

      {customers.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No Customers Found</Card.Title>
            <Card.Text>
              There are no customers available. Click the button above to add a new customer.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Addresses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{`${customer.firstName} ${customer.lastName}`}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>
                  <Badge bg={customer.isActive ? 'success' : 'danger'}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td>{customer.addresses.length}</td>
                <td>
                  <Link to={`/customers/${customer._id}`}>
                    <Button variant="info" size="sm" className="me-2">
                      View
                    </Button>
                  </Link>
                  <Link to={`/customers/${customer._id}/edit`}>
                    <Button variant="warning" size="sm" className="me-2">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(customer._id)}
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

export default CustomerList;
