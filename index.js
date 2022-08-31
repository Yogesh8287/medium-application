require("dotenv").config();
const exprees = require("express");
require("express-async-errors");
const mongoose = require("mongoose");
const app = exprees();
const error = require("./app/middleware/error");
const user = require("./app/router/user");
const auth = require("./app/router/auth");
const article = require("./app/router/article");
const search = require("./app/router/search")

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

mongoose
  .connect("mongodb://localhost/medium")
  .then(() => console.log("connect to mongodb.."))
  .catch(() => console.log("connect to mongodb.."));

app.use(exprees.json());
app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/article", article);
app.use("/api/search", search);


app.use(error);

const Port = process.env.PORT || 5000;
app.listen(Port, () => console.log(`Listening on port ${Port}...`));
