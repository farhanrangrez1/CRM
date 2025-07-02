import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { SingleUser } from '../../../redux/slices/userSlice';
import { apiUrl } from '../../../redux/utils/config';
import { FaPlus  } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


function UpdateProfile() {
  const dispatch = useDispatch();
  const navigate =useNavigate()

  const [form, setForm] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    country: '',
    profileImage: '',
    assign: '',
    role: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const { UserSingle } = useSelector((state) => state.user);

  // 1. Load user on mount
  useEffect(() => {
    dispatch(SingleUser());
  }, [dispatch]);

  // 2. Set user data in form
  useEffect(() => {
    if (UserSingle) {
      setForm({
        _id: UserSingle._id || '',
        firstName: UserSingle.firstName || '',
        lastName: UserSingle.lastName || '',
        email: UserSingle.email || '',
        phone: UserSingle.phone || '',
        state: UserSingle.state || '',
        country: UserSingle.country || '',
        profileImage: UserSingle.profileImage?.[0] || '',
        assign: UserSingle.assign || '',
        role: UserSingle.role || '',
      });
    }
  }, [UserSingle]);

  // 3. Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profileImage' && files && files[0]) {
      // ✅ Store the actual File object for upload
      setForm({ ...form, profileImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 4. Trigger file input on button click
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // 5. Submit form with FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('phone', form.phone);
      formData.append('state', form.state);
      formData.append('country', form.country);
      formData.append('assign', form.assign);
      formData.append('role', form.role);

      // ✅ Send new file if selected
      if (form.profileImage instanceof File) {
        formData.append('profileImage', form.profileImage);
      } else {
        formData.append('existingImage', form.profileImage); // Old image path
      }

      const response = await fetch(`${apiUrl}/user/${form._id}`, {
        method: 'PATCH',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(SingleUser());
        setMessage('Profile updated successfully!');
        navigate("/admin/profile")
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="w-100" style={{ maxWidth: 1000 }}>
        <div
          className="rounded-4 shadow-lg border-0 p-0"
          style={{
            background: 'linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%)',
          }}
        >
          {/* Image Preview */}
          <div className="d-flex flex-column align-items-center pt-5 pb-2 position-relative">
            <div className="position-relative mb-3">
              <img
                src={
                  form.profileImage instanceof File
                    ? URL.createObjectURL(form.profileImage)
                    : form.profileImage ||
                      'https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=2654'
                }
                alt="Profile"
                className="rounded-circle border border-3 border-primary shadow-lg"
                style={{
                  width: 110,
                  height: 110,
                  objectFit: 'cover',
                  background: '#fff',
                }}
              />
              <button
                type="button"
                className="btn btn-light btn-sm rounded-circle position-absolute bottom-0 end-0 border shadow"
                style={{ transform: 'translate(25%, 25%)' ,color: '#0052CC'}}
                onClick={handleImageClick}
                title="Change profile picture"
              >
               <FaPlus  />
              </button>
              <input
                type="file"
                className="form-control"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </div>
            <h2 className="fw-bold mb-2 text-primary text-center" style={{ fontSize: '1.7rem' }}>
              Update Profile
            </h2>
          </div>

          {/* Form Start */}
          <form onSubmit={handleSubmit} autoComplete="off" className="px-4 pb-4 pt-2">
            <div className="row g-4">
              {[
                ['firstName', 'First Name', 'person'],
                ['lastName', 'Last Name', 'person'],
                ['phone', 'Phone', 'telephone'],
                ['state', 'State', 'geo-alt'],
                ['country', 'Country', 'globe'],
              ].map(([id, label, icon]) => (
                <div className="col-md-6 form-floating" key={id}>
                  <input
                    type="text"
                    className="form-control"
                    id={id}
                    name={id}
                    value={form[id]}
                    onChange={handleChange}
                    placeholder={label}
                    required={['firstName', 'lastName'].includes(id)}
                  />
                  <label htmlFor={id}>
                    <i className={`bi bi-${icon} me-2`}></i>{label}
                  </label>
                </div>
              ))}

              {/* Email (disabled) */}
              <div className="col-md-6 form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={form.email}
                  placeholder="Email"
                  disabled
                />
                <label htmlFor="email">
                  <i className="bi bi-envelope-at me-2"></i>Email
                </label>
              </div>
            </div>

            {/* Message/Error */}
            {error && (
              <div className="alert alert-danger mt-4 d-flex align-items-center">
                <i className="bi bi-x-circle-fill me-2"></i>{error}
              </div>
            )}

            {message && (
              <div className="alert alert-success mt-4 d-flex align-items-center">
                <i className="bi bi-check-circle-fill me-2"></i>{message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary mt-4 px-4 w-100"
              style={{ fontWeight: 600, fontSize: '1.1rem' }}
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Updating...
                </span>
              ) : (
                'Update Profile'
              )}
            </button>
          </form>

          {/* Button Hover Style */}
          <style>{`
            .btn[title='Change profile picture']:hover {
              background: #e0e7ff;
              color: #6366f1;
              border-color: #6366f1;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
