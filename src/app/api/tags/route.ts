import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Hole alle verfügbaren Tags
export async function GET() {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const tags = [
      { id: "1", text: "Work" },
      { id: "2", text: "Personal" },
      { id: "3", text: "School" },
      { id: "4", text: "Urgent" },
      { id: "5", text: "Low Priority" },
    ];

    return NextResponse.json({
      status: "success",
      tags: tags,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
