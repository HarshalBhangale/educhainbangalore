import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const workouts = pgTable("workouts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id),
  pushups: integer("pushups").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertWorkoutSchema = createInsertSchema(workouts);
export const selectWorkoutSchema = createSelectSchema(workouts);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = z.infer<typeof selectWorkoutSchema>;
