import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to fetch food list");
      }
    } catch (error) {
      toast.error("Server error while fetching list");
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (foodId) => {
    const confirm = window.confirm("Are you sure you want to delete this item?");
    if (!confirm) return;

    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      toast.error("Server error while deleting item");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="list-table">
          <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
          </div>

          {list.length === 0 ? (
            <p>No products found</p>
          ) : (
            list.map((item) => (
              <div key={item._id} className="list-table-format">
                <img
                  src={`${url}/images/${item.image}`}
                  alt={item.name}
                />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>₹{item.price}</p>
                <p
                  onClick={() => removeFood(item._id)}
                  className="cursor"
                >
                  ❌
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default List;
