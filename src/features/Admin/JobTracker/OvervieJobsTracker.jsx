import React, { useRef, useState } from "react";
import { Card, Row, Col, Button, Table, OverlayTrigger, Tooltip, Modal, Badge } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaUpload, FaFileExcel, FaTimes, FaBarcode, FaUser, FaClock, FaCalendarAlt, FaInfoCircle, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";

const OvervieJobsTracker = ({ onClose }) => {
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Selected file: ${file.name}`);
    }
  };

  const handleShowDetails = (title) => {
    setModalContent(title);
    setShowModal(true);
  };

  const assignments = [
    {
      date: "25/03/2025",
      title: "Design Brief",
      assignedTo: "Designer",
      timeSpent: "3:00",
    },
    {
      date: "25/03/2025",
      title: "Color Palette Selection",
      assignedTo: "Designer",
      timeSpent: "3:00",
    },
    {
      date: "25/03/2025",
      title: "Client Review",
      assignedTo: "Designer",
      timeSpent: "3:00",
    },
  ];

  // Sample job data
  const jobs = {
    jobNo: "Banner Design - Spring Campaign",
    status: "In Progress",
    dueDate: "April 25, 2025",
    instructions:
      "Create a visually appealing banner for the Spring Sale. Use pastel color palette and add product highlights.",
    brand: "BrandA",
    subBrand: "SubBrandA",
    flavour: "Vanilla",
    packType: "Box",
    packSize: "500g",
    priority: "High",
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // for edit mode
  const location = useLocation();
  const { job } = location.state || {};

  // Responsive two-column grid for job details
  const jobDetails = [
    { label: "Job No", value: jobs.jobNo, icon: <FaCalendarAlt className="me-2 text-primary" /> },
    { label: "Status", value: job?.Status || jobs.status, icon: <FaInfoCircle className="me-2 text-primary" /> },
    { label: "Due Date", value: job?.createdAt ? new Date(job?.createdAt).toLocaleDateString('en-GB').replace(/\/20/, '/') : jobs.dueDate, icon: <FaCalendarAlt className="me-2 text-primary" /> },
    { label: "Brand", value: job?.brandName, icon: <FaUser className="me-2 text-primary" /> },
    { label: "Flavour", value: job?.flavour, icon: <FaUser className="me-2 text-primary" /> },
    { label: "SubBrand", value: job?.subBrand, icon: <FaUser className="me-2 text-primary" /> },
    { label: "Pack Type", value: job?.packType, icon: <FaUser className="me-2 text-primary" /> },
    { label: "Pack Size", value: job?.packSize, icon: <FaUser className="me-2 text-primary" /> },
    { label: "Priority", value: job?.priority, icon: <FaUser className="me-2 text-primary" /> },
    { label: "Project Name", value: job?.packType, icon: <FaBarcode className="me-2 text-primary" /> },
    { label: "Assign", value: job?.assign, icon: <FaUser className="me-2 text-primary" /> },
    { label: "Total Time", value: job?.totalTime, icon: <FaClock className="me-2 text-primary" /> },
    { label: "Project Barcode", value: job?.barcode, icon: <FaBarcode className="me-2 text-primary" /> },
  ];

  const BackButton = () => {
  navigate(-1);
  }
  return (
    <div className="container py-4 px-1 px-md-4">
      {/* Modern Header */}
      
      {/* Job Details Grid */}
      <Card className="border-0 shadow-sm rounded-4 mb-4 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded-4 shadow-sm" style={{ background: "linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%)" }}>
        <div className="d-flex align-items-center gap-2">
          <FaInfoCircle className="text-white" size={28} />
          <h2 className="mb-0 fw-bold text-white" style={{ letterSpacing: 1 }}>Job Details</h2>
        </div>

          <Button onClick={()=>BackButton()} variant="light" size="sm" className="rounded-circle d-flex align-items-center justify-content-center shadow-sm border-0" style={{ width: 36, height: 36 }}>
            <FaTimes className="text-primary" size={18} />
          </Button>

      </div>
        <Row className="g-4">
          {jobDetails.map((item, idx) => (
            <Col xs={12} md={6} key={idx}>
              <div className="d-flex align-items-center bg-light rounded-3 p-3 mb-2 shadow-sm h-100">
                {item.icon}
                <span className="fw-semibold text-secondary" style={{ minWidth: 120 }}>{item.label}:</span>
                <span className="ms-2 fs-6 text-dark">{item.value || <span className="text-muted">-</span>}</span>
              </div>
            </Col>
          ))}
        </Row>
        {/* Instructions Section */}
        <div className="mt-4 border-top pt-3">
          <h5 className="fw-bold text-primary mb-2">Instructions</h5>
          <div className="fs-6 text-dark">{jobs.instructions}</div>
        </div>
      </Card>

      {/* Assignments Table Section */}
      {/* <Card className="border-0 shadow-sm rounded-4 mb-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-danger mb-0">Assignments</h5>
          <Button variant="primary" size="sm" className="d-flex align-items-center gap-1 shadow-sm" style={{ borderRadius: 20 }}>
            <FaPlus /> Add Assignment
          </Button>
        </div>
        <Table responsive hover className="align-middle bg-white rounded overflow-hidden" style={{ fontSize: "1rem" }}>
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Instruction</th>
              <th>Assigned To</th>
              <th>Time Spent</th>
              <th>Uploaded File/Link</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-light" : ""}>
                <td>{assignment.date}</td>
                <td>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Click for details</Tooltip>}>
                    <a
                      href="#"
                      className="text-decoration-none text-primary fw-semibold"
                      onClick={(e) => {
                        e.preventDefault();
                        handleShowDetails(assignment.title);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {assignment.title}
                    </a>
                  </OverlayTrigger>
                </td>
                <td>
                  <Badge bg="info" className="text-dark px-3 py-1 rounded-pill shadow-sm" style={{ fontSize: "0.95em" }}>{assignment.assignedTo}</Badge>
                </td>
                <td>
                  <span className="d-flex align-items-center gap-1">
                    <FaClock className="text-primary" /> {assignment.timeSpent}
                  </span>
                </td>
                <td className="d-flex gap-2 align-items-center">
                  <OverlayTrigger placement="top" overlay={<Tooltip>Upload File</Tooltip>}>
                    <Button size="sm" variant="outline-primary" onClick={() => fileInputRef.current.click()}>
                      <FaUpload />
                    </Button>
                  </OverlayTrigger>
                  <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
                  <OverlayTrigger placement="top" overlay={<Tooltip>Export to Excel</Tooltip>}>
                    <Button size="sm" variant="outline-success" onClick={() => alert("Excel export functionality")}> <FaFileExcel /> </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card> */}

      {/* Assignment Details Modal */}
      {/* <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assignment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalContent}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default OvervieJobsTracker;



