import React from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FaTasks, FaProjectDiagram, FaFileInvoiceDollar, FaClipboardCheck, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchjobs } from '../../../redux/slices/JobsSlice';
import { Dropdown } from "react-bootstrap";
import { fetchProject } from '../../../redux/slices/ProjectsSlice';
import { fetchCostEstimates } from '../../../redux/slices/costEstimatesSlice';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashbord() {
  const dispatch = useDispatch()

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  const recentActivities = [
    { type: 'new', title: 'New project created', description: 'Premium Packaging Design - Client XYZ', time: '2 hours ago' },
    { type: 'completed', title: 'Project completed', description: 'Eco-friendly Bag Design - Client ABC', time: '1 day ago' },
    { type: 'po', title: 'New PO received', description: 'Design Update - Client DEF', time: '1 day ago' },
  ];

  // Fetch jobs on component mount
  useEffect(() => {
    dispatch(fetchjobs());
  }, [dispatch]);

  // Job In Progress 
  const { job ,loading, error} = useSelector((state) => state.jobs);  
  const { project} = useSelector((state) => state.projects);
  const { estimates } = useSelector((state) => state.costEstimates);

  useEffect(() => {
    dispatch(fetchjobs());
    dispatch(fetchProject());
    dispatch(fetchCostEstimates());
  }, [dispatch]);

  const inProgressProjects = (project?.data || []).filter(
    (j) => j.status?.toLowerCase() === "in progress"
  );
  const inProgressProjectsCount = inProgressProjects.length;

const inProgressJobs = (job?.jobs || []).filter(
  (j) => j.Status?.toLowerCase() === "in progress"
);
 const ProjectCompleted = (project?.data || []).filter(
    (j) => j.status?.toLowerCase() === "completed"
  );
  const projectCompleted = ProjectCompleted.length;
 
  
const inProgressCount = inProgressJobs.length;
const Costestimates = (estimates?.costEstimates || []).filter(
  // (j) => (j.POStatus || "").toLowerCase().replace(/\s|_/g, "") === "pending"
(j) => (j.Status || "").toLowerCase().replace(/\s|_/g, "") === "pending"
);
const CostestimatesCount = Costestimates.length;

const today = new Date().toLocaleDateString("en-CA");
const todaysJobs = (job?.jobs || []).filter((j) => {
  const dueDate = new Date(j.dueDate || j.createdAt).toLocaleDateString("en-CA");
  return dueDate === today;
});
const todaysJobsCount = todaysJobs.length;

 // Sample filtered data
const projects = project?.data || [];

// Count for each status
const activeProjectsCount = projects.filter(
  (j) => j.status?.toLowerCase() === "active project"
).length;

const completedProjectsCount = projects.filter(
  (j) => j.status?.toLowerCase() === "completed"
).length;

const cancelledProjectsCount = projects.filter(
  (j) => j.status?.toLowerCase() === "cancelled"
).length;

// Chart data
const projectStatusData = {
  labels: ['Active Project', 'Completed', 'Pending', 'Cancelled'],
  datasets: [{
    data: [
      activeProjectsCount,
      completedProjectsCount,
      inProgressProjectsCount,
      cancelledProjectsCount
    ],
    backgroundColor: ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444'],
    borderWidth: 0,
  }],
};

  return (
    <Container fluid className="container p-3">
      <Row className="g-4 mb-4">
        {/* Projects in Progress */}
        {/* Jobs in Progress */}
        <Col md={4} lg={4}>
          <Link to="/admin/DProjectInProgress" className="text-decoration-none w-100 d-block">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div
                  className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: "#e6f4ec", width: "50px", height: "50px" }}
                >
                  <FaTasks className="text-success" size={20} />
                </div>
                <div>
                  <h3 className="mb-0">{inProgressProjectsCount}</h3>
                  <p className="text-muted mb-0">Projects in Progress</p>
                  <small className="text-success">Active Projects</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col md={4} lg={4}>
          <Link to="/admin/DJobsInProgress" className="text-decoration-none w-100 d-block">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 bg-light-green me-3">
                  <FaProjectDiagram className="text-success" size={24} />
                </div>
                <div>
                  <h3 className="mb-0">{inProgressCount}</h3>
                  <p className="text-muted mb-0">Jobs in Progress</p>
                  <small className="text-info">Active Jobs</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>




        {/* Jobs Due Today */}
        <Col md={4} lg={4}>
          <Link to="/admin/DTodayJobsDue" className="text-decoration-none w-100 d-block">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 bg-light-yellow me-3">
                  <FaFileInvoiceDollar className="text-warning" size={24} />
                </div>
                <div>
                  <h3 className="mb-0">{todaysJobsCount}</h3>
                  <p className="text-muted mb-0">Jobs Due Today</p>
                  <small className="text-warning">Requires attention</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        {/* Cost Estimates Awaiting POs */}
        <Col md={4} lg={4}>
          <Link to="/admin/DCostEstimates" className="text-decoration-none w-100 d-block">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 bg-light-purple me-3">
                  <FaClipboardCheck className="text-purple" size={24} />
                </div>
                <div>
                  <h3 className="mb-0">{CostestimatesCount}</h3>
                  <p className="text-muted mb-0">Cost Estimates</p>
                  <small className="text-danger">Waiting to receive POs</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        {/* Completed Projects to be Invoiced */}
        <Col md={4} lg={4}>
          <Link to="/admin/DCompletedProject" className="text-decoration-none w-100 d-block">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 bg-light-red me-3">
                  <FaFileInvoiceDollar className="text-danger" size={24} />
                </div>
                <div>
                  <h3 className="mb-0">{projectCompleted}</h3>
                  <p className="text-muted mb-0">Completed Projects</p>
                  <small className="text-danger">To be Invoiced</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        {/* Timesheet Discrepancies */}
        {/* <Col md={4} lg={4}>
          <Link to="/admin/TimesheetWorklog" className="text-decoration-none w-100 d-block">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 bg-light-orange me-3">
                  <FaExclamationTriangle className="text-orange" size={24} />
                </div>
                <div>
                  <h3 className="mb-0">8</h3>
                  <p className="text-muted mb-0">Timesheet Discrepancies</p>
                  <small className="text-warning">Action needed</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col> */}
      </Row>

      <Row className="g-4">
        {/* Project Status Overview */}
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Project Status Overview</h5>
              <div style={{ height: '350px' ,marginLeft:"50px"}}>
                <Doughnut data={projectStatusData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Recent Activity</h5>
              {recentActivities.map((activity, index) => (
                <div key={index} className="d-flex align-items-start mb-3">
                  <div className={`rounded-circle p-2 bg-light-${activity.type === 'new' ? 'blue' : activity.type === 'completed' ? 'green' : 'yellow'} me-3`}>
                    {activity.type === 'new' && <FaProjectDiagram className="text-primary" />}
                    {activity.type === 'completed' && <FaClipboardCheck className="text-success" />}
                    {activity.type === 'po' && <FaFileInvoiceDollar className="text-warning" />}
                  </div>
                  <div>
                    <h6 className="mb-1">{activity.title}</h6>
                    <p className="text-muted mb-0">{activity.description}</p>
                    <small className="text-muted">{activity.time}</small>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashbord;





