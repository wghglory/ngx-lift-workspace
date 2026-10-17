export const nlTranslations: Record<string, string> = {
  'docsLearn.resourceTitle': 'Gegevens laden wanneer een signaal verandert',
  'docsLearn.basics': 'Basis',
  'docsLearn.recipes': 'Praktische voorbeelden',
  'docsLearn.localState': 'Lokale toestand',
  'docsLearn.nested': 'Geneste resources',
  'docsLearn.reference': 'Referentie',
  'docsLearn.gridTitle': 'Probeer een servergestuurd datagrid',
  'docsLearn.gridIntro':
    'dgState bereidt Clarity Datagrid-gebeurtenissen voor op serververzoeken, vertraagt filterwijzigingen en kan dubbele toestanden overslaan.',
  'docsLearn.gridTry':
    'Wijzig filters of pagina’s en vernieuw daarna. Het voorbeeld roept randomuser.me aan; het totale aantal is gesimuleerd.',
  'docsLearn.gridModel':
    'Het grid zendt toestand uit; dgState vertraagt filterwijzigingen met 500 ms. switchMap vervangt het vorige verzoek. Vernieuwen heeft een eigen trigger.',
  'docsLearn.resourceModel':
    'Signalen die in de bronfunctie worden gelezen, worden afhankelijkheden. Bij het standaardgedrag switch annuleert een wijziging het vorige abonnement en start een nieuwe leesactie. Elke resource heeft een eigen waarde.',
  'docsLearn.computedTitle': 'Je eerste asynchroon afgeleide waarde',
  'docsLearn.computedModel':
    'Klik om de invoer te wijzigen. Na 300 ms wordt de waarde invoer × 10. computedAsync geeft een waardesignaal terug, zonder laad- of foutsignalen van een resource. De timer simuleert asynchroon werk.',
  'docsLearn.nextValue': 'Volgende waarde',

  'queryDocs.cache': 'Cacheversheid en vernieuwen',
  'queryDocs.cacheIntro':
    'Een querysleutel identificeert gedeelde gegevens binnen één QueryClient. Versheid, actieve aanvragen en de levensduur van observers beantwoorden verschillende vragen.',
  'queryDocs.chooseComputed':
    'Gebruik voor een asynchroon afgeleide waarde wanneer een waardesignal volstaat. Gebruik bij synchrone afleiding liever computed().',
  'queryDocs.chooseMutation':
    'Gebruik voor expliciet ingediende schrijfbewerkingen op de server. Er is geen querysleutel nodig; voeg invalidatietags toe wanneer andere weergaven moeten bijwerken.',
  'queryDocs.chooseObservable':
    'Gebruik fetchQueryObservable voor één eindige cacheleesbewerking in RxJS; observeQueryObservable geeft gedeelde cachesnapshots en bezit een observer.',
  'queryDocs.chooseQuery':
    'Gebruik één observer voor een gedeelde gecachete leesbewerking. Een antwoord met een array blijft één query.',
  'queryDocs.chooseResource':
    'Gebruik voor onafhankelijke asynchrone status, lokale overschrijvingen of streams zonder gedeelde cache op sleutel.',
  'queryDocs.choosing': 'Een asynchrone API kiezen',
  'queryDocs.choosingIntro':
    'Kies op basis van de bewerking en het eigenaarschap van de status. Een knop Vernieuwen leest nog steeds gegevens; een klik maakt een bewerking geen mutatie.',
  'queryDocs.clientReference':
    'QueryClient beheert gedeelde vermeldingen. fetchQuery leest gegevens; invalidateTags markeert afhankelijkheden als verouderd en vernieuwt actieve vermeldingen; removeQueries verwijdert overeenkomende vermeldingen. Zie de publieke broncontracten voor parameters en adapters.',
  'queryDocs.defaults':
    'Standaarden: staleTime = 0; gcTime = 300,000 ms. Polling, nieuwe pogingen, deadlines en vernieuwen bij focus of herverbinding zijn zonder configuratie uitgeschakeld.',
  'queryDocs.devtools': 'Queryhulpmiddelen',
  'queryDocs.excerpt':
    'Fragment met componentvelden. Importeer de bovenstaande service en definities; de mutatiedemo biedt de volledige workflow met tabel en samenvatting.',
  'queryDocs.fetching': 'Gegevens ophalen · queryResource',
  'queryDocs.freshness':
    'staleTime meet de versheid vanaf het laatste geslaagde antwoord. Daarna zijn gegevens verouderd; het verstrijken alleen start geen aanvraag.',
  'queryDocs.independent': 'Onafhankelijk lezen · queryResources',
  'queryDocs.independentClocks':
    'Beide klokken zijn onafhankelijk: ongebruikte gegevens kunnen nog vers zijn en actieve gegevens verouderd. Terugkerende observers kunnen bewaarde gegevens hergebruiken.',
  'queryDocs.invalidation':
    'Geslaagde schrijfbewerkingen invalideren de geselecteerde tags. Actieve query’s halen opnieuw op; inactieve vermeldingen worden verouderd. Invalidatie verwijdert de gegevens niet.',
  'queryDocs.keyIdentity':
    'Neem elke parameter die het antwoord verandert en het autorisatiebereik op in de sleutel. Leg reactieve waarden eenmaal vast en gebruik dezelfde waarden in sleutel en loader.',
  'queryDocs.keys': 'Sleutels en invalidatie',
  'queryDocs.keysIntro':
    'Sleutels identificeren gegevens. Tags beschrijven welke gecachete leesbewerkingen een geslaagde schrijfbewerking raakt. Ze hebben verschillende doelen.',
  'queryDocs.organization': 'Query’s organiseren',
  'queryDocs.organizationIntro':
    'Extraheer definities wanneer meerdere gebruikers dezelfde gegevens nodig hebben. Zet transport in team.service.ts, identiteit en tags in team.queries.ts en observers bij hun gebruikers.',
  'queryDocs.overview': 'Overzicht',
  'queryDocs.overviewIntro':
    'Serverstatus bestaat uit gegevens die bij een server horen. Deze hulpmiddelen laden ze, delen leesbewerkingen tussen componenten en synchroniseren cacheweergaven na schrijfbewerkingen.',
  'queryDocs.overviewRead': 'Laad een team, toon de gegevens, wijzig de geselecteerde ID en herstel na fouten.',
  'queryDocs.overviewWrite':
    'Sla een teamnaam op, bekijk wacht- en foutstatussen en werk vervolgens de betrokken cacheweergaven bij.',
  'queryDocs.prerequisites':
    'Begin met Angular-componenten en signals. Leer eerst wat een query doet voordat je cachebeleid kiest of een functie organiseert.',
  'queryDocs.reference': 'API-referentie',
  'queryDocs.referenceIntro':
    'Zoek hieronder handtekeningen en exacte status- en optietabellen op. Volg de handleidingen voor uitleg of een praktische taak.',
  'queryDocs.refreshControls':
    'reload() start vernieuwen op de achtergrond en geeft een boolean terug. execute() geeft een Promise voor een nieuwe leesbewerking. Beide slaan voltooide gegevens over en delen geldig lopend werk.',
  'queryDocs.retention':
    'gcTime bepaalt de bewaartijd nadat de laatste observer vertrekt. Opruimen wacht tot lopende aanvragen klaar zijn. Actieve observers behouden hun gegevens.',
  'queryDocs.saving': 'Wijzigingen opslaan · mutateResource',
  'queryDocs.tagIdentity':
    'Een tag is een object met type en optioneel scope/id. De mutatie selecteert overeenkomende querytags; een weggelaten scope betekent niet alle bereiken.',
  'queryDocs.triggers':
    'Verouderde gegevens kunnen vernieuwen wanneer ze opnieuw worden geobserveerd. Handmatig vernieuwen en invalidatie vragen nieuwe gegevens; polling en herstel bij focus of verbinding vereisen configuratie.',
  'queryDocs.writeBoundary':
    'Na een geslaagde schrijfbewerking kan cachesynchronisatie mislukken. Controleer invalidationError en vernieuw leesbewerkingen; herhaal de geslaagde schrijfbewerking niet om de cache te herstellen.',
  'queryLearn.collectionExplain':
    'Selecteer beide ID’s, keer de volgorde om en wis de selectie. Behouden sleutels behouden hun observers; verwijderde items geven ze vrij. Elke rij heeft eigen laad-, fout- en vernieuwstatussen.',
  'queryLearn.collectionIntro':
    'Gebruik queryResource als één aanvraag een lijst oplevert. Gebruik queryResources als een veranderende verzameling een aparte query per item nodig heeft.',
  'queryLearn.fixture':
    'Dit volledige voorbeeld simuleert serververtraging en fouten met een lokale timer. Open TypeScript om de component te kopiëren; HTML toont dezelfde gecompileerde template.',
  'queryLearn.httpSetup':
    'Voor HTTP configureer je HttpClient in app.config.ts en vervang je de gesimuleerde loader door http.get<Team>(url) met een vastgelegde ID. De rootclient vereist geen extra registratie.',
  'queryLearn.readError': 'Lezen mislukt. Schakel de gesimuleerde fout uit en vernieuw om opnieuw te proberen.',
  'queryLearn.readExplain':
    'key benoemt gegevens; loader haalt ze op. Signals die in de definitie worden gelezen selecteren de gegevens. value() biedt het resultaat; isInitialLoading() betekent laden zonder gegevens.',
  'queryLearn.readExplainTitle': 'De eerste leesbewerking begrijpen',
  'queryLearn.readIntro':
    'queryResource laadt gegevens en biedt resultaat, laadstatus en fouten als Angular-signals. Componenten met dezelfde sleutel delen cachegegevens en een lopende aanvraag.',
  'queryLearn.readSteps':
    'Laad Team A, kies Team B en vernieuw. Schakel fouten in en vernieuw opnieuw: het team blijft zichtbaar. Schakel fouten uit en vernieuw om te herstellen.',
  'queryLearn.readTitle': 'Je eerste query',
  'queryLearn.refreshExplain':
    'isRefreshing() betekent dat een leesbewerking loopt terwijl eerdere gegevens zichtbaar blijven. error() toont de fout; isRefreshError() onderscheidt fouten met bewaarde gegevens.',
  'queryLearn.saved': 'Opgeslagen',
  'queryLearn.simulateFailure': 'Fout simuleren',
  'queryLearn.teamA': 'Team A',
  'queryLearn.teamB': 'Team B',
  'queryLearn.writeError':
    'Opslaan mislukt. Je invoer blijft behouden; schakel de gesimuleerde fout uit en sla opnieuw op.',
  'queryLearn.writeExplain':
    'mutate(args) verstuurt de waarde en geeft een Promise terug. isLoading() regelt de wachtweergave; error() meldt een schrijffout. Begin zonder tags; voeg ze toe als een geslaagde schrijfbewerking cachelezingen moet vernieuwen.',
  'queryLearn.writeExplainTitle': 'De eerste opslagbewerking begrijpen',
  'queryLearn.writeIntro':
    'mutateResource voert een serverbewerking uit wanneer je mutate() aanroept. Signals voor wachten, resultaat en fouten laten het formulier reageren op de uitkomst.',
  'queryLearn.writeSteps':
    'Voer een naam in en sla op. Schakel fouten in en sla opnieuw op; schakel ze daarna uit en probeer opnieuw. Tijdens een schrijfbewerking blokkeert het formulier indienen.',
  'queryLearn.writeTitle': 'Je eerste opslagbewerking',
  'toSignalForm.savedProfile': 'Opgeslagen profiel',
  'queryResource.projectRevision': 'Antwoordversie',
  'queryResource.activeUser': 'Huidige gebruiker',
  'queryResource.engineLabel': 'Engine',
  'queryResource.computeLabel': 'Rekenkracht',
  'queryOwnership.title': 'Sleutels en tags per domein',
  'queryOwnership.definitions':
    'Houd observers in componenten. Importeer volledige querydefinities en tagfuncties uit het verantwoordelijke domein; neem het bereik en alle parameters die het antwoord veranderen op in sleutels.',
  'queryOwnership.refactoring':
    'Gebruik gedeelde exports in plaats van herhaalde teksten. Zoek vóór het wijzigen of verwijderen van een definitie alle referenties, stem af met het verantwoordelijke domein en controleer de betrokken lees- en schrijfacties.',
  'queryOwnership.noCache':
    'Sleutels identificeren ook gedeelde verzoeken en status. staleTime: 0 maakt gegevens verouderd; gcTime: 0 verwijdert ongebruikte items na lopende verzoeken. Gebruik resourceAsync voor onafhankelijke status zonder sleutel. Mutaties hebben geen sleutel nodig.',
  'queryOwnership.naming':
    'invalidateTags accepteert een array of een (result, args)-callback die alleen na succes draait. Geef [] terug om invalidatie over te slaan.',
  'queryOwnership.journey':
    'Voeg leden toe: tabel en samenvatting delen één verzoek per verversing. Sluit de samenvatting, voeg opnieuw toe en open deze weer. Gegevens en verzoekenaantal van team B blijven gelijk.',
  'queryOwnership.closeSummary': 'Samenvatting sluiten',
  'queryOwnership.openSummary': 'Samenvatting openen',
  'queryOwnership.summary': 'Samenvatting team A',
  'queryOwnership.teamAReads': 'Verzoeken team A',
  'queryOwnership.otherScope': 'Leden team B (ander bereik)',
  'queryOwnership.teamBReads': 'Verzoeken team B',
  'header.selectLanguage': 'Taal selecteren',
  'header.openGitHub': 'Openen op GitHub',
  'header.codeLicensed': 'Code gelicentieerd onder',
  'nav.signalUtils': "Signal-hulpprogramma's",
  'nav.queryMutation': 'Query’s en serverstatus',
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
  'nav.differenceInDays': 'differenceInDays',
  'nav.badgeNew': 'NEW',
  'nav.badgeUpdated': 'UPDATED',
  'nav.badgePopular': 'POPULAR',
  'nav.badgeCore': 'CORE',
  'home.start': 'Aan de slag',
  'home.prerequisite': 'Deze instructies zijn voor Angular 21. Begin in een bestaande zelfstandige Angular-applicatie.',
  'home.ngxLift.setup':
    'Installeer ngx-lift en kies een taak. HTTP-voorbeelden hebben provideHttpClient() nodig; lokale signaal- en timervoorbeelden niet.',
  'home.clrLift.setup':
    'Voeg het Clarity-stijlblad globaal toe en importeer de zelfstandige componenten die u gebruikt. Begin met de melding hieronder en volg daarna een componenttutorial.',
  'home.ngxLift.title': 'ngx-lift',
  'home.ngxLift.subtitle': 'Verbeter uw <code>modern</code> Angular ontwikkeling workflow',
  'home.ngxLift.supportMatrix': 'Versie ondersteuningsmatrix',
  'home.ngxLift.thVersion': 'Versie ngx-lift',
  'home.ngxLift.thNgVersion': 'Angular-versie',
  'home.ngxLift.utilityTitle': 'Hulpfuncties',
  'home.ngxLift.utilityDesc':
    'Uitgebreide nutsfuncties die zijn ontworpen om gemeenschappelijke ontwikkelingstaken te versnellen',
  'home.ngxLift.rxjsTitle': 'RxJS-operators',
  'home.ngxLift.rxjsDesc':
    'Gespecialiseerde operators die complexe reactieve operaties vereenvoudigen en de onderhoudbaarheid van codes verbeteren',
  'home.ngxLift.signalTitle': 'Signal Hulpmiddelen',
  'home.ngxLift.signalDesc': "Krachtige signaalgebaseerde hulpprogramma's die Angular's Signals API aanvullen",
  'home.clrLift.title': 'clr-lift',
  'home.clrLift.subtitle':
    "Uitbreiding van Clarity Design System met herbruikbare componenten, hulpprogramma's en operators",
  'home.clrLift.supportMatrix': 'Versie ondersteuningsmatrix',
  'home.clrLift.thVersion': 'Versie clr-lift',
  'home.clrLift.thNgVersion': 'Angular-versie',
  'home.clrLift.utilitiesTitle': 'Hulpmiddelen',
  'home.clrLift.utilitiesDesc':
    "Gespecialiseerde hulpprogramma's ontworpen voor Clarity componenten die gemeenschappelijke taken en operaties te vereenvoudigen, het verstrekken van een naadloze ontwikkeling ervaring",
  'home.clrLift.rxjsTitle': 'RxJS-operators',
  'home.clrLift.rxjsDesc':
    'Enhanced RxJS operators die Clarity functionaliteit uitbreiden. De <code>dgState</code> operator stroomlijnt datagrid state management, wat een intuïtieve en efficiënte aanpak biedt voor het werken met Clarity datagrids.',
  'home.clrLift.componentsTitle': 'Componenten',
  'home.clrLift.componentsDesc':
    'Productie-ready componenten gebouwd op Clarity Design System, inclusief toast meldingen, waarschuwingen, oproepen, pagina container, thema toggle, en meer',
  'home.clrLift.tipPeer':
    "In sommige gevallen kan een <strong>force installatie</strong> nodig zijn als &#64;clr/angular's peer afhankelijkheden een andere Angular versie opgeven dan uw project.",
  'home.clrLift.tipSkipLib':
    'Als u de nieuwste Angular-versie niet gebruikt, overweeg dan om <code>skipLibCheck: true</code> in tsconfig.json in te stellen om mogelijke bouwfouten te voorkomen.',
  'home.clrLift.tipIcon':
    'Zorg ervoor dat Clarity-pictogrammen correct worden geïmporteerd met behulp van <code>ClarityIcons.addIcons(...)</code>.',
  'common.examples': 'Voorbeelden',
  'common.apiReference': 'API-referentie',
  'common.overview': 'Overzicht',
  'common.parameters': 'Parameters',
  'common.returns': 'Retourneert',
  'rockStar.todayIs': 'Vandaag is',
  'rockStar.whoIsStar': 'Wie is de rockster van vandaag?',
  'rockStar.unveil': 'Onthullen',
  'common.signature': 'Handtekening',
  'common.description': 'Beschrijving',
  'common.basicUsage': 'Basisgebruik',
  'common.inputs': 'Invoer (Inputs)',
  'common.outputs': 'Uitvoer (Outputs)',
  'common.type': 'Type',
  'common.default': 'Standaard',
  'common.contentProjection': 'Inhoudsprojectie',
  'common.example': 'Voorbeeld',
  'common.example1': 'Voorbeeld 1: Basisgebruik',
  'common.example2': 'Voorbeeld 2: Met RxJS pipe-operator',
  'common.example3': 'Voorbeeld 3: Asynchrone code afhandelen',
  'common.example4': 'Voorbeeld 4: Ontkoppelde injector',
  'common.methods': 'Methoden',
  'common.selector': 'Selector',
  'common.behaviors': 'Gedragsvormen',
  'common.behavior': 'Gedrag',
  'common.features': 'Functies',
  'common.properties': 'Eigenschappen',
  'common.validationErrors': 'Validatiefouten',
  'common.usageNotes': 'Gebruiksopmerkingen',
  'common.liveDemo': 'Live demonstratie',
  'common.required': 'Vereist',
  'common.refresh': 'Vernieuwen',
  'common.firstName': 'Voornaam',
  'common.lastName': 'Achternaam',
  'common.email': 'E-mailadres',
  'common.gender': 'Geslacht',
  'common.male': 'Man',
  'common.female': 'Vrouw',
  'common.name': 'Naam',
  'common.noDataFound': 'Geen gegevens gevonden',
  'common.noItems': 'Geen items',
  'common.paginationOf': '{0} - {1} van {2} items',
  'common.seeUiBehavior': 'Klik om UI-gedrag te bekijken',
  'filterUsers.selectGender': 'Selecteer geslacht om gebruikers te laden',
  'fileReader.file': 'Bestand',
  'fileReader.readSuccess': 'Bestandsinhoud is succesvol gelezen',
  'fileReader.submitAndLog': 'Log van console verzenden en bekijken',
  'fileReader.caBundle': 'CA-bundel',
  'fileReader.showCertificate': 'Certificaat tonen:',
  'fileReader.exceedLimit': 'Overtroffen de maximale bestandsgrootte ({0} MB).',
  'multiAlerts.addStandard': 'Standaardalarm toevoegen',
  'multiAlerts.addInlineBtn': 'Alert toevoegen met inline-knop',
  'multiAlerts.addAction': 'Alert toevoegen met actie',
  'multiAlerts.clearAll': 'Alle waarschuwingen wissen',
  'toast.successBtn': 'Toast met succes',
  'toast.infoBtn': 'Info Toast',
  'toast.errorBtn': 'Fouttoast',
  'toast.warningBtn': 'Waarschuwingstoast',
  'idleDetection.startSimulation': 'Snelle simulatie starten (3s inactief)',
  'idleDetection.stopSimulation': 'Simulatie stoppen',
  'idleDetection.simActive': 'Simulatie actief:',
  'idleDetection.sessionStatus': 'Status:',
  'idleDetection.totalTimeouts': 'Totale time-outs:',
  'idleDetection.yes': 'Ja.',
  'idleDetection.no': 'Nee',
  'resourceAsync.userN': 'Gebruiker {0}',
  'resourceAsync.reload': 'Herladen',
  'resourceAsync.regUsernamePlaceholder': 'Voer gebruikersnaam (3-20 tekens in)',
  'resourceAsync.regUsernameError': 'Gebruikersnaam moet 3-20 tekens zijn',
  'resourceAsync.regEmailPlaceholder': 'Voer uw e-mail in',
  'resourceAsync.regEmailError': 'Voer een geldige e-mail in',
  'resourceAsync.regPasswordPlaceholder': 'Wachtwoord invoeren (min. 8 tekens)',
  'resourceAsync.regPasswordError': 'Wachtwoord moet minstens 8 tekens zijn',
  'resourceAsync.loadingTodo': 'Todo wordt geladen...',
  'resourceAsync.loadTodo': 'Todo laden',
  'resourceAsync.saving': 'Opslaan...',
  'resourceAsync.resetFromServer': 'Reset van server',
  'resourceAsync.loadUserCacheFirst': 'Gebruiker laden (cache-eerste)',
  'resourceAsync.fromCache': 'Van cache',
  'resourceAsync.updating': 'Bijwerken...',
  'resourceAsync.loadCounter': 'Ladenteller',
  'resourceAsync.unsavedChanges': 'Niet opgeslagen wijzigingen - teller is lokaal gewijzigd',
  'resourceAsync.saveToServer': 'Opslaan naar server',
  'resourceAsync.discardChanges': 'Wijzigingen verwerpen',
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
  'inspector.hideJson': 'Verberg JSON',
  'mergeFrom.overview':
    'De <code>mergeFrom</code>-functie combineert de waarden van Observables of Signals en stuurt de laatste waarde uit. Het stelt ook toegevoegde bewerkingen mogelijk met RxJS-operators voordat deze waarde wordt uitgezonden. Hoewel het vergelijkbaar is met <code>merge()</code>, bevat het ook Signals. <code>mergeFrom</code> is vergelijkbaar met <code>combineFrom</code>, maar in plaats van een gecombineerde waarde uit te zenden, stuurt het de laatste uitgezonden waarde met de merge-operator in plaats van combineLatest.',
  'mergeFrom.example1Desc': 'Meerdere signals of observables samenvoegen:',
  'mergeFrom.example2Desc': 'Geef een RxJS-pipe-operator door om de uitgezonden waarden te manipuleren:',
  'mergeFrom.example3Desc':
    'Gebruik de optie <code>startWith</code> of <code>initialValue</code> om asynchrone observables te verwerken:',
  'mergeFrom.example4Desc': 'Geef een aangepaste <code>Injector</code> door om een samengevoegd signaal te maken:',
  'mergeFrom.apiSummary':
    'Combineert meerdere Observables of Signals in een enkele Signal die de laatste waarde van elk bronuitgave uitstraalt, vergelijkbaar met <code>merge</code> maar met Signal ondersteuning.',
  'mergeFrom.paramSources':
    'Een object of array van Observables of Signals om samen te voegen. Wanneer een object wordt geleverd, zal het resultaat een object zijn met dezelfde sleutels.',
  'mergeFrom.paramOperator':
    'Een RxJS pipe operator om de uitgezonden waarden te manipuleren voordat ze worden uitgestoten.',
  'mergeFrom.paramOptions': 'Configuratie-opties waaronder initialValue en injector.',
  'mergeFrom.returnsDesc': 'Een Signal die de gecombineerde/samengevoegde waarde uitstraalt als bronnen.',
  'toSignalForm.pageTitle': 'Reactive Form Signals & Bindingen (toSignalForm)',
  'toSignalForm.bannerTitle': 'Bridging Angular Reactive Forms & Modern Signals',
  'toSignalForm.bannerDesc':
    '<code>toSignalForm</code> omringt standaard Angular <code>FormGroup</code>-instanties met reaktieve Signals, declaratieve bindingen (<code>bindIf</code>, <code>bindDisabled</code>), overgebruik van meerdere controles, en geverifieerde indieningswaarden (<code>submitValue</code>), behoudend 100% compatibiliteit met Clarity-formcontainers en Angular-validators.',
  'toSignalForm.quickTitle': 'Niveau 1: Snelstartformulier Signals',
  'toSignalForm.quickBadge': '30-Second Hello World',
  'toSignalForm.quickDesc':
    'Leer de basisprincipes: wrap a FormGroup with toSignalForm, read values reactively via signals, and disable actions with sf.invalid().',
  'toSignalForm.username': 'Gebruikersnaam',
  'toSignalForm.usernamePlaceholder': 'Ten minste 3 tekens',
  'toSignalForm.usernameRequired': 'Gebruikersnaam is vereist.',
  'toSignalForm.usernameMinLength': 'Moet minstens 3 karakters zijn.',
  'toSignalForm.email': 'E-mailadres',
  'toSignalForm.emailPlaceholder': 'name@domein.com',
  'toSignalForm.emailRequired': 'E-mail is vereist.',
  'toSignalForm.emailInvalid': 'Voer een geldig e-mailadres in.',
  'toSignalForm.receiveUpdates': 'E-mailupdates ontvangen',
  'toSignalForm.saveProfile': 'Profiel opslaan',
  'toSignalForm.reset': 'Reset',
  'toSignalForm.quickFormState': 'Snelformulier Signal-toestand',
  'toSignalForm.quickFormStateDesc': 'Signals-update synchroon als u in het formulier hierboven typt',
  'toSignalForm.enterpriseTitle': 'Niveau 2: Enterprise Showcase - Cloud Database Provisioning',
  'toSignalForm.enterpriseBadge': 'Volledige Real-World-spec',
  'toSignalForm.enterpriseDesc':
    'Complexe multi-control aanwezigheid, asynchrone apparaat onderzoeken via resourceAsync, cascading versie updates, en voorwaardelijke auto-schaling sloten.',
  'toSignalForm.enterpriseState': 'Enterprise Form Live Signals',
  'toSignalForm.enterpriseStateDesc':
    'Tracks vorm validatie, auto-schaling sloten, en backend provisioning status in real time',
  'toSignalForm.region': 'Deployment Region / Appliance',
  'toSignalForm.regionSelect': 'Doelgebied selecteren...',
  'toSignalForm.regionUSWest': 'US West (Cloud v2 - Multi-Zone HA ondersteund)',
  'toSignalForm.regionApEast': 'Asia Pacific (Regional Cloud - Multi-Zone HA voor PG & MySQL)',
  'toSignalForm.regionEuCentral': 'Midden-Europa (regio Legacy - Uitsluitend één zone)',
  'toSignalForm.regionRequired': 'Er is behoefte aan een inzetgebied.',
  'toSignalForm.regionHelper':
    'Asynchroon controleert regionale apparaat mogelijkheden via <code>computedAsync</code>.',
  'toSignalForm.multiZoneSupported': 'Ondersteund door Multi-Zone HA',
  'toSignalForm.singleZoneOnly': 'Alleen enkele zone (HA Gated)',
  'toSignalForm.engine': 'Database-engine',
  'toSignalForm.enginePostgres': 'PostgreSQL',
  'toSignalForm.engineMysql': 'MySQL',
  'toSignalForm.engineSqlServer': 'SQL-server',
  'toSignalForm.engineRequired': 'Database-engine is vereist.',
  'toSignalForm.engineHelper': 'De onderstaande opties zijn reactief afgeleid van <code>sf.fields.engine.value</code>.',
  'toSignalForm.haTopology': 'Multi-zone HA Topologie',
  'toSignalForm.haCrossAz': 'Cross Availability Zone',
  'toSignalForm.haDedicated': 'Toegewijde Anti-Affiniteitsgasten',
  'toSignalForm.haRequired': 'HA topologie is vereist.',
  'toSignalForm.haHelper': 'Dynamisch gemonteerd door <code>sf.bindIf(isMultiZoneSupported, ...)</code>.',
  'toSignalForm.replicaCount': "Aantal replica's",
  'toSignalForm.replicaRequired': 'Replica aantal is vereist.',
  'toSignalForm.replicaMin': "Minimum 2 replica's voor Multi-Zone HA.",
  'toSignalForm.replicaMax': "Maximaal 5 replica's toegestaan.",
  'toSignalForm.replicaHelper': 'Waarden worden bewaard in de hele regio.',
  'toSignalForm.version': 'Motorversie',
  'toSignalForm.versionSelect': 'Selecteer versie',
  'toSignalForm.versionRequired': 'Motorversie is vereist.',
  'toSignalForm.versionHelper': 'Reset automatisch naar de eerste beschikbare versie wanneer de motor verandert.',
  'toSignalForm.clusterName': 'Clusternaam',
  'toSignalForm.clusterNamePlaceholder': 'b.v. facturatie-db-primair',
  'toSignalForm.clusterNameRequired': 'Clusternaam is vereist.',
  'toSignalForm.clusterNameMinLength': 'Moet minstens 4 karakters zijn.',
  'toSignalForm.clusterNameHelper':
    'Debounced 400ms & asynchroon gecontroleerd op gereserveerde namen (prod-db, test-cluster, enz.).',
  'toSignalForm.clusterNameChecking': 'Beschikbaarheid van de naam controleren... (afgewezen 400ms)',
  'toSignalForm.autoScaling': 'Automatisch schalen van opslag',
  'toSignalForm.autoScalingHelper':
    'Indien ingeschakeld wordt handmatige opslaginvoer automatisch uitgeschakeld en teruggezet naar 250 GB.',
  'toSignalForm.storageGb': 'Toegewezen opslag (GB)',
  'toSignalForm.storageGbRequired': 'Opslaggrootte is vereist.',
  'toSignalForm.storageGbMin': 'De minimale toewijzing is 20 GB.',
  'toSignalForm.storageGbHelper':
    "Gebonden via <code>sf.bindDisabled('storageGb', () =&gt; autoScaling(), &#123; resetOnDisable: true, resetValue: 250 &#125;)</code>.",
  'toSignalForm.storageLocked': 'Auto-schaling beheerd (Uitgeschakeld, vergrendeld tot 250 GB)',
  'toSignalForm.storageManual': 'Handmatige toewijzing toegestaan',
  'toSignalForm.authMode': 'Authenticatiemodus',
  'toSignalForm.authSql': 'Database Native Gebruiker',
  'toSignalForm.authWindows': 'Enterprise Directory / Windows Auth',
  'toSignalForm.authModeRequired': 'Authenticatiemodus is vereist.',
  'toSignalForm.authModeHelper':
    'Het selecteren van Database Native User mount wachtwoord en bevestiging met geheugenretentie.',
  'toSignalForm.password': 'Hoofdwachtwoord',
  'toSignalForm.passwordPlaceholder': 'Min. 8 tekens',
  'toSignalForm.passwordRequired': 'Hoofdwachtwoord is vereist.',
  'toSignalForm.passwordMinLength': 'Moet minstens 8 karakters zijn.',
  'toSignalForm.confirmPassword': 'Wachtwoord bevestigen',
  'toSignalForm.confirmPasswordPlaceholder': 'Hoofdwachtwoord herhalen',
  'toSignalForm.confirmPasswordRequired': 'Wachtwoordbevestiging is vereist.',
  'toSignalForm.passwordMismatch': 'Wachtwoorden komen niet overeen.',
  'toSignalForm.confirmPasswordHelper':
    'Automatisch hervalideerd wanneer hoofdwachtwoord verandert via <code>sf.revalidate</code>.',
  'toSignalForm.tlsCert': 'TLS / SSL certificaat',
  'toSignalForm.certManaged': 'Platform automatisch gegenereerd',
  'toSignalForm.certCustom': 'Aangepast Enterprise Certificate',
  'toSignalForm.certRequired': 'Certificaattype is vereist.',
  'toSignalForm.certHelper':
    'Aangepaste modus koppelt dynamisch de certificaatinvoer aan en behoudt getypte tekst tussen schakels.',
  'toSignalForm.tlsChain': 'PEM certificaatketen',
  'toSignalForm.tlsChainPlaceholder': '-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----',
  'toSignalForm.tlsChainRequired': 'Certificaatketting is vereist.',
  'toSignalForm.tlsChainMinLength': 'Het certificaat moet ten minste 20 karakters tellen.',
  'toSignalForm.tlsChainHelper':
    'Typ wat tekst, schakel naar "Auto-Generated" en schakel terug: tekst is bewaard gebleven!',
  'toSignalForm.createCluster': 'Cluster aanmaken',
  'toSignalForm.resetForm': 'Formulier resetten',
  'toSignalForm.submitting':
    'Het indienen van een verzoek om clustervoorziening om het vliegtuig te besturen... (1.0s simulatie)',
  'toSignalForm.successTitle': 'Cluster Provisioning Request Succeed (ID: {0})',
  'toSignalForm.simulatedResponse': 'Gesimuleerde backend respons ontvangen in 1.0 seconde:',
  'toSignalForm.diagnosticsTitle': 'Real-time Signal-diagnostiek',
  'toSignalForm.clusterNameState': 'Cluster Name State (sf.fields.clusterName)',
  'toSignalForm.value': 'Waarde:',
  'toSignalForm.debounced': 'Ontbounced (400ms):',
  'toSignalForm.valid': 'Geldig:',
  'toSignalForm.touched': 'Aangeraakt:',
  'toSignalForm.errors': 'Fouten:',
  'toSignalForm.sqlCredState': 'SQL Geheimenstaat',
  'toSignalForm.authModeLabel': 'Auth-modus:',
  'toSignalForm.controlsAttached': 'Bijgevoegde knoppen:',
  'toSignalForm.passwordValid': 'Wachtwoord geldig:',
  'toSignalForm.passwordErrors': 'Wachtwoordfouten:',
  'toSignalForm.confirmValid': 'Geldig bevestigen:',
  'toSignalForm.confirmErrors': 'Fouten bevestigen:',
  'toSignalForm.sanitizedPayload': 'Gesanctioneerde payload voor indiening (sf.submitValue)',
  'toSignalForm.sanitizedDesc':
    'Auto-omits UI-alleen <code>confirmPassword</code> en laat vrijstaande <code>password</code> op Windows-auth.',
  'toSignalForm.patternsTitle': 'Gespecialiseerde architecturale patronen',
  'toSignalForm.pattern1Title': 'Patroon 1: afhankelijke / voorwaardelijke veldbomen (bindIf)',
  'toSignalForm.pattern1Desc':
    'Bouwt of ontkoppelt een groep gerelateerde controles (zoals databasegegevens) op basis van een reaktieve voorwaarde. Ontkoppelde controles worden automatisch uitgesloten uit validatie en backend-uitvoer, en hun invoer wordt behouden wanneer <code>preserveValue: true</code> is geconfigureerd.',
  'toSignalForm.pattern2Title': 'Patroon 2: Reactive uitschakelen en automatisch herstellen (bindDisabled)',
  'toSignalForm.pattern2Desc':
    'Bindeert de ingeschakelde/uitgeschakelde toestand van een controle direct aan een boolean-signal of reaktieve getterfunctie (<code>() =&gt; boolean</code>). Het ondersteunt sterk typerde controle-sleutels, direct <code>sf.controls.&lt;name&gt;</code> versterkte controles, en <code>AbstractControl</code>-instanties. Standaard is <code>emitEvent: true</code> om te zorgen dat reaktieve status-signalen synchrone wijzigingen doorlaten, en ondersteunt optionele reset bij uitgeschakeling met een sterk typerde <code>resetValue</code>.',
  'toSignalForm.pattern3Title': 'Patroon 3: Sanitaire indieningen (sf.submitValue)',
  'toSignalForm.pattern3Desc':
    'Oplost de spanning tussen <code>form.value</code> (die uitgeschakelde controles verlaat) en <code>form.getRawValue()</code> (die UI-gebaseerde velden zoals <code>confirmPassword</code> opheft). <code>sf.submitValue()</code> biedt een continue reaktieve signal die altijd geverifieerd en klaar is voor indiening of <code>resourceAsync</code>.',
  'toSignalForm.pattern4Title': 'Patroon 4: Asynchrone feature Gating (computedAsync + bindIf)',
  'toSignalForm.pattern4Desc':
    'In cloud- en bedrijfsapplicaties zijn beschikbare veldgroepen vaak afhankelijk van regionale capaciteiten of feature-flags die asynchrone antwoorden uit API-eindpunten opleveren. <code>computedAsync</code> levert een reaktieve <code>Signal&lt;boolean&gt;</code> op basis van de geselecteerde regio en engine, die direct kan worden gebruikt in <code>sf.bindIf</code> om groepen capaciteiten op te bouwen of af te koppelen.',
  'toSignalForm.pattern5Title': 'Patroon 5: Cascading Updates & Change Watch (sf.watch)',
  'toSignalForm.pattern5Desc':
    'Wanneer een formuliercontrole veranderingen aanwekt die cascading updates in een andere controle (bijvoorbeeld beschikbare versies bij verandering van de databaseengine) veroorzaken, kan je de traditionele RxJS- <code>valueChanges.pipe(takeUntilDestroyed())</code>-patron gebruiken of de signal-first- <code>sf.controls.&lt;name&gt;.watch()</code> / <code>sf.watch()</code>-utiliteit. <code>watch</code> werkt binnen een Angular- <code>effect()</code> met automatische <code>untracked</code>-isolatie, voorkomt <code>NG0600</code>-signal-uitvoerfouten terwijl het manuele abonnementsafsluiting elimineert.',
  'toSignalForm.apiReferenceTitle': 'API-referentie',
  'toSignalForm.apiToSignalFormTitle': 'toSignalForm(form, options?)',
  'toSignalForm.apiBindIfTitle': 'sf.bindIf(control, condition, options?) / bindControlIf',
  'toSignalForm.apiBindDisabledTitle': 'sf.bindDisabled(control, condition, options?) / bindControlDisabled',
  'toSignalForm.apiRevalidateTitle': 'sf.revalidate(target, sources, options?) / revalidateOnChange',
  'toSignalForm.apiPropForm': 'De Angular FormGroup instantie om in te pakken met reactieve signalen en bindingen.',
  'toSignalForm.apiPropOmit': 'Controleer namen om weg te laten van submitValue payloads.',
  'toSignalForm.apiPropEmitEvent': 'Of status/waardeveranderingen Angular-besturingsgebeurtenissen uitzenden.',
  'toSignalForm.apiPropValue': 'Reactive signaal van de huidige vorm waarde.',
  'toSignalForm.apiPropStatus': "Reactive signaal van algemene vormstatus (')VALID'INVALID'PENDING'DISABLED').",
  'toSignalForm.apiPropValid': 'Berekend signaal dat aangeeft of het formulier geldig is.',
  'toSignalForm.apiPropInvalid': 'Berekend signaal dat aangeeft of het formulier ongeldig is.',
  'toSignalForm.apiPropSubmitValue':
    'Gesaneerde lading exclusief uitgeschakelde, weggelaten of niet-gemonteerde besturingen.',
  'toSignalForm.apiPropIsSubmitting':
    'Schrijfbaar signaal dat volgt of een async-inzending tijdens de vlucht plaatsvindt.',
  'toSignalForm.apiBindIfControl': 'Naam of instantie van de controle om voorwaardelijk te monteren/ontkoppelen.',
  'toSignalForm.apiBindIfCondition': 'Booleaans signaal of predicaat om te bepalen of de besturing is gemonteerd.',
  'toSignalForm.apiBindIfPreserveValue':
    'Bewaart de controlewaarde in het geheugen gedurende de ontkoppel/remount cycli.',
  'toSignalForm.apiBindIfDefaultValue': 'Standaardwaarde toegekend bij het aan- of resetten van de besturing.',
  'toSignalForm.apiBindIfEmitEvent':
    'Of optellen/verwijderen van de besturing FormGroup waarde en status-gebeurtenissen uitzendt.',
  'toSignalForm.apiBindDisabledControl': 'Doelcontrole waarvan de ingeschakelde/uitgeschakelde toestand gebonden is.',
  'toSignalForm.apiBindDisabledCondition':
    'Booleaans signaal of voorspellen terug te keren true to disable, vals om in te schakelen.',
  'toSignalForm.apiBindDisabledResetOnDisable':
    'Stelt automatisch de controlewaarde in bij het invoeren van de uitgeschakelde status.',
  'toSignalForm.apiBindDisabledResetValue':
    'Specifieke resetwaarde wanneer resetOnDisable actief is; standaardinstellingen voor de controle van initiaal/null.',
  'toSignalForm.apiBindDisabledEmitEvent': 'Of veranderingen waarde/status-gebeurtenissen uitstralen/uitschakelen.',
  'toSignalForm.apiRevalidateTarget': 'Doelcontrole om de validatie opnieuw te evalueren bij bronwijzigingen.',
  'toSignalForm.apiRevalidateSources':
    'Eén of meer afhankelijkheidsfuncties waarvan de waarde/statuswijzigingen de doelverlenging in werking stellen.',
  'toSignalForm.apiRevalidateOnlyIfTouched':
    'Alleen trigger doel verlenging als het doel is aangeraakt door de gebruiker.',
  'toSignalForm.apiRevalidateOnlyIfDirty': 'Alleen trigger doel verlenging als het doel is gewijzigd (vuil).',
  'computedAsync.title': 'computedAsync',
  'computedAsync.overview':
    'De <code>computedAsync</code>-functie is een flexibele utiliteit die waarden kan berekenen uit Promises, Observables of normale waarden. Het biedt flexibiliteit in het computatiegedrag via keuze van samenvoegingsstrategieën (switch, merge, concat, exhaust) en aanvullende startwaarden. Om <code>computedAsync</code> te gebruiken, geef een functie op die een Promise, Observable of normale waarde retourneert. Het retourneert dan een <code>Signal</code> die de berekende waarde uitstraalt.',
  'computedAsync.example1': 'Voorbeeld 1: Werkt met Promises',
  'computedAsync.example1Desc': 'Bereken waarden van Promises:',
  'computedAsync.example2': 'Voorbeeld 2: Werkt met Observables',
  'computedAsync.example2Desc':
    'Wanneer een Observable wordt geretourneerd, wordt het automatisch abonneerd en wordt het automatisch onabonneerd wanneer de component is verder opgebouwd of wanneer het berekening is heropgestart. In het volgende voorbeeld, wanneer de userId verandert, wordt de vorige berekening geannuleerd (inclusief eventuele openstaande API-aanroepen), en wordt een nieuwe berekening gestart.',
  'computedAsync.example3': 'Voorbeeld 3: Werkt met reguliere waarden',
  'computedAsync.example3Desc':
    'Dit stelt het retourneren van normale waarden (die geen Promises of Observables bevatten) mogelijk uit de callback-functie. De callback-functie voert zich in de microtaakqueue uit, dus het zal niet direct de waarde uitstralen (standaard retourneert het undefined). Om de waarde direct uit te stralen, kan je de requireSync-optie gebruiken in het tweede argument-objects.',
  'computedAsync.example4': 'Voorbeeld 4: Werkt met initialValue',
  'computedAsync.example4Desc':
    'Als we een initiële waarde voor de berekende waarde willen vaststellen, kunnen we deze leveren als het tweede argument binnen het optie object.',
  'computedAsync.example5': 'Voorbeeld 5: Werkt met requireSync',
  'computedAsync.example5Desc':
    'Als we een Observable hebben dat synchrone waarden uitstraalt, kunnen we de requireSync-optie gebruiken om de waarde direct uit te stralen. Deze functionaliteit is ook nuttig om te zorgen dat het <code>signal</code>-type standaard undefined uitsluit (dus <code>Signal<T></code> in plaats van <code>Signal<T | undefined></code>).',
  'computedAsync.example6': 'Voorbeeld 6: Werk met createAsyncState Operator',
  'computedAsync.example6Desc':
    'In het voorbeeld hieronder hebben we een <code>Signal</code> die de toestand van een API oproep weergeeft. We gebruiken <code>computedAsync</code> en <code>createAsyncState</code> operator om de toestand van de API oproep te berekenen op basis van de <code>userId</code>.',
  'computedAsync.example7': 'Voorbeeld 7: Gedrag (schakelaar, merge, concat, uitlaat)',
  'computedAsync.example7Desc':
    'Standaard gebruikt <code>computedAsync</code> het switchgedrag. Mocht u dit gedrag willen veranderen, dan kunt u de gedragsoptie binnen het tweede argumentoptiesobject leveren.',
  'computedAsync.behaviorSwitch': 'switch (standaard)',
  'computedAsync.behaviorSwitchDesc':
    'Wanneer u de voorafgaande berekening wenst te annuleren, wordt het switchgedrag gebruikt, wat de standaard is. Als een nieuwe berekening wordt geactiveerd voordat de vorige wordt afgesloten, wordt het eerste beëindigd.',
  'computedAsync.behaviorMerge': 'samenvoegen',
  'computedAsync.behaviorMergeDesc':
    'Om de vorige berekening te behouden, wordt het mergegedrag gebruikt. Als een nieuwe berekening wordt gestart voordat de vorige is voltooid, wordt het eerste bewaard terwijl het laatste wordt gestart.',
  'computedAsync.behaviorConcat': 'concat',
  'computedAsync.behaviorConcatDesc':
    'Als het bewaren van de voorafgaande berekening gewenst is, samen met het wachten op de voltooiing ervan voordat het nieuwe wordt gestart, wordt het concatgedrag gekozen.',
  'computedAsync.behaviorExhaust': 'uitlaat',
  'computedAsync.behaviorExhaustDesc':
    'In gevallen waarin het negeren van de nieuwe berekening, terwijl de voorafgaande aan de gang is, is het uitlaatgedrag geselecteerd.',
  'computedAsync.example8': 'Voorbeeld 8: Gebruik met vorige gecomputeerde waarde',
  'computedAsync.example8Desc':
    'Als er een noodzaak is om de eerder berekende waarde in de volgende berekening te gebruiken, kan deze worden benaderd binnen de callbackfunctie als het eerste argument.',
  'computedAsync.example9': 'Voorbeeld 9: Gegevens in eerste instantie laden',
  'computedAsync.example9Desc': 'Laad gebruikers in eerste instantie wanneer het onderdeel belast:',
  'computedAsync.refresh': 'Verversen',
  'computedAsync.learnTrigger': 'Leer hier <a href="{0}"><code>createTrigger</code> </a>.',
  'computedAsync.example10': 'Voorbeeld 10: Gegevens laden wanneer Knop klikt',
  'computedAsync.example10Desc': 'Gebruikers alleen laden als er op een knop wordt geklikt:',
  'computedAsync.loadUsers': 'Gebruikers laden',
  'computedAsync.example11': 'Voorbeeld 11: Fout bij het omgaan met onError',
  'computedAsync.example11Desc':
    'Gebruik de <code>onError</code> callback om fouten elegant te verwerken en terugvalwaarden te geven. Wanneer <code>onError</code> een waarde teruggeeft, zal het signaal die waarde uitstralen in plaats van een fout te maken:',
  'computedAsync.onErrorCallout':
    'De <code>onError</code>-callback retourneert een vervangende waarde van type T. Neem <code>undefined</code> indien nodig expliciet op in T. Onbehandelde fouten en callback-uitzonderingen worden bij het lezen van het signal geworpen en worden nooit succesvolle gegevens.',
  'computedAsync.example12': 'Voorbeeld 12: Fouten worden standaard bij het lezen geworpen',
  'computedAsync.example12Desc':
    'Onbehandelde fouten worden geworpen wanneer u het signal leest. Vang de leesfout op of gebruik <code>onError</code> voor een getypeerde vervangende waarde.',
  'computedAsync.throwOnErrorCallout':
    '<code>throwOnError: true</code> voert <code>onError</code> uit voor neveneffecten en werpt toch een fout; de retourwaarde wordt genegeerd. <code>throwOnError: false</code> wordt niet meer ondersteund.',
  'computedAsync.example13': 'Voorbeeld 13: Tabblad wisselen met Annulering aanvraag (Stream Resilience)',
  'computedAsync.example13Desc':
    'In multi-tab UIs kunnen schakeltabbladen snel gelijktijdige verzoeken oproepen waarbij verzoeken tijdens de vlucht worden afgebroken of mislukt (bijvoorbeeld browsernavigatie annuleringen).',
  'computedAsync.tabResilienceBefore':
    '<strong>Voordat het opgelost werd:</strong> Een interne fout (zoals een geannuleerde HTTP-aanvraag) zou door <code>switchAll</code> naar de buitenste observabel-afschrijving doorgaan en de externe observabel-abonnementsverificatie permanent beëindigen. De UI bleef eeuwig in het laden zitten en kon nooit de volgende tabbladen laden.',
  'computedAsync.tabResilienceAfter':
    '<strong>After Fix:</strong> De innerlijke fout wordt veilig gevangen en behandeld, waardoor de buitenstroom in leven blijft. Overschakelen naar een tabblad of opnieuw proberen direct ophalen en nieuwe gegevens weergeven!',
  'computedAsync.tabActiveDirectory': 'Actieve map',
  'computedAsync.tabBackupLocations': 'Reservekopielocaties',
  'computedAsync.tabCertificates': 'Certificaten',
  'computedAsync.tabSimulateAborted': 'Gestopt verzoek simuleren',
  'computedAsync.tabNotice':
    'Opmerking: Zelfs na dit gesimuleerde geaborteerde verzoek blijft de stroom in leven! Klik op elk tabblad hierboven om het naadloos te zien herstellen.',
  'computedAsync.example14': 'Voorbeeld 14: Ontkoppelde injector',
  'computedAsync.example14Desc':
    'Door een optionele <code>injector</code> in het optieobject door te geven, kan <code>computedAsync</code> worden geïnstalleerd buiten een omgevingsinjectiecontext. Bijvoorbeeld binnen composible helper functies, aangepaste services, of dynamische fabriek methoden:',
  'computedAsync.apiSummary':
    'Berekent waarden uit Promises, Observables of normale waarden, en retourneert een Signal die de berekende waarde uitstraalt.',
  'computedAsync.paramComputation':
    'Een functie die een Promise, Observable, of gewone waarde teruggeeft. De functie ontvangt de vorige berekende waarde als een optioneel eerste argument.',
  'computedAsync.paramOptions': 'Configuratieopties voor async-berekening.',
  'computedAsync.propInitialValue': 'De initiële waarde voor het berekende signaal voordat de berekening voltooid is.',
  'computedAsync.propRequireSync': 'Indien waar, vereist de berekening synchroon uit te zenden.',
  'computedAsync.propBehavior':
    'Strategie voor het verwerken van meerdere berekeningen: "switch", "merge", "concat" of "exhaust". Standaard: "switch".',
  'computedAsync.propOnError': 'Error handler callback die fouten van async operaties ontvangt.',
  'computedAsync.propThrowOnError': 'Indien waar, zullen fouten worden gegooid en zich verspreiden.',
  'computedAsync.returnsDesc': 'Een Signal die de berekende waarde uitstraalt.',
  'combineFrom.title': 'combineFrom',
  'combineFrom.overview':
    'De <code>combineFrom</code>-functie neemt een array of object van Observables of Signals en produceert een Signal dat de geaggregeerde waarde van deze bronnen uitstraalt. Vergelijkbaar met <code>combineLatest</code>, maar ondersteunt ook Signals. Ondersteunt aangepaste injectors en startwaarden.',
  'combineFrom.example1': 'Voorbeeld 1: Basisgebruik',
  'combineFrom.example1Desc': 'Combineer meerdere signalen of waarneembaren:',
  'combineFrom.example2': 'Voorbeeld 2: Met RxJS Pipe Operator',
  'combineFrom.example2Desc': 'Pass een RxJS pipe operator om de uitgezonden waarden te manipuleren:',
  'combineFrom.example3': 'Voorbeeld 3: Handle Asynchrone code',
  'combineFrom.example3Desc':
    'Gebruik <code>startWith</code> of <code>initialValue</code> optie om async waarneembaren te verwerken:',
  'combineFrom.example4': 'Voorbeeld 4: Real Example - Gefilterde gegevens',
  'combineFrom.example4Desc':
    'Combineer zoekcriteria met een API-bron om client-side filteren en sorteren uit te voeren:',
  'combineFrom.example5': 'Voorbeeld 5: Gededupliceerde Initialisatie & Expliciete Injecteur',
  'combineFrom.example5Desc':
    'Dedupliceert de initiële signaalemissie. Afzonderlijke bronnen kunnen nog steeds tussenliggende combinaties produceren; gebruik computed() voor synchrone signaal-alleen-afleiding.',
  'combineFrom.apiSummary':
    'Combineert een Observable en een Signal bron met combineLatest-semantiek en per-bron deduplicatie.',
  'combineFrom.paramSources':
    'Een object of array van Observables of Signals om te combineren. Wanneer een object wordt geleverd, zal het resultaat een object zijn met dezelfde sleutels.',
  'combineFrom.paramOperator':
    'Een RxJS pipe operator om de uitgezonden waarden te manipuleren voordat ze worden uitgestoten.',
  'combineFrom.paramOptions': 'Configuratie-opties waaronder initialValue en injector.',
  'combineFrom.returnsDesc':
    'Een signaal dat een array of object (afhankelijk van het ingangstype) uitstraalt met de nieuwste waarden van alle waarneembare bronnen en signalen.',
  'resourceAsync.title': 'resourceAsync',
  'resourceAsync.overview':
    'De functie <code>resourceAsync</code> maakt een reactieve resource die asynchrone bewerkingen beheert en hun volledige status bijhoudt. Zij ondersteunt Observables, Promises en synchrone waarden, annuleert verouderde aanvragen automatisch en biedt handmatig herladen.',
  'resourceAsync.basicSection': 'Basisvoorbeelden',
  'resourceAsync.intermediateSection': 'Tussenliggende voorbeelden',
  'resourceAsync.whenToUseSection': 'Wanneer te gebruiken',
  'resourceAsync.advancedSection': 'WritableResourceRef - Local State Management',
  'resourceAsync.nestedSection': 'Geavanceerd patroon: geneste bronnen',
  'resourceAsync.example1': 'Voorbeeld 1: Basic Reactive Query met Auto-Dependency Tracking',
  'resourceAsync.example1Desc':
    'Maakt een hulpbron aan die automatisch gegevens ophaalt en her-fetches wanneer afhankelijkheden veranderen. Elk signaal dat gelezen wordt binnen de bronfunctie wordt een reactieve afhankelijkheid.',
  'resourceAsync.example2': 'Voorbeeld 2: Lazy Laden',
  'resourceAsync.example2Desc':
    'Gebruik <code>lazy: true</code> om het laden uit te stellen totdat <code>reload()</code> wordt aangeroepen. De hulpbron start in stationaire toestand en zal geen gegevens ophalen totdat dit expliciet is geactiveerd:',
  'resourceAsync.loadUsers': 'Gebruikers laden',
  'resourceAsync.notLoadedIdle': 'Nog niet geladen (idle)',
  'resourceAsync.example3': 'Voorbeeld 3: Initiële waarde',
  'resourceAsync.example3Desc': 'Geef een initiële waarde om weer te geven voordat de eerste ophaling voltooid is:',
  'resourceAsync.example3Callout':
    'Handig bij het navigeren van een lijst tot detail pagina waar u al enkele gegevens direct weer te geven.',
  'resourceAsync.example4': 'Voorbeeld 4: Fout bij het omgaan met Fallback en Foutvoortplanting',
  'resourceAsync.example4Desc':
    'Regel fouten met <code>onError</code> callback om terugvalwaarden te geven, of gebruik <code>throwOnError: true</code> om fouten te verspreiden:',
  'resourceAsync.triggerFallback': 'Trigger Request (zal terugvallen)',
  'resourceAsync.showingFallback': 'Terugval gebruiker na fout weergeven',
  'resourceAsync.errorPropagation': 'Voortplanting fout',
  'resourceAsync.example5': 'Voorbeeld 5: mutaties met execute() - Gebruikersregistratieformulier',
  'resourceAsync.example5Desc':
    'Voor mutaties (POST/PUT/DELETE), gebruik de <code>execute()</code> methode in plaats van <code>reload()</code>. <code>execute()</code> retourneert een awaitbare <code>Promise&lt;T&gt;</code> die opgelost wordt naar de exacte waarde geschreven in <code>resource.value()</code>, oude waarden en fouten opschortt bij heruitvoering, en is veilig voor fire-and-forget oproepen zonder onbehandelde herwijzigingen.',
  'resourceAsync.regUsername': 'Gebruikersnaam',
  'resourceAsync.regEmail': 'E-mail',
  'resourceAsync.regPassword': 'Wachtwoord',
  'resourceAsync.regSubmit': 'Register',
  'resourceAsync.example6': 'Voorbeeld 6: Gedrag (schakelaar, uitlaat)',
  'resourceAsync.example6Desc': 'Controleer hoe meerdere gelijktijdige verzoeken worden behandeld:',
  'resourceAsync.example7': 'Voorbeeld 7: Status volgen',
  'resourceAsync.example7Desc':
    'Toegang tot korrelige statusinformatie met het <code>status()</code>-signaal. Gebruik <code>computed()</code> voor afgeleide status:',
  'resourceAsync.example8': 'Voorbeeld 8: Declarative Definition & AbortSignal Propagation',
  'resourceAsync.example8Desc':
    '<code>resourceAsync</code> ondersteunt declaratieve definities via <code>ResourceAsyncDefinition&lt;P, T&gt;</code> met <code>params</code> en <code>loader</code>, propagateert <code>context.abortSignal</code> voor cancelatiegeneratie volging en deferred promise opslag.',
  'resourceAsync.declarativeTitle': 'Live Showcase: Declarative Definition & Annulering',
  'resourceAsync.quickSwitchDemo': 'Snelle schakelaar (Trigger afbreken)',
  'resourceAsync.activeSearchLogs': 'Real-time AbortSignal & Request Lifecycle Log',
  'resourceAsync.optimisticTitle': 'Voorbeeld 1: Optimistische updates - Todo-toggle',
  'resourceAsync.optimisticDesc':
    'Update de UI onmiddellijk voor de bevestiging van de server. Als het verzoek van de server mislukt, kunt u de wijziging terugzetten. Dit geeft direct feedback aan gebruikers.',
  'resourceAsync.cacheFirstTitle': 'Voorbeeld 2: Cache-eerste laden',
  'resourceAsync.cacheFirstDesc':
    'Gecachede gegevens onmiddellijk tonen tijdens het ophalen van nieuwe gegevens op de achtergrond. Dit elimineert het laden van spinners voor gebruikers met gecachede inhoud.',
  'resourceAsync.formDraftTitle': 'Voorbeeld 3: Form Draft - Counter met Save/Discard',
  'resourceAsync.formDraftDesc':
    'Laat gebruikers toe om gegevens lokaal te bewerken voordat ze op te slaan op de server. Ze kunnen wijzigingen opslaan of ze weggooien door het herladen van de server.',
  'resourceAsync.nestedTitle': 'Uitvoering & demo',
  'resourceAsync.nestedProjects': 'Projecten',
  'resourceAsync.nestedLoadingItems': 'Items laden...',
  'resourceAsync.nestedRefreshing': 'Vernieuwen...',
  'resourceAsync.nestedThName': 'Naam',
  'resourceAsync.nestedThStatus': 'Status',
  'resourceAsync.nestedThOrg': 'Organisatie',
  'resourceAsync.nestedThActions': 'Acties',
  'resourceAsync.nestedLoadOrg': 'Org laden',
  'resourceAsync.nestedRetry': 'Opnieuw proberen',
  'resourceAsync.nestedRefreshItems': 'Items verversen',
  'resourceAsync.nestedLoadAllOrgs': 'Alle orgs laden',
  'queryResource.title': 'queryResource',
  'queryResource.overview':
    '<code>queryResource</code> biedt declaratieve, gecacheerde en dedupliceerde server-statusbeheersing in Angular Signals. In combinatie met <code>mutateResource</code> en <code>QueryClient</code>, coördineert het achtergrondpolling, stale-while-revalidate caching, aanvraagcoalescering en tag gebaseerde invalidatie.',
  'queryResource.comparisonTitle': 'Wanneer te gebruiken: queryResource vs. resourceAsync',
  'queryResource.comparisonIntro':
    'Beide primitieven gebruiken Angular Signals voor reactieve UI bindingen, maar ze richten zich op verschillende lagen van uw toepassingsarchitectuur:',
  'queryResource.cardResourceAsyncTitle': 'resourceAsync (Component-Local Async-staat)',
  'queryResource.cardQueryResourceTitle': 'queryResource (Gedeelde Server & Entity Cache)',
  'queryResource.scope': 'Toepassingsgebied',
  'queryResource.cache': 'Cache',
  'queryResource.mutations': 'Veranderingen',
  'queryResource.freshness': 'Versheid',
  'queryResource.polling': 'Bestudering',
  'queryResource.invalidation': 'Ongeldigheid',
  'queryResource.bestFor': 'Beste voor',
  'queryResource.resourceAsyncScopeDesc': 'Strikt gebonden aan de levenscyclus van de enkele component instantie.',
  'queryResource.resourceAsyncCacheDesc':
    'Geen globale cache. Het vernietigen van de component vernietigt de gegevens.',
  'queryResource.resourceAsyncMutationsDesc': 'Ingebouwde execute() voor directe eenmalige triggers.',
  'queryResource.resourceAsyncBestForDesc':
    'Formulier indienen staten, lokale typeahead zoekfilters, modal-isolated data fetches, bestand export.',
  'queryResource.queryResourceScopeDesc': 'Wereldwijd beheerd over routes en componenten door QueryClient.',
  'queryResource.queryResourceCacheDesc': 'Identieke query toetsen delen in-flight HTTP verzoeken en geheugen cache.',
  'queryResource.queryResourceFreshnessDesc': 'Configureerbare staleTime en gcTime (Stale-While-Revalidate).',
  'queryResource.queryResourcePollingDesc':
    'Gecoördineerde pollInterval die de zichtbaarheid van het tabblad automatisch respecteert.',
  'queryResource.queryResourceInvalidationDesc':
    'Automatisch opnieuw weergeven via tag ongeldigverklaring van mutateResource.',
  'queryResource.queryResourceBestForDesc':
    'Server entiteiten (gebruikers, dashboards, projecten, cluster state) gedeeld over meerdere views.',
  'queryResource.thFeature': 'Functie',
  'queryResource.rowPrimaryLayer': 'Primaire laag',
  'queryResource.rowPrimaryLayerResource': 'Lokale async-toestand op componentniveau',
  'queryResource.rowPrimaryLayerQuery': 'Client-brede gedeelde server status',
  'queryResource.rowSharedMemory': 'Gedeelde geheugencache',
  'queryResource.badgeNoneComponent': 'Geen (componentgebonden)',
  'queryResource.badgeGlobalKey': 'Global by QueryKey',
  'queryResource.rowDeduplication': 'Gelijktijdig verzoek tot deduplicatie',
  'queryResource.badgePerInstance': 'Per instantie (switch/exhaust)',
  'queryResource.badgeClientCoalesced': 'Opdrachtgever-brede Coalesced',
  'queryResource.rowStaleWhileRevalidate': 'Stam-while-revalideren',
  'queryResource.badgeManualPreserve': 'Handmatig (preserveValueOnError)',
  'queryResource.badgeAutoStale': 'Automatisch via staleTime',
  'queryResource.rowBackgroundPolling': 'Achtergrondbespreking',
  'queryResource.badgeNoneBuiltIn': 'Geen ingebouwde (of externe peiling)',
  'queryResource.badgeCoordinatedVisibility': 'Gecoördineerd + Zichtbaarheid bewust',
  'queryResource.rowTagInvalidation': 'Tag-gebaseerde ongeldigheid',
  'queryResource.badgeManualReload': 'Handmatig herladen trigger',
  'queryResource.badgeAutoMutate': 'Automatisch via mutateResource',
  'queryResource.lifecycleTitle': 'Levenscyclusstatussen en signaalmatrix',
  'queryResource.lifecycleIntro':
    'Query’s verwerken zowel initiële laadacties als achtergrondrevalidaties. Gebruik deze matrix om te bepalen wanneer een paginabrede spinner gewenst is of wanneer een subtiele vernieuwingsindicator volstaat zonder de gebruikersinterface te blokkeren. De matrix gaat uit van een gedefinieerde geslaagde waarde. hasValue() geeft false voor een undefined-resultaat.',
  'queryResource.matrixState': 'Levenscyclusstatus',
  'queryResource.matrixStatus': 'status()',
  'queryResource.matrixWhenToUse': 'Wanneer gebruiken & UI-gedrag',
  'queryResource.matrixInitialLoad': 'Eerste keer laden (geen eerdere gegevens)',
  'queryResource.matrixInitialLoadUsage':
    'Toon een centrale spinner of skeleton. De interface heeft nog geen gegevens om te tonen.',
  'queryResource.matrixResolved': 'Opgelost / Inactief (verse gegevens)',
  'queryResource.matrixResolvedUsage': 'Toon inhoud normaal. Er is geen netwerkverzoek actief.',
  'queryResource.matrixRefreshingState': 'Achtergrondrevalidatie (SWR / Invalidatie)',
  'queryResource.matrixRefreshingUsage':
    'Toon GEEN paginabrede spinner! Behoud de bestaande gegevens en toon een subtiele badge of kleine spinner. Voorkomt knipperen en witte schermen.',
  'queryResource.matrixInitialError': 'Initiële fout (geen eerdere gegevens)',
  'queryResource.matrixInitialErrorUsage':
    'Toon een volledig foutscherm of waarschuwingsbericht met een knop voor opnieuw proberen.',
  'queryResource.matrixRefreshError': 'Vernieuwingsfout (met behoud van cache)',
  'queryResource.matrixRefreshErrorUsage':
    'Behoud de gegevens op het scherm en toon een zwevende waarschuwingsbanner of toast.',
  'queryResource.placementTitle': 'Architectuur: Component- vs. Service-plaatsing',
  'queryResource.loading': 'Laden…',
  'queryResource.placementIntro':
    'Waar horen queries thuis? Omdat <code>queryResource</code> steunt op Angular dependency injection, werkt het uitstekend in zowel componenten als services. Kies de juiste plaatsing op basis van reikwijdte en deelbehoeften:',
  'queryResource.thPlacement': 'Plaatsing',
  'queryResource.thScopeLifetime': 'Bereik & Levensduur',
  'queryResource.thStateSharing': 'Status Delen',
  'queryResource.thCoordination': 'Herlaadcoördinatie',
  'queryResource.thRecommendation': 'Aanbevolen Voor',
  'queryResource.rowComponentPlacement': 'Component-plaatsing',
  'queryResource.rowComponentScope': 'Gebonden aan component-injector; opgeruimd bij unmount',
  'queryResource.rowComponentSharing': 'Geïsoleerd binnen één componentinstantie',
  'queryResource.rowComponentCoord': 'Lokale triggers (query.reload())',
  'queryResource.rowComponentRec': 'Geïsoleerde weergaven, modals, formulieren, detailtabbladen',
  'queryResource.rowServicePlacement': 'Service-plaatsing',
  'queryResource.rowServiceScope': 'Gebonden aan service-injector; blijft behouden tussen routewisselingen',
  'queryResource.rowServiceSharing': 'Synchroon gedeeld over meerdere componenten en routes',
  'queryResource.rowServiceCoord': 'Globale coördinatie via servicemethoden en tag-invalidatie',
  'queryResource.rowServiceRec': 'Authenticatiesessie, actieve database-/tenantselectie, master-detail',
  'queryResource.tabServicePatternA': 'Patroon A: Globale Authenticatiesessie (Root Service)',
  'queryResource.tabServicePatternADesc':
    'Een singleton service beheert currentUser en updateProfile. Meerdere componenten lezen hetzelfde Signal zonder RxJS Subjects of event-bussen.',
  'queryResource.tabServicePatternB': 'Patroon B: Geparametriseerde Master-Detail (Feature Service)',
  'queryResource.tabServicePatternBDesc':
    'Een feature service beheert activeDatabaseId. Wanneer de hoofdlijst de selectie wijzigt, laadt queryResource automatisch de bijpassende detailspecificaties.',
  'queryResource.tabComponentPlacement': 'Patroon C: Component-plaatsing (Geïsoleerde Weergave)',
  'queryResource.tabComponentPlacementDesc':
    'Directe plaatsing in de component is de zuiverste aanpak als gegevens alleen voor één weergave bestemd zijn, zonder overbodige servicebestanden.',
  'queryResource.simulatedTopbar': 'Globale Bovenbalknavigatie',
  'queryResource.simulatedProfile': 'Gebruikersprofielkaart',
  'queryResource.simulatedMasterList': 'Hoofdlijst (Selecteer Database)',
  'queryResource.simulatedDetailCard': 'Detailweergave (Actieve Specificaties)',
  'queryResource.updateNameBtn': 'Naam bijwerken',
  'queryResource.componentPlacementAdvice':
    'Component-plaatsing wordt aangeraden wanneer gegevens strikt tot één weergave beperkt blijven. Het vereist geen extra bestanden en ruimt direct op bij unmount.',
  'queryResource.demo1Section': 'Coalescing en deduplicatie aanvragen',
  'queryResource.demo1SectionDesc':
    'Wanneer twee of meer componenten tegelijkertijd mounten en dezelfde query key aanvragen, deelt <code>QueryClient</code> het enkele netwerkverzoek tijdens de vlucht. Beide componenten ontvangen exact dezelfde respons met nul redundant verkeer.',
  'queryResource.demo1PlaygroundTitle': 'Onafhankelijke componenten delen actieve netwerkverzoeken',
  'queryResource.demo1PlaygroundDesc':
    'Simuleert twee onafhankelijke componenten (TopbarStatusComponent en DashboardMetricsComponent) die tegelijkertijd worden geladen en dezelfde clustermetrieken opvragen. Klik op "Zoekopdracht herladen" om te verifiëren dat er slechts 1 daadwerkelijke HTTP-aanroep wordt uitgevoerd.',
  'queryResource.badgeDeduplication': 'Deduplicatie',
  'queryResource.actualHttpCalls': 'Werkelijke HTTP-oproepen: {0}',
  'queryResource.reloadQuery': 'Zoekopdracht herladen',
  'queryResource.widgetATitle': 'Globale navigatiebalk',
  'queryResource.widgetASubtitle': 'TopbarStatusComponent (Actieve gebruikers en status)',
  'queryResource.widgetBTitle': 'Hoofddashboardkaart',
  'queryResource.widgetBSubtitle': 'DashboardMetricsComponent (CPU-belasting en geheugen)',
  'queryResource.activeUsers': 'Actieve gebruikers',
  'queryResource.cpuLoad': 'CPU laden',
  'queryResource.memoryUsage': 'Geheugengebruik',
  'queryResource.status': 'Status',
  'queryResource.updated': 'Bijgewerkt',
  'queryResource.demo2Section': 'Stale-While-Revalidate en versheidsbeleid',
  'queryResource.demo2SectionDesc':
    "<code>staleTime</code> beheert hoe lang gecachede data nog fris is. Als een observer data vraagt terwijl het fris is, wordt het direct uit de geheugen opgehaald. Als het verder is, wordt de gecachede data onmiddellijk weergegeven terwijl een achtergrondherlaad actief wordt uitgevoerd zonder de UI te veranderen (aangeduid door <code>status: 'reloading'</code>).",
  'queryResource.focusRefetchNoteTitle': 'Opnieuw ophalen bij tabbladfocus',
  'queryResource.focusRefetchNoteBody':
    'Standaard is refetchOnFocus uitgeschakeld in ngx-lift om enterprise-backends te beschermen tegen piekbelastingen. Geef { refetchOnFocus: true } mee in de query-opties om automatisch te vernieuwen bij terugkeer naar het tabblad.',
  'queryResource.configuredStaleTime': 'Geconfigureerde staleTime: {0} seconden',
  'queryResource.freshnessBadgeFresh': 'FRESH',
  'queryResource.freshnessBadgeStale': 'STALE',
  'queryResource.networkCalls': 'Netwerkgesprekken: {0}',
  'queryResource.triggerReadReload': 'Lezen/herladen van trigger',
  'queryResource.revalidatingAlert': 'Achtergrond hervalideren in uitvoering... bestaande UI blijft interactief!',
  'queryResource.clusterNodes': 'Clusterknooppunten',
  'queryResource.healthyNodes': '{0} / {1} Gezond',
  'queryResource.region': 'Gebieden',
  'queryResource.snapshotTime': 'Snapshot-tijd',
  'queryResource.demo3Section': 'Gecoördineerde polling met zichtbaar bewustzijn',
  'queryResource.demo3SectionDesc':
    'Stel <code>pollInterval</code> in om actieve queries periodiek te herladen. Meelieve observers met verschillende intervallen worden gecoördineerd op het snelste interval. Polling pauzeert automatisch wanneer de browser tab verborgen is en herstart zich direct bij het retourneren.',
  'queryResource.demo3PlaygroundTitle': 'Achtergrondbespreking',
  'queryResource.demo3PlaygroundDesc':
    'Schakel peilingen in en kijk naar de hartslagslag. Merk op dat het pauzeert als je wisselt van tabs!',
  'queryResource.badgePolling': 'Bestudering',
  'queryResource.startPolling': 'Begin Polling (3s)',
  'queryResource.stopPolling': 'Stoppen met polling',
  'queryResource.totalPollCycles': 'Totale Pollcycli: {0}',
  'queryResource.ping': 'Ping',
  'queryResource.lastPulse': 'Laatste pulse',
  'queryResource.pollingIdleMsg':
    'Polling is momenteel inactief. Klik op "Start Polling" om live gecoördineerde achtergrondchecks te observeren.',
  'queryResource.demo4Section': 'Mutaties & tag-ongeldigheid (mutateResource)',
  'queryResource.demo4SectionDesc':
    '<code>mutateResource</code> behandelt asynchrone schrijfsels. Bij succesvolle mutatie ongeldig maakt bijpassende tags, waardoor alle actieve queries met deze tags automatisch de nieuwste servergegevens op de achtergrond opnieuw opvragen.',
  'queryResource.demo4PlaygroundTitle': 'Tag-based ongeldigheid',
  'queryResource.demo4PlaygroundDesc':
    'Voeg een nieuw lid toe. Na voltooiing van de mutatie refeteert usersQuery automatisch op de achtergrond!',
  'queryResource.badgeMutations': 'Veranderingen',
  'queryResource.addTeamMember': 'Teamlid toevoegen',
  'queryResource.nameLabel': 'Naam',
  'queryResource.namePlaceholder': 'bv. Charlie Brown',
  'queryResource.roleLabel': 'Rol',
  'queryResource.rolePlatformEngineer': 'Platform Ingenieur',
  'queryResource.roleSre': 'Site Betrouwbaarheid Ingenieur',
  'queryResource.roleProductDesigner': 'Productontwerper',
  'queryResource.addMemberBtn': 'Lid toevoegen',
  'queryResource.savingBtn': 'Opslaan...',
  'queryResource.activeMembersTitle': 'Actieve teamleden',
  'queryResource.thId': 'ID',
  'queryResource.thName': 'Naam',
  'queryResource.thRole': 'Rol',
  'queryResource.diagnosticsSection': 'Ontwikkelaar Diagnostics & Cache Inspector',
  'queryResource.diagnosticsSectionDesc':
    'Registreer provideQueryDevtools() eenmaal in app.config.ts voor een zwevende knop die alleen tijdens ontwikkeling verschijnt. Inspecteer queries onderaan terwijl u de toepassing gebruikt.',
  'queryResource.diagnosticsPlaygroundTitle': 'Query-inspectiepaneel',
  'queryResource.diagnosticsPlaygroundDesc':
    'Zoek, filter en sorteer queries en bekijk cachegegevens, fouten en tijden. Opnieuw ophalen voert de geselecteerde loader uit. Dit documentatievoorbeeld is ook actief in productie.',
  'queryResource.badgeDiagnostics': 'Diagnostica',
  'queryResource.refreshDiagnostics': 'Diagnostics vernieuwen',
  'queryResource.diagTotalEntries': 'Totale vermeldingen',
  'queryResource.diagActiveQueries': 'Actieve zoekopdrachten',
  'queryResource.diagInactiveQueries': 'Inactief (GC in afwachting)',
  'queryResource.diagPendingRequests': 'Openstaande leesacties',
  'queryResource.diagTotalObservers': 'Totaal waarnemers',
  'queryResource.diagVisibility': 'Zichtbaarheid',
  'queryResource.diagVisible': 'Actief',
  'queryResource.diagHidden': 'Verborgen/inactief',
  'queryResource.thQueryKey': 'Sleutel opvragen',
  'queryResource.thObservers': 'Waarnemers',
  'queryResource.thRemainingGc': 'Aftellen van GC',
  'queryResource.thRemainingPoll': 'Volgende Poll-in',
  'queryResource.noQueriesCached': 'Geen query-items in cache.',
  'queryResource.apiReference': 'API-referentie',
  'mutateResource.title': 'mutateResource',
  'mutateResource.overview':
    '<code>mutateResource</code> coördineert asynchrone serverschrijvingen (POST, PUT, PATCH, DELETE) met automatische tag gebaseerde cache invalidatie, ingebouwde concurrency strategieën (exhaust, concat, parallel) en reactieve Angular Signals.',
  'mutateResource.featuresTitle': 'Belangrijkste mogelijkheden',
  'mutateResource.featuresIntro':
    'In tegenstelling tot alleen-lezen queries die reactiveren van parameterveranderingen, mutaties worden strikt uitgevoerd op expliciete gebruikersinteractie.',
  'mutateResource.cardTagInvalidationTitle': 'Automatische tag ongeldigheid',
  'mutateResource.cardTagInvalidationDesc':
    'Tags op schrijfsucces ongeldig maken om alle actieve queryResource-waarnemers automatisch te verversen in de toepassing zonder handmatige herlaad sanitair.',
  'mutateResource.cardConcurrencyTitle': 'Configureerbare valuta',
  'mutateResource.cardConcurrencyDesc':
    'Beheer gelijktijdige verzendingen met "exhaust" (negeert dubbele klikken of koppelt ze aan de lopende uitvoering), "concat" (FIFO-wachtrij) of "parallel" (standaard).',
  'mutateResource.cardSignalsTitle': 'Reactieve toestand Signals',
  'mutateResource.cardSignalsDesc':
    'Biedt een reactieve waarde, fout, status ("idle" | "loading" | "resolved" | "error"), en isLoading-signalen die zijn geoptimaliseerd voor OnPush-veranderingsdetectie.',
  'mutateResource.cardPromiseTitle': 'Directe Promise geeft terug',
  'mutateResource.cardPromiseDesc':
    'De mutate() call geeft een standaard Promise terug, waardoor async/wacht en probeer/catch syntax in component event handlers.',
  'mutateResource.demo1Section': '1. Tag ongeldigheid met actieve zoekopdrachten',
  'mutateResource.demo1SectionDesc':
    'Het indienen van een mutatie ongeldig maakt bijpassende tags, onmiddellijk triggeren achtergrond verfrissingen voor alle actieve queryResource instanties observeren van die tags.',
  'mutateResource.demo1PlaygroundTitle': 'Item & Observeren bijwerken',
  'mutateResource.demo1PlaygroundDesc':
    'Stuur het formulier om een gebruiker toe te voegen. Merk op hoe de gebruikerstabel automatisch wordt bijgewerkt door middel van tagvalidatie zonder handmatige herlaadgesprekken!',
  'mutateResource.badgeInvalidation': 'Tag ongeldigheid',
  'mutateResource.addTeamMember': 'Teamlid toevoegen',
  'mutateResource.nameLabel': 'Naam',
  'mutateResource.namePlaceholder': 'bv. Dana Scully',
  'mutateResource.roleLabel': 'Rol',
  'mutateResource.rolePlatformEngineer': 'Platform Ingenieur',
  'mutateResource.roleSre': 'Site Betrouwbaarheid Ingenieur',
  'mutateResource.roleProductDesigner': 'Productontwerper',
  'mutateResource.addMemberBtn': 'Lid toevoegen',
  'mutateResource.savingBtn': 'Opslaan...',
  'mutateResource.activeMembersTitle': 'Actieve teamleden',
  'mutateResource.thId': 'ID',
  'mutateResource.thName': 'Naam',
  'mutateResource.thRole': 'Rol',
  'mutateResource.demo2Section': '3. Concurrency Modi: uitlaat, concat, en parallel',
  'mutateResource.demo2SectionDesc':
    'Test hoe verschillende concurrentiestrategieën snelle knopdrukken verwerken. "exhaust" voorkomt ongeplande dubbele indiening door dubbele klikken te negeren of toe te voegen terwijl een mutatie al draait.',
  'mutateResource.demo2PlaygroundTitle': 'Snel klikken op & concurrency simulatie',
  'mutateResource.demo2PlaygroundDesc':
    'Kies een modus, klik vervolgens snel op "Trigger 800ms Mutation" meerdere keren om te zien hoe uitvoeringen worden behandeld.',
  'mutateResource.badgeConcurrency': 'Munteenheid',
  'mutateResource.modeLabel': 'Concurrencystrategie',
  'mutateResource.modeExhaust': 'uitlaat (Voeg snelle dubbele klikken - dubbele indiening beveiliging)',
  'mutateResource.modeConcat': 'concat (Queue invocations in sequentie)',
  'mutateResource.modeParallel': 'parallel (Elke aanroeping zelfstandig uitvoeren)',
  'mutateResource.triggerMutationBtn': 'Trigger 800ms mutatie',
  'mutateResource.totalClicks': 'Totaal aantal muisklikken: {0}',
  'mutateResource.actualExecutions': 'Werkelijke uitvoeringen: {0}',
  'mutateResource.inFlight': 'Momenteel In-Flight: {0}',
  'mutateResource.recentLogs': 'Uitvoeringslogboek',
  'mutateResource.clearLogs': 'Logboek wissen',
  'mutateResource.noLogsYet': 'Nog geen mutaties uitgevoerd. Klik op de knop hierboven om te beginnen.',
  'mutateResource.demo3Section': '2. Reactieve status Signals & Foutherstel',
  'mutateResource.demo3SectionDesc':
    '<code>mutateResource</code> houdt fouten apart. Als een schrijfbewerking mislukt, bevat het foutsignaal de fout, wordt status "error" en wordt de geretourneerde Promise afgewezen voor afhandeling met try/catch.',
  'mutateResource.demo3PlaygroundTitle': 'Status Signals & Failure Herstel',
  'mutateResource.demo3PlaygroundDesc':
    'Schakel de storingssimulatie in en activeer de actie om de reactieve fouttoestand te inspecteren.',
  'mutateResource.badgeError': 'Fout bij het afhandelen',
  'mutateResource.simulateErrorLabel': '500-serverfout simuleren',
  'mutateResource.saveSettingsBtn': 'Configuratie opslaan',
  'mutateResource.statusLabel': 'Status',
  'mutateResource.isLoadingLabel': 'isLoading',
  'mutateResource.errorSuccessMsg': 'Configuratie succesvol opgeslagen!',
  'mutateResource.apiReference': 'API-referentie',
  'injectParams.example1Title': 'Voorbeeld 1: Alle routeparameters ophalen',
  'injectParams.example1Desc':
    'Wanneer aangeroepen wordt zonder argumenten, geeft een signaal terug dat het gehele params-object bevat:',
  'injectParams.example2Title': 'Voorbeeld 2: Een enkele parameter ophalen',
  'injectParams.example2Desc':
    'Wanneer een sleutel is gespecificeerd, geeft de waarde van de corresponderende parameter als signaal terug:',
  'injectParams.example3Title': 'Voorbeeld 3: Transformeer parameters',
  'injectParams.example3Desc': 'Transformeer parameters met behulp van een transformfunctie:',
  'injectParams.example4Title': 'Voorbeeld 4: Transformeer met de initiële waarde',
  'injectParams.example4Desc': 'Transformeer parameters met een initiële waarde en typeconversie:',
  'injectParams.example4Callout':
    'Wanneer <code>initialValue</code> als booleaans of als getal wordt verstrekt, moet de <code>transform</code>-functie worden verstrekt die hetzelfde type retourneert.',
  'injectParams.example5Title': 'Voorbeeld 5: Volledig gebruik Voorbeeld',
  'injectParams.example5Desc': 'Compleet voorbeeld met verschillende gebruikspatronen:',
  'injectParams.example6Title': 'Voorbeeld 6: Aangepaste injector',
  'injectParams.example6Desc':
    'Geef een aangepaste <code>Injector</code> door via de opties object om routeparameters te benaderen buiten een omgevingsinjectiecontext (zoals binnen composible helper functies of dynamische diensten):',
  'injectParams.title': 'injectParams',
  'injectParams.overview':
    'De <code>injectParams</code> functie biedt een reactieve signal voor routeparameters, die automatisch bij het navigeren bijwerkt.',
  'injectParams.apiSummary': 'Injecteert en transformeert routeparameters als reactieve signalen.',
  'injectParams.paramKeyOrTransform':
    'Wanneer een string wordt gegeven, geeft de waarde van die route parameter terug. Wanneer een functie wordt gegeven, verwerkt het alle routeparameters. Indien weggelaten, geeft het alle params terug.',
  'injectParams.paramOptions': 'Configuratieobject met transformatiefunctie, initialValue en/of injector.',
  'injectParams.returnsDesc': 'Een signaal met de routeparameter value(s) of getransformeerd resultaat.',
  'injectParams.usagePatterns': 'Patronen gebruiken',
  'injectParams.pattern1': 'Geen argumenten: Geeft signaal terug met alle routeparameters',
  'injectParams.pattern2':
    'Tekenreeks: Geeft signaal terug met specifieke parameterwaarde (of nul indien niet aanwezig)',
  'injectParams.pattern3': 'Transformeerfunctie: Geeft signaal terug met getransformeerde parameters',
  'injectParams.pattern4': 'Met opties: Geeft initiële waarde en type conversie',
  'injectQueryParams.title': 'injectQueryParams',
  'injectQueryParams.overview':
    'De <code>injectQueryParams</code> functie biedt een reactieve signal voor URL queryparameters.',
  'injectQueryParams.apiSummary': 'Injecteert en transformeert route queryparameters als reactieve signalen.',
  'injectQueryParams.paramKeyOrTransform':
    'Wanneer een string wordt gegeven, geeft de waarde van die query parameter terug. Wanneer een functie wordt gegeven, verwerkt het alle query parameters. Indien weggelaten, geeft het alle query params terug.',
  'injectQueryParams.paramOptions': 'Configuratieobject met transformatiefunctie, initialValue en/of injector.',
  'injectQueryParams.returnsDesc': 'Een signaal met de query parameter value(s) of getransformeerd resultaat.',
  'injectQueryParams.example1Title': 'Voorbeeld 1: Alle zoekparameters opvragen',
  'injectQueryParams.example1Desc': 'Alle queryparameters ophalen als een signaal:',
  'injectQueryParams.example2Title': 'Voorbeeld 2: Get Single Query Parameter',
  'injectQueryParams.example2Desc': 'Krijg een specifieke query parameter op naam:',
  'injectQueryParams.example3Title': 'Voorbeeld 3: Transformeer queryparameters',
  'injectQueryParams.example3Desc': 'Transformeer query parameters met behulp van een transform functie:',
  'injectQueryParams.example4Title': 'Voorbeeld 4: Transformeer met de initiële waarde',
  'injectQueryParams.example4Desc': 'Transformeer queryparameters met een initiële waarde en typeconversie:',
  'injectQueryParams.example5Title': 'Voorbeeld 5: Volledig gebruik Voorbeeld',
  'injectQueryParams.example5Desc': 'Compleet voorbeeld met verschillende gebruikspatronen:',
  'injectQueryParams.example6Title': 'Voorbeeld 6: Aangepaste injector',
  'injectQueryParams.example6Desc':
    'Pas een aangepaste <code>Injector</code> door via de opties object om route query parameters toegang buiten een omgevingsinjectie context (zoals binnen composible helper functies of dynamische diensten):',
  'createTrigger.title': 'createTrigger',
  'createTrigger.overview':
    'De <code>createTrigger</code> functie biedt een manier om manueel signalerecomputatie te initiëren door verwijzing naar het gemaakte trigger-signal. Gelijk als een RxJS Subject, het aanroepen van <code>next()</code> verhoogt het tellersignal en meldt afhankelijke effecten of berekende signalen.',
  'createTrigger.apiSummary':
    'Creëert een trigger-signal dat kan worden gebruikt om manueel signalerecomputatie te initiëren.',
  'createTrigger.propValue': 'Een signaal dat het aantal keer dat de trigger is aangeroepen teruggeeft (start bij 0).',
  'createTrigger.propNext': 'Een methode om de signaalupdate te activeren.',
  'createTrigger.returnsDesc': 'Een object dat waarde signaal en next() trigger methode blootlegt.',
  'createTrigger.example1': 'Voorbeeld 1: Basisgebruik',
  'createTrigger.example1Desc': 'Maak een trigger en gebruik het om handmatig signaalherberekeningen te activeren:',
  'createTrigger.example2': 'Voorbeeld 2: Voorwaardelijk effect',
  'createTrigger.example2Desc':
    'Gebruik de trigger waarde voorwaardelijk om te voorkomen dat uitvoeren op initialisatie:',
  'createTrigger.btnSeeConsole': 'Zie Console-log',
  'createTrigger.callout':
    "Aanvankelijk geeft <code>createTrigger's value()</code> 0 terug. Wanneer <code>next</code> expliciet wordt genoemd, voegt de waarde 1 toe.",
  'pageContainer.title': 'Pagina Container',
  'pageContainer.overview':
    'De <code>cll-page-container</code> component biedt een standaard, responsieve pagina shell over Clarity applicaties. Het omvat uniforme titeltypografie, vloeibare marges en consistent spacing terwijl het een content projectie slot biedt voor willekeurige views, cards, forms en grids.',
  'pageContainer.example1': 'Voorbeeld 1: Basic Page Container',
  'pageContainer.example1Desc':
    'Stel een verplichte titel en project willekeurige weergave elementen in op de hoofdpagina slot.',
  'pageContainer.example1Badge': 'Page Shell',
  'pageContainer.example2': 'Voorbeeld 2: Aangepaste ruimte & maximale breedtes',
  'pageContainer.example2Desc':
    'Pas Clarity lay-out of aangepaste utility classes aan customClass om de lay-outdichtheid te controleren.',
  'pageContainer.example2Badge': 'Responsief',
  'pageContainer.example3': 'Voorbeeld 3: Dynamische HTML Markup in Pagina Titel',
  'pageContainer.example3Desc':
    'De titelinvoer rendert via innerHTML, waardoor badges, status-indicatoren of tags direct in de header.',
  'pageContainer.example3Badge': 'HTML-titel',
  'pageContainer.demoUserManagement': 'Gebruikersbeheer',
  'pageContainer.demoBodyContent': 'Inhoud van de paginatekst weergegeven binnen het standaard slot.',
  'pageContainer.demoClusterSettings': 'Clusterinstellingen',
  'pageContainer.demoConfigured': 'Geconfigureerd met aangepaste styling klassen.',
  'pageContainer.demoAuditLog': "Audit Log <span class='badge badge-info'>live</span>",
  'pageContainer.demoLogStream': 'Log entries stream hier in real-time.',
  'pageContainer.apiSummary': 'Standaard pagina wrapper met responsieve marges en header typografie.',
  'pageContainer.inputTitle': 'De titel bovenaan de container. Gerenderd via [innerHTML].',
  'pageContainer.inputCustomClass':
    'Extra CSS-klassen die rechtstreeks op het containerwortelelement worden toegepast.',
  'pageContainer.contentProjectionDesc':
    'Standaard <ng-content /> sleuf voor het plaatsen van alle inhoud van de hoofdpagina onder de titel.',
  'alert.title': 'Waarschuwing',
  'alert.overview':
    'Alerts zijn bannen die de aandacht van de gebruiker vestigen op belangrijke berichten. Visuele elementen zoals iconen en kleuren wijzen het type en de dringendheid van het informatie dat wordt gedeeld. Gebruik alerts om kritische informatie te versturen die onmiddellijk aandacht vereist binnen het huidige context.',
  'alert.example1': 'Voorbeeld 1: Weergave API Foutrespons',
  'alert.example1Desc':
    'Bij het weergeven van foutmeldingen van APIs, gebruik de foutinvoer om foutgegevens door te geven. De waarschuwing geeft het foutbericht van het responsobject weer of valt terug naar HttpErrorResponse.',
  'alert.example1Badge': 'API-fout',
  'alert.example2': 'Voorbeeld 2: Aangepaste inhoud weergeven',
  'alert.example2Desc':
    'De inhoud wordt weergegeven met behulp van innerHTML, waardoor rijke formatteren en ingebed HTML tags over verschillende waarschuwingsniveaus.',
  'alert.example2Badge': 'Rijke tekst',
  'alert.example3': 'Voorbeeld 3: Content Projectie',
  'alert.example3Desc':
    'Het waarschuwingscomponent ondersteunt contentprojectie via ng-content, waardoor complexe HTML-structuren en kindcomponenten kunnen worden opgenomen.',
  'alert.example3Badge': 'ng-content',
  'alert.example4': 'Voorbeeld 4: Compact Size (isSmall)',
  'alert.example4Desc':
    'Gebruik de isSmall-ingang om een ruimte-efficiënte compacte waarschuwing voor laden en kleine containers weer te geven.',
  'alert.example4Badge': 'Compact',
  'alert.example5': 'Voorbeeld 5: Lichtgewichtwaarschuwingen',
  'alert.example5Desc':
    'Gebruik randloze lichtgewicht waarschuwingen binnen kaarten, tabellen, en geneste status lay-outs.',
  'alert.example5Badge': 'Lichtgewicht',
  'alert.example6': 'Voorbeeld 6: Waarschuwingen op App-niveau',
  'alert.example6Desc': 'Plaats hoge prioriteit app-niveau waarschuwingen aan de top van alle inhoud en navigatie.',
  'alert.example6Badge': 'App-niveau',
  'alert.apiSummary':
    'Een alertcomponent die belangrijke berichten weergeeft met verschillende typen en Clarity themastijlen.',
  'alert.inputAlertType':
    'Een van de waarden: "info", "warning", "success", "danger", "neutral", "loading", "unknown".',
  'alert.inputIsAppLevel':
    'Booleaanse vlag voor app-niveau waarschuwingen weergegeven aan de bovenkant van de viewport.',
  'alert.inputIsSmall': 'Booleaanse vlag voor compacte sizing in strakke containers of laden.',
  'alert.inputIsLightweight': 'Booleaanse vlag voor lichtgewicht styling zonder grenzen.',
  'alert.inputError': 'Een HttpErrorResponse of foutobject om foutgegevens weer te geven.',
  'alert.inputContent':
    'Een tekenreeks met de inhoud van het waarschuwingsbericht. Ondersteunt HTML-tags via innerHTML.',
  'alert.contentProjectionDesc':
    'De component ondersteunt ng-content projectie voor complexe HTML structuren en Angular componenten.',
  'alert.projectionNotice': 'Meerdere fouten worden weergegeven als hieronder door de inhoud projectie:',
  'alert.errUndefined': 'Kan niet ongedefinieerd lezen.',
  'alert.errObject': 'Kan geen object uploaden.',
  'alert.serverDown': 'Server is uitgeschakeld',
  'alert.contentSuccess': 'Ik ben een succesvolle content',
  'alert.contentInfo': 'Ik ben een informatie-inhoud',
  'alert.contentWarning': 'Ik ben een waarschuwing inhoud',
  'alert.contentDanger': 'Ik ben een gevaarlijke inhoud',
  'alert.contentHtml': '<strong>Hello world</strong>, ik hou van clr-lift!',
  'alert.contentSmall': 'Ik ben een klein alarm.',
  'alert.contentNeutral': 'Ik ben een neutrale inhoud.',
  'alert.contentLoading': 'Ik ben een lading inhoud',
  'alert.contentUnknown': 'Ik ben een onbekende inhoud.',
  'alert.contentAppLevel': 'Waarschuwing op het niveau van de app door inhoudinvoer',
  'alert.contentAppProjection': 'Waarschuwing op het niveau van de app van projectie',
  'alert.btnView': 'Beeld',
  'callout.title': 'Oproep',
  'callout.overview':
    'De <code>cll-callout</code> component toont een informatieve calloutbox die is ontworpen om belangrijke aandachtspunten, tips, waarschuwingen of voorwaarden te benoemen met responsief iconenweergave en thema bewustzijn.',
  'callout.example1': 'Voorbeeld 1: Basisinformatie-oproep',
  'callout.example1Desc': 'Projecteer eenvoudige tekstberichten of highlights met standaard contentprojectie.',
  'callout.example2': 'Voorbeeld 2: Lijsten en links',
  'callout.example2Desc':
    'Oproepen behandelen geformatteerde lijsten en externe hyperlinks naadloos in zowel lichte als donkere modus.',
  'callout.example3': 'Voorbeeld 3: Rijke content met kopjes en badges',
  'callout.example3Desc':
    "Stel headers samen, beschrijvende alinea's, en Clarity badges in de oproep projectie container.",
  'callout.example1Note': 'Houd er rekening mee dat alle configuratiewijzigingen onmiddellijk van kracht worden.',
  'callout.example2Theme': "Ondersteunt zowel lichte als donkere thema's automatisch.",
  'callout.example2Docs': 'Bekijk voor meer details de documentatie van het Clarity Design System.',
  'callout.example3Tip': 'Pro Tip voor productie-implementaties',
  'callout.example3DescText':
    'Zorg ervoor dat resource limieten expliciet zijn geconfigureerd voordat u het uitrolproces start.',
  'callout.example3LabelDeployment': 'Inzet',
  'callout.example3LabelValidated': 'Validatie',
  'themeToggle.title': 'Thema aan/uit',
  'themeToggle.overview':
    'De <code>cll-theme-toggle</code> component en <code>ThemeService</code> bieden een soepel thema wisselwerking tussen Clarity licht en donkergewijs met Signal reactiviteit en localStorage opslag.',
  'themeToggle.callout':
    'De schakelknop geeft automatisch een maanpictogram weer in de lichtmodus en een zonnepictogram in de donkere modus, inclusief gelokaliseerde tooltips en toegankelijke aria-label aankondigingen.',
  'themeToggle.example1Badge': 'Interactieve schakelaar',
  'themeToggle.example1Desc':
    "Klik op de knop toggle om thema's te wisselen en observeer de reactieve gebeurtenis emissie:",
  'themeToggle.currentTheme': 'Huidig thema Signal:',
  'themeToggle.inspectorTitle': 'Thema Signal Inspecteur',
  'themeToggle.inspectorDesc': 'Live state gesynchroniseerd met document.body en localStorage',
  'themeToggle.example2Badge': 'Programmatische controle',
  'themeToggle.example2Desc':
    'Gebruik ThemeService om het huidige thema reactief te lezen of programmamatisch een specifiek thema in te stellen:',
  'themeToggle.setLight': 'Lichtthema instellen',
  'themeToggle.setDark': 'Donker thema instellen',
  'themeToggle.example3': 'Voorbeeld 3: CSS / SCSS Selectors voor themastijl',
  'themeToggle.example3Desc':
    'Componenten en globale stijlen kunnen zich richten op [cds-theme="dark"] op het lichaam of via:host-context([cds-theme="dark"]):',
  'themeToggle.serviceSummary':
    'Injecteerbare dienst die in root wordt geleverd voor het beheren van de toepassingsthemastatus.',
  'spinner.title': 'Spinner',
  'spinner.overview':
    'Een spinner is een visueel teken van een aanstekende, gebruikersgeïnitieerde proces. Clarity heeft twee soorten spinners, elk met zijn eigen gebruikssituatie: <strong>Page Spinners</strong> voor het volgen van de voortgang van een operatie gerelateerd aan een geheel pagina, en <strong>Inline Spinners</strong> voor het volgen van de voortgang van een operatie gerelateerd aan een specifiek component.',
  'spinner.example1': 'Voorbeeld 1: Standaard Spinner',
  'spinner.example1Desc': 'De standaard spinner is gecentreerd, groot, en heeft een blokweergave.',
  'spinner.example2': 'Voorbeeld 2: Groottevariaties',
  'spinner.example2Desc':
    'Spinners kunnen worden weergegeven in verschillende maten: groot (standaard), medium, en klein.',
  'spinner.example3': 'Voorbeeld 3: Uitlijningsopties',
  'spinner.example3Desc': 'Controleer de uitlijning van de spinner met behulp van het centrum ingang.',
  'spinner.example4': 'Voorbeeld 4: aangepaste styling',
  'spinner.example4Desc': 'Pas aangepaste CSS klassen toe op de spinner voor extra styling.',
  'spinner.example5': 'Voorbeeld 5: Inline Spinner',
  'spinner.example5Desc':
    'Gebruik de inline input om de spinner weer te geven als een inline-blok element, nuttig voor het uitlijnen van spinners binnen tekst of andere inline elementen.',
  'spinner.large': 'Groot (standaard):',
  'spinner.medium': 'Middel:',
  'spinner.small': 'Klein:',
  'spinner.centered': 'Gecentreerd (standaard):',
  'spinner.leftAligned': 'Links:',
  'spinner.loading': 'Laden...',
  'tooltip.title': 'Tooltip',
  'tooltip.overview':
    'De Tooltip component biedt een flexibel manier om extra informatie, tips of interactieve inhoud weer te geven. Het ondersteunt hover en kopie acties binnen het inhoudspopover, configurerbare vertragsopties, automatische positieering, focus trap voor toegankelijkheid, interactie buiten het venster, toetsenbordoperaties en donkergewijs ondersteuning.',
  'tooltip.example1': 'Voorbeeld 1: Basisgereedschap',
  'tooltip.example1Desc':
    'In dit gebruik kunt u eenvoudig een tooltip toevoegen door de inhoud direct of via de attribuutrichtlijn cllTooltipContent op te geven. Extra configuraties zoals hide delay en breedte kunnen worden aangepast volgens uw eisen.',
  'tooltip.example2': 'Voorbeeld 2: Tooltip met dynamische inhoud',
  'tooltip.example2Desc':
    'Tooltip accepteert dynamische inhoud die via Angular-sjablonen wordt geleverd. U kunt sjablonen met behulp van ng-template opgeven en ze verbinden met de tooltipcomponent voor dynamisch display.',
  'tooltip.example3': 'Voorbeeld 3: Dynamische componenten aanmaken',
  'tooltip.example3Desc':
    'Tooltip kan dynamisch aangemaakte Angular-componenten renderen met behulp van ComponentRef of componenttype.',
  'tooltip.example4': 'Voorbeeld 4: Tooltip-posities',
  'tooltip.example4Desc': 'Ondersteunt 12 verschillende plaatsingsoriëntaties met intelligente botsingsdetectie.',
  'tooltip.apiSummary':
    'Directief voor het toevoegen van tooltipfunctie aan elementen met automatische positie en botsing detectie.',
  'tooltip.basic1': 'Basisgereedschap 1',
  'tooltip.basic2': 'Basic Tooltip 2 met vertraging 500ms',
  'tooltip.empty': 'Lege inhoud zal Tooltip niet tonen',
  'tooltip.templateHover': 'TemplateRef Voorbeeld zweven',
  'tooltip.templateText': 'Een geweldige tooltip:',
  'tooltip.templateCallout': 'U kunt ook een component in ng-template plaatsen',
  'tooltip.contextCallout':
    'cllTooltipContentContext is optioneel, het is de context die wordt doorgegeven aan het ng-template tijdens het aanmaken van het scherm.',
  'tooltip.componentRefHover': 'Voorbeeld van component Ref',
  'toast.title': 'Toast',
  'toast.overview':
    'Toastberichten dienen als gebruikersvriendelijk manier om gemiddelde prioriteit gebeurtenissen te communiceren die gebruikers mogelijk later willen refereren. Deze berichten zijn tijdelijk op het scherm zichtbaar en kunnen worden opgeslagen in een notificatiespaneel tot ze worden afgesloten of verlopen.',
  'toast.example1': 'Voorbeeld 1: Setup Toast Container',
  'toast.example1Desc':
    'Om toastberichten te implementeren, importeert u ToastContainerComponent van clr-lift en neemt u <cll-toast-container [timeoutSeconds]="8" /> in uw root component op.',
  'toast.example2': 'Voorbeeld 2: Toast aanmaken met addToast',
  'toast.example2Desc':
    'Gebruik addToast om een toastobject met vereiste eigenschappen (titel en beschrijving) en optionele configuraties door te geven.',
  'toast.example3': 'Voorbeeld 3: Shorthand APIs',
  'toast.example3Desc': 'Vier steno APIs worden geleverd om toasts te maken met verschillende statustypes:',
  'toast.serviceSummary': 'Service voor het maken en beheren van toastmeldingen.',
  'toast.guidelinesTitle': 'Gebruiksrichtsnoeren',
  'toast.doTitle': 'Do:',
  'toast.do1':
    'Navigatie verstrekken: Voeg een link of locatie toe voor gebruikers om naar toe te navigeren vanaf de toast.',
  'toast.do2':
    'Gebruik relatieve tijdstempels: Toon tijdstempels ten opzichte van de gebruiker (bijvoorbeeld "1 uur geleden" in plaats van een absolute datum).',
  'toast.do3':
    'Houd Titels Kort: Gebruik een korte, beknopte titel (max 35 tekens) die het bericht op hoog niveau snel overbrengt.',
  'toast.do4': 'Craft Consulable Descriptions: Houd beschrijvingen beknopt (max 156 tekens) voor gemakkelijk verbruik.',
  'toast.dontTitle': 'Niet doen:',
  'toast.dont1': 'Gebruik "Sluiten" als een actie: Klik op de sluitknop om de toast te sluiten.',
  'toast.dont2':
    'Overbevolkingsacties: Beperk toastberichten tot maximaal 2 acties; geef prioriteit aan de belangrijkste acties.',
  'toast.dont3':
    'Objectidentificaties opnemen in titel: Vermijd het gebruik van objectidentificaties in de titel; gebruik ze alleen in de beschrijving.',
  'toast.dont4':
    'Pictogrammen toevoegen: Om de duidelijkheid te behouden, mag u geen pictogrammen toevoegen aan de toastberichten.',
  'toast.dont5':
    'Irrelevante toast tonen: Toasten alleen tonen als de informatie nog steeds relevant is voor de gebruiker.',
  'toast.optionsTitle': 'ToastOptions-interface',
  'toast.containerSummary':
    'Container component die alle toast notificaties bevat. Zou slechts één keer in uw toepassing moeten verschijnen.',
  'multiAlerts.title': 'Waarschuwingen (meerdere)',
  'multiAlerts.overview':
    'Vaker is er behoefte om meerdere alerts te tonen, vooral die op de toepassingniveau in de bovenhoek. De clr-lift bibliotheek biedt twee essentiële hulpmiddelen: <code>AlertContainerComponent</code> en <code>AlertService</code> om alerts toe te voegen, te verwijderen en programmatisch te beheren.',
  'multiAlerts.example1': 'Voorbeeld 1: AlertContainer instellen',
  'multiAlerts.example1Desc':
    'Importeer AlertContainerComponent en neem <cll-alert-container /> boven de Clarity header tag in de hoofdcontainer.',
  'multiAlerts.example2': 'Voorbeeld 2: Basisgebruik',
  'multiAlerts.example2Desc':
    'Importeer AlertService en gebruik zijn addAlert(), deleteAlert(), of clearAlerts() methoden voor effectief beheer van waarschuwingen.',
  'multiAlerts.example3': 'Voorbeeld 3: Geavanceerd gebruik met interactieve elementen',
  'multiAlerts.example3Desc':
    'Plaats interactieve elementen (zoals knoppen of links) op elke positie in uw bericht met behulp van inhoud met targetSelector, of geef gestructureerde actieknoppen.',
  'multiAlerts.example4': 'Voorbeeld 4: Interactieve Demo',
  'multiAlerts.example4Desc':
    'Probeer het toevoegen van verschillende soorten waarschuwingen en clearing waarschuwingen met behulp van de onderstaande knoppen:',
  'multiAlerts.serviceSummary': 'Dienst voor het beheren van meerdere waarschuwingen programmatisch.',
  'multiAlerts.alertTypeTitle': 'Waarschuwingstype',
  'multiAlerts.containerSummary':
    'Containercomponent die alle waarschuwingen weergeeft. Moet boven de Clarity header tag in de hoofdcontainer worden geplaatst.',
  'fileReader.title': 'Bestandslezer',
  'fileReader.overview':
    'De <code>FileReaderComponent</code> laat je gemakkelijk doorzoeken en lezen van tekstbestanden. Het ondersteunt bestandselectie, inhoudslezen als platte tekst of base64 geencodeerde string, bestandsgrotes validatie en zendt gebeurtenissen wanneer bestanden worden geselecteerd of verwijderd.',
  'fileReader.example1': 'Voorbeeld 1: Basisbestandslezer',
  'fileReader.example1Desc': 'Basisgebruik met vormcontrole-integratie:',
  'fileReader.example2': 'Voorbeeld 2: Certificaatbestandslezer met validatie',
  'fileReader.example2Desc': 'Bestandslezer met certificaatvalidatie en certificaatbordweergave:',
  'fileReader.apiSummary': 'Component voor doorzoeken en lezen van bestandinhoud met validatiesupport.',
  'fileReader.feature1': 'Bestanden doorbladeren en selecteren',
  'fileReader.feature2': 'Inhoud lezen als platte tekst of basis64 gecodeerde string',
  'fileReader.feature3': 'Validatie van bestandsgrootte',
  'fileReader.feature4': 'Fout bij verwerken van inhoud',
  'fileReader.feature5': 'Integratie van de vormcontrole',
  'keyValueInputs.title': 'Sleutelwaarde-invoer',
  'keyValueInputs.overview':
    'De <code>KeyValueInputsComponent</code> is een Angular component dat is ontworpen om sleutel-waardeparen in te voeren. Het biedt een dynamische vorm die gebruikers toestaat om sleutel-waardeparen toe te voegen, te bewerken en te verwijderen met FormArray integratie, reële tijd validatie en slimme toetsenbord navigatie.',
  'keyValueInputs.example1': 'Voorbeeld 1: Basisgebruik',
  'keyValueInputs.example1Desc':
    'Maak een formulier aan met een FormArray en gebruik KeyValueInputsComponent om sleutelwaardeparen te beheren:',
  'keyValueInputs.example2': 'Voorbeeld 2: Interactieve Demo',
  'keyValueInputs.example2Desc':
    'Probeer het toevoegen, bewerken en verwijderen van sleutelwaardeparen in het onderstaande formulier:',
  'keyValueInputs.callout':
    'Ontdek hoe de KeyValueInputsComponent gebruik maakt van de UniqueValidator om validatie uit te voeren tegen essentiële controles. Klik hier om te leren hoe uniciteit wordt afgedwongen in belangrijke invoervelden.',
  'keyValueInputs.formOutput': 'Uw vormwaarde-uitvoer:',
  'keyValueInputs.keyHelper': 'run time property key',
  'keyValueInputs.valueHelper': 'run time property waarde',
  'keyValueInputs.addText': 'sleutelwaarde toevoegen',
  'keyValueInputs.apiSummary': 'Component voor het beheren van dynamische sleutel-waardepaarden in Angular vormen.',
  'statusIndicator.title': 'Status-indicator',
  'statusIndicator.overview':
    'De <code>StatusIndicatorComponent</code> toont een statusindicator met een icon en tekst. Het ondersteunt verschillende statussoorten (fout, succes, waarschuwing, onbekend, inactief, in het proces), aanpassbare icongroottes en optionele tooltips voor extra context.',
  'statusIndicator.example1': 'Voorbeeld 1: Basisgebruik',
  'statusIndicator.example1Desc': 'Toon statusindicatoren met verschillende statustypes en pictogramgroottes:',
  'statusIndicator.example2': 'Voorbeeld 2: Met Tooltip',
  'statusIndicator.example2Desc': 'Tooltips toevoegen aan status-indicatoren voor aanvullende contextuele informatie:',
  'statusIndicator.types': 'Statustypen',
  'statusIndicator.iconSizeTshirt': 'Pictogramgrootte (T-Shirt Size)',
  'statusIndicator.iconSizeNumber': 'Pictogramgrootte (aantal)',
  'statusIndicator.statusError': 'Fout',
  'statusIndicator.statusSuccess': 'Succes',
  'statusIndicator.statusWarning': 'Waarschuwing',
  'statusIndicator.statusUnknown': 'Onbekend',
  'statusIndicator.statusInactive': 'Inactief',
  'statusIndicator.statusPending': 'In afwachting',
  'statusIndicator.tooltipError': 'beschrijving van de foutreden',
  'statusIndicator.tooltipSuccess': 'status is succes',
  'statusIndicator.tooltipWarning': 'status is waarschuwing',
  'statusIndicator.tooltipUnknown': 'onbekende status',
  'statusIndicator.tooltipInactive': 'inactieve status',
  'statusIndicator.tooltipPending': 'er is nog wat te gebeuren',
  'statusIndicator.apiSummary': 'Component voor het weergeven van statusindicatoren met iconen en tekst.',
  'certificate.title': 'Afbakening van certificaat (Viewer)',
  'certificate.overview':
    'De <code>CertificateSignpostComponent</code>, een Angular component, interpreteert een PEM string, toont het inhoud van het certificaat met een klik op het certificaaticoon. Het is perfect geïntegreerd met Clarity, en toont belangrijke details zoals certificaatstatus, geldigheidsperiode, uitgeverinformatie en hashwaarden.',
  'certificate.example1': 'Voorbeeld 1: Ontleden van Raw PEM',
  'certificate.example1Desc': 'Ontleden en weergeven van een rauwe PEM certificaat string:',
  'certificate.example2': 'Voorbeeld 2: Ontleden van PEM (Base64 gecodeerd)',
  'certificate.example2Desc':
    'Als PEM-strings Base64 gecodeerd zijn, schakel je pemEncoded om te decoderen voordat je ontleedt:',
  'idleDetection.utilOverview':
    'Het detectieproces van inactiefheid is het proces van het monitoren van gebruikersactiviteit en het bepalen wanneer een gebruiker inactief wordt. Dit is vooral nuttig voor toepassingen waarin gebruikers moeten blijven ingelogd, omdat het het systeem toelaat om de juiste actie te ondernemen wanneer een gebruiker niet meer met de toepassing interagerd, zoals een waarschuwing over een onvermijdellijke tijdsverloop of automatisch uitloggen na een periode van inactiefheid.',
  'idleDetection.utilOverviewDesc':
    'De Idle Detection Service biedt configureerbare inactieve en timeout duur, automatische reset op de activiteit van de gebruiker, emissie van gebeurtenissen voor stationaire en timeout fasen, en reactieve programmering ondersteuning via RxJS waarneembare.',
  'idleDetection.utilExample1Title': 'Voorbeeld 1: Configure Idle Detection Globally',
  'idleDetection.utilExample1Desc':
    'Inactieven en timeout-duur wereldwijd configureren met behulp van de configuratieklasse:',
  'idleDetection.utilPhaseCallout':
    'Er zijn twee fasen van stationaire detectie: de <strong>idle-detectiefase</strong> en de <strong>timeout fase</strong>.',
  'idleDetection.utilPhase1':
    '<strong>Fase van inactiefheiddetectie</strong>: Stel je in dat je <code>idleDurationInSeconds</code> instelt op 5 * 60 (5 minuten). Vanaf het moment dat er geen actie is op de website, ga je in deze fase. Na 5 minuten eindigt de inactiefheiddetectie, wat betekent dat je lange tijd inactief bent. Je kunt je abonneren op de <code>onIdleEnd()</code> observable, die dit moment uitstraalt. Zodra deze fase is voltooid, ga je in de tweede fase.',
  'idleDetection.utilPhase2':
    '<strong>Fase van tijdsverloop</strong>: Zodra je deze fase binnentreedt, begint het tijdsverloop direct vanaf de waarde van <code>timeoutDurationInSeconds</code>. Je kunt je abonneren op de <code>onCountDown()</code> observable om de tijdsverloopwaarde te krijgen. Wanneer het tijdsverloop op 0 komt, eindigt de <strong>fase van tijdsverloop</strong>. Je kunt je abonneren op de <code>onTimeoutEnd()</code> observable om te weten wanneer de <strong>fase van tijdsverloop</strong> eindigt. Op dit moment kun je de gebruiker uitloggen of andere acties uitvoeren.',
  'idleDetection.utilExample2Title': 'Voorbeeld 2: Moduleconfiguratie',
  'idleDetection.utilExample2Desc': 'Geef de configuratie in uw NgModule:',
  'idleDetection.utilExample3Title': 'Voorbeeld 3: Standalone-appconfiguratie',
  'idleDetection.utilExample3Desc': 'Geef de configuratie in een standalone applicatie:',
  'idleDetection.utilExample4Title': 'Voorbeeld 4: Gebruik IdleDetectionService in component',
  'idleDetection.utilExample4Desc':
    'Abonneer u op de waarneembaren van de dienst om te reageren op stationaire gebeurtenissen:',
  'idleDetection.utilExample5Title': 'Voorbeeld 5: IdleDetectionComponent gebruiken',
  'idleDetection.utilExample5Desc':
    'We bieden een component in <code>clr-lift</code> die een Clarity modal dialoog toont wanneer de gebruiker inactief is. De dialoog verschijnt wanneer de fase van inactiefheiddetectie eindigt en begint te tellen. Zodra het tijdsverloop eindigt, kun je de <code>timeout</code> handler in je component aansluiten om aangepaste logica uit te voeren, zoals het wissen van de localStorage token en het verplaatsen van de gebruiker naar de loginpagina.',
  'idleDetection.utilExample5ParamDesc':
    'De parameters <code>idleDurationInSeconds</code> en <code>timeoutDurationInSeconds</code> zijn optioneel. Wanneer deze parameters zijn doorgegeven, zullen ze de configuratie die door <code>provideIdleDetectionConfig</code> is doorgegeven overschrijven.',
  'idleDetection.utilDialogPreview': 'Het dialoogvenster ziet er als volgt uit:',
  'idleDetection.title': 'Stationaire detectie',
  'idleDetection.overview':
    'De <code>cll-idle-detection</code> component monitoreert gebruikersinactiefheid over DOM gebeurtenissen (muisbeweging, toetsdruk, scrollen en aanraking). Wanneer de inactieve duur verstrekt, opens het een toegankelijke Clarity tijdsverloop dialoog en stuurt het een (tijdsverloop) gebeurtenis.',
  'idleDetection.example1': 'Voorbeeld 1: Interactive Idle Dialoog Simulatie',
  'idleDetection.example1Desc':
    'Start een snelle 3-seconde simulatie om de Clarity countdown modal in actie te bekijken:',
  'idleDetection.example2': 'Voorbeeld 2: Globale configuratie met provideIdleDetectionConfig',
  'idleDetection.example2Desc':
    'Definieer standaard applicatie-breed inactief en timeout intervallen in appConfig met behulp van provideIdleDetectionConfig.',
  'idleDetection.apiSummary':
    'Clarity modal dialoogcomponent die een sessietijdsverloop tijdsverloop toont bij inactiefheid.',
  'idleDetection.inputIdleDuration':
    'Duur van de inactiviteit in seconden voordat de countdown modal wordt weergegeven. Overschrijft de globale configuratie indien opgegeven.',
  'idleDetection.callout':
    'De modale bevat een "Keep Me Aangemeld In" actie die alle timers resetten bij gebruikersinteractie. Als de gebruiker niet reageert, brandt de (timeout) gebeurtenis om veilige uitlog- of route-omleiding mogelijk te maken.',
  'idleDetection.inputTimeoutDuration':
    'Duur van de aftelfase in seconden voordat de sessie wordt beëindigd. Overschrijft globale configuratie indien opgegeven.',
  'idleDetection.outputTimeout':
    'Emineert ongeldig wanneer het aftellen 0 bereikt zonder bevestiging van de gebruiker.',
  'idleDetection.serviceSummary':
    'Dienst voor het monitoren van gebruikersactiviteiten en het opsporen van stationaire perioden.',
  'idleDetection.methodSetConfig':
    'Stelt de idle detectie configuratie in. Overschrijft globale configuratie indien aanwezig.',
  'idleDetection.methodStartWatching': 'Begint met het monitoren van gebruikersactiviteit voor stationaire detectie.',
  'idleDetection.methodClearTimers': 'Verwijdert alle actieve timers en stopt de monitoring.',
  'idleDetection.methodOnIdleEnd': 'Observable die uitzendt wanneer de stationaire fase eindigt en aftellen begint.',
  'idleDetection.methodOnTimeoutEnd': 'Observable die uitzendt wanneer de timeout countdown eindigt.',
  'idleDetection.methodOnCountDown': 'Observable die de resterende seconden uitstraalt tijdens de aftelfase.',
  'datagridUtil.title': 'Datagrid-hulpbronnen',
  'datagridUtil.overview':
    'De Clarity datagrid stuurt een toestand uit wanneer een gebruiker interageert met paginering, filters of sortering. Om een soepele integratie met API aanvragen te bevorderen, converteert <code>convertToHttpParams</code> de datagrid toestand in een queryobject dat geschikt is voor HttpParams.',
  'datagridUtil.example1': 'Voorbeeld 1: convertToHttpParams gebruiken',
  'datagridUtil.example1Desc':
    'De convertToHttpParams-functie transformeert een Clarity Datagrid-toestand in een PageQuery-object dat geschikt is voor HttpParams.',
  'datagridUtil.apiSummary':
    'Converteert een Clarity Datagrid toestandobject in een PageQuery-object dat geschikt is voor HttpParams in API aanvragen.',
  'datagridUtil.paramState':
    'Het Clarity Datagrid-object met paginatie, sorteren en filterinformatie. Kan nul zijn voor de initiële belasting.',
  'datagridUtil.returnsDesc':
    'Een PageQuery object met pagina, pageSize, sorteren richting, en filter snaren in FIQL formaat.',
  'datagridUtil.propPage': 'Het 1-gebaseerde paginanummer voor paginatie.',
  'datagridUtil.propPageSize': 'Het aantal te tonen items per pagina.',
  'datagridUtil.propSortAsc': 'De veldnaam om in opgaande volgorde te sorteren.',
  'datagridUtil.propSortDesc': 'De veldnaam om in aflopende volgorde te sorteren.',
  'datagridUtil.propFilter': 'De filterexpressie geformatteerd in FIQL formaat.',
  'dgState.overview':
    'De <code>dgState</code> operator is een RxJS operator dat is ontworpen om de Clarity Datagrid toestandtransformatie te beheren met intelligent debouncing en dubbele filterering. Het beoordeelt veranderingen in de datagrid filters en beheert API trigger gebeurtenissen efficiënt. Wanneer filters worden gewijzigd, introduceert het operator een 500ms debouncing voor het opstarten van de API aanroep, wat voorkomt dat te veel aanvragen worden gedaan bij snelle typen. Voor acties zoals sortering of paginering, wordt de API aanroep direct uitgevoerd zonder vertraging. De operator biedt ook een optionele parameter om het gebruik van <code>distinctUntilChanged</code> te beheersen. Wanneer ingeschakeld (standaard: <code>true</code>), zorgt het ervoor dat geen API aanroep wordt uitgevoerd als de datagrid toestand hetzelfde blijft, wat redundantiteit voorkomt.',
  'dgState.example1Title': 'Voorbeeld 1: Basisgebruik',
  'dgState.example1Desc':
    'Gebruik <code>dgState</code> in uw waarneembare pijplijn om veranderingen in datagridtoestand efficiënt te beheren:',
  'dgState.example1DataDesc':
    'Stel dat we een API hebben die de volgende vorm van data teruggeeft voor een door een server gestuurd datagrid:',
  'dgState.example2Title': 'Voorbeeld 2: Template Implementatie met Type Veiligheid',
  'dgState.example2Desc': 'Gebruik async pipe met <code>@if</code> voor een betere typeveiligheid:',
  'dgState.example3Title': 'Voorbeeld 3: Alternatieve implementatie van templates',
  'dgState.example3Desc': 'Gebruik de async pijp direct in uw sjabloon:',
  'dgState.example4Title': 'Voorbeeld 4: Live Example',
  'dgState.example4Desc':
    'Hieronder is een werkend voorbeeld van een servergestuurd datagrid met behulp van de <code>dgState</code> operator:',
  'dgState.calloutPrefix': 'U kunt de ',
  'dgState.calloutSuffix':
    ' utility functie om de datagrid status om te zetten in HTTP parameters. Zie de documentatie voor meer details.',
  'dgState.apiDesc':
    'RxJS operator voor het verwerken van Clarity Datagrid toestand transformaties met debouncing en optioneel distinctUntilChanged gedrag.',
  'dgState.paramDesc':
    '<em>(Optional)</em> Of distinctUntilChanged-filtering moet worden ingeschakeld. Standaard <code>true</code>. Wanneer <code>true</code>, onderdrukt dubbele toestanden. Wanneer <code>false</code>, staat API aanroepen zelfs voor identieke toestanden toe.',
  'dgState.returnsDesc': 'Een operatorfunctie die de emissie van Datagrid-toestand transformeert.',
  'dgState.behavior1':
    'Voegt een 500ms debounce toe wanneer filters veranderen (om buitensporige API-gesprekken tijdens snel typen te voorkomen)',
  'dgState.behavior2': 'Maakt API oproepen snel voor sorteren of paginatie acties (geen debounce)',
  'dgState.behavior3':
    'Optioneel filtert dubbele opeenvolgende toestanden wanneer <code>enableDistinctUntilChanged</code> <code>true</code> is',
  'dgState.behavior4': "Begint met een nultoestand om de eerste belastingsscenario's te verwerken",
  'timelineWizard.title': 'Tijdlijn-assistent',
  'timelineWizard.overview':
    'De TimelineWizard component helpt bij het bouwen van timeline gebaseerde meerdere stappen wizards in Angular toepassingen. Elke stap wordt voorgesteld door een aparte component die uitbreidt op TimelineBaseComponent, ondersteunt stap navigatie, asynchrone validatie en dynamische component renderering.',
  'timelineWizard.example1': 'Voorbeeld 1: Basisassistent instellen',
  'timelineWizard.example1Desc':
    'In het volgende voorbeeld, de wizard bestaat uit vier verschillende stappen. De timelineSteps array definieert de volgorde van elke stap. Drie stappen omvatten vorminvoer, en de laatste stap vat gegevens samen.',
  'timelineWizard.example2': 'Voorbeeld 2: Basisstapcomponent',
  'timelineWizard.example2Desc':
    'Elke stap component breidt TimelineBaseComponent uit, met vermelding van het relevante staptype en initialisatie van de FormGroup.',
  'timelineWizard.example3': 'Voorbeeld 3: Mapping van aangepaste gegevens',
  'timelineWizard.example3Desc':
    'Wanneer uw FormGroup model verschilt van de timelineSteps structuur, overschrijven formValueToData en dataToFormValue voor bidirectionele mapping.',
  'timelineWizard.example4': 'Voorbeeld 4: Geavanceerde gegevens mapping met key-Value ingangen',
  'timelineWizard.example4Desc':
    'Geavanceerde use case met dataToFormValue en formValueToData integratie met KeyValueInputsComponent:',
  'timelineWizard.example4Callout':
    "Om meer te weten te komen over KeyValueInputsComponent, kunt u terecht op de documentatiepagina 'Key Value Inputs'.",
  'timelineWizard.example5': 'Voorbeeld 5: Beoordeel stap met API indiening',
  'timelineWizard.example5Desc':
    'Consolideer gegevens van voorgaande stappen met behulp van TimelineWizardService en override next$ om uw inzending API-stream te construeren.',
  'timelineWizard.example5Callout':
    'U kunt de next$ waarneembaar in elke stap aanpassen, waardoor zowel synchrone en asynchrone operaties zoals HTTP verzoeken.',
  'timelineWizard.componentSummary':
    'De belangrijkste component verantwoordelijk voor het beheer van de tijdlijn wizard.',
  'timelineWizard.baseSummary':
    'De basisklasse voor alle stapcomponenten binnen de tijdlijn wizard. Het biedt essentiële eigenschappen en methoden voor het beheren van wizard stappen.',
  'timelineWizard.stepSummary':
    'Interface definieert de eigenschappen van een stap in de tijdlijn-assistentconfiguratie.',
  'timelineWizard.serviceSummary':
    'Een dienst die de staat en gegevens van de tijdlijnwizard over stapcomponenten beheert.',
  'timelineWizard.playgroundTitle': 'Interactieve Wizard-speelplaats voor implementatie',
  'timelineWizard.playgroundDesc':
    'Navigeer stap-voor-stap door Operator configuratie, Service schalen, Runtime Properties (toets-waarde editor), en definitieve bevestiging.',
  'timelineWizard.playgroundBadge': 'Werkstroom van ondernemingen',
  'timelineWizard.requiredInfo': 'Vereiste informatie',
  'timelineWizard.configureOperator': 'Operator configureren',
  'timelineWizard.configureService': 'Dienst configureren',
  'timelineWizard.configureRuntimeProperties': 'Runtime-eigenschappen instellen',
  'timelineWizard.name': 'Naam',
  'timelineWizard.namespace': 'Naamruimte',
  'timelineWizard.cpu': 'CPU',
  'timelineWizard.replicas': "Replica's",
  'timelineWizard.url': 'URL',
  'poll.overview':
    "De <code>poll</code> operator is een aangepaste RxJS operator die het proces van polling API's vereenvoudigt om data op te dateer. Het toont toepassingen waarin observables periodiek data op een bepaalde tijdsinterval uitstralen, abstractie van de complexiteit van het beheren van polling intervallen en API aanvragen. Deze operator is vooral handig wanneer in het real-time updaten is vereist, maar de server geen push notificaties ondersteunt (WebSockets, Server-Sent Events, etc.). Het integreert zich soepele met andere RxJS operators, waardoor ontwikkelaars reactieve pijplijnen kunnen bouwen voor het beheren van datastromen.",
  'poll.example1Title': 'Voorbeeld 1: Basic Polling',
  'poll.example1Desc':
    'Pollgegevens met een bepaald interval. De pollingfunctie ondersteunt Promise, Observable, of primitieve waarden:',
  'poll.example2Title': 'Voorbeeld 2: Poll tot voorwaarde is voldaan',
  'poll.example2Desc':
    'Gebruik RxJS operators zoals <code>takeWhile</code> om te stoppen met peilen wanneer aan een voorwaarde is voldaan:',
  'poll.example2Callout':
    'U kunt <code>takeUntil</code>, <code>takeWhile</code> of andere RxJS-operatoren toevoegen om te controleren wanneer de stembus eindigt.',
  'poll.example3Title': 'Voorbeeld 3: Poll met initialValue',
  'poll.example3Desc':
    "Standaard is de initiële resultaat van poll <code>&#123;status: 'loading', isLoading: true, error: null, data: null&#125;</code>, wat handig is voor het weergeven van een laden spinner. Echter, in bepaalde gevallen wil je geen laden spinner weergeven. Je kunt <code>initialValue</code> instellen op een waarde die je wilt:",
  'poll.example4Title': 'Voorbeeld 4: Defer Polling',
  'poll.example4Desc':
    'Standaard begint de peiling onmiddellijk. Gebruik de <code>delay</code> optie om het begin van de peiling te vertragen:',
  'poll.example4AltDesc':
    'Als alternatief kunt u na een user actie beginnen met polling door <code>poll</code> te combineren met andere RxJS operators:',
  'poll.btnStartPolling': 'Bespreking starten (zie Console)',
  'poll.example5Title': 'Voorbeeld 5: Force Refresh',
  'poll.example5Desc':
    'Gebruik de <code>forceRefresh</code> observable of teken te activeren de uitvoering van <code>pollingFn</code> wanneer nodig, zoals in reactie op gebruikersacties. De uitgevoerde waarde van <code>forceRefresh</code> wordt doorgegeven als input aan <code>paramsBuilder</code> (indien beschikbaar) of direct aan <code>pollingFn</code>.',
  'poll.example5SignalTitle': 'Signal-gebaseerde krachtverversing en Parameterbewaring',
  'poll.example5SignalDesc':
    '<code>forceRefresh</code> accepteert Angular Signals rechtstreeks. Als er meerdere updates optreden terwijl een verzoek loopt, laat <code>exhaustMap</code> tussenliggende triggers vallen, maar behoudt de nieuwste parameter voor de volgende geplande teek.',
  'poll.btnRapidFilters': 'Snelfilterwijzigingen (Burst 3x)',
  'poll.example6Title': 'Voorbeeld 6: Geavanceerd Voorbeeld - Datagrid met Polling',
  'poll.example6Desc':
    'Het onderstaande datagrid zal automatisch elke 10 seconden verversen. Bovendien, wanneer er een verandering in de invoer, triggering filtering, sorteren, of pagination, zal de API direct worden aangeroepen, vergezeld van een spinner die het laden aangeeft.',
  'poll.searchByFirstName': 'Zoeken op voornaam',
  'poll.apiDesc':
    'Polls gegevens met een opgegeven interval en kan handmatig worden geactiveerd. Geeft een waarneembare die het resultaat als een AsyncState object uitstraalt.',
  'poll.paramPollingFn': 'Een functie die een Observable, Promise of primitieve waarde teruggeeft.',
  'poll.paramInterval': 'Het interval in milliseconden tussen elke peiling.',
  'poll.paramForceRefresh': 'Een Observable of Signal die een handmatige verversing activeert.',
  'poll.paramParamsBuilder':
    'Een functie die parameters bouwt voor de stembusfunctie op basis van de forceRefresh-waarde.',
  'poll.paramInitialValue': 'Een initiële AsyncState waarde.',
  'poll.paramDelay': 'Vertraging in milliseconden voor de eerste peiling.',
  'poll.returnsDesc':
    'Een waarneembare die AsyncState<Data> objecten uitstraalt met status, isLoading, fout en gegevenseigenschappen.',
  'createAsyncState.overview':
    'De <code>createAsyncState</code> operator veranderd een observable van type <code>T</code> in een observable van <code>AsyncState&lt;T&gt;</code>, waarmee de toestanden van laden, fout en data in een standaardstructuur worden geïmplicatie. Dit vermindert het behoeften om aparte variabelen voor toestanden van laden, fouten en data te beheren, waardoor je codebase meer georganiseerd en onderhoudsbaar wordt.',
  'createAsyncState.interfaceStructure': 'De <code>AsyncState</code> interface structuur die de operator teruggeeft:',
  'createAsyncState.example1Title': 'Voorbeeld 1: Eenvoudig verzoek',
  'createAsyncState.example1Desc': 'Een enkel API-verzoek behandelen met laad- en fouttoestanden:',
  'createAsyncState.example2Title': 'Voorbeeld 2: Met terugbellen',
  'createAsyncState.example2Desc': "Voeg bijwerkingen toe voor succes en foutscenario's:",
  'createAsyncState.example3Title': 'Voorbeeld 3: initialValue leveren',
  'createAsyncState.example3Desc':
    "In scenario's waar u eerste gegevens hebt (bijv. van routestatus), kunt u een initiële waarde geven om te voorkomen dat u een laadspinner toont. Dit is handig bij het navigeren van een lijst naar een detailpagina waar u al enkele gegevens hebt:",
  'createAsyncState.example3Callout':
    "Bij het leveren van <code>initialValue</code>, stel <code>status: 'idle'</code> en <code>isLoading: false</code> in om te voorkomen dat de laadspinner verschijnt. De gegevens worden naadloos bijgewerkt wanneer de API-aanroep is voltooid.",
  'createAsyncState.example4Title': 'Voorbeeld 4: Afhankelijke verzoeken',
  'createAsyncState.example4Desc': 'Chain meerdere verzoeken met behulp van <code>switchMap</code>:',
  'createAsyncState.example5Title': 'Voorbeeld 5: Sjabloongebruik',
  'createAsyncState.example5Desc': 'Gebruik de async pijp in sjablonen om verschillende toestanden te behandelen:',
  'createAsyncState.apiSummary': 'Verander een Observable van type T in een Observable van AsyncState<T, E>.',
  'createAsyncState.paramObserver':
    'Terugroepfunctie of waarnemerobject voor de behandeling van bijwerkingen wanneer de waarneembare waarden of fouten uitstraalt.',
  'createAsyncState.paramInitialValue':
    'De initiële AsyncState waarde die gebruikt moet worden voordat de waarneembare de eerste waarde uitstraalt.',
  'createAsyncState.returnsDesc': 'Een functie die een waarneembare stroom transformeert in een asynchrone toestand.',
  'createAsyncState.stateStatus':
    'Fijngranaire statusvolging: "idle" | "loading" | "reloading" | "resolved" | "error".',
  'createAsyncState.stateIsLoading':
    'Geeft aan of een laadbewerking actief is (true wanneer status "loading" of "reloading" is).',
  'createAsyncState.stateError': 'Foutdetails als de asynchrone bewerking is mislukt, of nul.',
  'createAsyncState.stateData': 'Gegevens die worden uitgezonden door het waarneembare, of nul.',
  'resourceAsync.paramSourceFn': 'Een reactieve functie die een Observable, Promise of synchrone waarde teruggeeft.',
  'resourceAsync.paramOptions': 'Configuratie-opties voor de bron.',
  'resourceAsync.propInitialValue': 'Initiële waarde voordat de eerste ophaling voltooid is.',
  'resourceAsync.propLazy': 'Als waar, begint in "idle"-toestand en wacht tot reload() wordt aangeroepen.',
  'resourceAsync.propBehavior':
    'Gedrag bij gelijktijdige uitvoeringen: "switch" annuleert de vorige uitvoering; "exhaust" negeert nieuwe uitvoeringen. Standaard: "switch".',
  'resourceAsync.propOnError': 'Error handler callback die terugvalwaarden kan bieden.',
  'resourceAsync.propThrowOnError':
    'Indien ingeschakeld worden fouten gegooid in plaats van opgeslagen in het foutsignaal.',
  'resourceAsync.propOnSuccess': 'Oproep tot terugroepen wanneer de bewerking succesvol is voltooid.',
  'resourceAsync.propOnLoading': 'Oproep tot terugroepen wanneer de bewerking begint te laden.',
  'resourceAsync.returnsDesc':
    'Een ResourceRef<T, E> object dat waarde, fout, status, isLoading en mutatiemethoden blootlegt.',
  'spinner.apiSummary': 'Component voor het weergeven van laden spinners met aanpassbare grootte en positie.',
  'spinner.inputSize': 'Bepaalt de grootte van de spinner: "lg" (standaard), "md" of "sm."',
  'spinner.inputCenter': 'Centreert de spinner als blokelement. Passeer vals om het centreren uit te schakelen.',
  'spinner.inputInline': 'Geeft aan of de spinner moet worden weergegeven als een inline-blok element.',
  'spinner.inputCustomClass': 'Een reeks extra CSS klassen om toe te passen op de spinner.',
  'callout.apiSummary': 'Een component gebouwd op basis van het Clarity Design System.',
  'callout.contentProjectionDesc':
    'Biedt een standaard <ng-content /> sleuf om aangepaste HTML inhoud, tekst, lijsten en componenten te maken.',
  'callout.responsiveTitle': 'Responsief gedrag',
  'callout.responsiveDesc':
    'Het decoratieve pictogram is verborgen op schermen smaller dan 576px en wordt automatisch weergegeven op bredere schermen.',
  'callout.themingTitle': 'Thema',
  'callout.themingDesc':
    "Erft Clarity themacontext en respecteert [cds-theme='dark'] voor contrasterende achtergrond-, rand- en linkstijlen.",
  'certificate.pemNote':
    'PEM staat voor Privacy Enhanced Mail. Het is een bestandsformaat dat vaak wordt gebruikt om cryptografische sleutels, certificaten en andere beveiligde gegevens op te slaan. PEM-bestanden hebben meestal extensies zoals .pem, .crt, .cer, en .key.',
  'certificate.apiSummary': 'Een component voor het weergeven van certificaatinformatie in een Clarity signpost.',
  'certificate.clickIcon': 'Klik op het certificaatpictogram hieronder om de certificaatgegevens te bekijken:',
  'certificate.clickCert': 'Klik op het certificaatpictogram:',
  'certificate.inputPem': 'De PEM-geformatteerde certificaatstring om te inspecteren.',
  'certificate.inputPemEncoded': 'Of de bijgeleverde PEM-tekenreeks base64-gecodeerd is.',
  'certificate.inputPosition': 'Positie van de wegwijzer ten opzichte van het triggerpictogram.',
  'certificate.inputShowIcon':
    'Een booleaanse waarde om de zichtbaarheid van het certificaatstatuspictogram te beheren.',
  'isPromise.overview':
    'De <code>isPromise</code> utiliteit is een TypeScript type guard die bepaalt of een willekeurige waarde een <code>Promise</code> of <code>PromiseLike</code> (een object of functie met een callable <code>then</code> methode) is. Het stelt een veilige runtime controle en type narrowing toe zonder fouten te werpen bij null of eenvoudige waarden.',
  'isPromise.callout':
    'Nuttig in asynchrone resource laders, aangepaste operators en flexibele service APIs die ofwel onmiddellijke statische waarden of asynchrone beloften accepteren.',
  'isPromise.example1Title': 'Voorbeeld 1: Interactieve Value Evaluation Matrix',
  'isPromise.example1Desc':
    'Observeer runtime type-checking tussen veel voorkomende JavaScript-datatypes en dansbare objecten:',
  'isPromise.thDescription': 'Omschrijving',
  'isPromise.thExpression': 'Geevalueerde expressie',
  'isPromise.thResult': 'isPromise() Resultaat',
  'isPromise.example2Title': 'Voorbeeld 2: Veilig type vernauwingspatroon',
  'isPromise.example2Desc':
    'In TypeScript vernauwt de controle met <code>if (isPromise(val))</code> het type automatisch in het blok:',
  'isPromise.apiSummary': 'Een TypeScript type guard functie die controleert op PromiseLike contracten.',
  'isPromise.paramObj': 'De waarde om te inspecteren.',
  'isPromise.returnsDesc':
    'true als de invoer niet-null is, een object of functie is, en implementeert een aanroepbare dan methode; onwaar anders.',
  'isEmpty.overview':
    'De <code>isEmpty</code> utiliteitsfunctie controleert of een string, object of array leeg is. Het retourneert <code>true</code> voor lege waarden en <code>false</code> voor niet-lege waarden.',
  'isEmpty.example1Title': 'Voorbeeld 1: Basisgebruik',
  'isEmpty.example1Desc': 'Controleer of verschillende soorten waarden leeg zijn:',
  'isEmpty.example2Title': 'Voorbeeld 2: Gevallen van gemeenschappelijk gebruik',
  'isEmpty.example2Desc': 'Gebruik <code>isEmpty</code> in voorwaardelijke logica:',
  'isEmpty.apiSummary': 'Controleert of een string, object of array leeg is.',
  'isEmpty.paramValue': 'De te controleren waarde. Kan een tekenreeks, object, array of andere waarde zijn.',
  'isEmpty.returnsDesc':
    'waar als de waarde leeg is (leeg tekenreeks, leeg object, lege array, nul of ongedefinieerd), anders onjuist.',
  'isEqual.overview':
    'De <code>isEqual</code> utiliteitsfunctie voert een diepe gelijkheidsovereenkomst uit tussen twee waarden. Het vergelijkt eenvoudige waarden, arrays en objecten recursief om te bepalen of ze structuurlijk gelijk zijn, ongeacht referentiegelijkheid.',
  'isEqual.example1Title': 'Voorbeeld 1: Basisgebruik',
  'isEqual.example1Desc': 'Vergelijk verschillende soorten waarden voor diepe gelijkheid:',
  'isEqual.example2Title': 'Voorbeeld 2: Deep Object Vergelijking',
  'isEqual.example2Desc': 'Vergelijk geneste objecten en arrays:',
  'isEqual.apiSummary': 'Voert een diepe gelijkheidsovereenkomst uit tussen twee waarden.',
  'isEqual.paramValue1': 'De eerste waarde om te vergelijken.',
  'isEqual.paramValue2': 'De tweede te vergelijken waarde.',
  'isEqual.returnsDesc':
    'waar als de waarden diep gelijk zijn, anders onjuist. Voert recursieve vergelijking uit voor objecten en arrays.',
  'differenceInDays.overview':
    'De <code>differenceInDays</code> utiliteitsfunctie berekent het aantal hele dagen tussen twee datums. Het vereenvoudigt dateberekeningen in JavaScript door flexibele invoertypen te accepteren. Het eerste parameter vertegenwoordigt de referentie datum vanaf welke het verschil wordt gemeten, en het tweede parameter geeft de datum aan die wordt vergeleken met de referentie datum. Beide parameters accepteren <code>Date</code> objecten, getallen die het aantal milliseconden sinds de Unix epoch voorstellen, of strings die door de <code>Date</code> constructor kunnen worden geparsed.',
  'differenceInDays.example1Title': 'Voorbeeld 1: Bereken dagen tussen data',
  'differenceInDays.example1Desc': 'Bereken het aantal hele dagen tussen twee data met verschillende invoertypes:',
  'differenceInDays.example2Title': 'Voorbeeld 2: Bereken dagen van vandaag',
  'differenceInDays.example2Desc': 'Bereken het aantal dagen van vandaag tot een specifieke datum:',
  'differenceInDays.apiSummary': 'Berekent het aantal hele dagen tussen twee datums.',
  'differenceInDays.paramDateLeft':
    'De referentiedatum. Kan een Datum-object, tijdstempel (milliseconden) of een ontleedbare datumtekenreeks zijn.',
  'differenceInDays.paramDateRight':
    'De datum om te vergelijken met de referentiedatum. Accepteert dezelfde types als dateLeft.',
  'differenceInDays.returnsDesc':
    'Het aantal hele dagen tussen de twee data. Geeft een positief getal terug als dateLeft later is dan dateRight, en negatief als dateLeft eerder is.',
  'pickBy.overview':
    'De <code>pickBy</code> en <code>omitBy</code> utiliteitsfuncties laten je nieuwe objecten aanmaken door eigenschappen te selecteren of te exclusiveren op basis van een predicatfunctie. <code>pickBy</code> maakt een object van eigenschappen die een gegeven voorwaarde voldoen, terwijl <code>omitBy</code> het tegenovergestelde is, en een object maakt van eigenschappen die de voorwaarde niet voldoen.',
  'pickBy.example1Title': 'Voorbeeld 1: pickBy',
  'pickBy.example1Desc': 'Maak een object dat bestaat uit objecteigenschappen die aan een bepaalde voorwaarde voldoen:',
  'pickBy.example2Title': 'Voorbeeld 2: omitBy',
  'pickBy.example2Desc':
    '<code>omitBy</code> is het tegenovergestelde van <code>pickBy</code>, het creëren van een object bestaande uit eigenschappen die niet voldoen aan de gegeven voorwaarde.',
  'pickBy.apiSummary': 'Maakt een object van objecteigenschappen die een gegeven voorwaarde voldoen.',
  'pickBy.paramObject': 'Het bronobject om eigenschappen uit te kiezen.',
  'pickBy.paramPredicate':
    'Een functie die bepaalt welke eigenschappen mee te nemen. Returns true to include, false to exclude.',
  'pickBy.returnsDesc': 'Een nieuw object met alleen de eigenschappen die voldoen aan het predicaat.',
  'omitBy.apiSummary': 'Maakt een object van objecteigenschappen die een gegeven voorwaarde niet voldoen.',
  'omitBy.paramObject': 'Het bronobject om eigenschappen van weg te laten.',
  'omitBy.paramPredicate':
    'Een functie die bepaalt welke eigenschappen weg te laten. Returns true to laten, false to keep.',
  'omitBy.returnsDesc': 'Een nieuw object met alleen de eigenschappen die niet voldoen aan het predicaat.',
  'url.title': 'URL Hulpmiddelen',
  'url.overview':
    'ngx-lift biedt verschillende utiliteitsfuncties voor het werken met URLs: <code>isIP</code> en <code>isFQDN</code> voor het controleren van hostnametypen, <code>isURL</code> voor het valideren van URLs, en <code>isHttps</code> voor het controleren van het HTTPS protocol. Deze utiliteiten zijn nuttig voor URL validering, beveiligingscontrole en logica gebaseerd op URL-eigenschappen.',
  'url.example1': 'Voorbeeld 1: Check Hostname Type (isIP & isFQDN)',
  'url.example1Desc':
    'Controleer of een URL-hostnaam een IP-adres of een volledig gekwalificeerde domeinnaam (FQDN) is:',
  'url.example1Callout':
    'U kunt <code>URL</code> constructor gebruiken om de hostnaam te krijgen, maar vergeet niet om try-catch te gebruiken voor het verwerken van fouten.',
  'url.example2': 'Voorbeeld 2: Valideren URLs (isURL & isHttps)',
  'url.example2Desc':
    '<code>isURL</code> wordt gebruikt om te controleren of een URL geldig is. <code>isHttps</code> wordt gebruikt om te controleren of de URL begint met https.',
  'url.example2Callout': 'Wij bieden ook <code>isHttps</code> pijp voor gebruik in sjablonen.',
  'url.isIPSummary': 'Controleert of een hostnaam een IP-adres is.',
  'url.isFQDNSummary': 'Controleert of een hostnaam een volledig gekwalificeerde domeinnaam is (FQDN).',
  'url.isURLSummary': 'Controleer of een tekenreeks een geldige URL is.',
  'url.isHttpsSummary': 'Controleert of een URL-string het HTTPS-protocol gebruikt.',
  'urlValidator.title': 'urlValidator & httpsValidator',
  'urlValidator.overview':
    'De <code>urlValidator</code> en <code>httpsValidator</code> functies zijn Angular validators gebruikt om te controleren of een gegeven string voldoet aan specifieke URL patronen. De <code>urlValidator</code> valideert URLs die met http of https beginnen, terwijl <code>httpsValidator</code> alleen HTTPS URLs valideert.',
  'urlValidator.example1': 'Voorbeeld 1: URL Validator',
  'urlValidator.example1Desc': 'Valideer URLs die begint met http of https:',
  'urlValidator.example2': 'Voorbeeld 2: HTTPS-validator',
  'urlValidator.example2Desc': 'Valideer alleen HTTPS URLs:',
  'urlValidator.example3': 'Voorbeeld 3: Complete Form Voorbeeld',
  'urlValidator.example3Desc': 'Compleet voorbeeld met beide validatoren in reactieve vorm:',
  'urlValidator.urlLabel': 'URL',
  'urlValidator.urlHelper': 'Geef een geldige URL',
  'urlValidator.urlError': 'Voer een geldige URL in (beginnen met https of http)',
  'urlValidator.httpsLabel': 'HTTPS-alleen URL',
  'urlValidator.httpsHelper': 'Vermeld een https URL',
  'urlValidator.httpsError': 'Voer een https URL in',
  'urlValidator.summary':
    'Angular validator die controleert of een tekenreeks een geldige URL is die begint met http of https.',
  'urlValidator.httpsSummary': 'Angular validator die controleert of een tekenreeks een geldige HTTPS URL is.',
  'urlValidator.returns':
    'Een validatorfunctie die {invalidUrl: true} teruggeeft als de URL ongeldig is, of null als deze geldig is.',
  'urlValidator.httpsReturns':
    'Een validatorfunctie die {invalidUrl: true} retourneert als de URL niet HTTPS is, of nul indien geldig.',
  'startWithTap.overview':
    'De <code>startWithTap</code> operator voert een synchrone callback uit voorafgaand aan elk abonnement op de bron Observable. Het is verschillend van opdringerende tap-acties of pipelineinitialisatiecode, want het bouwen van de pipeline voert de callback niet uit totdat een abonnement plaatsvindt. Elke callback-exception gaat naar het Observable foutkanal.',
  'startWithTap.callout':
    'Ideaal voor het triggeren van initialisatie bijwerkingen, het instellen van laadindicatoren, het resetten van eerdere fouten, of het opnemen van verzoeken verzending tijdstempels onmiddellijk wanneer een Observable-stream is geabonneerd.',
  'startWithTap.example1Title': 'Voorbeeld 1: Interactieve verzoek centrale met Loading Indicator',
  'startWithTap.example1Desc':
    'Klik op "Trigger Request" om je te abonneren op een gesimuleerde 900ms vertraagde Observable. <code>startWithTap</code> draait synchroon op het moment van het abonnement om de laadspinner aan te zetten:',
  'startWithTap.btnTrigger': 'Triggerverzoek',
  'startWithTap.btnClearLog': 'Logboek wissen',
  'startWithTap.fetchingData': 'Gegevens worden opgehaald...',
  'startWithTap.loadedPayload': 'Laadvermogen:',
  'startWithTap.example2Title': 'Voorbeeld 2: Uitgestelde uitvoering van de pijpleiding',
  'startWithTap.example2Desc':
    'De callback wordt uitgesteld tot de abonnementstijd, wat betekent dat herbruikbare streams of gedeelde pijpleidingen van tevoren kunnen worden gedefinieerd zonder vroegtijdige bijwerkingen uit te voeren:',
  'startWithTap.apiSummary': 'RxJS MonoTypeOperatorFunction uitvoeren van een callback bij abonneren.',
  'startWithTap.paramCallback':
    'Functie die synchroon wordt uitgevoerd voordat de bron Observable begint uit te zenden.',
  'startWithTap.returnsDesc':
    'Een RxJS operator functie die de callback uitvoert bij het abonnement en de bron Observable ongewijzigd retourneert.',
  'switchMapWithAsyncState.overview':
    "De <code>switchMapWithAsyncState</code> operator combineert de functionaliteit van <code>switchMap</code> en <code>createAsyncState</code> in één operator. Het is afgestemd voor scenario's waarin een API-aanvraag moet worden uitgevoerd op basis van gebruikersacties (zoals knopdrukken) en het soepel overgaan tussen streams. Door een <code>AsyncState</code> structuur te creëren om de API-antwoord te encapsuleren, biedt deze operator een soepel en efficiënt manier om asynchrone operaties te beheren.",
  'switchMapWithAsyncState.example1Title': 'Voorbeeld 1: Gebruikers filteren op geslacht',
  'switchMapWithAsyncState.example1Desc':
    'Het selecteren van een ander geslacht zal de gebruikerslijst dienovereenkomstig bevolken:',
  'switchMapWithAsyncState.example2Title': 'Voorbeeld 2: Formulierindiening met laadstaat',
  'switchMapWithAsyncState.example2Desc':
    'Stuur het formulier door met <code>switchMapWithAsyncState</code> en <code>toSignal</code>. De inzending zal altijd een fout uitstralen omdat de API is ontworpen om een fout te simuleren.',
  'switchMapWithAsyncState.apiSummary':
    'Combineert switchMap en createAsyncState om een observabelstream te transformeren in AsyncState terwijl het overgaat naar een nieuwe interne observabel.',
  'switchMapWithAsyncState.paramProject':
    'Een functie die elke waarde van de bron waarneembaar ontvangt en een Observable, Promise of andere ObservableInput teruggeeft.',
  'switchMapWithAsyncState.returnsDesc':
    'Een waarneembare die AsyncState<R> objecten uitzendt, die automatisch laden, fouten en gegevenstoestanden verwerken.',
  'combineLatestEager.overview':
    'De RxJS operator <code>combineLatest</code> vereist dat alle bronnen minstens één keer uitsturen, wat problematisch kan zijn wanneer <code>Subject</code> bronnen worden gebruikt die mogelijk niet uitsturen. <code>combineLatestEager</code> verlengt <code>combineLatest</code> door automatisch <code>startWith(null)</code> toe te voegen voor elk <code>Subject</code> in de bronnen, waarmee de gecombineerde observabel correct initialiseert. U kunt ook de tweede parameter instellen op <code>true</code> om <code>startWith(null)</code> toe te voegen aan alle bronnobservablen, wat handig is wanneer met veel observables te maken is waarbij initial emissies niet zeker zijn.',
  'combineLatestEager.example1Title': 'Voorbeeld 1: Basisgebruik',
  'combineLatestEager.example1Desc':
    'Combineer waarneembaren met inbegrip van personen die in eerste instantie niet mogen uitzenden:',
  'combineLatestEager.example2Title': 'Voorbeeld 2: Compleet voorbeeld met sjabloon',
  'combineLatestEager.example2Desc':
    'Compleet voorbeeld met het gebruik van combineLatestEager met async pipe in sjablonen:',
  'combineLatestEager.apiSummary':
    'Combineert meerdere observables met een vroegtijdige uitsturing, automatisch handelt met bronnen die geen initiële waarden uitsturen.',
  'combineLatestEager.paramSources': 'Een array of woordenboek object van waarneembare te combineren.',
  'combineLatestEager.paramStartWithAll':
    '(Optioneel) Indien waar, voegt startWith(null) toe voor alle bronnen, niet alleen voor onderwerpen. Standaarden voor onjuist.',
  'combineLatestEager.returnsDesc':
    'Een waarneembare die een array of object uitstraalt die de nieuwste waarden uit alle bronnen bevat.',
  'distinctOnChange.overview':
    "De <code>distinctOnChange</code> operator versterkt RxJS Observables door niet alleen dubbele uitsturingen (zoals <code>distinctUntilChanged</code>) te voorkomen, maar ook een callbackfunctie uit te voeren wanneer een waarde verandert. Dit is nuttig in scenario's waarin je moet uitvoeren side effects, zoals het weergeven van een toastmelding, wanneer een waarde verandert na de eerste uitsturing.",
  'distinctOnChange.example1Title': 'Voorbeeld 1: Basisgebruik',
  'distinctOnChange.example1Desc': 'Een callback uitvoeren wanneer verschillende waarden worden aangetroffen:',
  'distinctOnChange.example2Title': 'Voorbeeld 2: Met aangepaste comparator',
  'distinctOnChange.example2Desc': 'Gebruik een aangepaste vergelijkingsfunctie om gelijkheid te bepalen:',
  'distinctOnChange.apiSummary':
    'Return een observabel dat unieke opeenvolgende waarden uitstraalt en een callback uitvoert wanneer de waarde verandert.',
  'distinctOnChange.paramCallback':
    'Functie om uit te voeren wanneer de waarde verandert. Ontvangt de vorige en huidige waarden.',
  'distinctOnChange.paramComparator':
    '(Optioneel) Functie om te bepalen of twee waarden als gelijk worden beschouwd. Standaardwaarden voor strikte gelijkheid (==).',
  'distinctOnChange.returnsDesc':
    'Een waarneembare die verschillende waarden uitstraalt en de callback uitvoert op wijzigingen.',
  'logger.overview':
    'De <code>logger</code> operator is een nuttige functie voor RxJS observables die het loggen van uitgestuurde waarden vereenvoudigt met behulp van verschillende consolefuncties. Deze operator is handig voor het debuggen en het bewaken van het gedrag van je observables tijdens ontwikkeling.',
  'logger.example1Title': 'Voorbeeld 1: Basisloggen',
  'logger.example1Desc': 'Uitgevoerde waarden loggen met console.log:',
  'logger.example2Title': 'Voorbeeld 2: Tabelloggen',
  'logger.example2Desc': 'Log uitgestoten waarden met behulp van console.table voor een betere visualisatie:',
  'logger.example3Title': 'Voorbeeld 3: Andere consolemethoden',
  'logger.example3Desc': 'Gebruik andere console methoden zoals waarschuwing, fout of info:',
  'logger.apiSummary':
    'Een debugoperator die uitsturingen logt naar de console met behulp van verschillende consolemethoden.',
  'logger.paramMethod':
    'Optioneel: consolemethode: "log" | "table" | "warn" | "error" | "info" | "debug". Standaard: "log".',
  'logger.returnsDesc': 'Een waarneembare die door alle waarden gaat tijdens het loggen naar de console.',
  'kubernetesPagination.overview':
    "De <code>aggregatePaginatedKubernetesResources</code> operator en de <code>fetchPaginatedKubernetesResources</code> functie automatiseren client-side paginatie voor Kubernetes REST API's. Ze inspecteren de <code>metadata.continue</code> token op ingekomende antwoorden, vragen opvolgende pagina's recursief aan tot alle pagina's zijn opgehaald, normaliseren ontbrekende of null items veilig, en combineren alle resources in één geïntegreerde <code>KubernetesList&lt;T&gt;</code>.",
  'kubernetesPagination.callout':
    "Kubernetes-API's retourneren paginagecollecties met een <code>continue</code> token in het antwoordmetadata wanneer het aantal recorden groter is dan de gevraagde <code>limit</code>. Deze operator behandelt de hele meelopvallende loop zorgvuldig achter een enkel Observable-stroom.",
  'kubernetesPagination.example1Title': 'Voorbeeld 1: Interactieve Kubernetes Paginated Traversal',
  'kubernetesPagination.example1Desc':
    'Klik op "Fetch Paginated Pods" (Fetch Paginated Pods) om geautomatiseerde multi-page fetching te activeren op drie mock Kubernetes API pagina\'s:',
  'kubernetesPagination.btnFetchPods': 'Paginated Pods ophalen',
  'kubernetesPagination.fetchingPages': "Pagina's ophalen (token continueren)...",
  'kubernetesPagination.pagesFetched': "Recursief opgehaalde pagina's:",
  'kubernetesPagination.aggregationComplete': 'Samenvoegen voltooid',
  'kubernetesPagination.totalResources': 'Totaal middelen:',
  'kubernetesPagination.thPodName': 'Pod-naam',
  'kubernetesPagination.thNamespace': 'Naamruimte',
  'kubernetesPagination.thStatus': 'Status',
  'kubernetesPagination.thPodIp': 'Pod IP',
  'kubernetesPagination.example2Title': 'Voorbeeld 2: Zelfvoorzienende functie voor ophalen',
  'kubernetesPagination.example2Desc':
    'Gebruik <code>fetchPaginatedKubernetesResources</code> wanneer u wilt starten en pagineren in een enkele functieaanroep zonder de initiële Observable handmatig te construeren:',
  'kubernetesPagination.aggregateSummary':
    "RxJS-operator die een initiële Kubernetes-lijstrespons Observable transformeert in een geaggregeerde lijst met items van alle pagina's.",
  'kubernetesPagination.fetchSummary':
    'Convenience functie die Kubernetes initieert en pagineert in een enkele oproep.',
  'kubernetesPagination.paramHttp': "Angular HttpClient gebruikt voor het aanvragen van volgende pagina's.",
  'kubernetesPagination.paramEndpoint': 'REST URL van de Kubernetes resource.',
  'kubernetesPagination.paramInitialParams': 'Zoekparameters (bv. limiet).',
  'k8sRetryBackoff.configSummary': 'Optionele configuratie gedeeld door de operator en interceptor-factory.',
  'k8sRetryBackoff.paramMaxAttempts':
    'Totaal aantal pogingen inclusief het eerste verzoek. Stel in op 1 om retries uit te schakelen.',
  'k8sRetryBackoff.errorShape':
    'Accepteert HttpErrorResponse of een object met vorm <code>{ status, headers?, error? }</code>, inclusief een JSON-string in <code>error</code>. Native fetch negeert HTTP 429 niet: controleer het antwoord en pas de status, headers en opgeparseerde lichaam aan. Axios blokkeert deze onder <code>error.response</code>; pas deze aan voordat je de helper gebruikt. De helper berekent alleen een vertraging.',
  'k8sRetryBackoffInterceptor.overrideRules':
    'Null maakt gebruik van interceptor defaults; false deactiveert retries. Context overrides merge with global or factory defaults. GET/HEAD/OPTIONS/PUT/DELETE komen standaard in aanmerking; POST/PATCH vereist een expliciete retryMethods override en eindpunt idempotency.',
  'k8sRetryBackoffInterceptor.overrideSimulation':
    'Test een probe die direct faalt bij de eerste 429, of een workload-uitlezing die na twee 429’s slaagt. De aangepaste uitlezing gebruikt maxAttempts: 10 en een terugvalvertraging van 200ms; dit staat maximaal negen retries toe.',
  'k8sRetryBackoffInterceptor.btnWorkloads': 'Workload-uitlezing testen (10 pogingen)',
  'k8sRetryBackoffInterceptor.btnProbe': 'Snelle probe testen (Opt-out)',
  'k8sRetryBackoff.overview':
    'De <code>retryOnK8sBackoff</code> RxJS operator implementeert automatische retry met backoff voor Kubernetes apiserver HTTP 429 (<code>TooManyRequests</code>) antwoorden (zoals wanneer de apiserver watch cache bootstrappert met "storage is (re)initializing"). Alleen HTTP 429 triggeert een retry; alle andere fouten (4xx, 5xx, netwerkfouten) stromen onveranderd naar de abonneraar.',
  'k8sRetryBackoff.callout':
    '<strong>Operator vs. Interceptor:</strong> De exploitant bestuurt specifieke Observable-pijpleidingen. De interceptor past 429 retry toe op de in aanmerking komende HttpClient-methoden; schrijft geverifieerde idempotency.',
  'k8sRetryBackoff.diffTitle': 'Architectonische vergelijking: Operator vs. Interceptor',
  'k8sRetryBackoff.diffDesc':
    'Beide hulpprogramma’s delen dezelfde berekeningslogica voor vertragingen, maar vervullen complementaire rollen:',
  'k8sRetryBackoff.diffColFeature': 'Kenmerk',
  'k8sRetryBackoff.diffColOperator': 'retryOnK8sBackoff (Operator)',
  'k8sRetryBackoff.diffColInterceptor': 'k8sRetryBackoffInterceptor (Interceptor)',
  'k8sRetryBackoff.diffScope': 'Bereik',
  'k8sRetryBackoff.diffScopeOp':
    'Lokaal: Selectief toegepast op specifieke Observables via <code>.pipe(retryOnK8sBackoff(...))</code>.',
  'k8sRetryBackoff.diffScopeInt': 'Wereldwijd: Automatisch op alle Angular HttpClient verzoeken',
  'k8sRetryBackoff.diffUseCases': 'Belangrijkste gebruiksscenario’s',
  'k8sRetryBackoff.diffUseCasesOp': 'Polling-streams, achtergrondtaken of observables buiten HttpClient.',
  'k8sRetryBackoff.diffUseCasesInt':
    'Standaard Kubernetes microservice/SPA integraties die wereldwijde veerkracht vereisen',
  'k8sRetryBackoff.diffConfig': 'Configuratie & Uitsluiting',
  'k8sRetryBackoff.diffConfigOp':
    'Rechtstreeks doorgegeven aan operator: <code>retryOnK8sBackoff({ maxAttempts, fallbackDelayMs })</code>',
  'k8sRetryBackoff.diffConfigInt':
    'Global in <code>app.config.ts</code> of per aanvraag via <code>HttpContextToken</code>',
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
  'k8sRetryBackoff.logTitle': 'Uitvoeringslogboek:',
  'k8sRetryBackoff.btnClearLogs': 'Logboeken wissen',
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
  'k8sRetryBackoff.apiSummary':
    'RxJS operator die Kubernetes 429 antwoorden met backoff herhaalt met servergegeven vertragingen of fallback backoff.',
  'k8sRetryBackoff.paramConfig': 'Optionele configuratie voor maximale pogingen en terugvalvertraging.',
  'k8sRetryBackoff.delaySummary':
    'Helper functie die de retry vertraging in milliseconden haalt uit een Kubernetes 429 fout respons, of geeft nul als niet opnieuw te proberen.',
  'k8sRetryBackoff.paramError': 'De te inspecteren fout (HttpErrorResponse of object met status/headers/error).',
  'k8sRetryBackoff.paramFallbackDelay': 'Terugvalvertraging in milliseconden indien het antwoord geen hint bevat.',
  'k8sRetryBackoffInterceptor.overview':
    '<code>k8sRetryBackoffInterceptor</code> herhaalt automatisch Kubernetes 429 antwoorden voor idempotente methoden. Het volhoudt Retry-After en details.retryAfterSeconds, met exponentiële fallback, jitter, wachttijdbudget en HttpContext opt-out. POST/PATCH vereisen expliciete opt-in.',
  'k8sRetryBackoffInterceptor.callout':
    '<strong>Global Protection with Request Overrides:</strong> Registreer de interceptor één keer in <code>app.config.ts</code> om alle endpoints te beschermen. Voor individuele aanvragen die moeten worden genegeerd of met aangepaste limieten moeten worden gebruikt, stel de <code>K8S_RETRY_BACKOFF_CONFIG</code> contexttoken op de <code>HttpClient</code> aanroep. Voor lokale pijplijncontrole in plaats hiervan, zie de <code>retryOnK8sBackoff</code> operator.',
  'k8sRetryBackoffInterceptor.example1Title': 'Voorbeeld 1: Globale interceptorregistratie & interactieve simulator',
  'k8sRetryBackoffInterceptor.example1Desc':
    'Registreer de interceptor globaal in app.config.ts. Alle HttpClient-aanroepen worden automatisch herhaald bij HTTP 429:',
  'k8sRetryBackoffInterceptor.selectMode': 'Interceptor-contextmodus:',
  'k8sRetryBackoffInterceptor.modeDefault': 'Standaard globale interceptor (Probeert 429 na 1s opnieuw, daarna 200 OK)',
  'k8sRetryBackoffInterceptor.modeCustom': 'Aangepaste HttpContext (maxAttempts: 2, basis: 400ms, gelijk aan jitter)',
  'k8sRetryBackoffInterceptor.modeDisabled': 'Uitgeschakeld via HttpContext (K8S_RETRY_BACKOFF_CONFIG: onwaar)',
  'k8sRetryBackoffInterceptor.btnSend': 'Onderschept verzoek verzenden',
  'k8sRetryBackoffInterceptor.example2Title': 'Voorbeeld 2: Aanpassing per verzoek en uitsluiting via HttpContext',
  'k8sRetryBackoffInterceptor.example2Desc':
    'Gebruik K8S_RETRY_BACKOFF_CONFIG in HttpContext om limieten aan te passen of retries uit te schakelen voor snelle health-checks:',
  'k8sRetryBackoffInterceptor.apiSummary':
    'Functioneel HTTP-intercepteur dat backoff-gebaseerde retry-toepassingen toepast op Kubernetes HTTP 429 antwoorden.',
  'k8sRetryBackoffInterceptor.factorySummary':
    'Factory functie het creëren van een HttpInterceptorFn met aangepaste standaard backoff configuratie.',
  'k8sRetryBackoffInterceptor.paramDefaultConfig':
    'Standaardconfiguratie toegepast op alle verzoeken tenzij overschreven via HttpContext.',
  'k8sRetryBackoffInterceptor.tokenSummary':
    'HttpContextToken om retry-gedrag per verzoek aan te passen of uit te schakelen.',
  'ifValidator.overview':
    'ngx-lift biedt nuttige functies voor het maken van conditionele validators in Angular Reactive Forms. Conditionele validators laten je op basis van een gegeven voorwaarde opgegeven validatorfuncties toepassen. Er zijn twee hoofdfuncties geïmporteerd: <code>ifValidator</code> voor synchrone validators en <code>ifAsyncValidator</code> voor asynchrone validators.',
  'ifValidator.example1Title': 'Voorbeeld 1: Voorwaardelijke Validator',
  'ifValidator.example1Desc':
    'Vereist een reden invoer en een e-mail invoer alleen wanneer de optie "Sorry" is geselecteerd. De vereiste validator wordt alleen toegepast op de tekst invoer controle wanneer de optie "Sorry" is gekozen.',
  'ifValidator.question': 'Vind je dit gereedschap leuk?',
  'ifValidator.optLike': 'Natuurlijk.',
  'ifValidator.optUnlike': 'Sorry.',
  'ifValidator.emailHelper': 'Veld alleen vereist wanneer u Sorry kiest',
  'ifValidator.invalidEmail': 'Ongeldige e-mail',
  'ifValidator.reasonLabel': 'Reden waarom je niet wilt',
  'ifValidator.autoRevalidationTitle': 'Automatische hervalidatie:',
  'ifValidator.autoRevalidationDesc':
    'Standaard re-evalueert Angular alleen de validators van een control wanneer de waarde van die control verandert. Paar met <code>revalidateOnChange([email, reason], choice)</code> of geef een <code>Signal&lt;boolean&gt;</code> met <code>revalidateOnChange</code> om automatisch hervalidatie te activeren wanneer de bron van de voorwaarde bijwerkt!',
  'ifValidator.example2Title': 'Voorbeeld 2: ifAsyncValidator',
  'ifValidator.example2Desc':
    '<code>ifAsyncValidator</code> deelt overeenkomsten met <code>ifValidator</code>, maar verschilt in die zin dat het twee parameters accepteert: de conditie en een AsyncValidation functie, speciaal ontworpen voor het verwerken van asynchrone operaties.',
  'ifValidator.apiSummary':
    'Creëert een conditionele validator die validatorfuncties toepast op basis van een voorwaarde.',
  'ifValidator.paramCondition':
    'Functie die terugkeert naar waar om trueValidatorFn toe te passen, of onjuist om falseValidatorFn toe te passen.',
  'ifValidator.paramTrueValidatorFn': 'Validator function(s) toegepast wanneer toestand waar is.',
  'ifValidator.paramFalseValidatorFn': '(Optioneel) Validator function(s) toegepast wanneer toestand is onjuist.',
  'ifAsyncValidator.apiSummary':
    'Creëert een conditionele asynchrone validator die een asynchrone validatorfunctie toepast op basis van een voorwaarde.',
  'ifAsyncValidator.paramCondition': 'Functie die bepaalt of de async validator moet worden toegepast.',
  'ifAsyncValidator.paramAsyncValidatorFn': 'De async validatorfunctie om uit te voeren wanneer de conditie waar is.',
  'intersectionValidator.overview':
    'De <code>intersectionValidator</code> is een aangepaste Angular Forms validator die ervoor zorgt dat twee formcontroles geen overlappende waarden hebben. Bijvoorbeeld, je zou twee lijsten met items hebben en willen ervoor zorgen dat ze geen dubbels bevat. Wanneer er overlapping is tussen de arrays, zullen beide velden en het formaat het <code>{intersection: true}</code> foutmelding hebben.',
  'intersectionValidator.example1Title': 'Voorbeeld 1: Valideren Niet-overlappende Arrays',
  'intersectionValidator.example1Desc':
    'Zorg ervoor dat meegeleverde namespaces en uitgesloten namespaces elkaar niet overlappen. Beide velden moeten arrays teruggeven.',
  'intersectionValidator.includedNamespaces': 'Inclusief naamruimtes',
  'intersectionValidator.excludedNamespaces': 'Uitgesloten naamruimtes',
  'intersectionValidator.overlapError': 'Inbegrepen naamruimtes en uitgesloten naamruimtes kunnen niet overlappen',
  'intersectionValidator.overlapAlert': 'Inclusief namespaces en uitgesloten namespaces hebben overlappingen',
  'intersectionValidator.returnsDesc':
    "Een validatorfunctie die <code>{intersection: true}</code> retourneert als de arrays elkaar overlappen, of <code>null</code> als ze dat niet doen. U kunt deze fout controleren in het formulier door <code>form.errors?.['intersection']</code> te openen.",
  'intersectionValidator.apiSummary':
    'Valideert dat twee array-gevulde formcontroles geen overlappende elementen bevatten.',
  'intersectionValidator.paramArray1Key': 'De naam van de eerste vorm controle.',
  'intersectionValidator.paramArray2Key': 'De naam van de tweede vorm controle.',
  'uniqueValidator.overview':
    'De <code>uniqueValidator</code> is een aangepaste Angular Forms validator die controleert op unicititeit over meerdere velden binnen een <code>FormArray</code> of <code>FormGroup</code>. Het zorgt ervoor dat de waarde van elke controle uniek is among alle andere controles binnen de array of groep.',
  'uniqueValidator.example1Title': 'Voorbeeld 1: Array of FormControls',
  'uniqueValidator.example1Desc':
    'Als u een array van individuele FormControls hebt en wilt zorgen voor uniciteit, bevestig dan <code>UniqueValidator.unique()</code> aan de FormArray die u wilt valideren.',
  'uniqueValidator.calloutSameValue': 'Typ dezelfde waarde in onder controle en zie het effect bij vervaging.',
  'uniqueValidator.controlLabel': 'Controle',
  'uniqueValidator.controlHelper': 'Controlewaarde moet uniek zijn',
  'uniqueValidator.duplicated': 'Gedupliceerd',
  'uniqueValidator.example2Title': 'Voorbeeld 2: Array of FormGroups with Key-Value Pairs',
  'uniqueValidator.example2Desc':
    'In een meer complexe situatie, stel je voor dat je een array van <code>FormGroups</code> hebt, elk bevat key-value pairs als <code>FormControls</code>. Je wilt ervoor zorgen dat de unicititeit van de waarde van de keycontroles (onderstaande linkercontroles) over alle groepen is. Voor deze situatie kan je een controleselector als argument doorgeven aan <code>UniqueValidator.unique(controlSelector)</code>.',
  'uniqueValidator.keyCallout': 'Typ dezelfde waarde in ondertoetsen en zie het effect bij vervaging.',
  'uniqueValidator.keyPlaceholder': 'sleutelbesturing',
  'uniqueValidator.keyHelper': 'sleutelcontrole moet uniek zijn',
  'uniqueValidator.valuePlaceholder': 'waardecontrole',
  'uniqueValidator.valueHelper': 'waardecontrole heeft geen validatie',
  'uniqueValidator.returnsDesc':
    'Een validatorfunctie die <code>{notUnique: true}</code> teruggeeft als dubbele waarden worden gevonden, of <code>null</code> als alle waarden uniek zijn.',
  'uniqueValidator.usageNotes': 'Opmerkingen over het gebruik',
  'uniqueValidator.usageNotesDesc':
    'Gebruik de <code>updateValueAndValidity()</code>-methode van de control als dat nodig is om opnieuw te valideren wanneer de waarden veranderen.',
  'uniqueValidator.apiSummary': 'Valideert unicititeit over FormArray-controles of arraywaarden.',
  'uniqueValidator.paramKey':
    '(Optioneel) Eigenschap sleutel om de uniciteit van object items te controleren. Indien weggelaten, controleert primitieve gelijkheid.',
  'dateRangeValidator.overview':
    'De <code>dateRangeValidator</code> is een aangepaste validator die valideert dat een datum binnen een opgegeven bereik valt. Het ondersteunt validatie voor zowel datum-alleenwaarden als datum-tijdwaarden, met configurerbare inclusieve/uitgesloten grenzen en optionele tijdsgelijkaardigheid.',
  'dateRangeValidator.example1Title': 'Voorbeeld 1: Datumbereikvalidatie',
  'dateRangeValidator.example1Desc':
    'Valideer dat een datum tussen een minimaal en een maximum datum valt. Deze configuratie zorgt ervoor dat de geselecteerde datum tussen 1 september 2024 en 15 september 2024 (uitgesloten) valt, zonder rekening te houden met de tijdscomponenten. 15 september is niet geldig omdat <code>maxInclusive</code> false is.',
  'dateRangeValidator.example2Title': 'Voorbeeld 2: Selecteer een toekomstige datum',
  'dateRangeValidator.example2Desc':
    'Hieronder kunt u een toekomstige datum te selecteren en te omvatten vandaag. Om de <code>minDate</code>, zet <code>minInclusive</code> op <code>true</code>.',
  'dateRangeValidator.expiresRawLabel': 'Geldigheidsduur (Raw HTML-invoer)',
  'dateRangeValidator.minDateError': 'De datum kan niet eerder zijn dan {{ minDate }}',
  'dateRangeValidator.futureDaysLabel': 'Toekomst 5 dagen (Clarity datuminvoer)',
  'dateRangeValidator.invalidDate': 'De datum is ongeldig',
  'dateRangeValidator.maxDateError': 'De datum kan niet later zijn dan {{ maxDate }}',
  'dateRangeValidator.clarityMax': 'De datum is te laat (validering van de juistheid)',
  'dateRangeValidator.clarityMin': 'De datum is te vroeg (validering van de juistheid)',
  'dateRangeValidator.minMaxCallout':
    'We kunnen het <code>min</code> en <code>max</code> patroon gebruiken om het bereik te valideren. Echter, deze validatie zal niet falen bij het typen van een getal als 12 of een string als 12hello.',
  'dateRangeValidator.example3Title': 'Voorbeeld 3: Validatie van datum en tijdbereik',
  'dateRangeValidator.example3Desc':
    'Om zowel datum als tijd te valideren, stel <code>compareTime</code> in op true. Met de onderstaande configuratie moet de geselecteerde datum en tijd tussen 1 september 2024 om middag UTC en 2 september 2024 om middag UTC vallen, rekening houdend met de tijdscomponenten.',
  'dateRangeValidator.dateTimeExpires': 'Geldigheidsduur',
  'dateRangeValidator.dateTimeMinError': 'De datumtijd kan niet eerder zijn dan {{ minDate }}',
  'dateRangeValidator.dateTimeMaxError': 'De datumtijd kan niet later zijn dan {{ maxDate }}',
  'dateRangeValidator.returnsDesc': 'Een validatorfunctie die gebruikt kan worden met Angular Reactive Forms.',
  'dateRangeValidator.validationErrors': 'Validatiefouten',
  'dateRangeValidator.errInvalidDate': 'Teruggeven wanneer de datum ongeldig is (bijv. "2023-13-01" of "hallo world")',
  'dateRangeValidator.errMinDate':
    'Geeft terug wanneer de geselecteerde datum eerder is dan of gelijk is aan de minimaal toegestane datum. De foutwaarde is de minimaal toegestane datum die is geformatteerd als een ISO-tekenreeks.',
  'dateRangeValidator.errMaxDate':
    'Geeft terug wanneer de geselecteerde datum later is dan of gelijk is aan de maximaal toegestane datum. De foutwaarde is de maximaal toegestane datum geformatteerd als een ISO-tekenreeks.',
  'dateRangeValidator.apiSummary':
    'Valideert dat een datumwaarde binnen een opgegeven minDate en/of maxDate bereik valt.',
  'dateRangeValidator.paramOptions': 'DateRangeOptions configureert minDate, maxDate en inclusiviteitsvlaggen.',
  'dateRangeValidator.optMinDate': 'Minimum aanvaardbare datum.',
  'dateRangeValidator.optMaxDate': 'Maximale aanvaardbare datum.',
  'dateRangeValidator.optMinInclusive': 'Of de minimale datum inclusief is. Standaardwaarde is true.',
  'dateRangeValidator.optMaxInclusive': 'Of de maximale datum inclusief is. Standaardwaarden zijn true.',
  'rangePipe.overview':
    "De <code>range</code> pipe genereert een array van getallen binnen een opgegeven bereik, waarmee het ideaal is voor het maken van dropdownopties, paginatooltips of elk scenario dat numerieke reeksen in sjablonen vereist. Bij het werken met Angular-sjablonen, kan je er mogelijk voor zorgen dat een array van getallen wordt gegenereerd voor iteratie. Bijvoorbeeld, als je het getal 20 hebt en een array van 1 tot 20 wilt genereren om te weergeven in een dropdownlijst, kan Angular's <code>@for</code> directie dit niet direct itereren. Hoewel je dit in TypeScript kunt genereren, zijn er gevallen waarin het het meest praktisch is om de array rechtstreeks in de sjabloon te genereren.",
  'rangePipe.callout1':
    'De <code>range</code> pijp creëert een reeks getallen (positief en/of negatief) die van start naar, <strong>maar niet inbegrepen, end</strong>.',
  'rangePipe.callout2': 'Een stap van -1 wordt gebruikt als een negatieve start wordt opgegeven zonder einde of stap.',
  'rangePipe.callout3':
    'Als het einde niet is opgegeven, is het ingesteld om te beginnen met start en dan ingesteld op 0.',
  'rangePipe.callout4':
    'Een <code>range</code> utility functie is ook beschikbaar voor gebruik in TypeScript, die geïmporteerd kan worden vanuit <code>ngx-lift</code>.',
  'rangePipe.example1Title': 'Voorbeeld 1: Basisbereik',
  'rangePipe.example1Desc': 'Genereer arrays met verschillende begin- en eindwaarden:',
  'rangePipe.example2Title': 'Voorbeeld 2: Met stapwaarde',
  'rangePipe.example2Desc': 'Genereer arrays met een aangepaste stapwaarde:',
  'rangePipe.example3Title': 'Voorbeeld 3: Reverse Array',
  'rangePipe.example3Desc': 'Genereer arrays in omgekeerde volgorde:',
  'rangePipe.example4Title': 'Voorbeeld 4: Dropdown-selectie',
  'rangePipe.example4Desc':
    'Genereer CPU-telopties voor een dropdown. Dit is handig bij het weergeven van een lijst met computers met verschillende maximale CPU-tellingen en het toestaan van gebruikers om een CPU-bereik te selecteren.',
  'rangePipe.cpuLabel': 'Kies CPU-telling',
  'rangePipe.cpuOption': '{{ count }} CPU(s)',
  'rangePipe.returnsDesc': 'Een reeks getallen binnen het opgegeven bereik.',
  'rangePipe.apiSummary': 'Angular-pipe die een array van getallen binnen een opgegeven bereik genereert.',
  'rangePipe.paramValue': 'Schrijf [einde], [begin, einde], [begin, eind, stap] of [begin, eind, stap, inclusief].',
  'isHttpsPipe.overview':
    'De <code>isHttps</code>-pijp is een Angular-pijp die controleert of een URL-strings het HTTPS-protocol gebruikt. Het is handig voor voorwaardegebaseerd renderen, validatie of beveiligingscontrole in sjablonen. Een overeenkomende <code>isHttps</code>-hulpfunctie is ook beschikbaar voor gebruik in TypeScript.',
  'isHttpsPipe.example1Title': 'Voorbeeld 1: Basisgebruik',
  'isHttpsPipe.example1Desc': 'Controleer of een URL HTTPS protocol gebruikt:',
  'isHttpsPipe.example2Title': 'Voorbeeld 2: Voorwaardelijke rendering',
  'isHttpsPipe.example2Desc': 'Voorwaardelijk render componenten op basis van HTTPS-status:',
  'isHttpsPipe.example3Title': 'Voorbeeld 3: Beveiligingsvalidatie',
  'isHttpsPipe.example3Desc': 'Geef beveiligingsindicatoren weer op basis van het protocol:',
  'isHttpsPipe.apiSummary': 'Angular-pijp die controleert of een URL-strings het HTTPS-protocol gebruikt.',
  'isHttpsPipe.paramValue': 'De te controleren URL-tekenreeks.',
  'isHttpsPipe.returnsDesc': 'true als de URL HTTPS protocol gebruikt, anders onjuist.',
  'arrayJoinPipe.overview':
    'De <code>arrayJoin</code>-pijp is een Angular-pijp die elementen van een array verenigd in een string met een opgegeven separator. Het biedt een handige manier om arraygegevens als komma-gezonderde of aangepaste separator-gezonderde strings in sjablonen weer te geven.',
  'arrayJoinPipe.example1Title': 'Voorbeeld 1: Basisgebruik',
  'arrayJoinPipe.example1Desc': 'Sluit array-elementen aan bij de standaard komma-afscheider:',
  'arrayJoinPipe.example2Title': 'Voorbeeld 2: Aangepaste separators',
  'arrayJoinPipe.example2Desc': 'Gebruik verschillende scheidingstekens voor verschillende gebruikscases:',
  'arrayJoinPipe.example3Title': 'Voorbeeld 3: Numeriek arrays',
  'arrayJoinPipe.example3Desc': 'Voeg numerieke arrays met verschillende scheidingstekens toe:',
  'arrayJoinPipe.apiSummary':
    'Angular-pijp die elementen van een array verenigd in een string met een opgegeven separator.',
  'arrayJoinPipe.paramValue': 'De array om mee te doen. Zo niet een array, geeft de waarde terug als-is.',
  'arrayJoinPipe.paramSeparator':
    '(Optioneel) De te gebruiken scheidingstekensreeks tussen elementen. Standaard op ",".',
  'arrayJoinPipe.returnsDesc':
    'Een tekenreeks die de samengevoegde array-elementen bevat, of de oorspronkelijke waarde, zo niet een array.',
  'maskPipe.overview':
    'De <code>mask</code>-pijp is een Angular-pijp die gevoelige stringgegevens maskereert door tekens te vervangen met sterretjes, terwijl het een configurabele aantal tekens behoudt aan het begin en einde. Het is ideaal om gevoelige informatie in gebruikersinterfaces te verbergen, zoals creditcardnummers, telefoonnummers of API-sleutels.',
  'maskPipe.example1Title': 'Voorbeeld 1: Basisgebruik',
  'maskPipe.example1Desc':
    'Masker gevoelige tekenreeksen met standaardinstellingen (6 tekens zichtbaar bij begin en einde):',
  'maskPipe.example2Title': 'Voorbeeld 2: Aangepaste maskeropties',
  'maskPipe.example2Desc': 'Pas het aantal zichtbare tekens aan het begin en einde van de string aan:',
  'maskPipe.example3Title': 'Voorbeeld 3: Credit Card Masking',
  'maskPipe.example3Desc': 'Masker creditcard nummers terwijl de laatste 4 cijfers:',
  'maskPipe.example4Title': 'Voorbeeld 4: Masker aan/uit',
  'maskPipe.example4Desc': 'Voorwaardelijk gevoelige gegevens tonen/verbergen:',
  'maskPipe.maskingConditions': 'Maskervoorwaarden',
  'maskPipe.conditionsDesc': 'De pijp gebruikt maskering op basis van de volgende voorwaarden:',
  'maskPipe.cond1':
    'De lengte van de invoerstring moet groter zijn dan de som van <code>unmaskedPrefixLength</code> en <code>unmaskedSuffixLength</code>.',
  'maskPipe.cond2': '<code>unmaskedPrefixLength</code> en <code>unmaskedSuffixLength</code> mogen niet negatief zijn.',
  'maskPipe.cond3': 'De <code>masked</code> optie moet <code>true</code> zijn.',
  'maskPipe.condFallback':
    'Als niet aan een van deze voorwaarden wordt voldaan, wordt de originele string ongewijzigd teruggegeven.',
  'maskPipe.apiSummary':
    'Angular-pijp die gevoelige stringgegevens maskereert door tekens te vervangen met sterretjes.',
  'maskPipe.paramValue': 'De invoer tekenreeks die gemaskeerd moet worden.',
  'maskPipe.paramOptions': 'Configuratie-opties voor het maskeren van gedrag.',
  'maskPipe.returnsDesc':
    'De gemaskerde tekenreeks, of de originele tekenreeks als het maskeren is uitgeschakeld of de tekenreeks is te kort.',
  'maskPipe.optUnmaskedPrefixLength': 'Aantal tekens dat aan het begin ontmaskerd moet worden. Standaardwaarde tot 6.',
  'maskPipe.optUnmaskedSuffixLength': 'Aantal tekens dat aan het einde ontmaskerd moet worden. Standaard naar 6.',
  'maskPipe.optMaskChar': 'Teken gebruikt voor het maskeren. Standaard "*."',
  'maskPipe.optEnabled': 'Of maskeren is ingeschakeld. Standaardwaarden zijn true.',
  'byteConverterPipe.overview':
    'De <code>byteConverter</code>-pijp converteert numerieke bytewaarden in menselijke leesbare bestandsgroottesstrings (bijvoorbeeld „1.5 MB“, „2.3 GB“) met lokale bewustzijn. Het handhaaft automatisch eenheidconversie (BYTE, KB, MB, GB, TB) en ondersteunt internationalisatie met vertalingen voor meerdere talen, waaronder Engels, Frans, Chinees, Japanse, Koreaans, Duits, Spaans, Italiaans, Portugees en Russisch.',
  'byteConverterPipe.example1Title': 'Voorbeeld 1: Basisgebruik',
  'byteConverterPipe.example1Desc': 'Converteer bytewaarden naar menselijk leesbaar formaat:',
  'byteConverterPipe.example2Title': 'Voorbeeld 2: Bestandsgrootteweergave',
  'byteConverterPipe.example2Desc': 'Bestandsgroottes weergeven in een gebruiksvriendelijk formaat:',
  'byteConverterPipe.example3Title': 'Voorbeeld 3: Verschillende eenheidsconversies',
  'byteConverterPipe.example3Desc': 'De pijp converteert automatisch naar de juiste eenheid:',
  'byteConverterPipe.languageSupport': 'Taalondersteuning',
  'byteConverterPipe.languageSupportDesc':
    'De pijp gebruikt de toepassings-<code>LOCALE_ID</code> om de juiste eenheidstranslaties te bepalen. Ondersteunde talen zijn Engels, Frans, Chinees (vereenvoudigd en traditioneel), Japanse, Koreaans, Duits, Spaans, Italiaans, Portugees (Brazilië) en Russisch. Als de browsertaal niet ondersteund is, wordt Engels als standaard gebruikt.',
  'byteConverterPipe.i18nCallout':
    'Om locale ondersteuning te configureren, zie de <a href="https://angular.io/guide/i18n" target="_blank">Angular i18n documentatie</a>.',
  'byteConverterPipe.apiSummary':
    'Angular-pijp die een aantal bytes converteert in een menselijke leesbare stringindeling met lokale bewustzijn.',
  'byteConverterPipe.paramValue':
    '(Optioneel) Het aantal te converteren bytes. Geeft nul terug als nul, ongedefinieerd, of NaN.',
  'byteConverterPipe.returnsDesc':
    'Een geformatteerde tekenreeks met de juiste eenheid (B, KB, MB, GB, TB) gebaseerd op locale, of nul indien ongeldig.',
  'datagridUtil.transformDesc':
    'De functie converteert de Clarity-datagridtoestand (met paginatie, sorteren en filterinformatie) naar een PageQuery-object. Hier is een voorbeeld van de transformatie:',
  'datagridUtil.inputTitle': 'Invoer: Clarity Datagrid-toestand',
  'datagridUtil.outputTitle': 'Uitvoer: PageQuery-object',
  'datagridUtil.usageDesc':
    'Gebruik convertToHttpParams in uw component om datagrid status te converteren voor API verzoeken:',
  'common.save': 'Opslaan',
  'common.submit': 'Verzenden',
  'statusIndicator.inputIconStatus': 'Status vertegenwoordigd door het pictogram.',
  'statusIndicator.inputIconSize': 'Pictogramgrootte, inclusief sm, md, lg of een pixelgrootte tekenreeks.',
  'statusIndicator.inputTooltip': 'Optionele tekst getoond op zweven of focus.',
  'statusIndicator.inputTooltipPosition': 'Tooltip positie ten opzichte van de trekker.',
  'tooltip.componentTypeExample': 'Inhoud van de component',
  'idleDetection.configIdleDuration': 'Seconden van inactiviteit voordat het aftellen begint.',
  'idleDetection.configTimeoutDuration': 'Aftellen duur in seconden voor timeout.',
  'playground.copyFailed': 'Kopiëren mislukt. Selecteer en kopieer de code handmatig.',
  'header.partialLanguage': 'Gedeeltelijke vertaling; ontbrekende tekst wordt in het Engels getoond.',
  'form.masterPassword': 'Hoofdwachtwoord',
  'form.masterPasswordRequired': 'Hoofdwachtwoord is vereist.',
  'grid.refresh': 'Vernieuwen',
  'grid.firstName': 'Voornaam',
  'grid.lastName': 'Achternaam',
  'grid.email': 'E-mailadres',
  'home.claritySetup': 'Voor begeleiding bij het instellen van Clarity Design System in uw project, verwijzen naar de',
  'home.clarityDocumentation': 'Clarity Design System documentatie',
  'resourceAsync.useResource': 'resourceAsync gebruiken wanneer:',
  'resourceAsync.useComputed': 'computedAsync gebruiken wanneer:',
  'resourceAsync.preferMutation':
    'Voor server schrijft, voorkeur mutateResource. Legacy execute() inzendingen moet lui: waar, reactief: vals en gedrag: uitlaat.',
  'resourceAsync.useRead': 'Beheer lokale leesbewerkingen (GET), met reload() voor resetching.',
  'resourceAsync.useLocal': 'Beheer optimistische lokale staat, gecachede waarden of vormontwerpen met set()/update().',
  'resourceAsync.useManual':
    'Een operatie met reload(), execute() of reset() wordt expliciet geactiveerd of opnieuw ingesteld.',
  'resourceAsync.useStatus': 'Track inactief, laden, herladen, opgelost, fout en lokale staten.',
  'resourceAsync.useLazy': 'Stel de eerste uitvoering uit met lui laden.',
  'resourceAsync.useCancel':
    'Annuleren vervangen leest met switch of onderdrukken overlappende handelingen met uitlaat.',
  'resourceAsync.useComputedReactive':
    'Async-gegevens automatisch opnieuw berekenen wanneer signaalafhankelijkheden veranderen.',
  'resourceAsync.useComputedConcurrency': 'Kies switch, merge, concat of uitlaatgedrag expliciet.',
  'resourceAsync.useComputedValue':
    'Stel een enkel signaal bloot, met een expliciete fout terugval of throwOnError-beleid.',
  'resourceAsync.apiSummary':
    'Een lokale reactieve bron aanmaken met asynchrone toestand, annulatie, expliciete uitvoering en lokale updates.',
  'resourceAsync.errorValuePolicy':
    'Bij een fout wordt de vorige waarde standaard gewist. Gebruik preserveValueOnError: true om deze te behouden.',
  'resourceAsync.notLoaded': 'Niet geladen',
  'resourceAsync.noData': 'Geen gegevens',
  'resourceAsync.lastUpdated': 'Laatst bijgewerkt',
  'resourceAsync.topicTitle': 'Onderwerp / titel',
  'resourceAsync.keyConcepts': 'Sleutelbegrippen:',
  'resourceAsync.patternBenefits': 'Patroonvoordelen:',
  'spinner.inputDecorative': 'Standaard decoratief. Onwaar instellen om laden aan te kondigen als status.',
  'spinner.inputLabel': 'Gelokaliseerd statuslabel; standaard voor het ingebouwde laadbericht.',
  'fileReader.inputControlId': 'ID van de native input, voor associatie met een formulierlabel.',
  'fileReader.inputAcceptFiles':
    'Geaccepteerde tekstbestandstypen. Dit onderdeel leest tekst, geen willekeurige binaire bestanden.',
  'fileReader.inputEncoded': 'Emit tekst als base64 indien ingeschakeld.',
  'fileReader.inputTextEncoding': 'UTF-8 standaard; kies latin1 bij het consumeren van legacy base64 byte strings.',
  'fileReader.inputMaxSize': 'Maximale grootte in MiB. Oversized bestanden worden afgewezen voor het lezen.',
  'fileReader.inputDisabled': 'Bestandsselectie en -verwijdering uitschakelen.',
  'fileReader.outputChange': 'Emits tekst of base64 na een succesvolle bestandsselectie.',
  'k8sRetryBackoff.paramJitter': 'Evenveel jitter wacht tussen de helft en het volledige exponentiële plafond.',
  'k8sRetryBackoff.paramHintJitter': 'Extra willekeurig wachten na een server hint, in milliseconden.',
  'k8sRetryBackoff.paramMaxDelay':
    'Maximale individuele wachttijd. Een langere server hint stopt opnieuw zonder de hint te verkorten.',
  'k8sRetryBackoff.paramWaitBudget': 'Cumulatieve geplande wachtbudget; exclusief tijd besteed aan netwerkverzoeken.',
  'k8sRetryBackoff.paramMethods':
    'Interceptor-only method allowlist. POST/PATCH vereisen expliciete opt-in en eindpunt idempotency.',
  'k8sRetryBackoff.paramRandom':
    'Willekeurige bron geeft een eindig getal terug in [0, 1), voor deterministische planning.',
  'k8sRetryBackoff.retryContract':
    'Standaard: vijf pogingen, exponentiële fallback met gelijke jitter, maximaal 250ms extra op serverhint, 30 seconden per wachten en 60 seconden tot geplande wachten. Oversized hints stoppen retries. Interceptoren herstellen idempotente methoden standaard; POST/PATCH vereisen een endpointgarantie.',
  'k8sRetryBackoff.paramMinDelay':
    'Minimale terugval wacht op elke jitter strategie; kan niet hoger zijn dan maxDelayMs. Server hints zijn ongewijzigd.',
  'k8sRetryBackoff.paramStatuses':
    'In aanmerking komende HTTP-statussen. Andere fouten verspreiden zich ongewijzigd; aanvullende statussen vereisen een evaluatie van het eindpunt.',
  'k8sRetryBackoff.paramPredicate':
    'Extra foutfilter, toegepast na de statuscontrole. Het activeert POST/PATCH zelf niet.',
  'k8sRetryBackoff.paramLogRetries': 'Activeer opnieuw loggen na de vertraging passeert de wacht budget controles.',
  'k8sRetryBackoff.paramLabel':
    'Log label. Gegenereerde interceptor labels laten query strings en fragmenten weg; redact aangepaste labels.',
  'k8sRetryBackoff.paramLogger':
    'Optionele logger die attempt, maxRetries, delayMs, error en label ontvangt. Scherm gevoelige foutgegevens af; fouten in de logger stoppen de herhaalde pogingen niet.',
  'k8sRetryBackoffInterceptor.postDefault': 'POST: standaard (geen herhaling)',
  'k8sRetryBackoffInterceptor.postOptIn': 'POST: expliciete Kubernetes opt-in',
  'k8sRetryBackoffInterceptor.postGateway': 'POST: gateway 429 (verworpen)',
  'demoApi.key-value-inputs-demo.inputs.formArray':
    'De FormArray-instansie van de parentcomponent gebruikt om de sleutel-waardeparen te beheren.',
  'demoApi.key-value-inputs-demo.inputs.data':
    'Initialgegevens om de formulier te voorzien van bestaande sleutel-waardeparen.',
  'demoApi.key-value-inputs-demo.inputs.uniqueKey':
    'Stel <code>true</code> in om unieke sleutelvalidatie te inschakelen. Gebruik <code>UniqueValidator</code> van ngx-lift.',
  'demoApi.key-value-inputs-demo.inputs.keyHelper': 'Hulp tekst voor het sleutel invoerveld.',
  'demoApi.key-value-inputs-demo.inputs.valueHelper': 'Hulp tekst voor het waarden invoerveld.',
  'demoApi.key-value-inputs-demo.inputs.addText': "Knop 'Sleutel-waarde paar toevoegen'.",
  'demoApi.key-value-inputs-demo.inputs.inputSize': 'Grootte van de invoervelden.',
  'demoApi.key-value-inputs-demo.inputs.buttonClass':
    "Aan te passen klasse voor de knop 'Sleutel-waarde paar toevoegen'.",
  'demoApi.key-value-inputs-demo.inputs.smartMode':
    'Als ingesteld op <code>true</code>, zal de component automatisch een sleutel-waarde paar aanmaken wanneer er geen sleutel-waarde invoervelden zijn.',
  'demoApi.key-value-inputs-demo.inputs.keyPattern':
    'Als de sleutel controle een aangepaste reguliere expressie moet doorgeven. U kunt een object met twee sleutels doorgeven: <code>regex</code> en <code>message</code>. De message-eigenschap is optioneel.',
  'demoApi.key-value-inputs-demo.inputs.valuePattern':
    'Soortgelijk aan <code>keyPattern</code>, maar gebruikt voor validatie van de waarde controle.',
  'demoApi.key-value-inputs-demo.outputs.removeKeyValue':
    'Gebeurtenis uitgezonden wanneer een sleutel-waarde paar wordt verwijderd. Bevat de index van het verwijderde paar.',
  'demoApi.key-value-inputs-demo.outputs.addKeyValue':
    'Gebeurtenis uitgezonden wanneer een nieuw sleutel-waarde paar wordt toegevoegd.',
  'demoApi.multi-alerts-demo.methods.addAlert(options: Alert)': 'Voegt een nieuw alert toe met de opgegeven opties.',
  'demoApi.multi-alerts-demo.methods.deleteAlert(id: symbol)': 'Verwijder een alert door haar ID.',
  'demoApi.multi-alerts-demo.methods.clearAlerts()': 'Legt alle alerts leeg.',
  'demoApi.multi-alerts-demo.alertProperties.content': 'De meldingstekst. Zeker HTML-formatering is ondersteund.',
  'demoApi.multi-alerts-demo.alertProperties.alertType': 'Het type alert.',
  'demoApi.multi-alerts-demo.alertProperties.actions':
    'Native knoppen. Elke actie bevat <code>label: string</code> en <code>onClick: () => void</code>.',
  'demoApi.multi-alerts-demo.alertProperties.isAppLevel': 'Of dit een toepassingsniveau alert is.',
  'demoApi.multi-alerts-demo.alertProperties.targetSelector':
    'De selector (ID, klasse, etc.) van een klikbare element (knop, link, etc.) binnen het alert-inhoud.',
  'demoApi.multi-alerts-demo.alertProperties.onTargetClick':
    'Callback uitgevoerd wanneer het element dat overeenkomt met <code>targetSelector</code> binnen het alert-inhoud is geklikt.',
  'demoApi.theme-toggle-demo.componentInputs.lang': 'Explicit taalcode voor gedeclareerde tooltips.',
  'demoApi.theme-toggle-demo.componentOutputs.changeTheme':
    "Stuurt <code>ClarityTheme</code> ('light' | 'dark') wanneer het thema is gegooid.",
  'demoApi.theme-toggle-demo.serviceProperties.theme': "Huidig actief thema ('light' | 'dark').",
  'demoApi.theme-toggle-demo.serviceMethods.setTheme(newTheme: ClarityTheme)':
    'Stelt het thema in, bewaart naar opslag en updatert het DOM.',
  'demoApi.timeline-wizard-demo.wizardInputs.timelineSteps':
    'Een array van <code>TimelineStep</code>-objecten die de stappen in de wizard vertegenwoordigen.',
  'demoApi.timeline-wizard-demo.wizardInputs.live':
    'Beheert of de stapcomponenten moeten worden vernietigd wanneer prev/next knoppen worden geklikt.',
  'demoApi.timeline-wizard-demo.wizardInputs.confirmButtonText': 'De tekst voor de "Finish"-knop op de laatste stap.',
  'demoApi.timeline-wizard-demo.wizardOutputs.confirmed':
    "Stuurt alle vorige stappen' data wanneer de finishknop in de laatste stap is geklikt.",
  'demoApi.timeline-wizard-demo.wizardOutputs.canceled': 'Stuurt wanneer de wizard is geannuleerd.',
  'demoApi.timeline-wizard-demo.wizardOutputs.finished': 'Stuurt wanneer de wizard succesvol is voltooid.',
  'demoApi.timeline-wizard-demo.wizardMethods.cancel()':
    'Annuleert de wizard en stuurt het <code>canceled</code>-gebeurtenis.',
  'demoApi.timeline-wizard-demo.wizardMethods.nextStep()': 'Ga naar de volgende stap in de wizard.',
  'demoApi.timeline-wizard-demo.wizardMethods.previousStep()': 'Ga naar de vorige stap in de wizard.',
  'demoApi.timeline-wizard-demo.baseProperties.allStepsData':
    'Een array met de data van alle wizardstappen. Beschikbaar als een invoerproperty, toegankelijk in <code>ngOnInit</code> en later lifecycle hooks.',
  'demoApi.timeline-wizard-demo.baseProperties.currentStepData':
    'De data van de huidige stap of <code>null</code> als het niet beschikbaar is. Beschikbaar als een invoerproperty, toegankelijk in <code>ngOnInit</code> en later lifecycle hooks.',
  'demoApi.timeline-wizard-demo.baseProperties.form':
    'De formgroep die is gekoppeld aan de stap. Stel in op <code>null</code> voor stappen zonder form. Verander deze eigenschap in je stapcomponent.',
  'demoApi.timeline-wizard-demo.baseProperties.next$':
    "Een observabel dat wordt uitgezonden wanneer de knop 'Volgende' is geklikt. Verander dit om aangepaste acties uit te voeren, zoals API-aanroepen.",
  'demoApi.timeline-wizard-demo.baseProperties.stepInvalid': 'Aanduiding of de stapformulier ongeldig is.',
  'demoApi.timeline-wizard-demo.baseMethods.formValueToData()':
    'Converteert de waarde van het stapformulier naar gegevens. Verander deze methode als de structuur van je formulier niet overeenkomt met de stapgegevensstructuur.',
  'demoApi.timeline-wizard-demo.baseMethods.dataToFormValue(data)':
    'Converteert stapgegevens naar de waarde van het formulier die kan worden gebruikt voor <code>patchValue</code>. Verander deze methode als de structuur van je formulier niet overeenkomt met de stapgegevensstructuur.',
  'demoApi.timeline-wizard-demo.stepProperties.state':
    "De toestand van de timelinestap (bijvoorbeeld 'niet-start', 'huidig', 'succes', 'fout').",
  'demoApi.timeline-wizard-demo.stepProperties.header': 'De header van de timelinestap.',
  'demoApi.timeline-wizard-demo.stepProperties.title':
    'De titel van de timelinestap, die als identificatie werkt (zonder dubbels). Kan worden gebruikt om stapgegevens te zoeken via <code>getStepData</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.id':
    'De id van de timelinestap, die als primair identificatie werkt. Als id niet is gegeven, wordt de titel gebruikt als identificatie in plaats daarvan. Kan worden gebruikt om stapgegevens te zoeken via <code>getStepData</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.description': 'De beschrijving van de timelinestap.',
  'demoApi.timeline-wizard-demo.stepProperties.component':
    'De Angular-component die is gekoppeld aan de timelinestap. Moet uitbreiden van <code>TimelineBaseComponent</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.data':
    'Stapgegevens, die worden geconverteerd naar formuliergegevens door de timelinewizardcomponent en worden doorgegeven aan de stapcomponent als <code>currentStepData</code>.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStepIndex': 'Haal de index van de huidige stap.',
  'demoApi.timeline-wizard-demo.serviceProperties.isFirstStep': 'Controleer of de huidige stap de eerste stap is.',
  'demoApi.timeline-wizard-demo.serviceProperties.isLastStep': 'Controleer of de huidige stap de laatste stap is.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStep': 'Haal het huidige stapobject.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStepData': 'Haal de gegevens van het huidige stap op.',
  'demoApi.timeline-wizard-demo.serviceProperties.allStepsData':
    'Haal alle gegevens van de stappen die moeten worden overzicht gegeven. Geeft een array met stapidentificatoren en gegevens terug.',
  'demoApi.timeline-wizard-demo.serviceMethods.getStepData<T>(key: string)':
    'Haal de gegevens van een specifieke stap op door het id of titel. Geeft <code>null</code> terug als de stap niet gevonden wordt.',
  'demoApi.toast-demo.methods.addToast(options: ToastOptions)': 'Maak een toast aan met de opgegeven opties.',
  'demoApi.toast-demo.methods.success(options: ToastOptions)': 'Maak een succes toast aan met de opgegeven opties.',
  'demoApi.toast-demo.methods.info(options: ToastOptions)': 'Maak een info toast aan met de opgegeven opties.',
  'demoApi.toast-demo.methods.warning(options: ToastOptions)':
    'Maak een waarschuwing toast aan met de opgegeven opties.',
  'demoApi.toast-demo.methods.error(options: ToastOptions)': 'Maak een fout toast aan met de opgegeven opties.',
  'demoApi.toast-demo.toastOptions.title': 'De titel van de toast bericht.',
  'demoApi.toast-demo.toastOptions.description': 'De beschrijving van de toast bericht.',
  'demoApi.toast-demo.toastOptions.toastType': 'Het type toast.',
  'demoApi.toast-demo.toastOptions.date': 'Een relatief tijdstip (bijvoorbeeld "1 uur geleden").',
  'demoApi.toast-demo.toastOptions.manualClosable': 'Of de toast handmatig kan worden afgesloten.',
  'demoApi.toast-demo.toastOptions.timeoutSeconds':
    "Het aantal seconden voorafgaand aan het automatische afsluiten van de toast. Als niet opgegeven, gebruikt het container's standaardwaarde.",
  'demoApi.toast-demo.toastOptions.primaryButtonText': 'Tekst voor de hoofdactie knop.',
  'demoApi.toast-demo.toastOptions.primaryButtonClick': 'Callbackfunctie voor het klikken op de hoofdactie knop.',
  'demoApi.toast-demo.toastOptions.secondaryButtonText': 'Tekst voor de secundaire actieknop.',
  'demoApi.toast-demo.toastOptions.secondaryButtonClick': 'Callbackfunctie voor het klikken op de secundaire knop.',
  'demoApi.toast-demo.toastOptions.closed': 'Callbackfunctie die wordt aangeroepen wanneer de toast is afgesloten.',
  'demoApi.toast-demo.containerInputs.timeoutSeconds': 'Standaard timeout in seconden voor toasts.',
  'demoApi.toast-demo.containerInputs.manualClosable': 'Of toasts standaard kunnen worden manueel afgesloten.',
  'demoApi.toast-demo.containerInputs.topOffset': 'Afstand van de top van het scherm in pixels.',
  'demoApi.tooltip-demo.inputs.cllTooltip':
    'Eenvoudige stringinhoud voor de tooltip. Kan worden gebruikt als afkorting voor <code>cllTooltipContent</code>.',
  'demoApi.tooltip-demo.inputs.cllTooltipContent':
    'De inhoud die wordt weergegeven in de tooltip. Kan een string, sjabloonverwijzing, componentverwijzing of componenttype zijn.',
  'demoApi.tooltip-demo.inputs.cllTooltipContentContext':
    'Het contextobject dat wordt doorgegeven aan de sjabloon wanneer <code>TemplateRef</code> wordt gebruikt als inhoud.',
  'demoApi.tooltip-demo.inputs.cllTooltipWidth': 'Breedte van de tooltip in pixels.',
  'demoApi.tooltip-demo.inputs.cllTooltipPosition':
    "Positie van de tooltip ten opzichte van het element. Opties omvatten 'tooltip-top-right', 'tooltip-top-left', etc.",
  'demoApi.tooltip-demo.inputs.cllTooltipHideDelay':
    'Vertraging in milliseconden voor het verbergen van de tooltip na het verlaten van de muis.',
  'demoApi.mutate-resource.mutateResourceApiProps.mutation':
    'Async functie of observabel die de serverkant schrijfbewerking uitvoert.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.invalidateTags':
    'Tags om te ongeldig maken bij succesvolle schrijfbewerking. Hiermee wordt onmiddellijk herhalen van actieve queries gepland.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.concurrency':
    'Strategie voor overlappende aanroepen: parallel (standaard), exhaust (verbindt in-afwachting), concat (queueert).',
  'demoApi.mutate-resource.mutateResourceApiProps.options.injector':
    'Optionele expliciete Angular Injector voor het registreren van signalen buiten het injectiecontext.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.client':
    'Optionele expliciete QueryClient-overschrijving (standaardwaarde QUERY_CLIENT token).',
  'demoApi.mutate-resource.mutateResourceRefApiProps.value':
    'Signal die de laatste succesvol opgeloste mutatieresultaat houdt.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.error':
    'Signal dat het meest recente mutatiefoutmelding houdt, of null wanneer het gezond is.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.status': 'Granulair mutatielevenscyclusstatus.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.isLoading': 'Waarbij de mutatieoperatie wordt uitgevoerd.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.mutate(args)':
    'Triggers de mutatie met argumenten en retourneert een Promise die met het resultaat of afwijzing instelt.',
  'demoApi.query-resource.queryResourceApiProps.definition':
    'Reactieve factory met een Observable- of Promise-loader; undefined schakelt de resource uit.',
  'demoApi.query-resource.queryResourceApiProps.options.pollInterval':
    'Milliseconden tussen voltoegde aanvragen. Coordinated across all active observers.',
  'demoApi.query-resource.queryResourceApiProps.options.injector':
    'Optionele expliciete Angular Injector voor signal registratie buiten injectiecontext.',
  'demoApi.query-resource.queryResourceApiProps.options.client':
    'Optionele expliciete QueryClient-overschrijving (standaardwaarde QUERY_CLIENT token).',
  'demoApi.query-resource.queryResourceDefinitionProps.key':
    'Array van JSON-compatibele waarden die uniek de query identificeren (bijvoorbeeld ["user", id]).',
  'demoApi.query-resource.queryResourceDefinitionProps.loader':
    'Data fetcher die { abortSignal, refresh } ontvangt. Observable leesautomatisch voltooid na de eerste emissie.',
  'demoApi.query-resource.queryResourceDefinitionProps.tags':
    'Optionele tags voor cache invalidatie (bijvoorbeeld [{ type: "users" }]).',
  'demoApi.query-resource.queryResourceDefinitionProps.staleTime':
    'Duur in milliseconden voorgegaan voordat gecached data als verouderd wordt beschouwd.',
  'demoApi.query-resource.queryResourceDefinitionProps.gcTime':
    'Duur in milliseconden (standaard 5 minuten) om ongebruikte queries in cache te behouden.',
  'demoApi.query-resource.queryResourceDefinitionProps.cancelOnNoObservers':
    'Of om een in-voortgang transportaanvraag te aborteren als alle observers vooraf ontslagen zijn voordat het voltooid is.',
  'demoApi.query-resource.queryResourceRefApiProps.value': 'Signal met de laatste succesvol opgeloste querygegevens.',
  'demoApi.query-resource.queryResourceRefApiProps.error':
    'Signal met de meest recente fout, of null wanneer het gezond is.',
  'demoApi.query-resource.queryResourceRefApiProps.status':
    'Fijngranaire status: "idle" | "loading" | "reloading" | "resolved" | "error".',
  'demoApi.query-resource.queryResourceRefApiProps.isLoading':
    'Waarheid wanneer de status "loading" of "reloading" is.',
  'demoApi.query-resource.queryResourceRefApiProps.isStale':
    'Waarheid wanneer de gegevens meer dan staleTime overschrijden of door een mutatie geverifieerd zijn.',
  'demoApi.query-resource.queryResourceRefApiProps.hasValue()':
    'Type predicate narrowing waarde() om te verwerpen undefined wanneer geldige gegevens aanwezig zijn.',
  'demoApi.query-resource.queryResourceRefApiProps.reload()':
    'Triggers een achtergrondherlaad zonder bestaande gegevens te wissen (status: "reloading").',
  'demoApi.query-resource.queryResourceRefApiProps.execute()':
    'Verplicht een directe fris ophalen en retourneert een Promise die met het resultaat afsluit.',
  'demoApi.query-resource.queryResourceRefApiProps.destroy()':
    'Verwijdert deze observer zonder het shared queries te cancelen als andere observers blijven.',
  'demoApi.resource-async.definitionProperties.params':
    'Reine reactieve parameter opvangfunctie. Signal lezen hier zijn gevolgd.',
  'demoApi.resource-async.definitionProperties.loader':
    'Factory ontvangt de laatste parameters en context.abortSignal. Signal lezen hier zijn niet gevolgd.',
  'demoApi.resource-async.optionsProperties.defaultValue':
    'Standaardwaarde voor de eerste ophaling; garandeert dat value() T (nooit undefined) retourneert. Alias voor initialValue.',
  'demoApi.resource-async.optionsProperties.preserveValueOnError':
    'Houdt de laatste ontvangen of lokale waarde vast wanneer een fout optreedt.',
  'demoApi.resource-async.optionsProperties.reactive':
    'Ofwel een aangepaste injecteur als buiten een ambient injection context geroepen wordt.',
  'demoApi.resource-async.optionsProperties.injector':
    'Aangepaste gelijkheid vergelijker die aan de onderliggende computed signal wordt doorgegeven.',
  'demoApi.resource-async.optionsProperties.equal':
    'Aangepaste gelijkheid vergelijker die aan de onderliggende computed signal wordt doorgegeven.',
  'demoApi.resource-async.returnsProperties.value': 'Huidige waarde van de resource.',
  'demoApi.resource-async.returnsProperties.error': 'Huidige fout, indien van toepassing.',
  'demoApi.resource-async.returnsProperties.status':
    "Huidige status: 'idle' | 'loading' | 'reloading' | 'resolved' | 'local' | 'error'.",
  'demoApi.resource-async.returnsProperties.isLoading':
    "Signal die true retourneert als een fetch-actie in het proces is ('loading' of 'reloading').",
  'demoApi.resource-async.returnsProperties.isIdle':
    "Signal dat true retourneert als de resource in het 'idle' toestand is (nog nooit opgehaald).",
  'demoApi.resource-async.returnsProperties.hasValue()':
    'Type predicate narrowing waarde() om te uitsluiten dat undefined is wanneer waar.',
  'demoApi.resource-async.returnsProperties.reload()':
    'Handmatig een herlaad van de resource uit te oefenen. Ideaal voor queries (GET).',
  'demoApi.resource-async.returnsProperties.execute()':
    'Handmatig uitvoeren en een awaitable Promise retourneren. Ideaal voor mutaties (POST/PUT/DELETE).',
  'demoApi.resource-async.returnsProperties.set()':
    'Handmatig de waarde van de resource updaten, waardoor de status overgaat naar "local".',
  'demoApi.resource-async.returnsProperties.update()':
    'De waarde van de resource updaten met een updater-functie, waardoor de status overgaat naar "local".',
  'demoApi.resource-async.returnsProperties.reset()':
    "Reset de resource naar de initiële 'idle' toestand en annuleert in-afzender operaties.",
  'demoApi.resource-async.returnsProperties.destroy()':
    'Blijvend stoppen met observatie en annuleer opzettelijke werk.',
  'demoApi.date-range-validator.optionsProperties.compareTime':
    'Of de tijd ook te vergelijken. Standaard is dit false.',
  'certificate.loading': 'Certificaat laden…',
  'certificate.loadFailed':
    'De certificaatgegevens konden niet worden geladen. Vernieuw de pagina en probeer het opnieuw.',
  'fileReader.validationUnavailable':
    'De certificaatvalidatie kon niet worden geladen. Vernieuw de pagina en probeer het opnieuw.',
  'queryExamples.failureTitle': 'Fouten en herstel',
  'queryExamples.failureIntro': 'Behoud geldige gegevens, begrens leesacties en herstel alleen wat mislukte.',
  'queryExamples.initialFailure': 'Fout bij eerste leesactie',
  'queryExamples.initialFailureMessage': 'Nog geen gegevens. Probeer deze leesactie opnieuw.',
  'queryExamples.refreshFailure': 'Vernieuwingsfout met behouden gegevens',
  'queryExamples.refreshFailureMessage': 'Vernieuwen mislukt. Het laatste geslaagde resultaat blijft zichtbaar.',
  'queryExamples.failureData': 'Laatste geslaagde waarde: {0}',
  'queryExamples.retryRead': 'Leesactie herhalen',
  'queryExamples.failRefresh': 'Een vernieuwing laten mislukken',
  'queryExamples.failObserver': 'Waarnemersfout simuleren',
  'queryExamples.automaticRetry': 'Begrensde automatische herhalingen',
  'queryExamples.retryIntro': 'Twee tijdelijke fouten, daarna succes. Lezers delen één herhaallus.',
  'queryExamples.startRetry': 'Observable-herhaling starten',
  'queryExamples.startPromise': 'Promise-herhaling starten',
  'queryExamples.deadline': 'Tijdslimiet voor logische leesactie',
  'queryExamples.deadlineIntro': 'Deze leesactie levert nooit gegevens. De tijdslimiet beëindigt het abonnement.',
  'queryExamples.startDeadline': 'Hangende leesactie starten',
  'queryExamples.deadlineMessage': 'De leesactie heeft de tijdslimiet bereikt. Probeer opnieuw.',
  'queryExamples.canceledReads': 'Geannuleerde abonnementen: {0}',
  'queryExamples.partialFailure': '2. Gedeeltelijke lijstfout en granulair herstel',
  'queryExamples.mutationFailure': 'Schrijffout',
  'queryExamples.mutationIntro':
    'Schrijfacties worden niet automatisch herhaald. Deze simulatie weigert vóór uitvoering.',
  'queryExamples.failWrite': 'Mislukte schrijfactie versturen',
  'queryExamples.submitWrite': 'Schrijfactie versturen',
  'queryExamples.writeMessage': 'Schrijven mislukt. Uw invoer blijft behouden.',
  'queryExamples.failureEvents': 'Definitieve leesfouten: {0}; waarnemerdiagnoses: {1}',
  'queryExamples.isInitialErrorDescription': 'True als lezen mislukt zonder eerdere geslaagde gegevens.',
  'queryExamples.isRefreshErrorDescription': 'True als vernieuwen mislukt terwijl geslaagde gegevens behouden blijven.',
  'queryExamples.updatedAtDescription': 'Tijdstempel van de laatste geslaagde leesactie.',
  'queryExamples.failureCountDescription': 'Mislukte pogingen in de huidige leesactie; nul na succes.',
  'queryExamples.failureReasonDescription': 'Laatste pogingfout of definitieve tijdslimietfout.',
  'queryExamples.nextRetryAtDescription': 'Tijdstempel van de volgende poging; null tijdens lezen of na afronding.',
  'queryExamples.retryDescription': 'Optioneel begrensd herhaalbeleid. Standaard uitgeschakeld.',
  'queryExamples.deadlineDescription': 'Totale tijdslimiet inclusief wachten; false schakelt een geërfde limiet uit.',
  'queryExamples.recoveryFocusDescription': 'Vernieuwen van gevolgde verouderde gegevens bij focus inschakelen.',
  'queryExamples.recoveryReconnectDescription':
    'Vernieuwen van gevolgde verouderde gegevens na herverbinden inschakelen.',
  'queryExamples.title': 'Observable-query’s in de praktijk',
  'queryExamples.intro':
    'Deze voorbeelden gebruiken HttpClient met een lokale mock-API. Wissel van tenant om afzonderlijke gegevens en caches te zien.',
  'queryExamples.tenant': 'Tenant',
  'queryExamples.tenantA': 'Tenant A',
  'queryExamples.tenantB': 'Tenant B',
  'queryExamples.parallel': '1. Onafhankelijke parallelle verzoeken',
  'queryExamples.health': 'Status',
  'queryExamples.refresh': 'Tenant vernieuwen',
  'queryExamples.fail': 'Volgende tenantverzoek laten mislukken',
  'queryExamples.tenantError': 'Tenantverzoek mislukt; cachegegevens blijven beschikbaar.',
  'queryExamples.retry': 'Tenant opnieuw proberen',
  'queryExamples.dependent': '2. Afhankelijk verzoek en vernieuwen na wijzigingen',
  'queryExamples.databases': 'Databases',
  'queryExamples.gate':
    'De databasequery wacht op tenantgegevens. Cachegegevens blijven beschikbaar tijdens het vernieuwen.',
  'queryExamples.name': 'Databasenaam',
  'queryExamples.create': 'Database maken',
  'queryExamples.createError': 'Maken mislukt. Probeer opnieuw.',
  'queryExamples.databaseError': 'Databases vernieuwen mislukt.',
  'queryExamples.retryDatabases': 'Databases opnieuw proberen',
  'queryExamples.snapshot': 'observeQueryObservable: {0}, {1} databases',
  'queryExamples.service': '3. Drie servicegebruikers delen één verzoek',
  'queryExamples.serviceIntro':
    'fetchQueryObservable geeft één resultaat en voltooit. observeQueryObservable verstuurt voortdurend cachemomentopnamen.',
  'queryExamples.mount': 'Servicewidgets tonen',
  'queryExamples.refreshWidgets': 'Servicewidgets vernieuwen',
  'queryExamples.widget': 'Widget {0}: tenant {1}, {2}',
  'queryExamples.counts': 'Aantal HTTP-verzoeken:',
  'queryExamples.dynamic': '1. Dynamische parallelle query’s',
  'queryExamples.dynamicIntro':
    'queryResources koppelt geselecteerde ID’s aan onafhankelijke observers. Herschikken behoudt observers; verwijderen van een ID ruimt de observer op.',
  'queryExamples.one': 'Alleen tenant A',
  'queryExamples.both': 'Beide tenants',
  'queryExamples.reverse': 'Volgorde omkeren',
  'queryExamples.empty': 'Selectie wissen',
  'queryExamples.databaseA': 'Database van tenant A',
  'queryExamples.databaseB': 'Database van tenant B',
  'queryExamples.initialLoadingDescription': 'True tijdens laden zonder beschikbare gegevens.',
  'queryExamples.refreshingDescription': 'True tijdens vernieuwen met behoud van cachegegevens.',
  'queryResources.k8sComparisonTitle': '3. Vlootmonitoring: Bulkaggregatie vs. Granulaire reactieve collectie',
  'queryResources.k8sComparisonDesc':
    'Vergelijking van twee architectuurpatronen voor het monitoren van gedistribueerde Kubernetes-clusters: Monolithische bulkaggregatie (queryResource + forkJoin) vs. Granulaire querycollectie (queryResources).',
  'queryResources.traditionalTab': 'Aanpak 1: Bulkaggregatie (queryResource)',
  'queryResources.traditionalDesc':
    'Aggregeert de hele vloot in één monolithisch netwerkverzoek. Head-of-Line blokkering: het traagste cluster (APAC Edge @ 1200ms) vertraagt de weergave van alle andere clusters.',
  'queryResources.granularTab': 'Aanpak 2: Granulaire collectie (queryResources)',
  'queryResources.granularDesc':
    'Creëert onafhankelijke reactieve query’s per cluster. Snelle clusters renderen direct (US-East @ 150ms). Elk cluster kan geïsoleerd worden herladen.',
  'queryResources.refreshFleet': 'Hele vloot vernieuwen',
  'queryResources.refreshCluster': 'Cluster vernieuwen',
  'queryResources.clusterName': 'Clusternaam',
  'queryResources.providerRegion': 'Provider / Regio',
  'queryResources.activeNodes': 'Actieve knooppunten',
  'queryResources.healthStatus': 'Gezondheidsstatus',
  'queryResources.latency': 'Latentie',
  'queryResources.actions': 'Acties',
  'queryResources.revalidatingNotice':
    'Vloot wordt op de achtergrond gevalideerd... Bestaande gegevens blijven interactief.',
  'queryResources.headOfLineWarning':
    'Head-of-Line blokkering actief: alle 4 de clusters wachten op het traagste cluster (APAC Edge ~1200ms). Als één cluster faalt, faalt de hele momentopname tenzij handmatig geïsoleerd.',
  'queryResources.progressiveNotice':
    'Progressieve weergave actief: snelle clusters (US-East 150ms, EU-Central 280ms) verschijnen direct interactief terwijl langzamere verbindingen nog laden.',
  'queryResources.comparisonTableTitle': 'Vergelijking van architectuurdimensies',
  'queryResources.dimTitle': 'Dimensie',
  'queryResources.dimArch': 'Architectuurpatroon',
  'queryResources.dimArchTraditional': 'Monolithische forkJoin / Geaggregeerd eindpunt',
  'queryResources.dimArchGranular': 'Onafhankelijke reactieve collectie (queryResources)',
  'queryResources.dimLatency': 'Latentie en weergave',
  'queryResources.dimLatencyTraditional': 'Head-of-Line blokkering: UI wacht op het traagste cluster',
  'queryResources.dimLatencyGranular': 'Progressieve weergave: elk cluster verschijnt direct bij ontvangst',
  'queryResources.dimIsolation': 'Foutisolatie',
  'queryResources.dimIsolationTraditional': 'Alles-of-niets: één fout blokkeert de hele vloot',
  'queryResources.dimIsolationGranular': 'Volledige foutisolatie: falend cluster beïnvloedt andere clusters niet',
  'queryResources.dimIdentity': 'Cachesleutels en identiteit',
  'queryResources.dimIdentityTraditional': 'Eén monolithische sleutel voor alle gegevens',
  'queryResources.dimIdentityGranular': 'Individuele atomaire cachesleutel per clusterentiteit',
  'queryResources.dimReload': 'Herlaadgranulariteit',
  'queryResources.dimReloadTraditional': 'Alleen volledige vloot herladen (bandbreedteverspilling)',
  'queryResources.dimReloadGranular': 'Precies herladen per cluster of via vloottags',
  'queryResources.dimCache': 'Herbruikbaarheid van cache',
  'queryResources.dimCacheTraditional': 'Niet deelbaar over afzonderlijke detailweergaven of pagina’s',
  'queryResources.dimCacheGranular': 'Naadloos hergebruik tussen vloot- en clusterdetailweergaven',
  'queryResources.prosConsTitle': 'Voor- en nadelen overzicht',
  'queryResources.prosTraditional':
    'Eenvoudig wanneer de backend al een geaggregeerde batch-API aanbiedt; precies één netwerktrip.',
  'queryResources.consTraditional':
    'Slechte gebruikerservaring door latentiekoppeling; trapsgewijze fouten; ongeschikt voor dashboards met individuele acties.',
  'queryResources.prosGranular':
    'Optimale responsiviteit door progressief laden; foutisolatie; gerichte acties en cachehergebruik.',
  'queryResources.consGranular':
    'Hoger aantal afzonderlijke HTTP-verzoeken bij zeer grote vloten (paginering aanbevolen).',
  'queryResource.thFailures': 'Mislukte pogingen',
  'queryResource.thNextRetry': 'Volgende poging',
  'queryGuide.selection': 'Gerelateerde hulpmiddelen:',
  'queryGuide.basic': '1. Begin met een leesactie uit de cache',
  'queryGuide.basicIntro':
    'Leg de tenant eenmaal vast, gebruik deze in key en loader en lees de resultaatsignalen. Vernieuwen behoudt de laatste geslaagde waarde.',
  'queryGuide.configure': 'Applicatieconfiguratie',
  'queryGuide.collectionIntro':
    'Gebruik queryResources voor een veranderende lijst onafhankelijke leesacties. Elke invoer heeft een eigen cacheresultaat, laadstatus en herstelacties.',
  'queryGuide.empty': 'Geen items geselecteerd. Geen leesacties van de verzameling zijn actief.',
  'queryGuide.partialIntro':
    'Eén rij mislukt terwijl de andere beschikbaar blijft. Probeer alleen de mislukte rij opnieuw.',
  'queryGuide.collectionContract':
    'De verzameling is een signaal van geordende queryreferenties. Herschikken behoudt referenties; verwijderen verbergt rijen direct en geeft waarnemers vrij bij uitvoering van het effect. Dubbele canonieke sleutels worden geweigerd.',
  'queryGuide.collectionLimits':
    'Gebruik één gegevenstype per verzameling en filter items die niet klaar zijn. Verzoeken starten parallel zonder gelijktijdigheidslimiet; pagineer of beperk grote selecties. maxEntries verwijdert geen actieve of wachtende items.',
  'queryGuide.namingTitle': 'Query- en mutatiereferenties benoemen',
  'queryGuide.namingHandles':
    'Gebruik <code>userQuery</code> voor één query, <code>tenantQueries</code> voor een verzameling en <code>createMutation</code> voor een schrijfopdracht. Reserveer <code>user</code> of <code>tenant</code> voor de opgeloste gegevens.',

  'computedAsync.failSource': 'Bron laten mislukken',
  'computedAsync.recoverSource': 'Bron herstellen',
  'computedAsync.readSignal': 'Signal lezen',
  'computedAsync.lastRead': 'Laatste lezing',
  'computedAsync.notRead': 'Nog niet gelezen',
  'computedAsync.readError': 'Bij het lezen is een fout geworpen; er is geen succeswaarde geretourneerd.',
  'computedAsync.readDemoHint':
    'Laat de bron mislukken en lees het signal. Herstel de bron en lees opnieuw om het herstel te controleren.',
};
