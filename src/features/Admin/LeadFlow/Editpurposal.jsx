// import React, { useEffect, useState } from "react";
// import "./Editpurposal.css";
// import { FaArrowLeft } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Button, Modal, Dropdown } from "react-bootstrap";
// import ClientProposalForm from "./Createpurposal";
// import Draftpurposal from "./Draftpurposal";
// import { Form, Row, Col } from 'react-bootstrap';
// import { fetchProposalById } from "../../slices/proposalSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserById } from "../../slices/usersSlice";
// import { createJobPlanning } from "../../slices/jobPlanningSlice";
// import { createContractJob, fetchContractJobById } from "../../slices/contractJobSlice";
// import DailyLogs from "../LeadOpportunity/DailyLogs";
// import Swal from "sweetalert2";
// import ContractJobs from "./ContractJobs";
// import { createDocument, fetchDocumentById } from "../../slices/documentSlice";
// import DocumentList from "./DocumentList";
// const Editpurposal = () => {
//   const [manager, setManager] = useState(null);
//   const [lead, setLead] = useState(null);

//   const [phaseName, setPhaseName] = useState("");
//   const [materialsBudget, setMaterialsBudget] = useState("");
//   const [laborBudget, setLaborBudget] = useState("");
//   const [subcontractorsBudget, setSubcontractorsBudget] = useState("");
//   const [equipmentBudget, setEquipmentBudget] = useState("");
//   const [miscBudget, setMiscBudget] = useState("");
//   const [estimatedStart, setEstimatedStart] = useState("")
//   const [estimatedEnd, setEstimatedEnd] = useState("")
//   const [clientName, setClientName] = useState("");
//   const [poNumber, setPoNumber] = useState("");
//   const [contractNumber, setContractNumber] = useState("");
//   const [paymentTerms, setPaymentTerms] = useState("");
//   // const [taxable, setTaxable] = useState(true);
//   const [applicableTaxRate, setApplicableTaxRate] = useState("");
//   const [comments, setComments] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [showFolderModal, setShowFolderModal] = useState(false);
//   const [showFileModal, setShowFileModal] = useState(false);
//   const [folderName, setFolderName] = useState("");
//   const [fileTitle, setFileTitle] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);


//   const resetForm = () => {
//     setPhaseName("");
//     setMaterialsBudget("");
//     setLaborBudget("");
//     setSubcontractorsBudget("");
//     setEquipmentBudget("");
//     setMiscBudget("");
//     setEstimatedStart("");
//     setEstimatedEnd("");
//   };



//   const totalBudgetedCost = (
//     parseFloat(materialsBudget || 0) +
//     parseFloat(laborBudget || 0) +
//     parseFloat(subcontractorsBudget || 0) +
//     parseFloat(equipmentBudget || 0) +
//     parseFloat(miscBudget || 0)
//   ).toFixed(2);

//   const [lineItems, setLineItems] = useState([
//     {
//       id: 1,
//       description: '',
//       quantity: '',
//       details: '',
//       breakdown: '',
//       amount: '',
//       taxable: true
//     }
//   ]);
//   const calculateTotalValue = () => {
//     return lineItems.reduce(
//       (total, item) => total + (parseFloat(item.amount) || 0) * (parseInt(item.quantity) || 0),
//       0
//     ).toFixed(2); // Fix to 2 decimal places
//   };

//   const fetchUser = async (userId) => {
//     try {
//       const resultAction = await dispatch(fetchUserById(userId)).unwrap();
//       return resultAction;  // Return the fetched user data
//     } catch (error) {
//       console.error('Failed to fetch user:', error);
//       return null;
//     }
//   };
//   const dispatch = useDispatch();
//   const proposalId = localStorage.getItem("proposalId")


//   useEffect(() => {
//     dispatch(fetchProposalById(proposalId));
//     dispatch(fetchDocumentById(proposalId))

//     const fetchData = async () => {
//       const managerData = await fetchUser(proposal?.sales_id);
//       const leadData = await fetchUser(proposal?.sales_id);

//       if (managerData) {
//         setManager(managerData);
//       }

//       if (leadData) {
//         setLead(leadData);
//       }
//     };

//     fetchData();

//   }, [dispatch]);


//   const proposal = useSelector((state) => state?.proposals?.proposal?.data);
//   const user = useSelector((state) => state?.users);
//   const documents = useSelector((state) => state?.documents?.document?.data)
//   console.log("wedw", documents)

//   useEffect(() => {

//     dispatch(fetchProposalById(proposalId));
//     dispatch(fetchContractJobById(proposal?.id))
//     // dispatch(fetchUser())
//     const fetchData = async () => {
//       const managerData = await fetchUser(proposal?.manager_id);  // Pass manager's ID
//       const leadData = await fetchUser(proposal?.sales_id);  // Pass lead's ID

//       if (managerData) {
//         setManager(managerData?.data);  // Update the state with the manager data
//       }

//       if (leadData) {
//         setLead(leadData?.data);  // Update the state with the lead data
//       }
//     };

//     fetchData();

//   }, [dispatch, proposal?.sales_id, proposal?.manager_id]);

//   const contractJob = useSelector((state) => state?.contractJob?.contractJobData?.data[0])


//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setUploadedFile(file?.name);
//     setSelectedFile(file);
//   };

//   const handleUploadClick = () => {
//     setShowFileModal(true);
//   };

//   const handleAddFolderClick = () => {
//     setShowFolderModal(true);
//   };

//   const handleFolderSubmit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("proposal_id", proposalId);
//       formData.append("folder_name", folderName);

//       const res = dispatch(createDocument(formData))
//       console.log("✅ Folder Created:", res.data);


//       setShowFolderModal(false);
//       setFolderName("");
//     } catch (error) {
//       console.error("❌ Folder Creation Error:", error);
//     }
//   };
//   const handleFileSubmit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("proposal_id", proposalId);
//       formData.append("title", fileTitle);
//       formData.append("fileUrls", selectedFile);

