import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hashIP(ip: string): string {
  const salt = process.env.VOTE_SALT || "default-salt";
  return createHash("sha256").update(ip + salt).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const body = await request.json();
    const { contrato_id, vote_type } = body;

    if (!contrato_id || !vote_type) {
      return NextResponse.json(
        { error: "contrato_id and vote_type are required" },
        { status: 400 }
      );
    }

    if (vote_type !== "valida" && vote_type !== "cuestiona") {
      return NextResponse.json(
        { error: "vote_type must be 'valida' or 'cuestiona'" },
        { status: 400 }
      );
    }

    const ipHash = hashIP(ip);

    const { data, error } = await supabaseAdmin.schema("eoro").rpc("cast_vote", {
      p_contrato_id: contrato_id,
      p_vote_type: vote_type,
      p_ip_hash: ipHash,
    });

    if (error) {
      console.error("Vote RPC error:", error);
      return NextResponse.json(
        { error: "Failed to process vote" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
