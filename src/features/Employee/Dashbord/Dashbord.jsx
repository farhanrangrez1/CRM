
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, ProgressBar, Dropdown } from 'react-bootstrap';
import { BsCalendar, BsClock, BsCheckCircle, BsThreeDotsVertical, BsChevronDown, BsFilter } from 'react-icons/bs';
import { FaTrophy, FaRegCalendarAlt, FaTasks } from 'react-icons/fa';

// Import Inter font
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

// Import custom styles
import './Dashbord.css';
import { useDispatch, useSelector } from 'react-redux';
import { EmployeeDashboardData } from '../../../redux/slices/Employee/MyJobsSlice';


const EmployeeDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Week');
  const dispatch = useDispatch()


  const { DasbordAll, loading, error } = useSelector((state) => state.MyJobs);

  console.log("DasbordAll", DasbordAll[0]?.data); 

  useEffect(() => {
    dispatch(EmployeeDashboardData());
  }, [dispatch]);

  const summary = DasbordAll[0]?.data?.summary || {};
  const todaysPerformance = DasbordAll[0]?.data?.todaysPerformance || {};
  const weeklyPerformance = DasbordAll[0]?.data?.weeklyPerformance || {};

  // Mock data for productivity leaderboard
  const leaderboardData = [
    {
      name: 'Michael Chen',
      avatar: 'MC',
      efficiency: 98,
      hoursWorked: 38,
      tasksCompleted: 24,
      isTopPerformer: true
    },
    {
      name: 'You',
      avatar: 'YO',
      efficiency: 85,
      hoursWorked: 32,
      tasksCompleted: 18,
      position: 2,
      positionChange: '+1'
    },
    {
      name: 'Sarah Williams',
      avatar: 'SW',
      efficiency: 75,
      hoursWorked: 30,
      tasksCompleted: 15,
      risingTalent: true
    }
  ];

  // Mock data for upcoming deadlines
  const upcomingDeadlines = [
    {
      title: 'Website Redesign',
      priority: 'High',
      dueDate: 'Tomorrow',
      assignedTo: 'Emma Davis',
      time: '5:00 PM'
    },
    {
      title: 'Q2 Sales Report',
      priority: 'Medium',
      dueDate: 'Friday',
      assignedTo: 'James Wilson',
      time: '3:00 PM'
    },
    {
      title: 'Client Presentation',
      priority: 'Normal',
      dueDate: 'Next Monday',
      teamMembers: 2,
      time: '2:00 PM'
    }
  ];

  // Mock data for task overview
  const taskOverview = {
    total: 26,
    completed: 14,
    pending: 12,
    completionPercentage: 54
  };

  // Mock data for today's performance
  // const todaysPerformance = {
  //   timeLogged: '4h 30m',
  //   weeklyHours: {
  //     completed: 22,
  //     total: 40,
  //     percentage: 55
  //   }
  // };

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'normal': return 'success';
      default: return 'secondary';
    }
  };

  const getPriorityBgClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-danger-subtle text-danger';
      case 'medium': return 'bg-warning-subtle text-warning';
      case 'normal': return 'bg-success-subtle text-success';
      default: return 'bg-secondary-subtle text-secondary';
    }
  };

  const getDueDateClass = (dueDate) => {
    switch (dueDate.toLowerCase()) {
      case 'tomorrow': return 'bg-danger-subtle text-danger';
      case 'friday': return 'bg-warning-subtle text-warning';
      default: return 'bg-warning-subtle text-warning';
    }
  };



  return (
    <div className="p-4" >

      {/* Metrics Cards */}
      <Row className="g-4 mb-4">
        <Col xs={6} md={3}>
          <Card style={{ borderRadius: '16px', boxShadow: '0 2px 4px rgba(145, 158, 171, 0.16)', border: 'none' }}>
            <Card.Body className="d-flex align-items-center">
              <div className="me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#E8F6FF', borderRadius: '12px' }}>
                <FaTasks style={{ color: '#2065D1' }} size={24} />
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#212B36', lineHeight: '1.2' }}>{summary.activeTasks || 0}</div>
                <div style={{ color: '#637381', fontSize: '14px' }}>Active Tasks</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={3}>
          <Card style={{ borderRadius: '16px', boxShadow: '0 2px 4px rgba(145, 158, 171, 0.16)', border: 'none' }}>
            <Card.Body className="d-flex align-items-center">
              <div className="me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#FFF7CD', borderRadius: '12px' }}>
                <BsClock style={{ color: '#FFB020' }} size={24} />
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#212B36', lineHeight: '1.2' }}>{summary.hoursLogged || "0h"}</div>
                <div style={{ color: '#637381', fontSize: '14px' }}>Hours Logged</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={3}>
          <Card style={{ borderRadius: '16px', boxShadow: '0 2px 4px rgba(145, 158, 171, 0.16)', border: 'none' }}>
            <Card.Body className="d-flex align-items-center">
              <div className="me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#E8FFF3', borderRadius: '12px' }}>
                <BsCheckCircle style={{ color: '#36B37E' }} size={24} />
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#212B36', lineHeight: '1.2' }}>{summary.completedTasks || 0}</div>
                <div style={{ color: '#637381', fontSize: '14px' }}>Completed Tasks</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={3}>
          <Card style={{ borderRadius: '16px', boxShadow: '0 2px 4px rgba(145, 158, 171, 0.16)', border: 'none' }}>
            <Card.Body className="d-flex align-items-center">
              <div className="me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#FFE7E7', borderRadius: '12px' }}>
                <FaTrophy style={{ color: '#FF4842' }} size={24} />
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#212B36', lineHeight: '1.2' }}>{summary.performance || 0}%</div>
                <div style={{ color: '#637381', fontSize: '14px' }}>Performance</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <div className="weekly-summary-container">
            <div className="weekly-summary-header">
              <h5 className="weekly-summary-title">
                <FaTrophy className="me-2" />
                Weekly Performance
              </h5>
              <div className="week-selector">
                <span>This Week</span>
                <BsChevronDown size={12} />
              </div>
            </div>

            <div className="achievement-grid">
              <div className="achievement-card">
                <div className="achievement-icon achievement-icon-primary">
                  <FaTasks size={20} />
                </div>
                <div className="achievement-content">
                  <div className="achievement-value">{weeklyPerformance.tasksCompleted || 0}</div>
                  <div className="achievement-label">Tasks Completed</div>
                  <div className="achievement-trend positive">
                    {weeklyPerformance.compare?.tasksCompleted}
                  </div>
                </div>
              </div>

              <div className="achievement-card">
                <div className="achievement-icon achievement-icon-success">
                  <BsClock size={20} />
                </div>
                <div className="achievement-content">
                  <div className="achievement-value">{weeklyPerformance.hoursLogged || "0h"}</div>
                  <div className="achievement-label">Hours Logged</div>
                  <div className="achievement-trend positive">
                    {weeklyPerformance.compare?.hoursLogged}
                  </div>
                </div>
              </div>

              <div className="achievement-card">
                <div className="achievement-icon achievement-icon-info">
                  <FaTrophy size={20} />
                </div>
                <div className="achievement-content">
                  <div className="achievement-value">{weeklyPerformance.goalProgress || 0}%</div>
                  <div className="achievement-label">Goal Progress</div>
                  <div className="achievement-trend neutral">
                    {/* You can map status here */}
                  </div>
                </div>
              </div>

              <div className="achievement-card">
                <div className="achievement-icon achievement-icon-warning">
                  <FaRegCalendarAlt size={20} />
                </div>
                <div className="achievement-content">
                  <div className="achievement-value">{weeklyPerformance.dueThisWeek || 0}</div>
                  <div className="achievement-label">Due This Week</div>
                  <div className="achievement-trend negative">
                    {weeklyPerformance.compare?.dueTasks}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="daily-performance-container">
            <div className="daily-performance-header">
              <h5 className="daily-performance-title">
                <BsClock className="me-2" />
                Today's Performance
              </h5>
              <div className="performance-date">
                <FaRegCalendarAlt size={14} className="me-2" />
                {todaysPerformance.date}
              </div>
            </div>

            <div className="time-stats-container">
              <div className="time-stat-card">
                <div className="time-stat-icon">
                  <BsClock size={20} />
                </div>
                <div className="time-stat-content">
                  <div className="time-stat-value">{todaysPerformance.hoursToday || "0h"}</div>
                  <div className="time-stat-label">Hours Today</div>
                </div>
                <div className="time-stat-trend positive">
                  {todaysPerformance.compare?.hoursToday}
                </div>
              </div>

              <div className="time-stat-card">
                <div className="time-stat-icon time-stat-icon-purple">
                  <BsCalendar size={20} />
                </div>
                <div className="time-stat-content">
                  <div className="time-stat-value">
                    {todaysPerformance.weeklyHours?.logged || "0h"}/{todaysPerformance.weeklyHours?.target || "0h"}
                  </div>
                  <div className="time-stat-label">Weekly Hours</div>
                </div>
              </div>
            </div>

            <div className="goal-progress-container">
              <div className="goal-progress-header">
                <div className="goal-label">Weekly Goal Progress</div>
                <div className="goal-percentage">{todaysPerformance.goalProgress?.percent || 0}%</div>
              </div>
              <div className="goal-progress-bar">
                <div className="goal-progress-value" style={{ width: `${todaysPerformance.goalProgress?.percent || 0}%` }} />
              </div>
              <div className="goal-progress-footer">
                <div className="goal-status">
                  <span className="status-dot status-dot-success"></span>
                  {todaysPerformance.goalProgress?.status}
                </div>
                <div className="goal-remaining">{todaysPerformance.goalProgress?.remainingHours} remaining</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* <Row className="g-4">
        <Col md={6}>
          <Card style={{ borderRadius: '16px', boxShadow: '0 2px 4px rgba(145, 158, 171, 0.16)', border: 'none' }}>
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <div className="d-flex align-items-center">
                <FaTrophy style={{ color: '#FFB020' }} size={20} className="me-2" />
                <h5 className="mb-0" style={{ color: '#212B36' }}>Productivity Leaderboard</h5>
              </div>
              <div className="d-flex align-items-center">
                <Dropdown className="me-2">
                  <Dropdown.Toggle variant="light" size="sm" style={{ backgroundColor: '#F4F6F8', border: 'none', fontSize: '13px' }}>
                    {selectedTimeframe} <BsChevronDown size={12} className="ms-1" />
                  </Dropdown.Toggle>
                </Dropdown>
                <button className="btn btn-light btn-sm" style={{ backgroundColor: '#F4F6F8', border: 'none', fontSize: '13px' }}>All Teams</button>
              </div>
            </Card.Header>
            <Card.Body className="px-4">
              {leaderboardData.map((user, index) => (
                <div key={index} className="mb-4" style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: index === 0 ? '#FFF7CD' : 'transparent',
                  border: index === 0 ? 'none' : '1px solid #F4F6F8'
                }}>
                  <div className="d-flex align-items-center">
                    <div className="me-3" style={{ fontWeight: '700', color: '#212B36', fontSize: '16px' }}>{index + 1}</div>
                    <div className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: index === 0 ? '#FFB020' : '#F4F6F8',
                        color: index === 0 ? 'white' : '#637381',
                        fontWeight: '600'
                      }}>
                      {user.avatar}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <h6 className="mb-0" style={{ color: '#212B36', fontWeight: '600' }}>{user.name}</h6>
                          {user.isTopPerformer && (
                            <span className="ms-2 px-2 py-1" style={{
                              color: '#FFB020',
                              fontSize: '12px',
                              backgroundColor: '#FFF7CD',
                              borderRadius: '6px',
                              fontWeight: '600'
                            }}>Top Performer</span>
                          )}
                          {user.positionChange && (
                            <span className="ms-2 px-2 py-1" style={{
                              color: '#36B37E',
                              fontSize: '12px',
                              backgroundColor: '#E8FFF3',
                              borderRadius: '6px',
                              fontWeight: '600'
                            }}>+{user.positionChange} position</span>
                          )}
                        </div>
                        <span style={{ fontWeight: '700', color: index === 0 ? '#FFB020' : '#2065D1', fontSize: '16px' }}>{user.efficiency}%</span>
                      </div>
                      <ProgressBar
                        now={user.efficiency}
                        style={{
                          height: '8px',
                          backgroundColor: '#F4F6F8',
                          borderRadius: '4px'
                        }}
                        variant={index === 0 ? 'warning' : 'primary'}
                        className="mb-2"
                      />
                      <div style={{ color: '#637381', fontSize: '13px' }}>
                        <span className="me-2">{user.hoursWorked}h worked</span>
                        <span style={{ color: '#919EAB' }}>•</span>
                        <span className="ms-2">{user.tasksCompleted} tasks completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center">
                <button className="btn btn-link" style={{ color: '#2065D1', textDecoration: 'none', fontSize: '13px' }}>View Full Leaderboard →</button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100" style={{ borderRadius: '16px', boxShadow: '0 2px 4px rgba(145, 158, 171, 0.16)', border: 'none' }}>
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <div className="d-flex align-items-center">
                <div className="me-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', backgroundColor: '#FFE7E7', borderRadius: '8px' }}>
                  <FaRegCalendarAlt style={{ color: '#FF4842' }} size={18} />
                </div>
                <h5 className="mb-0" style={{ color: '#212B36', fontWeight: '700' }}>Upcoming Deadlines</h5>
              </div>
              <button className="btn btn-light btn-sm d-flex align-items-center btn-action">
                <span className="me-1">+</span> Add Task
              </button>
            </Card.Header>
            <Card.Body className="px-4 pb-3">
              {upcomingDeadlines.map((task, index) => (
                <div key={index} className="mb-3 task-card" style={{ padding: '16px', borderRadius: '12px', border: '1px solid #F4F6F8', cursor: 'pointer' }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="mb-0" style={{ color: '#212B36', fontWeight: '600', fontSize: '14px' }}>{task.title}</h6>
                    <div className="d-flex align-items-center gap-2">
                      <span className="custom-badge" style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        backgroundColor: task.priority === 'High' ? '#FFE7E7' : task.priority === 'Medium' ? '#FFF7CD' : '#E8FFF3',
                        color: task.priority === 'High' ? '#FF4842' : task.priority === 'Medium' ? '#FFB020' : '#36B37E',
                        fontWeight: '600',
                        border: 'none'
                      }}>{task.priority} Priority</span>
                      <span className="custom-badge" style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        backgroundColor: task.dueDate === 'Tomorrow' ? '#FFE7E7' : task.dueDate === 'Next Monday' ? '#E8FFF3' : '#FFF7CD',
                        color: task.dueDate === 'Tomorrow' ? '#FF4842' : task.dueDate === 'Next Monday' ? '#36B37E' : '#FFB020',
                        fontWeight: '600',
                        border: 'none'
                      }}>{task.dueDate}</span>
                      <div className="dropdown">
                        <button className="btn btn-link p-0 d-flex align-items-center justify-content-center" style={{ color: '#637381', width: '24px', height: '24px' }}>
                          <BsThreeDotsVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <BsCalendar style={{ color: '#637381' }} size={14} className="me-2" />
                      <span style={{ color: '#637381', fontSize: '13px' }}>Due {task.dueDate} at {task.time}</span>
                    </div>
                    <div>
                      {task.assignedTo ? (
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle me-2" style={{ backgroundColor: '#2065D1' }}>
                            {task.assignedTo.split(' ').map(name => name[0]).join('')}
                          </div>
                          <span style={{ color: '#637381', fontSize: '13px' }}>Assigned to {task.assignedTo}</span>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center">
                          <div className="avatar-stack">
                            <div className="avatar-circle" style={{ backgroundColor: '#2065D1', zIndex: 1 }}>T1</div>
                            <div className="avatar-circle" style={{ backgroundColor: '#36B37E', zIndex: 0 }}>T2</div>
                          </div>
                          <span style={{ color: '#637381', fontSize: '13px' }} className="ms-2">{task.teamMembers} team members</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center mt-2">
                <button className="btn btn-link d-flex align-items-center mx-auto deadline-link">
                  View All Deadlines
                  <span className="ms-1" style={{ fontSize: '16px' }}>→</span>
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </div>
  );
};

export default EmployeeDashboard;

