import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  FaTasks,
  FaProjectDiagram,
  FaFileInvoiceDollar,
  FaClipboardCheck,
  FaMoneyBill,
  FaCheckCircle,
  FaPauseCircle,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchjobs } from '../../../redux/slices/JobsSlice';
import { fetchProject } from '../../../redux/slices/ProjectsSlice';
import { fetchCostEstimates } from '../../../redux/slices/costEstimatesSlice';
import axios from 'axios';
import { apiUrl } from '../../../redux/utils/config';
import { fetchClient } from '../../../redux/slices/ClientSlice';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashbord() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchjobs());
    dispatch(fetchProject());
    dispatch(fetchCostEstimates());
  }, [dispatch]);

  const { job } = useSelector((state) => state.jobs);
  const { project } = useSelector((state) => state.projects);
  const { estimates } = useSelector((state) => state.costEstimates);
  const { Clients } = useSelector((state) => state.client);

  const [netaDashboardData, setNetaDashboardData] = useState({
    document_records: { total: 0, records: [] },
    daily_logs: { total: 0, records: [] },
    projects_document: { total: 0, records: [] },
    comments: { total: 0, records: [] },
    job_planning: { total: 0, records: [] },
  });

  useEffect(() => {
    const fetchNetaData = async () => {
      try {
        const response = await axios.get(`https://netaai-crm-backend-production-c306.up.railway.app/api/getRecentEntriess`);
        setNetaDashboardData(response.data.data); // Ensure you set the correct data
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally set an error state to display an error message in the UI
      }
    };

    fetchNetaData();
  }, []);

  useEffect(() => {
    dispatch(fetchClient());
  }, [dispatch]);


  const [dashboardData, setDashboardData] = useState({});

  const inProgressProjects = (project?.data || []).filter((j) => j.status === "Lead");
  const inProgressProjectsCount = inProgressProjects.length;

  const inProgressJobs = (project?.data || []).filter((j) => j.status === "Bidding");
  const inProgressCount = inProgressJobs.length;

  const HoldJobs = (project?.data || []).filter((j) => j.status === "Hold");
  const HoldJobsCount = HoldJobs.length;

  const ApprovedJobs = (project?.data || []).filter((j) => j.status === "Approved" || j.status === "Active Project");
  const ApprovedJobsCount = ApprovedJobs.length;

  const ProjectCompleted = (project?.data || []).filter((j) => j.status?.toLowerCase() === "completed");
  const projectCompleted = ProjectCompleted.length;

  const Costestimates = (estimates?.costEstimates || []).filter((j) => (j.Status || "").toLowerCase().replace(/\s|_/g, "") === "pending");
  const CostestimatesCount = Costestimates.length;

  const todaysJobs = (project?.data || []).filter((j) => j.status === "Signature" || j.status === j.status === "Open");
  const todaysJobsCount = todaysJobs.length;

  const projects = project?.data || [];
  const leadProjects = projects.filter((j) => j.status === "Lead");
  const biddingProjects = projects.filter((j) => j.status === "Bidding");
  const signatureProjects = projects.filter((j) => ["Signature", "Open", "Active Project"].includes(j.status));

  const holdProjects = projects.filter((j) => j.status === "Hold");
  const approvedProjects = projects.filter((j) =>
    ["Approved", "Active Project"].includes(j.status)
  );

  const projectStatusData = {
    labels: ['Lead', 'Bidding', 'Signature/Open/Active', 'Hold', 'Approved'],
    datasets: [
      {
        data: [
          leadProjects.length,
          biddingProjects.length,
          signatureProjects.length,
          holdProjects.length,
          approvedProjects.length
        ],
        backgroundColor: [
          '#F59E0B', // Lead - Amber
          '#3B82F6', // Bidding - Blue
          '#22C55E', // Signature/Open/Active - Green
          '#EF4444', // Hold - Red
          '#10B981'  // Approved - Emerald
        ],
        borderWidth: 0,
      },
    ],
  };


  const chartOptions = {
    cutout: '70%',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${apiUrl}/dashboard/getCombinedDashboard`);
      console.log(response?.data);

      setDashboardData(response?.data);
    };
    fetchData();
  }, []);

  // Create recent activities from projects and cost estimates
  const recentActivities = [];

  // Add recent project activities
  projects?.map(project => {
    recentActivities.push({
      type: 'new',
      title: 'New project created',
      description: `${project.projectName} - Client ${project.clientId?.clientName || 'Unknown'}`,
      time: new Date(project.createdAt).toLocaleDateString('en-GB')
    });
  });

  // Split activities by type
  const projectActivities = recentActivities.filter(act => act.type === 'new');
  const proposalActivities = recentActivities.filter(act => act.type === 'po');

  return (
    <Container fluid className="p-3">
      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} md={6} lg={4}>
          <Link to="/admin/DProjectInProgress" className="text-decoration-none w-100 d-block">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#e6f4ec", width: "3rem", height: "3rem" }}>
                  <FaTasks className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="mb-0 fs-4">{inProgressProjectsCount}</h3>
                  <small className="text-primary">Projects in Lead</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col xs={12} sm={12} md={6} lg={4}>
          <Link to="/admin/DJobsInBidding" className="text-decoration-none w-100 d-block">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center bg-light" style={{ width: "3rem", height: "3rem" }}>
                  <FaProjectDiagram className="text-warning" size={24} />
                </div>
                <div>
                  <h3 className="mb-0 fs-4">{inProgressCount}</h3>
                  <small className="text-warning">Projects in Bidding</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col xs={12} sm={12} md={6} lg={4}>
          <Link to="/admin/DProjectInSignature" className="text-decoration-none w-100 d-block">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center bg-light" style={{ width: "3rem", height: "3rem" }}>
                  <FaFileInvoiceDollar className="text-success" size={24} />
                </div>
                <div>
                  <h3 className="mb-0 fs-4">{todaysJobsCount}</h3>
                  <small className="text-success">Projects Signature</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>


        <Col xs={12} sm={12} md={6} lg={4}>
          <Link to="/admin/DProjectsHold" className="text-decoration-none w-100 d-block">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center bg-light" style={{ width: "3rem", height: "3rem" }}>
                  <FaPauseCircle className="text-danger" size={24} />
                </div>
                <div>
                  <h3 className="mb-0 fs-4">{HoldJobsCount}</h3>
                  <small className="text-danger">Projects on Hold</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col xs={12} sm={12} md={6} lg={4}>
          <Link to="/admin/DProjectsApproved" className="text-decoration-none w-100 d-block">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center bg-light" style={{ width: "3rem", height: "3rem" }}>
                  <FaCheckCircle className="text-success" size={24} />
                </div>
                <div>
                  <h3 className="mb-0 fs-4">{ApprovedJobsCount}</h3>
                  <small className="text-success">Approved Projects</small>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>



      <Row className="g-4 mb-4">
        <Col xs={12} sm={12} md={6} lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#e6f4ec", width: "3rem", height: "3rem" }}>
                <FaMoneyBill style={{ color: "green" }} size={20} />
              </div>
              <div>
                <h3 className="mb-0 fs-4">${dashboardData?.totalPaid}</h3>
                <small style={{ color: "green" }}>Total Paid Amount For All Projects</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6} lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center bg-light" style={{ width: "3rem", height: "3rem" }}>
                <FaProjectDiagram className="text-danger" size={24} />
              </div>
              <div>
                <h3 className="mb-0 fs-4">${dashboardData?.totalDue}</h3>
                <small className="text-danger">Total Due Amount For All Projects</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Project Status Overview</h5>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '50%' }}>
                <Doughnut
                  data={projectStatusData}
                  options={chartOptions}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Recent Activity</h5>
              <Row>
                <Col xs={12} md={6}>
                  <h6 className="mb-3">Projects</h6>
                  {projectActivities.reverse().slice(0, 4).map((activity, index) => (
                    <div key={index} className="d-flex align-items-start mb-3">
                      <div className="rounded-circle p-2 me-3 bg-light">
                        <FaProjectDiagram className="text-primary" />
                      </div>
                      <div>
                        <h6 className="mb-1">{activity.title}</h6>
                        <p className="text-muted mb-0">{activity.description}</p>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </div>
                  ))}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Document Records Section */}
      {/* Document Records Section */}
      {/* <Row className="g-4 mb-4 mt-4">
        <Col xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Document Records</h5>
              {netaDashboardData?.document_records?.records?.reverse().slice(0, 4).map((record) => (
                <div key={record.id} className="mb-3">
                  <h6>Record ID: {record.id}</h6>
                  <p>Client ID: {record.client_id}</p>
                  <p>Proposal ID: {record.proposal_id}</p>
                  <p>Created At: {new Date(record.created_at).toLocaleString()}</p>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
      {/* Daily Logs Section */}
      {/* Daily Logs Section */}
      {/* <Row className="g-4 mb-4">
        <Col xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Daily Logs</h5>
              {netaDashboardData?.daily_logs?.records?.reverse().slice(0, 4).map((log) => (
                <div key={log.id} className="mb-3">
                  <h6>Log ID: {log.id}</h6>
                  <p>Job ID: {log.job_id}</p>
                  <p>Notes: {log.notes}</p>
                  <h6>Images:</h6>
                  <ul>
                    {log.images.map((image, index) => (
                      <li key={index}><a href={image} target="_blank" rel="noopener noreferrer">View Image</a></li>
                    ))}
                  </ul>
                  <p>Created At: {new Date(log.created_at).toLocaleString()}</p>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row> */}

      {/* Projects Document Section */}
      {/* Projects Document Section */}
      {/* <Row className="g-4 mb-4">
        <Col xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Projects Document</h5>
              {netaDashboardData?.projects_document?.records?.reverse().slice(0, 4).map((doc) => (
                <div key={doc.id} className="mb-3">
                  <h6>Document ID: {doc.id}</h6>
                  <p>Proposal ID: {doc.proposal_id}</p>
                  <p>Title: {doc.title}</p>
                  <h6>File URLs:</h6>
                  <ul>
                    {doc.file_urls.map((url, index) => (
                      <li key={index}><a href={url} target="_blank" rel="noopener noreferrer">View Document</a></li>
                    ))}
                  </ul>
                  <p>Created At: {new Date(doc.created_at).toLocaleString()}</p>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row> */}

      {/* Comments Section */}
      {/* <Row className="g-4 mb-4">
        <Col xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Comments</h5>
              {netaDashboardData?.comments?.records?.reverse().slice(0, 4).map((comment) => (
                <div key={comment.id} className="mb-3">
                  <h6>Comment ID: {comment.id}</h6>
                  <p>User ID: {comment.user_id}</p>
                  <p>Daily Log ID: {comment.dailylog_id}</p>
                  <p>Comment: {comment.comment}</p>
                  <p>Created At: {new Date(comment.created_at).toLocaleString()}</p>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row> */}

      {/* Job Planning Section */}
      {/* Job Planning Section */}
      {/* <Row className="g-4 mb-4">
        <Col xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Job Planning</h5>
              {netaDashboardData?.job_planning?.records?.reverse().slice(0, 4).map((plan) => (
                <div key={plan.id} className="mb-3">
                  <h6>Plan ID: {plan.id}</h6>
                  <p>Proposal ID: {plan.proposal_id}</p>
                  <p>Estimated Start: {plan.estimated_start}</p>
                  <p>Estimated Completion: {plan.estimated_completion}</p>
                  <p>Total Budget: {plan.total_budget}</p>
                  <p>Phase Name: {plan.phase_name}</p>
                  <p>Created At: {new Date(plan.created_at).toLocaleString()}</p>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row> */}


    </Container>
  );
}

export default Dashbord;
