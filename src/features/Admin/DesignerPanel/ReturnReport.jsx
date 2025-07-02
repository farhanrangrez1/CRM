import React from "react";
import { useLocation, Link } from "react-router-dom";

function ReturnReport() {
  const location = useLocation();
  const { selectedJobDetails } = location.state || { selectedJobDetails: [] };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Returned Jobs Report</h4>
        <Link to="/admin/DesignerPanel">
          <button className="btn btn-dark">Back to Designer Panel</button>
        </Link>
      </div>

      {selectedJobDetails.length === 0 ? (
        <div className="alert alert-warning">No Jobs Selected to Return.</div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-bordered mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Priority</th>
                    <th>Experience</th>
                    <th>Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedJobDetails.map((designer, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{designer.name}</td>
                      <td>{designer.email}</td>
                      <td>{designer.contact}</td>
                      <td>{designer.department}</td>
                      <td>{designer.priority}</td>
                      <td>{designer.experience}</td>
                      <td>{designer.skills}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReturnReport;
