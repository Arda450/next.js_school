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

    // Debug-Logging der eingehenden Daten
    console.log("Incoming update data:", filteredData);

    // Request an Laravel Backend
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

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Backend update failed:", responseData);
      throw new Error(responseData.message || "Update failed");
    }

    // Erstelle ein aktualisiertes User-Objekt
    const updatedUser = {
      ...session.user,
      ...filteredData, // Neue Daten
      // Stelle sicher, dass alle wichtigen Felder vorhanden sind
      username: filteredData.username || session.user.username,
      email: filteredData.email || session.user.email,
      image: responseData.user?.profile_image || session.user.image,
    };

    // Gib die aktualisierten Daten zurück
    return NextResponse.json({
      status: "success",
      message: "Profile updated successfully",
      user: updatedUser,
      // Füge die ursprüngliche Backend-Antwort hinzu
      serverResponse: responseData,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
