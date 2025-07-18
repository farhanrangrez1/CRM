import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteproject, fetchProject } from "../../../redux/slices/ProjectsSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function DProjectInBidding() {
  const dispatch = useDispatch();
  const { project, loading, error } = useSelector((state) => state.projects);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProject());
  }, [dispatch]);

  const handleUpdateProjectCard = (project) => {
    navigate(`/admin/AddProjectList`, { state: { project } });
  };


  const handleDeleteProject = (projectId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the project!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteproject(projectId));
          await Swal.fire('Deleted!', 'Project has been deleted.', 'success');
          window.location.reload();
        } catch (error) {
          Swal.fire('Error!', 'Something went wrong.', 'error');
        }
      }
    });
  };

  const filteredProjects = (project?.data || [])
    .filter((j) => j.status === "Hold")
    .filter((proj) => {
      const query = searchQuery.toLowerCase();
      return (
        proj.projectName?.toLowerCase().includes(query) ||
        proj.clientId?.clientName?.toLowerCase().includes(query) ||
        proj.description?.toLowerCase().includes(query)
      );
    });

  return (
    <div className="container bg-white p-4 mt-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold m-0">Hold Projects</h4>
        <Form.Control
          type="text"
          placeholder="Search projects..."
          className="w-25"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">Error fetching projects</p>
        ) : filteredProjects.length === 0 ? (
          <p>No lead projects found.</p>
        ) : (
          <Table striped bordered hover>
            <thead className="table-light">
              <tr>
                <th>S.No.</th>
                <th>Project Name</th>
                <th>Client Name</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ whiteSpace: "nowrap" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((proj, index) => (
                <tr key={proj._id}>
                  <td>{index + 1}</td>
                  <td>{proj.projectName}</td>
                  <td>{proj.clientId?.clientName || "N/A"}</td>
                  <td>{proj.description}</td>
                  <td>
                    <span className="badge bg-warning">{proj.status}</span>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleUpdateProjectCard(proj)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteProject(proj._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default DProjectInBidding;
