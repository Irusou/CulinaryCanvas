const express = require("express");
const app = express();
const tableRouter = require("./routes/tables");
const productRoutes = require("./routes/products");
//const typeRoutes = require("./routes/types");

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.json({ extended: true }));

app.use("/api/tables", tableRouter);

app.use("/api/products", productRoutes);

//app.use("/api/types", typeRoutes);

app.get("/", (req, res) => {
	res.render("index", { title: "Endpoints" });
});

module.exports = app;
