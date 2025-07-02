import React from 'react';
import PurchaseOrder from './PurchaseOrder';
import ReceivablePurchaseOrders from './ReceivablePurchaseOrders';
import Invoicing_Billing from '../../Invoicing_Billing/Invoicing_Billing';

function ProjectFinanceTab({ budget, purchaseOrders }) {
  return (
    <div className="row g-4">
   
      {/* Purchase Orders */}
      <div className="col-12">
      <PurchaseOrder/>
      </div>

      {/* Received POs Section */}
      <div className="col-12">
        <ReceivablePurchaseOrders/>
      </div>

      {/* Financial Summary Charts */}
      <div className="col-12">
        <Invoicing_Billing/>
      </div>

    </div>
  );
}

export default ProjectFinanceTab;