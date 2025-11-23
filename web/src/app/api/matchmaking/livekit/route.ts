import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const livekitControlUrl = process.env.LIVEKIT_CONTROL_URL || "https://sphere.chatspheres.com/api/matchmaking";
const livekitControlKey = process.env.LIVEKIT_CONTROL_API_KEY;

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!livekitControlKey) {
    return NextResponse.json({ error: "LiveKit control API key missing" }, { status: 500 });
  }

  try {
    const { participantA, participantB, roomSlug } = await request.json();
    if (!participantA || !participantB || !roomSlug) {
      return NextResponse.json({ error: "participantA, participantB, and roomSlug are required" }, { status: 400 });
    }

    const payload = {
      roomSlug,
      participants: [participantA, participantB],
      tokenId: nanoid(8),
    };

    const response = await fetch(livekitControlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-LiveKit-Control-Key": livekitControlKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to kick off LiveKit matchmaking", error);
    return NextResponse.json({ error: "Unable to notify LiveKit controller" }, { status: 500 });
  }
}

