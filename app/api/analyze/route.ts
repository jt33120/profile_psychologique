import { NextResponse } from "next/server";
import { computeLocalResults } from "@/lib/calculations";
import { callOpenAI } from "@/lib/openai";
import type { QuizPayload } from "@/lib/types";

const enneagramTypeNames: Record<number, string> = {
  1: "Le Perfectionniste", 2: "L'Assistant", 3: "Le Battant", 4: "L'Individualiste",
  5: "L'Observateur", 6: "Le Loyaliste", 7: "L'Épicurien", 8: "Le Challenger", 9: "Le Médiateur",
};

const letterToType: Record<string, number> = { A: 3, B: 7, C: 5, D: 6, E: 8, F: 2, G: 4 };

const bigFiveLabels: Record<string, string> = {
  openness: "Ouverture d'esprit",
  conscientiousness: "Conscience / Discipline",
  extraversion: "Extraversion",
  agreeableness: "Agréabilité / Empathie",
  neuroticism: "Névrosisme / Stabilité émotionnelle",
};

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as QuizPayload;
    const local = computeLocalResults(payload);

    const bigFiveFormatted = Object.entries(local.bigFiveScores)
      .map(([k, v]) => `${bigFiveLabels[k] ?? k} : ${v}%`)
      .join("\n");

    const enneagramTally = payload.enneagramAnswers.reduce<Record<string, number>>((acc, letter) => {
      const type = letterToType[letter];
      if (type) {
        const label = `Type ${type} – ${enneagramTypeNames[type]}`;
        acc[label] = (acc[label] ?? 0) + 1;
      }
      return acc;
    }, {});

    const hasTime = Boolean(payload.birthTime);
    const hasLocation = Boolean(payload.birthLocation);

    const [astroNumerologie, bigFive, humanDesign, enneagramme] = await Promise.all([
      callOpenAI(
        `Tu es expert en astrologie occidentale et numérologie. Génère une analyse de personnalité complète en français pour ${payload.firstName}.

Inclus obligatoirement dans cet ordre :
1. **Signe solaire (${local.sunSign})** : traits fondamentaux, forces, zones d'ombre spécifiques à ce signe.
2. **Ascendant** : ${hasTime && hasLocation ? `Calcule et interprète l'ascendant à partir de l'heure de naissance ${payload.birthTime} et du lieu "${payload.birthLocation}". Donne le signe ascendant probable et son influence sur la personnalité.` : "Non calculable (heure ou lieu de naissance manquant). Explique brièvement ce que l'ascendant apporterait si disponible."}
3. **Chemin de vie ${local.lifePathNumber}** : mission de vie, défis récurrents, patterns comportementaux typiques de ce nombre.
4. **Nombre du nom ${local.nameNumber}** : expression naturelle, style de communication, rapport aux autres.

Sois direct, moderne, psychologiquement ancré. Utilise des exemples concrets. 5 paragraphes minimum.`,
        {
          firstName: payload.firstName,
          birthDate: payload.birthDate,
          birthTime: payload.birthTime || null,
          birthLocation: payload.birthLocation || null,
          sunSign: local.sunSign,
          lifePathNumber: local.lifePathNumber,
          nameNumber: local.nameNumber,
        }
      ),

      callOpenAI(
        `Tu es expert en psychologie des traits (modèle Big Five). Analyse ce profil en français pour ${payload.firstName}.

Scores :
${bigFiveFormatted}

Pour chaque dimension, explique ce que ce score révèle concrètement : au quotidien, au travail, en relation, sous pression.
Ensuite identifie les **combinaisons de traits** qui créent des dynamiques particulières (ex : haute ouverture + bas névrosisme = …).
Termine par 2-3 forces majeures et 2-3 angles morts issus de ce profil combiné.

Sois précis, honnête, actionnable. 5-6 paragraphes.`,
        { scores: bigFiveFormatted }
      ),

      callOpenAI(
        `Tu es expert en Human Design. Analyse le profil de ${payload.firstName} en français.

Données disponibles :
- Date de naissance : ${payload.birthDate}
- Heure de naissance : ${hasTime ? payload.birthTime : "non renseignée"}
- Lieu de naissance : ${hasLocation ? payload.birthLocation : "non renseigné"}
- Type estimé : ${local.humanDesignType}

${hasTime && hasLocation ? "Calcule le type précis (Generator, Manifesting Generator, Manifestor, Projector ou Reflector) et le profil (ex: 2/4, 1/3…)." : "Travaille avec le type estimé et précise les limites de l'analyse sans heure/lieu exacts."}

Explique dans cet ordre :
1. Le **type énergétique** et ce que ça signifie au quotidien
2. La **stratégie de vie** : comment cette personne devrait initier les choses
3. L'**autorité intérieure** : comment prendre les bonnes décisions
4. Le **profil** (si calculable) : rôle social et façon d'apprendre
5. Les **erreurs typiques** à éviter pour ce type

4-5 paragraphes, concret et pratique.`,
        {
          birthDate: payload.birthDate,
          birthTime: payload.birthTime || null,
          birthLocation: payload.birthLocation || null,
          estimatedType: local.humanDesignType,
        }
      ),

      callOpenAI(
        `Tu es expert en Ennéagramme. Analyse le profil de ${payload.firstName} en français.

Type dominant : **${local.enneagramType} – ${enneagramTypeNames[local.enneagramType]}**
Distribution des votes sur les 7 questions :
${Object.entries(enneagramTally).map(([k, v]) => `  ${k} : ${v} vote(s)`).join("\n")}

Explique dans cet ordre :
1. La **motivation profonde** de ce type : ce qu'il cherche fondamentalement
2. La **peur centrale** : ce qu'il fuit à tout prix
3. Les **mécanismes de défense** : comment il évite sa peur
4. Le **pattern en relation** : comment il se comporte avec les proches, les collègues
5. Le **comportement sous stress** (désintégration) et **en croissance** (intégration)
6. La **wing** probable (aile) si la distribution des votes le suggère

Sois psychologiquement juste et honnête. 5-6 paragraphes.`,
        {
          dominantType: local.enneagramType,
          typeName: enneagramTypeNames[local.enneagramType],
          tally: enneagramTally,
        }
      ),
    ]);

    const conclusion = await callOpenAI(
      `Tu es psychologue clinicien et coach de développement personnel. Synthétise l'ensemble du profil de ${payload.firstName} en français.

Tu as accès à 4 analyses complémentaires ci-dessous. Croise-les pour produire un profil cohérent, sans répétitions, en faisant ressortir ce qui est confirmé par plusieurs systèmes.

Structure ta réponse EXACTEMENT ainsi :

**Profil psychologique global**
2-3 phrases qui capturent l'essence profonde de cette personne. Qui est-elle vraiment ?

**Qualités & forces authentiques**
- (liste de 6-8 bullet points ancrés dans les données, pas génériques)

**Points d'ombre & défis**
- (liste de 5-6 bullet points, honnête et bienveillant)

**Style décisionnel & relationnel**
1-2 paragraphes sur comment cette personne prend ses décisions et fonctionne en relation.

**5 actions concrètes à démarrer maintenant**
Des actions simples, ultra-spécifiques à CE profil, actionnables dans les 48h. Pas de généralités.
1. …
2. …
3. …
4. …
5. …`,
      { astroNumerologie, bigFive, humanDesign, enneagramme }
    );

    return NextResponse.json({
      local,
      insights: { astroNumerologie, bigFive, humanDesign, enneagramme, conclusion },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
