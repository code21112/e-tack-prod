const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const { readdirSync } = require("fs");
const path = require("path");

require("dotenv").config();

// APP
const app = express();

//   MIDDLEWARES
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(
  express.urlencoded({
    extended: true,
  })
);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "./../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./../client/build/index.html"));
  });
}

// DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected !!"))
  .catch((error) => console.log(`DB connection error: ${error}`));

// // ROUTES MIDDLEWARES
readdirSync("./routes").map((file) =>
  app.use("/api", require(`./routes/${file}`))
);

// PORT
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}.`));
