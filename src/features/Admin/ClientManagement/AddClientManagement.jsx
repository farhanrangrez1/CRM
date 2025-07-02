import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { createClients, fetchClient, UpdateClients } from '../../../redux/slices/ClientSlice';
import "react-toastify/dist/ReactToastify.css";

// Add this function to format date for input fields
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

function AddClientManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // for edit mo
  const location = useLocation();
  const { client } = location.state || {};
  const _id = client?._id
  console.log("oo", _id);
  
  // Initial form state
  const [formData, setFormData] = useState({
    clientName: '',
    industry: '',
    website: '',
    clientAddress: '',
    TaxID_VATNumber: '',
    CSRCode: '',
    Status: ''
  });

  // Contact persons state
  const [contactPersons, setContactPersons] = useState([
    {
      contactName: '',
      jobTitle: '',
      email: '',
      phone: '',
      department: '',
      salesRepresentative: ''
    }
  ]);

  // Billing information state
  const [billingInformation, setBillingInformation] = useState([
    {
      billingAddress: '',
      billingContactName: '',
      billingEmail: '',
      billingPhone: '',
      currency: '',
      preferredPaymentMethod: ''
    }
  ]);
  // Shipping information state
  const [shippingInformation, setShippingInformation] = useState([
    {
      shippingAddress: '',
      shippingContactName: '',
      shippingEmail: '',
      shippingPhone: '',
      preferredShippingMethod: '',
      specialInstructions: ''
    }
  ]);
  // Financial information state
  const [financialInformation, setFinancialInformation] = useState([
    {
      annualRevenue: '',
      creditRating: '',
      bankName: '',
      accountNumber: '',
      fiscalYearEnd: '',
      financialContact: ''
    }
  ]);

  // Ledger information state
  const [ledgerInformation, setLedgerInformation] = useState([
    {
      accountCode: '',
      accountType: '',
      openingBalance: '',
      balanceDate: '',
      taxCategory: '',
      costCenter: ''
    }
  ]);

  // Additional information state
  const [additionalInformation, setAdditionalInformation] = useState({
    paymentTerms: '',
    creditLimit: '',
    notes: ''
  });

  // Add state for errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const updateStates = (clientData) => {
      setFormData({
        clientName: clientData.clientName || '',
        industry: clientData.industry || '',
        website: clientData.website || '',
        clientAddress: clientData.clientAddress || '',
        TaxID_VATNumber: clientData.TaxID_VATNumber || '',
        CSRCode: clientData.CSRCode || '',
        Status: clientData.Status || ''
      });

      setContactPersons(clientData.contactPersons || []);
      setBillingInformation(clientData.billingInformation || []);
      setShippingInformation(clientData.shippingInformation || []);
      setFinancialInformation(
        (clientData.financialInformation || []).map((item) => ({
          ...item,
          fiscalYearEnd: formatDate(item.fiscalYearEnd),
        }))
      );
      setLedgerInformation(
        (clientData.ledgerInformation || []).map((item) => ({
          ...item,
          balanceDate: formatDate(item.balanceDate),
        }))
      );
      setAdditionalInformation(clientData.additionalInformation || {
        paymentTerms: '',
        creditLimit: '',
        notes: ''
      });
    };

    if (client) {
      updateStates(client);
    } else if (id) {
      dispatch(fetchclientById(id)).then((res) => {
        const fetchedclient = res.payload;
        if (fetchedclient) {
          updateStates(fetchedclient);
        }
      });
    }
  }, [id, dispatch, client]);



  // Handle basic form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle contact person changes
  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'phone') {
      newValue = newValue.replace(/[^\d]/g, '').slice(0, 10);
    }
    const updatedContacts = [...contactPersons];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [name]: newValue
    };
    setContactPersons(updatedContacts);
  };

  // Handle billing information changes
  const handleBillingChange = (index, e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'billingPhone') {
      newValue = newValue.replace(/[^\d]/g, '').slice(0, 10);
    }
    const updatedBilling = [...billingInformation];
    updatedBilling[index] = {
      ...updatedBilling[index],
      [name]: newValue
    };
    setBillingInformation(updatedBilling);
  };

  // Handle shipping information changes
  const handleShippingChange = (index, e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'shippingPhone') {
      newValue = newValue.replace(/[^\d]/g, '').slice(0, 10);
    }
    const updatedShipping = [...shippingInformation];
    updatedShipping[index] = {
      ...updatedShipping[index],
      [name]: newValue
    };
    setShippingInformation(updatedShipping);
  };

  // Handle financial information changes
  const handleFinancialChange = (index, e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'creditRating') {
      // Only allow numbers between 1 and 5
      let num = Number(newValue);
      if (newValue === '') {
        newValue = '';
      } else if (num < 1) {
        newValue = '1';
      } else if (num > 5) {
        newValue = '5';
      } else {
        newValue = String(num);
      }
    }
    const updatedFinancial = [...financialInformation];
    updatedFinancial[index] = {
      ...updatedFinancial[index],
      [name]: newValue
    };
    setFinancialInformation(updatedFinancial);
  };

  // Handle ledger information changes
  const handleLedgerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLedger = [...ledgerInformation];
    updatedLedger[index] = {
      ...updatedLedger[index],
      [name]: value
    };
    setLedgerInformation(updatedLedger);
  };


  const handleAdditionalChange = (e) => {
    const { name, value } = e.target;
    setAdditionalInformation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    // Basic form fields
    if (!formData.clientName.trim()) newErrors.clientName = 'Name is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.website.trim()) newErrors.website = 'Website is required';
    else if (!/^https?:\/\//.test(formData.website)) newErrors.website = 'Website must start with http:// or https://';
    if (!formData.clientAddress.trim()) newErrors.clientAddress = 'Client Address is required';
    if (!formData.TaxID_VATNumber.trim()) newErrors.TaxID_VATNumber = 'Tax ID/VAT Number is required';
    if (!formData.CSRCode.trim()) newErrors.CSRCode = 'CSR Code is required';
    if (!formData.Status) newErrors.Status = 'Status is required';

    // Contact Persons
    contactPersons.forEach((contact, idx) => {
      if (!contact.contactName.trim()) newErrors[`contactName_${idx}`] = 'Contact Name is required';
      if (!contact.jobTitle.trim()) newErrors[`jobTitle_${idx}`] = 'Job Title is required';
      if (!contact.email.trim()) newErrors[`email_${idx}`] = 'Email is required';
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) newErrors[`email_${idx}`] = 'Invalid email';
      if (!contact.phone.trim()) newErrors[`phone_${idx}`] = 'Phone is required';
      else if (!/^\d{10}$/.test(contact.phone)) newErrors[`phone_${idx}`] = 'Phone must be 10 digits';
      if (!contact.department.trim()) newErrors[`department_${idx}`] = 'Department is required';
      if (!contact.salesRepresentative.trim()) newErrors[`salesRepresentative_${idx}`] = 'Sales Representative is required';
    });

    // Billing Information (first item)
    const billing = billingInformation[0] || {};
    if (!billing.billingAddress.trim()) newErrors.billingAddress = 'Billing Address is required';
    if (!billing.billingContactName.trim()) newErrors.billingContactName = 'Billing Contact Name is required';
    if (!billing.billingEmail.trim()) newErrors.billingEmail = 'Billing Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(billing.billingEmail)) newErrors.billingEmail = 'Invalid email';
    if (!billing.billingPhone.trim()) newErrors.billingPhone = 'Billing Phone is required';
    else if (!/^\d{10}$/.test(billing.billingPhone)) newErrors.billingPhone = 'Phone must be 10 digits';
    if (!billing.currency) newErrors.currency = 'Currency is required';
    if (!billing.preferredPaymentMethod) newErrors.preferredPaymentMethod = 'Preferred Payment Method is required';

    // Shipping Information (first item)
    const shipping = shippingInformation[0] || {};
    if (!shipping.shippingAddress.trim()) newErrors.shippingAddress = 'Shipping Address is required';
    if (!shipping.shippingContactName.trim()) newErrors.shippingContactName = 'Shipping Contact Name is required';
    if (!shipping.shippingEmail.trim()) newErrors.shippingEmail = 'Shipping Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(shipping.shippingEmail)) newErrors.shippingEmail = 'Invalid email';
    if (!shipping.shippingPhone.trim()) newErrors.shippingPhone = 'Shipping Phone is required';
    else if (!/^\d{10}$/.test(shipping.shippingPhone)) newErrors.shippingPhone = 'Phone must be 10 digits';
    if (!shipping.preferredShippingMethod) newErrors.preferredShippingMethod = 'Preferred Shipping Method is required';
    if (!shipping.specialInstructions.trim()) newErrors.specialInstructions = 'Special Instructions are required';

    // Financial Information (first item)
    const financial = financialInformation[0] || {};
    if (!financial.annualRevenue) newErrors.annualRevenue = 'Annual Revenue is required';
    else if (isNaN(financial.annualRevenue) || Number(financial.annualRevenue) < 0) newErrors.annualRevenue = 'Annual Revenue must be a positive number';
    if (!financial.creditRating) newErrors.creditRating = 'Credit Rating is required';
    else if (isNaN(financial.creditRating) || Number(financial.creditRating) < 1 || Number(financial.creditRating) > 5) newErrors.creditRating = 'Credit Rating must be between 1 and 5';
    if (!financial.bankName.trim()) newErrors.bankName = 'Bank Name is required';
    if (!financial.accountNumber.trim()) newErrors.accountNumber = 'Account Number is required';
    if (!financial.fiscalYearEnd) newErrors.fiscalYearEnd = 'Fiscal Year End is required';
    if (!financial.financialContact.trim()) newErrors.financialContact = 'Financial Contact is required';

    // Ledger Information (first item)
    const ledger = ledgerInformation[0] || {};
    if (!ledger.accountCode.trim()) newErrors.accountCode = 'Account Code is required';
    if (!ledger.accountType) newErrors.accountType = 'Account Type is required';
    if (!ledger.openingBalance) newErrors.openingBalance = 'Opening Balance is required';
    else if (isNaN(ledger.openingBalance)) newErrors.openingBalance = 'Opening Balance must be a number';
    if (!ledger.balanceDate) newErrors.balanceDate = 'Balance Date is required';
    if (!ledger.taxCategory) newErrors.taxCategory = 'Tax Category is required';
    if (!ledger.costCenter.trim()) newErrors.costCenter = 'Cost Center is required';

    // Additional Information
    if (!additionalInformation.paymentTerms) newErrors.paymentTerms = 'Payment Terms is required';
    if (!additionalInformation.creditLimit) newErrors.creditLimit = 'Credit Limit is required';
    else if (isNaN(additionalInformation.creditLimit) || Number(additionalInformation.creditLimit) < 0) newErrors.creditLimit = 'Credit Limit must be a positive number';
    if (!additionalInformation.notes.trim()) newErrors.notes = 'Notes is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form.');
      return;
    }
    const fullData = {
      ...formData,
      contactPersons,
      billingInformation,
      shippingInformation,
      financialInformation,
      ledgerInformation,
      additionalInformation
    };
    console.log('Full Data Object:', fullData);
    if (_id) {
      dispatch(UpdateClients({ _id, data: fullData }))
        .unwrap()
        .then(() => {
          toast.success("clientupdated successfully!");
          navigate("/admin/clientManagement");
          dispatch(fetchClient());
        })
        .catch(() => {
          toast.error("Failed to update client!");
        });
    } else {
      dispatch(createClients(fullData))
        .unwrap()
        .then(() => {
          toast.success("clientcreated successfully!");
          navigate("/admin/clientManagement");
          dispatch(fetchClient());
        })
        .catch(() => {
          toast.error("Error creating client");
        });
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const fullData = {
  //     ...formData,
  //     contactPersons,
  //     billingInformation,
  //     shippingInformation,
  //     financialInformation,
  //     ledgerInformation,
  //     additionalInformation
  //   };
  //         dispatch(createClients(fullData))
  //       .unwrap()
  //       .then(() => {
  //         toast.success("clientcreated successfully!");
  //         navigate("/clientManagement");
  //       })
  //       .catch(() => {
  //         toast.error("Error creating client");
  //       });

  // };

  return (
    <>
      <ToastContainer />
      <div className="container mt-5">
        <div className="card shadow-sm">
          <div className="card-body">
            {/* <h1 className="card-title h4 mb-4">Add Company</h1> */}
            <h2 className="mb-4">{id || client?._id ? "Edit client" : "New Company (Client)"}</h2>
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className='col-md-3'>  <h6 className="mb-3">Client/Supplier Information</h6></div>
              <div className="col-md-6"></div>
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input required type="text" name="clientName" value={formData.clientName} onChange={handleChange} className="form-control" placeholder="Enter  name" />
                {errors.clientName && <div className="text-danger small">{errors.clientName}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Industry</label>
                <select className="form-select" name="industry" required value={formData.industry} onChange={handleChange}>
                  <option value="">Select industry</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="tech">Technology</option>
                  <option value="retail">Retail</option>
                </select>
                {errors.industry && <div className="text-danger small">{errors.industry}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Website</label>
                <input required type="url" name="website" value={formData.website} onChange={handleChange} className="form-control" placeholder="https://" />
                {errors.website && <div className="text-danger small">{errors.website}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Client Address</label>
                <textarea required className="form-control" name="clientAddress" value={formData.clientAddress} onChange={handleChange}></textarea>
                {errors.clientAddress && <div className="text-danger small">{errors.clientAddress}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Tax ID/VAT Number</label>
                <input required type="text" name="TaxID_VATNumber" value={formData.TaxID_VATNumber} onChange={handleChange} className="form-control" />
                {errors.TaxID_VATNumber && <div className="text-danger small">{errors.TaxID_VATNumber}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">CSR Code</label>
                <input type="text" name="CSRCode" required value={formData.CSRCode} onChange={handleChange} className="form-control" />
                {errors.CSRCode && <div className="text-danger small">{errors.CSRCode}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="Status"
                  required
                  value={formData.Status}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option> {/* empty option for forcing selection */}
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.Status && <div className="text-danger small">{errors.Status}</div>}
              </div>

              <div className='col-md-12 row'>
                <h5 className="mb-3 mt-4">Contact Persons</h5>

                {contactPersons.map((contact, index) => (
                  <div className="border p-3 mb-3" key={index}>
                    <div className="row">
                      <div className="col-md-6">
                        <label className="form-label">Contact Name</label>
                        <input
                          type="text"
                          name="contactName"
                          required
                          value={contact.contactName}
                          onChange={(e) => handleContactChange(index, e)}
                          className="form-control"
                          placeholder="Enter Contact Name"
                        />
                        {errors[`contactName_${index}`] && <div className="text-danger small">{errors[`contactName_${index}`]}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Job Title</label>
                        <input
                          type="text"
                          name="jobTitle"
                          required
                          value={contact.jobTitle}
                          onChange={(e) => handleContactChange(index, e)}
                          className="form-control"
                          placeholder="Enter Job Title"
                        />
                        {errors[`jobTitle_${index}`] && <div className="text-danger small">{errors[`jobTitle_${index}`]}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, e)}
                          className="form-control"
                          placeholder="Enter Email"
                        />
                        {errors[`email_${index}`] && <div className="text-danger small">{errors[`email_${index}`]}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={contact.phone}
                          onChange={(e) => handleContactChange(index, e)}
                          className="form-control"
                          placeholder="Enter Phone"
                          maxLength={10}
                        />
                        {errors[`phone_${index}`] && <div className="text-danger small">{errors[`phone_${index}`]}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Department</label>
                        <input
                          type="text"
                          name="department"
                          required
                          value={contact.department}
                          onChange={(e) => handleContactChange(index, e)}
                          className="form-control"
                          placeholder="Enter Department"
                        />
                        {errors[`department_${index}`] && <div className="text-danger small">{errors[`department_${index}`]}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Sales Representative</label>
                        <input
                          type="text"
                          name="salesRepresentative"
                          required
                          value={contact.salesRepresentative}
                          onChange={(e) => handleContactChange(index, e)}
                          className="form-control"
                          placeholder="Enter Sales Representative"
                        />
                        {errors[`salesRepresentative_${index}`] && <div className="text-danger small">{errors[`salesRepresentative_${index}`]}</div>}
                      </div>

                      <div className="col-md-12 mt-2 d-flex justify-content-end">
                        {contactPersons.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              const updatedContacts = [...contactPersons];
                              updatedContacts.splice(index, 1);
                              setContactPersons(updatedContacts);
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add More Button */}
                <div className="mb-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setContactPersons([
                        ...contactPersons,
                        {
                          contactName: '',
                          jobTitle: '',
                          email: '',
                          phone: '',
                          department: '',
                          salesRepresentative: ''
                        }
                      ]);
                    }}
                  >
                    + Add Another Contact
                  </button>
                </div>
              </div>

              {/* Billing Information */}
              <div className='col-md-12 row'>
                <h5 className="mb-3 mt-4">Billing Information</h5>
                <div className="col-md-12">
                  <label className="form-label">Billing Address</label>
                  <textarea className="form-control" rows="3" name="billingAddress" required value={billingInformation[0].billingAddress} onChange={(e) => handleBillingChange(0, e)}></textarea>
                  {errors.billingAddress && <div className="text-danger small">{errors.billingAddress}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Billing Contact Name</label>
                  <input type="text" className="form-control" name="billingContactName" required value={billingInformation[0].billingContactName} onChange={(e) => handleBillingChange(0, e)} />
                  {errors.billingContactName && <div className="text-danger small">{errors.billingContactName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Billing Email</label>
                  <input type="email" className="form-control" name="billingEmail" required value={billingInformation[0].billingEmail} onChange={(e) => handleBillingChange(0, e)} />
                  {errors.billingEmail && <div className="text-danger small">{errors.billingEmail}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Billing Phone</label>
                  <input type="tel" className="form-control" name="billingPhone" required value={billingInformation[0].billingPhone} onChange={(e) => handleBillingChange(0, e)} maxLength={10} />
                  {errors.billingPhone && <div className="text-danger small">{errors.billingPhone}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Currency</label>
                  <select className="form-select" name="currency" required value={billingInformation[0].currency} onChange={(e) => handleBillingChange(0, e)}>
                    <option value="">Select Currency</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  {errors.currency && <div className="text-danger small">{errors.currency}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Preferred Payment Method</label>
                  <select className="form-select" name="preferredPaymentMethod" required value={billingInformation[0].preferredPaymentMethod} onChange={(e) => handleBillingChange(0, e)}>
                    <option value="">Select Payment Method</option>
                    <option value="BankTransfer">BankTransfer</option>
                    <option value="CreditCard">CreditCard</option>
                    <option value="Check">Check</option>
                  </select>
                  {errors.preferredPaymentMethod && <div className="text-danger small">{errors.preferredPaymentMethod}</div>}
                </div>

                {/* Shipping Information */}
                <h5 className="mb-3 mt-4">Shipping Information</h5>
                <div className="col-md-12">
                  <label className="form-label">Shipping Address</label>
                  <textarea className="form-control" rows="3" name="shippingAddress" required value={shippingInformation[0].shippingAddress} onChange={(e) => handleShippingChange(0, e)}></textarea>
                  {errors.shippingAddress && <div className="text-danger small">{errors.shippingAddress}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Shipping Contact Name</label>
                  <input type="text" className="form-control" name="shippingContactName" required value={shippingInformation[0].shippingContactName} onChange={(e) => handleShippingChange(0, e)} />
                  {errors.shippingContactName && <div className="text-danger small">{errors.shippingContactName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Shipping Email</label>
                  <input type="email" className="form-control" name="shippingEmail" required value={shippingInformation[0].shippingEmail} onChange={(e) => handleShippingChange(0, e)} />
                  {errors.shippingEmail && <div className="text-danger small">{errors.shippingEmail}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Shipping Phone</label>
                  <input type="tel" className="form-control" name="shippingPhone" required value={shippingInformation[0].shippingPhone} onChange={(e) => handleShippingChange(0, e)} maxLength={10} />
                  {errors.shippingPhone && <div className="text-danger small">{errors.shippingPhone}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Preferred Shipping Method</label>
                  <select className="form-select" name="preferredShippingMethod" required value={shippingInformation[0].preferredShippingMethod} onChange={(e) => handleShippingChange(0, e)}>
                    <option value="">Select Shipping Method</option>
                    <option value="ground">Ground</option>
                    <option value="standard">Standard</option>
                    <option value="express">Express</option>
                    <option value="overnight">Overnight</option>
                  </select>
                  {errors.preferredShippingMethod && <div className="text-danger small">{errors.preferredShippingMethod}</div>}
                </div>
                <div className="col-md-12">
                  <label className="form-label">Special Instructions</label>
                  <textarea className="form-control" rows="3" name="specialInstructions" required value={shippingInformation[0].specialInstructions} onChange={(e) => handleShippingChange(0, e)}></textarea>
                  {errors.specialInstructions && <div className="text-danger small">{errors.specialInstructions}</div>}
                </div>

                {/* Financial Information */}
                <h5 className="mb-3 mt-4">Financial Information</h5>
                <div className="col-md-6">
                  <label className="form-label">Annual Revenue</label>
                  <input type="number" className="form-control" name="annualRevenue" required value={financialInformation[0].annualRevenue} onChange={(e) => handleFinancialChange(0, e)} />
                  {errors.annualRevenue && <div className="text-danger small">{errors.annualRevenue}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Credit Rating</label>
                  <input type="number" className="form-control" name="creditRating" required value={financialInformation[0].creditRating} onChange={(e) => handleFinancialChange(0, e)} min={1} max={5} />
                  {errors.creditRating && <div className="text-danger small">{errors.creditRating}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Bank Name</label>
                  <input type="text" className="form-control" name="bankName" required value={financialInformation[0].bankName} onChange={(e) => handleFinancialChange(0, e)} />
                  {errors.bankName && <div className="text-danger small">{errors.bankName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Account Number</label>
                  <input type="text" className="form-control" name="accountNumber" required value={financialInformation[0].accountNumber} onChange={(e) => handleFinancialChange(0, e)} />
                  {errors.accountNumber && <div className="text-danger small">{errors.accountNumber}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Fiscal Year End</label>
                  <input type="date" className="form-control" name="fiscalYearEnd" required value={financialInformation[0].fiscalYearEnd} onChange={(e) => handleFinancialChange(0, e)} />
                  {errors.fiscalYearEnd && <div className="text-danger small">{errors.fiscalYearEnd}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Financial Contact</label>
                  <input type="text" className="form-control" name="financialContact" required value={financialInformation[0].financialContact} onChange={(e) => handleFinancialChange(0, e)} />
                  {errors.financialContact && <div className="text-danger small">{errors.financialContact}</div>}
                </div>

                {/* Ledger Information */}
                <h5 className="mb-3 mt-4">Ledger Information</h5>
                <div className="col-md-6">
                  <label className="form-label">Account Code</label>
                  <input type="text" className="form-control" name="accountCode" required value={ledgerInformation[0].accountCode} onChange={(e) => handleLedgerChange(0, e)} />
                  {errors.accountCode && <div className="text-danger small">{errors.accountCode}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Account Type</label>
                  <select className="form-select" name="accountType" required value={ledgerInformation[0].accountType} onChange={(e) => handleLedgerChange(0, e)}>
                    <option value="">Select Account Type</option>
                    <option value="AccountsReceivable">AccountsReceivable</option>
                    <option value="AccountsPayable">AccountsPayable</option>
                  </select>
                  {errors.accountType && <div className="text-danger small">{errors.accountType}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Opening Balance</label>
                  <input type="number" className="form-control" name="openingBalance" required value={ledgerInformation[0].openingBalance} onChange={(e) => handleLedgerChange(0, e)} />
                  {errors.openingBalance && <div className="text-danger small">{errors.openingBalance}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Balance Date</label>
                  <input type="date" className="form-control" name="balanceDate" required value={ledgerInformation[0].balanceDate} onChange={(e) => handleLedgerChange(0, e)} />
                  {errors.balanceDate && <div className="text-danger small">{errors.balanceDate}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Tax Category</label>
                  <select className="form-select" name="taxCategory" required value={ledgerInformation[0].taxCategory} onChange={(e) => handleLedgerChange(0, e)}>
                    <option value="standard">Standard Rate</option>
                    <option value="reduced">Reduced Rate</option>
                    <option value="zero">Zero Rate</option>
                  </select>
                  {errors.taxCategory && <div className="text-danger small">{errors.taxCategory}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Cost Center</label>
                  <input type="text" className="form-control" name="costCenter" required value={ledgerInformation[0].costCenter} onChange={(e) => handleLedgerChange(0, e)} />
                  {errors.costCenter && <div className="text-danger small">{errors.costCenter}</div>}
                </div>

                {/* Additional Information */}
                <h5 className="mb-3 mt-4">Additional Information</h5>
                <div className="col-md-6">
                  <label className="form-label">Payment Terms</label>
                  <select
                    className="form-select"
                    name="paymentTerms"
                    required
                    value={additionalInformation.paymentTerms}
                    onChange={handleAdditionalChange}
                  >
                    <option value="">Select Payment Terms</option>  {/* <-- placeholder */}
                    <option value="net30">Net 30</option>
                    <option value="net60">Net 60</option>
                    <option value="net90">Net 90</option>
                  </select>
                  {errors.paymentTerms && <div className="text-danger small">{errors.paymentTerms}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Credit Limit</label>
                  <input type="number" className="form-control" name="creditLimit" required value={additionalInformation.creditLimit} onChange={handleAdditionalChange} />
                  {errors.creditLimit && <div className="text-danger small">{errors.creditLimit}</div>}
                </div>
              </div>
              <div className="col-md-12">
                <label className="form-label">Notes</label>
                <textarea className="form-control" rows="3" name="notes" required value={additionalInformation.notes} onChange={handleAdditionalChange} placeholder="Additional notes"></textarea>
                {errors.notes && <div className="text-danger small">{errors.notes}</div>}
              </div>

              <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary">Cancel</button>
                <button type="submit" id="btn-All" className="btn btn-dark">{id || client?._id ? "Update client" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddClientManagement;

