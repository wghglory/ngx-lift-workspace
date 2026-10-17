export const frTranslations: Record<string, string> = {
  'docsLearn.resourceTitle': 'Charger des données quand un signal change',
  'docsLearn.basics': 'Bases',
  'docsLearn.recipes': 'Exemples pratiques',
  'docsLearn.localState': 'État local',
  'docsLearn.nested': 'Ressources imbriquées',
  'docsLearn.reference': 'Référence',
  'docsLearn.gridTitle': 'Essayer une grille alimentée par le serveur',
  'docsLearn.gridIntro':
    'dgState prépare les événements Clarity Datagrid pour les requêtes serveur, retarde les changements de filtre et peut ignorer les états identiques.',
  'docsLearn.gridTry':
    'Changez les filtres ou la page, puis actualisez. La prévisualisation appelle randomuser.me ; le total est simulé.',
  'docsLearn.gridModel':
    'La grille émet un état ; dgState retarde les changements de filtre de 500 ms. switchMap remplace la requête précédente. Actualiser utilise un déclencheur distinct.',
  'docsLearn.resourceModel':
    'Les signaux lus dans la fonction source deviennent des dépendances. Avec le comportement switch par défaut, un changement annule l’abonnement précédent et lance une nouvelle lecture. Chaque ressource possède sa propre valeur.',
  'docsLearn.computedTitle': 'Votre première valeur dérivée asynchrone',
  'docsLearn.computedModel':
    'Cliquez pour changer l’entrée. Après 300 ms, la valeur devient entrée × 10. computedAsync renvoie un signal de valeur, sans signaux de chargement ou d’erreur de ressource. Le minuteur simule un travail asynchrone.',
  'docsLearn.nextValue': 'Valeur suivante',

  'queryDocs.cache': 'Fraîcheur du cache et actualisation',
  'queryDocs.cacheIntro':
    'Une clé identifie des données partagées dans un QueryClient. Fraîcheur, activité des requêtes et durée de vie des observateurs répondent à des questions différentes.',
  'queryDocs.chooseComputed':
    'Utilisez cette API pour une valeur dérivée asynchrone lorsqu’un signal de valeur suffit. Préférez computed() pour une dérivation synchrone.',
  'queryDocs.chooseMutation':
    'Utilisez cette API pour les écritures serveur explicitement soumises. Aucune clé de requête n’est nécessaire ; ajoutez des tags d’invalidation pour actualiser d’autres vues.',
  'queryDocs.chooseObservable':
    'Utilisez fetchQueryObservable pour une lecture finie en cache dans un flux RxJS ; observeQueryObservable émet des instantanés du cache partagé et possède un observateur.',
  'queryDocs.chooseQuery':
    'Utilisez un observateur pour une lecture partagée en cache. Une réponse contenant un tableau reste une seule requête.',
  'queryDocs.chooseResource':
    'Utilisez cette API pour un état asynchrone indépendant, des modifications locales ou un flux continu sans cache partagé par clé.',
  'queryDocs.choosing': 'Choisir une API asynchrone',
  'queryDocs.choosingIntro':
    'Choisissez selon l’opération et le propriétaire de l’état. Un bouton Actualiser effectue toujours une lecture ; un clic ne transforme pas une opération en mutation.',
  'queryDocs.clientReference':
    'QueryClient possède les entrées partagées. fetchQuery lit les données ; invalidateTags rend les dépendances périmées et recharge les actives ; removeQueries supprime les entrées correspondantes. Consultez les contrats publics pour les paramètres et adaptateurs.',
  'queryDocs.defaults':
    'Valeurs par défaut : staleTime = 0 ; gcTime = 300,000 ms. Interrogation périodique, nouvelles tentatives, délais et actualisation au retour du focus ou à la reconnexion sont désactivés sans configuration.',
  'queryDocs.devtools': 'Outils de requêtes',
  'queryDocs.excerpt':
    'Extrait de champs de composant. Importez le service et les définitions ci-dessus ; la démonstration de mutation fournit le parcours complet avec tableau et résumé.',
  'queryDocs.fetching': 'Charger des données · queryResource',
  'queryDocs.freshness':
    'staleTime mesure la fraîcheur depuis la dernière réponse réussie. À son expiration, les données deviennent périmées ; l’expiration seule ne lance aucune requête.',
  'queryDocs.independent': 'Lectures indépendantes · queryResources',
  'queryDocs.independentClocks':
    'Les deux horloges sont indépendantes : des données inutilisées peuvent rester fraîches et des données actives être périmées. Les observateurs de retour peuvent réutiliser les données conservées.',
  'queryDocs.invalidation':
    'Les écritures réussies invalident les tags sélectionnés. Les requêtes actives se rechargent ; les entrées inactives deviennent périmées. L’invalidation ne supprime pas les données.',
  'queryDocs.keyIdentity':
    'Incluez chaque paramètre modifiant la réponse et le périmètre d’autorisation dans la clé. Capturez les valeurs réactives une fois et réutilisez-les dans la clé et le loader.',
  'queryDocs.keys': 'Clés et invalidation',
  'queryDocs.keysIntro':
    'Les clés identifient les données. Les tags décrivent les lectures en cache concernées par une écriture réussie. Leurs rôles diffèrent.',
  'queryDocs.organization': 'Organiser les requêtes',
  'queryDocs.organizationIntro':
    'Extrayez les définitions lorsque plusieurs consommateurs utilisent les mêmes données. Placez le transport dans team.service.ts, l’identité et les tags dans team.queries.ts et les observateurs auprès des consommateurs.',
  'queryDocs.overview': 'Vue d’ensemble',
  'queryDocs.overviewIntro':
    'L’état serveur correspond aux données appartenant à un serveur. Ces outils les chargent, partagent les lectures entre composants et synchronisent les vues en cache après les écritures.',
  'queryDocs.overviewRead':
    'Chargez une équipe, affichez ses données, changez l’ID sélectionné et récupérez après une erreur.',
  'queryDocs.overviewWrite':
    'Enregistrez un nom d’équipe, observez l’attente et les erreurs, puis actualisez les vues en cache concernées.',
  'queryDocs.prerequisites':
    'Partez des composants et des signals Angular. Comprenez une requête avant de choisir une politique de cache ou d’organiser une fonctionnalité.',
  'queryDocs.reference': 'Référence de l’API',
  'queryDocs.referenceIntro':
    'Consultez les signatures et les tableaux précis des états et options. Suivez les guides pour une explication ou une tâche pratique.',
  'queryDocs.refreshControls':
    'reload() lance une actualisation en arrière-plan et renvoie un booléen. execute() renvoie une Promise pour une lecture fraîche. Les deux ignorent les données déjà chargées et rejoignent le travail en cours valide.',
  'queryDocs.retention':
    'gcTime contrôle la rétention après le départ du dernier observateur. La suppression attend la fin des requêtes en cours. Les observateurs actifs conservent leurs données.',
  'queryDocs.saving': 'Enregistrer des changements · mutateResource',
  'queryDocs.tagIdentity':
    'Un tag est un objet avec type et éventuellement scope/id. La mutation sélectionne les tags correspondants ; omettre scope ne vise pas tous les périmètres.',
  'queryDocs.triggers':
    'Les données périmées peuvent être actualisées lorsqu’elles sont observées à nouveau. L’actualisation manuelle et l’invalidation demandent des données fraîches ; interrogation périodique, retour du focus et reconnexion nécessitent une configuration.',
  'queryDocs.writeBoundary':
    'Une écriture réussie peut être suivie d’un échec de synchronisation du cache. Examinez invalidationError et actualisez les lectures ; ne répétez pas l’écriture réussie pour réparer le cache.',
  'queryLearn.collectionExplain':
    'Sélectionnez les deux ID, inversez leur ordre, puis videz la sélection. Les clés conservées gardent leurs observateurs ; les éléments retirés les libèrent. Chaque ligne possède ses états de chargement, d’erreur et d’actualisation.',
  'queryLearn.collectionIntro':
    'Utilisez queryResource lorsqu’une requête renvoie une liste. Utilisez queryResources lorsqu’une collection changeante nécessite une requête distincte pour chaque élément.',
  'queryLearn.fixture':
    'Cet exemple complet utilise un minuteur local pour simuler latence et échecs. Ouvrez TypeScript pour copier le composant ; HTML présente le même modèle compilé.',
  'queryLearn.httpSetup':
    'Pour HTTP, fournissez HttpClient dans app.config.ts et remplacez le loader simulé par http.get<Team>(url), avec un ID capturé. Le client racine ne nécessite aucun enregistrement supplémentaire.',
  'queryLearn.readError': 'La lecture a échoué. Désactivez l’échec simulé et actualisez pour réessayer.',
  'queryLearn.readExplain':
    'key nomme les données ; loader les récupère. Les signals lus dans la définition sélectionnent les données. value() expose le résultat ; isInitialLoading() indique un chargement sans données.',
  'queryLearn.readExplainTitle': 'Comprendre la première lecture',
  'queryLearn.readIntro':
    'queryResource charge des données et expose résultat, chargement et erreurs sous forme de signals Angular. Les composants utilisant la même clé partagent données en cache et requête en cours.',
  'queryLearn.readSteps':
    'Chargez Équipe A, choisissez Équipe B, puis actualisez. Activez l’échec et actualisez encore : l’équipe reste visible. Désactivez l’échec et actualisez pour récupérer.',
  'queryLearn.readTitle': 'Votre première requête',
  'queryLearn.refreshExplain':
    'isRefreshing() indique une lecture en cours avec les données précédentes visibles. error() expose l’échec ; isRefreshError() distingue un échec avec données conservées.',
  'queryLearn.saved': 'Enregistré',
  'queryLearn.simulateFailure': 'Simuler un échec',
  'queryLearn.teamA': 'Équipe A',
  'queryLearn.teamB': 'Équipe B',
  'queryLearn.writeError':
    'L’enregistrement a échoué. Votre saisie est conservée ; désactivez l’échec simulé et enregistrez à nouveau.',
  'queryLearn.writeExplain':
    'mutate(args) soumet la valeur et renvoie une Promise. isLoading() contrôle l’attente ; error() signale un échec. Commencez sans tags ; ajoutez-les lorsqu’une écriture doit actualiser les lectures en cache.',
  'queryLearn.writeExplainTitle': 'Comprendre le premier enregistrement',
  'queryLearn.writeIntro':
    'mutateResource exécute une écriture serveur lorsque vous appelez mutate(). Il expose des signals d’attente, de résultat et d’erreur pour que le formulaire reflète le résultat.',
  'queryLearn.writeSteps':
    'Saisissez un nom et enregistrez. Activez l’échec et recommencez, puis désactivez-le et réessayez. Le formulaire bloque l’envoi pendant une écriture.',
  'queryLearn.writeTitle': 'Votre premier enregistrement',
  'toSignalForm.savedProfile': 'Profil enregistré',
  'queryResource.projectRevision': 'Version de réponse',
  'queryResource.activeUser': 'Utilisateur actuel',
  'queryResource.engineLabel': 'Moteur',
  'queryResource.computeLabel': 'Ressources',
  'queryOwnership.title': 'Clés et étiquettes par domaine',
  'queryOwnership.definitions':
    'Gardez les observateurs dans les composants. Importez les définitions complètes et les fabriques du domaine responsable ; les clés incluent la portée et tous les paramètres modifiant la réponse.',
  'queryOwnership.refactoring':
    'Utilisez des exports partagés plutôt que des chaînes répétées. Avant de modifier ou supprimer une définition, recherchez toutes les références, consultez le domaine responsable et vérifiez les lectures et écritures concernées.',
  'queryOwnership.noCache':
    'Les clés identifient aussi les requêtes et états partagés. staleTime: 0 rend les données périmées ; gcTime: 0 supprime les entrées inutilisées après les requêtes. Utilisez resourceAsync pour un état indépendant sans clé. Les mutations ne nécessitent pas de clé.',
  'queryOwnership.naming':
    'invalidateTags accepte un tableau ou une fonction (result, args) appelée uniquement après succès. Renvoyez [] pour ignorer l’invalidation.',
  'queryOwnership.journey':
    'Ajoutez des membres : tableau et résumé partagent une requête par actualisation. Fermez le résumé, ajoutez un membre puis rouvrez-le. Les données et le nombre de requêtes de l’équipe B restent inchangés.',
  'queryOwnership.closeSummary': 'Fermer le résumé',
  'queryOwnership.openSummary': 'Ouvrir le résumé',
  'queryOwnership.summary': 'Résumé de l’équipe A',
  'queryOwnership.teamAReads': 'Requêtes de l’équipe A',
  'queryOwnership.otherScope': 'Membres de l’équipe B (autre portée)',
  'queryOwnership.teamBReads': 'Requêtes de l’équipe B',
  'header.selectLanguage': 'Sélectionner la langue',
  'header.openGitHub': 'Ouvrir sur GitHub',
  'header.codeLicensed': 'Code sous licence',
  'nav.signalUtils': 'Utilitaires Signal',
  'nav.queryMutation': 'Requêtes et état serveur',
  'nav.operators': 'Opérateurs',
  'nav.interceptors': 'Intercepteurs',
  'nav.validators': 'Validateurs',
  'nav.pipes': 'Pipes',
  'nav.utilities': 'Utilitaires',
  'nav.components': 'Composants',
  'nav.pageContainer': 'Conteneur de page',
  'nav.timelineWizard': 'Assistant chronologique',
  'nav.alert': 'Alerte',
  'nav.multiAlerts': 'Alertes (Multiples)',
  'nav.callout': 'Mise en valeur',
  'nav.spinner': 'Indicateur de chargement',
  'nav.toast': 'Notification toast',
  'nav.tooltip': 'Infobulle',
  'nav.themeToggle': 'Changer de thème',
  'nav.fileReader': 'Lecteur de fichier',
  'nav.keyValueInputs': 'Entrées clé-valeur',
  'nav.statusIndicator': 'Indicateur d’état',
  'nav.idleDetection': 'Détection d’inactivité',
  'nav.certificate': 'Visionneuse de certificat',
  'nav.datagrid': 'Grille de données',
  'nav.byteConverter': 'Convertisseur d’octets',
  'nav.mask': 'Masquage',
  'nav.arrayJoin': 'Jointure de tableau',
  'nav.range': 'Plage numérique',
  'nav.isHttps': 'Est Https',
  'nav.differenceInDays': 'differenceInDays',
  'nav.badgeNew': 'NEW',
  'nav.badgeUpdated': 'UPDATED',
  'nav.badgePopular': 'POPULAR',
  'nav.badgeCore': 'CORE',
  'home.ngxLift.title': 'ngx-lift',
  'home.ngxLift.subtitle': 'Améliorez votre flux de travail de développement <code>modern</code> Angular',
  'home.ngxLift.supportMatrix': 'Matrice de support de la version',
  'home.ngxLift.thVersion': 'Version ngx-lift',
  'home.ngxLift.thNgVersion': 'Version Angular',
  'home.ngxLift.utilityTitle': "Fonctions d'utilité",
  'home.ngxLift.utilityDesc':
    "Fonctions d'utilité complètes conçues pour accélérer les tâches communes de développement",
  'home.ngxLift.rxjsTitle': 'Opérateurs RxJS',
  'home.ngxLift.rxjsDesc':
    'Opérateurs spécialisés qui simplifient les opérations réactives complexes et améliorent la maintenance du code',
  'home.ngxLift.signalTitle': 'Utilitaires Signal',
  'home.ngxLift.signalDesc': 'Utilitaires puissants basés sur le signal qui complètent Angular Signals API',
  'home.clrLift.title': 'clr-lift',
  'home.clrLift.subtitle':
    'Extension du système de conception Clarity avec composants, utilitaires et opérateurs réutilisables',
  'home.clrLift.supportMatrix': 'Matrice de support de la version',
  'home.clrLift.thVersion': 'Version clr-lift',
  'home.clrLift.thNgVersion': 'Version Angular',
  'home.clrLift.utilitiesTitle': 'Services publics',
  'home.clrLift.utilitiesDesc':
    'Utilitaires spécialisés conçus pour les composants Clarity qui simplifient les tâches et les opérations communes, offrant une expérience de développement sans faille',
  'home.clrLift.rxjsTitle': 'Opérateurs RxJS',
  'home.clrLift.rxjsDesc':
    "Opérateurs RxJS améliorés qui prolongent la fonctionnalité Clarity. L'opérateur <code>dgState</code> rationalise la gestion de l'état datagrid, fournissant une approche intuitive et efficace pour travailler avec les datagrids Clarity.",
  'home.clrLift.componentsTitle': 'Composantes',
  'home.clrLift.componentsDesc':
    'Composants prêts à la production construits sur le système de conception Clarity, y compris les notifications de toasts, les alertes, les appels, les conteneurs de pages, les bascules thématiques, et plus encore',
  'home.clrLift.tipPeer':
    'Dans certains cas, une installation <strong>force</strong> peut être nécessaire si les dépendances de &#64;clr/angulaire spécifient une version Angular différente de celle de votre projet.',
  'home.clrLift.tipSkipLib':
    "Si vous n'utilisez pas la dernière version de Angular, envisagez de configurer <code>skipLibCheck: true</code> dans tsconfig.json pour éviter les erreurs potentielles de construction.",
  'home.clrLift.tipIcon':
    'Assurez-vous que les icônes Clarity sont importées correctement en utilisant <code>ClarityIcons.addIcons(...)</code>.',
  'common.examples': 'Exemples',
  'common.apiReference': "Référence de l'API",
  'common.overview': 'Aperçu',
  'common.parameters': 'Paramètres',
  'common.returns': 'Retourne',
  'rockStar.todayIs': "Aujourd'hui c'est",
  'rockStar.whoIsStar': "Qui est notre rock star d'aujourd'hui ?",
  'rockStar.unveil': 'Dévoilement',
  'common.signature': 'Signature',
  'common.description': 'Description',
  'common.basicUsage': 'Utilisation de base',
  'common.inputs': 'Entrées (Inputs)',
  'common.outputs': 'Sorties (Outputs)',
  'common.type': 'Type',
  'common.default': 'Par défaut',
  'common.contentProjection': 'Projection de contenu',
  'common.example': 'Exemple',
  'common.example1': 'Exemple 1 : Utilisation de base',
  'common.example2': 'Exemple 2 : Avec opérateur pipe RxJS',
  'common.example3': 'Exemple 3 : Gérer le code asynchrone',
  'common.example4': 'Exemple 4 : Injecteur découplé',
  'common.methods': 'Méthodes',
  'common.selector': 'Sélecteur',
  'common.behaviors': 'Comportements',
  'common.behavior': 'Comportement',
  'common.features': 'Fonctionnalités',
  'common.properties': 'Propriétés',
  'common.validationErrors': 'Erreurs de validation',
  'common.usageNotes': "Notes d'utilisation",
  'common.liveDemo': 'Démo en direct',
  'common.required': 'Requis',
  'common.refresh': 'Actualiser',
  'common.firstName': 'Prénom',
  'common.lastName': 'Nom',
  'common.email': 'E-mail',
  'common.gender': 'Genre',
  'common.male': 'Homme',
  'common.female': 'Femme',
  'common.name': 'Nom',
  'common.noDataFound': 'Aucune donnée trouvée',
  'common.noItems': 'Aucun élément',
  'common.paginationOf': '{0} - {1} sur {2} éléments',
  'common.seeUiBehavior': 'Cliquez pour voir le comportement UI',
  'filterUsers.selectGender': 'Sélectionnez le sexe pour charger les utilisateurs',
  'fileReader.file': 'Fichier',
  'fileReader.readSuccess': 'Le contenu du fichier a été lu avec succès',
  'fileReader.submitAndLog': 'Soumettre et afficher le journal des consoles',
  'fileReader.caBundle': 'Ensemble CA',
  'fileReader.showCertificate': 'Afficher le certificat & #160;:',
  'fileReader.exceedLimit': 'Dépasse la taille maximale du fichier ({0} MB).',
  'multiAlerts.addStandard': 'Ajouter une alerte standard',
  'multiAlerts.addInlineBtn': 'Ajouter Alerte avec Bouton Inline',
  'multiAlerts.addAction': 'Ajouter une alerte avec action',
  'multiAlerts.clearAll': 'Effacer toutes les alertes',
  'toast.successBtn': 'Succès Toast',
  'toast.infoBtn': 'Info Toast',
  'toast.errorBtn': 'Erreur Toast',
  'toast.warningBtn': 'Avertissement Toast',
  'idleDetection.startSimulation': 'Démarrer une simulation rapide (3s Idle)',
  'idleDetection.stopSimulation': 'Arrêter la simulation',
  'idleDetection.simActive': 'Simulation active :',
  'idleDetection.sessionStatus': 'État :',
  'idleDetection.totalTimeouts': 'Délais totaux:',
  'idleDetection.yes': 'Oui',
  'idleDetection.no': 'Numéro',
  'resourceAsync.userN': 'Utilisateur {0}',
  'resourceAsync.reload': 'Recharger',
  'resourceAsync.regUsernamePlaceholder': "Saisissez le nom d'utilisateur (3-20 caractères)",
  'resourceAsync.regUsernameError': "Nom d'utilisateur doit être 3-20 caractères",
  'resourceAsync.regEmailPlaceholder': 'Entrez votre courriel',
  'resourceAsync.regEmailError': 'Veuillez saisir un courriel valide',
  'resourceAsync.regPasswordPlaceholder': 'Saisissez le mot de passe (min 8 caractères)',
  'resourceAsync.regPasswordError': 'Le mot de passe doit être au moins 8 caractères',
  'resourceAsync.loadingTodo': 'Chargement de todo...',
  'resourceAsync.loadTodo': 'Charger des tâches',
  'resourceAsync.saving': 'Sauver...',
  'resourceAsync.resetFromServer': 'Réinitialiser depuis le serveur',
  'resourceAsync.loadUserCacheFirst': "Charger l'utilisateur (Cache-First)",
  'resourceAsync.fromCache': 'De Cache',
  'resourceAsync.updating': 'Mise à jour...',
  'resourceAsync.loadCounter': 'Compteur de charge',
  'resourceAsync.unsavedChanges': 'Changements non enregistrés - Le compteur a été modifié localement',
  'resourceAsync.saveToServer': 'Enregistrer dans le serveur',
  'resourceAsync.discardChanges': 'Éliminer les changements',
  'playground.beginner': 'Débutant',
  'playground.intermediate': 'Intermédiaire',
  'playground.advanced': 'Avancé',
  'playground.copy': 'Copier',
  'playground.copied': 'Copié',
  'playground.viewCode': 'Voir le code',
  'playground.hideCode': 'Masquer le code',
  'playground.stackedLayout': 'Disposition empilée',
  'playground.splitLayout': 'Disposition côte à côte',
  'inspector.liveState': 'État Signal en direct',
  'inspector.rawJson': 'JSON brut de l’état',
  'inspector.hideJson': 'Masquer le JSON',
  'mergeFrom.overview':
    "La fonction <code>mergeFrom</code> fusionne les valeurs de Observables ou Signals et émet la valeur la plus récente. Elle permet également de modifier la valeur émise à l'aide des opérateurs RxJS avant qu'elle ne soit émise. Bien qu'elle soit similaire à <code>merge()</code>, elle prend également en compte Signals. <code>mergeFrom</code> est similaire à <code>combineFrom</code>, mais au lieu d'émettre une valeur combinée, elle émet la valeur la plus récente émise à l'aide de l'opérateur merge plutôt qu'combineLatest.",
  'mergeFrom.example1Desc': 'Fusionner plusieurs signaux ou observables :',
  'mergeFrom.example2Desc': 'Transmettez un opérateur de pipe RxJS pour manipuler les valeurs émises :',
  'mergeFrom.example3Desc':
    'Utilisez l’option <code>startWith</code> ou <code>initialValue</code> pour gérer les observables asynchrones :',
  'mergeFrom.example4Desc':
    'Transmettez un <code>Injector</code> personnalisé pour créer un signal fusionné hors contexte d’injection :',
  'mergeFrom.apiSummary':
    "Fusionne plusieurs Observables ou Signals en un seul Signal qui émet la valeur la plus récente d'origine, similaire à <code>merge</code> mais avec la prise en charge de Signal.",
  'mergeFrom.paramSources':
    "Un objet ou un tableau de Observables ou Signals à fusionner. Lorsqu'un objet est fourni, le résultat sera un objet avec les mêmes clés.",
  'mergeFrom.paramOperator':
    "Un opérateur de tubes RxJS pour manipuler les valeurs émises avant qu'elles ne soient émises.",
  'mergeFrom.paramOptions': 'Options de configuration, y compris initialValue et injecteur.',
  'mergeFrom.returnsDesc': 'Un Signal qui émet la valeur combinée/fusionnée en tant que sources émet.',
  'toSignalForm.pageTitle': 'Formulaire réactif Signals & Reliures (toSignalForm)',
  'toSignalForm.bannerTitle': 'Combler Angular Formulaires réactifs et modernes Signals',
  'toSignalForm.bannerDesc':
    '<code>toSignalForm</code> enveloppe des instances standard de Angular <code>FormGroup</code> avec des signaux réactifs, des liaisons déclaratives (<code>bindIf</code>, <code>bindDisabled</code>), une revalidation croisée entre contrôles, et des valeurs soustraites (<code>submitValue</code>)—en maintenant une compatibilité de 100 % avec les conteneurs de formulaires Clarity et les validateurs Angular.',
  'toSignalForm.quickTitle': 'Niveau 1: Formulaire de démarrage rapide Signals',
  'toSignalForm.quickBadge': '30-Deuxième Bonjour Monde',
  'toSignalForm.quickDesc':
    'Apprenez les fondamentaux : enveloppez un FormGroup avec toSignalForm, lisez les valeurs de manière réactive via des signaux et désactivez les actions avec sf.invalid().',
  'toSignalForm.username': "Nom d'utilisateur",
  'toSignalForm.usernamePlaceholder': 'Au moins 3 caractères',
  'toSignalForm.usernameRequired': "Un nom d'utilisateur est requis.",
  'toSignalForm.usernameMinLength': 'Doit être au moins 3 caractères.',
  'toSignalForm.email': 'Adresse électronique',
  'toSignalForm.emailPlaceholder': 'nom@domaine.com',
  'toSignalForm.emailRequired': 'Un courriel est requis.',
  'toSignalForm.emailInvalid': 'Veuillez saisir une adresse email valide.',
  'toSignalForm.receiveUpdates': 'Recevez des mises à jour par courriel',
  'toSignalForm.saveProfile': 'Enregistrer le profil',
  'toSignalForm.reset': 'Réinitialiser',
  'toSignalForm.quickFormState': 'Formulaire rapide État Signal',
  'toSignalForm.quickFormStateDesc': 'Signals mise à jour synchrone comme vous tapez dans le formulaire ci-dessus',
  'toSignalForm.enterpriseTitle': "Niveau 2: Présentation d'entreprise - Fourniture de bases de données en nuage",
  'toSignalForm.enterpriseBadge': 'Spec Plein Real-World',
  'toSignalForm.enterpriseDesc':
    "Présence multicontrôle complexe, prospectation asynchrone de l'appareil via resourceAsync, mises à jour de la version en cascade et verrouillages d'échelle automatique conditionnels.",
  'toSignalForm.enterpriseState': 'Formulaire Entreprise Live Signals',
  'toSignalForm.enterpriseStateDesc':
    "Les pistes forment la validation, les verrouillages d'échelle automatique et l'état de provisionnement du moteur en temps réel",
  'toSignalForm.region': 'Région/appareillage de déploiement',
  'toSignalForm.regionSelect': 'Sélectionnez la région cible...',
  'toSignalForm.regionUSWest': 'US Ouest (Cloud v2 - Multi-Zone HA pris en charge)',
  'toSignalForm.regionApEast': 'Asie-Pacifique (Nouage régional - HA multizone pour PG et MySQL)',
  'toSignalForm.regionEuCentral': 'Europe centrale (Région de Legacy - Zone unique seulement)',
  'toSignalForm.regionRequired': 'La région de déploiement est requise.',
  'toSignalForm.regionHelper':
    'Contrôle asynchrone des capacités des appareils régionaux via <code>computedAsync</code>.',
  'toSignalForm.multiZoneSupported': '✓ Multi-Zone HA pris en charge',
  'toSignalForm.singleZoneOnly': 'Zone unique seulement (HA Gated)',
  'toSignalForm.engine': 'Moteur de base de données',
  'toSignalForm.enginePostgres': 'PostgreSQL',
  'toSignalForm.engineMysql': 'MySQL',
  'toSignalForm.engineSqlServer': 'Serveur SQL',
  'toSignalForm.engineRequired': 'Un moteur de base de données est nécessaire.',
  'toSignalForm.engineHelper':
    'Les options ci-dessous sont dérivées de manière réactive de <code>sf.fields.engine.value</code>.',
  'toSignalForm.haTopology': 'Topologie multizones HA',
  'toSignalForm.haCrossAz': 'Zone de droits réciproques',
  'toSignalForm.haDedicated': 'Hôtes anti-affinité dédiés',
  'toSignalForm.haRequired': 'La topologie HA est requise.',
  'toSignalForm.haHelper': 'Monté dynamiquement par <code>sf.bindIf(isMultiZoneSupported, ...)</code>.',
  'toSignalForm.replicaCount': 'Nombre de nœuds de réplique',
  'toSignalForm.replicaRequired': 'Le nombre de répliques est nécessaire.',
  'toSignalForm.replicaMin': 'Minimum 2 répliques pour HA multizone.',
  'toSignalForm.replicaMax': 'Maximum 5 répliques autorisées.',
  'toSignalForm.replicaHelper': 'Les valeurs sont préservées dans toute la région.',
  'toSignalForm.version': 'Version du moteur',
  'toSignalForm.versionSelect': 'Sélectionner la version',
  'toSignalForm.versionRequired': 'La version du moteur est requise.',
  'toSignalForm.versionHelper':
    'Réinitialise automatiquement à la première version disponible lorsque le moteur change.',
  'toSignalForm.clusterName': 'Nom du groupe',
  'toSignalForm.clusterNamePlaceholder': 'p.ex. facturation-db-primaire',
  'toSignalForm.clusterNameRequired': 'Le nom du groupe est requis.',
  'toSignalForm.clusterNameMinLength': 'Doit être au moins 4 caractères.',
  'toSignalForm.clusterNameHelper':
    'Débloqué 400ms & vérifié asynchronement contre les noms réservés (prod-db, test-cluster, etc.).',
  'toSignalForm.clusterNameChecking': 'Vérifier la disponibilité des noms... (débloqué 400ms)',
  'toSignalForm.autoScaling': 'Stockage Calibrage automatique',
  'toSignalForm.autoScalingHelper':
    "Lorsque activé, l'entrée de stockage manuel est automatiquement désactivée et réinitialisée à 250 GB.",
  'toSignalForm.storageGb': 'Stockage attribué (GB)',
  'toSignalForm.storageGbRequired': 'La taille de stockage est requise.',
  'toSignalForm.storageGbMin': "L'allocation minimale est de 20 GB.",
  'toSignalForm.storageGbHelper':
    "Bound via <code>sf.bindDisabled('storageGb', () =&gt; autoScaling(), &#123; resetOnDisable: true, resetValue: 250 &#125;)</code>.",
  'toSignalForm.storageLocked': "Gestion de l'échelle automatique (désactivée, verrouillée à 250 GB)",
  'toSignalForm.storageManual': '✓ Affectation manuelle autorisée',
  'toSignalForm.authMode': "Mode d'authentification",
  'toSignalForm.authSql': 'Utilisateur natif de la base de données',
  'toSignalForm.authWindows': "Répertoire d'entreprise / Windows Auth",
  'toSignalForm.authModeRequired': "Le mode d'authentification est requis.",
  'toSignalForm.authModeHelper':
    'Sélection de la base de données Native User monte mot de passe et confirmation avec conservation de mémoire.',
  'toSignalForm.password': 'Mot de passe maître',
  'toSignalForm.passwordPlaceholder': 'Mini 8 caractères',
  'toSignalForm.passwordRequired': 'Le mot de passe principal est requis.',
  'toSignalForm.passwordMinLength': 'Il doit y avoir au moins 8 caractères.',
  'toSignalForm.confirmPassword': 'Confirmer le mot de passe',
  'toSignalForm.confirmPasswordPlaceholder': 'Répéter le mot de passe maître',
  'toSignalForm.confirmPasswordRequired': 'Une confirmation de mot de passe est nécessaire.',
  'toSignalForm.passwordMismatch': 'Les mots de passe ne correspondent pas.',
  'toSignalForm.confirmPasswordHelper':
    'Revalidé automatiquement lorsque Master Password change via <code>sf.revalidate</code>.',
  'toSignalForm.tlsCert': 'Certificat TLS / SSL',
  'toSignalForm.certManaged': 'Plateforme Autogénérée',
  'toSignalForm.certCustom': "Certificat d'entreprise personnalisé",
  'toSignalForm.certRequired': 'Le type de certificat est requis.',
  'toSignalForm.certHelper':
    "Le mode personnalisé monte dynamiquement l'entrée du certificat et conserve le texte dactylographié à travers les toggles.",
  'toSignalForm.tlsChain': 'Chaîne de certificat PEM',
  'toSignalForm.tlsChainPlaceholder': '-----BEGIN CERTIFICATE- Non, pas du tout.END CERTIFICATE-----',
  'toSignalForm.tlsChainRequired': 'La chaîne de certification est requise.',
  'toSignalForm.tlsChainMinLength': 'Le certificat doit avoir au moins 20 caractères.',
  'toSignalForm.tlsChainHelper': 'Tapez du texte, passez à "Auto-Généré", et retournez : le texte est conservé !',
  'toSignalForm.createCluster': 'Créer un groupe',
  'toSignalForm.resetForm': 'Formulaire de réinitialisation',
  'toSignalForm.submitting':
    'Soumettre la demande de fourniture de clusters au plan de commande... (simulation de 1.0s)',
  'toSignalForm.successTitle': "✓ Demande d'approvisionnement en grappes acceptée (ID: {0})",
  'toSignalForm.simulatedResponse': 'Réponse simulée du moteur reçue en 1,0 seconde:',
  'toSignalForm.diagnosticsTitle': 'Diagnostics Signal en temps réel',
  'toSignalForm.clusterNameState': 'État du nom du groupe (sf.fields.clusterName)',
  'toSignalForm.value': 'Valeur & #160;:',
  'toSignalForm.debounced': 'Débloqué (400 ms):',
  'toSignalForm.valid': 'Valide & #160;:',
  'toSignalForm.touched': 'Touché :',
  'toSignalForm.errors': 'Erreurs :',
  'toSignalForm.sqlCredState': 'SQL État des pouvoirs',
  'toSignalForm.authModeLabel': 'Mode auth:',
  'toSignalForm.controlsAttached': 'Contrôles fixés :',
  'toSignalForm.passwordValid': 'Mot de passe valide & #160;:',
  'toSignalForm.passwordErrors': 'Erreurs de mot de passe :',
  'toSignalForm.confirmValid': 'Confirmer Valable & #160;:',
  'toSignalForm.confirmErrors': 'Confirmer les erreurs & #160;:',
  'toSignalForm.sanitizedPayload': 'Charge utile de présentation sanitaire (sf.submitValue)',
  'toSignalForm.sanitizedDesc':
    'Auto-omits UI-seulement <code>confirmPassword</code> et omet de détacher <code>password</code> sur Windows auth.',
  'toSignalForm.patternsTitle': 'Dessins architecturaux spécialisés',
  'toSignalForm.pattern1Title': 'Profil 1: Arbres de champ dépendants / conditionnels (bindIf)',
  'toSignalForm.pattern1Desc':
    "Monte ou démonte un groupe de contrôles liés (par exemple, des identifiants de base de données) ensemble en fonction d'une condition réactive. Les contrôles déconnectés sont automatiquement exclus de la validation et des payloads du backend, et leur entrée est préservée lors des switches lorsque <code>preserveValue: true</code> est configuré.",
  'toSignalForm.pattern2Title': 'Motif 2 : Désactivation réactive et remise en fonction automatique (bindDisabled)',
  'toSignalForm.pattern2Desc':
    "Lie l'état activé/désactivé d'un contrôleur directement à un signal booléen ou à une fonction de récupération réactive (<code>() =&gt; boolean</code>). Elle prend en charge des clés de contrôleur typées, des contrôleurs améliorés de <code>sf.controls.&lt;name&gt;</code>, et des instances de <code>AbstractControl</code>. Elle préfère par défaut <code>emitEvent: true</code> pour assurer que les signaux d'état réactif sont mis à jour synchronément, et prend en charge un réinitialisation en cas de désactivation avec un contrôleur typé <code>resetValue</code>.",
  'toSignalForm.pattern3Title': 'Modèle 3 : Présentations sanitaires (sf.submitValue)',
  'toSignalForm.pattern3Desc':
    "Résout la tension entre <code>form.value</code> (qui élimine les contrôleurs désactivés) et <code>form.getRawValue()</code> (qui jette les champs UI uniquement comme <code>confirmPassword</code>). <code>sf.submitValue()</code> fournit un signal réactif continu qui est toujours nettoyé et prêt à l'envoi ou à <code>resourceAsync</code>.",
  'toSignalForm.pattern4Title': 'Pattern 4: Gating des caractéristiques asynchrones (computedAsync + bindIf)',
  'toSignalForm.pattern4Desc':
    "Dans les applications cloud et d'entreprise, les champs de formulaire disponibles sont souvent dépendants de capacités régionales ou d'indicatrices de fonctionnalité résolues asynchronement à partir des points de terminaison API. <code>computedAsync</code> dérive un signal réactif <code>Signal&lt;boolean&gt;</code> à partir de la région sélectionnée et de l'engin, qui est ensuite transmis directement à <code>sf.bindIf</code> pour monter ou démonter les contrôles de capacité sur le voleur.",
  'toSignalForm.pattern5Title': 'Motif 5 : Mises à jour en cascade et changement de montre (sf.watch)',
  'toSignalForm.pattern5Desc':
    "Lorsqu'un changement dans un contrôleur de formulaire déclenche des mises à jour en cascade dans un autre contrôleur (par exemple, réinitialiser les versions disponibles lors de la modification de l'engin de base de données), vous pouvez utiliser le modèle traditionnel de RxJS <code>valueChanges.pipe(takeUntilDestroyed())</code> ou l'utilité de signal premier de <code>sf.controls.&lt;name&gt;.watch()</code> / <code>sf.watch()</code>. <code>watch</code> opère à l'intérieur d'un Angular <code>effect()</code> avec une isolation automatique de <code>untracked</code>, empêchant ainsi les erreurs de écriture de signaux de <code>NG0600</code> tout en éliminant manuellement la déstructuration de l'abonnement.",
  'toSignalForm.apiReferenceTitle': 'Référence API',
  'toSignalForm.apiToSignalFormTitle': 'toSignalForm(form, options?)',
  'toSignalForm.apiBindIfTitle': 'sf.bindIf(control, condition, options?) / bindControlIf',
  'toSignalForm.apiBindDisabledTitle': 'sf.bindDisabled(control, condition, options?) / bindControlDisabled',
  'toSignalForm.apiRevalidateTitle': 'sf.revalidate(target, sources, options?) / revalidateOnChange',
  'toSignalForm.apiPropForm':
    "L'instance Angular FormGroup pour envelopper avec des signaux réactifs et des fixations.",
  'toSignalForm.apiPropOmit': 'Contrôler les noms à omettre des charges utiles submitValue.',
  'toSignalForm.apiPropEmitEvent':
    'Indique si les changements de statut/valeur émettent des événements de contrôle Angular.',
  'toSignalForm.apiPropValue': 'Signal réactif de la valeur de la forme courante.',
  'toSignalForm.apiPropStatus':
    "Signal réactif de l'état global de la forme ('VALID'=\"INVALID'=\"PENDING'=\"DISABLED').",
  'toSignalForm.apiPropValid': 'Signal calculé indiquant si le formulaire est valide.',
  'toSignalForm.apiPropInvalid': 'Signal calculé indiquant si le formulaire est invalide.',
  'toSignalForm.apiPropSubmitValue':
    "Charge utile sanitaire, à l'exclusion des commandes désactivées, omises ou non montées.",
  'toSignalForm.apiPropIsSubmitting': "Suivi du signal écrit si une opération de soumission d'async est en vol.",
  'toSignalForm.apiBindIfControl': 'Nom ou instance de la commande à monter/démonter sous condition.',
  'toSignalForm.apiBindIfCondition': 'Signal booléen ou prédicat régissant le montage de la commande.',
  'toSignalForm.apiBindIfPreserveValue':
    'Préserve la valeur de contrôle en mémoire pendant les cycles de démontage/remontage.',
  'toSignalForm.apiBindIfDefaultValue':
    'Valeur par défaut attribuée lors du montage ou de la réinitialisation du contrôle.',
  'toSignalForm.apiBindIfEmitEvent':
    "Indique si l'ajout/retrait de contrôle émet des événements de valeur et d'état FormGroup.",
  'toSignalForm.apiBindDisabledControl': "Contrôle de la cible dont l'état activé ou désactivé est lié.",
  'toSignalForm.apiBindDisabledCondition': 'Signal booléen ou prédicat retour vrai pour désactiver, faux pour activer.',
  'toSignalForm.apiBindDisabledResetOnDisable':
    "Réinitialise automatiquement la valeur de contrôle lors de l'entrée dans l'état désactivé.",
  'toSignalForm.apiBindDisabledResetValue':
    'Valeur de réinitialisation spécifique lorsque resetOnDisable est actif; par défaut pour contrôler initial/null.',
  'toSignalForm.apiBindDisabledEmitEvent':
    'Indique si les changements activer/désactiver émettent des événements de valeur/status.',
  'toSignalForm.apiRevalidateTarget':
    'Contrôle de la cible pour réévaluer la validation en fonction des changements de source.',
  'toSignalForm.apiRevalidateSources':
    'Un ou plusieurs contrôles de dépendance dont les changements de valeur/de statut déclenchent la revalidation de la cible.',
  'toSignalForm.apiRevalidateOnlyIfTouched':
    "Ne déclenchez la revalidation de la cible que si la cible a été touchée par l'utilisateur.",
  'toSignalForm.apiRevalidateOnlyIfDirty':
    "Ne déclenchez la revalidation de la cible que si celle-ci a été modifiée (c'est sale).",
  'computedAsync.title': 'computedAsync',
  'computedAsync.overview':
    'La fonction <code>computedAsync</code> est un outil polyvalent permettant de calculer des valeurs à partir de Promises, Observables ou de valeurs régulières. Elle offre une flexibilité dans le comportement de calcul à travers des stratégies de flattening sélectionnables (switch, merge, concat, exhaust) et une affectation initiale. Pour utiliser <code>computedAsync</code>, fournissez une fonction retournant un Promise, un Observable ou une valeur régulière. Elle retourne ensuite un <code>Signal</code> émettant la valeur calculée.',
  'computedAsync.example1': 'Exemple 1: Fonctionne avec Promises',
  'computedAsync.example1Desc': 'Calculer les valeurs à partir de Promises :',
  'computedAsync.example2': 'Exemple 2: Fonctionne avec Observables',
  'computedAsync.example2Desc':
    "Lorsque vous retournez un Observable, il est automatiquement abonné et sera désabonné lors de la destruction du composant ou lors de la réactivation du calcul. Dans l'exemple suivant, si le userId change, le calcul précédent sera annulé (y compris les appels en cours de API), et un nouveau calcul sera initié.",
  'computedAsync.example3': 'Exemple 3 : Fonctionne avec des valeurs régulières',
  'computedAsync.example3Desc':
    "Cela permet de retourner des valeurs régulières (celles ne comprenant pas de Promises ou de Observables) depuis la fonction de rappel. La fonction de rappel s'exécute dans la file de tâches micro, donc elle ne sera pas émise promptement (par défaut, elle retourne undefined). Pour émettre la valeur immédiatement, vous pouvez utiliser l'option requireSync dans l'objet d'options du second argument.",
  'computedAsync.example4': 'Exemple 4: Fonctionne avec initialValue',
  'computedAsync.example4Desc':
    "Si nous voulons établir une valeur initiale pour la valeur calculée, nous pouvons la fournir comme deuxième argument dans l'objet Options.",
  'computedAsync.example5': 'Exemple 5: Fonctionne avec requireSync',
  'computedAsync.example5Desc':
    "Si nous avons un Observable qui émet la valeur de manière synchrone, nous pouvons utiliser l'option requireSync pour assurer l'émission immédiate de la valeur. Cette fonctionnalité est également utile pour assurer que le type <code>signal</code> exclut par défaut le undefined (<code>Signal<T></code> au lieu de <code>Signal<T | undefined></code>).",
  'computedAsync.example6': "Exemple 6: Travailler avec l'opérateur createAsyncState",
  'computedAsync.example6Desc':
    "Dans l'exemple ci-dessous, nous avons un <code>Signal</code> qui représente l'état d'un appel API. Nous utilisons l'opérateur <code>computedAsync</code> et <code>createAsyncState</code> pour calculer l'état de l'appel API basé sur le <code>userId</code>.",
  'computedAsync.example7': 'Exemple 7: Comportements (switch, fusion, concat, échappement)',
  'computedAsync.example7Desc':
    "Par défaut, <code>computedAsync</code> utilise le comportement de commutation. Si vous souhaitez modifier ce comportement, vous pouvez fournir l'option de comportement dans l'objet second argument options.",
  'computedAsync.behaviorSwitch': 'interrupteur (par défaut)',
  'computedAsync.behaviorSwitchDesc':
    'Lorsque vous souhaitez annuler le calcul préalable, le comportement du commutateur est utilisé, ce qui est la valeur par défaut. Si un nouveau calcul est déclenché avant la fin du précédent, le premier sera mis fin.',
  'computedAsync.behaviorMerge': 'fusion',
  'computedAsync.behaviorMergeDesc':
    'Pour conserver le calcul précédent, le comportement de fusion est utilisé. Si un nouveau calcul est initié avant que le précédent soit terminé, le premier est conservé pendant que le second est démarré.',
  'computedAsync.behaviorConcat': 'concat',
  'computedAsync.behaviorConcatDesc':
    "Si la préservation du calcul préalable est souhaitée avec l'attente de son achèvement avant de lancer le nouveau, le comportement concat est choisi.",
  'computedAsync.behaviorExhaust': "gaz d'échappement",
  'computedAsync.behaviorExhaustDesc':
    "Dans les cas où il est nécessaire de ne pas tenir compte du nouveau calcul alors que le précédent reste en cours, le comportement d'échappement est sélectionné.",
  'computedAsync.example8': 'Exemple 8: Utilisation avec la valeur calculée précédente',
  'computedAsync.example8Desc':
    "S'il est nécessaire d'utiliser la valeur calculée précédemment dans le calcul ultérieur, elle peut être consultée dans la fonction callback comme premier argument.",
  'computedAsync.example9': 'Exemple 9: Charger les données au départ',
  'computedAsync.example9Desc': 'Charger les utilisateurs initialement lorsque le composant charge:',
  'computedAsync.refresh': 'Actualiser',
  'computedAsync.learnTrigger': 'Apprenez <a href="{0}"><code>createTrigger</code> ici</a>.',
  'computedAsync.example10': 'Exemple 10 : Charger les données lorsque le bouton clique',
  'computedAsync.example10Desc': "Charger les utilisateurs uniquement lorsqu'un bouton est cliqué :",
  'computedAsync.loadUsers': 'Charger les utilisateurs',
  'computedAsync.example11': 'Exemple 11 : Gestion des erreurs avec onError',
  'computedAsync.example11Desc':
    'Utilisez le callback <code>onError</code> pour gérer les erreurs gracieusement et fournir des valeurs de repli. Lorsque <code>onError</code> retourne une valeur, le signal émet cette valeur au lieu de lancer une erreur :',
  'computedAsync.onErrorCallout':
    'Le callback <code>onError</code> renvoie une valeur de secours de type T. Incluez explicitement <code>undefined</code> dans T si nécessaire. Les erreurs non traitées et les exceptions du callback sont levées à la lecture du signal ; elles ne deviennent jamais des données de succès.',
  'computedAsync.example12': 'Exemple 12 : Les erreurs sont levées à la lecture par défaut',
  'computedAsync.example12Desc':
    'Les erreurs non traitées sont levées à la lecture du signal. Interceptez la lecture ou utilisez <code>onError</code> pour fournir une valeur de secours typée.',
  'computedAsync.throwOnErrorCallout':
    '<code>throwOnError: true</code> exécute <code>onError</code> pour ses effets de bord et lève toujours une erreur ; sa valeur de retour est ignorée. <code>throwOnError: false</code> n’est plus pris en charge.',
  'computedAsync.example13': "Exemple 13 : Changement d'onglet avec annulation de la demande (résilience de la force)",
  'computedAsync.example13Desc':
    'Dans le UIs multi-onglets, les onglets de commutation peuvent rapidement déclencher des requêtes simultanées lorsque les demandes en vol sont avortées ou échouées (p. ex. annulations de navigation par le navigateur).',
  'computedAsync.tabResilienceBefore':
    "Avant la réparation de <strong> : </strong>. Une erreur interne (par exemple, une requête HTTP annulée) se propagerait à travers <code>switchAll</code> et terminerait de manière permanente l'abonnement externe observable. Le UI resterait bloqué dans l'état de chargement indéfiniment et ne pourrait jamais charger les onglets suivants.",
  'computedAsync.tabResilienceAfter':
    "<strong>After Fix:</strong> L'erreur interne est attrapée et manipulée en toute sécurité, en maintenant le flux externe en vie.",
  'computedAsync.tabActiveDirectory': 'Répertoire actif',
  'computedAsync.tabBackupLocations': 'Emplacements de sauvegarde',
  'computedAsync.tabCertificates': 'Certificats',
  'computedAsync.tabSimulateAborted': 'Simuler la demande annulée',
  'computedAsync.tabNotice':
    "Remarque: Même après cette requête simulée avortée, le flux reste en vie! Cliquez sur n'importe quel onglet ci-dessus pour le voir correctement récupérer.",
  'computedAsync.example14': 'Exemple 14: Injecteur découplé',
  'computedAsync.example14Desc':
    "En passant un <code>injector</code> en option dans l'objet Options, <code>computedAsync</code> peut être instantané en dehors d'un contexte d'injection ambiante – par exemple, à l'intérieur de fonctions d'aide composables, de services personnalisés ou de méthodes d'usine dynamiques:",
  'computedAsync.apiSummary':
    'Calcule des valeurs à partir de Promises, Observables ou de valeurs régulières, en retournant un Signal qui émet la valeur calculée.',
  'computedAsync.paramComputation':
    'Une fonction qui renvoie une valeur Promise, Observable ou une valeur normale. La fonction reçoit la valeur calculée précédente comme premier argument optionnel.',
  'computedAsync.paramOptions': "Options de configuration pour le calcul d'async.",
  'computedAsync.propInitialValue': 'La valeur initiale du signal calculé avant la fin du calcul.',
  'computedAsync.propRequireSync': "Si c'est vrai, exige que le calcul émette synchronement.",
  'computedAsync.propBehavior':
    'Stratégie de traitement de plusieurs calculs : "switch", "merge", "concat" ou "exhaust". Valeur par défaut : "switch".',
  'computedAsync.propOnError': "Callback du gestionnaire d'erreurs qui reçoit des erreurs des opérations async.",
  'computedAsync.propThrowOnError': "Si c'est vrai, les erreurs seront lancées et propagées.",
  'computedAsync.returnsDesc': 'Un Signal qui émet la valeur calculée.',
  'combineFrom.title': 'combineFrom',
  'combineFrom.overview':
    'La fonction <code>combineFrom</code> prend un tableau ou un objet de Observables ou de Signals et produit un Signal qui émet la valeur agrégée de ces sources. Similaire à <code>combineLatest</code>, mais prend en charge de manière fluide Signals. Elle prend en charge des injecteurs personnalisés et des valeurs initiales.',
  'combineFrom.example1': 'Exemple 1: Utilisation de base',
  'combineFrom.example1Desc': 'Combiner plusieurs signaux ou observables:',
  'combineFrom.example2': "Exemple 2: Avec l'opérateur de pipe RxJS",
  'combineFrom.example2Desc': 'Passer un opérateur de tuyauterie RxJS pour manipuler les valeurs émises:',
  'combineFrom.example3': 'Exemple 3 : Poignée Code asynchrone',
  'combineFrom.example3Desc':
    "Utilisez l'option <code>startWith</code> ou <code>initialValue</code> pour gérer les observables asynchrones :",
  'combineFrom.example4': 'Exemple 4 : Exemple réel - Données filtrées',
  'combineFrom.example4Desc':
    'Combiner les critères de recherche avec une ressource API pour effectuer le filtrage et le tri côté client :',
  'combineFrom.example5': 'Exemple 5: Initialisation et injecteur explicite dédoublés',
  'combineFrom.example5Desc':
    "Dupliquer l'émission initiale du signal. Des sources distinctes peuvent encore produire des combinaisons intermédiaires; utiliser computed() pour la dérivation du signal synchrone.",
  'combineFrom.apiSummary':
    'Combine les sources Observable et Signal avec les sémantiques combineLatest et la déduplication par source.',
  'combineFrom.paramSources':
    "Un objet ou un tableau de Observables ou Signals à combiner. Lorsqu'un objet est fourni, le résultat sera un objet avec les mêmes clés.",
  'combineFrom.paramOperator':
    "Un opérateur de tubes RxJS pour manipuler les valeurs émises avant qu'elles ne soient émises.",
  'combineFrom.paramOptions': 'Options de configuration, y compris initialValue et injecteur.',
  'combineFrom.returnsDesc':
    "Un signal qui émet un tableau ou un objet (selon le type d'entrée) contenant les dernières valeurs de toutes les sources observables et signaux.",
  'resourceAsync.title': 'resourceAsync',
  'resourceAsync.overview':
    'La fonction <code>resourceAsync</code> crée une ressource réactive pour gérer des opérations asynchrones avec un suivi complet de leur état. Elle accepte un Observable, une Promise ou une valeur synchrone, annule automatiquement les requêtes obsolètes et permet le rechargement manuel.',
  'resourceAsync.basicSection': 'Exemples fondamentaux',
  'resourceAsync.intermediateSection': 'Exemples intermédiaires',
  'resourceAsync.whenToUseSection': 'Quand utiliser',
  'resourceAsync.advancedSection': "WritableResourceRef - Gestion locale de l'État",
  'resourceAsync.nestedSection': 'Motif avancé : ressources en nids',
  'resourceAsync.example1': 'Exemple 1 : requête réactive de base avec suivi automatique de la dependence',
  'resourceAsync.example1Desc':
    "Crée une ressource qui récupère automatiquement les données et re-fetches chaque fois que les dépendances changent. Tout signal lu à l'intérieur de la fonction source devient une dépendance réactive.",
  'resourceAsync.example2': 'Exemple 2: Chargement paresseux',
  'resourceAsync.example2Desc':
    "Utilisez <code>lazy: true</code> pour reporter le chargement jusqu'à ce que <code>reload()</code> soit appelé. La ressource démarre en état inactif et ne récupérera pas les données tant qu'elle n'aura pas été explicitement déclenchée :",
  'resourceAsync.loadUsers': 'Charger les utilisateurs',
  'resourceAsync.notLoadedIdle': 'Non encore chargé (rembourrage)',
  'resourceAsync.example3': 'Exemple 3 : Valeur initiale',
  'resourceAsync.example3Desc': 'Fournir une valeur initiale à afficher avant la première récupération complète:',
  'resourceAsync.example3Callout':
    "Utile en naviguant d'une liste à une page de détail où vous avez déjà quelques données à afficher immédiatement.",
  'resourceAsync.example4': 'Exemple 4 : Gestion des erreurs avec la propagation des chutes et des erreurs',
  'resourceAsync.example4Desc':
    'Gérez les erreurs avec le callback <code>onError</code> pour fournir des valeurs de repli, ou utilisez <code>throwOnError: true</code> pour propager les erreurs :',
  'resourceAsync.triggerFallback': 'Demande de déclenchement (rétroaction)',
  'resourceAsync.showingFallback': "Affichage de l'utilisateur de retour après erreur",
  'resourceAsync.errorPropagation': "Propagation d'erreur",
  'resourceAsync.example5': "Exemple 5: Mutations avec execute() - Formulaire d'inscription de l'utilisateur",
  'resourceAsync.example5Desc':
    'Pour les mutations (POST/PUT/DELETE), utilisez la méthode <code>execute()</code> au lieu de <code>reload()</code>. <code>execute()</code> retourne un <code>Promise&lt;T&gt;</code> attendable qui résout exactement la valeur écrite dans <code>resource.value()</code>, efface les valeurs stales et les erreurs lors de la ré-exécution, et est sécurisé pour des appels fire-and-forget sans rejets non gérés.',
  'resourceAsync.regUsername': "Nom d'utilisateur",
  'resourceAsync.regEmail': 'Courriel',
  'resourceAsync.regPassword': 'Mot de passe',
  'resourceAsync.regSubmit': 'Registre',
  'resourceAsync.example6': 'Exemple 6: Comportements (interrupteur, échappement)',
  'resourceAsync.example6Desc': 'Contrôler la façon dont plusieurs demandes simultanées sont traitées :',
  'resourceAsync.example7': "Exemple 7: Suivi de l'état",
  'resourceAsync.example7Desc':
    "Accédez aux informations sur l'état granulaire avec le signal <code>status()</code>. Utilisez <code>computed()</code> pour l'état dérivé :",
  'resourceAsync.example8': 'Exemple 8: Définition déclarative et propagation AbortSignal',
  'resourceAsync.example8Desc':
    "<code>resourceAsync</code> prend en charge une définition déclarative via <code>ResourceAsyncDefinition&lt;P, T&gt;</code> avec <code>params</code> et <code>loader</code>, propageant <code>context.abortSignal</code> pour le suivi de la génération d'annulation et du règlement différé du promesse.",
  'resourceAsync.declarativeTitle': 'Showcase en direct: Définition déclarative et annulation',
  'resourceAsync.quickSwitchDemo': "Interrupteur rapide (arrêt de l'entrainement)",
  'resourceAsync.activeSearchLogs': 'AbortSignal en temps réel et demande le journal du cycle de vie',
  'resourceAsync.optimisticTitle': 'Exemple 1: Mises à jour optimales - Todo Toggle',
  'resourceAsync.optimisticDesc':
    'Mettre à jour le UI immédiatement avant la confirmation du serveur. Si la requête du serveur échoue, vous pouvez retourner la modification.',
  'resourceAsync.cacheFirstTitle': 'Exemple 2 : Chargement en cache-première',
  'resourceAsync.cacheFirstDesc':
    'Afficher les données mises en cache immédiatement tout en récupérant des données fraîches en arrière-plan. Cela élimine le chargement des spinners pour les utilisateurs avec du contenu mis en cache.',
  'resourceAsync.formDraftTitle': 'Exemple 3 : Ébauche du formulaire - Compteur avec sauvegarde/désactivation',
  'resourceAsync.formDraftDesc':
    'Autoriser les utilisateurs à modifier les données localement avant de les enregistrer sur le serveur. Ils peuvent enregistrer des modifications ou les jeter en rechargeant à partir du serveur.',
  'resourceAsync.nestedTitle': 'Mise en œuvre & Démo',
  'resourceAsync.nestedProjects': 'Projets',
  'resourceAsync.nestedLoadingItems': 'Chargement des éléments...',
  'resourceAsync.nestedRefreshing': 'Rafraîchir...',
  'resourceAsync.nestedThName': 'Dénomination',
  'resourceAsync.nestedThStatus': 'État',
  'resourceAsync.nestedThOrg': 'Organisation',
  'resourceAsync.nestedThActions': 'Actions',
  'resourceAsync.nestedLoadOrg': "Charger l'org",
  'resourceAsync.nestedRetry': 'Réessayer',
  'resourceAsync.nestedRefreshItems': 'Actualiser les éléments',
  'resourceAsync.nestedLoadAllOrgs': 'Charger tous les orgs',
  'queryResource.title': 'queryResource',
  'queryResource.overview':
    '<code>queryResource</code> gère de façon déclarative l’état du serveur dans Angular Signals, avec cache et déduplication. Associé à <code>mutateResource</code> et <code>QueryClient</code>, il coordonne les interrogations périodiques en arrière-plan, le cache stale-while-revalidate, le regroupement des requêtes simultanées et l’invalidation par tag.',
  'queryResource.comparisonTitle': 'Quand utiliser : queryResource vs resourceAsync',
  'queryResource.comparisonIntro':
    "Les deux primitives utilisent Angular Signals pour les fixations réactives UI, mais elles s'adressent à différentes couches de votre architecture d'application :",
  'queryResource.cardResourceAsyncTitle': "resourceAsync (État composant-local d'Async)",
  'queryResource.cardQueryResourceTitle': "queryResource (serveur partagé et cache d'entité)",
  'queryResource.scope': 'Portée',
  'queryResource.cache': 'Cache',
  'queryResource.mutations': 'Mutations',
  'queryResource.freshness': 'Fraise',
  'queryResource.polling': 'Sondages',
  'queryResource.invalidation': 'Invalidation',
  'queryResource.bestFor': 'Meilleur pour',
  'queryResource.resourceAsyncScopeDesc': "Conformément strictement au cycle de vie de l'instance de composant unique.",
  'queryResource.resourceAsyncCacheDesc': 'Pas de cache global. Détruire le composant détruit les données.',
  'queryResource.resourceAsyncMutationsDesc': 'execute() intégré pour les déclencheurs ponctuels directs.',
  'queryResource.resourceAsyncBestForDesc':
    'États de soumission de formulaire, filtres de recherche locaux de typeahead, récupération de données modal-isolées, exportations de fichiers.',
  'queryResource.queryResourceScopeDesc': 'Géré globalement à travers les routes et les composants par QueryClient.',
  'queryResource.queryResourceCacheDesc':
    'Les clés de requête identiques partagent les requêtes HTTP en vol et le cache mémoire.',
  'queryResource.queryResourceFreshnessDesc': 'Configurable staleTime et gcTime (Stale-Wild-Revalidate).',
  'queryResource.queryResourcePollingDesc':
    'Coordonné pollInterval qui respecte automatiquement la visibilité des onglets.',
  'queryResource.queryResourceInvalidationDesc': "Auto-refetché via l'invalidation de tag de mutateResource.",
  'queryResource.queryResourceBestForDesc':
    'Les entités de serveur (utilisateurs, tableaux de bord, projets, état de cluster) partagées sur plusieurs vues.',
  'queryResource.thFeature': 'Fonctionnalité',
  'queryResource.rowPrimaryLayer': 'Couche primaire',
  'queryResource.rowPrimaryLayerResource': "État d'async local au niveau des composantes",
  'queryResource.rowPrimaryLayerQuery': "État du serveur partagé à l'échelle du client",
  'queryResource.rowSharedMemory': 'Cache mémoire partagée',
  'queryResource.badgeNoneComponent': 'Aucune (liée au composant)',
  'queryResource.badgeGlobalKey': 'Global par QueryKey',
  'queryResource.rowDeduplication': 'Dédoublement de la demande simultanée',
  'queryResource.badgePerInstance': 'Par instance (switch/exhaust)',
  'queryResource.badgeClientCoalesced': "Cohésionné à l'échelle du client",
  'queryResource.rowStaleWhileRevalidate': "Révalidation de l'état",
  'queryResource.badgeManualPreserve': 'Manuel (preserveValueOnError)',
  'queryResource.badgeAutoStale': 'Automatique via staleTime',
  'queryResource.rowBackgroundPolling': 'Historique du scrutin',
  'queryResource.badgeNoneBuiltIn': 'Aucun élément intégré (ou sondage externe)',
  'queryResource.badgeCoordinatedVisibility': 'Coordonné + Visibilité',
  'queryResource.rowTagInvalidation': "Invalidation fondée sur l'étiquette",
  'queryResource.badgeManualReload': 'Déclencheur manuel de recharge',
  'queryResource.badgeAutoMutate': 'Automatique via mutateResource',
  'queryResource.lifecycleTitle': 'Matrice des états et signaux du cycle de vie',
  'queryResource.lifecycleIntro':
    'Les requêtes gèrent à la fois les chargements initiaux et les revalidations en arrière-plan. Utilisez cette matrice pour déterminer quand afficher un indicateur de chargement plein écran ou un badge discret de rafraîchissement sans bloquer l’interface utilisateur. La matrice suppose une valeur réussie définie. hasValue() renvoie false pour un résultat undefined.',
  'queryResource.matrixState': 'État du cycle de vie',
  'queryResource.matrixStatus': 'status()',
  'queryResource.matrixWhenToUse': 'Quand l’utiliser & comportement UI',
  'queryResource.matrixInitialLoad': 'Chargement initial (aucune donnée préalable)',
  'queryResource.matrixInitialLoadUsage':
    'Affichez un spinner ou un squelette principal. L’interface n’a pas encore de données à afficher.',
  'queryResource.matrixResolved': 'Résolu / Inactif (données fraîches)',
  'queryResource.matrixResolvedUsage': 'Affichez le contenu normalement. Aucune requête réseau n’est en cours.',
  'queryResource.matrixRefreshingState': 'Revalidation en arrière-plan (SWR / Invalidation)',
  'queryResource.matrixRefreshingUsage':
    'N’AFFICHEZ PAS de spinner plein écran ! Conservez l’affichage des données existantes et ajoutez un indicateur discret. Évite tout scintillement ou écran blanc.',
  'queryResource.matrixInitialError': 'Erreur initiale (aucune donnée préalable)',
  'queryResource.matrixInitialErrorUsage':
    'Affichez une alerte ou un écran d’erreur complet avec bouton de nouvelle tentative.',
  'queryResource.matrixRefreshError': 'Erreur de rafraîchissement (avec données en cache)',
  'queryResource.matrixRefreshErrorUsage':
    'Conservez les données à l’écran et affichez un bandeau ou toast d’avertissement flottant.',
  'queryResource.placementTitle': 'Architecture : Emplacement Composant vs. Service',
  'queryResource.loading': 'Chargement…',
  'queryResource.placementIntro':
    'Où déclarer vos requêtes ? Comme <code>queryResource</code> repose sur l’injection de dépendances d’Angular, il fonctionne aussi bien dans les composants que dans les services. Choisissez l’emplacement idéal selon la portée des données :',
  'queryResource.thPlacement': 'Emplacement',
  'queryResource.thScopeLifetime': 'Portée & Cycle de Vie',
  'queryResource.thStateSharing': 'Partage d’État',
  'queryResource.thCoordination': 'Coordination des Rechargements',
  'queryResource.thRecommendation': 'Recommandé Pour',
  'queryResource.rowComponentPlacement': 'Emplacement Composant',
  'queryResource.rowComponentScope': 'Lié à l’injecteur du composant ; détruit au démontage',
  'queryResource.rowComponentSharing': 'Isolé à une seule instance de composant',
  'queryResource.rowComponentCoord': 'Déclencheurs locaux (query.reload())',
  'queryResource.rowComponentRec': 'Vues isolées, fenêtres modales, formulaires, onglets de détail',
  'queryResource.rowServicePlacement': 'Emplacement Service',
  'queryResource.rowServiceScope': 'Lié à l’injecteur du service ; persiste lors des navigations',
  'queryResource.rowServiceSharing': 'Partagé de manière synchrone entre plusieurs composants et routes',
  'queryResource.rowServiceCoord': 'Coordination globale via méthodes de service et invalidation de tags',
  'queryResource.rowServiceRec': 'Session d’authentification, sélection de base de données, maître-détail',
  'queryResource.tabServicePatternA': 'Modèle A : Session d’Authentification Globale (Service Racine)',
  'queryResource.tabServicePatternADesc':
    'Un service singleton gère currentUser et updateProfile. Plusieurs composants lisent le même Signal sans Subject RxJS ni bus d’événements.',
  'queryResource.tabServicePatternB': 'Modèle B : Maître-Détail Paramétré (Service Fonctionnel)',
  'queryResource.tabServicePatternBDesc':
    'Un service fonctionnel gère activeDatabaseId. Lorsque la liste maîtresse met à jour le Signal, queryResource charge automatiquement les spécifications détaillées.',
  'queryResource.tabComponentPlacement': 'Modèle C : Emplacement Composant (Vue Isolée)',
  'queryResource.tabComponentPlacementDesc':
    'L’emplacement direct dans le composant est l’approche la plus simple lorsque les données sont exclusives à une seule vue, évitant des fichiers de service superflus.',
  'queryResource.simulatedTopbar': 'Barre de Navigation Supérieure Globale',
  'queryResource.simulatedProfile': 'Carte Profil Utilisateur',
  'queryResource.simulatedMasterList': 'Liste Maître (Sélection de Base de Données)',
  'queryResource.simulatedDetailCard': 'Vue Détail (Spécifications Actives)',
  'queryResource.updateNameBtn': 'Modifier le nom',
  'queryResource.componentPlacementAdvice':
    'L’emplacement dans le composant est conseillé quand les données sont limitées à une seule vue. Il s’associe nativement aux inputs Signal input() et se nettoie automatiquement.',
  'queryResource.demo1Section': 'Demande de coalescence et de déduplication',
  'queryResource.demo1SectionDesc':
    'Lorsque deux ou plusieurs composants se montent en même temps et demandent la même clé de requête, <code>QueryClient</code> partage la seule demande de réseau en vol. Les deux composants reçoivent exactement la même réponse avec aucun trafic redondant.',
  'queryResource.demo1PlaygroundTitle': 'Composants indépendants partageant des requêtes réseau en cours',
  'queryResource.demo1PlaygroundDesc':
    "Simule deux composants indépendants (TopbarStatusComponent et DashboardMetricsComponent) montant simultanément et demandant les mêmes métriques de cluster. Cliquez sur « Recharger la requête » pour vérifier qu'un seul appel HTTP réel est émis.",
  'queryResource.badgeDeduplication': 'Dédoublement',
  'queryResource.actualHttpCalls': 'Appels HTTP réels: {0}',
  'queryResource.reloadQuery': 'Recharger la requête',
  'queryResource.widgetATitle': 'Barre de navigation globale',
  'queryResource.widgetASubtitle': 'TopbarStatusComponent (Utilisateurs actifs et statut)',
  'queryResource.widgetBTitle': 'Carte de tableau de bord principal',
  'queryResource.widgetBSubtitle': 'DashboardMetricsComponent (Charge CPU et mémoire)',
  'queryResource.activeUsers': 'Usagers actifs',
  'queryResource.cpuLoad': 'Charge CPU',
  'queryResource.memoryUsage': 'Utilisation de la mémoire',
  'queryResource.status': 'État',
  'queryResource.updated': 'Mise à jour',
  'queryResource.demo2Section': 'Politiques de revalidation et de fraîcheur (Stale-While-Revalidate)',
  'queryResource.demo2SectionDesc':
    "<code>staleTime</code> contrôle pendant combien les données en cache restent fraiches. Si un observateur demande des données pendant qu'elles sont fraiches, elles sont rendues instantanément à partir de la mémoire. Si elles sont périmées, les données en cache sont affichées immédiatement pendant qu'une réinitialisation de fond s'exécute en silence sans effacer le UI (indiqué par <code>status: 'reloading'</code>).",
  'queryResource.focusRefetchNoteTitle': 'Réactualisation au focus de l’onglet',
  'queryResource.focusRefetchNoteBody':
    'Par défaut, refetchOnFocus est désactivé dans ngx-lift pour protéger les API d’entreprise contre les pics de charge. Passez { refetchOnFocus: true } dans les options de la requête pour réactualiser automatiquement au retour sur l’onglet.',
  'queryResource.configuredStaleTime': 'Configuration de staleTime : {0} secondes',
  'queryResource.freshnessBadgeFresh': 'FRESH',
  'queryResource.freshnessBadgeStale': 'STALE',
  'queryResource.networkCalls': 'Appels réseau: {0}',
  'queryResource.triggerReadReload': 'Trigger Lire / Recharger',
  'queryResource.revalidatingAlert': 'Fond de revalidation en cours... UI existant reste interactif !',
  'queryResource.clusterNodes': 'Nœuds des groupes',
  'queryResource.healthyNodes': '{0} / {1} Santé',
  'queryResource.region': 'Région',
  'queryResource.snapshotTime': "Heure d'instantané",
  'queryResource.demo3Section': 'Sondage coordonné avec sensibilisation à la visibilité',
  'queryResource.demo3SectionDesc':
    "Configurez <code>pollInterval</code> pour actualiser périodiquement les requêtes actives. Plusieurs observateurs demandant des intervalles différents sont synchronisés à la plus grande vitesse. L'interrogation périodique s'arrête automatiquement lorsque l'onglet du navigateur est masqué et se reprend immédiatement lorsqu'il est réactivé.",
  'queryResource.demo3PlaygroundTitle': 'Historique du scrutin',
  'queryResource.demo3PlaygroundDesc':
    "Activer les sondages et regarder le pouls cardiaque. Remarquez qu'il s'arrête si vous changez d'onglets !",
  'queryResource.badgePolling': 'Sondages',
  'queryResource.startPolling': 'Début du scrutin (3s)',
  'queryResource.stopPolling': 'Arrêter le scrutin',
  'queryResource.totalPollCycles': 'Cycles de scrutin totaux : {0}',
  'queryResource.ping': 'Ping',
  'queryResource.lastPulse': 'Dernier pouls',
  'queryResource.pollingIdleMsg':
    'Le sondage est actuellement inactif. Cliquez sur "Démarrer le sondage" pour observer en direct les vérifications coordonnées des antécédents.',
  'queryResource.demo4Section': 'Mutations et invalidation par étiquette (mutateResource)',
  'queryResource.demo4SectionDesc':
    '<code>mutateResource</code> gère les écritures asynchrones. Une fois la mutation réussie, elle invalide les balises correspondantes, ce qui fait que toutes les requêtes actives avec ces balises permettent de récupérer automatiquement les dernières données du serveur en arrière-plan.',
  'queryResource.demo4PlaygroundTitle': 'Invalidation par étiquette',
  'queryResource.demo4PlaygroundDesc':
    'Ajouter un nouveau membre. Une fois la mutation terminée, usersQuery refait automatiquement en arrière-plan !',
  'queryResource.badgeMutations': 'Mutations',
  'queryResource.addTeamMember': "Ajouter un membre de l'équipe",
  'queryResource.nameLabel': 'Dénomination',
  'queryResource.namePlaceholder': 'Par exemple, Charlie Brown',
  'queryResource.roleLabel': 'Rôle',
  'queryResource.rolePlatformEngineer': 'Ingénieur plate-forme',
  'queryResource.roleSre': 'Ingénieur de fiabilité du site',
  'queryResource.roleProductDesigner': 'Designer de produits',
  'queryResource.addMemberBtn': 'Ajouter un membre',
  'queryResource.savingBtn': 'Sauver...',
  'queryResource.activeMembersTitle': "Membres actifs de l'équipe",
  'queryResource.thId': 'ID',
  'queryResource.thName': 'Dénomination',
  'queryResource.thRole': 'Rôle',
  'queryResource.diagnosticsSection': 'Développeur Diagnostics & Inspecteur Cache',
  'queryResource.diagnosticsSectionDesc':
    'Enregistrez provideQueryDevtools() une fois dans app.config.ts pour afficher le lanceur flottant en développement. Inspectez les requêtes en bas tout en utilisant l’application.',
  'queryResource.diagnosticsPlaygroundTitle': 'Panneau des requêtes',
  'queryResource.diagnosticsPlaygroundDesc':
    'Recherchez, filtrez et triez les requêtes ; examinez les données, erreurs et délais. Recharger exécute le chargeur sélectionné. Cet aperçu documentaire est aussi activé en production.',
  'queryResource.badgeDiagnostics': 'Diagnostic',
  'queryResource.refreshDiagnostics': 'Rafraîchir les diagnostics',
  'queryResource.diagTotalEntries': 'Total des entrées',
  'queryResource.diagActiveQueries': 'Enquêtes actives',
  'queryResource.diagInactiveQueries': 'Inactif (GC en attente)',
  'queryResource.diagPendingRequests': 'Lectures en attente',
  'queryResource.diagTotalObservers': 'Total Observateurs',
  'queryResource.diagVisibility': 'Visibilité',
  'queryResource.diagVisible': 'Actifs',
  'queryResource.diagHidden': 'Caché/inactif',
  'queryResource.thQueryKey': 'La clé de requête',
  'queryResource.thObservers': 'Observateurs',
  'queryResource.thRemainingGc': 'Compte à rebours de GC',
  'queryResource.thRemainingPoll': 'Le prochain sondage',
  'queryResource.noQueriesCached': "Pas d'entrées de requête actuellement dans le cache.",
  'queryResource.apiReference': 'Référence API',
  'mutateResource.title': 'mutateResource',
  'mutateResource.overview':
    '<code>mutateResource</code> coordonne les écritures asynchrones du serveur (POST, PUT, PATCH, DELETE) avec un invalidation automatique par tag, des stratégies de concurrence intégrées (exhaust, concat, parallel), et un Angular réactif Signals.',
  'mutateResource.featuresTitle': 'Capacités clés',
  'mutateResource.featuresIntro':
    "Contrairement aux requêtes en lecture seule qui déclenchent de façon réactive les changements de paramètres, les mutations s'exécutent strictement sur une interaction utilisateur explicite.",
  'mutateResource.cardTagInvalidationTitle': "Invalidation automatique de l'étiquette",
  'mutateResource.cardTagInvalidationDesc':
    "Invalidez les balises sur le succès d'écriture pour rafraîchir automatiquement tous les observateurs queryResource actifs dans l'application sans recharger manuellement la plomberie.",
  'mutateResource.cardConcurrencyTitle': 'Concurrence configurable',
  'mutateResource.cardConcurrencyDesc':
    'Contrôlez les soumissions simultanées avec "exhaust" (ignore les clics répétés ou les rattache à l\'exécution en cours), "concat" (file FIFO) ou "parallel" (valeur par défaut).',
  'mutateResource.cardSignalsTitle': 'État réactif Signals',
  'mutateResource.cardSignalsDesc':
    'Fournit une valeur réactive, une erreur, un statut ("idle" | "loading" | "resolved" | "error") et des signaux isLoading optimisés pour la détection de changement OnPush.',
  'mutateResource.cardPromiseTitle': 'Retours directs de Promise',
  'mutateResource.cardPromiseDesc':
    "L'appel mutate() renvoie un Promise standard, permettant la syntaxe async/wait et try/catcher dans les gestionnaires d'événements composants.",
  'mutateResource.demo1Section': '1. Étiquette Invalidation avec requêtes actives',
  'mutateResource.demo1SectionDesc':
    "Soumettre une mutation invalide les balises correspondantes, déclenchant immédiatement des mises à jour de l'arrière-plan pour toute instance active queryResource observant ces balises.",
  'mutateResource.demo1PlaygroundTitle': 'Créer un élément & Observer la mise à jour des requêtes',
  'mutateResource.demo1PlaygroundDesc':
    "Soumettre le formulaire pour ajouter un utilisateur. Remarquez comment la table de l'utilisateur se met à jour automatiquement par l'invalidation de la balise sans recharger manuellement les appels!",
  'mutateResource.badgeInvalidation': "Invalidation de l'étiquette",
  'mutateResource.addTeamMember': "Ajouter un membre de l'équipe",
  'mutateResource.nameLabel': 'Dénomination',
  'mutateResource.namePlaceholder': 'Par exemple, Dana Scully',
  'mutateResource.roleLabel': 'Rôle',
  'mutateResource.rolePlatformEngineer': 'Ingénieur plate-forme',
  'mutateResource.roleSre': 'Ingénieur de fiabilité du site',
  'mutateResource.roleProductDesigner': 'Designer de produits',
  'mutateResource.addMemberBtn': 'Ajouter un membre',
  'mutateResource.savingBtn': 'Sauver...',
  'mutateResource.activeMembersTitle': "Membres actifs de l'équipe",
  'mutateResource.thId': 'ID',
  'mutateResource.thName': 'Dénomination',
  'mutateResource.thRole': 'Rôle',
  'mutateResource.demo2Section': '3. Modes de contre-monnaie: échappement, concat et parallèle',
  'mutateResource.demo2SectionDesc':
    'Tester comment différentes stratégies de concurrence gèrent les clics rapides sur un bouton. "exhaust" empêche accidentellement une soumission double en éliminant ou en joignant les clics en dupliques pendant qu\'une mutation est déjà en cours.',
  'mutateResource.demo2PlaygroundTitle': 'Simulation rapide de clics et de devises',
  'mutateResource.demo2PlaygroundDesc':
    'Choisissez un mode, puis cliquez rapidement sur "Trigger 800ms Mutation" plusieurs fois pour voir comment les exécutions sont gérées.',
  'mutateResource.badgeConcurrency': 'Concurrence',
  'mutateResource.modeLabel': 'Stratégie en matière de devises',
  'mutateResource.modeExhaust': 'échappement (Drop clics duplicata rapides - double soumettre garde)',
  'mutateResource.modeConcat': "concat (Invocations queue dans l'ordre)",
  'mutateResource.modeParallel': 'parallèle (Exécuter chaque invocation indépendamment)',
  'mutateResource.triggerMutationBtn': 'Déclencheur de la mutation de 800ms',
  'mutateResource.totalClicks': 'Cliquez sur le bouton total: {0}',
  'mutateResource.actualExecutions': 'Exécutions réelles : {0}',
  'mutateResource.inFlight': 'Actuellement en vol: {0}',
  'mutateResource.recentLogs': "Journal d'exécution",
  'mutateResource.clearLogs': 'Effacer le journal',
  'mutateResource.noLogsYet':
    "Aucune mutation n'a encore été exécutée. Cliquez sur le bouton ci-dessus pour commencer.",
  'mutateResource.demo3Section': "3. État réactif Signals & Récupération d'erreur",
  'mutateResource.demo3SectionDesc':
    "<code>mutateResource</code> gère les erreurs proprement. Lorsqu'une écriture échoue, le signal d'erreur est peuplé, le statut devient \"error\", et le Promise renvoyé rejette pour la manipulation d'essai/de capture.",
  'mutateResource.demo3PlaygroundTitle': 'État Signals & Récupération de la défaillance',
  'mutateResource.demo3PlaygroundDesc':
    "Basculer la simulation de défaillance et déclencher l'action pour inspecter l'état d'erreur réactive.",
  'mutateResource.badgeError': 'Gestion des erreurs',
  'mutateResource.simulateErrorLabel': 'Simuler une erreur de serveur 500',
  'mutateResource.saveSettingsBtn': 'Enregistrer la configuration',
  'mutateResource.statusLabel': 'État',
  'mutateResource.isLoadingLabel': 'isLoading',
  'mutateResource.errorSuccessMsg': 'Configuration sauvegardée avec succès !',
  'mutateResource.apiReference': 'Référence API',
  'injectParams.example1Title': 'Exemple 1: Obtenir tous les paramètres de la route',
  'injectParams.example1Desc':
    "Lorsqu'il est appelé sans argument, renvoie un signal contenant l'objet entier des paramètres :",
  'injectParams.example2Title': 'Exemple 2 : Obtenir un paramètre unique',
  'injectParams.example2Desc':
    "Lorsqu'une clé est spécifiée, retourne la valeur du paramètre correspondant comme signal :",
  'injectParams.example3Title': 'Exemple 3: Transformer les paramètres',
  'injectParams.example3Desc': 'Transformer les paramètres en utilisant une fonction de transformation:',
  'injectParams.example4Title': 'Exemple 4 : Transformer avec la valeur initiale',
  'injectParams.example4Desc': 'Transformer les paramètres avec une valeur initiale et une conversion de type:',
  'injectParams.example4Callout':
    'Lorsque <code>initialValue</code> est fourni en booléen ou en nombre, la fonction <code>transform</code> doit être fournie en retournant le même type.',
  'injectParams.example5Title': "Exemple 5: Exemple d'utilisation complète",
  'injectParams.example5Desc': "Exemple complet montrant différents modèles d'utilisation:",
  'injectParams.example6Title': 'Exemple 6: Injecteur personnalisé',
  'injectParams.example6Desc':
    "Passez un <code>Injector</code> personnalisé via l'objet options pour accéder aux paramètres de route en dehors d'un contexte d'injection ambiante (comme les fonctions d'aide à l'intérieur ou les services dynamiques) :",
  'injectParams.title': 'injectParams',
  'injectParams.overview':
    "La fonction <code>injectParams</code> fournit un signal réactif pour les paramètres de route, qui s'actualisent automatiquement lors de la navigation.",
  'injectParams.apiSummary': 'Injecte et transforme les paramètres de route en signaux réactifs.',
  'injectParams.paramKeyOrTransform':
    "Lorsqu'une chaîne est fournie, retourne la valeur de ce paramètre de route. Lorsqu'une fonction est fournie, elle traite tous les paramètres de route. Si elle est omise, retourne tous les paramètres.",
  'injectParams.paramOptions':
    'Objet de configuration contenant la fonction de transformation, initialValue et/ou injecteur.',
  'injectParams.returnsDesc': 'Un signal contenant le paramètre de route value(s) ou le résultat transformé.',
  'injectParams.usagePatterns': "Modèles d'utilisation",
  'injectParams.pattern1': "Pas d'arguments : retourne le signal avec tous les paramètres de route",
  'injectParams.pattern2':
    "Clé de chaîne : retourne le signal avec une valeur de paramètre spécifique (ou null si ce n'est pas présent)",
  'injectParams.pattern3': 'Fonction de transformation: Retourne le signal avec des paramètres transformés',
  'injectParams.pattern4': 'Avec options: Permet la conversion initiale de la valeur et du type',
  'injectQueryParams.title': 'injectQueryParams',
  'injectQueryParams.overview':
    'La fonction <code>injectQueryParams</code> fournit un signal réactif pour les paramètres de requête URL.',
  'injectQueryParams.apiSummary': 'Injecte et transforme les paramètres de requête de route en signaux réactifs.',
  'injectQueryParams.paramKeyOrTransform':
    "Lorsqu'une chaîne est fournie, retourne la valeur de ce paramètre de requête. Lorsqu'une fonction est fournie, elle traite tous les paramètres de requête. Si elle est omise, retourne tous les paramètres de requête.",
  'injectQueryParams.paramOptions':
    'Objet de configuration contenant la fonction de transformation, initialValue et/ou injecteur.',
  'injectQueryParams.returnsDesc': 'Un signal contenant le paramètre de requête value(s) ou un résultat transformé.',
  'injectQueryParams.example1Title': "Exemple 1: Obtenir tous les paramètres d'interrogation",
  'injectQueryParams.example1Desc': 'Obtenez tous les paramètres de requête comme un signal:',
  'injectQueryParams.example2Title': 'Exemple 2 : Obtenir un paramètre de requête unique',
  'injectQueryParams.example2Desc': 'Obtenez un paramètre de requête spécifique par nom :',
  'injectQueryParams.example3Title': 'Exemple 3: Transformer les paramètres de requête',
  'injectQueryParams.example3Desc':
    'Transformer les paramètres de requête en utilisant une fonction de transformation :',
  'injectQueryParams.example4Title': 'Exemple 4 : Transformer avec la valeur initiale',
  'injectQueryParams.example4Desc':
    'Transformer les paramètres de requête avec une valeur initiale et une conversion de type :',
  'injectQueryParams.example5Title': "Exemple 5: Exemple d'utilisation complète",
  'injectQueryParams.example5Desc': "Exemple complet montrant différents modèles d'utilisation:",
  'injectQueryParams.example6Title': 'Exemple 6: Injecteur personnalisé',
  'injectQueryParams.example6Desc':
    "Passez un <code>Injector</code> personnalisé via l'objet options pour accéder aux paramètres de requête de route en dehors d'un contexte d'injection ambiante (comme les fonctions d'aide à l'intérieur ou les services dynamiques) :",
  'createTrigger.title': 'createTrigger',
  'createTrigger.overview':
    "La fonction <code>createTrigger</code> fournit une manière de déclencher manuellement des recalculs de signaux en référençant le signal d'origine qu'elle crée. Similaire à un sujet RxJS, l'appel de <code>next()</code> augmente le compteur de signaux et informe les effets ou les signaux calculés dépendants.",
  'createTrigger.apiSummary':
    "Crée un signal d'origine qui peut être utilisé pour déclencher manuellement des recalculs de signaux.",
  'createTrigger.propValue': 'Un signal qui retourne le nombre de fois que le déclencheur a été appelé (démarre à 0).',
  'createTrigger.propNext': 'Une méthode pour déclencher la mise à jour du signal.',
  'createTrigger.returnsDesc': 'Un objet exposant le signal de valeur et la méthode de déclenchement next().',
  'createTrigger.example1': 'Exemple 1: Utilisation de base',
  'createTrigger.example1Desc':
    "Créer un déclencheur et l'utiliser pour déclencher manuellement des re-computations de signal :",
  'createTrigger.example2': 'Exemple 2: Effet conditionnel',
  'createTrigger.example2Desc': "Utilisez la valeur de déclenchement sous condition pour empêcher l'initialisation :",
  'createTrigger.btnSeeConsole': 'Voir le journal Console',
  'createTrigger.callout':
    "Au départ, <code>createTrigger's value()</code> retourne 0. Chaque fois que <code>next</code> est explicitement appelé, la valeur ajoute 1.",
  'pageContainer.title': 'Page Conteneur',
  'pageContainer.overview':
    "Le composant <code>cll-page-container</code> fournit une enveloppe standardisée et réactive pour les pages Clarity. Elle encapsule une typographie d'en-tête uniforme, un padding fluide et un espace d'espacement cohérent tout en offrant un emplacement de projection de contenu pour des vues, des cartes, des formulaires et des grilles arbitraires.",
  'pageContainer.example1': 'Exemple 1: Conteneur de page de base',
  'pageContainer.example1Desc':
    'Définir un titre obligatoire et projeter des éléments de vue arbitraire dans la fente de la page principale.',
  'pageContainer.example1Badge': 'Page Shell',
  'pageContainer.example2': 'Exemple 2: Espacement personnalisé et largeurs maximales',
  'pageContainer.example2Desc':
    "Passez des classes de mise en page Clarity ou des classes d'utilitaire personnalisées à customClass pour contrôler la densité de mise en page.",
  'pageContainer.example2Badge': 'Réceptif',
  'pageContainer.example3': 'Exemple 3: Marquage dynamique HTML dans le titre de la page',
  'pageContainer.example3Desc':
    "L'entrée de titre rend via innerHTML, permettant des badges, des indicateurs d'état ou des balises directement dans l'en-tête.",
  'pageContainer.example3Badge': 'Titre de HTML',
  'pageContainer.demoUserManagement': 'Gestion des utilisateurs',
  'pageContainer.demoBodyContent': 'Contenu du corps de page rendu dans la fente par défaut.',
  'pageContainer.demoClusterSettings': 'Paramètres des grappes',
  'pageContainer.demoConfigured': 'Configuré avec des classes de style personnalisées.',
  'pageContainer.demoAuditLog': "Journal d'audit <span class='badge badge-info'>Live</span>",
  'pageContainer.demoLogStream': 'Enregistrez les entrées en flux ici en temps réel.',
  'pageContainer.apiSummary': "Enveloppe de page standardisée avec des marges réactives et une typographie d'en-tête.",
  'pageContainer.inputTitle': "Le titre s'affiche en haut du conteneur. Rendu via [innerHTML].",
  'pageContainer.inputCustomClass':
    "Classes CSS supplémentaires appliquées directement à l'élément racine du conteneur.",
  'pageContainer.contentProjectionDesc':
    'Emplacement <ng-content /> par défaut pour placer tout le contenu de la page principale sous le titre.',
  'alert.title': 'Alerte',
  'alert.overview':
    "Les alertes sont des bandeaux qui attirent l'attention de l'utilisateur sur des messages importants. Les éléments visuels tels que les icônes et les couleurs indiquent le type et l'urgence de l'information communiquée. Utilisez les alertes pour fournir des informations critiques nécessitant une attention immédiate dans le contexte actuel.",
  'alert.example1': "Exemple 1: Afficher la réponse d'erreur API",
  'alert.example1Desc':
    "Lors de l'affichage des réponses d'erreur de APIs, utilisez l'entrée d'erreur pour passer les détails d'erreur. L'alerte affiche le message d'erreur de l'objet de réponse ou revient à HttpErrorResponse.",
  'alert.example1Badge': 'Erreur API',
  'alert.example2': 'Exemple 2 : Affichage du contenu personnalisé',
  'alert.example2Desc':
    "Le contenu est rendu à l'aide de innerHTML, permettant un formatage riche et des balises HTML intégrées à différents niveaux d'alerte.",
  'alert.example2Badge': 'Texte riche',
  'alert.example3': 'Exemple 3 : Projection du contenu',
  'alert.example3Desc':
    "Le composant d'alerte prend en charge la projection de contenu via le contenu ng, permettant l'inclusion de structures complexes HTML et de composants pour enfants.",
  'alert.example3Badge': 'Ng-contenu',
  'alert.example4': 'Exemple 4: Taille compacte (isSmall)',
  'alert.example4Desc':
    "Utilisez l'entrée isSmall pour afficher une alerte compacte efficace dans l'espace pour les tiroirs et les petits conteneurs.",
  'alert.example4Badge': 'Compact',
  'alert.example5': 'Exemple 5: Alertes légères',
  'alert.example5Desc':
    "Utilisez des alertes légères sans bordure à l'intérieur des cartes, des tables et des plans d'état imbriqués.",
  'alert.example5Badge': 'Léger',
  'alert.example6': "Exemple 6: Alertes au niveau de l'application",
  'alert.example6Desc':
    "Placer des alertes de haut niveau au niveau de l'application au sommet de tout le contenu et de la navigation.",
  'alert.example6Badge': "Niveau de l'application",
  'alert.apiSummary':
    "Composant d'alerte qui affiche des messages importants avec divers types et des styles de thème Clarity.",
  'alert.inputAlertType': 'Une des valeurs: "info", "warning", "success", "danger", "neutral", "loading", "unknown".',
  'alert.inputIsAppLevel':
    "Drapeau booléen pour les alertes au niveau de l'application affichées en haut du port de vue.",
  'alert.inputIsSmall': 'Drapeau booléen pour calibrage compact dans des contenants ou tiroirs serrés.',
  'alert.inputIsLightweight': 'Drapeau booléen pour un style léger sans bordures.',
  'alert.inputError': "Un objet HttpErrorResponse ou erreur pour afficher les détails d'erreur.",
  'alert.inputContent':
    "Une chaîne contenant le contenu du message d'alerte. Prise en charge des balises HTML via innerHTML.",
  'alert.contentProjectionDesc':
    'Le composant supporte la projection de contenu ng pour les structures complexes HTML et Angular.',
  'alert.projectionNotice': 'Plusieurs erreurs sont énumérées ci-dessous par projection de contenu :',
  'alert.errUndefined': 'Impossible de lire indéfini.',
  'alert.errObject': 'Impossible de télécharger un objet.',
  'alert.serverDown': 'Le serveur est en panne',
  'alert.contentSuccess': 'Je suis un contenu réussi',
  'alert.contentInfo': 'Je suis un contenu info',
  'alert.contentWarning': 'Je suis un avertissement.',
  'alert.contentDanger': 'Je suis un danger.',
  'alert.contentHtml': "<strong>Hello world</strong>, j'aime le clr-lift!",
  'alert.contentSmall': 'Je suis une petite alerte.',
  'alert.contentNeutral': 'Je suis neutre.',
  'alert.contentLoading': 'Je suis un contenu de chargement',
  'alert.contentUnknown': 'Je suis un contenu inconnu',
  'alert.contentAppLevel': "Alerte au niveau de l'application depuis l'entrée du contenu",
  'alert.contentAppProjection': "Alerte de niveau d'application de la projection",
  'alert.btnView': 'Affichage',
  'callout.title': 'Appel',
  'callout.overview':
    "Le <code>cll-callout</code> est un composant qui affiche une boîte d'information conçue pour mettre en évidence des notes importantes, des conseils, des avertissements ou des instructions préalables avec un affichage d'icônes réactif et une sensibilité au thème.",
  'callout.example1': 'Exemple 1 : Callout informationnel de base',
  'callout.example1Desc':
    'Projecter des messages texte simples ou des mises en évidence en utilisant la projection de contenu par défaut.',
  'callout.example2': 'Exemple 2: Listes et liens',
  'callout.example2Desc':
    'Les Callouts gèrent les listes formatées et les hyperliens externes de façon transparente en mode clair et sombre.',
  'callout.example3': 'Exemple 3: Riche contenu avec des en-têtes et des insignes',
  'callout.example3Desc':
    "Composez les en-têtes, les paragraphes descriptifs et les badges Clarity à l'intérieur du conteneur de projection d'appel.",
  'callout.example1Note': 'Veuillez noter que toutes les modifications de configuration prennent effet immédiatement.',
  'callout.example2Theme': 'Prend en charge à la fois les thèmes clairs et sombres automatiquement.',
  'callout.example2Docs': 'Pour plus de détails, consultez la documentation du système de conception Clarity.',
  'callout.example3Tip': 'Conseil pro pour les déploiements de production',
  'callout.example3DescText':
    'Assurez-vous que les limites de ressources sont explicitement configurées avant de déclencher le processus de déploiement.',
  'callout.example3LabelDeployment': 'Déploiement',
  'callout.example3LabelValidated': 'Validé',
  'themeToggle.title': 'Thème toggle',
  'themeToggle.exercise':
    'Changez de thème et rechargez : ThemeService conserve cds-theme dans localStorage et l’applique au corps du document. Les contrôles partagent le service. changeTheme signale l’action du sélecteur, pas les appels au service.',
  'themeToggle.overview':
    'Le <code>cll-theme-toggle</code> et le <code>ThemeService</code> permettent de passer de manière fluide entre les modes clair et sombre de Clarity avec la réactivité Signal et la persistance dans le stockage local.',
  'themeToggle.callout':
    'Le bouton bascule automatiquement rend une icône de lune en mode lumière et une icône de soleil en mode sombre, y compris des tooltips localisés et des annonces aria accessibles.',
  'themeToggle.example1Badge': 'Toggle interactif',
  'themeToggle.example1Desc':
    "Cliquez sur le bouton basculer pour changer de thème et observer l'émission d'événements réactifs :",
  'themeToggle.currentTheme': 'Thème actuel Signal:',
  'themeToggle.inspectorTitle': 'Thème Signal Inspecteur',
  'themeToggle.inspectorDesc': 'État en direct synchronisé avec document.body et localStorage',
  'themeToggle.example2Badge': 'Contrôle programmatique',
  'themeToggle.example2Desc':
    'Utilisez ThemeService pour lire le thème actuel de manière réactive ou programmatique, définissez un thème spécifique :',
  'themeToggle.setLight': 'Définir le thème de la lumière',
  'themeToggle.setDark': 'Définir le thème sombre',
  'themeToggle.example3': 'Exemple 3: Sélecteurs CSS / SCSS pour le stylage des thèmes',
  'themeToggle.example3Desc':
    'Les composants et les styles globaux peuvent cibler [cds-theme="dark"] sur le corps ou via :host-context([cds-theme="dark"]):',
  'themeToggle.serviceSummary':
    "Service injectable fourni en racine pour la gestion de l'état du thème de l'application.",
  'spinner.title': 'Épineur',
  'spinner.overview':
    "Un spinner est un indicateur visuel d'un processus en cours, initié par l'utilisateur. Clarity dispose de deux types de spinners, chacun avec son propre cas d'usage : <strong>Spinners de page</strong> pour suivre la progression d'une opération liée à toute une page, et <strong>Spinners en ligne</strong> pour suivre la progression d'une opération liée à un composant spécifique.",
  'spinner.example1': 'Exemple 1: Spinner par défaut',
  'spinner.example1Desc': 'Le spinner par défaut est centré, grand, et a un affichage de bloc.',
  'spinner.example2': 'Exemple 2: Variations de taille',
  'spinner.example2Desc':
    'Les spinners peuvent être affichés en différentes tailles : grand (par défaut), moyen et petit.',
  'spinner.example3': "Exemple 3: Options d'alignement",
  'spinner.example3Desc': "Contrôler l'alignement du spinner en utilisant l'entrée centrale.",
  'spinner.example4': 'Exemple 4 : Style personnalisé',
  'spinner.example4Desc': 'Appliquer les classes CSS personnalisées au spinner pour un style supplémentaire.',
  'spinner.example5': 'Exemple 5 : Spinner en ligne',
  'spinner.example5Desc':
    "Utilisez l'entrée en ligne pour afficher le spinner en tant qu'élément de bloc en ligne, utile pour aligner les spinners dans le texte ou d'autres éléments en ligne.",
  'spinner.large': 'Grande (par défaut) :',
  'spinner.medium': 'Moyenne:',
  'spinner.small': 'Petit:',
  'spinner.centered': 'Centrer (par défaut) :',
  'spinner.leftAligned': 'Aligné à gauche:',
  'spinner.loading': 'Chargement...',
  'tooltip.title': 'Outils',
  'tooltip.overview':
    "Le composant Tooltip permet d'afficher de manière flexible des informations supplémentaires, des indices ou du contenu interactif. Il prend en charge les actions de survol et de copie dans le pop-up du contenu, des options de délai configurables, une position automatique, la gestion de l'accessibilité avec le blocage du focus, l'interaction en cliquant en dehors, les opérations au clavier, et la prise en charge du mode sombre.",
  'tooltip.example1': 'Exemple 1: Outillage de base',
  'tooltip.example1Desc':
    "Dans cette utilisation, vous pouvez simplement ajouter un infobulle en spécifiant le contenu directement ou via la directive d'attribut cllTooltipContent. Des configurations supplémentaires telles que le délai de cache et la largeur peuvent être personnalisées selon vos besoins.",
  'tooltip.example2': 'Exemple 2: Tooltip avec contenu dynamique',
  'tooltip.example2Desc':
    "Tooltip accepte le contenu dynamique fourni par les modèles Angular. Vous pouvez spécifier les modèles en utilisant ng-template et les lier au composant tooltip pour l'affichage dynamique.",
  'tooltip.example3': 'Exemple 3 : Création de composants dynamiques',
  'tooltip.example3Desc':
    'Tooltip peut rendre les composants Angular créés dynamiquement en utilisant ComponentRef ou type de composant.',
  'tooltip.example4': "Exemple 4 : Positions d'outils",
  'tooltip.example4Desc':
    'Prise en charge de 12 orientations de placement différentes avec détection de collision intelligente.',
  'tooltip.apiSummary':
    'Directif pour ajouter une fonctionnalité de tooltip à des éléments avec une position automatique et une détection de collision.',
  'tooltip.basic1': 'Outillage de base 1',
  'tooltip.basic2': "Pile d'outils de base 2 avec retard 500ms",
  'tooltip.empty': "Le contenu vide n'affichera pas l'outil",
  'tooltip.templateHover': 'TemplateRef Exemple Hover',
  'tooltip.templateText': 'Un excellent tooltip:',
  'tooltip.templateCallout': "Vous pouvez également mettre un composant à l'intérieur ng-template",
  'tooltip.contextCallout':
    "cllTooltipContentContext est optionnel, c'est le contexte passé au ng-template lors de la création de la vue.",
  'tooltip.componentRefHover': 'Exemple de référence de composant',
  'toast.title': 'Toast',
  'toast.overview':
    "Les messages Toast servent d'une manière user-friendly pour communiquer des événements à priorité moyenne que l'utilisateur pourrait souhaiter consulter plus tard. Ces messages apparaissent temporairement à l'écran et peuvent être stockés dans un panneau de notifications jusqu'à ce qu'ils soient fermés ou expirés.",
  'toast.example1': 'Exemple 1: Conteneur de Toast de configuration',
  'toast.example1Desc':
    'Pour implémenter les messages toast, importez ToastContainerComponent depuis clr-lift et incluez <cll-toast-container [timeoutSeconds]="8" /> dans votre composant racine.',
  'toast.example2': 'Exemple 2: Créer un Toast avec addToast',
  'toast.example2Desc':
    'Utilisez addToast pour passer un objet toast avec les propriétés requises (titre et description) et les configurations optionnelles.',
  'toast.example3': 'Exemple 3: Shorthand APIs',
  'toast.example3Desc': 'Quatre shorthands APIs sont fournis pour créer des toasts avec différents types de statut :',
  'toast.serviceSummary': 'Service pour la création et la gestion des notifications de toast.',
  'toast.guidelinesTitle': "Lignes directrices relatives à l'utilisation",
  'toast.doTitle': 'Faites:',
  'toast.do1':
    'Fournir la navigation : Inclure un lien ou un emplacement permettant aux utilisateurs de naviguer à partir du toast.',
  'toast.do2':
    "Utilisez les timestampes relatives : Affichez les timetampes par rapport à l'utilisateur (par exemple, « il y a 1 heure » au lieu d'une date absolue).",
  'toast.do3':
    'Garder les titres Court : Utilisez un titre court et succinct (max. 35 caractères) qui transmet rapidement le message de haut niveau.',
  'toast.do4':
    "Descriptions consommables de l'artisanat : Conservez les descriptions concises (max 156 caractères) pour une consommation facile.",
  'toast.dontTitle': 'Ne pas:',
  'toast.dont1': 'Utilisez "Fermer" comme action: Cliquez sur le bouton de fermeture devrait fermer le toast.',
  'toast.dont2':
    'Actions surpeuplées: Limitez les messages toasts à un maximum de 2 actions; prioriser les plus importantes.',
  'toast.dont3':
    "Inclure les identifiants d'objet dans le titre : Évitez d'utiliser les identifiants d'objet dans le titre; utilisez-les seulement dans la description.",
  'toast.dont4': "Ajouter des icônes : Pour maintenir la clarté, évitez d'ajouter des icônes aux messages toasts.",
  'toast.dont5':
    "Afficher les toasts non pertinents: Afficher les toasts seulement lorsque les informations sont toujours pertinentes pour l'utilisateur.",
  'toast.optionsTitle': 'Interface ToastOptions',
  'toast.containerSummary':
    'Composant de contenant qui contient toutes les notifications de toast. Doit apparaître seulement une fois dans votre demande.',
  'multiAlerts.title': 'Alertes (multiples)',
  'multiAlerts.overview':
    "Fréquemment, il est nécessaire de montrer plusieurs alertes, particulièrement celles du niveau d'application positionnées en haut. La bibliothèque clr-lift offre deux outils essentiels : <code>AlertContainerComponent</code> et <code>AlertService</code> pour ajouter, supprimer et gérer les alertes de manière programmée.",
  'multiAlerts.example1': "Exemple 1: Conteneur d'alerte de configuration",
  'multiAlerts.example1Desc':
    "Importer AlertContainerComponent et inclure <cll-alert-container /> au-dessus de la balise d'en-tête Clarity dans le conteneur principal.",
  'multiAlerts.example2': 'Exemple 2: Utilisation de base',
  'multiAlerts.example2Desc':
    'Importez AlertService et utilisez ses méthodes addAlert(), deleteAlert() ou clearAlerts() pour gérer efficacement les alertes.',
  'multiAlerts.example3': 'Exemple 3 : Utilisation avancée avec éléments interactifs',
  'multiAlerts.example3Desc':
    "Placez des éléments interactifs (tels que des boutons ou des liens) à n'importe quelle position dans votre message en utilisant le contenu avec targetSelector, ou fournissez des boutons d'action structurés.",
  'multiAlerts.example4': 'Exemple 4 : Démo interactive',
  'multiAlerts.example4Desc':
    "Essayez d'ajouter différents types d'alertes et de supprimer les alertes en utilisant les boutons ci-dessous:",
  'multiAlerts.serviceSummary': 'Service de gestion programmatique de plusieurs alertes.',
  'multiAlerts.alertTypeTitle': "Type d'alerte",
  'multiAlerts.containerSummary':
    "Composant de conteneur qui affiche toutes les alertes. Doit être placé au-dessus de la balise d'en-tête Clarity dans le conteneur principal.",
  'fileReader.title': 'Lecteur de fichiers',
  'fileReader.overview':
    "Le <code>FileReaderComponent</code> permet de parcourir et de lire rapidement le contenu des fichiers texte. Il prend en charge le choix de fichiers, la lecture du contenu en texte brut ou en chaîne base64, la validation de la taille du fichier, et émet des événements lorsqu'un fichier est sélectionné ou supprimé.",
  'fileReader.example1': 'Exemple 1 : Lecteur de fichiers de base',
  'fileReader.example1Desc': 'Utilisation de base avec intégration de contrôle de forme:',
  'fileReader.example2': 'Exemple 2: Lecteur de fichiers de certificat avec validation',
  'fileReader.example2Desc':
    "Lecteur de fichiers avec validation du certificat et affichage de l'affichage du certificat:",
  'fileReader.apiSummary':
    'Composant pour parcourir et lire le contenu des fichiers avec prise en charge de la validation.',
  'fileReader.feature1': 'Navigation et sélection des fichiers',
  'fileReader.feature2': 'Lecture du contenu sous forme de texte simple ou de base64 chaîne codée',
  'fileReader.feature3': 'Validation de la taille du fichier',
  'fileReader.feature4': "Gestion des erreurs d'analyse de contenu",
  'fileReader.feature5': 'Intégration du contrôle des formulaires',
  'keyValueInputs.title': 'Entrées de valeur clés',
  'keyValueInputs.overview':
    "Le <code>KeyValueInputsComponent</code> est un composant Angular conçu pour faciliter l'entrée de paires clé-valeur. Il permet à l'utilisateur d'ajouter, d'éditer et de supprimer des paires clé-valeur avec l'intégration de FormArray, la validation en temps réel et une navigation au clavier intelligente.",
  'keyValueInputs.example1': 'Exemple 1: Utilisation de base',
  'keyValueInputs.example1Desc':
    'Créer un formulaire avec un FormArray et utiliser KeyValueInputsComponent pour gérer les paires de valeurs clés :',
  'keyValueInputs.example2': 'Exemple 2 : Démo interactive',
  'keyValueInputs.example2Desc':
    "Essayez d'ajouter, d'éditer et de supprimer des paires de valeurs clés dans le formulaire ci-dessous :",
  'keyValueInputs.callout':
    "Découvrez comment le KeyValueInputsComponent exploite le UniqueValidator pour effectuer la validation contre les contrôles clés. Cliquez ici pour savoir comment l'unicité est mise en œuvre dans les champs clés.",
  'keyValueInputs.formOutput': 'Votre sortie de la valeur du formulaire :',
  'keyValueInputs.keyHelper': "clé de propriété de l'exécution temps",
  'keyValueInputs.valueHelper': "Valeur de la propriété temps d'exécution",
  'keyValueInputs.addText': 'ajouter une valeur clé',
  'keyValueInputs.apiSummary':
    'Composant pour gérer des entrées dynamiques de paires clé-valeur dans les formulaires Angular.',
  'statusIndicator.title': 'Indicateur de situation',
  'statusIndicator.overview':
    "Le <code>StatusIndicatorComponent</code> affiche un indicateur d'état avec une icône et du texte. Il prend en charge divers types d'état (erreur, succès, avertissement, inconnu, inactif, en attente), des tailles d'icônes personnalisables, et des outils d'information complémentaires optionnels.",
  'statusIndicator.example1': 'Exemple 1: Utilisation de base',
  'statusIndicator.example1Desc': "Afficher les indicateurs d'état avec différents types d'état et tailles d'icônes :",
  'statusIndicator.example2': 'Exemple 2: Avec Tooltip',
  'statusIndicator.example2Desc':
    "Ajouter des bouts d'outils aux indicateurs d'état pour obtenir des renseignements contextuels supplémentaires :",
  'statusIndicator.types': "Types d'état",
  'statusIndicator.iconSizeTshirt': "Taille de l'icône (T-Shirt Taille)",
  'statusIndicator.iconSizeNumber': "Taille de l'icône (nombre)",
  'statusIndicator.statusError': 'Erreur',
  'statusIndicator.statusSuccess': 'Succès',
  'statusIndicator.statusWarning': 'Avertissement',
  'statusIndicator.statusUnknown': 'Inconnu',
  'statusIndicator.statusInactive': 'Inactif',
  'statusIndicator.statusPending': 'En attente',
  'statusIndicator.tooltipError': "décrire la raison de l'erreur",
  'statusIndicator.tooltipSuccess': 'le statut est le succès',
  'statusIndicator.tooltipWarning': "l'état est un avertissement",
  'statusIndicator.tooltipUnknown': 'statut inconnu',
  'statusIndicator.tooltipInactive': 'État inactif',
  'statusIndicator.tooltipPending': 'certains en attente se produisent',
  'statusIndicator.apiSummary': "Composant pour afficher des indicateurs d'état avec des icônes et du texte.",
  'certificate.title': "Panneau d'affichage du certificat (Visionneur)",
  'certificate.overview':
    "Le <code>CertificateSignpostComponent</code>, un composant Angular, interprète une chaîne PEM et affiche le contenu du certificat en cliquant sur l'icône du certificat. Intégré de manière fluide à Clarity, ce composant affiche des informations critiques telles que l'état du certificat, la période de validité, les informations de l'émetteur et les valeurs de hachage.",
  'certificate.example1': 'Exemple 1: Parsing Raw PEM',
  'certificate.example1Desc': 'Analyser et afficher une chaîne de certificats PEM brute :',
  'certificate.example2': 'Exemple 2: Parsing PEM (Base64 encodée)',
  'certificate.example2Desc':
    "Lorsque les chaînes PEM sont encodées Base64, basculez pemEncoded pour décoder avant d'analyser :",
  'idleDetection.utilOverview':
    "La détection d'inactivité est le processus de surveillance de l'activité de l'utilisateur et de détermination de quand un utilisateur devient inactif. Cela est particulièrement utile pour les applications nécessitant que les utilisateurs restent connectés, car cela permet au système de prendre des actions appropriées lorsqu'un utilisateur cesse d'interagir avec l'application, comme l'avertir d'un temps d'expiration imminent ou de se déconnecter automatiquement après une période d'inactivité.",
  'idleDetection.utilOverviewDesc':
    "Le service de détection Idle fournit des durées de ralenti et de temps d'arrêt configurables, une réinitialisation automatique de l'activité de l'utilisateur, des émissions d'événements pour les phases de ralenti et de temps d'arrêt, et une prise en charge de la programmation réactive via les observables RxJS.",
  'idleDetection.utilExample1Title': "Exemple 1 : Configurer la détection d'idle à l'échelle mondiale",
  'idleDetection.utilExample1Desc':
    "Configurer les durées de ralenti et d'arrêt à l'échelle mondiale en utilisant la classe de configuration:",
  'idleDetection.utilPhaseCallout':
    "Il y a deux phases de détection au ralenti : la phase de détection <strong>idle</strong> et la phase d'élimination <strong>timeout</strong>.",
  'idleDetection.utilPhase1':
    "<strong>Phase de détection d'inactivité</strong> : Supposons que vous configuriez <code>idleDurationInSeconds</code> à 5 * 60 (5 minutes). À partir du moment où il n'y a plus d'action sur le site, vous entrez dans cette phase. Après 5 minutes, la détection d'inactivité se termine, indiquant que vous avez été inactif pendant un long temps. Vous pouvez vous abonner à l'observable <code>onIdleEnd()</code>, qui émettra à ce moment. Une fois cette phase terminée, vous entrerez dans la deuxième phase.",
  'idleDetection.utilPhase2':
    "<strong>Phase de timeout</strong> : Lorsque vous entrez dans cette phase, le compteur commence immédiatement à partir de la valeur de <code>timeoutDurationInSeconds</code>. Vous pouvez vous abonner à l'observable <code>onCountDown()</code> pour obtenir la valeur du compteur. Lorsque le compteur atteint 0, la <strong>phase de timeout</strong> se termine. Vous pouvez vous abonner à l'observable <code>onTimeoutEnd()</code> pour savoir quand la <strong>phase de timeout</strong> se termine. À ce point, vous pouvez déconnecter l'utilisateur ou effectuer d'autres actions.",
  'idleDetection.utilExample2Title': 'Exemple 2: Configuration du module',
  'idleDetection.utilExample2Desc': 'Fournissez la configuration dans votre NgModule:',
  'idleDetection.utilExample3Title': "Exemple 3 : Configuration de l'application autonome",
  'idleDetection.utilExample3Desc': 'Fournir la configuration dans une application autonome:',
  'idleDetection.utilExample4Title': 'Exemple 4: Utiliser IdleDetectionService dans le composant',
  'idleDetection.utilExample4Desc': 'Abonnez-vous aux observables du service pour réagir aux événements inactifs :',
  'idleDetection.utilExample5Title': 'Exemple 5: Utiliser IdleDetectionComponent',
  'idleDetection.utilExample5Desc':
    "Nous fournissons un composant dans <code>clr-lift</code> qui affiche un dialogue modale Clarity lorsqu'un utilisateur est inactif. Le dialogue apparaîtra lorsque la phase de détection d'inactivité se termine et commence à compter à rebours. Une fois que le compteur se termine, vous pouvez intégrer le gestionnaire <code>timeout</code> dans votre composant pour effectuer des logiques personnalisées telles que nettoyer le token localStorage et rediriger l'utilisateur vers la page de connexion.",
  'idleDetection.utilExample5ParamDesc':
    'Les paramètres <code>idleDurationInSeconds</code> et <code>timeoutDurationInSeconds</code> sont optionnels. Lorsque ces paramètres sont passés, ils écrasent la configuration passée par <code>provideIdleDetectionConfig</code>.',
  'idleDetection.utilDialogPreview': 'La boîte de dialogue se présente comme suit :',
  'idleDetection.title': "Détection de l'aiguille",
  'idleDetection.exercise':
    'Démarrez, puis restez inactif 3 secondes. L’avertissement compte 10 secondes. L’activité ne ferme pas l’avertissement ouvert ; confirmez explicitement. Arrêter libère les temporisateurs.',
  'idleDetection.overview':
    "Le composant <code>cll-idle-detection</code> surveille l'inactivité de l'utilisateur à travers les événements DOM (déplacements de la souris, frappes, défilements et touche). Lorsque la durée d'inactivité expire, il ouvre un dialogue de comptage à rebours accessible Clarity et émet un événement (timeout).",
  'idleDetection.example1': 'Exemple 1 : Simulation interactive de la boîte de dialogue Idle',
  'idleDetection.example1Desc':
    'Démarrer une simulation rapide de 3 secondes pour afficher le modal de compte à rebours Clarity en action:',
  'idleDetection.example2': 'Exemple 2: Configuration globale avec provideIdleDetectionConfig',
  'idleDetection.example2Desc':
    "Définissez les intervalles de ralenti et de temps d'utilisation par défaut dans appConfig en utilisant provideIdleDetectionConfig.",
  'idleDetection.apiSummary':
    "Composant de dialogue modale Clarity affichant le compteur de timeout en cas d'inactivité.",
  'idleDetection.inputIdleDuration':
    "Durée de l'inactivité en secondes avant l'affichage du modal de compte à rebours. Surpasse la configuration globale si spécifiée.",
  'idleDetection.callout':
    'Démarrez, puis restez inactif 3 secondes. L’avertissement compte 10 secondes. L’activité ne ferme pas l’avertissement ouvert ; confirmez explicitement. Arrêter libère les temporisateurs.',
  'idleDetection.inputTimeoutDuration':
    "Durée de la phase de compte à rebours en secondes avant l'expiration de la session. Dépasse la configuration globale si spécifiée.",
  'idleDetection.outputTimeout':
    "Emits vide quand le compte à rebours atteint 0 sans la reconnaissance de l'utilisateur.",
  'idleDetection.serviceSummary':
    "Service de surveillance de l'activité de l'utilisateur et de détection des périodes inactives.",
  'idleDetection.methodSetConfig':
    'Définit la configuration de détection au ralenti. Remplace la configuration globale si elle est fournie.',
  'idleDetection.methodStartWatching':
    "Démarre la surveillance de l'activité de l'utilisateur pour la détection au ralenti.",
  'idleDetection.methodClearTimers': 'Efface tous les minuteurs actifs et arrête la surveillance.',
  'idleDetection.methodOnIdleEnd':
    'Observable qui émet lorsque la phase de ralenti se termine et que le compte à rebours commence.',
  'idleDetection.methodOnTimeoutEnd': 'Observable qui émet lorsque le compte à rebours se termine.',
  'idleDetection.methodOnCountDown': 'Observable qui émet les secondes restantes pendant la phase de compte à rebours.',
  'datagridUtil.title': 'Utilitaires Datagrid',
  'datagridUtil.overview':
    "Le composant Clarity datagrid émet un état chaque fois qu'un utilisateur interagit avec la pagination, les filtres ou le tri. Pour faciliter l'intégration avec les requêtes API, convertToHttpParams transforme l'état du datagrid en un objet de requête prêt pour HttpParams.",
  'datagridUtil.example1': 'Exemple 1: Utilisation de convertToHttpParams',
  'datagridUtil.example1Desc':
    'La fonction convertToHttpParams transforme un état Clarity Datagrid en un objet PageQuery approprié pour HttpParams.',
  'datagridUtil.apiSummary':
    "Convertit un objet d'état Clarity Datagrid en un objet PageQuery adapté pour HttpParams dans les requêtes API.",
  'datagridUtil.paramState':
    "L'objet d'état Clarity Datagrid contenant des informations de pagination, de tri et de filtre. Peut être nul pour la charge initiale.",
  'datagridUtil.returnsDesc':
    'Un objet PageQuery contenant la page, pageSize, la direction de tri et les chaînes de filtre au format FIQL.',
  'datagridUtil.propPage': 'Le numéro de page basé sur 1 pour la pagination.',
  'datagridUtil.propPageSize': "Le nombre d'éléments à afficher par page.",
  'datagridUtil.propSortAsc': "Le nom du champ à trier dans l'ordre ascendant.",
  'datagridUtil.propSortDesc': 'Le nom du champ à trier en ordre décroissant.',
  'datagridUtil.propFilter': "L'expression du filtre formatée au format FIQL.",
  'dgState.overview':
    "L'opérateur <code>dgState</code> est un opérateur RxJS conçu pour gérer les transformations d'état du Clarity Datagrid avec un debounce intelligent et un filtrage de doublons. Il évalue les changements dans les filtres du datagrid et gère efficacement les événements d'appel API. Lorsque les filtres sont modifiés, l'opérateur introduit un debounce de 500 ms avant d'initier l'appel API, empêchant ainsi des requêtes excessives lors de saisies rapides. Pour les actions telles que le tri ou la pagination, l'appel API est effectué immédiatement sans délai. L'opérateur fournit également un paramètre optionnel pour contrôler l'utilisation de <code>distinctUntilChanged</code>. Lorsqu'il est activé (par défaut : <code>true</code>), il assure que aucun appel API ne soit initié si l'état du datagrid reste le même, empêchant ainsi des requêtes redondantes.",
  'dgState.example1Title': 'Exemple 1: Utilisation de base',
  'dgState.example1Desc':
    "Utilisez <code>dgState</code> dans votre pipeline observable pour gérer efficacement les changements d'état datagrid:",
  'dgState.example1DataDesc':
    'Supposons que nous avons un API retournant la forme suivante des données pour un réseau de données piloté par le serveur:',
  'dgState.example2Title': 'Exemple 2: Mise en œuvre du modèle avec sécurité de type',
  'dgState.example2Desc': "Utilisez un tuyau d'async avec <code>@if</code> pour une meilleure sécurité de type:",
  'dgState.example3Title': "Exemple 3 : Mise en oeuvre d'un modèle de rechange",
  'dgState.example3Desc': "Utilisez le tuyau d'async directement dans votre modèle:",
  'dgState.example4Title': 'Exemple 4 : Exemple vivant',
  'dgState.example4Desc':
    "Voici un exemple de travail d'un réseau de données piloté par le serveur utilisant l'opérateur <code>dgState</code> :",
  'dgState.calloutPrefix': 'Vous pouvez utiliser le ',
  'dgState.calloutSuffix':
    " fonction utilitaire pour convertir l'état datagrid en paramètres HTTP. Consultez la documentation pour plus de détails.",
  'dgState.apiDesc':
    "Opérateur RxJS pour la gestion des transformations d'état Clarity Datagrid avec un comportement distinctUntilChanged optionnel.",
  'dgState.paramDesc':
    "<em>(Facultatif)</em> Indique s'il faut activer le filtrage distinctUntilChanged. Défaut à <code>true</code>. Lorsque <code>true</code> supprime les états dupliqués. Lorsque <code>false</code> permet API appelle même pour des états identiques.",
  'dgState.returnsDesc': "Une fonction d'opérateur qui transforme les émissions d'état Datagrid.",
  'dgState.behavior1':
    'Ajoute une déconcentration de 500ms lorsque les filtres changent (pour éviter les appels API excessifs lors de la saisie rapide)',
  'dgState.behavior2':
    'Effectue rapidement des appels API pour des actions de tri ou de pagination (pas de débonflage)',
  'dgState.behavior3':
    'Filtre en option les états consécutifs dupliqués lorsque <code>enableDistinctUntilChanged</code> est <code>true</code>',
  'dgState.behavior4': 'Démarre avec un état nul pour gérer les scénarios de chargement initial',
  'timelineWizard.title': 'Assistant de chronologie',
  'timelineWizard.overview':
    'Le composant TimelineWizard facilite la création de assistants multi-étapes basés sur des timelines dans les applications Angular. Chaque étape est représentée par un composant dédié étendant TimelineBaseComponent, supportant la navigation entre les étapes, la validation asynchrone et le rendu dynamique des composants.',
  'timelineWizard.example1': "Exemple 1 : Configuration de base de l'assistant",
  'timelineWizard.example1Desc':
    "Dans l'exemple suivant, l'assistant comprend quatre étapes distinctes. Le tableau timelineSteps définit l'ordre séquentiel de chaque étape. Trois étapes impliquent l'entrée du formulaire, et l'étape finale résume les données.",
  'timelineWizard.example2': 'Exemple 2 : Composante étape de base',
  'timelineWizard.example2Desc':
    "Chaque composant d'étape étend TimelineBaseComponent, en spécifiant le type d'étape pertinent et en initialisant le FormGroup.",
  'timelineWizard.example3': 'Exemple 3 : Cartographie personnalisée des données',
  'timelineWizard.example3Desc':
    'Lorsque votre modèle FormGroup diffère de la structure timelineSteps, remplacez formValueToData et dataToFormValue pour la cartographie bidirectionnelle.',
  'timelineWizard.example4': 'Exemple 4 : Cartographie avancée des données avec entrées de valeur clé',
  'timelineWizard.example4Desc':
    "Cas d'utilisation avancé montrant l'intégration dataToFormValue et formValueToData avec KeyValueInputsComponent:",
  'timelineWizard.example4Callout':
    'Pour en savoir plus sur KeyValueInputsComponent, veuillez visiter la page de documentation des entrées de valeur clé.',
  'timelineWizard.example5': "Exemple 5: Étape d'examen avec la soumission API",
  'timelineWizard.example5Desc':
    'Consolider les données des étapes précédentes en utilisant TimelineWizardService et remplacer next$ pour construire votre flux de soumission API.',
  'timelineWizard.example5Callout':
    "Vous pouvez personnaliser le next$ observable à n'importe quelle étape, permettant à la fois des opérations synchrones et asynchrones telles que les requêtes HTTP.",
  'timelineWizard.componentSummary': "Le principal composant responsable de la gestion de l'assistant de chronologie.",
  'timelineWizard.baseSummary':
    "La classe de base pour tous les composants d'étape dans l'assistant de timeline. Il fournit des propriétés et des méthodes essentielles pour la gestion des étapes d'assistant.",
  'timelineWizard.stepSummary':
    "Interface définissant les propriétés d'une étape dans la configuration de l'assistant de timeline.",
  'timelineWizard.serviceSummary':
    "Un service qui gère l'état et les données de l'assistant de chronologie à travers les composants d'étape.",
  'timelineWizard.playgroundTitle': "Terrain de jeu interactif de l'assistant de déploiement",
  'timelineWizard.playgroundDesc':
    "Naviguez étape par étape dans la configuration de l'opérateur, l'échelle de service, les propriétés d'exécution (éditeur de valeurs clés) et la confirmation finale.",
  'timelineWizard.playgroundBadge': 'Flux de travail des entreprises',
  'timelineWizard.requiredInfo': 'Renseignements requis',
  'timelineWizard.configureOperator': "Configurer l'opérateur",
  'timelineWizard.configureService': 'Configurer le service',
  'timelineWizard.configureRuntimeProperties': "Configurer les propriétés de l'exécution",
  'timelineWizard.name': 'Dénomination',
  'timelineWizard.namespace': 'Espace de noms',
  'timelineWizard.cpu': 'CPU',
  'timelineWizard.replicas': 'Réponses',
  'timelineWizard.url': 'URL',
  'poll.overview':
    "L'opérateur <code>poll</code> est un opérateur personnalisé RxJS qui simplifie le processus de polling pour maintenir les données à jour. Il permet aux développeurs de créer des observables qui émettent périodiquement des données à des intervalles spécifiés, abstrayant ainsi la complexité de la gestion des intervalles de polling et des appels API. Cet opérateur est particulièrement utile lorsqu'il est nécessaire de disposer de mises à jour en temps réel, mais que le serveur ne prend pas en charge les notifications en temps réel (WebSockets, Server-Sent Events, etc.). Il s'intègre naturellement avec d'autres opérateurs RxJS, permettant aux développeurs de construire des pipelines réactifs pour gérer des flux de données.",
  'poll.example1Title': 'Exemple 1 : Sondage de base',
  'poll.example1Desc':
    'Données de sondage à un intervalle spécifié. La fonction de sondage prend en charge Promise, Observable, ou valeurs primitives:',
  'poll.example2Title': "Exemple 2 : Sondage jusqu'à ce que la condition soit remplie",
  'poll.example2Desc':
    "Utilisez des opérateurs RxJS comme <code>takeWhile</code> pour arrêter les sondages lorsqu'une condition est remplie :",
  'poll.example2Callout':
    "Vous pouvez ajouter <code>takeUntil</code>, <code>takeWhile</code> ou d'autres opérateurs RxJS à contrôler à la fin du sondage.",
  'poll.example3Title': 'Exemple 3: Sondage avec initialValue',
  'poll.example3Desc':
    "Par défaut, le résultat initial du polling est <code>&#123;status: 'loading', isLoading: true, error: null, data: null&#125;</code>, ce qui est pratique pour afficher un indicateur de chargement. Cependant, dans certains cas, vous ne voudrez pas afficher un indicateur de chargement. Vous pouvez définir <code>initialValue</code> à n'importe quelle valeur que vous souhaitez :",
  'poll.example4Title': 'Exemple 4 : Report du scrutin',
  'poll.example4Desc':
    "Par défaut, le sondage commence immédiatement. Utilisez l'option <code>delay</code> pour retarder le début du sondage :",
  'poll.example4AltDesc':
    "Alternativement, vous pouvez commencer le sondage après une action utilisateur en combinant <code>poll</code> avec d'autres opérateurs RxJS:",
  'poll.btnStartPolling': 'Début du sondage (voir Console)',
  'poll.example5Title': 'Exemple 5 : Rénovation de la force',
  'poll.example5Desc':
    "Utilisez l'observable <code>forceRefresh</code> ou le signal pour déclencher l'exécution de <code>pollingFn</code> à tout moment, par exemple en réponse à des actions de l'utilisateur. La valeur émise par <code>forceRefresh</code> sera transmise en entrée à <code>paramsBuilder</code> (si disponible) ou directement à <code>pollingFn</code>.",
  'poll.example5SignalTitle': 'Rénovation de la force et maintien des paramètres en Signal',
  'poll.example5SignalDesc':
    "<code>forceRefresh</code> accepte directement Angular Signals. Si plusieurs mises à jour se produisent pendant qu'une requête est en cours, <code>exhaustMap</code> baisse les déclencheurs intermédiaires mais conserve le nouveau paramètre pour la prochaine tique programmée.",
  'poll.btnRapidFilters': 'Changements rapides de filtres (Burst 3x)',
  'poll.example6Title': 'Exemple 6 : Exemple avancé - Datagrid avec sondage',
  'poll.example6Desc':
    "Le datagrid ci-dessous se rafraîchira automatiquement toutes les 10 secondes. En outre, chaque fois qu'il y a un changement dans l'entrée, déclenchant le filtrage, le tri ou la pagination, le API sera rapidement appelé, accompagné d'un spinner indiquant le chargement.",
  'poll.searchByFirstName': 'Recherche par prénom',
  'poll.apiDesc':
    "Polls données à un intervalle spécifié et peut être déclenché manuellement. Retourne un observable qui émet le résultat en tant qu'objet AsyncState.",
  'poll.paramPollingFn': 'Une fonction qui renvoie une valeur Observable, Promise ou primitive.',
  'poll.paramInterval': "L'intervalle en millisecondes entre chaque sondage.",
  'poll.paramForceRefresh': 'Un Observable ou Signal qui déclenche une mise à jour manuelle.',
  'poll.paramParamsBuilder':
    'Une fonction qui construit les paramètres de la fonction de sondage en fonction de la valeur forceRefresh.',
  'poll.paramInitialValue': 'Une valeur initiale AsyncState.',
  'poll.paramDelay': 'Retardez en millisecondes avant de commencer le premier sondage.',
  'poll.returnsDesc':
    'Un observable qui émet des objets AsyncState<Data> avec statut, isLoading, erreur et propriétés de données.',
  'createAsyncState.overview':
    "L'opérateur <code>createAsyncState</code> transforme un observable de type <code>T</code> en un observable de type <code>AsyncState&lt;T&gt;</code>, encapsulant les états de chargement, d'erreur et de données dans une structure standardisée. Cela élimine le besoin de gérer des variables séparées pour les états de chargement, les erreurs et les données, rendant ainsi votre codebase plus organisé et plus maintenable.",
  'createAsyncState.interfaceStructure': "La structure d'interface <code>AsyncState</code> que l'opérateur renvoie :",
  'createAsyncState.example1Title': 'Exemple 1 : Demande simple',
  'createAsyncState.example1Desc': "Gérez une seule requête API avec les états de chargement et d'erreur :",
  'createAsyncState.example2Title': 'Exemple 2: Avec les rappels',
  'createAsyncState.example2Desc': "Ajouter des effets secondaires pour les scénarios de succès et d'erreur:",
  'createAsyncState.example3Title': 'Exemple 3: Fournir initialValue',
  'createAsyncState.example3Desc':
    "Dans les scénarios où vous avez des données initiales (par exemple, de l'état de l'itinéraire), vous pouvez fournir une valeur initiale pour éviter d'afficher un spinner de chargement. Ceci est utile lors de la navigation d'une liste à une page de détail où vous avez déjà quelques données:",
  'createAsyncState.example3Callout':
    "Lors de la fourniture de <code>initialValue</code>, définissez <code>status: 'idle'</code> et <code>isLoading: false</code> pour empêcher le spinner de chargement d'apparaître. Les données seront mises à jour de façon transparente lorsque l'appel API sera terminé.",
  'createAsyncState.example4Title': 'Exemple 4 : Demandes à charge',
  'createAsyncState.example4Desc': 'Chaîner plusieurs requêtes en utilisant <code>switchMap</code> :',
  'createAsyncState.example5Title': 'Exemple 5: Utilisation du modèle',
  'createAsyncState.example5Desc': "Utilisez le tuyau d'async dans des modèles pour gérer différents états:",
  'createAsyncState.apiSummary': 'Transforme un Observable de type T en un Observable de AsyncState<T, E>.',
  'createAsyncState.paramObserver':
    "Fonction de rappel ou objet observateur pour la manipulation des effets secondaires lorsque l'observable émet des valeurs ou des erreurs.",
  'createAsyncState.paramInitialValue':
    "La valeur initiale AsyncState à utiliser avant que l'observable émette sa première valeur.",
  'createAsyncState.returnsDesc': 'Une fonction qui transforme un flux observable en un état asynchrone.',
  'createAsyncState.stateStatus': 'Suivi d\'état précis : "idle" | "loading" | "reloading" | "resolved" | "error".',
  'createAsyncState.stateIsLoading':
    'Indique si un chargement est en cours (true lorsque status vaut "loading" ou "reloading").',
  'createAsyncState.stateError': "Erreur si l'opération asynchrone a échoué, ou null.",
  'createAsyncState.stateData': "Données émises par l'observable, ou nulle.",
  'resourceAsync.paramSourceFn': 'Une fonction réactive qui renvoie une valeur Observable, Promise ou synchrone.',
  'resourceAsync.paramOptions': 'Options de configuration pour la ressource.',
  'resourceAsync.propInitialValue': 'Valeur initiale avant la première récupération complète.',
  'resourceAsync.propLazy': 'Si vrai, commence dans l\'état "idle" et attend que reload() soit appelé.',
  'resourceAsync.propBehavior':
    'Gestion des exécutions simultanées : "switch" annule l\'exécution précédente ; "exhaust" ignore les nouvelles exécutions. Valeur par défaut : "switch".',
  'resourceAsync.propOnError': "Callback du gestionnaire d'erreur qui peut fournir des valeurs de recul.",
  'resourceAsync.propThrowOnError': "Si vrai, les erreurs sont lancées au lieu de stockées dans le signal d'erreur.",
  'resourceAsync.propOnSuccess': "Callback invoqué lorsque l'opération se termine avec succès.",
  'resourceAsync.propOnLoading': "Callback invoqué lorsque l'opération commence le chargement.",
  'resourceAsync.returnsDesc':
    "Un objet ResourceRef<T, E> exposant des méthodes de valeur, d'erreur, d'état, de isLoading et de mutation.",
  'spinner.apiSummary':
    'Composant pour afficher des indicateurs de chargement avec des tailles et des alignements personnalisables.',
  'spinner.inputSize': 'Détermine la taille du spinner: "lg" (par défaut), "md" ou "sm".',
  'spinner.inputCenter': 'Centre le spinner comme un élément de bloc. Passer faux pour désactiver le centreage.',
  'spinner.inputInline': "Indique si le spinner doit être affiché en tant qu'élément de bloc en ligne.",
  'spinner.inputCustomClass': 'Une chaîne de classes CSS supplémentaires à appliquer au spinner.',
  'callout.apiSummary': "Un composant d'alerte basé sur le système de conception Clarity.",
  'callout.contentProjectionDesc':
    'Fournit une fente par défaut <ng-content /> pour rendre le contenu, le texte, les listes et les composants personnalisés HTML.',
  'callout.responsiveTitle': 'Comportement sensible',
  'callout.responsiveDesc':
    "L'icône décorative est cachée sur des écrans plus étroits que 576px et s'affiche automatiquement sur des écrans plus larges.",
  'callout.themingTitle': 'Thèmes',
  'callout.themingDesc':
    "Inherits contexte de thème Clarity et respecte [cds-theme='dark'] pour des styles de fond, de bordure et de lien contrastants.",
  'certificate.pemNote':
    "PEM est un format de fichier qui est souvent utilisé pour stocker des clés cryptographiques, des certificats et d'autres données sécurisées. Les fichiers PEM ont généralement des extensions comme .pem, .crt, .cer et .key.",
  'certificate.apiSummary': 'Composant pour afficher des informations de certificat dans un signpost Clarity.',
  'certificate.clickIcon': "Cliquez sur l'icône de certificat ci-dessous pour voir les détails du certificat:",
  'certificate.clickCert': "Cliquez sur l'icône du certificat & #160;:",
  'certificate.inputPem': 'La chaîne de certificat formatée PEM à inspecter.',
  'certificate.inputPemEncoded': 'Indique si la chaîne PEM fournie est codée en base64.',
  'certificate.inputPosition': "Position du panneau par rapport à l'icône de déclenchement.",
  'certificate.inputShowIcon': "Une valeur booléenne pour gérer la visibilité de l'icône d'état du certificat.",
  'isPromise.overview':
    "L'outil <code>isPromise</code> est un vérificateur de type TypeScript qui permet de déterminer si une valeur arbitraire est un <code>Promise</code> ou un <code>PromiseLike</code> (un objet ou une fonction contenant une méthode <code>then</code> appelable). Il permet une vérification sécurisée au niveau du runtime et une réduction du type sans provoquer d'erreurs pour les valeurs nulles ou primitives.",
  'isPromise.callout':
    'Utile dans les chargeurs de ressources asynchrones, les opérateurs personnalisés et le service flexible APIs qui acceptent des valeurs statiques immédiates ou des promesses asynchrones.',
  'isPromise.example1Title': "Exemple 1: Matrice interactive d'évaluation de la valeur",
  'isPromise.example1Desc':
    "Observez la vérification du type d'exécution sur les types de données JavaScript communs et les objets chérables :",
  'isPromise.thDescription': 'Désignation des marchandises',
  'isPromise.thExpression': 'Expression évaluée',
  'isPromise.thResult': 'isPromise() Résultat',
  'isPromise.example2Title': 'Exemple 2: Modèle de rétrécissement de type sûr',
  'isPromise.example2Desc':
    "Dans TypeScript, vérifier avec <code>if (isPromise(val))</code> rétrécit automatiquement le type à l'intérieur du bloc:",
  'isPromise.apiSummary': 'Fonction de vérification de type TypeScript pour les contrats PromiseLike.',
  'isPromise.paramObj': 'La valeur à inspecter.',
  'isPromise.returnsDesc':
    "true si l'entrée est non null, est un objet ou une fonction, et implémente une méthode callable alors; false sinon.",
  'isEmpty.overview':
    "La fonction d'utilité <code>isEmpty</code> vérifie si une chaîne, un objet ou un tableau est vide. Elle retourne <code>true</code> pour les valeurs vides et <code>false</code> pour les valeurs non vides.",
  'isEmpty.example1Title': 'Exemple 1: Utilisation de base',
  'isEmpty.example1Desc': 'Vérifier si différents types de valeurs sont vides:',
  'isEmpty.example2Title': "Exemple 2 : Cas d'utilisation courante",
  'isEmpty.example2Desc': 'Utiliser <code>isEmpty</code> dans la logique conditionnelle :',
  'isEmpty.apiSummary': 'Vérifie si une chaîne, un objet ou un tableau est vide.',
  'isEmpty.paramValue': 'La valeur à vérifier. Peut être une chaîne, un objet, un tableau ou une autre valeur.',
  'isEmpty.returnsDesc':
    'true si la valeur est vide (chaîne vide, objet vide, tableau vide, null ou non défini), false sinon.',
  'isEqual.overview':
    "La fonction d'utilité <code>isEqual</code> effectue un contrôle de profondeur d'égalité entre deux valeurs. Elle compare les valeurs primitives, les tableaux et les objets de manière récursive pour déterminer s'ils sont égaux en structure, indépendamment de l'égalité par référence.",
  'isEqual.example1Title': 'Exemple 1: Utilisation de base',
  'isEqual.example1Desc': "Comparer différents types de valeurs pour l'égalité profonde:",
  'isEqual.example2Title': "Exemple 2 : Comparaison d'objets profonds",
  'isEqual.example2Desc': 'Comparer les objets et tableaux imbriqués :',
  'isEqual.apiSummary': "Effectue un contrôle de profondeur d'égalité entre deux valeurs.",
  'isEqual.paramValue1': 'La première valeur à comparer.',
  'isEqual.paramValue2': 'La deuxième valeur à comparer.',
  'isEqual.returnsDesc':
    'true si les valeurs sont profondément égales, faux sinon. Effectue une comparaison récursive pour les objets et les tableaux.',
  'differenceInDays.overview':
    "La fonction d'utilité <code>differenceInDays</code> calcule le nombre de jours entiers entre deux dates. Elle simplifie les calculs de dates en JavaScript en acceptant des types d'entrée flexibles. Le premier paramètre représente la date de référence à partir de laquelle le calcul est effectué, et le second paramètre indique la date à comparer avec la date de référence. Les deux paramètres acceptent des objets <code>Date</code>, des nombres représentant des millisecondes depuis l'époc Unix, ou des chaînes pouvant être analysées par le constructeur <code>Date</code>.",
  'differenceInDays.example1Title': 'Exemple 1 : Calculer les jours entre les dates',
  'differenceInDays.example1Desc':
    "Calculez le nombre de jours entiers entre deux dates en utilisant différents types d'entrée :",
  'differenceInDays.example2Title': "Exemple 2 : Calculer les jours à partir d'aujourd'hui",
  'differenceInDays.example2Desc': "Calculer le nombre de jours entre aujourd'hui et une date précise:",
  'differenceInDays.apiSummary': 'Calcule le nombre de jours entiers entre deux dates.',
  'differenceInDays.paramDateLeft':
    'La date de référence. Peut être un objet Date, timestamp (millisecondes), ou une chaîne de date parseable.',
  'differenceInDays.paramDateRight':
    'La date à comparer par rapport à la date de référence. Accepte les mêmes types que dateLeft.',
  'differenceInDays.returnsDesc':
    'Le nombre de jours entiers entre les deux dates. Renvoie un nombre positif si dateLeft est plus tard que dateRight, et négatif si dateLeft est plus tôt.',
  'pickBy.overview':
    "Les fonctions d'utilité <code>pickBy</code> et <code>omitBy</code> vous permettent de créer de nouveaux objets en sélectionnant ou en excluant des propriétés en fonction d'une fonction prédicative. <code>pickBy</code> crée un objet composé de propriétés qui satisfont une condition donnée, tandis que <code>omitBy</code> est l'inverse, créant un objet composé de propriétés qui ne satisfont pas la condition.",
  'pickBy.example1Title': 'Exemple 1: pickBy',
  'pickBy.example1Desc': "Créer un objet composé de propriétés de l'objet qui satisfont à une condition donnée:",
  'pickBy.example2Title': 'Exemple 2: omitBy',
  'pickBy.example2Desc':
    '<code>omitBy</code> est le contraire de <code>pickBy</code>, créant un objet composé de propriétés qui ne satisfont pas à la condition donnée.',
  'pickBy.apiSummary': "Crée un objet composé de propriétés d'objet qui satisfont une condition donnée.",
  'pickBy.paramObject': "L'objet source à partir duquel choisir les propriétés.",
  'pickBy.paramPredicate':
    'Une fonction qui détermine les propriétés à inclure. Retourne true à inclure, false à exclure.',
  'pickBy.returnsDesc': 'Un nouvel objet ne contenant que les propriétés qui satisfont au prédicat.',
  'omitBy.apiSummary': "Crée un objet composé de propriétés d'objet qui ne satisfont pas une condition donnée.",
  'omitBy.paramObject': "L'objet source d'omettre des propriétés.",
  'omitBy.paramPredicate':
    'Une fonction qui détermine les propriétés à omettre. Retourne true à omit, false à retenir.',
  'omitBy.returnsDesc': 'Un nouvel objet ne contenant que les propriétés qui ne satisfont pas au prédicat.',
  'url.title': 'Utilitaires URL',
  'url.overview':
    "ngx-lift fournit plusieurs fonctions d'utilité pour travailler avec des URLs : <code>isIP</code> et <code>isFQDN</code> pour vérifier les types d'hôte, <code>isURL</code> pour valider des URLs, et <code>isHttps</code> pour vérifier le protocole HTTPS. Ces outils sont utiles pour la validation d'URL, les vérifications de sécurité et les logiques conditionnelles basées sur les propriétés d'URL.",
  'url.example1': "Exemple 1: Vérifiez le type de nom d'hôte (isIP & isFQDN)",
  'url.example1Desc':
    "Vérifiez si un nom d'hôte URL est une adresse IP ou un nom de domaine entièrement qualifié (FQDN):",
  'url.example1Callout':
    "Vous pouvez utiliser le constructeur <code>URL</code> pour obtenir le nom d'hôte, mais n'oubliez pas d'utiliser try-catcher pour la gestion des erreurs.",
  'url.example2': 'Exemple 2: Valider URLs (isURL et isHttps)',
  'url.example2Desc':
    '<code>isURL</code> est utilisé pour vérifier si un URL est valide. <code>isHttps</code> est utilisé pour vérifier si le URL commence par https.',
  'url.example2Callout':
    'Nous fournissons également des tubes <code>isHttps</code> pour une utilisation dans les modèles.',
  'url.isIPSummary': "Vérifie si un nom d'hôte est une adresse IP.",
  'url.isFQDNSummary': "Vérifie si un nom d'hôte est un nom de domaine entièrement qualifié (FQDN).",
  'url.isURLSummary': 'Vérifie si une chaîne est une URL valide.',
  'url.isHttpsSummary': 'Vérifie si une chaîne URL utilise le protocole HTTPS.',
  'urlValidator.title': 'urlValidator & httpsValidator',
  'urlValidator.overview':
    "Les fonctions <code>urlValidator</code> et <code>httpsValidator</code> sont des validateurs Angular utilisés pour vérifier si une chaîne donnée correspond à des motifs spécifiques d'URL. La fonction <code>urlValidator</code> valide des URLs commençant par http ou https, tandis que <code>httpsValidator</code> valide uniquement des URLs HTTPS.",
  'urlValidator.example1': 'Exemple 1: Validateur URL',
  'urlValidator.example1Desc': 'Valider URLs qui commencent par https :',
  'urlValidator.example2': 'Exemple 2: Validateur HTTPS',
  'urlValidator.example2Desc': 'Valider uniquement HTTPS URLs :',
  'urlValidator.example3': 'Exemple 3 : Exemple de formulaire complet',
  'urlValidator.example3Desc': 'Exemple complet avec les deux validateurs sous une forme réactive:',
  'urlValidator.urlLabel': 'URL',
  'urlValidator.urlHelper': 'Fournir un URL valide',
  'urlValidator.urlError': 'Veuillez saisir un URL valide (commençant par https ou http)',
  'urlValidator.httpsLabel': 'HTTPS-seulement URL',
  'urlValidator.httpsHelper': 'Fournir un https URL',
  'urlValidator.httpsError': 'Veuillez saisir un https URL',
  'urlValidator.summary':
    'Validateur Angular qui vérifie si une chaîne est une URL valide commençant par http ou https.',
  'urlValidator.httpsSummary': 'Validateur Angular qui vérifie si une chaîne est une HTTPS URL valide.',
  'urlValidator.returns':
    'Une fonction de validation qui retourne {invalidUrl: true} si la URL est invalide, ou null si valide.',
  'urlValidator.httpsReturns':
    "Une fonction de validation qui retourne {invalidUrl: true} si la URL n'est pas HTTPS, ou null si valide.",
  'startWithTap.overview':
    "L'opérateur <code>startWithTap</code> exécute un appel synchrone avant chaque abonnement à l'Observable source. Contrairement aux opérations tap éager ou au code d'initialisation de pipeline, la construction du pipeline ne déclenche pas l'appel de la fonction jusqu'à ce qu'un abonnement se produise. Toute exception de la fonction d'appel entre dans le canal d'erreur de l'Observable.",
  'startWithTap.callout':
    "Idéal pour déclencher des effets secondaires d'initialisation, régler des indicateurs de chargement, réinitialiser des erreurs antérieures ou enregistrer des timestamps d'expédition de requête immédiatement lorsqu'un flux Observable est souscrit.",
  'startWithTap.example1Title': 'Exemple 1 : Envoi de la demande interactive avec indicateur de chargement',
  'startWithTap.example1Desc':
    'Cliquez sur "Demande de Trigger" pour vous abonner à une simulation de 900ms de retard Observable. <code>startWithTap</code> fonctionne synchronement au moment de l\'abonnement pour activer le spinner de chargement:',
  'startWithTap.btnTrigger': 'Demande de déclenchement',
  'startWithTap.btnClearLog': 'Effacer le journal',
  'startWithTap.fetchingData': 'Chercher des données...',
  'startWithTap.loadedPayload': 'Charge utile chargée:',
  'startWithTap.example2Title': 'Exemple 2 : Exécution de pipelines différée',
  'startWithTap.example2Desc':
    "Le callback est différé jusqu'au moment de l'abonnement, ce qui signifie que les flux réutilisables ou les pipelines partagés peuvent être définis à l'avance sans que des effets secondaires ne soient exécutés prématurément :",
  'startWithTap.apiSummary': "L'opérateur RxJS MonoTypeOperatorFunction exécute un rappel lors de l'abonnement.",
  'startWithTap.paramCallback': 'Fonction exécutée synchronement avant que la source Observable ne commence à émettre.',
  'startWithTap.returnsDesc':
    "Une fonction d'opérateur RxJS qui exécute le callback lors de l'abonnement et retourne la source Observable inchangée.",
  'switchMapWithAsyncState.overview':
    "L'opérateur <code>switchMapWithAsyncState</code> combine les fonctionnalités de <code>switchMap</code> et <code>createAsyncState</code> en un seul opérateur. Il est particulièrement conçu pour les scénarios où il est nécessaire de déclencher une requête API en fonction d'actions utilisateur (comme les clics de boutons) et de passer de manière fluide entre les flux. En créant une structure <code>AsyncState</code> pour encapsuler la réponse API, cet opérateur offre une approche fluide et efficace pour gérer les opérations asynchrones.",
  'switchMapWithAsyncState.example1Title': 'Exemple 1 : Filtrer les utilisateurs par sexe',
  'switchMapWithAsyncState.example1Desc':
    "Le choix d'un sexe différent remplira la liste d'utilisateurs en conséquence :",
  'switchMapWithAsyncState.example2Title': "Exemple 2 : Présentation de formulaire avec l'État de chargement",
  'switchMapWithAsyncState.example2Desc':
    'Soumettre le formulaire en utilisant <code>switchMapWithAsyncState</code> et <code>toSignal</code>. La soumission émet toujours une erreur parce que le API est conçu pour simuler une erreur.',
  'switchMapWithAsyncState.apiSummary':
    "Combine switchMap et createAsyncState pour transformer un flux d'observable en AsyncState tout en changeant vers un nouvel observable interne.",
  'switchMapWithAsyncState.paramProject':
    'Une fonction qui reçoit chaque valeur de la source observable et renvoie un Observable, Promise ou un autre ObservableInput.',
  'switchMapWithAsyncState.returnsDesc':
    'Un observable qui émet des objets AsyncState<R>, manipulant automatiquement le chargement, les erreurs et les états de données.',
  'combineLatestEager.overview':
    "L'opérateur RxJS <code>combineLatest</code> exige que tous les sources émettent au moins une fois, ce qui peut poser un problème lors de l'utilisation de sources <code>Subject</code> qui peuvent ne pas émettre initialement. <code>combineLatestEager</code> étend <code>combineLatest</code> en ajoutant automatiquement <code>startWith(null)</code> pour chaque <code>Subject</code> dans les sources, assurant ainsi que l'observable combiné initialise correctement. Vous pouvez également définir le deuxième paramètre à <code>true</code> pour ajouter <code>startWith(null)</code> pour tous les observables sources, ce qui est utile lorsqu'il s'agit de nombreux observables où les émissions initiales ne sont pas garanties.",
  'combineLatestEager.example1Title': 'Exemple 1: Utilisation de base',
  'combineLatestEager.example1Desc':
    'Combiner les observables, y compris les sujets qui ne peuvent pas émettre initialement :',
  'combineLatestEager.example2Title': 'Exemple 2: Exemple complet avec modèle',
  'combineLatestEager.example2Desc':
    "Exemple complet montrant comment utiliser combineLatestEager avec le tuyau d'async dans les modèles:",
  'combineLatestEager.apiSummary':
    "Combine plusieurs observables avec une émission proactive, gérant automatiquement les sources qui n'émettent pas de valeurs initiales.",
  'combineLatestEager.paramSources': "Un tableau ou un dictionnaire objet d'observables à combiner.",
  'combineLatestEager.paramStartWithAll':
    '(Facultatif) Lorsque vrai, ajoute startWith(null) pour toutes les sources, pas seulement les sujets.',
  'combineLatestEager.returnsDesc':
    'Un observable qui émet un tableau ou un objet contenant les dernières valeurs de toutes les sources.',
  'distinctOnChange.overview':
    "L'opérateur <code>distinctOnChange</code> améliore les observables RxJS en empêchant non seulement les émissions dupliquées (comme <code>distinctUntilChanged</code>) mais aussi en exécutant une fonction de rappel lorsqu'une valeur change. Cela est utile pour les scénarios où il est nécessaire d'effectuer des effets secondaires, comme afficher une notification toast, lorsqu'une valeur change après l'émission initiale.",
  'distinctOnChange.example1Title': 'Exemple 1: Utilisation de base',
  'distinctOnChange.example1Desc': 'Exécuter un callback lorsque des valeurs distinctes sont rencontrées :',
  'distinctOnChange.example2Title': 'Exemple 2 : Avec un comparateur personnalisé',
  'distinctOnChange.example2Desc': "Utilisez une fonction de comparaison personnalisée pour déterminer l'égalité :",
  'distinctOnChange.apiSummary':
    'Renvoie un observable qui émet des valeurs distinctes et exécute un rappel chaque fois que la valeur change.',
  'distinctOnChange.paramCallback':
    'Fonction à exécuter lorsque la valeur change. Reçoit les valeurs précédentes et actuelles.',
  'distinctOnChange.paramComparator':
    "(Facultatif) Fonction pour déterminer si deux valeurs sont considérées comme égales. Par défaut à l'égalité stricte (===).",
  'distinctOnChange.returnsDesc':
    'Un observable qui émet des valeurs distinctes et exécute le callback sur les modifications.',
  'logger.overview':
    "L'opérateur <code>logger</code> est une fonction d'utilitaire pour les observables RxJS qui simplifie le logging des valeurs émises en utilisant différentes fonctions du console. Cet opérateur est utile pour le débogage et le suivi du comportement des observables pendant le développement.",
  'logger.example1Title': 'Exemple 1: Exploitation forestière de base',
  'logger.example1Desc': 'Loger les valeurs émises en utilisant console.log:',
  'logger.example2Title': 'Exemple 2 : Exploitation du tableau',
  'logger.example2Desc': 'Log des valeurs émises en utilisant console.table pour une meilleure visualisation:',
  'logger.example3Title': 'Exemple 3: Autres méthodes de console',
  'logger.example3Desc': "Utilisez d'autres méthodes de console comme avertissement, erreur ou info:",
  'logger.apiSummary':
    'Un opérateur de débogage qui enregistre les émissions dans la console en utilisant diverses méthodes de console.',
  'logger.paramMethod':
    'Facultatif : méthode de console: "log" | "table" | "warn" | "error" | "info" | "debug". Par défaut: "log".',
  'logger.returnsDesc': 'Un observable qui passe à travers toutes les valeurs tout en les enregistrant sur la console.',
  'kubernetesPagination.overview':
    "L'opérateur <code>aggregatePaginatedKubernetesResources</code> et la fonction <code>fetchPaginatedKubernetesResources</code> automatisent la pagination côté client pour les API REST de Kubernetes. Ils inspectent le token <code>metadata.continue</code> des réponses entrantes, demandent des pages consécutives de manière récursive jusqu'à ce que toutes les pages soient récupérées, normalisent en toute sécurité les éléments manquants ou nulls, et regroupent tous les ressources dans un seul <code>KubernetesList&lt;T&gt;</code> unifié.",
  'kubernetesPagination.callout':
    "Les APIs Kubernetes retournent des collections paginées avec un token <code>continue</code> dans les métadonnées de réponse lorsqu'il y a plus de records que le limite demandée. Cet opérateur gère l'ensemble du boucle de plusieurs demandes de manière fluide derrière un seul flux d'observable.",
  'kubernetesPagination.example1Title': 'Exemple 1 : Traversal paginé interactif Kubernetes',
  'kubernetesPagination.example1Desc':
    'Cliquez sur "Fetch Pagined Pods" pour déclencher la récupération automatique de plusieurs pages sur trois pages de simulation Kubernetes API :',
  'kubernetesPagination.btnFetchPods': 'Récupérer des pods paginés',
  'kubernetesPagination.fetchingPages': 'Chercher des pages (poursuivre)...',
  'kubernetesPagination.pagesFetched': 'Pages récupérées de façon récursive :',
  'kubernetesPagination.aggregationComplete': 'Agrégation terminée',
  'kubernetesPagination.totalResources': 'Total des ressources :',
  'kubernetesPagination.thPodName': 'Nom du pod',
  'kubernetesPagination.thNamespace': 'Espace de noms',
  'kubernetesPagination.thStatus': 'État',
  'kubernetesPagination.thPodIp': 'Pod IP',
  'kubernetesPagination.example2Title': 'Exemple 2 : Fonction de prélèvement autocontenue',
  'kubernetesPagination.example2Desc':
    'Utilisez <code>fetchPaginatedKubernetesResources</code> lorsque vous voulez lancer et paginer un appel de fonction unique sans construire manuellement le Observable initial :',
  'kubernetesPagination.aggregateSummary':
    "L'opérateur RxJS qui transforme une réponse initiale de la liste Kubernetes Observable en une liste agrégée contenant des éléments de toutes les pages.",
  'kubernetesPagination.fetchSummary':
    'Fonction convenance qui initie et pagine les ressources Kubernetes en un seul appel.',
  'kubernetesPagination.paramHttp': 'Angular HttpClient utilisé pour demander les pages suivantes.',
  'kubernetesPagination.paramEndpoint': 'REST URL de la ressource Kubernetes.',
  'kubernetesPagination.paramInitialParams': 'Paramètres de requête (p. ex. limite).',
  'k8sRetryBackoff.configSummary': 'Configuration optionnelle partagée par l’opérateur et la fabrique d’intercepteurs.',
  'k8sRetryBackoff.paramMaxAttempts':
    'Nombre total de tentatives incluant la requête initiale. Définir sur 1 pour désactiver les réessais.',
  'k8sRetryBackoff.errorShape':
    "Accepte HttpErrorResponse ou un objet au format <code>{ status, headers?, error? }</code>, incluant une chaîne JSON dans <code>error</code>. Native fetch ne rejette pas sur HTTP 429 : vérifiez la réponse et adaptez son statut, ses en-têtes et son corps analysé. Axios expose ces informations sous <code>error.response</code> ; adaptez-les avant d'appeler l'assistant. L'assistant calcule uniquement un délai.",
  'k8sRetryBackoffInterceptor.overrideRules':
    "null utilise les valeurs par défaut de l'intercepteur; false désactive les retries. Le contexte remplace les fusions par des valeurs par défaut globales ou en usine. GET/HEAD/OPTIONS/PUT/DELETE sont éligibles par défaut; POST/PATCH nécessite une priorité explicite de retryMethods et une idempotency du paramètre.",
  'k8sRetryBackoffInterceptor.overrideSimulation':
    'Testez une sonde qui échoue dès son premier 429, ou une lecture de charge de travail qui reçoit deux 429 avant de réussir. La lecture personnalisée utilise maxAttempts: 10 et un délai de secours de 200 ms, ce qui autorise jusqu’à neuf réessais.',
  'k8sRetryBackoffInterceptor.btnWorkloads': 'Tester la lecture de charge (10 tentatives)',
  'k8sRetryBackoffInterceptor.btnProbe': 'Tester la sonde rapide (Exclusion)',
  'k8sRetryBackoff.overview':
    "L'opérateur RxJS <code>retryOnK8sBackoff</code> implémente un retry avec backoff automatique pour les réponses HTTP 429 (<code>TooManyRequests</code>) de Kubernetes apiserver (par exemple, lorsqu'apiserver watch cache est en démarrage avec « storage is (re)initializing »). Seulement HTTP 429 déclenche un retry ; tous les autres erreurs (4xx, 5xx, perte de réseau) sont propagés immédiatement et sans modification vers l'abonné.",
  'k8sRetryBackoff.callout':
    "<strong>Operator vs. Intercepteur:</strong> L'opérateur contrôle des pipelines spécifiques Observable. L'intercepteur applique 429 réessayer à travers les méthodes admissibles HttpClient; écrit nécessite une idempotency vérifiée.",
  'k8sRetryBackoff.diffTitle': 'Comparaison architecturale : Opérateur vs Intercepteur',
  'k8sRetryBackoff.diffDesc':
    'Les deux outils partagent le même moteur de résolution de délai de réessai, mais jouent des rôles complémentaires :',
  'k8sRetryBackoff.diffColFeature': 'Caractéristique',
  'k8sRetryBackoff.diffColOperator': 'retryOnK8sBackoff (Opérateur)',
  'k8sRetryBackoff.diffColInterceptor': 'k8sRetryBackoffInterceptor (Intercepteur)',
  'k8sRetryBackoff.diffScope': 'Portée',
  'k8sRetryBackoff.diffScopeOp':
    'Locale : Appliqué sélectivement à des Observables spécifiques via <code>.pipe(retryOnK8sBackoff(...))</code>.',
  'k8sRetryBackoff.diffScopeInt': 'Global: Automatique sur toutes les requêtes Angular HttpClient',
  'k8sRetryBackoff.diffUseCases': 'Cas d’utilisation cibles',
  'k8sRetryBackoff.diffUseCasesOp': 'Flux de scrutation, tâches en arrière-plan, observables non-HttpClient.',
  'k8sRetryBackoff.diffUseCasesInt':
    'Intégrations standard Kubernetes microservice/SPA nécessitant une résilience mondiale',
  'k8sRetryBackoff.diffConfig': 'Configuration & Exclusion',
  'k8sRetryBackoff.diffConfigOp':
    "Transmis directement à l'opérateur : <code>retryOnK8sBackoff({ maxAttempts, fallbackDelayMs })</code>",
  'k8sRetryBackoff.diffConfigInt':
    'Global en <code>app.config.ts</code> ou par demande via <code>HttpContextToken</code>',
  'k8sRetryBackoff.example1Title': 'Exemple 1 : Simulateur interactif et utilisation du pipeline',
  'k8sRetryBackoff.example1Desc':
    'Simulez diverses réponses de l’API Kubernetes et observez la gestion du délai par retryOnK8sBackoff, suivie du code d’intégration :',
  'k8sRetryBackoff.selectScenario': 'Sélectionner le scénario de réponse :',
  'k8sRetryBackoff.scenarioHeader': '429 (En-tête Retry-After: 1)',
  'k8sRetryBackoff.scenarioBody': '429 (Corps JSON details.retryAfterSeconds: 1.5)',
  'k8sRetryBackoff.scenarioFallback': '429 (Sans en-tête, délai de secours 1s)',
  'k8sRetryBackoff.scenarioNon429': '500 Internal Server Error (Non réessayable, échec immédiat)',
  'k8sRetryBackoff.scenarioExhausted': '5x 429 successifs (Épuisement des tentatives maximales)',
  'k8sRetryBackoff.btnSimulate': 'Simuler la requête & réessayer',
  'k8sRetryBackoff.logTitle': 'Journaux d’exécution :',
  'k8sRetryBackoff.btnClearLogs': 'Effacer les journaux',
  'k8sRetryBackoff.example2Title': 'Exemple 2 : Fonction utilitaire autonome (getK8sRetryDelayMs)',
  'k8sRetryBackoff.example2Desc':
    'Utilisez getK8sRetryDelayMs directement pour extraire les délais d’attente dans des boucles de réessai personnalisées ou des promesses :',
  'k8sRetryBackoff.sampleErrorLabel': 'Exemple de réponse d’erreur :',
  'k8sRetryBackoff.helperHeader': '429 (Retry-After: 3s)',
  'k8sRetryBackoff.helperBody': '429 (retryAfterSeconds: 2s)',
  'k8sRetryBackoff.helperFallback': '429 (Sans indication, secours de 1s)',
  'k8sRetryBackoff.helperNon429': '500 (Erreur non-429)',
  'k8sRetryBackoff.btnExtractDelay': 'Extraire le délai (getK8sRetryDelayMs)',
  'k8sRetryBackoff.retryableError': 'Attente avec repli 429 Kubernetes réessayable',
  'k8sRetryBackoff.nonRetryableError': 'Erreur non réessayable',
  'k8sRetryBackoff.apiSummary':
    'Opérateur RxJS qui retry les réponses 429 de Kubernetes en utilisant des délais fournis par le serveur ou un backoff de repli.',
  'k8sRetryBackoff.paramConfig': 'Configuration optionnelle du nombre de tentatives et du délai de secours.',
  'k8sRetryBackoff.delaySummary':
    "Fonction d'aide qui extrait le délai de réessayer en millisecondes d'une réponse d'erreur Kubernetes 429, ou retourne null si elle n'est pas réessayer.",
  'k8sRetryBackoff.paramError': 'L’erreur à inspecter (HttpErrorResponse ou objet avec status/headers/error).',
  'k8sRetryBackoff.paramFallbackDelay': 'Délai de secours en millisecondes si la réponse ne fournit aucune indication.',
  'k8sRetryBackoffInterceptor.overview':
    "<code>k8sRetryBackoffInterceptor</code> retry automatiquement les réponses 429 de Kubernetes pour les méthodes idempotentes. Il respecte Retry-After et les détails.retryAfterSeconds, avec un backoff exponentiel, un jitter, des budgets de temps d'attente et un opt-out de HttpContext. POST/PATCH nécessitent un opt-in explicite.",
  'k8sRetryBackoffInterceptor.callout':
    "<strong>Protection globale avec surcharge de requêtes :</strong> Enregistrez l'intercepteur une fois dans <code>app.config.ts</code> pour protéger tous les points de terminaison. Pour les requêtes individuelles qui doivent ignorer le retry ou utiliser des limites personnalisées, définissez le token de contexte <code>K8S_RETRY_BACKOFF_CONFIG</code> sur l'appel <code>HttpClient</code>. Pour un contrôle local de la pipeline, consultez l'opérateur <code>retryOnK8sBackoff</code>.",
  'k8sRetryBackoffInterceptor.example1Title': 'Exemple 1 : Enregistrement global de l’intercepteur et simulateur',
  'k8sRetryBackoffInterceptor.example1Desc':
    'Inscrivez-vous dans le monde entier dans app.config.ts pour réessayer les requêtes idémpotentes admissibles HttpClient sur HTTP 429.',
  'k8sRetryBackoffInterceptor.selectMode': 'Mode de contexte de l’intercepteur :',
  'k8sRetryBackoffInterceptor.modeDefault':
    'Intercepteur global par défaut (Réessaie 429 avec 1s de délai, puis 200 OK)',
  'k8sRetryBackoffInterceptor.modeCustom': 'Personnalisé HttpContext (maxAttempts: 2, base: 400ms, égal jitter)',
  'k8sRetryBackoffInterceptor.modeDisabled': 'Désactivé via HttpContext (K8S_RETRY_BACKOFF_CONFIG: false)',
  'k8sRetryBackoffInterceptor.btnSend': 'Envoyer la requête interceptée',
  'k8sRetryBackoffInterceptor.example2Title': 'Exemple 2 : Personnalisation par requête et exclusion via HttpContext',
  'k8sRetryBackoffInterceptor.example2Desc':
    'Utilisez K8S_RETRY_BACKOFF_CONFIG dans HttpContext pour configurer des limites personnalisées ou désactiver le réessai sur les vérifications rapides :',
  'k8sRetryBackoffInterceptor.apiSummary':
    'Intercepteur HTTP fonctionnel qui applique retry-on-backoff aux réponses HTTP 429 de Kubernetes.',
  'k8sRetryBackoffInterceptor.factorySummary':
    'Fonction Factory créant un HttpInterceptorFn avec une configuration de sauvegarde par défaut personnalisée.',
  'k8sRetryBackoffInterceptor.paramDefaultConfig':
    'Configuration par défaut appliquée à toutes les requêtes sauf surcharge via HttpContext.',
  'k8sRetryBackoffInterceptor.tokenSummary':
    'HttpContextToken pour configurer ou désactiver le réessai pour une requête individuelle.',
  'ifValidator.overview':
    "ngx-lift fournit des fonctions utiles pour créer des validateurs conditionnels dans Angular Reactive Forms. Les validateurs conditionnels permettent d'appliquer des fonctions de validation spécifiées en fonction d'une condition donnée. Il y a deux fonctions principales exportées : <code>ifValidator</code> pour les validateurs synchrones et <code>ifAsyncValidator</code> pour les validateurs asynchrones.",
  'ifValidator.example1Title': 'Exemple 1 : Validateur obligatoire conditionnel',
  'ifValidator.example1Desc':
    'Exiger une entrée de raison et une entrée de courriel seulement lorsque l\'option "Désolé" est sélectionnée. Le validateur requis est appliqué au contrôle d\'entrée de texte seulement lorsque l\'option "Désolé" est choisie.',
  'ifValidator.question': 'Tu aimes cet outil ?',
  'ifValidator.optLike': 'Bien sûr.',
  'ifValidator.optUnlike': 'Désolé.',
  'ifValidator.emailHelper': 'Champ requis uniquement lorsque vous choisissez Désolé',
  'ifValidator.invalidEmail': 'Courriel non valide',
  'ifValidator.reasonLabel': "Pourquoi tu n'aimes pas ?",
  'ifValidator.autoRevalidationTitle': 'Validation automatique:',
  'ifValidator.autoRevalidationDesc':
    "Par défaut, Angular ne réévalue que les validateurs d'un contrôle lorsqu'une valeur du contrôle change. Associez <code>revalidateOnChange([email, reason], choice)</code> ou passez un <code>Signal&lt;boolean&gt;</code> avec <code>revalidateOnChange</code> pour déclencher automatiquement la ré-validation chaque fois que la source de condition est mise à jour !",
  'ifValidator.example2Title': 'Exemple 2: ifAsyncValidator',
  'ifValidator.example2Desc':
    "<code>ifAsyncValidator</code> partage des similarités avec <code>ifValidator</code> mais diffère en ce sens qu'il accepte deux paramètres : la condition et une fonction AsyncValidation, spécialement conçue pour les opérations asynchrones.",
  'ifValidator.apiSummary':
    "Crée un validateur conditionnel qui applique des fonctions de validation en fonction d'une condition.",
  'ifValidator.paramCondition':
    'Fonction qui retourne true pour appliquer trueValidatorFn, ou false pour appliquer falseValidatorFn.',
  'ifValidator.paramTrueValidatorFn': 'Validateur function(s) appliqué lorsque la condition est vraie.',
  'ifValidator.paramFalseValidatorFn': '(Facultatif) Validateur function(s) appliqué lorsque la condition est fausse.',
  'ifAsyncValidator.apiSummary':
    "Crée un validateur asynchrone conditionnel qui applique une fonction de validation asynchrone en fonction d'une condition.",
  'ifAsyncValidator.paramCondition': "Fonction déterminant si le validateur d'async doit être appliqué.",
  'ifAsyncValidator.paramAsyncValidatorFn': 'La fonction async validator à exécuter lorsque la condition est vraie.',
  'intersectionValidator.overview':
    "L'<code>intersectionValidator</code> est un validateur personnalisé pour Angular Forms conçu pour assurer que deux contrôles de formulaire ne partagent pas de valeurs communes. Par exemple, vous pourriez avoir deux listes d'éléments et vouloir assurer qu'ils n'ont pas de doublons. Lorsqu'il y a un overlap entre les tableaux, les deux champs et le formulaire auront l'<code>{intersection: true}</code> erreur.",
  'intersectionValidator.example1Title': 'Exemple 1 : Valider les tableaux de non-overlaping',
  'intersectionValidator.example1Desc':
    "S'assurer que les espaces de noms inclus et les espaces de noms exclus ne se chevauchent pas. Les deux champs doivent retourner les tableaux.",
  'intersectionValidator.includedNamespaces': 'Espaces de noms inclus',
  'intersectionValidator.excludedNamespaces': 'Espaces de noms exclus',
  'intersectionValidator.overlapError':
    'Les espaces de noms inclus et les espaces de noms exclus ne peuvent pas se chevaucher',
  'intersectionValidator.overlapAlert':
    'Les espaces de noms inclus et les espaces de noms exclus ont des chevauchements',
  'intersectionValidator.returnsDesc':
    "Une fonction de validation qui renvoie <code>{intersection: true}</code> si les tableaux se chevauchent, ou <code>null</code> s'ils ne le font pas. Vous pouvez vérifier cette erreur dans le formulaire en accédant à <code>form.errors?.['intersection']</code>.",
  'intersectionValidator.apiSummary':
    "Valide que deux contrôles de formulaire à valeur d'array n'ont pas d'éléments en commun.",
  'intersectionValidator.paramArray1Key': 'Le nom du premier contrôle du formulaire.',
  'intersectionValidator.paramArray2Key': 'Le nom de la deuxième forme de contrôle.',
  'uniqueValidator.overview':
    "L'<code>uniqueValidator</code> est un validateur personnalisé pour Angular Forms conçu pour vérifier l'unicité sur plusieurs champs d'un <code>FormArray</code> ou <code>FormGroup</code>. Il assure que chaque valeur de contrôle est unique parmi toutes les autres valeurs des contrôles dans le tableau ou le groupe.",
  'uniqueValidator.example1Title': 'Exemple 1 : Tableau de FormControls',
  'uniqueValidator.example1Desc':
    "Si vous avez un tableau de FormControls individuel et que vous voulez assurer l'unicité, joignez <code>UniqueValidator.unique()</code> au FormArray que vous souhaitez valider.",
  'uniqueValidator.calloutSameValue':
    "Tapez la même valeur dans les contrôles ci-dessous et voyez l'effet en cas de flou.",
  'uniqueValidator.controlLabel': 'Contrôle',
  'uniqueValidator.controlHelper': 'La valeur de contrôle devrait être unique',
  'uniqueValidator.duplicated': 'Dupliqué',
  'uniqueValidator.example2Title': 'Exemple 2: Array de FormGroups avec des paires de valeurs clés',
  'uniqueValidator.example2Desc':
    "Dans une scenario plus complexe, imaginez que vous avez un tableau de <code>FormGroups</code>, chacun contenant des paires clé-valeur comme <code>FormControls</code>. Vous voulez assurer l'unicité des valeurs des contrôles clés (contrôles ci-dessous) à travers tous les groupes. Pour ce cas, vous pouvez passer un sélecteur de contrôl comme argument de <code>UniqueValidator.unique(controlSelector)</code>.",
  'uniqueValidator.keyCallout': "Tapez la même valeur en dessous des contrôles clés et voyez l'effet en cas de flou.",
  'uniqueValidator.keyPlaceholder': 'contrôle des clés',
  'uniqueValidator.keyHelper': 'le contrôle clé devrait être unique',
  'uniqueValidator.valuePlaceholder': 'Contrôle de la valeur',
  'uniqueValidator.valueHelper': "Le contrôle de valeur n'a pas de validation",
  'uniqueValidator.returnsDesc':
    'Une fonction de validation qui renvoie <code>{notUnique: true}</code> si des valeurs dupliquées sont trouvées, ou <code>null</code> si toutes les valeurs sont uniques.',
  'uniqueValidator.usageNotes': "Notes d'utilisation",
  'uniqueValidator.usageNotesDesc':
    'Déclencher la méthode <code>updateValueAndValidity()</code> de la commande au besoin pour valider à nouveau lorsque les valeurs changent.',
  'uniqueValidator.apiSummary': "Valide l'unicité sur les contrôles de FormArray ou les valeurs d'array.",
  'uniqueValidator.paramKey':
    "(Facultatif) Clé de propriété pour vérifier l'unicité des objets. Si omis, vérifie l'égalité primitive.",
  'dateRangeValidator.overview':
    "L'<code>dateRangeValidator</code> est un validateur personnalisé qui valide que la date est dans une plage spécifiée. Il prend en charge la validation pour des valeurs de date uniquement et des valeurs de date-heure, avec des bornes inclusives/exclusives configurables et une comparaison optionnelle du temps.",
  'dateRangeValidator.example1Title': 'Exemple 1: Validation de la plage de dates',
  'dateRangeValidator.example1Desc':
    "Valide que la date est entre une date minimale et une date maximale. Cette configuration assure que la date sélectionnée doit être entre le 1er septembre 2024 et le 15 septembre 2024 (exclus), en ignorant les composants de temps. Le 15 septembre n'est pas valide car <code>maxInclusive</code> est faux.",
  'dateRangeValidator.example2Title': 'Exemple 2: Sélectionner une date future',
  'dateRangeValidator.example2Desc':
    "L'exemple ci-dessous permet de sélectionner une date future et d'inclure aujourd'hui. Pour inclure le <code>minDate</code>, définissez <code>minInclusive</code> à <code>true</code>.",
  'dateRangeValidator.expiresRawLabel': "Date d'expiration (entrée Raw HTML)",
  'dateRangeValidator.minDateError': 'La date ne peut être antérieure à {{ minDate }}',
  'dateRangeValidator.futureDaysLabel': 'Futurs 5 jours (entrée de la date Clarity)',
  'dateRangeValidator.invalidDate': 'La date est invalide',
  'dateRangeValidator.maxDateError': 'La date ne peut être postérieure à {{ maxDate }}',
  'dateRangeValidator.clarityMax': 'La date est trop tardive (validation de la clarté)',
  'dateRangeValidator.clarityMin': 'La date est trop tôt (validation de la clarté)',
  'dateRangeValidator.minMaxCallout':
    "Nous pourrions utiliser le modèle <code>min</code> et <code>max</code> pour valider la plage. Cependant, cette validation ne échouera pas lors de la saisie d'un nombre comme 12 ou d'une chaîne comme 12hello.",
  'dateRangeValidator.example3Title': "Exemple 3 : Validation de la date et de l'intervalle",
  'dateRangeValidator.example3Desc':
    "Pour valider à la fois la date et l'heure, définissez <code>compareTime</code> sur vrai. Avec la configuration ci-dessous, la date et l'heure sélectionnées doivent être entre le 1er septembre 2024 à midi UTC et le 2 septembre 2024 à midi UTC, en tenant compte des composants de temps.",
  'dateRangeValidator.dateTimeExpires': "Date d'expiration",
  'dateRangeValidator.dateTimeMinError': "L'heure de la date ne peut pas être antérieure à {{ minDate }}",
  'dateRangeValidator.dateTimeMaxError': 'La date ne peut pas être postérieure à {{ maxDate }}',
  'dateRangeValidator.returnsDesc': 'Une fonction de validation qui peut être utilisée avec Angular Reactive Forms.',
  'dateRangeValidator.validationErrors': 'Erreurs de validation',
  'dateRangeValidator.errInvalidDate':
    'Renvoyé lorsque la date est invalide (p. ex., « 2023-13-01 » ou « hello world »)',
  'dateRangeValidator.errMinDate':
    "Renvoyé lorsque la date sélectionnée est antérieure ou égale à la date minimale autorisée. La valeur d'erreur est la date minimale autorisée formatée sous la forme d'une chaîne ISO.",
  'dateRangeValidator.errMaxDate':
    "Renvoyé lorsque la date sélectionnée est postérieure ou égale à la date maximale autorisée. La valeur d'erreur est la date maximale autorisée formatée en chaîne ISO.",
  'dateRangeValidator.apiSummary':
    'Valide que la valeur de date est dans une plage spécifiée de minDate et/ou maxDate.',
  'dateRangeValidator.paramOptions':
    'Configuration de DateRangeOptions avec les drapeaux minDate, maxDate et inclusivité.',
  'dateRangeValidator.optMinDate': 'Date minimale acceptable.',
  'dateRangeValidator.optMaxDate': 'Date maximale acceptable.',
  'dateRangeValidator.optMinInclusive': 'Indique si la date minimale est inclusive.',
  'dateRangeValidator.optMaxInclusive': 'Indique si la date maximale est inclusive.',
  'rangePipe.overview':
    "Le <code>range</code> pipe génère un tableau de nombres dans une plage spécifiée, ce qui en fait idéal pour créer des options de liste déroulante, des contrôles de pagination ou tout autre scenario nécessitant des séquences numériques dans les modèles. Lorsque vous travaillez avec des modèles Angular, vous pourriez avoir besoin de générer un tableau de nombres pour l'itération. Par exemple, si vous avez le nombre 20 et que vous voulez créer un tableau de 1 à 20 pour l'afficher dans une liste déroulante, la directive <code>@for</code> d'Angular ne peut pas itérer directement sur un nombre. Bien que vous puissiez générer ce tableau en TypeScript, il y a des cas où il est plus pratique de le créer directement dans le modèle.",
  'rangePipe.callout1':
    'La pipe <code>range</code> crée un tableau de nombres (positifs et/ou négatifs) allant de démarrage à <strong> mais non compris, end</strong>.',
  'rangePipe.callout2': 'Une étape de -1 est utilisée si un démarrage négatif est spécifié sans fin ou pas.',
  'rangePipe.callout3': "Si la fin n'est pas spécifiée, il est réglé pour démarrer avec le début puis réglé à 0.",
  'rangePipe.callout4':
    'Une fonction utilitaire <code>range</code> est également disponible pour une utilisation dans TypeScript, qui peut être importée de <code>ngx-lift</code>.',
  'rangePipe.example1Title': 'Exemple 1 : Portée de base',
  'rangePipe.example1Desc': 'Générer des tableaux avec différentes valeurs de début et de fin :',
  'rangePipe.example2Title': "Exemple 2: Avec la valeur de l'étape",
  'rangePipe.example2Desc': "Générer des tableaux avec une valeur d'étape personnalisée :",
  'rangePipe.example3Title': 'Exemple 3: Mise en marche inversée',
  'rangePipe.example3Desc': 'Générer des tableaux en ordre inverse :',
  'rangePipe.example4Title': 'Exemple 4 : Sélection déroulante',
  'rangePipe.example4Desc':
    "Générer des options de comptage CPU pour une liste déroulante. Ceci est utile pour afficher une liste d'ordinateurs avec des nombres CPU maximums variables et permettre aux utilisateurs de sélectionner une gamme CPU.",
  'rangePipe.cpuLabel': 'Choisir le nombre de CPU',
  'rangePipe.cpuOption': '{{ count }} CPU(s)',
  'rangePipe.returnsDesc': 'Un tableau de nombres dans la plage spécifiée.',
  'rangePipe.apiSummary': 'Pipule Angular qui génère un tableau de nombres dans une plage spécifiée.',
  'rangePipe.paramValue':
    'Array spécifiant [fin], [départ, fin], [départ, fin, étape], ou [départ, fin, étape, inclusive].',
  'isHttpsPipe.overview':
    "Le <code>isHttps</code> est un pipe Angular qui vérifie si une chaîne de URL utilise le protocole HTTPS. Il est utile pour le rendu conditionnel, la validation ou les vérifications de sécurité dans les templates. Une fonction utilitaire <code>isHttps</code> correspondante est également disponible pour l'utilisation en TypeScript.",
  'isHttpsPipe.example1Title': 'Exemple 1: Utilisation de base',
  'isHttpsPipe.example1Desc': 'Vérifiez si un protocole URL utilise le protocole HTTPS :',
  'isHttpsPipe.example2Title': 'Exemple 2 : Rendu conditionnel',
  'isHttpsPipe.example2Desc': 'Rendre les composants sous condition basés sur le statut HTTPS :',
  'isHttpsPipe.example3Title': 'Exemple 3: Validation de la sécurité',
  'isHttpsPipe.example3Desc': 'Afficher les indicateurs de sécurité basés sur le protocole :',
  'isHttpsPipe.apiSummary': 'Pipe Angular qui vérifie si une chaîne de URL utilise le protocole HTTPS.',
  'isHttpsPipe.paramValue': 'La chaîne URL à vérifier.',
  'isHttpsPipe.returnsDesc': 'true si le protocole URL utilise HTTPS, false sinon.',
  'arrayJoinPipe.overview':
    "Le <code>arrayJoin</code> est un pipe Angular qui joint les éléments d'un tableau en une chaîne en utilisant un séparateur spécifié. Il offre une méthode pratique pour afficher les données d'un tableau sous forme de chaînes séparées par des virgules ou sous forme de séparateurs personnalisés dans les templates.",
  'arrayJoinPipe.example1Title': 'Exemple 1: Utilisation de base',
  'arrayJoinPipe.example1Desc': 'Joindre des éléments de tableau avec le séparateur de virgule par défaut :',
  'arrayJoinPipe.example2Title': 'Exemple 2: Séparateurs personnalisés',
  'arrayJoinPipe.example2Desc': "Utiliser différents séparateurs pour différents cas d'utilisation :",
  'arrayJoinPipe.example3Title': 'Exemple 3: Arrays numériques',
  'arrayJoinPipe.example3Desc': 'Rejoignez des tableaux numériques avec différents séparateurs :',
  'arrayJoinPipe.apiSummary':
    "Pipe Angular qui joint les éléments d'un tableau en une chaîne en utilisant un séparateur spécifié.",
  'arrayJoinPipe.paramValue': "Le tableau à joindre. Si ce n'est pas un tableau, retourne la valeur telle qu'elle est.",
  'arrayJoinPipe.paramSeparator':
    '(Facultatif) La chaîne de séparateur à utiliser entre les éléments. Par défaut à ",".',
  'arrayJoinPipe.returnsDesc':
    "Une chaîne contenant les éléments de tableau joints, ou la valeur originale si ce n'est un tableau.",
  'maskPipe.overview':
    "Le <code>mask</code> est un pipe Angular conçu pour masquer les données sensibles en remplaçant les caractères par des étoiles, tout en préservant un nombre configurable de caractères à l'origine et à la fin. Il est idéal pour cacher des informations sensibles dans les interfaces utilisateur, telles que les numéros de carte bancaire, les numéros de téléphone ou les clés API.",
  'maskPipe.example1Title': 'Exemple 1: Utilisation de base',
  'maskPipe.example1Desc':
    'Chaînes sensibles au masque avec paramètres par défaut (6 caractères visibles au début et à la fin) :',
  'maskPipe.example2Title': 'Exemple 2: Options de masquage personnalisées',
  'maskPipe.example2Desc': 'Personnaliser le nombre de caractères visibles au début et à la fin de la chaîne :',
  'maskPipe.example3Title': 'Exemple 3 : Masquage des cartes de crédit',
  'maskPipe.example3Desc': 'Masque les numéros de carte de crédit tout en montrant les 4 derniers chiffres:',
  'maskPipe.example4Title': 'Exemple 4 : Basculer le masque',
  'maskPipe.example4Desc': 'Afficher et masquer sous condition les données sensibles:',
  'maskPipe.maskingConditions': 'Conditions de masquage',
  'maskPipe.conditionsDesc': 'Le tuyau applique le masquage selon les conditions suivantes:',
  'maskPipe.cond1':
    "La longueur de la chaîne d'entrée doit être supérieure à la somme de <code>unmaskedPrefixLength</code> et <code>unmaskedSuffixLength</code>.",
  'maskPipe.cond2':
    '<code>unmaskedPrefixLength</code> et <code>unmaskedSuffixLength</code> ne doivent pas être négatifs.',
  'maskPipe.cond3': "L'option <code>masked</code> doit être <code>true</code>.",
  'maskPipe.condFallback': "Si l'une de ces conditions n'est pas remplie, la chaîne originale est retournée inchangée.",
  'maskPipe.apiSummary': 'Pipe Angular qui masque des données sensibles en remplaçant les caractères par des étoiles.',
  'maskPipe.paramValue': "La chaîne d'entrée à masquer.",
  'maskPipe.paramOptions': 'Options de configuration pour masquer le comportement.',
  'maskPipe.returnsDesc':
    "La chaîne masquée, ou la chaîne d'origine si le masquage est désactivé ou si la chaîne est trop courte.",
  'maskPipe.optUnmaskedPrefixLength': 'Nombre de caractères à laisser non masqués au début. Par défaut à 6.',
  'maskPipe.optUnmaskedSuffixLength': 'Nombre de caractères à laisser non masqués à la fin. Par défaut à 6.',
  'maskPipe.optMaskChar': 'Caractère utilisé pour masquer. Par défaut à "*".',
  'maskPipe.optEnabled': 'Indique si le masquage est activé.',
  'byteConverterPipe.overview':
    "Le <code>byteConverter</code> est un pipe qui convertit les valeurs numériques en octets en des chaînes de taille humainement lisible (par exemple, « 1,5 Mo », « 2,3 Go ») avec un formatage en fonction du locale. Il gère automatiquement la conversion des unités (BYTE, KB, MB, GB, TB) et prend en charge l'internationalisation avec des traductions pour plusieurs langues, notamment l'anglais, le français, le chinois, le japonais, le coréen, l'allemand, l'espagnol, l'italien, le portugais et le russe.",
  'byteConverterPipe.example1Title': 'Exemple 1: Utilisation de base',
  'byteConverterPipe.example1Desc': "Convertir les valeurs d'octets en format lisible par l'homme :",
  'byteConverterPipe.example2Title': 'Exemple 2: Affichage de la taille du fichier',
  'byteConverterPipe.example2Desc': 'Afficher la taille des fichiers dans un format convivial :',
  'byteConverterPipe.example3Title': "Exemple 3: Différentes conversions d'unités",
  'byteConverterPipe.example3Desc': "Le tuyau se convertit automatiquement à l'unité appropriée:",
  'byteConverterPipe.languageSupport': 'Appui linguistique',
  'byteConverterPipe.languageSupportDesc':
    "Le pipe utilise l'identifiant de locale de l'application <code>LOCALE_ID</code> pour déterminer les traductions appropriées des unités. Les langues prises en charge incluent l'anglais, le français, le chinois (simplifié et traditionnel), le japonais, le coréen, l'allemand, l'espagnol, l'italien, le portugais (Brésil) et le russe. Si le langage du navigateur n'est pas pris en charge, l'anglais est utilisé par défaut.",
  'byteConverterPipe.i18nCallout':
    'Pour configurer la prise en charge locale, reportez-vous au <a href="https://angular.io/guide/i18n" target="_blank">Angular i18n documentation</a>.',
  'byteConverterPipe.apiSummary':
    "Pipe Angular qui convertit un nombre d'octets en une chaîne de format humain avec un formatage en fonction du locale.",
  'byteConverterPipe.paramValue':
    "(Facultatif) Le nombre d'octets à convertir. Renvoie null si null, undefined, ou NaN.",
  'byteConverterPipe.returnsDesc':
    'Une chaîne formatée avec une unité appropriée (B, KB, MB, GB, TB) basée sur locale, ou nulle si non valide.',
  'datagridUtil.transformDesc':
    "La fonction convertit l'état datagrid Clarity (contenant des informations de pagination, de tri et de filtre) en un objet PageQuery. Voici un exemple de la transformation :",
  'datagridUtil.inputTitle': 'Entrée : État du Datagrid Clarity',
  'datagridUtil.outputTitle': 'Sortie : objet PageQuery',
  'datagridUtil.usageDesc':
    "Utilisez convertToHttpParams dans votre composant pour convertir l'état datagrid pour les requêtes API :",
  'common.save': 'Enregistrer',
  'common.submit': 'Soumettre',
  'statusIndicator.inputIconStatus': "Statut représenté par l'icône.",
  'statusIndicator.inputIconSize': "Taille de l'icône, y compris sm, md, lg ou une chaîne de pixel.",
  'statusIndicator.inputTooltip': 'Texte facultatif affiché sur le survol ou le focus.',
  'statusIndicator.inputTooltipPosition': "Position de l'outil par rapport à son déclencheur.",
  'tooltip.componentTypeExample': 'Contenu du type de composant',
  'idleDetection.configIdleDuration': "Les secondes d'inactivité avant le début du compte à rebours.",
  'idleDetection.configTimeoutDuration': "Durée du compte à rebours en secondes avant l'heure d'arrêt.",
  'playground.copyFailed': 'Échec de la copie. Sélectionnez et copiez le code manuellement.',
  'header.partialLanguage': 'Traduction partielle ; les textes manquants sont affichés en anglais.',
  'form.masterPassword': 'Mot de passe principal',
  'form.masterPasswordRequired': 'Le mot de passe principal est requis.',
  'grid.refresh': 'Actualiser',
  'grid.firstName': 'Prénom',
  'grid.lastName': 'Nom',
  'grid.email': 'E-mail',
  'home.claritySetup':
    'Pour des conseils sur la configuration du système de conception Clarity dans votre projet, reportez-vous au',
  'home.clarityDocumentation': 'Documentation du système de conception Clarity',
  'resourceAsync.useResource': 'Utiliser resourceAsync lorsque :',
  'resourceAsync.useComputed': 'Utiliser computedAsync lorsque :',
  'resourceAsync.preferMutation':
    'Pour les écritures de serveur, préférez mutateResource. Les soumissions Legacy execute() doivent définir paresseux: true, réactive: false et behavior: exhauste.',
  'resourceAsync.useRead': 'Gérer les opérations de lecture locale (GET), avec reload() pour le refetching.',
  'resourceAsync.useLocal':
    "Gérer l'état local optimiste, les valeurs mises en cache ou les ébauches de formulaire avec set()/update().",
  'resourceAsync.useManual':
    'Déclencher ou réinitialiser explicitement une opération avec reload(), execute() ou reset().',
  'resourceAsync.useStatus':
    "Suivre le ralenti, le chargement, le rechargement, la résolution, l'erreur et les états locaux.",
  'resourceAsync.useLazy': "Reporter l'exécution initiale avec un chargement paresseux.",
  'resourceAsync.useCancel':
    "Annuler les lectures remplacées avec interrupteur ou supprimer les opérations de chevauchement avec l'échappement.",
  'resourceAsync.useComputedReactive':
    'Recalculer automatiquement les données asynchrones lorsque les dépendances du signal changent.',
  'resourceAsync.useComputedConcurrency':
    "Choisissez explicitement l'interrupteur, la fusion, le concat ou le comportement d'échappement.",
  'resourceAsync.useComputedValue':
    "Exposer un seul signal, avec une politique de retour d'erreur explicite ou throwOnError.",
  'resourceAsync.apiSummary':
    'Crée une ressource réactive locale avec un état asynchrone, un annulation, une exécution explicite et des mises à jour locales.',
  'resourceAsync.errorValuePolicy':
    "En cas d'erreur, la valeur précédente est effacée par défaut. Utilisez preserveValueOnError: true pour la conserver.",
  'resourceAsync.notLoaded': 'Non chargé',
  'resourceAsync.noData': 'Pas de données',
  'resourceAsync.lastUpdated': 'Dernière mise à jour',
  'resourceAsync.topicTitle': 'Sujet / Titre',
  'resourceAsync.keyConcepts': 'Concepts clés :',
  'resourceAsync.patternBenefits': 'Avantages liés au modèle :',
  'spinner.inputDecorative': 'Décoratif par défaut. Définissez false pour annoncer le chargement comme un état.',
  'spinner.inputLabel': "Étiquette d'état localisée; par défaut au message de chargement intégré.",
  'fileReader.inputControlId': "ID de l'entrée native, pour association avec une étiquette de formulaire.",
  'fileReader.inputAcceptFiles':
    'Types de fichiers texte acceptés. Ce composant lit le texte, et non les fichiers binaires arbitraires.',
  'fileReader.inputEncoded': 'Émettre le texte comme base64 lorsque activé.',
  'fileReader.inputTextEncoding':
    'UTF-8 par défaut; choisissez latin1 lorsque vous consommez des chaînes de base64 octets.',
  'fileReader.inputMaxSize': 'Taille maximale en MiB. Les fichiers surdimensionnés sont rejetés avant la lecture.',
  'fileReader.inputDisabled': 'Désactiver la sélection et la suppression des fichiers.',
  'fileReader.outputChange': 'Emits texte ou base64 après une sélection de fichiers réussie.',
  'k8sRetryBackoff.paramJitter':
    "Stratégie de jeu d'automne. Un jeu égal attend entre la moitié et le plafond exponentiel complet.",
  'k8sRetryBackoff.paramHintJitter':
    'Une attente aléatoire supplémentaire après un indice de serveur, en millisecondes.',
  'k8sRetryBackoff.paramMaxDelay':
    'Une attente individuelle maximale. Une pointe de serveur plus longue arrête les rétractations sans raccourcir la pointe.',
  'k8sRetryBackoff.paramWaitBudget':
    "Budget d'attente cumulatif prévu; exclut le temps consacré aux demandes de réseau.",
  'k8sRetryBackoff.paramMethods':
    "Méthode uniquement intercepteur allowlist. POST/PATCH nécessite l'opt-in et l'idempotency du paramètre explicite.",
  'k8sRetryBackoff.paramRandom':
    'Source aléatoire renvoyant un nombre fini dans [0, 1), pour la programmation déterministe.',
  'k8sRetryBackoff.retryContract':
    "Paramètres par défaut : cinq tentatives, un repli exponentiel avec un jitter égal, jusqu'à 250 ms supplémentaires sur les indices du serveur, 30 secondes par attente et 60 secondes totales d'attentes programmées. Les indices trop volumineux arrêtent les tentatives. Les intercepteurs redéparent par défaut les méthodes idempotentes ; les méthodes POST/PATCH nécessitent une garantie d'endpoint.",
  'k8sRetryBackoff.paramMinDelay':
    "L'attente minimale de retour pour chaque stratégie de jeu ; ne peut pas dépasser maxDelayMs. Les conseils du serveur sont inchangés.",
  'k8sRetryBackoff.paramStatuses':
    "Les états HTTP admissibles. D'autres erreurs se propagent sans changement; les états additionnels nécessitent un examen des paramètres.",
  'k8sRetryBackoff.paramPredicate':
    "Filtre d'erreur supplémentaire, appliqué après la vérification d'état. Il n'autorise pas POST/PATCH par lui-même.",
  'k8sRetryBackoff.paramLogRetries':
    "Activer l'enregistrement de nouveau après que le délai passe les vérifications du budget d'attente.",
  'k8sRetryBackoff.paramLabel':
    "Les étiquettes d'intercepteur générées omettent les chaînes de requête et les fragments; effacent les étiquettes personnalisées.",
  'k8sRetryBackoff.paramLogger':
    "Fonction de journalisation facultative recevant attempt, maxRetries, delayMs, error et label. Masquez les données sensibles des erreurs ; une erreur de journalisation n'interrompt pas les nouvelles tentatives.",
  'k8sRetryBackoffInterceptor.postDefault': 'POST: par défaut (aucune réessayer)',
  'k8sRetryBackoffInterceptor.postOptIn': 'POST: explicitement Kubernetes opt-in',
  'k8sRetryBackoffInterceptor.postGateway': 'POST: passerelle 429 (rejetée)',
  'demoApi.key-value-inputs-demo.inputs.formArray':
    "L'instance FormArray du composant parent utilisée pour gérer les paires clé-valeur.",
  'demoApi.key-value-inputs-demo.inputs.data':
    "Données d'initialisation pour préremplir le formulaire avec des paires clé-valeur existantes.",
  'demoApi.key-value-inputs-demo.inputs.uniqueKey':
    'Fixez à <code>true</code> pour activer la validation de clé unique. Utilise <code>UniqueValidator</code> de ngx-lift.',
  'demoApi.key-value-inputs-demo.inputs.keyHelper': "Texte d'aide pour le champ de saisie de la clé.",
  'demoApi.key-value-inputs-demo.inputs.valueHelper': "Texte d'aide pour le champ de saisie de la valeur.",
  'demoApi.key-value-inputs-demo.inputs.addText': 'Texte pour le bouton « Ajouter un couple clé-valeur ».',
  'demoApi.key-value-inputs-demo.inputs.inputSize': "Taille des champs d'entrée.",
  'demoApi.key-value-inputs-demo.inputs.buttonClass':
    'Classe personnalisée à appliquer au bouton « Ajouter un couple clé-valeur ».',
  'demoApi.key-value-inputs-demo.inputs.smartMode':
    "Si définie à <code>true</code>, le composant créera automatiquement un couple clé-valeur lorsqu'il n'y a pas de champs clé-valeur.",
  'demoApi.key-value-inputs-demo.inputs.keyPattern':
    'Si le contrôle clé doit passer un modèle régulier personnalisé. Vous pouvez passer un objet avec deux clés : <code>regex</code> et <code>message</code>. La propriété <code>message</code> est optionnelle.',
  'demoApi.key-value-inputs-demo.inputs.valuePattern':
    'Similaire à <code>keyPattern</code>, mais utilisée pour la validation du contrôle de valeur.',
  'demoApi.key-value-inputs-demo.outputs.removeKeyValue':
    "Événement émis lorsque un couple clé-valeur est supprimé. Fournit l'index du couple supprimé.",
  'demoApi.key-value-inputs-demo.outputs.addKeyValue':
    'Événement émis lorsque un nouveau couple clé-valeur est ajouté.',
  'demoApi.multi-alerts-demo.methods.addAlert(options: Alert)':
    'Ajoute une nouvelle alerte avec les options spécifiées.',
  'demoApi.multi-alerts-demo.methods.deleteAlert(id: symbol)': 'Supprime une alerte par son ID.',
  'demoApi.multi-alerts-demo.methods.clearAlerts()': 'Efface toutes les alertes.',
  'demoApi.multi-alerts-demo.alertProperties.content':
    "Le message de l'alerte. Le formatage HTML sécurisé est pris en charge.",
  'demoApi.multi-alerts-demo.alertProperties.alertType': "Le type d'alerte.",
  'demoApi.multi-alerts-demo.alertProperties.actions':
    'Boutons natifs. Chaque action fournit <code>label: string</code> et <code>onClick: () => void</code>.',
  'demoApi.multi-alerts-demo.alertProperties.isAppLevel': "Si cette est une alerte à niveau d'application.",
  'demoApi.multi-alerts-demo.alertProperties.targetSelector':
    "Le sélecteur (ID, classe, etc.) d'un élément cliquable (bouton, lien, etc.) n'importe où dans le contenu de l'alerte.",
  'demoApi.multi-alerts-demo.alertProperties.onTargetClick':
    "La fonction de rappel est exécutée lorsque l'élément correspondant à <code>targetSelector</code> dans le contenu de l'alerte est cliqué.",
  'demoApi.theme-toggle-demo.componentInputs.lang':
    "Code de langue explicite pour les balises d'information localisées.",
  'demoApi.theme-toggle-demo.componentOutputs.changeTheme':
    "Émet <code>ClarityTheme</code> ('light' | 'dark') chaque fois que le thème est basculé.",
  'demoApi.theme-toggle-demo.serviceProperties.theme': "Thème actif ('light' | 'dark').",
  'demoApi.theme-toggle-demo.serviceMethods.setTheme(newTheme: ClarityTheme)':
    'Fixe le thème, le stocke dans le stockage et met à jour le DOM.',
  'demoApi.timeline-wizard-demo.wizardInputs.timelineSteps':
    "Un tableau d'objets <code>TimelineStep</code> représentant les étapes du guide d'installation.",
  'demoApi.timeline-wizard-demo.wizardInputs.live':
    "Contrôle si les composants d'étapes doivent être détruits lors du clic sur les boutons précédent/suivant.",
  'demoApi.timeline-wizard-demo.wizardInputs.confirmButtonText': 'Le texte du bouton "Fin" sur l\'étape finale.',
  'demoApi.timeline-wizard-demo.wizardOutputs.confirmed':
    'Émet les données des étapes précédentes lors du clic sur le bouton "Fin" dans l\'étape finale.',
  'demoApi.timeline-wizard-demo.wizardOutputs.canceled': "Émet lorsque le guide d'installation est annulé.",
  'demoApi.timeline-wizard-demo.wizardOutputs.finished':
    "Émet lorsque le guide d'installation est correctement terminé.",
  'demoApi.timeline-wizard-demo.wizardMethods.cancel()':
    "Annule le guide d'installation et émet l'événement <code>canceled</code>.",
  'demoApi.timeline-wizard-demo.wizardMethods.nextStep()': "Passage à l'étape suivante du guide d'installation.",
  'demoApi.timeline-wizard-demo.wizardMethods.previousStep()': "Passage à l'étape précédente du guide d'installation.",
  'demoApi.timeline-wizard-demo.baseProperties.allStepsData':
    "Un tableau contenant les données de toutes les étapes du guide d'installation. Disponible en tant qu'entrée de propriété, accessible dans <code>ngOnInit</code> et plus tard dans les hooks de cycle de vie.",
  'demoApi.timeline-wizard-demo.baseProperties.currentStepData':
    "Les données de l'étape actuelle ou <code>null</code> si elles ne sont pas disponibles. Disponible en tant qu'entrée de propriété, accessible dans <code>ngOnInit</code> et plus tard dans les hooks de cycle de vie.",
  'demoApi.timeline-wizard-demo.baseProperties.form':
    "Le groupe de formulaires associé à l'étape. Fixé à <code>null</code> pour les étapes sans formulaire. Remplacez cette propriété dans votre composant d'étape.",
  'demoApi.timeline-wizard-demo.baseProperties.next$':
    'Un observable qui émet lorsqu\'on clique sur le bouton "Suivant". Remplacez-le pour effectuer des actions personnalisées, comme des appels à une API.',
  'demoApi.timeline-wizard-demo.baseProperties.stepInvalid': "Indique si le formulaire de l'étape est invalide.",
  'demoApi.timeline-wizard-demo.baseMethods.formValueToData()':
    "Convertit la valeur du formulaire de l'étape en données. Remplacez cette méthode si la structure de votre formulaire ne correspond pas à la structure des données de l'étape.",
  'demoApi.timeline-wizard-demo.baseMethods.dataToFormValue(data)':
    "Convertit les données de l'étape en valeur du formulaire utilisable pour <code>patchValue</code>. Remplacez cette méthode si la structure de votre formulaire ne correspond pas à la structure des données de l'étape.",
  'demoApi.timeline-wizard-demo.stepProperties.state':
    "L'état de l'étape de timeline (par exemple, 'non-débuté', 'actuel', 'réussi', 'erreur').",
  'demoApi.timeline-wizard-demo.stepProperties.header': "L'en-tête de l'étape de timeline.",
  'demoApi.timeline-wizard-demo.stepProperties.title':
    "Le titre de l'étape de timeline, servant d'identifiant (doit être unique). Peut être utilisé pour trouver les données de l'étape via <code>getStepData</code>.",
  'demoApi.timeline-wizard-demo.stepProperties.id':
    "L'identifiant de l'étape de timeline, servant d'identifiant principal. Si l'identifiant n'est pas fourni, il utilisera le titre comme identifiant par défaut. Peut être utilisé pour trouver les données de l'étape via <code>getStepData</code>.",
  'demoApi.timeline-wizard-demo.stepProperties.description': "La description de l'étape de timeline.",
  'demoApi.timeline-wizard-demo.stepProperties.component':
    "Le composant Angular associé à l'étape de timeline. Doit étendre <code>TimelineBaseComponent</code>.",
  'demoApi.timeline-wizard-demo.stepProperties.data':
    "Les données de l'étape, qui seront converties en données de formulaire par le composant de wizard de timeline et passées au composant d'étape comme <code>currentStepData</code>.",
  'demoApi.timeline-wizard-demo.serviceProperties.currentStepIndex': "Obtenez l'index de l'étape actuelle.",
  'demoApi.timeline-wizard-demo.serviceProperties.isFirstStep': "Vérifiez si l'étape actuelle est la première étape.",
  'demoApi.timeline-wizard-demo.serviceProperties.isLastStep': "Vérifiez si l'étape actuelle est la dernière étape.",
  'demoApi.timeline-wizard-demo.serviceProperties.currentStep': "Obtenez l'objet de l'étape actuelle.",
  'demoApi.timeline-wizard-demo.serviceProperties.currentStepData': 'Obtenez les données du pas actuel.',
  'demoApi.timeline-wizard-demo.serviceProperties.allStepsData':
    'Obtenez toutes les données des pas à vérifier. Retourne un tableau avec les identifiants des pas et les données.',
  'demoApi.timeline-wizard-demo.serviceMethods.getStepData<T>(key: string)':
    "Obtenez les données d'un pas spécifique par son ID ou son titre. Retourne <code>null</code> si le pas n'est pas trouvé.",
  'demoApi.toast-demo.methods.addToast(options: ToastOptions)': 'Créez une notification avec les options spécifiées.',
  'demoApi.toast-demo.methods.success(options: ToastOptions)':
    'Créez une notification de réussite avec les options spécifiées.',
  'demoApi.toast-demo.methods.info(options: ToastOptions)':
    "Créez une notification d'information avec les options spécifiées.",
  'demoApi.toast-demo.methods.warning(options: ToastOptions)':
    "Créez une notification d'avertissement avec les options spécifiées.",
  'demoApi.toast-demo.methods.error(options: ToastOptions)':
    "Créez une notification d'erreur avec les options spécifiées.",
  'demoApi.toast-demo.toastOptions.title': 'Le titre de la message de notification.',
  'demoApi.toast-demo.toastOptions.description': 'La description de la message de notification.',
  'demoApi.toast-demo.toastOptions.toastType': 'Le type de notification.',
  'demoApi.toast-demo.toastOptions.date': 'Un instantané relatif (par exemple, "1hr ago").',
  'demoApi.toast-demo.toastOptions.manualClosable': 'Si la notification peut être fermée manuellement.',
  'demoApi.toast-demo.toastOptions.timeoutSeconds':
    'Le nombre de secondes avant que la notification ne se ferme automatiquement. Si non fourni, utilisez la valeur par défaut du conteneur.',
  'demoApi.toast-demo.toastOptions.primaryButtonText': "Texte pour le bouton d'action principal.",
  'demoApi.toast-demo.toastOptions.primaryButtonClick': 'Fonction de rappel pour le clic du bouton principal.',
  'demoApi.toast-demo.toastOptions.secondaryButtonText': "Texte pour le bouton d'action secondaire.",
  'demoApi.toast-demo.toastOptions.secondaryButtonClick': 'Fonction de rappel pour le clic sur le bouton secondaire.',
  'demoApi.toast-demo.toastOptions.closed': "Fonction de rappel appelée lorsqu'le toast est fermé.",
  'demoApi.toast-demo.containerInputs.timeoutSeconds': "Temps d'attente par défaut en secondes pour les toasts.",
  'demoApi.toast-demo.containerInputs.manualClosable': 'Si les toasts peuvent être fermés manuellement par défaut.',
  'demoApi.toast-demo.containerInputs.topOffset': "Distance depuis le haut de l'écran en pixels.",
  'demoApi.tooltip-demo.inputs.cllTooltip':
    "Contenu simple en tant que chaîne pour l'outil de bouton. Peut être utilisé comme abréviation pour <code>cllTooltipContent</code>.",
  'demoApi.tooltip-demo.inputs.cllTooltipContent':
    "Le contenu à afficher dans l'outil de bouton. Peut être une chaîne, une référence de modèle, une référence de composant ou un type de composant.",
  'demoApi.tooltip-demo.inputs.cllTooltipContentContext':
    "Objet de contexte à passer au modèle lors de l'utilisation de <code>TemplateRef</code> comme contenu.",
  'demoApi.tooltip-demo.inputs.cllTooltipWidth': "Largeur de l'outil de bouton en pixels.",
  'demoApi.tooltip-demo.inputs.cllTooltipPosition':
    "Position de l'outil de bouton par rapport à l'élément. Les options incluent 'tooltip-top-right', 'tooltip-top-left', etc.",
  'demoApi.tooltip-demo.inputs.cllTooltipHideDelay':
    "Délai en millisecondes avant de cacher l'outil de bouton après le départ de la souris.",
  'demoApi.mutate-resource.mutateResourceApiProps.mutation':
    "Fonction asynchrone ou observable exécutant l'opération d'écriture côté serveur.",
  'demoApi.mutate-resource.mutateResourceApiProps.options.invalidateTags':
    'Tags à invalider après une écriture réussie. Planifie immédiatement des rafraîchissements pour les requêtes actives.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.concurrency':
    "Stratégie pour les appels superposés : parallèle (par défaut), exhaust (joins en cours), concat (file d'attente).",
  'demoApi.mutate-resource.mutateResourceApiProps.options.injector':
    "Injecteur Angular explicite optionnel pour la registration des signaux en dehors du contexte d'injection.",
  'demoApi.mutate-resource.mutateResourceApiProps.options.client':
    'Surcharge optionnelle du QueryClient (par défaut, le token QUERY_CLIENT).',
  'demoApi.mutate-resource.mutateResourceRefApiProps.value':
    'Signal contenant le dernier résultat résolu avec succès de la mutation.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.error':
    "Signal contenant l'erreur la plus récente de la mutation, ou null lorsqu'elle est saine.",
  'demoApi.mutate-resource.mutateResourceRefApiProps.status': 'Statut détaillé de la vie cycle de la mutation.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.isLoading': "Vrai pendant que l'opération de mutation s'exécute.",
  'demoApi.mutate-resource.mutateResourceRefApiProps.mutate(args)':
    'Déclenche la mutation avec des arguments et retourne une Promise qui se termine avec le résultat ou la rejeture.',
  'demoApi.query-resource.queryResourceApiProps.definition':
    'Fabrique réactive avec un chargeur Observable ou Promise ; undefined désactive la ressource.',
  'demoApi.query-resource.queryResourceApiProps.options.pollInterval':
    'Durée en millisecondes entre les demandes terminées. Coordonnée à travers tous les observateurs actifs.',
  'demoApi.query-resource.queryResourceApiProps.options.injector':
    "Injecteur Angular optionnel pour la registration des signaux en dehors du contexte d'injection.",
  'demoApi.query-resource.queryResourceApiProps.options.client':
    'Surcharge optionnelle du QueryClient (par défaut, le token QUERY_CLIENT).',
  'demoApi.query-resource.queryResourceDefinitionProps.key':
    'Tableau de valeurs JSON-compatibles permettant d\'identifier de manière unique la requête (par exemple, ["user", id]).',
  'demoApi.query-resource.queryResourceDefinitionProps.loader':
    "Chargeur de données recevant { abortSignal, refresh }. Les lectures d'Observable se terminent automatiquement après la première émission.",
  'demoApi.query-resource.queryResourceDefinitionProps.tags':
    'Étiquettes optionnelles pour l\'invalidation du cache (par exemple, [{ type: "users" }]).',
  'demoApi.query-resource.queryResourceDefinitionProps.staleTime':
    'Durée en millisecondes avant que les données du cache ne soient considérées comme obsolètes.',
  'demoApi.query-resource.queryResourceDefinitionProps.gcTime':
    'Durée en millisecondes (défaut 5 minutes) pour conserver les requêtes inutilisées dans le cache.',
  'demoApi.query-resource.queryResourceDefinitionProps.cancelOnNoObservers':
    'Indique si un appel en cours doit être annulé si tous les observateurs démontent avant la fin.',
  'demoApi.query-resource.queryResourceRefApiProps.value':
    'Signal contenant les données de la dernière requête résolue avec succès.',
  'demoApi.query-resource.queryResourceRefApiProps.error':
    "Signal contenant l'erreur la plus récente, ou null lorsqu'il est en bonne santé.",
  'demoApi.query-resource.queryResourceRefApiProps.status':
    'État précis : "idle" | "loading" | "reloading" | "resolved" | "error".',
  'demoApi.query-resource.queryResourceRefApiProps.isLoading': 'Vrai lorsque le statut est "loading" ou "reloading".',
  'demoApi.query-resource.queryResourceRefApiProps.isStale':
    'Indique si les données ont été invalidées ou si leur durée de fraîcheur staleTime est dépassée.',
  'demoApi.query-resource.queryResourceRefApiProps.hasValue()':
    'Valeur de prédicat de réduction de type pour exclure undefined lorsque des données valides sont présentes.',
  'demoApi.query-resource.queryResourceRefApiProps.reload()':
    'Déclenche une mise à jour de fond sans effacer les données existantes (statut : "reloading").',
  'demoApi.query-resource.queryResourceRefApiProps.execute()':
    'Force un chargement immédiat et retourne une promesse qui se termine avec le résultat.',
  'demoApi.query-resource.queryResourceRefApiProps.destroy()':
    "Détache cet observateur sans annuler les requêtes partagées si d'autres observateurs restent.",
  'demoApi.resource-async.definitionProperties.params':
    'Fonction de capture pure réactive des paramètres. Les lectures de signaux ici sont suivies.',
  'demoApi.resource-async.definitionProperties.loader':
    'Chargeur recevant les paramètres et abortSignal ; renvoie une Promise, un Observable ou une valeur synchrone.',
  'demoApi.resource-async.optionsProperties.defaultValue':
    'Valeur par défaut avant la première requête ; garantit que value() retourne T (jamais undefined). Équivalent de initialValue.',
  'demoApi.resource-async.optionsProperties.preserveValueOnError':
    "Conserve la dernière valeur reçue ou la valeur locale lorsqu'une erreur survient.",
  'demoApi.resource-async.optionsProperties.reactive':
    "L'erreur de paramètre/source déclenche automatiquement un réexécution.",
  'demoApi.resource-async.optionsProperties.injector':
    "Injecteur personnalisé optionnel si appelé en dehors d'un contexte d'injection ambiant.",
  'demoApi.resource-async.optionsProperties.equal':
    "Comparateur personnalisé passé à l'opération sous-jacente computed signal.",
  'demoApi.resource-async.returnsProperties.value': 'La valeur actuelle de la ressource.',
  'demoApi.resource-async.returnsProperties.error': "L'erreur actuelle, si elle existe.",
  'demoApi.resource-async.returnsProperties.status':
    "L'état actuel : 'idle' | 'loading' | 'reloading' | 'resolved' | 'local' | 'error'.",
  'demoApi.resource-async.returnsProperties.isLoading':
    "Signal qui retourne true si une opération de récupération est en cours ('loading' ou 'reloading').",
  'demoApi.resource-async.returnsProperties.isIdle':
    "Signal qui retourne true si la ressource est dans l'état 'idle' (jamais récupérée).",
  'demoApi.resource-async.returnsProperties.hasValue()':
    "Valeur de restriction de prédicat de type pour value() afin d'exclure undefined lorsqu'elle est true.",
  'demoApi.resource-async.returnsProperties.reload()':
    'Déclencher manuellement un réchargement de la ressource. Idéal pour les requêtes (GET).',
  'demoApi.resource-async.returnsProperties.execute()':
    "Déclencher manuellement l'exécution en retournant une Promise attendable. Idéal pour les mutations (POST/PUT/DELETE).",
  'demoApi.resource-async.returnsProperties.set()':
    'Mettre à jour manuellement la valeur de la ressource, passant l\'état vers "local".',
  'demoApi.resource-async.returnsProperties.update()':
    'Mettre à jour la valeur de la ressource en utilisant une fonction de mise à jour, passant l\'état vers "local".',
  'demoApi.resource-async.returnsProperties.reset()':
    "Réinitialiser la ressource à son état initial 'idle' et annuler les opérations en cours.",
  'demoApi.resource-async.returnsProperties.destroy()':
    "Arrêter définitivement l'observation et annuler les tâches en attente.",
  'demoApi.date-range-validator.optionsProperties.compareTime':
    'Indiquez si vous souhaitez également comparer le temps. Par défaut, false.',
  'certificate.loading': 'Chargement du certificat…',
  'certificate.loadFailed': 'Impossible de charger les détails du certificat. Actualisez la page pour réessayer.',
  'fileReader.validationUnavailable':
    'Impossible de charger la validation du certificat. Actualisez la page pour réessayer.',
  'queryExamples.failureTitle': 'Échecs et récupération',
  'queryExamples.failureIntro':
    'Conserver les données valides, borner les lectures et récupérer uniquement les échecs.',
  'queryExamples.initialFailure': 'Échec de la première lecture',
  'queryExamples.initialFailureMessage': 'Aucune donnée. Réessayez cette lecture.',
  'queryExamples.refreshFailure': 'Échec de mise à jour avec données conservées',
  'queryExamples.refreshFailureMessage': 'La mise à jour a échoué. Le dernier résultat réussi reste affiché.',
  'queryExamples.failureData': 'Dernière valeur réussie : {0}',
  'queryExamples.retryRead': 'Réessayer la lecture',
  'queryExamples.failRefresh': 'Faire échouer une mise à jour',
  'queryExamples.failObserver': 'Simuler une erreur observateur',
  'queryExamples.automaticRetry': 'Nouvelles tentatives automatiques limitées',
  'queryExamples.retryIntro': 'Deux échecs temporaires, puis succès. Les lecteurs partagent une boucle de tentatives.',
  'queryExamples.startRetry': 'Démarrer les tentatives Observable',
  'queryExamples.startPromise': 'Démarrer les tentatives Promise',
  'queryExamples.deadline': 'Délai de lecture logique',
  'queryExamples.deadlineIntro': 'Cette lecture ne produit aucune donnée. Le délai libère son abonnement.',
  'queryExamples.startDeadline': 'Démarrer une lecture bloquée',
  'queryExamples.deadlineMessage': 'Le délai de lecture est dépassé. Vous pouvez réessayer.',
  'queryExamples.canceledReads': 'Abonnements annulés : {0}',
  'queryExamples.partialFailure': '2. Échec partiel de liste et récupération granulaire',
  'queryExamples.mutationFailure': 'Échec écriture',
  'queryExamples.mutationIntro':
    'Les écritures ne sont pas répétées automatiquement. Cette simulation refuse avant application.',
  'queryExamples.failWrite': 'Envoyer une écriture en échec',
  'queryExamples.submitWrite': 'Envoyer une écriture',
  'queryExamples.writeMessage': 'Écriture échouée. Votre saisie est conservée.',
  'queryExamples.failureEvents': 'Erreurs finales de lecture : {0} ; diagnostics observateur : {1}',
  'queryExamples.isInitialErrorDescription': 'True si la lecture échoue sans données réussies précédentes.',
  'queryExamples.isRefreshErrorDescription': 'True si la mise à jour échoue avec les données réussies conservées.',
  'queryExamples.updatedAtDescription': 'Horodatage de la dernière lecture réussie.',
  'queryExamples.failureCountDescription': 'Tentatives échouées de la lecture actuelle ; zéro après succès.',
  'queryExamples.failureReasonDescription': 'Dernier échec ou erreur finale de délai.',
  'queryExamples.nextRetryAtDescription':
    'Horodatage de la prochaine tentative ; null pendant la lecture ou après résultat.',
  'queryExamples.retryDescription': 'Politique facultative de tentatives limitées. Désactivée par défaut.',
  'queryExamples.deadlineDescription': 'Délai total avec attentes ; false désactive un délai hérité.',
  'queryExamples.recoveryFocusDescription':
    'Activer la mise à jour des lectures observées périmées au retour du focus.',
  'queryExamples.recoveryReconnectDescription':
    'Activer la mise à jour des lectures observées périmées à la reconnexion.',
  'queryExamples.title': 'Requêtes Observable en pratique',
  'queryExamples.intro':
    'Ces exemples utilisent HttpClient avec une API simulée locale. Changez de locataire pour voir des données et caches indépendants.',
  'queryExamples.tenant': 'Locataire',
  'queryExamples.tenantA': 'Locataire A',
  'queryExamples.tenantB': 'Locataire B',
  'queryExamples.parallel': '1. Requêtes parallèles indépendantes',
  'queryExamples.health': 'État',
  'queryExamples.refresh': 'Actualiser le locataire',
  'queryExamples.fail': 'Faire échouer la prochaine requête',
  'queryExamples.tenantError': 'La requête a échoué ; les données en cache restent disponibles.',
  'queryExamples.retry': 'Réessayer le locataire',
  'queryExamples.dependent': '2. Requête dépendante et actualisation après modification',
  'queryExamples.databases': 'Bases de données',
  'queryExamples.gate':
    'La requête attend les données du locataire. Le cache reste disponible pendant l’actualisation.',
  'queryExamples.name': 'Nom de la base de données',
  'queryExamples.create': 'Créer une base de données',
  'queryExamples.createError': 'La création a échoué. Réessayez.',
  'queryExamples.databaseError': 'L’actualisation des bases de données a échoué.',
  'queryExamples.retryDatabases': 'Réessayer les bases de données',
  'queryExamples.snapshot': 'observeQueryObservable : {0}, {1} bases de données',
  'queryExamples.service': '3. Trois consommateurs partagent une requête',
  'queryExamples.serviceIntro':
    'fetchQueryObservable renvoie un résultat puis se termine. observeQueryObservable émet continuellement les états du cache.',
  'queryExamples.mount': 'Afficher les widgets du service',
  'queryExamples.refreshWidgets': 'Actualiser les widgets du service',
  'queryExamples.widget': 'Widget {0} : locataire {1}, {2}',
  'queryExamples.counts': 'Nombre de requêtes HTTP :',
  'queryExamples.dynamic': '1. Requêtes parallèles dynamiques',
  'queryExamples.dynamicIntro':
    'queryResources associe les ID sélectionnés à des observateurs indépendants. Le réordonnancement les conserve ; retirer un ID libère son observateur.',
  'queryExamples.one': 'Locataire A uniquement',
  'queryExamples.both': 'Les deux locataires',
  'queryExamples.reverse': 'Inverser l’ordre',
  'queryExamples.empty': 'Effacer la sélection',
  'queryExamples.databaseA': 'Base de données du locataire A',
  'queryExamples.databaseB': 'Base de données du locataire B',
  'queryExamples.initialLoadingDescription': 'True pendant le chargement sans données disponibles.',
  'queryExamples.refreshingDescription': 'True pendant l’actualisation avec conservation du cache.',
  'queryResources.k8sComparisonTitle':
    '3. Surveillance de flotte : Agrégation globale vs. Collection réactive granulaire',
  'queryResources.k8sComparisonDesc':
    'Comparaison de deux modèles d’architecture pour surveiller l’état des clusters Kubernetes distribués : Agrégation globale monolithique (queryResource + forkJoin) vs. Collection de requêtes granulaire (queryResources).',
  'queryResources.traditionalTab': 'Approche 1 : Agrégation globale (queryResource)',
  'queryResources.traditionalDesc':
    'Agrège toute la flotte en un seul appel réseau. Blocage en tête de ligne : le cluster le plus lent (APAC Edge @ 1200ms) retarde l’affichage de tous les autres.',
  'queryResources.granularTab': 'Approche 2 : Collection granulaire (queryResources)',
  'queryResources.granularDesc':
    'Crée des requêtes réactives indépendantes par cluster. Les clusters rapides s’affichent instantanément (US-East @ 150ms). Chaque cluster peut être rechargé de façon isolée.',
  'queryResources.refreshFleet': 'Actualiser toute la flotte',
  'queryResources.refreshCluster': 'Actualiser le cluster',
  'queryResources.clusterName': 'Nom du cluster',
  'queryResources.providerRegion': 'Fournisseur / Région',
  'queryResources.activeNodes': 'Nœuds actifs',
  'queryResources.healthStatus': 'État de santé',
  'queryResources.latency': 'Latence',
  'queryResources.actions': 'Actions',
  'queryResources.revalidatingNotice':
    'Revalidation de la flotte en arrière-plan... Les données existantes restent interactives.',
  'queryResources.headOfLineWarning':
    'Blocage en tête de ligne actif : les 4 clusters attendent le plus lent (APAC Edge ~1200ms). Si un cluster échoue, l’ensemble de l’instantané échoue sans gestion d’erreur spécifique.',
  'queryResources.progressiveNotice':
    'Rendu progressif actif : les clusters rapides (US-East 150ms, EU-Central 280ms) s’affichent immédiatement de façon interactive pendant le chargement des plus lents.',
  'queryResources.comparisonTableTitle': 'Dimensions architecturales comparées',
  'queryResources.dimTitle': 'Dimension',
  'queryResources.dimArch': 'Modèle architectural',
  'queryResources.dimArchTraditional': 'forkJoin monolithique / Point de terminaison agrégateur',
  'queryResources.dimArchGranular': 'Collection réactive indépendante (queryResources)',
  'queryResources.dimLatency': 'Latence et affichage',
  'queryResources.dimLatencyTraditional': 'Blocage en tête de ligne : l’interface attend le cluster le plus lent',
  'queryResources.dimLatencyGranular': 'Rendu progressif : chaque cluster s’affiche dès sa réception',
  'queryResources.dimIsolation': 'Isolation des pannes',
  'queryResources.dimIsolationTraditional': 'Tout ou rien : un échec bloque toute la flotte',
  'queryResources.dimIsolationGranular': 'Isolation complète : la panne d’un cluster n’affecte pas les autres',
  'queryResources.dimIdentity': 'Clés de cache et identité',
  'queryResources.dimIdentityTraditional': 'Une seule clé monolithique pour toutes les données',
  'queryResources.dimIdentityGranular': 'Clé atomique distincte par entité de cluster',
  'queryResources.dimReload': 'Granularité de rechargement',
  'queryResources.dimReloadTraditional': 'Rechargement global uniquement (gaspillage de bande passante)',
  'queryResources.dimReloadGranular': 'Rechargement précis par cluster ou via des balises de flotte',
  'queryResources.dimCache': 'Réutilisabilité du cache',
  'queryResources.dimCacheTraditional': 'Non partageable entre différentes vues ou pages détaillées',
  'queryResources.dimCacheGranular': 'Réutilisation transparente entre vue d’ensemble et page de détail d’un cluster',
  'queryResources.prosConsTitle': 'Avantages et inconvénients',
  'queryResources.prosTraditional':
    'Simple lorsque le backend fournit déjà une API agrégée ; exactement un aller-retour réseau.',
  'queryResources.consTraditional':
    'Mauvaise expérience utilisateur due au couplage des latences ; pannes en cascade ; inadapté aux tableaux de bord avec actions individuelles.',
  'queryResources.prosGranular':
    'Excellente réactivité grâce au chargement progressif ; isolation des erreurs ; actions ciblées et réutilisation du cache.',
  'queryResources.consGranular':
    'Nombre plus élevé de requêtes HTTP si la flotte est très importante (pagination ou découpage par lots conseillé).',
  'queryResource.thFailures': 'Tentatives échouées',
  'queryResource.thNextRetry': 'Prochaine tentative',
  'queryGuide.selection': 'Outils associés :',
  'queryGuide.basic': '1. Commencer par une lecture en cache',
  'queryGuide.basicIntro':
    'Capturez le locataire une seule fois, utilisez-le dans key et loader, puis lisez les signaux du résultat. Une actualisation conserve la dernière valeur obtenue.',
  'queryGuide.configure': 'Configuration de l’application',
  'queryGuide.collectionIntro':
    'Utilisez queryResources pour une liste variable de lectures indépendantes. Chaque entrée possède son résultat en cache, son état de chargement et ses actions de récupération.',
  'queryGuide.empty': 'Aucun élément sélectionné. Aucune lecture de la collection n’est active.',
  'queryGuide.partialIntro':
    'Une ligne échoue tandis que l’autre reste disponible. Relancez uniquement la ligne en échec.',
  'queryGuide.collectionContract':
    'La collection est un signal de références ordonnées. Réordonner conserve les références ; supprimer masque immédiatement les lignes et libère les observateurs lors de l’exécution de l’effect. Les clés canoniques dupliquées sont rejetées.',
  'queryGuide.collectionLimits':
    'Utilisez un type de données par collection et filtrez les éléments non prêts. Les requêtes démarrent en parallèle sans limite de concurrence ; paginez ou limitez les grandes sélections. maxEntries ne supprime pas les entrées actives ou en attente.',
  'queryGuide.namingTitle': 'Nommer les références de requêtes et de mutations',
  'queryGuide.namingHandles':
    'Utilisez <code>userQuery</code> pour une requête, <code>tenantQueries</code> pour une collection et <code>createMutation</code> pour une écriture. Réservez <code>user</code> ou <code>tenant</code> aux données obtenues.',

  'computedAsync.failSource': 'Faire échouer la source',
  'computedAsync.recoverSource': 'Rétablir la source',
  'computedAsync.readSignal': 'Lire le signal',
  'computedAsync.lastRead': 'Dernière lecture',
  'computedAsync.notRead': 'Pas encore lu',
  'computedAsync.readError': 'La lecture a levé une erreur ; aucune valeur de succès n’a été renvoyée.',
  'computedAsync.readDemoHint':
    'Faites échouer la source, puis lisez le signal. Rétablissez la source et relisez pour vérifier la récupération.',
};
