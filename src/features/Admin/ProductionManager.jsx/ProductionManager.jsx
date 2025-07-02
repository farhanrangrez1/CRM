import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../ClientManagement/ClientManagement.css';

function ProductionManager() {
  const navigate = useNavigate();

  const [managers, setManagers] = useState([
    {
      id: 1,
      name: 'Amit Sharma',
      department: 'Manufacturing',
      email: 'amit@company.com',
      contact: '+91 9876543210',
      totalProjects: 10,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Rohit Verma',
      department: 'Packaging',
      email: 'rohit@company.com',
      contact: '+91 7894561230',
      totalProjects: 6,
      status: 'Inactive'
    },
    {
      id: 3,
      name: 'Priya Desai',
      department: 'Quality Control',
      email: 'priya@company.com',
      contact: '+91 9632587410',
      totalProjects: 12,
      status: 'Active'
    }
  ]);

  const [filteredManagers, setFilteredManagers] = useState([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  useEffect(() => {
    const filtered = managers.filter(manager => {
      const searchMatch =
        manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.department.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch =
        statusFilter === 'All Status' || manager.status === statusFilter;

      return searchMatch && statusMatch;
    });
    setFilteredManagers(filtered);
  }, [searchTerm, statusFilter, managers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredManagers.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredManagers.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleManagerAction = (action, id) => {
    switch (action) {
      case 'view':
        navigate(`/admin/ViewdetailsProductionManager`);
        break;
      case 'delete':
        break;
      case 'export':
        break;
      default:
        break;
    }
  };

  return (
    <Container fluid className="p-4">
      <Row className="bg-white p-3 rounded">
        <Col><h2>Production Manager List</h2></Col>

        <Row className="my-3">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search Production Manager..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </Col>

          <Col md={2}>
            <Dropdown>
              <Dropdown.Toggle variant="light" className="w-100">
                {statusFilter}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleStatusFilter('All Status')}>All Status</Dropdown.Item>
                <Dropdown.Item onClick={() => handleStatusFilter('Active')}>Active</Dropdown.Item>
                <Dropdown.Item onClick={() => handleStatusFilter('Inactive')}>Inactive</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>

          <Col md={{ span: 2, offset: 4 }}>
            <Link to="/admin/AddProductionManager">
              <Button variant="dark" className="w-100">
                + Add Manager
              </Button>
            </Link>
          </Col>
        </Row>

        <Table responsive borderless hover className="text-center" >
  <thead>
    <tr>
      <th>Name</th>
      <th>Department</th>
      <th>Email</th>
      <th>Contact</th>
      <th>Projects</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {getCurrentPageData().map(manager => (
      <tr key={manager.id}>
        <td>{manager.name}</td>
        <td>{manager.department}</td>
        <td>{manager.email}</td>
        <td>{manager.contact}</td>
        <td>{manager.totalProjects}</td>
        <td>
          <span className={`badge ${manager.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
            {manager.status}
          </span>
        </td>
        <td>
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="text-dark">
              <FaEllipsisV />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleManagerAction('view', manager.id)}>View</Dropdown.Item>
              <Dropdown.Item onClick={() => handleManagerAction('delete', manager.id)}>Delete</Dropdown.Item>
              <Dropdown.Item onClick={() => handleManagerAction('export', manager.id)}>Export</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    ))}
  </tbody>
</Table>


        <Row className="mt-3">
          <Col>
            <small>Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredManagers.length)} to {Math.min(currentPage * itemsPerPage, filteredManagers.length)} of {filteredManagers.length} Managers</small>
          </Col>
          <Col className="text-end">
            <Button variant="light" className="me-2" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'dark' : 'light'}
                className="me-2"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button variant="light" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</Button>
          </Col>
        </Row>
      </Row>
    </Container>
  );
}

export default ProductionManager;
