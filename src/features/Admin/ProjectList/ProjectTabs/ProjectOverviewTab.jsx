import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function ProjectOverviewTab({ projectData }) {
  // const location = useLocation();
  // const params = useParams();
  // const id = location.state?.id || params.id;
  // console.log("hello me project id",id);
  

  return (
    <div className="row g-4">
      {/* Metrics Cards */}
      <div className="col-md-3">
        <div className="card h-100">
          <div className="card-body">
            <h6 className="card-subtitle mb-2 text-muted">Progress</h6>
            <h2 className="card-title mb-0" >{projectData.progress}%</h2>
            <div className="progress mt-2" style={{ height: '4px' }}>
              <div
              id='All_btn'
                className="progress-bar"
                role="progressbar"
                style={{ width: `${projectData.progress}%` }}
                aria-valuenow={projectData.progress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card h-100">
          <div className="card-body">
            <h6 className="card-subtitle mb-2 text-muted">Days Remaining</h6>
            <h2 className="card-title mb-0">{projectData.daysRemaining}</h2>
            <p className="card-text text-muted">Due: {projectData.dueDate}</p>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card h-100">
          <div className="card-body">
            <h6 className="card-subtitle mb-2 text-muted">Jobs Due Today</h6>
            <h2 className={`card-title mb-0 ${projectData.budget.isUnderBudget ? 'text-success' : 'text-danger'}`}>
              {projectData.budget.status}
            </h2>
            <p className="card-text text-muted">{projectData.budget.actual}</p>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card h-100">
          <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted">Total Hours</h6>
            <h2 className="card-title mb-0">{projectData.teamSize}</h2>
            <p className="card-text text-muted">Logged</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Recent Activity</h5>
          </div>
          <div className="card-body">
            <div className="list-group list-group-flush">
              {projectData.recentActivity.map((activity, index) => (
                <div key={index} className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">{activity.action}</h6>
                    <small className="text-muted">{activity.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Orders Summary */}
      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Purchase Orders</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-4">
                <div className="text-center">
                  <h3 className="mb-1">{projectData.purchaseOrders.received}</h3>
                  <div className="text-muted">Received</div>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center">
                  <h3 className="mb-1">{projectData.purchaseOrders.issued}</h3>
                  <div className="text-muted">Issued</div>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center">
                  <h3 className="mb-1">{projectData.purchaseOrders.totalValue}</h3>
                  <div className="text-muted">Total Value</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectOverviewTab;