import React from 'react'
import { Link } from 'react-router-dom'

function Completed_jobsView_job_details() {
  return (
    <div className="container my-5">
    <h4 className="mb-4 fw-semibold">View Job Details</h4>

    <div className="card shadow-sm">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between flex-column flex-md-row">
          <h5 className="fw-bold mb-2 mb-md-0">#JOB098 - Summer Collection</h5>
          <span className="badge bg-success align-self-start align-self-md-center fs-6">Approved</span>
        </div>

        {/* Row 1 */}
        <div className="row mt-4 mb-3">
          <div className="col-md-4">
            <div className="d-flex">
              <small className="text-muted me-2">Designer:</small>
              <div className="fw-semibold">Sarah Chen</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex">
              <small className="text-muted me-2">Completion Date:</small>
              <div className="fw-semibold">December 15, 2023</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex">
              <small className="text-muted me-2">Time Spent:</small>
              <div className="fw-semibold">24h 15m</div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="d-flex">
              <small className="text-muted me-2">Client:</small>
              <div className="fw-semibold">Fashion Co. Ltd</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex">
              <small className="text-muted me-2">Project Type:</small>
              <div className="fw-semibold">Package Design</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex">
              <small className="text-muted me-2">Final Files:</small>
              <div>
                <a href="#" className="text-decoration-none fw-semibold">
                  <i className="bi bi-download"></i> Download All
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr />

        {/* Description */}
        <div className="mb-4">
          <h6 className="fw-bold">Project Description</h6>
          <p className="text-muted mb-0">
            Packaging design for Fashion Co.'s Summer Collection 2024. Including main product line packaging,
            special edition boxes, and promotional materials.
          </p>
        </div>

        <hr />

        {/* Deliverables */}
        <div className="mb-4">
          <h6 className="fw-bold">Deliverables</h6>
          <div className="list-group">
            {[
              {
                title: 'Main Product Line Package',
                desc: 'Final artwork for standard product packaging',
              },
              {
                title: 'Special Edition Box',
                desc: 'Limited edition packaging design',
              },
              {
                title: 'Promotional Materials',
                desc: 'Supporting marketing materials',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="list-group-item bg-light border-0 rounded mb-2 d-flex justify-content-between align-items-center"
              >
                <div>
                  <div className="fw-semibold">{item.title}</div>
                  <small className="text-muted">{item.desc}</small>
                </div>
                <a href="#" className="text-decoration-none text-dark">
                  <i className="bi bi-download"></i>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Approval History */}
        <div className="mb-4">
          <h6 className="fw-bold">Approval History</h6>
          <div className="mb-2 text-muted">
            Final Approval<br />
            <span className="fw-semibold">Approved by Client Director on Dec 15, 2023</span>
          </div>
          <div className="text-muted">
            Design Review<br />
            <span className="fw-semibold">Passed QA Review on Dec 14, 2023</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-between">
         <Link to={"/admin/completedJobs"}> <button className="btn btn-outline-secondary">← Back to List</button></Link>
          {/* <button className="btn btn-dark">Generate Report</button> */}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Completed_jobsView_job_details