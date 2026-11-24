/* =========================================================================
   CONTENU DU PORTFOLIO — c'est le seul fichier à modifier pour le texte.
   Sources : profil Notion « Bienvenue sur mon profil », fiches portfolio, CV.
   ========================================================================= */

/* Images hébergées sur ton Notion public (width = taille chargée).
   Conseil : à terme, télécharge-les dans assets/projets/ et remplace l'URL
   par le chemin local (ex. "assets/projets/riskmedia.png") : ton site ne
   dépendra plus de Notion. */
const NOTION = (file, block, width = 1400) =>
  `https://app.notion.com/image/attachment%3A${file}?id=${block}&table=block&spaceId=dc1f3176-8e81-8157-84cd-0003912bea9a&width=${width}&userId=&cache=v2`;

window.CONTENT = {
  profil: {
    nom: "Tristan Wenglarz",
    titre: "UX/UI & Product Designer",
    accroche: "Je conçois des expériences digitales qui ont du sens. De la recherche à la maquette haute fidélité, je transforme des problèmes complexes en interfaces claires et engageantes.",
    cv: "assets/CV-Tristan-Wenglarz.pdf",
    dossierCompetences: "assets/DC_Tristan_Wenglarz.pdf",
    cvApercu: "assets/projets/cv-apercu.webp", // image du CV affichée sur l'écran du PC
    email: "tristan.2pro@gmail.com",
    linkedin: "https://www.linkedin.com/in/tristan-wenglarz-aa090887/",
    telephone: "", // optionnel : laissé vide pour éviter le démarchage
    disponibilite: "Disponible · Île-de-France & remote",
    prochainNiveau: "Senior",
  },

  /* Image de fond. Remplace par ton rendu Blender quand il est prêt :
     scene: "assets/studio.jpg"  (format 16:9, idéalement 3200x1800) */
  scene: "assets/studio.svg",

  /* Zones cliquables, en % de l'image (left, top, width, height). */
  hotspots: [
    { id: "projets",  label: "Le projecteur",       hint: "Projets",          left: 29.4, top: 2.2,  width: 33.75, height: 48.9 },
    { id: "parcours", label: "Le PC gaming",        hint: "Parcours & skills", left: 1.9,  top: 32.2, width: 23.1,  height: 53.3 },
    { id: "mixes",    label: "La table de mixage",  hint: "Mixes & sets",     left: 66.75, top: 66.7, width: 32.6, height: 23.9 },
    { id: "passions", label: "L'étagère",           hint: "Passions",         left: 79.5, top: 13.6, width: 17.25, height: 52.9 },
    { id: "contact",  label: "Le canapé",           hint: "À propos & contact", left: 30.5, top: 72.2, width: 36.75, height: 27.8 },
  ],

  /* ---------------- PROJECTEUR : projets (une cassette VHS chacun) ---------------- */
  projets: [
    {
      titre: "Portail API interne",
      client: "BNP Paribas Cardif",
      annee: "2023–2025",
      tags: ["B2B", "Assurance", "Architecture d'info", "Research"],
      resume: "Centraliser les API métier dans un portail accessible à toutes les équipes de BNP Paribas Cardif.",
      contexte: "Squad agile, environnement réglementé, nombreuses parties prenantes : courtiers, partenaires, équipes métier et IT.",
      role: "Refonte UX complète du portail et de son architecture de l'information, revue des user flows, entretiens avec les courtiers, tests au Cardif Lab, communication interne pour embarquer les équipes.",
      choix: "Organiser le catalogue par cas d'usage métier plutôt que par brique technique. Les entretiens ont montré que les courtiers raisonnent par scénario (« intégrer la souscription auto à mon site »), pas par endpoint.",
      resultat: "Accès aux API simplifié pour les équipes métier, meilleure adoption du portail, communauté API passée de 50 à 250 membres.",
      image: "assets/projets/cardif-atelier.webp",
      liens: [],
    },
    {
      titre: "Prototype Business Value",
      client: "BNP Paribas · Pôle Innovation",
      annee: "2024–2025",
      tags: ["Innovation", "Prototypage", "Design d'interaction"],
      resume: "Un prototype immersif qui présente les business values de BNP Paribas à l'échelle mondiale à ses futurs partenaires.",
      contexte: "Projet vitrine du Pôle Innovation, construit sprint après sprint avec des technologies innovantes.",
      role: "Conception de A à Z du prototype à chaque sprint, entretiens utilisateurs et analyse des données, design d'expérience immersif, présentation aux stakeholders et partenaires.",
      choix: "",
      resultat: "Outil de démonstration utilisé pour convaincre de nouveaux partenaires internationaux de la plus-value du groupe.",
      image: "assets/projets/cardif-equipe.webp",
      liens: [],
    },
    {
      titre: "Design System",
      client: "BNP Paribas Cardif",
      annee: "2023–2026",
      tags: ["Design System", "Figma", "Composants"],
      resume: "Gestion et évolution du Design System de BNP Paribas Cardif.",
      contexte: "Un système partagé par plusieurs squads, qui doit rester cohérent et maintenable dans la durée.",
      role: "Contribution aux composants (variants, auto-layout, variables), documentation, guide de conventions de handoff pour les développeurs.",
      choix: "",
      resultat: "Pour des raisons de confidentialité, le Design System n'est pas montré en entier.",
      image: "assets/projets/cardif-design-system.webp",
      liens: [],
    },
    {
      titre: "De Sacs et d'Eau",
      client: "Projet personnel · Blog de voyage",
      annee: "2025–2026",
      tags: ["Branding", "SEO", "Figma → Framer → WordPress"],
      resume: "Notre blog de voyage, conçu de A à Z : charte, logo, site et mise en ligne.",
      contexte: "Un blog créé à deux pendant un an en Amérique du Sud, qui mêle storytelling, webdesign et SEO.",
      role: "Branding (logo, palette, ton éditorial), architecture de contenu, templates Figma, première version sur Framer, puis thème WordPress sur mesure.",
      choix: "Après analyse des KPI (trafic, SEO, temps de chargement), pivot de Framer vers WordPress avec un thème custom pour mieux référencer et charger plus vite.",
      resultat: "Les stats ont suivi. Un vrai cas d'itération produit : concevoir, mesurer, pivoter, améliorer.",
      image: "assets/projets/desacsetdeau-1.webp",
      galerie: ["assets/projets/desacsetdeau-2.webp", "assets/projets/desacsetdeau-accueil.webp"],
      liens: [{ label: "Voir le site", url: "https://desacsetdeau.com/" }],
    },
    {
      titre: "Agence Inspire",
      client: "Freelance · Hôtellerie de luxe",
      annee: "",
      tags: ["Site vitrine", "Direction artistique", "Conversion"],
      resume: "Le site d'une agence de photo, vidéo et films publicitaires pour hôtels 4 et 5 étoiles et palaces.",
      contexte: "Refonte complète pour refléter un positionnement haut de gamme et générer des leads.",
      role: "Seul designer de A à Z : benchmark, architecture, wireframes, maquettes desktop et mobile, prototype, suivi du développement.",
      choix: "Une navigation centrée sur les réalisations plutôt que sur les services : dans l'hôtellerie de prestige, le prospect achète un résultat visuel. Le contact est accessible depuis chaque réalisation.",
      resultat: "Site en ligne, utilisé au quotidien par l'agence pour générer des leads qualifiés.",
      image: "assets/projets/inspire-1.webp",
      galerie: ["assets/projets/inspire-3.webp", "assets/projets/inspire-2.webp"],
      liens: [{ label: "Voir le site", url: "http://agenceinspire.fr/" }],
    },
    {
      titre: "Riskmedia",
      client: "Freelance · Assurance média",
      annee: "2025",
      tags: ["Refonte", "Responsive", "Prototype HD"],
      resume: "La refonte d'un courtier spécialisé dans le média et le divertissement.",
      contexte: "Moderniser le positionnement digital tout en gardant la crédibilité du secteur assurance.",
      role: "Direction artistique, conception de toutes les pages (accueil, services, à propos, contact) en desktop et mobile, prototype interactif haute fidélité.",
      choix: "Sortir des codes visuels du courtage (bleu corporate, poignées de main) pour une identité plus dynamique, défendue avec un benchmark des courtiers spécialisés qui se démarquent.",
      resultat: "Sortie prévue fin 2026.",
      image: "assets/projets/riskmedia-hero.webp",
      galerie: ["assets/projets/riskmedia-2.webp"],
      liens: [],
    },
    {
      titre: "Sitio Camino Verde",
      client: "Initiative personnelle · Uruguay",
      annee: "2025",
      tags: ["Immersion terrain", "Direction artistique", "Réservation"],
      resume: "Le site d'une ferme autosuffisante en Uruguay, en transition vers l'événementiel.",
      contexte: "Cinq semaines de volontariat sur place, puis la proposition, de ma propre initiative, de créer leur site.",
      role: "Direction artistique inspirée du terroir, accueil immersif avec galerie plein écran, présentation des espaces, calendrier événementiel et formulaire de réservation. Prototype HD sous Figma, en espagnol.",
      choix: "Avoir vécu sur place m'a permis de capturer l'âme du lieu, quelque chose qu'un brief à distance n'aurait jamais produit.",
      resultat: "Sortie prévue en décembre 2026.",
      image: "assets/projets/sitio-globale.webp",
      galerie: ["assets/projets/sitio-1.webp", "assets/projets/sitio-2.webp", "assets/projets/sitio-3.webp"],
      liens: [{ label: "Prototype Figma", url: "https://www.figma.com/proto/L8WfGleR1bPHH9MLC3WARu/Farm-Ash-and-Fio?node-id=106-450&scaling=scale-down&content-scaling=fixed&starting-point-node-id=106%3A450" }],
    },
    {
      titre: "Casa Viva",
      client: "Volontariat · Refuge pour chiens, Pérou",
      annee: "2025",
      tags: ["Audit UX", "Adoption & dons", "Accessibilité"],
      resume: "Repenser la présence digitale d'un refuge pour chiens à Cusco.",
      contexte: "Deux semaines de volontariat au refuge, entre le travail avec les animaux et le digital.",
      role: "Audit UX du site existant, points de friction sur les parcours d'adoption et de don, benchmark de refuges, wireframes et maquettes HD sous Figma.",
      choix: "Une approche centrée sur la conversion (faciliter l'adoption, encourager les dons) avec un design empathique et accessible pour un public international.",
      resultat: "",
      image: "assets/projets/casaviva.webp",
      liens: [{ label: "Prototype Figma", url: "https://www.figma.com/proto/L8WfGleR1bPHH9MLC3WARu/Projets?node-id=161-12531&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=161%3A12531&show-proto-sidebar=1" }],
    },
    {
      titre: "Reussette",
      client: "Freelance · Catering événementiel",
      annee: "",
      tags: ["Tunnel utilisateur", "UI gourmande"],
      resume: "La refonte UX du tunnel utilisateur d'une agence de catering, pour fluidifier le lien entre clients et partenaires.",
      contexte: "Une agence de catering haut de gamme basée à Paris.",
      role: "Analyse du parcours existant, refonte du tunnel, direction artistique « gourmande et élégante », prototype interactif sous Figma.",
      choix: "",
      resultat: "",
      image: "assets/projets/reussette-1.webp",
      galerie: ["assets/projets/reussette-2.webp"],
      liens: [{ label: "Prototype Figma", url: "https://www.figma.com/proto/50oAGHZbDFvX4uRaBPfvRV/Reussette?node-id=0-1&p=f&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=35%3A301" }],
    },
    {
      titre: "Projets d'agence",
      client: "Agence Limpide · CNRS, RATP, Interfel…",
      annee: "2022–2023",
      tags: ["Gestion de projet", "Recherche utilisateur", "Figma"],
      resume: "Chef de projet digital et UX : des projets web de bout en bout pour des institutions et des entreprises.",
      contexte: "CNRS (rebranding et nouvelles interfaces), RATP (entretiens utilisateurs et recherche UX pour ratp.fr), Villa des Sables (coordination jusqu'à la mise en ligne), Interfel, Caleepso (recherche, interfaces, mise en ligne de l'outil).",
      role: "Ateliers de co-conception, personae, user flows, prototypage Figma, coordination des développeurs, QA, suivi SEO et analytics.",
      choix: "Sur la RATP : passer d'une navigation par catégories à une navigation par scénarios d'usage, appuyée par les verbatims des entretiens.",
      resultat: "",
      image: "assets/projets/limpide.webp",
      galerie: ["assets/projets/cnrs-1.webp", "assets/projets/cnrs-2.webp", "assets/projets/cnrs-3.webp", "assets/projets/caleepso-1.webp", "assets/projets/caleepso-2.webp", "assets/projets/caleepso-3.webp", "assets/projets/interfel-1.webp", "assets/projets/interfel-2.webp", "assets/projets/interfel-3.webp", "assets/projets/interfel-4.webp", "assets/projets/villa-1.webp", "assets/projets/villa-2.webp", "assets/projets/villa-3.webp"],
      liens: [{ label: "Étude RATP sur limpide.fr", url: "https://limpide.fr/realisation/site-internet/comprendre-les-besoins-des-utilisateurs-pour-identifier-les-axes-damelioration-et-de-nouvelles-fonctionnalites-sur-le-site-ratp-fr/" }],
    },
    {
      titre: "Candide Liqueur",
      client: "Co-fondateur · Génépi premium",
      annee: "5 ans",
      tags: ["Branding", "E-commerce", "Événementiel"],
      resume: "Toute l'image, l'expérience et la communication d'une marque, de la première esquisse au verre dans la main du client.",
      contexte: "Une marque de génépi premium cofondée et portée pendant cinq ans, clôturée en 2025.",
      role: "Charte graphique initiale, pilotage du rebranding 2024 avec l'agence, conception du site e-commerce (benchmark, architecture, wireframes, maquettes), supports visuels et événements de la marque.",
      choix: "",
      resultat: "Un parcours d'achat et un funnel de conversion optimisés.",
      image: "assets/projets/candide-1.webp",
      galerie: ["assets/projets/candide-2.webp", "assets/projets/candide-3.webp", "assets/projets/candide-4.webp"],
      liens: [],
    },
    {
      titre: "ZIPE",
      client: "Master UX · Sup de Pub",
      annee: "2023",
      tags: ["App mobile", "Tests utilisateurs", "Changement de comportement"],
      resume: "Une app mobile pour accompagner les étudiants confrontés à des addictions dans un changement de comportement.",
      contexte: "Projet d'équipe mené pour une association, dans le cadre du Master UX Design & Innovation.",
      role: "Recherche (entretiens, questionnaires, parcours de soin), personae, user flows, wireframes, tests sur prototype, UI de l'app : onboarding, suivi quotidien, progression, ressources d'aide.",
      choix: "",
      resultat: "Noté 19/20.",
      image: "assets/projets/zipe-1.webp",
      galerie: ["assets/projets/zipe-globale.webp", "assets/projets/zipe-projet.webp"],
      liens: [{ label: "Prototype Figma", url: "https://www.figma.com/proto/YNHvOBwGtkIl5qhqJ75w2Q/Tristan-Wenglarz?node-id=175-14495&p=f&scaling=scale-down&content-scaling=fixed&starting-point-node-id=220%3A14567&show-proto-sidebar=1" }],
    },
    {
      titre: "Lyon, 1942",
      client: "Jeu vidéo · Projet personnel en cours",
      annee: "En cours",
      tags: ["Game UX", "Narrative design", "HUD"],
      resume: "Un jeu sur la Résistance à Lyon en 1942, abordé par l'angle UX/UI et narratif.",
      contexte: "N'étant pas game designer de formation, j'aborde le projet par les interfaces et la narration.",
      role: "Interfaces de jeu (menus, HUD, inventaire, dialogues), Game Design Document, arborescence narrative et branches de choix, univers visuel.",
      choix: "Chaque interface doit servir l'immersion sans casser le flow du joueur.",
      resultat: "",
      image: NOTION("b3b3b8f1-01b0-4225-b12f-20d7a0fcd4d6%3AStage_intro.png", "462f3176-8e81-8243-ab5c-8139fc845d2c"),
      galerie: [
        NOTION("747dc8f8-39ab-4c33-92fd-458692bd5f3c%3ACapture_decran_2026-10-12_a_00.08.27.png", "860f3176-8e81-83c1-acd8-01c3cca6199a"),
        NOTION("255511ec-d8af-4c14-b366-4c49ec7b809c%3ACapture_decran_2026-10-12_a_00.11.51.png", "4bbf3176-8e81-828a-8ed0-0101972c32ef"),
        NOTION("72843b79-4b82-47d7-8874-1f2a4b8ff92d%3Aimage_115_-_Grande.jpeg", "4fcf3176-8e81-83f3-8801-8163077fa603"),
        NOTION("87e57853-9c33-4e1d-b8d5-3642ae69fbc0%3ALoading_screen.png", "a4df3176-8e81-82cc-8cff-819726132376"),
      ],
      liens: [],
    },
  ],

  /* Vidéos 3D / scénographie (mp4 dans assets/videos/ ou lien YouTube embed) */
  videos: [
    { titre: "Showroom Helo", resume: "Aménagement d'un showroom pour une marque de vêtements : parcours client et mise en scène des collections.", video: "assets/videos/helo-showroom.mp4", poster: "assets/videos/helo-showroom.jpg" },
    { titre: "L'Europe, place de la République", resume: "Événement EU × Havas : un parcours de stations par pays pour faire découvrir l'Europe et ses opportunités aux jeunes. Direction artistique complète.", video: "assets/videos/europe-republique-1.mp4", poster: "assets/videos/europe-republique-1.jpg" },
    { titre: "L'Europe, place de la République — vue 2", resume: "Le même parcours vu sous un autre angle : circulation entre les stations et points d'interaction.", video: "assets/videos/europe-republique-2.mp4", poster: "assets/videos/europe-republique-2.jpg" },
    { titre: "Escape game Faguo", resume: "Un escape game pour sensibiliser à la pollution marine et faire découvrir la conception éco-responsable des vêtements Faguo.", video: "assets/videos/faguo-escape-game.mp4", poster: "assets/videos/faguo-escape-game.jpg" },
  ],

  /* ---------------- PC GAMING : parcours & compétences ---------------- */
  parcours: [
    { periode: "Oct. 2023 → aujourd'hui", poste: "UX / Web Designer freelance", lieu: "Remote",
      points: ["Projets de A à Z, de la direction artistique au prototype interactif", "Agence Inspire, Riskmedia, Reussette, Sitio, De Sacs et d'Eau"] },
    { periode: "Juil. 2023 → Fév. 2026", poste: "UX Designer", lieu: "BNP Paribas Cardif, Paris",
      points: ["Pôle API : refonte UX du portail interne, revue des user flows, communication interne", "Pôle Innovation : prototype Business Value conçu de A à Z", "Design System, repository de recherche UX, tests au Cardif Lab"] },
    { periode: "Sept. 2022 → Juin 2023", poste: "Chef de projet digital", lieu: "Limpide, Paris",
      points: ["Projets web pour le CNRS, la RATP, Interfel, Villa des Sables, Caleepso", "Ateliers, personae, user journeys, prototypage Figma, SEO et analytics"] },
    { periode: "Avr. → Sept. 2022", poste: "Stage communication digitale", lieu: "5 Degrés, Paris",
      points: ["Site et SharePoint d'onboarding (UX/UI, visuels, contenus)", "Stratégie de communication multi-canaux"] },
    { periode: "Mai → Août 2021", poste: "Stage communication marketing", lieu: "Aressy / Epoka, Paris",
      points: ["Campagnes marketing, e-mailings, nurturing, suivi des KPI", "Production vidéo, LinkedIn Live, webinars"] },
    { periode: "Nov. 2020 → Fév. 2021", poste: "Stage communication & développement", lieu: "RSnatch, Paris",
      points: ["Réseaux sociaux, site web, production photo", "Événements pour des clubs de CrossFit"] },
  ],

  formation: [
    { annee: "2022–2023", titre: "Master UX Design & Innovation", ecole: "Sup de Pub, Paris" },
    { annee: "2020–2022", titre: "Master 1 Communication digitale", ecole: "Sup de Pub, Paris" },
  ],

  competences: [
    { groupe: "UX", items: ["User research", "Entretiens", "Tests utilisateurs", "Personae", "User flows", "Wireframing", "Prototypage", "Audits UX"] },
    { groupe: "UI & design", items: ["Design System", "UI design", "Direction artistique", "Responsive", "Accessibilité"] },
    { groupe: "Web & data", items: ["WordPress", "Webflow", "Framer", "No-code", "SEO", "Google Analytics", "Adobe Analytics"] },
    { groupe: "Méthodes", items: ["Design Thinking", "Agile / Scrum", "Ateliers de co-design", "Gestion de projet"] },
  ],

  outils: [
    "Figma", "Photoshop", "Illustrator", "InDesign", "Premiere Pro", "After Effects", "Blender", "Canva",
    "Framer", "Webflow", "WordPress", "Notion", "SharePoint",
    "Jira", "Confluence", "Slack", "Suite Office",
    "Adobe Analytics", "Google Analytics", "Yoast SEO", "RankSEO",
  ],

  langues: [
    { langue: "Français", niveau: "Natif" },
    { langue: "Anglais", niveau: "Avancé (B2–C1)" },
    { langue: "Espagnol", niveau: "Intermédiaire" },
    { langue: "Russe", niveau: "Notions" },
  ],

  traits: ["Couteau suisse", "Adaptation", "Créatif", "Autonome", "Altruiste", "Humour"],

  /* ---------------- TABLE DE MIXAGE : tes MP3 ----------------
     Dépose tes fichiers dans assets/mixes/ puis liste-les ici.
     "demo.mp3" est un petit beat de test : supprime-le quand tu ajoutes tes sets. */
  mixes: [
    // Sets hébergés sur SoundCloud (lecture pilotée par la platine du site).
    // Pour revenir à un MP3 local : soundcloud: "" et fichier: "assets/mixes/….mp3"
    { titre: "Make It Move", genre: "Set · Krow_blank pour Le Voisin", soundcloud: "https://soundcloud.com/le_voisin/set-make-it-move-krow_blank" },
    { titre: "Speechless présente Le Voisin", genre: "Set · Le Voisin", soundcloud: "https://soundcloud.com/le_voisin/speechless-presente-krow_blank" },
  ],

  /* ---------------- ÉTAGÈRE : passions ---------------- */
  passions: [
    { emoji: "🌎", titre: "Voyage", texte: "Un an en sac à dos à travers l'Amérique du Sud. Les rencontres, les paysages, les imprévus : on raconte tout sur notre blog.", lien: { label: "Lire De Sacs et d'Eau", url: "https://desacsetdeau.com/" } },
    { emoji: "🎧", titre: "Musique & DJ", texte: "Je mixe, et la table de mixage du studio n'est pas là pour la déco." },
    { emoji: "🚁", titre: "Drone", texte: "Photo et vidéo aérienne pendant mes voyages." },
    { emoji: "🧊", titre: "3D & scénographie", texte: "Aménager des espaces réels : showroom, événement, escape game." },
    { emoji: "🎮", titre: "Jeu vidéo", texte: "J'aime les jeux vidéo pour leurs histoires autant que pour leurs coulisses. Comment une équipe a-t-elle pensé ce niveau, ce menu, cette mécanique ? C'est cette curiosité qui m'a poussé à concevoir mon propre jeu." },
    { emoji: "🎬", titre: "Cinéma & animé", texte: "Gros consommateur de films et d'animés. Un bon récit, une mise en scène soignée, un générique qu'on ne zappe pas : c'est souvent là que je trouve mes meilleures idées." },
    { emoji: "🍜", titre: "Foodie", texte: "Bien manger, c'est sérieux. J'ai une liste d'excellentes adresses à Paris, et je la partage volontiers : il suffit de demander." },
    { emoji: "🤝", titre: "Volontariat", texte: "Être utile, tout simplement. Quand une bonne cause a besoin d'un coup de main, j'aime mettre mes compétences à son service." },
  ],

  /* ---------------- CANAPÉ : à propos ---------------- */
  aPropos: [
    "UX/UI Designer depuis plus de 4 ans, j'ai travaillé pour un grand compte (BNP Paribas Cardif), des agences (Limpide, 5 Degrés) et des clients en freelance. Je conçois des outils complexes avec une conviction : on ne devine pas, on mesure.",
    "Ce qui me met en mouvement : concevoir, analyser et coordonner. J'aime autant créer de nouvelles choses qu'analyser des données, et mes trois moteurs sont la collaboration, l'exécution et l'innovation.",
    "En équipe, je suis un partenaire plus qu'un meneur : je consulte avant de décider et j'implique chacun. Calme sous pression, perfectionniste et inventif, je décide vite et j'apprends en profondeur.",
  ],

  /* ---------------- Profil mesuré : tests AssessFirst du 17/09/2026 ----------------
     Données reprises telles quelles des rapports SWIPE (personnalité),
     DRIVE (motivations) et BRAIN (raisonnement). */
  tests: {
    date: "17 septembre 2026",
    swipe: {
      disc: { style: "Perfectionniste", code: "Cs", qualites: ["Conciliant", "Calme", "Enthousiaste"],
        texte: "Je reste concentré et j'accomplis mes tâches avec beaucoup d'attention. Ce ton discipliné me permet de maintenir des décisions claires et des processus cohérents." },
      familles: [
        { nom: "Leadership & influence", traits: [["Prend l'ascendant sur les autres", 5], ["Cherche à convaincre les autres", 2], ["Va spontanément vers les autres", 8], ["Fait preuve de diplomatie", 5]] },
        { nom: "Prise en compte des autres", traits: [["S'implique affectivement", 6], ["S'ouvre aux idées des autres", 6], ["Accepte les critiques émises", 6], ["Consulte avant de décider", 8]] },
        { nom: "Créativité & adaptabilité", traits: [["Est attiré par les tâches variées", 4], ["S'intéresse aux choses abstraites", 7], ["Fait preuve d'inventivité", 8], ["S'adapte aux changements", 5]] },
        { nom: "Rigueur dans le travail", traits: [["S'organise avec méthode", 6], ["S'attache aux détails", 6], ["Persévère face aux obstacles", 6], ["Va au-delà des tâches prescrites", 4]] },
        { nom: "Équilibre personnel", traits: [["Se montre détendu", 9], ["S'attache aux aspects positifs", 9], ["Contrôle ses émotions", 8], ["Recherche la stabilité", 5]] },
      ],
      talentCloud: [
        { groupe: "Influencer", talents: [["Développer des relations", "Mobilisable"], ["Diriger", "Non développé"], ["Fédérer", "Mobilisable"]] },
        { groupe: "Coopérer", talents: [["Communiquer avec tact", "Mobilisable"], ["Soutenir les autres", "Mobilisable"], ["Travailler en équipe", "Distinctif"]] },
        { groupe: "Réfléchir", talents: [["Anticiper les obstacles", "À développer"], ["Développer une vision", "Distinctif"], ["Innover", "Avéré"]] },
        { groupe: "Agir", talents: [["Entreprendre", "Non développé"], ["Planifier et organiser", "Mobilisable"], ["Perfectionner et contrôler", "Mobilisable"]] },
        { groupe: "Ressentir", talents: [["Partager son enthousiasme", "Mobilisable"], ["Faire preuve de réactivité", "Non développé"], ["Gérer le stress", "Distinctif"]] },
      ],
      atouts: [
        "Aisance pour aller vers de nouvelles personnes",
        "J'implique tout le monde dans les décisions",
        "Je tire parti des retours qu'on me fait",
        "Je mène mon travail avec perfectionnisme",
        "Moteur de l'innovation dans mon travail",
        "Imperméable au stress",
      ],
    },
    drive: {
      motivations: [
        { nom: "Collaboration", score: 7, texte: "Créer une vision partagée qui rassemble les équipes." },
        { nom: "Exécution", score: 7, texte: "Concrétiser une vision claire en résultats mesurables." },
        { nom: "Innovation", score: 7, texte: "Explorer de nouvelles approches pour faire émerger des idées." },
      ],
      orientation: 33, // 0 = Stabilité, 100 = Dynamisme
      activites: [["Concevoir", 75], ["Analyser", 75], ["Coordonner", 75]],
      leadership: [["Empathique", 75], ["Participatif", 62]],
      culture: "Collaboration",
      drivers: [
        { groupe: "Ce que je veux faire", items: [["Créer de nouvelles choses", 8], ["Analyser des données", 8], ["Avoir des tâches clairement définies", 6], ["Se préoccuper de l'esthétique", 5], ["Se préoccuper de la qualité", 4]] },
        { groupe: "Comment je veux le faire", items: [["Travailler en équipe", 7], ["Avoir de l'autonomie", 6], ["Avoir de l'influence", 4]] },
        { groupe: "Dans quel cadre", items: [["Préserver son équilibre personnel", 9], ["Travailler dans un environnement informel", 7], ["Avoir un impact positif sur le monde", 6], ["Travailler de façon disciplinée", 5]] },
      ],
    },
    brain: {
      potentiel: 7,
      distribution: [2, 4, 9, 15, 20, 20, 15, 9, 4, 2], // % de la population pour chaque niveau 1 à 10
      vitesse: 87, // vitesse de raisonnement, 0 = lente, 100 = rapide
      styles: [["Tâches privilégiées", "Intermédiaire", "Gère son activité en autonomie."], ["Prise de décision", "Rapide", "Avance vite et passe rapidement d'une tâche à l'autre."], ["Apprentissage", "Approfondi", "S'appuie sur des réflexions et des concepts éprouvés."]],
      facon: { profil: "Sprinter", texte: "S'appuie sur ses facilités naturelles pour réussir, ne perd pas de temps face aux difficultés et vise le meilleur compromis entre temps passé et résultats obtenus." },
      appuis: [["Gestion de la complexité", "Moyen"], ["Vitesse de décision", "Fort"], ["Précision", "Moyen"]],
    },
  },
};
