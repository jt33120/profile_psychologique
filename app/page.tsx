"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { ProgressBar } from "@/components/ProgressBar";

const bigFiveQuestions = Array.from({ length: 15 }).map((_, i) => `Big Five Q${i + 1}`);
const enneagramQuestions = Array.from({ length: 7 }).map((_, i) => `Enneagram Q${i + 1}`);

const initialLikert = (n: number) => Array.from({ length: n }, () => 3);

export default function HomePage() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>("synthesis");
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    birthTime: "",
    birthLocation: "",
    bigFiveAnswers: initialLikert(15),
    enneagramAnswers: initialLikert(7),
  });

  const progress = useMemo(() => (step / 3) * 100, [step]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      setResult(json);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  if (!started) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
        <Card title="Personality Fusion Quiz">
          <p className="mb-4">Combine astrology, numerology, Big Five, Enneagram, and Human Design into one profile.</p>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white" onClick={() => setStarted(true)}>Start Quiz</button>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-6 px-4 py-8">
      <ProgressBar value={progress} />

      {step === 1 && (
        <Card title="Personal Information">
          <div className="grid gap-3 md:grid-cols-2">
            {(["firstName", "lastName", "birthDate", "birthTime", "birthLocation"] as const).map((field) => (
              <input
                key={field}
                placeholder={field}
                type={field.includes("Date") ? "date" : field.includes("Time") ? "time" : "text"}
                className="rounded border p-2"
                value={(form as any)[field]}
                onChange={(e) => setForm((s) => ({ ...s, [field]: e.target.value }))}
              />
            ))}
          </div>
          <button className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white" onClick={() => setStep(2)}>Next</button>
        </Card>
      )}

      {step === 2 && (
        <>
          <Card title="Big Five Questionnaire (15 questions)">
            <div className="space-y-2">
              {bigFiveQuestions.map((q, i) => (
                <label key={q} className="flex items-center justify-between gap-3">
                  <span>{q}</span>
                  <input type="range" min={1} max={5} value={form.bigFiveAnswers[i]} onChange={(e) => {
                    const v = Number(e.target.value);
                    setForm((s) => ({ ...s, bigFiveAnswers: s.bigFiveAnswers.map((n, idx) => idx === i ? v : n) }));
                  }} />
                </label>
              ))}
            </div>
          </Card>

          <Card title="Enneagram Questionnaire (7 questions)">
            <div className="space-y-2">
              {enneagramQuestions.map((q, i) => (
                <label key={q} className="flex items-center justify-between gap-3">
                  <span>{q}</span>
                  <input type="range" min={1} max={5} value={form.enneagramAnswers[i]} onChange={(e) => {
                    const v = Number(e.target.value);
                    setForm((s) => ({ ...s, enneagramAnswers: s.enneagramAnswers.map((n, idx) => idx === i ? v : n) }));
                  }} />
                </label>
              ))}
            </div>
          </Card>

          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white" disabled={loading} onClick={handleSubmit}>
            {loading ? "Processing..." : "Generate Profile"}
          </button>
        </>
      )}

      {loading && <Card title="Processing">Analyzing sections: Astrology → Numerology → Big Five → Enneagram → Human Design → Final synthesis...</Card>}

      {step === 3 && result?.insights && (
        <section className="space-y-4">
          {Object.entries(result.insights).map(([key, value]) => (
            <Card key={key} title={key === "synthesis" ? "Final Synthesis" : key}>
              <button className="mb-2 text-xs text-indigo-600" onClick={() => setExpanded(expanded === key ? null : key)}>
                {expanded === key ? "Collapse" : "Expand"}
              </button>
              {expanded === key && <p>{String(value)}</p>}
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}
