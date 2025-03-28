# Bun / Hono Todo REST API

 ---

Small CRUD REST API done as an exercise

Technologies:
> [Bun](https://bun.sh/) - Runtime environment
> 
> [Hono](https://hono.dev/) - Light web framework for building APIs
> 
> [Drizzle](https://orm.drizzle.team/) - ORM
> 
> [Zod](https://zod.dev/) - Validation
> 
> [Postgres](https://www.postgresql.org/) - Database

If you want to run it locally, you need Bun installed

To run locally:

1. Run `git clone https://github.com/floydrise/hono-drizzle-zod.git`
2. Run `bun install`
3. Create local Postgres DB
4. Create .env file in the root of the project
5. Add `DATABASE_URL=[postgres url]` in the .env file
6. Run `bunx drizzle-kit migrate`
7. Run `bun run dev`
8. Open `http://localhost:3000/`