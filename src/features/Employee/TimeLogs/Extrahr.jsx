import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Extrahr() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    project: '',
    hours: '',
    taskNotes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    // For now, we'll just navigate back
    navigate(-1);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title h4 mb-4">Add Extra Hours</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Project</label>
                <select
                  className="form-select"
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select project</option>
                  <option value="Holiday Package Design">Holiday Package Design</option>
                  <option value="Product Catalog">Product Catalog</option>
                  <option value="Brand Guidelines">Brand Guidelines</option>
                </select>
              </div>

              <div className="col-md-12">
                <label className="form-label">Extra Hours</label>
                <input
                  type="number"
                  className="form-control"
                  name="hours"
                  value={formData.hours}
                  onChange={handleInputChange}
                  placeholder="Enter Extra hours"
                  step="0.5"
                  min="0"
                  required
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Task Notes</label>
                <textarea
                  className="form-control"
                  name="taskNotes"
                  value={formData.taskNotes}
                  onChange={handleInputChange}
                  placeholder="Enter task details"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="col-12 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-dark">Save Time Log</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Extrahr;