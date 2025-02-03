import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/user/password`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: data.current_password,
          password: data.password,
          password_confirmation: data.password_confirmation,
        }),
      }
    );

    const responseData = await response.json();
    if (!response.ok) throw new Error(responseData.message);

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}
