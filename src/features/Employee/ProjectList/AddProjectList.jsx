import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createProject, fetchProjectById, updateProject } from '../../../redux/slices/ProjectsSlice';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchClient } from '../../../redux/slices/ClientSlice';

function AddProjectList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // for edit mode
  const location = useLocation();
  const { project } = location.state || {};

  const [formData, setFormData] = useState({
    projectName: '',
    clientId: '',
    managerId: '',
    startDate: '',
    endDate: '',
    projectPriority: '',
    description: '',
    status: '',
    projectRequirements: {
      creativeDesign: false,
      artworkAdaptation: false,
      prepress: false,
      POS: false,
      mockups: false,
      rendering: false,
    },
    budgetAmount: '',
    currency: '',
    totalTime: ''
  });

  useEffect(() => {
    if (project) {
      // Form pre-filled from location.state
      setFormData({
        ...project,
        projectRequirements: project.projectRequirements?.[0] || {}
      });
    } else if (id) {
      // Form pre-filled from API
      dispatch(fetchProjectById(id)).then((res) => {
        const fetchedProject = res.payload;
        if (fetchedProject) {
          setFormData({
            ...fetchedProject,
            projectRequirements: fetchedProject.projectRequirements?.[0] || {}
          });
        }
      });
    }
  }, [id, dispatch, project]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      projectRequirements: {
        ...prev.projectRequirements,
        [name]: checked
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      projectRequirements: [formData.projectRequirements]
    };
    if (id) {
      dispatch(updateProject({ id, data: payload }))
        .unwrap()
        .then(() => {
          toast.success("Project updated successfully!");
          navigate("/admin/plantMachinery");
        })
        .catch(() => {
          toast.error("Failed to update project!");
        });
    } else {
      dispatch(createProject(payload))
        .unwrap()
        .then(() => {
          toast.success("Project created successfully!");
          navigate("/admin/projectList");
        })
        .catch(() => {
          toast.error("Error creating project");
        });
    }
  };

  const handleCancel = () => {
    navigate("/admin/projectList");
  }


      //  all client 
    const { Clients } = useSelector((state) => state.client);
    console.log(Clients);
  
  useEffect(() => {
    if (Clients  && project?.data?.length) {
      const foundProject = project.data.find(p => p._id === Clients );
      if (foundProject) {
        setFormData(prev => ({
          ...prev,
          projectsId: foundProject._id,
        }));
      }
    }
  }, [Clients , project]);

    useEffect(() => {
      dispatch(fetchClient());
    }, [dispatch]);


  return (
    <Container className="py-4">
      <div className="form-container p-4 rounded shadow-sm" style={{ backgroundColor: "white", margin: "0 auto" }}>
       <h2 className="mb-4">{id || project?._id ? "Edit Project" : "New Project"}</h2>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-muted mb-1">Project Name</Form.Label>
                <Form.Control
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-muted mb-1">Client Name</Form.Label>
                <Form.Select
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Client</option>
                  <option value="662fb9cba77b2e0012345679">Client 1</option>
                  {Clients?.data?.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.clientName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-muted mb-1">Project Manager</Form.Label>
                <Form.Select
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Manager</option>
                  <option value="662fb9a2a77b2e0012345678">Manager 1</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-muted mb-1">Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-muted mb-1">Expected Completion Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-muted mb-1">Project Priority</Form.Label>
                <Form.Select
                  name="projectPriority"
                  value={formData.projectPriority}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-muted mb-1">Project Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Active Project">Active Project</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="On Hold">On Hold</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {/* <Col md={6}>
              <Form.Group>
                <Form.Label className="text-muted mb-1">Total Time Logged</Form.Label>
                <Form.Control
                  type="time"
                  name="totalTime"
                  value={formData.totalTime}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col> */}
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="text-muted mb-1">Project Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-muted mb-1">Project Requirements</Form.Label>
            <div>
              {['creativeDesign', 'artworkAdaptation', 'prepress', 'POS', 'mockups', 'rendering'].map((key) => (
                <Form.Check
                  key={key}
                  type="checkbox"
                  label={key.replace(/([A-Z])/g, ' $1')}
                  name={key}
                  checked={formData.projectRequirements[key]}
                  onChange={() => {
                    // Reset all to false, set only clicked one to true
                    setFormData((prevData) => ({
                      ...prevData,
                      projectRequirements: Object.fromEntries(
                        Object.keys(prevData.projectRequirements).map((k) => [k, k === key])
                      )
                    }));
                  }}
                />
              ))}
            </div>
          </Form.Group>


          <Form.Label className="text-muted mb-1">Budget Information</Form.Label>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Control
                  type="number"
                  placeholder="Budget Amount"
                  name="budgetAmount"
                  value={formData.budgetAmount}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                >
                  <option value="">Select Currency</option>
                  <option value="AED">AED</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                  <option value="SAR">SAR</option>
                  <option value="USD">USD</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" className="px-4" style={{ minWidth: "120px" }} onClick={handleCancel}>Cancel</Button>
            <Button variant="dark" type="submit" className="px-4" style={{ minWidth: "120px" }}>
        
               {id || project?._id ? "Save" : "Create Project"}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default AddProjectList;
