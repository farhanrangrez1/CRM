import React from 'react'

function AddJobAssignment() {
  return (
    <div className="container py-5">
      <h4 className="fw-bold mb-4">Job Assignments</h4>
      <div className="bg-white p-4 rounded shadow-sm border">
        <h5 className="fw-semibold mb-4">Assign Job</h5>
        <form>
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              <div className="mb-2">
                <label className="form-label">Project Name</label>
                <input type="text" className="form-control border-bold" placeholder="Enter project name" />
              </div>
              <div className="mb-2">
                <label className="form-label">Designer</label>
                <select className="form-select border-bold">
                  <option>Select Designer</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">Priority</label>
                <select className="form-select border-bold">
                  <option>Select Priority</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">Due Date</label>
                <input type="date" className="form-control border-bold" />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              <div className="mb-2">
                <label className="form-label">Brief Summary</label>
                <textarea className="form-control" rows="3" placeholder="Enter job description"></textarea>
              </div>
              <div className="mb-2">
                <label className="form-label">Attachments</label>
                <div className="border border-2 rounded text-center p-2 bg-light dashed-border">
                  <i className="bi bi-cloud-upload fs-4"></i>
                  <div className="mt-1 text-muted small">Drag and drop files here or click to upload</div>
                  <input type="file" className="form-control form-control-sm mt-2" />
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label">Estimated Hours</label>
                <input type="number" className="form-control" placeholder="Enter estimated hours" />
              </div>
            </div>
          </div>
          <div className="mt-4 d-flex justify-content-end">
            <button type="button" className="btn btn-outline-secondary me-2">Cancel</button>
            <button type="submit" className="btn btn-dark">Create Job</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddJobAssignment

