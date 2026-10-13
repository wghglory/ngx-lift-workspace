export const esTranslations: Record<string, string> = {
  'header.selectLanguage': 'Seleccionar idioma',
  'header.openGitHub': 'Abrir en GitHub',
  'header.codeLicensed': 'Código bajo licencia',

  'nav.signalUtils': 'Utilidades de Signal',
  'nav.queryMutation': 'Query & Mutation',
  'nav.operators': 'Operadores',
  'nav.interceptors': 'Interceptores',
  'nav.validators': 'Validadores',
  'nav.pipes': 'Pipes',
  'nav.utilities': 'Utilidades',
  'nav.components': 'Componentes',
  'nav.pageContainer': 'Contenedor de página',
  'nav.timelineWizard': 'Asistente de línea de tiempo',
  'nav.alert': 'Alerta',
  'nav.multiAlerts': 'Alertas (Múltiples)',
  'nav.callout': 'Aviso destacado',
  'nav.spinner': 'Spinner',
  'nav.toast': 'Toast',
  'nav.tooltip': 'Tooltip',
  'nav.themeToggle': 'Cambiar tema',
  'nav.fileReader': 'Lector de archivos',
  'nav.keyValueInputs': 'Entradas clave-valor',
  'nav.statusIndicator': 'Indicador de estado',
  'nav.idleDetection': 'Detección de inactividad',
  'nav.certificate': 'Visor de certificados',
  'nav.datagrid': 'Tabla de datos',
  'nav.byteConverter': 'Conversor de bytes',
  'nav.mask': 'Máscara',
  'nav.arrayJoin': 'Unión de arrays',
  'nav.range': 'Rango',
  'nav.isHttps': 'Es Https',
  'nav.differenceInDays': 'Diferencia de días',
  'nav.badgeNew': 'NUEVO',
  'nav.badgeUpdated': 'ACTUALIZADO',
  'nav.badgePopular': 'POPULAR',
  'nav.badgeCore': 'NÚCLEO',

  'common.examples': 'Ejemplos',
  'common.apiReference': 'Referencia de la API',
  'common.overview': 'Descripción general',
  'common.parameters': 'Parámetros',
  'common.returns': 'Retorna',
  'common.signature': 'Firma',
  'common.description': 'Descripción',
  'common.basicUsage': 'Uso básico',
  'common.inputs': 'Entradas (Inputs)',
  'common.outputs': 'Salidas (Outputs)',
  'common.type': 'Tipo',
  'common.default': 'Por defecto',
  'common.contentProjection': 'Proyección de contenido',
  'common.methods': 'Métodos',
  'common.selector': 'Selector',
  'common.behaviors': 'Comportamientos',
  'common.behavior': 'Comportamiento',
  'common.features': 'Características',
  'common.properties': 'Propiedades',
  'common.validationErrors': 'Errores de validación',
  'common.usageNotes': 'Notas de uso',
  'common.liveDemo': 'Demostración en vivo',
  'common.required': 'Requerido',
  'common.refresh': 'Actualizar',
  'common.firstName': 'Nombre',
  'common.lastName': 'Apellido',
  'common.email': 'Correo electrónico',
  'common.gender': 'Género',
  'common.male': 'Masculino',
  'common.female': 'Femenino',
  'common.name': 'Nombre',
  'common.noDataFound': 'No se encontraron datos',
  'common.noItems': 'Sin elementos',
  'common.paginationOf': '{0} - {1} de {2} elementos',
  'common.seeUiBehavior': 'Haga clic para ver el comportamiento de la interfaz',
  'common.save': 'Guardar',
  'common.submit': 'Enviar',
  'common.example': 'Ejemplo',
  'common.example1': 'Ejemplo 1: Uso básico',
  'common.example2': 'Ejemplo 2: Con operador de pipe RxJS',
  'common.example3': 'Ejemplo 3: Manejo de código asíncrono',
  'common.example4': 'Ejemplo 4: Inyector desacoplado',

  'playground.beginner': 'Principiante',
  'playground.intermediate': 'Intermedio',
  'playground.advanced': 'Avanzado',
  'playground.copy': 'Copiar',
  'playground.copied': 'Copiado',
  'playground.copyFailed': 'Error al copiar. Seleccione y copie el código manualmente.',
  'playground.viewCode': 'Ver código',
  'playground.hideCode': 'Ocultar código',
  'playground.stackedLayout': 'Diseño apilado',
  'playground.splitLayout': 'Diseño en paralelo',

  'inspector.liveState': 'Estado reactivo en vivo',
  'inspector.rawJson': 'JSON del estado sin procesar',
  'inspector.hideJson': 'Ocultar JSON',

  'form.masterPassword': 'Contraseña maestra',
  'form.masterPasswordRequired': 'La contraseña maestra es obligatoria.',
  'grid.refresh': 'Actualizar',
  'grid.firstName': 'Nombre',
  'grid.lastName': 'Apellido',
  'grid.email': 'Correo electrónico',

  'mergeFrom.overview':
    'La función <code>mergeFrom</code> fusiona los valores de Observables o Signals y emite el valor más reciente. También permite modificar el valor emitido usando operadores RxJS antes de su emisión. Aunque es similar a <code>merge()</code>, también tiene en cuenta Signals.',
  'mergeFrom.example1Desc': 'Fusionar múltiples señales u observables:',
  'mergeFrom.example2Desc': 'Pase un operador pipe de RxJS para manipular los valores emitidos:',
  'mergeFrom.example3Desc':
    'Use la opción <code>startWith</code> o <code>initialValue</code> para manejar observables asíncronos:',
  'mergeFrom.example4Desc':
    'Pase un <code>Injector</code> personalizado mediante el objeto de opciones para crear una señal fusionada fuera de un contexto de inyección:',
  'mergeFrom.apiSummary': 'Combina múltiples Observables o Signals en una sola Signal reactiva.',

  // k8sRetryBackoff Operator (es)
  'k8sRetryBackoff.configSummary': 'Configuración opcional compartida por el operador y la factoría del interceptor.',
  'k8sRetryBackoff.paramMaxAttempts':
    'Total de intentos incluyendo la petición inicial. Establezca en 1 para deshabilitar reintentos.',
  'k8sRetryBackoff.errorShape':
    'Acepta HttpErrorResponse o un objeto con forma <code>{ status, headers?, error? }</code>, incluyendo una cadena JSON en <code>error</code>. fetch nativo no rechaza en HTTP 429: verifique la Response y adapte su estado, cabeceras y cuerpo analizado. Axios expone estos en <code>error.response</code>; adáptelos antes de invocar la función. El helper solo calcula el retardo.',
  'k8sRetryBackoffInterceptor.overrideRules':
    '<code>null</code> utiliza los valores predeterminados del interceptor; <code>false</code> deshabilita los reintentos. La factoría combina la configuración por petición con sus valores predeterminados. Este interceptor maneja cada HttpClient 429 independientemente de la URL o método HTTP; opte por no participar en peticiones que deban fallar inmediatamente.',
  'k8sRetryBackoffInterceptor.overrideSimulation':
    'Pruebe una sonda que falla en su primer 429, o una lectura de carga que recibe dos 429 antes de tener éxito. La lectura personalizada usa maxAttempts: 10 y un retardo de respaldo de 200ms; esto permite como máximo nueve reintentos.',
  'k8sRetryBackoffInterceptor.btnWorkloads': 'Probar lectura de carga (10 intentos)',
  'k8sRetryBackoffInterceptor.btnProbe': 'Probar sonda rápida (Exclusión)',

  'k8sRetryBackoff.overview':
    '<code>retryOnK8sBackoff</code> es un operador de reintento de RxJS diseñado específicamente para los <strong>límites de tasa de la API de Kubernetes (HTTP 429 Too Many Requests)</strong>. Da prioridad dinámica a la cabecera HTTP <code>Retry-After</code> o al campo <code>details.retryAfterSeconds</code> devuelto por los servidores API de Kubernetes, recurriendo a un retardo configurable si no se proporciona ninguno.',
  'k8sRetryBackoff.callout':
    '¿Busca reintentos automáticos para todas las llamadas <code>HttpClient</code>? Consulte <a href="/ngx-lift/interceptors/k8sRetryBackoff"><code>k8sRetryBackoffInterceptor</code></a> para un interceptor funcional global.',
  'k8sRetryBackoff.diffTitle': 'Comparación arquitectónica: Operador vs. Interceptor',
  'k8sRetryBackoff.diffDesc':
    'Ambas herramientas comparten el mismo motor de resolución de retardos de reintento, pero cumplen funciones complementarias:',
  'k8sRetryBackoff.diffColFeature': 'Característica',
  'k8sRetryBackoff.diffColOperator': 'retryOnK8sBackoff (Operador)',
  'k8sRetryBackoff.diffColInterceptor': 'k8sRetryBackoffInterceptor (Interceptor)',
  'k8sRetryBackoff.diffScope': 'Alcance',
  'k8sRetryBackoff.diffScopeOp':
    'Local: Se aplica selectivamente a Observables específicos mediante <code>.pipe(retryOnK8sBackoff(...))</code>.',
  'k8sRetryBackoff.diffScopeInt':
    'Global: Intercepta automáticamente todas las peticiones HTTP salientes de la aplicación.',
  'k8sRetryBackoff.diffUseCases': 'Casos de uso objetivo',
  'k8sRetryBackoff.diffUseCasesOp':
    'Flujos de sondeo, trabajadores en segundo plano u observables que no son de HttpClient.',
  'k8sRetryBackoff.diffUseCasesInt':
    'Protección base en todas las llamadas REST/Kubernetes sin tocar servicios individuales.',
  'k8sRetryBackoff.diffConfig': 'Configuración y exclusión',
  'k8sRetryBackoff.diffConfigOp': 'Configurado por flujo a través del argumento del operador.',
  'k8sRetryBackoff.diffConfigInt':
    'Configurado globalmente en <code>app.config.ts</code>; anulado o desactivado por petición mediante <code>HttpContext</code>.',
  'k8sRetryBackoff.example1Title': 'Ejemplo 1: Simulador interactivo y uso en tubería',
  'k8sRetryBackoff.example1Desc':
    'Simule varias respuestas de la API de Kubernetes y observe cómo retryOnK8sBackoff resuelve los retardos o propaga los errores:',
  'k8sRetryBackoff.selectScenario': 'Seleccionar escenario de respuesta:',
  'k8sRetryBackoff.scenarioHeader': '429 (Cabecera Retry-After: 1)',
  'k8sRetryBackoff.scenarioBody': '429 (Cuerpo JSON details.retryAfterSeconds: 1.5)',
  'k8sRetryBackoff.scenarioFallback': '429 (Sin cabecera, retardo de respaldo de 1 s)',
  'k8sRetryBackoff.scenarioNon429': '500 Internal Server Error (No reintentable, falla inmediatamente)',
  'k8sRetryBackoff.scenarioExhausted': '5x 429 consecutivos (Agota los intentos máximos)',
  'k8sRetryBackoff.btnSimulate': 'Simular petición y reintentar',
  'k8sRetryBackoff.btnClearLogs': 'Limpiar registros',
  'k8sRetryBackoff.logTitle': 'Registros de ejecución:',
  'k8sRetryBackoff.example2Title': 'Ejemplo 2: Función auxiliar independiente (getK8sRetryDelayMs)',
  'k8sRetryBackoff.example2Desc':
    'Utilice getK8sRetryDelayMs para extraer los retardos de retroceso en bucles de reintento personalizados o promesas:',
  'k8sRetryBackoff.sampleErrorLabel': 'Respuesta de error de muestra:',
  'k8sRetryBackoff.helperHeader': '429 (Retry-After: 3s)',
  'k8sRetryBackoff.helperBody': '429 (retryAfterSeconds: 2s)',
  'k8sRetryBackoff.helperFallback': '429 (Sin indicación, respaldo de 1s)',
  'k8sRetryBackoff.helperNon429': '500 (Error no 429)',
  'k8sRetryBackoff.btnExtractDelay': 'Extraer retardo (getK8sRetryDelayMs)',
  'k8sRetryBackoff.retryableError': 'Retroceso 429 reintentable de Kubernetes',
  'k8sRetryBackoff.nonRetryableError': 'Error no reintentable',
  'k8sRetryBackoff.apiSummary': 'Reintenta un Observable en HTTP 429 utilizando indicaciones de espera de Kubernetes.',
  'k8sRetryBackoff.paramConfig': 'Configuración opcional de intentos máximos y retardo de respaldo.',
  'k8sRetryBackoff.delaySummary':
    'Extrae el retardo de espera en milisegundos de un objeto de error, o devuelve null si no es reintentable.',
  'k8sRetryBackoff.paramError': 'El error a inspeccionar (HttpErrorResponse u objeto con status/headers/error).',
  'k8sRetryBackoff.paramFallbackDelay': 'Retardo de respaldo en milisegundos si la respuesta no incluye indicación.',

  // k8sRetryBackoffInterceptor (es)
  'k8sRetryBackoffInterceptor.overview':
    '<code>k8sRetryBackoffInterceptor</code> es un interceptor HTTP funcional de Angular (<code>HttpInterceptorFn</code>). Proporciona protección global contra <strong>HTTP 429 (Too Many Requests)</strong> analizando automáticamente las cabeceras <code>Retry-After</code> y el campo <code>details.retryAfterSeconds</code>.',
  'k8sRetryBackoffInterceptor.callout':
    '¿Busca reintentos a nivel de flujo individual o sondeo periódico? Consulte <a href="/ngx-lift/operators/k8sRetryBackoff"><code>retryOnK8sBackoff</code></a>.',
  'k8sRetryBackoffInterceptor.example1Title': 'Ejemplo 1: Registro global de interceptor y simulador interactivo',
  'k8sRetryBackoffInterceptor.example1Desc':
    'Registre el interceptor globalmente en app.config.ts. Todas las peticiones estándar de HttpClient se reintentan automáticamente en HTTP 429:',
  'k8sRetryBackoffInterceptor.selectMode': 'Modo de contexto del interceptor:',
  'k8sRetryBackoffInterceptor.modeDefault':
    'Interceptor global predeterminado (Reintenta 429 con retardo de 1 s, luego 200 OK)',
  'k8sRetryBackoffInterceptor.modeCustom': 'HttpContext personalizado (Retardo de respaldo de 400 ms)',
  'k8sRetryBackoffInterceptor.modeDisabled':
    'Desactivado mediante HttpContext (HttpContextToken = false, falla inmediatamente)',
  'k8sRetryBackoffInterceptor.btnSend': 'Enviar petición interceptada',
  'k8sRetryBackoffInterceptor.example2Title': 'Ejemplo 2: Personalización por petición y exclusión con HttpContext',
  'k8sRetryBackoffInterceptor.example2Desc':
    'Utilice K8S_RETRY_BACKOFF_CONFIG en HttpContext para configurar límites personalizados o desactivar reintentos en comprobaciones rápidas:',
  'k8sRetryBackoffInterceptor.apiSummary':
    'Interceptor HTTP funcional que reintenta respuestas HTTP 429 con retroceso de Kubernetes.',
  'k8sRetryBackoffInterceptor.factorySummary':
    'Crea un interceptor funcional configurado con ajustes de retroceso predeterminados personalizados.',
  'k8sRetryBackoffInterceptor.tokenSummary':
    'HttpContextToken para configurar o desactivar el retroceso de reintento para una petición individual.',
  'k8sRetryBackoffInterceptor.paramDefaultConfig':
    'Configuración predeterminada aplicada a todas las peticiones a menos que se anule mediante HttpContext.',
  'header.partialLanguage': 'Traducción parcial; los textos faltantes se muestran en inglés.',
};
