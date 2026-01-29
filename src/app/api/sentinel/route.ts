import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const { company, focus, apiKey } = await req.json();

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key required" }), {
      status: 400,
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode("data:" + JSON.stringify(data) + "\n\n"));
      };

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
        });

        const today = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        // Agent 1: Orchestrator
        send({ agent: "Orchestrator", status: "running" });

        const planResult = await model.generateContent(
          "You are a competitive intelligence research planner.\n\n" +
          "Company: " + company + "\n" +
          "Focus: " + focus + "\n\n" +
          "Create 5 specific research questions to investigate. Output as a numbered list."
        );
        const researchQuestions = planResult.response.text();
        send({ agent: "Orchestrator", status: "complete", output: "Research planned" });

        // Agent 2: Searcher
        send({ agent: "Searcher", status: "running" });

        const searchResult = await model.generateContent(
          "You are a web research specialist with access to current information.\n\n" +
          "Research " + company + " focusing on: " + focus + "\n\n" +
          "Research questions:\n" + researchQuestions + "\n\n" +
          "Provide detailed findings for each question based on your knowledge. " +
          "Include specific facts, dates, numbers, and recent developments. " +
          "Be thorough and cite what you know."
        );
        const searchFindings = searchResult.response.text();
        send({ agent: "Searcher", status: "complete", output: "Research complete" });

        // Agent 3: Scraper
        send({ agent: "Scraper", status: "running" });

        const scrapeResult = await model.generateContent(
          "Extract and organize key intelligence from this research about " + company + ":\n\n" +
          searchFindings + "\n\n" +
          "Organize into:\n" +
          "1. COMPANY OVERVIEW - What they do, products, market\n" +
          "2. RECENT DEVELOPMENTS - News, launches, changes\n" +
          "3. " + focus.toUpperCase() + " DETAILS - Specific to the focus area\n" +
          "4. COMPETITIVE POSITION - Competitors, market standing\n" +
          "5. KEY METRICS - Numbers, funding, revenue if known\n\n" +
          "Be specific and detailed."
        );
        const organizedData = scrapeResult.response.text();
        send({ agent: "Scraper", status: "complete", output: "Data organized" });

        // Agent 4: Analyst
        send({ agent: "Analyst", status: "running" });

        const analysisResult = await model.generateContent(
          "As a senior competitive intelligence analyst, analyze this data:\n\n" +
          organizedData + "\n\n" +
          "Provide:\n" +
          "1. EXECUTIVE SUMMARY (3-4 sentences)\n" +
          "2. KEY FINDINGS (5-7 findings with confidence: HIGH/MEDIUM/LOW)\n" +
          "3. STRATEGIC IMPLICATIONS\n" +
          "4. SWOT ANALYSIS\n" +
          "5. INTELLIGENCE GAPS\n\n" +
          "Be analytical and specific."
        );
        const analysis = analysisResult.response.text();
        send({ agent: "Analyst", status: "complete", output: "Analysis complete" });

        // Agent 5: Writer
        send({ agent: "Writer", status: "running" });

        const reportResult = await model.generateContent(
          "Create a professional competitive intelligence report.\n\n" +
          "Company: " + company + "\n" +
          "Focus: " + focus + "\n" +
          "Date: " + today + "\n" +
          "Analysis:\n" + analysis + "\n\n" +
          "Format as a clean markdown report:\n\n" +
          "# Competitive Intelligence Report\n" +
          "## " + company + " | " + focus + "\n" +
          "**Date:** " + today + "\n\n" +
          "---\n\n" +
          "### Executive Summary\n[summary]\n\n" +
          "---\n\n" +
          "### Key Findings\n\n" +
          "| # | Finding | Confidence |\n" +
          "|---|---------|------------|\n" +
          "[table rows]\n\n" +
          "---\n\n" +
          "### Strategic Analysis\n[analysis]\n\n" +
          "---\n\n" +
          "### SWOT Analysis\n\n" +
          "| Strengths | Weaknesses |\n|---|---|\n[rows]\n\n" +
          "| Opportunities | Threats |\n|---|---|\n[rows]\n\n" +
          "---\n\n" +
          "### Recommendations\n[numbered list]\n\n" +
          "---\n\n" +
          "### Intelligence Gaps\n[bullet list]\n\n" +
          "---\n\n" +
          "*Generated by Sentinel AI*"
        );
        const report = reportResult.response.text();
        send({ agent: "Writer", status: "complete", output: "Report ready" });

        send({ report: report });

      } catch (error) {
        console.error("Sentinel error:", error);
        send({
          error: error instanceof Error ? error.message : "Failed to generate report",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
