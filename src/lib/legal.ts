import type { Language } from "./language";

/**
 * The legal pages every irmahs.dev app links to from its footer: the legal
 * notice, the privacy policy, the terms of use and the cookie policy, in
 * English and French. Every app's data is described here, so a change to
 * what an app keeps, sends or stores in the browser changes this file too.
 *
 * A paragraph is a string; `[text](url)` in it is a link. A list is an
 * array of such strings.
 */
export type Block = string | readonly string[];

export interface Section {
  title: string;
  blocks: readonly Block[];
}

export interface LegalPage {
  title: string;
  /** One line under the title */
  lead: string;
  sections: readonly Section[];
}

export const LEGAL_SLUGS = ["legal", "privacy", "terms", "cookies"] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

/** When these pages last changed, as shown on every one of them */
export const UPDATED = "2026-11-18";

export const CONTACT = "privacy@irmahs.dev";

const MAIL = `[${CONTACT}](mailto:${CONTACT})`;

/** The pages' names, for links and the footers */
export const LEGAL_NAMES: Record<Language, Record<LegalSlug, string>> = {
  en: {
    cookies: "Cookies",
    legal: "Legal notice",
    privacy: "Privacy",
    terms: "Terms of use",
  },
  fr: {
    cookies: "Cookies",
    legal: "Mentions légales",
    privacy: "Confidentialité",
    terms: "Conditions d’utilisation",
  },
};

const en: Record<LegalSlug, LegalPage> = {
  cookies: {
    lead: "What irmahs.dev and its apps keep in your browser, and why none of it needs a consent banner.",
    sections: [
      {
        blocks: [
          "No advertising cookies, no tracking cookies and no audience-measurement cookies are used on irmahs.dev or any of its apps, and nothing is set before you do something that needs it. Everything below is strictly necessary for something you asked for: staying signed in, keeping your language or theme, or keeping what you made. Under the CNIL’s guidelines on cookies and other trackers (deliberation n° 2020-091 of 17 September 2020), these are exempt from consent, which is why there is no consent banner.",
        ],
        title: "In short",
      },
      {
        blocks: [
          [
            "lang, on irmahs.dev and every subdomain: the language you picked (en or fr), so every app opens in it. Set only when you press EN or FR. Kept 1 year.",
            "__Secure-irmahs.session_token, from auth.irmahs.dev: keeps you signed in. Set only when you sign in with Google, deleted when you sign out. Kept 7 days, renewed while you use the apps.",
            "__Secure-irmahs.state, from auth.irmahs.dev: protects the round trip to Google while you sign in. Kept 5 minutes at most.",
          ],
        ],
        title: "Cookies",
      },
      {
        blocks: [
          "Some apps keep things in your browser’s own storage (localStorage). It never leaves your device and is never sent to the server:",
          [
            "Every app: your theme (light or dark) and your language.",
            "irmahs.dev: the city on the clock, the calendar or music switch, and whether Tokkae’s playmate is out.",
            "Realms, Book of Shadows: your profile and your soulmate’s, birth date, time and place included, and your card of the day.",
            "Mini Games: your quiz results, your Arena cast, your Wheel of Fortune and Super Tic-Tac-Toe settings, your Ouk Chaktrang settings and the games you play against its bot or on one screen, and where the sticky notes sit on your screen.",
            "Tools: your Character Maker characters. Album Cover Maker keeps nothing: your photo stays in the page.",
            "Alma Housila: the page you were reading.",
          ],
          "To erase it, clear this site’s data in your browser’s settings.",
        ],
        title: "Browser storage",
      },
      {
        blocks: [
          "The “online now” count on irmahs.dev uses no cookie and stores nothing on your device: see the [privacy policy](/privacy).",
        ],
        title: "What is not a cookie",
      },
    ],
    title: "Cookie policy",
  },
  legal: {
    lead: "Who publishes irmahs.dev and who hosts it.",
    sections: [
      {
        blocks: [
          "irmahs.dev and its subdomains (pantry-spinner, realms, minigames, tools, irma-in-paris, alma-housila and auth) are published by Irma HS, a private individual, on a non-professional basis. Nothing is sold on these sites.",
          "As a non-professional publisher, Irma HS uses the right given by article 1-1 of French law n° 2004-575 of 21 June 2004 (LCEN) to publish only the host’s details below; her identity has been given to the host.",
          `Director of publication: Irma HS. Contact: ${MAIL}.`,
        ],
        title: "Publisher",
      },
      {
        blocks: [
          "Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Germany. Telephone: +49 (0)9831 505-0. [hetzner.com](https://www.hetzner.com)",
          "Requests reach the server through Cloudflare, Inc. (USA), which serves the sites over HTTPS and protects them from attacks. [cloudflare.com](https://www.cloudflare.com)",
        ],
        title: "Host",
      },
      {
        blocks: [
          "The sites’ code, text, drawings and designs are Irma HS’s, unless they say otherwise. Character Maker uses the System Reference Document 5.2.1 under the Creative Commons Attribution 4.0 licence, as its pages say. The maps of Irma in Paris use © OpenStreetMap contributors and Protomaps.",
        ],
        title: "Intellectual property",
      },
      {
        blocks: [
          "How your data is used: the [privacy policy](/privacy). What is kept in your browser: the [cookie policy](/cookies). The rules for using the sites: the [terms of use](/terms).",
        ],
        title: "See also",
      },
    ],
    title: "Legal notice",
  },
  privacy: {
    lead: "What each app collects, why, for how long, and how to have it deleted. Only what an app needs to work is collected.",
    sections: [
      {
        blocks: [
          `The data controller is Irma HS, a private individual who publishes these sites on a non-professional basis. For any question or request about your data: ${MAIL}.`,
          "No data is sold, rented or used for advertising, and nobody is profiled. There are no ads, no analytics scripts and no tracking cookies on any of the sites.",
        ],
        title: "Who is responsible",
      },
      {
        blocks: [
          "Your browser sends your IP address and a description of itself (user agent) with every request. They pass through Cloudflare, which protects the sites, and the server, which answers. The server keeps no access logs. Cloudflare counts visits per day and per country, and only those totals are shown, to the site’s admin, on irmahs.dev.",
          "Why: to deliver the pages and keep them safe. Legal basis: legitimate interest (GDPR article 6(1)(f)).",
        ],
        title: "Visiting any of the sites",
      },
      {
        blocks: [
          "While irmahs.dev is open and visible, it tells the server you are there, to show how many people are on the page. Your IP address and user agent are scrambled (hashed) with a key that changes every day, kept in memory for at most 75 seconds after your last visit, and never written down. They cannot be traced back to you or followed from one day to the next.",
          "Legal basis: legitimate interest.",
        ],
        title: "The “online now” count on irmahs.dev",
      },
      {
        blocks: [
          "What you type in the chat bot on irmahs.dev is sent, with the rest of the conversation, to OpenRouter, Inc. (USA), which passes it to an AI model to write the answer. irmahs.dev does not store the conversation: it stays in your browser tab and is gone when you close it. Your IP address is held in memory for one minute, to limit how many questions can be asked. Please don’t type personal information in the chat.",
          "Legal basis: legitimate interest, to answer the question you ask. [OpenRouter’s privacy policy](https://openrouter.ai/privacy).",
        ],
        title: "The chat bot on irmahs.dev",
      },
      {
        blocks: [
          "Signing in is optional, and only needed to save things on the server. It goes through Google, and the account service (auth.irmahs.dev) keeps your name, your email address, the link to your Google profile picture and your Google account ID, plus one record for each browser you are signed in on. It does not keep your IP address, your user agent or any Google access token. Your picture is loaded from Google when an app shows it.",
          "Why: to give you one sign-in for every app. Legal basis: performance of the service you ask for (GDPR article 6(1)(b)). Kept: until you delete your account, or 2 years after you last used it. A signed-in browser stays signed in for 7 days after your last visit.",
          "You can delete your account at any time from [your account page](https://auth.irmahs.dev/sign-in).",
        ],
        title: "Your account",
      },
      {
        blocks: [
          "When you are signed in, each app keeps only what you save in it, against your account ID, in its own database:",
          [
            "What’s in my pantry?: your ingredients, pantry, shopping list and the meals you cooked.",
            "Mini Games: your online Super Tic-Tac-Toe and Ouk Chaktrang games and your place on their leaderboards, shown with your first name and initial; the sticky notes you post (others never see who posted them, and they come down after a day) and the notes you vote for; and your witch-quiz result, when you choose to keep it on your account.",
            "Realms: the potions you brew in Potion Brewing (in the shared grimoire, the first and last person to brew a potion are shown by first name and initial, such as “Irma H.”), your own grimoire, and your Court of Draconia draconoid, whose name others see.",
            "Irma in Paris: nothing about visitors; only its admins add places and photos.",
            "Alma Housila: private, open only to the two people it is for.",
          ],
          "Legal basis: performance of the service you ask for. Kept: until you delete it in the app, or ask for it to be deleted.",
        ],
        title: "What you save in the apps",
      },
      {
        blocks: [
          "Some things are only ever kept in your own browser and never sent to the server: your theme and language, the Book of Shadows (your birth date, time and place included), your Character Maker characters and your quiz answers. The photo you put in Album Cover Maker never leaves the page. The full list is in the [cookie policy](/cookies).",
          "When you search for your birthplace in the Book of Shadows, the letters you type are sent to Open-Meteo (Switzerland) to find the town; nothing else is. The weather on irmahs.dev’s clock is asked of Open-Meteo by your browser too, for the city shown, not for where you are.",
        ],
        title: "What stays in your browser",
      },
      {
        blocks: [
          [
            "Hetzner Online GmbH (Germany): the server and its databases.",
            "Cloudflare, Inc. (USA): carries every request to the server.",
            "Google LLC (USA): sign-in, and your profile picture.",
            "OpenRouter, Inc. (USA): the chat bot on irmahs.dev.",
            "Open-Meteo (Switzerland): the birthplace search in the Book of Shadows, and the weather on irmahs.dev.",
          ],
          "Cloudflare and Google are certified under the EU-U.S. Data Privacy Framework, which the European Commission found gives an adequate level of protection; Switzerland also has an adequacy decision. OpenRouter is in the USA; only what you type in the chat bot is sent to it.",
        ],
        title: "Who receives data",
      },
      {
        blocks: [
          `You have the right to access your data, to correct it, to have it deleted, to restrict or object to its use, and to receive it in a portable format. Write to ${
            MAIL
          } from the email address of your account; you will get an answer within one month.`,
          "If you think your rights have not been respected, you can complain to the CNIL, 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, France, [cnil.fr](https://www.cnil.fr).",
        ],
        title: "Your rights",
      },
      {
        blocks: [
          "The sites can be used without an account. To create one you must be 15 or older, or have the agreement of a parent or guardian, as French law (article 45 of the loi Informatique et Libertés) sets for online services.",
        ],
        title: "Children",
      },
      {
        blocks: [
          "Every site is served over HTTPS only. Google handles the sign-in, so no password is ever stored. Each app has its own database, and none reads another’s.",
          "This policy changes when an app changes what it keeps; the date at the top says when it last did.",
        ],
        title: "Security and changes",
      },
    ],
    title: "Privacy policy",
  },
  terms: {
    lead: "The rules for using irmahs.dev and its apps.",
    sections: [
      {
        blocks: [
          "These terms apply to irmahs.dev and its apps (see the [legal notice](/legal)). Using the sites means accepting them.",
          "Everything is free. Nothing is sold, so there are no payments, subscriptions or refunds.",
        ],
        title: "The sites",
      },
      {
        blocks: [
          "An account is optional and goes through your Google account. Keep that account safe: anyone who can use it can use your irmahs.dev account. You can delete your account at any time, from [your account page](https://auth.irmahs.dev/sign-in).",
        ],
        title: "Your account",
      },
      {
        blocks: [
          "Some things you write can be seen by others: sticky notes on Mini Games, your draconoid’s name, and your first name and initial on the Super Tic-Tac-Toe and Ouk Chaktrang leaderboards and in the Potion Brewing grimoire. Don’t post anything unlawful, hateful, harassing, or anyone’s personal information. Anything that breaks these rules can be removed, and the account that posted it closed.",
          `To report content, write to ${MAIL}.`,
        ],
        title: "What you post",
      },
      {
        blocks: [
          "The Book of Shadows, the tarot, the Magic 8 Ball and the quizzes are for fun. Potion Brewing’s potions are real drinks, but their notes are not medical advice: ask a doctor or pharmacist before trying a remedy, above all if you are pregnant, take medicine or have a condition. Irma in Paris shows weather, transport and air-quality data from public sources, which can be late or wrong.",
        ],
        title: "Entertainment, not advice",
      },
      {
        blocks: [
          "The sites are made with care but come as they are, and may change, go down or be closed at any time. To the extent the law allows, Irma HS is not liable for any loss that comes from using them. Nothing in these terms limits the rights French law gives you as a consumer.",
          "Don’t try to break, overload or get around the protections of the sites.",
        ],
        title: "Availability and liability",
      },
      {
        blocks: [
          `These terms are governed by French law. If there is a disagreement, write first to ${
            MAIL
          }; otherwise the competent French courts decide.`,
        ],
        title: "Law",
      },
    ],
    title: "Terms of use",
  },
};

const fr: Record<LegalSlug, LegalPage> = {
  cookies: {
    lead: "Ce qu’irmahs.dev et ses applications gardent dans votre navigateur, et pourquoi rien de tout cela ne demande de bandeau de consentement.",
    sections: [
      {
        blocks: [
          "Aucun cookie publicitaire, de suivi ou de mesure d’audience n’est utilisé sur irmahs.dev ni sur ses applications, et rien n’est déposé avant que vous fassiez quelque chose qui en a besoin. Tout ce qui suit est strictement nécessaire à ce que vous avez demandé : rester connecté·e, garder votre langue ou votre thème, ou garder ce que vous avez créé. D’après les lignes directrices de la CNIL sur les cookies et autres traceurs (délibération n° 2020-091 du 17 septembre 2020), ces traceurs sont exemptés de consentement : c’est pourquoi il n’y a pas de bandeau.",
        ],
        title: "En bref",
      },
      {
        blocks: [
          [
            "lang, sur irmahs.dev et tous ses sous-domaines : la langue choisie (en ou fr), pour que chaque application s’ouvre dans cette langue. Déposé seulement quand vous appuyez sur EN ou FR. Conservé 1 an.",
            "__Secure-irmahs.session_token, par auth.irmahs.dev : vous garde connecté·e. Déposé seulement quand vous vous connectez avec Google, supprimé à la déconnexion. Conservé 7 jours, renouvelé tant que vous utilisez les applications.",
            "__Secure-irmahs.state, par auth.irmahs.dev : protège l’aller-retour vers Google pendant la connexion. Conservé 5 minutes au plus.",
          ],
        ],
        title: "Cookies",
      },
      {
        blocks: [
          "Certaines applications gardent des choses dans le stockage de votre navigateur (localStorage). Elles ne quittent jamais votre appareil et ne sont jamais envoyées au serveur :",
          [
            "Toutes les applications : votre thème (clair ou sombre) et votre langue.",
            "irmahs.dev : la ville de l’horloge, le choix entre calendrier et musique, et si le compagnon de Tokkae est sorti.",
            "Realms, Livre des ombres : votre profil et celui de votre âme sœur, date, heure et lieu de naissance compris, et votre carte du jour.",
            "Mini Games : vos résultats aux quiz, les participants de l’Arène, vos réglages de la Roue de la fortune et de Super Tic-Tac-Toe, vos réglages d’Ouk Chaktrang et les parties jouées contre son bot ou sur un même écran, et la place des post-it sur votre écran.",
            "Tools : vos personnages de Character Maker. Album Cover Maker ne garde rien : votre photo reste dans la page.",
            "Alma Housila : la page que vous lisiez.",
          ],
          "Pour l’effacer, supprimez les données de ce site dans les réglages de votre navigateur.",
        ],
        title: "Stockage du navigateur",
      },
      {
        blocks: [
          "Le compteur « en ligne » d’irmahs.dev n’utilise aucun cookie et ne stocke rien sur votre appareil : voir la [politique de confidentialité](/privacy).",
        ],
        title: "Ce qui n’est pas un cookie",
      },
    ],
    title: "Politique de cookies",
  },
  legal: {
    lead: "Qui édite irmahs.dev et qui l’héberge.",
    sections: [
      {
        blocks: [
          "irmahs.dev et ses sous-domaines (pantry-spinner, realms, minigames, tools, irma-in-paris, alma-housila et auth) sont édités par Irma HS, personne physique, à titre non professionnel. Rien n’est vendu sur ces sites.",
          "En tant qu’éditrice non professionnelle, Irma HS use du droit prévu à l’article 1-1 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique (LCEN) de ne publier que les coordonnées de l’hébergeur ci-dessous ; son identité a été communiquée à l’hébergeur.",
          `Directrice de la publication : Irma HS. Contact : ${MAIL}.`,
        ],
        title: "Éditrice",
      },
      {
        blocks: [
          "Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Allemagne. Téléphone : +49 (0)9831 505-0. [hetzner.com](https://www.hetzner.com)",
          "Les requêtes arrivent au serveur par Cloudflare, Inc. (États-Unis), qui sert les sites en HTTPS et les protège des attaques. [cloudflare.com](https://www.cloudflare.com)",
        ],
        title: "Hébergeur",
      },
      {
        blocks: [
          "Le code, les textes, les dessins et le design des sites appartiennent à Irma HS, sauf mention contraire. Character Maker utilise le System Reference Document 5.2.1 sous licence Creative Commons Attribution 4.0, comme ses pages l’indiquent. Les cartes d’Irma in Paris utilisent © les contributeurs d’OpenStreetMap et Protomaps.",
        ],
        title: "Propriété intellectuelle",
      },
      {
        blocks: [
          "L’usage de vos données : la [politique de confidentialité](/privacy). Ce qui est gardé dans votre navigateur : la [politique de cookies](/cookies). Les règles d’utilisation : les [conditions d’utilisation](/terms).",
        ],
        title: "Voir aussi",
      },
    ],
    title: "Mentions légales",
  },
  privacy: {
    lead: "Ce que chaque application collecte, pourquoi, combien de temps, et comment le faire supprimer. Seul ce dont une application a besoin pour fonctionner est collecté.",
    sections: [
      {
        blocks: [
          `La responsable du traitement est Irma HS, personne physique qui édite ces sites à titre non professionnel. Pour toute question ou demande sur vos données : ${MAIL}.`,
          "Aucune donnée n’est vendue, louée ni utilisée pour de la publicité, et personne n’est profilé. Il n’y a ni publicité, ni outil de statistiques, ni cookie de suivi sur aucun des sites.",
        ],
        title: "Qui est responsable",
      },
      {
        blocks: [
          "Votre navigateur envoie votre adresse IP et une description de lui-même (user agent) à chaque requête. Elles passent par Cloudflare, qui protège les sites, puis par le serveur, qui répond. Le serveur ne garde aucun journal d’accès. Cloudflare compte les visites par jour et par pays, et seuls ces totaux sont montrés, à l’administratrice du site, sur irmahs.dev.",
          "Pourquoi : afficher les pages et les protéger. Base légale : l’intérêt légitime (article 6(1)(f) du RGPD).",
        ],
        title: "Quand vous visitez un des sites",
      },
      {
        blocks: [
          "Tant qu’irmahs.dev est ouvert et visible, la page signale votre présence au serveur, pour afficher combien de personnes sont là. Votre adresse IP et votre user agent sont brouillés (hachés) avec une clé qui change chaque jour, gardés en mémoire 75 secondes au plus après votre dernier passage, et jamais enregistrés. Ils ne permettent ni de vous retrouver, ni de vous suivre d’un jour à l’autre.",
          "Base légale : l’intérêt légitime.",
        ],
        title: "Le compteur « en ligne » d’irmahs.dev",
      },
      {
        blocks: [
          "Ce que vous écrivez au chatbot d’irmahs.dev est envoyé, avec le reste de la conversation, à OpenRouter, Inc. (États-Unis), qui le transmet à un modèle d’IA pour rédiger la réponse. irmahs.dev ne garde pas la conversation : elle reste dans l’onglet de votre navigateur et disparaît quand vous le fermez. Votre adresse IP est gardée en mémoire une minute, pour limiter le nombre de questions. Merci de ne pas écrire d’informations personnelles dans le chat.",
          "Base légale : l’intérêt légitime, pour répondre à la question que vous posez. [Politique de confidentialité d’OpenRouter](https://openrouter.ai/privacy).",
        ],
        title: "Le chatbot d’irmahs.dev",
      },
      {
        blocks: [
          "La connexion est facultative : elle ne sert qu’à enregistrer des choses sur le serveur. Elle passe par Google, et le service de compte (auth.irmahs.dev) garde votre nom, votre adresse e-mail, le lien vers votre photo de profil Google et l’identifiant de votre compte Google, ainsi qu’une ligne par navigateur connecté. Il ne garde ni votre adresse IP, ni votre user agent, ni aucun jeton d’accès Google. Votre photo est chargée depuis Google quand une application l’affiche.",
          "Pourquoi : vous donner une seule connexion pour toutes les applications. Base légale : l’exécution du service que vous demandez (article 6(1)(b) du RGPD). Conservation : jusqu’à la suppression de votre compte, ou 2 ans après votre dernière utilisation. Un navigateur reste connecté 7 jours après votre dernière visite.",
          "Vous pouvez supprimer votre compte à tout moment depuis [votre page de compte](https://auth.irmahs.dev/sign-in).",
        ],
        title: "Votre compte",
      },
      {
        blocks: [
          "Quand vous êtes connecté·e, chaque application ne garde que ce que vous y enregistrez, avec l’identifiant de votre compte, dans sa propre base de données :",
          [
            "What’s in my pantry? : vos ingrédients, votre garde-manger, votre liste de courses et les repas cuisinés.",
            "Mini Games : vos parties de Super Tic-Tac-Toe et d’Ouk Chaktrang en ligne et votre place à leurs classements, affichée avec votre prénom et une initiale ; les post-it que vous publiez (les autres ne voient jamais qui les a publiés, et ils disparaissent au bout d’un jour) et ceux pour lesquels vous votez ; et votre résultat au quiz de sorcière, quand vous choisissez de le garder sur votre compte.",
            "Realms : les potions que vous préparez dans Préparation de potions (dans le grimoire partagé, la première et la dernière personne à préparer une potion sont affichées par leur prénom et une initiale, comme « Irma H. »), votre propre grimoire, et votre draconoïde de la Cour de Draconia, dont le nom est visible par les autres.",
            "Irma in Paris : rien sur les visiteurs ; seules ses administratrices ajoutent des lieux et des photos.",
            "Alma Housila : privée, ouverte seulement aux deux personnes à qui elle est destinée.",
          ],
          "Base légale : l’exécution du service que vous demandez. Conservation : jusqu’à ce que vous le supprimiez dans l’application, ou que vous demandiez sa suppression.",
        ],
        title: "Ce que vous enregistrez dans les applications",
      },
      {
        blocks: [
          "Certaines choses ne sont gardées que dans votre propre navigateur et ne sont jamais envoyées au serveur : votre thème et votre langue, le Livre des ombres (date, heure et lieu de naissance compris), vos personnages de Character Maker et vos réponses aux quiz. La photo mise dans Album Cover Maker ne quitte jamais la page. La liste complète est dans la [politique de cookies](/cookies).",
          "Quand vous cherchez votre lieu de naissance dans le Livre des ombres, les lettres tapées sont envoyées à Open-Meteo (Suisse) pour trouver la ville ; rien d’autre. La météo de l’horloge d’irmahs.dev est aussi demandée à Open-Meteo par votre navigateur, pour la ville affichée, pas pour l’endroit où vous êtes.",
        ],
        title: "Ce qui reste dans votre navigateur",
      },
      {
        blocks: [
          [
            "Hetzner Online GmbH (Allemagne) : le serveur et ses bases de données.",
            "Cloudflare, Inc. (États-Unis) : achemine chaque requête jusqu’au serveur.",
            "Google LLC (États-Unis) : la connexion, et votre photo de profil.",
            "OpenRouter, Inc. (États-Unis) : le chatbot d’irmahs.dev.",
            "Open-Meteo (Suisse) : la recherche du lieu de naissance du Livre des ombres, et la météo d’irmahs.dev.",
          ],
          "Cloudflare et Google sont certifiés au Data Privacy Framework UE-États-Unis, dont la Commission européenne a reconnu qu’il offre un niveau de protection adéquat ; la Suisse bénéficie aussi d’une décision d’adéquation. OpenRouter est aux États-Unis ; seul ce que vous écrivez au chatbot lui est envoyé.",
        ],
        title: "Qui reçoit des données",
      },
      {
        blocks: [
          `Vous avez le droit d’accéder à vos données, de les rectifier, de les faire supprimer, d’en limiter l’usage ou de vous y opposer, et de les recevoir dans un format portable. Écrivez à ${
            MAIL
          } depuis l’adresse e-mail de votre compte ; vous aurez une réponse sous un mois.`,
          "Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL, 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, [cnil.fr](https://www.cnil.fr).",
        ],
        title: "Vos droits",
      },
      {
        blocks: [
          "Les sites s’utilisent sans compte. Pour en créer un, il faut avoir 15 ans ou plus, ou l’accord d’un parent ou d’un tuteur, comme le prévoit la loi française (article 45 de la loi Informatique et Libertés) pour les services en ligne.",
        ],
        title: "Mineurs",
      },
      {
        blocks: [
          "Chaque site n’est servi qu’en HTTPS. Google gère la connexion : aucun mot de passe n’est jamais stocké. Chaque application a sa propre base de données, et aucune ne lit celle d’une autre.",
          "Cette politique change quand une application change ce qu’elle garde ; la date en haut indique sa dernière mise à jour.",
        ],
        title: "Sécurité et modifications",
      },
    ],
    title: "Politique de confidentialité",
  },
  terms: {
    lead: "Les règles d’utilisation d’irmahs.dev et de ses applications.",
    sections: [
      {
        blocks: [
          "Ces conditions s’appliquent à irmahs.dev et à ses applications (voir les [mentions légales](/legal)). Utiliser les sites, c’est les accepter.",
          "Tout est gratuit. Rien n’est vendu : il n’y a ni paiement, ni abonnement, ni remboursement.",
        ],
        title: "Les sites",
      },
      {
        blocks: [
          "Le compte est facultatif et passe par votre compte Google. Protégez-le : quiconque peut l’utiliser peut utiliser votre compte irmahs.dev. Vous pouvez supprimer votre compte à tout moment, depuis [votre page de compte](https://auth.irmahs.dev/sign-in).",
        ],
        title: "Votre compte",
      },
      {
        blocks: [
          "Certaines choses que vous écrivez sont visibles par d’autres : les post-it de Mini Games, le nom de votre draconoïde, et votre prénom et initiale aux classements de Super Tic-Tac-Toe et d’Ouk Chaktrang et dans le grimoire de Préparation de potions. Ne publiez rien d’illégal, de haineux ou de harcelant, ni les données personnelles de quiconque. Tout ce qui enfreint ces règles peut être retiré, et le compte qui l’a publié fermé.",
          `Pour signaler un contenu, écrivez à ${MAIL}.`,
        ],
        title: "Ce que vous publiez",
      },
      {
        blocks: [
          "Le Livre des ombres, le tarot, la Magic 8 Ball et les quiz sont des divertissements. Les potions de Préparation de potions sont de vraies boissons, mais leurs notes ne sont pas des conseils médicaux : demandez à un médecin ou à un pharmacien avant d’essayer un remède, surtout si vous êtes enceinte, prenez un traitement ou avez une maladie. Irma in Paris affiche des données de météo, de transports et de qualité de l’air issues de sources publiques, qui peuvent être en retard ou fausses.",
        ],
        title: "Pour s’amuser, pas pour conseiller",
      },
      {
        blocks: [
          "Les sites sont faits avec soin mais fournis en l’état, et peuvent changer, être indisponibles ou fermer à tout moment. Dans la mesure permise par la loi, Irma HS n’est pas responsable des pertes qui viendraient de leur utilisation. Rien dans ces conditions ne limite les droits que la loi française vous donne en tant que consommateur.",
          "N’essayez pas de casser, de surcharger ou de contourner les protections des sites.",
        ],
        title: "Disponibilité et responsabilité",
      },
      {
        blocks: [
          `Ces conditions sont régies par le droit français. En cas de désaccord, écrivez d’abord à ${
            MAIL
          } ; à défaut, les tribunaux français compétents trancheront.`,
        ],
        title: "Droit applicable",
      },
    ],
    title: "Conditions d’utilisation",
  },
};

export const LEGAL: Record<Language, Record<LegalSlug, LegalPage>> = { en, fr };
