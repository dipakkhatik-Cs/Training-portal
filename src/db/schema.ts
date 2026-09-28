import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("employee"), // 'employee' or 'admin'
  department: text("department").notNull().default("Operations"),
  securityScore: integer("security_score").notNull().default(75),
  streakDays: integer("streak_days").notNull().default(3),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull().default("Beginner"), // 'Beginner' | 'Intermediate' | 'Advanced'
  duration: text("duration").notNull(),
  lessonsCount: integer("lessons_count").notNull().default(4),
  iconName: text("icon_name").notNull().default("Shield"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  orderIndex: integer("order_index").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  keyTakeaways: text("key_takeaways").notNull(), // JSON string array
  tips: text("tips").notNull(), // JSON string array
});

export const userCourseProgress = pgTable("user_course_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  courseId: text("course_id").notNull().references(() => courses.id),
  progressPercent: integer("progress_percent").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => courses.id),
  question: text("question").notNull(),
  options: text("options").notNull(), // JSON string array
  correctIndex: integer("correct_index").notNull(),
  explanation: text("explanation").notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  courseId: text("course_id").notNull().references(() => courses.id),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  percentage: integer("percentage").notNull(),
  passed: boolean("passed").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  referenceNo: text("reference_no").notNull().unique(),
  employeeName: text("employee_name").notNull(),
  employeeId: text("employee_id").notNull(),
  userId: text("user_id").notNull(),
  incidentType: text("incident_type").notNull(),
  urgency: text("urgency").notNull().default("Medium"), // 'Low' | 'Medium' | 'High' | 'Critical'
  affectedSystem: text("affected_system").notNull().default("Workstation"),
  description: text("description").notNull(),
  attachmentName: text("attachment_name"),
  status: text("status").notNull().default("Reported"), // 'Reported' | 'Investigating' | 'Mitigated' | 'Resolved'
  reportedAt: timestamp("reported_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  badgeId: text("badge_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  points: integer("points").notNull().default(100),
  earnedAt: timestamp("earned_at").defaultNow(),
});
