"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { ProgressBar } from "@/components/ProgressBar";

const bigFiveQuestions = [
  "Je suis quelqu’un d’extraverti, sociable.",
  "J’ai tendance à critiquer les autres.",
  "Je fais du bon travail, de manière consciencieuse.",
  "Je suis souvent triste ou déprimé(e).",
  "J’ai l’esprit original, je propose des idées nouvelles.",
  "Je suis réservé(e).",
  "Je suis serviable et plutôt altruiste avec les autres.",
  "Je peux parfois être désorganisé(e).",
  "Je gère bien le stress, je reste calme.",
  "Je suis curieux(se) de beaucoup de choses différentes.",
  "Je déborde d’énergie.",
  "Je me dispute parfois avec les autres.",
  "Je suis fiable et discipliné(e).",
  "Je peux être tendu(e), anxieux(se) facilement.",
  "J’ai une imagination active et riche."
];

const enneagramQuestions = [
  "Je ressens un fort besoin d’être irréprochable et de faire les choses correctement.",
  "Je me sens valorisé(e) quand je peux aider et soutenir les autres.",
  "Je suis très motivé(e) par la réussite et l’image que je projette.",
  "Je ressens les émotions intensément et je cherche à être authentique.",
  "Je préfère prendre du recul pour observer, comprendre et préserver mon énergie.",
  "Je cherche la sécurité, j’anticipe les problèmes possibles.",
  "Je recherche la nouveauté et j’évite de rester bloqué(e) dans l’inconfort.",
  "Je prends naturellement le contrôle pour protéger ce qui compte pour moi.",
  "Je privilégie l’harmonie et j’évite les conflits quand c’est possible."
];

const initialLikert = (n: number) => Array.from({ length: n }, () => 3);

const likertLabels = ["Pas du tout d’accord", "Plutôt pas d’accord", "Neutre", "Plutôt d’accord", "Tout à fait d’accord"];

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
    enneagramAnswers: initialLikert(9),
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
        <Card title="Quiz de Profil Psychologique">
          <p className="mb-4">Combine astrologie, numérologie, Big Five, Ennéagramme et Human Design dans un profil unifié.</p>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white" onClick={() => setStarted(true)}>Commencer le quiz</button>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-6 px-4 py-8">
      <ProgressBar value={progress} />

      {step === 1 && (
        <Card title="Informations personnelles">
          <div className="grid gap-3 md:grid-cols-2">
            <input placeholder="Prénom" type="text" className="rounded border p-2" value={form.firstName} onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))} />
            <input placeholder="Nom" type="text" className="rounded border p-2" value={form.lastName} onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))} />
            <input placeholder="Date de naissance" type="date" className="rounded border p-2" value={form.birthDate} onChange={(e) => setForm((s) => ({ ...s, birthDate: e.target.value }))} />
            <input placeholder="Heure de naissance (optionnel)" type="time" className="rounded border p-2" value={form.birthTime} onChange={(e) => setForm((s) => ({ ...s, birthTime: e.target.value }))} />
            <input placeholder="Lieu de naissance" type="text" className="rounded border p-2 md:col-span-2" value={form.birthLocation} onChange={(e) => setForm((s) => ({ ...s, birthLocation: e.target.value }))} />
          </div>
          <button className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white" onClick={() => setStep(2)}>Continuer</button>
        </Card>
      )}

      {step === 2 && (
        <>
          <Card title="Questionnaire Big Five (15 questions)">
            <div className="space-y-3">
              {bigFiveQuestions.map((q, i) => (
                <label key={q} className="block">
                  <span className="mb-1 block">{i + 1}. {q}</span>
                  <input type="range" min={1} max={5} value={form.bigFiveAnswers[i]} className="w-full" onChange={(e) => {
                    const v = Number(e.target.value);
                    setForm((s) => ({ ...s, bigFiveAnswers: s.bigFiveAnswers.map((n, idx) => idx === i ? v : n) }));
                  }} />
                  <span className="text-xs text-slate-500">{likertLabels[form.bigFiveAnswers[i] - 1]}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card title="Questionnaire Ennéagramme (9 questions ciblées)">
            <div className="space-y-3">
              {enneagramQuestions.map((q, i) => (
                <label key={q} className="block">
                  <span className="mb-1 block">{i + 1}. {q}</span>
                  <input type="range" min={1} max={5} value={form.enneagramAnswers[i]} className="w-full" onChange={(e) => {
                    const v = Number(e.target.value);
                    setForm((s) => ({ ...s, enneagramAnswers: s.enneagramAnswers.map((n, idx) => idx === i ? v : n) }));
                  }} />
                  <span className="text-xs text-slate-500">{likertLabels[form.enneagramAnswers[i] - 1]}</span>
                </label>
              ))}
            </div>
          </Card>

          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white" disabled={loading} onClick={handleSubmit}>
            {loading ? "Analyse en cours..." : "Générer mon profil"}
          </button>
        </>
      )}

      {loading && <Card title="Traitement en cours">Analyse des sections : Astrologie → Numérologie → Big Five → Ennéagramme → Human Design → Synthèse finale...</Card>}

      {step === 3 && result?.insights && (
        <section className="space-y-4">
          {Object.entries(result.insights).map(([key, value]) => (
            <Card key={key} title={key === "synthesis" ? "Synthèse finale" : key}>
              <button className="mb-2 text-xs text-indigo-600" onClick={() => setExpanded(expanded === key ? null : key)}>
                {expanded === key ? "Réduire" : "Développer"}
              </button>
              {expanded === key && <p>{String(value)}</p>}
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}
