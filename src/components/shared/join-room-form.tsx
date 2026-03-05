"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/button";

export function JoinRoomForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const roomCode = code.trim().toUpperCase();
    if (!roomCode) return;
    router.push(`/r/${roomCode}`);
  };

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-3">
      <input
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="ENTER 6-DIGIT CODE"
        className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 text-center text-2xl font-extrabold uppercase tracking-[0.25em] text-slate-700 outline-none ring-4 ring-transparent transition focus:border-sky-300 focus:ring-sky-100"
        maxLength={6}
      />
      <Button type="submit" className="group w-full gap-2 py-4 text-2xl">
        Join Room
        <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
      </Button>
    </form>
  );
}
