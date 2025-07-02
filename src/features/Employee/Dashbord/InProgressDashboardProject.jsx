// import React, { useState } from "react";
// import { Button, Form, Table, ProgressBar, Pagination, Modal } from "react-bootstrap";
// import { FaComments, FaExchangeAlt } from "react-icons/fa";
// import { BsPencil, BsTrash, BsXCircle } from "react-icons/bs";
// import { Link } from "react-router-dom";

// function InProgressDashboardProject() {
//   const [showDesignerModal, setShowDesignerModal] = useState(false);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [selectedJobs, setSelectedJobs] = useState({}); 

//   const designers = [
//     "Sarah Chen",
//     "Mike Johnson",
//     "Alex Wong",
//     "John Smith",
//     "Emma Davis"
//   ];

//   const jobs = [
//     {
//       id: "00001",
//       project: "PackageRedesign",
//       designer: "SarahChen",
//       timeSpent: "12h 30m",
//       progress: 75,
//       status: "assigned"
//     },
//     {
//       id: "00002",
//       project: "BrandGuidelines",
//       designer: "MikeJohnson",
//       timeSpent: "8h 45m",
//       progress: 45,
//       status: "in-progress"
//     },
//     {
//       id: "00003",
//       project: "Marketing Materials",
//       designer: "Alex Wong",
//       timeSpent: "15h 20m",
//       progress: 90,
//       status: "review"
//     },
//   ];

//   const handleSwitchDesigner = (jobId) => {
//     console.log("Switching designer for job:", jobId);
//   };

//   const handleCancelBrief = (jobId) => {
//     console.log("Cancelling brief for job:", jobId);
//   };

//   const handleCheckboxChange = (jobId) => {
//     setSelectedJobs((prev) => ({
//       ...prev,
//       [jobId]: !prev[jobId], 
//     }));
//   };

//   const handleSelectAll = (e) => {
//     const isChecked = e.target.checked;
//     const allJobs = jobs.reduce((acc, job) => {
//       acc[job.id] = isChecked;
//       return acc;
//     }, {});
//     setSelectedJobs(allJobs);
//   };

//    const [status, setStatus] = useState("In Process"); // Default to "In Process"

//    // Array of status options
//    const statusOptions = [
//      "All Status",
//      "In Process",
//      "Completed",
//      "Pending",
//      "Not Started",
//      "In Review",
//    ];

//    const handleChange = (event) => {
//      setStatus(event.target.value); // Update the selected status
//    };


//   return (
//     <div className="container bg-white p-4 mt-4 rounded shadow-sm">
//       {/* Title */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h5 className="fw-bold m-0">In Progress Project</h5>
//       </div>

//       {/* Filters */}
//       <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
//         <Form.Control
//           type="text"
//           placeholder="Search jobs..."
//           className="w-auto"
//         />
//         {/* <Form.Select className="w-auto">
//           <option>All Designers</option>
//         </Form.Select> */}
//         <Form.Select className="w-auto" value={status} onChange={handleChange}>
//           {statusOptions.map((statusOption, index) => (
//             <option key={index} value={statusOption}>
//               {statusOption}
//             </option>
//           ))}
//         </Form.Select>
//       </div>

//       {/* Table */}
//       <div className="border-start border-end rounded-2 overflow-hidden">
//         <Table hover responsive className="align-middle mb-0">
//           <thead className="table-light">
//             <tr>
//               <th>ProjectNo</th>
//               <th>Project</th>
//               {/* <th>Designer</th> */}
//               <th>TimeSpent</th>
//               <th>Status</th>
//               <th></th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {jobs.map((job) => (
//               <tr key={job.id}>
//                 <td>
//                   <Link to={"/OvervieJobs"}>{job.id}</Link>
//                 </td>
//                 <td>{job.project}</td>
//                 {/* <td onClick={() => handleDesignerClick(job)} style={{ cursor: 'pointer' }}>{job.designer}</td> */}
//                 <td>{job.timeSpent}</td>
//                 <td style={{ minWidth: "150px" }}>
//                   <ProgressBar now={job.progress} variant="success" />
//                 </td>
//                 <td>{job.brief}</td>
//                 <td style={{ whiteSpace: "nowrap" }}>
//                   <div className="d-flex gap-1 justify-content-center">
//                     <button className="btn btn-sm btn-outline-primary">
//                       <FaComments />
//                     </button>
//                     <button className="btn btn-sm btn-outline-primary">
//                       <BsPencil />
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-warning"
//                       onClick={() => handleSwitchDesigner(job.id)}
//                       title="Switch Designer"
//                     >
//                       <FaExchangeAlt />
//                     </button>
//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => handleCancelBrief(job.id)}
//                       title="Cancel Brief"
//                     >
//                       <BsXCircle />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="d-flex justify-content-between align-items-center mt-3">
//         <div>Showing 1 to 3 of 8 in-progress jobs</div>
//         <Pagination className="m-0">
//           <Pagination.Prev disabled />
//           <Pagination.Item active>{1}</Pagination.Item>
//           <Pagination.Item>{2}</Pagination.Item>
//           <Pagination.Item>{3}</Pagination.Item>
//           <Pagination.Next />
//         </Pagination>
//       </div>

