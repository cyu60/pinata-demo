import { NextResponse } from "next/server";
import { pinata } from "@/utils/config";

export async function GET() {
  try {
    // First, try to find existing public groups
    const groups = await pinata.groups.list().isPublic(true);

    // Look for a group with our specific name
    const existingGroup = groups.groups.find(
      (group) => group.name === "VoiceVault Public Files" && group.is_public
    );
    console.log("existingGroup", existingGroup);

    if (existingGroup) {
      return NextResponse.json(existingGroup, { status: 200 });
    }

    // If no existing public group found, create a new one
    const group = await pinata.groups.create({
      name: "VoiceVault Public Files",
      isPublic: true,
    });

    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    console.error("Error managing group:", error);
    return NextResponse.json(
      { error: "Failed to manage public group" },
      { status: 500 }
    );
  }
}
