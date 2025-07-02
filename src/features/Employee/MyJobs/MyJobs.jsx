import React, { useEffect, useState, useRef, useMemo } from "react";
import { Row, Col, Button, Form, Table, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchjobs } from "../../../redux/slices/JobsSlice";
import { fetchMyJobs, ReturnJob } from "../../../redux/slices/Employee/MyJobsSlice";
import { FaFilter } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegClock } from "react-icons/fa";

function MyJobs() {
  const [showTimesheetModal, setShowTimesheetModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedJob, setExpandedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedJobs, setSelectedJobs] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogTime = (jobId) => {
    setSelectedJobId(jobId);
    setShowTimesheetModal(true);
  };

  const fileInputRef = useRef(null);
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
    }
  };

  const handleCheckboxChange = (jobId) => {
    setSelectedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const { myjobs, loading, error } = useSelector((state) => state.MyJobs);
  const MynewJobsdata =
    myjobs && myjobs.assignments && myjobs.assignments.length > 0
      ? myjobs.assignments[0].jobId
      : [];

  useEffect(() => {
    dispatch(fetchMyJobs());
  }, [dispatch]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);

  const filteredProjects = useMemo(() => {
    let jobsToFilter = MynewJobsdata || [];

    if (searchTerm) {
      // Split searchTerm by spaces, ignore empty terms
      const terms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
      jobsToFilter = jobsToFilter.filter((job) => {
        const fields = [
          job.JobNo?.toString().toLowerCase() || '',
          job.projectId?.[0]?.projectName?.toLowerCase() || '',
          job.brandName?.toLowerCase() || '',
          job.subBrand?.toLowerCase() || '',
          job.flavour?.toLowerCase() || '',
          job.packType?.toLowerCase() || '',
          job.packSize?.toLowerCase() || '',
          job.packCode?.toLowerCase() || ''
        ];
        // Every term must be found in at least one field
        return terms.every(term =>
          fields.some(field => field.includes(term))
        );
      });
    }

    if (statusFilter !== "All Status") {
      jobsToFilter = jobsToFilter.filter(
        (job) =>
          job.Status &&
          job.Status.toLowerCase().replace(/_/g, " ") === statusFilter.toLowerCase()
      );
    }

    if (dateFilter) {
      jobsToFilter = jobsToFilter.filter((job) => {
        if (!job.createdAt) return false;
        const jobDate = new Date(job.createdAt).toISOString().split("T")[0];
        return jobDate === dateFilter;
      });
    }

    return jobsToFilter;
  }, [MynewJobsdata, searchTerm, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleRejectJobs = () => {
    const selectedJobIds = Object.keys(selectedJobs).filter((id) => selectedJobs[id]);

    if (selectedJobIds.length === 0) {
      setErrorMessage("Please select at least 1 job to reject.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    setShowRejectModal(true);
    const payload = {
      jobId: selectedJobIds
    };
    console.log("Payload to send:", payload);
  };

  const handleSubmitRejection = () => {
    const selectedJobIds = Object.keys(selectedJobs).filter((id) => selectedJobs[id]);

    if (!rejectionReason.trim()) {
      setErrorMessage("Please enter a reason for rejection.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    dispatch(ReturnJob({ jobId: selectedJobIds }))
      .unwrap()
      .then(() => {
        setSuccessMessage("Jobs rejected successfully.");
        setTimeout(() => setSuccessMessage(""), 3000);
        dispatch(fetchMyJobs());
        setSelectedJobs({});
        setRejectionReason("");
        setShowRejectModal(false);
      })
      .catch((error) => {
        setErrorMessage("Failed to reject jobs: " + error);
      });
  };

  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase().trim()) {
      case "in progress":
      case "in_progress":
        return "bg-warning text-dark";
      case "review":
        return "bg-info text-dark";
      case "not started":
        return "bg-secondary text-white";
      case "completed":
        return "bg-success text-white";
      case "open":
        return "bg-primary text-white";
      case "cancelled":
        return "bg-dark text-white";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="p-4 m-2" style={{ backgroundColor: "white", borderRadius: "10px" }}>
      <h5 className="fw-bold mb-3 text-start">My Jobs</h5>

      {/* Filter button */}
      <div className="d-lg-none mb-2 text-end">
        <Button
          variant="primary"
          size="sm"
          className="fw-bold shadow-sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className="me-1" />
          Filter
        </Button>
      </div>

      {/* Filters */}
      <Row className={`mb-3 align-items-center ${showFilters ? "" : "d-none d-lg-flex"}`}>
        <Col xs={12} lg={9} className="d-flex flex-wrap gap-2 mb-2 mb-lg-0">
          <Form.Control
            type="text"
            placeholder="Search jobs..."
            className="flex-grow-1"
            style={{ minWidth: "150px", maxWidth: "200px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Form.Select
            className="flex-shrink-0"
            style={{ minWidth: "140px", maxWidth: "160px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
            <option value="not started">Not Started</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
          <Form.Control
            type="date"
            className="flex-shrink-0"
            style={{ minWidth: "140px", maxWidth: "160px" }}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </Col>

        <Col xs={12} lg={3} className="text-lg-end d-flex flex-wrap justify-content-lg-end gap-2">
          <Button id="All_btn" variant="dark" className="w-lg-auto" onClick={handleRejectJobs}>
            Return Job
          </Button>
        </Col>
      </Row>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="alert alert-danger py-2" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <Table hover className="align-middle sticky-header">
          <thead className="bg-light">
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const newSelectedJobs = {};
                    paginatedProjects.forEach((job) => {
                      newSelectedJobs[job._id] = checked;
                    });
                    setSelectedJobs(newSelectedJobs);
                  }}
                  checked={
                    paginatedProjects.length > 0 &&
                    paginatedProjects.every((j) => selectedJobs[j._id])
                  }
                />
              </th>
              <th>JobNo</th>
              <th>ProjectName</th>
              <th>Brand</th>
              <th>SubBrand</th>
              <th>PackType</th>
              <th>PackSize</th>
              <th>PackCode</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.slice().reverse().map((job) => (
              <tr key={job._id} style={{ cursor: "pointer" }}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedJobs[job._id] || false}
                    onChange={() => handleCheckboxChange(job._id)}
                  />
                </td>
                <td>{job.JobNo}</td>
                <td>{job.projectId?.[0]?.projectName || "—"}</td>
                <td>{job.brandName}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{job.subBrand}</td>
                <td>{job.packType || "N/A"}</td>
                <td>{job.packSize || "N/A"}</td>
                <td>{job.packCode || "N/A"}</td>
                <td>
                  <span className={`badge ${getStatusClass(job.Status)}`}>
                    {job.Status || "N/A"}
                  </span>
                </td>
                <td>
                  {/* <Link to={"/employee/AddTimeLog"}><Button id="All_btn" size="sm" variant="dark" onClick={() => handleLogTime(job._id)}>
                    LogTime
                  </Button></Link> */}
                  <Link to={"/employee/AddTimeLog"}>
                    <Button
                      id="All_btn"
                      size="sm"
                      variant="dark"
                      onClick={() => handleLogTime(job._id)}
                    >
                      <FaRegClock/> {/* Time icon with margin */}
                    </Button>
                  </Link>

                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Return Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-warning">
            Are you sure you want to return this job?
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Reason for Return Jobs</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmitRejection}>
            Return
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyJobs;
