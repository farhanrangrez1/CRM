import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function UpdateProjectLis() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectTitle: '',
    clientName: '',
    projectManager: '',
    startDate: '',
    expectedCompletionDate: '',
    projectPriority: '',
    projectDescription: '',
    requirements: {
      packageDesign: false,
      brandGuidelines: false,
      printReadyFiles: false,
      mockupDesigns: false
    },
    budgetAmount: '',
    currency: ''
  });

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
      requirements: {
        ...prev.requirements,
        [name]: checked
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Project created successfully!');
    navigate(-1); 
  };

  const handleCancel = () => {
    navigate(-1); 
  };

  return (
    <Container className="py-4">
      <div className="form-container p-4 rounded shadow-sm" style={{backgroundColor:"white", margin: "0 auto"}}>
      <h2 className="mb-4">Create Project</h2>
      <Form onSubmit={handleSubmit} >
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-muted mb-1">Project Name</Form.Label>
              <Form.Control
                type="text"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-muted mb-1">Client Name</Form.Label>
              <Form.Select
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Client</option>
                <option value="client1">Client 1</option>
                <option value="client2">Client 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-muted mb-1">Project Manager</Form.Label>
              <Form.Select
                name="projectManager"
                value={formData.projectManager}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Manager</option>
                <option value="manager1">Manager 1</option>
                <option value="manager2">Manager 2</option>
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
                name="expectedCompletionDate"
                value={formData.expectedCompletionDate}
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

        <Form.Group className="mb-3">
          <Form.Label className="text-muted mb-1">Project Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-muted mb-1">Project Requirements</Form.Label>
          <div>
            <Form.Check
              type="checkbox"
              label="Creative Design"
              name="packageDesign"
              checked={formData.requirements.packageDesign}
              onChange={handleCheckboxChange}
            />
            <Form.Check
              type="checkbox"
              label="Artwork Adaptation"
              name="brandGuidelines"
              checked={formData.requirements.brandGuidelines}
              onChange={handleCheckboxChange}
            />
            <Form.Check
              type="checkbox"
              label="Prepress/File Preparation"
              name="printReadyFiles"
              checked={formData.requirements.printReadyFiles}
              onChange={handleCheckboxChange}
            />
            <Form.Check
              type="checkbox"
              label="POS"
              name="pos"
              checked={formData.requirements.pos}
              onChange={handleCheckboxChange}
            />
            <Form.Check
              type="checkbox"
              label="Mockups"
              name="mockups"
              checked={formData.requirements.mockups}
              onChange={handleCheckboxChange}
            />
            <Form.Check
              type="checkbox"
              label="3D Rendering"
              name="drendering"
              checked={formData.requirements.drendering}
              onChange={handleCheckboxChange}
            />
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
          <Button variant="secondary" className="px-4" style={{minWidth: "120px"}} onClick={handleCancel}>Cancel</Button>
          <Button id='All_btn' variant="dark" type="submit" className="px-4" style={{minWidth: "120px"}}>Create Project</Button>
        </div>
      </Form>
      </div>
    </Container>
  );
}

export default UpdateProjectLis;
