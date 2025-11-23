"use client";

import { useState } from "react";
import { useSupabase } from "./providers/supabase-provider";
import { Button } from "./ui/button";

export function CreateSphereForm() {
  const { session, openAuth } = useSupabase();
  const [topicName, setTopicName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) {
      openAuth();
      return;
    }
    if (topicName.trim().length < 4) {
      setStatus("error");
      setErrorMessage("Topic name should be at least 4 characters.");
      return;
    }
    if (description.trim().length < 20) {
      setStatus("error");
      setErrorMessage("Description should be at least 20 characters.");
      return;
    }
    setStatus("loading");
    setCreatedSlug(null);
    try {
      const response = await fetch("/api/spheres/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicName,
          description,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          userId: session.user.id,
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const json = await response.json();
      setCreatedSlug(json.sphere.slug);
      setStatus("success");
      setErrorMessage(null);
      setTopicName("");
      setDescription("");
      setTags("");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Unable to create sphere right now. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-lg">
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.4em] text-[#22223B]/60">Topic name</label>
        <input
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          placeholder="Faith & Focus"
          className="mt-2 w-full rounded-2xl border border-[#22223B]/10 bg-white px-4 py-2 text-sm text-[#22223B]"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.4em] text-[#22223B]/60">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the types of conversations you plan to host..."
          className="mt-2 w-full rounded-2xl border border-[#22223B]/10 bg-white px-4 py-2 text-sm text-[#22223B]"
          rows={4}
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.4em] text-[#22223B]/60">Tags</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="faith, mindfulness, wellbeing"
          className="mt-2 w-full rounded-2xl border border-[#22223B]/10 bg-white px-4 py-2 text-sm text-[#22223B]"
        />
      </div>
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Creating…" : session ? "Create sphere" : "Sign in to create"}
      </Button>
      {status === "error" && errorMessage && <p className="text-sm text-[#e63946]">{errorMessage}</p>}
      {status === "success" && createdSlug && (
        <p className="text-sm text-[#22223B]/70">
          Sphere created! Share slug <span className="font-semibold">sphere/{createdSlug}</span> or head to{" "}
          <a href={`/spheres/${createdSlug}`} className="text-[#e63946] underline">
            the detail page
          </a>
          .
        </p>
      )}
    </form>
  );
}

