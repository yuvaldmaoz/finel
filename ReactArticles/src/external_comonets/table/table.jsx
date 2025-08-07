import styles from "./tableComponent.module.css";

export default function TableComponent({ data, role }) {
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
            {role !== "admin" && <th>תאריך תפוגה</th>}
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
              {role !== "admin" && (
                <td
                  className={(() => {
                    const exp = new Date(product.Expiration_Date);
                    const now = new Date();
                    // הוסף class רק אם תאריך התפוגה עבר
                    return exp < now ? styles.lowStock : undefined;
                  })()}
                >
                  
                  {product.Expiration_Date}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
