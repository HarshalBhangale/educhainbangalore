import type { Express } from "express";
import { db } from "../db";
import { workouts, users } from "@db/schema";
import { eq, desc, sum } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Save workout
  app.post("/api/workouts", async (req, res) => {
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
  app.get("/api/workouts/history", async (req, res) => {
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