//       const res = await dispatch(createDocument(formData))
//       console.log("✅ File Uploaded:", res.data);
//       dispatch(fetchDocumentById(proposalId))

//       setUploadedFile(selectedFile?.name);
//       setShowFileModal(false);
//       setFileTitle("");
//       setSelectedFile(null);
//     } catch (error) {
//       console.error("❌ File Upload Error:", error);
//     }
//   };


//   const saveJob = async () => {
//     const payload = {
//       proposal_id: proposal?.id,
//       estimated_start: estimatedStart,
//       estimated_completion: estimatedEnd,
//       total_budget: totalBudgetedCost,
//       phase_name: phaseName,
//       materials_budget: materialsBudget,
//       labor_budget: laborBudget,
//       subcontractors_budget: subcontractorsBudget,
//       equipment_budget: equipmentBudget,
//       miscellanea_budget: miscBudget,
//     };

//     try {
//       const resultAction = await dispatch(createJobPlanning(payload));
//       console.log(resultAction)
//       if (createJobPlanning.fulfilled.match(resultAction)) {
//         Swal.fire("Success", "Job planning created successfully!", "success");
//       } else {
//         throw new Error(resultAction.payload || "Something went wrong");
//       }
//     } catch (error) {
//       Swal.fire("Error", error.message, "error");
//     }
//     resetForm()
//   };


//   const handleAddLineItem = () => {
//     setLineItems([
//       ...lineItems,
//       { description: '', amount: 0, quantity: 1, taxable: false },
//     ]);
//   };

//   const handleLineChange = (index, field, value) => {
//     const updatedItems = [...lineItems];
//     updatedItems[index][field] = value;
//     setLineItems(updatedItems);
//   };
//   const removeLineItem = (index) => {
//     const updated = [...lineItems];
//     updated.splice(index, 1);
//     setLineItems(updated);
//   };
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedColor, setSelectedColor] = useState("#b5a14f");
//   const [activeTab, setActiveTab] = useState("Summary");
//   const [logsTab, setLogsTab] = useState("logs");
//   const [showDailyLogModal, setShowDailyLogModal] = useState(false);
//   const [logNotes, setLogNotes] = useState("");
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();

//   const job = location.state;
//   const stage = job?.p?.stage;

//   const handleEditClick = () => setIsEditing(true);
//   const handleCancel = () => setIsEditing(false);
//   const handleSave = () => setIsEditing(false);




//   const submitProposal = async () => {
//     const payload = {
//       proposal_id: proposalId,
//       client_name: clientName,
//       po_number: poNumber,
//       contract_number: contractNumber,
//       start_date: startDate,
//       end_date: endDate,
//       payment_terms: paymentTerms,
//       // taxable: taxable.toString(), // "true" or "false"
//       applicable_tax_rate: applicableTaxRate,
//       comments: comments,
//       items: lineItems.map((item) => ({
//         item_description: item.description,
//         quantity: item.quantity,
//         unit_price: item.amount,
//         taxable: item.taxable
//       })),
//     };

//     try {
//       const response = dispatch(createContractJob(payload)); // Replace with actual API endpoint
//       Swal.fire("Success", "Proposal submitted successfully!", "success");
//       console.log("Submitted:", response.data);
//     } catch (error) {
//       Swal.fire("Error", error?.response?.data?.message || "Submission failed", "error");
//       console.error("Submit error:", error);
//     }
//   };

//   const renderTabContent = () => {
//     // Special: Lead 
//     if (stage === "lead" && activeTab === "Client Proposal") {
//       return <ClientProposalForm />;
//     }

//     // Special: Active stage
//     if (stage === "Active" && activeTab === "Draft Proposal") {
//       return <Draftpurposal />;
//     }

//     // Common Tabs
//     switch (activeTab) {
//       case "Summary":
//         return (
//           <div className="tab-content-box row">
//             {/* Left Column: Job Details */}
//             <div className="col-md-8">
//               <h5 className="mb-3 fw-bold">Details</h5>
//               <div className="row mb-3">
//                 <div className="col-md-6">
//                   <p className="mb-1 text-muted">Job Status</p>
//                   <p>Lead</p>
//                 </div>
//                 <div className="col-md-6">
//                   <p className="mb-1 text-muted">Job Type</p>
//                   <p>{proposal?.job_type}</p>
//                 </div>
//                 <div className="col-md-6">
//                   <p className="mb-1 text-muted">Sales Lead</p>
//                   <p>   {lead?.first_name}  {lead?.last_name}</p>
//                 </div>
//                 <div className="col-md-6">
//                   <p className="mb-1 text-muted">Project Manager</p>
//                   <p> {manager?.first_name}  {manager?.last_name}  </p>
//                 </div>

//                 <div className="col-12 mt-3">
//                   <p className="mb-1 text-muted">Tags</p>
//                   <div className="d-flex align-items-center flex-wrap gap-2">
//                     {proposal?.tags?.map((tag, index) => (
//                       <span key={index} className="badge bg-secondary w-auto me-2">
//                         {tag}
//                       </span>
//                     ))}

//                   </div>
//                 </div>
//                 <div className="col-12 mt-4">
//                   <p className="mb-1 text-muted">Location</p>
//                   <p>{proposal?.job_address}</p>
//                 </div>
//                 {/* <div className="col-12 mt-2">
//                   <div style={{ height: "300px", borderRadius: "8px", overflow: "hidden" }}>
//                     <iframe
//                       src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1389432.6951691378!2d48.01632987930219!3d15.867006933389124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1749494379294!5m2!1sen!2sin"
//                       width="100%"
//                       height="100%"
//                       style={{ border: 0 }}
//                       allowFullScreen=""
//                       loading="lazy"
//                       referrerPolicy="no-referrer-when-downgrade"
//                       title="Job Location Map"
//                     ></iframe>
//                   </div>
//                 </div> */}
//               </div>
//             </div>

