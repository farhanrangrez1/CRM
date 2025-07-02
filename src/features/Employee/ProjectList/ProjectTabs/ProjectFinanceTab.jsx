import React from 'react';

function ProjectFinanceTab({ budget, purchaseOrders }) {
  return (
    <div className="row g-4">
      {/* Budget Overview Card */}
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Budget </h5>
          </div>
          <div className="card-body">
            <div className="row g-4">
              <div className="col-md-3">
                <div className="text-center">
                  <h6 className="text-muted mb-2">Estimated Budget</h6>
                  <h3 className="mb-0">{budget.estimated}</h3>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <h6 className="text-muted mb-2">Actual Spent</h6>
                  <h3 className="mb-0">{budget.actual}</h3>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <h6 className="text-muted mb-2">Status</h6>
                  <h3 className={`mb-0 ${budget.isUnderBudget ? 'text-success' : 'text-danger'}`}>
                    {budget.status}
                  </h3>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <h6 className="text-muted mb-2">Remaining</h6>
                  <h3 className="mb-0">
                    {parseFloat(budget.estimated.replace('$', '').replace(',', '')) -
                      parseFloat(budget.actual.replace('$', '').replace(',', ''))}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Orders */}
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Purchase Orders</h5>
            <button className="btn btn-primary btn-sm">
              <i className="bi bi-plus"></i> New Purchase Order
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PO-001</td>
                    <td>Materials</td>
                    <td>$12,000</td>
                    <td><span className="badge bg-success">Approved</span></td>
                    <td>2024-01-15</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        <i className="bi bi-eye"></i> View
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-download"></i> Download
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>PO-002</td>
                    <td>Services</td>
                    <td>$8,500</td>
                    <td><span className="badge bg-warning">Pending</span></td>
                    <td>2024-01-18</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        <i className="bi bi-eye"></i> View
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-download"></i> Download
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Estimates Section */}
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Cost Estimates</h5>
            <button className="btn btn-primary btn-sm">
              <i className="bi bi-plus"></i> Add Estimate
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Estimate ID</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty state - will be populated with project data */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Received POs Section */}
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Received POs</h5>
            <button className="btn btn-primary btn-sm">
              <i className="bi bi-plus"></i> Add PO
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Vendor</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date Received</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty state - will be populated with project data */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Section */}
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Invoices</h5>
            <button className="btn btn-primary btn-sm">
              <i className="bi bi-plus"></i> Add Invoice
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Invoice Number</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty state - will be populated with project data */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary Charts */}
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Monthly Expenses</h5>
          </div>
          <div className="card-body">
            <div className="text-center py-5">
              <p className="text-muted">Chart will be implemented here</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Budget Distribution</h5>
          </div>
          <div className="card-body">
            <div className="text-center py-5">
              <p className="text-muted">Chart will be implemented here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectFinanceTab;