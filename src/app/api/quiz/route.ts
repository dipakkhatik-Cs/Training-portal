import { databaseReady, db } from "@/db";
import { quizQuestions, quizAttempts, achievements, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await databaseReady;
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    let questionsList;
    if (courseId) {
      questionsList = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.courseId, courseId));
    } else {
      questionsList = await db.select().from(quizQuestions);
    }

    const formatted = questionsList.map((q) => {
      let parsedOptions: string[] = [];
      try {
        parsedOptions = JSON.parse(q.options);
      } catch {
        parsedOptions = [q.options];
      }
      return {
        id: q.id,
        courseId: q.courseId,
        question: q.question,
        options: parsedOptions,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      };
    });

    return NextResponse.json({ questions: formatted });
  } catch (err) {
    console.error("Quiz API error:", err);
    return NextResponse.json({ error: "Failed to fetch quiz questions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await databaseReady;
    const body = await req.json();
    const { userId, courseId, answers } = body;

    if (!userId || !answers) {
      return NextResponse.json({ error: "userId and answers are required" }, { status: 400 });
    }

    const questionsList = await db.select().from(quizQuestions);
    let score = 0;
    const totalQuestions = questionsList.length;
    const reviewDetails = [];

    for (const q of questionsList) {
      let opts = [];
      try {
        opts = JSON.parse(q.options);
      } catch {
        opts = [q.options];
      }

      const userChoice = answers[q.id];
      const isCorrect = userChoice !== undefined && Number(userChoice) === q.correctIndex;
      if (isCorrect) {
        score++;
      }
      reviewDetails.push({
        id: q.id,
        question: q.question,
        options: opts,
        userChoice: userChoice !== undefined ? Number(userChoice) : null,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      });
    }

    const percentage = Math.round((score / Math.max(totalQuestions, 1)) * 100);
    const passed = percentage >= 70;

    // Record quiz attempt
    await db.insert(quizAttempts).values({
      userId,
      courseId: courseId || "comprehensive-quiz",
      score,
      totalQuestions,
      percentage,
      passed,
    });

    // Check if security score can be updated
    if (passed) {
      const userRec = await db.select().from(users).where(eq(users.id, userId));
      if (userRec.length > 0) {
        const newScore = Math.min(100, Math.max(userRec[0].securityScore, 90));
        await db.update(users).set({ securityScore: newScore }).where(eq(users.id, userId));
      }
    }

    return NextResponse.json({
      score,
      totalQuestions,
      percentage,
      passed,
      reviewDetails,
    });
  } catch (err) {
    console.error("Quiz submit error:", err);
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}
