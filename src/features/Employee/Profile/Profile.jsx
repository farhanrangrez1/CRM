import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { SingleUser } from '../../../redux/slices/userSlice';
import { Link } from 'react-router-dom';
import { FaUserEdit  } from "react-icons/fa";

// Example user data (replace with props or redux in real app)
const userData = {
  permissions: {
    dashboardAccess: true,
    userManagement: true,

  },
  accessLevel: {
    fullAccess: true,
    limitedAccess: false,
    viewOnly: false
  },
  _id: '68418bc45df221af4efdffee',
  firstName: 'employee',
  lastName: '1',
  email: 'employee@gmail.com',
  phone: '1234567890',
  role: 'employee',
  state: 'California',
  country: 'California',
  assign: 'Production',
  isAdmin: false,
  profileImage: [
    ''
  ],
  googleSignIn: false,
  createdAt: '2025-06-05T12:21:24.100Z',
  updatedAt: '2025-06-05T12:21:24.100Z',
};


// // Example user data (replace with props or redux in real app)
const Data = {
  permissions: {
    dashboardAccess: true,
    userManagement: true,
    clientManagement: false,
    projectManagement: false,
    designTools: false,
    financialManagement: false,
    reportGeneration: false,
    systemSettings: false
  },
  accessLevel: {
    fullAccess: true,
    limitedAccess: false,
    viewOnly: false
  },
  _id: '68418bc45df221af4efdffee',
  firstName: 'employee',
  lastName: '1',
  email: 'employee@gmail.com',
  phone: '1234567890',
  role: 'employee',
  state: 'California',
  country: 'California',
  assign: 'Production',
  isAdmin: false,
  profileImage: [
    ''
  ],
  googleSignIn: false,
  createdAt: '2025-06-05T12:21:24.100Z',
  updatedAt: '2025-06-05T12:21:24.100Z',
};
function Profile() {
  const dispatch =useDispatch()
  // Form state
  const [form, setForm] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    state: userData.state,
    country: userData.country,
    assign: userData.assign,
    profileImage: userData.profileImage[0] || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' && files && files[0]) {
      setForm({ ...form, profileImage: URL.createObjectURL(files[0]) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Handle form submit (simulate update)
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage('Profile updated successfully!');
    }, 1200);
  };

  // Permissions badges
  const permissionBadges = Object.entries(userData.permissions).map(([key, value]) => (
    <span key={key} className={`badge me-2 mb-1 ${value ? 'bg-success' : 'bg-secondary'}`} title={key.replace(/([A-Z])/g, ' $1')}>
      {key.replace(/([A-Z])/g, ' $1')}
    </span>
  ));
  // Access level badges
  const accessBadges = Object.entries(userData.accessLevel).map(([key, value]) => (
    <span key={key} className={`badge me-2 mb-1 ${value ? 'bg-primary' : 'bg-light text-dark border'}`} title={key.replace(/([A-Z])/g, ' $1')}>
      {key.replace(/([A-Z])/g, ' $1')}
    </span>
  ));

  const createdDate = new Date(userData.createdAt).toLocaleDateString('en-GB');
  const updatedDate = new Date(userData.updatedAt).toLocaleDateString('en-GB');

  // Access Level list
  const accessLevels = Object.entries(userData.accessLevel).map(([key, value]) => (
    <li key={key} className="mb-2">
      <span className={`badge px-3 py-2 fs-6 d-flex align-items-center gap-2 ${value ? 'bg-primary' : 'bg-light text-dark border'}`}
        title={key.replace(/([A-Z])/g, ' $1').toLowerCase()}>
        <i className="bi bi-shield-lock-fill"></i>
        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
      </span>
    </li>
  ));

  // Permissions list
  const permissions = Object.entries(userData.permissions).map(([key, value]) => (
    <li key={key} className="mb-2">
      <span className={`badge px-3 py-2 fs-6 d-flex align-items-center gap-2 ${value ? 'bg-success' : 'bg-secondary'}`}
        title={key.replace(/([A-Z])/g, ' $1').toLowerCase()}>
        <i className="bi bi-check2-circle"></i>
        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
      </span>
    </li>
  ));


    const { UserSingle} = useSelector((state) => state.user);
  console.log("emp profile console", UserSingle);
  useEffect(() => {
    dispatch(SingleUser());
  }, [dispatch]);
  return (
    <>
      <div className="container py-2">
        <div className="row justify-content-center g-4">
          {/* Profile summary */}
          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-lg " style={{ background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)', borderRadius: '1.5rem' }}>
              <div className="card-body text-center p-4 d-flex flex-column align-items-center justify-content-between h-100">
                 <Link to={"/employee/UpdateProfile"}>
                <div className="position-relative d-inline-block mb-3">
                   <img
                    src={UserSingle?.profileImage && UserSingle?.profileImage.length > 0 ? UserSingle?.profileImage[0] : '/default-profile.png'}
                    alt="avatar"
                    className="rounded-circle border border-3 border-primary shadow"
                    style={{ width: '140px', height: '140px', objectFit: 'cover', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                  />
                    <button
                                                    type="button"
                                                    className="btn btn-light btn-sm rounded-circle position-absolute bottom-0 end-0 border shadow"
                                                    style={{ transform: 'translate(25%, 25%)' ,color: '#0052CC'}}
                                                    title="Change profile picture"
                                                  >
                                                   <FaUserEdit />
                                                  </button>
                </div></Link>
                <h4 className="fw-bold mb-1 mt-2">{UserSingle?.firstName} {UserSingle?.lastName}</h4>
                <div className="mb-2">
                  <i className="bi bi-envelope-at me-1"></i>
                  <span className="fw-semibold">{UserSingle?.email}</span>
                </div>
                <div className="mb-2">
                  <i className="bi bi-telephone me-1"></i>
                  <span className="fw-semibold">{UserSingle?.phone}</span>
                </div>
                <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
                  <span className="small text-secondary"><i className="bi bi-clock-history me-1"></i>Last Updated: {updatedDate}</span>
                  <span className="small text-secondary"><i className="bi bi-hash me-1"></i>User ID: {UserSingle?._id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile details & update form */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg mb-4" style={{ background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)', borderRadius: '1.5rem' }}>
              <div className="card-body p-4">
                <h5 className="mb-4 fw-bold d-flex align-items-center"><i className="bi bi-pencil-square me-2"></i>Profile Details</h5>
                {/* User Details Section */}
                <div className="row mb-3 g-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div>
                        <h5 className="fw-bold mb-3 d-flex align-items-center"><i className="bi bi-check2-circle me-2"></i>Permissions</h5>
                        <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0">
                          {permissions}
                        </ul>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-geo-alt me-2 text-primary"></i>
                        <span className="fw-semibold">Country : {UserSingle?.country}</span>
                      </div>
                      <div className="mb-2">
                        <span className="fw-semibold">role : </span>
                        {Data.role && <span className="badge bg-info text-dark me-1 text-capitalize">{UserSingle?.role}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-google me-2 text-primary"></i>
                        <span className="fw-semibold">Google Sign In:</span>
                        <span className={`badge ms-2 ${UserSingle?.googleSignIn ? 'bg-success' : 'bg-secondary'}`}>{UserSingle?.googleSignIn ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-diagram-3-fill me-2 text-primary"></i>
                        <span className="fw-semibold">Department:</span>
                        <span className="text-muted ms-1">{UserSingle?.assign}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-check-circle-fill me-2 text-primary"></i>
                        <span className="fw-semibold">Status:</span>
                        <span className="badge ms-2 bg-success">Active</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-calendar-event me-2 text-primary"></i>
                        <span className="fw-semibold">Account Created:</span>
                        <span className="text-muted ms-1">{createdDate}</span>
                      </div>
                      <div className="mb-2">
                        <span className="fw-semibold">Access Level:</span>
                        <span className="badge bg-primary ms-2 text-capitalize">Full Access</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" mt-4 border-0 ">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-2 d-flex align-items-center"><i className="bi bi-info-circle me-2"></i>About</h5>
                    <p className="text-muted mb-2">This is a placeholder for user bio or additional information. You can add more details about the employee here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
