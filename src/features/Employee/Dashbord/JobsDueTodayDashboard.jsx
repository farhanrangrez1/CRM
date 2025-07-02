import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  Table,
  Pagination,
  Modal,
  Badge,
} from "react-bootstrap";
import { FaUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchjobs } from "../../../redux/slices/JobsSlice";

function JobsDueTodayDashboard() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [showDesignerModal, setShowDesignerModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const designers = [
    "Sarah Chen",
    "Mike Johnson",
    "Alex Wong",
    "John Smith",
    "Emma Davis",
  ];

  const statusOptions = [
    "All Status",
    "In Progress",
    "Completed",
    "Pending",
    "Reviewed",
  ];

  const { job } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchjobs());
  }, [dispatch]);

  const today = new Date().toLocaleDateString("en-CA");
  const todaysJobs = job?.jobs?.filter((j) => {
    const dueDate = new Date(j.dueDate || j.createdAt).toLocaleDateString("en-CA");
    return dueDate === today;
  }) || [];

  const handleCheckboxChange = (jobId) => {
    setSelectedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // 🔧 Placeholder functions
  const JobDetails = (job) => console.log("View Job:", job);
  const handleUpdate = (job) => console.log("Update Job:", job);
  const handleDelete = (id) => console.log("Delete Job:", id);

  // 🔧 Utility Functions

 const getStatusClass = (status) => {
    switch (status.toLowerCase().trim()) {
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
 const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-danger";
      case "medium":
        return "text-warning";
      case "low":
        return "text-success";
      default:
        return "";
    }
  };
  return (
    <div className="container bg-white p-4 mt-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold m-0">Jobs Due Today</h5>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <Form.Control
          type="text"
          placeholder="Search jobs..."
          className="w-auto"
        />
        <Form.Select
          className="w-auto"
          value={selectedStatus}
          onChange={handleChange}
        >
          {statusOptions.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </Form.Select>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const newSelectedJobs = {};
                    todaysJobs.forEach((job) => {
                      newSelectedJobs[job._id] = checked;
                    });
                    setSelectedJobs(newSelectedJobs);
                  }}
                  checked={
                    todaysJobs.length > 0 &&
                    todaysJobs.every((j) => selectedJobs[j._id])
                  }
                />
              </th>
              <th>JobNo</th>
              <th  style={{ whiteSpace: 'nowrap' }}>Project Name</th>
              <th  style={{ whiteSpace: 'nowrap' }}>Brand</th>
              <th>SubBrand</th>
              <th>Flavour</th>
              <th>PackType</th>
              <th>PackSize</th>
              <th>Priority</th>
              <th  style={{ whiteSpace: 'nowrap' }}>Due Date</th>
              <th>Assign</th>
              <th>TotalTime</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todaysJobs.slice().reverse().map((job, index) => (
              <tr key={job._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedJobs[job._id] || false}
                    onChange={() => handleCheckboxChange(job._id)}
                  />
                </td>
                <td>
                  <Link>{String(index + 1).padStart(4, "0")}</Link>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{job.projectId?.[0]?.projectName || "N/A"}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{job.brandName}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{job.subBrand}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{job.flavour}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{job.packType}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{job.packSize}</td>
                <td>
                  <span className={getPriorityClass(job.priority)}>
                    {job.priority}
                  </span>
                </td>
                <td>
                  {new Date(job.dueDate || job.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{job.assign}</td>
                <td>
                  {new Date(job.updatedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>
                  <span className={`badge ${getStatusClass(job.Status)} px-2 py-1`}>
                    {job.Status}
                  </span>
                </td>
                <td className="d-flex">
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => JobDetails(job)}
                  >
                    <i className="bi bi-eye"></i> View
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => handleUpdate(job)}
                  >
                    <i className="bi bi-pencil"></i> Edit 
                  </button>
                  {/* <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(job._id)}
                  >
                    <i className="bi bi-trash"></i> Remove
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>Showing {todaysJobs.length} job(s) due today</div>
        <Pagination className="m-0">
          <Pagination.Prev disabled />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Next disabled />
        </Pagination>
      </div>

      <Modal show={showDesignerModal} onHide={() => setShowDesignerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Designer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Choose Designer</Form.Label>
            <Form.Select
              onChange={(e) => console.log("Change designer:", e.target.value)}
              defaultValue={selectedJob?.designer}
            >
              <option value="">Select a designer...</option>
              {designers.map((designer, index) => (
                <option key={index} value={designer}>
                  {designer}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default JobsDueTodayDashboard;
