import React from 'react';
import { Card, Row, Col, Button, ProgressBar } from 'react-bootstrap';

const OvervieJobsProject = ({ onClose }) => {
  return (
    <div className="container mt-5">
      <Card className="shadow-lg p-4 border-0 rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0 fw-bold text-primary">Job Details</h4>
          <Button variant="outline-secondary" size="sm" onClick={onClose}>Close</Button>
        </div>

        <Row className="mb-4">
          <Col md={6}>
            <p><strong>Job Title:</strong><br />Banner Design - Spring Campaign</p>
          </Col>
          <Col md={6}>
            <p><strong>Assigned To:</strong><br />Gautam Bairagi</p>
          </Col>
          <Col md={6}>
            <p><strong>Status:</strong><br />In Progress</p>
          </Col>
          <Col md={6}>
            <p><strong>Due Date:</strong><br />April 25, 2025</p>
          </Col>
          <Col md={12}>
            <p><strong>Instructions:</strong><br />Create a visually appealing banner for the Spring Sale. Use pastel color palette and add product highlights.</p>
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

export default OvervieJobsProject;
