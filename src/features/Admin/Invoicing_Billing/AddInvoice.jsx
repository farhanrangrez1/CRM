import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { createCostEstimate, updateCostEstimate } from "../../../redux/slices/costEstimatesSlice";
import { fetchProject } from "../../../redux/slices/ProjectsSlice";
import { fetchClient } from "../../../redux/slices/ClientSlice";
import { createInvoicingBilling, updateInvoicingBilling } from "../../../redux/slices/InvoicingBillingSlice";

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

function AddInvoice() {
  const location = useLocation();
  const invoice = location.state?.invoice;
  const id = invoice?._id;
  console.log("hhel", invoice);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { project } = useSelector((state) => state.projects);
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

  const [items, setItems] = useState([{ description: "", quantity: 0, rate: 0, amount: 0 }]);

  const [formData, setFormData] = useState({
    clientId: "",
    projectsId: [""],
    CostEstimatesId: "",
    ReceivablePurchaseId: "",
    date: "",
    status: "",
    currency: "",
    document: "",
    output: "",
  });

  useEffect(() => {
    if (invoice && project?.data?.length) {
      setFormData((prev) => ({
        ...prev,
        clientId: invoice.clientId || "",
        CostEstimatesId: invoice.CostEstimatesId || "",
        ReceivablePurchaseId: invoice.ReceivablePurchaseId || "",
        projectsId: invoice.projectId ? [invoice.projectId] : [""],
        status: invoice.status && statuses.includes(invoice.status) ? invoice.status : "Active",
        Notes: invoice.Notes || "",
        currency: invoice.currency || "",
        date: invoice.date ? invoice.date.substring(0, 10) : "",
        validUntil: invoice.validUntil ? invoice.validUntil.substring(0, 10) : "",
      }));

      if (Array.isArray(invoice.lineItems) && invoice.lineItems.length > 0) {
        setItems(invoice.lineItems);
      }
    }
  }, [invoice, project?.data]);


  const [taxRate, setTaxRate] = useState(0.05);

  const calculateAmount = (quantity, rate) => quantity * rate;

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].amount = calculateAmount(newItems[index].quantity, newItems[index].rate);
    setItems(newItems);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 0, rate: 0, amount: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      VATRate: taxRate * 100,
      lineItems: items,
    };

    const isDuplicate = location.state?.isDuplicate;
    if (isDuplicate || !id) {
      dispatch(createInvoicingBilling(payload))
        .unwrap()
        .then(() => {
          toast.success("Estimates created successfully!");
          navigate("/admin/Invoicing_Billing", { state: { openTab: "jobs" } });
        })
        .catch(() => {
          toast.error("Failed to create estimates");
        });
    } else {
      dispatch(updateInvoicingBilling({ id, data: payload }))
        .unwrap()
        .then(() => {
          toast.success("Estimates updated successfully!");
          navigate("/admin/Invoicing_Billing", { state: { openTab: "jobs" } });
        })
        .catch(() => {
          toast.error("Failed to update estimates");
        });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid p-4" style={{ backgroundColor: "white", borderRadius: "10px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Generate New Invoice</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-4 mb-3">
              <label className="form-label">Client</label>
              <select
                className="form-select"
                name="clientId"
                value={formData.clientId || ""}
                disabled
              >
                {Clients?.data
                  ?.filter((client) => client._id === formData.clientId)
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
                name="projectsId"
                value={formData.projectsId[0] || ""}
                disabled>
                {project?.data
                  ?.filter((proj) => proj._id === formData.projectsId[0])
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
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                required
                value={formData.date}
                onChange={handleFormChange}
              />
            </div>

            <div className="col-md-4 mb-3">
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

            </div>

            <div className="col-md-4 mb-3">
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

            </div>

            <div className="col-md-4 mb-3">
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

            </div>

            <div className="col-md-4 mb-3">
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

            </div>
          </div>

          <h6 className="fw-semibold mb-3">Line Items</h6>
          {items.map((item, index) => (
            <div
              className="row gx-2 gy-2 align-items-center mb-2 px-2 py-2"
              key={index}
              style={{ background: "#f9f9f9", borderRadius: "8px" }}
            >
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Item description"
                  required
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  required
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  required
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, "rate", parseFloat(e.target.value))}
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <span>
                  {formData.currency} {item.amount.toFixed(2)}
                </span>
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
          ))}

          <button type="button"
            className="btn border rounded px-3 py-1 mb-4 text-dark"
            onClick={addItem}
          >
            + Add Line Item
          </button>

          <div className="text-end mt-4">
            <button type="button" className="btn btn-light me-2" onClick={() => navigate(-1)}>  Cancel</button>
            <button type="submit" className="btn btn-dark">
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddInvoice;
