import app from "../src";
import { describe, expect, it, beforeEach } from "bun:test";
import { TodoInterface, todos } from "../drizzle/schema";
import { db } from "../src/db";
import { reset, seed } from "drizzle-seed";

beforeEach(async () => {
  await reset(db, { todos });
  await seed(db, { todos });
});

describe("GET /todos", async () => {
  it("should return status 200", async () => {
    const req = new Request("http://localhost:3000/todos");
    const res = await app.request(req);
    expect(res.status).toBe(200);
  });
  it("should return an array", async () => {
    const req = new Request("http://localhost:3000/todos");
    const res = await app.request(req);
    const data: TodoInterface[] = await res.json();
    expect(data).toBeArray();
  });
  it("each obj in the arr should have the defined properties", async () => {
    const req = new Request("http://localhost:3000/todos");
    const res = await app.request(req);
    const data: TodoInterface[] = await res.json();
    if (data.length > 0) {
      data.forEach((obj) => {
        expect(obj).toContainKeys(["id", "title", "isDone"]);
      });
    }
  });
});

describe("GET /todos/:id ", async () => {
  it("should return status 200", async () => {
    const req = new Request("http://localhost:3000/todos/1");
    const res = await app.request(req);
    expect(res.status).toBe(200);
  });
  it("should return data type of object", async () => {
    const req = new Request("http://localhost:3000/todos/1");
    const res = await app.request(req);
    const data: TodoInterface = await res.json();
    expect(data).toBeObject();
  });
  it("should have the set of properties", async () => {
    const req = new Request("http://localhost:3000/todos/1");
    const res = await app.request(req);
    const data: TodoInterface = await res.json();
    expect(data).toContainKeys(["id", "title", "isDone"]);
  });
});

describe("POST /todos", async () => {
  it("should return status 200", async () => {
    const req = new Request("http://localhost:3000/todos", {
      method: "POST",
      body: JSON.stringify({ title: "Test request", isDone: false }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await app.request(req);
    expect(res.status).toBe(200);
  });
  it("should return the posted todo", async () => {
    const req = new Request("http://localhost:3000/todos", {
      method: "POST",
      body: JSON.stringify({ title: "Test request", isDone: false }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await app.request(req);
    const data = await res.json();
    expect(data).toMatchObject({ title: "Test request", isDone: false });
  });
});

describe("PATCH /todos/:id", async () => {
  it("should patch the isDone to true", async () => {
    const req = new Request("http://localhost:3000/todos/1", {
      method: "PATCH",
      body: JSON.stringify({ is_done: true }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await app.request(req);
    const data: TodoInterface = await res.json();
    expect(data.isDone).toBe(true);
  });
});

describe("DELETE /todos/:id", async () => {
  it("should return status 200", async () => {
    const deleteReq = new Request("http://localhost:3000/todos/10", {
      method: "DELETE",
    });
    const deleteRes = await app.request(deleteReq);
    const getReq = new Request("http://localhost:3000/todos");
    const getRes = await app.request(getReq);
    const data: TodoInterface[] = await getRes.json();
    expect(deleteRes.status).toBe(200);
    expect(data).toHaveLength(9);
  });
});
