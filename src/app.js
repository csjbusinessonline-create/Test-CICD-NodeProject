
const express = require("express");
const path = require("path");

const app = express();

// Resolve assets relative to this file so tests work from any working directory.
const PUBLIC_DIR = path.resolve(__dirname, "../public");

// Disable Express framework disclosure
app.disable("x-powered-by");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static credentials - no database
const USER = {
  username: "chamupathi",
  password: "admin123",
};

// Login page
app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "login.html"), (err) => {
    if (err) {
      console.error("Login page error:", err);
      if (!res.headersSent) {
        res.status(err.statusCode || 500).send("Unable to load login page");
      }
    }
  });
});

// Login page alternative URL
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "login.html"), (err) => {
    if (err) {
      console.error("Login page error:", err);
      if (!res.headersSent) {
        res.status(err.statusCode || 500).send("Unable to load login page");
      }
    }
  });
});

// Home page - require authentication cookie
app.get("/home", (req, res) => {
  if (!req.headers.cookie || !req.headers.cookie.includes("auth=true")) {
    return res.redirect("/");
  }

  res.sendFile(path.join(PUBLIC_DIR, "home.html"), (err) => {
    if (err) {
      console.error("Home page error:", err);
      if (!res.headersSent) {
        res.status(err.statusCode || 500).send("Unable to load home page");
      }
    }
  });
});

// Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  if (
    username === USER.username &&
    password === USER.password
  ) {
    res.cookie("auth", "true", {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password",
  });
});

module.exports = app;
