const express = require("express");
const app = express();
const tableRouter = require("./routes/tables");
//const productRoutes = require("./routes/products");
//const typeRoutes = require("./routes/types");

app.use(express.urlencoded({ extended: true }));

app.use("/", (_req, res) => {
	res.header("Content-Type", "text/html");
	res.send("<h1>hello world!</h1>");
});

app.use("/api/tables", tableRouter);

//app.use("/api/products", productRoutes);

//app.use("/api/types", typeRoutes);

module.exports = app;
