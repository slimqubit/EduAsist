// src/components/Footer.tsx

import React from 'react';
import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-light text-center py-3 mt-auto">
      <Container>
        <p>&copy; 2024 Aplicația mea CRUD. Toate drepturile rezervate.</p>
      </Container>
    </footer>
  );
};

export default Footer;