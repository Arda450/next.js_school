import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const filteredData = Object.fromEntries(formData.entries());

    // Debug-Logging
    console.log("Received FormData:", Object.fromEntries(formData.entries()));
    console.log("Access Token:", session.accessToken);

    // 4. Request an Laravel Backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/update`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(filteredData),
      }
    );

    // Debug-Logging
    console.log("Backend response status:", response.status);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Update failed");
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
