import React, { useEffect, useState } from "react";
import { MdEditSquare } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { Button, Form, Table, Pagination, Modal } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchjobs, updatejob, UpdateJobAssign } from "../../../redux/slices/JobsSlice";
import {
  FaFilePdf,
  FaUpload,
  FaLink,
  FaClock,
  FaEdit,
} from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import Swal from "sweetalert2";
import { fetchusers } from "../../../redux/slices/userSlice";
import { createAssigns } from "../../../redux/slices/AssignSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiCopy } from "react-icons/bi";

function NewJobsList() {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedProduction, setSelectedProduction] = useState("");
  const [selectedAdditional, setSelectedAdditional] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const id = location.state?.id || params.id;

  const jobs = [
    {
      id: "00001",
      project: "PackageRedesign",
      client: "AcmeCorp",
      brief: "Redesign...",
      date: "2024-02-20",
    },
    {
      id: "00002",
      project: "BrandGuidelines",
      client: "TechSolutions",
      brief: "Create...",
      date: "2024-02-19",
    },
    {
      id: "00003",
      project: "MarketingMaterials",
      client: "GlobalInc",
      brief: "Design...",
      date: "2024-02-18",
    },
  ];

  const { job, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchjobs());
  }, [dispatch]);

  const handleShowDescription = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  const handleAssignJob = (job) => {
    if (job === null) {
      const selectedJobIds = Object.keys(selectedJobs).filter((id) => selectedJobs[id]);
      if (selectedJobIds.length === 0) {
        setErrorMessage("Please select at least 1 job to assign.");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
    }
    setSelectedJob(job);
    setShowAssignModal(true);
  };

  const handleRejectJobs = () => {
    const selectedJobIds = Object.keys(selectedJobs).filter((id) => selectedJobs[id]);
    if (selectedJobIds.length === 0) {
      setErrorMessage("Please select at least 1 job to reject.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    setShowRejectModal(true);
  };


  const handleSubmitRejection = () => {
    const selectedJobIds = Object.keys(selectedJobs).filter((id) => selectedJobs[id]);
    console.log(selectedJobIds);

    if (!rejectionReason.trim()) {
      setErrorMessage("Please enter a reason for rejection.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    // dispatch(updatejob({ id: selectedJobIds, data: { Status: "Reject" } }))
    dispatch(updatejob({ id: selectedJobIds, data: { Status: "Cancelled" } }))
    setSuccessMessage("Jobs rejected successfully.");
    dispatch(fetchjobs());
    setTimeout(() => setSuccessMessage(""), 3000);
    dispatch(fetchjobs());
    setSelectedJobs({});
    dispatch(fetchjobs());
    setRejectionReason("");
    dispatch(fetchjobs());
    setShowRejectModal(false);
  };

  // const handleDelete = (_id) => {
  //     console.log(_id);
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "You want to mark this job as Cancelled?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, mark as Cancelled!",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         // dispatch(deletejob({ id: _id, data: { status: "Cancelled" } }))
  //         console.log(id);

  //         dispatch(updatejob({ id: _id, data: { Status: "Cancelled" } }))
  //           .unwrap()
  //           .then(() => {
  //             Swal.fire("Updated!", "The job has been marked as Cancelled.", "success");
  //             dispatch(Project_job_Id(id));
  //           })
  //           .catch(() => {
  //             Swal.fire("Error!", "Something went wrong while updating.", "error");
  //           });
  //       }
  //     });
  //   };



  const getPriorityClass = (priority) => {
    switch ((priority || "").toLowerCase()) {
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

 const getStatusClass = (status) => {
  switch (status.toLowerCase().trim()) {
    case "in progress":
    case "in_progress":
      return "bg-warning text-dark";     // Yellow
    case "completed":
      return "bg-success text-white";    // Green
    case "cancelled":
      return "bg-danger text-white";     // Red
    case "active":
      return "bg-primary text-white";    // Blue
    case "reject":
      return "bg-danger text-white";
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


  const filteredJobs = (job?.jobs || [])
    .filter((j) => j.assignedTo === "Not Assigned")
    .filter((j) => {
      // Split searchQuery by spaces, ignore empty terms
      const terms = searchQuery.trim().split(/\s+/).filter(Boolean);
      if (terms.length === 0) {
        const matchesProject =
          selectedProject === "All Projects" ||
          (j.projectId?.[0]?.projectName?.toLowerCase() === selectedProject.toLowerCase());
        const matchesPriority =
          selectedPriority === "All Priorities" ||
          (j.priority?.toLowerCase() === selectedPriority.toLowerCase());
        const matchesStatus =
          selectedStatus === "All Status" ||
          (j.Status?.toLowerCase() === selectedStatus.toLowerCase());
        const matchesStage =
          selectedStage === "All Stages" ||
          (j.stage?.toLowerCase() === selectedStage.toLowerCase());
        return (
          matchesProject &&
          matchesPriority &&
          matchesStatus &&
          matchesStage
        );
      }
      // Prepare searchable fields as strings
      const fields = [
        j.JobNo,
        j.projectId?.[0]?.projectName,
        j.brandName,
        j.subBrand,
        j.flavour,
        j.packType,
        j.packSize,
        j.packCode,
        j.updatedAt ? new Date(j.updatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : '',
        j.createdAt ? new Date(j.createdAt).toLocaleDateString("en-GB") : '',
        j.assignedTo,
        j.priority,
        j.Status
      ].map(f => (f || '').toString().toLowerCase());
      // Every term must be found in at least one field
      const matchesSearch = terms.every(term =>
        fields.some(field => field.includes(term.toLowerCase()))
      );
      const matchesProject =
        selectedProject === "All Projects" ||
        (j.projectId?.[0]?.projectName?.toLowerCase() === selectedProject.toLowerCase());
      const matchesPriority =
        selectedPriority === "All Priorities" ||
        (j.priority?.toLowerCase() === selectedPriority.toLowerCase());
      const matchesStatus =
        selectedStatus === "All Status" ||
        (j.Status?.toLowerCase() === selectedStatus.toLowerCase());
      const matchesStage =
        selectedStage === "All Stages" ||
        (j.stage?.toLowerCase() === selectedStage.toLowerCase());
      return (
        matchesSearch &&
        matchesProject &&
        matchesPriority &&
        matchesStatus &&
        matchesStage
      );
    });

  const handleUpdate = (job) => {
    navigate(`/admin/AddJobTracker/${job._id}`, { state: { job } });
  };

  const JobDetails = (job) => {
    navigate(`/admin/OvervieJobsTracker`, { state: { job } });
  };

  const handleCheckboxChange = (jobId) => {
    setSelectedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const { userAll } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchusers());
  }, [dispatch]);

  const [currentAssignment, setCurrentAssignment] = useState(1);
  const itemsAssignment = 10;

  const filteredAssignment = (userAll?.data?.users || []).filter(
    (j) =>
      ((j?.assign || "").toString().toLowerCase() ===
        selectedDesigner.toLowerCase()) &&
      selectedDesigner !== ""
  );
  console.log("lllll", filteredAssignment);

  const paginatedAssignment = filteredAssignment.slice(
    (currentAssignment - 1) * itemsAssignment,
    currentAssignment * itemsAssignment
  );

  const handleSubmitAssignment = () => {
    const selectedJobIds = Object.keys(selectedJobs).filter((id) => selectedJobs[id]);
    const payload = {
      employeeId: [selectedEmployee],
      jobId: selectedJobIds,
      selectDesigner: selectedDesigner,
      description: assignmentDescription,
    };
    console.log("Assignment Payload:", payload);
    dispatch(createAssigns(payload))
      .unwrap()
      .then((response) => {
        console.log("API Response:", response);
        if (response.success) {
          toast.success(response.message || "Project Assigned Successfully!");
          setShowAssignModal(false);
          setSelectedJobs(false);
          navigate("/admin/MyJobs");
        } else {
          setShowAssignModal(false);
          toast.error(response.message || "Assignment failed!");
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast.error(error.message || "Failed to update project!");
      });
  };

  const handleJobAssign = (selectedIds, assignTo) => {
    const payload = {
      id: selectedIds,
      assign: assignTo,
    };
    console.log("Assignment Payload:", payload);
    dispatch(UpdateJobAssign(payload))
      .then(() => {
        // Swal.fire("Success!", "Jobs assigned successfully", "success");
      })
      .catch(() => {
        Swal.fire("Error!", "Something went wrong", "error");
      });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const paginatedProjects = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container bg-white p-3 mt-4 rounded shadow-sm">
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="fw-bold m-0">Job Assign</h5>
        <div className="d-flex gap-2 ">
          <Button onClick={handleRejectJobs} id="All_btn" className="m-2" variant="primary">
            Cancelled Job
          </Button>
          <Button
            id="All_btn"
            className="m-2"
            variant="primary"
            onClick={() => {
              const selectedJobIds = Object.keys(selectedJobs).filter((id) => selectedJobs[id]);
              if (selectedJobIds.length === 0) {
                setErrorMessage("Please select at least 1 job to assign.");
                setTimeout(() => setErrorMessage(""), 3000);
              } else {
                handleJobAssign(selectedJobIds);
                setShowAssignModal(true);
              }
            }}
          >
            Assign
          </Button>
        </div>
      </div>

      {/* Show Messages */}
      {errorMessage && (
        <div className="alert alert-danger py-2" role="alert">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success py-2" role="alert">
          {successMessage}
        </div>
      )}

      {/* Filters */}
      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <Form.Control
          type="search"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "250px" }}
        />
        <Dropdown>
          <Dropdown.Toggle variant="light" id="project-dropdown">
            {selectedProject}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSelectedProject("All Projects")}>
              All Projects
            </Dropdown.Item>
            {[...new Set((job?.jobs || []).map((j) => j.projectId?.[0]?.projectName || "N/A"))].map(
              (projectName, index) => (
                <Dropdown.Item key={index} onClick={() => setSelectedProject(projectName)}>
                  {projectName}
                </Dropdown.Item>
              )
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>

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
                    job?.jobs?.forEach((job) => {
                      newSelectedJobs[job._id] = checked;
                    });
                    setSelectedJobs(newSelectedJobs);
                  }}
                  checked={job?.jobs?.length > 0 && job?.jobs?.every((j) => selectedJobs[j._id])}
                />
              </th>
              <th>JobNo</th>
              <th style={{ whiteSpace: "nowrap" }}>Project Name</th>
              <th>Brand</th>
              <th style={{ whiteSpace: "nowrap" }}>Sub Brand</th>
              <th>Flavour</th>
              <th>PackType</th>
              <th>PackSize</th>
              <th>PackCode</th>
              <th>TimeLogged</th>
              <th>Due Date</th>
              <th>assigned</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.slice().reverse().map((job, index) => (
              <tr key={job._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedJobs[job._id] || false}
                    onChange={() => handleCheckboxChange(job._id)}
                  />
                </td>
                <td onClick={() => JobDetails(job)}>
                  <Link style={{ textDecoration: "none" }}>{job.JobNo}</Link>
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {job.projectId?.[0]?.projectName || "N/A"}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>{job.brandName}</td>
                <td style={{ whiteSpace: "nowrap" }}>{job.subBrand}</td>
                <td style={{ whiteSpace: "nowrap" }}>{job.flavour}</td>
                <td style={{ whiteSpace: "nowrap" }}>{job.packType}</td>
                <td style={{ whiteSpace: "nowrap" }}>{job.packSize}</td>
                <td style={{ whiteSpace: "nowrap" }}>{job?.packCode}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {new Date(job.updatedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {new Date(job.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{job?.assignedTo}</td>
                <td>
                  <span className={getPriorityClass(job.priority)}>{job.priority}</span>
                </td>
                <td>
                  <span className={`badge ${getStatusClass(job.Status)} px-2 py-1`}>
                    {job.Status}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    {/* <Button id="icone_btn" size="sm">
                      <FaFilePdf />
                    </Button>
                    <Button id="icone_btn" size="sm">
                      <FaUpload />
                    </Button>
                    <Button id="icone_btn" size="sm">
                      <FaLink />
                    </Button>
                    <Button id="icone_btn" size="sm">
                      <FaClock />
                    </Button> */}
                    <Button id="icone_btn" size="sm" onClick={() => handleUpdate(job)}>
                      <FaEdit />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Assign Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Designer</Form.Label>
              <Form.Select
                value={selectedDesigner}
                onChange={(e) => {
                  setSelectedDesigner(e.target.value);
                  setSelectedEmployee("");
                }}
              >
                <option value="">-- Select --</option>
                <option value="Designer">Designer</option>
                <option value="Production">Production</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select Employee</Form.Label>
              <Form.Select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                disabled={!selectedDesigner}
              >
                <option value="">-- Select Employee --</option>
                {paginatedAssignment
                  .filter((emp) => emp.role === 'employee')
                  .map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName || "Unnamed Employee"} {emp.lastName || "Unnamed Employee"}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)}
                placeholder="Enter assignment details or instructions..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitAssignment}>
            Assign
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelled Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-warning">
            Are you sure you want to reject this job?
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Reason for Cancelled</Form.Label>
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
            Cancelled
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pagination */}
      {!loading && !error && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-muted small">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {(currentPage - 1) * itemsPerPage + paginatedProjects.length} of {filteredJobs.length}
          </div>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default NewJobsList;
