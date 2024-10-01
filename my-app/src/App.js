import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Fixed the typo here
import Login from './component/login/Login';

import Product from './component/main/Product';
import ProductDetail from './component/main/ProductDetail';
import Navbar from './component/main/Navbar';
import Register from './component/login/Register';
import Cart from './component/main/Cart';

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Product />} />
        <Route path="/Product/:id" element={<ProductDetail />} />
        <Route path='/register' element={<Register />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;
