import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createProject, updateProject, fetchProjectById } from '../../../redux/slices/ProjectsSlice';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchClient } from '../../../redux/slices/ClientSlice';

function AddProjectList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: paramId } = useParams();
  const location = useLocation();
  const { project } = location.state || {};
  const id = paramId || project?._id;

  const [formData, setFormData] = useState({
    projectName: '',
    clientId: '',
    // managerId: '',
    // startDate: '',
    // endDate: '',
    // projectPriority: '',
    projectAddress: '',
    description: '',
    status: 'Lead',
    // projectRequirements: {
    //   creativeDesign: false,
    //   artworkAdaptation: false,
    //   prepress: false,
    //   POS: false,
    //   mockups: false,
    //   rendering: false,
    // },
    // budgetAmount: '',
    // currency: 'USD',
    // totalTime: '',
    tempPoles: false
  });

  const [items, setItems] = useState([
    { description: "", quantity: 0, rate: 0, amount: 0 },
  ]);

  const calculateAmount = (quantity, rate) => quantity * rate;

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].amount = calculateAmount(
      newItems[index].quantity,
      newItems[index].rate
    );
    setItems(newItems);
  };
  const addItem = () => {
    setItems([...items, { description: "", quantity: 0, rate: 0, amount: 0 }]);
  };
  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // ✅ Populate form in edit mode
  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        clientId: project.clientId?._id || '', // 🔧 Fix here
        projectRequirements: project.projectRequirements?.[0] || {},
        tempPoles: project.tempPoles || false
      });
      setItems(project?.lineItems)
    } else if (paramId) {
      dispatch(fetchProjectById(paramId)).then((res) => {
        const fetchedProject = res.payload;
        if (fetchedProject) {
          setFormData({
            ...fetchedProject,
            clientId: fetchedProject.clientId?._id || '', // 🔧 Fix here
            projectRequirements: fetchedProject.projectRequirements?.[0] || {}
          });
        }
      });
    }
  }, [paramId, dispatch, project]);

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
      projectRequirements: [formData.projectRequirements],
      lineItems: items
    };

    if (id) {
      dispatch(updateProject({ id, payload }))
        .unwrap()
        .then(() => {
          toast.success("Project updated successfully!");
          // navigate("/admin/projectList");
          navigate("/admin/LeadFlow");
        })
        .catch(() => {
          toast.error("Failed to update project!");
        });
    } else {
      dispatch(createProject(payload))
        .unwrap()
        .then((res) => {
          console.log(res);
          toast.success("Project created successfully!");
          // navigate("/admin/projectList");
          if (payload.lineItems.length > 0) {
            const confirmCreate = window.confirm("Do you want to create proposal?");
            if (confirmCreate) {
              navigate("/admin/AddCostEstimates", {
                state: { projectID: res?.data?._id },
              });
            } else {
              navigate("/admin/LeadFlow");
            }
          } else {
            navigate("/admin/LeadFlow");
          }
        })
        .catch(() => {
          toast.error("Error creating project");
        });
    }
  };

  // const handleCancel = () => {
  //   navigate("/admin/projectList");
  // };
  const handleCancel = () => {
    navigate(-1); // Goes one step back in the browser history
  };


  const { Clients } = useSelector((state) => state.client);
  useEffect(() => {
    dispatch(fetchClient());
  }, [dispatch]);

  return (
    <Container className="py-4">
      <div className="form-container p-4 rounded shadow-sm" style={{ backgroundColor: "white", margin: "0 auto" }}>
        <h2 className="mb-4">{id ? "Edit Project" : "New Project"}</h2>

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
                  {Clients?.data?.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.clientName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-muted mb-1">Expected Completion Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={formData.endDate?.slice(0, 10)}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-muted mb-1">Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formData.startDate?.slice(0, 10)}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row> */}

          <Row className="mb-3">
            <Col md={6}>
              {/* <Form.Group>
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
              </Form.Group> */}
              <Form.Group className="mb-3 mt-6">
                <Form.Check
                  type="checkbox"
                  label="Temp Poles"
                  name="tempPoles"
                  checked={formData.tempPoles}
                  onChange={(e) => setFormData({ ...formData, tempPoles: e.target.checked })}
                />
              </Form.Group>

              <Form.Group className="mb-3">

              </Form.Group>

            </Col>
            {/* <Col md={6}>
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
            </Col> */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-muted mb-1">Project Address</Form.Label>
                <Form.Control
                  type="text"
                  name="projectAddress"
                  value={formData.projectAddress}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>

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

          <h6 className="fw-semibold mb-3">Line Items</h6>
          <div className="row fw-semibold text-muted mb-2 px-2">
            <div className="col-md-5">Description</div>
            <div className="col-md-2">Quantity</div>
            <div className="col-md-2">Rate</div>
            <div className="col-md-2">Amount</div>
            <div className="col-md-1 text-end"></div>
          </div>

          {items.map((item, index) => (
            <div
              className="row gx-2 gy-2 align-items-center mb-2 px-2 py-2"
              key={index}
              style={{ background: "#f9f9f9", borderRadius: "8px" }}
            >
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Item description"
                  value={item.description}
                  required
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  value={item.quantity}
                  required
                  onChange={(e) =>
                    handleItemChange(index, "quantity", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  value={item.rate}
                  required
                  onChange={(e) =>
                    handleItemChange(index, "rate", parseFloat(e.target.value))
                  }
                />
              </div>
              <div className="col-md-2">
                <span>
                  {formData.currency} {item.amount.toFixed(2)}
                </span>
              </div>
              <div className="col-md-1 text-end">
                <button
                  className="btn btn-link text-danger p-0"
                  onClick={() => removeItem(index)}
                  type="button"
                >
                  remove
                </button>
              </div>
            </div>
          ))}
          <button
            className="btn border rounded px-3 py-1 mb-4 text-dark"
            onClick={addItem}
            type="button"
          >
            + Add Line Item
          </button>


          {/* <Form.Group className="mb-3">
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
          </Form.Group> */}

          {/* <Form.Label className="text-muted mb-1">Budget Information</Form.Label> */}
          <Row className="mb-3">
            {/* <Col md={6}>
              <Form.Group>
                <Form.Control
                  type="number"
                  placeholder="Budget Amount"
                  name="budgetAmount"
                  value={formData.budgetAmount}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col> */}
            {/* <Col md={6}>
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
            </Col> */}
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" className="px-4" onClick={handleCancel}>Cancel</Button>
            <Button id='All_btn' type="submit" className="px-4">
              {id ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default AddProjectList;
