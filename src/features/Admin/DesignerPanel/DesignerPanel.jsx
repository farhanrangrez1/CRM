import React, { useState, useMemo } from "react";
import { FaSearch, FaTrashAlt, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function DesignerPanel() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);

  const [designerList, setDesignerList] = useState([
    {
      name: "John Doe",
      email: "john@example.com",
      contact: "9876543210",
      department: "Graphics",
      address: "Delhi",
      experience: "5 Years",
      skills: "Photoshop, Illustrator",
      priority: "High",
      uploads: [],
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      contact: "8765432109",
      department: "UI/UX",
      address: "Mumbai",
      experience: "3 Years",
      skills: "Figma, XD",
      priority: "Medium",
      uploads: [],
    },
    {
      name: "Alex Johnson",
      email: "alex@example.com",
      contact: "9988776655",
      department: "Web",
      address: "Bangalore",
      experience: "4 Years",
      skills: "React, Node",
      priority: "Low",
      uploads: [],
    },
    {
      name: "Emily Brown",
      email: "emily@example.com",
      contact: "8877665544",
      department: "Branding",
      address: "Pune",
      experience: "2 Years",
      skills: "CorelDraw, Canva",
      priority: "High",
      uploads: [],
    },
  ]);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(designerList.length / itemsPerPage);

  const filteredList = useMemo(() => {
    return designerList.filter(
      (designer) =>
        designer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        designer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        designer.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [designerList, searchQuery]);

  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredList, currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleDelete = (email) => {
    if (window.confirm("Are you sure you want to delete this designer?")) {
      setDesignerList((prev) =>
        prev.filter((designer) => designer.email !== email)
      );
    }
  };

  const handleCheckboxChange = (email) => {
    if (selectedJobs.includes(email)) {
      setSelectedJobs((prev) => prev.filter((e) => e !== email));
    } else {
      setSelectedJobs((prev) => [...prev, email]);
    }
  };

  const handleReturnSelected = () => {
    if (selectedJobs.length === 0) {
      alert("Please select at least one job to return.");
      return;
    }
    const selectedJobDetails = designerList.filter((designer) =>
      selectedJobs.includes(designer.email)
    );
    navigate("/admin/return-report", { state: { selectedJobDetails } });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">All Designers</h4>
        <div className="d-flex gap-3">
          <button
            className="btn btn-warning d-flex align-items-center gap-2"
            onClick={handleReturnSelected}
          >
            Return jobs
          </button>
          <Link to="/admin/AddDesignerPanel">
            <button className="btn btn-dark d-flex align-items-center gap-2">
              <FaPlus /> Add Designer
            </button>
          </Link>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search designer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Experience</th>
                  <th>Skills</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map((designer, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(designer.email)}
                        onChange={() => handleCheckboxChange(designer.email)}
                      />
                    </td>
                    <td>{designer.name}</td>
                    <td>{designer.email}</td>
                    <td>{designer.contact}</td>
                    <td>{designer.department}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          designer.priority === "High"
                            ? "danger"
                            : designer.priority === "Medium"
                            ? "warning"
                            : "secondary"
                        }`}
                      >
                        {designer.priority}
                      </span>
                    </td>
                    <td>{designer.experience}</td>
                    <td>{designer.skills}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-link text-danger p-0"
                        onClick={() => handleDelete(designer.email)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted small">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredList.length)} of{" "}
          {filteredList.length} entries
        </div>
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default DesignerPanel;
