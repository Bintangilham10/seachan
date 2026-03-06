import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/server/http";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdminClient();

  const body: {
    roomCode?: string;
    playerId?: string;
    questionId?: string;
    optionId?: string;
  } = await request.json().catch(() => ({}));

  const roomCode = typeof body.roomCode === "string" ? body.roomCode.trim().toUpperCase() : "";
  const playerId = typeof body.playerId === "string" ? body.playerId.trim() : "";
  const questionId = typeof body.questionId === "string" ? body.questionId.trim() : "";
  const optionId = typeof body.optionId === "string" ? body.optionId.trim() : "";

  if (!roomCode || !playerId || !questionId || !optionId) {
    return fail("roomCode, playerId, questionId, and optionId are required.");
  }

  const { data, error } = await supabase.rpc("submit_room_answer", {
    p_room_code: roomCode,
    p_player_id: playerId,
    p_question_id: questionId,
    p_option_id: optionId
  });

  const answer = Array.isArray(data) ? data[0] : data;
  if (error || !answer) {
    const reason = [error?.message, error?.details, error?.hint]
      .filter((value) => Boolean(value))
      .join(" | ");

    if (reason.includes("ROOM_NOT_FOUND")) {
      return fail("Room not found.", 404);
    }

    if (reason.includes("QUESTION_NOT_ACTIVE")) {
      return fail("Question is not active.");
    }

    if (reason.includes("QUESTION_NOT_FOUND")) {
      return fail("Current question not found.", 500);
    }

    if (reason.includes("INVALID_QUESTION")) {
      return fail("Invalid question submission.", 409);
    }

    if (reason.includes("TIME_UP")) {
      return fail("Time is up for this question.");
    }

    if (reason.includes("PLAYER_NOT_FOUND")) {
      return fail("Player not found in this room.", 404);
    }

    if (reason.includes("INVALID_OPTION")) {
      return fail("Selected option is invalid.", 400);
    }

    if (reason.includes("ANSWER_ALREADY_SUBMITTED")) {
      return fail("Answer already submitted for this question.", 409);
    }

    return fail(`Failed to submit answer. ${reason || "Unknown database error."}`, 500);
  }

  return ok("Answer submitted", {
    answer
  });
}
