import React, { useState } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaDownload, FaTrash, FaCloudUploadAlt, FaFilePdf, FaFileImage, FaFileAlt, FaFile } from 'react-icons/fa';
import './MyJobs_Upload_Artwork.css';

function MyJobs_Upload_Artwork() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      const validTypes = ['image/png', 'image/jpeg', 'application/pdf', 'application/postscript'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setFiles(prev => [...prev, ...validFiles.map(file => ({
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1), // Convert to MB
      uploadedAt: new Date().toLocaleString()
    }))]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['image/png', 'image/jpeg', 'application/pdf', 'application/postscript'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setFiles(prev => [...prev, ...validFiles.map(file => ({
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1), // Convert to MB
      uploadedAt: new Date().toLocaleString()
    }))]);
  };

  const handleDelete = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Upload Artwork</h5>
        <Link to="/admin/myjobs" className="text-decoration-none">
          <Button variant="outline-dark" size="sm" className="d-flex align-items-center gap-2">← Back to Jobs</Button>
        </Link>
      </div>
      <h6 className="text-muted mb-4">Upload Artwork for Job #JOB102 - Holiday Package Design</h6>

      <Row>
        <Col md={8}>
          {/* Upload Area */}
          <div
            className={`upload-area ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <div className="upload-icon">
              <FaCloudUploadAlt size={48} color="#6c757d" />
            </div>
            <p className="upload-text">Drag and drop your files here or click to browse</p>
            <small className="upload-formats">Supported formats: AI, PSD, PDF, JPG, PNG (max 50MB)</small>
            <input
              type="file"
              className="d-none"
              onChange={handleFileSelect}
              multiple
              accept=".ai,.psd,.pdf,.jpg,.jpeg,.png"
              id="fileInput"
            />
            <Button
              variant="dark"
              className="mt-3"
            >
              Choose Files
            </Button>
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="bg-white rounded shadow-sm p-4 mt-4">
              <h6 className="fw-bold mb-3">Uploaded Files</h6>
              {files.map((file, index) => (
                <div key={index} className="d-flex align-items-center justify-content-between py-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      {file.name.toLowerCase().endsWith('.pdf') ? (
                        <FaFilePdf size={32} className="text-danger" />
                      ) : file.name.toLowerCase().endsWith('.png') || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg') ? (
                        <FaFileImage size={32} className="text-primary" />
                      ) : file.name.toLowerCase().endsWith('.ai') ? (
                        <FaFileAlt size={32} className="text-warning" />
                      ) : file.name.toLowerCase().endsWith('.psd') ? (
                        <FaFileImage size={32} className="text-info" />
                      ) : (
                        <FaFile size={32} className="text-secondary" />
                      )}
                    </div>
                    <div>
                      <h6 className="mb-0">{file.name}</h6>
                      <small className="text-muted">{file.size} MB • Uploaded {file.uploadedAt}</small>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                      <FaEye className="me-1" /> View
                    </Button>
                    <Button variant="outline-success" size="sm" className="d-flex align-items-center">
                      <FaDownload className="me-1" /> Download
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="d-flex align-items-center"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash className="me-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Col>

        {/* Job Details Sidebar */}
        <Col md={4}>
          <div className="job-details">
            <h6 className="fw-bold mb-4">Job Details</h6>
            
            <div className="detail-item">
              <small className="detail-label">Client</small>
              <div className="detail-value">Acme Corp</div>
            </div>

            <div className="detail-item">
              <small className="detail-label">Deadline</small>
              <div className="detail-value text-danger">Jan 20, 2024</div>
            </div>

            <div className="detail-item">
              <small className="detail-label">Status</small>
              <Badge bg="warning" text="dark" className="status-badge">Pending Upload</Badge>
            </div>

            <div className="detail-item mb-4">
              <small className="detail-label">Brief</small>
              <div className="detail-brief">Design a holiday-themed package for our premium product line. The design should incorporate festive elements while maintaining brand consistency.</div>
            </div>

            <div className="d-grid gap-2">
              <Button variant="dark" size="lg" className="submit-btn">
                Submit for Review
              </Button>
              <Button variant="outline-dark" className="draft-btn">
                Save as Draft
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default MyJobs_Upload_Artwork;
