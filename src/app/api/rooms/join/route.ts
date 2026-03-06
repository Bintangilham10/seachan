import { NextRequest } from "next/server";
import { MAX_ROOM_PLAYERS } from "@/lib/constants";
import { fail, ok } from "@/lib/server/http";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdminClient();

  const body: { roomCode?: string; displayName?: string; guestId?: string } = await request
    .json()
    .catch(() => ({}));

  const roomCode = typeof body.roomCode === "string" ? body.roomCode.trim().toUpperCase() : "";
  const guestId = typeof body.guestId === "string" ? body.guestId.trim() : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim().slice(0, 24) : "";

  if (!roomCode || !guestId || !displayName) {
    return fail("roomCode, guestId, and displayName are required.");
  }

  const { data, error } = await supabase.rpc("join_room_atomic", {
    p_room_code: roomCode,
    p_display_name: displayName,
    p_guest_id: guestId
  });

  const player = Array.isArray(data) ? data[0] : data;
  if (error || !player) {
    const reason = [error?.message, error?.details, error?.hint]
      .filter((value) => Boolean(value))
      .join(" | ");

    if (reason.includes("ROOM_NOT_FOUND")) {
      return fail(`Room ${roomCode} not found in active database.`, 404);
    }

    if (reason.includes("ROOM_FINISHED")) {
      return fail("Room has finished.");
    }

    if (reason.includes("ROOM_JOIN_CLOSED")) {
      return fail("Join window is closed. Game already started.", 409);
    }

    if (reason.includes("ROOM_FULL")) {
      return fail(`Room is full. Maximum ${MAX_ROOM_PLAYERS} players reached.`, 409);
    }

    return fail(`Failed to join room. ${reason || "Unknown database error."}`, 500);
  }

  return ok("Joined room", { player });
}
