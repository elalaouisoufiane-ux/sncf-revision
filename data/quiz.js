/*
  Banque de flashcards et de questions.
  Les types acceptés: mcq, truefalse, written, cloze, association, order.
*/
window.TRACTION_DATA = window.TRACTION_DATA || {};

window.TRACTION_DATA.flashcards = [
  {
    id: "flashcard-exemple-1",
    front: "Question exemple à remplacer",
    back: "Réponse exemple à remplacer",
    category: "Exemple",
    difficulty: "facile",
    tags: ["demo"]
  },
  {
    id: "flashcard-exemple-2",
    front: "Que dois-je expliquer ici ?",
    back: "La réponse attendue sera ajoutée plus tard.",
    category: "Exemple",
    difficulty: "moyen",
    tags: ["demo"]
  }
];

window.TRACTION_DATA.questions = [
  {
    id: "question-exemple-mcq",
    type: "mcq",
    question: "Question à choix multiples exemple",
    options: ["Réponse A", "Réponse B", "Réponse C"],
    answer: "Réponse A",
    explanation: "Explication à remplacer.",
    category: "Exemple",
    difficulty: "facile"
  },
  {
    id: "question-exemple-truefalse",
    type: "truefalse",
    question: "Affirmation exemple à vérifier.",
    answer: true,
    explanation: "Correction à remplacer.",
    category: "Exemple",
    difficulty: "moyen"
  },
  {
    id: "question-exemple-written",
    type: "written",
    question: "Rédige une réponse courte pour cet exemple.",
    answer: "Réponse courte exemple",
    explanation: "Correction détaillée à remplacer.",
    category: "Exemple",
    difficulty: "moyen"
  },
  {
    id: "question-exemple-cloze",
    type: "cloze",
    text: "Cette phrase contient un mot à compléter: ____.",
    answer: "exemple",
    explanation: "Texte à trous de démonstration.",
    category: "Exemple",
    difficulty: "facile"
  },
  {
    id: "question-exemple-association",
    type: "association",
    question: "Associe chaque élément à sa réponse.",
    pairs: [
      { left: "Élément 1", right: "Réponse 1" },
      { left: "Élément 2", right: "Réponse 2" }
    ],
    explanation: "Association de démonstration.",
    category: "Exemple",
    difficulty: "moyen"
  },
  {
    id: "question-exemple-order",
    type: "order",
    question: "Remets ces étapes dans l'ordre.",
    items: ["Étape 1", "Étape 2", "Étape 3"],
    explanation: "Ordre de démonstration.",
    category: "Exemple",
    difficulty: "moyen"
  }
];

window.TRACTION_DATA.quotes = [
  "Une révision courte et régulière construit une mémoire solide.",
  "Chaque séance doit laisser une trace claire: appris, compris, à revoir.",
  "La progression vient de la répétition active, pas de la simple relecture."
];
