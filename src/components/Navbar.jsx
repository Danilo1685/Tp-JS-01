// src/components/Navbar.jsx
import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useTheme } from '../context/Context';
import { Link } from 'react-router-dom';

const CustomNavbar = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Navbar
      bg={darkMode ? 'dark' : 'light'}
      variant={darkMode ? 'dark' : 'light'}
      expand="lg"
    >
      <Container>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/unicornios">
            Unicornios
          </Nav.Link>
          <Nav.Link as={Link} to="/productos">
            Productos
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;


