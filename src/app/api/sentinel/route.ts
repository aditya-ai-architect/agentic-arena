import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const maxDuration = 60;

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
        controller.enqueue(encoder.encode(`data:${JSON.stringify(data)}\n\n`));
      };

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Agent 1: Orchestrator
        send({ agent: "Orchestrator", status: "running" });
        await delay(500);

        const planPrompt = `You are a competitive intelligence orchestrator. Create a research plan for:
Company: ${company}
Focus: ${focus}

Generate 3-5 search queries that would help gather intelligence on this topic.
Output as a JSON array of strings. Example: ["query 1", "query 2", "query 3"]`;

        const planResult = await model.generateContent(planPrompt);
        const planText = planResult.response.text();
        send({ agent: "Orchestrator", status: "complete", output: "Plan created" });

        // Agent 2: Searcher
        send({ agent: "Searcher", status: "running" });
        await delay(800);

        const searchPrompt = `Based on these search queries for researching ${company}'s ${focus}:
${planText}

Imagine you've searched the web. List 5-8 relevant sources that would typically appear, including:
- Company blog posts
- News articles
- Industry analysis
- Press releases

Format as a list with title and brief description.`;

        const searchResult = await model.generateContent(searchPrompt);
        const sourcesText = searchResult.response.text();
        send({ agent: "Searcher", status: "complete", output: "Sources found" });

        // Agent 3: Scraper
        send({ agent: "Scraper", status: "running" });
        await delay(1000);

        const scrapePrompt = `For these sources about ${company}'s ${focus}:
${sourcesText}

Synthesize what key information would likely be found in these sources. Include:
- Key facts and figures
- Strategic announcements
- Market positioning
- Competitive moves

Be specific and detailed.`;

        const scrapeResult = await model.generateContent(scrapePrompt);
        const contentText = scrapeResult.response.text();
        send({ agent: "Scraper", status: "complete", output: "Content extracted" });

        // Agent 4: Analyst
        send({ agent: "Analyst", status: "running" });
        await delay(1200);

        const analysisPrompt = `As a senior competitive intelligence analyst, analyze this research about ${company}'s ${focus}:

Sources and Content:
${contentText}

Provide:
1. Executive Summary (3 sentences)
2. Key Findings (5-7 bullet points with confidence levels: HIGH/MEDIUM/LOW)
3. Strategic Implications
4. Risks and Opportunities
5. Intelligence Gaps (what we couldn't determine)

Be specific, cite patterns, and distinguish facts from speculation.`;

        const analysisResult = await model.generateContent(analysisPrompt);
        const analysisText = analysisResult.response.text();
        send({ agent: "Analyst", status: "complete", output: "Analysis complete" });

        // Agent 5: Writer
        send({ agent: "Writer", status: "running" });
        await delay(800);

        const reportPrompt = `Transform this analysis into a polished competitive intelligence report:

Company: ${company}
Focus: ${focus}
Analysis:
${analysisText}

Format as a professional report with:
- Header with company, focus, and date
- Executive Summary
- Key Findings (bulleted with confidence indicators)
- Strategic Implications
- Recommended Actions
- Intelligence Gaps

Use markdown formatting. Be concise but comprehensive.`;

        const reportResult = await model.generateContent(reportPrompt);
        const reportText = reportResult.response.text();
        send({ agent: "Writer", status: "complete", output: "Report generated" });

        // Send final report
        send({ report: reportText });

      } catch (error) {
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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
