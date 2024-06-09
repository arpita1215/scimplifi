/** @format */

const express = require("express");
const passport = require("passport");
const cookies = require("cookie-parser");
const path = require("path");
require("./config/passport")(passport);
require("dotenv").config();

const { initDB } = require("./connector/db");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookies());

// controllers
const users = require("./controller/users");
//
//routes
app.use("/api", users);

initDB().then(() => {
  const port = process.env.PORT || 5000;

  if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
      res.sendFile(
        path.resolve(__dirname + "/client/build/index.html"),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
    });
  }

  app.listen(port, function () {
    console.log("Server started on port " + port);
  });
});

app.get("/api", (req, res) => res.send("DOODLE Keep Backend @v1.0.0.0"));
