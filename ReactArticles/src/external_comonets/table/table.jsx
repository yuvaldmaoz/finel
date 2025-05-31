import styles from "./tableComponent.module.css";

export default function TableComponent({ data }) {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Supplier Name</th>
            <th>Price (₪)</th>
            <th>Category</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.Supplier_Name}</td>
              <td>{product.Price}</td>
              <td >
                {product.Category}
              </td>
              <td>{product.Product_Name}</td>
              <td>{product.Quantity}</td>
              <td>{product.Expiration_Date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
