import { Link } from "react-router-dom";

const MyOrders = () => {
  const orders = [];
  return (
    <>
      <div className="card shadow-sm rounded">
        <div className="card-body">
          <h4 className="mb-3 fw-bold">My Orders</h4>
          {orders.length > 0 ? (
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
                      <td>{order.product}</td>
                      <td>{order.date}</td>
                      <td>
                        <span className={`badge ${order.status === "Delivered"
                          ? "bg-success" : order.status === "Shipped" ? "bg-info" : "bg-danger"}`} >
                          {order.status}
                        </span>
                      </td>
                      <td>{order.price}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">

              <h5 className="mt-3">You haven't placed any orders yet!</h5>
              <p className="text-muted">
                Order section is empty. After placing order, you can track
                them from here.
              </p>
              <Link to="/admin/products" className="btn btn-primary">Continue Shopping</Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MyOrders
