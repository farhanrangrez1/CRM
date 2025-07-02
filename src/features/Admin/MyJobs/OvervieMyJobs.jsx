import React from 'react';
import { Card, Row, Col, Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const OvervieMyJobs = ({ onClose }) => {
  return (
    <div className="container mt-5">
      <Card className="shadow-lg p-4 border-0 rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0 fw-bold text-primary">Job Details</h4>
        <Link to={"/admin/MyJobs"}>  <Button variant="outline-secondary" size="sm" onClick={onClose}>Close</Button></Link>
        </div>

        <Row className="mb-4">
          <Col md={6}>
            <p><strong>Job #:</strong><br />12345</p>
          </Col>
          <Col md={6}>
            <p><strong>Brand Name:</strong><br />FreshFizz</p>
          </Col>
          <Col md={6}>
            <p><strong>Sub Brand:</strong><br />Fizz Light</p>
          </Col>
          <Col md={6}>
            <p><strong>Flavour:</strong><br />Lime Mint</p>
          </Col>
          <Col md={6}>
            <p><strong>Pack Type:</strong><br />Bottle</p>
          </Col>
          <Col md={6}>
            <p><strong>Pack Size:</strong><br />500ml</p>
          </Col>
          <Col md={6}>
            <p><strong>Pack Code:</strong><br />FFLM500</p>
          </Col>
          <Col md={6}>
            <p><strong>Deadline:</strong><br />April 25, 2025</p>
          </Col>
          <Col md={6}>
            <p><strong>Status:</strong><br />In Progress</p>
          </Col>
          <Col md={6}>
            <p><strong>Assigned To:</strong><br />Gautam Bairagi</p>
          </Col>
          <Col md={12}>
            <p><strong>Brief:</strong><br />Create a visually appealing banner for the Spring Sale. Use pastel color palette and add product highlights.</p>
          </Col>
        </Row>

        <h5 className="fw-bold text-primary mb-3">Progress</h5>

        <Row className="mb-3">
          <Col md={12}>
            <Card className="p-3 text-center border-0 shadow-sm">
              <h6 className="mb-2">Job Progress</h6>
              <ProgressBar now={45} variant="info" />
              <small className="text-muted mt-1 d-block">45% Completed</small>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default OvervieMyJobs;
