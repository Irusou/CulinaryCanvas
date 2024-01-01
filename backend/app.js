const express = require("express");
const app = express();
const tableRouter = require("./routes/tables");
const productRoutes = require("./routes/products");
//const typeRoutes = require("./routes/types");

app.use(express.json({ extended: true }));

app.use("/api/tables", tableRouter);

app.use("/api/products", productRoutes);

//app.use("/api/types", typeRoutes);

app.get("/", (_req, res) => {
	res.send("server running");
});

module.exports = app;
