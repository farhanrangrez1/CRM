import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchusers, SignUp, UpdateUsers, updateusers } from '../../../redux/slices/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserRoleModal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const location = useLocation();
  const { user } = location.state || {};
  const _id = user?._id;
    console.log("hhhhhhhhhh", user);

    const { userAll, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchusers());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    role: '',
    assign: '',
    state: '',
    country: '',
    image: null,
    permissions: {
      dashboardAccess: false,
      clientManagement: false,
      projectManagement: false,
      designTools: false,
      financialManagement: false,
      userManagement: false,
      reportGeneration: false,
      systemSettings: false
    },
    accessLevel: ''
  });
  const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Real-time password match check
      if (name === 'password' || name === 'passwordConfirm') {
        setShowPasswordMismatch(
          name === 'password'
            ? value !== formData.passwordConfirm && formData.passwordConfirm !== ''
            : value !== formData.password && value !== ''
        );
      }
    }
  };
  useEffect(() => {
    if (user) {
      let parsedPermissions = {};
      let parsedAccessLevel = 'fullAccess';

      try {
        parsedPermissions = typeof user.permissions === 'string'
          ? JSON.parse(user.permissions)
          : user.permissions || {};

        const accessLevelData = typeof user.accessLevel === 'string'
          ? JSON.parse(user.accessLevel)
          : {};

        parsedAccessLevel = Object.keys(accessLevelData).find(key => accessLevelData[key]) || 'fullAccess';
      } catch (error) {
        console.error('Error parsing permissions or access level:', error);
      }

      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        passwordConfirm: '',
        state: user.state || '',
        country: user.country || '',
        assign: user.assign || 'Not Assign',
        image: user.image || null,
        role: user.role || '',
        permissions: {
          dashboardAccess: false,
          clientManagement: false,
          projectManagement: false,
          designTools: false,
          financialManagement: false,
          userManagement: false,
          reportGeneration: false,
          systemSettings: false,
          ...parsedPermissions
        },
        accessLevel: parsedAccessLevel
      });

    }
  }, [user]);

  const handlePermissionChange = (e) => {
    const { name } = e.target;
    const updatedpermissions = Object.fromEntries(
      Object.keys(formData.permissions).map((key) => [key, key === name])
    );
    setFormData(prev => ({
      ...prev,
      permissions: updatedpermissions
    }));
  };

  const handleaccessLevelChange = (e) => {
    setFormData(prev => ({
      ...prev,
      accessLevel: e.target.value
    }));
  };
  
const handleSubmit = (e) => {
  e.preventDefault();

  if (!_id && formData.password !== formData.passwordConfirm) {
    toast.error('Passwords do not match!');
    return;
  }

  const filteredpermissions = Object.fromEntries(
    Object.entries(formData.permissions).filter(([_, value]) => value === true)
  );

  const accessLevelPayload = {
    [formData.accessLevel]: true
  };

  // Use FormData to send image as binary
  const data = new FormData();
  data.append('firstName', formData.firstName);
  data.append('lastName', formData.lastName);
  data.append('email', formData.email);
  data.append('phone', formData.phone);
  if (!_id) {
    data.append('password', formData.password);
    data.append('passwordConfirm', formData.passwordConfirm);
  }
  data.append('state', formData.state);
  data.append('country', formData.country);
  data.append('assign', formData.assign);
  data.append('role', formData.role);
  data.append('permissions', JSON.stringify(filteredpermissions));
  data.append('accessLevel', JSON.stringify(accessLevelPayload));
  if (formData.image && typeof formData.image !== 'string') {
    data.append('image', formData.image);
  }

  console.log('Payload to be sent (FormData):', data);

  if (_id) {
    // For update, you may need to adjust the action to accept FormData
       dispatch(UpdateUsers({ _id, data }))
      .unwrap()
      .then(() => {
        toast.success("User updated successfully!");
        navigate('/admin/UserRoles', { state: { openTab: 'users' } })
        dispatch(fetchusers());
      })
      .catch((err) => {
        const message = err?.message || (typeof err === 'string' ? err : "Failed to update user!");
        toast.error(message);
      });
  } else {
    dispatch(SignUp(data))
      .unwrap()
      .then(() => {
        navigate('/admin/UserRoles', { state: { openTab: 'users' } });
        toast.success("User created successfully!");
        dispatch(fetchusers());
      })
      .catch((err) => {
        const message = err?.message || (typeof err === 'string' ? err : "Error creating user");
        toast.error(message);
      });
  }
};


  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const filteredpermissions = Object.fromEntries(
  //     Object.entries(formData.permissions).filter(([_, value]) => value === true)
  //   );

  //   const payload = {
  //     role: formData.role,
  //     roleDescription: formData.roleDescription,
  //     permissions: filteredpermissions,
  //     accessLevel: formData.accessLevel
  //   };

  //   console.log('Payload to be sent:', payload);
  //   try {
  //     await axios.post('/api/roles', payload);
  //     navigate(-1);
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     alert('Failed to create role. Please try again.');
  //   }
  // };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Add New User</h5>
          <form onSubmit={handleSubmit}>
        
          <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
             {formData.image && (
                  <img src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)} alt="Preview" className="img-thumbnail mt-2" style={{ maxWidth: '120px' }} />
                )}
          </div>
          <div className="col-md-6">
                <label className="form-label">Profile Image</label>
                <input type="file" className="form-control" name="image" accept="image/*" onChange={handleInputChange} required />
              </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
            </div>
            {!_id && (
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" name="password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-control" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleInputChange} required />
                  {showPasswordMismatch && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>Passwords do not match!</div>
                  )}
                </div>
              </div>
            )}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">State</label>
                <input type="text" className="form-control" name="state" value={formData.state} onChange={handleInputChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Country</label>
                <input type="text" className="form-control" name="country" value={formData.country} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Assign</label>
                <select className="form-select" name="assign" value={formData.assign} onChange={handleInputChange} required>
                  <option value="Not Assign">Not Assign</option>
                  <option value="Designer">Designer</option>
                  <option value="Production">Production</option>
                </select>
              </div>
          
              <div className="col-md-6">
              <label className="form-label">Role Name</label>
              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="client">Client</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            </div>
            

            <div className="mb-4">
              <label className="form-label">permissions (Select Only One)</label>
              <div className="row g-3">
                {Object.keys(formData.permissions).map((key) => (
                  <div className="col-md-6" key={key}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name={key}
                        checked={formData.permissions[key]}
                        onChange={handlePermissionChange}
                      />
                      <label className="form-check-label text-capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Access Level</label>
              <div>
                {['fullAccess', 'limitedAccess', 'viewOnly'].map((level) => (
                  <div className="form-check" key={level}>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="accessLevel"
                      value={level}
                      checked={formData.accessLevel === level}
                      onChange={handleaccessLevelChange}
                    />
                    <label className="form-check-label text-capitalize">{level.replace(/([A-Z])/g, ' $1')}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="btn btn-dark">Create User</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserRoleModal;
