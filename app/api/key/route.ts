import { pinata } from "@/utils/config";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const uuid = crypto.randomUUID();
    const keyData = await pinata.keys.create({
      keyName: uuid.toString(),
      permissions: {
        admin: true,
      },
      maxUses: 1,
    });
    return NextResponse.json(keyData, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { text: "Error creating API Key:" },
      { status: 500 }
    );
  }
}
