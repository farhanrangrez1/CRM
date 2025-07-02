import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdateJobTracker() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '',
    industry: '',
    clientWebsite: '',
    clientAddress: '',
    vatNumber: '',
    csrCode: '',
    clientStatus: 'active',
    contactNumber: '',
    jobTitle: '',
    email: '',
    phone: '',
    department: '',
    salesRepresentative: '',
    billingAddress: '',
    billingContact: '',
    billingEmail: '',
    billingPhone: '',
    currency: 'USD',
    paymentMethod: 'bank_transfer',
    shippingAddress: '',
    shippingContact: '',
    shippingEmail: '',
    shippingPhone: '',
    shippingMethod: 'standard',
    specialInstruction: '',
    annualRevenue: '',
    creditRating: '',
    bankName: '',
    accountNumber: '',
    fiscalYearEnd: '',
    financialContact: '',
    accountCode: '',
    accountType: 'receivable',
    openingBalance: '',
    balanceDate: '',
    taxCategory: 'standard',
    costCenter: '',
    paymentTerms: 'net30',
    creditLimit: '',
    notes: '',
    jobNumber: '',
    brandName: '',
    subBrand: '',
    flavour: '',
    packType: '',
    packSize: '',
    packCode: '',
    priority: '',
    status: '',
    timeLogged: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace this with your actual API endpoint
      const apiUrl = 'http://localhost:5000/client/createClient';

      const res = await axios.post(apiUrl, formData);
      console.log('Client Submitted:', res.data);

      toast.success('Client created successfully!');

      setFormData({
        clientName: '',
        industry: '',
        clientWebsite: '',
        clientAddress: '',
        vatNumber: '',
        csrCode: '',
        clientStatus: 'active',
        contactNumber: '',
        jobTitle: '',
        email: '',
        phone: '',
        department: '',
        salesRepresentative: '',
        billingAddress: '',
        billingContact: '',
        billingEmail: '',
        billingPhone: '',
        currency: 'USD',
        paymentMethod: 'bank_transfer',
        shippingAddress: '',
        shippingContact: '',
        shippingEmail: '',
        shippingPhone: '',
        shippingMethod: 'standard',
        specialInstruction: '',
        annualRevenue: '',
        creditRating: '',
        bankName: '',
        accountNumber: '',
        fiscalYearEnd: '',
        financialContact: '',
        accountCode: '',
        accountType: 'receivable',
        openingBalance: '',
        balanceDate: '',
        taxCategory: 'standard',
        costCenter: '',
        paymentTerms: 'net30',
        creditLimit: '',
        notes: '',
        jobNumber: '',
        brandName: '',
        subBrand: '',
        flavour: '',
        packType: '',
        packSize: '',
        packCode: '',
        priority: '',
        status: '',
        timeLogged: '',
      });

      setTimeout(() => {
        navigate('/admin/clientManagement');
      }, 1000);
    } catch (err) {
      console.error('Submit Error:', err);
      toast.error('Failed to create client.');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container mt-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h1 className="card-title h4 mb-4">Update Jobs</h1>
            <form className="row g-3" onSubmit={handleSubmit}>
              {/* Job Details Section */}
              <h5 className="mb-3 mt-4">Job Details</h5>
              {/* <div className="col-md-6">
                <label className="form-label">Job #</label>
                <input type="text" className="form-control" name="jobNumber" value={formData.jobNumber} onChange={handleChange} />
              </div> */}
              <div className="col-md-6">
               <label className="form-label">Project Name</label>
               <select className="form-control border-bold">
                    <option value="">Select project</option>
                    <option value="project1">Project 1</option>
             <option value="project2">Project 2</option>
    <option value="project3">Project 3</option>
    {/* Add more options as needed */}
  </select>
</div>
              <div className="col-md-6">
                <label className="form-label">Brand Name</label>
                <input type="text" className="form-control" name="brandName" value={formData.brandName} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Sub Brand</label>
                <input type="text" className="form-control" name="subBrand" value={formData.subBrand} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Flavour</label>
                <input type="text" className="form-control" name="flavour" value={formData.flavour} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Pack Type</label>
                <input type="text" className="form-control" name="packType" value={formData.packType} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Pack Size</label>
                <input type="text" className="form-control" name="packSize" value={formData.packSize} onChange={handleChange} />
              </div>
              {/* <div className="col-md-6">
                <label className="form-label">Pack Code</label>
                <input type="text" className="form-control" name="packCode" value={formData.packCode} onChange={handleChange} />
              </div> */}
              <div className="col-md-6">
                <label className="form-label">Priority</label>
                <select className="form-select" name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Time Logged (in hours)</label>
                <input type="number" className="form-control" name="timeLogged" value={formData.timeLogged} onChange={handleChange} />
              </div>

              {/* Submit Buttons */}
              <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary">Cancel</button>
                <button id='All_btn' type="submit" className="btn btn-dark">Create Client</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateJobTracker;
