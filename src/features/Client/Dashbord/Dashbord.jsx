
// import React, { useEffect, useState } from 'react';
// import { Card, Row, Col, Badge, ProgressBar, Dropdown } from 'react-bootstrap';
// import { BsCalendar, BsClock, BsCheckCircle, BsThreeDotsVertical, BsChevronDown, BsFilter } from 'react-icons/bs';
// import { FaTrophy, FaRegCalendarAlt, FaTasks, FaCheckCircle, FaPauseCircle, FaFileInvoiceDollar, FaProjectDiagram, FaMoneyBill } from 'react-icons/fa';

// import { Doughnut } from 'react-chartjs-2';
// import axios from 'axios';

// const EmployeeDashboard = () => {

//   const clientID = localStorage.getItem("clientId");

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await axios.get(`https://neta-crmmongo-backend-production.up.railway.app/api/client/getProjectsByClientId/6879467a636667e34926a2cf`)
//       // const res = await axios.get(`https://neta-crmmongo-backend-production.up.railway.app/api/client/getProjectsByClientId/${clientID}`)
//       console.log(res);
//     }


//     fetchData();
//   }, [])


//   const dummyProjectStatusData = {
//     labels: ['In Progress', 'Completed', 'On Hold'],
//     datasets: [
//       {
//         data: [40, 35, 25],
//         backgroundColor: ['#007bff', '#28a745', '#ffc107'],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const dummyChartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'bottom',
//       },
//     },
//   };

//   const dummyProjectActivities = [
//     {
//       title: 'New Bid Submitted',
//       description: 'A new bid was placed on Project Alpha.',
//       time: '2 hours ago',
//     },
//     {
//       title: 'Project Approved',
//       description: 'Project Beta has been approved.',
//       time: 'Yesterday',
//     },
//     {
//       title: 'Payment Received',
//       description: '₹1,00,000 received for Project Gamma.',
//       time: '2 days ago',
//     },
//     {
//       title: 'Hold Removed',
//       description: 'Project Delta resumed after hold.',
//       time: '3 days ago',
//     },
//   ];


//   return (
//     <div className="p-4" >

