"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { ProgressBar } from "@/components/ProgressBar";

const bigFiveSections = [
  {
    label: "🌍 Ouverture (curiosité / créativité)",
    questions: [
      "J'aime explorer des idées complexes ou abstraites",
      "Je m'ennuie vite avec des choses trop simples",
      "Je remets souvent en question les évidences",
    ],
  },
  {
    label: "🧱 Conscience (discipline / structure)",
    questions: [
      "Je suis organisé et structuré dans ce que je fais",
      "Je termine ce que je commence",
      "Je planifie avant d'agir",
    ],
  },
  {
    label: "⚡ Extraversion (énergie sociale)",
    questions: [
      "Je gagne de l'énergie en étant avec les autres",
      "Je prends facilement la parole / lead en groupe",
      "J'aime être au centre de l'attention",
    ],
  },
  {
    label: "🤝 Agréabilité (relationnel / empathie)",
    questions: [
      "Je fais facilement confiance aux autres",
      "J'évite les conflits quand possible",
      "Je prends en compte les émotions des autres",
    ],
  },
  {
    label: "🌊 Névrosisme (stabilité émotionnelle)",
    questions: [
      "Je rumine beaucoup",
      "Je ressens facilement du stress ou de l'anxiété",
      "Mon humeur peut varier rapidement",
    ],
  },
];

const enneagramSections = [
  {
    label: "🎯 Quand tu poursuis un objectif important, c'est surtout :",
    options: [
      { key: "A", text: "être reconnu / réussir" },
      { key: "B", text: "être libre / kiffer / explorer" },
      { key: "C", text: "comprendre / maîtriser" },
      { key: "D", text: "sécuriser / éviter les risques" },
      { key: "E", text: "contrôler / ne dépendre de personne" },
      { key: "F", text: "être utile / aider" },
      { key: "G", text: "être unique / exprimer qui tu es" },
    ],
  },
  {
    label: "⚠️ Ta peur la plus profonde ressemble à quoi ?",
    options: [
      { key: "A", text: "échouer / être inutile" },
      { key: "B", text: "être enfermé / limité" },
      { key: "C", text: "être dépassé / ignorant" },
      { key: "D", text: "être en insécurité / abandonné" },
      { key: "E", text: "être contrôlé / faible" },
      { key: "F", text: "ne pas être aimé" },
      { key: "G", text: "ne pas avoir d'identité" },
    ],
  },
  {
    label: "🔥 Quand tu es sous stress, tu fais plutôt :",
    options: [
      { key: "A", text: "tu bosses plus, tu performes" },
      { key: "B", text: "tu fuis / distractions / plaisirs" },
      { key: "C", text: "tu te retires / tu réfléchis" },
      { key: "D", text: "tu doutes / tu anticipes le pire" },
      { key: "E", text: "tu prends le contrôle / tu t'imposes" },
      { key: "F", text: "tu t'occupes des autres" },
      { key: "G", text: "tu rumines / émotions fortes" },
    ],
  },
  {
    label: "🧠 Ton rapport aux autres",
    options: [
      { key: "A", text: "je veux être admiré" },
      { key: "B", text: "je veux m'amuser avec eux" },
      { key: "C", text: "je garde une distance" },
      { key: "D", text: "je teste la confiance" },
      { key: "E", text: "je domine ou j'évite d'être dominé" },
      { key: "F", text: "je prends soin d'eux" },
      { key: "G", text: "je veux être compris profondément" },
    ],
  },
  {
    label: "🧭 Dans une relation, ton problème récurrent c'est :",
    options: [
      { key: "A", text: "image / performance" },
      { key: "B", text: "ennui / fuite" },
      { key: "C", text: "distance émotionnelle" },
      { key: "D", text: "anxiété / doute" },
      { key: "E", text: "contrôle / conflits" },
      { key: "F", text: "trop donner" },
      { key: "G", text: "intensité / montagnes russes" },
    ],
  },
  {
    label: "⚡ Ce qui te frustre le plus :",
    options: [
      { key: "A", text: "ne pas réussir assez vite" },
      { key: "B", text: "être coincé / routine" },
      { key: "C", text: "superficialité" },
      { key: "D", text: "incertitude" },
      { key: "E", text: "dépendre de quelqu'un" },
      { key: "F", text: "ne pas être apprécié" },
      { key: "G", text: "ne pas être compris" },
    ],
  },
  {
    label: "🧬 Si tu devais résumer ton moteur principal :",
    options: [
      { key: "A", text: "réussir" },
      { key: "B", text: "vivre" },
      { key: "C", text: "comprendre" },
      { key: "D", text: "sécuriser" },
      { key: "E", text: "être fort" },
      { key: "F", text: "aimer / aider" },
      { key: "G", text: "être unique" },
    ],
  },
];

