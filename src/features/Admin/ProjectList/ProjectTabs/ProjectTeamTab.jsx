import React from 'react';

function ProjectTeamTab({ teamMembers }) {
  return (
    <div className="row g-4">
      {/* Team Members Grid */}
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Team Members</h5>
            <button className="btn btn-primary btn-sm">
              <i className="bi bi-person-plus"></i> Add Member
            </button>
          </div>
          <div className="card-body">
            <div className="row g-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="col-md-4">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <div className="mb-3">
                        <div className="avatar-placeholder bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <h5 className="card-title mb-1">{member.name}</h5>
                      <p className="text-muted mb-3">{member.role}</p>
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-envelope"></i> Message
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                          <i className="bi bi-person-lines-fill"></i> Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Team Performance</h5>
          </div>
          <div className="card-body">
            <div className="list-group list-group-flush">
              <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Tasks Completed</h6>
                    <small className="text-muted">Last 30 days</small>
                  </div>
                  <h4 className="mb-0 text-success">45</h4>
                </div>
              </div>
              <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Active Tasks</h6>
                    <small className="text-muted">Currently in progress</small>
                  </div>
                  <h4 className="mb-0 text-warning">12</h4>
                </div>
              </div>
              <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Team Utilization</h6>
                    <small className="text-muted">Resource allocation</small>
                  </div>
                  <h4 className="mb-0">85%</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Schedule */}
      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Team Schedule</h5>
          </div>
          <div className="card-body">
            <div className="list-group list-group-flush">
              <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <div>
                    <h6 className="mb-1">Daily Standup</h6>
                    <small className="text-muted">9:00 AM - 9:30 AM</small>
                  </div>
                  <span className="badge bg-primary">Daily</span>
                </div>
              </div>
              <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <div>
                    <h6 className="mb-1">Sprint Planning</h6>
                    <small className="text-muted">2:00 PM - 4:00 PM</small>
                  </div>
                  <span className="badge bg-info">Weekly</span>
                </div>
              </div>
              <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <div>
                    <h6 className="mb-1">Team Review</h6>
                    <small className="text-muted">3:00 PM - 4:30 PM</small>
                  </div>
                  <span className="badge bg-secondary">Bi-weekly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectTeamTab;