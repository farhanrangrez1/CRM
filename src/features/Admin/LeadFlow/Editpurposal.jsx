
import React, { useEffect, useState } from "react";
import "./Editpurposal.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";
// import `DailyLogs` from "../LeadOpportunity/DailyLogs";
import Swal from "sweetalert2";
import AddCostEstimates from "../CostEstimates/AddCostEstimates";
import AddTimesheetWorklog from "../TimesheetWorklog/AddTimesheetWorklog";
import AddInvoice from "../Invoicing_Billing/AddInvoice";
import ProposalEmailUI from "./ProposalEmailUI";
// import DocumentList from "./DocumentList";
import DailyLogs from "../../Employee/DailyLogs/DailyLogs";
import axios from 'axios';
import { fetchProject } from "../../../redux/slices/ProjectsSlice";
import { createDocument, fetchDocumentById } from "../../../redux/slices/saveDocumentSlice";
import { useDispatch, useSelector } from "react-redux";
import DocumentList from "./DocumentList";
import JobCost from "./JobCost";
 
const Editpurposal = () => {
  const [manager, setManager] = useState(null);
  const [lead, setLead] = useState(null);
  const [phaseName, setPhaseName] = useState("");
  const [materialsBudget, setMaterialsBudget] = useState("");
  const [laborBudget, setLaborBudget] = useState("");
  const [subcontractorsBudget, setSubcontractorsBudget] = useState("");
  const [equipmentBudget, setEquipmentBudget] = useState("");
  const [miscBudget, setMiscBudget] = useState("");
  const [estimatedStart, setEstimatedStart] = useState("");
  const [estimatedEnd, setEstimatedEnd] = useState("");
  const [clientName, setClientName] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [applicableTaxRate, setApplicableTaxRate] = useState("");
  const [comments, setComments] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFileModal, setShowFileModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [lineItems, setLineItems] = useState([
    {
      id: 1,
      description: '',
      quantity: '',
      details: '',
      breakdown: '',
      amount: '',
      taxable: true
    }
  ]);
  const [activeTab, setActiveTab] = useState("Create Proposal");
  const totalBudgetedCost = (
    parseFloat(materialsBudget || 0) +
    parseFloat(laborBudget || 0) +
    parseFloat(subcontractorsBudget || 0) +
    parseFloat(equipmentBudget || 0) +
    parseFloat(miscBudget || 0)
  ).toFixed(2);

  const calculateTotalValue = () => {
    return lineItems.reduce(
      (total, item) => total + (parseFloat(item.amount) || 0) * (parseInt(item.quantity) || 0),
      0
    ).toFixed(2);
  };
  const dispatch = useDispatch()
  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: '', amount: 0, quantity: 1, taxable: false },
    ]);
  };
  useEffect(() => {
    dispatch(fetchProject())
  }, [])
  const handleLineChange = (index, field, value) => {
    const updatedItems = [...lineItems];
    updatedItems[index][field] = value;
    setLineItems(updatedItems);
  };
  // const projectId = 
  const removeLineItem = (index) => {
    const updated = [...lineItems];
    updated.splice(index, 1);
    setLineItems(updated);
  };


  const navigate = useNavigate();
  const location = useLocation();
  const job = location.state.item;
  // const project_id = localStorage.getItem("proposalId");
  const project_id = job?.id;
  const proposalId =  job?.id;
  
  const resetForm = () => {
    setPhaseName("");
    setMaterialsBudget("");
    setLaborBudget("");
    setSubcontractorsBudget("");
    setEquipmentBudget("");
    setMiscBudget("");
    setEstimatedStart("");
    setEstimatedEnd("");
  };
  const saveJob = async () => {
    const payload = {
      proposal_id: project_id,
      estimated_start: estimatedStart,
      estimated_completion: estimatedEnd,
      total_budget: totalBudgetedCost,
      phase_name: phaseName,
      materials_budget: materialsBudget,
      labor_budget: laborBudget,
      subcontractors_budget: subcontractorsBudget,
      equipment_budget: equipmentBudget,
      miscellanea_budget: miscBudget,
    };

    try {
      const response = await axios.post(
        'https://netaai-crm-backend-production-c306.up.railway.app/api/job_planning',
        payload
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire("Success", "Job planning created successfully!", "success");
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || error.message, "error");
    }

    resetForm();
  };


  const getBudgetSummaryByProposalId = async (proposalId) => {
    try {
      const response = await axios.get(
        `https://netaai-crm-backend-production-c306.up.railway.app/api/job_planning/getBudgetSummaryByProposalId/${project_id}`
      );

      if (response.status === 200) {
        // You can return the data or use it directly

        return response.data;
      } else {
        throw new Error("Failed to fetch budget summary");
      }
    } catch (error) {
      console.error("Error fetching budget summary:", error.response?.data?.message || error.message);
      return null;
    }
  };
  const handleFolderSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("proposal_id", proposalId);
      formData.append("folder_name", folderName);

      const res = dispatch(createDocument(formData))


      setShowFolderModal(false);
      setFolderName("");
    } catch (error) {
      console.error("❌ Folder Creation Error:", error);
    }
  };
  const handleFileSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("proposal_id", proposalId);
      formData.append("title", fileTitle);
      formData.append("fileUrls", selectedFile);

      const res = await dispatch(createDocument(formData))
      // console.log("✅ File Uploaded:", res.data);
      dispatch(fetchDocumentById(proposalId))

      setUploadedFile(selectedFile?.name);
      setShowFileModal(false);
      setFileTitle("");
      setSelectedFile(null);
    } catch (error) {
      // console.error("❌ File Upload Error:", error);
    }
  };
  const documents = useSelector((state) => state?.documents?.document?.data)
  // console.log("wedw", documents)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file?.name);
    setSelectedFile(file);
  };
  const handleUploadClick = () => {
    setShowFileModal(true);
  };
  useEffect(() => {
    const fetchBudgetSummary = async () => {
      const data = await getBudgetSummaryByProposalId(project_id);
      if (data) {
        // Handle your state update here
        // console.log(data);
      }
    };

    fetchBudgetSummary();
  }, [saveJob]);


  // const stage = job?.p?.stage;

  const [showAddInvoice, setShowAddInvoice] = useState(true);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Summary":
        return (
          <div className="tab-content-box row">
            <div className="col-md-8">
              <h5 className="mb-3 fw-bold">Details</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1 text-muted">Job Status</p>
                  {/* <p>Lead</p> */}
                  <p>{job?.status}</p>
                </div>
                {/* <div className="col-md-6">
                  <p className="mb-1 text-muted">Job Type</p>
                  <p>{job?.job_type}</p>
                </div> */}
                {/* <div className="col-md-6">
                  <p className="mb-1 text-muted">Sales Lead</p>
                  <p>{lead?.first_name} {lead?.last_name}</p>
                </div> */}
                {/* <div className="col-md-6">
                  <p className="mb-1 text-muted">Project Manager</p>
                  <p>{manager?.first_name} {manager?.last_name}</p>
                </div> */}
                {/* <div className="col-12 mt-4">
                  <p className="mb-1 text-muted">Location</p>
                  <p>{job?.job_address}</p>
                </div> */}
              </div>
            </div>

            {/* <div className="col-md-4">
              <div className="bg-light p-3 rounded mb-3">
                <h6 className="fw-bold">Tasks</h6>
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <p className="mb-0 text-muted">Total</p>
                    <p className="mb-0">0</p>
                  </div>
                  <div>
                    <p className="mb-0 text-muted">Pending</p>
                    <p className="mb-0">0</p>
                  </div>
                </div>

                <h6 className="fw-bold">Analytics</h6>
                <p className="text-muted small">Not enough data</p>
                <a href="#!" className="small text-primary">Set costs/revenue previous to Knowify</a>
              </div>

              <div className="bg-light p-3 rounded">
                <h6 className="fw-bold">Customer Portal</h6>
                <button className="btn btn-outline-secondary btn-sm mt-2">
                  🔗 Click here to create a portal for this job
                </button>
              </div>
            </div> */}
          </div>
        );

      case "Job Costs":
        return (
          <div className="tab-content-box row">
            <div className="col-md-8">
              <h5 className="mb-3 fw-bold"></h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <p className="mb-1 text-muted">Job Status</p>
                  {/* <p>Lead</p> */}
                  <p>{job?.status}</p>
                </div>
                {/* <div className="col-md-6 mb-3">
                  <p className="mb-1 text-muted">Job Type</p>
                  <p>{job?.job_type}</p>
                </div> */}
                <div className="col-md-6 mb-3">
                  <p className="mb-1 text-muted">Total Budget</p>
                  {/* <p>${totalBudgetedCost}</p> */}
                  <p>${totalBudgetedCost}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <p className="mb-1 text-muted">Estimated Start</p>
                  <input
                    type="date"
                    className="form-control"
                    value={estimatedStart}
                    onChange={(e) => setEstimatedStart(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <p className="mb-1 text-muted">Estimated Completion</p>
                  <input type="date" className="form-control" value={estimatedEnd} onChange={(e) => { setEstimatedEnd(e.target.value) }} />
                </div>

              </div>
              <button className="btn btn-primary" onClick={saveJob}>Save</button>
            </div>
            <div className="col-md-4">
              <div className="border p-3 rounded mb-4 bg-white">
                <Form.Group className="mb-2">
                  <Form.Label>Phase Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={phaseName}
                    onChange={(e) => setPhaseName(e.target.value)}
                  />
                </Form.Group>
                <div className="text-end fw-bold mb-3">
                  Budgeted Cost: ${totalBudgetedCost}
                </div>
                <Row className="mb-2">
                  <Col>
                    <Form.Label>Materials Budget</Form.Label>
                    <Form.Control
                      value={`$${materialsBudget}`}
                      onChange={(e) => setMaterialsBudget(e.target.value.replace("$", ""))}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Labor Budget</Form.Label>
                    <Form.Control
                      placeholder="$"
                      value={laborBudget}
                      onChange={(e) => setLaborBudget(e.target.value.replace("$", ""))}
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <Form.Label>Subcontractors Budget</Form.Label>
                    <Form.Control
                      value={`$${subcontractorsBudget}`}
                      onChange={(e) =>
                        setSubcontractorsBudget(e.target.value.replace("$", ""))
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Label>Equipment Budget</Form.Label>
                    <Form.Control
                      value={`$${equipmentBudget}`}
                      onChange={(e) =>
                        setEquipmentBudget(e.target.value.replace("$", ""))
                      }
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Label>Miscellanea Budget</Form.Label>
                    <Form.Control
                      value={`$${miscBudget}`}
                      onChange={(e) => setMiscBudget(e.target.value.replace("$", ""))}
                    />
                  </Col>
                </Row>
              </div>
            </div>
            <JobCost jobStatus={job?.status} />
          </div>
        );

      case "Create Proposal":
        return (
          <div className="container mt-4 mb-5">
            {/* Main Page: AddInvoice */}
            {showAddInvoice && (
              <AddInvoice onInvoiceComplete={() => setShowAddInvoice(false)} />
            )}

            {/* Fullscreen Overlay Modal for ProposalEmailUI */}
            {!showAddInvoice && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100 bg-white shadow-lg"
                style={{ zIndex: 1050, overflowY: "auto" }}
              >
                <div className="d-flex justify-content-between px-3 py-2">
                  <div>
                    <h4 className="fw-bold">Send proposal out for signature</h4>
                  </div>
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => setShowAddInvoice(true)}
                  >
                    Close
                  </button>
                </div>
                <div className="">
                  <ProposalEmailUI setShowAddInvoice={setShowAddInvoice} />
                </div>
              </div>
            )}
          </div>

        );

      case "Documents":
        return (
          <div className="tab-content-box text-center">
            {/* Placeholder Image */}
            <div className="mb-3">
              <img
                src="https://img.icons8.com/ios/100/000000/document--v1.png"
                alt="Documents"
                width="100"
              />
            </div>

            {/* Headings */}
            <h5 className="fw-bold">Documents</h5>
            {/* <p className="text-muted mb-1">
        Build a central repository for all your project documents.
      </p> */}

            {/* Buttons */}
            <div className="d-flex justify-content-center gap-2 mt-3">
              {/* <button className="btn btn-outline-secondary" onClick={handleAddFolderClick}>
          Add folder
        </button> */}
              <button className="btn btn-primary" onClick={handleUploadClick}>
                Upload file
              </button>
            </div>

            {/* Uploaded File Display */}
            {uploadedFile && (
              <div className="mt-3">
                <p className="text-primary">Uploaded: {uploadedFile}</p>
              </div>
            )}

            {/* Folder Modal */}
            {showFolderModal && (
              <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Create Folder</h5>
                      <button type="button" className="btn-close" onClick={() => setShowFolderModal(false)}></button>
                    </div>
                    <div className="modal-body">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter folder name"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                      />
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setShowFolderModal(false)}>Cancel</button>
                      <button className="btn btn-primary" onClick={handleFolderSubmit}>Create</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload Modal */}
            {showFileModal && (
              <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Upload File</h5>
                      <button type="button" className="btn-close" onClick={() => setShowFileModal(false)}></button>
                    </div>
                    <div className="modal-body">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Enter title"
                        value={fileTitle}
                        onChange={(e) => setFileTitle(e.target.value)}
                      />
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setShowFileModal(false)}>Cancel</button>
                      <button className="btn btn-primary" onClick={handleFileSubmit}>Upload</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="container mt-4">


              {/* Preview Modal */}
              {previewUrl && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                  <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Preview File</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setPreviewUrl(null)}
                        ></button>
                      </div>
                      <div className="modal-body text-center">
                        {previewUrl.endsWith(".pdf") ? (
                          <iframe
                            src={previewUrl}
                            title="PDF Preview"
                            width="100%"
                            height="500px"
                          />
                        ) : (
                          <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%" }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DocumentList
              documents={documents}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
            />
          </div>

        );
      case "Daily Logs":
        return (
          <div className="tab-content-box">
            <DailyLogs />
            {/* <AddTimesheetWorklog /> */}
          </div>
        );

      case "Contract & Change Orders":
        return (
          <div className="tab-content-box container">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold">Fixed price | AIA-style billing</h5>
              <button className="btn btn-primary">Invoice now</button>
            </div>

            {/* Value summary */}
            <div className="d-flex flex-wrap gap-4 mb-3">
              <div><strong>Value:</strong> $264,000.00</div>
              <div><strong>Invoiced:</strong> $45,000.00</div>
              <div><strong>Retained:</strong> $5,000.00</div>
            </div>

            {/* Contract details */}
            <div className="row mb-4">
              <div className="col-md-6">
                <p><strong>GC Contract#:</strong> 4235</p>
                <p><strong>GC contract date:</strong> 11/1/22</p>
              </div>
              <div className="col-md-6">
                <p><strong>Retainage for work:</strong> 10%</p>
                <p><strong>Retainage for materials:</strong> 10%</p>
                <p><strong>Payment terms:</strong> NET7</p>
              </div>
            </div>

            <button className="btn btn-link p-0 mb-3">✏️ Edit this information</button>

            {/* Schedule of Values */}
            <div className="border-top pt-3 mb-4">
              <h6 className="fw-bold">SCHEDULE OF VALUES</h6>

              {/* Item 1 */}
              <div className="border rounded p-3 mb-3 bg-light">
                <h6 className="mb-1">1. Demolition / Clear Out</h6>
                <p className="mb-1"><strong>Value:</strong> $108,000.00</p>
                <p className="mb-1"><strong>Invoiced:</strong> 46.30%</p>
                <p><strong>Balance:</strong> $58,000.00</p>
              </div>

              {/* Item 2 */}
              <div className="border rounded p-3 mb-3 bg-light">
                <h6 className="mb-1">2. Asphalt</h6>
                <p className="mb-1"><strong>Value:</strong> $156,000.00</p>
                <p className="mb-1"><strong>Invoiced:</strong> 0%</p>
                <p><strong>Balance:</strong> $156,000.00</p>
              </div>

              <button className="btn btn-primary">Add change order</button>
            </div>

            {/* Financial Summary */}
            <div className="bg-primary bg-opacity-10 p-3 rounded mb-4">
              <div className="row mb-2">
                <div className="col-md-6"><strong>A1. Original bid Sum:</strong></div>
                <div className="col-md-6 text-md-end">$264,000.00</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>A2. Original contract sum:</strong></div>
                <div className="col-md-6 text-md-end">$264,000.00</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>B1. Pending change orders:</strong></div>
                <div className="col-md-6 text-md-end">$0.00</div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6"><strong>B2. Net change by approved change orders:</strong></div>
                <div className="col-md-6 text-md-end">$0.00</div>
              </div>
              <div className="row mb-2 fw-bold">
                <div className="col-md-6"><strong>C. Contract sum to date (A+B1+B2):</strong></div>
                <div className="col-md-6 text-md-end">$264,000.00</div>
              </div>
              <div className="row fw-bold">
                <div className="col-md-6"><strong>D. Approved contract sum to date (A+B2):</strong></div>
                <div className="col-md-6 text-md-end">$264,000.00</div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="mb-4">
              <h6 className="fw-bold">ADDITIONAL OPTIONS</h6>
              <select className="form-select w-auto">
                <option>Display line item subtotals</option>
              </select>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-4">
              <h6 className="fw-bold">TERMS AND CONDITIONS</h6>
              <p className="text-muted mb-0">
                The above price is valid for 30 days. Test Data agrees that they will enter into a standard AIA subcontract with General Contractor,
                and that basic provisions such as insurance and W-9 shall be in place prior to start.
              </p>
            </div>
          </div>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="wwd-container container">

      <div className="wwd-header d-flex justify-content-between align-items-center py-3">
        <div>
          {/* <h4 className="mb-0">{job?.job_name}</h4> */}
          <h4 className="mb-0">{job?.projectName || job?.job_name}</h4>
          <p className="text-muted small">{job?.clientId?.clientName}</p>
        </div>
        <div className="mb-2">
          <Button variant="outline-secondary mt-1" onClick={() => {
            navigate('/admin/LeadFlow');
          }}>
            <FaArrowLeft className="me-1" /> Back
          </Button>
        </div>

      </div>

      <ul className="nav nav-tabs wwd-tabs mb-4">
        {[
          "Summary",
          "Job Costs",
          // stage === "lead" ? "Client Proposal" : "Draft Proposal",
          // "Contract & Change Orders",
          "Create Proposal",
          "Documents",
          "Daily Logs",
          // "Activity",
          // "Reports",
        ].map((tab, i) => (
          <li className="nav-item" key={i}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              style={{ background: "none", border: "none" }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {renderTabContent()}
    </div>
  );
};

export default Editpurposal;
