import { db } from "../db";
import { todos } from "../../drizzle/schema";
import { asc, eq } from "drizzle-orm";
import { validator } from "hono/validator";
import { Hono } from "hono";
import {
  todoSchema,
  idSchema,
  patchTodoSchema,
} from "../../zodSchemas/zodSchemas";

const app = new Hono();

app
  .get("/", async (c) => {
    const todoList = await db.select().from(todos).orderBy(asc(todos.id));
    return c.json(todoList, 200);
  })
  .post(
    "/",
    validator("json", (value, c) => {
      const parsed = todoSchema.safeParse(value);
      if (!parsed.success) {
        return c.json({ msg: "Bad request" }, 400);
      }
      return parsed.data;
    }),
    async (c) => {
      const { title, is_done } = c.req.valid("json");
      const returnedTodo = await db
        .insert(todos)
        .values({ title: title, isDone: is_done })
        .returning();
      return c.json(returnedTodo[0], 200);
    },
  )
  .delete(
    "/:id",
    validator("param", (value, c) => {
      const validatedId = idSchema.safeParse(value);
      if (!validatedId.success) {
        return c.json({ msg: "Bad request" }, 400);
      }
      return validatedId.data;
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const deleted = await db
        .delete(todos)
        .where(eq(todos.id, id))
        .returning();
      return c.json(deleted[0], 200);
    },
  )
  .get(
    "/:id",
    validator("param", (value, c) => {
      const validatedId = idSchema.safeParse(value);
      if (!validatedId.success) {
        return c.json({ msg: "Bad request" }, 400);
      }
      return validatedId.data;
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const todoById = await db.select().from(todos).where(eq(todos.id, id));
      if (todoById.length === 0) {
        return c.json({ msg: "Not found" }, 404);
      }
      return c.json(todoById[0], 200);
    },
  )
  .patch(
    "/:id",
    validator("param", (value, c) => {
      const validatedId = idSchema.safeParse(value);
      if (!validatedId.success) {
        return c.json({ msg: "Bad request" }, 400);
      }
      return validatedId.data;
    }),
    validator("json", (value, c) => {
      const validatedBody = patchTodoSchema.safeParse(value);
      if (!validatedBody.success) {
        return c.json({ msg: "Bad request" }, 400);
      }
      return validatedBody.data;
    }),
    async (c) => {
      const { id } = c.req.valid("param");
      const { title, is_done } = c.req.valid("json");
      const patchedTodo = await db
        .update(todos)
        .set({
          title: title,
          isDone: is_done,
        })
        .where(eq(todos.id, id))
        .returning();
      return c.json(patchedTodo[0]);
    },
  );

export default app;