//       {/* Designer Selection Modal */}
//       <Modal
//         show={showDesignerModal}
//         onHide={() => setShowDesignerModal(false)}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Select Designer</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group>
//               <Form.Label>Choose Designer</Form.Label>
//               <Form.Select
//                 onChange={(e) => handleDesignerChange(e.target.value)}
//                 defaultValue={selectedJob?.designer}
//               >
//                 <option value="">Select a designer...</option>
//                 {designers.map((designer, index) => (
//                   <option key={index} value={designer}>
//                     {designer}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// }

// export default InProgressDashboardProject;














import React, { useState } from "react";
import { Button, Form, Table, ProgressBar, Pagination, Modal } from "react-bootstrap";
import { FaComments, FaExchangeAlt } from "react-icons/fa";
import { BsPencil, BsTrash, BsXCircle } from "react-icons/bs";
import { Link } from "react-router-dom";

function InProgressDashboardProject() {
  const [showDesignerModal, setShowDesignerModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState({}); 

  const designers = [
    "Sarah Chen",
    "Mike Johnson",
    "Alex Wong",
    "John Smith",
    "Emma Davis"
  ];

  const jobs = [
    {
      id: "00001",
      project: "PackageRedesign",
      designer: "SarahChen",
      timeSpent: "12h 30m",
      progress: 75,
      status: "assigned"
    },
    {
      id: "00002",
      project: "BrandGuidelines",
      designer: "MikeJohnson",
      timeSpent: "8h 45m",
      progress: 45,
      status: "in-progress"
    },
    {
      id: "00003",
      project: "Marketing Materials",
      designer: "Alex Wong",
      timeSpent: "15h 20m",
      progress: 90,
      status: "review"
    },
  ];

  const handleSwitchDesigner = (jobId) => {
    console.log("Switching designer for job:", jobId);
  };

  const handleCancelBrief = (jobId) => {
    console.log("Cancelling brief for job:", jobId);
  };

  const handleCheckboxChange = (jobId) => {
    setSelectedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId], 
    }));
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const allJobs = jobs.reduce((acc, job) => {
      acc[job.id] = isChecked;
      return acc;
    }, {});
    setSelectedJobs(allJobs);
  };

   const [status, setStatus] = useState("In Process"); // Default to "In Process"

   // Array of status options
   const statusOptions = [
     "All Status",
     "In Process",
     "Completed",
     "Pending",
     "Not Started",
     "In Review",
   ];

   const handleChange = (event) => {
     setStatus(event.target.value); // Update the selected status
   };


  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase().trim()) {
      case "active project":
        return "bg-primary text-white";
      case "in progress":
      case "in_progress":
        return "bg-warning text-dark";
      case "completed":
        return "bg-success text-white";
      case "closed":
        return "bg-dark text-white";
      case "cancelled":
        return "bg-danger text-white";
      case "on hold":
        return "bg-info text-dark";
      case "review":
        return "bg-info text-dark";
      case "not started":
        return "bg-secondary text-white";
      case "open":
        return "bg-primary text-white";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="container bg-white p-4 mt-4 rounded shadow-sm">
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold m-0">In Progress Project</h5>
      </div>

      {/* Filters */}
      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <Form.Control
          type="text"
          placeholder="Search jobs..."
          className="w-auto"
        />
        {/* <Form.Select className="w-auto">
          <option>All Designers</option>
        </Form.Select> */}
        <Form.Select className="w-auto" value={status} onChange={handleChange}>
          {statusOptions.map((statusOption, index) => (
            <option key={index} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </Form.Select>
      </div>

      {/* Table */}
      <div className="border-start border-end rounded-2 overflow-hidden">
        <Table hover responsive className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>ProjectNo</th>
              <th>Project</th>
              {/* <th>Designer</th> */}
              <th>TimeSpent</th>
              <th>Status</th>
              <th></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>
                  <Link to={"/admin/ProjectOverview"}>{job.id}</Link>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{job.project}</td>
                {/* <td onClick={() => handleDesignerClick(job)} style={{ cursor: 'pointer' }}>{job.designer}</td> */}
                <td>{job.timeSpent}</td>
                <td>
                  <span className={`badge ${getStatusClass(job.status)} px-2 py-1`}>
                    {job.status}
                  </span>
                </td>

                <td>{job.brief}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <div className="d-flex gap-1 justify-content-center">
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => handleSwitchDesigner(job.id)}
                      title="Switch Designer"
                    >
                      <FaExchangeAlt />
                    </button>
                       <button className="btn btn-sm btn-outline-primary">
                      <BsPencil />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>Showing 1 to 3 of 8 in-progress jobs</div>
        <Pagination className="m-0">
          <Pagination.Prev disabled />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Item>{2}</Pagination.Item>
          <Pagination.Item>{3}</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      </div>

      {/* Designer Selection Modal */}
      <Modal
        show={showDesignerModal}
        onHide={() => setShowDesignerModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Designer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Choose Designer</Form.Label>
              <Form.Select
                onChange={(e) => handleDesignerChange(e.target.value)}
                defaultValue={selectedJob?.designer}
              >
                <option value="">Select a designer...</option>
                {designers.map((designer, index) => (
                  <option key={index} value={designer}>
                    {designer}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default InProgressDashboardProject;