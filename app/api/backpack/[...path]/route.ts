import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.backpack.exchange/api/v1";

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const queryParams = req.nextUrl.searchParams.toString();
    const endpoint = params.path.join("/");
    const apiUrl = `${BASE_URL}/${endpoint}${
      queryParams ? `?${queryParams}` : ""
    }`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
