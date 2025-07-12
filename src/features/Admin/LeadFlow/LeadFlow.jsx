

import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Dropdown, ButtonGroup, Badge, Container, Row, Col, ProgressBar, Modal, Popover, Overlay, Accordion } from 'react-bootstrap';
import { FunnelFill, Link, List, ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import { Kanban, Plus } from 'react-bootstrap-icons';
import { FaArrowLeft, FaUpload, FaPlus } from "react-icons/fa"; // Add this import
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { fetchAllProposals, updateProposalStatus, updateProposalStatusLocally } from '../../../redux/slices/proposalSlice';
import './Project.css';
import { useDispatch, useSelector } from 'react-redux';
import { MdManageAccounts } from 'react-icons/md';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { fetchProject, updateProject } from '../../../redux/slices/ProjectsSlice';
import { apiUrl } from '../../../redux/utils/config';
import axios from 'axios';

const initialProposals = [
  {
    id: 'p1',
    title: 'Proposal for Sunrise Apartments',
    client: 'Ramesh Kumar',
    status: 'Draft',
    stage: 'lead',
    // stage: 'create-proposal',
    updated: '2025-06-07 10:30',
    logs: [
      { by: 'Admin', at: '2025-06-07 10:30', note: 'Created proposal' }
    ]
  },
  {
    id: 'p2',
    title: 'Proposal for Metro Mall',
    client: 'Sunita Singh',
    status: 'Sent',
    stage: 'lead', // was 'automatic-delivery'
    // stage: 'client-review', // was 'automatic-delivery'
    updated: '2025-06-07 11:00',
    logs: [
      { by: 'Admin', at: '2025-06-07 10:45', note: 'Proposal sent via email' }
    ]
  },
  {
    id: 'p3',
    title: 'Proposal for Greenfield School',
    client: 'Ajay Mehra',
    status: 'Awaiting Signature',
    stage: 'client-signing',
    updated: '2025-06-07 11:30',
    logs: [
      { by: 'Client', at: '2025-06-07 11:25', note: 'Opened email' }
    ]
  }
];


const ReportsDashboard = () => {
  const reports = [
    {
      title: "Backlog Report",
      description: "Report with backlog information, including contract value and labor"
    },
    {
      title: "Basic Jobs Report",
      description: "Output with all the company jobs, with contract information when applicable"
    },
    {
      title: "Advanced Jobs Report",
      description: "Report with all the company jobs, including P&L information"
    },
    {
      title: "Contract Progress Report",
      description: "Report with all contract items in active Fixed Price jobs"
    },
    {
      title: "Job Purchases Report",
      description: "Report with all materials estimated and ordered across all the company jobs"
    },
    {
      title: "GC Report",
      description: "Report with all the Fixed Price (AIA-style billing) proposals"
    },
    {
      title: "Owner Report",
      description: "Report with all the Fixed Price (regular billing) proposals"
    },
    {
      title: "Sales",
      description: "Report with all Fixed Price contract jobs grouped by sales lead"
    },
    {
      title: "Change Order Report",
      description: "Report with all the company change orders"
    }
  ];

  return (
    <div className="container py-4 bg-white">
      <div className="row">
        <div className="col-12">
          {reports.map((report, index) => (
            <div key={index} className="mb-4">
              <h6 className="text-primary fw-semibold">{report.title}</h6>
              <p className="text-muted small mb-0">{report.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NewContractJobPage = ({ onClose, onSave }) => {
  const [jobName, setJobName] = useState('');
  const [clientName, setClientName] = useState('Bob Belcher');
  const [billingType, setBillingType] = useState('fixed-price');
  const [tags, setTags] = useState('');
  const [bidDueDate, setBidDueDate] = useState('06/10/25');
  const [schedulingColor, setSchedulingColor] = useState('yellow');
  const [salesLead, setSalesLead] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [address, setAddress] = useState('');
  const [aptSuite, setAptSuite] = useState('');

  // Save handler (shared by both buttons)
  const handleSave = () => {
    if (onSave) {
      onSave({
        jobName,
        clientName,
        billingType,
        tags,
        bidDueDate,
        schedulingColor,
        salesLead,
        projectManager,
        address,
        aptSuite
      });
    }
    onClose();
  };

  const handleDiscard = () => {
    onClose();
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="bg-white border-bottom shadow-sm">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center py-3 px-4">
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn btn-light me-3 p-2"
                onClick={onClose}
              >x
              </button>
              <h2 className="mb-0 fw-semibold">New Proposals</h2>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleDiscard}
              >
                Discard
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save Job
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="bg-white rounded shadow-sm p-4">
              <div className="row g-4">
                <div className="col-12">
                  <label className="form-label fw-semibold">Job Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    style={{ maxWidth: '500px' }}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Client Name <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative" style={{ maxWidth: '500px' }}>
                    <input
                      type="text"
                      className="form-control"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold mb-3">Which of these best describes the job?</label>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div
                        className={`card h-100 ${billingType === 'fixed-price' ? 'border-primary border-2' : 'border'}`}
                        onClick={() => setBillingType('fixed-price')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body p-3">
                          <p className="card-text small mb-3">
                            We are performing work for a <strong>lump sum</strong> and we will bill for it on
                            a <strong>percent completion basis</strong>. Change orders will be applied as
                            necessary.
                          </p>
                          <div className="text-center">
                            <span className="badge bg-primary">Fixed Price</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div
                        className={`card h-100 ${billingType === 'fixed-price-aia' ? 'border-primary border-2' : 'border'}`}
                        onClick={() => setBillingType('fixed-price-aia')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body p-3">
                          <p className="card-text small mb-3">
                            We are working for a commercial GC or government and expect to
                            bill with <strong>AIA-style</strong> applications for payment. Change orders will be
                            applied as necessary.
                          </p>
                          <div className="text-center">
                            <span className="badge bg-primary">Fixed Price with AIA-style billing</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div
                        className={`card h-100 ${billingType === 'cost-plus' ? 'border-primary border-2' : 'border'}`}
                        onClick={() => setBillingType('cost-plus')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body p-3">
                          <p className="card-text small mb-3">
                            It is a <strong>time and materials job</strong> or something else requiring custom
                            pricing tools. If a change is required, a whole new contract will
                            be produced.
                          </p>
                          <div className="text-center">
                            <span className="badge bg-secondary">Cost plus / other</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted small mt-2">
                    * This job will use the default job costing mode. Click <a href="#" className="text-primary">here</a> in case you look for more advanced options.
                  </p>
                </div>

                <div className="col-12">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="setTags" defaultChecked />
                        <label className="form-check-label fw-semibold" htmlFor="setTags">
                          Set Tags
                        </label>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter tag"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="setBidDate" defaultChecked />
                        <label className="form-check-label fw-semibold" htmlFor="setBidDate">
                          Set Bid Due Date
                        </label>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={bidDueDate}
                        onChange={(e) => setBidDueDate(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      {/* <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="setColor" defaultChecked />
                        <label className="form-check-label fw-semibold" htmlFor="setColor">
                          Set Scheduling Color
                        </label>
                      </div> */}
                      <select
                        className="form-select"
                        value={schedulingColor}
                        onChange={(e) => setSchedulingColor(e.target.value)}
                        style={{ backgroundColor: 'blue' }}
                      >
                        <option value="yellow">Yellow</option>
                        <option value="red">Red</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="setSalesLead" defaultChecked />
                        <label className="form-check-label fw-semibold" htmlFor="setSalesLead">
                          Set Sales Lead
                        </label>
                      </div>
                      <select
                        className="form-select"
                        value={salesLead}
                        onChange={(e) => setSalesLead(e.target.value)}
                      >
                        <option value="">Select Sales Lead</option>
                        <option value="john">John Doe</option>
                        <option value="jane">Jane Smith</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="setProjectManager" defaultChecked />
                        <label className="form-check-label fw-semibold" htmlFor="setProjectManager">
                          Set Project Manager
                        </label>
                      </div>
                      <select
                        className="form-select"
                        value={projectManager}
                        onChange={(e) => setProjectManager(e.target.value)}
                      >
                        <option value="">Select Project Manager</option>
                        <option value="mike">Mike Johnson</option>
                        <option value="sarah">Sarah Wilson</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="setJobAddress" defaultChecked />
                        <label className="form-check-label fw-semibold" htmlFor="setJobAddress">
                          Set Job Address
                        </label>
                      </div>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label small text-muted">Address</label>
                          <textarea
                            className="form-control"
                            rows="2"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                          <small className="text-primary">Search again. Enter manually</small>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small text-muted">Apt, Suite, etc. (optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={aptSuite}
                            onChange={(e) => setAptSuite(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* --- Blue Save Job button at the bottom --- */}
                <div className="col-12 d-flex justify-content-end mt-4">
                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={handleSave}
                  >
                    Save Job
                  </button>
                </div>
                {/* --- End Save Job button --- */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const tabs = [
  { label: 'Lead', value: 'Lead' },
  { label: 'Bidding', value: 'Bidding' },
  { label: 'Signature', value: 'Signature' },
  { label: 'Expired', value: 'Expired' },
  { label: 'All', value: 'All' },
];


// const tabs = [
//   { label: 'Lead', value: 'Active' },
//   { label: 'Bidding', value: 'Pending ' },
//   { label: 'Signature', value: 'Closed' },
//   { label: 'Expired', value: 'Rejected' },
//   { label: 'All', value: 'All' },
// ];

const LeadFlow = ({ data }) => {
  const [stageFilter, setStageFilter] = useState(stageOptions.map(opt => opt.id)); // all checked by default
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tempStageFilter, setTempStageFilter] = useState(stageFilter);
  const [showNewContractPage, setShowNewContractPage] = useState(false);
  const [activeTab, setActiveTab] = useState('manage');
  const [workflowView, setWorkflowView] = useState('workflow');
  const dropdownRef = useRef(null); // ✅ define the ref before using it
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const filterBtnRef = useRef(null);
  const [filteredData, setFilteredData] = useState(data); // `data` is your original list
  const dispatch = useDispatch()
  const [setData] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  useEffect(() => {
    dispatch(fetchAllProposals())
    dispatch(fetchProject())
  }, [dispatch])


  const project = useSelector((state) => state?.projects?.project?.data) || [];
  // console.log("abc", project)
  const { reduxProposals, loading } = useSelector((state) => state?.proposal?.proposals);
  // console.log(reduxProposals, "reduxProposals");
  const proposals = reduxProposals && reduxProposals.length > 0 ? reduxProposals : initialProposals;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // handle dropdown close
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const [jobs, setJobs] = useState([
    {
      name: "Sunrise Apartments (Plus)",
      client: "Ramesh Kumar",
      billing: "Fixed Price",
      phases: "2 phases",
      status: "Active",
      revenue: "$120,000.00",
      committedCost: "$80,000.00",
      profitLoss: "$40,000.00",
      percent: "33%",
      color: "primary"
    },
    {
      name: "Metro Mall Renovation",
      client: "Sunita Singh",
      billing: "AIA-style",
      phases: "1 phase",
      status: "Active",
      revenue: "$15,000.00",
      committedCost: "$7,500.00",
      profitLoss: "$7,500.00",
      percent: "50%",
      color: "info"
    },
    {
      name: "Greenfield School",
      client: "Ajay Mehra",
      billing: "Cost Plus",
      phases: "3 phases",
      status: "Active",
      revenue: "$290,000.00",
      committedCost: "$193,400.00",
      profitLoss: "$96,600.00",
      percent: "33%",
      color: "danger"
    }
  ]);

  const navigate = useNavigate();

  // Save new job and close form
  const handleSaveNewContract = (newJob) => {
    // 1. Add to jobs list with status 'lead'
    setJobs(prev => [
      {
        name: newJob.jobName,
        client: newJob.clientName,
        billing: newJob.billingType === "fixed-price" ? "Fixed Price" : newJob.billingType === "fixed-price-aia" ? "AIA-style" : "Cost Plus",
        phases: "1 phase",
        status: "lead", // <-- Set status to 'lead'
        revenue: "$0.00",
        committedCost: "$0.00",
        profitLoss: "$0.00",
        percent: "0%",
        color: "primary"
      },
      ...prev
    ]);
    // 2. Refresh proposals from Redux (temporary workaround)
    dispatch(fetchAllProposals());
    setShowNewContractPage(false);
    setWorkflowView('workflow'); // Switch to workflow view
  };

  const handleCloseNewContract = () => {
    setShowNewContractPage(false);
  };


  const ProposalWorkflowBoard = ({ onNavigate, selectedStatus }) => {
    const reduxProposals = useSelector((state) => state?.proposal?.proposals);
    const dispatch = useDispatch();
    const [isUpdating, setIsUpdating] = useState(false);
    const [kanbanData, setKanbanData] = useState({
      active: [],
      pending: [],
      closed: [],
      rejected: []
    });

    const [loadingSpinner, setLoadingSpinner] = useState(false); // 👈 Add loading state



    // useEffect(() => {
    //   const processProjects = async () => {
    //     if (!Array.isArray(project)) return;
    //     setLoadingSpinner(true);

    //     const updatedProjects = await Promise.all(
    //       project.map(async (p) => {
    //         const status = (p.status || "").toLowerCase();

    //         if (status === "signature") {
    //           try {
    //             const res = await axios.get(
    //               `${apiUrl}/getEnvelopesByProjectId/${p._id}`
    //             );

    //             if (res?.data?.data[0]?.current_status === "completed") {
    //               const isTempPoles = p.tempPoles === "true"; // or === true if it's boolean
    //               const newStatus = isTempPoles ? "Open" : "Active Project";

    //               await dispatch(
    //                 updateProject({
    //                   id: p._id,
    //                   payload: { status: newStatus },
    //                 })
    //               );
    //               return { ...p, status: "completed" }; // Optional: update local copy
    //             }
    //           } catch (error) {
    //             console.error(`Error checking project ${p._id}`, error.message);
    //           }
    //         }

    //         return p;
    //       })
    //     );


    //     // Step 2: Filter into Kanban columns
    //     const result = {
    //       active: updatedProjects.filter(
    //         (p) => (p.status || "").toLowerCase() === "lead"
    //       ),
    //       pending: updatedProjects.filter(
    //         (p) => (p.status || "").toLowerCase() === "bidding"
    //       ),
    //       closed: updatedProjects.filter(
    //         (p) => (p.status || "").toLowerCase() === "open" || (p.status || "").toLowerCase() === "Active Project"
    //       ),
    //       rejected: updatedProjects.filter(
    //         (p) => (p.status || "").toLowerCase() === "expired"
    //       ),
    //     };

    //     setKanbanData(result);

    //   };
    //   setLoadingSpinner(false);

    //   processProjects();
    //   // }, [project, dispatch]);


    // }, [reduxProposals, dispatch]);


    useEffect(() => {
      const processProjects = async () => {
        if (!Array.isArray(project)) return;
        setLoadingSpinner(true);

        const updatedProjects = await Promise.all(
          project.map(async (p) => {
            const status = (p.status || "").toLowerCase();

            if (status === "signature") {
              // try {
              //   const res = await axios.get(
              //     `${apiUrl}/getEnvelopesByProjectId/${p._id}`
              //   );

              //   if (res?.data?.data[0]?.current_status === "completed") {
              const isTempPoles = p.tempPoles === "true";
              const newStatus = isTempPoles ? "Open" : "Active Project";

              await dispatch(
                updateProject({
                  id: p._id,
                  payload: { status: newStatus },
                })
              );
              return { ...p, status: "completed" }; // Optional: update local copy
              //   }
              // } catch (error) {
              //   console.error(`Error checking project ${p._id}`, error.message);
              // }
            }

            return p;
          })
        );

        // Step 2: Filter into Kanban columns
        const result = {
          active: updatedProjects.filter(
            (p) => (p.status || "").toLowerCase() === "lead"
          ),
          pending: updatedProjects.filter(
            (p) => (p.status || "").toLowerCase() === "bidding"
          ),
          closed: updatedProjects.filter(
            (p) => (p.status || "").toLowerCase() === "open" || (p.status || "").toLowerCase() === "Active Project"
          ),
          rejected: updatedProjects.filter(
            (p) => (p.status || "").toLowerCase() === "expired"
          ),
        };

        setKanbanData(result);
        setLoadingSpinner(false);
      };

      processProjects();
    }, []);


    const handleCardDrop = async (result) => {
      const { source, destination, draggableId } = result;
      if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

      const statusMap = {
        active: "Lead",
        pending: "Bidding",
        closed: "Signature",
        rejected: "Expired"
      };

      const newStatus = statusMap[destination.droppableId];

      setIsUpdating(true);

      try {
        // Update DB status
        await dispatch(updateProject({ id: draggableId, payload: { status: newStatus } }));

        // Fetch updated list
        await dispatch(fetchProject());
        // console.log("fetcing project...");

        setKanbanData(prevData => {
          const updatedData = { ...prevData };

          // Remove from current column
          const currentStage = Object.keys(prevData).find(key =>
            prevData[key].some(item => item._id === draggableId)
          );
          updatedData[currentStage] = updatedData[currentStage].filter(item => item._id !== draggableId);

          // Add to new column
          const movedItem = prevData[currentStage].find(item => item._id === draggableId);
          if (movedItem) {
            const updatedItem = { ...movedItem, status: newStatus };
            updatedData[destination.droppableId] = [...updatedData[destination.droppableId], updatedItem];
          }

          return updatedData;
        });

      } catch (error) {
        console.error("Failed to update status", error);
      }

      setIsUpdating(false);
    };


    let columns = [
      { id: 'active', title: 'Lead' },
      { id: 'pending', title: 'Bidding' },
      { id: 'closed', title: 'Signature' },
      { id: 'rejected', title: 'Expired' },
    ];

    // Reorder columns so selectedStatus is first
    if (selectedStatus && selectedStatus !== 'All') {
      const statusMap = {
        'Active': 'active',
        'Pending': 'pending',
        'Closed': 'closed',
        'Rejected': 'rejected',
      };
      const selectedId = statusMap[selectedStatus];
      if (selectedId) {
        columns = [columns.find(c => c.id === selectedId), ...columns.filter(c => c.id !== selectedId)];
      }
    }

    return (
      <div style={{ position: 'relative' }}>
        {isUpdating && (
          <div className="kanban-loading-overlay">
            Updating...
          </div>
        )}
        {loadingSpinner ? (
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="mt-3">Loading...</div>
          </div>
        ) : (
          <DragDropContext key={project.map(p => p.id).join('-')} onDragEnd={handleCardDrop}>
            <div className="kanban-board d-flex flex-nowrap gap-3 py-3" style={{ overflowX: "auto", minHeight: 350, marginLeft: "20px", WebkitOverflowScrolling: 'touch' }}>
              {columns.map(col => (
                <Droppable droppableId={col.id} key={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="kanban-stage bg-light border rounded p-2 flex-shrink-0 d-flex flex-column"
                      style={{ minWidth: 220, maxWidth: 320, minHeight: 320, width: '100%', flex: '1 1 260px', background: snapshot.isDraggingOver ? '#e3f2fd' : undefined }}
                    >
                      <div className="fw-bold mb-2 d-flex align-items-center gap-2">
                        <span className="text-dark" style={{ fontSize: 14 }}>
                          <span className="me-1" style={{ fontSize: 10 }}>●</span>
                          {col.title}
                        </span>
                        <span className="badge bg-light text-dark border ms-auto">{kanbanData[col.id]?.length || 0}</span>
                      </div>
                      {kanbanData[col.id]?.map((item, idx) => (
                        <Draggable draggableId={String(item._id)} index={idx} key={item._id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white border rounded mb-2 p-2 shadow-sm"
                              style={{
                                minHeight: 110,
                                wordBreak: 'break-word',
                                maxWidth: '100%',
                                background: snapshot.isDragging ? '#fffde7' : undefined,
                                ...provided.draggableProps.style
                              }}
                              onClick={() => {
                                localStorage.setItem("proposalId", item._id);
                                localStorage.setItem("invoice", JSON.stringify(item));
                                navigate("/admin/LeadFlow/Details", { state: { item: item } });
                              }}
                            >
                              {item.status == "signature" || item.status == "Signature" || item.status == "open" || item.status == "Open" || item.status == 'Active Project' ? <div className='d-flex justify-content-between'>
                                <div className="fw-semibold text-primary" style={{ fontSize: 15 }}>
                                  {item.projectName || item.title}
                                </div>
                                ✅
                              </div> :
                                <div className="fw-semibold text-primary" style={{ fontSize: 15 }}>
                                  {item.projectName || item.title}
                                </div>}
                              <div className="text-muted small mb-1">Client: {item?.clientId?.clientName}</div>
                              <div className="small text-secondary mb-1">Billing: {item.billing || item.job_type}</div>
                              <div className="small text-secondary mb-1">Phases: {item.phases}</div>
                              <div className="d-flex flex-wrap gap-2 align-items-center mb-1">
                                <Badge
                                  bg={item.status === 'Open' || item.status === 'Active Project' ? 'success' : (item.status === 'Bidding' ? 'warning' : 'info')}
                                  className="me-1"
                                >
                                  {item.status === 'Open' || item.status === 'Active Project' ? 'Signature' : (item.status == "Bidding" ? "mail sent" : item.status)}
                                </Badge>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    );
  };


  const [selectedStatus, setSelectedStatus] = useState('All');
  const [expandedJobIndex, setExpandedJobIndex] = useState(null);

  // Filter jobs based on selectedStatus
  const filteredJobs = selectedStatus === 'All'
    ? jobs
    : jobs?.filter(job => job.status === selectedStatus);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'reports':
        return <ReportsDashboard />;
      case 'manage':
      default:
        return (
          <>
            {/* Modern Filter Bar */}

            {/* --- Switch between List and Workflow views --- */}
            {workflowView === 'workflow' ? (
              <ProposalWorkflowBoard onNavigate={navigate} selectedStatus={selectedStatus} />
            ) : (
              <div className="bg-white py-3 p-4 rounded shadow-sm">
                {/* Accordion for each job */}
                <Accordion activeKey={expandedJobIndex !== null ? expandedJobIndex.toString() : null} alwaysOpen>
                  {filteredJobs?.length === 0 && (
                    <div className="text-center text-muted py-5">
                      <div className="mb-2">
                        <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9 9h.01M15 9h.01M8 15c1.333-1 2.667-1 4 0" /></svg>
                      </div>
                      <div className="fw-semibold">No projects found for this filter.</div>
                      <div className="small">Try a different status or add a new project.</div>
                    </div>
                  )}
                  {filteredJobs?.map((project, index) => (
                    <Accordion.Item eventKey={index.toString()} key={index} className="mb-2 border rounded shadow-sm">
                      <Accordion.Header
                        onClick={() => setExpandedJobIndex(expandedJobIndex === index ? null : index)}
                        className="d-flex align-items-center"
                        style={{ cursor: 'pointer', background: '#f8f9fa' }}
                      >
                        <div className="d-flex align-items-center w-100">
                          <div className="fw-bold me-3" style={{ minWidth: 180 }}>
                            {project.name}
                            <div className="text-muted small">for {project.client}</div>
                          </div>
                          <Badge bg={project.color} className="me-3 text-capitalize">{project.status}</Badge>
                          <div className="me-3"><span className="fw-semibold">{project.revenue}</span></div>
                          <div className="me-3"><span className="fw-semibold">{project.committedCost}</span></div>
                          <div className="me-3"><span className="fw-semibold">{project.profitLoss}</span></div>
                          <div className="me-3">
                            <div className={`rounded-circle border border-${project.color} text-${project.color} d-flex flex-column justify-content-center align-items-center`} style={{ width: '40px', height: '40px', fontSize: 14 }}>
                              <div className="fw-bold">{project.percent}</div>
                              <div className="small">{project.color === 'danger' ? 'Loss' : 'Profit'}</div>
                            </div>
                          </div>
                          <span className="ms-auto">{expandedJobIndex === index ? <ChevronUp /> : <ChevronDown />}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="bg-light">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div><strong>Client:</strong> {project.client}</div>
                            <div><strong>Billing:</strong> {project.billing}</div>
                            <div><strong>Phases:</strong> {project.phases}</div>
                            <div><strong>Status:</strong> {project.status}</div>
                          </div>
                          <div className="col-md-6">
                            <div><strong>Revenue:</strong> {project.revenue}</div>
                            <div><strong>Committed Cost:</strong> {project.committedCost}</div>
                            <div><strong>Profit/Loss:</strong> {project.profitLoss}</div>
                            <div><strong>Percent:</strong> {project.percent}</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Button variant="outline-primary" size="sm" className="me-2">Invoice now</Button>
                          <Button variant="outline-secondary" size="sm">View Details</Button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <>
      {showNewContractPage ? (
        <NewContractJobPage
          onClose={handleCloseNewContract}
          onSave={handleSaveNewContract} // Pass save handler
        />
      ) : (
        <div className="contract-jobs-wrapper">
          <div className="project-container">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center px-4 py-3 mb-3" style={{ minHeight: 64 }}>
              <h5 className="fw-bold mb-0" style={{ fontSize: '2rem' }}>Proposals</h5>
            </div>
            {/* Search and Actions */}
            <div className="mb-4">
              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search projects.."
                  // value={searchTerm}
                  // onChange={(e) => setSearchTerm(e.target.value)} // 👈 Handle input
                  />
                </div>


                <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2 mb-3">
                  {/* <ButtonGroup> */}
                  {/* <Button
                      variant={activeTab === 'manage' ? 'primary' : 'outline-primary'}
                      active={activeTab === 'manage'}
                      onClick={() => setActiveTab('manage')}
                      className="d-flex align-items-center"
                    >
                      <MdManageAccounts className="me-2" size={18} /> Manage Leads
                    </Button> */}
                  {/* <Button
                      variant={activeTab === 'reports' ? 'primary' : 'outline-primary'}
                      active={activeTab === 'reports'}
                      onClick={() => setActiveTab('reports')}
                      className="d-flex align-items-center"
                    >
                      <HiOutlineDocumentReport className="me-2" size={18} /> Lead Reports
                    </Button> */}
                  <Button
                    variant='primary'
                    // active={activeTab === 'reports'}
                    // onClick={() => navigate("/admin/AddProjectList")}
                    onClick={() => navigate("/admin/AddCostEstimates")}
                    className="d-flex align-items-center"
                  >
                    Create Proposal
                  </Button>
                  <Button
                    variant='primary'
                    // active={activeTab === 'reports'}
                    // onClick={() => navigate("/admin/AddProjectList")}
                    onClick={() => navigate("/admin/AddProjectList")}
                    className="d-flex align-items-center"
                  >
                    Create Project
                  </Button>
                  {/* </ButtonGroup> */}
                </div>

              </div>
            </div>

            {/* Project Status Tabs */}
            <div className="project-tabs mb-4">
              <ul className="nav nav-tabs d-none d-md-flex">
                {tabs.map((tab) => (
                  <li className="nav-item" key={tab.value}>
                    <button
                      className={`nav-link ${selectedStatus === tab.value ? 'active' : ''}`}
                      onClick={() => setSelectedStatus(tab.value)}
                      style={{ color: "#0d6efd", borderColor: "#0d6efd" }}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>



              <div className="d-flex d-md-none">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary" id="dropdown-tabs" className="w-100">
                    {tabs.find(t => t.value === selectedStatus)?.label || 'Select'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    {tabs.map((tab) => (
                      <Dropdown.Item
                        key={tab.value}
                        active={tab.value === selectedStatus}
                        onClick={() => setSelectedStatus(tab.value)}
                      >
                        {tab.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            {/* Loader */}
            {loading && (
              <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <div className="mt-2">Loading projects...</div>
              </div>
            )}

          </div>
          {/* Tabs Section */}
          {/* Filter Bar - always visible in Manage Project tab */}
          {/* / */}
          {renderTabContent()}
        </div>
      )}
    </>
  );
};

const stageOptions = [
  { id: 'active', label: 'Active', count: 0 },
  { id: 'pending-changes', label: 'Pending changes', count: 0 },
  { id: 'closed', label: 'Closed', count: 0 },
  { id: 'rejected', label: 'Rejected', count: 0 }
];

export default LeadFlow;