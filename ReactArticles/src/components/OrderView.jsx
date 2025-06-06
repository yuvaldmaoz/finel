import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ExportReport from "../external_comonets/ExportReport/ExportReport";
import TableComponent from "../external_comonets/table/table";

function OrderView() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    axios
      .get(`/orders/details/${id}`)
      .then((res) => {
        setOrderDetails(res.data);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
      });
  }, [id]);

  const totalPrice = orderDetails.reduce((total, order) => {
    const price = parseFloat(order.Price);
    const quantity = parseInt(order.Quantity, 10);
    return total + price * quantity;
  }, 0);

  return (
    <div className="main">
      <section className="post">
        <div className="container">
          <h1 className="post-title">הזמנה מספר {id}</h1>
          <p>{totalPrice}מחיר ההזמנה </p>
          <div className="single-post">
            <ExportReport list={orderDetails} />

            <TableComponent data={orderDetails} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderView;
