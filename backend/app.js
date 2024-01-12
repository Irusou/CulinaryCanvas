const express = require("express");
const app = express();
const tableRouter = require("./routes/tables");
const productRoutes = require("./routes/products");
const typeRoutes = require("./routes/types");
//const orderRoutes = require("./routes/orders");

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.json({ extended: true }));

app.use("/tables", tableRouter);

app.use("/products", productRoutes);

app.use("/product-types", typeRoutes);

//app.use("/order-items", orderRoutes);

app.get("/", (req, res) => {
	res.render("index", { title: "Endpoints" });
});

module.exports = app;
