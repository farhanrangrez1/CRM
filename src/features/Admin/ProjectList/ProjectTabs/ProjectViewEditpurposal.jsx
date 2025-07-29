
import React, { useEffect, useState } from "react";
import "./ProjectViewEditpurposal.css";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Row, Col, Modal, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import AddInvoice from "../../Invoicing_Billing/AddInvoice";
import ProposalEmailUI from "../../LeadFlow/ProposalEmailUI";
import DailyLogs from "../../../Employee/DailyLogs/DailyLogs";
import { fetchProject } from "../../../../redux/slices/ProjectsSlice";
import { createDocument, fetchDocumentById } from "../../../../redux/slices/saveDocumentSlice";
import DocumentList from "../../LeadFlow/DocumentList";
import { getDocumentsByProposalId } from "../../../../redux/slices/documentSlice";
import JobCost from "../../LeadFlow/JobCost";
import { fetchusers } from "../../../../redux/slices/userSlice";
import FinanceTabEditPage from "../../LeadFlow/FinanceTabEditPage";
import ProjectJobsTab from "./ProjectJobsTab";
import { apiNetaUrl, apiUrl } from "../../../../redux/utils/config";
import { fetchClientsById } from "../../../../redux/slices/ClientSlice";
import { toast } from "react-toastify";


