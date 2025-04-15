import api from './api';

const ORDER_API_URL = '/api/orders';

const orderService = {
  getAllOrders: async () => {
    try {
      const response = await api.get(ORDER_API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await api.get(`${ORDER_API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with id ${id}:`, error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post(ORDER_API_URL, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  updateOrderStatus: async (id, statusData) => {
    try {
      const response = await api.put(`${ORDER_API_URL}/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error(`Error updating order status with id ${id}:`, error);
      throw error;
    }
  },

  updatePaymentStatus: async (id, paymentData) => {
    try {
      const response = await api.put(`${ORDER_API_URL}/${id}/payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating payment status with id ${id}:`, error);
      throw error;
    }
  },

  cancelOrder: async (id) => {
    try {
      const response = await api.delete(`${ORDER_API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order with id ${id}:`, error);
      throw error;
    }
  }
};

export default orderService;
