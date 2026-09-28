import { databaseReady, db } from "@/db";
import { achievements, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await databaseReady;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_emp_101";

    // 1. Get user badges
    const userBadges = await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId));

    // 2. Get leaderboard from users
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        department: users.department,
        securityScore: users.securityScore,
        streakDays: users.streakDays,
        role: users.role,
      })
      .from(users)
      .orderBy(desc(users.securityScore));

    // Calculate rank
    const leaderboard = allUsers.map((u, idx) => ({
      ...u,
      rank: idx + 1,
      totalXp: u.securityScore * 10 + u.streakDays * 25,
    }));

    return NextResponse.json({
      userBadges,
      leaderboard,
    });
  } catch (err) {
    console.error("Achievements API error:", err);
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}