//             {/* Right Column: Tasks & Portal */}
//             <div className="col-md-4">
//               <div className="bg-light p-3 rounded mb-3">
//                 <h6 className="fw-bold">Tasks</h6>
//                 <div className="d-flex justify-content-between mb-3">
//                   <div>
//                     <p className="mb-0 text-muted">Total</p>
//                     <p className="mb-0">0</p>
//                   </div>
//                   <div>
//                     <p className="mb-0 text-muted">Pending</p>
//                     <p className="mb-0">0</p>
//                   </div>
//                 </div>

//                 <h6 className="fw-bold">Analytics</h6>
//                 <p className="text-muted small">Not enough data</p>
//                 <a href="#!" className="small text-primary">Set costs/revenue previous to Knowify</a>
//               </div>

//               <div className="bg-light p-3 rounded">
//                 <h6 className="fw-bold">Customer Portal</h6>
//                 <button className="btn btn-outline-secondary btn-sm mt-2">
//                   🔗 Click here to create a portal for this job
//                 </button>
//               </div>
//             </div>
//           </div>
//         );




//       case "Job Costs":
//         return (
//           <div className="tab-content-box row">
//             {/* Left Column */}
//             <div className="col-md-8">
//               <h5 className="mb-3 fw-bold"></h5>
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <p className="mb-1 text-muted">Job Status</p>
//                   <p>Lead</p>
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <p className="mb-1 text-muted">Job Type</p>
//                   <p>{proposal?.job_type}</p>
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <p className="mb-1 text-muted">Estimated Start</p>
//                   <input
//                     type="date"
//                     className="form-control"
//                     value={estimatedStart}
//                     onChange={(e) => setEstimatedStart(e.target.value)}
//                   />

//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <p className="mb-1 text-muted">Estimated Completion</p>
//                   <input type="date" className="form-control" value={estimatedEnd} onChange={(e) => { setEstimatedEnd(e.target.value) }} />
//                 </div>
//                 {/* <div className="col-md-6 mb-3">
//                   <p className="mb-1 text-muted">Job Costing Style</p>
//                   <p>Professional</p>
//                 </div> */}
//                 <div className="col-md-6 mb-3">
//                   <p className="mb-1 text-muted">Total Budget</p>
//                   {/* <input type="text" className="form-control" placeholder="$0.00" /> */}
//                   {totalBudgetedCost}
//                 </div>
//               </div>

//               {/* Scheduling */}
//               {/* <div className="bg-light p-3 rounded mb-3">
//           <h6 className="fw-bold">Scheduling</h6>
//           <div className="text-muted small mb-2">No work scheduled</div>
//           <button className="btn btn-outline-secondary btn-sm">Add Schedule</button>
//         </div> */}

//               {/* Job Calendar */}
//               {/* <div className="bg-light p-3 rounded"> */}
//               <button className="btn btn-primary" onClick={saveJob}>Save</button>


//               {/* </div> */}

//               {/* <div className="mt-4">
//           <h6 className="fw-bold">Tasks</h6>
//           <div className="border rounded p-3 bg-light">
//             <p className="text-muted">No tasks added yet</p>
//             <button className="btn btn-sm btn-primary">Add Task</button>
//           </div>
//         </div> */}

//               {/* <div className="mt-4">
//           <h6 className="fw-bold">Milestones</h6>
//           <div className="border rounded p-3 bg-light">
//             <p className="text-muted">No milestones defined</p>
//             <button className="btn btn-sm btn-primary">Add Milestone</button>
//           </div>
//         </div> */}
//             </div>

//             {/* Right Column */}
//             <div className="col-md-4">
//               {/* Phase Budget Section */}
//               <div className="border p-3 rounded mb-4 bg-white">
//                 <Form.Group className="mb-2">
//                   <Form.Label>Phase Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={phaseName}
//                     onChange={(e) => setPhaseName(e.target.value)}
//                   />
//                 </Form.Group>

//                 <div className="text-end fw-bold mb-3">
//                   Budgeted Cost: ${totalBudgetedCost}
//                 </div>

//                 <Row className="mb-2">
//                   <Col>
//                     <Form.Label>Materials Budget</Form.Label>
//                     <Form.Control
//                       value={`$${materialsBudget}`}
//                       onChange={(e) => setMaterialsBudget(e.target.value.replace("$", ""))}
//                     />
//                   </Col>
//                   <Col>
//                     <Form.Label>Labor Budget</Form.Label>
//                     <Form.Control
//                       placeholder="$"
//                       value={laborBudget}
//                       onChange={(e) => setLaborBudget(e.target.value.replace("$", ""))}
//                     />
//                   </Col>
//                 </Row>

//                 <Row className="mb-2">
//                   <Col>
//                     <Form.Label>Subcontractors Budget</Form.Label>
//                     <Form.Control
//                       value={`$${subcontractorsBudget}`}
//                       onChange={(e) =>
//                         setSubcontractorsBudget(e.target.value.replace("$", ""))
//                       }
//                     />
//                   </Col>
//                   <Col>
//                     <Form.Label>Equipment Budget</Form.Label>
//                     <Form.Control
//                       value={`$${equipmentBudget}`}
//                       onChange={(e) =>
//                         setEquipmentBudget(e.target.value.replace("$", ""))
//                       }
//                     />
//                   </Col>
//                 </Row>

//                 <Row className="mb-3">
//                   <Col>
//                     <Form.Label>Miscellanea Budget</Form.Label>
//                     <Form.Control
//                       value={`$${miscBudget}`}
//                       onChange={(e) => setMiscBudget(e.target.value.replace("$", ""))}
//                     />
//                   </Col>
//                 </Row>

//                 {/* <Form.Check type="checkbox" label="Add WO" />
//           <div className="mt-2">
//             <a href="#" style={{ textDecoration: "none" }}>
//               🔗 Add dependency
//             </a>
//           </div> */}
//               </div>

//             </div>
//           </div>
//         );


//       case "Create Proposal":
//         return (


