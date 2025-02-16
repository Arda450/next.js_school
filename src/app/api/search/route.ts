import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json(
        { status: "error", message: "Not authorized" },
        { status: 401 }
      );
    }

    // Suchbegriff holen für Usersuche
    const searchParams = request.nextUrl.searchParams;
    const term = searchParams.get("term");

    if (!term) {
      return NextResponse.json(
        { status: "error", message: "Search term required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/search?term=${encodeURIComponent(term)}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error while searching for users:", error);
    return NextResponse.json(
      { status: "error", message: "Error while searching for users" },
      { status: 500 }
    );
  }
}
