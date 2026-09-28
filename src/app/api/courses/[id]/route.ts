import { databaseReady, db } from "@/db";
import { courses, lessons, userCourseProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await databaseReady;
    const { id } = await props.params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_emp_101";

    const courseList = await db.select().from(courses).where(eq(courses.id, id));
    if (courseList.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const course = courseList[0];
    const courseLessons = await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, id));

    const progressRecord = await db
      .select()
      .from(userCourseProgress)
      .where(
        and(
          eq(userCourseProgress.userId, userId),
          eq(userCourseProgress.courseId, id)
        )
      );

    return NextResponse.json({
      course,
      lessons: courseLessons.sort((a, b) => a.orderIndex - b.orderIndex),
      progress: progressRecord[0] || { progressPercent: 0, completed: false },
    });
  } catch (err) {
    console.error("Course detail error:", err);
    return NextResponse.json({ error: "Failed to fetch course detail" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await databaseReady;
    const { id } = await props.params;
    const body = await req.json();
    const { userId, progressPercent, completed } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(userCourseProgress)
      .where(
        and(
          eq(userCourseProgress.userId, userId),
          eq(userCourseProgress.courseId, id)
        )
      );

    if (existing.length > 0) {
      await db
        .update(userCourseProgress)
        .set({
          progressPercent: progressPercent ?? existing[0].progressPercent,
          completed: completed ?? existing[0].completed,
          completedAt: completed ? new Date() : existing[0].completedAt,
          updatedAt: new Date(),
        })
        .where(eq(userCourseProgress.id, existing[0].id));
    } else {
      await db.insert(userCourseProgress).values({
        userId,
        courseId: id,
        progressPercent: progressPercent || 0,
        completed: completed || false,
        completedAt: completed ? new Date() : null,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update progress error:", err);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
