import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>Stock Market Simulator</h5>
            <p className="text-muted">
              Practice trading with $100,000 in virtual money.
              Learn to invest without risking real money.
            </p>
          </Col>
          
          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/dashboard" className="text-light">Dashboard</a></li>
              <li><a href="/portfolio" className="text-light">Portfolio</a></li>
              <li><a href="/trade" className="text-light">Trade</a></li>
              <li><a href="/stocks" className="text-light">Stocks</a></li>
            </ul>
          </Col>
          
          <Col md={4} className="mb-3">
            <h5>Resources</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light">Help Center</a></li>
              <li><a href="#" className="text-light">Investment Guides</a></li>
              <li><a href="#" className="text-light">Market News</a></li>
              <li><a href="#" className="text-light">Contact Support</a></li>
            </ul>
          </Col>
        </Row>
        
        <hr className="bg-secondary" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0 text-muted">
              &copy; {currentYear} Stock Market Simulator. All rights reserved.
            </p>
            <p className="text-muted small">
              This is a simulation platform. No real money is involved.
              Market data provided by Yahoo Finance.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
