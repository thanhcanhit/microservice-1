import api from './api';

const CUSTOMER_API_URL = '/api/customers';

const customerService = {
  getAllCustomers: async () => {
    try {
      const response = await api.get(CUSTOMER_API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getCustomerById: async (id) => {
    try {
      const response = await api.get(`${CUSTOMER_API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with id ${id}:`, error);
      throw error;
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await api.post(CUSTOMER_API_URL, customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      const response = await api.put(`${CUSTOMER_API_URL}/${id}`, customerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer with id ${id}:`, error);
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      const response = await api.delete(`${CUSTOMER_API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting customer with id ${id}:`, error);
      throw error;
    }
  },

  addAddress: async (customerId, addressData) => {
    try {
      const response = await api.post(`${CUSTOMER_API_URL}/${customerId}/addresses`, addressData);
      return response.data;
    } catch (error) {
      console.error(`Error adding address to customer with id ${customerId}:`, error);
      throw error;
    }
  },

  updateAddress: async (customerId, addressId, addressData) => {
    try {
      const response = await api.put(`${CUSTOMER_API_URL}/${customerId}/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      console.error(`Error updating address ${addressId} for customer ${customerId}:`, error);
      throw error;
    }
  },

  deleteAddress: async (customerId, addressId) => {
    try {
      const response = await api.delete(`${CUSTOMER_API_URL}/${customerId}/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting address ${addressId} for customer ${customerId}:`, error);
      throw error;
    }
  }
};

export default customerService;
