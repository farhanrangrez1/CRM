import React, { useState } from 'react';
import { Form, Button, ProgressBar, Row, Col, Card } from 'react-bootstrap';
import { FaCloudUploadAlt } from 'react-icons/fa';
import './InProgress.css';

function AddInProgress() {
  const [formData, setFormData] = useState({
    progress: 75,
    hoursSpent: 12,
    minutes: 30,
    currentStage: 'Design Review',
    progressNotes: '',
    attachments: [],
    nextMilestone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="in-progress-container p-4">
      <h4 className="mb-4">Update Job Progress - #JOB001</h4>
      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Body>
            <Form.Group className="mb-4">
              <Form.Label>Project Status</Form.Label>
              <div className="d-flex align-items-center">
                <ProgressBar now={formData.progress} className="flex-grow-1 custom-progress" variant="dark" />
                <span className="ms-2">{formData.progress}%</span>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Time Tracking</Form.Label>
              <Row>
                <Col>
                  <div className="time-label">Hours Spent</div>
                  <Form.Control
                    type="number"
                    name="hoursSpent"
                    value={formData.hoursSpent}
                    onChange={handleInputChange}
                    className="time-input"
                  />
                </Col>
                <Col>
                  <div className="time-label">Minutes</div>
                  <Form.Control
                    type="number"
                    name="minutes"
                    value={formData.minutes}
                    onChange={handleInputChange}
                    className="time-input"
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Current Stage</Form.Label>
              <Form.Select
                name="currentStage"
                value={formData.currentStage}
                onChange={handleInputChange}
              >
                <option>Design Review</option>
                <option>Development</option>
                <option>Testing</option>
                <option>Deployment</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Progress Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="progressNotes"
                value={formData.progressNotes}
                onChange={handleInputChange}
                placeholder="Enter detailed notes about the progress..."
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Attachments</Form.Label>
              <div className="file-upload-container border rounded p-4 text-center">
                <FaCloudUploadAlt size={40} className="upload-icon text-muted" />
                <p className="upload-text mb-2">Drag and drop files here or</p>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="d-none"
                  id="fileInput"
                />
                <Button
                  variant="link"
                  className="browse-link"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  browse files
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Next Milestone</Form.Label>
              <Form.Control
                type="date"
                name="nextMilestone"
                value={formData.nextMilestone}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="light" className="cancel-btn">Cancel</Button>
          <Button variant="dark" type="submit" className="save-btn">Save Progress</Button>
        </div>
      </Form>
    </div>
  );
}

export default AddInProgress;
