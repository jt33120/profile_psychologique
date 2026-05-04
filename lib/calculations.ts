import type { QuizPayload, LocalResults } from "./types";

const zodiacRanges = [
  ["Capricorn", [1, 19]], ["Aquarius", [1, 20, 2, 18]], ["Pisces", [2, 19, 3, 20]],
  ["Aries", [3, 21, 4, 19]], ["Taurus", [4, 20, 5, 20]], ["Gemini", [5, 21, 6, 20]],
  ["Cancer", [6, 21, 7, 22]], ["Leo", [7, 23, 8, 22]], ["Virgo", [8, 23, 9, 22]],
  ["Libra", [9, 23, 10, 22]], ["Scorpio", [10, 23, 11, 21]], ["Sagittarius", [11, 22, 12, 21]],
  ["Capricorn", [12, 22]],
] as const;

const astrologyTraitsMap: Record<string, string[]> = {
  Aries: ["assertive", "energetic", "bold"], Taurus: ["reliable", "grounded", "persistent"],
  Gemini: ["curious", "adaptable", "communicative"], Cancer: ["protective", "empathetic", "intuitive"],
  Leo: ["confident", "creative", "warm"], Virgo: ["analytical", "practical", "precise"],
  Libra: ["diplomatic", "harmonizing", "social"], Scorpio: ["intense", "strategic", "emotionally deep"],
  Sagittarius: ["optimistic", "exploratory", "frank"], Capricorn: ["disciplined", "ambitious", "structured"],
  Aquarius: ["innovative", "independent", "idealistic"], Pisces: ["imaginative", "sensitive", "compassionate"],
};

const reduceNumber = (n: number): number => {
  while (n > 9) n = n.toString().split("").reduce((a, d) => a + Number(d), 0);
  return n || 1;
};

const getSunSign = (birthDate: string): string => {
  const d = new Date(`${birthDate}T00:00:00`);
  const day = d.getUTCDate();
  const month = d.getUTCMonth() + 1;
  for (const [sign, range] of zodiacRanges) {
    if (range.length === 2 && month === range[0] && day <= range[1]) return sign;
    if (range.length === 4 && ((month === range[0] && day >= range[1]) || (month === range[2] && day <= range[3]))) return sign;
  }
  return "Capricorn";
};

const computeLifePath = (birthDate: string): number => reduceNumber(birthDate.replace(/-/g, "").split("").reduce((a, d) => a + Number(d), 0));

const computeNameNumber = (fullName: string): number => {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, "");
  const sum = letters.split("").reduce((acc, ch) => acc + ((ch.charCodeAt(0) - 65) % 9) + 1, 0);
  return reduceNumber(sum);
};

const computeBigFive = (answers: number[]): Record<string, number> => {
  const traits = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"];
  const out: Record<string, number> = {};
  traits.forEach((t, i) => {
    const subset = answers.slice(i * 3, i * 3 + 3);
    const avg = subset.reduce((a, b) => a + b, 0) / subset.length;
    out[t] = Math.round(((avg - 1) / 4) * 100);
  });
  return out;
};

// A=Type3, B=Type7, C=Type5, D=Type6, E=Type8, F=Type2, G=Type4
const letterToType: Record<string, number> = { A: 3, B: 7, C: 5, D: 6, E: 8, F: 2, G: 4 };

const computeEnneagram = (answers: string[]): number => {
  const tally: Record<number, number> = {};
  answers.forEach((letter) => {
    const type = letterToType[letter];
    if (type) tally[type] = (tally[type] ?? 0) + 1;
  });
  const entries = Object.entries(tally);
  if (entries.length === 0) return 5;
  return Number(entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0]);
};

export const computeLocalResults = (payload: QuizPayload): LocalResults => {
  const sunSign = getSunSign(payload.birthDate);
  return {
    sunSign,
    astrologyTraits: astrologyTraitsMap[sunSign] ?? [],
    lifePathNumber: computeLifePath(payload.birthDate),
    nameNumber: computeNameNumber(`${payload.firstName} ${payload.lastName}`),
    bigFiveScores: computeBigFive(payload.bigFiveAnswers),
    enneagramType: computeEnneagram(payload.enneagramAnswers),
    humanDesignType: payload.birthTime ? "Generator / Manifesting Generator likely" : "Unknown / approximation",
  };
};
