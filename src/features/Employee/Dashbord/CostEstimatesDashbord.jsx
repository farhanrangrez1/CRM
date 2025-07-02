

import React, { useEffect, useState } from "react";
import { Modal, Form, Table, Badge, Dropdown, Button } from "react-bootstrap";
import { BsPlusLg, BsPencil, BsTrash, BsUpload } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { deleteCostEstimate, fetchCostEstimates } from "../../../redux/slices/costEstimatesSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';


function CostEstimatesDashbord() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const initialPurchaseOrders = [
        {
            poNumber: "PO/2024/001",
            client: "AcmeCorp",
            project: "PackageRedesign",
            projectNo: "P789",
            projectName: "New Building Construction",
            estimateRef: "CE-00001",
            status: "Pending",
            receivedDate: "2024/01/15",
            amount: 3000.0,
        },
        {
            poNumber: "PO/2024/002",
            client: "TechStartInc",
            project: "BrandIdentity",
            projectNo: "P789",
            projectName: "New Building Construction",
            estimateRef: "CE-00002",
            status: "received",
            receivedDate: "2024/01/14",
            amount: 3500.0,
        },
        {
            poNumber: "PO/2024/003",
            client: "GlobalFoods",
            project: "LabelDesign",
            projectNo: "P789",
            projectName: "New Building Construction",
            estimateRef: "CE-00003",
            status: "Pending",
            receivedDate: "2024/01/13",
            amount: 2800.0,
        },
    ];

    const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders);

    // const getStatusBadgeVariant = (status) => {
    //   switch (status.toLowerCase()) {
    //     case "pending":
    //       return "warning";
    //     case "received ":
    //       return "success";
    //     default:
    //       return "secondary";
    //   }
    // };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = initialPurchaseOrders.filter(
            (po) =>
                po.poNumber.toLowerCase().includes(query) ||
                po.client.toLowerCase().includes(query) ||
                po.project.toLowerCase().includes(query) ||
                po.estimateRef.toLowerCase().includes(query)
        );
        setPurchaseOrders(filtered);
    };

    const handleSort = (field) => {
        const isAsc = sortField === field && sortDirection === "asc";
        setSortDirection(isAsc ? "desc" : "asc");
        setSortField(field);

        const sorted = [...purchaseOrders].sort((a, b) => {
            if (field === "amount") {
                return isAsc ? b[field] - a[field] : a[field] - b[field];
            }
            return isAsc
                ? b[field].localeCompare(a[field])
                : a[field].localeCompare(b[field]);
        });
        setPurchaseOrders(sorted);
    };

    // const pendingPOs = purchaseOrders.filter(
    //   (po) => po.status === "Pending"
    // ).length;

    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedPO, setSelectedPO] = useState(null);

    const handleConvertToInvoice = (po) => {
        setSelectedPO(po);
        setShowInvoiceModal(true);
    };

    const calculateTax = (amount) => amount * 0.1;
    const calculateTotal = (amount) => amount + calculateTax(amount);

    // PO Add Form
    const [showAddPOModal, setShowAddPOModal] = useState(false);
    const [poNumber, setPONumber] = useState("");
    const [poDate, setPODate] = useState("");
    const [poAmount, setPOAmount] = useState("");
    const [poDocument, setPODocument] = useState(null);

    const handleFileUpload = (e) => {
        setPODocument(e.target.files[0]);
    };

    const handleSavePO = () => {
        console.log("PO Number:", poNumber);
        console.log("PO Date:", poDate);
        console.log("PO Amount:", poAmount);
        console.log("PO Document:", poDocument);
        setShowAddPOModal(false);
    };

    // const [purchaseOrders, setPurchaseOrders] = useState(
    //   initialPurchaseOrders.map(po => ({ ...po, invoiceStatus: 'Active' }))
    // );
    const updateInvoiceStatus = (index, newStatus) => {
        const updatedPOs = [...purchaseOrders];
        updatedPOs[index].invoiceStatus = newStatus;
        setPurchaseOrders(updatedPOs);
    };

    const { estimates, loading, error } = useSelector((state) => state.costEstimates);
    useEffect(() => {
        dispatch(fetchCostEstimates());
    }, [dispatch]);




    const Duplicate = (po) => {
        navigate(`/admin/AddCostEstimates`, {
            state: {
                po,
                isDuplicate: true
            }
        });
    }
    const UpdateEstimate = (po) => {
        navigate(`/admin/AddCostEstimates`, {
            state: {
                po,
            }
        });
    }
    //     const Duplicate =(po)=>{    
    //  navigate(`/duplicate/AddCostEstimates/${po._id}`, { state: { po}});
    //   }

    const getStatusClass = (status) => {
        switch ((status || "").toLowerCase().trim()) {
            case "active":
            case "active project":
            case "open":
                return "bg-warning text-dark";
            case "inactive":
                return "bg-warningtext-dark";
            case "in progress":
            case "pending":
                return "bg-warning text-dark";
      
        }
    };

    const handleDelete = (_id) => {
        console.log(_id);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteCostEstimate(_id))
                    .then(() => {
                        Swal.fire("Deleted!", "The document has been deleted.", "success");
                        dispatch(fetchCostEstimates());
                    })
                    .catch(() => {
                        Swal.fire("Error!", "Something went wrong.", "error");
                    });
            }
        });
    }

    // PAGINATION SETUP FOR ESTIMATES
 const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 7;

