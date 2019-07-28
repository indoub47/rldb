"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const secret = require("./config/secret");

const users = require("./routes/api/users");
const items = require("./routes/api/items");
const journal = require("./routes/api/journal");
const things = require("./routes/api/things");
const fsqueries = require("./routes/api/fsqueries");
const operinput = require("./routes/api/operinput");
//const reports = require("./routes/api/reports");

const app = express();
require("./config/passport")(passport);

app.use((req, res, next) => {
  const delay = 0;
  const start = Date.now();
  while (Date.now() - start < delay) {}
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());

app.use("/api/users", users);
app.use("/api/items", items);
app.use("/api/journal", journal);
app.use("/api/things", things);
app.use("/api/fsqueries", fsqueries);
app.use("/api/operinput", operinput);
//app.use("/api/report", reports);
app.use("/", express.static("../client/"));

/**
 * Start listening on port 3000
 */

const PORT = 5000;
app.listen(PORT, () => {
 console.log(`Node express server is running on port ${PORT}!`);
});
