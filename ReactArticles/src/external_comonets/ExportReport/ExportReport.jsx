import React from 'react';

const ExportReport = ({ list }) => {
  const generateInventoryReport = () => {
    const reportDate = new Date().toLocaleDateString("he-IL");
    let csvContent = "דוח מלאי\n";
    csvContent += `תאריך הפקה: ${reportDate}\n\n`;
    csvContent += "מזהה,שם ספק,מחיר,קטגוריה,שם מוצר,כמות,תאריך תפוגה\n";

    list.forEach((item) => {
      const expirationDate = new Date(item.Expiration_Date).toLocaleDateString("he-IL");
      csvContent += `${item.id},${item.Supplier_Name},${item.Price},${item.Category},${item.Product_Name},${item.Quantity},${expirationDate}\n`;
    });

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `דוח_מלאי_${reportDate.replace(/\//g, "-")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={generateInventoryReport}
      style={{
        margin: "10px",
        padding: "8px 16px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
      }}
    >
      הפק דוח מלאי
    </button>
  );
};

export default ExportReport;