const ProjectViewEditpurposal = () => {
  const [phaseName, setPhaseName] = useState("");
  const [materialsBudget, setMaterialsBudget] = useState(0.0);
  const [laborBudget, setLaborBudget] = useState(0.0);
  const [subcontractorsBudget, setSubcontractorsBudget] = useState(0.0);
  const [equipmentBudget, setEquipmentBudget] = useState(0.0);
  const [miscBudget, setMiscBudget] = useState(0.0);
  const [jobCostNotes, setJobCostNotes] = useState("");
  const [estimatedStart, setEstimatedStart] = useState("");
  const [estimatedEnd, setEstimatedEnd] = useState("");
  const [showFileModal, setShowFileModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);


  // const [activeTab, setActiveTab] = useState("Create Proposal");
  const [activeTab, setActiveTab] = useState("Summary");
  const totalBudgetedCost = (
    parseFloat(materialsBudget || 0.0) +
    parseFloat(laborBudget || 0.0) +
    parseFloat(subcontractorsBudget || 0.0) +
    parseFloat(equipmentBudget || 0.0) +
    parseFloat(miscBudget || 0.0)
  ).toFixed(2);

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProject())
  }, [])

  const [existingDocId, setExistingDocId] = useState(null);

  const [invoice, setInvoice] = useState(null);
  useEffect(() => {
    const storedInvoice = localStorage.getItem("invoice");
    if (storedInvoice) {
      setInvoice(JSON.parse(storedInvoice));
    }
  }, []);


  useEffect(() => {
    if (invoice?._id) {
      dispatch(getDocumentsByProposalId(invoice?._id))
        .unwrap()
        .then((res) => {
          if (Array.isArray(res) && res.length > 0) {
            setExistingDocId(res[0].id);
          }
        }
        )
    }
  }, [invoice]);


  const selectedClient = useSelector((state) => state.client.selectedClient);

  useEffect(() => {
    if (invoice?.clientId?._id) {
      const id = invoice.clientId._id;
      dispatch(fetchClientsById(id));
    }
  }, [invoice?.clientId?._id, dispatch]);

  const navigate = useNavigate();
  const location = useLocation();
  const job = location.state.item;
  const project_id = localStorage.getItem("proposalId");
  const proposalId = localStorage.getItem("proposalId");
  const [refreshJobCost, setRefreshJobCost] = useState(false);


  const resetForm = () => {
    setPhaseName("");
    setMaterialsBudget(0.0);
    setLaborBudget(0.0);
    setSubcontractorsBudget(0.0);
    setEquipmentBudget(0.0);
    setMiscBudget(0.0);
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
      notes: jobCostNotes,
    };

    try {
      const response = await axios.post(
        `${apiNetaUrl}/job_planning`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire("Success", "Job planning created successfully!", "success").then(() => {
          setRefreshJobCost(prev => !prev); // toggle to trigger refresh
        });
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || error.message, "error");
    }

    resetForm();
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
  const permissiondata = JSON.parse(localStorage.getItem("permissions"));
  const handleFileSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("proposal_id", proposalId);
      formData.append("title", fileTitle);
      formData.append("fileUrls", selectedFile);
      formData.append("created_by", permissiondata?.userId);

      const res = await dispatch(createDocument(formData))
      // console.log("✅ File Uploaded:", res.data);
      dispatch(fetchDocumentById(proposalId))

      // setUploadedFile(selectedFile?.name);
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


  const [showAddInvoice, setShowAddInvoice] = useState(true);

  // const [items, setItems] = useState([{ description: "", quantity: 0, rate: 0, amount: 0 }]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (invoice?._id) {
      dispatch(getDocumentsByProposalId(invoice?._id))
        .unwrap()
        .then((res) => {
          if (Array.isArray(res) && res.length > 0) {
            setExistingDocId(res[0].id);
            const doc = res[0];
            if (Array.isArray(doc?.line_items)) {
              setItems(doc?.line_items);
            } else {
              setItems([]); // Ensure items is always an array
            }
          }
        });
    }
  }, [invoice]);




  useEffect(() => {
    if (invoice) {
      setItems(invoice?.lineItems)
    }
  }, [invoice])

  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {
    saveJob();
    setShowModal(false);
  };

  const handleCancel = () => {
    setSelectedJobCost(null);
    setShowModal(false);
  };

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);

  const fetchNotes = async () => {
    setLoadingNotes(true);
    try {
      const res = await fetch(`${apiNetaUrl}/notes`);
      const data = await res.json();
      const allNotes = data?.data || [];
      const filteredNotes = allNotes.filter(note => note.project_id === proposalId);
      setNotes(filteredNotes || []);
      // setNotes(data?.data || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const res = await fetch(`${apiNetaUrl}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: invoice?._id,
          name: permissiondata?.userId || "Unknown Project",
          note: newNote,
        }),
      });

      if (res.ok) {
        setNewNote("");
        fetchNotes();
      } else {
        console.error("Failed to add note.");
      }
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    dispatch(fetchusers());
  }, [dispatch]);

  const { userAll } = useSelector((state) => state.user);
  const users = userAll?.data?.users || [];

  const getUserNameById = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Unknown";
  };


  const handleDeleteNote = async (noteId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this note?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${apiNetaUrl}/notes/${noteId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setNotes((prev) => prev.filter((n) => n.id !== noteId));
          Swal.fire("Deleted!", "Note has been deleted.", "success");
        } else {
          Swal.fire("Error!", "Failed to delete note.", "error");
        }
      } catch (err) {
        console.error("Error deleting note:", err);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${apiUrl}/jobs/${invoice?._id}`);
        const data = await res.json();
        setJobs(data?.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (invoice?._id) {
      fetchJobs();
    }
  }, [invoice?._id]);



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

  const handleUpdateTask = (job) => {
    navigate(`/admin/AddJobTracker/${job._id}`, { state: { job } });
  };

  const JobDetails = (job) => {
    navigate(`/admin/OvervieJobsTracker`, { state: { job } });
  };
  const [subClients, setSubClients] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/subClient`) // 🔁 Update this URL if needed
      .then(res => setSubClients(res.data.data))
      .catch(err => toast.error("Failed to fetch subclients"));
  }, []);



  useEffect(() => {
    const fetchemaildata = async () => {
      const response = await axios.get(`${apiUrl}/getEnvelopesByProjectId/${proposalId}`)
    }
    fetchemaildata();
  }, [])

  const [selectedJobCost, setSelectedJobCost] = useState(null);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Summary":
        return (
          <div className="tab-content-box row">
            {/* <div className="col-md-8">
              <h5 className="mb-3 fw-bold">Details</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1 text-muted">Job Status</p>
                  <p>{job?.status}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1 text-muted">Job Address</p>
                  <p>{invoice?.projectAddress}</p>
                </div>
              </div>
            </div> */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="col-md-8 text-start">
                <h5 className="mb-3 fw-bold">Details</h5>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1 text-muted">Job Status</p>
                    <p>{job?.status == "pendingProposalApproval" ? "Active Project" : job?.status}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1 text-muted">Job Address</p>
                    <p>{invoice?.projectAddress}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4 text-center">
                <h5 className="mb-3 fw-bold">Client Information</h5>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1 text-muted">Company Name</p>
                    <p>{selectedClient?.clientName}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1 text-muted">Job Address</p>
                    <p>{selectedClient?.clientAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="align-items-center mb-3">
              <h5 className="mb-3 fw-bold">Sub Client Details</h5>
              <div>
                {subClients && subClients?.length > 0 ? (
                  subClients
                    ?.filter((item) => item?.clientId?._id === selectedClient?._id)
                    ?.map((subClient) => {
                      // Total amount_paid for this subClient
                      const relatedItems = items?.filter((item) => item?.subClientId === subClient?._id) || [];

                      // Calculate totals
                      const totalPaid = relatedItems.reduce((acc, item) => acc + (item.amount_paid || 0), 0);
                      const totalDue = relatedItems.reduce((acc, item) => acc + (item.amount_due || 0), 0);

                      return (
                        <div key={subClient._id} className="mb-2">
                          <div className="row">
                            <div className="col-md-4">
                              <p className="mb-1 text-muted">Sub Client Name</p>
                              <p>{subClient?.subClientName}</p>
                            </div>
                            <div className="col-md-4">
                              <p className="mb-1 text-muted">Total Paid</p>
                              <p>{totalPaid}</p>
                            </div>
                            <div className="col-md-4">
                              <p className="mb-1 text-muted">Total Due</p>
                              <p>{totalDue}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="mb-1 text-muted">No Sub Client Name</p>
                )}
              </div>
            </div> */}

            <div>
              {/* <h6 className="fw-semibold mb-3">Line Items</h6>
              <div className="row fw-semibold text-muted mb-2 px-2">
                <div className="col-md-1">OrderNo.</div>
                <div className="col-md-4">Description</div>
                <div className="col-md-2">Quantity</div>
                <div className="col-md-2">Rate</div>
                <div className="col-md-2">Amount</div>
                <div className="col-md-1">Is Paid</div>
              </div> */}

              {/* {items?.length > 0 && items.map((item, index) => (
                <div
                  className="row gx-2 gy-2 align-items-center mb-2 px-2 py-2"
                  key={index}
                  style={{ background: "#f9f9f9", borderRadius: "8px" }}
                >
                  <div className="col-md-1">
                    <input readOnly type="text" className="form-control" value={index + 1} />
                  </div>
                  <div className="col-md-4">
                    <input readOnly type="text" className="form-control" value={item.description} />
                  </div>
                  <div className="col-md-2">
                    <input readOnly type="number" className="form-control" value={item.quantity} />
                  </div>
                  <div className="col-md-2">
                    <input readOnly type="number" className="form-control" value={item.rate} />
                  </div>
                  <div className="col-md-2">
                    <span>${parseFloat(item.amount).toFixed(2)}</span>
                  </div>
                  <div className="col-md-1">
                    <input
                      type="checkbox"
                      checked={item.is_paid === "true"}
                      readOnly
                      className="form-check-input"
                    />
                  </div>
                </div>
              ))} */}

              {/* Total Summary */}
              {/* {items?.length > 0 && (() => {
                const totalAmount = items.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
                const paidAmount = items
                  .filter((i) => i.is_paid === "true")
                  .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
                const dueAmount = totalAmount - paidAmount;

                return (
                  <div className="row fw-bold align-items-center px-2 py-3 mt-3 border-top">
                    <div className="col-md-6 text-end">Total Amount:</div>
                    <div className="col-md-2">${totalAmount.toFixed(2)}</div>
                    <div className="col-md-2 text-success">Paid: ${paidAmount.toFixed(2)}</div>
                    <div className="col-md-2 text-danger">Due: ${dueAmount.toFixed(2)}</div>
                  </div>
                );
              })()} */}
            </div>

            {/* 📌 Notes Section */}
            {/* <div div className="col-12 mt-4" >
              <div className="d-flex justify-content-between pb-2 align-item-center">
                <h6 className="fw-bold mb-3">Notes</h6>
                <button className="btn btn-primary mt-2" onClick={handleAddNote}>
                  Add Note
                </button>
              </div>

              <div className="mb-3">
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Add a new note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </div>

              {
                loadingNotes ? (
                  <p> Loading notes...</p>
                ) : notes?.length === 0 ? (
                  <p className="text-muted">No notes available.</p>
                ) : (
                  <ul className="list-group">
                    {notes?.map((note, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between">
                        <strong>{getUserNameById(note.name)}:</strong>
                        {note.note}
                        <div className="col-md-1 text-end">
                          <button type="button" className="btn btn-link text-danger p-0" onClick={() => handleDeleteNote(note?.id)}>
                            remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
            </div> */}
            <div className="col-12 mt-4">
              <div className="d-flex justify-content-between pb-2 align-items-center">
                <h6 className="fw-bold mb-3">Notes</h6>
                <button className="btn btn-primary mt-2" onClick={handleAddNote}>
                  Add Note
                </button>
              </div>

              <div className="mb-3">
                <textarea
                  rows="7"
                  className="form-control"
                  placeholder="Add a new note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </div>

              {loadingNotes ? (
                <p>Loading notes...</p>
              ) : notes?.length === 0 ? (
                <p className="text-muted">No notes available.</p>
              ) : (
                <ul className="list-group">
                  {notes.map((note, index) => (
                    <li key={index} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <strong>{getUserNameById(note.name)}:</strong>
                        <button
                          type="button"
                          className="btn btn-link text-danger p-0"
                          onClick={() => handleDeleteNote(note?.id)}
                        >
                          remove
                        </button>
                      </div>
                      <textarea
                        className="form-control mt-2"
                        rows="7"
                        value={note.note}
                        readOnly
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>



            {/* 📌 Tasks Section */}
            <div className="col-12 mt-4">
              <h6 className="fw-bold mb-3">Tasks</h6>
              {jobs.length === 0 ? (
                <div className="text-muted">No Tasks available.</div>
              ) : (
                <div className="table-responsive">
                  <Table className="align-middle sticky-header">
                    <thead className="bg-light">
                      <tr>
                        <th>TaskNo</th>
                        <th>Project Name</th>
                        {/*<th>Brand</th>
                        <th>Sub Brand</th>
                        <th>Flavour</th>
                        <th>PackType</th>
                        <th>PackSize</th>
                        <th>PackCode</th>
                        <th>TimeLogged</th>
                        <th>Due Date</th>*/}
                        <th>Assigned</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs?.slice().reverse().map((job) => (
                        <tr key={job?._id}>
                          <td>
                            <span style={{ textDecoration: "underline" }}>{job?.JobNo || "N/A"}</span>
                          </td>
                          <td>{job.projectId?.[0]?.projectName || "N/A"}</td>
                          {/* <td>{job.brandName}</td>
                          <td>{job.subBrand}</td>
                          <td>{job.flavour}</td>
                          <td>{job.packType}</td>
                          <td>{job.packSize}</td>
                          <td>{job.packCode}</td>
                          <td>
                            {new Date(job.updatedAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td>
                            {new Date(job.createdAt).toLocaleDateString("en-GB")}
                          </td> */}
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {
                              userAll?.data?.users?.find(user => user._id === job?.assign)
                                ? `${userAll.data.users.find(user => user._id === job.assign).firstName} ${userAll.data.users.find(user => user._id === job.assign).lastName}`
                                : job?.assign
                            }
                          </td>
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
                              <Button id="icone_btn" size="sm" onClick={() => handleUpdateTask(job)}>
                                <FaEdit />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>

          </div>
        );

      case "Job Costs":
        return (
          <>
            {/* Top Right Button */}
            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-success" onClick={() => setShowModal(true)}>
                Add Job Cost
              </button>
            </div>

            {/* JobCost Component (Always Visible) */}
            <JobCost
              jobStatus={job?.status}
              refreshTrigger={refreshJobCost}
              show={(jobItem) => {
                setSelectedJobCost(jobItem); // store selected job
                setShowModal(true); // show modal
              }}
            />
            <Modal
              show={showModal}
              onHide={handleCancel}
              size="lg"
              centered
              backdrop="static"
            >
              <Modal.Header closeButton>
                <Modal.Title>Add Job Cost</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <div className="row">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <p className="mb-1 text-muted">Job Status</p>
                        <p>{job?.status}</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <p className="mb-1 text-muted">Total Budget</p>
                        <p>${selectedJobCost ? selectedJobCost?.total_budget : totalBudgetedCost}</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <p className="mb-1 text-muted">Date of Expense</p>
                        <input
                          type="date"
                          className="form-control"
                          value={selectedJobCost ? selectedJobCost?.estimated_start : estimatedStart}
                          onChange={(e) => setEstimatedStart(e.target.value)}
                        />
                      </div>
                      <div className="col-md-12 mb-3">
                        <p className="mb-1 text-muted">Notes</p>
                        <textarea
                          rows="5"
                          type="text"
                          className="form-control"
                          value={selectedJobCost ? selectedJobCost?.notes : jobCostNotes}
                          onChange={(e) => setJobCostNotes(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border p-3 rounded bg-light">
                      <Form.Group className="mb-3">
                        <Form.Label>Select Phase</Form.Label>
                        <Form.Select
                          value={selectedJobCost ? selectedJobCost?.phase_name : phaseName}
                          onChange={(e) => setPhaseName(e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="material">Material</option>
                          <option value="labour">Labour</option>
                        </Form.Select>
                      </Form.Group>

                      {(selectedJobCost?.phase_name === "material" || phaseName === "material") && (
                        <Form.Group className="mb-3">
                          <Form.Label>Material Cost</Form.Label>
                          <Form.Control
                            value={`$${selectedJobCost ? selectedJobCost?.materials_budget : materialsBudget}`}
                            onChange={(e) =>
                              setMaterialsBudget(e.target.value.replace("$", ""))
                            }
                          />
                        </Form.Group>
                      )}

                      {(selectedJobCost?.phase_name === "labour" || phaseName === "labour") && (
                        <Form.Group className="mb-3">
                          <Form.Label>Labour Cost</Form.Label>
                          <Form.Control
                            value={`$${selectedJobCost ? selectedJobCost?.labor_budget : laborBudget}`}
                            onChange={(e) =>
                              setLaborBudget(e.target.value.replace("$", ""))
                            }
                          />
                        </Form.Group>
                      )}
                    </div>
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                {!selectedJobCost && <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>}
              </Modal.Footer>
            </Modal>

          </>
        );

      case "Create Proposal":
        return (
          <div className="container mt-4 mb-5">
            {/* Main Page: AddInvoice */}
            {showAddInvoice && (
              <AddInvoice onInvoiceComplete={() => {
                setShowAddInvoice(false);
                setActiveTab("Finance");
              }} />
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
                      {/* <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                      /> */}
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
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
          <div className="container mt-4 mb-5">
            {showAddInvoice && (
              <AddInvoice onInvoiceComplete={() => setShowAddInvoice(false)} />
            )}
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

      case "Tasks": return (
        <ProjectJobsTab />
      );

      case "Finance": return (
        <div className="col-12">
          {/* <PurchaseOrder /> */}
          <FinanceTabEditPage />
        </div>
      );

      default:
        return <div>Select a tab</div>;
    }
  };


  try {
    return (
      <div className="wwd-container container">

        <div className="wwd-header d-flex justify-content-between align-items-center py-3">
          <div>
            {/* <h4 className="mb-0">{job?.job_name}</h4> */}
            <h4 className="mb-0">{job?.projectName || job?.job_name || invoice?.title}</h4>
            <p className="text-muted small">{job?.clientId?.clientName || invoice?.client}</p>
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
            !existingDocId ? "Create Proposal" : "Contract & Change Orders",
            "Documents",
            "Daily Logs",
            // "Activity",
            // "Reports",
            "Tasks",
            "Finance"
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
  } catch (error) {
    console.error("Error rendering tab content:", error);
    return <div>Something went wrong rendering this section.</div>;
  }
};

export default ProjectViewEditpurposal;
