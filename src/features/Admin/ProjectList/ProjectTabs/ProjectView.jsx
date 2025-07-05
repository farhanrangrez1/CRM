import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Dropdown, ButtonGroup, Badge, Container, Row, Col, ProgressBar, Modal, Popover, Overlay, Accordion, Spinner } from 'react-bootstrap';
import { FunnelFill, Link, List, ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import { Kanban, Plus } from 'react-bootstrap-icons';
import { FaArrowLeft, FaUpload, FaPlus } from "react-icons/fa"; // Add this import
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { fetchAllProposals, updateProposalStatus, updateProposalStatusLocally } from '../../../../redux/slices/proposalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MdManageAccounts } from 'react-icons/md';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { fetchProject, updateProject, updateProjectStatusLocally } from '../../../../redux/slices/ProjectsSlice';


// --- Kanban Workflow Data ---
const initialStages = [
    { id: 'create-proposal', title: 'Create Proposal' },
    { id: 'client-review', title: 'Client Review' }, // Changed from 'automatic-delivery'
    { id: 'client-signing', title: 'Contract Signing' },
    { id: 'auto-activation', title: 'Auto-Activation' }
];

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

const projects = [
    {
        name: "Sunrise Apartments (Plus)",
        client: "Ramesh Kumar",
        billing: "Fixed Price",
        phases: "2 phases",
        status: "lead",
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
    },
    {
        name: "Greenfield School",
        client: "Ajay Mehra",
        billing: "Cost Plus",
        phases: "3 phases",
        status: "Biding",
        revenue: "$290,000.00",
        committedCost: "$193,400.00",
        profitLoss: "$96,600.00",
        percent: "33%",
        color: "danger"
    }
];

// --- Proposal Creation Modal ---
const ProposalCreationModal = ({ show, onHide, onSave }) => {
    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');
    const [details, setDetails] = useState('');
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create/Edit Proposal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>Proposal Title</Form.Label>
                        <Form.Control value={title} onChange={e => setTitle(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Client Name</Form.Label>
                        <Form.Control value={client} onChange={e => setClient(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Bid/Proposal Details</Form.Label>
                        <Form.Control as="textarea" rows={3} value={details} onChange={e => setDetails(e.target.value)} />
                    </Form.Group>
                    <div className="d-flex gap-2 mt-3">
                        <Button variant="outline-primary" onClick={() => alert('Text Bid sent!')}>Text Bid</Button>
                        <Button variant="primary" onClick={() => alert('Email Bid sent!')}>Email Bid</Button>
                    </div>
                </Form>
                <div className="mt-4">
                    <h6>Preview</h6>
                    <div className="border rounded p-2 bg-light">
                        <strong>{title || 'Proposal Title'}</strong>
                        <div>{client || 'Client Name'}</div>
                        <div className="text-muted small">{details || 'Proposal details preview...'}</div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button variant="primary" onClick={() => { onSave({ title, client, details }); onHide(); }}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
};

// --- Proposal Card ---
const ProposalCard = ({ proposal, onShowLogs }) => (
    <div className="bg-white border rounded mb-2 p-2 shadow-sm" style={{ minHeight: 110, wordBreak: 'break-word', maxWidth: '100%' }}>
        <div className="fw-semibold">{proposal.title}</div>
        <div className="text-muted small">{proposal.client}</div>
        <div className="small">Status: <span className="fw-bold">{proposal.status}</span></div>
        <div className="small text-muted">Last updated: {proposal.updated}</div>
        <Button size="sm" variant="link" className="p-0 mt-1" onClick={() => onShowLogs(proposal.logs)}>
            Stage logs
        </Button>
    </div>
);

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

const ChangeOrdersUI = () => {
    const [activeTab, setActiveTab] = useState('change-orders');
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="bg-white min-vh-100">
            {/* Navigation Tabs */}
            <div className="bg-white">
                <div className="container-fluid px-3 pt-3">
                    <div className="d-flex gap-1">
                        <button
                            className={`btn btn-sm px-3 py-2 rounded-1 border-0 fw-medium ${activeTab === 'change-orders'
                                ? 'bg-dark text-white'
                                : 'bg-light text-secondary'
                                }`}
                            onClick={() => setActiveTab('change-orders')}
                        >
                            Change orders
                        </button>
                        <button
                            className={`btn btn-sm px-3 py-2 rounded-1 border-0 fw-medium ${activeTab === 'daily-logs'
                                ? 'bg-dark text-white'
                                : 'bg-light text-secondary'
                                }`}
                            onClick={() => setActiveTab('daily-logs')}
                        >
                            Daily logs
                        </button>
                        <button
                            className={`btn btn-sm px-3 py-2 rounded-1 border-0 fw-medium ${activeTab === 'phases'
                                ? 'bg-dark text-white'
                                : 'bg-light text-secondary'
                                }`}
                            onClick={() => setActiveTab('phases')}
                        >
                            Phases
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white border-top border-bottom">
                <div className="container-fluid px-3 py-3">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control border border-secondary rounded-1 ps-2"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ fontSize: '14px' }}
                                />
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="d-flex justify-content-start gap-2 ms-2">
                                <button className="btn btn-outline-secondary btn-sm border border-secondary rounded-1 px-2 py-1">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </button>
                                <button className="btn btn-outline-secondary btn-sm border border-secondary rounded-1 px-2 py-1">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Counter */}
            <div className="bg-white border-bottom">
                <div className="container-fluid px-3 py-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted" style={{ fontSize: '13px' }}>0 of 0</span>
                        <div className="d-flex gap-1">
                            <button className="btn btn-link btn-sm text-muted p-1 border-0">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="15,18 9,12 15,6"></polyline>
                                </svg>
                            </button>
                            <button className="btn btn-link btn-sm text-muted p-1 border-0">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9,18 15,12 9,6"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Empty State */}
            <div className="container-fluid px-3">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                            {/* Search Icon */}
                            <div className="mb-4">
                                <div
                                    className="rounded-circle border border-2 border-dark d-flex align-items-center justify-content-center bg-white"
                                    style={{ width: '80px', height: '80px' }}
                                >
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* No Results Message */}
                            <h4 className="fw-bold text-dark mb-3" style={{ fontSize: '24px' }}>No results</h4>
                            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                                There are no change orders to be displayed
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// const tabs = [
//     { label: 'Active Project', value: 'Active' },
//     { label: 'Pending', value: 'Pending ' },
//     { label: 'Closed', value: 'Closed' },
//     { label: 'Rejected', value: 'Rejected' },
//     { label: 'All', value: 'All' },
// ];

const tabs = [
    { label: 'Pending Proposal Approval', value: 'Pending Proposal Approval' },
    { label: 'Service Calls', value: 'Service Calls' },
    { label: 'Pending Rough', value: 'Pending Rough' },
    { label: 'UG Pipes', value: 'UG Pipes' },
    { label: 'Meter Spot Requested', value: 'Meter Spot Requested' },
    { label: 'Ready for Rough', value: 'Ready for Rough' },
    { label: 'Rough Started', value: 'Rough Started' },
    { label: 'Rough Finish', value: 'Rough Finish' },
    { label: 'Pending Finish', value: 'Pending Finish' },
    { label: 'Finish Started', value: 'Finish Started' },
    { label: 'Finish Final Work', value: 'Finish Final Work' },
    { label: 'Done Final Payment', value: 'Done Final Payment' },
    { label: 'Photos of Job', value: 'Photos of Job' },
    { label: 'All', value: 'All' },
];



const ProjectView = ({ data }) => {
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
    }, [])
    const { project, error, loading } = useSelector((state) => state.projects);
    // Remove the incorrect destructuring and useSelector for reduxProposals
    // const { reduxProposals,  } = useSelector((state) => state?.proposal?.proposals);
    // Instead, get proposals from project.data or fallback to initialProposals
    const proposals = project && project.data && project.data.length > 0 ? project.data : initialProposals;
    // console.log(proposals, "proposals");

    const [filterRows, setFilterRows] = useState([
        { field: '', value: '' }
    ]);

    const handleAddFilterRow = () => {
        setFilterRows(prev => [...prev, { field: '', value: '' }]);
    };

    const handleClearFilters = () => {
        setFilterRows([{ field: '', value: '' }]); // Reset filter fields
        setFilteredData(data);                    // Reset table/list view
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // handle dropdown close
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [selectedItems, setSelectedItems] = useState([]);

    const handleSelectAll = () => {
        const allIds = data.map(item => item.id); // Replace `data` with your actual item list
        setSelectedItems(allIds);
    };

    const handleClear = () => {
        setSelectedItems([]); // or setSearch('') or whatever you're clearing
    };

    const handleCancel = () => {
        // Example: close modal or clear state
        setShowModal(false); // or reset editing state
    };

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

    // Add new job handler
    const handleAddNewContract = () => {
        setShowNewContractPage(true);
    };

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

    // --- Proposal Workflow Board ---
    // const ProposalWorkflowBoard = ({ onNavigate, selectedStatus }) => {
    //     // Defensive: always fallback to []
    //     const reduxProposals = (project.data || []).map(item => ({
    //         id: item.id,
    //         title: item.projectName,
    //         client: item.clientId?.clientName,
    //         status: mapStatus(item.status),
    //         projectPriority: item.projectPriority,
    //         phases: item.phases || "N/A",
    //         revenue: item.budgetAmount ? `AED ${item.budgetAmount}` : "N/A",
    //         startDate: item.startDate,
    //         endDate: item.endDate,
    //         committedCost: "4220",
    //         profitLoss: "N/A",
    //         updated: item.updatedAt,
    //     }));

    //     function mapStatus(status) {
    //         if (status === "Active Project") return "active";
    //         if (status === "Pending") return "pending";
    //         if (status === "Closed") return "closed";
    //         if (status === "Rejected") return "rejected";
    //         return "pending";
    //     }
    //     // const reduxProposals = useSelector((state) => state?.proposal?.proposals) || [];
    //     console.log(reduxProposals, "reduxProposals in workflow board");
    //     const dispatch = useDispatch();
    //     const [isUpdating, setIsUpdating] = useState(false);

    //     const kanbanData = {
    //         active: reduxProposals.filter(p => p.status === "active"),
    //         pending: reduxProposals.filter(p => p.status === "pending"),
    //         closed: reduxProposals.filter(p => p.status === "closed"),
    //         rejected: reduxProposals.filter(p => p.status === "rejected"),
    //     };

    //     const handleCardDrop = async (result) => {
    //         const { source, destination, draggableId } = result;
    //         if (!destination) return;
    //         if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    //         const statusMap = {
    //             active: "Active Project",
    //             pending: "Pending",
    //             closed: "Closed",
    //             rejected: "Rejected"
    //         };
    //         const newStatus = statusMap[destination.droppableId];
    //         // Optimistically update UI
    //         dispatch(updateProjectStatusLocally({ id: draggableId, status: newStatus }));
    //         setIsUpdating(true);
    //         try {
    //             await dispatch(updateProject({ id: draggableId, payload: { status: newStatus } }));
    //             await dispatch(fetchProject());
    //         } catch (error) {
    //             console.error("Failed to update status", error);
    //         }
    //         setIsUpdating(false);
    //     };
    //     // --- Kanban Columns Config ---
    //     let columns = [
    //         // { id: 'active', title: 'Active' },
    //         // { id: 'pending', title: 'Pending changes' },
    //         // { id: 'closed', title: 'Closed' },
    //         // { id: 'rejected', title: 'Rejected' },
    //         { id: 'active', title: 'Pending Proposal Approval' },
    //         { id: 'pending', title: 'Service Calls' },
    //         { id: 'closed', title: 'Pending Rough' },
    //         { id: 'rejected', title: 'UG Pipes' },
    //         { id: 'rejected', title: 'Meter Spot Requested' },
    //         { id: 'rejected', title: 'Ready for Rough' },
    //         { id: 'rejected', title: 'Rough Started' },
    //         { id: 'rejected', title: 'Rough Finish' },
    //         { id: 'rejected', title: 'Pending Finish' },
    //         { id: 'rejected', title: 'Finish Started' },
    //         { id: 'rejected', title: 'Finish Final Work' },
    //         { id: 'rejected', title: 'Done Final Payment' },
    //         { id: 'rejected', title: 'Photos of Job' },
    //     ];
    //     // Reorder columns so selectedStatus is first
    //     if (selectedStatus && selectedStatus !== 'All') {
    //         const statusMap = {
    //             'Active': 'active',
    //             'Pending ': 'pending',
    //             'Closed': 'closed',
    //             'Rejected': 'rejected',
    //         };
    //         const selectedId = statusMap[selectedStatus];
    //         if (selectedId) {
    //             columns = [columns.find(c => c.id === selectedId), ...columns.filter(c => c.id !== selectedId)];
    //         }
    //     }

    //     return (
    //         <div style={{ position: 'relative' }}>
    //             {isUpdating && (
    //                 <div className="kanban-loading-overlay">
    //                     Updating...
    //                 </div>
    //             )}
    //             <DragDropContext key={reduxProposals.map(p => p.id).join('-')} onDragEnd={handleCardDrop}>
    //                 <div
    //                     className="kanban-board d-flex flex-nowrap gap-3 py-3"
    //                     style={{ overflowX: "auto", minHeight: 350, marginLeft: "20px", WebkitOverflowScrolling: 'touch' }}
    //                 >
    //                     {columns.map(col => (
    //                         <Droppable droppableId={col.id} key={col.id}>
    //                             {(provided, snapshot) => (
    //                                 <div
    //                                     ref={provided.innerRef}
    //                                     {...provided.droppableProps}
    //                                     className="kanban-stage bg-light border rounded p-2 flex-shrink-0 d-flex flex-column"
    //                                     style={{ minWidth: 220, maxWidth: 320, minHeight: 320, width: '100%', flex: '1 1 260px', background: snapshot.isDraggingOver ? '#e3f2fd' : undefined }}
    //                                 >
    //                                     {/* Stage Title with Dot and Count */}
    //                                     <div className="fw-bold mb-2 d-flex align-items-center gap-2">
    //                                         <span className="text-dark" style={{ fontSize: 14 }}>
    //                                             <span className="me-1" style={{ fontSize: 10 }}>●</span>
    //                                             {col.title}
    //                                         </span>
    //                                         <span className="badge bg-light text-dark border ms-auto">{kanbanData[col.id]?.length || 0}</span>
    //                                     </div>
    //                                     {/* Cards */}
    //                                     {kanbanData[col.id]?.map((item, idx) => (
    //                                         <Draggable draggableId={String(item.id)} index={idx} key={item.id}>
    //                                             {(provided, snapshot) => (
    //                                                 <div
    //                                                     ref={provided.innerRef}
    //                                                     {...provided.draggableProps}
    //                                                     {...provided.dragHandleProps}
    //                                                     className="bg-white border rounded mb-2 p-2 shadow-sm"
    //                                                     style={{
    //                                                         minHeight: 110,
    //                                                         wordBreak: 'break-word',
    //                                                         maxWidth: '100%',
    //                                                         background: snapshot.isDragging ? '#fffde7' : undefined,
    //                                                         ...provided.draggableProps.style
    //                                                     }}
    //                                                     // onClick={() => {
    //                                                     //     localStorage.setItem("proposalId", item.id);
    //                                                     //     if (col.id === 'active') {
    //                                                     //         navigate("/admin/AddInvoice2");
    //                                                     //     } else {
    //                                                     //         navigate("/admin/LeadFlow/Details");
    //                                                     //     }
    //                                                     // }}
    //                                                     onClick={() => {
    //                                                         localStorage.setItem("proposalId", item._id);
    //                                                         localStorage.setItem("invoice", JSON.stringify(item));
    //                                                         navigate("/admin/Project/Details", { state: { item: item } });
    //                                                     }}
    //                                                 >
    //                                                     <div className="fw-semibold text-primary" style={{ fontSize: 15 }}>
    //                                                         {item.job_name || item.title}
    //                                                     </div>
    //                                                     <div className="text-muted small mb-1">Client: {item.client || item.client_name}</div>
    //                                                     <div className="text-muted small mb-1">Address: {item.address || "N/A"}</div>
    //                                                     {/* <div className="small text-secondary mb-1">Billing: {item.billing || item.job_type}</div> */}
    //                                                     <div className="small text-secondary mb-1">Phases: {item.phases}</div>
    //                                                     <div className="d-flex flex-wrap gap-2 align-items-center mb-1">
    //                                                         <Badge bg="info" className="me-1">{item.status}</Badge>
    //                                                     </div>
    //                                                     {/* <div className="small text-success mb-1">Revenue: <b>{item.revenue}</b></div>
    //                                                     <div className="small text-warning mb-1">Committed Cost: <b>{item.committedCost}</b></div>
    //                                                     <div className="small text-primary mb-1">Profit/Loss: <b>{item.projectPriority}</b></div>
    //                                                     <div className="small text-dark mb-1">
    //                                                         startDate: <b>{new Date(item.startDate).toLocaleDateString('en-GB')}</b>
    //                                                     </div>
    //                                                     <div className="small text-dark mb-1">
    //                                                         endDate: <b>{new Date(item.endDate).toLocaleDateString('en-GB')}</b>
    //                                                     </div> */}

    //                                                     {/* <div className="small text-muted mb-1">Last updated: {item.updated || item.last_updated}</div> */}
    //                                                     {/* <div className="mt-2">
    //                                                         <button
    //                                                             className="btn btn-sm btn-outline-primary"
    //                                                             onClick={() => {
    //                                                                 localStorage.setItem("proposalId", item.id);
    //                                                                 if (col.id === 'active') {
    //                                                                     navigate("/admin/AddInvoice2");
    //                                                                 } else {
    //                                                                     navigate("/admin/LeadFlow/Details");
    //                                                                 }
    //                                                             }}
    //                                                         >
    //                                                             {col.id === 'active' ? 'Invoice' : col.id === 'pending' ? 'Edit proposal' : col.id === 'closed' ? 'View' : 'Expired'}
    //                                                         </button>

    //                                                     </div> */}
    //                                                 </div>
    //                                             )}
    //                                         </Draggable>
    //                                     ))}
    //                                     {provided.placeholder}
    //                                 </div>
    //                             )}
    //                         </Droppable>
    //                     ))}
    //                 </div>
    //             </DragDropContext>
    //         </div>
    //     );
    // };


    const ProposalWorkflowBoard = ({ onNavigate, selectedStatus }) => {
        const reduxProposals = (project.data || []).map(item => ({
            id: item.id,
            title: item.projectName,
            client: item.clientId?.clientName,
            status: mapStatus(item.status),
            projectPriority: item.projectPriority,
            phases: item.phases || "N/A",
            revenue: item.budgetAmount ? `AED ${item.budgetAmount}` : "N/A",
            startDate: item.startDate,
            endDate: item.endDate,
            committedCost: "4220",
            profitLoss: "N/A",
            updated: item.updatedAt,
        }));

        function mapStatus(status) {
            const map = {
                "Active Project": "pendingProposalApproval",
                "Pending": "serviceCalls",
                "Closed": "pendingRough",
                "UG Pipes": "ugPipes",
                "Meter Spot Requested": "meterSpotRequested",
                "Ready for Rough": "readyForRough",
                "Rough Started": "roughStarted",
                "Rough Finish": "roughFinish",
                "Pending Finish": "pendingFinish",
                "Finish Started": "finishStarted",
                "Finish Final Work": "finishFinalWork",
                "Done Final Payment": "doneFinalPayment",
                "Photos of Job": "photosOfJob"
            };
            return map[status] || "serviceCalls"; // fallback
        }

        const dispatch = useDispatch();
        const [isUpdating, setIsUpdating] = useState(false);

        const kanbanData = {
            pendingProposalApproval: reduxProposals.filter(p => p.status === "pendingProposalApproval"),
            serviceCalls: reduxProposals.filter(p => p.status === "serviceCalls"),
            pendingRough: reduxProposals.filter(p => p.status === "pendingRough"),
            ugPipes: reduxProposals.filter(p => p.status === "ugPipes"),
            meterSpotRequested: reduxProposals.filter(p => p.status === "meterSpotRequested"),
            readyForRough: reduxProposals.filter(p => p.status === "readyForRough"),
            roughStarted: reduxProposals.filter(p => p.status === "roughStarted"),
            roughFinish: reduxProposals.filter(p => p.status === "roughFinish"),
            pendingFinish: reduxProposals.filter(p => p.status === "pendingFinish"),
            finishStarted: reduxProposals.filter(p => p.status === "finishStarted"),
            finishFinalWork: reduxProposals.filter(p => p.status === "finishFinalWork"),
            doneFinalPayment: reduxProposals.filter(p => p.status === "doneFinalPayment"),
            photosOfJob: reduxProposals.filter(p => p.status === "photosOfJob"),
        };

        const handleCardDrop = async (result) => {
            const { source, destination, draggableId } = result;
            if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

            const reverseMap = {
                pendingProposalApproval: "Active Project",
                serviceCalls: "Pending",
                pendingRough: "Closed",
                ugPipes: "UG Pipes",
                meterSpotRequested: "Meter Spot Requested",
                readyForRough: "Ready for Rough",
                roughStarted: "Rough Started",
                roughFinish: "Rough Finish",
                pendingFinish: "Pending Finish",
                finishStarted: "Finish Started",
                finishFinalWork: "Finish Final Work",
                doneFinalPayment: "Done Final Payment",
                photosOfJob: "Photos of Job"
            };

            const newStatus = reverseMap[destination.droppableId];

            dispatch(updateProjectStatusLocally({ id: draggableId, status: newStatus }));
            setIsUpdating(true);
            try {
                await dispatch(updateProject({ id: draggableId, payload: { status: newStatus } }));
                await dispatch(fetchProject());
            } catch (error) {
                console.error("Failed to update status", error);
            }
            setIsUpdating(false);
        };

        let columns = [
            { id: 'pendingProposalApproval', title: 'Pending Proposal Approval' },
            { id: 'serviceCalls', title: 'Service Calls' },
            { id: 'pendingRough', title: 'Pending Rough' },
            { id: 'ugPipes', title: 'UG Pipes' },
            { id: 'meterSpotRequested', title: 'Meter Spot Requested' },
            { id: 'readyForRough', title: 'Ready for Rough' },
            { id: 'roughStarted', title: 'Rough Started' },
            { id: 'roughFinish', title: 'Rough Finish' },
            { id: 'pendingFinish', title: 'Pending Finish' },
            { id: 'finishStarted', title: 'Finish Started' },
            { id: 'finishFinalWork', title: 'Finish Final Work' },
            { id: 'doneFinalPayment', title: 'Done Final Payment' },
            { id: 'photosOfJob', title: 'Photos of Job' },
        ];

        // if (selectedStatus && selectedStatus !== 'All') {
        //     const statusMap = {
        //         'Pending Proposal Approval': 'pendingProposalApproval',
        //         'Service Calls': 'serviceCalls',
        //         'Pending Rough': 'pendingRough',
        //         'UG Pipes': 'ugPipes',
        //         'Meter Spot Requested': 'meterSpotRequested',
        //         'Ready for Rough': 'readyForRough',
        //         'Rough Started': 'roughStarted',
        //         'Rough Finish': 'roughFinish',
        //         'Pending Finish': 'pendingFinish',
        //         'Finish Started': 'finishStarted',
        //         'Finish Final Work': 'finishFinalWork',
        //         'Done Final Payment': 'doneFinalPayment',
        //         'Photos of Job': 'photosOfJob'
        //     };
        //     const selectedId = statusMap[selectedStatus];
        //     if (selectedId) {
        //         columns = [columns.find(c => c.id === selectedId), ...columns.filter(c => c.id !== selectedId)];
        //     }
        // }
        if (selectedStatus && selectedStatus !== 'All') {
            const statusMap = {
                'Pending Proposal Approval': 'pendingProposalApproval',
                'Service Calls': 'serviceCalls',
                'Pending Rough': 'pendingRough',
                'UG Pipes': 'ugPipes',
                'Meter Spot Requested': 'meterSpotRequested',
                'Ready for Rough': 'readyForRough',
                'Rough Started': 'roughStarted',
                'Rough Finish': 'roughFinish',
                'Pending Finish': 'pendingFinish',
                'Finish Started': 'finishStarted',
                'Finish Final Work': 'finishFinalWork',
                'Done Final Payment': 'doneFinalPayment',
                'Photos of Job': 'photosOfJob',
            };
            const selectedId = statusMap[selectedStatus];
            if (selectedId) {
                columns = [columns.find(c => c.id === selectedId), ...columns.filter(c => c.id !== selectedId)];
            }
        }


        const getTextColor = (status) => {
            const bg = getStatusBadgeColor(status);
            const darkBackgrounds = ["primary", "secondary", "dark", "info", "success"];
            return darkBackgrounds.includes(bg) ? "text-white" : "text-dark";
        };


        const getStatusBadgeColor = (status) => {
            switch (status) {
                case "pendingProposalApproval":
                    return "secondary";
                case "serviceCalls":
                    return "info";
                case "pendingRough":
                    return "primary";
                case "ugPipes":
                    return "dark";
                case "meterSpotRequested":
                    return "warning";
                case "readyForRough":
                    return "success";
                case "roughStarted":
                    return "primary";
                case "roughFinish":
                    return "success";
                case "pendingFinish":
                    return "warning";
                case "finishStarted":
                    return "primary";
                case "finishFinalWork":
                    return "success";
                case "doneFinalPayment":
                    return "dark";
                case "photosOfJob":
                    return "info";
                default:
                    return "secondary";
            }
        };


        return (
            <div style={{ position: 'relative' }}>
                {isUpdating && (
                    <div className="kanban-loading-overlay">
                        Updating...
                    </div>
                )}
                <DragDropContext key={reduxProposals.map(p => p.id).join('-')} onDragEnd={handleCardDrop}>
                    <div
                        className="kanban-board d-flex flex-nowrap gap-3 py-3"
                        style={{ overflowX: "auto", minHeight: 350, marginLeft: "20px", WebkitOverflowScrolling: 'touch' }}
                    >
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
                                            <Draggable draggableId={String(item.id)} index={idx} key={item.id}>
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
                                                            navigate("/admin/Project/Details", { state: { item: item } });
                                                        }}
                                                    >
                                                        <div className="fw-semibold text-primary" style={{ fontSize: 15 }}>
                                                            {item.job_name || item.title}
                                                        </div>
                                                        <div className="text-muted small mb-1">Client: {item.client || item.client_name}</div>
                                                        <div className="text-muted small mb-1">Address: {item.address || "N/A"}</div>
                                                        <div className="small text-secondary mb-1">Phases: {item.phases}</div>
                                                        {/* <div className="d-flex flex-wrap gap-2 align-items-center mb-1"> */}
                                                        <div className="d-flex flex-wrap gap-2 align-items-center mb-1">
                                                            <Badge bg={getStatusBadgeColor(item.status)} className={`me-1 ${getTextColor(item.status)}`}>
                                                                {item.status}
                                                            </Badge>
                                                        </div>
                                                        {/* </div> */}
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
            </div>
        );
    };


    const [selectedStatus, setSelectedStatus] = useState('All');
    const [expandedJobIndex, setExpandedJobIndex] = useState(null);

    // Filter jobs based on selectedStatus
    const filteredJobs = selectedStatus === 'All'
        ? jobs
        : jobs.filter(job => job.status === selectedStatus);

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
                                    {filteredJobs.length === 0 && (
                                        <div className="text-center text-muted py-5">
                                            <div className="mb-2">
                                                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9 9h.01M15 9h.01M8 15c1.333-1 2.667-1 4 0" /></svg>
                                            </div>
                                            <div className="fw-semibold">No projects found for this filter.</div>
                                            <div className="small">Try a different status or add a new project.</div>
                                        </div>
                                    )}
                                    {filteredJobs.map((project, index) => (
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
                            <h5 className="fw-bold mb-0" style={{ fontSize: '2rem' }}>Active Projects</h5>
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
                                {/* <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2 mb-3">
                                    <ButtonGroup>
                                        <Button
                                            style={{
                                                backgroundColor: activeTab === 'manage' ? '#DDC62F' : 'transparent',
                                                borderColor: '#DDC62F',
                                                color: activeTab === 'manage' ? 'black' : '#DDC62F',
                                            }}
                                            active={activeTab === 'manage'}
                                            onClick={() => setActiveTab('manage')}
                                            className="d-flex align-items-center"
                                        >
                                            <MdManageAccounts className="me-2" size={18} /> Manage Project
                                        </Button>
                                        <Button
                                            style={{
                                                backgroundColor: activeTab === 'reports' ? '#DDC62F' : 'transparent',
                                                borderColor: '#DDC62F',
                                                color: activeTab === 'reports' ? 'black' : '#DDC62F',
                                            }}
                                            active={activeTab === 'reports'}
                                            onClick={() => setActiveTab('reports')}
                                            className="d-flex align-items-center"
                                        >
                                            <HiOutlineDocumentReport className="me-2" size={18} /> Job Reports
                                        </Button>

                                    </ButtonGroup>
                                </div> */}

                            </div>
                        </div>

                        {/* Project Status Tabs */}
                        <div className="project-tabs mb-4">
                            <ul className="nav nav-tabs d-none d-md-flex justify-content-between">
                                <div className="nav nav-tabs d-none d-md-flex">
                                    {/* {tabs.map((tab) => (
                                        <li className="nav-item" key={tab.value}>
                                            <button
                                                className={`nav-link ${selectedStatus === tab.value ? 'active' : ''}`}
                                                onClick={() => setSelectedStatus(tab.value)}
                                                style={{ color: "#695e13", borderColor: "#DDC62F" }}
                                            >
                                                {tab.label}
                                            </button>
                                        </li>
                                    ))} */}
                                    <ul className="nav nav-tabs">
                                        {tabs.map((tab) => (
                                            <li className="nav-item" key={tab.value}>
                                                <button
                                                    className={`nav-link ${selectedStatus === tab.value ? 'active' : ''}`}
                                                    onClick={() => setSelectedStatus(tab.value)}
                                                    style={{ color: "#695e13", borderColor: "#DDC62F" }}
                                                >
                                                    {tab.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* <div className="d-flex justify-content-end " >
                                    <ButtonGroup>
                                        <Button
                                            variant={workflowView === 'workflow' ? 'primary' : 'outline-primary'}
                                            active={workflowView === 'workflow'}
                                            onClick={() => setWorkflowView('workflow')}
                                            className="d-flex align-items-center"
                                        >
                                            <Kanban className="me-2" /> Project Contract workflow
                                        </Button>
                                        <Button
                                            variant={workflowView === 'list' ? 'primary' : 'outline-primary'}
                                            active={workflowView === 'list'}
                                            onClick={() => setWorkflowView('list')}
                                            className="d-flex align-items-center"
                                        >
                                            <List className="me-2" />Project View
                                        </Button>
                                    </ButtonGroup>
                                </div> */}
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

const FILTER_OPTIONS = [
    { label: "Budget overrun", value: "budgetOverrun" },
    { label: "Client", value: "client" },
    { label: "Not Invoiced In the last", value: "notInvoiced" },
    { label: "Project manager", value: "projectManager" },
    { label: "Sales lead", value: "salesLead" },
    { label: "Tag", value: "tag" },
    { label: "Type of contract", value: "contractType" },
    { label: "Work ", value: "workInProgress" },
    { label: "Workflow: KJBJHB", value: "workflow" }
];

const VALUE_OPTIONS = [
    { label: "7 Days", value: "7" },
    { label: "15 Days", value: "15" },
    { label: "30 Days", value: "30" },
    { label: "60 Days", value: "60" }
];

const stageOptions = [
    { id: 'active', label: 'Active', count: 0 },
    { id: 'pending-changes', label: 'Pending changes', count: 0 },
    { id: 'closed', label: 'Closed', count: 0 },
    { id: 'rejected', label: 'Rejected', count: 0 }
];

export default ProjectView;