//           <div className="container mt-4 mb-5">
//             {/* Header */}
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <div>
//                 <span className="h5">Fixed price</span>
//               </div>
//               <div>
//                 <Button variant="success" className="me-2" onClick={submitProposal}>
//                   Save changes
//                 </Button>
//                 <Button variant="outline-secondary">Send out for signature</Button>
//               </div>
//             </div>

//             {/* Value / Cost / Profit */}
//             <Row className="text-center mb-4">
//               <Col>
//                 <strong>Value</strong>
//                 <div>${calculateTotalValue()}</div> {/* Dynamically render the total value */}
//               </Col>
//               <Col>
//                 <strong>Cost</strong>
//                 <div>$0.00</div>
//               </Col>
//               <Col>
//                 <strong>Profit</strong>
//                 <div>$0.00</div>
//               </Col>
//             </Row>

//             {/* Form */}
//             <Form>
//               <Row className="mb-3">
//                 <Col md={6}><Form.Label>Attn:</Form.Label><Form.Control type="text" placeholder="Test Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} /></Col>
//                 <Col md={6}><Form.Label>Estimated start date:</Form.Label><Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></Col>
//               </Row>
//               <Row className="mb-3">
//                 <Col md={6}><Form.Label>PO #:</Form.Label><Form.Control type="text" placeholder="Enter PO number" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} /></Col>
//                 <Col md={6}><Form.Label>Estimated end date:</Form.Label><Form.Control type="date" value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)} /></Col>
//               </Row>
//               <Row className="mb-4">
//                 <Col md={6}><Form.Label>Contract #:</Form.Label><Form.Control type="text" placeholder="Enter number or id" value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} /></Col>
//                 <Col md={6}>
//                   <Form.Label>Payment terms:</Form.Label>
//                   <Form.Select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
//                     <option value="">Select payment term</option>
//                     <option value="Due Upon Receipt">Due Upon Receipt</option>
//                     <option value="Net 15">Net 15</option>
//                     <option value="Net 30">Net 30</option>
//                     <option value="Full after completion">Full after completion</option>
//                   </Form.Select>
//                 </Col>
//               </Row>

//               {/* LINE ITEMS */}
//               <hr />
//               <h5 className="text-center">LINE ITEMS</h5>
//               {lineItems.map((item, idx) => (
//                 <div key={idx} className="bg-light p-3 mb-3 border rounded">
//                   <Row className="align-items-center mb-2">
//                     <Col md={6}>
//                       <Form.Control
//                         type="text"
//                         placeholder="Enter description here"
//                         value={item.description}
//                         onChange={(e) => handleLineChange(idx, 'description', e.target.value)}
//                       />
//                     </Col>
//                     <Col md={2}>
//                       <Form.Control
//                         type="number"
//                         placeholder="$0.00"
//                         value={item.amount}
//                         onChange={(e) => handleLineChange(idx, 'amount', e.target.value)}
//                       />
//                     </Col>
//                     <Col md={1}>
//                       <Form.Control
//                         type="number"
//                         min="1"
//                         value={item.quantity}
//                         onChange={(e) => handleLineChange(idx, 'quantity', e.target.value)}
//                       />
//                     </Col>
//                     <Col md={2}>
//                       <Form.Check
//                         type="checkbox"
//                         label="Taxable"
//                         checked={item.taxable}
//                         onChange={(e) => handleLineChange(idx, 'taxable', e.target.checked)}
//                       />
//                     </Col>
//                     <Col md={1} className="text-end">
//                       <Button variant="outline-danger" onClick={() => removeLineItem(idx)}>
//                         &times;
//                       </Button>
//                     </Col>
//                   </Row>
//                 </div>
//               ))}

//               <div className="d-flex justify-content-between align-items-center border p-3 rounded">
//                 <Button variant="primary" onClick={handleAddLineItem}>
//                   + Add new line item
//                 </Button>
//               </div>
//             </Form>

//             {/* TAX AND CONTRACT SUM */}
//             <div className="bg-success bg-opacity-10 p-3 mt-4 rounded">
//               <Row className="align-items-center mb-2">
//                 <Col md={4}>
//                   <Form.Label>Applicable tax rate:</Form.Label>
//                 </Col>
//                 <Col md={4}>
//                   <Form.Select value={applicableTaxRate} onChange={(e) => setApplicableTaxRate(e.target.value)}>
//                     <option>(Non taxable) 0%</option>
//                     <option>GST 5%</option>
//                     <option>VAT 10%</option>
//                   </Form.Select>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col md={6}>
//                   <p>
//                     <strong>Contract sum:</strong> $0.00
//                   </p>
//                 </Col>
//                 <Col md={6}>
//                   <p>
//                     <strong>Taxes in contract sum:</strong> $0.00
//                   </p>
//                 </Col>
//               </Row>
//             </div>

//             {/* TERMS AND CONDITIONS */}
//             <div className="mt-4">
//               <h6 className="text-center">TERMS AND CONDITIONS</h6>
//               <div className="mb-2">
//                 <Button variant="light" className="me-1">
//                   <b>B</b>
//                 </Button>
//                 <Button variant="light" className="me-1">
//                   <i>I</i>
//                 </Button>
//                 <Button variant="light">
//                   <u>U</u>
//                 </Button>
//               </div>
//               <Form.Control as="textarea" rows={4} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Enter terms and conditions here..." />
//             </div>
//           </div>


//         );

//       case "Contract & Change Orders":
//         return (
//           <div className="tab-content-box container">
//             {/* Header */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h5 className="fw-bold">Fixed price | AIA-style billing</h5>
//               <button className="btn btn-primary">Invoice now</button>
//             </div>

//             {/* Value summary */}
//             <div className="d-flex flex-wrap gap-4 mb-3">
//               <div><strong>Value:</strong> $264,000.00</div>
//               <div><strong>Invoiced:</strong> $45,000.00</div>
//               <div><strong>Retained:</strong> $5,000.00</div>
//             </div>

