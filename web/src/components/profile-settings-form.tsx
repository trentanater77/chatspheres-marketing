"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "./providers/supabase-provider";
import { Button } from "./ui/button";

export function ProfileSettingsForm() {
  const { supabase, session, openAuth } = useSupabase();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (!supabase || !session) return;

    supabase
      .from("profiles")
      .select("display_name, bio")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || "");
          setBio(data.bio || "");
        }
      });
  }, [supabase, session]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !session) {
      openAuth();
      return;
    }
    setStatus("loading");
    const { error } = await supabase
      .from("profiles")
      .upsert({ user_id: session.user.id, display_name: displayName, bio })
      .eq("user_id", session.user.id);
    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }
    setStatus("success");
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 rounded-[32px] border border-white/60 bg-white/80 p-6 shadow">
      <div>
        <label className="text-xs uppercase tracking-[0.4em] text-[#22223B]/60">Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-[#22223B]/10 bg-white px-4 py-2 text-sm text-[#22223B]"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.4em] text-[#22223B]/60">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="mt-2 w-full rounded-2xl border border-[#22223B]/10 bg-white px-4 py-2 text-sm text-[#22223B]"
        />
      </div>
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Save profile"}
      </Button>
      {status === "success" && <p className="text-xs text-[#22223B]/60">Profile updated.</p>}
      {status === "error" && <p className="text-xs text-[#e63946]">Unable to save profile.</p>}
    </form>
  );
}



