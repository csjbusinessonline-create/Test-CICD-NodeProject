
const request = require("supertest");
const app = require("../src/app");

describe("Login API", () => {
  test("should login successfully with correct credentials", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        username: "chamupathi",
        password: "admin123",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Login successful",
    });

    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toContain("auth=true");
  });

  test("should reject incorrect password", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        username: "chamupathi",
        password: "wrongpassword",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      success: false,
      message: "Invalid username or password",
    });
  });

  test("should reject incorrect username", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        username: "wronguser",
        password: "admin123",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("should reject empty credentials", async () => {
    const response = await request(app)
      .post("/login")
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Username and password are required",
    });
  });

  test("should reject missing username", async () => {
    const response = await request(app)
      .post("/login")
      .send({ password: "admin123" });

    expect(response.statusCode).toBe(400);
  });

  test("should reject missing password", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "chamupathi" });

    expect(response.statusCode).toBe(400);
  });
});

describe("Login page routes", () => {
  test("GET / should return the login page", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
  });

  test("GET /login.html should return the login page", async () => {
    const response = await request(app).get("/login.html");

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
  });
});

describe("Home route authentication", () => {
  test("should redirect unauthenticated users to login", async () => {
    const response = await request(app).get("/home");

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/");
  });

  test("should serve the home page with auth cookie", async () => {
    const response = await request(app)
      .get("/home")
      .set("Cookie", "auth=true");

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
  });

  test("should redirect when auth cookie is false", async () => {
    const response = await request(app)
      .get("/home")
      .set("Cookie", "auth=false");

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/");
  });
});
