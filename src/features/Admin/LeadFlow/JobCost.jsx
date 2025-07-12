import { useEffect, useState } from "react";
import { Table, Card, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';


const JobCost = ({ jobStatus, refreshTrigger }) => {

  const [invoice, setInvoice] = useState(null);
  useEffect(() => {
    const storedInvoice = localStorage.getItem("invoice");
    if (storedInvoice) {
      setInvoice(JSON.parse(storedInvoice));
    }
  }, []);

  const proposalId = localStorage.getItem("proposalId")

  const [data, setData] = useState()
  const getData = async () => {
    try {
      const response = await axios.get(`https://netaai-crm-backend-production-c306.up.railway.app/api/job_planning`);

      if (response.status === 200) {
        // console.log('Data received:', response.data.data);
        setData(response.data?.data)
        return response.data;
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Error fetching data:', error.response?.data?.message || error.message);
      return null;
    }
  };
  useEffect(() => {
    getData();
  }, [refreshTrigger]);

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
                  <th>Phase Name</th>
                  <th>Job Status</th>
                  <th>Total Budget</th>
                  {/* <th>Lead</th> */}
                  <th>Estimated Start</th>
                  <th>Estimated Completion</th>
                </tr>
              </thead>
              <tbody>
                {data?.filter((item) => item.proposal_id == invoice?._id)?.map((item) => (
                  <tr key={item?.id}>
                    <td>{item?.id}</td>
                    <td>
                      {/* <span className={`badge ${
                        item.jobStatus === "Not Started" ? "bg-secondary" :
                        item.jobStatus === "In Progress" ? "bg-primary" :
                        item.jobStatus === "Completed" ? "bg-success" :
                        item.jobStatus === "On Hold" ? "bg-warning" : "bg-danger"
                      }`}> */}
                      {jobStatus}
                      {/* </span> */}
                    </td>
                    <td>{item?.phase_name}</td>
                    <td>${item?.total_budget}</td>
                    {/* <td>{item?.lead}</td> */}
                    <td>{item?.estimated_start}</td>
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