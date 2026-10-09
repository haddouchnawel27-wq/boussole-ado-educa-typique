import { anamneseFieldLabel, anamneseForMode, anamneseSectionTitle } from "./anamnese";
import { evaluateStored } from "./questionnaires";
import type { AnalysisDoor, AnalysisDraft, AnalysisHypothesis, Client, QResponse } from "./types";

type Ana = Record<string, string>;

const clean = (value: string | undefined) => value?.trim() ?? "";
const present = (...values: (string | undefined)[]) => values.map(clean).filter(Boolean);

function compact(values: string[], max = 5): string[] {
  return [...new Set(values)].slice(0, max);
}

function quote(label: string, value: string | undefined): string | null {
  const v = clean(value);
  return v ? `${label} : ${v}` : null;
}

function card(
  door: AnalysisDoor,
  domain: string,
  title: string,
  rationale: string,
  options: Partial<Pick<AnalysisHypothesis, "supports" | "nuances" | "missing" | "alternatives" | "axes" | "protocols" | "priority" | "source">> = {},
): AnalysisHypothesis {
  const id = `${door}-${domain.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  return {
    id,
    door,
    domain,
    title,
    rationale,
    supports: options.supports ?? [],
    nuances: options.nuances ?? [],
    missing: options.missing ?? [],
    alternatives: options.alternatives ?? [],
    axes: options.axes ?? [],
    protocols: options.protocols ?? [],
    priority: options.priority ?? "explore",
    decision: "proposed",
    practitionerNote: "",
    source: options.source ?? "Anamnèse Les Deux Jardins",
  };
}

export function buildAnalysisPacket(client: Client, responses: QResponse[], islamic: boolean): string {
  const lines: string[] = [`DOSSIER PSEUDONYMISÉ — ${client.nom}`];
  lines.push(`Intention : ${client.intention || "—"}`);
  const ana = client.bilan.anamnese ?? {};
  const sections = anamneseForMode(islamic);
  sections.forEach((section, index) => {
    const fields = section.fields
      .map((field) => ({ field, value: clean(ana[field.key]) }))
      .filter((item) => item.value);
    if (!fields.length) return;
    lines.push("", `— ${anamneseSectionTitle(section, index, islamic)} —`);
    fields.forEach(({ field, value }) => lines.push(`${anamneseFieldLabel(field, islamic)} : ${field.type === "scale" ? `${value}/10` : value}`));
  });
  if (client.seances.length) {
    lines.push("", "— Notes de séance —");
    client.seances.forEach((session) => lines.push(`${session.date} · ${session.notes}${session.axes ? ` · Axe : ${session.axes}` : ""}`));
  }
  if (responses.length) {
    lines.push("", "— Questionnaires reliés —");
    responses.forEach((response) => {
      const result = evaluateStored(response.questionnaireId, response.answers);
      lines.push(result ? `${result.titre} : ${response.score}/${response.scoreMax} — ${result.band.titre}` : `${response.questionnaireId} : ${response.score}/${response.scoreMax}`);
    });
  }
  return lines.join("\n");
}

function commonCards(client: Client, a: Ana, door: AnalysisDoor): AnalysisHypothesis[] {
  const cards: AnalysisHypothesis[] = [];
  const context = present(a.s1_motif, a.s10_pourquoi, a.s5_etapes, client.intention);
  if (context.length) {
    cards.push(card(door, "Demande et contexte", "Clarifier la demande actuelle et ce qui la déstabilise", "Les éléments recueillis invitent à relier la demande, son déclencheur et les événements de vie récents avant de choisir un axe prioritaire.", {
      supports: compact(context),
      missing: present(!a.s10_objectif ? "Objectif concret formulé avec la personne" : "", !a.s10_essaye ? "Ce qui a déjà été essayé et ses effets" : ""),
      axes: ["Reformuler la demande avec les mots de la personne", "Distinguer problème actuel, facteurs de maintien et ressources déjà présentes"],
      protocols: ["Chronologie courte des événements", "Objectif observable et révisable"],
      priority: "document",
    }));
  }

  const emotions = [
    quote("Souffrance", a.s9_souffrance), quote("Anxiété", a.s9_anxiete), quote("Tristesse", a.s9_tristesse),
    quote("Colère", a.s9_colere), quote("Espoir", a.s9_espoir), quote("Paix intérieure", a.s9_sakina),
  ].filter((x): x is string => Boolean(x));
  if (emotions.length) {
    cards.push(card(door, "Régulation émotionnelle", "Explorer l’intensité émotionnelle et les capacités de régulation", "La photographie émotionnelle mérite d’être mise en lien avec les déclencheurs, le corps, les stratégies actuelles et les effets sur le quotidien.", {
      supports: emotions,
      missing: ["Déclencheurs précis", "Signaux corporels", "Ce qui apaise déjà, même légèrement"],
      alternatives: ["Réaction à un événement de vie", "Surcharge durable", "Facteurs relationnels, somatiques ou neurofonctionnels à croiser"],
      axes: ["Repérer déclencheur → réaction → conséquence", "Renforcer une stratégie d’apaisement déjà tolérable"],
      protocols: ["Thermomètre émotionnel", "Journal ABC adapté", "Ancrage sensoriel ou respiration selon tolérance"],
      priority: Number(a.s9_souffrance || 0) >= 8 ? "priority" : "explore",
    }));
  }

  const history = present(a.s5_enfance, a.s5_pere, a.s5_mere, a.s5_trauma);
  if (history.length) {
    cards.push(card(door, "Histoire, attachement et vécu", "Mettre en lien l’histoire vécue et les réactions actuelles sans réduire la personne à son passé", "Certains éléments d’histoire peuvent éclairer des protections, des sensibilités ou des répétitions actuelles. Ce lien reste à vérifier avec la personne.", {
      supports: compact(history),
      nuances: ["Une proximité temporelle ou thématique ne prouve pas un lien causal"],
      missing: ["Ressources d’attachement", "Exceptions et expériences réparatrices"],
      axes: ["Identifier les protections construites", "Distinguer mémoire du passé et danger actuel"],
      protocols: ["Ligne de vie prudente", "Cartographie des ressources et figures d’appui"],
      priority: "explore",
    }));
  }

  const relationships = present(a.s7_couple, a.s7_enfants, a.s7_famille, a.s7_amis, a.s1_pressions_sociales);
  if (relationships.length) {
    cards.push(card(door, "Relations et environnement", "Examiner les interactions, soutiens, contraintes et marges de choix", "Le contexte relationnel peut soutenir, épuiser ou entretenir certaines difficultés. L’analyse doit rester centrée sur des faits observables et les effets vécus.", {
      supports: compact(relationships),
      missing: ["Soutiens disponibles", "Limites possibles et sécurité relationnelle"],
      alternatives: ["Conflit situationnel", "Pressions durables", "Fonctionnement sacrificiel ou dépendance à explorer sans conclusion prématurée"],
      axes: ["Cartographier soutiens, tensions et limites", "Différencier responsabilité personnelle et charge imposée"],
      protocols: ["Génogramme ou sociogramme", "Analyse factuelle d’une interaction"],
    }));
  }

  const body = present(a.s2_chroniques, a.s2_traitements, a.s2_bilan, a.s6_sommeil_h, a.s6_sommeil_q, a.s6_alim, a.s6_sport, a.s6_ecrans);
  if (body.length) {
    cards.push(card(door, "Corps, santé et mode de vie", "Croiser les dimensions psychologiques avec les facteurs corporels et quotidiens", "Le sommeil, les traitements, la santé, le rythme et les écrans peuvent modifier l’énergie, l’attention et la régulation. Ils doivent être pris en compte sans les surinterpréter.", {
      supports: compact(body),
      missing: ["Évolution dans le temps", "Avis médical lorsque pertinent"],
      alternatives: ["Fatigue contextuelle", "Effet d’un traitement ou d’un trouble somatique", "Rythme quotidien insuffisamment soutenant"],
      axes: ["Repérer un facteur modifiable à la fois", "Coordonner avec le médecin lorsque nécessaire"],
      protocols: ["Suivi sommeil-énergie", "Routine minimale réaliste"],
      priority: "monitor",
    }));
  }
  return cards;
}

function jannatCards(a: Ana, islamic: boolean): AnalysisHypothesis[] {
  const cards: AnalysisHypothesis[] = [];
  const culture = present(a.s1_reperes_interculturels, a.s1_pressions_sociales, a.s1_mandats, a.s1_decalage_culturel);
  if (culture.length) {
    cards.push(card("jannat", "Transculturalité et mandats", "Distinguer foi, culture, loyautés et pressions sociales", "Les repères culturels et les mandats peuvent donner du sens, mais aussi créer des injonctions contradictoires. Ils sont à explorer séparément des prescriptions religieuses.", {
      supports: compact(culture),
      missing: ["Ce que la personne souhaite conserver", "Ce qu’elle souhaite négocier ou transformer"],
      alternatives: ["Valeur choisie", "Loyauté familiale", "Norme culturelle ou pression sociale"],
      axes: ["Nommer les injonctions sans dévaloriser l’appartenance", "Restaurer des choix compatibles avec les valeurs de la personne"],
      protocols: ["Carte des appartenances", "Tri valeur / prescription / coutume / pression"],
      priority: "explore",
    }));
  }
  const spiritual = islamic ? present(a.s4_parcours, a.s4_trauma, a.s4_crise, a.s4_sentiment, a.s8_ressources, a.s9_tawakkul) : [];
  if (spiritual.length) {
    cards.push(card("jannat", "Psychologie et spiritualité islamiques", "Évaluer la place actuelle de la foi comme ressource, besoin ou lieu de souffrance", "La pratique et le vécu spirituel peuvent être évalués sans jugement, selon les besoins et les attentes de la consultante. Ils ne remplacent jamais l’exploration psychologique ou médicale.", {
      supports: compact(spiritual),
      nuances: ["Ne pas confondre baisse de pratique, souffrance psychique et faute morale"],
      missing: ["Attente explicite de la consultante concernant l’accompagnement spirituel"],
      alternatives: ["Ressource spirituelle disponible", "Crise de sens", "Blessure ou pression religieuse à accompagner"],
      axes: ["Clarifier la demande spirituelle", "Soutenir sans imposer ni culpabiliser"],
      protocols: ["Entretien psycho-spirituel", "Ressources religieuses vérifiées et choisies"],
      source: "Anamnèse Jannat al Qalb — contenu spirituel activé",
    }));
  }
  return cards;
}

function educaCards(client: Client, a: Ana): AnalysisHypothesis[] {
  const neuro = present(client.bilan.neuro, a.s1_age, a.s6_sommeil_q, a.s6_ecrans, a.s9_anxiete, a.s9_colere);
  return [card("educa", "Fonctionnement neurodéveloppemental", "Préciser le profil fonctionnel avant de choisir des adaptations", "Les informations disponibles peuvent orienter l’observation, mais elles ne suffisent pas à conclure. Le Décodeur Educa organise ce qui aide ou gêne concrètement dans les situations de vie.", {
    supports: compact(neuro),
    missing: ["Attention et fonctions exécutives", "Apprentissages et langage", "Profil sensoriel et moteur", "Forces, intérêts et stratégies spontanées", "Observations selon les contextes"],
    alternatives: ["Fatigue ou surcharge", "Difficulté émotionnelle ou contextuelle", "Fonctionnement neurodéveloppemental à documenter"],
    axes: ["Décrire les situations plutôt que coller une étiquette", "Comparer maison, école/travail et situations motivantes"],
    protocols: ["Grille antécédent-comportement-conséquence", "Profil sensoriel fonctionnel", "Observation des fonctions exécutives"],
    priority: "document",
    source: "Socle Educa Typique — lecture neurofonctionnelle",
  })];
}

function questionnaireCards(responses: QResponse[], door: AnalysisDoor): AnalysisHypothesis[] {
  return responses.flatMap((response) => {
    const result = evaluateStored(response.questionnaireId, response.answers);
    if (!result) return [];
    const red = result.alerts.some((alert) => alert.level === "rouge");
    return [card(door, `Questionnaire · ${result.titre}`, `Mettre en discussion le repère « ${result.band.titre} »`, "Le résultat soutient une exploration ciblée. Il doit être croisé avec l’entretien, le contexte, la durée et le retentissement.", {
      supports: [`Score ${response.score}/${response.scoreMax}`, result.band.texte],
      nuances: ["Un score n’est ni une identité ni une conclusion clinique"],
      missing: ["Exemples concrets", "Durée et retentissement", "Facteurs protecteurs"],
      axes: ["Reprendre les réponses les plus marquées avec la personne"],
      protocols: ["Entretien ciblé et observation avant décision"],
      priority: red ? "orientation" : result.ratio >= 0.61 ? "priority" : "explore",
      source: `Questionnaire relié · ${result.titre}`,
    })];
  });
}

export function generateAnalysisDraft(client: Client, responses: QResponse[], door: AnalysisDoor, islamic: boolean): AnalysisDraft {
  const a = client.bilan.anamnese ?? {};
  const hypotheses = [
    ...commonCards(client, a, door),
    ...(door === "jannat" ? jannatCards(a, islamic) : educaCards(client, a)),
    ...questionnaireCards(responses, door),
  ];
  if (!hypotheses.length) {
    hypotheses.push(card(door, "Recueil à compléter", "Compléter les informations utiles avant de formuler", "Le moteur ne dispose pas encore d’éléments suffisants pour proposer une cartographie utile.", {
      missing: ["Motif", "Contexte", "Difficultés", "Ressources", "Objectif"],
      axes: ["Revenir à l’anamnèse et recueillir uniquement les informations pertinentes"],
      priority: "document",
    }));
  }
  return {
    version: 1,
    door,
    generatedAt: new Date().toISOString(),
    inputSummary: buildAnalysisPacket(client, responses, islamic),
    hypotheses,
    formulationStatus: "a_revoir",
  };
}

export function formulationFromAnalysis(analysis: AnalysisDraft): { etatDesLieux: string; cartographie: string; hypotheses: string } {
  const active = analysis.hypotheses.filter((item) => item.decision !== "refuted");
  const retained = active.filter((item) => item.decision === "retained" || item.decision === "nuanced");
  const selection = retained.length ? retained : active;
  return {
    etatDesLieux: selection.map((item) => `• ${item.title}\n${item.rationale}`).join("\n\n"),
    cartographie: selection.map((item) => `• ${item.domain} : ${item.axes.join(" ; ") || "à explorer"}`).join("\n"),
    hypotheses: selection.map((item) => {
      const status = item.decision === "retained" ? "Retenue" : item.decision === "nuanced" ? "Nuancée" : item.decision === "pending" ? "À reprendre plus tard" : "Proposée";
      return `• [${status}] ${item.title}${item.practitionerNote ? ` — Note praticienne : ${item.practitionerNote}` : ""}`;
    }).join("\n"),
  };
}
