import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { fetchProject } from "../../../redux/slices/ProjectsSlice";
import { fetchjobs } from "../../../redux/slices/JobsSlice";

function AddIssuablePurchase() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([
    { description: "", quantity: 0, unitPrice: 0, total: 0 },
  ]);
  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    deliveryDate: "",
    deliveryInfo: "",
    issueDate: "",
    currency: "USD",
    vat: 0
  });

  const currencies = [
    { value: "USD", label: "US Dollar" },
    { value: "EUR", label: "Euro" },
    { value: "GBP", label: "British Pound" },
    { value: "INR", label: "Indian Rupee" },
    { value: "JPY", label: "Japanese Yen" }
  ];

  const calculateTotal = (quantity, rate) => quantity * rate;

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].total = calculateTotal(
      parseFloat(newItems[index].quantity || 0),
      parseFloat(newItems[index].unitPrice || 0)
    );
    setItems(newItems);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 0, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        clientId: parseInt(formData.clientId),
        projectId: parseInt(formData.projectId),
        vat: parseFloat(formData.vat || 0),
        items: items.map(item => ({
          ...item,
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice.toString(),
          total: item.total.toFixed(2)
        }))
      };

      const res = await axios.post(
        payload
      );

      toast.success("Purchase created successfully!");
      setFormData({
        clientId: "",
        projectId: "",
        deliveryDate: "",
        deliveryInfo: "",
        issueDate: "",
        currency: "USD",
        vat: 0
      });
      setItems([{ description: "", quantity: 0, unitPrice: 0, total: 0 }]);

      setTimeout(() => {
        navigate("/admin/IssuablePurchase");
      }, 1000);

    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Failed to create purchase!");
    }
  };
// /
  const { project } = useSelector((state) => state.projects);
  const { job } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchProject());
    dispatch(fetchjobs());
  }, [dispatch]);

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = (subtotal * parseFloat(formData.vat || 0)) / 100;
  const grandTotal = subtotal + vatAmount;

  return (
    <>
      <ToastContainer />
      <div className="container py-4">
        <h5 className="fw-semibold mb-4">New Purchase Order</h5>
        <div className="bg-white border rounded-3 p-4 shadow-sm">

          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Issuable Po</label>
              <select
                className="form-select"
                name="clientId"
                value={formData.clientId}
                onChange={handleFormChange}
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Currency</label>
              <select
                className="form-select"
                name="currency"
                value={formData.currency}
                onChange={handleFormChange}
                required
              >
                <option value="">Select Currency</option>
                {currencies.map((curr) => (
                  <option key={curr.value} value={curr.value}>
                    {curr.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Project ID</label>
              <input
                type="number"
                className="form-control"
                name="projectId"
                value={formData.projectId}
                onChange={handleFormChange}
                placeholder="Enter project ID"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">VAT (%)</label>
              <input
                type="number"
                className="form-control"
                name="vat"
                value={formData.vat}
                onChange={handleFormChange}
                placeholder="Enter VAT percentage"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <label className="form-label">Delivery Date</label>
              <input
                type="date"
                className="form-control"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleFormChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Delivery Info</label>
              <input
                type="text"
                className="form-control"
                name="deliveryInfo"
                value={formData.deliveryInfo}
                onChange={handleFormChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Issue Date</label>
              <input
                type="date"
                className="form-control"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <h6 className="fw-semibold mb-3">Line Items</h6>
          {items.map((item, index) => (
            <div className="row gx-2 align-items-center mb-2" key={index}>
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value))}
                />
              </div>
              <div className="col-md-2">
                <span>${item.total.toFixed(2)}</span>
              </div>
              <div className="col-md-1 text-end">
                <button className="btn btn-link text-danger p-0" onClick={() => removeItem(index)}>
                  remove
                </button>
              </div>
            </div>
          ))}

          <button
            className="btn btn-outline-secondary mb-3"
            onClick={addItem}
          >
            + Add Item
          </button>

          <div className="mt-4">
            <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
            <p><strong>VAT ({formData.vat || 0}%):</strong> ${vatAmount.toFixed(2)}</p>
            <h6><strong>Grand Total:</strong> ${grandTotal.toFixed(2)}</h6>
          </div>

          <div className="text-end">
            <button className="btn btn-secondary me-2">Cancel</button>
            <button className="btn "id="All_btn" onClick={handleSubmit}>
              Submit Purchase
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddIssuablePurchase;