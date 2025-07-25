import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Form, Button, Table,
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaFilter } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './ClientManagement.css';
import { apiUrl } from '../../../redux/utils/config';

function SubClientManagement() {
  const navigate = useNavigate();

  const [subClients, setSubClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('All');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);

  useEffect(() => {
    fetchSubClients();
  }, []);

  const fetchSubClients = async () => {
    try {
      const res = await axios.get(`${apiUrl}/subClient`);
      setSubClients(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch sub clients', error);
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiUrl}/subClient/${id}`);
          Swal.fire('Deleted!', 'Sub client has been deleted.', 'success');
          fetchSubClients();
        } catch (error) {
          Swal.fire('Error!', 'Something went wrong.', 'error');
        }
      }
    });
  };

  // Extract unique clients from subClients
  const uniqueClients = Array.from(
    new Map(subClients.map(sc => [sc.clientId?._id, sc.clientId?.clientName])).entries()
  );

  const filteredSubClients = subClients.filter((client) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      client.subClientName?.toLowerCase().includes(term) ||
      client.subClientEmail?.toLowerCase().includes(term) ||
      client.subClientPhone?.toLowerCase().includes(term) ||
      client.subClientAddress?.toLowerCase().includes(term) ||
      client.notes?.toLowerCase().includes(term)
    );
    const matchesClient = selectedClientId === 'All' || client.clientId?._id === selectedClientId;
    return matchesSearch && matchesClient;
  });

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredSubClients.slice(indexOfFirstClient, indexOfLastClient);

  return (
    <Container fluid className="p-4">
      <Row className="align-items-center p-3" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
        <Row className="mb-4 align-items-center">
          <Col><h4>SubClients</h4></Col>
        </Row>

        <div className="d-md-none mb-3">
          <Button variant="secondary" onClick={() => setShowMobileFilters(!showMobileFilters)}>
            <FaFilter /> Filters
          </Button>
        </div>

        {(showMobileFilters || window.innerWidth >= 768) && (
          <Row className="mb-4 align-items-center">
            <Col md={4} className="mb-2">
              <Form.Control
                type="search"
                placeholder="Search sub clients..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </Col>
            <Col md={4} className="mb-2">
              <Form.Select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
              >
                <option value="All">All Clients</option>
                {uniqueClients.map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md className="mb-2 d-flex justify-content-md-end">
              <Link to="/admin/addSubClientManagement">
                <Button id="All_btn" variant="primary">+ Add SubClient</Button>
              </Link>
            </Col>
          </Row>
        )}

        {/* Sub Client Table */}
        <div className="table-responsive">
          <Table responsive className="align-middle client-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Sub Client Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Notes</th>
                <th>Client Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentClients.length > 0 ? (
                currentClients.slice().reverse().map((client, index) => (
                  <tr key={client._id}>
                    <td>{indexOfFirstClient + index + 1}</td>
                    <td>{client.subClientName || 'N/A'}</td>
                    <td>{client.subClientEmail || 'N/A'}</td>
                    <td>{client.subClientPhone || 'N/A'}</td>
                    <td>{client.subClientAddress || 'N/A'}</td>
                    <td>{client.notes || '-'}</td>
                    <td>{client.clientId?.clientName || 'N/A'}</td>
                    <td>
                      <div className="action-buttons d-flex">
                        <Button
                          onClick={() =>
                            navigate('/admin/addSubClientManagement', { state: { client } })
                          }
                          id="icone_btn"
                          size="sm"
                        >
                          <FaEdit />
                        </Button>
                        <Button onClick={() => handleDelete(client._id)} id="icone_btn" size="sm">
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No sub clients found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Row>
    </Container>
  );
}

export default SubClientManagement;