//             {/* Contract details */}
//             <div className="row mb-4">
//               <div className="col-md-6">
//                 <p><strong>GC Contract#:</strong> 4235</p>
//                 <p><strong>GC contract date:</strong> 11/1/22</p>
//               </div>
//               <div className="col-md-6">
//                 <p><strong>Retainage for work:</strong> 10%</p>
//                 <p><strong>Retainage for materials:</strong> 10%</p>
//                 <p><strong>Payment terms:</strong> NET7</p>
//               </div>
//             </div>

//             <button className="btn btn-link p-0 mb-3">✏️ Edit this information</button>

//             {/* Schedule of Values */}
//             <div className="border-top pt-3 mb-4">
//               <h6 className="fw-bold">SCHEDULE OF VALUES</h6>

//               {/* Item 1 */}
//               <div className="border rounded p-3 mb-3 bg-light">
//                 <h6 className="mb-1">1. Demolition / Clear Out</h6>
//                 <p className="mb-1"><strong>Value:</strong> $108,000.00</p>
//                 <p className="mb-1"><strong>Invoiced:</strong> 46.30%</p>
//                 <p><strong>Balance:</strong> $58,000.00</p>
//               </div>

//               {/* Item 2 */}
//               <div className="border rounded p-3 mb-3 bg-light">
//                 <h6 className="mb-1">2. Asphalt</h6>
//                 <p className="mb-1"><strong>Value:</strong> $156,000.00</p>
//                 <p className="mb-1"><strong>Invoiced:</strong> 0%</p>
//                 <p><strong>Balance:</strong> $156,000.00</p>
//               </div>

//               <button className="btn btn-primary">Add change order</button>
//             </div>

//             {/* Financial Summary */}
//             <div className="bg-primary bg-opacity-10 p-3 rounded mb-4">
//               <div className="row mb-2">
//                 <div className="col-md-6"><strong>A1. Original bid Sum:</strong></div>
//                 <div className="col-md-6 text-md-end">$264,000.00</div>
//               </div>
//               <div className="row mb-2">
//                 <div className="col-md-6"><strong>A2. Original contract sum:</strong></div>
//                 <div className="col-md-6 text-md-end">$264,000.00</div>
//               </div>
//               <div className="row mb-2">
//                 <div className="col-md-6"><strong>B1. Pending change orders:</strong></div>
//                 <div className="col-md-6 text-md-end">$0.00</div>
//               </div>
//               <div className="row mb-2">
//                 <div className="col-md-6"><strong>B2. Net change by approved change orders:</strong></div>
//                 <div className="col-md-6 text-md-end">$0.00</div>
//               </div>
//               <div className="row mb-2 fw-bold">
//                 <div className="col-md-6"><strong>C. Contract sum to date (A+B1+B2):</strong></div>
//                 <div className="col-md-6 text-md-end">$264,000.00</div>
//               </div>
//               <div className="row fw-bold">
//                 <div className="col-md-6"><strong>D. Approved contract sum to date (A+B2):</strong></div>
//                 <div className="col-md-6 text-md-end">$264,000.00</div>
//               </div>
//             </div>

//             {/* Additional Options */}
//             <div className="mb-4">
//               <h6 className="fw-bold">ADDITIONAL OPTIONS</h6>
//               <select className="form-select w-auto">
//                 <option>Display line item subtotals</option>
//               </select>
//             </div>

//             {/* Terms and Conditions */}
//             <div className="mb-4">
//               <h6 className="fw-bold">TERMS AND CONDITIONS</h6>
//               <p className="text-muted mb-0">
//                 The above price is valid for 30 days. Test Data agrees that they will enter into a standard AIA subcontract with General Contractor,
//                 and that basic provisions such as insurance and W-9 shall be in place prior to start.
//               </p>
//             </div>
//           </div>
//         );

//       case "Documents":
//         return (
//           <div className="tab-content-box text-center">
//             {/* Placeholder Image */}
//             <div className="mb-3">
//               <img
//                 src="https://img.icons8.com/ios/100/000000/document--v1.png"
//                 alt="Documents"
//                 width="100"
//               />
//             </div>

//             {/* Headings */}
//             <h5 className="fw-bold">Documents</h5>
//             {/* <p className="text-muted mb-1">
//         Build a central repository for all your project documents.
//       </p> */}

//             {/* Buttons */}
//             <div className="d-flex justify-content-center gap-2 mt-3">
//               {/* <button className="btn btn-outline-secondary" onClick={handleAddFolderClick}>
//           Add folder
//         </button> */}
//               <button className="btn btn-primary" onClick={handleUploadClick}>
//                 Upload file
//               </button>
//             </div>

//             {/* Uploaded File Display */}
//             {uploadedFile && (
//               <div className="mt-3">
//                 <p className="text-primary">Uploaded: {uploadedFile}</p>
//               </div>
//             )}

//             {/* Folder Modal */}
//             {showFolderModal && (
//               <div className="modal fade show d-block" tabIndex="-1" role="dialog">
//                 <div className="modal-dialog" role="document">
//                   <div className="modal-content">
//                     <div className="modal-header">
//                       <h5 className="modal-title">Create Folder</h5>
//                       <button type="button" className="btn-close" onClick={() => setShowFolderModal(false)}></button>
//                     </div>
//                     <div className="modal-body">
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter folder name"
//                         value={folderName}
//                         onChange={(e) => setFolderName(e.target.value)}
//                       />
//                     </div>
//                     <div className="modal-footer">
//                       <button className="btn btn-secondary" onClick={() => setShowFolderModal(false)}>Cancel</button>
//                       <button className="btn btn-primary" onClick={handleFolderSubmit}>Create</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* File Upload Modal */}
//             {showFileModal && (
//               <div className="modal fade show d-block" tabIndex="-1" role="dialog">
//                 <div className="modal-dialog" role="document">
//                   <div className="modal-content">
//                     <div className="modal-header">
//                       <h5 className="modal-title">Upload File</h5>
//                       <button type="button" className="btn-close" onClick={() => setShowFileModal(false)}></button>
//                     </div>
//                     <div className="modal-body">
//                       <input
//                         type="text"
//                         className="form-control mb-2"
//                         placeholder="Enter title"
//                         value={fileTitle}
//                         onChange={(e) => setFileTitle(e.target.value)}
//                       />
//                       <input
//                         type="file"
//                         className="form-control"
//                         onChange={handleFileChange}
//                       />
//                     </div>
//                     <div className="modal-footer">
//                       <button className="btn btn-secondary" onClick={() => setShowFileModal(false)}>Cancel</button>
//                       <button className="btn btn-primary" onClick={handleFileSubmit}>Upload</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div className="container mt-4">


