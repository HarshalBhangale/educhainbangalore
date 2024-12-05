import type { Express, Request, Response } from "express";
import { db } from "../db";
import { workouts, users } from "@db/schema";
import { eq, desc, sum } from "drizzle-orm";

import { insertUserSchema } from "@db/schema";
import { hash, compare } from "bcrypt";

export function registerRoutes(app: Express) {
  // User registration
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.username, username),
      });
      
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }
      
      // Hash password and create user
      const hashedPassword = await hash(password, 10);
      const [user] = await db
        .insert(users)
        .values({
          username,
          password: hashedPassword,
        })
        .returning();
      
      // Set session
      req.session.userId = user.id;
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // User login
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      // Find user
      const user = await db.query.users.findFirst({
        where: eq(users.username, username),
      });
      
      if (!user || !(await compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to login" });
    }
  });
  
  // Save workout
  app.post("/api/workouts", async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId || 1; // Fallback for demo
      const { pushups } = req.body;
      
      await db.insert(workouts).values({
        userId,
        pushups,
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save workout" });
    }
  });

  // Get workout history
  app.get("/api/workouts/history", async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId || 1; // Fallback for demo
      
      const history = await db.query.workouts.findMany({
        where: eq(workouts.userId, userId),
        orderBy: [desc(workouts.createdAt)],
      });
      
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workout history" });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const result = await db
        .select({
          id: users.id,
          username: users.username,
          totalPushups: sum(workouts.pushups).as("total_pushups"),
        })
        .from(users)
        .leftJoin(workouts, eq(users.id, workouts.userId))
        .groupBy(users.id)
        .orderBy(desc(sum(workouts.pushups)));

      const leaderboard = result.map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });
}
