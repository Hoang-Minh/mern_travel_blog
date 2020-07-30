const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const middlewares = require("./middlewares/error");
const logs = require("./api/logs");
const PORT = process.env.PORT || 5000;

mongoose.connect(keys.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/logs", logs);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

db.once("open", () => console.log("Database connected")).on("error", () =>
  console.log("Database error")
);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