const initialLikert = (n: number) => Array.from({ length: n }, () => 3);

const likertLabels = ["Pas du tout", "Plutôt non", "Neutre", "Plutôt oui", "Tout à fait"];

const bigFiveColors = [
  { border: "border-violet-300", bg: "bg-violet-50/60", label: "text-violet-700" },
  { border: "border-amber-300",  bg: "bg-amber-50/60",  label: "text-amber-700"  },
  { border: "border-orange-300", bg: "bg-orange-50/60", label: "text-orange-700" },
  { border: "border-emerald-300",bg: "bg-emerald-50/60",label: "text-emerald-700"},
  { border: "border-sky-300",    bg: "bg-sky-50/60",    label: "text-sky-700"    },
];

const resultAccents = [
  "border-violet-300",
  "border-fuchsia-300",
  "border-amber-300",
  "border-emerald-300",
  "border-rose-400",
];

const loadingPhases = [
  "Calcul astrologique…",
  "Analyse Big Five…",
  "Human Design…",
  "Ennéagramme…",
  "Synthèse finale…",
];

function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-1.5">
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1.5" />;
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="leading-relaxed">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className="font-semibold text-slate-800">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

function LoadingView({ phase }: { phase: number }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="animate-fade-in flex flex-col items-center gap-8">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-violet-100 border-t-violet-400" style={{ animationDuration: "1.2s" }} />
          <div className="absolute inset-2.5 animate-spin rounded-full border-4 border-fuchsia-100 border-t-fuchsia-400" style={{ animationDuration: "1.8s", animationDirection: "reverse" }} />
          <div className="absolute inset-5 animate-spin rounded-full border-4 border-pink-100 border-t-pink-400" style={{ animationDuration: "2.4s" }} />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🔮</div>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2.5 w-2.5 animate-breathe rounded-full bg-violet-400"
              style={{ animationDelay: `${i * 0.22}s` }}
            />
          ))}
        </div>
        <p key={phase} className="animate-fade-in text-sm font-medium text-slate-500">
          {loadingPhases[phase % loadingPhases.length]}
        </p>
      </div>
    </main>
  );
}

