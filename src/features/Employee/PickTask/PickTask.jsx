import React, { useState } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';
import { FaRegCircle, FaCheckCircle, FaExclamationCircle, FaRegClock, FaCalendarAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function PickTask() {
  const [tasks] = useState({
    quickFilters: [
      { name: 'In Progress', count: 8, icon: <FaRegCircle className="text-primary" />, bgColor: 'primary' },
      { name: 'Completed', count: 12, icon: <FaCheckCircle className="text-success" />, bgColor: 'success' },
      { name: 'Overdue', count: 3, icon: <FaExclamationCircle className="text-danger" />, bgColor: 'danger' }
    ],
    projects: [
      { name: 'Website Redesign', count: 5, color: 'primary' },
      { name: 'Mobile App', count: 3, color: 'success' },
      { name: 'Marketing', count: 7, color: 'purple' }
    ]
  });

  const [selectedTask] = useState({
    title: 'Website Redesign Project',
    status: 'In Progress',
    priority: 'High Priority',
    description: 'Complete the redesign of the company website according to the approved mockups. Focus on improving user experience, mobile responsiveness, and implementing the new brand guidelines across all pages.',
    dueDate: 'May 31, 2025 - 5:00 PM',
    timeRemaining: '3 days',
    progress: 65,
    assignee: {
      name: 'Emma Thompson',
      department: 'UX/UI Design Department',
      avatar: 'https://via.placeholder.com/40'
    },
    startDate: 'May 15, 2025',
    estimatedHours: 40,
    hoursLogged: 26,
    teamMembers: [
      { id: 1, avatar: 'https://via.placeholder.com/32' },
      { id: 2, avatar: 'https://via.placeholder.com/32' },
      { id: 3, avatar: 'https://via.placeholder.com/32' }
    ]
  });

  return (
    <Container fluid className="p-4 pick-task-container">
      <Row>
        <Col md={3}>
          <div className="quick-filters mb-4">
            <h6 className="text-uppercase fw-bold text-muted mb-3">Quick Filters</h6>
            {tasks.quickFilters.map((filter, index) => (
              <div key={index} className={`filter-item d-flex justify-content-between align-items-center mb-2 p-2 rounded-pill bg-light-${filter.bgColor}`}>
                <div className="d-flex align-items-center">
                  {filter.icon}
                  <span className="ms-2 fw-medium">{filter.name}</span>
                </div>
                <Badge bg={filter.bgColor} className="rounded-pill">{filter.count}</Badge>
              </div>
            ))}
          </div>

          <div className="projects">
            <h6 className="text-uppercase fw-bold text-muted mb-3">Projects</h6>
            {tasks.projects.map((project, index) => (
              <div key={index} className="project-item d-flex justify-content-between align-items-center mb-2 p-2">
                <div className="d-flex align-items-center">
                  <div className={`project-dot bg-${project.color} me-2`}></div>
                  <span className="fw-medium">{project.name}</span>
                </div>
                <span className="project-count">{project.count}</span>
              </div>
            ))}
          </div>
        </Col>

        <Col md={9}>
          <Card className="task-details border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">{selectedTask.title}</h4>
                <div>
                  <Badge bg="warning" text="dark" className="status-badge me-2">{selectedTask.status}</Badge>
                  <Badge bg="danger" className="priority-badge">{selectedTask.priority}</Badge>
                </div>
              </div>

              <p className="text-muted mb-4">{selectedTask.description}</p>

              <div className="task-meta d-flex align-items-center text-muted mb-4">
                <div className="me-4">
                  <FaCalendarAlt className="me-2" />
                  <span>Due: {selectedTask.dueDate}</span>
                </div>
                <div>
                  <FaRegClock className="me-2" />
                  <span>Time remaining: {selectedTask.timeRemaining}</span>
                </div>
              </div>

              <div className="progress-section mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">{selectedTask.progress}% Complete</span>
                  <span className="text-muted small">{100 - selectedTask.progress}% Remaining</span>
                </div>
                <ProgressBar 
                  now={selectedTask.progress} 
                  className="custom-progress" 
                  style={{ height: '8px' }}
                />
              </div>

              <div className="assignment-details mb-4">
                <h6 className="fw-bold text-muted mb-3">Assignment Details</h6>
                <div className="d-flex align-items-center mb-4">
                  <img
                    src={selectedTask.assignee.avatar}
                    alt={selectedTask.assignee.name}
                    className="rounded-circle me-3"
                    width="40"
                    height="40"
                  />
                  <div>
                    <h6 className="mb-0 fw-bold">{selectedTask.assignee.name}</h6>
                    <small className="text-muted">{selectedTask.assignee.department}</small>
                  </div>
                </div>

                <Row className="g-4">
                  <Col md={6}>
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Start Date</small>
                      <div className="fw-medium">{selectedTask.startDate}</div>
                    </div>
                    <div>
                      <small className="text-muted d-block mb-1">Estimated Hours</small>
                      <div className="fw-medium">{selectedTask.estimatedHours} hours</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">End Date</small>
                      <div className="fw-medium">{selectedTask.dueDate}</div>
                    </div>
                    <div>
                      <small className="text-muted d-block mb-1">Hours Logged</small>
                      <div className="fw-medium">{selectedTask.hoursLogged} hours</div>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="team-members">
                <h6 className="fw-bold text-muted mb-3">Team Members</h6>
                <div className="d-flex align-items-center">
                  {selectedTask.teamMembers.map((member) => (
                    <img
                      key={member.id}
                      src={member.avatar}
                      alt={`Team member ${member.id}`}
                      className="rounded-circle me-2"
                      width="32"
                      height="32"
                    />
                  ))}
                  <div className="more-members rounded-circle bg-light d-flex align-items-center justify-content-center">
                    <small>+2</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PickTask;
