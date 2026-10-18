export const enTranslations: Record<string, string> = {
  'docsLearn.resourceTitle': 'Load data when a signal changes',
  'docsLearn.basics': 'Basics',
  'docsLearn.recipes': 'Practical recipes',
  'docsLearn.localState': 'Local state',
  'docsLearn.nested': 'Nested resources',
  'docsLearn.reference': 'Reference',
  'docsLearn.gridTitle': 'Try a server-driven datagrid',
  'docsLearn.gridIntro':
    'dgState prepares Clarity Datagrid events for server requests, delaying filter changes and optionally skipping duplicate states.',
  'docsLearn.gridTry':
    'Change filters or pages, then refresh. The preview calls randomuser.me; its total count is simulated.',
  'docsLearn.gridModel':
    'The grid emits state; dgState delays filter changes by 500 ms. switchMap replaces the previous request. Refresh is a separate trigger.',
  'docsLearn.resourceModel':
    'Signals read in the source become dependencies. With the default switch behavior, a change cancels the previous subscription and starts a new read. Each resource owns its own value.',
  'docsLearn.computedTitle': 'Your first async derived value',
  'docsLearn.computedModel':
    'Click to change the input. After 300 ms, the value becomes input × 10. computedAsync returns a value signal; it does not provide resource loading or error signals. The timer simulates async work.',
  'docsLearn.nextValue': 'Next value',

  'queryDocs.cache': 'Cache freshness and refresh',
  'queryDocs.cacheIntro':
    'A query key identifies shared data within one QueryClient. Freshness, request activity, and observer lifetime answer different questions.',
  'queryDocs.chooseComputed':
    'Use for an async derived value when a value signal is sufficient. Prefer computed() for synchronous derivation.',
  'queryDocs.chooseMutation':
    'Use for explicitly submitted server writes. No query key is required; add invalidation tags when other views must update.',
  'queryDocs.chooseObservable':
    'Use fetchQueryObservable for one finite cached read in an RxJS flow; observeQueryObservable emits shared cache snapshots and owns an observer.',
  'queryDocs.chooseQuery':
    'Use one observer for a shared cached read. A response containing an array is still one query.',
  'queryDocs.chooseResource':
    'Use for independent async state, local overrides, or streaming without a shared keyed cache.',
  'queryDocs.choosing': 'Choosing an async API',
  'queryDocs.choosingIntro':
    'Choose by the operation and ownership you need. A Refresh button still performs a read; a click does not make an operation a mutation.',
  'queryDocs.clientReference':
    'QueryClient owns shared entries. fetchQuery reads data; invalidateTags marks dependencies stale and refetches active entries; removeQueries removes matching entries. See the public source contracts for parameters and adapters.',
  'queryDocs.defaults':
    'Defaults: staleTime = 0; gcTime = 300,000 ms. Polling, retries, deadlines, and focus/reconnect refresh are disabled unless configured.',
  'queryDocs.devtools': 'Query devtools',
  'queryDocs.excerpt':
    'Component-field excerpt. Import the service and definitions above; the mutation demo provides the complete table and summary workflow.',
  'queryDocs.fetching': 'Fetching data · queryResource',
  'queryDocs.freshness':
    'staleTime measures freshness from the last successful response. Once it expires, data becomes stale; expiration alone does not issue a request.',
  'queryDocs.independent': 'Independent reads · queryResources',
  'queryDocs.independentClocks':
    'The two clocks are independent: unused data can still be fresh, and active data can be stale. Returning observers can reuse retained data.',
  'queryDocs.invalidation':
    'Successful writes invalidate selected tags. Active queries refetch; inactive entries become stale. Invalidation does not delete the data.',
  'queryDocs.keyIdentity':
    'Include every response-changing parameter and authorization scope in the key. Capture reactive values once; reuse the snapshot in both key and loader.',
  'queryDocs.keys': 'Keys and invalidation',
  'queryDocs.keysIntro':
    'Keys identify data. Tags describe which cached reads a successful write affects. They serve different purposes.',
  'queryDocs.organization': 'Organizing queries',
  'queryDocs.organizationIntro':
    'Extract definitions when several callers need the same data. Keep transport in team.service.ts, identity and tags in team.queries.ts, and observers with their consumers.',
  'queryDocs.overview': 'Overview',
  'queryDocs.overviewIntro':
    'Server state is data owned by a server. These tools load it, share reads between components, and synchronize cached views after writes.',
  'queryDocs.overviewRead': 'Load one team, display its data, change the selected ID, and recover from errors.',
  'queryDocs.overviewWrite': 'Save a team name, observe pending and failure states, then update affected cached views.',
  'queryDocs.prerequisites':
    'Start with Angular components and signals. Learn what a query does before choosing cache policies or organizing a feature.',
  'queryDocs.reference': 'API reference',
  'queryDocs.referenceIntro':
    'Look up signatures and exact state/option tables below. Follow guide links when you need an explanation or a working task.',
  'queryDocs.refreshControls':
    'reload() starts a background refresh and returns a boolean. execute() returns a Promise for a fresh read. Both bypass completed data and join valid pending work.',
  'queryDocs.retention':
    'gcTime controls retention after the last observer leaves. Collection waits for pending requests to settle. Active observers retain their data.',
  'queryDocs.saving': 'Saving changes · mutateResource',
  'queryDocs.tagIdentity':
    'A tag is an object with type and optional scope/id. The mutation selects matching query tags; an omitted scope does not match every scope.',
  'queryDocs.triggers':
    'Stale data can refresh when observed again. Manual refresh and invalidation request fresh data; polling and focus/reconnect recovery require configuration.',
  'queryDocs.writeBoundary':
    'A successful write can outlive a cache synchronization failure. Inspect invalidationError and refresh reads; do not repeat the successful write to repair the cache.',
  'queryLearn.collectionExplain':
    'Select both IDs, reverse their order, and clear the selection. Retained keys keep their observers; removed items release theirs. Each row owns its loading, error, and refresh state.',
  'queryLearn.collectionIntro':
    'Use queryResource when one request returns a list. Use queryResources when a changing collection needs a separate query for each item.',
  'queryLearn.fixture':
    'This complete example uses a local timer to simulate server latency and failures. Open TypeScript to copy the component; HTML shows the same compiled template.',
  'queryLearn.httpSetup':
    'For HTTP, provide HttpClient in app.config.ts and replace the simulated loader with http.get<Team>(url), using a captured ID. The root query client needs no additional registration.',
  'queryLearn.readError': 'The read failed. Disable simulated failure and refresh to try again.',
  'queryLearn.readExplain':
    'key names the data; loader retrieves it. Signals read in the definition select the data. value() exposes the result; isInitialLoading() identifies loading without data.',
  'queryLearn.readExplainTitle': 'Understand the first read',
  'queryLearn.readIntro':
    'queryResource loads data and exposes the result, loading state, and errors as Angular signals. Components using the same key share cached data and an in-flight request.',
  'queryLearn.readSteps':
    'Load Team A, choose Team B, then refresh. Enable failure and refresh again: the existing team stays visible. Disable failure and refresh to recover.',
  'queryLearn.readTitle': 'Your first query',
  'queryLearn.refreshExplain':
    'isRefreshing() means a read is running while previous data remains visible. error() exposes failure; isRefreshError() distinguishes failure with retained data.',
  'queryLearn.saved': 'Saved',
  'queryLearn.simulateFailure': 'Simulate failure',
  'queryLearn.teamA': 'Team A',
  'queryLearn.teamB': 'Team B',
  'queryLearn.writeError': 'The save failed. Your input is preserved; disable simulated failure and save again.',
  'queryLearn.writeExplain':
    'mutate(args) submits the value and returns a Promise. isLoading() controls pending UI; error() reports a failed write. Start without tags; add them when a successful write must refresh cached reads.',
  'queryLearn.writeExplainTitle': 'Understand the first save',
  'queryLearn.writeIntro':
    'mutateResource runs a server write when you call mutate(). It exposes pending, result, and error signals so the form can respond to the outcome.',
  'queryLearn.writeSteps':
    'Enter a name and save. Enable failure and save again, then disable failure and retry. The form disables submission while a write is pending.',
  'queryLearn.writeTitle': 'Your first save',
  'toSignalForm.savedProfile': 'Saved profile',
  'queryResource.projectRevision': 'Response version',
  'queryResource.activeUser': 'Current user',
  'queryResource.engineLabel': 'Engine',
  'queryResource.computeLabel': 'Compute',
  'queryOwnership.title': 'Domain-owned keys and tags',
  'queryOwnership.definitions':
    'Keep observers in components. Import complete query definitions and tag factories from the owning domain; include scope and every response-changing parameter in keys.',
  'queryOwnership.refactoring':
    'Use shared exports instead of repeated strings. Before changing or deleting a definition, find all references, coordinate with the owning domain, and verify affected reads and writes.',
  'queryOwnership.noCache':
    'Keys identify shared requests and state too. staleTime: 0 makes data stale; gcTime: 0 collects unused entries after requests settle. Use resourceAsync for independent state without a key. Mutations need no key.',
  'queryOwnership.naming':
    'invalidateTags accepts an array or a success-only (result, args) callback. Return [] to skip invalidation.',
  'queryOwnership.journey':
    'Add members below: the table and summary share one request per refresh. Close the summary, add again, and reopen it. Team B keeps its value and request count.',
  'queryOwnership.closeSummary': 'Close summary',
  'queryOwnership.openSummary': 'Open summary',
  'queryOwnership.summary': 'Team A summary',
  'queryOwnership.teamAReads': 'Team A requests',
  'queryOwnership.otherScope': 'Team B members (separate scope)',
  'queryOwnership.teamBReads': 'Team B requests',
  'header.selectLanguage': 'Select Language',
  'header.openGitHub': 'Open on GitHub',
  'header.codeLicensed': 'Code licensed under',
  'nav.signalUtils': 'Signal Utils',
  'nav.queryMutation': 'Query & Server State',
  'nav.operators': 'Operators',
  'nav.interceptors': 'Interceptors',
  'nav.validators': 'Validators',
  'nav.pipes': 'Pipes',
  'nav.utilities': 'Utilities',
  'nav.components': 'Components',
  'nav.pageContainer': 'Page Container',
  'nav.timelineWizard': 'Timeline Wizard',
  'nav.alert': 'Alert',
  'nav.multiAlerts': 'Alerts (Multiple)',
  'nav.callout': 'Callout',
  'nav.spinner': 'Spinner',
  'nav.toast': 'Toast',
  'nav.tooltip': 'Tooltip',
  'nav.themeToggle': 'Theme Toggle',
  'nav.fileReader': 'File Reader',
  'nav.keyValueInputs': 'Key Value Inputs',
  'nav.statusIndicator': 'Status Indicator',
  'nav.idleDetection': 'Idle Detection',
  'nav.certificate': 'Certificate View',
  'nav.datagrid': 'Datagrid',
  'nav.byteConverter': 'Byte Converter',
  'nav.mask': 'Mask',
  'nav.arrayJoin': 'Array Join',
  'nav.range': 'Range',
  'nav.isHttps': 'Is Https',
  'nav.differenceInDays': 'differenceInDays',
  'nav.badgeNew': 'NEW',
  'nav.badgeUpdated': 'UPDATED',
  'nav.badgePopular': 'POPULAR',
  'nav.badgeCore': 'CORE',
  'home.start': 'Get started',
  'home.prerequisite': 'These instructions target Angular 21. Begin in an existing standalone Angular application.',
  'home.ngxLift.setup':
    'Install ngx-lift, then choose a task below. HTTP examples need provideHttpClient(); local signal and timer examples need no HTTP provider.',
  'home.clrLift.setup':
    'Add the Clarity stylesheet globally and import only the standalone components you use. Start with the alert below, then follow a component tutorial.',
  'home.ngxLift.title': 'ngx-lift',
  'home.ngxLift.subtitle': 'Enhance your <code>modern</code> Angular development workflow',
  'home.ngxLift.supportMatrix': 'Version Support Matrix',
  'home.ngxLift.thVersion': 'ngx-lift Version',
  'home.ngxLift.thNgVersion': 'Angular Version',
  'home.ngxLift.utilityTitle': 'Utility Functions',
  'home.ngxLift.utilityDesc': 'Comprehensive utility functions designed to accelerate common development tasks',
  'home.ngxLift.rxjsTitle': 'RxJS Operators',
  'home.ngxLift.rxjsDesc':
    'Specialized operators that simplify complex reactive operations and improve code maintainability',
  'home.ngxLift.signalTitle': 'Signal Utilities',
  'home.ngxLift.signalDesc': "Powerful signal-based utilities that complement Angular's Signals API",
  'home.clrLift.title': 'clr-lift',
  'home.clrLift.subtitle': 'Extending Clarity Design System with reusable components, utilities, and operators',
  'home.clrLift.supportMatrix': 'Version Support Matrix',
  'home.clrLift.thVersion': 'clr-lift Version',
  'home.clrLift.thNgVersion': 'Angular Version',
  'home.clrLift.utilitiesTitle': 'Utilities',
  'home.clrLift.utilitiesDesc':
    'Specialized utilities designed for Clarity components that simplify common tasks and operations, providing a seamless development experience',
  'home.clrLift.rxjsTitle': 'RxJS Operators',
  'home.clrLift.rxjsDesc':
    'Enhanced RxJS operators that extend Clarity functionality. The <code>dgState</code> operator streamlines datagrid state management, providing an intuitive and efficient approach for working with Clarity datagrids.',
  'home.clrLift.componentsTitle': 'Components',
  'home.clrLift.componentsDesc':
    'Production-ready components built on Clarity Design System, including toast notifications, alerts, callouts, page container, theme toggle, and more',
  'home.clrLift.tipPeer':
    "In some cases, a <strong>force installation</strong> may be required if &#64;clr/angular's peer dependencies specify a different Angular version than your project.",
  'home.clrLift.tipSkipLib':
    'If you are not using the latest Angular version, consider setting <code>skipLibCheck: true</code> in tsconfig.json to avoid potential build errors.',
  'home.clrLift.tipIcon': 'Ensure Clarity icons are imported properly using <code>ClarityIcons.addIcons(...)</code>.',
  'common.examples': 'Examples',
  'common.apiReference': 'API Reference',
  'common.overview': 'Overview',
  'common.parameters': 'Parameters',
  'common.returns': 'Returns',
  'rockStar.todayIs': 'Today is',
  'rockStar.whoIsStar': "Who is our today's rock star?",
  'rockStar.unveil': 'Unveil',
  'common.signature': 'Signature',
  'common.description': 'Description',
  'common.clear': 'Clear',
  'common.basicUsage': 'Basic Usage',
  'common.inputs': 'Inputs',
  'common.outputs': 'Outputs',
  'common.type': 'Type',
  'common.default': 'Default',
  'common.contentProjection': 'Content Projection',
  'common.example': 'Example',
  'common.example1': 'Example 1: Basic Usage',
  'common.example2': 'Example 2: With RxJS Pipe Operator',
  'common.example3': 'Example 3: Handle Asynchronous Code',
  'common.example4': 'Example 4: Decoupled Injector',
  'common.methods': 'Methods',
  'common.selector': 'Selector',
  'common.behaviors': 'Behaviors',
  'common.behavior': 'Behavior',
  'common.features': 'Features',
  'common.properties': 'Properties',
  'common.validationErrors': 'Validation Errors',
  'common.usageNotes': 'Usage Notes',
  'common.liveDemo': 'Live Demo',
  'common.required': 'Required',
  'common.refresh': 'Refresh',
  'common.firstName': 'First Name',
  'common.lastName': 'Last Name',
  'common.email': 'Email',
  'common.gender': 'Gender',
  'common.male': 'Male',
  'common.female': 'Female',
  'common.name': 'Name',
  'common.noDataFound': 'No data found',
  'common.noItems': 'No items',
  'common.paginationOf': '{0} - {1} of {2} items',
  'common.seeUiBehavior': 'Click to see UI behavior',
  'filterUsers.selectGender': 'Select gender to load users',
  'fileReader.file': 'File',
  'fileReader.readSuccess': 'File content has been read successfully',
  'fileReader.submitAndLog': 'Submit and view console log',
  'fileReader.caBundle': 'CA Bundle',
  'fileReader.showCertificate': 'Show certificate:',
  'fileReader.exceedLimit': 'Exceed the maximum file size ({0} MB).',
  'multiAlerts.addStandard': 'Add Standard Alert',
  'multiAlerts.addInlineBtn': 'Add Alert with Inline Button',
  'multiAlerts.addAction': 'Add Alert with Action',
  'multiAlerts.clearAll': 'Clear All Alerts',
  'toast.successBtn': 'Success Toast',
  'toast.infoBtn': 'Info Toast',
  'toast.errorBtn': 'Error Toast',
  'toast.warningBtn': 'Warning Toast',
  'idleDetection.startSimulation': 'Start Fast Simulation (3s Idle)',
  'idleDetection.stopSimulation': 'Stop Simulation',
  'idleDetection.simActive': 'Simulation Active:',
  'idleDetection.sessionStatus': 'Status:',
  'idleDetection.totalTimeouts': 'Total Timeouts:',
  'idleDetection.yes': 'Yes',
  'idleDetection.no': 'No',
  'resourceAsync.userN': 'User {0}',
  'resourceAsync.reload': 'Reload',
  'resourceAsync.regUsernamePlaceholder': 'Enter username (3-20 chars)',
  'resourceAsync.regUsernameError': 'Username must be 3-20 characters',
  'resourceAsync.regEmailPlaceholder': 'Enter your email',
  'resourceAsync.regEmailError': 'Please enter a valid email',
  'resourceAsync.regPasswordPlaceholder': 'Enter password (min 8 chars)',
  'resourceAsync.regPasswordError': 'Password must be at least 8 characters',
  'resourceAsync.loadingTodo': 'Loading todo...',
  'resourceAsync.loadTodo': 'Load Todo',
  'resourceAsync.saving': 'Saving...',
  'resourceAsync.resetFromServer': 'Reset from Server',
  'resourceAsync.loadUserCacheFirst': 'Load User (Cache-First)',
  'resourceAsync.fromCache': 'From Cache',
  'resourceAsync.updating': 'Updating...',
  'resourceAsync.loadCounter': 'Load Counter',
  'resourceAsync.unsavedChanges': 'Unsaved changes - Counter has been modified locally',
  'resourceAsync.saveToServer': 'Save to Server',
  'resourceAsync.discardChanges': 'Discard Changes',
  'playground.beginner': 'Beginner',
  'playground.intermediate': 'Intermediate',
  'playground.advanced': 'Advanced',
  'playground.copy': 'Copy',
  'playground.copied': 'Copied',
  'playground.viewCode': 'View Code',
  'playground.hideCode': 'Hide Code',
  'playground.stackedLayout': 'Stacked layout',
  'playground.splitLayout': 'Side-by-side layout',
  'inspector.liveState': 'Live Signal State',
  'inspector.rawJson': 'Raw State JSON',
  'inspector.hideJson': 'Hide JSON',
  'mergeFrom.overview':
    'The <code>mergeFrom</code> function merges the values of Observables or Signals and emits the latest value. It also allows for modifying the emitted value using RxJS operators before it is emitted. While it is similar to <code>merge()</code>, it also takes Signals into account. <code>mergeFrom</code> is akin to <code>combineFrom</code>, but instead of emitting a combined value, it emits the latest emitted value using the merge operator rather than combineLatest.',
  'mergeFrom.example1Desc': 'Merge multiple signals or observables:',
  'mergeFrom.example2Desc': 'Pass an RxJS pipe operator to manipulate the emitted values:',
  'mergeFrom.example3Desc':
    'Use <code>startWith</code> or <code>initialValue</code> option to handle async observables:',
  'mergeFrom.example4Desc':
    'Pass a custom <code>Injector</code> via the options object to create a merged signal outside an ambient injection context (such as inside utility functions, custom factories, or dynamic services):',
  'mergeFrom.apiSummary':
    'Merges multiple Observables or Signals into a single Signal that emits the latest value from any source, similar to <code>merge</code> but with Signal support.',
  'mergeFrom.paramSources':
    'An object or array of Observables or Signals to merge. When an object is provided, the result will be an object with the same keys.',
  'mergeFrom.paramOperator': 'An RxJS pipe operator to manipulate the emitted values before they are emitted.',
  'mergeFrom.paramOptions': 'Configuration options including initialValue and injector.',
  'mergeFrom.returnsDesc': 'A Signal that emits the combined/merged value as sources emit.',
  'toSignalForm.pageTitle': 'Reactive Form Signals & Bindings (toSignalForm)',
  'toSignalForm.bannerTitle': 'Bridging Angular Reactive Forms & Modern Signals',
  'toSignalForm.bannerDesc':
    '<code>toSignalForm</code> wraps standard Angular <code>FormGroup</code> instances with reactive signals, declarative bindings (<code>bindIf</code>, <code>bindDisabled</code>), cross-control revalidation, and sanitized submission values (<code>submitValue</code>)—retaining 100% compatibility with Clarity form containers and Angular validators.',
  'toSignalForm.quickTitle': 'Level 1: Quickstart Form Signals',
  'toSignalForm.quickBadge': '30-Second Hello World',
  'toSignalForm.quickDesc':
    'Learn the fundamentals: wrap a FormGroup with toSignalForm, read values reactively via signals, and disable actions with sf.invalid().',
  'toSignalForm.username': 'Username',
  'toSignalForm.usernamePlaceholder': 'At least 3 characters',
  'toSignalForm.usernameRequired': 'Username is required.',
  'toSignalForm.usernameMinLength': 'Must be at least 3 characters.',
  'toSignalForm.email': 'Email Address',
  'toSignalForm.emailPlaceholder': 'name@domain.com',
  'toSignalForm.emailRequired': 'Email is required.',
  'toSignalForm.emailInvalid': 'Please enter a valid email address.',
  'toSignalForm.receiveUpdates': 'Receive Email Updates',
  'toSignalForm.saveProfile': 'Save Profile',
  'toSignalForm.reset': 'Reset',
  'toSignalForm.quickFormState': 'Quick Form Signal State',
  'toSignalForm.quickFormStateDesc': 'Signals update synchronously as you type in the form above',
  'toSignalForm.enterpriseTitle': 'Level 2: Enterprise Showcase - Cloud Database Provisioning',
  'toSignalForm.enterpriseBadge': 'Full Real-World Spec',
  'toSignalForm.enterpriseDesc':
    'Complex multi-control presence, asynchronous appliance probing via resourceAsync, cascading version updates, and conditional auto-scaling locks.',
  'toSignalForm.enterpriseState': 'Enterprise Form Live Signals',
  'toSignalForm.enterpriseStateDesc':
    'Tracks form validation, auto-scaling locks, and backend provisioning status in real time',
  'toSignalForm.region': 'Deployment Region / Appliance',
  'toSignalForm.regionSelect': 'Select target region...',
  'toSignalForm.regionUSWest': 'US West (Cloud v2 - Multi-Zone HA Supported)',
  'toSignalForm.regionApEast': 'Asia Pacific (Regional Cloud - Multi-Zone HA for PG & MySQL)',
  'toSignalForm.regionEuCentral': 'Europe Central (Legacy Region - Single-Zone Only)',
  'toSignalForm.regionRequired': 'Deployment region is required.',
  'toSignalForm.regionHelper': 'Asynchronously checks regional appliance capabilities via <code>computedAsync</code>.',
  'toSignalForm.multiZoneSupported': '✓ Multi-Zone HA Supported',
  'toSignalForm.singleZoneOnly': 'Single-Zone Only (HA Gated)',
  'toSignalForm.engine': 'Database Engine',
  'toSignalForm.enginePostgres': 'PostgreSQL',
  'toSignalForm.engineMysql': 'MySQL',
  'toSignalForm.engineSqlServer': 'SQL Server',
  'toSignalForm.engineRequired': 'Database engine is required.',
  'toSignalForm.engineHelper': 'Options below are reactively derived from <code>sf.fields.engine.value</code>.',
  'toSignalForm.haTopology': 'Multi-Zone HA Topology',
  'toSignalForm.haCrossAz': 'Cross-Availability Zone',
  'toSignalForm.haDedicated': 'Dedicated Anti-Affinity Hosts',
  'toSignalForm.haRequired': 'HA topology is required.',
  'toSignalForm.haHelper': 'Dynamically mounted by <code>sf.bindIf(isMultiZoneSupported, ...)</code>.',
  'toSignalForm.replicaCount': 'Replica Node Count',
  'toSignalForm.replicaRequired': 'Replica count is required.',
  'toSignalForm.replicaMin': 'Minimum 2 replicas for Multi-Zone HA.',
  'toSignalForm.replicaMax': 'Maximum 5 replicas permitted.',
  'toSignalForm.replicaHelper': 'Values are preserved across region toggles.',
  'toSignalForm.version': 'Engine Version',
  'toSignalForm.versionSelect': 'Select version',
  'toSignalForm.versionRequired': 'Engine version is required.',
  'toSignalForm.versionHelper': 'Automatically resets to first available version when engine changes.',
  'toSignalForm.clusterName': 'Cluster Name',
  'toSignalForm.clusterNamePlaceholder': 'e.g. billing-db-primary',
  'toSignalForm.clusterNameRequired': 'Cluster name is required.',
  'toSignalForm.clusterNameMinLength': 'Must be at least 4 characters.',
  'toSignalForm.clusterNameHelper':
    'Debounced 400ms & checked asynchronously against reserved names (prod-db, test-cluster, etc.).',
  'toSignalForm.clusterNameChecking': 'Checking name availability... (debounced 400ms)',
  'toSignalForm.autoScaling': 'Storage Auto-scaling',
  'toSignalForm.autoScalingHelper': 'When enabled, manual storage input is automatically disabled and reset to 250 GB.',
  'toSignalForm.storageGb': 'Allocated Storage (GB)',
  'toSignalForm.storageGbRequired': 'Storage size is required.',
  'toSignalForm.storageGbMin': 'Minimum allocation is 20 GB.',
  'toSignalForm.storageGbHelper':
    "Bound via <code>sf.bindDisabled('storageGb', () =&gt; autoScaling(), &#123; resetOnDisable: true, resetValue: 250 &#125;)</code>.",
  'toSignalForm.storageLocked': '🔒 Auto-scaling Managed (Disabled, locked to 250 GB)',
  'toSignalForm.storageManual': '✓ Manual Allocation Allowed',
  'toSignalForm.authMode': 'Authentication Mode',
  'toSignalForm.authSql': 'Database Native User',
  'toSignalForm.authWindows': 'Enterprise Directory / Windows Auth',
  'toSignalForm.authModeRequired': 'Authentication mode is required.',
  'toSignalForm.authModeHelper': 'Selecting Database Native User mounts password & confirmation with memory retention.',
  'toSignalForm.password': 'Master Password',
  'toSignalForm.passwordPlaceholder': 'Min 8 characters',
  'toSignalForm.passwordRequired': 'Master password is required.',
  'toSignalForm.passwordMinLength': 'Must be at least 8 characters.',
  'toSignalForm.confirmPassword': 'Confirm Password',
  'toSignalForm.confirmPasswordPlaceholder': 'Repeat master password',
  'toSignalForm.confirmPasswordRequired': 'Password confirmation is required.',
  'toSignalForm.passwordMismatch': 'Passwords do not match.',
  'toSignalForm.confirmPasswordHelper':
    'Automatically re-validated when Master Password changes via <code>sf.revalidate</code>.',
  'toSignalForm.tlsCert': 'TLS / SSL Certificate',
  'toSignalForm.certManaged': 'Platform Auto-Generated',
  'toSignalForm.certCustom': 'Custom Enterprise Certificate',
  'toSignalForm.certRequired': 'Certificate type is required.',
  'toSignalForm.certHelper':
    'Custom mode dynamically mounts the certificate input and retains typed text across toggles.',
  'toSignalForm.tlsChain': 'PEM Certificate Chain',
  'toSignalForm.tlsChainPlaceholder': '-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----',
  'toSignalForm.tlsChainRequired': 'Certificate chain is required.',
  'toSignalForm.tlsChainMinLength': 'Certificate must be at least 20 characters.',
  'toSignalForm.tlsChainHelper': 'Type some text, switch to "Auto-Generated", and switch back: text is preserved!',
  'toSignalForm.createCluster': 'Create Cluster',
  'toSignalForm.resetForm': 'Reset Form',
  'toSignalForm.submitting': 'Submitting cluster provisioning request to control plane... (1.0s simulation)',
  'toSignalForm.successTitle': '✓ Cluster Provisioning Request Succeeded (ID: {0})',
  'toSignalForm.simulatedResponse': 'Simulated backend response received in 1.0 second:',
  'toSignalForm.diagnosticsTitle': 'Real-time Signal Diagnostics',
  'toSignalForm.clusterNameState': 'Cluster Name State (sf.fields.clusterName)',
  'toSignalForm.value': 'Value:',
  'toSignalForm.debounced': 'Debounced (400ms):',
  'toSignalForm.valid': 'Valid:',
  'toSignalForm.touched': 'Touched:',
  'toSignalForm.errors': 'Errors:',
  'toSignalForm.sqlCredState': 'SQL Credentials State',
  'toSignalForm.authModeLabel': 'Auth Mode:',
  'toSignalForm.controlsAttached': 'Controls Attached:',
  'toSignalForm.passwordValid': 'Password Valid:',
  'toSignalForm.passwordErrors': 'Password Errors:',
  'toSignalForm.confirmValid': 'Confirm Valid:',
  'toSignalForm.confirmErrors': 'Confirm Errors:',
  'toSignalForm.sanitizedPayload': 'Sanitized Submission Payload (sf.submitValue)',
  'toSignalForm.sanitizedDesc':
    'Auto-omits UI-only <code>confirmPassword</code> and omits detached <code>password</code> on Windows auth.',
  'toSignalForm.patternsTitle': 'Specialized Architectural Patterns',
  'toSignalForm.pattern1Title': 'Pattern 1: Dependent / Conditional Field Trees (bindIf)',
  'toSignalForm.pattern1Desc':
    'Mounts or unmounts a group of related controls (such as database credentials) together based on a reactive condition. Detached controls are automatically excluded from validation and backend payloads, and their input is preserved across switches when <code>preserveValue: true</code> is configured.',
  'toSignalForm.pattern2Title': 'Pattern 2: Reactive Disabling & Auto-Reset (bindDisabled)',
  'toSignalForm.pattern2Desc':
    "Binds a control's enabled/disabled state directly to a boolean signal or reactive getter function (<code>() =&gt; boolean</code>). It supports strongly-typed control keys, direct <code>sf.controls.&lt;name&gt;</code> enhanced controls, and <code>AbstractControl</code> instances. Defaults to <code>emitEvent: true</code> to ensure reactive status signals update synchronously, and supports optional reset-on-disable with a strongly-typed <code>resetValue</code>.",
  'toSignalForm.pattern3Title': 'Pattern 3: Sanitized Submissions (sf.submitValue)',
  'toSignalForm.pattern3Desc':
    'Solves the tension between <code>form.value</code> (which drops disabled controls) and <code>form.getRawValue()</code> (which dumps UI-only fields like <code>confirmPassword</code>). <code>sf.submitValue()</code> provides a continuous reactive signal that is always sanitized and ready for submission or <code>resourceAsync</code>.',
  'toSignalForm.pattern4Title': 'Pattern 4: Asynchronous Feature Gating (computedAsync + bindIf)',
  'toSignalForm.pattern4Desc':
    'In cloud and enterprise applications, available form fields often depend on regional capabilities or feature flags resolved asynchronously from API endpoints. <code>computedAsync</code> derives a reactive <code>Signal&lt;boolean&gt;</code> from the selected region and engine, which passes directly into <code>sf.bindIf</code> to mount or unmount capability controls on the fly.',
  'toSignalForm.pattern5Title': 'Pattern 5: Cascading Updates & Change Watch (sf.watch)',
  'toSignalForm.pattern5Desc':
    "When a form control's change triggers cascading updates in another control (e.g. resetting available versions when the database engine changes), you can use the traditional RxJS <code>valueChanges.pipe(takeUntilDestroyed())</code> pattern or the signal-first <code>sf.controls.&lt;name&gt;.watch()</code> / <code>sf.watch()</code> utility. <code>watch</code> operates inside an Angular <code>effect()</code> with automatic <code>untracked</code> isolation, preventing <code>NG0600</code> signal write errors while eliminating manual subscription teardown.",
  'toSignalForm.apiReferenceTitle': 'API Reference',
  'toSignalForm.apiToSignalFormTitle': 'toSignalForm(form, options?)',
  'toSignalForm.apiBindIfTitle': 'sf.bindIf(control, condition, options?) / bindControlIf',
  'toSignalForm.apiBindDisabledTitle': 'sf.bindDisabled(control, condition, options?) / bindControlDisabled',
  'toSignalForm.apiRevalidateTitle': 'sf.revalidate(target, sources, options?) / revalidateOnChange',
  'toSignalForm.apiPropForm': 'The Angular FormGroup instance to wrap with reactive signals and bindings.',
  'toSignalForm.apiPropOmit': 'Control names to omit from submitValue payloads.',
  'toSignalForm.apiPropEmitEvent': 'Whether status/value changes emit Angular control events.',
  'toSignalForm.apiPropValue': 'Reactive signal of current form value.',
  'toSignalForm.apiPropStatus':
    "Reactive signal of overall form status ('VALID' | 'INVALID' | 'PENDING' | 'DISABLED').",
  'toSignalForm.apiPropValid': 'Computed signal indicating whether the form is valid.',
  'toSignalForm.apiPropInvalid': 'Computed signal indicating whether the form is invalid.',
  'toSignalForm.apiPropSubmitValue': 'Sanitized payload excluding disabled, omitted, or unmounted controls.',
  'toSignalForm.apiPropIsSubmitting': 'Writable signal tracking whether an async submission operation is in-flight.',
  'toSignalForm.apiBindIfControl': 'Name or instance of the control to mount/unmount conditionally.',
  'toSignalForm.apiBindIfCondition': 'Boolean signal or predicate governing whether the control is mounted.',
  'toSignalForm.apiBindIfPreserveValue': 'Preserves control value in memory across unmount/remount cycles.',
  'toSignalForm.apiBindIfDefaultValue': 'Default value assigned when mounting or resetting the control.',
  'toSignalForm.apiBindIfEmitEvent': 'Whether control addition/removal emits FormGroup value and status events.',
  'toSignalForm.apiBindDisabledControl': 'Target control whose enabled/disabled state is bound.',
  'toSignalForm.apiBindDisabledCondition': 'Boolean signal or predicate returning true to disable, false to enable.',
  'toSignalForm.apiBindDisabledResetOnDisable': 'Automatically resets the control value when entering disabled state.',
  'toSignalForm.apiBindDisabledResetValue':
    'Specific reset value when resetOnDisable is active; defaults to control initial/null.',
  'toSignalForm.apiBindDisabledEmitEvent': 'Whether enable/disable changes emit value/status events.',
  'toSignalForm.apiRevalidateTarget': 'Target control to re-evaluate validation upon source changes.',
  'toSignalForm.apiRevalidateSources':
    'One or more dependency controls whose value/status changes trigger target revalidation.',
  'toSignalForm.apiRevalidateOnlyIfTouched': 'Only trigger target revalidation if target has been touched by user.',
  'toSignalForm.apiRevalidateOnlyIfDirty': 'Only trigger target revalidation if target has been modified (dirty).',
  'computedAsync.title': 'computedAsync',
  'computedAsync.overview':
    'The <code>computedAsync</code> function is a versatile utility enabling value computation from Promises, Observables, or regular values. It provides flexibility in computational behavior through selectable flattening strategies (switch, merge, concat, exhaust) and initial value assignment. To utilize <code>computedAsync</code>, provide a function returning a Promise, Observable, or regular value. It then returns a <code>Signal</code> emitting the computed value.',
  'computedAsync.example1': 'Example 1: Works with Promises',
  'computedAsync.example1Desc': 'Compute values from Promises:',
  'computedAsync.example2': 'Example 2: Works with Observables',
  'computedAsync.example2Desc':
    'When returning an Observable, it is automatically subscribed to and will be unsubscribed when the component is destroyed or when the computation is re-triggered. In the following example, if the userId changes, the previous computation will be cancelled (including any ongoing API calls), and a new computation will be initiated.',
  'computedAsync.example3': 'Example 3: Works with Regular Values',
  'computedAsync.example3Desc':
    'This allows the return of regular values (those not consisting of Promises or Observables) from the callback function. The callback function executes in the microtask queue, hence it will not promptly emit the value (by default, it returns undefined). To emit the value immediately, you can utilize the requireSync option within the second argument options object.',
  'computedAsync.example4': 'Example 4: Works with initialValue',
  'computedAsync.example4Desc':
    'If we wish to establish an initial value for the computed value, we can provide it as the second argument within the options object.',
  'computedAsync.example5': 'Example 5: Works with requireSync',
  'computedAsync.example5Desc':
    'If we possess an Observable that synchronously emits the value, we can utilize the requireSync option to ensure immediate emission of the value. This feature is also beneficial for ensuring the <code>signal</code> type excludes undefined by default (<code>Signal<T></code> instead of <code>Signal<T | undefined></code>).',
  'computedAsync.example6': 'Example 6: Work with createAsyncState Operator',
  'computedAsync.example6Desc':
    'In the example below, we have a <code>Signal</code> that represents the state of an API call. We use <code>computedAsync</code> and <code>createAsyncState</code> operator to compute the state of the API call based on the <code>userId</code>.',
  'computedAsync.example7': 'Example 7: Behaviors (switch, merge, concat, exhaust)',
  'computedAsync.example7Desc':
    'By default, <code>computedAsync</code> employs the switch behavior. Should you wish to alter this behavior, you can provide the behavior option within the second argument options object.',
  'computedAsync.behaviorSwitch': 'switch (default)',
  'computedAsync.behaviorSwitchDesc':
    'When desiring to cancel the prior computation, the switch behavior is utilized, which is the default. If a new computation is triggered before the previous one concludes, the former will be terminated.',
  'computedAsync.behaviorMerge': 'merge',
  'computedAsync.behaviorMergeDesc':
    'To retain the preceding computation, the merge behavior is employed. If a new computation is initiated before the previous one is finished, the former is preserved while the latter is started.',
  'computedAsync.behaviorConcat': 'concat',
  'computedAsync.behaviorConcatDesc':
    'If preservation of the prior computation is desired along with waiting for its completion before initiating the new one, the concat behavior is chosen.',
  'computedAsync.behaviorExhaust': 'exhaust',
  'computedAsync.behaviorExhaustDesc':
    'In instances where disregarding the new computation while the prior one remains ongoing is necessary, the exhaust behavior is selected.',
  'computedAsync.example8': 'Example 8: Use with Previous Computed Value',
  'computedAsync.example8Desc':
    'Should there be a necessity to utilize the previously computed value in the subsequent computation, it can be accessed within the callback function as the first argument.',
  'computedAsync.example9': 'Example 9: Load Data Initially',
  'computedAsync.example9Desc': 'Load users initially when the component loads:',
  'computedAsync.refresh': 'Refresh',
  'computedAsync.learnTrigger': 'Learn <a href="{0}"><code>createTrigger</code> here</a>.',
  'computedAsync.example10': 'Example 10: Load Data When Button Clicks',
  'computedAsync.example10Desc': 'Load users only when a button is clicked:',
  'computedAsync.loadUsers': 'Load Users',
  'computedAsync.example11': 'Example 11: Error Handling with onError',
  'computedAsync.example11Desc':
    'Use the <code>onError</code> callback to handle errors gracefully and provide fallback values. When <code>onError</code> returns a value, the signal will emit that value instead of throwing an error:',
  'computedAsync.onErrorCallout':
    'The <code>onError</code> callback returns a fallback of type T. Include <code>undefined</code> in T explicitly if needed. Unhandled failures and throwing callbacks throw when the signal is read; failures never become success data.',
  'computedAsync.example12': 'Example 12: Default Errors Throw on Read',
  'computedAsync.example12Desc':
    'Unhandled failures throw when the signal is read. Catch the read or use <code>onError</code> for a typed fallback.',
  'computedAsync.throwOnErrorCallout':
    '<code>throwOnError: true</code> runs <code>onError</code> for side effects and still throws; its return value is ignored. <code>throwOnError: false</code> is no longer supported.',
  'computedAsync.example13': 'Example 13: Tab Switching with Request Cancellation (Stream Resilience)',
  'computedAsync.example13Desc':
    'In multi-tab UIs, switching tabs rapidly can trigger concurrent requests where in-flight requests get aborted or fail (e.g. browser navigation cancellations).',
  'computedAsync.tabResilienceBefore':
    '<strong>Before Fix:</strong> An inner error (such as a canceled HTTP request) would propagate through <code>switchAll</code> and permanently terminate the outer observable subscription. The UI stayed stuck in loading forever and could never load subsequent tabs.',
  'computedAsync.tabResilienceAfter':
    '<strong>After Fix:</strong> The inner error is safely caught and handled, keeping the outer stream alive. Switching to any tab or retrying immediately fetches and displays new data!',
  'computedAsync.tabActiveDirectory': 'Active Directory',
  'computedAsync.tabBackupLocations': 'Backup Locations',
  'computedAsync.tabCertificates': 'Certificates',
  'computedAsync.tabSimulateAborted': 'Simulate Aborted Request',
  'computedAsync.tabNotice':
    'Notice: Even after this simulated aborted request, the stream remains alive! Click any tab above to see it seamlessly recover.',
  'computedAsync.example14': 'Example 14: Decoupled Injector',
  'computedAsync.example14Desc':
    'By passing an optional <code>injector</code> in the options object, <code>computedAsync</code> can be instantiated outside an ambient injection context—for instance, inside composable helper functions, custom services, or dynamic factory methods:',
  'computedAsync.apiSummary':
    'Computes values from Promises, Observables, or regular values, returning a Signal that emits the computed value.',
  'computedAsync.paramComputation':
    'A function that returns a Promise, Observable, or regular value. The function receives the previous computed value as an optional first argument.',
  'computedAsync.paramOptions': 'Configuration options for async computation.',
  'computedAsync.propInitialValue': 'The initial value for the computed signal before the computation completes.',
  'computedAsync.propRequireSync': 'If true, requires the computation to emit synchronously.',
  'computedAsync.propBehavior':
    'The flattening strategy for handling multiple computations: "switch", "merge", "concat", or "exhaust". Defaults to "switch".',
  'computedAsync.propOnError': 'Error handler callback that receives errors from async operations.',
  'computedAsync.propThrowOnError': 'If true, errors will be thrown and propagate up.',
  'computedAsync.returnsDesc': 'A Signal that emits the computed value.',
  'combineFrom.title': 'combineFrom',
  'combineFrom.overview':
    'The <code>combineFrom</code> function takes an array or object of Observables or Signals and produces a Signal that emits the aggregated value from these sources. Similar to <code>combineLatest</code>, but seamlessly supports Signals. Supports custom injectors and initial values.',
  'combineFrom.example1': 'Example 1: Basic Usage',
  'combineFrom.example1Desc': 'Combine multiple signals or observables:',
  'combineFrom.example2': 'Example 2: With RxJS Pipe Operator',
  'combineFrom.example2Desc': 'Pass an RxJS pipe operator to manipulate the emitted values:',
  'combineFrom.example3': 'Example 3: Handle Asynchronous Code',
  'combineFrom.example3Desc':
    'Use <code>startWith</code> or <code>initialValue</code> option to handle async observables:',
  'combineFrom.example4': 'Example 4: Real Example - Filtered Data',
  'combineFrom.example4Desc':
    'Combine search criteria with an API resource to perform client-side filtering and sorting:',
  'combineFrom.example5': 'Example 5: Deduplicated Initialization & Explicit Injector',
  'combineFrom.example5Desc':
    'Deduplicates the initial signal emission. Separate sources can still produce intermediate combinations; use computed() for synchronous signal-only derivation.',
  'combineFrom.apiSummary':
    'Combines Observable and Signal sources with combineLatest semantics and per-source deduplication.',
  'combineFrom.paramSources':
    'An object or array of Observables or Signals to combine. When an object is provided, the result will be an object with the same keys.',
  'combineFrom.paramOperator': 'An RxJS pipe operator to manipulate the emitted values before they are emitted.',
  'combineFrom.paramOptions': 'Configuration options including initialValue and injector.',
  'combineFrom.returnsDesc':
    'A signal that emits an array or object (depending on input type) containing the latest values from all source observables and signals.',
  'resourceAsync.title': 'resourceAsync',
  'resourceAsync.overview':
    'The <code>resourceAsync</code> function creates a reactive resource that manages async operations with full state tracking. Works with any async operation (Observable, Promise, or sync value). Provides automatic request cancellation, manual reload capability, and granular status tracking.',
  'resourceAsync.basicSection': 'Basic Examples',
  'resourceAsync.intermediateSection': 'Intermediate Examples',
  'resourceAsync.whenToUseSection': 'When to Use',
  'resourceAsync.advancedSection': 'WritableResourceRef - Local State Management',
  'resourceAsync.nestedSection': 'Advanced Pattern: Nested Resources',
  'resourceAsync.example1': 'Example 1: Basic Reactive Query with Auto-Dependency Tracking',
  'resourceAsync.example1Desc':
    'Creates a resource that automatically fetches data and re-fetches whenever dependencies change. Any signal read inside the source function becomes a reactive dependency.',
  'resourceAsync.example2': 'Example 2: Lazy Loading',
  'resourceAsync.example2Desc':
    'Use <code>lazy: true</code> to defer loading until <code>reload()</code> or <code>execute()</code> is called. The resource starts in idle state and fetches data only when explicitly triggered:',
  'resourceAsync.loadUsers': 'Load Users',
  'resourceAsync.notLoadedIdle': 'Not loaded yet (idle)',
  'resourceAsync.example3': 'Example 3: Initial Value',
  'resourceAsync.example3Desc': 'Provide an initial value to display before the first fetch completes:',
  'resourceAsync.example3Callout':
    'Useful when navigating from a list to detail page where you already have some data to display immediately.',
  'resourceAsync.example4': 'Example 4: Error Handling with Fallback and Error Propagation',
  'resourceAsync.example4Desc':
    'Handle errors with <code>onError</code> callback to provide fallback values, or use <code>throwOnError: true</code> to propagate errors:',
  'resourceAsync.triggerFallback': 'Trigger Request (will fallback)',
  'resourceAsync.showingFallback': 'Showing fallback user after error',
  'resourceAsync.errorPropagation': 'Error Propagation',
  'resourceAsync.example5': 'Example 5: Mutations with execute() - User Registration Form',
  'resourceAsync.example5Desc':
    'For mutations (POST/PUT/DELETE), use the <code>execute()</code> method instead of <code>reload()</code>. <code>execute()</code> returns an awaitable <code>Promise&lt;T&gt;</code> that resolves to the exact value written to <code>resource.value()</code>, clears stale values and errors upon re-execution, and is safe for fire-and-forget calls without unhandled rejections.',
  'resourceAsync.regUsername': 'Username',
  'resourceAsync.regEmail': 'Email',
  'resourceAsync.regPassword': 'Password',
  'resourceAsync.regSubmit': 'Register',
  'resourceAsync.example6': 'Example 6: Behaviors (switch, exhaust)',
  'resourceAsync.example6Desc': 'Control how multiple concurrent requests are handled:',
  'resourceAsync.example7': 'Example 7: Status Tracking',
  'resourceAsync.example7Desc':
    'Access granular status information with the <code>status()</code> signal. Use <code>computed()</code> for derived state:',
  'resourceAsync.example8': 'Example 8: Declarative Definition & AbortSignal Propagation',
  'resourceAsync.example8Desc':
    '<code>resourceAsync</code> supports declarative definition via <code>ResourceAsyncDefinition&lt;P, T&gt;</code> with <code>params</code> and <code>loader</code>, propagating <code>context.abortSignal</code> for cancellation generation tracking and deferred promise settling.',
  'resourceAsync.declarativeTitle': 'Live Showcase: Declarative Definition & Cancellation',
  'resourceAsync.quickSwitchDemo': 'Rapid Switch (Trigger Abort)',
  'resourceAsync.activeSearchLogs': 'Real-Time AbortSignal & Request Lifecycle Log',
  'resourceAsync.optimisticTitle': 'Example 1: Optimistic Updates - Todo Toggle',
  'resourceAsync.optimisticDesc':
    'Update the UI immediately before server confirmation. If the server request fails, you can revert the change. This provides instant feedback to users.',
  'resourceAsync.cacheFirstTitle': 'Example 2: Cache-First Loading',
  'resourceAsync.cacheFirstDesc':
    'Show cached data immediately while fetching fresh data in the background. This eliminates loading spinners for users with cached content.',
  'resourceAsync.formDraftTitle': 'Example 3: Form Draft - Counter with Save/Discard',
  'resourceAsync.formDraftDesc':
    'Allow users to edit data locally before saving to the server. They can save changes or discard them by reloading from the server.',
  'resourceAsync.nestedTitle': 'Implementation & Demo',
  'resourceAsync.nestedProjects': 'Projects',
  'resourceAsync.nestedLoadingItems': 'Loading items...',
  'resourceAsync.nestedRefreshing': 'Refreshing...',
  'resourceAsync.nestedThName': 'Name',
  'resourceAsync.nestedThStatus': 'Status',
  'resourceAsync.nestedThOrg': 'Organization',
  'resourceAsync.nestedThActions': 'Actions',
  'resourceAsync.nestedLoadOrg': 'Load Org',
  'resourceAsync.nestedRetry': 'Retry',
  'resourceAsync.nestedRefreshItems': 'Refresh Items',
  'resourceAsync.nestedLoadAllOrgs': 'Load All Orgs',
  'queryResource.title': 'queryResource',
  'queryResource.overview':
    '<code>queryResource</code> provides declarative, cached, and deduplicated server-state management in Angular Signals. Paired with <code>mutateResource</code> and <code>QueryClient</code>, it coordinates background polling, stale-while-revalidate caching, request coalescing, and tag-based invalidation.',
  'queryResource.comparisonTitle': 'When to Use: queryResource vs. resourceAsync',
  'queryResource.comparisonIntro':
    'Both primitives use Angular Signals for reactive UI bindings, but they address different layers of your application architecture:',
  'queryResource.cardResourceAsyncTitle': 'resourceAsync (Component-Local Async State)',
  'queryResource.cardQueryResourceTitle': 'queryResource (Shared Server & Entity Cache)',
  'queryResource.scope': 'Scope',
  'queryResource.cache': 'Cache',
  'queryResource.mutations': 'Mutations',
  'queryResource.freshness': 'Freshness',
  'queryResource.polling': 'Polling',
  'queryResource.invalidation': 'Invalidation',
  'queryResource.bestFor': 'Best For',
  'queryResource.resourceAsyncScopeDesc': 'Bound strictly to the lifecycle of the single component instance.',
  'queryResource.resourceAsyncCacheDesc': 'No global cache. Destroying the component destroys the data.',
  'queryResource.resourceAsyncMutationsDesc': 'Built-in execute() for direct one-off triggers.',
  'queryResource.resourceAsyncBestForDesc':
    'Form submission states, local typeahead search filters, modal-isolated data fetches, file exports.',
  'queryResource.queryResourceScopeDesc': 'Managed globally across routes & components by QueryClient.',
  'queryResource.queryResourceCacheDesc': 'Identical query keys share in-flight HTTP requests and memory cache.',
  'queryResource.queryResourceFreshnessDesc': 'Configurable staleTime and gcTime (Stale-While-Revalidate).',
  'queryResource.queryResourcePollingDesc': 'Coordinated pollInterval that respects tab visibility automatically.',
  'queryResource.queryResourceInvalidationDesc': 'Auto-refetched via tag invalidation from mutateResource.',
  'queryResource.queryResourceBestForDesc':
    'Server entities (users, dashboards, projects, cluster state) shared across multiple views.',
  'queryResource.thFeature': 'Feature',
  'queryResource.rowPrimaryLayer': 'Primary Layer',
  'queryResource.rowPrimaryLayerResource': 'Component-level local async state',
  'queryResource.rowPrimaryLayerQuery': 'Client-wide shared server state',
  'queryResource.rowSharedMemory': 'Shared Memory Cache',
  'queryResource.badgeNoneComponent': 'None (Component-bound)',
  'queryResource.badgeGlobalKey': 'Global by QueryKey',
  'queryResource.rowDeduplication': 'Concurrent Request Deduplication',
  'queryResource.badgePerInstance': 'Per-instance (switch/exhaust)',
  'queryResource.badgeClientCoalesced': 'Client-wide Coalesced',
  'queryResource.rowStaleWhileRevalidate': 'Stale-While-Revalidate',
  'queryResource.badgeManualPreserve': 'Manual (preserveValueOnError)',
  'queryResource.badgeAutoStale': 'Automatic via staleTime',
  'queryResource.rowBackgroundPolling': 'Background Polling',
  'queryResource.badgeNoneBuiltIn': 'None built-in (or external poll)',
  'queryResource.badgeCoordinatedVisibility': 'Coordinated + Visibility Aware',
  'queryResource.rowTagInvalidation': 'Tag-based Invalidation',
  'queryResource.badgeManualReload': 'Manual reload trigger',
  'queryResource.badgeAutoMutate': 'Automatic via mutateResource',
  'queryResource.lifecycleTitle': 'Lifecycle States & Signal Matrix',
  'queryResource.lifecycleIntro':
    'Understand the operational differences between isLoading, isInitialLoading, and isRefreshing to avoid blank-screen flashes and implement smooth background revalidations. The matrix assumes a defined successful value. hasValue() returns false for an undefined result.',
  'queryResource.matrixState': 'Lifecycle State',
  'queryResource.matrixStatus': 'status()',
  'queryResource.matrixWhenToUse': 'Recommended UI Behavior',
  'queryResource.matrixInitialLoad': 'First Uncached Fetch',
  'queryResource.matrixInitialLoadUsage': 'Display page skeleton or central spinner; no data is available yet.',
  'queryResource.matrixResolved': 'Settled / Cached',
  'queryResource.matrixResolvedUsage': 'Render content normally; data is available and fresh or stale.',
  'queryResource.matrixRefreshingState': 'Background Revalidation (SWR)',
  'queryResource.matrixRefreshingUsage':
    'Keep existing UI visible! Show subtle inline indicator or loading spinner on the refresh button.',
  'queryResource.matrixInitialError': 'Initial Failure',
  'queryResource.matrixInitialErrorUsage':
    'Display full error state / empty card with retry button (isInitialError() is true).',
  'queryResource.matrixRefreshError': 'Refresh Failure',
  'queryResource.matrixRefreshErrorUsage':
    'Keep displaying cached data! Show a non-intrusive warning banner or toast (isRefreshError() is true).',
  'queryResource.placementTitle': 'Architecture: Component vs. Service Placement',
  'queryResource.loading': 'Loading…',
  'queryResource.placementIntro':
    'Where should your queries live? Because <code>queryResource</code> relies on Angular dependency injection, it operates cleanly in both components and services. Choose the right placement based on state scope and sharing needs:',
  'queryResource.thPlacement': 'Placement',
  'queryResource.thScopeLifetime': 'Scope & Lifetime',
  'queryResource.thStateSharing': 'State Sharing',
  'queryResource.thCoordination': 'Re-fetching Coordination',
  'queryResource.thRecommendation': 'Best Used For',
  'queryResource.rowComponentPlacement': 'Component Placement',
  'queryResource.rowComponentScope': 'Bound to component injector; detached on unmount',
  'queryResource.rowComponentSharing': 'Isolated to single component instance',
  'queryResource.rowComponentCoord': 'Local triggers (this.query.reload())',
  'queryResource.rowComponentRec': 'Isolated views, modals, forms, one-off detail tabs',
  'queryResource.rowServicePlacement': 'Service Placement',
  'queryResource.rowServiceScope': 'Bound to service injector; persists across route navigation',
  'queryResource.rowServiceSharing': 'Shared synchronously across multiple components & routes',
  'queryResource.rowServiceCoord': 'Global coordination via service actions & tag invalidation',
  'queryResource.rowServiceRec': 'Auth session, active tenant/database selection, master-detail',
  'queryResource.tabServicePatternA': 'Pattern A: Global Auth Session (Root Service)',
  'queryResource.tabServicePatternADesc':
    'A singleton service holds currentUser and updateProfile. Multiple components (navbar, profile card) read the exact same signal without RxJS subjects or event buses.',
  'queryResource.tabServicePatternB': 'Pattern B: Parameterized Master-Detail (Feature Service)',
  'queryResource.tabServicePatternBDesc':
    'A feature service holds activeDatabaseId. When the master list updates the selection signal, queryResource automatically loads the matching detail specs.',
  'queryResource.tabComponentPlacement': 'Pattern C: Component Placement (Isolated View)',
  'queryResource.tabComponentPlacementDesc':
    'Direct component placement is the cleanest approach when data is unique to a single view, eliminating the need for extra service files.',
  'queryResource.simulatedTopbar': 'Global Topbar Navigation',
  'queryResource.simulatedProfile': 'User Profile Card',
  'queryResource.simulatedMasterList': 'Master List (Select Database)',
  'queryResource.simulatedDetailCard': 'Detail View (Active Specs)',
  'queryResource.updateNameBtn': 'Update name',
  'queryResource.componentPlacementAdvice':
    'Component Placement is recommended when data is strictly scoped to one view. It requires zero extra files, automatically binds to component signal inputs input(), and cleans up immediately on unmount.',
  'queryResource.demo1Section': 'Request Coalescing & Deduplication',
  'queryResource.demo1SectionDesc':
    'In modular dashboards and micro-frontends, separate components (e.g. a navbar status pill, a sidebar quota gauge, and a dashboard summary card) often mount simultaneously and depend on the same underlying endpoint. Instead of emitting 3 redundant HTTP requests, <code>QueryClient</code> deduplicates and coalesces them into 1 in-flight network request. All observers receive the exact same response simultaneously with zero wasted traffic.',
  'queryResource.demo1PlaygroundTitle': 'Independent Components Sharing In-Flight Network Requests',
  'queryResource.demo1PlaygroundDesc':
    'Simulates two independent components (TopbarStatusComponent and DashboardMetricsComponent) mounting simultaneously and requesting the same cluster metrics. Click "Reload Query" to verify that only 1 actual HTTP call is made while both components update in sync.',
  'queryResource.badgeDeduplication': 'Deduplication',
  'queryResource.actualHttpCalls': 'Actual HTTP Calls: {0}',
  'queryResource.reloadQuery': 'Reload Query',
  'queryResource.widgetATitle': 'Global Navigation Bar',
  'queryResource.widgetASubtitle': 'TopbarStatusComponent (Active Users & Status)',
  'queryResource.widgetBTitle': 'Main Dashboard Card',
  'queryResource.widgetBSubtitle': 'DashboardMetricsComponent (CPU Load & Memory)',
  'queryResource.activeUsers': 'Active Users',
  'queryResource.cpuLoad': 'CPU Load',
  'queryResource.memoryUsage': 'Memory Usage',
  'queryResource.status': 'Status',
  'queryResource.updated': 'Updated',
  'queryResource.demo2Section': 'Stale-While-Revalidate & Freshness Policies',
  'queryResource.demo2SectionDesc':
    "<code>staleTime</code> controls how long cached data remains fresh. If an observer requests data while fresh, it renders instantly from memory. If stale, the cached data is displayed immediately while a background refresh executes silently without clearing the UI (indicated by <code>status: 'reloading'</code>).",
  'queryResource.focusRefetchNoteTitle': 'Tab Focus Revalidation',
  'queryResource.focusRefetchNoteBody':
    'By default, refetchOnFocus is disabled in ngx-lift to protect enterprise backends from API stampedes. Pass { refetchOnFocus: true } in query options to revalidate automatically when returning to the tab.',
  'queryResource.configuredStaleTime': 'Configured staleTime: {0} seconds',
  'queryResource.freshnessBadgeFresh': 'FRESH',
  'queryResource.freshnessBadgeStale': 'STALE',
  'queryResource.networkCalls': 'Network Calls: {0}',
  'queryResource.triggerReadReload': 'Trigger Read / Reload',
  'queryResource.revalidatingAlert': 'Background revalidating in progress... existing UI remains interactive!',
  'queryResource.clusterNodes': 'Cluster Nodes',
  'queryResource.healthyNodes': '{0} / {1} Healthy',
  'queryResource.region': 'Region',
  'queryResource.snapshotTime': 'Snapshot Time',
  'queryResource.demo3Section': 'Coordinated Polling with Visibility Awareness',
  'queryResource.demo3SectionDesc':
    'Configure <code>pollInterval</code> to periodically refresh active queries. Multiple observers requesting different intervals are coordinated at the fastest rate. Polling automatically pauses when the browser tab is hidden and resumes immediately upon returning.',
  'queryResource.demo3PlaygroundTitle': 'Background Polling',
  'queryResource.demo3PlaygroundDesc':
    'Enable polling and watch the heartbeat pulse. Notice it pauses if you switch tabs!',
  'queryResource.badgePolling': 'Polling',
  'queryResource.startPolling': 'Start Polling (3s)',
  'queryResource.stopPolling': 'Stop Polling',
  'queryResource.totalPollCycles': 'Total Poll Cycles: {0}',
  'queryResource.ping': 'Ping',
  'queryResource.lastPulse': 'Last Pulse',
  'queryResource.pollingIdleMsg':
    'Polling is currently idle. Click "Start Polling" to observe live coordinated background checks.',
  'queryResource.demo4Section': 'Mutations & Tag Invalidation (mutateResource)',
  'queryResource.demo4SectionDesc':
    '<code>mutateResource</code> handles asynchronous writes. Upon successful mutation, it invalidates matching tags, causing all active queries with those tags to automatically refetch the latest server data in the background.',
  'queryResource.demo4PlaygroundTitle': 'Tag-Based Invalidation',
  'queryResource.demo4PlaygroundDesc':
    'Add a new member. Upon mutation completion, usersQuery automatically refetches in the background!',
  'queryResource.badgeMutations': 'Mutations',
  'queryResource.addTeamMember': 'Add Team Member',
  'queryResource.nameLabel': 'Name',
  'queryResource.namePlaceholder': 'e.g. Charlie Brown',
  'queryResource.roleLabel': 'Role',
  'queryResource.rolePlatformEngineer': 'Platform Engineer',
  'queryResource.roleSre': 'Site Reliability Engineer',
  'queryResource.roleProductDesigner': 'Product Designer',
  'queryResource.addMemberBtn': 'Add Member',
  'queryResource.savingBtn': 'Saving...',
  'queryResource.activeMembersTitle': 'Active Team Members',
  'queryResource.thId': 'ID',
  'queryResource.thName': 'Name',
  'queryResource.thRole': 'Role',
  'queryResource.diagnosticsSection': 'Developer Diagnostics & Cache Inspector',
  'queryResource.diagnosticsSectionDesc':
    'Register provideQueryDevtools() once in app.config.ts for a development-only floating launcher. Inspect queries in a bottom panel while continuing to use the application.',
  'queryResource.diagnosticsPlaygroundTitle': 'Query inspector panel',
  'queryResource.diagnosticsPlaygroundDesc':
    'Search, filter and sort queries; inspect cached data, errors and timing details. Refetch explicitly runs the selected loader. This documentation preview is also enabled in production.',
  'queryResource.badgeDiagnostics': 'Diagnostics',
  'queryResource.refreshDiagnostics': 'Refresh Diagnostics',
  'queryResource.diagTotalEntries': 'Total Entries',
  'queryResource.diagActiveQueries': 'Active Queries',
  'queryResource.diagInactiveQueries': 'Inactive (GC Pending)',
  'queryResource.diagPendingRequests': 'Pending reads',
  'queryResource.diagTotalObservers': 'Total Observers',
  'queryResource.diagVisibility': 'Visibility',
  'queryResource.diagVisible': 'Active',
  'queryResource.diagHidden': 'Hidden / Inactive',
  'queryResource.thQueryKey': 'Query Key',
  'queryResource.thObservers': 'Observers',
  'queryResource.thRemainingGc': 'GC Countdown',
  'queryResource.thRemainingPoll': 'Next Poll In',
  'queryResource.noQueriesCached': 'No query entries currently in cache.',
  'queryResource.apiReference': 'API Reference',
  'mutateResource.title': 'mutateResource',
  'mutateResource.overview':
    '<code>mutateResource</code> coordinates asynchronous server writes (POST, PUT, PATCH, DELETE) with automatic tag-based cache invalidation, built-in concurrency strategies (exhaust, concat, parallel), and reactive Angular Signals.',
  'mutateResource.featuresTitle': 'Key Capabilities',
  'mutateResource.featuresIntro':
    'Unlike read-only queries that trigger reactively from parameter changes, mutations run strictly upon explicit user interaction.',
  'mutateResource.cardTagInvalidationTitle': 'Automatic Tag Invalidation',
  'mutateResource.cardTagInvalidationDesc':
    'Invalidate tags on write success to automatically refresh all active queryResource observers across the application without manual reload plumbing.',
  'mutateResource.cardConcurrencyTitle': 'Configurable Concurrency',
  'mutateResource.cardConcurrencyDesc':
    'Control simultaneous submissions via "exhaust" (ignore/join duplicate clicks), "concat" (FIFO queue), or "parallel" (default).',
  'mutateResource.cardSignalsTitle': 'Reactive State Signals',
  'mutateResource.cardSignalsDesc':
    'Provides reactive value, error, status ("idle" | "loading" | "resolved" | "error"), and isLoading signals optimized for OnPush change detection.',
  'mutateResource.cardPromiseTitle': 'Direct Promise Returns',
  'mutateResource.cardPromiseDesc':
    'The mutate() call returns a standard Promise, allowing async/await and try/catch syntax in component event handlers.',
  'mutateResource.demo1Section': '1. Tag Invalidation with Active Queries',
  'mutateResource.demo1SectionDesc':
    'Submitting a mutation invalidates matching tags, immediately triggering background refreshes for any active queryResource instances observing those tags.',
  'mutateResource.demo1PlaygroundTitle': 'Create Item & Observe Query Update',
  'mutateResource.demo1PlaygroundDesc':
    'Submit the form to add a user. Notice how the user table updates automatically through tag invalidation without any manual reload calls!',
  'mutateResource.badgeInvalidation': 'Tag Invalidation',
  'mutateResource.addTeamMember': 'Add Team Member',
  'mutateResource.nameLabel': 'Name',
  'mutateResource.namePlaceholder': 'e.g. Dana Scully',
  'mutateResource.roleLabel': 'Role',
  'mutateResource.rolePlatformEngineer': 'Platform Engineer',
  'mutateResource.roleSre': 'Site Reliability Engineer',
  'mutateResource.roleProductDesigner': 'Product Designer',
  'mutateResource.addMemberBtn': 'Add Member',
  'mutateResource.savingBtn': 'Saving...',
  'mutateResource.activeMembersTitle': 'Active Team Members',
  'mutateResource.thId': 'ID',
  'mutateResource.thName': 'Name',
  'mutateResource.thRole': 'Role',
  'mutateResource.demo2Section': '3. Concurrency Modes: exhaust, concat, and parallel',
  'mutateResource.demo2SectionDesc':
    'Test how different concurrency strategies handle rapid button clicks. "exhaust" prevents accidental double-submission by discarding or joining duplicate clicks while a mutation is already running.',
  'mutateResource.demo2PlaygroundTitle': 'Rapid Click & Concurrency Simulation',
  'mutateResource.demo2PlaygroundDesc':
    'Choose a mode, then rapidly click "Trigger 800ms Mutation" several times to see how executions are handled.',
  'mutateResource.badgeConcurrency': 'Concurrency',
  'mutateResource.modeLabel': 'Concurrency Strategy',
  'mutateResource.modeExhaust': 'exhaust (Drop rapid duplicate clicks - double submit guard)',
  'mutateResource.modeConcat': 'concat (Queue invocations in sequence)',
  'mutateResource.modeParallel': 'parallel (Execute each invocation independently)',
  'mutateResource.triggerMutationBtn': 'Trigger 800ms Mutation',
  'mutateResource.totalClicks': 'Total Button Clicks: {0}',
  'mutateResource.actualExecutions': 'Actual Executions: {0}',
  'mutateResource.inFlight': 'Currently In-Flight: {0}',
  'mutateResource.recentLogs': 'Execution Log',
  'mutateResource.clearLogs': 'Clear Log',
  'mutateResource.noLogsYet': 'No mutations executed yet. Click the button above to begin.',
  'mutateResource.demo3Section': '2. Reactive Status Signals & Error Recovery',
  'mutateResource.demo3SectionDesc':
    '<code>mutateResource</code> manages errors cleanly. When a write fails, the error signal is populated, status becomes "error", and the returned Promise rejects for try/catch handling.',
  'mutateResource.demo3PlaygroundTitle': 'Status Signals & Failure Recovery',
  'mutateResource.demo3PlaygroundDesc':
    'Toggle the failure simulation and trigger the action to inspect the reactive error state.',
  'mutateResource.badgeError': 'Error Handling',
  'mutateResource.simulateErrorLabel': 'Simulate 500 Server Error',
  'mutateResource.saveSettingsBtn': 'Save Configuration',
  'mutateResource.statusLabel': 'Status',
  'mutateResource.isLoadingLabel': 'isLoading',
  'mutateResource.errorSuccessMsg': 'Configuration saved successfully!',
  'mutateResource.apiReference': 'API Reference',
  'injectParams.example1Title': 'Example 1: Get All Route Parameters',
  'injectParams.example1Desc':
    'When called without any arguments, returns a signal containing the entire params object:',
  'injectParams.example2Title': 'Example 2: Get Single Parameter',
  'injectParams.example2Desc': 'When a key is specified, returns the value of the corresponding parameter as a signal:',
  'injectParams.example3Title': 'Example 3: Transform Parameters',
  'injectParams.example3Desc': 'Transform parameters using a transform function:',
  'injectParams.example4Title': 'Example 4: Transform with Initial Value',
  'injectParams.example4Desc': 'Transform parameters with an initial value and type conversion:',
  'injectParams.example4Callout':
    'When <code>initialValue</code> is provided as a boolean or number, <code>transform</code> function must be provided returning the same type.',
  'injectParams.example5Title': 'Example 5: Complete Usage Example',
  'injectParams.example5Desc': 'Complete example showing various usage patterns:',
  'injectParams.example6Title': 'Example 6: Custom Injector',
  'injectParams.example6Desc':
    'Pass a custom <code>Injector</code> via the options object to access route parameters outside an ambient injection context (such as inside composable helper functions or dynamic services):',
  'injectParams.title': 'injectParams',
  'injectParams.overview':
    'The <code>injectParams</code> function provides a reactive signal for route parameters, automatically updating when navigation occurs.',
  'injectParams.apiSummary': 'Injects and transforms route parameters as reactive signals.',
  'injectParams.paramKeyOrTransform':
    'When a string is provided, returns the value of that route parameter. When a function is provided, it processes all route parameters. If omitted, returns all params.',
  'injectParams.paramOptions': 'Configuration object containing transform function, initialValue, and/or injector.',
  'injectParams.returnsDesc': 'A signal containing the route parameter value(s) or transformed result.',
  'injectParams.usagePatterns': 'Usage Patterns',
  'injectParams.pattern1': 'No arguments: Returns signal with all route parameters',
  'injectParams.pattern2': 'String key: Returns signal with specific parameter value (or null if not present)',
  'injectParams.pattern3': 'Transform function: Returns signal with transformed parameters',
  'injectParams.pattern4': 'With options: Allows initial value and type conversion',
  'injectQueryParams.title': 'injectQueryParams',
  'injectQueryParams.overview':
    'The <code>injectQueryParams</code> function provides a reactive signal for URL query parameters.',
  'injectQueryParams.apiSummary': 'Injects and transforms route query parameters as reactive signals.',
  'injectQueryParams.paramKeyOrTransform':
    'When a string is provided, returns the value of that query parameter. When a function is provided, it processes all query parameters. If omitted, returns all query params.',
  'injectQueryParams.paramOptions':
    'Configuration object containing transform function, initialValue, and/or injector.',
  'injectQueryParams.returnsDesc': 'A signal containing the query parameter value(s) or transformed result.',
  'injectQueryParams.example1Title': 'Example 1: Get All Query Parameters',
  'injectQueryParams.example1Desc': 'Get all query parameters as a signal:',
  'injectQueryParams.example2Title': 'Example 2: Get Single Query Parameter',
  'injectQueryParams.example2Desc': 'Get a specific query parameter by name:',
  'injectQueryParams.example3Title': 'Example 3: Transform Query Parameters',
  'injectQueryParams.example3Desc': 'Transform query parameters using a transform function:',
  'injectQueryParams.example4Title': 'Example 4: Transform with Initial Value',
  'injectQueryParams.example4Desc': 'Transform query parameters with an initial value and type conversion:',
  'injectQueryParams.example5Title': 'Example 5: Complete Usage Example',
  'injectQueryParams.example5Desc': 'Complete example showing various usage patterns:',
  'injectQueryParams.example6Title': 'Example 6: Custom Injector',
  'injectQueryParams.example6Desc':
    'Pass a custom <code>Injector</code> via the options object to access route query parameters outside an ambient injection context (such as inside composable helper functions or dynamic services):',
  'createTrigger.title': 'createTrigger',
  'createTrigger.overview':
    'The <code>createTrigger</code> function provides a way to manually initiate signal re-computations by referencing the trigger signal it creates. Similar to an RxJS Subject, calling <code>next()</code> increments the counter signal and notifies dependent effects or computed signals.',
  'createTrigger.apiSummary': 'Creates a trigger signal that can be used to manually initiate signal re-computations.',
  'createTrigger.propValue': 'A signal that returns the number of times the trigger has been called (starts at 0).',
  'createTrigger.propNext': 'A method to trigger the signal update.',
  'createTrigger.returnsDesc': 'An object exposing value signal and next() trigger method.',
  'createTrigger.example1': 'Example 1: Basic Usage',
  'createTrigger.example1Desc': 'Create a trigger and use it to manually trigger signal re-computations:',
  'createTrigger.example2': 'Example 2: Conditional Effect',
  'createTrigger.example2Desc': 'Use the trigger value conditionally to prevent running on initialization:',
  'createTrigger.btnSeeConsole': 'See Console Log',
  'createTrigger.callout':
    "Initially, <code>createTrigger's value()</code> returns 0. Whenever <code>next</code> is explicitly called, the value adds 1.",
  'pageContainer.title': 'Page Container',
  'pageContainer.overview':
    'The <code>cll-page-container</code> component provides a standardized, responsive page shell across Clarity applications. It encapsulates uniform title typography, fluid padding, and consistent spacing while offering a content projection slot for arbitrary views, cards, forms, and grids.',
  'pageContainer.example1': 'Example 1: Basic Page Container',
  'pageContainer.example1Desc': 'Set a mandatory title and project arbitrary view elements into the main page slot.',
  'pageContainer.example1Badge': 'Page Shell',
  'pageContainer.example2': 'Example 2: Custom Spacing & Maximum Widths',
  'pageContainer.example2Desc':
    'Pass Clarity layout or custom utility classes to customClass to control layout density.',
  'pageContainer.example2Badge': 'Responsive',
  'pageContainer.example3': 'Example 3: Dynamic HTML Markup in Page Title',
  'pageContainer.example3Desc':
    'The title input renders via innerHTML, allowing badges, status indicators, or tags directly in the header.',
  'pageContainer.example3Badge': 'HTML Title',
  'pageContainer.demoUserManagement': 'User Management',
  'pageContainer.demoBodyContent': 'Page body content rendered inside the default slot.',
  'pageContainer.demoClusterSettings': 'Cluster Settings',
  'pageContainer.demoConfigured': 'Configured with custom styling classes.',
  'pageContainer.demoAuditLog': "Audit Log <span class='badge badge-info'>Live</span>",
  'pageContainer.demoLogStream': 'Log entries stream here in real-time.',
  'pageContainer.apiSummary': 'Standardized page wrapper with responsive margins and header typography.',
  'pageContainer.inputTitle': 'The title displayed at the top of the container. Rendered via [innerHTML].',
  'pageContainer.inputCustomClass': 'Additional CSS classes applied directly to the container root element.',
  'pageContainer.contentProjectionDesc':
    'Default <ng-content /> slot for placing all main page content below the title.',
  'alert.title': 'Alert',
  'alert.overview':
    "Alerts are banners that draw the user's attention to important messages. Visual elements such as icons and colors indicate the type and urgency of the information being communicated. Use alerts to provide critical information that requires immediate user attention within the current context.",
  'alert.example1': 'Example 1: Display API Error Response',
  'alert.example1Desc':
    'When displaying error responses from APIs, use the error input to pass error details. The alert displays the error message from the response object or falls back to HttpErrorResponse.',
  'alert.example1Badge': 'API Error',
  'alert.example2': 'Example 2: Display Custom Content',
  'alert.example2Desc':
    'The content is rendered using innerHTML, allowing rich formatting and embedded HTML tags across various alert levels.',
  'alert.example2Badge': 'Rich Text',
  'alert.example3': 'Example 3: Content Projection',
  'alert.example3Desc':
    'The alert component supports content projection via ng-content, enabling inclusion of complex HTML structures and child components.',
  'alert.example3Badge': 'ng-content',
  'alert.example4': 'Example 4: Compact Sizing (isSmall)',
  'alert.example4Desc':
    'Use the isSmall input to display a space-efficient compact alert for drawers and small containers.',
  'alert.example4Badge': 'Compact',
  'alert.example5': 'Example 5: Lightweight Alerts',
  'alert.example5Desc': 'Use borderless lightweight alerts inside cards, tables, and nested status layouts.',
  'alert.example5Badge': 'Lightweight',
  'alert.example6': 'Example 6: App-Level Alerts',
  'alert.example6Desc': 'Place high-priority app-level alerts at the very top of all content and navigation.',
  'alert.example6Badge': 'App-Level',
  'alert.apiSummary': 'Alert component that displays important messages with various types and Clarity theme styles.',
  'alert.inputAlertType': 'One of "info", "warning", "success", "danger", "neutral", "loading", or "unknown".',
  'alert.inputIsAppLevel': 'Boolean flag for app-level alerts displayed at the top of the viewport.',
  'alert.inputIsSmall': 'Boolean flag for compact sizing in tight containers or drawers.',
  'alert.inputIsLightweight': 'Boolean flag for lightweight styling without borders.',
  'alert.inputError': 'An HttpErrorResponse or error object to display error details.',
  'alert.inputContent': 'A string containing the alert message content. Supports HTML tags via innerHTML.',
  'alert.contentProjectionDesc':
    'The component supports ng-content projection for complex HTML structures and Angular components.',
  'alert.projectionNotice': 'Multiple errors are listed as below by content projection:',
  'alert.errUndefined': 'Cannot read undefined.',
  'alert.errObject': 'Cannot upload an object.',
  'alert.serverDown': 'Server is down',
  'alert.contentSuccess': "I'm a successful content",
  'alert.contentInfo': "I'm an info content",
  'alert.contentWarning': "I'm a warning content",
  'alert.contentDanger': "I'm a danger content",
  'alert.contentHtml': '<strong>Hello world</strong>, I like clr-lift!',
  'alert.contentSmall': "I'm a small alert",
  'alert.contentNeutral': "I'm a neutral content",
  'alert.contentLoading': "I'm a loading content",
  'alert.contentUnknown': "I'm an unknown content",
  'alert.contentAppLevel': 'App level alert from content input',
  'alert.contentAppProjection': 'App level alert from projection',
  'alert.btnView': 'View',
  'callout.title': 'Callout',
  'callout.overview':
    'The <code>cll-callout</code> component displays an informational callout box designed to emphasize important notes, tips, warnings, or prerequisite instructions with responsive icon display and theme awareness.',
  'callout.example1': 'Example 1: Basic Informational Callout',
  'callout.example1Desc': 'Project simple text messages or highlights using default content projection.',
  'callout.example2': 'Example 2: Lists and Links',
  'callout.example2Desc':
    'Callouts handle formatted lists and external hyperlinks seamlessly in both light and dark mode.',
  'callout.example3': 'Example 3: Rich Content with Headings and Badges',
  'callout.example3Desc':
    'Compose headers, descriptive paragraphs, and Clarity badges inside the callout projection container.',
  'callout.example1Note': 'Please note that all configuration changes take effect immediately.',
  'callout.example2Theme': 'Supports both light and dark themes automatically.',
  'callout.example2Docs': 'For more details, check out the Clarity Design System documentation.',
  'callout.example3Tip': 'Pro Tip for Production Deployments',
  'callout.example3DescText': 'Ensure resource limits are explicitly configured before triggering the rollout process.',
  'callout.example3LabelDeployment': 'Deployment',
  'callout.example3LabelValidated': 'Validated',
  'themeToggle.title': 'Theme Toggle',
  'themeToggle.exercise':
    'Toggle the theme and reload: ThemeService persists the selection as cds-theme in localStorage and applies it to the document body. Both controls share the service. changeTheme reports the toggle action; service calls do not emit that component event.',
  'themeToggle.overview':
    'The <code>cll-theme-toggle</code> component and <code>ThemeService</code> provide seamless theme switching between Clarity light and dark modes with Signal reactivity and localStorage persistence.',
  'themeToggle.callout':
    'The toggle button automatically renders a moon icon in light mode and a sun icon in dark mode, including localized tooltips and accessible aria-label announcements.',
  'themeToggle.example1Badge': 'Interactive Toggle',
  'themeToggle.example1Desc': 'Click the toggle button to switch themes and observe the reactive event emission:',
  'themeToggle.currentTheme': 'Current Theme Signal:',
  'themeToggle.inspectorTitle': 'Theme Signal Inspector',
  'themeToggle.inspectorDesc': 'Live state synchronized with document.body and localStorage',
  'themeToggle.example2Badge': 'Programmatic Control',
  'themeToggle.example2Desc':
    'Use ThemeService to read the current theme reactively or programmatically set a specific theme:',
  'themeToggle.setLight': 'Set Light Theme',
  'themeToggle.setDark': 'Set Dark Theme',
  'themeToggle.example3': 'Example 3: CSS / SCSS Selectors for Theme Styling',
  'themeToggle.example3Desc':
    'Components and global styles can target [cds-theme="dark"] on the body or via :host-context([cds-theme="dark"]):',
  'themeToggle.serviceSummary': 'Injectable service provided in root for managing application theme state.',
  'spinner.title': 'Spinner',
  'spinner.overview':
    'A spinner is a visual indicator of an ongoing, user-initiated process. Clarity has two types of spinners, each with its own use case: <strong>Page Spinners</strong> for tracking the progress of an operation related to an entire page, and <strong>Inline Spinners</strong> for tracking the progress of an operation related to a specific component.',
  'spinner.example1': 'Example 1: Default Spinner',
  'spinner.example1Desc': 'The default spinner is centered, large, and has a block display.',
  'spinner.example2': 'Example 2: Size Variations',
  'spinner.example2Desc': 'Spinners can be displayed in different sizes: large (default), medium, and small.',
  'spinner.example3': 'Example 3: Alignment Options',
  'spinner.example3Desc': 'Control the alignment of the spinner using the center input.',
  'spinner.example4': 'Example 4: Custom Styling',
  'spinner.example4Desc': 'Apply custom CSS classes to the spinner for additional styling.',
  'spinner.example5': 'Example 5: Inline Spinner',
  'spinner.example5Desc':
    'Use the inline input to display the spinner as an inline-block element, useful for aligning spinners within text or other inline elements.',
  'spinner.large': 'Large (default):',
  'spinner.medium': 'Medium:',
  'spinner.small': 'Small:',
  'spinner.centered': 'Centered (default):',
  'spinner.leftAligned': 'Left-aligned:',
  'spinner.loading': 'Loading...',
  'tooltip.title': 'Tooltip',
  'tooltip.overview':
    'The Tooltip component provides a flexible way to display additional information, hints, or interactive content. It supports hover and copy actions within the content popover, configurable delay options, automatic positioning, focus trapping for accessibility, click outside interaction, keyboard operations, and dark mode support.',
  'tooltip.example1': 'Example 1: Basic Tooltip',
  'tooltip.example1Desc':
    'In this usage, you can simply add a tooltip by specifying the content directly or through attribute directive cllTooltipContent. Additional configurations such as hide delay and width can be customized as per your requirements.',
  'tooltip.example2': 'Example 2: Tooltip with Dynamic Content',
  'tooltip.example2Desc':
    'Tooltip accepts dynamic content provided through Angular templates. You can specify templates using ng-template and bind them to the tooltip component for dynamic display.',
  'tooltip.example3': 'Example 3: Dynamic Component Creation',
  'tooltip.example3Desc':
    'Tooltip can render dynamically created Angular components using ComponentRef or component type.',
  'tooltip.example4': 'Example 4: Tooltip Positions',
  'tooltip.example4Desc': 'Supports 12 different placement orientations with intelligent collision detection.',
  'tooltip.apiSummary':
    'Directive for adding tooltip functionality to elements with auto-positioning and collision detection.',
  'tooltip.basic1': 'Basic Tooltip 1',
  'tooltip.basic2': 'Basic Tooltip 2 with Delay 500ms',
  'tooltip.empty': "Empty Content Won't Show Tooltip",
  'tooltip.templateHover': 'TemplateRef Example Hover',
  'tooltip.templateText': 'A great tooltip:',
  'tooltip.templateCallout': 'You can also put a component inside ng-template',
  'tooltip.contextCallout':
    'cllTooltipContentContext is optional, it is the context passed to the ng-template during view creation.',
  'tooltip.componentRefHover': 'Component Ref Example',
  'toast.title': 'Toast',
  'toast.overview':
    'Toast messages serve as a user-friendly means to communicate medium-priority events that users may wish to reference later. These messages appear temporarily on the screen and can be stored in a notifications panel until closed or expired.',
  'toast.example1': 'Example 1: Setup Toast Container',
  'toast.example1Desc':
    'To implement toast messages, import ToastContainerComponent from clr-lift and include <cll-toast-container [timeoutSeconds]="8" /> in your root component.',
  'toast.example2': 'Example 2: Create Toast with addToast',
  'toast.example2Desc':
    'Use addToast to pass a toast object with required properties (title and description) and optional configurations.',
  'toast.example3': 'Example 3: Shorthand APIs',
  'toast.example3Desc': 'Four shorthand APIs are provided to create toasts with distinct status types:',
  'toast.serviceSummary': 'Service for creating and managing toast notifications.',
  'toast.guidelinesTitle': 'Usage Guidelines',
  'toast.doTitle': 'Do:',
  'toast.do1': 'Provide Navigation: Include a link or location for users to navigate to from the toast.',
  'toast.do2':
    'Use Relative Timestamps: Display timestamps relative to the user (e.g., "1 hour ago" instead of an absolute date).',
  'toast.do3':
    'Keep Titles Short: Use a short, succinct title (max 35 characters) that conveys the high-level message quickly.',
  'toast.do4': 'Craft Consumable Descriptions: Keep descriptions concise (max 156 characters) for easy consumption.',
  'toast.dontTitle': 'Do Not:',
  'toast.dont1': 'Use "Close" as an Action: Clicking the close button should close the toast.',
  'toast.dont2':
    'Overcrowd Actions: Limit toast messages to a maximum of 2 actions; prioritize the most important ones.',
  'toast.dont3':
    'Include Object Identifiers in Title: Avoid using object identifiers in the title; use them only in the description.',
  'toast.dont4': 'Add Icons: To maintain clarity, refrain from adding icons to the toast messages.',
  'toast.dont5': 'Show Irrelevant Toasts: Display toasts only when the information is still relevant to the user.',
  'toast.optionsTitle': 'ToastOptions Interface',
  'toast.containerSummary':
    'Container component that holds all toast notifications. Should appear only once in your application.',
  'multiAlerts.title': 'Alerts (Multiple)',
  'multiAlerts.overview':
    'Frequently, there is a need to showcase multiple alerts, particularly those at the application level positioned at the top. The clr-lift library offers two essential utilities: <code>AlertContainerComponent</code> and <code>AlertService</code> to add, remove, and manage alerts programmatically.',
  'multiAlerts.example1': 'Example 1: Setup Alert Container',
  'multiAlerts.example1Desc':
    'Import AlertContainerComponent and include <cll-alert-container /> above the Clarity header tag within the main container.',
  'multiAlerts.example2': 'Example 2: Basic Usage',
  'multiAlerts.example2Desc':
    'Import AlertService and utilize its addAlert(), deleteAlert(), or clearAlerts() methods for effective management of alerts.',
  'multiAlerts.example3': 'Example 3: Advanced Usage with Interactive Elements',
  'multiAlerts.example3Desc':
    'Place interactive elements (such as buttons or links) at any position within your message using content with targetSelector, or provide structured action buttons.',
  'multiAlerts.example4': 'Example 4: Interactive Demo',
  'multiAlerts.example4Desc': 'Try adding different types of alerts and clearing alerts using the buttons below:',
  'multiAlerts.serviceSummary': 'Service for managing multiple alerts programmatically.',
  'multiAlerts.alertTypeTitle': 'Alert Type',
  'multiAlerts.containerSummary':
    'Container component that displays all alerts. Should be placed above the Clarity header tag within the main container.',
  'fileReader.title': 'File Reader',
  'fileReader.firstTask':
    'Choose a text file, inspect the caller-owned form, then clear it. A file selection is required; certificate limits and parsing errors are covered in the next example.',
  'fileReader.overview':
    'The <code>FileReaderComponent</code> allows you to easily browse and read the contents of text files. It supports file selection, content reading as plain text or base64 encoded string, file size validation, and emits events when files are selected or removed.',
  'fileReader.example1': 'Example 1: Basic File Reader',
  'fileReader.example1Desc': 'Basic usage with form control integration:',
  'fileReader.example2': 'Example 2: Certificate File Reader with Validation',
  'fileReader.example2Desc': 'File reader with certificate validation and certificate signpost display:',
  'fileReader.apiSummary': 'Component for browsing and reading file contents with validation support.',
  'fileReader.feature1': 'File browsing and selection',
  'fileReader.feature2': 'Content reading as plain text or base64 encoded string',
  'fileReader.feature3': 'File size validation',
  'fileReader.feature4': 'Content parsing error handling',
  'fileReader.feature5': 'Form control integration',
  'keyValueInputs.title': 'Key Value Inputs',
  'keyValueInputs.overview':
    'The <code>KeyValueInputsComponent</code> is an Angular component designed to facilitate the input of key-value pairs. It provides a dynamic form allowing users to add, edit, and remove key-value pairs with FormArray integration, real-time validation, and smart keyboard navigation.',
  'keyValueInputs.example1': 'Example 1: Basic Usage',
  'keyValueInputs.example1Desc':
    'Create a form with a FormArray and use KeyValueInputsComponent to manage key-value pairs:',
  'keyValueInputs.example2': 'Example 2: Interactive Demo',
  'keyValueInputs.example2Desc': 'Try adding, editing, and removing key-value pairs in the form below:',
  'keyValueInputs.callout':
    'Explore how the KeyValueInputsComponent leverages the UniqueValidator to perform validation against key controls. Click here to learn how uniqueness is enforced in key input fields.',
  'keyValueInputs.formOutput': 'Your form value output:',
  'keyValueInputs.keyHelper': 'run time property key',
  'keyValueInputs.valueHelper': 'run time property value',
  'keyValueInputs.addText': 'add key value',
  'keyValueInputs.apiSummary': 'Component for managing dynamic key-value pair inputs in Angular forms.',
  'statusIndicator.title': 'Status Indicator',
  'statusIndicator.overview':
    'The <code>StatusIndicatorComponent</code> displays a status indicator with an icon and text. It supports various status types (error, success, warning, unknown, inactive, pending), customizable icon sizes, and optional tooltips for additional context.',
  'statusIndicator.example1': 'Example 1: Basic Usage',
  'statusIndicator.example1Desc': 'Display status indicators with different status types and icon sizes:',
  'statusIndicator.example2': 'Example 2: With Tooltip',
  'statusIndicator.example2Desc': 'Add tooltips to status indicators for additional contextual information:',
  'statusIndicator.types': 'Status Types',
  'statusIndicator.iconSizeTshirt': 'Icon Size (T-Shirt Sizing)',
  'statusIndicator.iconSizeNumber': 'Icon Size (Number)',
  'statusIndicator.statusError': 'Error',
  'statusIndicator.statusSuccess': 'Success',
  'statusIndicator.statusWarning': 'Warning',
  'statusIndicator.statusUnknown': 'Unknown',
  'statusIndicator.statusInactive': 'Inactive',
  'statusIndicator.statusPending': 'Pending',
  'statusIndicator.tooltipError': 'describe the error reason',
  'statusIndicator.tooltipSuccess': 'status is success',
  'statusIndicator.tooltipWarning': 'status is warning',
  'statusIndicator.tooltipUnknown': 'unknown status',
  'statusIndicator.tooltipInactive': 'inactive status',
  'statusIndicator.tooltipPending': 'some pending happen',
  'statusIndicator.apiSummary': 'Component for displaying status indicators with icons and text.',
  'certificate.title': 'Certificate Signpost (Viewer)',
  'certificate.overview':
    "The <code>CertificateSignpostComponent</code>, an Angular component, interprets a PEM string, showcasing the certificate's content with a click on the certificate icon. Seamlessly integrated with Clarity, this component exhibits crucial details such as certificate status, validity period, issuer info, and hash values.",
  'certificate.example1': 'Example 1: Parsing Raw PEM',
  'certificate.example1Desc': 'Parse and display a raw PEM certificate string:',
  'certificate.example2': 'Example 2: Parsing PEM (Base64 Encoded)',
  'certificate.example2Desc': 'When PEM strings are Base64 encoded, toggle pemEncoded to decode before parsing:',
  'idleDetection.utilOverview':
    'Idle detection is the process of monitoring user activity and determining when a user becomes inactive. This is particularly useful for applications that require users to remain logged in, as it allows the system to take appropriate action when a user stops interacting with the application, such as warning them of an impending timeout or automatically logging them out after a period of inactivity.',
  'idleDetection.utilOverviewDesc':
    'The Idle Detection Service provides configurable idle and timeout durations, automatic reset on user activity, event emission for idle and timeout phases, and reactive programming support through RxJS observables.',
  'idleDetection.utilExample1Title': 'Example 1: Configure Idle Detection Globally',
  'idleDetection.utilExample1Desc': 'Configure idle and timeout durations globally using the configuration class:',
  'idleDetection.utilPhaseCallout':
    'There are two phases of idle detection: the <strong>idle-detection phase</strong> and the <strong>timeout phase</strong>.',
  'idleDetection.utilPhase1':
    '<strong>Idle-detection phase</strong>: Suppose you configure <code>idleDurationInSeconds</code> to 5 * 60 (5 minutes). From the moment there is no action on the website, you enter this phase. After 5 minutes, the idle detection ends, indicating that you have been idle for a long time. You can subscribe to the <code>onIdleEnd()</code> observable, which will emit at this moment. Once this phase is completed, you will enter the second phase.',
  'idleDetection.utilPhase2':
    '<strong>Timeout phase</strong>: When you enter this phase, the countdown starts immediately from the value of <code>timeoutDurationInSeconds</code>. You can subscribe to the <code>onCountDown()</code> observable to obtain the countdown value. When the countdown reaches 0, the <strong>timeout phase</strong> will end. You can subscribe to the <code>onTimeoutEnd()</code> observable to know when the <strong>timeout phase</strong> ends. At this point, you can log out the user or perform other actions.',
  'idleDetection.utilExample2Title': 'Example 2: Module Configuration',
  'idleDetection.utilExample2Desc': 'Provide the configuration in your NgModule:',
  'idleDetection.utilExample3Title': 'Example 3: Standalone App Configuration',
  'idleDetection.utilExample3Desc': 'Provide the configuration in a standalone application:',
  'idleDetection.utilExample4Title': 'Example 4: Use IdleDetectionService in Component',
  'idleDetection.utilExample4Desc': "Subscribe to the service's observables to react to idle events:",
  'idleDetection.utilExample5Title': 'Example 5: Use IdleDetectionComponent',
  'idleDetection.utilExample5Desc':
    'We provide a component in <code>clr-lift</code> that displays a Clarity modal dialog when the user is idle. The dialog will appear when the idle-detection phase concludes and start counting down. Once the countdown ends, you can hook into the <code>timeout</code> handler in your component to perform custom logic such as clearing the localStorage token and redirecting the user to the login page.',
  'idleDetection.utilExample5ParamDesc':
    'The parameters <code>idleDurationInSeconds</code> and <code>timeoutDurationInSeconds</code> are optional. When these parameters are passed, they will overwrite the configuration passed by <code>provideIdleDetectionConfig</code>.',
  'idleDetection.utilDialogPreview': 'The dialog looks like below:',
  'idleDetection.title': 'Idle Detection',
  'idleDetection.exercise':
    'Start, then leave the page idle for 3 seconds. The warning counts down for 10 seconds. Activity does not dismiss an open warning; confirm explicitly to restart the idle period. Stop releases the timers.',
  'idleDetection.overview':
    'The <code>cll-idle-detection</code> component monitors user inactivity across DOM events (mouse movement, keystrokes, scrolls, and touch). When the idle duration expires, it opens an accessible Clarity countdown dialog and emits a (timeout) event.',
  'idleDetection.example1': 'Example 1: Interactive Idle Dialog Simulation',
  'idleDetection.example1Desc': 'Start a fast 3-second simulation to view the Clarity countdown modal in action:',
  'idleDetection.example2': 'Example 2: Global Configuration with provideIdleDetectionConfig',
  'idleDetection.example2Desc':
    'Define default application-wide idle and timeout intervals in appConfig using provideIdleDetectionConfig.',
  'idleDetection.apiSummary': 'Clarity modal dialog component displaying session timeout countdown on inactivity.',
  'idleDetection.inputIdleDuration':
    'Duration of inactivity in seconds before the countdown modal is displayed. Overrides global configuration if specified.',
  'idleDetection.callout':
    'Start, then leave the page idle for 3 seconds. The warning counts down for 10 seconds. Activity does not dismiss an open warning; confirm explicitly to restart the idle period. Stop releases the timers.',
  'idleDetection.inputTimeoutDuration':
    'Duration of the countdown phase in seconds before session timeout occurs. Overrides global configuration if specified.',
  'idleDetection.outputTimeout': 'Emits void when the countdown reaches 0 without user acknowledgment.',
  'idleDetection.serviceSummary': 'Service for monitoring user activity and detecting idle periods.',
  'idleDetection.methodSetConfig':
    'Sets the idle detection configuration. Overwrites global configuration if provided.',
  'idleDetection.methodStartWatching': 'Starts monitoring user activity for idle detection.',
  'idleDetection.methodClearTimers': 'Clears all active timers and stops monitoring.',
  'idleDetection.methodOnIdleEnd': 'Observable that emits when the idle phase ends and countdown begins.',
  'idleDetection.methodOnTimeoutEnd': 'Observable that emits when the timeout countdown finishes.',
  'idleDetection.methodOnCountDown': 'Observable that emits the remaining seconds during the countdown phase.',
  'datagridUtil.title': 'Datagrid Utilities',
  'datagridUtil.overview':
    'The Clarity datagrid emits a state whenever a user interacts with pagination, filters, or sorting. To facilitate seamless integration with API requests, convertToHttpParams transforms the datagrid state into an HttpParams-ready query object.',
  'datagridUtil.example1': 'Example 1: Using convertToHttpParams',
  'datagridUtil.example1Desc':
    'The convertToHttpParams function transforms a Clarity Datagrid state into a PageQuery object suitable for HttpParams.',
  'datagridUtil.apiSummary':
    'Converts a Clarity Datagrid state object into a PageQuery object suitable for HttpParams in API requests.',
  'datagridUtil.paramState':
    'The Clarity Datagrid state object containing pagination, sorting, and filter information. Can be null for initial load.',
  'datagridUtil.returnsDesc':
    'A PageQuery object containing page, pageSize, sort direction, and filter strings in FIQL format.',
  'datagridUtil.propPage': 'The 1-based page number for pagination.',
  'datagridUtil.propPageSize': 'The number of items to display per page.',
  'datagridUtil.propSortAsc': 'The field name to sort in ascending order.',
  'datagridUtil.propSortDesc': 'The field name to sort in descending order.',
  'datagridUtil.propFilter': 'The filter expression formatted in FIQL format.',
  'dgState.overview':
    'The <code>dgState</code> operator is an RxJS operator designed to manage Clarity Datagrid state transformations with intelligent debouncing and duplicate filtering. It assesses changes in datagrid filters and handles API trigger events efficiently. When filters are modified, the operator introduces a 500ms debounce before initiating the API call, preventing excessive requests during rapid typing. For actions such as sorting or pagination, the API call is made promptly without delay. The operator also provides an optional parameter to control the use of <code>distinctUntilChanged</code>. When enabled (default: <code>true</code>), it ensures that no API call is initiated if the datagrid state remains the same, preventing redundant requests.',
  'dgState.example1Title': 'Example 1: Basic Usage',
  'dgState.example1Desc':
    'Use <code>dgState</code> in your observable pipeline to manage datagrid state changes efficiently:',
  'dgState.example1DataDesc':
    'Assume we have an API returning the following shape of data for a server-driven datagrid:',
  'dgState.example2Title': 'Example 2: Template Implementation with Type Safety',
  'dgState.example2Desc': 'Use async pipe with <code>@if</code> for better type safety:',
  'dgState.example3Title': 'Example 3: Alternative Template Implementation',
  'dgState.example3Desc': 'Use the async pipe directly in your template:',
  'dgState.example4Title': 'Example 4: Live Example',
  'dgState.example4Desc':
    'Below is a working example of a server-driven datagrid using the <code>dgState</code> operator:',
  'dgState.calloutPrefix': 'You can use the ',
  'dgState.calloutSuffix':
    ' utility function to convert the datagrid state into HTTP parameters. See the documentation for more details.',
  'dgState.apiDesc':
    'RxJS operator for handling Clarity Datagrid state transformations with debouncing and optional distinctUntilChanged behavior.',
  'dgState.paramDesc':
    '<em>(Optional)</em> Whether to enable distinctUntilChanged filtering. Defaults to <code>true</code>. When <code>true</code>, suppresses duplicate states. When <code>false</code>, allows API calls even for identical states.',
  'dgState.returnsDesc': 'An operator function that transforms Datagrid state emissions.',
  'dgState.behavior1': 'Adds a 500ms debounce when filters change (to avoid excessive API calls during rapid typing)',
  'dgState.behavior2': 'Makes API calls promptly for sorting or pagination actions (no debounce)',
  'dgState.behavior3':
    'Optionally filters out duplicate consecutive states when <code>enableDistinctUntilChanged</code> is <code>true</code>',
  'dgState.behavior4': 'Starts with a null state to handle initial load scenarios',
  'timelineWizard.title': 'Timeline Wizard',
  'timelineWizard.overview':
    'The TimelineWizard component facilitates building timeline-based multi-step wizards in Angular applications. Each step is represented by a dedicated component extending TimelineBaseComponent, supporting step navigation, asynchronous validation, and dynamic component rendering.',
  'timelineWizard.example1': 'Example 1: Basic Wizard Setup',
  'timelineWizard.example1Desc':
    'In the following example, the wizard comprises four distinct steps. The timelineSteps array defines the sequential order of each step. Three steps involve form input, and the final step summarizes data.',
  'timelineWizard.example2': 'Example 2: Basic Step Component',
  'timelineWizard.example2Desc':
    'Every step component extends TimelineBaseComponent, specifying the pertinent step type and initializing the FormGroup.',
  'timelineWizard.example3': 'Example 3: Custom Data Mapping',
  'timelineWizard.example3Desc':
    'When your FormGroup model differs from the timelineSteps structure, override formValueToData and dataToFormValue for bidirectional mapping.',
  'timelineWizard.example4': 'Example 4: Advanced Data Mapping with Key-Value Inputs',
  'timelineWizard.example4Desc':
    'Advanced use case showing dataToFormValue and formValueToData integration with KeyValueInputsComponent:',
  'timelineWizard.example4Callout':
    'To understand more about KeyValueInputsComponent, please visit the Key Value Inputs documentation page.',
  'timelineWizard.example5': 'Example 5: Review Step with API Submission',
  'timelineWizard.example5Desc':
    'Consolidate data from preceding steps using TimelineWizardService and override next$ to construct your submission API stream.',
  'timelineWizard.example5Callout':
    'You can customize the next$ observable in any step, enabling both synchronous and asynchronous operations such as HTTP requests.',
  'timelineWizard.componentSummary': 'The main component responsible for managing the timeline wizard.',
  'timelineWizard.baseSummary':
    'The base class for all step components within the timeline wizard. It provides essential properties and methods for managing wizard steps.',
  'timelineWizard.stepSummary': 'Interface defining the properties of a step in the timeline wizard configuration.',
  'timelineWizard.serviceSummary':
    'A service that manages the state and data of the timeline wizard across step components.',
  'timelineWizard.playgroundTitle': 'Interactive Deployment Wizard Playground',
  'timelineWizard.playgroundDesc':
    'Navigate step-by-step through Operator configuration, Service scaling, Runtime Properties (key-value editor), and final confirmation.',
  'timelineWizard.playgroundBadge': 'Enterprise Workflow',
  'timelineWizard.requiredInfo': 'Required Information',
  'timelineWizard.configureOperator': 'Configure Operator',
  'timelineWizard.configureService': 'Configure Service',
  'timelineWizard.configureRuntimeProperties': 'Configure Runtime Properties',
  'timelineWizard.name': 'Name',
  'timelineWizard.namespace': 'Namespace',
  'timelineWizard.cpu': 'CPU',
  'timelineWizard.replicas': 'Replicas',
  'timelineWizard.url': 'URL',
  'poll.start': 'Start',
  'poll.stop': 'Stop',
  'poll.overview':
    'The <code>poll</code> operator is a custom RxJS operator that simplifies the process of polling APIs to keep data up-to-date. It allows developers to create observables that periodically emit data at specified intervals, abstracting away the complexity of managing polling intervals and API requests. This operator is especially useful when real-time updates are required but the server does not support push notifications (WebSockets, Server-Sent Events, etc.). It seamlessly integrates with other RxJS operators, enabling developers to build reactive pipelines for handling data streams.',
  'poll.example1Title': 'Example 1: Basic Polling',
  'poll.example1Desc':
    'Poll data at a specified interval. The polling function supports Promise, Observable, or primitive values:',
  'poll.example2Title': 'Example 2: Poll Until Condition is Met',
  'poll.example2Desc': 'Use RxJS operators like <code>takeWhile</code> to stop polling when a condition is met:',
  'poll.example2Callout':
    'You can add <code>takeUntil</code>, <code>takeWhile</code>, or other RxJS operators to control when polling ends.',
  'poll.example3Title': 'Example 3: Poll with initialValue',
  'poll.example3Desc':
    "By default, the poll initial result is <code>&#123;status: 'loading', isLoading: true, error: null, data: null&#125;</code>, which is convenient for displaying a loading spinner. However, in some cases, you may not want to display a loading spinner. You can set <code>initialValue</code> to any value you want:",
  'poll.example4Title': 'Example 4: Defer Polling',
  'poll.example4Desc':
    'By default, polling starts immediately. Use the <code>delay</code> option to delay the start of polling:',
  'poll.example4AltDesc':
    'Alternatively, you can start polling after a user action by combining <code>poll</code> with other RxJS operators:',
  'poll.btnStartPolling': 'Start Polling (See Console)',
  'poll.example5Title': 'Example 5: Force Refresh',
  'poll.example5Desc':
    'Use the <code>forceRefresh</code> observable or signal to trigger the execution of <code>pollingFn</code> whenever necessary, such as in response to user actions. The emitted value from <code>forceRefresh</code> will be passed as the input to <code>paramsBuilder</code> (if provided) or directly to <code>pollingFn</code>.',
  'poll.example5SignalTitle': 'Signal-based Force Refresh & Parameter Retention',
  'poll.example5SignalDesc':
    '<code>forceRefresh</code> directly accepts Angular Signals. If multiple updates occur while a request is in progress, <code>exhaustMap</code> drops intermediate triggers but preserves the newest parameter for the next scheduled tick.',
  'poll.btnRapidFilters': 'Rapid Filter Changes (Burst 3x)',
  'poll.example6Title': 'Example 6: Advanced Example - Datagrid with Polling',
  'poll.example6Desc':
    "The datagrid below will automatically refresh every 10 seconds. Additionally, whenever there's a change in the input, triggering filtering, sorting, or pagination, the API will be promptly called, accompanied by a spinner indicating loading.",
  'poll.searchByFirstName': 'Search by First Name',
  'poll.apiDesc':
    'Polls data at a specified interval and can be triggered manually. Returns an observable that emits the result as an AsyncState object.',
  'poll.paramPollingFn': 'A function that returns an Observable, Promise, or primitive value.',
  'poll.paramInterval': 'The interval in milliseconds between each poll.',
  'poll.paramForceRefresh': 'An Observable or Signal that triggers a manual refresh.',
  'poll.paramParamsBuilder':
    'A function that builds parameters for the polling function based on the forceRefresh value.',
  'poll.paramInitialValue': 'An initial AsyncState value.',
  'poll.paramDelay': 'Delay in milliseconds before starting the first poll.',
  'poll.returnsDesc':
    'An observable that emits AsyncState<Data> objects with status, isLoading, error, and data properties.',
  'createAsyncState.overview':
    'The <code>createAsyncState</code> operator transforms an observable of type <code>T</code> into an observable of <code>AsyncState&lt;T&gt;</code>, encapsulating loading, error, and data states in a standardized structure. This eliminates the need to manage separate variables for loading states, errors, and data, making your codebase more organized and maintainable.',
  'createAsyncState.interfaceStructure': 'The <code>AsyncState</code> interface structure that the operator returns:',
  'createAsyncState.example1Title': 'Example 1: Simple Request',
  'createAsyncState.example1Desc': 'Handle a single API request with loading and error states:',
  'createAsyncState.example2Title': 'Example 2: With Callbacks',
  'createAsyncState.example2Desc': 'Add side effects for success and error scenarios:',
  'createAsyncState.example3Title': 'Example 3: Providing initialValue',
  'createAsyncState.example3Desc':
    'In scenarios where you have initial data (e.g., from route state), you can provide an initial value to avoid showing a loading spinner. This is useful when navigating from a list to a detail page where you already have some data:',
  'createAsyncState.example3Callout':
    "When providing <code>initialValue</code>, set <code>status: 'idle'</code> and <code>isLoading: false</code> to prevent the loading spinner from appearing. The data will be updated seamlessly when the API call completes.",
  'createAsyncState.example4Title': 'Example 4: Dependent Requests',
  'createAsyncState.example4Desc': 'Chain multiple requests using <code>switchMap</code>:',
  'createAsyncState.example5Title': 'Example 5: Template Usage',
  'createAsyncState.example5Desc': 'Use the async pipe in templates to handle different states:',
  'createAsyncState.apiSummary': 'Transforms an Observable of type T into an Observable of AsyncState<T, E>.',
  'createAsyncState.paramObserver':
    'Callback function or observer object for handling side effects when the observable emits values or errors.',
  'createAsyncState.paramInitialValue':
    'The initial AsyncState value to use before the observable emits its first value.',
  'createAsyncState.returnsDesc': 'A function that transforms an observable stream into an asynchronous state.',
  'createAsyncState.stateStatus': 'Granular status tracking: "idle" | "loading" | "reloading" | "resolved" | "error".',
  'createAsyncState.stateIsLoading':
    'Indicates if any loading operation is in progress (true when status is "loading" or "reloading").',
  'createAsyncState.stateError': 'Error details if the asynchronous operation failed, or null.',
  'createAsyncState.stateData': 'Data emitted by the observable, or null.',
  'resourceAsync.paramSourceFn': 'A reactive function that returns an Observable, Promise, or synchronous value.',
  'resourceAsync.paramOptions': 'Configuration options for the resource.',
  'resourceAsync.propInitialValue': 'Initial value before the first fetch completes.',
  'resourceAsync.propLazy': 'If true, starts in "idle" state and waits for reload() or execute() to be called.',
  'resourceAsync.propBehavior':
    'Concurrency behavior: "switch" (cancel previous) or "exhaust" (ignore new). Defaults to "switch".',
  'resourceAsync.propOnError': 'Error handler callback that can provide fallback values.',
  'resourceAsync.propThrowOnError':
    'If true, propagates errors not handled by an onError fallback after storing them in the error signal.',
  'resourceAsync.propOnSuccess': 'Callback invoked when operation successfully completes.',
  'resourceAsync.propOnLoading': 'Callback invoked when operation starts loading.',
  'resourceAsync.returnsDesc':
    'A ResourceRef<T, E> object exposing value, error, status, isLoading, and mutation methods.',
  'spinner.apiSummary': 'Component for displaying loading spinners with customizable sizes and alignment.',
  'spinner.inputSize': 'Determines the spinner size: "lg" (default), "md", or "sm".',
  'spinner.inputCenter': 'Centers the spinner as a block element. Pass false to disable centering.',
  'spinner.inputInline': 'Specifies whether the spinner should be displayed as an inline-block element.',
  'spinner.inputCustomClass': 'A string of additional CSS classes to apply to the spinner.',
  'callout.apiSummary': 'A callout component built on top of Clarity Design System.',
  'callout.contentProjectionDesc':
    'Provides a default <ng-content /> slot to render custom HTML content, text, lists, and components.',
  'callout.responsiveTitle': 'Responsive Behavior',
  'callout.responsiveDesc':
    'The decorative icon is hidden on screens narrower than 576px and displays automatically on wider screens.',
  'callout.themingTitle': 'Theming',
  'callout.themingDesc':
    "Inherits Clarity theme context and respects [cds-theme='dark'] for contrasting background, border, and link styles.",
  'certificate.pemNote':
    "PEM stands for Privacy Enhanced Mail. It's a file format that is often used to store cryptographic keys, certificates, and other secure data. PEM files typically have extensions like .pem, .crt, .cer, and .key.",
  'certificate.apiSummary': 'Component for displaying certificate information in a Clarity signpost.',
  'certificate.clickIcon': 'Click the certificate icon below to view the certificate details:',
  'certificate.clickCert': 'Click the certificate icon:',
  'certificate.inputPem': 'The PEM-formatted certificate string to inspect.',
  'certificate.inputPemEncoded': 'Whether the provided PEM string is base64-encoded.',
  'certificate.inputPosition': 'Position of the signpost relative to the trigger icon.',
  'certificate.inputShowIcon': 'A boolean value to manage the visibility of the certificate status icon.',
  'isPromise.overview':
    'The <code>isPromise</code> utility is a TypeScript type guard that determines whether an arbitrary value is a <code>Promise</code> or <code>PromiseLike</code> (an object or function containing a callable <code>then</code> method). It enables safe runtime verification and type narrowing without throwing errors on null or primitive values.',
  'isPromise.callout':
    'Useful in asynchronous resource loaders, custom operators, and flexible service APIs that accept either immediate static values or asynchronous promises.',
  'isPromise.example1Title': 'Example 1: Interactive Value Evaluation Matrix',
  'isPromise.example1Desc': 'Observe runtime type-checking across common JavaScript data types and thenable objects:',
  'isPromise.thDescription': 'Description',
  'isPromise.thExpression': 'Evaluated Expression',
  'isPromise.thResult': 'isPromise() Result',
  'isPromise.example2Title': 'Example 2: Safe Type Narrowing Pattern',
  'isPromise.example2Desc':
    'In TypeScript, checking with <code>if (isPromise(val))</code> narrows the type automatically inside the block:',
  'isPromise.apiSummary': 'TypeScript type guard function checking for PromiseLike contracts.',
  'isPromise.paramObj': 'The value to inspect.',
  'isPromise.returnsDesc':
    'true if the input is non-null, is an object or function, and implements a callable then method; false otherwise.',
  'isEmpty.overview':
    'The <code>isEmpty</code> utility function checks if a string, object, or array is empty. It returns <code>true</code> for empty values and <code>false</code> for non-empty values.',
  'isEmpty.example1Title': 'Example 1: Basic Usage',
  'isEmpty.example1Desc': 'Check if various types of values are empty:',
  'isEmpty.example2Title': 'Example 2: Common Use Cases',
  'isEmpty.example2Desc': 'Use <code>isEmpty</code> in conditional logic:',
  'isEmpty.apiSummary': 'Checks if a string, object, or array is empty.',
  'isEmpty.paramValue': 'The value to check. Can be a string, object, array, or other value.',
  'isEmpty.returnsDesc':
    'true if the value is empty (empty string, empty object, empty array, null, or undefined), false otherwise.',
  'isEqual.overview':
    'The <code>isEqual</code> utility function performs a deep equality check between two values. It compares primitive values, arrays, and objects recursively to determine if they are structurally equal, regardless of reference equality.',
  'isEqual.example1Title': 'Example 1: Basic Usage',
  'isEqual.example1Desc': 'Compare various types of values for deep equality:',
  'isEqual.example2Title': 'Example 2: Deep Object Comparison',
  'isEqual.example2Desc': 'Compare nested objects and arrays:',
  'isEqual.apiSummary': 'Performs a deep equality check between two values.',
  'isEqual.paramValue1': 'The first value to compare.',
  'isEqual.paramValue2': 'The second value to compare.',
  'isEqual.returnsDesc':
    'true if the values are deeply equal, false otherwise. Performs recursive comparison for objects and arrays.',
  'differenceInDays.overview':
    'The <code>differenceInDays</code> utility function calculates the number of whole days between two dates. It simplifies date calculations in JavaScript by accepting flexible input types. The first parameter represents the reference date from which the difference is measured, and the second parameter denotes the date to be compared against the reference date. Both parameters accept <code>Date</code> objects, numbers representing milliseconds since the Unix epoch, or strings parseable by the <code>Date</code> constructor.',
  'differenceInDays.example1Title': 'Example 1: Calculate Days Between Dates',
  'differenceInDays.example1Desc': 'Calculate the number of whole days between two dates using different input types:',
  'differenceInDays.example2Title': 'Example 2: Calculate Days from Today',
  'differenceInDays.example2Desc': 'Calculate the number of days from today to a specific date:',
  'differenceInDays.apiSummary': 'Calculates the number of whole days between two dates.',
  'differenceInDays.paramDateLeft':
    'The reference date. Can be a Date object, timestamp (milliseconds), or a parseable date string.',
  'differenceInDays.paramDateRight':
    'The date to compare against the reference date. Accepts the same types as dateLeft.',
  'differenceInDays.returnsDesc':
    'The number of whole days between the two dates. Returns a positive number if dateLeft is later than dateRight, and negative if dateLeft is earlier.',
  'pickBy.overview':
    'The <code>pickBy</code> and <code>omitBy</code> utility functions allow you to create new objects by selecting or excluding properties based on a predicate function. <code>pickBy</code> creates an object composed of properties that satisfy a given condition, while <code>omitBy</code> is the opposite, creating an object composed of properties that do not satisfy the condition.',
  'pickBy.example1Title': 'Example 1: pickBy',
  'pickBy.example1Desc': 'Create an object composed of object properties that satisfy a given condition:',
  'pickBy.example2Title': 'Example 2: omitBy',
  'pickBy.example2Desc':
    '<code>omitBy</code> is the opposite of <code>pickBy</code>, creating an object composed of properties that do not satisfy the given condition.',
  'pickBy.apiSummary': 'Creates an object composed of object properties that satisfy a given condition.',
  'pickBy.paramObject': 'The source object to pick properties from.',
  'pickBy.paramPredicate':
    'A function that determines which properties to include. Returns true to include, false to exclude.',
  'pickBy.returnsDesc': 'A new object containing only the properties that satisfy the predicate.',
  'omitBy.apiSummary': 'Creates an object composed of object properties that do not satisfy a given condition.',
  'omitBy.paramObject': 'The source object to omit properties from.',
  'omitBy.paramPredicate':
    'A function that determines which properties to omit. Returns true to omit, false to retain.',
  'omitBy.returnsDesc': 'A new object containing only the properties that do not satisfy the predicate.',
  'url.title': 'URL Utilities',
  'url.overview':
    'ngx-lift provides several utility functions for working with URLs: <code>isIP</code> and <code>isFQDN</code> for checking hostname types, <code>isURL</code> for validating URLs, and <code>isHttps</code> for checking HTTPS protocol. These utilities are useful for URL validation, security checks, and conditional logic based on URL properties.',
  'url.example1': 'Example 1: Check Hostname Type (isIP & isFQDN)',
  'url.example1Desc': 'Check if a URL hostname is an IP address or a fully qualified domain name (FQDN):',
  'url.example1Callout':
    'You may use <code>URL</code> constructor to get the hostname, but remember to use try-catch for error handling.',
  'url.example2': 'Example 2: Validate URLs (isURL & isHttps)',
  'url.example2Desc':
    '<code>isURL</code> is used to check if a URL is valid. <code>isHttps</code> is used to check if the URL starts with https.',
  'url.example2Callout': 'We also provide <code>isHttps</code> pipe for use in templates.',
  'url.isIPSummary': 'Checks if a hostname is an IP address.',
  'url.isFQDNSummary': 'Checks if a hostname is a fully qualified domain name (FQDN).',
  'url.isURLSummary': 'Checks if a string is a valid URL.',
  'url.isHttpsSummary': 'Checks if a URL string uses the HTTPS protocol.',
  'urlValidator.title': 'urlValidator & httpsValidator',
  'urlValidator.firstTask':
    'Enter https://example.com, then an invalid address, and leave the field. Correct the address to clear the error. Empty values fail required validation; the next example restricts the protocol.',
  'urlValidator.overview':
    'The <code>urlValidator</code> and <code>httpsValidator</code> functions are Angular validators used to check if a given string adheres to specific URL patterns. The <code>urlValidator</code> validates URLs starting with http or https, while <code>httpsValidator</code> validates only HTTPS URLs.',
  'urlValidator.example1': 'Example 1: URL Validator',
  'urlValidator.example1Desc': 'Validate URLs that start with http or https:',
  'urlValidator.example2': 'Example 2: HTTPS Validator',
  'urlValidator.example2Desc': 'Validate only HTTPS URLs:',
  'urlValidator.example3': 'Example 3: Complete Form Example',
  'urlValidator.example3Desc': 'Complete example with both validators in a reactive form:',
  'urlValidator.urlLabel': 'URL',
  'urlValidator.urlHelper': 'Provide a valid URL',
  'urlValidator.urlError': 'Please enter a valid URL (starting with https or http)',
  'urlValidator.httpsLabel': 'HTTPS-only URL',
  'urlValidator.httpsHelper': 'Provide a https URL',
  'urlValidator.httpsError': 'Please enter a https URL',
  'urlValidator.summary': 'Angular validator that checks if a string is a valid URL starting with http or https.',
  'urlValidator.httpsSummary': 'Angular validator that checks if a string is a valid HTTPS URL.',
  'urlValidator.returns':
    'A validator function that returns {invalidUrl: true} if the URL is invalid, or null if valid.',
  'urlValidator.httpsReturns':
    'A validator function that returns {invalidUrl: true} if the URL is not HTTPS, or null if valid.',
  'startWithTap.overview':
    'The <code>startWithTap</code> operator executes a synchronous callback before each subscription to the source Observable begins emitting. Unlike eager tap operations or pipeline initialization code, constructing the pipeline does not execute the callback until a subscription occurs. Any callback exceptions enter the Observable error channel.',
  'startWithTap.callout':
    'Ideal for triggering initialization side-effects, setting loading indicators, resetting previous errors, or recording request dispatch timestamps immediately when an Observable stream is subscribed to.',
  'startWithTap.example1Title': 'Example 1: Interactive Request Dispatch with Loading Indicator',
  'startWithTap.example1Desc':
    'Click "Trigger Request" to subscribe to a simulated 900ms delayed Observable. <code>startWithTap</code> runs synchronously at the moment of subscription to turn on the loading spinner:',
  'startWithTap.btnTrigger': 'Trigger Request',
  'startWithTap.btnClearLog': 'Clear Log',
  'startWithTap.fetchingData': 'Fetching data...',
  'startWithTap.loadedPayload': 'Loaded payload:',
  'startWithTap.example2Title': 'Example 2: Deferred Pipeline Execution',
  'startWithTap.example2Desc':
    'The callback is deferred until subscription time, meaning reusable streams or shared pipelines can be defined ahead of time without executing side effects prematurely:',
  'startWithTap.apiSummary': 'RxJS MonoTypeOperatorFunction executing a callback upon subscription.',
  'startWithTap.paramCallback': 'Function executed synchronously before the source Observable begins emitting.',
  'startWithTap.returnsDesc':
    'An RxJS operator function that executes the callback upon subscription and returns the source Observable unchanged.',
  'switchMapWithAsyncState.overview':
    'The <code>switchMapWithAsyncState</code> operator combines the functionality of <code>switchMap</code> and <code>createAsyncState</code> into a single operator. It is tailor-made for scenarios where you need to trigger an API request based on user actions (like button clicks) and seamlessly transition between streams. By creating an <code>AsyncState</code> structure to encapsulate your API response, this operator delivers a seamless and efficient approach to managing asynchronous operations.',
  'switchMapWithAsyncState.example1Title': 'Example 1: Filter Users by Gender',
  'switchMapWithAsyncState.example1Desc': 'Selecting a different gender will populate the user list accordingly:',
  'switchMapWithAsyncState.example2Title': 'Example 2: Form Submission with Loading State',
  'switchMapWithAsyncState.example2Desc':
    'Submit the form using <code>switchMapWithAsyncState</code> and <code>toSignal</code>. The submission will always emit an error because the API is designed to simulate an error.',
  'switchMapWithAsyncState.apiSummary':
    'Combines switchMap and createAsyncState to transform an observable stream into AsyncState while switching to a new inner observable.',
  'switchMapWithAsyncState.paramProject':
    'A function that receives each value from the source observable and returns an Observable, Promise, or other ObservableInput.',
  'switchMapWithAsyncState.returnsDesc':
    'An observable that emits AsyncState<R> objects, automatically handling loading, error, and data states.',
  'combineLatestEager.overview':
    'The RxJS operator <code>combineLatest</code> requires all sources to emit at least once, which can be problematic when using <code>Subject</code> sources that may not emit initially. <code>combineLatestEager</code> extends <code>combineLatest</code> by automatically adding <code>startWith(null)</code> for each <code>Subject</code> in the sources, ensuring the combined observable initializes properly. You can also set the second parameter to <code>true</code> to append <code>startWith(null)</code> for all source observables, which is useful when dealing with numerous observables where initial emissions are not guaranteed.',
  'combineLatestEager.example1Title': 'Example 1: Basic Usage',
  'combineLatestEager.example1Desc': 'Combine observables including Subjects that may not emit initially:',
  'combineLatestEager.example2Title': 'Example 2: Complete Example with Template',
  'combineLatestEager.example2Desc':
    'Complete example showing how to use combineLatestEager with async pipe in templates:',
  'combineLatestEager.apiSummary':
    'Combines multiple observables with eager emission, automatically handling sources that do not emit initial values.',
  'combineLatestEager.paramSources': 'An array or dictionary object of observables to combine.',
  'combineLatestEager.paramStartWithAll':
    '(Optional) When true, appends startWith(null) for all sources, not just Subjects. Defaults to false.',
  'combineLatestEager.returnsDesc':
    'An observable that emits an array or object containing the latest values from all sources.',
  'distinctOnChange.overview':
    'The <code>distinctOnChange</code> operator enhances RxJS Observables by not only preventing duplicate emissions (like <code>distinctUntilChanged</code>) but also executing a callback function when a value changes. This is useful for scenarios where you need to perform side effects, such as displaying a toast notification, when a value changes after the initial emission.',
  'distinctOnChange.example1Title': 'Example 1: Basic Usage',
  'distinctOnChange.example1Desc': 'Execute a callback when distinct values are encountered:',
  'distinctOnChange.example2Title': 'Example 2: With Custom Comparator',
  'distinctOnChange.example2Desc': 'Use a custom comparator function to determine equality:',
  'distinctOnChange.apiSummary':
    'Returns an observable that emits distinct contiguous values and executes a callback whenever the value changes.',
  'distinctOnChange.paramCallback':
    'Function to execute when the value changes. Receives the previous and current values.',
  'distinctOnChange.paramComparator':
    '(Optional) Function to determine whether two values are considered equal. Defaults to strict equality (===).',
  'distinctOnChange.returnsDesc': 'An observable that emits distinct values and executes the callback on changes.',
  'logger.overview':
    'The <code>logger</code> operator is a utility function for RxJS observables that simplifies logging emitted values using different console functions. This operator is useful for debugging and monitoring the behavior of your observables during development.',
  'logger.example1Title': 'Example 1: Basic Logging',
  'logger.example1Desc': 'Log emitted values using console.log:',
  'logger.example2Title': 'Example 2: Table Logging',
  'logger.example2Desc': 'Log emitted values using console.table for better visualization:',
  'logger.example3Title': 'Example 3: Other Console Methods',
  'logger.example3Desc': 'Use other console methods like dir, count, or debug:',
  'logger.apiSummary': 'A debugging operator that logs emissions to the console using various console methods.',
  'logger.paramMethod':
    '(Optional) Console method to use: "log" | "table" | "dir" | "count" | "debug". Defaults to "log".',
  'logger.returnsDesc': 'An observable that passes through all values while logging them to the console.',
  'kubernetesPagination.overview':
    'The <code>aggregatePaginatedKubernetesResources</code> operator and <code>fetchPaginatedKubernetesResources</code> function automate client-side pagination for Kubernetes REST APIs. They inspect the <code>metadata.continue</code> token on incoming responses, request consecutive pages recursively until all pages are retrieved, normalize missing or null items safely, and aggregate all resources into a single unified <code>KubernetesList&lt;T&gt;</code>.',
  'kubernetesPagination.callout':
    'Kubernetes APIs return paginated collections with a <code>continue</code> token in response metadata when total records exceed the requested <code>limit</code>. This operator handles the entire multi-request loop seamlessly behind a single Observable stream.',
  'kubernetesPagination.example1Title': 'Example 1: Interactive Kubernetes Paginated Traversal',
  'kubernetesPagination.example1Desc':
    'Click "Fetch Paginated Pods" to trigger automated multi-page fetching across three mock Kubernetes API pages:',
  'kubernetesPagination.btnFetchPods': 'Fetch Paginated Pods',
  'kubernetesPagination.fetchingPages': 'Fetching pages (continue token)...',
  'kubernetesPagination.pagesFetched': 'Pages fetched recursively:',
  'kubernetesPagination.aggregationComplete': 'Aggregation Complete',
  'kubernetesPagination.totalResources': 'Total Resources:',
  'kubernetesPagination.thPodName': 'Pod Name',
  'kubernetesPagination.thNamespace': 'Namespace',
  'kubernetesPagination.thStatus': 'Status',
  'kubernetesPagination.thPodIp': 'Pod IP',
  'kubernetesPagination.example2Title': 'Example 2: Self-Contained Fetch Function',
  'kubernetesPagination.example2Desc':
    'Use <code>fetchPaginatedKubernetesResources</code> when you want to initiate and paginate in a single function call without constructing the initial Observable manually:',
  'kubernetesPagination.aggregateSummary':
    'RxJS operator that transforms an initial Kubernetes list response Observable into an aggregated list containing items from all pages.',
  'kubernetesPagination.fetchSummary':
    'Convenience function that initiates and paginates Kubernetes resources in a single call.',
  'kubernetesPagination.paramHttp': 'Angular HttpClient used for requesting subsequent pages.',
  'kubernetesPagination.paramEndpoint': 'REST URL of the Kubernetes resource.',
  'kubernetesPagination.paramInitialParams': 'Query parameters (e.g. limit).',
  'k8sRetryBackoff.configSummary': 'Optional configuration shared by the operator and interceptor factory.',
  'k8sRetryBackoff.paramMaxAttempts': 'Total attempts including the initial request. Set to 1 to disable retries.',
  'k8sRetryBackoff.errorShape':
    'Accepts HttpErrorResponse or an object shaped as <code>{ status, headers?, error? }</code>, including a JSON string in <code>error</code>. Native fetch does not reject on HTTP 429: check the Response and adapt its status, headers, and parsed body. Axios exposes these under <code>error.response</code>; adapt them before calling the helper. The helper computes a delay only.',
  'k8sRetryBackoffInterceptor.overrideRules':
    'null uses interceptor defaults; false disables retries. Context overrides merge with global or factory defaults. GET/HEAD/OPTIONS/PUT/DELETE are eligible by default; POST/PATCH require an explicit retryMethods override and endpoint idempotency.',
  'k8sRetryBackoffInterceptor.overrideSimulation':
    'Try a probe that fails on its first 429, or a workload read that receives two 429s before succeeding. The custom read uses maxAttempts: 10 and a 200ms exponential base with equal jitter; at most nine retries are allowed.',
  'k8sRetryBackoffInterceptor.btnWorkloads': 'Test Workload Read (10 Attempts)',
  'k8sRetryBackoffInterceptor.btnProbe': 'Test Fast Probe (Opt-out)',
  'k8sRetryBackoff.firstTask':
    'Refresh sends one simulated GET. Its first response is HTTP 429 with Retry-After: 1; after at least one second, a retry returns HTTP 200. The output shows state and attempt count. Then explore setup and other scenarios below.',
  'k8sRetryBackoff.overview':
    'The <code>retryOnK8sBackoff</code> RxJS operator implements automated retry-with-backoff for Kubernetes apiserver HTTP 429 (<code>TooManyRequests</code>) responses (such as when the apiserver watch cache is bootstrapping with "storage is (re)initializing"). Only HTTP 429 triggers a retry; all other errors (4xx, 5xx, network failures) propagate immediately and unchanged to the subscriber.',
  'k8sRetryBackoff.callout':
    '<strong>Operator vs. Interceptor:</strong> The operator controls specific Observable pipelines. The interceptor applies 429 retry across eligible HttpClient methods; writes require verified idempotency.',
  'k8sRetryBackoff.diffTitle': 'Operator vs Interceptor',
  'k8sRetryBackoff.diffDesc': 'Choose between local pipeline composition and ambient global application protection:',
  'k8sRetryBackoff.diffColFeature': 'Feature',
  'k8sRetryBackoff.diffColOperator': 'retryOnK8sBackoff (Operator)',
  'k8sRetryBackoff.diffColInterceptor': 'k8sRetryBackoffInterceptor (Interceptor)',
  'k8sRetryBackoff.diffScope': 'Scope',
  'k8sRetryBackoff.diffScopeOp': 'Local: Targeted to specific Observable pipelines',
  'k8sRetryBackoff.diffScopeInt': 'Global: Automatic on all Angular HttpClient requests',
  'k8sRetryBackoff.diffUseCases': 'Primary Use Cases',
  'k8sRetryBackoff.diffUseCasesOp': 'Custom polling streams, selective background tasks, non-HttpClient observables',
  'k8sRetryBackoff.diffUseCasesInt': 'Standard Kubernetes microservice/SPA integrations requiring global resilience',
  'k8sRetryBackoff.diffConfig': 'Configuration',
  'k8sRetryBackoff.diffConfigOp':
    'Passed directly to operator: <code>retryOnK8sBackoff({ maxAttempts, fallbackDelayMs })</code>',
  'k8sRetryBackoff.diffConfigInt':
    'Global in <code>app.config.ts</code> or per-request via <code>HttpContextToken</code>',
  'k8sRetryBackoff.example1Title': 'Example 1: Interactive Simulator and Pipeline Usage',
  'k8sRetryBackoff.example1Desc':
    'Simulate various Kubernetes API responses to observe retry delays, attempt counts, and error propagation, followed by the operator pipeline snippet:',
  'k8sRetryBackoff.selectScenario': 'Select Response Scenario:',
  'k8sRetryBackoff.scenarioHeader': '429 with Retry-After header (1s minimum + jitter)',
  'k8sRetryBackoff.scenarioBody': '429 with details.retryAfterSeconds body (1.5s minimum + jitter)',
  'k8sRetryBackoff.scenarioFallback': '429 without a hint (1s base, equal jitter)',
  'k8sRetryBackoff.scenarioNon429': '500 Internal Server Error (immediate fail)',
  'k8sRetryBackoff.scenarioExhausted': 'Exhausted attempts (5 consecutive 429s)',
  'k8sRetryBackoff.btnSimulate': 'Simulate Request',
  'k8sRetryBackoff.logTitle': 'Simulation Timeline & Logs:',
  'k8sRetryBackoff.btnClearLogs': 'Clear Log',
  'k8sRetryBackoff.example2Title': 'Example 2: Standalone Delay Extraction Helper',
  'k8sRetryBackoff.example2Desc':
    'Use getK8sRetryDelayMs directly to extract retry delays in custom retry loops, fetch, or Axios handlers:',
  'k8sRetryBackoff.sampleErrorLabel': 'Sample Error Response:',
  'k8sRetryBackoff.helperHeader': '429 (Retry-After: 3s)',
  'k8sRetryBackoff.helperBody': '429 (retryAfterSeconds: 2s)',
  'k8sRetryBackoff.helperFallback': '429 (No Hint, 1s Fallback)',
  'k8sRetryBackoff.helperNon429': '500 (Non-429 Error)',
  'k8sRetryBackoff.btnExtractDelay': 'Extract Delay (getK8sRetryDelayMs)',
  'k8sRetryBackoff.retryableError': 'Retryable Kubernetes 429 backoff',
  'k8sRetryBackoff.nonRetryableError': 'Non-retryable error',
  'k8sRetryBackoff.apiSummary':
    'RxJS operator that retries Kubernetes 429 responses using server-provided delays or fallback backoff.',
  'k8sRetryBackoff.paramConfig': 'Configuration options specifying maximum attempts and fallback delay.',
  'k8sRetryBackoff.delaySummary':
    'Helper function that extracts the retry delay in milliseconds from a Kubernetes 429 error response, or returns null if not retryable.',
  'k8sRetryBackoff.paramError': 'The error to inspect (HttpErrorResponse or object with status/headers/error).',
  'k8sRetryBackoff.paramFallbackDelay':
    'Base fallback delay in milliseconds. The operator increases it exponentially; the delay helper returns it directly when no hint exists.',
  'k8sRetryBackoffInterceptor.overview':
    '<code>k8sRetryBackoffInterceptor</code> automatically retries Kubernetes 429 responses for idempotent methods. It honors Retry-After and details.retryAfterSeconds, with exponential fallback, jitter, wait budgets and HttpContext opt-out. POST/PATCH require explicit opt-in.',
  'k8sRetryBackoffInterceptor.callout':
    '<strong>Global Protection with Request Overrides:</strong> Register the interceptor once in <code>app.config.ts</code> to protect all endpoints. For individual requests that should bypass retry or use custom limits, set the <code>K8S_RETRY_BACKOFF_CONFIG</code> context token on the <code>HttpClient</code> call. For local pipeline control instead, see the <code>retryOnK8sBackoff</code> operator.',
  'k8sRetryBackoffInterceptor.example1Title': 'Example 1: Global Interceptor Registration & Interactive Simulator',
  'k8sRetryBackoffInterceptor.example1Desc':
    'Register globally in app.config.ts to retry eligible idempotent HttpClient requests on HTTP 429.',
  'k8sRetryBackoffInterceptor.selectMode': 'Interceptor Context Mode:',
  'k8sRetryBackoffInterceptor.modeDefault': 'Default Global Interceptor (429 retried automatically)',
  'k8sRetryBackoffInterceptor.modeCustom': 'Custom HttpContext (maxAttempts: 2, base: 400ms, equal jitter)',
  'k8sRetryBackoffInterceptor.modeDisabled': 'Disabled via HttpContext (K8S_RETRY_BACKOFF_CONFIG: false)',
  'k8sRetryBackoffInterceptor.btnSend': 'Send Intercepted Request',
  'k8sRetryBackoffInterceptor.example2Title': 'Example 2: Per-Request Customization & Opt-Out via HttpContext',
  'k8sRetryBackoffInterceptor.example2Desc':
    'Use K8S_RETRY_BACKOFF_CONFIG in HttpContext to configure custom retry limits or completely bypass retries for fast-fail health/ping checks:',
  'k8sRetryBackoffInterceptor.apiSummary':
    'Functional HTTP interceptor that applies retry-on-backoff to Kubernetes HTTP 429 responses.',
  'k8sRetryBackoffInterceptor.factorySummary':
    'Factory function creating an HttpInterceptorFn with customized default backoff configuration.',
  'k8sRetryBackoffInterceptor.paramDefaultConfig':
    'Default K8sBackoffRetryConfig applied to requests unless overridden via K8S_RETRY_BACKOFF_CONFIG.',
  'k8sRetryBackoffInterceptor.tokenSummary':
    'HttpContextToken used to customize or disable retry-backoff for individual requests.',
  'ifValidator.firstTask':
    'Choose the negative answer to require email and reason. Fill both fields, then change the answer: required errors clear, while email format validation still applies.',
  'ifValidator.overview':
    'ngx-lift provides utility functions for creating conditional validators in Angular Reactive Forms. Conditional validators allow you to apply specified validator functions based on a given condition. There are two main functions exported: <code>ifValidator</code> for synchronous validators and <code>ifAsyncValidator</code> for asynchronous validators.',
  'ifValidator.example1Title': 'Example 1: Conditional Required Validator',
  'ifValidator.example1Desc':
    'Require a reason input and an email input only when the "Sorry" option is selected. The required validator is applied to the text input control only when the "Sorry" option is chosen.',
  'ifValidator.question': 'Do you like this tool?',
  'ifValidator.optLike': 'Of course 😜',
  'ifValidator.optUnlike': 'Sorry 😅',
  'ifValidator.emailHelper': 'Field required only when you choose Sorry',
  'ifValidator.invalidEmail': 'Invalid email',
  'ifValidator.reasonLabel': "Reason why you don't like",
  'ifValidator.autoRevalidationTitle': 'Automatic Re-validation:',
  'ifValidator.autoRevalidationDesc':
    "By default, Angular only re-evaluates a control's validators when that control's own value changes. Pair with <code>revalidateOnChange([email, reason], choice)</code> or pass a <code>Signal&lt;boolean&gt;</code> with <code>revalidateOnChange</code> to automatically trigger re-validation whenever the condition source updates!",
  'ifValidator.example2Title': 'Example 2: ifAsyncValidator',
  'ifValidator.example2Desc':
    '<code>ifAsyncValidator</code> shares similarities with <code>ifValidator</code> but differs in that it accepts two parameters: the condition and an AsyncValidation function, designed specifically for handling asynchronous operations.',
  'ifValidator.apiSummary': 'Creates a conditional validator that applies validator functions based on a condition.',
  'ifValidator.paramCondition':
    'Function that returns true to apply trueValidatorFn, or false to apply falseValidatorFn.',
  'ifValidator.paramTrueValidatorFn': 'Validator function(s) applied when condition is true.',
  'ifValidator.paramFalseValidatorFn': '(Optional) Validator function(s) applied when condition is false.',
  'ifAsyncValidator.apiSummary':
    'Creates a conditional async validator that applies an async validator function based on a condition.',
  'ifAsyncValidator.paramCondition': 'Function determining whether the async validator should be applied.',
  'ifAsyncValidator.paramAsyncValidatorFn': 'The async validator function to execute when condition is true.',
  'intersectionValidator.firstTask':
    'Select the same namespace in both lists to reveal the overlap error on the group. Keep at least one selection in each list, then remove the overlap to recover.',
  'intersectionValidator.overview':
    "The <code>intersectionValidator</code> is a custom Angular Forms validator designed to ensure that two form controls do not have overlapping values. For example, you might have two lists of items and want to ensure they don't contain any duplicates. When there's any overlap between the arrays, both fields and the form will have the <code>{intersection: true}</code> error.",
  'intersectionValidator.example1Title': 'Example 1: Validate Non-Overlapping Arrays',
  'intersectionValidator.example1Desc':
    'Ensure that included namespaces and excluded namespaces do not overlap. Both fields must return arrays.',
  'intersectionValidator.includedNamespaces': 'Included Namespaces',
  'intersectionValidator.excludedNamespaces': 'Excluded Namespaces',
  'intersectionValidator.overlapError': 'Included namespaces and excluded namespaces cannot overlap',
  'intersectionValidator.overlapAlert': 'Included namespaces and excluded namespaces have overlaps',
  'intersectionValidator.returnsDesc':
    "A validator function that returns <code>{intersection: true}</code> if the arrays overlap, or <code>null</code> if they don't. You can check for this error in the form by accessing <code>form.errors?.['intersection']</code>.",
  'intersectionValidator.apiSummary':
    'Validates that two array-valued form controls do not contain overlapping elements.',
  'intersectionValidator.paramArray1Key': 'The name of the first form control.',
  'intersectionValidator.paramArray2Key': 'The name of the second form control.',
  'uniqueValidator.firstTask':
    'Enter the same text in both fields and leave the field to reveal the duplicate error. Change one value and leave it again to recover; Clear resets both values.',
  'uniqueValidator.overview':
    "The <code>uniqueValidator</code> is a custom Angular Forms validator designed to check for uniqueness across multiple fields within a <code>FormArray</code> or <code>FormGroup</code>. It ensures that each control's value is unique among all other controls within the array or group.",
  'uniqueValidator.example1Title': 'Example 1: Array of FormControls',
  'uniqueValidator.example1Desc':
    'If you have an array of individual FormControls and want to ensure uniqueness, attach <code>UniqueValidator.unique()</code> to the FormArray you want to validate.',
  'uniqueValidator.calloutSameValue': 'Type the same value in below controls and see the effect when blur.',
  'uniqueValidator.controlLabel': 'Control',
  'uniqueValidator.controlHelper': 'Control value should be unique',
  'uniqueValidator.duplicated': 'Duplicated',
  'uniqueValidator.example2Title': 'Example 2: Array of FormGroups with Key-Value Pairs',
  'uniqueValidator.example2Desc':
    "In a more complex scenario, imagine you have an array of <code>FormGroups</code>, each containing key-value pairs as <code>FormControls</code>. You want to ensure the uniqueness of the key controls' values (left controls below) across all groups. For this case, you can pass a control selector as the argument of <code>UniqueValidator.unique(controlSelector)</code>.",
  'uniqueValidator.keyCallout': 'Type the same value in below key controls and see the effect when blur.',
  'uniqueValidator.keyPlaceholder': 'key control',
  'uniqueValidator.keyHelper': 'key control should be unique',
  'uniqueValidator.valuePlaceholder': 'value control',
  'uniqueValidator.valueHelper': 'value control has not validation',
  'uniqueValidator.returnsDesc':
    'A validator function that returns <code>{notUnique: true}</code> if duplicate values are found, or <code>null</code> if all values are unique.',
  'uniqueValidator.usageNotes': 'Usage Notes',
  'uniqueValidator.usageNotesDesc':
    "Trigger the control's <code>updateValueAndValidity()</code> method as needed to re-validate when values change.",
  'uniqueValidator.apiSummary': 'Validates uniqueness across FormArray controls or array values.',
  'uniqueValidator.paramKey':
    '(Optional) Property key to check uniqueness for object items. If omitted, checks primitive equality.',
  'dateRangeValidator.firstTask':
    'Choose a date from tomorrow through five days from today. Both endpoints are allowed. An earlier or later date is invalid; clearing the required date is also invalid.',
  'dateRangeValidator.overview':
    'The <code>dateRangeValidator</code> is a custom validator that validates a date falls within a specified range. It supports validation for both date-only values and date-time values, with configurable inclusive/exclusive boundaries and optional time comparison.',
  'dateRangeValidator.example1Title': 'Example 1: Date Range Validation',
  'dateRangeValidator.example1Desc':
    'Validate that a date falls between a minimum and maximum date. This configuration ensures that the selected date must fall between September 1st, 2024, and September 15th, 2024 (exclusive), ignoring the time components. Sep. 15th is not valid since <code>maxInclusive</code> is false.',
  'dateRangeValidator.example2Title': 'Example 2: Select a Future Date',
  'dateRangeValidator.example2Desc':
    'Below example allows to select a future date and include today. To include the <code>minDate</code>, set <code>minInclusive</code> to <code>true</code>.',
  'dateRangeValidator.expiresRawLabel': 'Expiration Date (Raw HTML Input)',
  'dateRangeValidator.minDateError': 'The date cannot be earlier than {{ minDate }}',
  'dateRangeValidator.futureDaysLabel': 'Future 5 Days (Clarity Date Input)',
  'dateRangeValidator.invalidDate': 'The date is invalid',
  'dateRangeValidator.maxDateError': 'The date cannot be later than {{ maxDate }}',
  'dateRangeValidator.clarityMax': 'The date is too late (clarity validation)',
  'dateRangeValidator.clarityMin': 'The date is too early (clarity validation)',
  'dateRangeValidator.minMaxCallout':
    'We could use the <code>min</code> and <code>max</code> pattern to validate the range. However, this validation will not fail when typing a number like 12 or a string like 12hello.',
  'dateRangeValidator.example3Title': 'Example 3: Date and Time Range Validation',
  'dateRangeValidator.example3Desc':
    'To validate both the date and the time, set <code>compareTime</code> to true. With the below configuration, the selected date and time must fall between September 1st, 2024, at noon UTC, and September 2nd, 2024, at noon UTC, considering the time components.',
  'dateRangeValidator.dateTimeExpires': 'Expiration Date',
  'dateRangeValidator.dateTimeMinError': 'The date time cannot be earlier than {{ minDate }}',
  'dateRangeValidator.dateTimeMaxError': 'The date time cannot be later than {{ maxDate }}',
  'dateRangeValidator.returnsDesc': 'A validator function that can be used with Angular Reactive Forms.',
  'dateRangeValidator.validationErrors': 'Validation Errors',
  'dateRangeValidator.errInvalidDate': 'Returned when the date is invalid (e.g., "2023-13-01" or "hello world")',
  'dateRangeValidator.errMinDate':
    'Returned when the selected date is earlier than or equal to the minimum allowed date. The error value is the minimum allowed date formatted as an ISO string.',
  'dateRangeValidator.errMaxDate':
    'Returned when the selected date is later than or equal to the maximum allowed date. The error value is the maximum allowed date formatted as an ISO string.',
  'dateRangeValidator.apiSummary': 'Validates that a date value falls within a specified minDate and/or maxDate range.',
  'dateRangeValidator.paramOptions': 'DateRangeOptions configuring minDate, maxDate, and inclusivity flags.',
  'dateRangeValidator.optMinDate': 'Minimum acceptable date.',
  'dateRangeValidator.optMaxDate': 'Maximum acceptable date.',
  'dateRangeValidator.optMinInclusive': 'Whether the minimum date is inclusive. Defaults to true.',
  'dateRangeValidator.optMaxInclusive': 'Whether the maximum date is inclusive. Defaults to true.',
  'rangePipe.overview':
    "The <code>range</code> pipe generates an array of numbers within a specified range, making it ideal for creating dropdown options, pagination controls, or any scenario requiring numeric sequences in templates. When working with Angular templates, you may need to generate an array of numbers for iteration. For example, if you have the number 20 and want to create an array from 1 to 20 to display in a dropdown list, Angular's <code>@for</code> directive cannot directly iterate over a number. While you could generate this array in TypeScript, there are cases where creating the array directly in the template is more convenient.",
  'rangePipe.callout1':
    'The <code>range</code> pipe creates an array of numbers (positive and/or negative) progressing from start up to, <strong>but not including, end</strong>.',
  'rangePipe.callout2': 'A step of -1 is used if a negative start is specified without an end or step.',
  'rangePipe.callout3': "If end is not specified, it's set to start with start then set to 0.",
  'rangePipe.callout4':
    'A <code>range</code> utility function is also available for use in TypeScript, which can be imported from <code>ngx-lift</code>.',
  'rangePipe.example1Title': 'Example 1: Basic Range',
  'rangePipe.example1Desc': 'Generate arrays with different start and end values:',
  'rangePipe.example2Title': 'Example 2: With Step Value',
  'rangePipe.example2Desc': 'Generate arrays with a custom step value:',
  'rangePipe.example3Title': 'Example 3: Reverse Array',
  'rangePipe.example3Desc': 'Generate arrays in reverse order:',
  'rangePipe.example4Title': 'Example 4: Dropdown Selection',
  'rangePipe.example4Desc':
    'Generate CPU count options for a dropdown. This is useful when displaying a list of computers with varying maximum CPU counts and allowing users to select a CPU range.',
  'rangePipe.cpuLabel': 'Choose CPU count',
  'rangePipe.cpuOption': '{{ count }} CPU(s)',
  'rangePipe.returnsDesc': 'An array of numbers within the specified range.',
  'rangePipe.apiSummary': 'Angular pipe that generates an array of numbers within a specified range.',
  'rangePipe.paramValue': 'Array specifying [end], [start, end], [start, end, step], or [start, end, step, inclusive].',
  'isHttpsPipe.overview':
    "The <code>isHttps</code> pipe is an Angular pipe that checks if a URL string uses the HTTPS protocol. It's useful for conditional rendering, validation, or security checks in templates. A corresponding <code>isHttps</code> utility function is also available for use in TypeScript.",
  'isHttpsPipe.example1Title': 'Example 1: Basic Usage',
  'isHttpsPipe.example1Desc': 'Check if a URL uses HTTPS protocol:',
  'isHttpsPipe.example2Title': 'Example 2: Conditional Rendering',
  'isHttpsPipe.example2Desc': 'Conditionally render components based on HTTPS status:',
  'isHttpsPipe.example3Title': 'Example 3: Security Validation',
  'isHttpsPipe.example3Desc': 'Display security indicators based on protocol:',
  'isHttpsPipe.apiSummary': 'Angular pipe that checks if a URL string uses the HTTPS protocol.',
  'isHttpsPipe.paramValue': 'The URL string to check.',
  'isHttpsPipe.returnsDesc': 'true if the URL uses HTTPS protocol, false otherwise.',
  'arrayJoinPipe.overview':
    'The <code>arrayJoin</code> pipe is an Angular pipe that joins array elements into a string using a specified separator. It provides a convenient way to display array data as comma-separated or custom-delimited strings in templates.',
  'arrayJoinPipe.example1Title': 'Example 1: Basic Usage',
  'arrayJoinPipe.example1Desc': 'Join array elements with the default comma separator:',
  'arrayJoinPipe.example2Title': 'Example 2: Custom Separators',
  'arrayJoinPipe.example2Desc': 'Use different separators for various use cases:',
  'arrayJoinPipe.example3Title': 'Example 3: Numeric Arrays',
  'arrayJoinPipe.example3Desc': 'Join numeric arrays with different separators:',
  'arrayJoinPipe.apiSummary': 'Angular pipe that joins array elements into a string using a specified separator.',
  'arrayJoinPipe.paramValue': 'The array to join. If not an array, returns the value as-is.',
  'arrayJoinPipe.paramSeparator': '(Optional) The separator string to use between elements. Defaults to ",".',
  'arrayJoinPipe.returnsDesc': 'A string containing the joined array elements, or the original value if not an array.',
  'maskPipe.overview':
    "The <code>mask</code> pipe is an Angular pipe designed to mask sensitive string data by replacing characters with asterisks, while preserving a configurable number of characters at the beginning and end. It's ideal for obscuring sensitive information in user interfaces, such as credit card numbers, phone numbers, or API keys.",
  'maskPipe.example1Title': 'Example 1: Basic Usage',
  'maskPipe.example1Desc': 'Mask sensitive strings with default settings (6 characters visible at start and end):',
  'maskPipe.example2Title': 'Example 2: Custom Masking Options',
  'maskPipe.example2Desc': 'Customize the number of visible characters at the beginning and end of the string:',
  'maskPipe.example3Title': 'Example 3: Credit Card Masking',
  'maskPipe.example3Desc': 'Mask credit card numbers while showing the last 4 digits:',
  'maskPipe.example4Title': 'Example 4: Toggle Masking',
  'maskPipe.example4Desc': 'Conditionally show/hide sensitive data:',
  'maskPipe.maskingConditions': 'Masking Conditions',
  'maskPipe.conditionsDesc': 'The pipe applies masking based on the following conditions:',
  'maskPipe.cond1':
    'The length of the input string must be greater than the sum of <code>unmaskedPrefixLength</code> and <code>unmaskedSuffixLength</code>.',
  'maskPipe.cond2': '<code>unmaskedPrefixLength</code> and <code>unmaskedSuffixLength</code> must not be negative.',
  'maskPipe.cond3': 'The <code>masked</code> option must be <code>true</code>.',
  'maskPipe.condFallback': 'If any of these conditions are not met, the original string is returned unchanged.',
  'maskPipe.apiSummary': 'Angular pipe that masks sensitive string data by replacing characters with asterisks.',
  'maskPipe.paramValue': 'The input string to be masked.',
  'maskPipe.paramOptions': 'Configuration options for masking behavior.',
  'maskPipe.returnsDesc':
    'The masked string, or the original string if masking is disabled or the string is too short.',
  'maskPipe.optUnmaskedPrefixLength': 'Number of characters to leave unmasked at the beginning. Defaults to 6.',
  'maskPipe.optUnmaskedSuffixLength': 'Number of characters to leave unmasked at the end. Defaults to 6.',
  'maskPipe.optMaskChar': 'Character used for masking. Defaults to "*".',
  'maskPipe.optEnabled': 'Whether masking is enabled. Defaults to true.',
  'byteConverterPipe.overview':
    'The <code>byteConverter</code> pipe converts numeric byte values into human-readable file size strings (e.g., "1.5 MB", "2.3 GB") with locale-aware formatting. It automatically handles unit conversion (BYTE, KB, MB, GB, TB) and supports internationalization with translations for multiple languages including English, French, Chinese, Japanese, Korean, German, Spanish, Italian, Portuguese, and Russian.',
  'byteConverterPipe.example1Title': 'Example 1: Basic Usage',
  'byteConverterPipe.example1Desc': 'Convert byte values to human-readable format:',
  'byteConverterPipe.example2Title': 'Example 2: File Size Display',
  'byteConverterPipe.example2Desc': 'Display file sizes in a user-friendly format:',
  'byteConverterPipe.example3Title': 'Example 3: Different Unit Conversions',
  'byteConverterPipe.example3Desc': 'The pipe automatically converts to the appropriate unit:',
  'byteConverterPipe.languageSupport': 'Language Support',
  'byteConverterPipe.languageSupportDesc':
    "The pipe uses the application's <code>LOCALE_ID</code> to determine the appropriate unit translations. Supported languages include English, French, Chinese (Simplified and Traditional), Japanese, Korean, German, Spanish, Italian, Portuguese (Brazil), and Russian. If the browser language is not supported, English serves as the default.",
  'byteConverterPipe.i18nCallout':
    'To configure locale support, refer to the <a href="https://angular.io/guide/i18n" target="_blank">Angular i18n documentation</a>.',
  'byteConverterPipe.apiSummary':
    'Angular pipe that converts a number of bytes into a human-readable string format with locale-aware formatting.',
  'byteConverterPipe.paramValue': '(Optional) The number of bytes to convert. Returns null if null, undefined, or NaN.',
  'byteConverterPipe.returnsDesc':
    'A formatted string with appropriate unit (B, KB, MB, GB, TB) based on locale, or null if invalid.',
  'datagridUtil.transformDesc':
    "The function converts the Clarity datagrid state (containing pagination, sorting, and filter information) into a PageQuery object. Here's an example of the transformation:",
  'datagridUtil.inputTitle': 'Input: Clarity Datagrid State',
  'datagridUtil.outputTitle': 'Output: PageQuery Object',
  'datagridUtil.usageDesc': 'Use convertToHttpParams in your component to convert datagrid state for API requests:',
  'common.save': 'Save',
  'common.submit': 'Submit',
  'statusIndicator.inputIconStatus': 'Status represented by the icon.',
  'statusIndicator.inputIconSize': 'Icon size, including sm, md, lg or a pixel size string.',
  'statusIndicator.inputTooltip': 'Optional text shown on hover or focus.',
  'statusIndicator.inputTooltipPosition': 'Tooltip position relative to its trigger.',
  'tooltip.componentTypeExample': 'Component type content',
  'idleDetection.configIdleDuration': 'Seconds of inactivity before the countdown starts.',
  'idleDetection.configTimeoutDuration': 'Countdown duration in seconds before timeout.',
  'playground.copyFailed': 'Copy failed. Select and copy the code manually.',
  'header.partialLanguage': 'Partial translation; missing text uses English.',
  'form.masterPassword': 'Master Password',
  'form.masterPasswordRequired': 'Master password is required.',
  'grid.refresh': 'Refresh',
  'grid.firstName': 'First Name',
  'grid.lastName': 'Last Name',
  'grid.email': 'Email',
  'home.claritySetup': 'For guidance on setting up Clarity Design System in your project, refer to the',
  'home.clarityDocumentation': 'Clarity Design System documentation',
  'resourceAsync.useResource': 'Use resourceAsync when:',
  'resourceAsync.useComputed': 'Use computedAsync when:',
  'resourceAsync.preferMutation':
    'For server writes, prefer mutateResource. Legacy execute() submissions must set lazy: true, reactive: false and behavior: exhaust.',
  'resourceAsync.useRead': 'Manage local read operations (GET), with reload() for refetching.',
  'resourceAsync.useLocal': 'Manage optimistic local state, cached values or form drafts with set()/update().',
  'resourceAsync.useManual': 'Explicitly trigger or reset an operation with reload(), execute() or reset().',
  'resourceAsync.useStatus': 'Track idle, loading, reloading, resolved, error and local states.',
  'resourceAsync.useLazy': 'Defer initial execution with lazy loading.',
  'resourceAsync.useCancel': 'Cancel replaced reads with switch or suppress overlapping operations with exhaust.',
  'resourceAsync.useComputedReactive': 'Automatically recompute async data when signal dependencies change.',
  'resourceAsync.useComputedConcurrency': 'Choose switch, merge, concat or exhaust behavior explicitly.',
  'resourceAsync.useComputedValue': 'Expose a single signal, with an explicit error fallback or throwOnError policy.',
  'resourceAsync.apiSummary':
    'Creates a local reactive resource with async state, cancellation, explicit execution and local updates.',
  'resourceAsync.errorValuePolicy':
    'On error, the previous value is cleared by default. Use preserveValueOnError: true to retain it.',
  'resourceAsync.notLoaded': 'Not loaded',
  'resourceAsync.noData': 'No data',
  'resourceAsync.lastUpdated': 'Last Updated',
  'resourceAsync.topicTitle': 'Topic / Title',
  'resourceAsync.keyConcepts': 'Key Concepts:',
  'resourceAsync.patternBenefits': 'Pattern Benefits:',
  'spinner.inputDecorative': 'Decorative by default. Set false to announce loading as a status.',
  'spinner.inputLabel': 'Localized status label; defaults to the built-in loading message.',
  'fileReader.inputControlId': 'ID of the native input, for association with a form label.',
  'fileReader.inputAcceptFiles': 'Accepted text file types. This component reads text, not arbitrary binary files.',
  'fileReader.inputEncoded': 'Emit text as base64 when enabled.',
  'fileReader.inputTextEncoding': 'UTF-8 by default; choose latin1 when consuming legacy base64 byte strings.',
  'fileReader.inputMaxSize': 'Maximum size in MiB. Oversized files are rejected before reading.',
  'fileReader.inputDisabled': 'Disable file selection and removal.',
  'fileReader.outputChange': 'Emits text or base64 after a successful file selection.',
  'k8sRetryBackoff.paramJitter':
    'Fallback jitter strategy. Equal jitter waits between half and the full exponential ceiling.',
  'k8sRetryBackoff.paramHintJitter': 'Additional random wait after a server hint, in milliseconds.',
  'k8sRetryBackoff.paramMaxDelay':
    'Maximum individual wait. A longer server hint stops retries without shortening the hint.',
  'k8sRetryBackoff.paramWaitBudget': 'Cumulative scheduled wait budget; excludes time spent on network requests.',
  'k8sRetryBackoff.paramMethods':
    'Interceptor-only method allowlist. POST/PATCH require explicit opt-in and endpoint idempotency.',
  'k8sRetryBackoff.paramRandom': 'Random source returning a finite number in [0, 1), for deterministic scheduling.',
  'k8sRetryBackoff.retryContract':
    'Defaults: five attempts, exponential fallback with equal jitter, up to 250ms extra on server hints, 30s per wait and 60s total scheduled waits. Oversized hints stop retries. Interceptors retry idempotent methods by default; POST/PATCH require an endpoint guarantee.',
  'k8sRetryBackoff.paramMinDelay':
    'Minimum fallback wait for every jitter strategy; cannot exceed maxDelayMs. Server hints are unchanged.',
  'k8sRetryBackoff.paramStatuses':
    'Eligible HTTP statuses. Other errors propagate unchanged; additional statuses require endpoint review.',
  'k8sRetryBackoff.paramPredicate':
    'Extra error filter, applied after the status check. It does not enable POST/PATCH by itself.',
  'k8sRetryBackoff.paramLogRetries': 'Enable retry logging after the delay passes the wait budget checks.',
  'k8sRetryBackoff.paramLabel':
    'Log label. Generated interceptor labels omit query strings and fragments; redact custom labels.',
  'k8sRetryBackoff.paramLogger':
    'Optional logger with attempt, maxRetries, delayMs, error and label. Redact error data; logger failures do not stop retries.',
  'k8sRetryBackoffInterceptor.postDefault': 'POST: default (no retry)',
  'k8sRetryBackoffInterceptor.postOptIn': 'POST: explicit Kubernetes opt-in',
  'k8sRetryBackoffInterceptor.postGateway': 'POST: gateway 429 (rejected)',
  'demoApi.key-value-inputs-demo.inputs.formArray':
    'The FormArray instance from the parent component used to manage the key-value pairs.',
  'demoApi.key-value-inputs-demo.inputs.data': 'Initial data to pre-populate the form with existing key-value pairs.',
  'demoApi.key-value-inputs-demo.inputs.uniqueKey':
    'Set to <code>true</code> to enable unique key validation. Uses <code>UniqueValidator</code> from ngx-lift.',
  'demoApi.key-value-inputs-demo.inputs.keyHelper': 'Helper text for the key input field.',
  'demoApi.key-value-inputs-demo.inputs.valueHelper': 'Helper text for the value input field.',
  'demoApi.key-value-inputs-demo.inputs.addText': 'Text for the "Add Key-Value Pair" button.',
  'demoApi.key-value-inputs-demo.inputs.inputSize': 'Size of the input fields.',
  'demoApi.key-value-inputs-demo.inputs.buttonClass': 'Custom class to apply to "Add Key-Value Pair" button.',
  'demoApi.key-value-inputs-demo.inputs.smartMode':
    'If set to <code>true</code>, the component will automatically create one key-value pair when there are no key-value inputs.',
  'demoApi.key-value-inputs-demo.inputs.keyPattern':
    'If key control needs to pass a custom regex pattern. You can pass an object with two keys: <code>regex</code> and <code>message</code>. The message property is optional.',
  'demoApi.key-value-inputs-demo.inputs.valuePattern':
    'Similar to <code>keyPattern</code>, but used for value control validation.',
  'demoApi.key-value-inputs-demo.outputs.removeKeyValue':
    'Event emitted when a key-value pair is removed. Provides the index of the removed pair.',
  'demoApi.key-value-inputs-demo.outputs.addKeyValue': 'Event emitted when a new key-value pair is added.',
  'demoApi.multi-alerts-demo.methods.addAlert(options: Alert)': 'Adds a new alert with the specified options.',
  'demoApi.multi-alerts-demo.methods.deleteAlert(id: symbol)': 'Deletes an alert by its ID.',
  'demoApi.multi-alerts-demo.methods.clearAlerts()': 'Clears all alerts.',
  'demoApi.multi-alerts-demo.alertProperties.content': 'The alert message. Safe HTML formatting is supported.',
  'demoApi.multi-alerts-demo.alertProperties.alertType': 'The type of alert.',
  'demoApi.multi-alerts-demo.alertProperties.actions':
    'Native buttons. Each action provides <code>label: string</code> and <code>onClick: () => void</code>.',
  'demoApi.multi-alerts-demo.alertProperties.isAppLevel': 'Whether this is an application-level alert.',
  'demoApi.multi-alerts-demo.alertProperties.targetSelector':
    'The selector (ID, class, etc.) of a clickable element (button, link, etc.) anywhere within the alert content.',
  'demoApi.multi-alerts-demo.alertProperties.onTargetClick':
    'Callback executed when the element matching <code>targetSelector</code> within the alert content is clicked.',
  'demoApi.theme-toggle-demo.componentInputs.lang': 'Explicit language code for localized tooltips.',
  'demoApi.theme-toggle-demo.componentOutputs.changeTheme':
    "Emits <code>ClarityTheme</code> ('light' | 'dark') whenever the theme is toggled.",
  'demoApi.theme-toggle-demo.serviceProperties.theme': "Current active theme ('light' | 'dark').",
  'demoApi.theme-toggle-demo.serviceMethods.setTheme(newTheme: ClarityTheme)':
    'Sets the theme, persists to storage, and updates the DOM.',
  'demoApi.timeline-wizard-demo.wizardInputs.timelineSteps':
    'An array of <code>TimelineStep</code> objects representing the steps in the wizard.',
  'demoApi.timeline-wizard-demo.wizardInputs.live':
    'Controls whether to destroy step components when clicking prev/next buttons.',
  'demoApi.timeline-wizard-demo.wizardInputs.confirmButtonText': 'The text for the "Finish" button on the last step.',
  'demoApi.timeline-wizard-demo.wizardOutputs.confirmed':
    "Emits all previous steps' data when clicking the finish button in the last step.",
  'demoApi.timeline-wizard-demo.wizardOutputs.canceled': 'Emits when the wizard is canceled.',
  'demoApi.timeline-wizard-demo.wizardOutputs.finished': 'Emits when the wizard is successfully completed.',
  'demoApi.timeline-wizard-demo.wizardMethods.cancel()':
    'Cancels the wizard and emits the <code>canceled</code> event.',
  'demoApi.timeline-wizard-demo.wizardMethods.nextStep()': 'Moves to the next step in the wizard.',
  'demoApi.timeline-wizard-demo.wizardMethods.previousStep()': 'Moves to the previous step in the wizard.',
  'demoApi.timeline-wizard-demo.baseProperties.allStepsData':
    'An array containing the data of all wizard steps. Available as an input property, accessible in <code>ngOnInit</code> and later lifecycle hooks.',
  'demoApi.timeline-wizard-demo.baseProperties.currentStepData':
    'The data of the current step or <code>null</code> if not available. Available as an input property, accessible in <code>ngOnInit</code> and later lifecycle hooks.',
  'demoApi.timeline-wizard-demo.baseProperties.form':
    'The form group associated with the step. Set to <code>null</code> for steps without a form. Override this property in your step component.',
  'demoApi.timeline-wizard-demo.baseProperties.next$':
    'An observable that emits when the "Next" button is clicked. Override it to perform custom actions, such as API calls.',
  'demoApi.timeline-wizard-demo.baseProperties.stepInvalid': "Indicates whether the step's form is invalid.",
  'demoApi.timeline-wizard-demo.baseMethods.formValueToData()':
    "Converts the step's form value to data. Override this method if your form structure doesn't match the step data structure.",
  'demoApi.timeline-wizard-demo.baseMethods.dataToFormValue(data)':
    "Converts step data to the form value that can be used for <code>patchValue</code>. Override this method if your form structure doesn't match the step data structure.",
  'demoApi.timeline-wizard-demo.stepProperties.state':
    "The state of the timeline step (e.g., 'not-started', 'current', 'success', 'error').",
  'demoApi.timeline-wizard-demo.stepProperties.header': 'The header of the timeline step.',
  'demoApi.timeline-wizard-demo.stepProperties.title':
    'The title of the timeline step, acting as an identifier (should be unique). Can be used to find step data via <code>getStepData</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.id':
    'The id of the timeline step, acting as a primary identifier. If id is not provided, will use title as identifier instead. Can be used to find step data via <code>getStepData</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.description': 'The description of the timeline step.',
  'demoApi.timeline-wizard-demo.stepProperties.component':
    'The Angular component associated with the timeline step. Must extend <code>TimelineBaseComponent</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.data':
    'Step data, which will be converted to form data by the timeline wizard component and passed to the step component as <code>currentStepData</code>.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStepIndex': 'Get the index of the current step.',
  'demoApi.timeline-wizard-demo.serviceProperties.isFirstStep': 'Check if the current step is the first step.',
  'demoApi.timeline-wizard-demo.serviceProperties.isLastStep': 'Check if the current step is the last step.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStep': 'Get the current step object.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStepData': 'Get the data of the current step.',
  'demoApi.timeline-wizard-demo.serviceProperties.allStepsData':
    'Get all steps data to be reviewed. Returns an array with step identifiers and data.',
  'demoApi.timeline-wizard-demo.serviceMethods.getStepData<T>(key: string)':
    'Get the data of a specific step by its id or title. Returns <code>null</code> if the step is not found.',
  'demoApi.toast-demo.methods.addToast(options: ToastOptions)': 'Creates a toast with the specified options.',
  'demoApi.toast-demo.methods.success(options: ToastOptions)': 'Creates a success toast with the specified options.',
  'demoApi.toast-demo.methods.info(options: ToastOptions)': 'Creates an info toast with the specified options.',
  'demoApi.toast-demo.methods.warning(options: ToastOptions)': 'Creates a warning toast with the specified options.',
  'demoApi.toast-demo.methods.error(options: ToastOptions)': 'Creates an error toast with the specified options.',
  'demoApi.toast-demo.toastOptions.title': 'The title of the toast message.',
  'demoApi.toast-demo.toastOptions.description': 'The description of the toast message.',
  'demoApi.toast-demo.toastOptions.toastType': 'The type of toast.',
  'demoApi.toast-demo.toastOptions.date': 'A relative timestamp (e.g., "1hr ago").',
  'demoApi.toast-demo.toastOptions.manualClosable': 'Whether the toast can be manually closed.',
  'demoApi.toast-demo.toastOptions.timeoutSeconds':
    "The number of seconds before the toast automatically closes. If not provided, uses the container's default.",
  'demoApi.toast-demo.toastOptions.primaryButtonText': 'Text for the primary action button.',
  'demoApi.toast-demo.toastOptions.primaryButtonClick': 'Callback function for the primary button click.',
  'demoApi.toast-demo.toastOptions.secondaryButtonText': 'Text for the secondary action button.',
  'demoApi.toast-demo.toastOptions.secondaryButtonClick': 'Callback function for the secondary button click.',
  'demoApi.toast-demo.toastOptions.closed': 'Callback function called when the toast is closed.',
  'demoApi.toast-demo.containerInputs.timeoutSeconds': 'Default timeout in seconds for toasts.',
  'demoApi.toast-demo.containerInputs.manualClosable': 'Whether toasts can be manually closed by default.',
  'demoApi.toast-demo.containerInputs.topOffset': 'Distance from the top of the screen in pixels.',
  'demoApi.tooltip-demo.inputs.cllTooltip':
    'Simple string content for the tooltip. Can be used as a shorthand for <code>cllTooltipContent</code>.',
  'demoApi.tooltip-demo.inputs.cllTooltipContent':
    'The content to display in the tooltip. Can be a string, template reference, component reference, or component type.',
  'demoApi.tooltip-demo.inputs.cllTooltipContentContext':
    'Context object to pass to the template when using <code>TemplateRef</code> as content.',
  'demoApi.tooltip-demo.inputs.cllTooltipWidth': 'Width of the tooltip in pixels.',
  'demoApi.tooltip-demo.inputs.cllTooltipPosition':
    "Position of the tooltip relative to the element. Options include 'tooltip-top-right', 'tooltip-top-left', etc.",
  'demoApi.tooltip-demo.inputs.cllTooltipHideDelay':
    'Delay in milliseconds before hiding the tooltip after mouse leave.',
  'demoApi.mutate-resource.mutateResourceApiProps.mutation':
    'Async function or observable executing the server-side write operation.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.invalidateTags':
    'Tags to invalidate upon successful write. Immediately schedules refetches for active queries.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.concurrency':
    'Strategy for overlapping calls: parallel (default), exhaust (joins in-flight), concat (queues).',
  'demoApi.mutate-resource.mutateResourceApiProps.options.injector':
    'Optional explicit Angular Injector for signal registration outside injection context.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.client':
    'Optional explicit QueryClient override (defaults to QUERY_CLIENT token).',
  'demoApi.mutate-resource.mutateResourceRefApiProps.value':
    'Signal holding the latest successfully resolved mutation result.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.error':
    'Signal holding the most recent mutation error, or null when healthy.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.status': 'Granular mutation lifecycle status.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.isLoading': 'True while the mutation operation is executing.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.mutate(args)':
    'Triggers the mutation with arguments and returns a Promise settling with the result or rejection.',
  'demoApi.query-resource.queryResourceApiProps.definition':
    'Reactive factory with an Observable or Promise loader, or undefined to disable.',
  'demoApi.query-resource.queryResourceApiProps.options.pollInterval':
    'Milliseconds between completed requests. Coordinated across all active observers.',
  'demoApi.query-resource.queryResourceApiProps.options.injector':
    'Optional explicit Angular Injector for signal registration outside injection context.',
  'demoApi.query-resource.queryResourceApiProps.options.client':
    'Optional explicit QueryClient override (defaults to QUERY_CLIENT token).',
  'demoApi.query-resource.queryResourceDefinitionProps.key':
    'Array of JSON-compatible values uniquely identifying the query (e.g. ["user", id]).',
  'demoApi.query-resource.queryResourceDefinitionProps.loader':
    'Data fetcher receiving { abortSignal, refresh }. Observable reads automatically complete after the first emission.',
  'demoApi.query-resource.queryResourceDefinitionProps.tags':
    'Optional tags for cache invalidation (e.g. [{ type: "users" }]).',
  'demoApi.query-resource.queryResourceDefinitionProps.staleTime':
    'Duration in milliseconds before cached data is considered stale.',
  'demoApi.query-resource.queryResourceDefinitionProps.gcTime':
    'Duration in milliseconds (default 5 minutes) to retain unused queries in cache.',
  'demoApi.query-resource.queryResourceDefinitionProps.cancelOnNoObservers':
    'Whether to abort an in-flight transport request if all observers unmount before completion.',
  'demoApi.query-resource.queryResourceRefApiProps.value':
    'Signal holding the latest successfully resolved query data.',
  'demoApi.query-resource.queryResourceRefApiProps.error':
    'Signal holding the most recent error, or null when healthy.',
  'demoApi.query-resource.queryResourceRefApiProps.status':
    'Granular status: "idle" | "loading" | "reloading" | "resolved" | "error".',
  'demoApi.query-resource.queryResourceRefApiProps.isLoading': 'True when status is "loading" or "reloading".',
  'demoApi.query-resource.queryResourceRefApiProps.isStale':
    'True when data has exceeded staleTime or was invalidated by a mutation.',
  'demoApi.query-resource.queryResourceRefApiProps.hasValue()':
    'Type predicate narrowing value() to exclude undefined when valid data is present.',
  'demoApi.query-resource.queryResourceRefApiProps.reload()':
    'Triggers a background refresh without wiping existing data (status: "reloading").',
  'demoApi.query-resource.queryResourceRefApiProps.execute()':
    'Forces an immediate fresh fetch and returns a Promise settling with the result.',
  'demoApi.query-resource.queryResourceRefApiProps.destroy()':
    'Detaches this observer without canceling shared queries if other observers remain.',
  'demoApi.resource-async.definitionProperties.params':
    'Pure reactive parameter capture function. Signal reads here are tracked.',
  'demoApi.resource-async.definitionProperties.loader':
    'Factory receiving latest params and context.abortSignal. Signal reads here are untracked.',
  'demoApi.resource-async.optionsProperties.defaultValue':
    'Default value before first fetch; guarantees value() returns T (never undefined). Alias for initialValue.',
  'demoApi.resource-async.optionsProperties.preserveValueOnError':
    'Retain the last received or local value when an error occurs.',
  'demoApi.resource-async.optionsProperties.reactive':
    'Whether parameter/source dependencies trigger automatic re-execution.',
  'demoApi.resource-async.optionsProperties.injector':
    'Optional custom injector if called outside an ambient injection context.',
  'demoApi.resource-async.optionsProperties.equal': 'Custom equality comparator passed to underlying computed signal.',
  'demoApi.resource-async.returnsProperties.value': 'The current value of the resource.',
  'demoApi.resource-async.returnsProperties.error': 'The current error, if any.',
  'demoApi.resource-async.returnsProperties.status':
    "The current status: 'idle' | 'loading' | 'reloading' | 'resolved' | 'local' | 'error'.",
  'demoApi.resource-async.returnsProperties.isLoading':
    "Signal that returns true if any fetch operation is in progress ('loading' or 'reloading').",
  'demoApi.resource-async.returnsProperties.isIdle':
    'Signal that returns true if the resource is in idle state (never fetched).',
  'demoApi.resource-async.returnsProperties.hasValue()':
    'Type predicate narrowing value() to exclude undefined when true.',
  'demoApi.resource-async.returnsProperties.reload()':
    'Manually trigger a reload of the resource. Ideal for queries (GET).',
  'demoApi.resource-async.returnsProperties.execute()':
    'Manually trigger execution returning an awaitable Promise. Ideal for mutations (POST/PUT/DELETE).',
  'demoApi.resource-async.returnsProperties.set()':
    'Manually update the resource value, transitioning status to "local".',
  'demoApi.resource-async.returnsProperties.update()':
    'Update the resource value using an updater function, transitioning status to "local".',
  'demoApi.resource-async.returnsProperties.reset()':
    'Resets the resource to its initial idle state and cancels in-flight operations.',
  'demoApi.resource-async.returnsProperties.destroy()': 'Permanently stop observation and cancel pending work.',
  'demoApi.date-range-validator.optionsProperties.compareTime':
    'Whether to compare the time as well. Defaults to false.',
  'certificate.loading': 'Loading certificate…',
  'certificate.loadFailed': 'Certificate details could not load. Refresh the page to try again.',
  'fileReader.validationUnavailable': 'Certificate validation could not load. Refresh the page and try again.',
  'queryExamples.failureTitle': 'Failure and recovery patterns',
  'queryExamples.failureIntro': 'Keep good data, bound reads, and recover only the failed work.',
  'queryExamples.initialFailure': 'Initial read failure',
  'queryExamples.initialFailureMessage': 'No data yet. Retry this read.',
  'queryExamples.refreshFailure': 'Refresh failure with retained data',
  'queryExamples.refreshFailureMessage': 'Refresh failed. Showing the last successful result.',
  'queryExamples.failureData': 'Last successful value: {0}',
  'queryExamples.retryRead': 'Retry read',
  'queryExamples.failRefresh': 'Fail one refresh',
  'queryExamples.failObserver': 'Simulate observer failure',
  'queryExamples.automaticRetry': 'Bounded automatic retries',
  'queryExamples.retryIntro': 'Two temporary failures, then success. Reads share one retry loop.',
  'queryExamples.startRetry': 'Start Observable retry',
  'queryExamples.startPromise': 'Start Promise retry',
  'queryExamples.deadline': 'Logical read deadline',
  'queryExamples.deadlineIntro': 'This read never emits. The deadline releases its subscription.',
  'queryExamples.startDeadline': 'Start hanging read',
  'queryExamples.deadlineMessage': 'The read timed out. You can retry.',
  'queryExamples.canceledReads': 'Canceled subscriptions: {0}',
  'queryExamples.partialFailure': '2. Partial List Failure & Granular Recovery',
  'queryExamples.mutationFailure': 'Write failure',
  'queryExamples.mutationIntro': 'Writes do not retry automatically. This fixture rejects before applying the write.',
  'queryExamples.failWrite': 'Submit failed write',
  'queryExamples.submitWrite': 'Submit write',
  'queryExamples.writeMessage': 'The write failed. Your input is retained.',
  'queryExamples.failureEvents': 'Terminal read errors: {0}; observer diagnostics: {1}',
  'queryExamples.isInitialErrorDescription': 'True when a read fails before any successful data.',
  'queryExamples.isRefreshErrorDescription': 'True when a refresh fails while successful data is retained.',
  'queryExamples.updatedAtDescription': 'Timestamp of the last successful read.',
  'queryExamples.failureCountDescription': 'Failed attempts in the current logical read; zero after success.',
  'queryExamples.failureReasonDescription': 'Latest attempt failure or final deadline error.',
  'queryExamples.nextRetryAtDescription': 'Timestamp of the next retry; null while fetching or after settlement.',
  'queryExamples.retryDescription': 'Optional bounded retry policy. Defaults to disabled.',
  'queryExamples.deadlineDescription':
    'Total read deadline including retry waits; false disables an inherited deadline.',
  'queryExamples.recoveryFocusDescription': 'Opt in to refresh observed stale reads on focus.',
  'queryExamples.recoveryReconnectDescription': 'Opt in to refresh observed stale reads after reconnect.',
  'queryExamples.title': 'Observable-first queries in practice',
  'queryExamples.intro':
    'These examples use HttpClient with a local mock API. Switch tenants to see scoped data and independent caches.',
  'queryExamples.tenant': 'Tenant',
  'queryExamples.tenantA': 'Tenant A',
  'queryExamples.tenantB': 'Tenant B',
  'queryExamples.parallel': '1. Independent parallel requests',
  'queryExamples.health': 'Health',
  'queryExamples.refresh': 'Refresh tenant',
  'queryExamples.fail': 'Fail next tenant read',
  'queryExamples.tenantError': 'Tenant read failed; cached data remains available.',
  'queryExamples.retry': 'Retry tenant',
  'queryExamples.dependent': '2. Dependent request and mutation refresh',
  'queryExamples.databases': 'Databases',
  'queryExamples.gate': 'The database query waits for tenant data. Cached tenant data remains usable during refresh.',
  'queryExamples.name': 'Database name',
  'queryExamples.create': 'Create database',
  'queryExamples.createError': 'Create failed. Retry the operation.',
  'queryExamples.databaseError': 'Database refresh failed.',
  'queryExamples.retryDatabases': 'Retry databases',
  'queryExamples.snapshot': 'observeQueryObservable: {0}, {1} databases',
  'queryExamples.service': '3. Three service callers share one request',
  'queryExamples.serviceIntro':
    'fetchQueryObservable returns one result and completes. observeQueryObservable continuously sends cache snapshots.',
  'queryExamples.mount': 'Mount service widgets',
  'queryExamples.refreshWidgets': 'Refresh service widgets',
  'queryExamples.widget': 'Widget {0}: tenant {1}, {2}',
  'queryExamples.counts': 'HTTP request counts:',
  'queryExamples.dynamic': '1. Dynamic Parallel Queries',
  'queryExamples.dynamicIntro':
    'queryResources maps selected IDs to independent observers. Reordering preserves observers; removing an ID disposes its observer.',
  'queryExamples.one': 'Tenant A only',
  'queryExamples.both': 'Both tenants',
  'queryExamples.reverse': 'Reverse order',
  'queryExamples.empty': 'Clear selection',
  'queryExamples.databaseA': 'Tenant A database',
  'queryExamples.databaseB': 'Tenant B database',
  'queryExamples.initialLoadingDescription': 'True during loading without successful data.',
  'queryExamples.refreshingDescription': 'True during refresh while retaining cached data.',
  'queryResources.k8sComparisonTitle': '3. Kubernetes Cluster Monitoring: Bulk vs. Granular Collection',
  'queryResources.k8sComparisonDesc':
    'Compare the traditional bulk aggregation pattern (queryResource with forkJoin) against the granular reactive collection pattern (queryResource with queryResources).',
  'queryResources.traditionalTab': 'Approach 1: Bulk Aggregation (forkJoin)',
  'queryResources.traditionalDesc':
    'Standard traditional pattern when using a combined query or backend endpoint. All clusters are fetched together; table updates as a single block.',
  'queryResources.granularTab': 'Approach 2: Granular Collection (queryResources)',
  'queryResources.granularDesc':
    'Independent observers per cluster. Fast clusters render immediately, slower clusters stream in progressively, and each cluster has independent error boundaries and reload controls.',
  'queryResources.refreshFleet': 'Refresh Fleet',
  'queryResources.refreshCluster': 'Reload Cluster',
  'queryResources.clusterName': 'Cluster',
  'queryResources.providerRegion': 'Provider & Region',
  'queryResources.activeNodes': 'Nodes',
  'queryResources.healthStatus': 'Health',
  'queryResources.latency': 'Response Time',
  'queryResources.actions': 'Actions',
  'queryResources.revalidatingNotice': 'Updating cluster metrics in background... existing table remains interactive.',
  'queryResources.headOfLineWarning':
    'Note: Response time is bound to the slowest cluster (1200ms) before any metrics display.',
  'queryResources.progressiveNotice':
    'Note: US East (200ms) and EU West (500ms) appear immediately while APAC (1200ms) streams in.',
  'queryResources.comparisonTableTitle': 'Pattern Comparison',
  'queryResources.dimTitle': 'Architecture Dimension',
  'queryResources.dimArch': 'Composition Architecture',
  'queryResources.dimArchTraditional': 'Single combined queryResource wrapping switchMap + forkJoin',
  'queryResources.dimArchGranular': 'Parent queryResource (cluster list) + child queryResources (metrics)',
  'queryResources.dimLatency': 'Time to First Render',
  'queryResources.dimLatencyTraditional': 'Head-of-line blocking (waiting for slowest cluster)',
  'queryResources.dimLatencyGranular': 'Progressive streaming (fast clusters render in ms; slow clusters stream in)',
  'queryResources.dimIsolation': 'Fault Isolation',
  'queryResources.dimIsolationTraditional': 'Entire table fails unless each item is wrapped in defensive catchError',
  'queryResources.dimIsolationGranular': 'Isolated error boundaries (a failing cluster does not affect others)',
  'queryResources.dimIdentity': 'Row Identity Availability',
  'queryResources.dimIdentityTraditional': 'Deferred until entire forkJoin completes',
  'queryResources.dimIdentityGranular': 'Immediate via query.item() even while metrics are loading',
  'queryResources.dimReload': 'Reload Granularity',
  'queryResources.dimReloadTraditional': 'All-or-nothing fleet reload',
  'queryResources.dimReloadGranular': 'Dual-level: fleet refresh (tags) + individual row reload (query.reload())',
  'queryResources.dimCache': 'Cache Strategy',
  'queryResources.dimCacheTraditional': 'Single monolithic key',
  'queryResources.dimCacheGranular': 'Dedicated canonical key per cluster (reusable across views)',
  'queryResources.prosConsTitle': 'Architectural Trade-offs',
  'queryResources.prosTraditional':
    'Familiar RxJS pattern; simple single array for Datagrid sorting/pagination; ideal for bulk API endpoints.',
  'queryResources.consTraditional':
    'Slowest item blocks the table; cannot retry a single failed item without reloading everything.',
  'queryResources.prosGranular':
    'Eliminates perceived latency; independent error boundaries; synchronous row identity; granular per-row controls; optimal cache reuse.',
  'queryResources.consGranular':
    'Requires modeling parent list and child queries separately; requires computed view model for cross-column table sorting.',
  'queryResource.thFailures': 'Failed attempts',
  'queryResource.thNextRetry': 'Next retry',
  'queryGuide.selection': 'Related tools:',
  'queryGuide.basic': '1. Start with a cached read',
  'queryGuide.basicIntro':
    'Capture the tenant once, use it in both the key and loader, then read the result signals. Refresh keeps the last successful value.',
  'queryGuide.configure': 'Application configuration',
  'queryGuide.collectionIntro':
    'Use queryResources for a changing list of independent reads. Each input has its own cached result, loading state and recovery controls.',
  'queryGuide.empty': 'No items selected. No collection reads are active.',
  'queryGuide.partialIntro':
    'One row fails while its sibling stays available. Retry the failed row without refetching successful rows.',
  'queryGuide.collectionContract':
    'The collection is a signal of ordered query refs. Reordering preserves refs; removal hides rows immediately and releases observers during effect scheduling. Duplicate canonical keys are rejected.',
  'queryGuide.collectionLimits':
    'Use one data type per collection and filter out items that are not ready. Requests start in parallel with no concurrency limit; paginate or limit large selections. maxEntries does not evict active or pending entries.',
  'queryGuide.namingTitle': 'Naming query and mutation handles',
  'queryGuide.namingHandles':
    'Use <code>userQuery</code> for one query, <code>tenantQueries</code> for a collection, and <code>createMutation</code> for a write. Reserve <code>user</code> or <code>tenant</code> for the resolved data.',

  'computedAsync.failSource': 'Fail source',
  'computedAsync.recoverSource': 'Recover source',
  'computedAsync.readSignal': 'Read signal',
  'computedAsync.lastRead': 'Last read',
  'computedAsync.notRead': 'Not read yet',
  'computedAsync.readError': 'The read threw; no success value was returned.',
  'computedAsync.readDemoHint':
    'Fail the source, then read the signal. Recover the source and read again to verify recovery.',
  'header.mitLicense': 'MIT License',
  'alert.moreInfo': 'More information about the server error',
  'common.interfaceTitle': '{0} Interface',
  'common.failed': 'Failed',
  'common.error': 'Error',
  'common.pros': 'Pros',
  'common.cons': 'Cons',
  'common.componentN': 'Component {0}',
  'poll.filterParameter': 'Filter parameter (signal)',
  'poll.filterAll': 'All ({0} items)',
  'poll.filterActive': 'Active ({0} items)',
  'poll.filterInactive': 'Inactive ({0} items)',
  'poll.activeFilter': 'Active filter',
  'poll.inProgress': 'Polling in progress...',
  'poll.sequence': 'Poll sequence',
  'poll.filteredBy': 'Filtered by',
  'poll.totalResults': 'Total results',
  'poll.lastTimestamp': 'Last server timestamp',
  'poll.recentLog': 'Recent poll trigger and execution log',
  'poll.triggerWithFilter': 'Trigger with filter: "{0}"',
  'poll.executing': 'Executing (HTTP delay)',
  'poll.settled': 'Settled',
  'k8sRetryBackoff.resultSuccess': 'Success (HTTP {0})',
  'k8sRetryBackoff.resultFailure': 'Failed (HTTP {0})',
  'k8sRetryBackoff.totalAttempts': '(Total attempts: {0})',
  'k8sRetryBackoff.failFast': 'HTTP {0} (fail fast)',
  'k8sRetryBackoff.overrideSucceeded': 'HTTP {0} (succeeded)',
  'k8sRetryBackoff.attempts': '(Attempts: {0})',
  'k8sRetryBackoff.exhaustedResult': 'Maximum attempts (5) reached. Request rejected.',
  'k8sRetryBackoff.non429Result': 'Error {0}: A non-429 error was propagated immediately without retry.',
  'k8sRetryBackoff.interceptorSuccess': 'The request succeeded through the interceptor after retry.',
  'k8sRetryBackoff.disabledResult': 'HTTP 429 was returned immediately: retry backoff was disabled via HttpContext.',
  'k8sRetryBackoff.postDefaultResult': 'POST was not retried: write retries require explicit opt-in for the endpoint.',
  'k8sRetryBackoff.gatewayResult': 'Gateway 429 was not retried: the configured Kubernetes predicate rejected it.',
  'k8sRetryBackoff.unrecoveredResult': 'Error {0}: Maximum attempts reached without recovery.',
  'k8sRetryBackoff.customOverrideResult':
    'The request succeeded after 2 retries with maxAttempts: 10, an exponential base of 200ms, and equal jitter.',
  'k8sRetryBackoff.bypassedResult':
    'The request failed immediately (HTTP 429). Retries were bypassed via K8S_RETRY_BACKOFF_CONFIG: false.',
  'k8sRetryBackoff.operatorSuccess': 'The request succeeded after retry.',
  'resourceAsync.lazyDemoTitle': 'Demo: Lazy-Loaded Users',
  'resourceAsync.fallbackTitle': 'Error Handling with Fallback',
  'resourceAsync.fallbackDescription':
    'This resource attempts to fetch from an invalid endpoint and falls back to a default user:',
  'resourceAsync.throwOnErrorDescription':
    'Use <code>throwOnError: true</code> to propagate errors that are not handled by a fallback value. The error is also stored in the error signal.',
  'resourceAsync.throwOnErrorPolicy':
    'With <code>throwOnError: true</code>, errors propagate when <code>onError</code> is omitted or returns <code>undefined</code>. A fallback value returned by <code>onError</code> handles the error and prevents propagation.',
  'resourceAsync.mutationConfigTitle': 'Key Configuration for Mutations:',
  'resourceAsync.mutationLazy': '<code>lazy: true</code>: Execute only when explicitly triggered.',
  'resourceAsync.mutationExhaust':
    "<code>behavior: 'exhaust'</code>: Prevent duplicate submissions by ignoring new requests while one is in progress. Each <code>execute()</code> call joins the outcome of the active operation.",
  'resourceAsync.mutationExecute':
    '<code>execute(): Promise&lt;T&gt;</code>: Trigger a mutation and await its result, or call without awaiting.',
  'resourceAsync.mutationBenefitsTitle': 'Why this works great for mutations:',
  'resourceAsync.mutationSubmit': '<code>lazy: true</code>: Submit the form only when the user clicks submit.',
  'resourceAsync.mutationRepeatedClicks':
    "<code>behavior: 'exhaust'</code>: Ignore repeated submit clicks while the request is in progress.",
  'resourceAsync.mutationAwait':
    '<code>execute(): Promise&lt;T&gt;</code>: Use <code>const res = await ref.execute()</code> or call without awaiting. It clears the previous value for a clean loading state.',
  'resourceAsync.mutationLoading': '<code>isLoading()</code>: Show loading feedback and disable the submit button.',
  'resourceAsync.mutationStatus': '<code>status()</code>: Track success and error states for user feedback.',
  'resourceAsync.registrationDemoTitle': 'Live Demo: User Registration Form',
  'resourceAsync.registrationDescription':
    "Submit the form to try a simulated registration API with a 70% success rate. With <code>behavior: 'exhaust'</code>, repeated submit clicks are ignored while a request is in progress.",
  'resourceAsync.registrationFailed': 'Registration failed: {0}',
  'resourceAsync.switchTitle': 'switch (default)',
  'resourceAsync.switchDescription':
    'Cancels the previous request when a new one starts, so the latest request determines the data. This is the default behavior and is best for reads (GET requests).',
  'resourceAsync.exhaustDescription':
    'Ignores new requests while one is in progress. Prevents duplicate operations from rapid clicks, such as repeated searches or pagination requests. Also useful for mutations (Example 5).',
  'resourceAsync.computedStateAdvice':
    'Use <code>computed()</code> instead of getters to derive state from signals. Memoization avoids repeated work and integrates with Angular reactivity.',
  'resourceAsync.queryPreset': 'Query Preset:',
  'resourceAsync.reset': 'Reset',
  'resourceAsync.awaitExecute': 'Await execute()',
  'resourceAsync.statusLabel': 'Status:',
  'resourceAsync.activeQuery': 'Active Query:',
  'resourceAsync.fetchingWithAbortSignal': 'Fetching with AbortSignal...',
  'resourceAsync.category': 'Category',
  'resourceAsync.requestInFlight': 'In-Flight (signal active)',
  'resourceAsync.requestAborted': 'Aborted (AbortSignal cancelled)',
  'resourceAsync.requestResolved': 'Resolved',
  'resourceAsync.requestLogLabel': 'Request #{0} (query: "{1}"):',
  'resourceAsync.todoDemoTitle': 'Demo: Todo Toggle',
  'resourceAsync.completedLabel': 'Completed:',
  'resourceAsync.cacheFirstDemoTitle': 'Demo: Cache-First User Profile',
  'resourceAsync.counterDemoTitle': 'Demo: Editable Counter',
  'resourceAsync.expert': 'Expert',
  'resourceAsync.nestedDemoTitle': 'Demo: Items with Organizations',
  'resourceAsync.definitionTitle': 'ResourceAsyncDefinition (Declarative Definition)',
  'resourceAsync.statusTitle': 'Resource Status',
  'resourceAsync.writableResourceIntro':
    '<code>resourceAsync</code> returns a <code>WritableResourceRef</code> with <code>set()</code>, <code>update()</code>, and <code>asReadonly()</code> for manual state management, matching Angular’s <code>WritableResource</code> API.',
  'resourceAsync.decrementCounter': 'Decrease counter',
  'resourceAsync.incrementCounter': 'Increase counter',
  'resourceAsync.nestedIntroduction':
    'A list may contain items that fetch related organizations, users, or details. This example shows one approach to managing loading and error states independently for each row.',
  'resourceAsync.nestedInjector':
    'Pass <code>&#123; injector: this.injector &#125;</code> through the <code>injector</code> option in <code>ResourceRefOptions</code> to create <code>resourceAsync</code> dynamically in template helpers or services, without <code>runInInjectionContext()</code>.',
  'resourceAsync.fullDocumentation': '📖 Full Documentation:',
  'resourceAsync.seeDocumentation': 'Design guide:',
  'resourceAsync.documentationDescription':
    'Includes multiple approaches, decision trees, and guidance on when to use each pattern.',
  'resourceAsync.nestedOuter': 'Outer resource: The item list has its own loading and error state.',
  'resourceAsync.nestedInner': 'Inner resources: Related data for each item has independent loading and error states.',
  'resourceAsync.nestedLazy': 'Lazy loading: Fetch only when the user clicks, minimizing API calls.',
  'resourceAsync.nestedIndependent': 'Independent states: Each row manages its own loading indicator, error, and data.',
  'resourceAsync.nestedItemsFailed': 'Failed to load items: {0}',
  'resourceAsync.nestedOrganizationFailed': 'Failed to load organization',
  'resourceAsync.nestedBenefitRequests': "Minimal API calls (only fetch what's needed)",
  'resourceAsync.nestedBenefitStates': 'Individual loading/error states per row',
  'resourceAsync.nestedBenefitRetry': 'Retry failed fetches independently',
  'resourceAsync.nestedBenefitCache': 'Reuses one resource per orgId; explicit reloads fetch again.',
  'resourceAsync.nestedBenefitScale': 'Scales well for large lists',
  'resourceAsync.statusIdle':
    '<code>idle</code>: Not started yet, or reset. <code>value()</code> returns the configured initial/default value, or <code>undefined</code>.',
  'resourceAsync.statusLoading':
    '<code>loading</code>: An operation is loading without a retained result. <code>value()</code> returns the configured initial/default value, or <code>undefined</code>.',
  'resourceAsync.statusReloading':
    '<code>reloading</code>: Refetch in progress. <code>value()</code> retains the previous data.',
  'resourceAsync.statusResolved': '<code>resolved</code>: Operation succeeded. <code>value()</code> contains the data.',
  'resourceAsync.statusError':
    '<code>error</code>: Operation failed. Previous data is retained only with <code>preserveValueOnError</code>; otherwise, <code>value()</code> returns the configured initial/default value, or <code>undefined</code>.',
  'toast.greatTitle': 'Great Toast',
  'toast.successMessage': 'I am a successful message!',
  'toast.warningMessage': 'I am a warning message!',
  'toast.errorMessage': 'This is an error message. It closes automatically after 10 seconds.',
  'toast.infoMessage': 'I am the default toast type.',
  'toast.oneHourAgo': '1hr ago',
  'toast.primaryAction': 'Primary Button',
  'toast.secondaryAction': 'Secondary Button',
  'toast.primaryClicked': 'primary button clicked',
  'toast.secondaryClicked': 'secondary button clicked',
  'common.moreInfo': 'More Info',
  'toast.openTabSimulation': 'Assume opening a new tab',
  'common.details': 'Details',
  'common.dismiss': 'Dismiss',
  'common.acknowledge': 'Acknowledge',
  'multiAlerts.dangerMessage': 'This is a danger alert! You can delete this alert by clicking the close button.',
  'multiAlerts.warningMessage': 'Warning alert! You can delete this alert by clicking the close button.',
  'multiAlerts.successActions': 'Success alert with trailing action buttons.',
  'multiAlerts.detailsClicked': 'Details action clicked!',
  'multiAlerts.dismissClicked': 'Dismiss action clicked!',
  'multiAlerts.newActions': 'New alert with trailing action buttons.',
  'multiAlerts.acknowledged': 'Acknowledged!',
  'multiAlerts.inlineClicked': 'You did it correctly!',
  'multiAlerts.inlineMessage':
    'Alert with <button type="button" class="btn btn-sm alert-action" id="click-target">Click Me</button> inside the message.',
  'multiAlerts.standardAdded': 'New standard alert added on {0}',
  'timelineWizard.canceledMessage': 'Canceled',
  'timelineWizard.confirmedMessage':
    'Submission confirmed. View the form data in the console. This simulates an API request.',
  'timelineWizard.finishedMessage': 'Finished',
  'tooltip.componentAlert': 'I am from the alert component',
  'resourceAsync.todoUpdateFailed': 'Failed to update todo',
  'resourceAsync.counterSaveFailed': 'Failed to save counter',
  'resourceAsync.counterSaved': 'Counter saved: {0}',
  'resourceAsync.usernameExists': 'Username already exists',
  'resourceAsync.registrationSuccess': 'Registration successful! Welcome aboard.',
  'resourceAsync.networkTimeout': 'Network timeout',
  'runtime.readFailure': 'Simulated read failure',
  'runtime.saveFailure': 'Simulated save failure',
  'runtime.pollFailure': 'Simulated polling failure',
  'runtime.settingsSaveFailure': 'HTTP 500: Failed to persist cluster settings to the database.',
  'isPromise.caseNative': 'Native Promise.resolve()',
  'isPromise.caseAsync': 'Async Function Return',
  'isPromise.caseThenable': 'Custom Thenable Object',
  'isPromise.caseObject': 'Plain Object',
  'isPromise.caseNullish': 'null / undefined',
  'isPromise.casePrimitive': 'Primitive Value',
  'isPromise.caseFunction': 'Function without .then',
  'idleDetection.activeStatus': 'Active',
  'idleDetection.timeoutStatus': 'Timeout Triggered',
  'multiAlerts.newInlineMessage':
    'Alert with <button type="button" class="btn btn-sm alert-action" id="inline-click-target">Click Me</button> inside the message.',
  'timelineWizard.review': 'Review',
};
