

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
import { apiUrl } from "../../../redux/utils/config";

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

  useEffect(() => {
    const fetchemailproposalbyid = (id) => {
      const response = axios.get(`${apiUrl}/getEnvelopesByProjectId/${id}`);
    }
    if (invoice?._id) {
      fetchemailproposalbyid(invoice?._id);
    }
  }, [invoice?._id])


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

  // const [items, setItems] = useState([{ description: "", quantity: 0, rate: 0, amount: 0, is_paid: "false" }]);
  const [items, setItems] = useState([
    { description: "", quantity: 0, rate: 0, amount: 0, is_paid: "false", subClientId: "", amount_paid: 0, amount_due: 0, status: 'pending', isNew: true }
  ]);

  const [subClients, setSubClients] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/subClient`) // 🔁 Update this URL if needed
      .then(res => setSubClients(res.data.data))
      .catch(err => toast.error("Failed to fetch subclients"));
  }, []);


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

  //   // Update the field value
  //   if (field === 'is_paid') {
  //     newItems[index][field] = value === true ? "true" : "false";
  //   } else {
  //     newItems[index][field] = value;
  //   }

  //   // Recalculate amount if quantity or rate changes
  //   if (field === 'quantity' || field === 'rate') {
  //     const quantity = field === 'quantity' ? Number(value) : Number(newItems[index].quantity);
  //     const rate = field === 'rate' ? Number(value) : Number(newItems[index].rate);
  //     newItems[index].amount = calculateAmount(quantity, rate);
  //   }

  //   setItems(newItems);

  //   // 🟡 Only update the last row in localStorage
  //   const existingItems = JSON.parse(localStorage.getItem("lineItems")) || [];

  //   if (index === items.length - 1) {
  //     // It's the last row — update it
  //     existingItems[existingItems.length - 1] = newItems[index];
  //     localStorage.setItem("lineItems", JSON.stringify(existingItems));
  //   }
  // };

  // const handleItemChange = (index, field, value) => {
  //   const newItems = [...items];
  //   if (field === 'is_paid') {
  //     newItems[index][field] = value === true ? "true" : "false";
  //   } else if (field === 'amount_paid') {
  //     newItems[index][field] = parseFloat(value) || 0;
  //   } else {
  //     newItems[index][field] = value;
  //   }

  //   // Update amount when quantity or rate changes
  //   if (field === 'quantity' || field === 'rate') {
  //     const quantity = field === 'quantity' ? Number(value) : Number(newItems[index].quantity);
  //     const rate = field === 'rate' ? Number(value) : Number(newItems[index].rate);
  //     newItems[index].amount = calculateAmount(quantity, rate);
  //   }

  //   setItems(newItems);

  //   if (index === items.length - 1) {
  //     const existingItems = JSON.parse(localStorage.getItem("lineItems")) || [];
  //     existingItems[existingItems.length - 1] = newItems[index];
  //     localStorage.setItem("lineItems", JSON.stringify(existingItems));
  //   }
  // };


  // const handleItemChange = (index, field, value) => {
  //   const newItems = [...items];
  //   if (field === 'is_paid') {
  //     newItems[index][field] = value === true ? "true" : "false";
  //   } else if (field === 'amount_paid') {
  //     newItems[index][field] = parseFloat(value) || 0;
  //   } else {
  //     newItems[index][field] = value;
  //   }

  //   // Update amount and amount_due when quantity, rate, or amount_paid changes
  //   if (field === 'quantity' || field === 'rate') {
  //     const quantity = field === 'quantity' ? Number(value) : Number(newItems[index].quantity);
  //     const rate = field === 'rate' ? Number(value) : Number(newItems[index].rate);
  //     newItems[index].amount = calculateAmount(quantity, rate);
  //   }

  //   // Calculate amount_due
  //   newItems[index].amount_due = newItems[index].amount - newItems[index].amount_paid;

  //   setItems(newItems);

  //   if (index === items.length - 1) {
  //     const existingItems = JSON.parse(localStorage.getItem("lineItems")) || [];
  //     existingItems[existingItems.length - 1] = newItems[index];
  //     localStorage.setItem("lineItems", JSON.stringify(existingItems));
  //   }
  // };




  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === 'is_paid') {
      newItems[index][field] = value === true ? "true" : "false";
    } else if (field === 'amount_paid') {
      newItems[index][field] = parseFloat(value) || 0;
    } else {
      newItems[index][field] = value;
    }

    // Auto-calculate amount_due if quantity or rate changes
    if (field === "quantity" || field === "rate") {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const rate = parseFloat(newItems[index].rate) || 0;
      newItems[index].amount = quantity * rate;
      newItems[index].amount_due = newItems[index].amount - (parseFloat(newItems[index].amount_paid) || 0);
    }

    // Auto-update is_paid based on amount_paid
    if (field === "amount_paid") {
      const paid = parseFloat(value) || 0;
      newItems[index].amount_paid = paid;
      const totalAmount = parseFloat(newItems[index].amount) || 0;
      newItems[index].amount_due = totalAmount - paid;
      newItems[index].is_paid = paid > 0;
    }

    setItems(newItems);

    if (index === items.length - 1) {
      const existingItems = JSON.parse(localStorage.getItem("lineItems")) || [];
      existingItems[existingItems.length - 1] = newItems[index];
      localStorage.setItem("lineItems", JSON.stringify(existingItems));
    }
  };


  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const addItem = () => {
    const newItem = { description: "", quantity: 0, rate: 0, amount: 0, is_paid: "false", amount_paid: 0, amount_due: 0, status: 'pending', isNew: true };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);

    // Only store the newly added item (not entire array)
    const existingItems = JSON.parse(localStorage.getItem("lineItems")) || [];
    const newStorageItems = [...existingItems, newItem];
    localStorage.setItem("lineItems", JSON.stringify(newStorageItems));
  };


  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);

    // Update localStorage as well
    const existingItems = JSON.parse(localStorage.getItem("lineItems")) || [];
    if (index >= 0 && index < existingItems.length) {
      existingItems.splice(index, 1);
    }
    localStorage.setItem("lineItems", JSON.stringify(existingItems));
  };


  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;


  const handleSubmit = async (e, isSignatureFlow = false) => {
    if (e) e.preventDefault();

    // 🔐 Signature Flow
    if (isSignatureFlow) {
      const fullPayload = {
        ...invoice,
        ...formData,
        // line_items: items,
        line_items: items.map(({ isNew, ...rest }) => rest),
      };
      localStorage.setItem("SignatureData", JSON.stringify(fullPayload));
      onInvoiceComplete(); // Proceed to signature
    } else {
      const payload = {
        ...formData,
        // line_items: items,
        client_id: invoice?.clientId?._id,
        line_items: items.map(({ isNew, ...rest }) => rest),
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
        // const totalAmount = items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        // const totalPaid = items
        //   .filter((item) => item.is_paid === "true" || item.is_paid === true)
        //   .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        // const totalDue = totalAmount - totalPaid;

        const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        const totalPaid = items.reduce((sum, item) => sum + (parseFloat(item.amount_paid) || 0), 0);
        const totalDue = items.reduce((sum, item) => sum + (parseFloat(item.amount_due) || 0), 0);


        // 🔄 Update the project after document is created/updated

        if (invoice?.status == "Lead") {
          const projectUpdatePayload = {
            lineItems: items, // camelCase to match your earlier invoice data
            paid: totalPaid.toFixed(2),
            due: totalDue.toFixed(2),
            status: 'Bidding'
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

        } else {
          const projectUpdatePayload = {
            lineItems: items, // camelCase to match your earlier invoice data
            paid: totalPaid.toFixed(2),
            due: totalDue.toFixed(2)
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
        }

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
    const clientId = formData.client_id;

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
  }, [formData?.client_id, Clients]);

  const generatePDF = async () => {
    const element = proposalRef.current;
    if (!element || !items?.length) return;

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


  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const handleShow = () => {
    setShowModal(true);
    generatePDF();
  }; // Function to show modal
  const handleClose = () => setShowModal(false); // Function to close modal

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);


  return (
    <>
      <ToastContainer />
      <div className="container-fluid p-4" style={{ backgroundColor: "white", borderRadius: "10px" }}>
        <div className="d-flex justify-content-end align-items-center mb-4">
          <Button variant="primary" onClick={handleShow}>
            Summary
          </Button>
        </div>

        <div className="">
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



            </div>

            <h6 className="fw-semibold mb-3">Line Items</h6>
            <div className="row fw-semibold text-muted mb-2 px-2">
              <div className="col-md-1">OrderNo.</div>
              {/* <div className="col-md-2">SubClients</div> */}
              <div className="col-md-2">Description</div>
              <div className="col-md-1">Quantity</div>
              <div className="col-md-1">Rate</div>
              <div className="col-md-2">Amount</div>
              <div className="col-md-1">Amount Paid</div>
              <div className="col-md-1">Amount Due</div>
              <div className="col-md-1">Status</div>
              <div className="col-md-1">Is Paid</div>
              <div className="col-md-1 text-end">Action</div>
            </div>

            {items.map((item, index) => (
              <div
                className="row gx-2 gy-2 align-items-center mb-2 px-2 py-2"
                key={index}
                // style={{ background: "#f9f9f9", borderRadius: "8px" }}
                style={{
                  background: `${(item.status || "pending") === "approved" ? "#7EEE86FF" : "#f9f9f9"}`,
                  borderRadius: "8px"
                }}
              >
                <div className="col-md-1">
                  <input
                    type="text"
                    className="form-control"
                    value={index + 1}
                    readOnly
                  />
                </div>
                {/* <div className="col-md-2">
                  <select
                    className="form-select"
                    value={item.subClientId}
                    onChange={(e) => handleItemChange(index, "subClientId", e.target.value)}
                    disabled={!item.isNew}
                  >
                    <option value="">Select Subclient</option>
                    {subClients.filter((item) => item?.clientId?._id === formData.client_id).map((sc) => (
                      <option key={sc._id} value={sc._id}>
                        {sc.subClientName}
                      </option>
                    ))}
                  </select>
                </div> */}
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    readOnly={!item.isNew}
                  />
                </div>
                <div className="col-md-1">
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                    readOnly={!item.isNew}
                  />
                </div>
                <div className="col-md-1">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, "rate", parseFloat(e.target.value) || 0)}
                    className="form-control"
                    readOnly={!item.isNew}
                  />
                </div>
                <div className="col-md-2">
                  <span>
                    {formData.currency} {formatCurrency(item.amount.toFixed(2))}
                  </span>
                </div>
                <div className="col-md-1">
                  <input
                    type="number"
                    className="form-control"
                    value={item.amount_paid}
                    onChange={(e) => handleItemChange(index, "amount_paid", e.target.value)}
                    readOnly={!item.isNew}
                  />
                </div>
                <div className="col-md-1">
                  <span>
                    {formData.currency} {formatCurrency(item?.amount_due?.toFixed(2) || 0)}
                  </span>
                </div>
                <div className="col-md-1">
                  <span>
                    {(item?.status || 'pending')}
                  </span>
                </div>
                <div className="col-md-1">
                  <input
                    type="checkbox"
                    checked={item.is_paid === "true" || item.is_paid === true}
                    onChange={(e) => handleItemChange(index, "is_paid", e.target.checked)}
                    className="form-check-input"
                    disabled={!item.isNew}
                  />
                </div>
                {item.isNew && <div className="col-md-1 text-end">
                  <button
                    type="button"
                    className="btn btn-link text-danger p-0"
                    onClick={() => removeItem(index)}
                  >
                    remove
                  </button>
                </div>}
              </div>
            ))}

            {/* ✅ Summary Row */}
            {items.length > 0 && (() => {
              const total = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
              const paid = items.reduce((sum, item) => sum + (parseFloat(item.amount_paid) || 0), 0);
              const due = items.reduce((sum, item) => sum + (parseFloat(item.amount_due) || 0), 0);

              return (
                <div className="row fw-bold align-items-center px-2 py-3 mt-3 border-top">
                  <div className="col-md-6 text-end">Total Amount:</div>
                  <div className="col-md-2">{formData.currency} {formatCurrency(total.toFixed(2))}</div>
                  <div className="col-md-2 text-success">Paid: {formData.currency} {formatCurrency(paid.toFixed(2))}</div>
                  <div className="col-md-2 text-danger">Due: {formData.currency} {formatCurrency(due.toFixed(2))}</div>
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

              <button type="submit" className="btn btn-success me-2">
                {existingDocId ? "Change Order" : "Save"}
              </button>
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
          {items?.length > 0 ? (
            <table className="table table-bordered mt-3">
              <tbody>
                {items.map((item, index) => {
                  const matchedSubClient = subClients?.find(
                    (sc) => sc?._id?.toString() == item?.subClientId?.toString()
                  );
                  const lineAmount = item.quantity * item.rate;
                  return (
                    <tr key={index}>
                      <td>{index + 1}.</td>
                      <td>
                        {matchedSubClient?.subClientName || '-'}
                      </td>
                      <td>{item.description}</td>
                      <td className="text-end">${item?.amount_paid?.toFixed(2) || 0}</td>
                      <td className="text-end">${item?.amount_due?.toFixed(2)}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="2" className="text-end"><strong>Total Proposal Value:</strong></td>
                  <td className="text-end fw-bold">
                    $
                    {items
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
