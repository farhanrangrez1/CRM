import React from "react";
import { Container, Row, Col, Badge, Button, ListGroup } from "react-bootstrap";
import { FaDownload, FaComment } from "react-icons/fa";

function MyJobsHolidayPackageDesign() {
  return (
    <Container className="bg-white p-4 mt-4 rounded shadow-sm">
      {/* Title */}
      <h5 className="fw-bold mb-4 text-start">Project Brief - Holiday Package Design</h5>

      {/* Top Row: Project Details & Assignment Info */}
      <Row className="mb-4 text-start">
        <Col md={6}>
          <h6 className="fw-bold">Project Details</h6>
          <p className="mb-1"><strong>Job ID:</strong> #JOB102</p>
          <p className="mb-1"><strong>Client:</strong> Acme Corp</p>
          <p className="mb-1">
            <strong>Deadline:</strong> <span className="text-danger">2024-01-20</span>
          </p>
          <p className="mb-1">
            <strong>Priority:</strong> <Badge bg="danger">High</Badge>
          </p>
        </Col>

        <Col md={6}>
          <h6 className="fw-bold">Assignment Information</h6>
          <p className="mb-1"><strong>Assigned to:</strong> John Smith</p>
          <p className="mb-1"><strong>Department:</strong> Package Design</p>
          <p className="mb-1">
            <strong>Status:</strong>{" "}
            <Badge bg="warning" text="dark">
              Pending Upload
            </Badge>
          </p>
        </Col>
      </Row>

      {/* Description */}
      <Row className="mb-4 text-start">
        <Col>
          <h6 className="fw-bold text-start">Project Description</h6>
          <p>
            Design a holiday-themed packaging collection for our premium product line.
            The design should incorporate festive elements while maintaining brand consistency.
            The collection includes various box sizes and gift wrap options.
          </p>
        </Col>
      </Row>

      {/* Requirements & Deliverables */}
      <Row className="mb-4 text-start">
        <Col md={6}>
          <h6 className="fw-bold">Requirements</h6>
          <ListGroup variant="flush">
            <ListGroup.Item className="no-border">Incorporate holiday themes (Christmas, New Year)</ListGroup.Item>
            <ListGroup.Item className="no-border">Use brand color palette with festive accents</ListGroup.Item>
            <ListGroup.Item className="no-border">Design for 3 different box sizes</ListGroup.Item>
            <ListGroup.Item className="no-border">Include gift wrap variations</ListGroup.Item>
            <ListGroup.Item className="no-border">Maintain premium brand feeling</ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={6}>
          <h6 className="fw-bold">Deliverables</h6>
          <ListGroup variant="flush">
            <ListGroup.Item className="no-border">Print-ready files in Adobe Illustrator format</ListGroup.Item>
            <ListGroup.Item className="no-border">High-resolution PDF proofs</ListGroup.Item>
            <ListGroup.Item className="no-border">Color specifications document</ListGroup.Item>
            <ListGroup.Item className="no-border">Mock-up presentations</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>


      {/* Action Buttons */}
      <div className="d-flex flex-column flex-md-row gap-2 justify-content-start">
        <Button variant="dark">
          <FaDownload className="me-2" />
          Download Assets
        </Button>
        {/* <Button variant="outline-dark">
          <FaComment className="me-2" />
          Add Comment
        </Button> */}
        <Button variant="light" className="ms-md-auto">
          Return to Jobs
        </Button>
      </div>
    </Container>
  )
}

export default MyJobsHolidayPackageDesign
