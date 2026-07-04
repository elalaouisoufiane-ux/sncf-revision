/*
  Entrées initiales du journal de formation.
  Elles sont ajoutées automatiquement à la sauvegarde locale si elles n'existent pas déjà.
*/
window.TRACTION_DATA = window.TRACTION_DATA || {};

window.TRACTION_DATA.initialJournal = [
  {
    id: "journal-2026-07-02-notes-formation",
    date: "2026-07-02",
    minutes: 0,
    coursesSeen: [
      "E11.01 à E11.03",
      "E12.01 à E12.03",
      "E12.07",
      "E31.02 - Téléphone",
      "E14.01",
      "E15.01 à E15.03",
      "E16.01",
      "E17.01",
      "E22.01 - Certificat des conducteurs"
    ].join("\n"),
    definitionsSeen: [
      "E.P.I.",
      "Piste et itinéraire",
      "VP et VS",
      "Zone dangereuse et distance D",
      "Emplacement de garage",
      "SECUFER - Fiche 0.20, mémento",
      "Formulaire PERS - BC56",
      "Pleine ligne - PL",
      "DV",
      "Voie banalisée",
      "Voie unique",
      "Engin moteur",
      "Gare",
      "Mode d'exploitation"
    ].join("\n"),
    difficulties: [
      "Vérifier le référentiel E15.03 : l'intitulé exact est difficile à relire.",
      "Vérifier l'écriture du régime d'exploitation noté UL ou VL si cela réapparaît dans les supports.",
      "Clarifier les huit risques ferroviaires si le support en liste deux autres en plus de CRECHE."
    ].join("\n"),
    toReview: [
      "Matériel ordinaire : locomotive + wagons.",
      "Indices de composition : V120, V140, V160, MA, ME.",
      "Matériel spécialisé : trains automoteurs.",
      "Codes de composition : B16C, T14C, E32C.",
      "Risques personnel - mémo CRECHE : chute, radioactif, électrique, chimique, heurt, électromagnétique.",
      "Modes de cantonnement : BAL, BAPR, BM.",
      "Régimes d'exploitation : double voie, voie unique, voie banalisée.",
      "Signalisation au sol et signalisation en cabine."
    ].join("\n"),
    notes: "Au cours de cette journée, travail sur les référentiels liés aux risques ferroviaires, aux EPI, aux notions VP/VS, aux zones dangereuses, aux emplacements de garage, à la fiche SECUFER 0.20, au formulaire PERS BC56, aux matériels ferroviaires, aux risques spécifiques, aux indices de composition, à la pleine ligne, aux modes de cantonnement, aux régimes d'exploitation, à la signalisation et aux définitions ferroviaires essentielles.",
    tomorrowGoals: "Attendre les chapitres E à intégrer, puis créer les cours complets et les définitions datées du 02/07/2026.",
    createdAt: "2026-07-02T12:00:00.000Z"
  }
];
