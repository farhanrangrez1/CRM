// import { useEffect, useState } from "react";
// import { Table, Card, Container } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axios from 'axios';


// const JobCost = ({ jobStatus, refreshTrigger }) => {

//   const [invoice, setInvoice] = useState(null);
//   useEffect(() => {
//     const storedInvoice = localStorage.getItem("invoice");
//     if (storedInvoice) {
//       setInvoice(JSON.parse(storedInvoice));
//     }
//   }, []);

//   const proposalId = localStorage.getItem("proposalId")

//   const [data, setData] = useState()
//   const getData = async () => {
//     try {
//       const response = await axios.get(`https://netaai-crm-backend-production-c306.up.railway.app/api/job_planning`);

//       if (response.status === 200) {
//         // console.log('Data received:', response.data.data);
//         setData(response.data?.data)
//         return response.data;
//       } else {
//         throw new Error('Unexpected response status');
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error.response?.data?.message || error.message);
//       return null;
//     }
//   };
//   useEffect(() => {
//     getData();
//   }, [refreshTrigger]);

//   // const tableData = generateRandomData(10);

//   return (
//     <Container className="py-4 d-flex justify-content-between">
//       <Card className="shadow-sm">
//         <Card.Header className="bg-primary text-white">
//           <h4 className="mb-0">Project Details</h4>
//         </Card.Header>
//         <Card.Body>
//           <div className="table-responsive">
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Phase Name</th>
//                   <th>Job Status</th>
//                   <th>Total Budget</th>
//                   {/* <th>Lead</th> */}
//                   <th>Estimated Start</th>
//                   <th>Estimated Completion</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data?.filter((item) => item.proposal_id == invoice?._id)?.map((item) => (
//                   <tr key={item?.id}>
//                     <td>{item?.id}</td>
//                     <td>
//                       {/* <span className={`badge ${
//                         item.jobStatus === "Not Started" ? "bg-secondary" :
//                         item.jobStatus === "In Progress" ? "bg-primary" :
//                         item.jobStatus === "Completed" ? "bg-success" :
//                         item.jobStatus === "On Hold" ? "bg-warning" : "bg-danger"
//                       }`}> */}
//                       {jobStatus}
//                       {/* </span> */}
//                     </td>
//                     <td>{item?.phase_name}</td>
//                     <td>${item?.total_budget}</td>
//                     {/* <td>{item?.lead}</td> */}
//                     <td>{item?.estimated_start}</td>
//                     <td>{item?.estimated_completion}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </Card.Body>
//       </Card>
//       <Card className="shadow-sm" style={{ width: "300px", maxWidth: "350px" }}>
//         <Card.Header className="bg-primary text-white">
//           <h4 className="mb-0">Project Review</h4>
//         </Card.Header>
//         <Card.Body>
//           <div className="d-flex justify-content-between">
//             <div>Total Material</div>
//             <div>$5000</div>
//           </div>
//           <div className="d-flex justify-content-between">
//             <div>Total Labour</div>
//             <div>$2000</div>
//           </div>
//           <div className="d-flex justify-content-between">
//             <div>Grand Total</div>
//             <div>$7000</div>
//           </div>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default JobCost;

import { useEffect, useState } from "react";
import { Table, Card, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

const JobCost = ({ jobStatus, refreshTrigger }) => {
  const [invoice, setInvoice] = useState(null);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    totalMaterial: 0,
    totalLabor: 0,
    grandTotal: 0,
  });

  // Load invoice from localStorage
  useEffect(() => {
    const storedInvoice = localStorage.getItem("invoice");
    if (storedInvoice) {
      setInvoice(JSON.parse(storedInvoice));
    }
  }, []);

  // Fetch data
  const getData = async () => {
    try {
      const response = await axios.get(
        `https://netaai-crm-backend-production-c306.up.railway.app/api/job_planning`
      );
      if (response.status === 200) {
        setData(response.data?.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.response?.data?.message || error.message);
    }
  };

  // Calculate summary whenever data or invoice changes
  useEffect(() => {
    if (data.length > 0 && invoice?._id) {
      const filteredJobs = data.filter(
        item => String(item.proposal_id) === String(invoice._id)
      );

      const totalMaterial = filteredJobs.reduce(
        (acc, job) => acc + parseFloat(job.materials_budget || 0),
        0
      );
      const totalLabor = filteredJobs.reduce(
        (acc, job) => acc + parseFloat(job.labor_budget || 0),
        0
      );

      setSummary({
        totalMaterial,
        totalLabor,
        grandTotal: totalMaterial + totalLabor,
      });
    }
  }, [data, invoice]);

  // Trigger data fetch on mount or refreshTrigger change
  useEffect(() => {
    getData();
  }, [refreshTrigger]);

  // Filter jobs for this invoice
  const filteredJobs = data.filter(
    item => String(item.proposal_id) === String(invoice?._id)
  );

  return (
    <Container className="py-4 d-flex justify-content-between flex-wrap gap-2">
      <Card className="shadow-sm flex-grow-1">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Project Details</h4>
        </Card.Header>
        <Card.Body>
          {invoice && filteredJobs.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Job Status</th>
                    <th>Total Budget</th>
                    <th>Date Of Expense</th>
                    {/* <th>Estimated Start</th>
                    <th>Estimated Completion</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((item, index) => (
                    <tr key={item.id}>
                      {/* <td>{item.id}</td> */}
                      <td>{index + 1}</td>
                      <td>{item.phase_name}</td>
                      <td>{jobStatus}</td>
                      <td>${parseFloat(item.total_budget).toFixed(2)}</td>
                      <td>
                        {item.estimated_start &&
                          new Date(item.estimated_start).toLocaleDateString("en-GB")}
                      </td>

                      {/* <td>{item.estimated_completion}</td> */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-muted">No matching jobs found for this project.</div>
          )}
        </Card.Body>
      </Card>

      <Card className="shadow-sm" style={{ width: "250px" }}>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Project Review</h4>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between">
            <div>Total Material</div>
            <div>${summary.totalMaterial.toFixed(2)}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div>Total Labour</div>
            <div>${summary.totalLabor.toFixed(2)}</div>
          </div>
          <hr />
          <div className="d-flex justify-content-between fw-bold">
            <div>Grand Total</div>
            <div>${summary.grandTotal.toFixed(2)}</div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JobCost;
