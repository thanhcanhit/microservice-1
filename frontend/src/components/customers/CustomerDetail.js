import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Table, Badge, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import customerService from '../../services/customerService';
import LoadingSpinner from '../LoadingSpinner';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  });

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const data = await customerService.getCustomerById(id);
      setCustomer(data);
    } catch (error) {
      toast.error('Failed to fetch customer details');
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        toast.success('Customer deleted successfully');
        navigate('/customers');
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editAddressId) {
        await customerService.updateAddress(id, editAddressId, addressForm);
        toast.success('Address updated successfully');
      } else {
        await customerService.addAddress(id, addressForm);
        toast.success('Address added successfully');
      }
      setShowAddressModal(false);
      resetAddressForm();
      fetchCustomer();
    } catch (error) {
      toast.error(editAddressId ? 'Failed to update address' : 'Failed to add address');
    }
  };

  const handleEditAddress = (address) => {
    setEditAddressId(address._id);
    setAddressForm({
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await customerService.deleteAddress(id, addressId);
        toast.success('Address deleted successfully');
        fetchCustomer();
      } catch (error) {
        toast.error('Failed to delete address');
      }
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false
    });
    setEditAddressId(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!customer) {
    return (
      <Container>
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>Customer Not Found</Card.Title>
            <Card.Text>The customer you are looking for does not exist.</Card.Text>
            <Link to="/customers">
              <Button variant="primary">Back to Customers</Button>
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
              <h2>{`${customer.firstName} ${customer.lastName}`}</h2>
            </Col>
            <Col xs="auto">
              <Badge bg={customer.isActive ? 'success' : 'danger'}>
                {customer.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <h5>Customer Information</h5>
              <Table bordered>
                <tbody>
                  <tr>
                    <td><strong>First Name</strong></td>
                    <td>{customer.firstName}</td>
                  </tr>
                  <tr>
                    <td><strong>Last Name</strong></td>
                    <td>{customer.lastName}</td>
                  </tr>
                  <tr>
                    <td><strong>Email</strong></td>
                    <td>{customer.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone</strong></td>
                    <td>{customer.phone}</td>
                  </tr>
                  {customer.dateOfBirth && (
                    <tr>
                      <td><strong>Date of Birth</strong></td>
                      <td>{new Date(customer.dateOfBirth).toLocaleDateString()}</td>
                    </tr>
                  )}
                  <tr>
                    <td><strong>Status</strong></td>
                    <td>
                      <Badge bg={customer.isActive ? 'success' : 'danger'}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Created</strong></td>
                    <td>{new Date(customer.createdAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Last Updated</strong></td>
                    <td>{new Date(customer.updatedAt).toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>

              {customer.notes && (
                <>
                  <h5>Notes</h5>
                  <Card>
                    <Card.Body>
                      <p className="mb-0">{customer.notes}</p>
                    </Card.Body>
                  </Card>
                </>
              )}
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Addresses</h5>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    resetAddressForm();
                    setShowAddressModal(true);
                  }}
                >
                  Add Address
                </Button>
              </div>

              {customer.addresses.length === 0 ? (
                <Card className="text-center p-3">
                  <Card.Body>
                    <Card.Text>No addresses found.</Card.Text>
                  </Card.Body>
                </Card>
              ) : (
                customer.addresses.map((address, index) => (
                  <Card key={address._id || index} className="mb-3">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <span>
                        Address {index + 1}
                        {address.isDefault && (
                          <Badge bg="success" className="ms-2">Default</Badge>
                        )}
                      </span>
                      <div>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditAddress(address)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteAddress(address._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <p className="mb-1">{address.street}</p>
                      <p className="mb-1">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="mb-0">{address.country}</p>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate('/customers')}>
              Back to Customers
            </Button>
            <div>
              <Link to={`/customers/${id}/edit`}>
                <Button variant="warning" className="me-2">
                  Edit Customer
                </Button>
              </Link>
              <Button variant="danger" onClick={handleDelete}>
                Delete Customer
              </Button>
            </div>
          </div>
        </Card.Footer>
      </Card>

      {/* Address Modal */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editAddressId ? 'Edit Address' : 'Add New Address'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddressSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                name="street"
                value={addressForm.street}
                onChange={handleAddressChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={addressForm.city}
                onChange={handleAddressChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>State/Province</Form.Label>
              <Form.Control
                type="text"
                name="state"
                value={addressForm.state}
                onChange={handleAddressChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ZIP/Postal Code</Form.Label>
              <Form.Control
                type="text"
                name="zipCode"
                value={addressForm.zipCode}
                onChange={handleAddressChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={addressForm.country}
                onChange={handleAddressChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Set as default address"
                name="isDefault"
                checked={addressForm.isDefault}
                onChange={handleAddressChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowAddressModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editAddressId ? 'Update Address' : 'Add Address'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CustomerDetail;
