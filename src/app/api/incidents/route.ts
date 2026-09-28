import { databaseReady, db } from "@/db";
import { incidents } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await databaseReady;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    let query = db.select().from(incidents).orderBy(desc(incidents.reportedAt));

    const allIncidents = await query;
    let filtered = allIncidents;

    if (userId) {
      filtered = filtered.filter((i) => i.userId === userId);
    }
    if (status) {
      filtered = filtered.filter((i) => i.status.toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json({ incidents: filtered });
  } catch (err) {
    console.error("Incidents GET error:", err);
    return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await databaseReady;
    const body = await req.json();
    const {
      employeeName,
      employeeId,
      userId,
      incidentType,
      urgency,
      affectedSystem,
      description,
      attachmentName,
    } = body;

    if (!employeeName || !employeeId || !incidentType || !description) {
      return NextResponse.json(
        { error: "Employee Name, Employee ID, Incident Type, and Description are required" },
        { status: 400 }
      );
    }

    const refNo = `INC-2025-${Math.floor(1000 + Math.random() * 9000)}`;

    const [newIncident] = await db
      .insert(incidents)
      .values({
        referenceNo: refNo,
        employeeName,
        employeeId,
        userId: userId || "usr_emp_101",
        incidentType,
        urgency: urgency || "Medium",
        affectedSystem: affectedSystem || "Workstation",
        description,
        attachmentName: attachmentName || null,
        status: "Reported",
      })
      .returning();

    return NextResponse.json({ success: true, incident: newIncident });
  } catch (err) {
    console.error("Incidents POST error:", err);
    return NextResponse.json({ error: "Failed to create incident report" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await databaseReady;
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const [updated] = await db
      .update(incidents)
      .set({ status })
      .where(eq(incidents.id, Number(id)))
      .returning();

    return NextResponse.json({ success: true, incident: updated });
  } catch (err) {
    console.error("Incidents PATCH error:", err);
    return NextResponse.json({ error: "Failed to update incident" }, { status: 500 });
  }
}