// Filter only pending estimates
const filteredEstimates = estimates?.costEstimates?.filter(
  (proj) =>
    (proj.POStatus || "").toLowerCase().replace(/\s|_/g, "") === "pending"
) || [];

// Calculate pagination based on filtered data
const totalItems = filteredEstimates.length;
const totalPages = Math.ceil(totalItems / itemsPerPage);

// Apply pagination to filtered data
const paginatedEstimates = filteredEstimates
  .slice()
  .reverse()
  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    return (
        <div
            className="p-4 m-3"
            style={{ backgroundColor: "white", borderRadius: "10px" }}
        >
            <h2 className="fw-semibold mb-3">Cost Estimates</h2>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="filters d-flex flex-wrap gap-1 mb-4">
                    <div className="search-container flex-grow-1">
                        <Form.Control
                            type="search"
                            placeholder="Search by Job #, Brand Name, Sub Brand, Flavour, Pack Type, Pack Size..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* <Dropdown className="filter-dropdown">
            <Dropdown.Toggle
              variant="light"
              id="designer-dropdown"
              className="custom-dropdown"
            >
              Sort by Client
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Sort by Client</Dropdown.Item>
              <Dropdown.Item>John Smith</Dropdown.Item>
              <Dropdown.Item>Sarah Johnson</Dropdown.Item>
              <Dropdown.Item>Unassigned</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

           <Dropdown className="filter-dropdown">
            <Dropdown.Toggle variant="light" id="priority-dropdown" className="custom-dropdown">
              All Priorities
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>All Priorities</Dropdown.Item>
              <Dropdown.Item>High</Dropdown.Item>
              <Dropdown.Item>Medium</Dropdown.Item>
              <Dropdown.Item>Low</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> 

          <Dropdown className="filter-dropdown">
            <Dropdown.Toggle
              variant="light"
              id="viewall-dropdown"
              className="custom-dropdown"
            >
              View All
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Active</Dropdown.Item>
              <Dropdown.Item>Invoiced</Dropdown.Item>
              <Dropdown.Item>Cancelled</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="filter-dropdown">
            <Dropdown.Toggle
              variant="light"
              id="status-dropdown"
              className="custom-dropdown"
            >
              All Status
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Active</Dropdown.Item>
              <Dropdown.Item>Invoice</Dropdown.Item>
              <Dropdown.Item>Cancelled</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Link to={"/AddCostEstimates"}>
            <button id="btn-All" className=" btn-dark" style={{border:"none",borderRadius:"10px"}}>
              <BsPlusLg className="me-2" /> New Estimate
            </button>
          </Link> */}
                </div>
            </div>

            <div className="table-responsive" style={{ maxHeight: "900px", overflowY: "auto" }}>
                <Table hover className="align-middle sticky-header">
                    <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                        <tr>
                            <th><input type="checkbox" /></th>
                            <th>CENo</th>
                            <th>Date</th>
                            <th>Client</th>
                            <th>ProjectNo</th>
                            <th>ProjectName</th>
                            <th>Amount</th>
                            <th>POStatus</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEstimates?.map((po, index) => (
                            <tr style={{ whiteSpace: "nowrap" }} key={po.poNumber}>
                                <td><input type="checkbox" /></td>
                                <td onClick={() => CreatJobs(po.projectId)}>
                                    <Link style={{ textDecoration: 'none', border: 'none', color: 'inherit' }}>
                                        CE-{String((currentPage - 1) * itemsPerPage + index + 1).padStart(4, '0')}
                                    </Link>
                                </td>
                                <td>{new Date(po.estimateDate).toLocaleDateString("en-GB").slice(0, 8)}</td>
                                <td>
                                    {
                                        Array.isArray(po.clientId)
                                            ? po.clientId.map((client, i) => `${String(i + 1).padStart(4, '0')} (${client._id})`).join(", ")
                                            : po.clientId
                                                ? `${String(1).padStart(4, '0')} `
                                                : "N/A"
                                    }
                                </td>
                                <td>
                                    {po.projectId?.map((project, i) => `${String(i + 1).padStart(4, '0')}`).join(", ")}
                                </td>
                                <td>
                                    {po.projectId?.map((project) => project.projectName || project.name).join(", ")}
                                </td>
                                <td>
                                    {po.lineItems?.reduce((total, item) => total + (item.amount || 0), 0).toFixed(2)}
                                </td>
                                <td>
                                    <span className={`badge ${getStatusClass(po.Status)} px-2 py-1`}>
                                        {po.POStatus}
                                    </span>
                                </td>
                                <td>
                                    <span className={` badge ${getStatusClass(po.Status)} px-2 py-1`}>
                                        {po.Status}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        {/* <button className="btn btn-sm btn-primary" onClick={() => Duplicate(po)}>Duplicate</button>
                    <button className="btn btn-sm btn-primary" onClick={() => handleConvertToInvoice(po)}>ConvertInvoice</button>
                    <button className="btn btn-sm btn-success" onClick={() => setShowAddPOModal(true)}>AddPO</button> */}
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => UpdateEstimate(po)}><BsPencil /></button>
                                        {/* <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(po._id)}>
                          <FaTrash />
                        </button> */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>


            {/* Modal for converting to invoice */}
            <Modal
                show={showInvoiceModal}
                onHide={() => setShowInvoiceModal(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Convert Estimate to Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Invoice Number</Form.Label>
                            {/* <Form.Control
                type="text"
                defaultValue={
                  selectedPO
                    ? `INV-${selectedPO.estimateRef.split("-")[1]}`
                    : ""
                }
                disabled
              /> */}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Invoice Date</Form.Label>
                            <Form.Control type="date" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Client</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={selectedPO?.client}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control type="date" />
                        </Form.Group>
                        <hr />
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" defaultValue="Web Design Services" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" defaultValue="1" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rate</Form.Label>
                            <Form.Control type="number" defaultValue={selectedPO?.amount} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="text"
                                // value={`$${selectedPO?.amount.toFixed(2)}`}
                                disabled
                            />
                        </Form.Group>
                        <hr />
                        <div className="d-flex justify-content-between">
                            <div>
                                <strong>Subtotal:</strong>
                                {/* <span> ${selectedPO?.amount.toFixed(2)}</span> */}
                            </div>
                            <div>
                                <strong>Tax (10%):</strong>
                                {/* <span> ${calculateTax(selectedPO?.amount).toFixed(2)}</span> */}
                            </div>
                            <div>
                                <strong>Total:</strong>
                                {/* <span> ${calculateTotal(selectedPO?.amount).toFixed(2)}</span> */}
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowInvoiceModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary">Create Invoice</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Add Purchase Order */}
            <Modal
                show={showAddPOModal}
                onHide={() => setShowAddPOModal(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Purchase Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>PO Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter PO number"
                                value={poNumber}
                                onChange={(e) => setPONumber(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>PO Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={poDate}
                                onChange={(e) => setPODate(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>PO Amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter PO amount"
                                value={poAmount}
                                onChange={(e) => setPOAmount(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Upload PO Document</Form.Label>
                            <div className="file-upload">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileUpload}
                                />
                                <div className="upload-info">
                                    <BsUpload className="me-2" /> Upload a file (PDF, DOC up to
                                    10MB)
                                </div>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddPOModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSavePO}>
                        Save PO
                    </Button>
                </Modal.Footer>
            </Modal>

            {!loading && !error && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="text-muted small">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                    </div>
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                                Previous
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
                                Next
                            </button>
                        </li>
                    </ul>
                </div>

            )}

        </div>
    )
}

export default CostEstimatesDashbord
