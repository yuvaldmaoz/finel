const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const productsRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");
const taskRoutes = require("./routes/task");
const DashboardRoutes = require("./routes/Dashboard");
const Dashboard_employeeRoutes = require("./routes/Dashboard_employee");
const ShiftRoutes = require("./routes/Shift");
const suppliersRoutes = require("./routes/suppliers");
const categoriesRoutes = require("./routes/categories");
const clientRoutes = require("./routes/client");







const cors = require("cors");
const port = 8801;

app.use(express.json());

app.use(cors());
app.use("/users", userRoutes);
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/task", taskRoutes);
app.use("/Dashboard", DashboardRoutes);
app.use("/Dashboard_employee", Dashboard_employeeRoutes);
app.use("/Shift", ShiftRoutes);
app.use("/suppliers", suppliersRoutes);
app.use("/categories", categoriesRoutes);
app.use("/client", clientRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
