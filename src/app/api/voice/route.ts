import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history, apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build conversation context
    const conversationHistory = (history as Message[])
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n");

    const prompt = `You are a helpful AI assistant in a voice conversation. Keep responses concise and conversational (2-3 sentences max unless asked for more detail). Be friendly but professional.

Previous conversation:
${conversationHistory}

User: ${message}

Respond naturally as in a spoken conversation:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Voice API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate response" },
      { status: 500 }
    );
  }
}
