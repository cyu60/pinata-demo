import { NextResponse } from "next/server";

const PINATA_API_URL = "https://api.pinata.cloud/v3/files";
const PINATA_JWT = process.env.PINATA_JWT;

if (!PINATA_JWT) {
  throw new Error("PINATA_JWT is not defined in environment variables");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "100";
  const pageToken = searchParams.get("pageToken");
  const groupId = searchParams.get("groupId");

  const query = new URLSearchParams({
    limit,
  });

  if (pageToken) {
    query.append("pageToken", pageToken);
  }

  if (groupId) {
    query.append("group", groupId);
  }

  try {
    const response = await fetch(`${PINATA_API_URL}?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      let errorMessage = "Error fetching files";
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } else {
        const errorText = await response.text();
        console.error("Non-JSON error response:", errorText);
      }
      console.error("Error fetching files from Pinata:", errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } else {
      console.error("Unexpected Content-Type:", contentType);
      return NextResponse.json(
        { error: "Unexpected response format" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching files from Pinata:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
