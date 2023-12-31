require("dotenv").config();
const mysql = require("mysql2/promise");

const connection = mysql.createPool({
	host: process.env.HOST,
	port: process.env.DBPORT,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DB,
});

module.exports = connection;
