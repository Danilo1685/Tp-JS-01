// src/unicorns/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UnicornsView from './UnicornsView';
import UnicornForm from './UnicornsForms';

const UnicornRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UnicornsView />} />
      <Route path="/crear" element={<UnicornForm />} />
      <Route path="/editar/:id" element={<UnicornForm />} />
    </Routes>
  );
};

export default UnicornRoutes;