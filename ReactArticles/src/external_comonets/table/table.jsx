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
            {role !== "admin" && role !== "client" && <th>תאריך תפוגה</th>}
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
              {role !== "admin" && role !== "client" && (
                <td
                  className={(() => {
                    if (!product.Expiration_Date) return undefined; // אם אין תאריך - לא מוסיפים class

                    const [day, month, year] =
                      product.Expiration_Date.split("/");
                    const exp = new Date(`${year}-${month}-${day}`);

                    const now = new Date();
                    exp.setHours(0, 0, 0, 0);
                    now.setHours(0, 0, 0, 0);

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
