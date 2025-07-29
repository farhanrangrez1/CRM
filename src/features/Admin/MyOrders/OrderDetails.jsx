import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { apiInventoryUrl } from "../../../redux/utils/config";
import { FaArrowLeft, FaEnvelope, FaUser, FaBoxOpen, FaCreditCard } from "react-icons/fa";

const OrderDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const userData = JSON.parse(localStorage.getItem("InventoryUser"));
    const userId = userData?.id;

    useEffect(() => {
        const fetchFilteredOrders = async () => {
            try {
                const res = await axios.get(
                    `${apiInventoryUrl}/cart/getUserCartWithPayments/${userId}`
                );
                const allOrders = res.data.data;
                const filtered = allOrders.filter(
                    (order) => order.productId == productId
                );
                setFilteredOrders(filtered);
            } catch (error) {
                console.error("Error fetching filtered orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchFilteredOrders();
    }, [userId, productId]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3">Loading order details...</p>
            </div>
        );
    }

    if (filteredOrders.length === 0) {
        return (
            <div className="container py-5 text-center">
                <h4>No orders found for Product ID: {productId}</h4>
                <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="me-2" />
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-primary">🧾 Order Summary</h2>
                <button className="btn btn-outline-dark" onClick={() => navigate(-1)}>
                    <FaArrowLeft className="me-2" />
                    Back
                </button>
            </div>

            {filteredOrders.map((order) => (
                <div key={order.id} className="card shadow-lg rounded-4 overflow-hidden mb-5 border-0">
                    <div className="row g-0">
                        <div className="col-md-4 bg-light d-flex align-items-center justify-content-center p-3">
                            <img
                                src={order.image}
                                alt={order.productName}
                                className="img-fluid rounded-3"
                                style={{ maxHeight: "240px", objectFit: "contain" }}
                            />
                        </div>

                        <div className="col-md-8">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h4 className="text-dark fw-semibold mb-2">
                                            <FaBoxOpen className="me-2 text-secondary" />
                                            {order.productName}
                                        </h4>
                                        <p className="text-muted">{order.description}</p>
                                    </div>
                                    <span
                                        className={`badge fs-6 px-3 py-2 ${order.status === "succeeded"
                                            ? "bg-success"
                                            : order.status === "failed"
                                                ? "bg-danger"
                                                : "bg-warning text-dark"
                                            }`}
                                    >
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <p className="mb-1">
                                            <strong>Order ID:</strong> <span className="text-muted">{order.id}</span>
                                        </p>
                                        <p className="mb-1">
                                            <strong>Product ID:</strong> <span className="text-muted">{order.productId}</span>
                                        </p>
                                        <p className="mb-1">
                                            <strong>Order Date:</strong>{" "}
                                            <span className="text-muted">{moment(order.createdAt).format("DD MMM YYYY, h:mm A")}</span>
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="mb-1">
                                            <strong><FaCreditCard className="me-1" />Payment ID:</strong> <span className="text-muted">{order.paymentIntentId}</span>
                                        </p>
                                        <p className="mb-1">
                                            <strong>Total Paid:</strong>{" "}
                                            <span className="text-success fw-bold fs-5">₹{order.amount}</span>
                                        </p>
                                    </div>
                                </div>

                                <hr />

                                <div className="pt-2">
                                    <h5 className="fw-bold mb-3">👤 Customer Information</h5>
                                    <p className="mb-1"><FaUser className="me-2 text-primary" />{order.firstName} {order.lastName}</p>
                                    <p><FaEnvelope className="me-2 text-primary" />{order.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderDetails;
