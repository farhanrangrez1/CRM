import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdEditSquare } from "react-icons/md";
import { SiMinutemailer } from "react-icons/si";
import { SiGooglemessages } from "react-icons/si";
import { TiTick } from "react-icons/ti";
import { FaFileAlt } from "react-icons/fa";

function ViewdetailsClientManagement() {
  return (
    <div className=" p-4 m-4" style={{backgroundColor:"white",borderRadius:"10px",}}>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="fw-bold">Client Details</h5>
      <div>
        <button className="btn btn-outline-dark me-2">
        <MdEditSquare /> Edit Client
        </button>
        <button id='btn-All' className="btn btn-dark">
        <SiMinutemailer />Send Email
        </button>
      </div>
    </div>

    <div className="row g-4">
      {/* Left: Client Card */}
      <div className="col-md-4">
        <div className="card p-3 text-center">
          <div className="mb-3">
            <div className="bg-light rounded py-4">
              <h2 className="text-primary fw-bold">LOGO</h2>
            </div>
          </div>
          <h6 className="fw-bold mb-0">Acme Corporation</h6>
          <small className="text-muted mb-2">Client since Jan 2023</small>

          <hr />
          <div className="text-start">
            <p className="mb-1 d-flex justify-content-between">Status <span className="text-success fw-bold">Active</span></p>
            <p className="mb-1 d-flex justify-content-between">Projects<strong>12 total</strong></p>
            <p className="mb-0 d-flex justify-content-between">Last Activity<strong> 2 day ago</strong></p>
          </div>
        </div>
      </div>

      {/* Right: Details */}
      <div className="col-md-8">
        <div className="card p-3 mb-3">
          <h6 className="fw-bold mb-3">Contact Information</h6>
          <div className="row">
            <div className="col-sm-6">
              <p className="mb-1"><small className="text-muted">Contact Person</small></p>
              <p className="fw-bold">John Smith</p>

              <p className="mb-1"><small className="text-muted">Phone</small></p>
              <p className="fw-bold">+1 234 567 890</p>
            </div>
            <div className="col-sm-6">
              <p className="mb-1"><small className="text-muted">Email</small></p>
              <p className="fw-bold">client@acme.com</p>

              <p className="mb-1"><small className="text-muted">Address</small></p>
              <p className="fw-bold">123 Business Street, Suite 100<br />New York, NY 10001</p>
            </div>
          </div>
        </div>

        <div className="card p-3 mb-3">
          <h6 className="fw-bold">Project Summary</h6>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-bold">Active Projects</span>
            <span className="fw-bold">$45,000 <small className="text-muted">Total Value</small></span>
          </div>
          <small className="text-muted mb-1 d-block">6 projects in progress</small>
          <div className="progress" style={{ height: '6px' }}>
            <div className="progress-bar " role="progressbar" style={{ width: '75%' ,backgroundColor:"#0052CC"}}></div>
          </div>
        </div>

        <div className="card p-3">
          <h6 className="fw-bold mb-3">Recent Activity</h6>
          <ul className="list-unstyled mt-2">
            <li className="d-flex align-items-center mb-3">
              <span className="me-2 fs-5"><FaFileAlt /></span>
              <div>
                <div className="fw-semibold">New project proposal submitted</div>
                <small className="text-muted">2 days ago</small>
              </div>
            </li>
            <li className="d-flex align-items-center mb-3">
              <span className="me-2 fs-5 text-success">< TiTick /></span>
              <div>
                <div className="fw-semibold">Invoice #1234 paid</div>
                <small className="text-muted">5 days ago</small>
              </div>
            </li>
            <li className="d-flex align-items-center mb-3">
              <span className="me-2 fs-5 text-primary"><SiGooglemessages /></span>
              <div>
                <div className="fw-semibold">Project meeting scheduled</div>
                <small className="text-muted">1 week ago</small>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ViewdetailsClientManagement

