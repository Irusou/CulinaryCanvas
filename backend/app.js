const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const tableRouter = require("./routes/tables");
const productRoutes = require("./routes/products");
const typeRoutes = require("./routes/types");
const orderRoutes = require("./routes/orders");

app.set("views", "./public");
app.set("view engine", "html");

app.use(express.static(path.join(__dirname, "/public")));

app.use(cors());

app.use(express.json({ extended: true }));

app.use("/tables", tableRouter);

app.use("/products", productRoutes);

app.use("/product-types", typeRoutes);

app.use("/order-items", orderRoutes);

app.get("/", (_req, res) => {
	res.render("index");
});

module.exports = app;
