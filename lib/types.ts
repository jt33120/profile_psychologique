export type PersonalInfo = {
  firstName: string;
  lastName: string;
  birthDate: string;
  birthTime?: string;
  birthLocation: string;
};

export type QuizPayload = PersonalInfo & {
  bigFiveAnswers: number[];
  enneagramAnswers: number[];
};

export type LocalResults = {
  sunSign: string;
  astrologyTraits: string[];
  lifePathNumber: number;
  nameNumber: number;
  bigFiveScores: Record<string, number>;
  enneagramType: number;
  humanDesignType: string;
};
