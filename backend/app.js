const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

// Route Imports
const event = require("./routes/eventRoute");
const user = require("./routes/userRoutes");

app.use("/", event);
app.use("/", user);

// Middleware for errors
app.use(errorMiddleware);

module.exports = app;