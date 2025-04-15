import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

// Components
import AppNavbar from './components/Navbar';

// Product Pages
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import ProductForm from './components/products/ProductForm';

// Order Pages
import OrderList from './components/orders/OrderList';
import OrderDetail from './components/orders/OrderDetail';

// Customer Pages
import CustomerList from './components/customers/CustomerList';
import CustomerDetail from './components/customers/CustomerDetail';

// Home Page
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <AppNavbar />
      <div className="py-4">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<HomePage />} />

          {/* Product Routes */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />

          {/* Order Routes */}
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/:id" element={<OrderDetail />} />

          {/* Customer Routes */}
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
