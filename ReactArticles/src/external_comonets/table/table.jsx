import styles from "./tableComponent.module.css";

export default function TableComponent({ data }) {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>מקט</th>
            <th>שם ספק</th>
            <th>מחיר (₪)</th>
            <th>קטגוריה</th>
            <th>שם מוצר</th>
            <th>כמות</th>
            <th>תאריך תפוגה</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.Supplier_Name}</td>
              <td>{product.Price}</td>
              <td>{product.Category}</td>
              <td>{product.Product_Name}</td>
              <td
                className={product.Quantity < 5 ? styles.lowStock : undefined}
              >
                {product.Quantity}
              </td>
              <td
                className={(() => {
                  const exp = new Date(product.Expiration_Date);
                  const now = new Date();
                  const diff = (exp - now) / (1000 * 60 * 60 * 24); // difference in days
                  // If the difference is less than 2 days OR expiration date has passed, apply lowStock style
                  return diff <= 5 ? styles.lowStock : undefined;
                })()}
              >
                {product.Expiration_Date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
