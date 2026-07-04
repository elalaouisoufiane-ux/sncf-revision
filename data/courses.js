/*
  Les chapitres et sous-chapitres sont reconnus automatiquement par l'application.
  Ajoute un nouvel objet dans subchapters pour créer un cours sans modifier le reste du site.
*/
window.TRACTION_DATA = window.TRACTION_DATA || {};

window.TRACTION_DATA.chapters = [
  {
    id: "A",
    title: "Chapitre A",
    description: "Espace prêt pour les cours du chapitre A.",
    subchapters: [
      {
        id: "A1",
        chapterId: "A",
        title: "A1 - Cours exemple",
        description: "Structure de cours à remplacer par ton contenu.",
        tags: ["exemple"],
        updatedAt: "2026-07-04",
        content: [
          { type: "heading", level: 2, text: "Objectif du cours" },
          { type: "paragraph", text: "Ce paragraphe montre le rendu du lecteur. Remplace-le par ton cours réel." },
          { type: "callout", kind: "important", title: "Important", text: "Encadré important prêt à accueillir un point essentiel." },
          { type: "callout", kind: "tip", title: "Astuce", text: "Encadré astuce pour une méthode, un moyen mnémotechnique ou une vigilance." },
          {
            type: "table",
            headers: ["Élément", "À compléter"],
            rows: [
              ["Point clé", "Ajouter l'information validée."],
              ["Référence", "Ajouter la source ou le support de cours."]
            ]
          },
          {
            type: "diagram",
            title: "Schéma logique exemple",
            steps: ["Point de départ", "Étape à apprendre", "Application", "Révision"]
          },
          { type: "note", text: "Note personnelle ou précision à revoir." }
        ]
      }
    ]
  },
  { id: "B", title: "Chapitre B", description: "À compléter.", subchapters: [] },
  { id: "C", title: "Chapitre C", description: "À compléter.", subchapters: [] },
  { id: "D", title: "Chapitre D", description: "À compléter.", subchapters: [] },
  {
    id: "E",
    title: "Chapitre E",
    description: "Sécurité du personnel, habillement, EPI et risque de heurt.",
    subchapters: [
      {
        id: "E-2026-07-02-securite-personnel",
        chapterId: "E",
        title: "Cours du 02/07/2026 - Sécurité du personnel et risque de heurt",
        description: "Cours structuré à partir des supports E 11.01, E 11.02, E 11.03 et E 12.01.",
        tags: ["02/07/2026", "E 11.01", "E 11.02", "E 11.03", "E 12.01", "sécurité", "risque de heurt"],
        updatedAt: "2026-07-04",
        content: [
          { type: "heading", level: 2, text: "Repérage des photos" },
          {
            type: "table",
            headers: ["Photo", "Chapitre", "Page du chapitre", "Sujet"],
            rows: [
              ["IMG_3539", "E 11.01", "1/2", "Sécurité du personnel : généralités"],
              ["IMG_3540", "E 11.01", "2/2", "Identification des risques"],
              ["IMG_3541", "E 11.02", "1/2", "Prescriptions concernant l'habillement"],
              ["IMG_3542", "E 11.02", "2/2", "Mesures d'habillement à appliquer"],
              ["IMG_3543", "E 11.03", "1/2", "Équipements de protection individuelle"],
              ["IMG_3544", "E 11.03", "2/2", "Utilisation des EPI et des gants isolants"],
              ["IMG_3546", "E 12.01", "1/10", "Risque de heurt : généralités"],
              ["IMG_3547", "E 12.01", "2/10", "Zone dangereuse, risques et emplacements de garage"],
              ["IMG_3548", "E 12.01", "3/10", "Exemples de garages et garages réduits"],
              ["IMG_3549", "E 12.01", "4/10", "DATZD et DAELZD"],
              ["IMG_3550", "E 12.01", "5/10", "Règles qui sauvent, accès et engagement de la ZD"],
              ["IMG_3551", "E 12.01", "6/10", "Durée d'engagement et DVN"],
              ["IMG_3552", "E 12.01", "7/10", "Tableaux de distance de visibilité nécessaire"],
              ["IMG_3553", "E 12.01", "8/10", "Pistes soumises à procédure et demande PERS"],
              ["IMG_3554", "E 12.01", "9/10", "Protection personnelle et mesures de déplacement"],
              ["IMG_3555", "E 12.01", "10/10", "Conduite à tenir dans la zone dangereuse"]
            ]
          },
          { type: "heading", level: 2, text: "E 11.01 - Sécurité du personnel : généralités" },
          { type: "paragraph", text: "Les prescriptions de prévention servent à réduire les risques professionnels qui ne peuvent pas être supprimés. Elles concernent les déplacements, le stationnement en milieu ferroviaire, les interventions liées à la conduite et la conduite à tenir en cas d'accident." },
          {
            type: "list",
            items: [
              "Ces règles s'appliquent aussi lors des dessertes en embranchements particuliers, sauf consigne contraire.",
              "Des consignes locales peuvent compléter les règles générales.",
              "Le conducteur doit respecter les instructions données par le chef d'établissement.",
              "Il doit agir selon sa formation et ses moyens pour préserver sa sécurité, sa santé et celles des autres."
            ]
          },
          {
            type: "callout",
            kind: "important",
            title: "Obligations principales du conducteur",
            text: "Appliquer les principes de prévention, porter les EPI remis, porter secours aux victimes et se faire soigner en cas de blessure."
          },
          { type: "paragraph", text: "Il est interdit de se déplacer ou de stationner dans une emprise ferroviaire non ouverte au public lorsque le service ne l'exige pas. Pour aller au travail ou rentrer chez soi, le conducteur utilise les chemins publics chaque fois que c'est possible." },
          {
            type: "callout",
            kind: "important",
            title: "Règles qui sauvent",
            text: "Elles créent des réflexes communs pour éviter les accidents graves. Certaines sont communes à tout le personnel et d'autres sont adaptées aux métiers Traction."
          },
          { type: "heading", level: 2, text: "E 11.01 - Identification des risques" },
          {
            type: "list",
            items: [
              "Risques ferroviaires : heurt par une circulation, effet de souffle, risques électriques liés aux installations.",
              "Risques de chute : intervention sur parties hautes, chargement, ouvrage d'art ou travail temporaire en hauteur.",
              "Risques chimiques : marchandises dangereuses, incendie, explosion, produits présents sur certains engins ou traitements des voies.",
              "Risques radioactifs : présence possible de combustibles nucléaires ou de chargements exposant aux rayonnements.",
              "Risques électromagnétiques : intervention sous un engin équipé de certains dispositifs comme le KVB."
            ]
          },
          {
            type: "callout",
            kind: "warning",
            title: "Facteurs aggravants",
            text: "Le risque augmente avec le manque d'expérience, les situations inhabituelles, la fatigue, le manque d'attention, le travail à plusieurs, le bruit, les vibrations, la météo défavorable ou les températures extrêmes."
          },
          { type: "heading", level: 2, text: "E 11.02 - Prescriptions concernant l'habillement" },
          { type: "paragraph", text: "La tenue doit être fonctionnelle, adaptée aux risques ferroviaires et ne pas créer de danger supplémentaire. Les vêtements trop amples ou flottants peuvent s'accrocher à un véhicule ou à un organe en mouvement." },
          {
            type: "list",
            items: [
              "Ne pas porter de vêtements flottants ni d'accessoires non maintenus.",
              "Ne pas utiliser d'objets en bandoulière ou d'éléments qui ne permettent pas un dégagement rapide.",
              "Porter des chaussures fermées, antidérapantes, à talon large et plat, si possible avec une tige.",
              "Éviter les chaussures usées, rigides, à talons hauts, à semelle légère, à lanières ou les bottes en caoutchouc.",
              "Ne pas se couvrir les oreilles pendant les cheminements, sauf cas autorisés pour la protection contre le bruit.",
              "Ne pas tenter de rattraper une coiffure emportée par le déplacement d'air.",
              "Ne pas utiliser de parapluie en cas de risque de heurt ou de risque électrique."
            ]
          },
          { type: "heading", level: 2, text: "E 11.03 - Équipements de protection individuelle" },
          { type: "paragraph", text: "Les EPI servent à protéger contre les risques résiduels. Ils restent propriété de l'entreprise, sont remis au conducteur selon les besoins et doivent être utilisés uniquement dans les conditions prévues." },
          {
            type: "list",
            items: [
              "Exemples d'EPI : équipement de signalisation visuelle, lunettes de soleil, masque FFP3, gants adaptés aux risques.",
              "Le conducteur est responsable des EPI qui lui sont remis.",
              "Avant utilisation, il contrôle visuellement leur état.",
              "Après utilisation, il les nettoie et les stocke selon la notice.",
              "Tout mauvais état, perte ou anomalie doit être signalé."
            ]
          },
          {
            type: "callout",
            kind: "important",
            title: "Équipement de visualisation",
            text: "Il doit être porté chaque fois qu'il faut accéder à une zone dangereuse, traverser les voies ou circuler hors des zones ouvertes au public. Le gilet orange doit rester visible et fermé."
          },
          {
            type: "callout",
            kind: "warning",
            title: "Gants isolants",
            text: "Avant emploi, chaque gant doit être gonflé pour vérifier qu'il n'est pas percé. Si un gant est détérioré, il faut demander son remplacement au carnet de bord."
          },
          { type: "heading", level: 2, text: "E 12.01 - Risque de heurt : généralités" },
          { type: "paragraph", text: "Se déplacer dans les installations ferroviaires demande une attention permanente. Les voies, les abords des voies et les zones proches des engins moteurs ne sont pas conçus comme des espaces publics ordinaires." },
          {
            type: "list",
            items: [
              "Un train en circulation crée un déplacement d'air appelé effet de souffle.",
              "Plus la vitesse est élevée, plus l'effet de souffle peut être important.",
              "Le phénomène peut être renforcé dans un tunnel ou une tranchée couverte.",
              "La zone dangereuse est définie voie par voie autour de la voie et dépend notamment de la vitesse."
            ]
          },
          {
            type: "table",
            headers: ["Vitesse de la voie", "Distance D de limite de zone dangereuse"],
            rows: [
              ["0 < V <= 40 km/h", "1,25 m, portée à 1,50 m en courbe"],
              ["40 < V <= 160 km/h", "1,50 m"],
              ["160 < V <= 200 km/h", "2,00 m, avec réduction possible signalée localement"],
              ["200 < V <= 300 km/h", "2,00 m"],
              ["300 < V <= 320 km/h", "2,30 m"]
            ]
          },
          { type: "heading", level: 2, text: "Emplacements de garage" },
          { type: "paragraph", text: "Un emplacement de garage permet au conducteur, avec son matériel si nécessaire, de se tenir hors de la zone dangereuse pendant le passage d'une circulation." },
          {
            type: "list",
            items: [
              "Il peut s'agir d'une piste aménagée, d'un accotement, d'une partie de quai hors zone dangereuse, d'une voie interdite à la circulation, d'une niche, d'un refuge d'ouvrage d'art ou d'une entrevoie large.",
              "La largeur minimale normale est de 0,70 m.",
              "Un garage réduit peut descendre à 0,50 m et doit être repéré, notamment sur les voies principales.",
              "Des pancartes peuvent orienter vers les garages ou les niches."
            ]
          },
          { type: "heading", level: 2, text: "Dispositifs DATZD et DAELZD" },
          {
            type: "list",
            items: [
              "DATZD : autorise la traversée de la zone dangereuse quand la visibilité ou la réglementation ne permet pas de traverser autrement.",
              "Le DATZD comporte notamment un feu vert par voie, un bouton-poussoir de chaque côté et une plaque de prescription.",
              "DAELZD : autorise un engagement longitudinal le long d'une voie pour contourner un obstacle lorsque la visibilité est insuffisante.",
              "Le DAELZD comporte un voyant vert, un bouton-poussoir et une plaque de prescription.",
              "Ces dispositifs ne doivent être utilisés que par un conducteur formé."
            ]
          },
          { type: "heading", level: 2, text: "Règles de déplacement dans les emprises" },
          {
            type: "list",
            items: [
              "Ne jamais cheminer dans les voies sans nécessité de service et sans prise en compte du risque ferroviaire.",
              "Ne pas utiliser de téléphone portable pendant les cheminements dans les emprises ferroviaires.",
              "Ne pas stationner ou circuler en zone dangereuse si l'intervention ne l'impose pas.",
              "Ne pas s'abriter sous un véhicule, s'adosser à un engin ou stationner devant un heurtoir vers lequel une rame refoule.",
              "Ne pas s'appuyer sur les leviers d'aiguilles.",
              "Contourner les fosses s'il n'existe pas de caillebotis.",
              "Utiliser les pistes, itinéraires et règles prescrites."
            ]
          },
          { type: "heading", level: 2, text: "Durée d'engagement et DVN" },
          { type: "paragraph", text: "L'engagement dans la zone dangereuse doit rester exceptionnel. Il peut être transversal, pour traverser les voies, ou longitudinal, pour contourner un obstacle." },
          {
            type: "table",
            headers: ["Situation", "Délai de visibilité nécessaire"],
            rows: [
              ["Traversée de 1 ou 2 voies", "10 secondes"],
              ["Traversée de 3 ou 4 voies", "15 secondes"],
              ["Traversée de 5 ou 6 voies", "20 secondes"],
              ["Obstacle longitudinal jusqu'à 5 m", "10 secondes"],
              ["Obstacle longitudinal de plus de 5 m à 10 m", "15 secondes"],
              ["Obstacle longitudinal de plus de 10 m à 15 m", "20 secondes"]
            ]
          },
          {
            type: "callout",
            kind: "warning",
            title: "Interdiction majeure",
            text: "Il est interdit de traverser plus de six voies principales consécutives sans emplacement de garage intermédiaire."
          },
          {
            type: "table",
            headers: ["Délai", "<= 30 km/h", "31-40 km/h", "41-60 km/h", "61-120 km/h", "121-160 km/h"],
            rows: [
              ["10 s", "90 m", "120 m", "170 m", "340 m", "450 m"],
              ["15 s", "130 m", "170 m", "250 m", "500 m", "670 m"],
              ["20 s", "170 m", "230 m", "340 m", "670 m", "890 m"]
            ]
          },
          { type: "paragraph", text: "Sur LGV, la traversée est interdite sauf mesures particulières de réduction de vitesse. La distance de visibilité nécessaire se détermine avec la vitesse maximale de la voie concernée." },
          { type: "heading", level: 2, text: "Pistes, procédures et protection personnelle" },
          {
            type: "list",
            items: [
              "Certains passages sont soumis à procédure et signalés par pancarte.",
              "Si les mesures concernent les conducteurs, elles sont reprises dans les livrets de lignes.",
              "Avant d'engager la zone dangereuse, il faut vérifier que la distance de visibilité nécessaire est disponible.",
              "Si la DVN est insuffisante ou impossible à évaluer, il faut rechercher un endroit plus favorable ou demander une protection personnelle.",
              "La demande PERS peut conduire à une interruption de circulation ou à une limitation de vitesse."
            ]
          },
          {
            type: "callout",
            kind: "important",
            title: "PERS",
            text: "La demande de protection personnelle se prépare avec l'agent du SGC. Elle n'est pas systématique : elle dépend de la situation, de la zone, de l'opération et des mesures déjà présentes."
          },
          { type: "heading", level: 2, text: "Entrer dans la zone dangereuse" },
          {
            type: "list",
            items: [
              "N'entrer dans la zone dangereuse qu'en cas de nécessité absolue.",
              "Avant d'entrer : s'arrêter, regarder dans les deux directions et vérifier que le délai de visibilité permet de dégager la zone.",
              "Redoubler de prudence par mauvais temps ou dans une zone bruyante.",
              "Pendant l'engagement : rester attentif et tenir compte des circulations de tous sens.",
              "Lors d'un engagement longitudinal, marcher dans le sens opposé au sens normal des circulations.",
              "Si une circulation dangereuse est perçue, rejoindre immédiatement un emplacement de garage si possible.",
              "Si aucune mise en sûreté n'est possible, se coucher à plat ventre hors de la voie, tête orientée vers la circulation, en ramenant les vêtements près du corps."
            ]
          }
        ]
      },
      {
        id: "E-2026-07-02-e1202-pistes-itineraires",
        chapterId: "E",
        title: "E 12.02 - Utilisation à pied des pistes et des itinéraires",
        description: "Cours du 02/07/2026 sur les déplacements à pied, les pistes, itinéraires, quais, lignes à VL supérieure à 160 km/h et LGV.",
        tags: ["02/07/2026", "E 12.02", "pistes", "itinéraires", "LGV", "zone dangereuse"],
        updatedAt: "2026-07-04",
        content: [
          { type: "heading", level: 2, text: "Repérage des photos" },
          {
            type: "table",
            headers: ["Photo", "Chapitre", "Page du chapitre", "Sujet"],
            rows: [
              ["IMG_3558", "E 12.02", "1/5", "Principe des déplacements à pied, pistes et itinéraires"],
              ["IMG_3559", "E 12.02", "2/5", "Schémas de pistes et itinéraires"],
              ["IMG_3560", "E 12.02", "3/5", "Risques sur piste, quai, délais de visibilité et piste interrompue"],
              ["IMG_3561", "E 12.02", "4/5", "VL supérieure à 160 km/h, LGV et situations pratiques"],
              ["IMG_3562", "E 12.02", "5/5", "Circulation contiguë, anomalie, VL supérieure à 160 km/h et LGV"]
            ]
          },
          { type: "heading", level: 2, text: "Principe général" },
          { type: "paragraph", text: "Tout déplacement à pied dans les emprises doit se faire calmement, sans précipitation et sans courir. Le conducteur doit garder sa perception visuelle et sonore disponible." },
          {
            type: "list",
            items: [
              "Porter des chaussures adaptées au cheminement.",
              "Ne pas porter de vêtements flottants.",
              "Ne pas utiliser de parapluie, car il gêne la visibilité et l'écoute.",
              "Ne pas se couvrir les oreilles et ne pas utiliser d'écouteurs ou de casque audio.",
              "Ne pas essayer de rattraper une coiffure enlevée par le souffle d'une circulation.",
              "Ne pas porter de protection individuelle contre le bruit pendant les déplacements dans les emprises."
            ]
          },
          {
            type: "callout",
            kind: "important",
            title: "Règle de déplacement",
            text: "Le déplacement près des voies doit se faire en priorité hors de la zone dangereuse, en utilisant les pistes et itinéraires lorsqu'ils existent."
          },
          { type: "heading", level: 2, text: "Pistes et itinéraires" },
          {
            type: "list",
            items: [
              "Les pistes longent les voies principales en pleine voie et dans les gares.",
              "Les itinéraires existent en dehors des voies principales, dans les gares, triages, dépôts ou ateliers.",
              "Les déplacements à vélo ou cyclomoteur se font sur les pistes et itinéraires cyclables ou carrossables.",
              "Les déplacements en véhicule automobile se font sur les pistes et itinéraires carrossables.",
              "Les schémas affichés aux accès indiquent les cheminements à suivre quand ils sont nécessaires."
            ]
          },
          { type: "heading", level: 2, text: "Rester hors de la zone dangereuse" },
          { type: "paragraph", text: "Même hors de la zone dangereuse, le conducteur doit éviter d'être surpris par le souffle d'une circulation, une partie saillante ou un chargement déplacé." },
          {
            type: "list",
            items: [
              "Sur un quai, tenir compte de la bande blanche ou jaune quand elle existe.",
              "Ne pas passer entre un quai et des véhicules qui circulent ou stationnent sur la voie de ce quai.",
              "Quand une piste est interrompue, suivre les pancartes ou les mesures indiquées.",
              "En double voie ou voies multiples, marcher dans le sens opposé au sens normal des circulations si l'engagement de la voie est nécessaire.",
              "En voie unique, voie banalisée ou avec installations de contresens, redoubler d'attention aux circulations des deux sens."
            ]
          },
          {
            type: "table",
            headers: ["Engagement", "Délai de visibilité nécessaire"],
            rows: [
              ["Distance à parcourir en ZD <= 5 m", "10 secondes"],
              ["Distance à parcourir en ZD > 5 m et <= 10 m", "15 secondes"],
              ["Distance à parcourir en ZD > 10 m et <= 15 m", "20 secondes"],
              ["Distance à parcourir en ZD > 15 m", "Engagement longitudinal interdit sans mesures particulières"],
              ["Traversée de 1 à 2 voies", "10 secondes"],
              ["Traversée de 3 ou 4 voies", "15 secondes"],
              ["Traversée de 5 ou 6 voies", "20 secondes"]
            ]
          },
          { type: "heading", level: 2, text: "Situations pratiques" },
          {
            type: "list",
            items: [
              "Sur piste ou itinéraire cyclable ou carrossable : vérifier l'absence de danger avant de s'engager, rester près d'un bord et se garer si un véhicule routier approche.",
              "Le long d'un obstacle continu sans accotement de garage : vérifier si l'engagement est possible sans PERS, régler la marche selon la visibilité et utiliser un refuge ou une lisse si nécessaire.",
              "Sur un quai : se tenir éloigné du bord et ne pas marcher entre la bande de sécurité et le bord du quai lorsqu'elle existe.",
              "À l'arrivée d'une circulation sur voie contiguë : s'arrêter, se tenir à la lisse si elle existe, observer la circulation et se protéger des parties saillantes ou anomalies.",
              "Si une anomalie dangereuse est découverte : appliquer les mesures relatives aux incidents sur véhicule ou chargement."
            ]
          },
          { type: "heading", level: 2, text: "VL supérieure à 160 km/h et LGV" },
          {
            type: "list",
            items: [
              "Sur ligne conventionnelle à vitesse limite supérieure à 160 km/h, ne pas engager la zone dangereuse sauf nécessité absolue.",
              "Si l'engagement est nécessaire, demander au SGC un abaissement de vitesse à 160 km/h avec demande PERS, attendre la notification, puis dégager rapidement.",
              "Sur LGV, le stationnement ou déplacement dans les emprises impose une relation préalable avec le SGC.",
              "Le conducteur doit se renseigner sur d'éventuelles projections de glace ou de ballast signalées dans les dernières 24 heures.",
              "Sur LGV, ne jamais engager la zone dangereuse sans mesures indispensables de sécurité."
            ]
          }
        ]
      },
      {
        id: "E-2026-07-02-e1203-traversee-voies",
        chapterId: "E",
        title: "E 12.03 - Traversée à pied des voies",
        description: "Cours du 02/07/2026 sur la traversée des voies, les passages planchéiés, la TVP et les distances de sécurité devant ou entre véhicules.",
        tags: ["02/07/2026", "E 12.03", "traversée", "voies", "TVP", "passage planchéié"],
        updatedAt: "2026-07-04",
        content: [
          { type: "heading", level: 2, text: "Repérage des photos" },
          {
            type: "table",
            headers: ["Photo", "Chapitre", "Page du chapitre", "Sujet"],
            rows: [
              ["IMG_3563", "E 12.03", "1/6", "Risques de traversée et règles générales"],
              ["IMG_3564", "E 12.03", "2/6", "Distances devant, derrière ou entre véhicules et passages planchéiés"],
              ["IMG_3565", "E 12.03", "3/6", "Fonctionnement de la Traversée de Voie Publique"],
              ["IMG_3566", "E 12.03", "4/6", "Mesures SGC et traversée d'une voie non occupée"],
              ["IMG_3567", "E 12.03", "5/6", "Avant, pendant, après la traversée et cas de véhicules"]
            ]
          },
          { type: "heading", level: 2, text: "Risques liés à la traversée" },
          { type: "paragraph", text: "Traverser une voie impose d'entrer dans la zone dangereuse. Le conducteur s'expose principalement au heurt par une circulation et à la chute sur un sol irrégulier ou glissant." },
          {
            type: "list",
            items: [
              "Les conditions météo, le bruit, les contrastes de lumière et le port d'une charge peuvent aggraver les risques.",
              "Sans délai de visibilité suffisant ni dispositif garantissant la sécurité, il ne faut pas entrer dans la zone dangereuse sans mesures indispensables.",
              "Pour traverser plus de six voies principales consécutives, il faut marquer l'arrêt à chaque garage intermédiaire situé hors zone dangereuse."
            ]
          },
          {
            type: "callout",
            kind: "important",
            title: "Véhicule à l'arrêt",
            text: "Un véhicule arrêté peut masquer la visibilité et peut être remis en mouvement. Il faut respecter les distances de sécurité et ne pas utiliser un véhicule comme moyen de franchissement sauf conditions particulières."
          },
          {
            type: "table",
            headers: ["Situation", "Distance minimale"],
            rows: [
              ["Passer devant ou derrière un véhicule", "3 m de l'extrémité du véhicule"],
              ["Passer entre deux véhicules immobilisés sur la même voie", "6,70 m au minimum"],
              ["Établissement avec engins moteurs correctement immobilisés", "Distance de 3 m pouvant être réduite à 1,50 m"]
            ]
          },
          { type: "heading", level: 2, text: "Passages planchéiés et TVP" },
          {
            type: "list",
            items: [
              "Les passages planchéiés limitent le risque de chute lorsqu'ils sont implantés là où la visibilité est suffisante.",
              "Certains passages sont équipés d'une signalisation lumineuse annonçant l'approche d'une circulation et interdisant la traversée.",
              "La TVP peut présenter un pictogramme de personne à l'arrêt et une mention STOP rouge clignotante.",
              "Un téléphone près d'une TVP permet de signaler un incident ou un dérangement.",
              "Sur voies de service, les conducteurs utilisent les passages aménagés garantissant la visibilité."
            ]
          },
          { type: "heading", level: 2, text: "Traverser une voie non occupée" },
          {
            type: "list",
            items: [
              "Respecter la signalisation lorsqu'elle existe.",
              "Utiliser le passage planchéié ou la passerelle s'il y en a un.",
              "S'il n'y a ni passage ni passerelle, vérifier la distance de visibilité nécessaire.",
              "Traverser perpendiculairement à la voie."
            ]
          },
          { type: "heading", level: 2, text: "Avant, pendant et après la traversée" },
          {
            type: "list",
            items: [
              "Avant : marquer l'arrêt, prendre conscience de l'engagement de la zone dangereuse, ne pas se laisser distraire et cesser toute conversation.",
              "Avant : regarder alternativement des deux côtés, repérer les obstacles au sol et écouter.",
              "Pendant : traverser franchement sans s'arrêter, sans se laisser distraire et sans poser le pied sur le rail, les traverses ou un aiguillage.",
              "Après : dégager la zone dangereuse immédiatement.",
              "En cas de garage intermédiaire : préparer la traversée suivante avant de continuer."
            ]
          },
          { type: "heading", level: 2, text: "Voies occupées et véhicules en stationnement" },
          {
            type: "list",
            items: [
              "Pour traverser une voie occupée par une rame en stationnement, avoir l'assurance que la rame restera immobile.",
              "Utiliser une passerelle, une plateforme ou les marchepieds de franchissement.",
              "Ne jamais traverser sous un véhicule ou entre deux véhicules accouplés.",
              "Pour monter ou descendre d'un véhicule, appliquer les prescriptions correspondantes.",
              "Pour passer entre obstacles hauts et véhicules stationnés, s'assurer que les véhicules resteront immobiles.",
              "Ne pas passer entre un quai et des véhicules circulant ou stationnant sur la voie de ce quai."
            ]
          }
        ]
      }
    ]
  },
  { id: "F", title: "Chapitre F", description: "À compléter.", subchapters: [] }
];
