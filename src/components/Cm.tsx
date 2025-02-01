// App.js

import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import ProductList from './community-market/ProductList';
import ProductDetail from './community-market/ProductDetail';
import AddProduct from './community-market/AddProduct';
import Navbar from './community-market/Navbar';
import LoginSignup from './community-market/Loginsignup';

const Cm = () => {

return (
    <BrowserRouter>
    <Navbar />
        <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/products/:productId" element={<ProductDetail/>} />
        </Routes>
    </BrowserRouter>
);
};

export default Cm;
