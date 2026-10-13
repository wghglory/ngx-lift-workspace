export const frTranslations: Record<string, string> = {
  'header.selectLanguage': 'Sélectionner la langue',
  'header.openGitHub': 'Ouvrir sur GitHub',
  'header.codeLicensed': 'Code sous licence',

  'nav.signalUtils': 'Utilitaires Signal',
  'nav.queryMutation': 'Query & Mutation',
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
  'nav.differenceInDays': 'Différence en jours',
  'nav.badgeNew': 'NOUVEAU',
  'nav.badgeUpdated': 'MIS À JOUR',
  'nav.badgePopular': 'POPULAIRE',
  'nav.badgeCore': 'CŒUR',

  'common.examples': 'Exemples',
  'common.apiReference': "Référence de l'API",
  'common.overview': 'Aperçu',
  'common.parameters': 'Paramètres',
  'common.returns': 'Retourne',
  'common.signature': 'Signature',
  'common.description': 'Description',
  'common.basicUsage': 'Utilisation de base',
  'common.example': 'Exemple',
  'common.example1': 'Exemple 1 : Utilisation de base',
  'common.example2': 'Exemple 2 : Avec opérateur pipe RxJS',
  'common.example3': 'Exemple 3 : Gérer le code asynchrone',
  'common.example4': 'Exemple 4 : Injecteur découplé',

  'playground.beginner': 'Débutant',
  'playground.intermediate': 'Intermédiaire',
  'playground.advanced': 'Avancé',
  'playground.copy': 'Copier',
  'playground.copied': 'Copié',
  'playground.viewCode': 'Voir le code',
  'playground.hideCode': 'Masquer le code',
  'playground.stackedLayout': 'Disposition empilée',
  'playground.splitLayout': 'Disposition côte à côte',

  'inspector.liveState': 'État du signal en direct',
  'inspector.rawJson': 'JSON brut de l’état',

  'mergeFrom.overview':
    "La fonction <code>mergeFrom</code> fusionne les valeurs d'Observables ou de Signals et émet la valeur la plus récente. Elle permet également de modifier la valeur émise à l'aide d'opérateurs RxJS avant son émission.",
  'mergeFrom.example1Desc': 'Fusionner plusieurs signaux ou observables :',
  'mergeFrom.example2Desc': 'Transmettez un opérateur de pipe RxJS pour manipuler les valeurs émises :',
  'mergeFrom.example3Desc':
    'Utilisez l’option <code>startWith</code> ou <code>initialValue</code> pour gérer les observables asynchrones :',
  'mergeFrom.example4Desc':
    'Transmettez un <code>Injector</code> personnalisé pour créer un signal fusionné hors contexte d’injection :',
  'mergeFrom.apiSummary': 'Fusionne plusieurs Observables ou Signals en un seul Signal émettant la dernière valeur.',

  // k8sRetryBackoff Operator (fr)
  'k8sRetryBackoff.configSummary': 'Configuration optionnelle partagée par l’opérateur et la fabrique d’intercepteurs.',
  'k8sRetryBackoff.paramMaxAttempts':
    'Nombre total de tentatives incluant la requête initiale. Définir sur 1 pour désactiver les réessais.',
  'k8sRetryBackoff.errorShape':
    'Accepte HttpErrorResponse ou un objet sous la forme <code>{ status, headers?, error? }</code>, y compris une chaîne JSON dans <code>error</code>. Le fetch natif ne rejette pas les erreurs HTTP 429 : vérifiez la Response et adaptez son statut, ses en-têtes et son corps analysé. Axios expose ces informations sous <code>error.response</code> ; adaptez-les avant d’appeler l’utilitaire. L’utilitaire calcule uniquement le délai.',
  'k8sRetryBackoffInterceptor.overrideRules':
    '<code>null</code> applique les valeurs par défaut de l’intercepteur ; <code>false</code> désactive les réessais. La fabrique fusionne la configuration par requête avec ses valeurs par défaut. Cet intercepteur gère chaque 429 de HttpClient quelle que soit l’URL ou la méthode HTTP ; désactivez-le explicitement pour les requêtes qui doivent échouer immédiatement.',
  'k8sRetryBackoffInterceptor.overrideSimulation':
    'Testez une sonde qui échoue dès son premier 429, ou une lecture de charge de travail qui reçoit deux 429 avant de réussir. La lecture personnalisée utilise maxAttempts: 10 et un délai de secours de 200 ms, ce qui autorise jusqu’à neuf réessais.',
  'k8sRetryBackoffInterceptor.btnWorkloads': 'Tester la lecture de charge (10 tentatives)',
  'k8sRetryBackoffInterceptor.btnProbe': 'Tester la sonde rapide (Exclusion)',

  'k8sRetryBackoff.overview':
    '<code>retryOnK8sBackoff</code> est un opérateur de réessai RxJS conçu spécifiquement pour les <strong>limites de débit de l’API Kubernetes (HTTP 429 Too Many Requests)</strong>. Il priorise dynamiquement l’en-tête HTTP <code>Retry-After</code> ou le champ <code>details.retryAfterSeconds</code> renvoyé par les serveurs d’API Kubernetes, avec un délai de secours configurable si aucun n’est fourni.',
  'k8sRetryBackoff.callout':
    'Vous recherchez une protection globale pour tous les appels <code>HttpClient</code> ? Consultez <a href="/ngx-lift/interceptors/k8sRetryBackoff"><code>k8sRetryBackoffInterceptor</code></a> pour un intercepteur fonctionnel sans tuyauterie par requête.',
  'k8sRetryBackoff.diffTitle': 'Comparaison architecturale : Opérateur vs Intercepteur',
  'k8sRetryBackoff.diffDesc':
    'Les deux outils partagent le même moteur de résolution de délai de réessai, mais jouent des rôles complémentaires :',
  'k8sRetryBackoff.diffColFeature': 'Caractéristique',
  'k8sRetryBackoff.diffColOperator': 'retryOnK8sBackoff (Opérateur)',
  'k8sRetryBackoff.diffColInterceptor': 'k8sRetryBackoffInterceptor (Intercepteur)',
  'k8sRetryBackoff.diffScope': 'Portée',
  'k8sRetryBackoff.diffScopeOp':
    'Locale : Appliqué sélectivement à des Observables spécifiques via <code>.pipe(retryOnK8sBackoff(...))</code>.',
  'k8sRetryBackoff.diffScopeInt':
    'Globale : Intercepte automatiquement toutes les requêtes HTTP sortantes de l’application.',
  'k8sRetryBackoff.diffUseCases': 'Cas d’utilisation cibles',
  'k8sRetryBackoff.diffUseCasesOp': 'Flux de scrutation, tâches en arrière-plan, observables non-HttpClient.',
  'k8sRetryBackoff.diffUseCasesInt':
    'Protection standard sur tous les appels REST/Kubernetes sans modifier chaque service.',
  'k8sRetryBackoff.diffConfig': 'Configuration & Exclusion',
  'k8sRetryBackoff.diffConfigOp': 'Configuré par flux via l’argument de l’opérateur.',
  'k8sRetryBackoff.diffConfigInt':
    'Configuré globalement dans <code>app.config.ts</code> ; surchargeable ou désactivable par requête via <code>HttpContext</code>.',
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
  'k8sRetryBackoff.btnClearLogs': 'Effacer les journaux',
  'k8sRetryBackoff.logTitle': 'Journaux d’exécution :',
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
  'k8sRetryBackoff.apiSummary': 'Réessaie un Observable sur HTTP 429 en respectant les délais Kubernetes.',
  'k8sRetryBackoff.paramConfig': 'Configuration optionnelle du nombre de tentatives et du délai de secours.',
  'k8sRetryBackoff.delaySummary':
    'Extrait le délai d’attente en millisecondes d’un objet erreur, ou renvoie null si non réessayable.',
  'k8sRetryBackoff.paramError': 'L’erreur à inspecter (HttpErrorResponse ou objet avec status/headers/error).',
  'k8sRetryBackoff.paramFallbackDelay': 'Délai de secours en millisecondes si la réponse ne fournit aucune indication.',

  // k8sRetryBackoffInterceptor (fr)
  'k8sRetryBackoffInterceptor.overview':
    '<code>k8sRetryBackoffInterceptor</code> est un intercepteur HTTP fonctionnel Angular (<code>HttpInterceptorFn</code>). Il offre une protection globale transparente contre les erreurs <strong>HTTP 429 (Too Many Requests)</strong> en analysant les en-têtes <code>Retry-After</code> et <code>details.retryAfterSeconds</code>.',
  'k8sRetryBackoffInterceptor.callout':
    'Vous recherchez des réessais au niveau d’un flux isolé ou d’une scrutation ? Consultez <a href="/ngx-lift/operators/k8sRetryBackoff"><code>retryOnK8sBackoff</code></a>.',
  'k8sRetryBackoffInterceptor.example1Title': 'Exemple 1 : Enregistrement global de l’intercepteur et simulateur',
  'k8sRetryBackoffInterceptor.example1Desc':
    'Enregistrez l’intercepteur globalement dans app.config.ts. Toutes les requêtes HttpClient bénéficient automatiquement du réessai sur 429 :',
  'k8sRetryBackoffInterceptor.selectMode': 'Mode de contexte de l’intercepteur :',
  'k8sRetryBackoffInterceptor.modeDefault':
    'Intercepteur global par défaut (Réessaie 429 avec 1s de délai, puis 200 OK)',
  'k8sRetryBackoffInterceptor.modeCustom': 'HttpContext personnalisé (Délai de secours de 400ms)',
  'k8sRetryBackoffInterceptor.modeDisabled': 'Désactivé via HttpContext (HttpContextToken = false, échec immédiat)',
  'k8sRetryBackoffInterceptor.btnSend': 'Envoyer la requête interceptée',
  'k8sRetryBackoffInterceptor.example2Title': 'Exemple 2 : Personnalisation par requête et exclusion via HttpContext',
  'k8sRetryBackoffInterceptor.example2Desc':
    'Utilisez K8S_RETRY_BACKOFF_CONFIG dans HttpContext pour configurer des limites personnalisées ou désactiver le réessai sur les vérifications rapides :',
  'k8sRetryBackoffInterceptor.apiSummary':
    'Intercepteur HTTP fonctionnel réessayant les réponses HTTP 429 avec attente Kubernetes.',
  'k8sRetryBackoffInterceptor.factorySummary':
    'Crée un intercepteur fonctionnel configuré avec des valeurs par défaut personnalisées.',
  'k8sRetryBackoffInterceptor.tokenSummary':
    'HttpContextToken pour configurer ou désactiver le réessai pour une requête individuelle.',
  'k8sRetryBackoffInterceptor.paramDefaultConfig':
    'Configuration par défaut appliquée à toutes les requêtes sauf surcharge via HttpContext.',
  'header.partialLanguage': 'Traduction partielle ; les textes manquants sont affichés en anglais.',
};
