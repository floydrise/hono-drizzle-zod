CREATE TABLE "todos" (
                         "id" serial PRIMARY KEY NOT NULL,
                         "title" text NOT NULL,
                         "is_done" boolean DEFAULT false
);