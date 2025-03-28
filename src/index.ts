import { Hono } from "hono";
import todos from "./routes/todos";

const app = new Hono();
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ msg: err.message }, 500);
});
app.get("/", (c) => {
  return c.json({
    "GET /": "Hello from Hono, this is where you are now",
    "GET /todos": "List all todos",
    "GET /todos/:id": "Serve todo by id if it exists",
    "POST /todos": "Add new todo",
    "DELETE /todos/:id": "Delete todo by ID",
    "PATCH /todos/:id": "Update todo by ID",
  });
});
app.route("/todos", todos);

export default app;
