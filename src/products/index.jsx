// src/products/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductsView from './ProductsView';
import ProductForm from './ProductForms';

const ProductsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductsView />} />
      <Route path="/crear" element={<ProductForm />} />
      <Route path="/editar/:id" element={<ProductForm />} />
    </Routes>
  );
};

export default ProductsRoutes;
