const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./src/db/config");
const allRoutes = require('./src/app');

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api", allRoutes);

app

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});