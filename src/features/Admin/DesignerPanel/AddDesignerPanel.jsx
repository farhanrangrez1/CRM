// import React from 'react'
// import  { useState } from 'react';
// function AddDesignerPanel() {
//     const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     contact: '',
//     department: '',
//     address: '',
//     experience: '',
//     skills: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData);
//     alert('Designer Added Successfully!');
//     navigate('/DesignerPanel');
//   };

//   return (
//     <div className="container py-4">
//     <div className="card shadow-sm">
//       <div className="card-body">
//         <h4 className="mb-4">Add Designer</h4>
//         <form onSubmit={handleSubmit} className="row g-3">
//           <div className="col-md-6">
//             <label className="form-label">Name</label>
//             <input type="text" className="form-control" name="name" placeholder="Enter name" value={formData.name} onChange={handleChange} required />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label">Email</label>
//             <input type="email" className="form-control" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label">Phone Number</label>
//             <input type="text" className="form-control" name="contact" placeholder="Enter contact number" value={formData.contact} onChange={handleChange} required />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label">Department</label>
//             <input type="text" className="form-control" name="department" placeholder="Enter department" value={formData.department} onChange={handleChange} required />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label">Address</label>
//             <input type="text" className="form-control" name="address" placeholder="Enter address" value={formData.address} onChange={handleChange} />
//           </div>

//           <div className="col-md-6">
//             <label className="form-label">Experience</label>
//             <input type="text" className="form-control" name="experience" placeholder="Enter experience" value={formData.experience} onChange={handleChange} />
//           </div>

//           <div className="col-md-12">
//             <label className="form-label">Skills</label>
//             <textarea className="form-control" name="skills" placeholder="Enter skills" value={formData.skills} onChange={handleChange}></textarea>
//           </div>

//           <div className="col-12">
//             <button type="submit" className="btn btn-dark">Add Designer</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>
//   )
// }

// export default AddDesignerPanel



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddDesignerPanel() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    department: "",
    address: "",
    experience: "",
    skills: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get existing designers from LocalStorage
    const existingDesigners =
      JSON.parse(localStorage.getItem("designerList")) || [];

    // Add the new designer
    const updatedDesigners = [
      ...existingDesigners,
      { ...formData, priority: "Medium", uploads: [] },
    ];

    // Save back to LocalStorage
    localStorage.setItem("designerList", JSON.stringify(updatedDesigners));

    alert("Designer Added Successfully!");
    navigate("/admin/designer-panel"); // Go back to Designer Panel
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="mb-4">Add Designer</h4>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                name="contact"
                placeholder="Enter contact number"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-control"
                name="department"
                placeholder="Enter department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Experience</label>
              <input
                type="text"
                className="form-control"
                name="experience"
                placeholder="Enter experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Skills</label>
              <textarea
                className="form-control"
                name="skills"
                placeholder="Enter skills"
                value={formData.skills}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-dark">
                Add Designer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddDesignerPanel;