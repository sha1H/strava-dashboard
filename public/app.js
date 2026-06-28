/* app.js — Frontend Dashboard Strava v2 */

// PLAN V2 — Basé sur profil réel : 37:50 sur 10km, VMA 20.5, reprise depuis 1 mois
// VMA actuelle estimée : 17-18 km/h (à affiner via test S3)
// Structure : 4 séances course + vélo récup + renforcement 2x/sem
// Allures basées sur VMA actuelle (pas la VMA de forme)

// LÉGENDE ALLURES :
// EF = Endurance Fondamentale = 65-75% VMA = ~5:40-6:10/km (actuel)
// Seuil = 83-88% VMA = ~4:40-5:00/km
// AS10 = Allure Spécifique 10km = 4:00/km (objectif final)
// VMA court = 95-100% VMA actuelle = ~3:30-3:45/km sur courtes distances
// Les allures VMA évolueront avec le test S3

const PLAN_DETAIL = [
  // ════════════════════════════════════════════════════════
  // PHASE 1 : RECONSTRUCTION (S1-S5)
  // Objectif : retrouver le volume, les appuis, la mécanique
  // ════════════════════════════════════════════════════════
  {
    week: 1, phase: 'reprise', targetKm: 10, runs: 4,
    notes: 'Semaine 100% endurance fondamentale. Pas d\'intensité. Retrouve le plaisir et les sensations. Ton corps se souvient mais les tendons et articulations ont besoin de temps.',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF', distance: '25 min', allure: '5:50–6:10/km', fc: '65–72% FCM',
        description: 'Footing en endurance fondamentale pure. Tu dois pouvoir tenir une conversation complète sans effort. Si tu dépasses 145 bpm, ralentis. Inclus 5 min de marche en échauffement.'
      },
      {
        type: 'renforcement', titre: 'Renforcement musculaire A', distance: '20 min', allure: 'Hors course', fc: '—',
        description: 'Circuit à faire chez toi ou en salle : 3×15 squats, 3×10 fentes alternées, 3×30 sec planche ventrale, 3×20 montées de genoux debout, 2×15 mollets sur marche. Repos 45 sec entre séries. Ce travail prévient les rechutes.'
      },
      {
        type: 'endurance', titre: 'Footing EF', distance: '25 min', allure: '5:50–6:10/km', fc: '65–72% FCM',
        description: 'Même consigne que la première sortie. Focus sur la foulée : attaque talon-milieu, cadence ~170-175 pas/min, épaules relâchées.'
      },
      {
        type: 'endurance', titre: 'Sortie longue EF', distance: '35–40 min', allure: '6:00–6:20/km', fc: '<140 bpm',
        description: 'Ta sortie longue de la semaine. Allure encore plus facile que les autres jours. L\'objectif est le temps sur pied, pas les kilomètres. Si tu te sens fatigué à 25 min, arrête.'
      },
    ]
  },
  {
    week: 2, phase: 'reprise', targetKm: 15, runs: 4,
    notes: 'On augmente de ~10% le volume. Toujours 100% endurance fondamentale. Introduction du vélo en récupération active si tu veux.',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF', distance: '30 min', allure: '5:45–6:05/km', fc: '65–72% FCM',
        description: 'Légère progression du volume. Même allure confortable. Note tes sensations après la sortie sur une échelle de 1 à 10.'
      },
      {
        type: 'renforcement', titre: 'Renforcement musculaire B', distance: '20 min', allure: 'Hors course', fc: '—',
        description: 'Circuit B : 3×12 soulevé de terre poids de corps (chaise), 3×10 pont fessier, 3×30 sec gainage latéral chaque côté, 3×15 écart jambes élastique, 2×10 single leg deadlift. Ce circuit renforce les zones fragiles des coureurs.'
      },
      {
        type: 'velo', titre: 'Vélo récupération (optionnel)', distance: '30–45 min', allure: 'Très facile', fc: '<130 bpm',
        description: 'Alternative à un footing ou complément. Le vélo maintient le cardio sans impacter les tendons. Très léger, pas d\'effort. Si tu n\'as pas envie, repose-toi simplement.'
      },
      {
        type: 'endurance', titre: 'Sortie longue EF', distance: '45 min', allure: '5:50–6:10/km', fc: '<140 bpm',
        description: 'Sortie longue qui progresse. Reste à allure conversationnelle du début à la fin. Les 10 dernières minutes peuvent être légèrement plus dynamiques si tu te sens bien.'
      },
    ]
  },
  {
    week: 3, phase: 'reprise', targetKm: 20, runs: 4,
    notes: '⭐ SEMAINE CLÉ : Test VMA en milieu de semaine. Il va calibrer toutes tes allures de fractionné pour les 12 semaines suivantes. Ne le zappe pas.',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF', distance: '35 min', allure: '5:40–6:00/km', fc: '65–72% FCM',
        description: 'Footing facile. Prépare-toi mentalement au test VMA dans 2 jours. Pas de fatigue inutile.'
      },
      {
        type: 'test', titre: '🔬 Test VMA 6 minutes', distance: '3–4 km total', allure: 'Effort maximal 6 min', fc: 'Max',
        description: 'Échauffement 15 min progressif + 3 accélérations de 80m → Lance le chrono → cours 6 min EN EFFORT MAXIMAL (pas un sprint, un effort que tu peux tenir exactement 6 min) → mesure la distance parcourue. Ta VMA = distance (en m) ÷ 100. Ex : 1800m en 6 min = VMA 18 km/h. Note le résultat, on recalcule tout après. Retour calme 10 min.'
      },
      {
        type: 'renforcement', titre: 'Renforcement musculaire A', distance: '20 min', allure: 'Hors course', fc: '—',
        description: 'Circuit A (identique S1). Le lendemain du test c\'est parfait : pas d\'impact, mais tu travailles quand même.'
      },
      {
        type: 'endurance', titre: 'Sortie longue EF', distance: '50 min', allure: '5:50–6:10/km', fc: '<140 bpm',
        description: 'Sortie longue classique. Après le test de mercredi, reste très tranquille. Récupération active.'
      },
    ]
  },
  {
    week: 4, phase: 'reprise', targetKm: 25, runs: 4,
    notes: 'Première séance de qualité légère. On commence par des accélérations courtes, pas du vrai fractionné. Les allures sont basées sur ta VMA du test S3.',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF + fartlek', distance: '35 min', allure: 'EF + 6×30 sec vif', fc: '65-75% + pics',
        description: 'Footing EF 20 min → 6 accélérations de 30 secondes à allure vive (mais pas sprint) avec 1 min récup trottinée entre chaque → retour calme 5 min. Ces accélérations réveillent le système neuromusculaire sans le fatiguer.'
      },
      {
        type: 'renforcement', titre: 'Renforcement musculaire B', distance: '25 min', allure: 'Hors course', fc: '—',
        description: 'Circuit B enrichi : ajout de 2×10 pistol squat assisté (chaise), 3×12 Romanian deadlift jambe droite puis gauche. On augmente progressivement la difficulté.'
      },
      {
        type: 'endurance', titre: 'Footing EF', distance: '35 min', allure: '5:40–5:55/km', fc: '65–72% FCM',
        description: 'Footing tranquille. L\'allure commence à s\'améliorer naturellement. Ne cherche pas à forcer.'
      },
      {
        type: 'endurance', titre: 'Sortie longue EF', distance: '55 min', allure: '5:45–6:05/km', fc: '<140 bpm',
        description: 'Sortie longue en progression. Les 15 dernières minutes peuvent être à allure légèrement soutenue (5:20-5:30/km) si tu te sens bien — c\'est optionnel.'
      },
    ]
  },
  {
    week: 5, phase: 'reprise', targetKm: 28, runs: 4,
    notes: 'Fin de la phase de reconstruction. Premier vrai fractionné court pour réactiver la vitesse. Allures basées sur ta VMA testée.',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF', distance: '40 min', allure: '5:35–5:50/km', fc: '65–72% FCM',
        description: 'Ton allure d\'endurance s\'est déjà améliorée par rapport à S1. C\'est le signe que ton organisme se réadapte.'
      },
      {
        type: 'fractionne', titre: 'VMA court 8×30/30', distance: '5 km total', allure: '95-100% VMA sur les 30 sec', fc: 'Zone 4-5',
        description: 'Échauffement 15 min progressif + PPG (talons-fesses, montées de genoux, foulées bondissantes) → 8 répétitions de 30 sec à 95-100% VMA avec 30 sec de récup trottinée → retour calme 10 min. Format idéal pour réactiver la filière rapide sans se blesser. Si ta VMA est 18 km/h, tes 30 sec d\'effort se font à ~5 m/sec.'
      },
      {
        type: 'renforcement', titre: 'Renforcement musculaire A', distance: '25 min', allure: 'Hors course', fc: '—',
        description: 'Circuit A. Après une séance de fractionné, le renforcement le lendemain est parfait : il complète le travail neuromusculaire sans choc.'
      },
      {
        type: 'endurance', titre: 'Sortie longue EF', distance: '60 min', allure: '5:40–6:00/km', fc: '<140 bpm',
        description: 'Première vraie sortie longue d\'une heure. Gère ton allure : les 20 premières minutes semblent toujours faciles, c\'est la fin qui compte.'
      },
    ]
  },

  // ════════════════════════════════════════════════════════
  // PHASE 2 : DÉVELOPPEMENT (S6-S11)
  // Objectif : développer VMA, seuil, allure spécifique 10km
  // ════════════════════════════════════════════════════════
  {
    week: 6, phase: 'developpement', targetKm: 32, runs: 4,
    notes: 'Entrée dans la phase de développement. Alternance VMA et seuil chaque semaine. Le volume progresse prudemment (règle des 10%).',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF', distance: '40 min', allure: '5:30–5:45/km', fc: '65–72% FCM',
        description: 'Footing de base. Tu devrais sentir que ton allure naturelle d\'endurance s\'améliore semaine après semaine.'
      },
      {
        type: 'fractionne', titre: 'VMA court 10×30/30', distance: '6 km total', allure: '95-100% VMA', fc: 'Zone 4-5',
        description: 'Échauffement 15 min → 10×30 sec à 95-100% VMA avec 30 sec récup trottinée → retour calme 10 min. 2 répétitions de plus que S5. Si tu ne peux pas finir les 10, arrête à 8 — mieux vaut finir fort que terminer épuisé.'
      },
      {
        type: 'renforcement', titre: 'Renforcement musculaire B', distance: '25 min', allure: 'Hors course', fc: '—',
        description: 'Circuit B. Ajoute des pompes nordiques si tu en es capable (très efficace pour les ischio-jambiers).'
      },
      {
        type: 'endurance', titre: 'Sortie longue EF', distance: '65 min', allure: '5:35–5:55/km', fc: '<140 bpm',
        description: 'Sortie longue qui continue de progresser. Reste conservateur sur l\'allure — c\'est le volume qui compte ici.'
      },
    ]
  },
  {
    week: 7, phase: 'developpement', targetKm: 36, runs: 4,
    notes: 'Semaine seuil. On alterne VMA (semaine paire) et seuil (semaine impaire). Le seuil développe ta capacité à tenir l\'allure 10km longtemps.',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF', distance: '40 min', allure: '5:25–5:40/km', fc: '65–72% FCM',
        description: 'Footing classique. Échauffement soigné avant la séance seuil de mercredi/jeudi.'
      },
      {
        type: 'tempo', titre: 'Seuil 2×12 min', distance: '8 km total', allure: '83-88% VMA (~4:40-4:50/km)', fc: 'Zone 3-4 (155-165 bpm)',
        description: 'Échauffement 15 min → 2 répétitions de 12 min à allure seuil (83-88% VMA) avec 3 min de récup jogging entre les deux → retour calme 10 min. L\'allure seuil doit être inconfortable mais tenable. Tu peux prononcer 3-4 mots mais pas tenir une vraie conversation.'
      },
      {
        type: 'renforcement', titre: 'Renforcement musculaire A', distance: '25 min', allure: 'Hors course', fc: '—',
        description: 'Circuit A. Augmente progressivement la difficulté : descends plus bas dans les squats, tiens la planche plus longtemps.'
      },
      {
        type: 'endurance', titre: 'Sortie longue EF', distance: '70 min', allure: '5:35–5:50/km', fc: '<140 bpm',
        description: 'Sortie longue en progression. Les 15 dernières minutes à allure légèrement soutenue (5:15/km) si les sensations sont bonnes.'
      },
    ]
  },
  {
    week: 8, phase: 'recuperation', targetKm: 25, runs: 3,
    notes: '⬇️ Semaine de récupération obligatoire. Le corps s\'adapte pendant le repos. Ne saute pas cette semaine même si tu te sens bien — c\'est ici que les progrès se consolident.',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF léger', distance: '35 min', allure: '5:45–6:00/km', fc: '<135 bpm',
        description: 'Plus lent et plus court que d\'habitude. Profite de cette semaine allégée pour bien dormir et bien manger.'
      },
      {
        type: 'velo', titre: 'Vélo récupération active', distance: '45 min', allure: 'Très facile', fc: '<125 bpm',
        description: 'Séance vélo légère pour maintenir l\'activité sans fatiguer. Si tu n\'as pas envie, repos complet. Cette semaine est une récompense, pas une contrainte.'
      },
      {
        type: 'renforcement', titre: 'Renforcement léger', distance: '15 min', allure: 'Hors course', fc: '—',
        description: 'Version allégée du circuit A : 2×12 squats, 2×30 sec planche, 2×15 mollets. Juste pour maintenir les habitudes.'
      },
      {
        type: 'endurance', titre: 'Sortie longue réduite', distance: '50 min', allure: '5:45–6:05/km', fc: '<135 bpm',
        description: 'Sortie longue réduite et à allure très confortable. Pas de progression ce week-end, juste du plaisir.'
      },
    ]
  },
  {
    week: 9, phase: 'developpement', targetKm: 40, runs: 4,
    notes: 'Retour en force après la récupération. Le fractionné monte en intensité : introduction des 200m à VMA pour développer la vitesse pure.',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF', distance: '45 min', allure: '5:20–5:35/km', fc: '65–72% FCM',
        description: 'Ton allure EF a bien progressé. Continue de te calibrer à la fréquence cardiaque, pas à l\'allure.'
      },
      {
        type: 'fractionne', titre: 'VMA 10×200m', distance: '7 km total', allure: '95-100% VMA sur les 200m', fc: 'Zone 4-5',
        description: 'Échauffement 15 min + PPG → 10×200m à 95-100% VMA avec 1 min 15 sec de récup trottinée → retour calme 10 min. Les 200m à ta VMA actuelle (ex: 18 km/h) se font en ~40 secondes. Cours sur piste si possible pour être précis.'
      },
      {
        type: 'renforcement', titre: 'Renforcement musculaire B', distance: '30 min', allure: 'Hors course', fc: '—',
        description: 'Circuit B progressif. Tu peux commencer à ajouter du poids léger (haltères 5-8 kg) sur les exercices jambes si tu te sens à l\'aise.'
      },
      {
        type: 'endurance', titre: 'Sortie longue EF', distance: '75 min', allure: '5:30–5:50/km', fc: '<140 bpm',
        description: 'Nouvelle durée record du plan. Hydrate-toi et pense à prendre un gel ou un sucre si tu as tendance à manquer d\'énergie après 60 min.'
      },
    ]
  },
  {
    week: 10, phase: 'developpement', targetKm: 44, runs: 4,
    notes: 'Semaine seuil avancé. Introduction de l\'allure spécifique 10km (AS10 = 4:00/km). C\'est la vitesse de course objectif.',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF', distance: '45 min', allure: '5:15–5:30/km', fc: '65–72% FCM',
        description: 'Ton allure EF se rapproche de l\'allure marathon. Signe que ton endurance fondamentale est en train de monter.'
      },
      {
        type: 'tempo', titre: 'Seuil + AS10 : 3×10 min', distance: '10 km total', allure: '10 min seuil + 10 min AS10 + 10 min seuil', fc: 'Zone 3-4',
        description: 'Échauffement 15 min → 10 min à allure seuil (4:40-4:50/km) → 2 min récup → 10 min à AS10 (4:00/km) → 2 min récup → 10 min à allure seuil → retour calme 10 min. Première fois à 4:00/km ! Si c\'est trop dur, descends à 4:10/km.'
      },
      {
        type: 'renforcement', titre: 'Renforcement musculaire A', distance: '30 min', allure: 'Hors course', fc: '—',
        description: 'Circuit A avancé. Ajoute des sauts : 3×10 sauts en contrebas (box jump), 3×10 sauts sur place jambes tendues. Ces exercices développent la puissance de propulsion.'
      },
      {
        type: 'endurance', titre: 'Sortie longue EF', distance: '80 min', allure: '5:30–5:45/km', fc: '<140 bpm',
        description: 'Sortie longue maximale. Pars vraiment lentement pour tenir 80 min. Les 15 dernières minutes peuvent être à allure plus soutenue si les jambes répondent.'
      },
    ]
  },
  {
    week: 11, phase: 'developpement', targetKm: 48, runs: 4,
    notes: 'Pic de volume et d\'intensité. Semaine la plus dure du plan. Le fractionné monte à 400m pour développer l\'endurance de vitesse.',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF', distance: '50 min', allure: '5:10–5:25/km', fc: '65–72% FCM',
        description: 'Footing long de base. La progression de ton allure EF reflète directement ta progression générale.'
      },
      {
        type: 'fractionne', titre: 'VMA 8×400m', distance: '8 km total', allure: '95% VMA sur les 400m', fc: 'Zone 4-5',
        description: 'Échauffement 15 min → 8×400m à 95% VMA avec 1 min 30 sec de récup trottinée → retour calme 10 min. À 18 km/h de VMA, chaque 400m se fait en ~1 min 20. Ces répétitions développent ton endurance de vitesse — la qualité la plus importante pour le sub 40.'
      },
      {
        type: 'renforcement', titre: 'Renforcement musculaire B', distance: '30 min', allure: 'Hors course', fc: '—',
        description: 'Circuit B complet avec les sauts. Sois attentif à la technique, surtout si tu as des antécédents de blessure.'
      },
      {
        type: 'endurance', titre: 'Sortie longue EF', distance: '80 min', allure: '5:25–5:40/km', fc: '<140 bpm',
        description: 'Maintien de la sortie longue maximale. Tu arrives à la fin du bloc de développement — tout le travail dur est presque derrière toi.'
      },
    ]
  },

  // ════════════════════════════════════════════════════════
  // PHASE 3 : SPÉCIFIQUE + AFFÛTAGE (S12-S15)
  // Objectif : imprimer l'allure 4:00/km, arriver frais
  // ════════════════════════════════════════════════════════
  {
    week: 12, phase: 'recuperation', targetKm: 30, runs: 3,
    notes: '⬇️ Deuxième semaine de récupération. Volume -35%. L\'intensité se maintient mais le volume baisse fortement. Indispensable pour arriver frais en phase spécifique.',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF léger', distance: '35 min', allure: '5:30–5:45/km', fc: '<135 bpm',
        description: 'Footing léger et tranquille. Profite de la semaine légère pour prendre soin de toi : sommeil, nutrition, récupération.'
      },
      {
        type: 'fractionne', titre: 'VMA court 8×30/30', distance: '5 km total', allure: '95% VMA', fc: 'Zone 4',
        description: 'Maintien de la vitesse mais volume réduit. 8 répétitions seulement. Échauffement 15 min → 8×30/30 → retour calme 10 min.'
      },
      {
        type: 'endurance', titre: 'Sortie longue réduite', distance: '50 min', allure: '5:30–5:45/km', fc: '<135 bpm',
        description: 'Sortie longue allégée. Pas de progression, juste maintenir les jambes actives.'
      },
    ]
  },
  {
    week: 13, phase: 'specifique', targetKm: 40, runs: 4,
    notes: '⭐ Phase spécifique. Les séances clés se font maintenant à 4:00/km (AS10). Tu dois sentir cette allure dans tes jambes avant la course.',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF', distance: '40 min', allure: '5:10–5:25/km', fc: '65–72% FCM',
        description: 'Footing de base. Ton EF devrait maintenant se sentir très confortable à cette allure.'
      },
      {
        type: 'fractionne', titre: 'AS10 : 5×2000m', distance: '11 km total', allure: '4:00/km sur les 2000m', fc: 'Zone 4',
        description: 'Échauffement 15 min → 5×2000m à 4:00/km avec 2 min de récup trottinée → retour calme 10 min. C\'est la séance la plus spécifique du plan. Chaque répétition de 2000m simule un segment de ta course. Gère bien les premières — ne pars pas trop vite.'
      },
      {
        type: 'renforcement', titre: 'Renforcement léger', distance: '20 min', allure: 'Hors course', fc: '—',
        description: 'Circuit léger d\'entretien. Pas besoin de s\'épuiser, juste maintenir les acquis.'
      },
      {
        type: 'endurance', titre: 'Sortie longue EF', distance: '65 min', allure: '5:20–5:35/km', fc: '<140 bpm',
        description: 'Sortie longue qui commence à diminuer. Les 15 dernières minutes à allure AS10 (4:00/km) si tu te sens bien.'
      },
    ]
  },
  {
    week: 14, phase: 'affutage', targetKm: 25, runs: 4,
    notes: '⬇️ Affûtage. Volume -45%. L\'intensité se maintient sur des distances courtes. On préserve les jambes pour le jour J.',
    seances: [
      {
        type: 'endurance', titre: 'Footing EF', distance: '30 min', allure: '5:10–5:25/km', fc: '65–72% FCM',
        description: 'Footing léger. Tu vas peut-être ressentir une fatigue passagère cette semaine — c\'est normal pendant l\'affûtage. C\'est le signe que ton corps se prépare.'
      },
      {
        type: 'fractionne', titre: 'AS10 court : 6×1000m', distance: '7 km total', allure: '4:00/km sur les 1000m', fc: 'Zone 4',
        description: 'Échauffement 15 min → 6×1000m à 4:00/km avec 90 sec récup → retour calme 10 min. Dernière séance intense. Tu dois te sentir à l\'aise à 4:00/km — si c\'est le cas, tu es prêt.'
      },
      {
        type: 'endurance', titre: 'Footing EF court', distance: '25 min', allure: '5:20–5:40/km', fc: '<135 bpm',
        description: 'Très court, très facile. Juste pour garder les jambes actives.'
      },
      {
        type: 'endurance', titre: 'Sortie courte avec strides', distance: '30 min', allure: 'EF + 4×100m accélérations', fc: '<135 bpm',
        description: 'Footing 20 min très facile → 4 accélérations progressives de 100m (pas des sprints, des accélérations fluides) → retour 5 min. Ces strides gardent les jambes vives sans les fatiguer.'
      },
    ]
  },
  {
    week: 15, phase: 'affutage', targetKm: 12, runs: 3,
    notes: '🏁 Semaine de course. Repos actif uniquement. Prépare ta logistique (dossard, chaussures, nutrition, trajet). La forme est acquise — maintenant tu la conserves.',
    seances: [
      {
        type: 'recuperation', titre: 'Jogging très léger', distance: '20 min', allure: '6:00–6:30/km', fc: '<125 bpm',
        description: 'Lundi ou mardi uniquement. Ultra léger, quasi de la marche rapide. Juste pour garder le sang qui circule. Si tu as la moindre douleur, marche à la place.'
      },
      {
        type: 'recuperation', titre: 'Activation J-3 ou J-4', distance: '15 min + strides', allure: '6:00/km + 4×80m', fc: '<130 bpm',
        description: 'Footing 10 min très facile → 4 accélérations progressives de 80m → marche 5 min. Ces strides réveillent les fibres rapides sans créer de fatigue. Idéalement J-3 avant la course (ex: mercredi si course dimanche).'
      },
      {
        type: 'course', titre: '🏁 10km — Objectif sub 40 !', distance: '10 km', allure: '3:58–4:00/km', fc: 'Zone 4-5',
        description: 'STRATÉGIE DE COURSE : Km 1 à 4:05/km (ne pars pas avec les rapides !). Km 2-7 à 4:00/km réguliers. Km 8-9 : accélère si les sensations sont là. Km 10 : tout donner. Rappelle-toi : tu as fait 37:50 il y a 3 ans. Ce niveau est en toi. Gère le début, le reste suit. Bonne course 🔥'
      },
    ]
  },
];

// ── Couleurs par type de séance ───────────────────────────────────────────────
const SEANCE_COLORS = {
  endurance:    { bg: 'rgba(59,130,246,0.1)',   border: '#3b82f6', label: 'Endurance' },
  fractionne:   { bg: 'rgba(252,76,2,0.1)',     border: '#fc4c02', label: 'Fractionné' },
  tempo:        { bg: 'rgba(168,85,247,0.1)',   border: '#a855f7', label: 'Tempo / Seuil' },
  recuperation: { bg: 'rgba(34,197,94,0.1)',    border: '#22c55e', label: 'Récupération' },
  renforcement: { bg: 'rgba(99,102,241,0.1)',   border: '#6366f1', label: 'Renforcement' },
  velo:         { bg: 'rgba(20,184,166,0.1)',   border: '#14b8a6', label: 'Vélo' },
  test:         { bg: 'rgba(251,191,36,0.1)',   border: '#fbbf24', label: 'Test VMA' },
  course:       { bg: 'rgba(251,191,36,0.15)',  border: '#fbbf24', label: '🏁 Course' },
};

// ── Utilitaires formatage ────────────────────────────────────────────────────
const fmt = {
  km:    v => v != null ? v.toFixed(1) : '—',
  pace:  v => {
    if (!v) return '—';
    const total = Math.round(v);
    return `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
  },
  time:  v => {
    if (!v) return '—';
    const h = Math.floor(v/3600), m = Math.floor((v%3600)/60);
    return h > 0 ? `${h}h${String(m).padStart(2,'0')}` : `${m}min`;
  },
  date:  v => {
    const d = new Date(v);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  },
  phase: v => ({ reprise:'Reprise', developpement:'Dév.', recuperation:'Récup.', affutage:'Affûtage', specifique:'Spécifique' }[v] || v),
};

// ── Cache local ───────────────────────────────────────────────────────────────
const localCache = {
  KEY: 'strava_dash_v1',
  set(data) { try { localStorage.setItem(this.KEY, JSON.stringify({ data, ts: Date.now() })); } catch(e) {} },
  get(maxAgeMs = 5 * 60 * 1000) {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      return Date.now() - ts < maxAgeMs ? data : null;
    } catch(e) { return null; }
  },
  clear() { try { localStorage.removeItem(this.KEY); } catch(e) {} }
};

const $ = id => document.getElementById(id);
let chartInstance = null;

// ── Init ──────────────────────────────────────────────────────────────────────
(async function init() {
  const params = new URLSearchParams(location.search);
  if (params.get('error')) {
    $('login-error').classList.remove('hidden');
    showScreen('login');
    return;
  }

  const status = await fetch('/api/status').then(r => r.json()).catch(() => ({ connected: false }));
  if (!status.connected) { showScreen('login'); return; }
  if (params.get('connected')) history.replaceState({}, '', '/');

  $('days-count').textContent = status.daysUntilRace;
  showScreen('dashboard');

  fetch('/api/athlete')
    .then(r => r.json())
    .then(a => { $('athlete-name').textContent = `${a.firstname} ${a.lastname}`; })
    .catch(() => {});

  const cached = localCache.get();
  if (cached) {
    renderAll(cached);
    $('cache-hint').textContent = 'données en cache · actualise pour rafraîchir';
  } else {
    loadActivities();
  }

  $('btn-refresh').addEventListener('click', () => {
    localCache.clear();
    loadActivities(true);
  });

  // Rendu du programme (statique, pas besoin d'API)
  renderProgramme();
})();

// ── Chargement activités ──────────────────────────────────────────────────────
async function loadActivities(force = false) {
  const btn = $('btn-refresh');
  btn.classList.add('spinning');
  $('cache-hint').textContent = 'chargement…';
  try {
    if (force) await fetch('/api/refresh', { method: 'POST' });
    const data = await fetch('/api/activities').then(r => r.json());
    if (data.error) throw new Error(data.error);
    localCache.set(data);
    renderAll(data);
    $('cache-hint').textContent = data.fromCache
      ? 'cache serveur · actualise dans 5 min'
      : `mis à jour à ${new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}`;
  } catch(e) {
    $('cache-hint').textContent = 'erreur de chargement · ' + e.message;
  } finally {
    btn.classList.remove('spinning');
  }
}

// ── Rendu principal ───────────────────────────────────────────────────────────
function renderAll(data) {
  const { weeks, currentWeek, currentPlanWeek, plan, daysUntilRace } = data;
  $('days-count').textContent = daysUntilRace;
  renderCurrentWeek(currentWeek, currentPlanWeek, plan);
  renderChart(weeks, plan);
  renderHistory(weeks);
  renderRecentRuns(weeks);
}

// ── Semaine en cours ──────────────────────────────────────────────────────────
function renderCurrentWeek(week, planWeekNum, plan) {
  const planWeek = plan.find(p => p.week === planWeekNum);
  $('current-week-label').textContent = `S${planWeekNum || '—'}`;
  if (planWeek) {
    $('plan-note').textContent = `S${planWeekNum} · ${fmt.phase(planWeek.phase)} — ${planWeek.notes}`;
    $('cur-km-target').textContent = `${planWeek.targetKm} km prévus`;
    $('cur-runs-target').textContent = `${planWeek.runs} prévues`;
  }
  if (!week) {
    ['cur-km','cur-runs','cur-pace','cur-hr','cur-time','cur-elev'].forEach(id => $(id).textContent = '0');
    setProgress('prog-km', 0);
    setProgress('prog-runs', 0);
    return;
  }
  $('cur-km').textContent    = fmt.km(week.kmDone);
  $('cur-runs').textContent  = week.runCount;
  $('cur-pace').textContent  = fmt.pace(week.avgPace);
  $('cur-hr').textContent    = week.avgHeartrate || '—';
  $('cur-time').textContent  = fmt.time(week.totalTime);
  $('cur-elev').textContent  = week.totalElevation ? `+${week.totalElevation}` : '—';
  if (planWeek) {
    const kmPct   = Math.min((week.kmDone / planWeek.targetKm) * 100, 100);
    const runsPct = Math.min((week.runCount / planWeek.runs) * 100, 100);
    setProgress('prog-km',   kmPct,   kmPct >= 100);
    setProgress('prog-runs', runsPct, runsPct >= 100);
  }
}

function setProgress(id, pct, over = false) {
  const el = $(id);
  el.style.width = pct + '%';
  el.classList.toggle('over', over);
}

// ── Graphique ─────────────────────────────────────────────────────────────────
function renderChart(weeks, plan) {
  const chartWeeks = [...weeks].reverse().slice(-12);
  const labels = chartWeeks.map(w => `S${w.weekNum}`);
  const realKm = chartWeeks.map(w => w.kmDone);
  const planKm = chartWeeks.map(w => w.plan?.targetKm ?? null);
  const ctx = $('chart-progress').getContext('2d');
  if (chartInstance) chartInstance.destroy();
  Chart.defaults.font.family = 'JetBrains Mono, monospace';
  Chart.defaults.color = '#555555';
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Réel (km)', data: realKm, backgroundColor: '#fc4c02', borderRadius: 4, borderSkipped: false, order: 1 },
        { label: 'Plan (km)', data: planKm, type: 'line', borderColor: '#2e2e2e', backgroundColor: 'transparent', borderWidth: 1.5, pointRadius: 3, pointBackgroundColor: '#2e2e2e', tension: 0.3, order: 0 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#1a1a1a', borderColor: '#2e2e2e', borderWidth: 1, titleColor: '#888', bodyColor: '#f0f0f0', padding: 10, callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} km` } }
      },
      scales: {
        x: { grid: { color: '#111', drawBorder: false }, ticks: { font: { size: 10 } } },
        y: { grid: { color: '#1a1a1a', drawBorder: false }, ticks: { font: { size: 10 }, callback: v => v + ' km' }, beginAtZero: true }
      }
    }
  });
}

// ── Tableau historique ────────────────────────────────────────────────────────
function renderHistory(weeks) {
  const tbody = $('history-body');
  tbody.innerHTML = '';
  weeks.slice(0, 15).forEach(w => {
    const ecartVal = w.vsTarget;
    const ecartCls = ecartVal == null ? 'ecart-neu' : ecartVal >= 0 ? 'ecart-pos' : 'ecart-neg';
    const ecartTxt = ecartVal == null ? '—' : `${ecartVal >= 0 ? '+' : ''}${ecartVal}`;
    const phaseCls = w.plan ? `badge badge-${w.plan.phase}` : 'badge';
    const phaseTxt = w.plan ? fmt.phase(w.plan.phase) : '—';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-week">${w.weekNum > 0 ? `S${w.weekNum}` : '—'} <span style="color:var(--text-3);font-size:10px">${fmt.date(w.date)}</span></td>
      <td><span class="${phaseCls}">${phaseTxt}</span></td>
      <td>${w.runCount}</td>
      <td class="td-km">${fmt.km(w.kmDone)}</td>
      <td style="font-family:var(--mono);font-size:12px;color:var(--text-3)">${w.plan?.targetKm ?? '—'}</td>
      <td class="td-ecart ${ecartCls}">${ecartTxt}</td>
      <td class="td-pace">${fmt.pace(w.avgPace)}</td>
      <td class="td-hr">${w.avgHeartrate ?? '—'}</td>
      <td class="td-elev">${w.totalElevation ? `+${w.totalElevation}m` : '—'}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Dernières sorties ─────────────────────────────────────────────────────────
function renderRecentRuns(weeks) {
  const container = $('runs-list');
  container.innerHTML = '';
  const allRuns = weeks.flatMap(w => w.runs).sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
  allRuns.forEach(run => {
    const div = document.createElement('div');
    div.className = 'run-row';
    div.innerHTML = `
      <div class="run-date">${fmt.date(run.date)}</div>
      <div class="run-name">${run.name}</div>
      <div class="run-stat">${fmt.km(run.distance/1000)} <span>km</span></div>
      <div class="run-stat">${fmt.time(run.movingTime)} <span>durée</span></div>
      <div class="run-stat">${fmt.pace(run.movingTime && run.distance ? (run.movingTime/run.distance)*1000 : null)} <span>/km</span></div>
      <div class="run-stat">${run.avgHr ? run.avgHr + ' bpm' : '—'} <span>FC moy.</span></div>
    `;
    container.appendChild(div);
  });
}

// ── Programme interactif ──────────────────────────────────────────────────────
function renderProgramme() {
  const container = $('programme-list');
  if (!container) return;

  // Semaine courante pour mise en avant
  const currentWeekNum = getCurrentPlanWeek();

  PLAN_DETAIL.forEach(week => {
    const isCurrent = week.week === currentWeekNum;
    const phaseLabel = { reprise:'Reprise', developpement:'Développement', recuperation:'Récupération', affutage:'Affûtage', specifique:'Spécifique' }[week.phase] || week.phase;
    const phaseCls = `badge badge-${week.phase}`;

    const weekEl = document.createElement('div');
    weekEl.className = `prog-week${isCurrent ? ' prog-week-current' : ''}`;
    weekEl.innerHTML = `
      <button class="prog-week-header" onclick="toggleWeek(${week.week})">
        <div class="prog-week-left">
          <span class="prog-week-num">S${week.week}</span>
          <span class="${phaseCls}">${phaseLabel}</span>
          ${isCurrent ? '<span class="badge-current">En cours</span>' : ''}
        </div>
        <div class="prog-week-right">
          <span class="prog-week-km">${week.targetKm} km</span>
          <span class="prog-week-runs">${week.runs} sorties</span>
          <svg class="prog-chevron" id="chevron-${week.week}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </button>
      <div class="prog-week-body" id="week-body-${week.week}" style="display:${isCurrent ? 'block' : 'none'}">
        <div class="prog-week-note">${week.notes}</div>
        <div class="prog-seances" id="seances-${week.week}">
          ${week.seances.map((s, i) => renderSeanceCard(s, i, week.week)).join('')}
        </div>
      </div>
    `;
    container.appendChild(weekEl);
  });
}

function renderSeanceCard(seance, index, weekNum) {
  const c = SEANCE_COLORS[seance.type] || SEANCE_COLORS.endurance;
  return `
    <div class="seance-card" style="border-left-color:${c.border}; background:${c.bg}">
      <button class="seance-header" onclick="toggleSeance(${weekNum}, ${index})">
        <div class="seance-header-left">
          <span class="seance-badge" style="color:${c.border};background:${c.bg}">${c.label}</span>
          <span class="seance-titre">${seance.titre}</span>
        </div>
        <div class="seance-header-right">
          <span class="seance-dist">${seance.distance}</span>
          <svg class="seance-chevron" id="seance-chevron-${weekNum}-${index}" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </button>
      <div class="seance-detail" id="seance-detail-${weekNum}-${index}" style="display:none">
        <div class="seance-stats-row">
          <div class="seance-stat"><span class="seance-stat-label">Allure</span><span class="seance-stat-val">${seance.allure}</span></div>
          <div class="seance-stat"><span class="seance-stat-label">FC cible</span><span class="seance-stat-val">${seance.fc}</span></div>
        </div>
        <p class="seance-desc">${seance.description}</p>
      </div>
    </div>
  `;
}

function toggleWeek(weekNum) {
  const body = document.getElementById(`week-body-${weekNum}`);
  const chevron = document.getElementById(`chevron-${weekNum}`);
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
}

function toggleSeance(weekNum, index) {
  const detail = document.getElementById(`seance-detail-${weekNum}-${index}`);
  const chevron = document.getElementById(`seance-chevron-${weekNum}-${index}`);
  const isOpen = detail.style.display !== 'none';
  detail.style.display = isOpen ? 'none' : 'block';
  chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
}

function getCurrentPlanWeek() {
  const PLAN_START = new Date('2026-06-30');
  const monday = d => { const x = new Date(d); const day = x.getDay(); x.setDate(x.getDate() - day + (day===0?-6:1)); x.setHours(0,0,0,0); return x; };
  return Math.round((monday(new Date()) - monday(PLAN_START)) / (7*24*3600*1000)) + 1;
}

// ── Switcher d'écran ──────────────────────────────────────────────────────────
function showScreen(name) {
  $('screen-login').classList.toggle('hidden', name !== 'login');
  $('screen-dashboard').classList.toggle('hidden', name !== 'dashboard');
}
