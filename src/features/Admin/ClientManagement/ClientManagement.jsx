import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Form, Button, Table,
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaFilter } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteClients, fetchClient } from '../../../redux/slices/ClientSlice';
import Swal from 'sweetalert2';
import './ClientManagement.css';

function ClientManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({ industry: 'Client' });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);

  const { Clients } = useSelector((state) => state.client);

  useEffect(() => {
    dispatch(fetchClient());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Enhanced filtering logic
  const filteredClients = (Clients?.data || []).filter(client => {
    // Split searchTerm by spaces, ignore empty terms
    const terms = searchTerm.toLowerCase().trim().split(/\s+/).filter(Boolean);
    // Prepare searchable fields as strings
    const clientName = (client.clientName || '').toLowerCase();
    const contactPerson = (client.contactPersons?.[0]?.contactName || '').toLowerCase();
    const email = (client.contactPersons?.[0]?.email || '').toLowerCase();
    const phone = (client.contactPersons?.[0]?.phone || '').toLowerCase();
    const industry = (client.industry || '').toLowerCase();
    const fields = [
      clientName,
      contactPerson,
      email,
      phone,
      industry
    ];
    // Every term must be found in at least one field
    const matchesSearch = terms.length === 0 || terms.every(term =>
      fields.some(field => field.includes(term))
    );
    const matchesStatus = statusFilter === 'All' || 
      (client.Status || '').toLowerCase() === statusFilter.toLowerCase();
    const matchesIndustry = formData.industry === 'Client' || 
      (client.industry || '').toLowerCase() === formData.industry.toLowerCase();
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const getStatusBadgeClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return 'bg-success text-white px-2 py-1 rounded';
      case 'inactive':
        return 'bg-danger text-white px-2 py-1 rounded';
      default:
        return 'bg-secondary text-white px-2 py-1 rounded';
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteClients(id))
          .then(() => {
            Swal.fire('Deleted!', 'The document has been deleted.', 'success');
            dispatch(fetchClient());
          })
          .catch(() => {
            Swal.fire('Error!', 'Something went wrong.', 'error');
          });
      }
    });
  };

  const UpdateData = (client) => {
    navigate(`/admin/AddClientManagement`, { state: { client } });
  };

  return (
    <Container fluid className="p-4">
      <Row className="align-items-center p-3" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
        <Row className="mb-4 align-items-center">
          <Col>
            <h4>Client/Supplier</h4>
          </Col>
        </Row>

        {/* Filter Toggle for Mobile */}
        <div className="d-md-none mb-3">
          <Button variant="secondary" onClick={() => setShowMobileFilters(!showMobileFilters)}>
            <FaFilter /> Filters
          </Button>
        </div>

        {/* Filters - show by default on desktop, toggle on mobile */}
        {(showMobileFilters || window.innerWidth >= 768) && (
          <Row className="mb-4 align-items-center">
            <Col md={3} className="mb-2">
              <Form.Control
                type="search"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </Col>

            <Col md={2} className="mb-2">
              <Form.Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Col>

            <Col md={2} className="mb-2">
              <Form.Select 
                name="industry" 
                value={formData.industry} 
                onChange={handleChange}
              >
                <option value="Client">Client</option>
                <option value="Sup">Suppliers</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Col>

            <Col md className="mb-2 d-flex justify-content-md-end">
              <Link to="/admin/AddClientManagement">
                <Button id="All_btn" variant="primary">+ Add Company</Button>
              </Link>
            </Col>
          </Row>
        )}

        {/* Client Table */}
        <div className="table-responsive">
          <Table responsive className="align-middle client-table">
            <thead>
              <tr>
                <th>SL</th>
                <th style={{ whiteSpace: "nowrap" }}>Client Name</th>
                <th style={{ whiteSpace: "nowrap" }}>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Industry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentClients.length > 0 ? (
                currentClients.slice().reverse().map((client, index) => (
                  <tr key={client.id}>
                    <td>{indexOfFirstClient + index + 1}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{client.clientName || 'N/A'}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{client.contactPersons?.[0]?.contactName || 'N/A'}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{client.contactPersons?.[0]?.email || 'N/A'}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{client.contactPersons?.[0]?.phone || 'N/A'}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{client.industry || 'N/A'}</td>
                    <td>
                      <span className={getStatusBadgeClass(client.Status)}>
                        {client.Status || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons d-flex">
                        <Button onClick={() => UpdateData(client)} id="icone_btn" size="sm">
                          <FaEdit />
                        </Button>
                        <Button onClick={() => handleDelete(client.id)} id="icone_btn" size="sm">
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No clients found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
     
      </Row>
    </Container>
  );
}

export default ClientManagement;
