import React, { useState } from "react";
import axios from "axios";
// import Base_Url from "../../ApiUrl/ApiUrl";

const ProductionManagerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    experienceYears: "",
    address: "",
    specialization: "",
    qualification: "",
    shiftPreference: "",
    previousWork: "",
    managementSkills: "",
    technicalKnowledge: "",
    communicationSkills: "",
    problemSolving: "",
    teamwork: "",
    photo: null,
    certificates: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });   
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    for (const key in formData) {
      form.append(key, formData[key]);
    }

   
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title h4 mb-4">Production Manager</h1>
          <form className="row g-3" onSubmit={handleSubmit}>
            <h5 className="mb-3">Production Manager Information</h5>
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Mobile Number</label>
              <input type="tel" className="form-control" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Experience (in years)</label>
              <input type="number" className="form-control" name="experienceYears" value={formData.experienceYears} onChange={handleChange} />
            </div>

            <div className="col-md-12">
              <label className="form-label">Address</label>
              <textarea className="form-control" name="address" value={formData.address} onChange={handleChange}></textarea>
            </div>

            <h5 className="mb-3 mt-4">Professional Information</h5>
            <div className="col-md-6">
              <label className="form-label">Specialization</label>
              <input type="text" className="form-control" name="specialization" value={formData.specialization} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Qualification</label>
              <input type="text" className="form-control" name="qualification" value={formData.qualification} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Shift Preference</label>
              <select className="form-select" name="shiftPreference" value={formData.shiftPreference} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Day">Day (6 AM - 2 PM)</option>
                <option value="Evening">Evening (2 PM - 10 PM)</option>
                <option value="Night">Night (10 PM - 6 AM)</option>
                <option value="Any">Any</option>
              </select>
            </div>

            <div className="col-md-12">
              <label className="form-label">Previous Work Experience</label>
              <textarea className="form-control" name="previousWork" value={formData.previousWork} onChange={handleChange}></textarea>
            </div>
            <h5 className="mb-3 mt-4">Skills</h5>
            <div className="col-md-6">
              <label className="form-label">Management Skills</label>
              <input type="text" className="form-control" name="managementSkills" value={formData.managementSkills} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Technical Knowledge</label>
              <input type="text" className="form-control" name="technicalKnowledge" value={formData.technicalKnowledge} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Communication Skills</label>
              <input type="text" className="form-control" name="communicationSkills" value={formData.communicationSkills} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Problem Solving</label>
              <input type="text" className="form-control" name="problemSolving" value={formData.problemSolving} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Teamwork</label>
              <input type="text" className="form-control" name="teamwork" value={formData.teamwork} onChange={handleChange} />
            </div>

            <h5 className="mb-3 mt-4">Documents</h5>
            <div className="col-md-6">
              <label className="form-label">Upload Photo</label>
              <input type="file" className="form-control" name="photo" onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Upload Certificates</label>
              <input type="file" className="form-control" name="certificates" onChange={handleChange} />
            </div>

            <div className="col-12 d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-outline-secondary">Cancel</button>
              <button type="submit" className="btn btn-dark">Create Production Manager</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductionManagerForm;