//               {/* Preview Modal */}
//               {previewUrl && (
//                 <div className="modal fade show d-block" tabIndex="-1" role="dialog">
//                   <div className="modal-dialog modal-lg" role="document">
//                     <div className="modal-content">
//                       <div className="modal-header">
//                         <h5 className="modal-title">Preview File</h5>
//                         <button
//                           type="button"
//                           className="btn-close"
//                           onClick={() => setPreviewUrl(null)}
//                         ></button>
//                       </div>
//                       <div className="modal-body text-center">
//                         {previewUrl.endsWith(".pdf") ? (
//                           <iframe
//                             src={previewUrl}
//                             title="PDF Preview"
//                             width="100%"
//                             height="500px"
//                           />
//                         ) : (
//                           <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%" }} />
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <DocumentList
//               documents={documents}
//               previewUrl={previewUrl}
//               setPreviewUrl={setPreviewUrl}
//             />
//           </div>

//         );

//       case "Logs":
//         const logsData = [
//           {
//             date: "6/10/25",
//             entries: [
//               {
//                 text: "Time entry modified",
//                 by: "simon mashiah",
//                 time: "2:37 PM",
//               },
//             ],
//           },
//           {
//             date: "6/5/25",
//             entries: [
//               {
//                 text: "Checked out",
//                 by: "simon mashiah",
//                 time: "6:00 PM",
//               },
//               {
//                 text: "Time entry submitted",
//                 by: "simon mashiah",
//                 time: "6:00 PM",
//               },
//               {
//                 text: "Checked in",
//                 by: "simon mashiah",
//                 time: "6:00 PM",
//               },
//             ],
//           },
//           {
//             date: "5/29/25",
//             files: [
//               { name: "Wally World Parking Lot 11/9/2022.pdf" },
//               { name: "Wally World Parking Lot 11/9/2022.pdf" },
//             ],
//             entries: [
//               { text: "Resource allocated", by: "simon mashiah", time: "2:26 PM" },
//               { text: "Resource allocated", by: "simon mashiah", time: "2:26 PM" },
//               { text: "Phase: Demolition / Clear Out marked as active", by: "simon mashiah", time: "2:26 PM" },
//               { text: "Subcontractor contract made active", by: "simon mashiah", time: "2:26 PM" },
//               { text: "PO created from subcontractor contract", by: "simon mashiah", time: "2:26 PM" },
//               { text: "Purchase created", by: "simon mashiah", time: "2:26 PM" },
//               { text: "Invoice finalized", by: "simon mashiah", time: "2:26 PM" },
//               { text: "Contract information modified", by: "simon mashiah", time: "2:26 PM" },
//               { text: "Job made active", by: "simon mashiah", time: "2:26 PM" },
//               { text: "Proposal saved as draft", by: "simon mashiah", time: "2:26 PM" },
//               { text: "Job created", by: "simon mashiah", time: "2:26 PM" },
//               { text: "Bill allocated", by: "simon mashiah", time: "2:26 PM" },
//               { text: "Bill created", by: "simon mashiah", time: "2:26 PM" },
//               { text: "Bill items re-allocated", by: "simon mashiah", time: "2:26 PM" },
//               { text: "Bill created", by: "simon mashiah", time: "2:26 PM" },
//             ],
//           },
//         ];

//         return (
//           // <div className="tab-content-box">
//           //   {/* Logs/Daily logs tab buttons */}
//           //   <div className="d-flex align-items-center gap-2 mb-3">
//           //     <button
//           //       className={`btn btn-sm ${logsTab === "logs" ? "btn-primary" : "btn-outline-secondary"}`}
//           //       onClick={() => setLogsTab("logs")}
//           //     >
//           //       Logs
//           //     </button>
//           //     <button
//           //       className={`btn btn-sm ${logsTab === "daily" ? "btn-primary" : "btn-outline-secondary"}`}
//           //       onClick={() => setLogsTab("daily")}
//           //     >
//           //       Daily logs
//           //     </button>
//           //   </div>

//           //   {/* Logs tab content */}
//           //   {logsTab === "logs" && (
//           //     <>
//           //       <div className="d-flex justify-content-between align-items-center mb-3">
//           //         <h4 className="mb-0">Logs</h4>
//           //         <div className="d-flex gap-2">
//           //           <button className="btn btn-success btn-sm">Add log</button>
//           //           <button className="btn btn-outline-secondary btn-sm">
//           //             <i className="bi bi-three-dots-vertical"></i>
//           //           </button>
//           //         </div>
//           //       </div>
//           //       <div className="d-flex gap-2 mb-3">
//           //         <div className="input-group" style={{ maxWidth: 300 }}>
//           //           <input type="text" className="form-control" placeholder="Search" />
//           //         </div>
//           //         <div className="dropdown">
//           //           <button
//           //             className="btn btn-light dropdown-toggle"
//           //             type="button"
//           //             data-bs-toggle="dropdown"
//           //             aria-expanded="false"
//           //           >
//           //             View: All
//           //           </button>
//           //           <ul className="dropdown-menu">
//           //             <li><a className="dropdown-item" href="#">All</a></li>
//           //             <li><a className="dropdown-item" href="#">Created</a></li>
//           //             <li><a className="dropdown-item" href="#">Updated</a></li>
//           //           </ul>
//           //         </div>
//           //       </div>
//           //       <div>
//           //         {logsData.map((log, idx) => (
//           //           <div key={idx} className="mb-4">
//           //             <div className="fw-bold mb-2">{log.date}</div>
//           //             {/* Files (if any) */}
//           //             {log.files && log.files.map((file, i) => (
//           //               <div key={i} className="d-flex align-items-center bg-light rounded px-2 py-1 mb-1" style={{ maxWidth: 500 }}>
//           //                 <i className="bi bi-paperclip me-2"></i>
//           //                 <span className="text-primary" style={{ cursor: "pointer" }}>{file.name}</span>
//           //               </div>
//           //             ))}
//           //             {/* Entries */}
//           //             <ul className="list-unstyled ms-3">
//           //               {log.entries.map((entry, i) => (
//           //                 <li key={i} className="mb-2">
//           //                   <span className="fw-semibold">{entry.text}</span>
//           //                   <br />
//           //                   <span className="text-muted small">
//           //                     by {entry.by} @ {entry.time}
//           //                   </span>
//           //                 </li>
//           //               ))}
//           //             </ul>
//           //           </div>
//           //         ))}
//           //       </div>
//           //     </>
//           //   )}

