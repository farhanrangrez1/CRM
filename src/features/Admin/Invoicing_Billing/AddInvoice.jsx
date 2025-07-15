

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { createCostEstimate, updateCostEstimate } from "../../../redux/slices/costEstimatesSlice";
import { fetchProject, updateProject } from "../../../redux/slices/ProjectsSlice";
import { fetchClient } from "../../../redux/slices/ClientSlice";
import { createInvoicingBilling, updateInvoicingBilling } from "../../../redux/slices/InvoicingBillingSlice";
import { createDocumentRecord, getDocumentsByProposalId, updateDocumentRecord } from "../../../redux/slices/documentSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button, Modal } from "react-bootstrap";

const currencies = [
  { value: "", label: "Select Currency" },
  { label: "USD - US Dollar", value: "USD" },
  { label: "EUR - Euro", value: "EUR" },
  { label: "INR - Indian Rupee", value: "INR" },
  { label: "GBP - British Pound", value: "GBP" },
  { label: "JPY - Japanese Yen", value: "JPY" },
  { label: "AED - UAE Dirham", value: "AED" },
  { label: "SAR - Saudi Riyal", value: "SAR" },
];

const document = ["Invoice Select", "Dummy Invoice", "Tax Invoice", "Proforma Invoice"];
const OutputFormat = ["", "PDF", "DOCX", "XLSX", "TXT"];
const statuses = ["Status Select", "Active", "Inactive", "Completed", "pending", "overdue"];

