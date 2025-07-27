import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

beforeAll(() => {
  console.log("Setting up test environment");
});

afterAll(() => {
  console.log("Cleaning up test environment");
});
