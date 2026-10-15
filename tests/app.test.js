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
  });

  test("should reject incorrect password", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        username: "admin",
        password: "wrongpassword",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Invalid username or password"
    );
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
});