function AddInvoice({ onInvoiceComplete }) {
  const [existingDocId, setExistingDocId] = useState(null);
  const location = useLocation();
  const [invoice, setInvoice] = useState(null);
  // const invoice = location.state?.invoice;
  useEffect(() => {
    const storedInvoice = localStorage.getItem("invoice");
    if (storedInvoice) {
      setInvoice(JSON.parse(storedInvoice));
    }
  }, []);
  // const invoiceData = localStorage.getItem("invoice");
  // const invoice = invoiceData ? JSON.parse(invoiceData) : null;
  const id = invoice?._id;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { project } = useSelector((state) => state.projects);
  // console.log(project);

  useEffect(() => {
    dispatch(fetchProject());
  }, [dispatch]);
  const reversedProjectList = project?.data?.slice().reverse() || [];

  const { Clients } = useSelector((state) => state.client);
  useEffect(() => {
    if (Clients && project?.data?.length) {
      const foundProject = project.data.find((p) => p._id === Clients);
      if (foundProject) {
        setFormData((prev) => ({
          ...prev,
          projectsId: foundProject._id,
        }));
      }
    }
  }, [Clients, project]);

  useEffect(() => {
    dispatch(fetchClient());
  }, [dispatch]);

  const [items, setItems] = useState([{ description: "", quantity: 0, rate: 0, amount: 0, is_paid: "false" }]);

  const [formData, setFormData] = useState({
    client_id: "",
    proposal_id: "",
    start_date: "",
    end_date: ""
  });

  useEffect(() => {

    if (invoice?._id) {
      // console.log(invoice?.id);
      dispatch(getDocumentsByProposalId(invoice?._id))
        .unwrap()
        .then((res) => {
          if (Array.isArray(res) && res.length > 0) {

            setExistingDocId(res[0].id); // ✅ Save the existing document ID
            const doc = res[0];
            setFormData({
              client_id: doc.client_id,
              proposal_id: doc.proposal_id,
              start_date: doc.start_date?.substring(0, 10) || "",
              end_date: doc.end_date?.substring(0, 10) || "",
            });
            if (Array.isArray(doc.line_items)) {
              // setItems(doc.line_items);
              setItems(doc.line_items.map(item => ({
                ...item,
                is_paid: item.is_paid || "false"
              })));
            }
          } else {
            setFormData((prev) => ({
              ...prev,
              client_id: invoice?.clientId?._id || "",
              proposal_id: invoice?._id || "",
              start_date: invoice.startDate?.substring(0, 10) || "",
              end_date: invoice.endDate?.substring(0, 10) || "",
            }));
            if (Array.isArray(invoice.lineItems)) {
              setItems(invoice.lineItems.map(item => ({
                ...item,
                is_paid: item.is_paid || "false"
              })));
            }
          }
        })
        .catch(() => {
          toast.error("Failed to fetch document record.");
        });
    }
  }, [invoice, invoice?._id]);


  const [taxRate, setTaxRate] = useState(0.05);

  const calculateAmount = (quantity, rate) => quantity * rate;

  // const handleItemChange = (index, field, value) => {
  //   const newItems = [...items];
  //   newItems[index][field] = value;
  //   newItems[index].amount = calculateAmount(newItems[index].quantity, newItems[index].rate);
  //   setItems(newItems);
  // };
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    // Special handling for is_paid checkbox
    if (field === 'is_paid') {
      newItems[index][field] = value === true ? "true" : "false";
    } else {
      newItems[index][field] = value;
    }
    // Recalculate amount if quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? value : newItems[index].quantity;
      const rate = field === 'rate' ? value : newItems[index].rate;
      newItems[index].amount = calculateAmount(quantity, rate);
    }
    setItems(newItems);
  };




  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 0, rate: 0, amount: 0, is_paid: "false" }]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;



  // const handleSubmit = async (e, isSignatureFlow = false) => {
  //   if (e) e.preventDefault();

  //   const payload = {
  //     ...formData,
  //     line_items: items,
  //   };

  //   try {
  //     if (existingDocId) {
  //       // Update document
  //       await dispatch(updateDocumentRecord({ id: existingDocId, data: payload })).unwrap();
  //       await toast.success("Change Order successfully");
  //       window.location.reload();
  //     } else {
  //       // Create document
  //       await dispatch(createDocumentRecord(payload)).unwrap();

  //       // Set project to bidding
  //       // await dispatch(updateProject({ id, payload: { status: "Bidding" } })).unwrap();
  //       await toast.success("Document created successfully");
  //       window.location.reload();
  //     }

  //     // ✅ If this was triggered from "Send Out For Signature"
  //     if (isSignatureFlow) {
  //       const fullPayload = {
  //         ...invoice,
  //         ...formData,
  //         line_items: items,
  //       };
  //       localStorage.setItem("SignatureData", JSON.stringify(fullPayload));
  //       onInvoiceComplete(); // Proceed to signature
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong while saving the document.");
  //   }
  // };



  // const handleSignature = () => {
  //   // then call the callback
  //   const payload = {
  //     ...invoice,
  //     ...formData,
  //     line_items: items,
  //   };

  //   localStorage.setItem("SignatureData", JSON.stringify(payload));
  //   onInvoiceComplete();
  // };

  const handleSubmit = async (e, isSignatureFlow = false) => {
    if (e) e.preventDefault();

    // 🔐 Signature Flow
    if (isSignatureFlow) {
      const fullPayload = {
        ...invoice,
        ...formData,
        line_items: items,
      };
      localStorage.setItem("SignatureData", JSON.stringify(fullPayload));
      onInvoiceComplete(); // Proceed to signature
    } else {
      const payload = {
        ...formData,
        line_items: items,
      };

      try {
        if (existingDocId) {
          await dispatch(updateDocumentRecord({ id: existingDocId, data: payload })).unwrap();
          toast.success("Change Order successfully");
        } else {
          await dispatch(createDocumentRecord(payload)).unwrap();
          toast.success("Document created successfully");
        }

        // 🔁 Calculate total paid and due from updated line_items
        const totalAmount = items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        const totalPaid = items
          .filter((item) => item.is_paid === "true" || item.is_paid === true)
          .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        const totalDue = totalAmount - totalPaid;

        // 🔄 Update the project after document is created/updated
        const projectUpdatePayload = {
          lineItems: items, // camelCase to match your earlier invoice data
          paid: totalPaid.toFixed(2),
          due: totalDue.toFixed(2),
        };

        await dispatch(updateProject({ id: invoice._id, payload: projectUpdatePayload }))
          .unwrap()
          .then(() => {
            toast.success("Project updated successfully!");
            // navigate("/admin/LeadFlow"); // or your required route
          })
          .catch(() => {
            toast.error("Failed to update project!");
          });



      } catch (error) {
        toast.error("Something went wrong while saving the document.");
      }
    }


  };



  const [pdfUrl, setPdfUrl] = useState(null);
  const proposalRef = useRef();
  const [signatureData, setSignatureData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [client, setClient] = useState({});
  const [selectedClient, setSelectedClient] = useState(null);
  const [proposalData, setProposalData] = useState({
    sendTo: "",
    subject: "",
    message: "",
  });


  useEffect(() => {
    dispatch(fetchClient());
  }, [dispatch]);


  useEffect(() => {
    const storedSignature = localStorage.getItem("SignatureData");
    if (storedSignature) {
      try {
        const parsedSignature = JSON.parse(storedSignature);
        setSignatureData(parsedSignature);
      } catch (error) {
        console.error("Invalid signatureData in localStorage:", error);
      }
    }
  }, []);


  useEffect(() => {
    const clientId = Array.isArray(signatureData?.clientId)
      ? signatureData.clientId[0]
      : signatureData?.clientId?._id;

    if (clientId && Clients?.data?.length > 0) {
      const client = Clients.data.find((c) => c._id === clientId);
      if (client) {
        setSelectedClient(client);
        setClient(client);
        setProposalData((prev) => ({
          ...prev,
          sendTo: client?.contactPersons?.[0]?.email || "",
        }));
      }
    }
  }, [signatureData, Clients]);

  useEffect(() => {
    const generatePDF = async () => {
      const element = proposalRef.current;
      if (!element || !signatureData?.line_items?.length) return;

      await new Promise((res) => setTimeout(res, 500));

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const blob = pdf.output("blob");
      const file = new File([blob], "proposal.pdf", { type: "application/pdf" });

      setSelectedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        file: file,
      });

      const pdfBlobUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfBlobUrl);
    };

    if (signatureData?.line_items?.length) {
      generatePDF();
    }
  }, [signatureData]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const handleShow = () => setShowModal(true); // Function to show modal
  const handleClose = () => setShowModal(false); // Function to close modal

  return (
    <>
      <ToastContainer />
      <div className="container-fluid p-4" style={{ backgroundColor: "white", borderRadius: "10px" }}>
        <div className="d-flex justify-content-end align-items-center mb-4">
          <Button variant="primary" onClick={handleShow}>
            Invoice
          </Button>
        </div>

        <div className="d-flex gap-2">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-4 mb-3">
                <label className="form-label">Client</label>
                <select
                  className="form-select"
                  name="client_id"
                  value={formData.client_id || ""}
                  disabled
                >
                  {Clients?.data
                    ?.filter((client) => client._id === formData.client_id)
                    .map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.clientName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Project</label>
                <select
                  className="form-select"
                  name="proposal_id"
                  value={formData.proposal_id || ""}
                  disabled>
                  {project?.data
                    ?.filter((proj) => proj._id === formData.proposal_id)
                    .map((proj) => (
                      <option key={proj._id} value={proj._id}>
                        {proj.projectName}
                      </option>
                    ))}
                </select>
              </div>

              {/* Selectore dropdow opne ho raha hai  */}
              {/* <div className="col-md-4 mb-3">
              <label className="form-label">Client</label>
              <select
                className="form-select"
                name="clientId"
                value={formData.clientId[0] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    clientId: [e.target.value],
                  })
                }
                required
              >
                <option value="">Select Client</option>
                {Clients?.data?.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Project</label>
              <select
                className="form-select"
                name="projectsId"
                value={formData.projectsId[0] || ""}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedProject = project?.data?.find((p) => p._id === selectedId);
                  setFormData({
                    ...formData,
                    projectsId: [selectedId],
                    projectName: selectedProject?.projectName || "",
                  });
                }}
                required
              >
                <option value="">Select a project</option>
                {reversedProjectList.map((proj) => (
                  <option key={proj._id} value={proj._id}>
                    {proj.projectName}
                  </option>
                ))}
              </select>
            </div> */}


              <div className="col-md-4 mb-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleFormChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleFormChange}
                />
              </div>

              {/* <div className="col-md-4 mb-3">
              <label className="form-label">Currency</label>
              <select
                className="form-select"
                name="currency"
                value={formData.currency}
                onChange={handleFormChange}
                required
              >
                {currencies.map((curr) => (
                  <option
                    key={curr.value}
                    value={curr.value}
                    disabled={curr.value === ""}
                  >
                    {curr.label}
                  </option>
                ))}
              </select>

            </div> */}

              {/* <div className="col-md-4 mb-3">
              <label className="form-label">Document Type</label>
              <select
                className="form-select"
                name="document"
                value={formData.document}
                onChange={handleFormChange}
                required
              >
                <option value="" disabled>
                  Select Document
                </option>
                {document.slice(1).map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>

            </div> */}

              {/* <div className="col-md-4 mb-3">
              <label className="form-label">Output Format</label>
              <select
                className="form-select"
                name="output"
                value={formData.output}
                onChange={handleFormChange}
                required
              >
                <option value="" disabled>
                  Select Output Format
                </option>
                {OutputFormat.slice(1).map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>

            </div> */}

              {/* <div className="col-md-4 mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                required
              >
                <option value="" disabled>
                  Status Select
                </option>
                {statuses.slice(1).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

            </div> */}
            </div>

            {/* <h6 className="fw-semibold mb-3">Line Items</h6>
            <div className="row fw-semibold text-muted mb-2 px-2">
              <div className="col-md-1">OrderNo.</div>
              <div className="col-md-3">Description</div>
              <div className="col-md-2">Quantity</div>
              <div className="col-md-2">Rate</div>
              <div className="col-md-2">Amount</div>
              <div className="col-md-1">Is Paid</div>
              <div className="col-md-1 text-end">Action</div>
            </div>
            {items.map((item, index) => (
              <div
                className="row gx-2 gy-2 align-items-center mb-2 px-2 py-2"
                key={index}
                style={{ background: "#f9f9f9", borderRadius: "8px" }}
              >
                <div className="col-md-1">
                  <input
                    type="text"
                    className="form-control"
                    value={index + 1}
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, "rate", parseFloat(e.target.value) || 0)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-2">
                  <span>
                    {formData.currency} {item.amount.toFixed(2)}
                  </span>
                </div>
                <div className="col-md-1">
                  <input
                    type="checkbox"
                    checked={item.is_paid === "true"} // Check if is_paid is "true"
                    onChange={(e) => handleItemChange(index, "is_paid", e.target.checked)} // Update is_paid based on checkbox state
                    className="form-check-input"
                  />
                </div>
                <div className="col-md-1 text-end">
                  <button type="button"
                    className="btn btn-link text-danger p-0"
                    onClick={() => removeItem(index)}
                  >
                    remove
                  </button>
                </div>
              </div>
            ))} */}
            <h6 className="fw-semibold mb-3">Line Items</h6>
            <div className="row fw-semibold text-muted mb-2 px-2">
              <div className="col-md-1">OrderNo.</div>
              <div className="col-md-3">Description</div>
              <div className="col-md-2">Quantity</div>
              <div className="col-md-2">Rate</div>
              <div className="col-md-2">Amount</div>
              <div className="col-md-1">Is Paid</div>
              <div className="col-md-1 text-end">Action</div>
            </div>

            {items.map((item, index) => (
              <div
                className="row gx-2 gy-2 align-items-center mb-2 px-2 py-2"
                key={index}
                style={{ background: "#f9f9f9", borderRadius: "8px" }}
              >
                <div className="col-md-1">
                  <input
                    type="text"
                    className="form-control"
                    value={index + 1}
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, "rate", parseFloat(e.target.value) || 0)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-2">
                  <span>
                    {formData.currency} {item.amount.toFixed(2)}
                  </span>
                </div>
                <div className="col-md-1">
                  <input
                    type="checkbox"
                    checked={item.is_paid === "true" || item.is_paid === true}
                    onChange={(e) => handleItemChange(index, "is_paid", e.target.checked)}
                    className="form-check-input"
                  />
                </div>
                <div className="col-md-1 text-end">
                  <button
                    type="button"
                    className="btn btn-link text-danger p-0"
                    onClick={() => removeItem(index)}
                  >
                    remove
                  </button>
                </div>
              </div>
            ))}

            {/* ✅ Summary Row */}
            {items.length > 0 && (() => {
              const total = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
              const paid = items
                .filter((item) => item.is_paid === "true" || item.is_paid === true)
                .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
              const due = total - paid;

              return (
                <div className="row fw-bold align-items-center px-2 py-3 mt-3 border-top">
                  <div className="col-md-6 text-end">Total Amount:</div>
                  <div className="col-md-2">{formData.currency} {total.toFixed(2)}</div>
                  <div className="col-md-2 text-success">Paid: {formData.currency} {paid.toFixed(2)}</div>
                  <div className="col-md-2 text-danger">Due: {formData.currency} {due.toFixed(2)}</div>
                </div>
              );
            })()}


            <button type="button"
              className="btn border rounded px-3 py-1 mb-4 text-dark"
              onClick={addItem}
            >
              + Add Line Item
            </button>

            <div className="text-end mt-4">
              {/* <button type="button" className="btn btn-light me-2" onClick={() => navigate(-1)}>  Cancel</button>
            <button type="submit" className="btn btn-dark">
              Generate Invoice
            </button> */}
              <button type="submit" className="btn btn-success me-2">
                {existingDocId ? "Change Order" : "Save"}
              </button>
              {/* <button type="button" className="btn btn-dark" onClick={handleSignature}>
              Send Out For Signature
            </button> */}
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => handleSubmit(null, true)} // custom flag
              >
                Send Out For Signature
              </button>


            </div>
          </form>
        </div>
      </div>
      {/* Modal for PDF Preview */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>PDF Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pdfUrl ? (
            <iframe
              title="PDF Preview"
              src={pdfUrl}
              style={{ height: "600px", width: "100%", border: "none" }}
            />
          ) : (
            <p className="text-center text-muted">Generating PDF preview...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <div className="col-md-5"> */}
      <div className="card shadow-sm p-3">
        {/* <div className="d-flex justify-content-between align-items-center">
            <h6 className="fw-bold">PDF Preview</h6>
            <span className="text-muted">Page 1/1</span>
          </div> */}

        {/* {pdfUrl ? (
            <iframe
              title="PDF Preview"
              src={pdfUrl}
              style={{ height: "600px", width: "100%", border: "none", marginTop: "1rem" }}
            />
          ) : (
            <p className="text-center text-muted mt-4">Generating PDF preview...</p>
          )} */}

        {/* Hidden HTML content used for PDF generation */}
        <div
          ref={proposalRef}
          style={{
            position: "absolute",
            top: "-9999px",
            left: "-9999px",
            width: "800px", // Ensure fixed width for PDF consistency
            padding: "1rem",
            backgroundColor: "#fff",
          }}
        >
          <h5 className="text-center fw-bold border-bottom pb-2">Invoice</h5>
          <div className="row mb-3">
            <div className="col-6"><strong>PROJECT: </strong>
              {client?.contactPersons?.[0]?.jobTitle}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-6">
              <strong>TO: </strong>
              {client?.clientName}
            </div>
            <div className="col-6">
              <strong>DATE:</strong> {client?.updatedAt?.split("T")[0]}
            </div>
          </div>
          <p>
            We propose to furnish all materials, equipment, and labor, subject to any exclusions listed below,
            required to complete the following:
          </p>
          {signatureData?.line_items?.length > 0 ? (
            <table className="table table-bordered mt-3">
              <tbody>
                {signatureData.line_items.map((item, index) => {
                  const lineAmount = item.quantity * item.rate;
                  return (
                    <tr key={index}>
                      <td>{index + 1}.</td>
                      <td>{item.description}</td>
                      <td className="text-end">${lineAmount.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="2" className="text-end"><strong>Total Proposal Value:</strong></td>
                  <td className="text-end fw-bold">
                    $
                    {signatureData.line_items
                      .reduce((total, item) => total + item.quantity * item.rate, 0)
                      .toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-muted">No line items to show.</p>
          )}

          <p>
            The above price is valid for 30 days. <b>COMPANY NAME</b> agrees that they will enter into a standard AIA
            subcontract with General Contractor, and that basic provisions such as insurance and W-9 shall be in
            place prior to start.
          </p>
          <div className="row mt-5 align-items-end">
            <div className="col-6">
              <p><strong>Contractor:</strong> <u>Lalit Singh</u><br />
                <small>kiaan technology</small>
              </p>
            </div>
            <div className="col-6 text-end">
              <p><small>Date</small><br />7/2/2025</p>
            </div>
          </div>
          <p><strong>ACCEPTANCE OF PROPOSAL:</strong> The above prices, scope, specifications and conditions are satisfactory and hereby accepted. You are authorized to do the work specified.</p>
          <div className="row mt-4">
            <div className="col-6">
              <p><strong>ACCEPTED BY:</strong> _____________________________</p>
            </div>
            <div className="col-6">
              <p>______________________</p>
            </div>
          </div>
          <p className="text-center small mt-5">
            Address will come here
          </p>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

export default AddInvoice;
