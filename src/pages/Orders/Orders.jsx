import React, { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Server error while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId, currentStatus) => {
    const newStatus = event.target.value;

    if (currentStatus === "Delivered") {
      toast.info("Order already delivered");
      return;
    }

    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: newStatus,
      });

      if (response.data.success) {
        toast.success("Order status updated");
        fetchAllOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Server error while updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Orders</h3>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-item">
              <img src={assets.parcel_icon} alt="Order Parcel" />

              <div>
                <p className="order-item-food">
                  {order.items.map((item) => (
                    <span key={item._id || item.name}>
                      {item.name} x {item.quantity},{" "}
                    </span>
                  ))}
                </p>

                <p className="order-item-name">
                  {order.address.firstName} {order.address.lastName}
                </p>

                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.country} - {order.address.zipcode}
                  </p>
                </div>

                <p className="order-item-phone">
                  📞 {order.address.phone}
                </p>
              </div>

              <p>Items: {order.items.length}</p>
              <p>₹{order.amount}</p>

              <select
                value={order.status}
                onChange={(e) =>
                  statusHandler(e, order._id, order.status)
                }
                disabled={order.status === "Delivered"}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
