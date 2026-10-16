
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Resolve assets relative to this file so tests work from any working directory.
const PUBLIC_DIR = path.resolve(__dirname, "../public");

function sendHtmlPage(res, filename) {
  const filePath = path.join(PUBLIC_DIR, filename);

  fs.readFile(filePath, "utf8", (err, html) => {
    if (err) {
      console.error(`Failed to read page at ${filePath}:`, err);
      return res.status(500).send("Unable to load page");
    }

    return res.type("html").send(html);
  });
}

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
  sendHtmlPage(res, "login.html");
});

// Login page alternative URL
app.get("/login.html", (req, res) => {
  sendHtmlPage(res, "login.html");
});

// Home page - require authentication cookie
app.get("/home", (req, res) => {
  if (!req.headers.cookie || !req.headers.cookie.includes("auth=true")) {
    return res.redirect("/");
  }

  sendHtmlPage(res, "home.html");
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