//       <Row className="g-4 mb-4">
//         <Col xs={12} sm={12} md={6} lg={4}>
//           <Card className="h-100 shadow-sm">
//             <Card.Body className="d-flex align-items-center">
//               <div
//                 className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center"
//                 style={{ backgroundColor: "#e6f4ec", width: "3rem", height: "3rem" }}
//               >
//                 <FaTasks className="text-primary" size={20} />
//               </div>
//               <div>
//                 <h3 className="mb-0 fs-4">12</h3>
//                 <small className="text-primary">Projects in Lead</small>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col xs={12} sm={12} md={6} lg={4}>
//           <Card className="h-100 shadow-sm">
//             <Card.Body className="d-flex align-items-center">
//               <div
//                 className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center bg-light"
//                 style={{ width: "3rem", height: "3rem" }}
//               >
//                 <FaProjectDiagram className="text-warning" size={24} />
//               </div>
//               <div>
//                 <h3 className="mb-0 fs-4">5</h3>
//                 <small className="text-warning">Projects in Bidding</small>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col xs={12} sm={12} md={6} lg={4}>
//           <Card className="h-100 shadow-sm">
//             <Card.Body className="d-flex align-items-center">
//               <div
//                 className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center bg-light"
//                 style={{ width: "3rem", height: "3rem" }}
//               >
//                 <FaFileInvoiceDollar className="text-success" size={24} />
//               </div>
//               <div>
//                 <h3 className="mb-0 fs-4">8</h3>
//                 <small className="text-success">Projects Signature</small>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col xs={12} sm={12} md={6} lg={4}>
//           <Card className="h-100 shadow-sm">
//             <Card.Body className="d-flex align-items-center">
//               <div
//                 className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center bg-light"
//                 style={{ width: "3rem", height: "3rem" }}
//               >
//                 <FaPauseCircle className="text-danger" size={24} />
//               </div>
//               <div>
//                 <h3 className="mb-0 fs-4">3</h3>
//                 <small className="text-danger">Projects on Hold</small>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col xs={12} sm={12} md={6} lg={4}>
//           <Card className="h-100 shadow-sm">
//             <Card.Body className="d-flex align-items-center">
//               <div
//                 className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center bg-light"
//                 style={{ width: "3rem", height: "3rem" }}
//               >
//                 <FaCheckCircle className="text-success" size={24} />
//               </div>
//               <div>
//                 <h3 className="mb-0 fs-4">10</h3>
//                 <small className="text-success">Approved Projects</small>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row className="g-4 mb-4">
//         <Col xs={12} sm={12} md={6} lg={4}>
//           <Card className="h-100 shadow-sm">
//             <Card.Body className="d-flex align-items-center">
//               <div
//                 className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center"
//                 style={{ backgroundColor: "#e6f4ec", width: "3rem", height: "3rem" }}
//               >
//                 <FaMoneyBill style={{ color: "green" }} size={20} />
//               </div>
//               <div>
//                 <h3 className="mb-0 fs-4">₹12,50,000</h3>
//                 <small style={{ color: "green" }}>Total Paid Amount For All Projects</small>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col xs={12} sm={12} md={6} lg={4}>
//           <Card className="h-100 shadow-sm">
//             <Card.Body className="d-flex align-items-center">
//               <div
//                 className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center bg-light"
//                 style={{ width: "3rem", height: "3rem" }}
//               >
//                 <FaProjectDiagram className="text-danger" size={24} />
//               </div>
//               <div>
//                 <h3 className="mb-0 fs-4">₹3,75,000</h3>
//                 <small className="text-danger">Total Due Amount For All Projects</small>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row className="g-4">
//         <Col xs={12} md={6}>
//           <Card className="h-100 shadow-sm">
//             <Card.Body>
//               <h5 className="card-title mb-4">Project Status Overview</h5>
//               <div className="d-flex justify-content-center align-items-center">
//                 <div style={{ width: '100%', maxWidth: '250px' }}>
//                   <Doughnut
//                     data={dummyProjectStatusData}
//                     options={dummyChartOptions}
//                   />
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col xs={12} md={6}>
//           <Card className="h-100 shadow-sm">
//             <Card.Body>
//               <h5 className="card-title mb-4">Recent Activity</h5>
//               <Row>
//                 <Col xs={12} md={6}>
//                   <h6 className="mb-3">Projects</h6>
//                   {dummyProjectActivities.map((activity, index) => (
//                     <div key={index} className="d-flex align-items-start mb-3">
//                       <div className="rounded-circle p-2 me-3 bg-light">
//                         <FaProjectDiagram className="text-primary" />
//                       </div>
//                       <div>
//                         <h6 className="mb-1">{activity.title}</h6>
//                         <p className="text-muted mb-0">{activity.description}</p>
//                         <small className="text-muted">{activity.time}</small>
//                       </div>
//                     </div>
//                   ))}
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default EmployeeDashboard;

import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import {
  FaTasks,
  FaProjectDiagram,
  FaFileInvoiceDollar,
  FaPauseCircle,
  FaCheckCircle,
  FaMoneyBill
} from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { apiUrl } from '../../../redux/utils/config';

