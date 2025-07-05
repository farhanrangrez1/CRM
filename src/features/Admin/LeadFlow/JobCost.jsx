import {useEffect} from "react";
import { Table, Card, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
 import axios from 'axios';
 
   const data = [
        {
            "id": 1,
            "proposal_id": 5,
            "estimated_start": "2025-08-05",
            "estimated_completion": "2025-08-20",
            "total_budget": "2500.00",
            "phase_name": "Electrical Wiring",
            "materials_budget": "1200.00",
            "labor_budget": "800.00",
            "subcontractors_budget": "200.00",
            "equipment_budget": "150.00",
            "miscellanea_budget": "150.00",
            "created_at": "2025-06-26T18:19:43.000Z"
        },
        {
            "id": 2,
            "proposal_id": 5,
            "estimated_start": "2025-10-01",
            "estimated_completion": "2025-10-10",
            "total_budget": "1800.00",
            "phase_name": "HVAC System Setup 12",
            "materials_budget": "600.00",
            "labor_budget": "700.00",
            "subcontractors_budget": "200.00",
            "equipment_budget": "200.00",
            "miscellanea_budget": "100.00",
            "created_at": "2025-07-02T13:02:06.000Z"
        },
        {
            "id": 3,
            "proposal_id": 8,
            "estimated_start": "2025-07-05",
            "estimated_completion": "2025-07-12",
            "total_budget": "1200.00",
            "phase_name": "Foundation Work",
            "materials_budget": "500.00",
            "labor_budget": "400.00",
            "subcontractors_budget": "100.00",
            "equipment_budget": "100.00",
            "miscellanea_budget": "100.00",
            "created_at": "2025-06-26T18:20:27.000Z"
        }
    ]
const JobCost = () => {
  // Generate random data
   const proposalId = localStorage.getItem("proposalId")
 

// const getData = async () => {
//   try {
//     const response = await axios.get(`https://netaai-crm-backend-production-c306.up.railway.app/api/job_planning/getBudgetSummaryByProposalId/${proposalId}`);

//     if (response.status === 200) {
//       console.log('Data received:', response.data);
//       return response.data;
//     } else {
//       throw new Error('Unexpected response status');
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error.response?.data?.message || error.message);
//     return null;
//   }
// };
// useEffect(() => {
//   getData();
// }, []);

  // const generateRandomData = (count) => {
  //   const jobStatuses = ["Not Started", "In Progress", "Completed", "On Hold", "Cancelled"];
  //   const phases = ["Design", "Development", "Testing", "Deployment", "Maintenance"];
  //   const leads = ["$1,000.00", "$2,500.00", "$5,000.00", "$7,800.00", "$10,000.00"];
    
  // ;
    
  //   for (let i = 1; i <= count; i++) {
  //     const startDate = new Date();
  //     startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
      
  //     const endDate = new Date(startDate);
  //     endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 60) + 30);
      
  //     data.push({
  //       id: i,
  //       jobStatus: jobStatuses[Math.floor(Math.random() * jobStatuses.length)],
  //       phaseName: phases[Math.floor(Math.random() * phases.length)],
  //       totalBudget: (Math.random() * 10000 + 1000).toFixed(2),
  //       lead: leads[Math.floor(Math.random() * leads.length)],
  //       estimatedStart: startDate.toISOString().split('T')[0],
  //       estimatedCompletion: endDate.toISOString().split('T')[0]
  //     });
  //   }
    
  //   return data;
  // };

  // const tableData = generateRandomData(10);

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Project Details</h4>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Job Status</th>
                  <th>Phase Name</th>
                  <th>Total Budget</th>
                  <th>Lead</th>
                  <th>Estimated Start</th>
                  <th>Estimated Completion</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <span className={`badge ${
                        item.jobStatus === "Not Started" ? "bg-secondary" :
                        item.jobStatus === "In Progress" ? "bg-primary" :
                        item.jobStatus === "Completed" ? "bg-success" :
                        item.jobStatus === "On Hold" ? "bg-warning" : "bg-danger"
                      }`}>
                        {item.jobStatus}
                      </span>
                    </td>
                    <td>{item?.phase_name}</td>
                    <td>${item?.total_budget}</td>
                    {/* <td>{item?.lead}</td> */}
                    <td>{item.estimated_start}</td>
                    <td>{item?.estimated_completion}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JobCost;