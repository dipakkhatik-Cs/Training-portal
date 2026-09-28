import { databaseReady, db } from "@/db";
import { courses, userCourseProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await databaseReady;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_emp_101";

    const allCourses = await db.select().from(courses);
    const progressRecords = await db
      .select()
      .from(userCourseProgress)
      .where(eq(userCourseProgress.userId, userId));

    const progressMap = new Map<string, { progressPercent: number; completed: boolean }>();
    progressRecords.forEach((p) => {
      progressMap.set(p.courseId, {
        progressPercent: p.progressPercent,
        completed: p.completed,
      });
    });

    const coursesWithProgress = allCourses.map((c) => {
      const p = progressMap.get(c.id);
      return {
        ...c,
        progressPercent: p ? p.progressPercent : 0,
        completed: p ? p.completed : false,
      };
    });

    return NextResponse.json({ courses: coursesWithProgress });
  } catch (err) {
    console.error("Courses API error:", err);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
