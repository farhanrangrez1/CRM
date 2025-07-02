import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaPencilAlt, FaTrashAlt, FaPlus, FaFilter } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTimeLogs, fetchTimeLogss, updateExtraHours } from '../../../redux/slices/TimeLogsSlice';
import { Button, Form, Modal,Dropdown } from "react-bootstrap";
import Swal from 'sweetalert2';
import TimesheetWorklog from '../TimesheetWorklog/TimesheetWorklog';
import { fetchTimesheetWorklogs } from '../../../redux/slices/TimesheetWorklogSlice';

function TimeLogs() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedLogId, setSelectedLogId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [selectedJobs, setSelectedJobs] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [extraHours, setExtraHours] = useState('');

  // New state for toggling filters on small screens
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchTimeLogss());
  }, [dispatch]);

  const handleCheckboxChange = (jobId) => {
    setSelectedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };
  const handleSubmitAssignment = () => {
    const selectedJobIds = Object.keys(selectedJobs).filter((id) => selectedJobs[id]);

    if (selectedJobIds.length === 0) {
      setErrorMessage("Please select at least 1 job to assign.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (!extraHours) {
      setErrorMessage("Please enter extra hours.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const payload = {
      id: selectedJobIds,
      extraHours: extraHours,
    };

    console.log("Dispatching payload:", payload);

    dispatch(updateExtraHours(payload))
      .unwrap()
      .then(() => {
        setSelectedJobs({});
        dispatch(fetchTimeLogss());
        setShowAssignModal(false);
        setExtraHours('');
      })
      .catch((error) => {
        setErrorMessage(`Failed to update: ${error}`);
        setTimeout(() => setErrorMessage(""), 3000);
      });
  };

  //  all client
  // const { timelogs, error, loading } = useSelector((state) => state.TimeLogss);
  // console.log(timelogs.TimeLogss);

  // useEffect(() => {
  //   dispatch(fetchTimeLogss());
  // }, [dispatch]);

  const { timesheetWorklog, error, loading } = useSelector((state) => state.TimesheetWorklogs);
  console.log(timesheetWorklog.TimesheetWorklogss);

  useEffect(() => {
    dispatch(fetchTimesheetWorklogs());
  }, [dispatch]);

  const itemsPerPage = 7;

  const filteredTimeLogs = (timesheetWorklog.TimesheetWorklogss || []).filter((log) => {
    // Split searchQuery by spaces, ignore empty terms
    const terms = searchQuery.trim().split(/\s+/).filter(Boolean);
    const employeeName = log.employeeId?.[0] 
      ? `${log.employeeId[0].firstName} ${log.employeeId[0].lastName}`.toLowerCase()
      : '';
    const projectName = (log.projectId?.[0]?.projectName || '').toLowerCase();
    const jobNo = (log.jobId?.[0]?.JobNo || '').toString().toLowerCase();
    const taskDescription = (log.taskDescription || '').toLowerCase();
    const status = (log.status || '').toLowerCase();
    const fields = [
      employeeName,
      projectName,
      jobNo,
      taskDescription,
      status
    ];
    // Every term must be found in at least one field
    const matchesSearch = terms.length === 0 || terms.every(term =>
      fields.some(field => field.includes(term.toLowerCase()))
    );
    const matchesDate =
      !selectedDate ||
      new Date(log.date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString();
    const matchesProject =
      selectedProject === "All Projects" ||
      projectName === selectedProject.toLowerCase();
    return matchesSearch && matchesDate && matchesProject;
  });

  const totalPages = Math.ceil(filteredTimeLogs.length / itemsPerPage);
  const paginatedTimeLogss = filteredTimeLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (log) => {
    navigate(`/admin/AddTimelog`, { state: { log } });
  };

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteTimeLogs(_id))
          .then(() => {
            Swal.fire("Deleted!", "The document has been deleted.", "success");
            dispatch(fetchTimeLogss());
          })
          .catch(() => {
            Swal.fire("Error!", "Something went wrong.", "error");
          });
      }
    });
  }

  function formatTimeTo12Hour(time24) {
    if (!time24) return '';

    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr ? minuteStr.padStart(2, '0') : '00';

    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minute} ${ampm}`;
  }

  function timeStringToDecimalHours(time24) {
    if (!time24) return 0;
    const [hourStr, minuteStr] = time24.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr || '0', 10);
    return hour + minute / 60;
  }
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h3 className="mb-0">Time Logs</h3>
        <div className="d-flex gap-3 mt-4 flex-wrap align-items-center">
          <Link className="text-decoration-none">
            {/* <Button
              className="btn d-flex align-items-center gap-2"
              size="sm"
              id='All_btn'
              variant="dark"
              onClick={() => {
                const selectedJobIds = Object.keys(selectedJobs).filter((id) => selectedJobs[id]);

                if (selectedJobIds.length === 0) {
                  setErrorMessage("Please select at least 1 List to assign.");
                  setTimeout(() => setErrorMessage(""), 3000);
                } else {
                  const dataToSend = {
                    id: selectedJobIds,
                    extraHours: extraHours || "0:00",
                  };

                  console.log("Payload to send:", dataToSend);

                  setShowAssignModal(true);
                }
              }}
            >
              <FaPlus /> ExtraTime
            </Button> */}
          </Link>
          <Link to={"/admin/AddTimesheetWorklog"} className="text-decoration-none">
            <button id='All_btn' className="btn btn-dark d-flex align-items-center gap-2">
              <FaPlus /> Add Time Log
            </button>
          </Link>
          {/* <Link to={"/admin/AddTimelog"} className="text-decoration-none">
            <button id='All_btn' className="btn btn-dark d-flex align-items-center gap-2">
              <FaPlus /> Add Time Log
            </button>
          </Link> */}
          <Button
            className="d-md-none d-flex align-items-center gap-2 mb-2"
            size="sm"
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </Button>
        </div>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {/* Filters Section */}
      <div
        className={`row g-3 mb-4 
          ${showFilters ? 'd-block' : 'd-none d-md-flex'}
        `}
      >
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search time logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaCalendarAlt className="text-muted" />
            </span>
            <input
              type="date"
              className="form-control border-start-0"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <Dropdown>
            <Dropdown.Toggle variant="light" id="project-dropdown" className="w-100">
              {selectedProject}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedProject("All Projects")}>
                All Projects
              </Dropdown.Item>
              {[...new Set((timesheetWorklog.TimesheetWorklogss || []).map((log) => 
                log.projectId?.[0]?.projectName || "N/A"
              ))].filter(name => name !== "N/A").map((projectName, index) => (
                <Dropdown.Item key={index} onClick={() => setSelectedProject(projectName)}>
                  {projectName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newSelected = {};
                        paginatedTimeLogss?.forEach((log) => {
                          if (log._id) newSelected[log._id] = checked;
                        });
                        setSelectedJobs(newSelected);
                      }}
                      checked={
                        paginatedTimeLogss?.length > 0 &&
                        paginatedTimeLogss?.every((log) => selectedJobs[log._id])
                      }
                    />
                  </th>
                  <th>JobID</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Project Name</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Employee Name</th>
                  <th>Date</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Start Time</th>
                  <th style={{ whiteSpace: 'nowrap' }}>End Time</th>
                  <th>Hours</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Task Description</th>
                  <th>Status</th>
                  {/* <th className="text-end">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {paginatedTimeLogss?.map((log, index) => {
                  const extraHoursDecimal = timeStringToDecimalHours(log.extraHours);
                  const hoursDecimal = timeStringToDecimalHours(log.hours);

                  const isHoursDiscrepant = hoursDecimal > 8;
                  const isExtraHoursDiscrepant = extraHoursDecimal < 8;
                  return (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedJobs[log._id] || false}
                          onChange={() => handleCheckboxChange(log._id)}
                        />
                      </td>
                      <td className="no-border-bottom">
                        #JOB{log.jobId?.[0]?.JobNo || '----'}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }} key={index}>
                        {log.projectId?.[0]?.projectName || 'No Project Name'}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }} key={index}>
                        {log.employeeId?.[0]
                          ? `${log.employeeId[0].firstName} ${log.employeeId[0].lastName}`
                          : 'No Employee'}
                      </td>
                      <td>{new Date(log.date).toLocaleDateString('en-GB').replace(/\/20/, '/')}</td>
                      <td>
                        {log.startTime}
                      </td>
                      <td>
                        {log.endTime}
                      </td>
                      {/* <td>
                        {(!log.extraHours || log.extraHours === '0' || log.extraHours === '0:00') ? '-' : formatTimeTo12Hour(log.extraHours)}
                      </td> */}
                      <td>
                        {log.hours}
                      </td>
                      {/* <td
                        style={{
                          color: isHoursDiscrepant ? 'red' : 'inherit',
                          fontWeight: isHoursDiscrepant ? 'bold' : 'normal',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatTimeTo12Hour(log.hours)}
                      </td> */}
                      <td style={{ whiteSpace: 'nowrap' }}>{log.taskDescription}</td>
                      <td className="py-3">
                        <span className={`badge rounded-pill ${log.status === 'Approved' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} px-3 py-2`}>
                          {log.status}
                        </span>
                      </td>
                      {/* <td className="text-end" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          className="btn btn-link text-dark p-0 me-3"
                          onClick={() => handleEdit(log)}
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={() => handleDelete(log._id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {!loading && !error && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-muted small">
            Showing 1 to {paginatedTimeLogss?.length || 0} of {timesheetWorklog.TimesheetWorklogss?.length || 0} entries
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

      {/* Assign Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Extra Hours</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Extra Hours</Form.Label>
              <Form.Control
                type="time"
                value={extraHours}
                onChange={(e) => setExtraHours(e.target.value)}
                placeholder="Enter extra hours"
                step="60" // step in seconds — 60 = 1 min steps
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button id='All_btn' onClick={handleSubmitAssignment}>
            Save Time Log
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default TimeLogs;