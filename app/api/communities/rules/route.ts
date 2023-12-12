import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const values = await req.json();
    const { communityId, newRule } = values;

    const rule = await db.communityRule.create({
      data: {
        communityId,
        rule: newRule,
      },
    });

    if (!rule) return new NextResponse("Rule could not be created", { status: 400 });

    return NextResponse.json(rule);
  } catch (error) {
    console.log("COMMUNITIES_RULES_ADD_POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const values = await req.json();
    const { ruleId, communityId, newRule } = values;

    if (!ruleId || !newRule || !communityId) return new NextResponse("Values not provided", { status: 400 });

    const rule = await db.communityRule.update({
      where: {
        id: ruleId,
        communityId,
      },
      data: {
        rule: newRule,
      },
    });

    if (!rule) return new NextResponse("Rule not found", { status: 404 });

    return NextResponse.json(rule);
  } catch (error) {
    console.log("COMMUNITIES_RULES_UPDATE_UPDATE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);
    const communityId = searchParams.get("communityId");
    const ruleId = searchParams.get("ruleId");

    if (!communityId || !ruleId) return new NextResponse("Values missing", { status: 400 });

    const community = await db.community.update({
      where: {
        id: communityId,
      },
      data: {
        rules: {
          delete: [{ id: ruleId }],
        },
      },
    });

    if (!community) return new NextResponse("Community not found", { status: 404 });

    return NextResponse.json("Rule removed!");
  } catch (error) {
    console.log("COMMUNITIES_RULES_ADD_POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
