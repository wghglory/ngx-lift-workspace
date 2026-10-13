export const nlTranslations: Record<string, string> = {
  'header.selectLanguage': 'Taal selecteren',
  'header.openGitHub': 'Openen op GitHub',
  'header.codeLicensed': 'Code gelicentieerd onder',

  'nav.signalUtils': "Signal-hulpprogramma's",
  'nav.queryMutation': 'Query & Mutation',
  'nav.operators': 'Operatoren',
  'nav.interceptors': 'Interceptors',
  'nav.validators': 'Validatoren',
  'nav.pipes': 'Pipes',
  'nav.utilities': "Hulpprogramma's",
  'nav.components': 'Componenten',
  'nav.pageContainer': 'Paginacontainer',
  'nav.timelineWizard': 'Tijdlijnwizard',
  'nav.alert': 'Melding',
  'nav.multiAlerts': 'Meldingen (Meervoudig)',
  'nav.callout': 'Aandachtskader',
  'nav.spinner': 'Spinner',
  'nav.toast': 'Toast',
  'nav.tooltip': 'Tooltip',
  'nav.themeToggle': 'Thema wisselen',
  'nav.fileReader': 'Bestandslezer',
  'nav.keyValueInputs': 'Sleutel-waarde invoer',
  'nav.statusIndicator': 'Statusindicator',
  'nav.idleDetection': 'Inactiviteitsdetectie',
  'nav.certificate': 'Certificaatviewer',
  'nav.datagrid': 'Gegevensraster',
  'nav.byteConverter': 'Byte-converter',
  'nav.mask': 'Masker',
  'nav.arrayJoin': 'Array-samenvoeging',
  'nav.range': 'Bereik',
  'nav.isHttps': 'Is Https',
  'nav.differenceInDays': 'Dagenverschil',
  'nav.badgeNew': 'NIEUW',
  'nav.badgeUpdated': 'BIJGEWERKT',
  'nav.badgePopular': 'POPULAIR',
  'nav.badgeCore': 'KERN',

  'common.examples': 'Voorbeelden',
  'common.apiReference': 'API-referentie',
  'common.overview': 'Overzicht',
  'common.parameters': 'Parameters',
  'common.returns': 'Retourneert',
  'common.signature': 'Handtekening',
  'common.description': 'Beschrijving',
  'common.basicUsage': 'Basisgebruik',
  'common.example': 'Voorbeeld',
  'common.example1': 'Voorbeeld 1: Basisgebruik',
  'common.example2': 'Voorbeeld 2: Met RxJS pipe-operator',
  'common.example3': 'Voorbeeld 3: Asynchrone code afhandelen',
  'common.example4': 'Voorbeeld 4: Ontkoppelde injector',

  'playground.beginner': 'Beginner',
  'playground.intermediate': 'Gemiddeld',
  'playground.advanced': 'Geavanceerd',
  'playground.copy': 'Kopiëren',
  'playground.copied': 'Gekopieerd',
  'playground.viewCode': 'Code bekijken',
  'playground.hideCode': 'Code verbergen',
  'playground.stackedLayout': 'Gestapelde weergave',
  'playground.splitLayout': 'Zij-aan-zij weergave',

  'inspector.liveState': 'Live Signal-status',
  'inspector.rawJson': 'Ruwe status-JSON',

  'mergeFrom.overview':
    'De functie <code>mergeFrom</code> voegt de waarden van Observables of Signals samen en zendt de meest recente waarde uit. Het maakt het ook mogelijk om de uitgezonden waarde aan te passen met behulp van RxJS-operatoren.',
  'mergeFrom.example1Desc': 'Meerdere signals of observables samenvoegen:',
  'mergeFrom.example2Desc': 'Geef een RxJS-pipe-operator door om de uitgezonden waarden te manipuleren:',
  'mergeFrom.example3Desc':
    'Gebruik de optie <code>startWith</code> of <code>initialValue</code> om asynchrone observables te verwerken:',
  'mergeFrom.example4Desc': 'Geef een aangepaste <code>Injector</code> door om een samengevoegd signaal te maken:',
  'mergeFrom.apiSummary': 'Voegt meerdere Observables of Signals samen tot één enkel Signal.',

  // k8sRetryBackoff Operator (nl)
  'k8sRetryBackoff.configSummary': 'Optionele configuratie gedeeld door de operator en interceptor-factory.',
  'k8sRetryBackoff.paramMaxAttempts':
    'Totaal aantal pogingen inclusief het eerste verzoek. Stel in op 1 om retries uit te schakelen.',
  'k8sRetryBackoff.errorShape':
    'Accepteert HttpErrorResponse of een object in de vorm <code>{ status, headers?, error? }</code>, inclusief JSON-string in <code>error</code>. Standaard fetch wijst niet af bij HTTP 429: controleer de Response en converteer status, headers en parsed body. Axios biedt deze aan onder <code>error.response</code>; pas deze aan voor het aanroepen. De helper berekent alleen de vertraging.',
  'k8sRetryBackoffInterceptor.overrideRules':
    '<code>null</code> gebruikt interceptor-standaardwaarden; <code>false</code> schakelt retries uit. De factory voegt configuratie per verzoek samen met standaardwaarden. Deze interceptor verwerkt elke HttpClient 429 ongeacht URL of HTTP-methode; meld verzoeken af die direct moeten mislukken.',
  'k8sRetryBackoffInterceptor.overrideSimulation':
    'Test een probe die direct faalt bij de eerste 429, of een workload-uitlezing die na twee 429’s slaagt. De aangepaste uitlezing gebruikt maxAttempts: 10 en een terugvalvertraging van 200ms; dit staat maximaal negen retries toe.',
  'k8sRetryBackoffInterceptor.btnWorkloads': 'Workload-uitlezing testen (10 pogingen)',
  'k8sRetryBackoffInterceptor.btnProbe': 'Snelle probe testen (Opt-out)',

  'k8sRetryBackoff.overview':
    '<code>retryOnK8sBackoff</code> is een RxJS-retry-operator speciaal ontworpen voor <strong>Kubernetes API-snelheidslimieten (HTTP 429 Too Many Requests)</strong>. Het geeft dynamisch prioriteit aan de <code>Retry-After</code> HTTP-header of het veld <code>details.retryAfterSeconds</code> van Kubernetes-apiservers, met terugval op een configureerbare vertraging als er geen hint is.',
  'k8sRetryBackoff.callout':
    'Op zoek naar automatische retry-bescherming voor alle <code>HttpClient</code>-aanroepen? Bekijk <a href="/ngx-lift/interceptors/k8sRetryBackoff"><code>k8sRetryBackoffInterceptor</code></a> voor een globale functionele interceptor.',
  'k8sRetryBackoff.diffTitle': 'Architectonische vergelijking: Operator vs. Interceptor',
  'k8sRetryBackoff.diffDesc':
    'Beide hulpprogramma’s delen dezelfde berekeningslogica voor vertragingen, maar vervullen complementaire rollen:',
  'k8sRetryBackoff.diffColFeature': 'Kenmerk',
  'k8sRetryBackoff.diffColOperator': 'retryOnK8sBackoff (Operator)',
  'k8sRetryBackoff.diffColInterceptor': 'k8sRetryBackoffInterceptor (Interceptor)',
  'k8sRetryBackoff.diffScope': 'Bereik',
  'k8sRetryBackoff.diffScopeOp':
    'Lokaal: Selectief toegepast op specifieke Observables via <code>.pipe(retryOnK8sBackoff(...))</code>.',
  'k8sRetryBackoff.diffScopeInt': 'Globaal: Onderschept automatisch alle uitgaande HTTP-verzoeken van de applicatie.',
  'k8sRetryBackoff.diffUseCases': 'Belangrijkste gebruiksscenario’s',
  'k8sRetryBackoff.diffUseCasesOp': 'Polling-streams, achtergrondtaken of observables buiten HttpClient.',
  'k8sRetryBackoff.diffUseCasesInt':
    'Basisbeveiliging voor alle REST/Kubernetes-aanroepen zonder afzonderlijke services aan te passen.',
  'k8sRetryBackoff.diffConfig': 'Configuratie & Uitsluiting',
  'k8sRetryBackoff.diffConfigOp': 'Per stream inline geconfigureerd via het operatorargument.',
  'k8sRetryBackoff.diffConfigInt':
    'Globaal geconfigureerd in <code>app.config.ts</code>; per verzoek aanpasbaar of uitschakelbaar via <code>HttpContext</code>.',
  'k8sRetryBackoff.example1Title': 'Voorbeeld 1: Interactieve simulator & pijplijngebruik',
  'k8sRetryBackoff.example1Desc':
    'Simuleer verschillende Kubernetes API-antwoorden en bekijk hoe retryOnK8sBackoff vertragingen berekent, inclusief codefragment:',
  'k8sRetryBackoff.selectScenario': 'Antwoordscenario selecteren:',
  'k8sRetryBackoff.scenarioHeader': '429 (Retry-After: 1 header)',
  'k8sRetryBackoff.scenarioBody': '429 (details.retryAfterSeconds: 1.5 JSON-body)',
  'k8sRetryBackoff.scenarioFallback': '429 (Geen header, 1s standaardvertraging)',
  'k8sRetryBackoff.scenarioNon429': '500 Internal Server Error (Niet herkansbaar, faalt direct)',
  'k8sRetryBackoff.scenarioExhausted': '5x opeenvolgende 429’s (Maximale pogingen overschreden)',
  'k8sRetryBackoff.btnSimulate': 'Verzoek simuleren & opnieuw proberen',
  'k8sRetryBackoff.btnClearLogs': 'Logboeken wissen',
  'k8sRetryBackoff.logTitle': 'Uitvoeringslogboek:',
  'k8sRetryBackoff.example2Title': 'Voorbeeld 2: Zelfstandige vertragingshulp (getK8sRetryDelayMs)',
  'k8sRetryBackoff.example2Desc':
    'Gebruik getK8sRetryDelayMs rechtstreeks om wachttijden te berekenen in aangepaste retry-lussen of promises:',
  'k8sRetryBackoff.sampleErrorLabel': 'Voorbeeld foutantwoord:',
  'k8sRetryBackoff.helperHeader': '429 (Retry-After: 3s)',
  'k8sRetryBackoff.helperBody': '429 (retryAfterSeconds: 2s)',
  'k8sRetryBackoff.helperFallback': '429 (Geen hint, 1s terugval)',
  'k8sRetryBackoff.helperNon429': '500 (Niet-429 fout)',
  'k8sRetryBackoff.btnExtractDelay': 'Vertraging berekenen (getK8sRetryDelayMs)',
  'k8sRetryBackoff.retryableError': 'Herkansbare Kubernetes 429-backoff',
  'k8sRetryBackoff.nonRetryableError': 'Niet-herkansbare fout',
  'k8sRetryBackoff.apiSummary': 'Probeert een Observable opnieuw bij HTTP 429 volgens Kubernetes-richtlijnen.',
  'k8sRetryBackoff.paramConfig': 'Optionele configuratie voor maximale pogingen en terugvalvertraging.',
  'k8sRetryBackoff.delaySummary':
    'Berekent de vertraging in milliseconden uit een foutobject, of retourneert null indien niet herkansbaar.',
  'k8sRetryBackoff.paramError': 'De te inspecteren fout (HttpErrorResponse of object met status/headers/error).',
  'k8sRetryBackoff.paramFallbackDelay': 'Terugvalvertraging in milliseconden indien het antwoord geen hint bevat.',

  // k8sRetryBackoffInterceptor (nl)
  'k8sRetryBackoffInterceptor.overview':
    '<code>k8sRetryBackoffInterceptor</code> is een functionele Angular HTTP-interceptor (<code>HttpInterceptorFn</code>). Het biedt globale bescherming tegen <strong>HTTP 429 (Too Many Requests)</strong> door automatisch <code>Retry-After</code>-headers en <code>details.retryAfterSeconds</code> te verwerken.',
  'k8sRetryBackoffInterceptor.callout':
    'Gerichte retry-controle nodig voor individuele streams of polling? Bekijk <a href="/ngx-lift/operators/k8sRetryBackoff"><code>retryOnK8sBackoff</code></a>.',
  'k8sRetryBackoffInterceptor.example1Title': 'Voorbeeld 1: Globale interceptorregistratie & interactieve simulator',
  'k8sRetryBackoffInterceptor.example1Desc':
    'Registreer de interceptor globaal in app.config.ts. Alle HttpClient-aanroepen worden automatisch herhaald bij HTTP 429:',
  'k8sRetryBackoffInterceptor.selectMode': 'Interceptor-contextmodus:',
  'k8sRetryBackoffInterceptor.modeDefault': 'Standaard globale interceptor (Probeert 429 na 1s opnieuw, daarna 200 OK)',
  'k8sRetryBackoffInterceptor.modeCustom': 'Aangepaste HttpContext (400ms terugvalvertraging)',
  'k8sRetryBackoffInterceptor.modeDisabled': 'Uitgeschakeld via HttpContext (HttpContextToken = false, faalt direct)',
  'k8sRetryBackoffInterceptor.btnSend': 'Onderschept verzoek verzenden',
  'k8sRetryBackoffInterceptor.example2Title': 'Voorbeeld 2: Aanpassing per verzoek en uitsluiting via HttpContext',
  'k8sRetryBackoffInterceptor.example2Desc':
    'Gebruik K8S_RETRY_BACKOFF_CONFIG in HttpContext om limieten aan te passen of retries uit te schakelen voor snelle health-checks:',
  'k8sRetryBackoffInterceptor.apiSummary':
    'Functionele HTTP-interceptor die HTTP 429-antwoorden opnieuw probeert met Kubernetes-terugval.',
  'k8sRetryBackoffInterceptor.factorySummary':
    'Maakt een functionele interceptor met aangepaste standaardinstellingen.',
  'k8sRetryBackoffInterceptor.tokenSummary':
    'HttpContextToken om retry-gedrag per verzoek aan te passen of uit te schakelen.',
  'k8sRetryBackoffInterceptor.paramDefaultConfig':
    'Standaardconfiguratie toegepast op alle verzoeken tenzij overschreven via HttpContext.',
  'header.partialLanguage': 'Gedeeltelijke vertaling; ontbrekende tekst wordt in het Engels getoond.',
};
