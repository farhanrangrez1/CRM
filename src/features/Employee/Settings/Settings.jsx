import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Nav,
  Tab,
  Tabs,
  Card,
  Table,
} from "react-bootstrap";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <Container fluid className="p-4">
      <h4 className="mb-4 fw-bold">Settings</h4>
      <Tab.Container defaultActiveKey="general">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="general">General Preferences</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="email">Email Notifications</Nav.Link>
            </Nav.Item>
          </Nav.Item>
          <Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="cloud">Cloud Storage</Nav.Link>
            </Nav.Item>
          </Nav.Item>
          <Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="mobile">Mobile Access</Nav.Link>
            </Nav.Item>
          </Nav.Item>
          <Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="system">System</Nav.Link>
            </Nav.Item>
          </Nav.Item>
          <Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="document-layout">Document</Nav.Link>
            </Nav.Item>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="general">
            <Row className="mb-4">
              <Col md={6}>
                <h5>Interface Settings</h5>
                <Form.Check
                  type="switch"
                  label="Enable Dark Mode"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <Form.Check
                  type="switch"
                  label="Compact View"
                  checked={compactView}
                  onChange={() => setCompactView(!compactView)}
                />
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <h5>Language & Region</h5>
                <Form.Group className="mb-2">
                  <Form.Label>Language</Form.Label>
                  <Form.Select>
                    <option>English (US)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2 mt-4 pt-2">
                  <Form.Label>Time Zone</Form.Label>
                  <Form.Select>
                    <option>UTC-08:00 Pacific Time</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <h5>Default Settings</h5>
                <Form.Group className="mb-2">
                  <Form.Label>Default Project View</Form.Label>
                  <Form.Select>
                    <option>List View</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Default Dashboard</Form.Label>
                  <Form.Select>
                    <option>Project Overview</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <h5>Session Settings</h5>
                <Form.Check
                  type="switch"
                  label="Auto-save Changes"
                  checked={autoSave}
                  onChange={() => setAutoSave(!autoSave)}
                />
                <Form.Group className="mt-2">
                  <Form.Label>Session Timeout</Form.Label>
                  <Form.Select>
                    <option>30 minutes</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button variant="secondary">Reset to Default</Button>
              <Button id="All_btn" variant="dark">Save Changes</Button>
            </div>
          </Tab.Pane>

          <Tab.Pane eventKey="email">
            <Row className="mb-4">
              <Col md={6}>
                <h5>Notification Types</h5>
                <Form.Check
                  type="switch"
                  label={
                    <>
                      <div className="fw-semibold">Project Updates</div>
                      <div className="text-muted small">
                        Receive updates about project status changes and
                        milestones
                      </div>
                    </>
                  }
                  className="mb-3"
                  defaultChecked
                />
                <Form.Check
                  type="switch"
                  label={
                    <>
                      <div className="fw-semibold">Task Assignments</div>
                      <div className="text-muted small">
                        Get notified when you are assigned to new tasks
                      </div>
                    </>
                  }
                  className="mb-3"
                  defaultChecked
                />
                <Form.Check
                  type="switch"
                  label={
                    <>
                      <div className="fw-semibold">Due Date Reminders</div>
                      <div className="text-muted small">
                        Receive reminders before task due dates
                      </div>
                    </>
                  }
                  className="mb-3"
                  defaultChecked
                />
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <h5>Email Frequency</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Daily Digest</Form.Label>
                  <Form.Select defaultValue="Send at 9:00 AM">
                    <option>Send at 9:00 AM</option>
                    <option>Send at 12:00 PM</option>
                    <option>Send at 6:00 PM</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Weekly Summary</Form.Label>
                  <Form.Select defaultValue="Send on Monday">
                    <option>Send on Monday</option>
                    <option>Send on Friday</option>
                    <option>Send on Sunday</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <h5>Notification Preferences</h5>
                <Form.Check
                  type="switch"
                  label={
                    <>
                      <div className="fw-semibold">Desktop Notifications</div>
                      <div className="text-muted small">
                        Show notifications on your desktop
                      </div>
                    </>
                  }
                  className="mb-3"
                  defaultChecked
                />
                <Form.Check
                  type="switch"
                  label={
                    <>
                      <div className="fw-semibold">
                        Mobile Push Notifications
                      </div>
                      <div className="text-muted small">
                        Receive notifications on your mobile device
                      </div>
                    </>
                  }
                  defaultChecked
                />
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button variant="secondary">Reset to Default</Button>
              <Button id="All_btn" variant="dark">Save Changes</Button>
            </div>
          </Tab.Pane>

          <Tab.Pane eventKey="cloud">
            <Row className="mb-4">
              <Col md={8}>
                <h5>Connected Storage Services</h5>

                <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center bg-light">
                  <div>
                    <div className="fw-semibold">Google Drive</div>
                    <div className="text-muted small">
                      Connected · 15 GB used of 100 GB
                    </div>
                  </div>
                  <Button variant="link" className="text-danger p-0">
                    Disconnect
                  </Button>
                </div>

                <div className="border rounded p-3 mb-4 d-flex justify-content-between align-items-center bg-light">
                  <div>
                    <div className="fw-semibold">Dropbox</div>
                    <div className="text-muted small">
                      Connected · 8 GB used of 50 GB
                    </div>
                  </div>
                  <Button variant="link" className="text-danger p-0">
                    Disconnect
                  </Button>
                </div>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col>
                <h5>Add New Storage</h5>
                <div className="d-flex flex-wrap gap-3">
                  <Card
                    style={{
                      width: "10rem",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    className="p-3"
                  >
                    <div className="text-muted">Image</div>
                    <div className="fw-semibold mt-2">Connect OneDrive</div>
                  </Card>
                  <Card
                    style={{
                      width: "10rem",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    className="p-3"
                  >
                    <div className="text-muted">Image</div>
                    <div className="fw-semibold mt-2">Connect Box</div>
                  </Card>
                  <Card
                    style={{
                      width: "10rem",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    className="p-3"
                  >
                    <div className="text-muted">Image</div>
                    <div className="fw-semibold mt-2">Connect AWS S3</div>
                  </Card>
                </div>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <h5>Storage Settings</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Default Upload Location</Form.Label>
                  <Form.Select defaultValue="Google Drive">
                    <option>Google Drive</option>
                    <option>Dropbox</option>
                    <option>OneDrive</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>File Sync Frequency</Form.Label>
                  <Form.Select defaultValue="Real-time">
                    <option>Real-time</option>
                    <option>Every 15 minutes</option>
                    <option>Every hour</option>
                  </Form.Select>
                </Form.Group>

                <Form.Check
                  type="switch"
                  id="auto-sync"
                  label={
                    <>
                      <div className="fw-semibold">Auto-sync Files</div>
                      <div className="text-muted small">
                        Automatically sync files between services
                      </div>
                    </>
                  }
                  defaultChecked
                />
              </Col>
            </Row>
          </Tab.Pane>

          <Tab.Pane eventKey="mobile">
            <Row className="mb-4">
              <Col md={6}>
                <h5>Mobile App Settings</h5>
                <Form.Check
                  type="switch"
                  id="enable-mobile-access"
                  label={
                    <>
                      <div className="fw-semibold">Enable Mobile Access</div>
                      <div className="text-muted small">
                        Allow access to the system through mobile devices
                      </div>
                    </>
                  }
                  defaultChecked
                  className="mb-3"
                />

                <Form.Group>
                  <Form.Label>Push Notifications</Form.Label>
                  <Form.Select defaultValue="All notifications">
                    <option>All notifications</option>
                    <option>Only important</option>
                    <option>None</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <h5>Connected Devices</h5>
                <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center bg-light">
                  <div>
                    <div className="fw-semibold">iPhone 13 Pro</div>
                    <div className="text-muted small">
                      Last active: 2 minutes ago
                    </div>
                  </div>
                  <Button variant="link" className="text-danger p-0">
                    Remove
                  </Button>
                </div>
                <div className="border rounded p-3 d-flex justify-content-between align-items-center bg-light">
                  <div>
                    <div className="fw-semibold">iPad Pro</div>
                    <div className="text-muted small">
                      Last active: 2 hours ago
                    </div>
                  </div>
                  <Button variant="link" className="text-danger p-0">
                    Remove
                  </Button>
                </div>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <h5>Security Settings</h5>
                <Form.Check
                  type="switch"
                  id="biometric-auth"
                  label={
                    <>
                      <div className="fw-semibold">
                        Biometric Authentication
                      </div>
                      <div className="text-muted small">
                        Use fingerprint or face recognition to login
                      </div>
                    </>
                  }
                  defaultChecked
                  className="mb-3"
                />

                <Form.Check
                  type="switch"
                  id="location-services"
                  label={
                    <>
                      <div className="fw-semibold">Location Services</div>
                      <div className="text-muted small">
                        Allow app to access device location
                      </div>
                    </>
                  }
                  className="mb-3"
                />

                <Form.Group>
                  <Form.Label>Session Timeout</Form.Label>
                  <Form.Select defaultValue="15 minutes">
                    <option>5 minutes</option>
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <h5>Data Usage</h5>
                <Form.Check
                  type="switch"
                  id="offline-access"
                  label={
                    <>
                      <div className="fw-semibold">Offline Access</div>
                      <div className="text-muted small">
                        Cache data for offline use
                      </div>
                    </>
                  }
                  defaultChecked
                  className="mb-3"
                />

                <Form.Group>
                  <Form.Label>Download Quality</Form.Label>
                  <Form.Select defaultValue="Auto (Network dependent)">
                    <option>Auto (Network dependent)</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Tab.Pane>

          <Tab.Pane eventKey="system">
            <Row className="mb-4">
              <Col md={6}>
                <h5>System Information</h5>
                <div className="border rounded p-3 bg-light">
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="text-muted small">Version</div>
                      <div className="fw-semibold">2.1.0</div>
                    </div>
                    <div>
                      <div className="text-muted small">Last Updated</div>
                      <div className="fw-semibold">March 15, 2024</div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <h5>Database Management</h5>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div className="fw-semibold">Database Backup</div>
                    <div className="text-muted small">
                      Last backup: 2 hours ago
                    </div>
                  </div>
                  <Button id="All_btn" variant="dark">Backup Now</Button>
                </div>

                <div className="mb-3">
                  <div className="fw-semibold">Storage Usage</div>
                  <div className="text-muted small mb-1">75% of 1TB used</div>
                  <div className="progress">
                    <div
                    id="All_btn"
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <h5>System Maintenance</h5>
                <Form.Check
                  type="switch"
                  id="auto-updates"
                  label={
                    <>
                      <div className="fw-semibold">Automatic Updates</div>
                      <div className="text-muted small">
                        Install updates automatically
                      </div>
                    </>
                  }
                  defaultChecked
                  className="mb-3"
                />

                <Form.Group>
                  <Form.Label>Maintenance Window</Form.Label>
                  <Form.Select defaultValue="12:00 AM - 4:00 AM">
                    <option>12:00 AM - 4:00 AM</option>
                    <option>2:00 AM - 6:00 AM</option>
                    <option>1:00 AM - 3:00 AM</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={8}>
                <h5>System Logs</h5>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>System Backup</td>
                      <td>2 hours ago</td>
                      <td>
                        <span className="badge bg-success">Success</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Security Update</td>
                      <td>1 day ago</td>
                      <td>
                        <span className="badge bg-success">Success</span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Tab.Pane>

          {/* <Tab.Pane eventKey="document-layout">
            <Row className="mb-4">
              <Col>
                <Nav variant="tabs" defaultActiveKey="estimates">
                  <Nav.Item>
                    <Nav.Link eventKey="estimates">Estimates</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="invoices">Invoices</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="purchase-orders">
                      Purchase Orders
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
          </Tab.Pane> */}

          <Tab.Pane eventKey="document-layout">
            <Tabs defaultActiveKey="estimates" className="mb-4">
              <Tab eventKey="estimates" title="Estimates">
                {/* Yaha Estimates layout ka content ayega */}
                <Row>
                  <Col md={8}>
                    <div className="border rounded p-4 bg-white">
                      <h5 className="mb-3">ESTIMATE</h5>
                      <div className="text-muted small mb-2">
                        #EST-2024-001 • Date: Jan 15, 2024
                      </div>

                      <div className="mb-3">
                        <strong>Bill To:</strong>
                        <br />
                        Client Name
                        <br />
                        Client Company
                        <br />
                        Address Line 1<br />
                        City, State, ZIP
                      </div>

                      <div className="mb-3">
                        <strong>Ship To:</strong>
                        <br />
                        Same as billing address
                      </div>

                      <Table bordered className="mt-3">
                        <thead className="table-light">
                          <tr>
                            <th>Item Description</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Web Design Services</td>
                            <td>1</td>
                            <td>$1,500.00</td>
                            <td>$1,500.00</td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="text-end fw-bold">
                              Total:
                            </td>
                            <td className="fw-bold">$1,500.00</td>
                          </tr>
                        </tbody>
                      </Table>

                      <div className="mt-4">
                        <strong>Terms and Conditions:</strong>
                        <ul className="small ps-3">
                          <li>
                            All items must meet specified quality standards
                          </li>
                          <li>Delivery must be made by the specified date</li>
                          <li>Payment terms: Net 30</li>
                          <li>
                            Please include PO number on all correspondence
                          </li>
                        </ul>
                      </div>

                      <div className="d-flex justify-content-between mt-4">
                        <div>
                          <div className="fw-semibold">Authorized by:</div>
                          <div>Procurement Manager</div>
                        </div>
                        <div>
                          <div className="fw-semibold">Date:</div>
                          <div>______________________</div>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="border rounded p-3 bg-light">
                      <h6 className="mb-3">Layout Options</h6>

                      <Form.Group className="mb-3">
                        <Form.Label>Default Currency</Form.Label>
                        <Form.Select defaultValue="USD ($)">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>INR (₹)</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Logo Position</Form.Label>
                        <Form.Select defaultValue="Left">
                          <option>Left</option>
                          <option>Center</option>
                          <option>Right</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Color Scheme</Form.Label>
                        <br />
                        {[
                          "#000000",
                          "#1D4ED8",
                          "#10B981",
                          "#F59E0B",
                          "#8B5CF6",
                          "#EF4444",
                        ].map((color) => (
                          <Button
                            key={color}
                            style={{ backgroundColor: color }}
                            className="me-1 mb-2"
                            variant="outline-light"
                            size="sm"
                            rounded
                          />
                        ))}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Font Style</Form.Label>
                        <Form.Select defaultValue="Inter">
                          <option>Inter</option>
                          <option>Roboto</option>
                          <option>Poppins</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Font Size</Form.Label>
                        <Form.Select defaultValue="Small">
                          <option>Small</option>
                          <option>Medium</option>
                          <option>Large</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Section Order</Form.Label>
                        <ul className="list-group">
                          <li className="list-group-item">
                            Company Information
                          </li>
                          <li className="list-group-item">Customer Details</li>
                          <li className="list-group-item">Items Table</li>
                          <li className="list-group-item">
                            Terms & Conditions
                          </li>
                        </ul>
                      </Form.Group>

                      <Button id="All_btn" className="w-100 mb-2">
                        Save Layout
                      </Button>
                      <Button
                        variant="outline-secondary"
                        className="w-100 mb-2"
                      >
                        Preview
                      </Button>
                      <Button variant="outline-danger" className="w-100">
                        Reset to Default
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="invoices" title="Invoices">
                {/* Yaha Invoices layout ka content ayega */}
                <Row>
                  <Col md={8}>
                    <div className="border rounded p-4 bg-white">
                      <h5 className="mb-3">INVOICE</h5>
                      <div className="text-muted small mb-2">
                        #INV-2024-001 • Date: Jan 15, 2024
                      </div>

                      <div className="mb-3">
                        <strong>Bill To:</strong>
                        <br />
                        Client Name
                        <br />
                        Client Company
                        <br />
                        Address Line 1<br />
                        City, State, ZIP
                      </div>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <strong>Currency Settings:</strong>
                        </Form.Label>
                        <Form.Select defaultValue="USD ($)">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>INR (₹)</option>
                        </Form.Select>
                      </Form.Group>

                      <div className="mb-3">
                        <strong>Ship To:</strong>
                        <br />
                        Same as billing address
                      </div>

                      <Table bordered className="mt-3">
                        <thead className="table-light">
                          <tr>
                            <th>Item Description</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Web Design Services</td>
                            <td>1</td>
                            <td>$1,500.00</td>
                            <td>$1,500.00</td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="text-end fw-bold">
                              Total:
                            </td>
                            <td className="fw-bold">$1,500.00</td>
                          </tr>
                        </tbody>
                      </Table>

                      <div className="mt-4">
                        <strong>Terms and Conditions:</strong>
                        <ul className="small ps-3">
                          <li>
                            All items must meet specified quality standards
                          </li>
                          <li>Delivery must be made by the specified date</li>
                          <li>Payment terms: Net 30</li>
                          <li>
                            Please include PO number on all correspondence
                          </li>
                        </ul>
                      </div>

                      <div className="d-flex justify-content-between mt-4">
                        <div>
                          <div className="fw-semibold">Authorized by:</div>
                          <div>Procurement Manager</div>
                        </div>
                        <div>
                          <div className="fw-semibold">Date:</div>
                          <div>______________________</div>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="border rounded p-3 bg-light">
                      <h6 className="mb-3">Layout Options</h6>

                      <Form.Group className="mb-3">
                        <Form.Label>Default Currency</Form.Label>
                        <Form.Select defaultValue="USD ($)">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>INR (₹)</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Logo Position</Form.Label>
                        <Form.Select defaultValue="Left">
                          <option>Left</option>
                          <option>Center</option>
                          <option>Right</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Color Scheme</Form.Label>
                        <br />
                        {[
                          "#000000",
                          "#1D4ED8",
                          "#10B981",
                          "#F59E0B",
                          "#8B5CF6",
                          "#EF4444",
                        ].map((color) => (
                          <Button
                            key={color}
                            style={{ backgroundColor: color }}
                            className="me-1 mb-2"
                            variant="outline-light"
                            size="sm"
                          />
                        ))}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Font Style</Form.Label>
                        <Form.Select defaultValue="Inter">
                          <option>Inter</option>
                          <option>Roboto</option>
                          <option>Poppins</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Font Size</Form.Label>
                        <Form.Select defaultValue="Small">
                          <option>Small</option>
                          <option>Medium</option>
                          <option>Large</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Section Order</Form.Label>
                        <ul className="list-group">
                          <li className="list-group-item">
                            Company Information
                          </li>
                          <li className="list-group-item">Customer Details</li>
                          <li className="list-group-item">Items Table</li>
                          <li className="list-group-item">
                            Terms & Conditions
                          </li>
                        </ul>
                      </Form.Group>

                      <Button variant="dark" className="w-100 mb-2">
                        Save Layout
                      </Button>
                      <Button
                        variant="outline-secondary"
                        className="w-100 mb-2"
                      >
                        Preview
                      </Button>
                      <Button variant="outline-danger" className="w-100">
                        Reset to Default
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="purchase-orders" title="Purchase Orders">
                {/* Yaha Purchase Orders layout ka content ayega */}
                <Row>
                  <Col md={8}>
                    <div className="border rounded p-4 bg-white">
                      <h5 className="mb-3">Purchase Orders </h5>
                      <div className="text-muted small mb-2">
                        #EST-2024-001 • Date: Jan 15, 2024
                      </div>

                      <div className="mb-3">
                        <strong>Bill To:</strong>
                        <br />
                        Client Name
                        <br />
                        Client Company
                        <br />
                        Address Line 1<br />
                        City, State, ZIP
                      </div>

                      <div className="mb-3">
                        <strong>Ship To:</strong>
                        <br />
                        Same as billing address
                      </div>

                      <Table bordered className="mt-3">
                        <thead className="table-light">
                          <tr>
                            <th>Item Description</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Web Design Services</td>
                            <td>1</td>
                            <td>$1,500.00</td>
                            <td>$1,500.00</td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="text-end fw-bold">
                              Total:
                            </td>
                            <td className="fw-bold">$1,500.00</td>
                          </tr>
                        </tbody>
                      </Table>

                      <div className="mt-4">
                        <strong>Terms and Conditions:</strong>
                        <ul className="small ps-3">
                          <li>
                            All items must meet specified quality standards
                          </li>
                          <li>Delivery must be made by the specified date</li>
                          <li>Payment terms: Net 30</li>
                          <li>
                            Please include PO number on all correspondence
                          </li>
                        </ul>
                      </div>

                      <div className="d-flex justify-content-between mt-4">
                        <div>
                          <div className="fw-semibold">Authorized by:</div>
                          <div>Procurement Manager</div>
                        </div>
                        <div>
                          <div className="fw-semibold">Date:</div>
                          <div>______________________</div>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="border rounded p-3 bg-light">
                      <h6 className="mb-3">Layout Options</h6>

                      <Form.Group className="mb-3">
                        <Form.Label>Default Currency</Form.Label>
                        <Form.Select defaultValue="USD ($)">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>INR (₹)</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Logo Position</Form.Label>
                        <Form.Select defaultValue="Left">
                          <option>Left</option>
                          <option>Center</option>
                          <option>Right</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Color Scheme</Form.Label>
                        <br />
                        {[
                          "#000000",
                          "#1D4ED8",
                          "#10B981",
                          "#F59E0B",
                          "#8B5CF6",
                          "#EF4444",
                        ].map((color) => (
                          <Button
                            key={color}
                            style={{ backgroundColor: color }}
                            className="me-1 mb-2"
                            variant="outline-light"
                            size="sm"
                            rounded
                          />
                        ))}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Font Style</Form.Label>
                        <Form.Select defaultValue="Inter">
                          <option>Inter</option>
                          <option>Roboto</option>
                          <option>Poppins</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Font Size</Form.Label>
                        <Form.Select defaultValue="Small">
                          <option>Small</option>
                          <option>Medium</option>
                          <option>Large</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Section Order</Form.Label>
                        <ul className="list-group">
                          <li className="list-group-item">
                            Company Information
                          </li>
                          <li className="list-group-item">Customer Details</li>
                          <li className="list-group-item">Items Table</li>
                          <li className="list-group-item">
                            Terms & Conditions
                          </li>
                        </ul>
                      </Form.Group>

                      <Button variant="dark" className="w-100 mb-2">
                        Save Layout
                      </Button>
                      <Button
                        variant="outline-secondary"
                        className="w-100 mb-2"
                      >
                        Preview
                      </Button>
                      <Button variant="outline-danger" className="w-100">
                        Reset to Default
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default SettingsPage;
