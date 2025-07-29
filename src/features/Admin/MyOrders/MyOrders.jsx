import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { apiInventoryUrl } from "../../../redux/utils/config";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem("InventoryUser"));
  const userId = userData?.id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${apiInventoryUrl}/cart/getUserCartWithPayments/${userId}`
        );
        setOrders(res.data.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "succeeded":
        return <span className="badge bg-success">Paid</span>;
      case "processing":
        return <span className="badge bg-warning text-dark">Processing</span>;
      case "failed":
        return <span className="badge bg-danger">Failed</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="card shadow-sm rounded">
      <div className="card-body">
        <h4 className="mb-3 fw-bold">My Orders</h4>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Fetching your orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={order.image}
                          alt={order.productName}
                          width="40"
                          height="40"
                          className="me-2 rounded"
                        />
                        {order.productName}
                      </div>
                    </td>
                    <td>{moment(order.createdAt).format("DD MMM YYYY")}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>₹{order.amount}</td>
                    <td>
                      <Link to={`/admin/order/${order.productId}`} className="btn btn-sm btn-outline-primary">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-center py-4">
              <h5 className="mt-3">Want to order more products?</h5>
              <p className="text-muted">Explore our full catalog and make another purchase.</p>
              <Link to="/admin/products" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <h5 className="mt-3">You haven't placed any orders yet!</h5>
            <p className="text-muted">
              Order section is empty. After placing an order, you can track them from here.
            </p>
            <Link to="/admin/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
