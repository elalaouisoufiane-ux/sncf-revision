/*
  Un résumé est associé à un cours par courseId.
  Si tu ajoutes un cours dans courses.js avec l'id "B2", ajoute ici un résumé avec courseId: "B2".
*/
window.TRACTION_DATA = window.TRACTION_DATA || {};

window.TRACTION_DATA.summaries = [
  {
    id: "resume-A1",
    courseId: "A1",
    title: "Résumé A1 - Exemple",
    keyPoints: [
      "Point clé de démonstration à remplacer.",
      "Second point clé de démonstration."
    ],
    list: [
      "Étape 1 à compléter.",
      "Étape 2 à compléter.",
      "Étape 3 à compléter."
    ],
    tree: [
      {
        label: "Idée principale",
        children: [
          { label: "Sous-idée A" },
          { label: "Sous-idée B" }
        ]
      }
    ],
    table: {
      headers: ["Notion", "Mémo"],
      rows: [
        ["Exemple", "Ajouter le mémo réel."]
      ]
    },
    memo: "Mémo court à remplacer par ton contenu.",
    frequentErrors: [
      "Erreur fréquente exemple à remplacer."
    ],
    mustRemember: [
      "À retenir absolument exemple à remplacer."
    ]
  },
  {
    id: "resume-E-2026-07-02-securite-personnel",
    courseId: "E-2026-07-02-securite-personnel",
    title: "Résumé - Cours du 02/07/2026 : sécurité du personnel et risque de heurt",
    keyPoints: [
      "Les règles de sécurité servent à réduire les risques qui ne peuvent pas être supprimés.",
      "Le conducteur doit éviter toute présence inutile dans les emprises ferroviaires et utiliser les chemins publics quand c'est possible.",
      "Les principaux risques sont le heurt, l'effet de souffle, l'électricité, la chute, les risques chimiques, radioactifs et électromagnétiques.",
      "L'habillement doit empêcher l'accrochage, la chute, la perte d'audition utile et la baisse de visibilité.",
      "Les EPI doivent être portés, contrôlés, entretenus et utilisés selon leur destination.",
      "La zone dangereuse dépend de la vitesse de la voie et doit être considérée voie par voie.",
      "L'engagement de la zone dangereuse doit rester exceptionnel et justifié.",
      "La DVN permet de savoir si le conducteur a assez de visibilité pour traverser ou contourner un obstacle.",
      "Si la DVN est insuffisante ou douteuse, il faut rechercher une autre solution ou demander une protection personnelle."
    ],
    list: [
      "E 11.01 : obligations générales, interdictions, identification des risques et règles qui sauvent.",
      "E 11.02 : habillement adapté, vêtements non flottants, chaussures adaptées, oreilles dégagées, parapluie interdit en situation à risque.",
      "E 11.03 : EPI obligatoires, équipement de visualisation, contrôle des EPI, gants isolants à vérifier avant emploi.",
      "E 12.01 : risque de heurt, effet de souffle, zone dangereuse, garages, dispositifs d'autorisation, DVN, PERS et conduite à tenir en ZD."
    ],
    tree: [
      {
        label: "Sécurité du personnel",
        children: [
          { label: "Prévenir les risques" },
          { label: "Respecter les instructions" },
          { label: "Porter les EPI adaptés" },
          { label: "Éviter toute présence inutile en zone ferroviaire" }
        ]
      },
      {
        label: "Risque de heurt",
        children: [
          { label: "Identifier la zone dangereuse" },
          { label: "Vérifier la DVN" },
          { label: "Utiliser un garage ou un dispositif autorisé" },
          { label: "Demander une PERS si la sécurité n'est pas assurée" }
        ]
      }
    ],
    table: {
      headers: ["Situation", "Réflexe à avoir"],
      rows: [
        ["Déplacement domicile-travail", "Utiliser les chemins publics chaque fois que possible."],
        ["Présence en emprise ferroviaire", "Uniquement par nécessité de service."],
        ["Accès à la zone dangereuse", "S'arrêter, regarder, vérifier la visibilité, rester attentif."],
        ["Traversée de 1 ou 2 voies", "Prévoir 10 secondes de visibilité."],
        ["Traversée de 3 ou 4 voies", "Prévoir 15 secondes de visibilité."],
        ["Traversée de 5 ou 6 voies", "Prévoir 20 secondes de visibilité."],
        ["Plus de 6 voies principales", "Interdit sans garage intermédiaire."],
        ["DVN insuffisante", "Changer de point, utiliser une procédure ou demander une protection."],
        ["Danger perçu dans la ZD", "Rejoindre un garage immédiatement si possible."],
        ["Impossible de se mettre en sûreté", "Se coucher hors de la voie, tête vers la circulation, vêtements ramenés près du corps."]
      ]
    },
    memo: "Avant d'entrer dans la zone dangereuse : nécessité absolue, arrêt, regard dans les deux sens, DVN suffisante, attention constante, solution de garage prévue.",
    frequentErrors: [
      "Confondre zone dangereuse et simple proximité de la voie.",
      "Entrer dans la zone dangereuse parce que le trajet paraît plus court.",
      "Oublier qu'une circulation peut en cacher une autre.",
      "Utiliser le téléphone pendant un cheminement dans les emprises.",
      "Porter un gilet ouvert ou masqué par un sac.",
      "Supposer qu'une PERS est toujours nécessaire ou jamais nécessaire : elle dépend de la situation."
    ],
    mustRemember: [
      "La zone dangereuse ne s'engage qu'en nécessité absolue.",
      "Le conducteur doit être visible et garder l'équipement de visualisation fermé et apparent.",
      "La DVN dépend de la vitesse maximale de la voie.",
      "10 s, 15 s, 20 s : ces délais correspondent au nombre de voies à traverser ou à la longueur de l'obstacle à contourner.",
      "DATZD = traversée autorisée ; DAELZD = engagement longitudinal autorisé.",
      "Si le risque n'est pas maîtrisé, il faut demander une protection personnelle avec le SGC."
    ]
  },
  {
    id: "resume-E-2026-07-02-e1202-pistes-itineraires",
    courseId: "E-2026-07-02-e1202-pistes-itineraires",
    title: "Résumé - E 12.02 : utilisation à pied des pistes et itinéraires",
    keyPoints: [
      "Tout déplacement à pied se fait calmement, sans courir et en gardant l'attention disponible.",
      "Le conducteur doit utiliser les pistes et itinéraires lorsqu'ils existent.",
      "Le déplacement doit se faire hors de la zone dangereuse dès que c'est possible.",
      "Même hors zone dangereuse, le souffle, les parties saillantes et les chargements déplacés restent dangereux.",
      "Sur LGV ou VL supérieure à 160 km/h, l'engagement de la zone dangereuse nécessite des mesures strictes."
    ],
    list: [
      "Piste : cheminement aménagé le long des voies principales.",
      "Itinéraire : cheminement organisé en dehors des voies principales, notamment en gare, triage, dépôt ou atelier.",
      "Piste cyclable ou carrossable : utilisée pour vélo, cyclomoteur ou véhicule automobile selon le cas.",
      "Piste interrompue : suivre les pancartes, distances de garage ou procédures indiquées."
    ],
    tree: [
      {
        label: "E 12.02",
        children: [
          { label: "Se déplacer calmement" },
          { label: "Rester hors ZD" },
          { label: "Utiliser pistes et itinéraires" },
          { label: "Adapter sa marche à la visibilité" },
          { label: "Demander PERS si sécurité non garantie" }
        ]
      }
    ],
    table: {
      headers: ["Cas", "À retenir"],
      rows: [
        ["Distance en ZD <= 5 m", "10 s de visibilité"],
        ["Distance en ZD > 5 m et <= 10 m", "15 s de visibilité"],
        ["Distance en ZD > 10 m et <= 15 m", "20 s de visibilité"],
        ["Distance en ZD > 15 m", "Interdit sans mesures particulières"],
        ["Traversée 1 à 2 voies", "10 s"],
        ["Traversée 3 ou 4 voies", "15 s"],
        ["Traversée 5 ou 6 voies", "20 s"]
      ]
    },
    memo: "E 12.02 = je chemine hors ZD, sur piste ou itinéraire, en gardant vue et audition disponibles.",
    frequentErrors: [
      "Marcher trop près du bord du quai.",
      "Se laisser distraire par le téléphone ou une conversation.",
      "Oublier qu'une circulation sur voie contiguë peut présenter un danger.",
      "Entrer en ZD sur VL > 160 km/h sans demande au SGC.",
      "Penser qu'une LGV permet les mêmes déplacements qu'une ligne classique."
    ],
    mustRemember: [
      "Pas de course, pas de précipitation.",
      "Pas d'écouteurs, pas de casque audio, pas de parapluie.",
      "En LGV : relation préalable avec le SGC.",
      "Sur VL > 160 km/h : abaissement à 160 km/h par PERS si engagement nécessaire.",
      "La zone dangereuse ne s'engage qu'avec visibilité ou mesures suffisantes."
    ]
  },
  {
    id: "resume-E-2026-07-02-e1203-traversee-voies",
    courseId: "E-2026-07-02-e1203-traversee-voies",
    title: "Résumé - E 12.03 : traversée à pied des voies",
    keyPoints: [
      "Traverser une voie oblige à entrer dans la zone dangereuse.",
      "Les risques principaux sont le heurt par circulation et la chute.",
      "Avant de traverser : arrêt, regard des deux côtés, écoute, absence de distraction.",
      "Pendant la traversée : franchir franchement et perpendiculairement.",
      "Après la traversée : dégager immédiatement la zone dangereuse.",
      "Un véhicule arrêté peut masquer la visibilité et être remis en mouvement."
    ],
    list: [
      "Utiliser un passage planchéié ou une passerelle quand ils existent.",
      "S'il n'y a pas de passage, vérifier la distance de visibilité nécessaire.",
      "Ne pas poser le pied sur le rail, les traverses ou un aiguillage.",
      "Ne pas traverser sous un véhicule ou entre deux véhicules accouplés.",
      "Respecter les signaux de TVP et signaler tout dérangement via le téléphone prévu."
    ],
    tree: [
      {
        label: "Traverser une voie",
        children: [
          { label: "Avant : arrêt, regarder, écouter" },
          { label: "Pendant : traverser franchement" },
          { label: "Après : dégager la ZD" },
          { label: "Cas particulier : véhicule arrêté" }
        ]
      }
    ],
    table: {
      headers: ["Situation", "Règle"],
      rows: [
        ["Devant ou derrière un véhicule", "3 m minimum"],
        ["Entre deux véhicules immobilisés", "6,70 m minimum"],
        ["Engins moteurs correctement immobilisés en établissement", "3 m pouvant être réduits à 1,50 m"],
        ["Plus de 6 voies principales", "Arrêt à chaque garage intermédiaire"],
        ["Pas de passage planchéié ni passerelle", "DVN obligatoire et traversée perpendiculaire"]
      ]
    },
    memo: "E 12.03 = arrêt, regarder, écouter, traverser franchement, dégager. Les distances véhicules : 3 m, 6,70 m, parfois 1,50 m.",
    frequentErrors: [
      "Traverser sans marquer l'arrêt.",
      "Regarder une seule direction.",
      "Oublier qu'une circulation qui vient de passer peut en cacher une autre.",
      "S'arrêter au milieu de la traversée.",
      "Marcher sur le rail ou sur un aiguillage.",
      "Passer entre deux véhicules accouplés."
    ],
    mustRemember: [
      "Avant toute traversée : arrêt obligatoire.",
      "Téléphone, montre connectée et distracteurs interdits.",
      "Traverser perpendiculairement.",
      "Ne jamais passer sous un véhicule.",
      "TVP rouge/STOP = traversée interdite."
    ]
  }
];
