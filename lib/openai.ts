const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function callOpenAI(prompt: string, context: object) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a concise personality analyst." },
        { role: "user", content: `${prompt}\n\nContext:\n${JSON.stringify(context, null, 2)}` },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${text}`);
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content ?? "No output generated.";
}
