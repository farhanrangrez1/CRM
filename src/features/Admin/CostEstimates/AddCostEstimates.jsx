import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { createCostEstimate, updateCostEstimate } from "../../../redux/slices/costEstimatesSlice";
import { fetchProject } from "../../../redux/slices/ProjectsSlice";
import { fetchClient } from "../../../redux/slices/ClientSlice";
import ProposalEmailUI from "../LeadFlow/ProposalEmailUI";

const currencies = [
  { label: "USD - US Dollar", value: "USD" },
  { label: "EUR - Euro", value: "EUR" },
  { label: "INR - Indian Rupee", value: "INR" },
  { label: "GBP - British Pound", value: "GBP" },
  { label: "JPY - Japanese Yen", value: "JPY" },
  { label: "AED - UAE Dirham", value: "AED" },
  { label: "SAR - Saudi Riyal", value: "SAR" },
];

// const poStatuses = ["PO Status", "Approved", "pending", "Rejected"];
const statuses = ["Status Select", "Active", "Inactive", "Completed", "pending"];

function AddCostEstimates() {
  const location = useLocation();
  const po = location.state?.po;
  const projectID = location.state?.projectID;
  const id = po?._id;
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
      const foundProject = project.data.find(p => p._id === Clients);
      if (foundProject) {
        setFormData(prev => ({
          ...prev,
          projectId: foundProject._id,
        }));
      }
    }
  }, [Clients, project]);

  useEffect(() => {
    dispatch(fetchClient());
  }, [dispatch]);

  const [items, setItems] = useState([
    { description: "", quantity: 0, rate: 0, amount: 0 },
  ]);

  const [formData, setFormData] = useState({
    clientId: [""],
    projectId: [""],
    estimateDate: "",
    validUntil: "",
    Notes: "",
    currency: "USD",
    // POStatus: "",
    Status: "Lead",
  });

  useEffect(() => {
    if (projectID && project?.data?.length > 0) {
      const selectedProject = project.data.find(p => p._id === projectID);
      if (selectedProject) {
        const newFormData = {
          ...formData,
          projectId: [projectID],
          projectName: selectedProject.projectName,
          clientId: [selectedProject.clientId._id],
          clientName: selectedProject.clientId.clientName,
          estimateDate: new Date().toISOString().split('T')[0],
          validUntil: selectedProject.endDate ? selectedProject.endDate.split('T')[0] : "",
          currency: selectedProject.currency || "USD",
          Notes: selectedProject.description || "",
          Status: "Active"
        };

        const lineItems = selectedProject.lineItems.length > 0
          ? selectedProject.lineItems
          : [{ description: "", quantity: 0, rate: 0, amount: 0 }];

        setFormData(newFormData);
        setItems(lineItems);

        const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
        const taxRate = 0.05;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        const invoiceData = {
          ...selectedProject,
          lineItems,
          taxRate,
          subtotal,
          tax,
          total
        };

        localStorage.setItem("invoice", JSON.stringify(invoiceData));
        localStorage.setItem("proposalId", projectID);
      }
    }
  }, [projectID, project?.data]);

  useEffect(() => {
    if (po && project?.data?.length) {
      let projectId = '';
      if (Array.isArray(po.projectId) && po.projectId.length > 0) {
        projectId = po.projectId[0]._id;
      } else if (Array.isArray(po.projects) && po.projects.length > 0) {
        projectId = po.projects[0]?.projectId || po.projects[0]?._id || "";
      }

      let clientId = "";
      let clientName = "";
      if (po.clientId && Array.isArray(po.clientId) && po.clientId.length > 0) {
        clientId = po.clientId[0]._id || "";
        clientName = po.clientId[0].clientName || "";
      } else if (Array.isArray(po.clients) && po.clients.length > 0) {
        clientId = po.clients[0]?.clientId || "";
        const clientObj = Clients?.data?.find(c => c._id === clientId);
        clientName = clientObj ? clientObj.clientName : "";
      }

      setFormData((prev) => ({
        ...prev,
        ...po,
        projectId: projectId ? [projectId] : [""],
        clientId: clientId ? [clientId] : [""],
        clientName: clientName,
        Notes: po.Notes || "",
        currency: po.currency || "USD",
        estimateDate: po.estimateDate ? po.estimateDate.substring(0, 10) : "",
        validUntil: po.validUntil ? po.validUntil.substring(0, 10) : "",
      }));

      if (Array.isArray(po.lineItems) && po.lineItems.length > 0) {
        setItems(po.lineItems);
      }
    }
  }, [po, project?.data, Clients]);

  const [taxRate, setTaxRate] = useState(0.05);

  const calculateAmount = (quantity, rate) => quantity * rate;

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].amount = calculateAmount(
      newItems[index].quantity,
      newItems[index].rate
    );
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
      dispatch(createCostEstimate(payload))
        .unwrap()
        .then(() => {
          toast.success("Estimates created successfully!");
          // navigate('/admin/CostEstimates'); // Go back to previous page
          navigate('/admin/LeadFlow'); // Go back to previous page
          // navigate(-1); // Go back to previous page
        })
        .catch(() => {
          toast.error("Failed to create estimates");
        });
    } else {
      dispatch(updateCostEstimate({ id, data: payload }))
        .unwrap()
        .then(() => {
          toast.success("Estimates updated successfully!");
          navigate(-1); // Go back to previous page
        })
        .catch(() => {
          toast.error("Failed to update estimates");
        });
    }
  };
  const [showAddInvoice, setShowAddInvoice] = useState(true);
  const [invoice, setInvoice] = useState(null);
  useEffect(() => {
    const storedInvoice = localStorage.getItem("invoice");
    if (storedInvoice) {
      setInvoice(JSON.parse(storedInvoice));
    }
  }, []);

  const handleSignature = () => {
    // then call the callback
    const payload = {
      ...invoice,
      ...formData,
      line_items: items,
    };

    localStorage.setItem("SignatureData", JSON.stringify(payload));
    setShowAddInvoice(false);
  };

  return (
    <>
      <ToastContainer />
      <div className="container py-4">
        {/* <h4 className="fw-bold mb-4">Cost Estimates</h4> */}
        <div className="bg-white border rounded-3 p-4 shadow-sm">
          {/* <h4 className="fw-semibold mb-4">Create New Estimate</h4> */}
          <h4 className="fw-semibold mb-4">Create New Proposal</h4>

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-4 mb-3">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <label class="form-label mb-0 fw-bold">Client</label>
                  <Link to={"/admin/AddClientManagement"}><button class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1">
                    + Create
                  </button></Link>
                </div>
                <select
                  className="form-select"
                  name="clientId"
                  value={formData.clientId[0] || ""}
                  onChange={(e) => {
                    const selectedClientId = e.target.value;
                    const selectedClient = Clients?.data?.find(c => c._id === selectedClientId);

                    setFormData({
                      ...formData,
                      clientId: [selectedClientId],
                      clientName: selectedClient ? selectedClient.clientName : "",
                    });
                  }}
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
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <label class="form-label mb-0 fw-bold">Project</label>
                  <Link to={"/admin/AddProjectList"}><button class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1">
                    + Create
                  </button></Link>
                </div>
                {/* <select
                  className="form-select"
                  name="projectId"
                  value={formData.projectId[0] || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedProject = project?.data?.find(p => p._id === selectedId);
                    setFormData({
                      ...formData,
                      projectId: [selectedId],
                      projectName: selectedProject?.projectName || "",
                    });
                    localStorage.setItem("invoice", JSON.stringify(selectedProject));
                  }}
                  required
                >
                  <option value="">Select a project</option>
                  {reversedProjectList.map((proj) => (
                    <option key={proj._id} value={proj._id}>
                      {proj.projectName}
                    </option>
                  ))}
                </select> */}
                <select
                  className="form-select"
                  name="projectId"
                  value={formData.projectId[0] || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedProject = project?.data?.find(p => p._id === selectedId);

                    // Always update the proposalId in localStorage
                    localStorage.setItem("proposalId", selectedId);

                    if (selectedProject) {
                      const newFormData = {
                        ...formData,
                        projectId: [selectedId],
                        projectName: selectedProject.projectName,
                        clientId: [selectedProject.clientId._id],
                        clientName: selectedProject.clientId.clientName,
                        estimateDate: new Date().toISOString().split('T')[0],
                        validUntil: selectedProject.endDate ? selectedProject.endDate.split('T')[0] : "",
                        currency: selectedProject.currency || "USD",
                        Notes: selectedProject.description || "",
                        Status: "Active"
                      };

                      // const lineItems = selectedProject.budgetAmount
                      //   ? [{
                      //     description: `${selectedProject.projectName} Project Budget`,
                      //     quantity: 1,
                      //     rate: parseFloat(selectedProject.budgetAmount),
                      //     amount: parseFloat(selectedProject.budgetAmount)
                      //   }]
                      //   : [{
                      //     description: "",
                      //     quantity: 0,
                      //     rate: 0,
                      //     amount: 0
                      //   }];
                      // Set line items from the selected project
                      const lineItems = selectedProject.lineItems.length > 0
                        ? selectedProject.lineItems
                        : [{ description: "", quantity: 0, rate: 0, amount: 0 }];

                      setFormData(newFormData);
                      setItems(lineItems);

                      const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
                      const taxRate = 0.05;
                      const tax = subtotal * taxRate;
                      const total = subtotal + tax;

                      const invoiceData = {
                        ...selectedProject,
                        lineItems,
                        taxRate,
                        subtotal,
                        tax,
                        total
                      };

                      localStorage.setItem("invoice", JSON.stringify(invoiceData));
                    }
                  }}
                  required
                >
                  <option value="">Select a project / Create Project</option>
                  {reversedProjectList
                    .filter(list => list.status === "Lead" || list.status === "lead")
                    .map(proj => (
                      <option key={proj._id} value={proj._id}>
                        {proj.projectName} {proj.projectNo ? `(${proj.projectNo})` : ''}
                      </option>
                    ))}
                </select>

              </div>

              {/* <div className="col-md-4 mb-3">
                <label className="form-label">Estimate Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="estimateDate"
                  value={formData.estimateDate}
                  onChange={handleFormChange}
                  required
                />
              </div> */}

              {/* <div className="col-md-4 mb-3">
                <label className="form-label">Valid Until</label>
                <input
                  type="date"
                  className="form-control"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleFormChange}
                  required
                />
              </div> */}

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
                    <option key={curr.value} value={curr.value}>
                      {curr.label}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* <div className="col-md-4 mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="Status"
                  value={formData.Status}
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

            <h6 className="fw-semibold mb-3">Line Items</h6>
            <div className="row fw-semibold text-muted mb-2 px-2">
              <div className="col-md-5">Description</div>
              <div className="col-md-2">Quantity</div>
              <div className="col-md-2">Rate</div>
              <div className="col-md-2">Amount</div>
              <div className="col-md-1 text-end"></div>
            </div>

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
                    value={item.description}
                    required
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity}
                    required
                    onChange={(e) =>
                      handleItemChange(index, "quantity", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    value={item.rate}
                    required
                    onChange={(e) =>
                      handleItemChange(index, "rate", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="col-md-2">
                  <span>
                    {formData.currency} {item.amount.toFixed(2)}
                  </span>
                </div>
                <div className="col-md-1 text-end">
                  <button
                    className="btn btn-link text-danger p-0"
                    onClick={() => removeItem(index)}
                    type="button"
                  >
                    remove
                  </button>
                </div>
              </div>
            ))}

            <button
              className="btn border rounded px-3 py-1 mb-4 text-dark"
              onClick={addItem}
              type="button"
            >
              + Add Line Item
            </button>

            <div className="row mt-4">
              {/* <div className="col-md-6">
                <label className="form-label">VAT Rate (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={(taxRate * 100).toFixed(2)}
                  onChange={(e) =>
                    setTaxRate(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value) / 100)
                  }
                  required
                />
                <div className="mt-3">
                  Subtotal: {formData.currency} {subtotal.toFixed(2)}<br />
                  VAT: {formData.currency} {tax.toFixed(2)}<br />
                  <strong>Total: {formData.currency} {total.toFixed(2)}</strong>
                </div>
              </div> */}
              <div className="col-md-6">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="Notes"
                  value={formData.Notes}
                  onChange={handleFormChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="text-end mt-4 d-flex gap-2 justify-content-end" >
              <button
                className="btn btn-light me-2"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button className="btn btn-dark" type="submit">
                Save Draft
              </button>
              <button type="button" className="btn btn-dark" onClick={handleSignature}>
                Send Out For Signature
              </button>
              {/* <button className="btn btn-dark" type="submit">
                Create Estimate
              </button> */}
            </div>
          </form>
        </div>

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
              <ProposalEmailUI />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AddCostEstimates;
