import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Fetch all todos
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Backend request failed");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create a new todo
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.accessToken) {
    return NextResponse.json(
      { message: "Unauthorized: No token found" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    console.log("Creating todo with body:", body);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // Sende den kompletten Body
      }
    );

    const data = await response.json();
    console.log("Backend response:", data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update a todo
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json(
      { message: "Unauthorized: No token found" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    console.log("Updating todo with body:", body);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // sende den kompletten Body
      }
    );

    const data = await response.json();
    console.log("Backend response:", data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
