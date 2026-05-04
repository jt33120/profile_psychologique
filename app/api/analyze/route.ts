import { NextResponse } from "next/server";
import { computeLocalResults } from "@/lib/calculations";
import { callOpenAI } from "@/lib/openai";
import type { QuizPayload } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as QuizPayload;
    const local = computeLocalResults(payload);

    const astrology = await callOpenAI(
      "Explain this person's personality based on their zodiac sign in a concise, modern, psychologically grounded way.",
      { sunSign: local.sunSign, personalityContext: local.astrologyTraits }
    );

    const numerology = await callOpenAI(
      "Interpret these numerology numbers in a practical, grounded way. Focus on strengths, risks, and behavioral patterns.",
      { lifePathNumber: local.lifePathNumber, nameNumber: local.nameNumber }
    );

    const bigFive = await callOpenAI(
      "Analyze this Big Five profile. Highlight strengths, weaknesses, and real-world behavioral implications.",
      local.bigFiveScores
    );

    const enneagram = await callOpenAI(
      "Explain this Enneagram type with focus on motivation, fear, and relationship patterns.",
      { type: local.enneagramType }
    );

    const humanDesign = await callOpenAI(
      "Explain how this Human Design type makes decisions, works, and interacts with others.",
      { type: local.humanDesignType }
    );

    const synthesis = await callOpenAI(
      "Synthesize all these systems into one coherent personality profile. Avoid contradictions. Provide: core traits, strengths, blind spots, decision-making style, relationship patterns, actionable advice",
      { astrology, numerology, bigFive, enneagram, humanDesign }
    );

    return NextResponse.json({ local, insights: { astrology, numerology, bigFive, enneagram, humanDesign, synthesis } });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