const EmployeeDashboard = () => {
  const clientID = localStorage.getItem("clientId");
  const [projects, setProjects] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    Lead: 0,
    Bidding: 0,
    Signature: 0,
    Hold: 0,
    Approved: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await axios.get(`${apiUrl}/client/getProjectsByClientId/${clientID}`);
        const res = await axios.get(`${apiUrl}/client/getProjectsByClientId/${clientID}`);
        const projectsArray = res.data.data || [];

        setProjects(projectsArray);

        // Calculate totals
        const paidSum = projectsArray.reduce((sum, p) => sum + (parseFloat(p.totalPaid) || 0), 0);
        const dueSum = projectsArray.reduce((sum, p) => sum + (parseFloat(p.totalDue) || 0), 0);

        setTotalPaid(paidSum);
        setTotalDue(dueSum);

        // Status counts
        const counts = {
          Lead: 0,
          Bidding: 0,
          Signature: 0,
          Hold: 0,
          Approved: 0
        };

        projectsArray.forEach(project => {
          const status = project.status?.toLowerCase() || '';
          if (status.includes("lead")) counts.Lead++;
          if (status.includes("bidding")) counts.Bidding++;
          if (status.includes("signature")) counts.Signature++;
          if (status.includes("hold")) counts.Hold++;
          if (status.includes("approved")) counts.Approved++;
        });

        setStatusCounts(counts);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchData();
  }, [clientID]);

  const doughnutData = {
    labels: ['In Progress', 'Approved', 'On Hold'],
    datasets: [
      {
        data: [
          projects.filter(p => p.status?.toLowerCase() === "in progress").length,
          projects.filter(p => p.status?.toLowerCase() === "approved").length,
          projects.filter(p => p.status?.toLowerCase().includes("hold")).length
        ],
        backgroundColor: ['#007bff', '#28a745', '#ffc107'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  return (
    <div className="p-4">
      <Row className="g-4 mb-4">
        <StatCard icon={<FaTasks />} color="primary" count={statusCounts.Lead} label="Projects in Lead" />
        <StatCard icon={<FaProjectDiagram />} color="warning" count={statusCounts.Bidding} label="Projects in Bidding" />
        <StatCard icon={<FaFileInvoiceDollar />} color="success" count={statusCounts.Signature} label="Projects Signature" />
        <StatCard icon={<FaPauseCircle />} color="danger" count={statusCounts.Hold} label="Projects on Hold" />
        <StatCard icon={<FaCheckCircle />} color="success" count={statusCounts.Approved} label="Approved Projects" />
      </Row>

      <Row className="g-4 mb-4">
        <AmountCard icon={<FaMoneyBill />} color="green" amount={totalPaid} label="Total Paid Amount For All Projects" />
        <AmountCard icon={<FaProjectDiagram />} color="red" amount={totalDue} label="Total Due Amount For All Projects" />
      </Row>

      <Row className="g-4">
        <Col xs={12} md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Project Status Overview</h5>
              <div className="d-flex justify-content-center align-items-center">
                <div style={{ width: '100%', maxWidth: '250px' }}>
                  <Doughnut data={doughnutData} options={chartOptions} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-4">Recent Activity</h5>
              <p>Coming soon...</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Reusable card components
const StatCard = ({ icon, color, count, label }) => (
  <Col xs={12} sm={12} md={6} lg={4}>
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex align-items-center">
        <div
          className={`rounded-circle p-3 me-3 d-flex align-items-center justify-content-center bg-light`}
          style={{ width: "3rem", height: "3rem" }}
        >
          <div className={`text-${color}`}>{icon}</div>
        </div>
        <div>
          <h3 className="mb-0 fs-4">{count}</h3>
          <small className={`text-${color}`}>{label}</small>
        </div>
      </Card.Body>
    </Card>
  </Col>
);

const AmountCard = ({ icon, color, amount, label }) => (
  <Col xs={12} sm={12} md={6} lg={4}>
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex align-items-center">
        <div
          className={`rounded-circle p-3 me-3 d-flex align-items-center justify-content-center bg-light`}
          style={{ width: "3rem", height: "3rem" }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <div>
          <h3 className="mb-0 fs-4">₹{parseInt(amount).toLocaleString()}</h3>
          <small style={{ color }}>{label}</small>
        </div>
      </Card.Body>
    </Card>
  </Col>
);

export default EmployeeDashboard;
