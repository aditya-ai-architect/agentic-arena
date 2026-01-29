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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 500,
      },
    });

    const historyMessages = history as Message[];
    const recentHistory = historyMessages.slice(-6);

    let conversationContext = "";
    for (const msg of recentHistory) {
      const speaker = msg.role === "user" ? "You" : "Me";
      conversationContext += speaker + ": " + msg.content + "\n";
    }

    let prompt = "You are having a natural voice conversation. Respond exactly like a human would in casual speech:\n\n";
    prompt += "- Use contractions (I'm, don't, can't, it's, that's)\n";
    prompt += "- Keep it brief - 1 to 3 sentences max\n";
    prompt += "- Be warm and personable\n";
    prompt += "- Use filler words occasionally (well, you know, actually, honestly)\n";
    prompt += "- React naturally to what they say\n";
    prompt += "- Don't use lists, bullets, or formal structure\n";
    prompt += "- Sound like you're actually talking, not reading\n\n";

    if (conversationContext) {
      prompt += "Our conversation so far:\n" + conversationContext + "\n";
    }

    prompt += "You: " + message + "\n\nMe:";

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Voice API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate response" },
      { status: 500 }
    );
  }
}
