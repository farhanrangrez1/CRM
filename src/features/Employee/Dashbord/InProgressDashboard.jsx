import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Table,
  ProgressBar,
  Pagination,
  Modal,
} from "react-bootstrap";
import { FaComments, FaExchangeAlt, FaEdit } from "react-icons/fa";
import { BsPencil, BsXCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchjobs } from "../../../redux/slices/JobsSlice";
import { fetchProject } from "../../../redux/slices/ProjectsSlice";

function InProgressDashboard() {
  const dispatch = useDispatch();
  const { job } = useSelector((state) => state.jobs);
  const { project, loading, error } = useSelector((state) => state.projects);

  const [showDesignerModal, setShowDesignerModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState({});

  const designers = [
    "Sarah Chen",
    "Mike Johnson",
    "Alex Wong",
    "John Smith",
    "Emma Davis",
  ];

  useEffect(() => {
    dispatch(fetchjobs());
    dispatch(fetchProject());
  }, [dispatch]);

  const handleSwitchDesigner = (jobId) => {
    console.log("Switching designer for job:", jobId);
    setSelectedJob(jobId);
    setShowDesignerModal(true);
  };

  const handleCancelBrief = (jobId) => {
    console.log("Cancelling brief for job:", jobId);
  };

  const handleDesignerChange = (designer) => {
    console.log("Selected designer:", designer);
    setShowDesignerModal(false);
    // Dispatch update logic here
  };

  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase().trim()) {
      case "active project":
        return "bg-primary text-white";
      case "in progress":
      case "in_progress":
        return "bg-warning text-dark";
      case "completed":
        return "bg-success text-white";
      case "closed":
        return "bg-dark text-white";
      case "cancelled":
        return "bg-danger text-white";
      case "on hold":
      case "review":
        return "bg-info text-dark";
      case "not started":
        return "bg-secondary text-white";
      case "open":
        return "bg-primary text-white";
      default:
        return "bg-light text-dark";
    }
  };

  const getPriorityClass = (priority) => {
    switch ((priority || "").toLowerCase()) {
      case "high":
        return "badge bg-danger";
      case "medium":
        return "badge bg-warning text-dark";
      case "low":
        return "badge bg-success";
      default:
        return "badge bg-secondary";
    }
  };

  const handleCheckboxChange = (projectId) => {
    setSelectedJobs((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const CreatJobs = (projectId) => {
    console.log("Create jobs for project:", projectId);
  };

  const handleUpdate = (project) => {
    console.log("Update project:", project);
  };

  // ✅ FILTER PROJECTS by status === in_progress / in progress
  const filteredProjects = project?.data?.filter(
    (proj) =>
      (proj.status || "").toLowerCase().replace(/\s|_/g, "") === "inprogress"
  );

  return (
    <div className="container bg-white p-4 mt-4 rounded shadow-sm">
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold m-0">Projects in Progress</h5>
      </div>

      {/* Filters */}
      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <Form.Control
          type="text"
          placeholder="Search jobs..."
          className="w-auto"
        />
      </div>

      {/* Table */}
      <div className="border-start border-end rounded-2 overflow-hidden">
        {!loading && !error && filteredProjects?.length > 0 ? (
          <Table responsive className="project-table mb-4">
            <thead className="table-light">
              <tr>
                <th>Select</th>
                <th style={{ whiteSpace: 'nowrap' }}>Project No</th>
                <th style={{ whiteSpace: 'nowrap' }}>Project Name</th>
                <th style={{ whiteSpace: 'nowrap' }}>Description</th>
                <th style={{ whiteSpace: 'nowrap' }}>Start Date</th>
                <th style={{ whiteSpace: 'nowrap' }}>End Date</th>
                <th style={{ whiteSpace: 'nowrap' }}>Client</th>
                <th style={{ whiteSpace: 'nowrap' }}>Project Requirements</th>
                <th style={{ whiteSpace: 'nowrap' }}>Status</th>
                <th style={{ whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.slice().reverse().map((project, index) => (
                <tr key={project.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedJobs[project.id] || false}
                      onChange={() => handleCheckboxChange(project.id)}
                    />
                  </td>
                  <td onClick={() => CreatJobs(project.id)}>
                    <Link>{String(index + 1).padStart(4, "0")}</Link>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{project.projectName}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{project.description}</td>
                  <td>
                    {new Date(project.startDate)
                      .toLocaleDateString("en-GB")
                      .replace(/\/20/, "/")}
                  </td>
                  <td>
                    {new Date(project.endDate)
                      .toLocaleDateString("en-GB")
                      .replace(/\/20/, "/")}
                  </td>
                  <td>{project.client}</td>
                  <td>
                    {project.projectRequirements &&
                    project.projectRequirements.length > 0
                      ? Object.entries(project.projectRequirements[0])
                          .filter(([_, value]) => value === true)
                          .map(([key]) => key)
                          .join(", ")
                      : "N/A"}
                  </td>
                  <td>
                    <span
                      className={`badge ${getStatusClass(
                        project.status
                      )} px-2 py-1`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons d-flex">
                      <Button
                        style={{ color: "#0d6efd" }}
                        variant="link"
                        className="p-0 me-2"
                        onClick={() => handleUpdate(project)}
                      >
                        <FaEdit />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-4">
            {loading ? "Loading..." : "No in-progress projects found."}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing 1 to {job.jobs?.length || 0} of {job.jobs?.length || 0} jobs
        </div>
        <Pagination className="m-0">
          <Pagination.Prev disabled />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      </div>

      {/* Designer Selection Modal */}
      <Modal
        show={showDesignerModal}
        onHide={() => setShowDesignerModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Designer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Choose Designer</Form.Label>
              <Form.Select
                onChange={(e) => handleDesignerChange(e.target.value)}
                defaultValue=""
              >
                <option value="">Select a designer...</option>
                {designers.map((designer, index) => (
                  <option key={index} value={designer}>
                    {designer}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default InProgressDashboard;
