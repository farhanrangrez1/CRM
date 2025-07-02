import React from 'react';

function ProjectDocumentsTab() {
  return (
    <div className="row g-4">
      {/* Document Upload Section */}
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Project Documents</h5>
            <button className="btn btn-primary btn-sm">
              <i className="bi bi-cloud-upload"></i> Upload Document
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Uploaded By</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <i className="bi bi-file-pdf text-danger me-2"></i>
                      Project Proposal.pdf
                    </td>
                    <td>PDF</td>
                    <td>2.5 MB</td>
                    <td>Sarah Johnson</td>
                    <td>2024-01-15</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        <i className="bi bi-download"></i> Download
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i className="bi bi-file-earmark-word text-primary me-2"></i>
                      Technical Specifications.docx
                    </td>
                    <td>DOCX</td>
                    <td>1.8 MB</td>
                    <td>Michael Chen</td>
                    <td>2024-01-18</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        <i className="bi bi-download"></i> Download
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <i className="bi bi-file-earmark-image text-success me-2"></i>
                      Design Mockups.zip
                    </td>
                    <td>ZIP</td>
                    <td>15.2 MB</td>
                    <td>Emily Wilson</td>
                    <td>2024-01-20</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        <i className="bi bi-download"></i> Download
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Document Categories */}
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Document Categories</h5>
          </div>
          <div className="card-body">
            <div className="list-group">
              <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                Project Plans
                <span className="badge bg-primary rounded-pill">4</span>
              </a>
              <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                Technical Documents
                <span className="badge bg-primary rounded-pill">6</span>
              </a>
              <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                Design Assets
                <span className="badge bg-primary rounded-pill">8</span>
              </a>
              <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                Meeting Notes
                <span className="badge bg-primary rounded-pill">12</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Recent Documents</h5>
          </div>
          <div className="card-body">
            <div className="list-group list-group-flush">
              <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1">Meeting Minutes - Jan 20</h6>
                  <small className="text-muted">2 hours ago</small>
                </div>
                <p className="mb-1 text-muted">Added by Sarah Johnson</p>
              </div>
              <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1">Updated Design Specs</h6>
                  <small className="text-muted">Yesterday</small>
                </div>
                <p className="mb-1 text-muted">Added by Emily Wilson</p>
              </div>
              <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1">API Documentation</h6>
                  <small className="text-muted">3 days ago</small>
                </div>
                <p className="mb-1 text-muted">Added by Michael Chen</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDocumentsTab;