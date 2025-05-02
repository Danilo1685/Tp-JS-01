// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UnicornProvider } from './context/UnicornContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/Context';
import UnicornRoutes from './unicorns';
import ProductsRoutes from './products';
import Navbar from './components/Navbar';
const App = () => {
  return (
    <ToastProvider>
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/unicornios/*"
            element={
              <UnicornProvider>
                <UnicornRoutes />
              </UnicornProvider>
            }
          />
          <Route path="/productos/*" element={<ProductsRoutes />} />
        </Routes>
      </Router>
    </ThemeProvider>
    </ToastProvider>
  );
};

export default App;



