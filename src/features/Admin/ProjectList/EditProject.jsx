
import React, { useEffect, useState } from "react";
import "./EditProject.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";
// import DailyLogs from "../LeadOpportunity/DailyLogs";
import Swal from "sweetalert2";
import AddCostEstimates from "../CostEstimates/AddCostEstimates";
import AddTimeLog from "../TimeLogs/AddTimeLog";
// import DocumentList from "./DocumentList";

const DocumentList = () => {
    const documents = [
        { id: 1, title: "Document 1", file_urls: ["example_file_1.pdf"] },
        { id: 2, title: "Document 2", file_urls: ["example_file_2.pdf"] },
    ];
    const handlePreview = (url) => {
        // Static preview handling
    };
    const handleDownload = (url) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = url.split("/").pop();
        a.click();
    };
    const handleDelete = (id) => {
        const confirm = window.confirm("Are you sure you want to delete this document?");
        if (!confirm) return;
        // Static delete handling
        console.log(`Document with id ${id} deleted.`);
    };
    return (
        <>
            <div className="container mt-4">
                <h4 className="fw-bold mb-3">Uploaded Documents</h4>
                <ul className="list-group">
                    {documents.map((doc) => (
                        <li key={doc.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span
                                className="text-primary cursor-pointer"
                                style={{ cursor: "pointer" }}
                                onClick={() => handlePreview(doc.file_urls[0])}
                            >
                                {doc.title}
                            </span>
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-success me-2"
                                    onClick={() => handleDownload(doc.file_urls[0])}
                                >
                                    Download
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(doc.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

const EditProject = () => {
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
    const [activeTab, setActiveTab] = useState("Summary");

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

    const handleAddLineItem = () => {
        setLineItems([
            ...lineItems,
            { description: '', amount: 0, quantity: 1, taxable: false },
        ]);
    };

    const handleLineChange = (index, field, value) => {
        const updatedItems = [...lineItems];
        updatedItems[index][field] = value;
        setLineItems(updatedItems);
    };

    const removeLineItem = (index) => {
        const updated = [...lineItems];
        updated.splice(index, 1);
        setLineItems(updated);
    };


    const navigate = useNavigate();
    const location = useLocation();
    const job = location.state.item;
    console.log("job", job);

    const stage = job?.p?.stage;

    const renderTabContent = () => {
        switch (activeTab) {
            case "Summary":
                return (
                    <div className="tab-content-box row">
                        <div className="col-md-8">
                            <h5 className="mb-3 fw-bold">Details</h5>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <p className="mb-1 text-muted">Project Stage</p>
                                    <p>{job.stage}</p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-1 text-muted">Project type.</p>
                                    <p>{job?.job_type}</p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-1 text-muted">Sales Lead</p>
                                    <p>{job?.sales_first_name}{job?.sales_last_name}</p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-1 text-muted">Project Status</p>
                                    <p>{job?.status}</p>
                                </div>
                                <div className="col-6 mt-4">
                                    <p className="mb-1 text-muted">Manager</p>
                                    <p>{job?.manager_first_name} {job?.manager_last_name}</p>
                                </div>
                                <div className="col-6 mt-4">
                                    <p className="mb-1 text-muted">Tags</p>
                                    <div className="d-flex flex-wrap gap-2">
                                        {job?.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-light border text-dark px-3 py-1 rounded-pill text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
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
                                <a href="#!" className="small text-primary">Set costs/revenue</a>
                            </div>

                            <div className="bg-light p-3 rounded">
                                <h6 className="fw-bold">Customer Portal</h6>
                                <button className="btn btn-outline-secondary btn-sm mt-2">
                                    🔗 Click here to create a portal for this job
                                </button>
                            </div>
                        </div>
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
                                    <p>{job?.status}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <p className="mb-1 text-muted">Job Type</p>
                                    <p>{job?.job_type}</p>
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
                                <div className="col-md-6 mb-3">
                                    <p className="mb-1 text-muted">Total Budget</p>
                                    <p>${totalBudgetedCost}</p>
                                </div>
                            </div>
                            <button className="btn btn-primary">Save</button>
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
                    </div>
                );

            case "Create Proposal":
                return (
                    <div className="container mt-4 mb-5">
                        {/* <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="h5">Fixed price</span>
              </div>
              <div>
                <Button variant="success" className="me-2">
                  Save changes
                </Button>
                <Button variant="outline-secondary">Send out for signature</Button>
              </div>
            </div>
            <Row className="text-center mb-4">
              <Col>
                <strong>Value</strong>
                <div>${calculateTotalValue()}</div>
              </Col>
              <Col>
                <strong>Cost</strong>
                <div>$0.00</div>
              </Col>
              <Col>
                <strong>Profit</strong>
                <div>$0.00</div>
              </Col>
            </Row>
            <Form>
              <Row className="mb-3">
                <Col md={6}><Form.Label>Attn:</Form.Label><Form.Control type="text" placeholder="Test Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} /></Col>
                <Col md={6}><Form.Label>Estimated start date:</Form.Label><Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}><Form.Label>PO #:</Form.Label><Form.Control type="text" placeholder="Enter PO number" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} /></Col>
                <Col md={6}><Form.Label>Estimated end date:</Form.Label><Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></Col>
              </Row>
              <Row className="mb-4">
                <Col md={6}><Form.Label>Contract #:</Form.Label><Form.Control type="text" placeholder="Enter number or id" value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} /></Col>
                <Col md={6}>
                  <Form.Label>Payment terms:</Form.Label>
                  <Form.Select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
                    <option value="">Select payment term</option>
                    <option value="Due Upon Receipt">Due Upon Receipt</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Full after completion">Full after completion</option>
                  </Form.Select>
                </Col>
              </Row>
              <hr />
              <h5 className="text-center">LINE ITEMS</h5>
              {lineItems.map((item, idx) => (
                <div key={idx} className="bg-light p-3 mb-3 border rounded">
                  <Row className="align-items-center mb-2">
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        placeholder="Enter description here"
                        value={item.description}
                        onChange={(e) => handleLineChange(idx, 'description', e.target.value)}
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Control
                        type="number"
                        placeholder="$0.00"
                        value={item.amount}
                        onChange={(e) => handleLineChange(idx, 'amount', e.target.value)}
                      />
                    </Col>
                    <Col md={1}>
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleLineChange(idx, 'quantity', e.target.value)}
                      />
                    </Col>
                    <Col md={2}>
                      <Form.Check
                        type="checkbox"
                        label="Taxable"
                        checked={item.taxable}
                        onChange={(e) => handleLineChange(idx, 'taxable', e.target.checked)}
                      />
                    </Col>
                    <Col md={1} className="text-end">
                      <Button variant="outline-danger" onClick={() => removeLineItem(idx)}>
                        &times;
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
              <div className="d-flex justify-content-between align-items-center border p-3 rounded">
                <Button variant="primary" onClick={handleAddLineItem}>
                  + Add new line item
                </Button>
              </div>
            </Form>
            <div className="bg-success bg-opacity-10 p-3 mt-4 rounded">
              <Row className="align-items-center mb-2">
                <Col md={4}>
                  <Form.Label>Applicable tax rate:</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Select value={applicableTaxRate} onChange={(e) => setApplicableTaxRate(e.target.value)}>
                    <option>(Non taxable) 0%</option>
                    <option>GST 5%</option>
                    <option>VAT 10%</option>
                  </Form.Select>
                </Col>
              </Row>
            </div>
            <div className="mt-4">
              <h6 className="text-center">TERMS AND CONDITIONS</h6>
              <Form.Control as="textarea" rows={4} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Enter terms and conditions here..." />
            </div> */}
                        <AddCostEstimates />
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

                        {/* Buttons */}
                        <div className="d-flex justify-content-center gap-2 mt-3">
                            <button className="btn btn-primary">
                                Upload file
                            </button>
                        </div>

                        {/* Uploaded File Display */}
                        <div className="mt-3">
                            <p className="text-primary">Uploaded: example_file.txt</p>
                        </div>

                        <DocumentList />
                    </div>
                );

            case "Logs":
                return (
                    <div className="tab-content-box">
                        {/* <DailyLogs /> */}
                        <AddTimeLog />
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
            <div className="mb-2">
                <Button variant="outline-secondary mt-1" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="me-1" /> Back
                </Button>
            </div>

            <div className="wwd-header d-flex justify-content-between align-items-center py-3">
                <div>
                    <h4 className="mb-0">{job?.job_name}</h4>
                    <p className="text-muted small">{job?.client_name}</p>
                </div>
            </div>

            <ul className="nav nav-tabs wwd-tabs mb-4">
                {[
                    "Summary",
                    "Job Costs",
                    // stage === "lead" ? "Client Proposal" : "Draft Proposal",
                    "Contract & Change Orders",
                    "Create Proposal",
                    "Documents",
                    "Logs",
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

export default EditProject;
