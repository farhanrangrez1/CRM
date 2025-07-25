import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClient } from '../../../redux/slices/ClientSlice';
import { apiUrl } from '../../../redux/utils/config';

const AddSubClientManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isEditMode = location?.state?.client ? true : false;
  const existingData = location?.state?.client || {};
  const [isFormInitialized, setIsFormInitialized] = useState(false);


  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    subClientName: '',
    subClientAddress: '',
    subClientPhone: '',
    subClientEmail: '',
    notes: '',
    clientId: ''
  });
  const [errors, setErrors] = useState({});
  const { Clients } = useSelector((state) => state.client);

  useEffect(() => {
    dispatch(fetchClient());
  }, [dispatch]);

  useEffect(() => {
    if (Clients?.data) {
      setClients(Clients.data);
    }
  }, [Clients]);

  useEffect(() => {
    if (isEditMode && Clients?.data?.length > 0 && !isFormInitialized) {
      setFormData({
        subClientName: existingData.subClientName || '',
        subClientAddress: existingData.subClientAddress || '',
        subClientPhone: existingData.subClientPhone || '',
        subClientEmail: existingData.subClientEmail || '',
        notes: existingData.notes || '',
        clientId: existingData.clientId?._id || existingData.clientId || ''
      });
      setIsFormInitialized(true); // ✅ mark as initialized
    }
  }, [Clients, isEditMode, existingData, isFormInitialized]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'subClientPhone') {
      // Allow empty input first
      if (newValue === '') {
        newValue = '';
      } else {
        newValue = newValue.replace(/[^\d+]/g, '').slice(0, 15);
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Sending data:', formData);


    try {
      if (isEditMode) {
        await axios.patch(
          `${apiUrl}/subClient/${existingData._id}`,
          formData
        );
        toast.success("Sub-client updated successfully!");
      } else {
        await axios.post(
          `${apiUrl}/subClient`,
          formData
        );
        toast.success("Sub-client created successfully!");
      }

      navigate("/admin/subClientManagement");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit sub-client.");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="mb-4">{isEditMode ? 'Update' : 'Create'} Sub Client</h4>
          <form onSubmit={handleSubmit} className="row g-3">

            <div className="col-md-6">
              <label className="form-label">Select Client</label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">-- Select a Client --</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Sub Client Name</label>
              <input
                type="text"
                name="subClientName"
                value={formData.subClientName}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter sub-client name"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Sub Client Email</label>
              <input
                type="email"
                name="subClientEmail"
                value={formData.subClientEmail}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter email"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="subClientPhone"
                value={formData.subClientPhone}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter phone number"
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="subClientAddress"
                value={formData.subClientAddress}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter address"
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-control"
                placeholder="Additional notes"
              ></textarea>
            </div>

            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
              <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-dark">
                {isEditMode ? 'Update' : 'Create'} Sub Client
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubClientManagement;
