// src/context/ToastContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);

  const showToast = (msg) => {
    setMessage(msg);
    setShow(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="top-end" className="p-3">
        <Toast bg="success" show={show} delay={3000} autohide onClose={() => setShow(false)}>
          <Toast.Header closeButton={false}>
            <strong className="me-auto">✅ Éxito</strong>
          </Toast.Header>
          <Toast.Body>{message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
};