//           //   {/* Daily logs tab content */}
//           //   {logsTab === "daily" && (
//           //     <div>
//           //       <div className="text-center py-5">
//           //         <img src="https://img.icons8.com/ios/100/000000/document--v1.png" alt="No activity" width={80} />
//           //         <h5 className="mt-3">No activity for today</h5>
//           //         <button className="btn btn-success mt-2" onClick={() => setShowDailyLogModal(true)}>
//           //           Create log
//           //         </button>
//           //       </div>
//           //       {/* Modal for Create Log */}
//           //       <Modal
//           //         show={showDailyLogModal}
//           //         onHide={() => setShowDailyLogModal(false)}
//           //         size="xl"
//           //         centered
//           //         backdrop="static"
//           //       >
//           //         <Modal.Header closeButton>
//           //           <Modal.Title>Daily Log - TUE 6/10/25</Modal.Title>
//           //         </Modal.Header>
//           //         <Modal.Body>
//           //           <div className="d-flex flex-wrap align-items-center border-bottom pb-3 mb-3">
//           //             <div className="col text-center">
//           //               <div className="text-muted small">Phases with activity</div>
//           //               <div className="fw-bold fs-4">NA</div>
//           //             </div>
//           //             <div className="col text-center">
//           //               <div className="text-muted small">Resources on site</div>
//           //               <div className="fw-bold fs-4">NA</div>
//           //             </div>
//           //             <div className="col text-center">
//           //               <div className="text-muted small">Resource hours on site</div>
//           //               <div className="fw-bold fs-4">NA</div>
//           //             </div>
//           //             <div className="col text-center">
//           //               <div className="text-muted small">
//           //                 <span role="img" aria-label="humidity">💧</span> High
//           //               </div>
//           //               <div className="fw-bold fs-4">70°F</div>
//           //               <div className="text-muted small">Low</div>
//           //               <div className="fw-bold fs-4">62°F</div>
//           //             </div>
//           //           </div>
//           //           <div className="mb-4">
//           //             <h5 className="fw-bold">Phases</h5>
//           //             <div className="text-muted">No phase activity for today.</div>
//           //           </div>
//           //           <div className="mb-4">
//           //             <h4 className="fw-bold">Project details</h4>
//           //             <h6 className="fw-bold">Resources on site</h6>
//           //             <div className="text-muted mb-2">No resources on site activity for today.</div>
//           //             <h6 className="fw-bold">Notes</h6>
//           //             <textarea
//           //               className="form-control mb-3"
//           //               rows={4}
//           //               placeholder="Type here"
//           //               value={logNotes}
//           //               onChange={e => setLogNotes(e.target.value)}
//           //             ></textarea>
//           //           </div>
//           //           <div className="mb-4">
//           //             <h5 className="fw-bold">Project photos & documents</h5>
//           //             <div className="text-muted mb-2">No project photos activity for today.</div>
//           //             <Dropdown>
//           //               <Dropdown.Toggle variant="light" size="sm">
//           //                 + Add photos & documents
//           //               </Dropdown.Toggle>
//           //               <Dropdown.Menu>
//           //                 <Dropdown.Item>Add photo</Dropdown.Item>
//           //                 <Dropdown.Item>Add document</Dropdown.Item>
//           //               </Dropdown.Menu>
//           //             </Dropdown>
//           //           </div>
//           //           <div className="mb-4">
//           //             <h5 className="fw-bold">Log comments</h5>
//           //             <div className="text-muted">No log comments activity for today.</div>
//           //           </div>
//           //         </Modal.Body>
//           //         <Modal.Footer>
//           //           <Button variant="light" onClick={() => setShowDailyLogModal(false)}>
//           //             Cancel
//           //           </Button>
//           //           <Button variant="success" onClick={() => setShowDailyLogModal(false)}>
//           //             Save
//           //           </Button>
//           //         </Modal.Footer>
//           //       </Modal>
//           //     </div>
//           //   )}
//           // </div>
//           <div className="tab-content-box">
//             <DailyLogs />
//           </div>
//         );

//       case "Activity":
//         return (
//           <div className="tab-content-box">
//             {/* Totals Section */}
//             <div className="row text-center border-bottom pb-3 mb-3">
//               {[
//                 { label: "Materials", note: "w/ open POs" },
//                 { label: "Labor", note: "w/ open POs" },
//                 { label: "Subs", note: "w/ open POs" },
//                 { label: "Invoices", note: "w/ deposits & taxes, ex. drafts" }
//               ].map((item, index) => (
//                 <div className="col-md-3" key={index}>
//                   <div><strong>$0.00</strong></div>
//                   <small className="text-muted">{item.note}</small>
//                 </div>
//               ))}
//             </div>

//             {/* Filters and Export */}
//             <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
//               <div className="input-group" style={{ maxWidth: 220 }}>
//                 <span className="input-group-text">
//                   <i className="bi bi-calendar-event"></i>
//                 </span>
//                 <input type="text" className="form-control" value="6/10/24 - 6/30/25" readOnly />
//               </div>

