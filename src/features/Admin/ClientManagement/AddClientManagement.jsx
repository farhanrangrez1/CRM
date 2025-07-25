import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { createClients, fetchClient, fetchClientsById, UpdateClients } from '../../../redux/slices/ClientSlice';
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
  // const { client } = location.state || {};

  const clientDataString = localStorage.getItem("clientData");
  let client = null;

  if (clientDataString) {
    try {
      client = JSON.parse(clientDataString);
    } catch (err) {
      console.error("Failed to parse clientData from localStorage:", err);
    }
  } else if (location.state?.client) {
    client = location.state.client;
  }

  const _id = client?._id

  // Initial form state
  const [formData, setFormData] = useState({
    clientName: '',
    // industry: '',
    // website: '',
    clientAddress: '',
    // TaxID_VATNumber: '',
    // CSRCode: '',
    // Status: ''
  });

  // Contact persons state
  const [contactPersons, setContactPersons] = useState([
    {
      contactName: '',
      jobTitle: '',
      email: '',
      password: '',
      phone: '',
      // department: '',
      // salesRepresentative: ''
    }
  ]);

  // Billing information state
  const [billingInformation, setBillingInformation] = useState([
    {
      billingAddress: '',
      billingContactName: '',
      billingEmail: '',
      billingPhone: '',
      // currency: '',
      // preferredPaymentMethod: ''
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

  // useEffect(() => {
  //   const updateStates = (clientData) => {
  //     setFormData({
  //       clientName: clientData.clientName || '',
  //       clientAddress: clientData.clientAddress || '',
  //     });

  //     setContactPersons(clientData.contactPersons || []);
  //     setBillingInformation(clientData.billingInformation || []);
  //     setAdditionalInformation(clientData.additionalInformation || {
  //       paymentTerms: '',
  //       creditLimit: '',
  //       notes: ''
  //     });
  //   };

  //   if (client) {
  //     updateStates(client);
  //   } else if (id) {
  //     dispatch(fetchClientsById(id)).then((res) => {
  //       const fetchedclient = res.payload;
  //       if (fetchedclient) {
  //         updateStates(fetchedclient);
  //       }
  //     });
  //   }
  // }, [id, dispatch, client]);



  // Handle basic form field changes

  useEffect(() => {
    const updateStates = (clientData) => {
      setFormData({
        clientName: clientData.clientName || '',
        clientAddress: clientData.clientAddress || '',
      });

      setContactPersons(clientData.contactPersons || []);
      setBillingInformation(clientData.billingInformation || []);
      setAdditionalInformation(clientData.additionalInformation || {
        paymentTerms: '',
        creditLimit: '',
        notes: ''
      });
    };

    const clientDataString = localStorage.getItem("clientData");

    if (clientDataString) {
      try {
        const client = JSON.parse(clientDataString);
        updateStates(client);
      } catch (err) {
        console.error("Invalid client data");
      }
    } else if (location.state?.client) {
      const client = location.state.client;
      updateStates(client);
    } else if (id) {
      dispatch(fetchClientsById(id)).then((res) => {
        const fetchedClient = res.payload;
        if (fetchedClient) updateStates(fetchedClient);
      });
    }
  }, [id, dispatch, location.state]);


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
      // shippingInformation,
      // financialInformation,
      // ledgerInformation,
      additionalInformation
    };
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

  const handleCancel = () => {
    if (clientDataString) {
      navigate("/admin/dashboard");
    } else {
      navigate(-1);
    }
  };


  return (
    <>
      <ToastContainer />
      <div className="container mt-5">
        <div className="card shadow-sm">
          <div className="card-body">
            {/* <h1 className="card-title h4 mb-4">Add Company</h1> */}
            {/* <h2 className="mb-4">{id || client?._id ? "Edit client" : "New Company (Client)"}</h2> */}
            <h2 className="mb-4">{id ? "Edit client" : "New Company (Client)"}</h2>

            <form className="row g-3" onSubmit={handleSubmit}>
              <div className='col-md-3'>  <h6 className="mb-3">Client/Supplier Information</h6></div>
              <div className="col-md-6"></div>
              <div className="col-md-6">
                <label className="form-label">Company</label>
                <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} className="form-control" placeholder="Enter  name" />
                {errors.clientName && <div className="text-danger small">{errors.clientName}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Client Address</label>
                <textarea className="form-control" name="clientAddress" value={formData.clientAddress} onChange={handleChange}></textarea>
                {errors.clientAddress && <div className="text-danger small">{errors.clientAddress}</div>}
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
                          value={contact.contactName}
                          onChange={(e) => handleContactChange(index, e)}
                          className="form-control"
                          placeholder="Enter Contact Name"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Job Title</label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={contact.jobTitle}
                          onChange={(e) => handleContactChange(index, e)}
                          className="form-control"
                          placeholder="Enter Job Title"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, e)}
                          className="form-control"
                          placeholder="Enter Email"
                        />
                      </div>

                      {!client && <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={contact.password}
                          onChange={(e) => handleContactChange(index, e)}
                          className="form-control"
                          placeholder="Enter Password"
                        />
                      </div>}


                      <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={contact.phone}
                          onChange={(e) => handleContactChange(index, e)}
                          className="form-control"
                          placeholder="Enter Phone"
                          maxLength={10}
                        />
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

              </div>

              {/* Billing Information */}
              <div className='col-md-12 row'>
                <h5 className="mb-3 mt-4">Billing Information</h5>
                <div className="col-md-12">
                  <label className="form-label">Billing Address</label>
                  <textarea className="form-control" rows="3" name="billingAddress" value={billingInformation[0].billingAddress} onChange={(e) => handleBillingChange(0, e)}></textarea>
                  {errors.billingAddress && <div className="text-danger small">{errors.billingAddress}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Billing Contact Name</label>
                  <input type="text" className="form-control" name="billingContactName" value={billingInformation[0].billingContactName} onChange={(e) => handleBillingChange(0, e)} />
                  {errors.billingContactName && <div className="text-danger small">{errors.billingContactName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Billing Email</label>
                  <input type="email" className="form-control" name="billingEmail" value={billingInformation[0].billingEmail} onChange={(e) => handleBillingChange(0, e)} />
                  {errors.billingEmail && <div className="text-danger small">{errors.billingEmail}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Billing Phone</label>
                  <input type="tel" className="form-control" name="billingPhone" value={billingInformation[0].billingPhone} onChange={(e) => handleBillingChange(0, e)} maxLength={10} />
                  {errors.billingPhone && <div className="text-danger small">{errors.billingPhone}</div>}
                </div>
              </div>
              <div className="col-md-12">
                <label className="form-label">Notes</label>
                <textarea className="form-control" rows="3" name="notes" value={additionalInformation.notes} onChange={handleAdditionalChange} placeholder="Additional notes"></textarea>
                {errors.notes && <div className="text-danger small">{errors.notes}</div>}
              </div>

              <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>
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