export default function HomePage() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>("conclusion");
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    birthTime: "",
    birthLocation: "",
    bigFiveAnswers: initialLikert(15),
    enneagramAnswers: Array(7).fill("") as string[],
  });

  const progress = useMemo(() => (step / 3) * 100, [step]);

  useEffect(() => {
    if (!loading) { setLoadingPhase(0); return; }
    const id = setInterval(() => setLoadingPhase((p) => p + 1), 2200);
    return () => clearInterval(id);
  }, [loading]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `Erreur ${res.status}`);
      setResult(json);
      setStep(3);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200/80 transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400";

  const btnPrimary =
    "w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-300/40 transition-all duration-300 active:scale-[0.97] disabled:opacity-60";

  if (loading) return <LoadingView phase={loadingPhase} />;

  if (!started) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
        <div className="animate-fade-in w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mb-4 text-6xl">🔮</div>
            <h1 className="mb-1.5 text-2xl font-bold text-slate-800">Profil Psychologique</h1>
            <p className="text-xs font-medium tracking-wide text-slate-400">
              Astrologie · Numérologie · Big Five · Ennéagramme · Human Design
            </p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-2xl shadow-violet-100/60 backdrop-blur-md">
            <p className="mb-6 text-sm leading-relaxed text-slate-500">
              Réponds à une vingtaine de questions et découvre une analyse psychologique complète, synthétisant 5 systèmes de connaissance de soi.
            </p>
            <button className={btnPrimary} onClick={() => setStarted(true)}>
              Commencer ✨
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl space-y-5 px-4 pb-16 pt-8">
      <ProgressBar value={progress} />

      {step === 1 && (
        <div className="animate-fade-in space-y-5">
          <div>
            <p className="mb-0.5 text-xs font-medium uppercase tracking-widest text-violet-400">Étape 1 / 2</p>
            <h2 className="text-xl font-bold text-slate-800">Tes informations</h2>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-xl shadow-violet-100/40 backdrop-blur-sm">
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Prénom" type="text" className={inputCls} value={form.firstName} onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))} />
                <input placeholder="Nom" type="text" className={inputCls} value={form.lastName} onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))} />
              </div>
              <input placeholder="Date de naissance" type="date" className={inputCls} value={form.birthDate} onChange={(e) => setForm((s) => ({ ...s, birthDate: e.target.value }))} />
              <input placeholder="Heure (optionnel)" type="time" className={inputCls} value={form.birthTime} onChange={(e) => setForm((s) => ({ ...s, birthTime: e.target.value }))} />
              <input placeholder="Lieu de naissance (ville, département et pays)" type="text" className={inputCls} value={form.birthLocation} onChange={(e) => setForm((s) => ({ ...s, birthLocation: e.target.value }))} />
            </div>
            <button className={`${btnPrimary} mt-5`} onClick={() => setStep(2)}>
              Continuer →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in space-y-5">
          <div>
            <p className="mb-0.5 text-xs font-medium uppercase tracking-widest text-violet-400">Étape 2 / 2</p>
            <h2 className="text-xl font-bold text-slate-800">Les questionnaires</h2>
          </div>

          {/* Big Five */}
          <Card title="📊 Big Five — Traits de personnalité">
            <div className="space-y-5">
              {bigFiveSections.map((section, si) => {
                const offset = si * 3;
                const col = bigFiveColors[si];
                return (
                  <div key={section.label} className={`rounded-xl border-l-4 p-3.5 ${col.border} ${col.bg}`}>
                    <h3 className={`mb-3 text-xs font-semibold uppercase tracking-wide ${col.label}`}>
                      {section.label}
                    </h3>
                    <div className="space-y-4">
                      {section.questions.map((q, qi) => {
                        const i = offset + qi;
                        return (
                          <div key={q}>
                            <p className="mb-2 text-xs text-slate-600">{q}</p>
                            <input
                              type="range" min={1} max={5}
                              value={form.bigFiveAnswers[i]}
                              className="w-full"
                              onChange={(e) => {
                                const v = Number(e.target.value);
                                setForm((s) => ({ ...s, bigFiveAnswers: s.bigFiveAnswers.map((n, idx) => idx === i ? v : n) }));
                              }}
                            />
                            <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                              {likertLabels.map((l) => <span key={l}>{l}</span>)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Enneagram */}
          <Card title="🧩 Ennéagramme — 7 questions">
            <div className="space-y-6">
              {enneagramSections.map((section, i) => (
                <div key={section.label}>
                  <p className="mb-3 text-xs font-semibold text-slate-600">
                    {i + 1}. {section.label}
                  </p>
                  <div className="space-y-2">
                    {section.options.map((opt) => {
                      const selected = form.enneagramAnswers[i] === opt.key;
                      return (
                        <label
                          key={opt.key}
                          className={[
                            "flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2.5 transition-all duration-200",
                            selected
                              ? "border-violet-400 bg-violet-50 text-violet-700"
                              : "border-slate-100 bg-white/60 text-slate-600 active:bg-violet-50/50",
                          ].join(" ")}
                        >
                          <span className={[
                            "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200",
                            selected ? "bg-violet-500 text-white" : "bg-slate-100 text-slate-500",
                          ].join(" ")}>
                            {opt.key}
                          </span>
                          <span className="text-sm">{opt.text}</span>
                          <input
                            type="radio"
                            name={`enneagram-${i}`}
                            value={opt.key}
                            checked={selected}
                            className="sr-only"
                            onChange={() => setForm((s) => ({ ...s, enneagramAnswers: s.enneagramAnswers.map((v, idx) => idx === i ? opt.key : v) }))}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}

          <button className={btnPrimary} onClick={handleSubmit}>
            Générer mon profil 🔮
          </button>
        </div>
      )}

      {step === 3 && result?.insights && (
        <div className="animate-fade-in space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Ton profil</h2>
          {(([
            ["astroNumerologie", "🌙 Astrologie, Numérologie & Ascendant"],
            ["bigFive", "📊 Profil Big Five"],
            ["humanDesign", "⚡ Human Design"],
            ["enneagramme", "🧩 Ennéagramme"],
            ["conclusion", "🎯 Profil Psychologique Complet"],
          ]) as [string, string][]).map(([key, label], idx) => {
            const value = (result.insights as Record<string, string>)[key];
            if (!value) return null;
            const isOpen = expanded === key;
            return (
              <Card key={key} accent={resultAccents[idx]}>
                <button
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => setExpanded(isOpen ? null : key)}
                >
                  <span className="font-semibold text-slate-700">{label}</span>
                  <span className="ml-3 flex-shrink-0 text-base text-slate-400 transition-transform duration-300" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                    ▾
                  </span>
                </button>
                {isOpen && (
                  <div className="mt-4 animate-fade-in border-t border-slate-100 pt-4">
                    <RichText text={value} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