//               <div className="dropdown">
//                 <button
//                   className="btn btn-light dropdown-toggle"
//                   type="button"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   View: All
//                 </button>
//                 <ul className="dropdown-menu">
//                   <li><a className="dropdown-item" href="#">All</a></li>
//                   <li><a className="dropdown-item" href="#">Filtered</a></li>
//                 </ul>
//               </div>

//               <button className="btn btn-outline-secondary">
//                 <i className="bi bi-file-earmark-arrow-down me-1"></i> Export
//               </button>
//             </div>

//             {/* No Results Message */}
//             <div className="bg-light text-center py-5 rounded" style={{ minHeight: '250px' }}>
//               <i className="bi bi-search fs-1 text-muted"></i>
//               <h5 className="mt-3">No results</h5>
//               <p className="text-muted">There is no activity that match your search criteria</p>
//             </div>
//           </div>
//         );

//       case "Reports":
//         return (
//           <div className="tab-content-box container">
//             {/* Overall Performance */}
//             <div className="mb-4">
//               <h5 className="fw-bold">Overall Performance</h5>
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <a href="#" className="text-primary fw-semibold d-block">Project Summary</a>
//                   <p className="text-muted mb-0">
//                     This report contains all the job information and can be used as a closeout document.
//                   </p>
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <a href="#" className="text-primary fw-semibold d-block">Profit and Loss (P&amp;L)</a>
//                   <p className="text-muted mb-0">
//                     This report provides budget and progress information based on the current status of the job,
//                     offering insights on budget variance. It doesn't take into account WIP for profit calculations.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Labor, Subs & Equipment */}
//             <div className="mb-4">
//               <h5 className="fw-bold">Labor, Subs &amp; Equipment</h5>
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <a href="#" className="text-primary fw-semibold d-block">Labor Hours Report</a>
//                   <p className="text-muted mb-0">
//                     This report provides a breakdown of labor hours by employee and phase.
//                   </p>
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <a href="#" className="text-primary fw-semibold d-block">Subcontractor Summary</a>
//                   <p className="text-muted mb-0">
//                     This report provides a summary of all subcontractor work and payments.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Financial Reports */}
//             <div className="mb-4">
//               <h5 className="fw-bold">Financial Reports</h5>
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <a href="#" className="text-primary fw-semibold d-block">AIA G702/G703</a>
//                   <p className="text-muted mb-0">
//                     Standard AIA billing forms for construction projects.
//                   </p>
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <a href="#" className="text-primary fw-semibold d-block">Cost Code Summary</a>
//                   <p className="text-muted mb-0">
//                     Detailed breakdown of costs by cost code.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return <div>Select a tab</div>;
//     }
//   };

//   return (
//     <div className="wwd-container container">
//       {/* Back Button */}
//       <div className="mb-2">
//         <Button variant="outline-secondary mt-1" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-1" /> Back
//         </Button>
//       </div>

//       {!isEditing ? (
//         <>
//           {/* Header */}
//           <div className="wwd-header d-flex justify-content-between align-items-center py-3">
//             <div>
//               <h4 className="mb-0">{proposal?.job_name}</h4>
//               <p className="text-muted small">{proposal?.client_name}</p>
//             </div>
//           </div>

//           {/* Tabs */}
//           <ul className="nav nav-tabs wwd-tabs mb-4">
//             {[
//               "Summary",
//               "Job Costs",
//               stage === "lead"
//                 ? "Client Proposal"
//                 : stage === "Active"
//                   ? "Draft Proposal"
//                   : "Contract & Change Orders",
//               "Create Proposal",
//               "Documents",
//               "Logs",
//               "Activity",
//               "Reports",
//             ].map((tab, i) => (
//               <li className="nav-item" key={i}>
//                 <button
//                   className={`nav-link ${activeTab === tab ? "active" : ""}`}
//                   style={{ background: "none", border: "none" }}
//                   onClick={() => setActiveTab(tab)}
//                 >
//                   {tab}
//                 </button>
//               </li>
//             ))}
//           </ul>

//           {/* Tab Content */}
//           {renderTabContent()}
//         </>
//       ) : (
//         <EditJob
//           onCancel={handleCancel}
//           onSave={handleSave}
//           selectedColor={selectedColor}
//           setSelectedColor={setSelectedColor}
//         />
//       )}
//     </div>
//   );
// };

// export default Editpurposal;
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
// import DocumentList from "./DocumentList";
import DailyLogs from "../../Employee/DailyLogs/DailyLogs";
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
  console.log(job);

  // const stage = job?.p?.stage;

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
                <div className="col-md-6">
                  <p className="mb-1 text-muted">Job Type</p>
                  <p>{job?.job_type}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1 text-muted">Sales Lead</p>
                  <p>{lead?.first_name} {lead?.last_name}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1 text-muted">Project Manager</p>
                  <p>{manager?.first_name} {manager?.last_name}</p>
                </div>
                <div className="col-12 mt-4">
                  <p className="mb-1 text-muted">Location</p>
                  <p>{job?.job_address}</p>
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
                <a href="#!" className="small text-primary">Set costs/revenue previous to Knowify</a>
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
                  {/* <p>Lead</p> */}
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
                  {/* <p>${totalBudgetedCost}</p> */}
                  <p>${job?.budgetAmount}</p>
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
            {/* <AddCostEstimates /> */}
            <AddInvoice />
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
      <div className="mb-2">
        <Button variant="outline-secondary mt-1" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-1" /> Back
        </Button>
      </div>

      <div className="wwd-header d-flex justify-content-between align-items-center py-3">
        <div>
          {/* <h4 className="mb-0">{job?.job_name}</h4> */}
          <h4 className="mb-0">{job?.projectName || job?.job_name}</h4>
          <p className="text-muted small">{job?.clientId?.clientName}</p>
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

export default Editpurposal;
