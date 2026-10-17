export const esTranslations: Record<string, string> = {
  'toSignalForm.savedProfile': 'Perfil guardado',
  'queryResource.projectRevision': 'Versión de respuesta',
  'queryResource.activeUser': 'Usuario actual',
  'queryResource.engineLabel': 'Motor',
  'queryResource.computeLabel': 'Recursos',
  'queryOwnership.title': 'Claves y etiquetas por dominio',
  'queryOwnership.definitions':
    'Mantén los observadores en los componentes. Importa definiciones completas y fábricas de etiquetas del dominio responsable; incluye el ámbito y todos los parámetros que cambian la respuesta en las claves.',
  'queryOwnership.refactoring':
    'Use exportaciones compartidas en lugar de repetir cadenas. Antes de cambiar o eliminar una definición, busque todas las referencias, coordine con el dominio responsable y verifique las lecturas y escrituras afectadas.',
  'queryOwnership.noCache':
    'Las claves también identifican solicitudes y estado compartidos. staleTime: 0 marca los datos como obsoletos; gcTime: 0 elimina entradas sin uso cuando terminan las solicitudes. Usa resourceAsync para estado independiente sin clave. Las mutaciones no necesitan clave.',
  'queryOwnership.naming':
    'invalidateTags acepta una matriz o una función (result, args) ejecutada solo tras el éxito. Devuelva [] para omitir la invalidación.',
  'queryOwnership.journey':
    'Añade miembros: la tabla y el resumen comparten una solicitud por actualización. Cierra el resumen, añade otro miembro y ábrelo. Los datos y las solicitudes del equipo B no cambian.',
  'queryOwnership.closeSummary': 'Cerrar resumen',
  'queryOwnership.openSummary': 'Abrir resumen',
  'queryOwnership.summary': 'Resumen del equipo A',
  'queryOwnership.teamAReads': 'Solicitudes del equipo A',
  'queryOwnership.otherScope': 'Miembros del equipo B (otro ámbito)',
  'queryOwnership.teamBReads': 'Solicitudes del equipo B',
  'header.selectLanguage': 'Seleccionar idioma',
  'header.openGitHub': 'Abrir en GitHub',
  'header.codeLicensed': 'Código bajo licencia',
  'nav.signalUtils': 'Utilidades de Signal',
  'nav.queryMutation': 'Consultas y mutaciones',
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
  'nav.differenceInDays': 'differenceInDays',
  'nav.badgeNew': 'NEW',
  'nav.badgeUpdated': 'UPDATED',
  'nav.badgePopular': 'POPULAR',
  'nav.badgeCore': 'CORE',
  'home.ngxLift.title': 'ngx-lift',
  'home.ngxLift.subtitle': 'Mejorar su flujo de trabajo <code>modern</code> Angular',
  'home.ngxLift.supportMatrix': 'Matriz de soporte de versión',
  'home.ngxLift.thVersion': 'Versión ngx-lift',
  'home.ngxLift.thNgVersion': 'Versión Angular',
  'home.ngxLift.utilityTitle': 'Funciones de utilidad',
  'home.ngxLift.utilityDesc':
    'Funciones generales de utilidad diseñadas para acelerar las tareas comunes de desarrollo',
  'home.ngxLift.rxjsTitle': 'Operadores RxJS',
  'home.ngxLift.rxjsDesc':
    'Operadores especializados que simplifican operaciones reactivas complejas y mejoran la capacidad de mantenimiento de códigos',
  'home.ngxLift.signalTitle': 'Signal Utilities',
  'home.ngxLift.signalDesc': 'Posibles utilidades a base de señales que complementan Angular‡ s Signals API',
  'home.clrLift.title': 'clr-lift',
  'home.clrLift.subtitle':
    'Ampliar el sistema de diseño Clarity con componentes reutilizables, servicios públicos y operadores',
  'home.clrLift.supportMatrix': 'Matriz de soporte de versión',
  'home.clrLift.thVersion': 'Versión clr-lift',
  'home.clrLift.thNgVersion': 'Versión Angular',
  'home.clrLift.utilitiesTitle': 'Servicios públicos',
  'home.clrLift.utilitiesDesc':
    'Utilidades especializadas diseñadas para componentes Clarity que simplifiquen tareas y operaciones comunes, proporcionando una experiencia de desarrollo sin problemas',
  'home.clrLift.rxjsTitle': 'Operadores RxJS',
  'home.clrLift.rxjsDesc':
    'Los operadores RxJS mejorados que amplían la funcionalidad Clarity. El operador <code>dgState</code> remueve la gestión del estado de datagrid, proporcionando un enfoque intuitivo y eficiente para trabajar con los dádridos Clarity.',
  'home.clrLift.componentsTitle': 'Componentes',
  'home.clrLift.componentsDesc':
    'Componentes preparados para la producción construidos en Clarity Design System, incluyendo notificaciones de tostadas, alertas, llamadas, contenedor de página, cambio de temas, y más',
  'home.clrLift.tipPeer':
    'En algunos casos, una instalación <strong>force </strong> puede ser necesaria si el # 64; las dependencias de pares de clr / angular especifican una versión diferente de Angular que su proyecto.',
  'home.clrLift.tipSkipLib':
    'Si no está utilizando la última versión de Angular, considere configurar <code>skipLibCheck: true</code> en tsconfig.json para evitar errores potenciales de construcción.',
  'home.clrLift.tipIcon':
    'Asegúrese de que los iconos Clarity se importan adecuadamente utilizando <code>ClarityIcons.addIcons(...)</code>.',
  'common.examples': 'Ejemplos',
  'common.apiReference': 'Referencia de la API',
  'common.overview': 'Resumen',
  'common.parameters': 'Parámetros',
  'common.returns': 'Retorna',
  'rockStar.todayIs': 'Hoy es',
  'rockStar.whoIsStar': '¿Quién es nuestra estrella de rock hoy?',
  'rockStar.unveil': 'Desvelo',
  'common.signature': 'Firma',
  'common.description': 'Descripción',
  'common.basicUsage': 'Uso básico',
  'common.inputs': 'Entradas (Inputs)',
  'common.outputs': 'Salidas (Outputs)',
  'common.type': 'Tipo',
  'common.default': 'Por defecto',
  'common.contentProjection': 'Proyección de contenido',
  'common.example': 'Ejemplo',
  'common.example1': 'Ejemplo 1: Uso básico',
  'common.example2': 'Ejemplo 2: Con operador de pipe RxJS',
  'common.example3': 'Ejemplo 3: Manejo de código asíncrono',
  'common.example4': 'Ejemplo 4: Inyector desacoplado',
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
  'common.seeUiBehavior': 'Haga clic para ver el comportamiento de UI',
  'filterUsers.selectGender': 'Seleccione género para cargar a los usuarios',
  'fileReader.file': 'Archivo',
  'fileReader.readSuccess': 'El contenido de archivo ha sido leído con éxito',
  'fileReader.submitAndLog': 'Enviar y ver el registro de la consola',
  'fileReader.caBundle': 'CA Bundle',
  'fileReader.showCertificate': 'Mostrar certificado:',
  'fileReader.exceedLimit': 'Expira el tamaño máximo de archivo ({0} MB).',
  'multiAlerts.addStandard': 'Añadir Alerta estándar',
  'multiAlerts.addInlineBtn': 'Añadir Alerta con Button en línea',
  'multiAlerts.addAction': 'Añadir alerta con acción',
  'multiAlerts.clearAll': 'Despejen todas las alertas',
  'toast.successBtn': 'Tostada de éxito',
  'toast.infoBtn': 'Info Toast',
  'toast.errorBtn': 'Tostada de error',
  'toast.warningBtn': 'Alerta tostada',
  'idleDetection.startSimulation': 'Inicio Simulación rápida (3 s Idle)',
  'idleDetection.stopSimulation': 'Detener la simulación',
  'idleDetection.simActive': 'Activo de simulación:',
  'idleDetection.sessionStatus': 'Situación:',
  'idleDetection.totalTimeouts': 'Total de plazos:',
  'idleDetection.yes': 'Sí.',
  'idleDetection.no': 'No.',
  'resourceAsync.userN': 'Usuario {0}',
  'resourceAsync.reload': 'Reload',
  'resourceAsync.regUsernamePlaceholder': 'Introduzca nombre de usuario (3-20 chardos)',
  'resourceAsync.regUsernameError': 'Nombre de usuario debe ser 3-20 caracteres',
  'resourceAsync.regEmailPlaceholder': 'Introduzca su correo electrónico',
  'resourceAsync.regEmailError': 'Por favor, introduzca un correo electrónico válido',
  'resourceAsync.regPasswordPlaceholder': 'Introduzca contraseña (min 8 charts)',
  'resourceAsync.regPasswordError': 'Contraseña debe ser al menos 8 caracteres',
  'resourceAsync.loadingTodo': 'Cargando un todo...',
  'resourceAsync.loadTodo': 'Carga Todo',
  'resourceAsync.saving': 'Salvando...',
  'resourceAsync.resetFromServer': 'Reiniciar desde el servidor',
  'resourceAsync.loadUserCacheFirst': 'Usuario de carga (Cache-First)',
  'resourceAsync.fromCache': 'De Cache',
  'resourceAsync.updating': 'Actualizar...',
  'resourceAsync.loadCounter': 'Contador de carga',
  'resourceAsync.unsavedChanges': 'Cambios no guardados - El contador ha sido modificado localmente',
  'resourceAsync.saveToServer': 'Guardar al servidor',
  'resourceAsync.discardChanges': 'Cambios de desechar',
  'playground.beginner': 'Principiante',
  'playground.intermediate': 'Intermedio',
  'playground.advanced': 'Avanzado',
  'playground.copy': 'Copiar',
  'playground.copied': 'Copiado',
  'playground.viewCode': 'Ver código',
  'playground.hideCode': 'Ocultar código',
  'playground.stackedLayout': 'Diseño apilado',
  'playground.splitLayout': 'Diseño en paralelo',
  'inspector.liveState': 'Estado Signal en vivo',
  'inspector.rawJson': 'JSON del estado sin procesar',
  'inspector.hideJson': 'Ocultar JSON',
  'mergeFrom.overview':
    'La función <code>mergeFrom</code> fusiona los valores de Observables o Signals y emite el último valor. También permite modificar el valor emitido utilizando operadores de RxJS antes de su emisión. Aunque es similar a <code>merge()</code>, también considera Signals. <code>mergeFrom</code> es similar a <code>combineFrom</code>, pero en lugar de emitir un valor combinado, emite el último valor emitido utilizando el operador merge en lugar de combineLatest.',
  'mergeFrom.example1Desc': 'Fusionar múltiples señales u observables:',
  'mergeFrom.example2Desc': 'Pase un operador pipe de RxJS para manipular los valores emitidos:',
  'mergeFrom.example3Desc':
    'Use la opción <code>startWith</code> o <code>initialValue</code> para manejar observables asíncronos:',
  'mergeFrom.example4Desc':
    'Pase un <code>Injector</code> personalizado mediante el objeto de opciones para crear una señal fusionada fuera de un contexto de inyección:',
  'mergeFrom.apiSummary':
    'Une varios Observables o Signals en un único Signal que emite el último valor de cualquier fuente, similar a <code>merge</code> pero con soporte para Signals.',
  'mergeFrom.paramSources':
    'Un objeto o matriz de Observables o Signals para fusionarse. Cuando un objeto es proporcionado, el resultado será un objeto con las mismas llaves.',
  'mergeFrom.paramOperator':
    'Un operador de tuberías RxJS para manipular los valores emitidos antes de que sean emitidos.',
  'mergeFrom.paramOptions': 'Opciones de configuración incluyendo initialValue e inyector.',
  'mergeFrom.returnsDesc': 'Una Signal que emite el valor combinado / fusionado como fuentes emite.',
  'toSignalForm.pageTitle': 'Forma reactiva Signals (toSignalForm)',
  'toSignalForm.bannerTitle': 'Desglose Angular Formas reactivas Signals',
  'toSignalForm.bannerDesc':
    '<code>toSignalForm</code> envuelve instancias estándar de <code>FormGroup</code> de Angular con señales reactivas, enlaces declarativos (<code>bindIf</code>, <code>bindDisabled</code>), validación cruzada entre controles, y valores de envío limpios (<code>submitValue</code>)—manteniendo 100% de compatibilidad con contenedores de formularios Clarity y validadores de Angular.',
  'toSignalForm.quickTitle': 'Nivel 1: Forma de inicio rápido Signals',
  'toSignalForm.quickBadge': '30-Second Hello World',
  'toSignalForm.quickDesc':
    'Aprender los fundamentos: envolver un FormGroup con toSignalForm, leer valores reactivamente a través de señales, y desactivar acciones con sf.invalid().',
  'toSignalForm.username': 'Nombre de usuario',
  'toSignalForm.usernamePlaceholder': 'Al menos 3 caracteres',
  'toSignalForm.usernameRequired': 'Se requiere nombre de usuario.',
  'toSignalForm.usernameMinLength': 'Debe ser al menos 3 caracteres.',
  'toSignalForm.email': 'Dirección de correo electrónico',
  'toSignalForm.emailPlaceholder': 'name @ domain.com',
  'toSignalForm.emailRequired': 'Se requiere un correo electrónico.',
  'toSignalForm.emailInvalid': 'Por favor, introduzca una dirección de correo electrónico válida.',
  'toSignalForm.receiveUpdates': 'Recibir actualizaciones de correo electrónico',
  'toSignalForm.saveProfile': 'Guardar perfil',
  'toSignalForm.reset': 'Reiniciar',
  'toSignalForm.quickFormState': 'Forma rápida Signal Estado',
  'toSignalForm.quickFormStateDesc':
    'Signals se actualiza de forma sincronizada a medida que se escribe en el formulario anterior',
  'toSignalForm.enterpriseTitle': 'Nivel 2: Showcase Enterprise - Proyección de bases de datos de nube',
  'toSignalForm.enterpriseBadge': 'Real- World Spec',
  'toSignalForm.enterpriseDesc':
    'Presencia compleja de multicontrol, ensayo de aparatos asíncrónicos a través de resourceAsync, actualizaciones de versión cascada, y bloqueos de autoescala condicional.',
  'toSignalForm.enterpriseState': 'Formulario de empresa en vivo Signals',
  'toSignalForm.enterpriseStateDesc':
    'Tracks forma validación, bloqueo de autoescala, y estado de suministro de respaldo en tiempo real',
  'toSignalForm.region': 'Región de despliegue / aplicación',
  'toSignalForm.regionSelect': 'Seleccionar región objetivo...',
  'toSignalForm.regionUSWest': 'US West (Cloud v2 - Multi-Zone HA Supported)',
  'toSignalForm.regionApEast': 'Asia Pacific (Regional Cloud - Multizona HA para PG-MySQL)',
  'toSignalForm.regionEuCentral': 'Europa Central (Región de Legado - Solo zona de Single-)',
  'toSignalForm.regionRequired': 'Se necesita una región de despliegue.',
  'toSignalForm.regionHelper':
    'Controla de forma simultánea las capacidades de los aparatos regionales a través de <code>computedAsync</code>.',
  'toSignalForm.multiZoneSupported': 'Auxiliar Multizona HA',
  'toSignalForm.singleZoneOnly': 'Single-Zone Only (HA Gated)',
  'toSignalForm.engine': 'Motor de base de datos',
  'toSignalForm.enginePostgres': 'PostgreSQL',
  'toSignalForm.engineMysql': 'MySQL',
  'toSignalForm.engineSqlServer': 'Servidor SQL',
  'toSignalForm.engineRequired': 'Se requiere un motor de base de datos.',
  'toSignalForm.engineHelper':
    'Las opciones que figuran a continuación se derivan reactivamente de <code>sf.fields.engine.value</code>.',
  'toSignalForm.haTopology': 'Topología Multizona HA',
  'toSignalForm.haCrossAz': 'Zona de disponibilidad',
  'toSignalForm.haDedicated': 'Servidores dedicados antiafinidad',
  'toSignalForm.haRequired': 'Se requiere topología HA.',
  'toSignalForm.haHelper': 'Montado dinámicamente por <code>sf.bindIf(isMultiZoneSupported, ...)</code>.',
  'toSignalForm.replicaCount': 'Replica Node Count',
  'toSignalForm.replicaRequired': 'Se requiere conteo de réplica.',
  'toSignalForm.replicaMin': 'Mínimo 2 réplicas para HA Multizona.',
  'toSignalForm.replicaMax': 'Máxima 5 réplicas permitidas.',
  'toSignalForm.replicaHelper': 'Los valores se conservan a través de la región.',
  'toSignalForm.version': 'Versión del motor',
  'toSignalForm.versionSelect': 'Seleccionar versión',
  'toSignalForm.versionRequired': 'Se requiere la versión del motor.',
  'toSignalForm.versionHelper': 'Se reinicia automáticamente a primera versión disponible cuando el motor cambia.',
  'toSignalForm.clusterName': 'Nombre del grupo',
  'toSignalForm.clusterNamePlaceholder': 'Por ejemplo, billing-db-primary',
  'toSignalForm.clusterNameRequired': 'Se requiere un nombre de grupo.',
  'toSignalForm.clusterNameMinLength': 'Debe de ser al menos 4 caracteres.',
  'toSignalForm.clusterNameHelper':
    'Determinados 400ms se verificó asíncrónicamente contra nombres reservados (prod-db, test-cluster, etc.).',
  'toSignalForm.clusterNameChecking': 'Comprobando la disponibilidad de nombres... (desestimado 400ms)',
  'toSignalForm.autoScaling': 'Autoescala de almacenamiento',
  'toSignalForm.autoScalingHelper':
    'Cuando está habilitado, la entrada de almacenamiento manual está automáticamente desactivada y reactiva a 250 GB.',
  'toSignalForm.storageGb': 'Almacenamiento ubicado (GB)',
  'toSignalForm.storageGbRequired': 'Se requiere tamaño de almacenamiento.',
  'toSignalForm.storageGbMin': 'La asignación mínima es de 20 GB.',
  'toSignalForm.storageGbHelper':
    "Libra a través de <code>sf.bindDisabled('storageGb', () =&gt; autoScaling(), &#123; resetOnDisable: true, resetValue: 250 &#125;)</code>.",
  'toSignalForm.storageLocked': '♦ Autoescala Managed (Disabled, bloqueado a 250 GB)',
  'toSignalForm.storageManual': 'Se permite la asignación manual',
  'toSignalForm.authMode': 'Modo de autenticación',
  'toSignalForm.authSql': 'Base de datos de usuario nativo',
  'toSignalForm.authWindows': 'Enterprise Directory / Windows Auth',
  'toSignalForm.authModeRequired': 'Se requiere un modo de autenticación.',
  'toSignalForm.authModeHelper':
    'Seleccionar la base de datos Native User monta la contraseña de confirmación con retención de memoria.',
  'toSignalForm.password': 'Contraseña principal',
  'toSignalForm.passwordPlaceholder': 'Min 8 caracteres',
  'toSignalForm.passwordRequired': 'Se requiere contraseña principal.',
  'toSignalForm.passwordMinLength': 'Debe ser al menos 8 caracteres.',
  'toSignalForm.confirmPassword': 'Confirmar contraseña',
  'toSignalForm.confirmPasswordPlaceholder': 'Repita la contraseña principal',
  'toSignalForm.confirmPasswordRequired': 'Se requiere confirmación de contraseña.',
  'toSignalForm.passwordMismatch': 'Las contraseñas no coinciden.',
  'toSignalForm.confirmPasswordHelper':
    'Revalidado automáticamente cuando la contraseña principal cambia a través de <code>sf.revalidate</code>.',
  'toSignalForm.tlsCert': 'Certificado TLS / SSL',
  'toSignalForm.certManaged': 'Plataforma AutoGenerada',
  'toSignalForm.certCustom': 'Certificado de empresa personalizado',
  'toSignalForm.certRequired': 'Se requiere un tipo de certificado.',
  'toSignalForm.certHelper':
    'Modo personalizado monta dinámicamente la entrada del certificado y retiene el texto escrito a través de las garras.',
  'toSignalForm.tlsChain': 'Cadena de certificados PEM',
  'toSignalForm.tlsChainPlaceholder': 'BEGIN CERTIFICATE-----... END CERTIFICATE-----',
  'toSignalForm.tlsChainRequired': 'Se requiere la cadena de certificados.',
  'toSignalForm.tlsChainMinLength': 'El certificado debe ser de al menos 20 caracteres.',
  'toSignalForm.tlsChainHelper': 'Escribe un texto, cambia a Autogenerated, y cambia: ¡se conserva el texto!',
  'toSignalForm.createCluster': 'Crear un grupo',
  'toSignalForm.resetForm': 'Formulario de reinicio',
  'toSignalForm.submitting': 'Submitting cluster supplioning request to control plane... (simulación de los 90)',
  'toSignalForm.successTitle': 'Solicitud de proyección en racimo aplicada (ID: {0})',
  'toSignalForm.simulatedResponse': 'Respuesta de respaldo simulada recibida en 1.0 segundos:',
  'toSignalForm.diagnosticsTitle': 'Diagnóstico Signal en tiempo real',
  'toSignalForm.clusterNameState': 'Estado de nombre de grupo (sf.fields.clusterName)',
  'toSignalForm.value': 'Valor:',
  'toSignalForm.debounced': 'Deliberaciones (400ms):',
  'toSignalForm.valid': 'Válido:',
  'toSignalForm.touched': 'Touched:',
  'toSignalForm.errors': 'Errores:',
  'toSignalForm.sqlCredState': 'SQL Credenciales Estado',
  'toSignalForm.authModeLabel': 'Modo de altura:',
  'toSignalForm.controlsAttached': 'Controles adjuntados:',
  'toSignalForm.passwordValid': 'Válido de contraseña:',
  'toSignalForm.passwordErrors': 'Errores de contraseña:',
  'toSignalForm.confirmValid': 'Confirma Valid:',
  'toSignalForm.confirmErrors': 'Confirmar errores:',
  'toSignalForm.sanitizedPayload': 'Carga de pago de la presentación Sanitized (sf.submitValue)',
  'toSignalForm.sanitizedDesc':
    'Autoomites UI-sólo <code>confirmPassword</code> y omites <code>password</code> separados en Windows auth.',
  'toSignalForm.patternsTitle': 'Patrones arquitectónicos especializados',
  'toSignalForm.pattern1Title': 'Patrón 1: Árboles de campo dependientes / condicionados (bindIf)',
  'toSignalForm.pattern1Desc':
    'Crea o destruye un grupo de controles relacionados (como credenciales de base de datos) juntos basándose en una condición reactiva. Los controles desacoplados se excluyen automáticamente de la validación y los payloads del backend, y su entrada se preserva durante los cambios cuando <code>preserveValue: true</code> está configurado.',
  'toSignalForm.pattern2Title': 'Patrón 2: Deshabilitador reactivo AutoReset (bindDisabled)',
  'toSignalForm.pattern2Desc':
    'Vincula directamente el estado habilitado/deshabilitado de un control a una señal booleana o a una función de obtención reactiva (<code>() =&gt; boolean</code>). Soporta claves de control de tipo fuerte, controles mejorados directamente de <code>sf.controls.&lt;name&gt;</code>, y instancias de <code>AbstractControl</code>. Predeterminado es <code>emitEvent: true</code> para garantizar que los señales de estado reactivas se actualicen de forma sincrónica, y soporta opcionalmente la reinicialización al deshabilitar con una valor de tipo fuerte <code>resetValue</code>.',
  'toSignalForm.pattern3Title': 'Patrón 3: Submisiones Sanitized (sf.submitValue)',
  'toSignalForm.pattern3Desc':
    'Resuelve la tensión entre <code>form.value</code> (que descarta controles deshabilitados) y <code>form.getRawValue()</code> (que incluye campos de UI como <code>confirmPassword</code>). <code>sf.submitValue()</code> proporciona una señal reactiva continua que siempre está limpiada y lista para el envío o <code>resourceAsync</code>.',
  'toSignalForm.pattern4Title': 'Patrón 4: Gato de la característica acrónica (computedAsync + bindIf)',
  'toSignalForm.pattern4Desc':
    'En aplicaciones en la nube y empresariales, los campos de formulario disponibles a menudo dependen de capacidades regionales o banderas de características resueltas asincrónicamente desde puntos finales de API. <code>computedAsync</code> deriva una señal reactiva <code>Signal&lt;boolean&gt;</code> desde la región seleccionada y el motor, que se pasa directamente a <code>sf.bindIf</code> para montar o desmontar controles de capacidad en tiempo real.',
  'toSignalForm.pattern5Title': 'Patrón 5: Actualizaciones de cascada',
  'toSignalForm.pattern5Desc':
    'Cuando un cambio en un control de formulario desencadena actualizaciones en otro control (por ejemplo, reiniciar versiones disponibles cuando cambia el motor de base de datos), puedes usar el patrón tradicional de RxJS <code>valueChanges.pipe(takeUntilDestroyed())</code> o la utilidad de tipo señal primero <code>sf.controls.&lt;name&gt;.watch()</code> / <code>sf.watch()</code>. <code>watch</code> opera dentro de una <code>effect()</code> de Angular con aislamiento automático <code>untracked</code>, evitando errores de señal de escritura <code>NG0600</code> mientras elimina la desinstalación manual de suscripciones.',
  'toSignalForm.apiReferenceTitle': 'Referencia API',
  'toSignalForm.apiToSignalFormTitle': 'toSignalForm(form, options?)',
  'toSignalForm.apiBindIfTitle': 'sf.bindIf(control, condition, options?) / bindControlIf',
  'toSignalForm.apiBindDisabledTitle': 'sf.bindDisabled(control, condition, options?) / bindControlDisabled',
  'toSignalForm.apiRevalidateTitle': 'sf.revalidate(target, sources, options?) / revalidateOnChange',
  'toSignalForm.apiPropForm': 'La instancia Angular FormGroup para envolver con señales reactivas y reactivos.',
  'toSignalForm.apiPropOmit': 'Control de nombres a omitir de las cargas de pago submitValue.',
  'toSignalForm.apiPropEmitEvent': 'Si el estado / valor cambia emite eventos de control Angular.',
  'toSignalForm.apiPropValue': 'Señal reactiva del valor actual de la forma.',
  'toSignalForm.apiPropStatus':
    'Señal reactiva del estado general de la forma (VALID¡Vamos!INVALID¡Vamos!PENDING¡Vamos!DISABLED).',
  'toSignalForm.apiPropValid': 'Señal computarizada que indica si el formulario es válido.',
  'toSignalForm.apiPropInvalid': 'Señal computarizada que indica si el formulario es inválido.',
  'toSignalForm.apiPropSubmitValue':
    'Carga útil amortizada con exclusión de los controles desactivados, omitidos o no montados.',
  'toSignalForm.apiPropIsSubmitting':
    'Soluciones de señal escritas para saber si una operación de sumisión asíntica está en vuelo.',
  'toSignalForm.apiBindIfControl': 'Nombre o instancia del control para montar / desmontar condicionalmente.',
  'toSignalForm.apiBindIfCondition': 'Señal booleana o predice si el control está montado.',
  'toSignalForm.apiBindIfPreserveValue':
    'Preservaciones valor de control en la memoria a través de ciclos de desmontaje / reinicio.',
  'toSignalForm.apiBindIfDefaultValue': 'Valor predeterminado asignado al montaje o reajuste del control.',
  'toSignalForm.apiBindIfEmitEvent':
    'Si la adición / eliminación de control emite eventos de valor y estado de FormGroup.',
  'toSignalForm.apiBindDisabledControl': 'Control objetivo cuyo estado habilitado / discapacitado está vinculado.',
  'toSignalForm.apiBindDisabledCondition':
    'La señal booleana o predicar volver verdadero a desactivar, falso para habilitar.',
  'toSignalForm.apiBindDisabledResetOnDisable':
    'Reinicia automáticamente el valor de control al entrar al estado de discapacidad.',
  'toSignalForm.apiBindDisabledResetValue':
    'Valor de reinicio específico cuando resetOnDisable está activo; incumple el control inicial / nulo.',
  'toSignalForm.apiBindDisabledEmitEvent': 'Si permiten / desactivan cambios, emiten eventos de valor / estado.',
  'toSignalForm.apiRevalidateTarget': 'Control objetivo para reevaluar la validación tras los cambios de fuente.',
  'toSignalForm.apiRevalidateSources':
    'Uno o más controles de dependencia cuyo valor / estado cambia desencadenar revalidación del objetivo.',
  'toSignalForm.apiRevalidateOnlyIfTouched':
    'Sólo desencadenar revalidación del objetivo si el usuario ha tocado el objetivo.',
  'toSignalForm.apiRevalidateOnlyIfDirty':
    'Sólo desencadenar revalidación del objetivo si se ha modificado el objetivo (sucio).',
  'computedAsync.title': 'computedAsync',
  'computedAsync.overview':
    'La función <code>computedAsync</code> es una utilidad versátil que permite la computación de valores a partir de Promesas, Observables o valores normales. Proporciona flexibilidad en el comportamiento computacional mediante estrategias de planificación seleccionables (switch, merge, concat, exhaust) y asignación inicial de valores. Para utilizar <code>computedAsync</code>, proporciona una función que devuelva una Promesa, un Observable o un valor normal. Luego devuelve una <code>Signal</code> que emite el valor computado.',
  'computedAsync.example1': 'Ejemplo 1: Trabaja con Promises',
  'computedAsync.example1Desc': 'Valores de computación de Promises:',
  'computedAsync.example2': 'Ejemplo 2: Trabaja con Observables',
  'computedAsync.example2Desc':
    'Cuando se devuelve un Observable, se suscribe automáticamente y se desuscribirá cuando el componente se destruya o cuando se reactive la computación. En el ejemplo siguiente, si el userId cambia, la computación anterior se cancelará (incluyendo cualquier llamada API en curso) y se iniciará una nueva computación.',
  'computedAsync.example3': 'Ejemplo 3: Trabaja con valores regulares',
  'computedAsync.example3Desc':
    'Esto permite la devolución de valores normales (aquellos que no consisten en Promesas o Observables) desde la función de callback. La función de callback se ejecuta en la cola de tareas micro, por lo que no emitirá el valor inmediatamente (por defecto, devuelve undefined). Para emitir el valor inmediatamente, puedes utilizar la opción <code>requireSync</code> dentro del objeto de opciones segundo argumento.',
  'computedAsync.example4': 'Ejemplo 4: Trabaja con initialValue',
  'computedAsync.example4Desc':
    'Si queremos establecer un valor inicial para el valor calculado, podemos proporcionarlo como el segundo argumento dentro del objeto de opciones.',
  'computedAsync.example5': 'Ejemplo 5: Trabaja con requireSync',
  'computedAsync.example5Desc':
    'Si poseemos un Observable que emite el valor de forma sincrónica, podemos utilizar la opción <code>requireSync</code> para asegurar la emisión inmediata del valor. Esta característica también es útil para garantizar que el tipo <code>signal</code> excluya el valor undefined por defecto (<code>Signal<T></code> en lugar de <code>Signal<T | undefined></code>).',
  'computedAsync.example6': 'Ejemplo 6: Trabajar con el operador createAsyncState',
  'computedAsync.example6Desc':
    'En el ejemplo a continuación, tenemos un <code>Signal</code> que representa el estado de una llamada API. Utilizamos <code>computedAsync</code> y <code>createAsyncState</code> operador para calcular el estado de la llamada API basado en la <code>userId</code>.',
  'computedAsync.example7': 'Ejemplo 7: Comportamientos (interruptor, fusión, concat, escape)',
  'computedAsync.example7Desc':
    'Por defecto, <code>computedAsync</code> emplea el comportamiento del interruptor. Si desea alterar este comportamiento, usted puede proporcionar la opción de comportamiento dentro del segundo objeto de opciones de argumento.',
  'computedAsync.behaviorSwitch': 'switch (predeterminado)',
  'computedAsync.behaviorSwitchDesc':
    'Al desear cancelar el cálculo previo, se utiliza el comportamiento del interruptor, que es el predeterminado. Si un nuevo cálculo es activado antes de que el anterior concluya, el primero será terminado.',
  'computedAsync.behaviorMerge': 'fusión',
  'computedAsync.behaviorMergeDesc':
    'Para conservar el cálculo anterior, se utiliza el comportamiento de fusión. Si se inicia un nuevo cálculo antes de que se termine el anterior, el primero se preserva mientras que el último se inicia.',
  'computedAsync.behaviorConcat': 'concat',
  'computedAsync.behaviorConcatDesc':
    'Si se desea preservar el cálculo previo junto con esperar su finalización antes de iniciar el nuevo, se elige el comportamiento de concat.',
  'computedAsync.behaviorExhaust': 'escape',
  'computedAsync.behaviorExhaustDesc':
    'En los casos en que no se haga referencia a la nueva computación mientras que la anterior sigue en curso es necesario, se selecciona el comportamiento de escape.',
  'computedAsync.example8': 'Ejemplo 8: Uso con valor computado previo',
  'computedAsync.example8Desc':
    'En caso de que sea necesario utilizar el valor calculado anteriormente en el cálculo posterior, se puede acceder a él dentro de la función de llamada como primer argumento.',
  'computedAsync.example9': 'Ejemplo 9: Datos de carga Inicialmente',
  'computedAsync.example9Desc': 'Los usuarios de carga inicialmente cuando el componente carga:',
  'computedAsync.refresh': 'Refresque',
  'computedAsync.learnTrigger': 'Aprende <a href="{0}"><code>createTrigger</code> here</a>.',
  'computedAsync.example10': 'Ejemplo 10: Carga de datos cuando Button clicks',
  'computedAsync.example10Desc': 'Carga a los usuarios sólo cuando un botón se haga clic:',
  'computedAsync.loadUsers': 'Los usuarios de carga',
  'computedAsync.example11': 'Ejemplo 11: Error de manejo con onError',
  'computedAsync.example11Desc':
    'Utilice el callback <code>onError</code> para manejar errores con gracia y proporcionar valores de falback. Cuando <code>onError</code> devuelve un valor, la señal emitirá ese valor en lugar de lanzar un error:',
  'computedAsync.onErrorCallout':
    'El callback <code>onError</code> devuelve un valor de respaldo de tipo T. Incluya <code>undefined</code> explícitamente en T si lo necesita. Los errores no manejados y las excepciones del callback se lanzan al leer el signal; nunca se convierten en datos correctos.',
  'computedAsync.example12': 'Ejemplo 12: Los errores se lanzan al leer de forma predeterminada',
  'computedAsync.example12Desc':
    'Los fallos no manejados se lanzan al leer el signal. Capture la lectura o use <code>onError</code> para devolver un valor de respaldo tipado.',
  'computedAsync.throwOnErrorCallout':
    '<code>throwOnError: true</code> ejecuta <code>onError</code> para efectos secundarios y sigue lanzando el error; ignora su valor de retorno. <code>throwOnError: false</code> ya no se admite.',
  'computedAsync.example13': 'Ejemplo 13: Interruptor de pestañas con cancelación de solicitud (Remover Resilience)',
  'computedAsync.example13Desc':
    'En la pestaña múltiple UIs, las pestañas de conmutación rápida pueden desencadenar solicitudes simultáneas donde las solicitudes de invuelo se abortan o fallan (por ejemplo, cancelaciones de navegación del navegador).',
  'computedAsync.tabResilienceBefore':
    '<strong>Antes de la corrección:</strong> Un error interno (como una solicitud HTTP cancelada) propagaría a través de <code>switchAll</code> y terminaría permanentemente la suscripción externa. La UI quedaba atrapada en el estado de carga por siempre y nunca podía cargar las siguientes pestañas.',
  'computedAsync.tabResilienceAfter':
    '<strong>After Fix: </strong> El error interno es capturado y manejado de forma segura, manteniendo el flujo exterior vivo. Cambiando a cualquier pestaña o retratando inmediatamente se obtiene y muestra nuevos datos!',
  'computedAsync.tabActiveDirectory': 'Directorio activo',
  'computedAsync.tabBackupLocations': 'Localización de respaldo',
  'computedAsync.tabCertificates': 'Certificados',
  'computedAsync.tabSimulateAborted': 'Simular la solicitud abortada',
  'computedAsync.tabNotice':
    'Nota: Incluso después de esta petición simulada abortada, la corriente sigue viva! Haga clic en cualquier pestaña de arriba para ver que se recupere sin problemas.',
  'computedAsync.example14': 'Ejemplo 14: Inyector desacoplado',
  'computedAsync.example14Desc':
    'Al pasar un <code>injector</code> opcional en el objeto de opciones, <code>computedAsync</code> puede ser instantiado fuera de un contexto de inyección ambiental, por ejemplo, dentro de funciones de ayudante compostable, servicios personalizados, o métodos de fábrica dinámicos:',
  'computedAsync.apiSummary':
    'Calcula valores a partir de Promesas, Observables o valores normales, devolviendo una señal que emite el valor calculado.',
  'computedAsync.paramComputation':
    'Una función que devuelve un Promise, Observable, o valor regular. La función recibe el valor calculado anterior como un primer argumento opcional.',
  'computedAsync.paramOptions': 'Opciones de configuración para la computación asínica.',
  'computedAsync.propInitialValue': 'El valor inicial de la señal computada antes de que la computación termine.',
  'computedAsync.propRequireSync': 'Si es verdad, requiere que el cálculo lo emitan de forma sincronizada.',
  'computedAsync.propBehavior':
    'Estrategia para procesar varios cálculos: "switch", "merge", "concat" o "exhaust". Valor predeterminado: "switch".',
  'computedAsync.propOnError': 'Responsable de errores que recibe errores de operaciones asínticas.',
  'computedAsync.propThrowOnError': 'Si es verdad, los errores serán arrojados y propagados.',
  'computedAsync.returnsDesc': 'Una Signal que emite el valor calculado.',
  'combineFrom.title': 'combineFrom',
  'combineFrom.overview':
    'La función <code>combineFrom</code> toma un array o objeto de Observables o Signals y produce una señal que emite el valor agregado de estas fuentes. Similar a <code>combineLatest</code>, pero con soporte natural para Signals. Soporta inyectores personalizados e valores iniciales.',
  'combineFrom.example1': 'Ejemplo 1: Uso básico',
  'combineFrom.example1Desc': 'Combine múltiples señales o observables:',
  'combineFrom.example2': 'Ejemplo 2: Con RxJS Pipe Operator',
  'combineFrom.example2Desc': 'Pasar un operador de tuberías RxJS para manipular los valores emitidos:',
  'combineFrom.example3': 'Ejemplo 3: Código Ascrónico de Manejo',
  'combineFrom.example3Desc':
    'Utilice la opción <code>startWith</code> o <code>initialValue</code> para manejar los observables asínicos:',
  'combineFrom.example4': 'Ejemplo 4: Ejemplo real - Datos filtrados',
  'combineFrom.example4Desc':
    'Combine los criterios de búsqueda con un recurso API para realizar el filtrado y la clasificación del lado del cliente:',
  'combineFrom.example5': 'Ejemplo 5: Inicialización Deduplicada',
  'combineFrom.example5Desc':
    'Las fuentes separadas todavía pueden producir combinaciones intermedias; utilizar computed() para derivación de señal sincronizada.',
  'combineFrom.apiSummary':
    'Combina fuentes de Observable y Signal con semántica de combineLatest y deduplicación por fuente.',
  'combineFrom.paramSources':
    'Un objeto o matriz de Observables o Signals para combinar. Cuando un objeto es proporcionado, el resultado será un objeto con las mismas llaves.',
  'combineFrom.paramOperator':
    'Un operador de tuberías RxJS para manipular los valores emitidos antes de que sean emitidos.',
  'combineFrom.paramOptions': 'Opciones de configuración incluyendo initialValue e inyector.',
  'combineFrom.returnsDesc':
    'Una señal que emite un conjunto u objeto (dependiendo del tipo de entrada) que contiene los últimos valores de todos los observables y señales de fuente.',
  'resourceAsync.title': 'resourceAsync',
  'resourceAsync.overview':
    'La función <code>resourceAsync</code> crea un recurso reactivo que gestiona operaciones asincrónicas con seguimiento completo del estado. Funciona con cualquier operación asincrónica (Observable, Promise o valor sincrónico). Proporciona cancelación automática, capacidad de recarga manual y seguimiento de estado granular.',
  'resourceAsync.basicSection': 'Ejemplos básicos',
  'resourceAsync.intermediateSection': 'Ejemplos intermedios',
  'resourceAsync.whenToUseSection': 'Cuando usar',
  'resourceAsync.advancedSection': 'WritableResourceRef - Administración local del Estado',
  'resourceAsync.nestedSection': 'Patrón avanzado: Recursos Nested',
  'resourceAsync.example1': 'Ejemplo 1: Consulta Reactiva Básica con Seguimiento de Autodependencia',
  'resourceAsync.example1Desc':
    'Crea un recurso que automaticamente obtiene datos y vuelve a obtenerlos cada vez que las dependencias cambien. Cualquier señal leída dentro de la función fuente se convierte en una dependencia reactiva.',
  'resourceAsync.example2': 'Ejemplo 2: Carga Lazy',
  'resourceAsync.example2Desc':
    'Utilice <code>lazy: true</code> para aplazar la carga hasta que se llame <code>reload()</code>. El recurso comienza en estado inactivo y no consiguió obtener datos hasta que se activó explícitamente:',
  'resourceAsync.loadUsers': 'Los usuarios de carga',
  'resourceAsync.notLoadedIdle': 'Aún no cargada (ociosa)',
  'resourceAsync.example3': 'Ejemplo 3: Valor inicial',
  'resourceAsync.example3Desc': 'Proporcione un valor inicial para mostrar antes de que la primera búsqueda termine:',
  'resourceAsync.example3Callout':
    'Es útil cuando navega de una lista a una página de detalles donde ya tiene algunos datos que mostrar inmediatamente.',
  'resourceAsync.example4': 'Ejemplo 4: El manejo del error con la propagación de la caída y el error',
  'resourceAsync.example4Desc':
    'Manejar errores con <code>onError</code> para proporcionar valores de fallback, o utilizar <code>throwOnError: true</code> para propagar errores:',
  'resourceAsync.triggerFallback': 'Trigger Request (will fallback)',
  'resourceAsync.showingFallback': 'Mostrando usuario de fallback después de error',
  'resourceAsync.errorPropagation': 'Propagación del error',
  'resourceAsync.example5': 'Ejemplo 5: Mutaciones con execute() - Formulario de registro de usuarios',
  'resourceAsync.example5Desc':
    'Para mutaciones (POST/PUT/DELETE), use el método <code>execute()</code> en lugar de <code>reload()</code>. El <code>execute()</code> devuelve un <code>Promise&lt;T&gt;</code> awaitable que se resuelve con el valor exacto escrito en <code>resource.value()</code>, limpia los valores vencidos y los errores al reejecutar, y es seguro para llamadas fire-and-forget sin rechazos no manejados.',
  'resourceAsync.regUsername': 'Nombre de usuario',
  'resourceAsync.regEmail': 'Correo electrónico',
  'resourceAsync.regPassword': 'Contraseña',
  'resourceAsync.regSubmit': 'Registro',
  'resourceAsync.example6': 'Ejemplo 6: Comportamientos (interruptor, escape)',
  'resourceAsync.example6Desc': 'Control de cómo se manejan múltiples solicitudes simultáneas:',
  'resourceAsync.example7': 'Ejemplo 7: Seguimiento de estado',
  'resourceAsync.example7Desc':
    'Acceda a la información de estado granular con la señal <code>status()</code>. Utilice <code>computed()</code> para el estado derivado:',
  'resourceAsync.example8': 'Ejemplo 8: Definición declarativa de Propagación AbortSignal',
  'resourceAsync.example8Desc':
    '<code>resourceAsync</code> admite definición declarativa mediante <code>ResourceAsyncDefinition&lt;P, T&gt;</code> con <code>params</code> y <code>loader</code>, propagando <code>context.abortSignal</code> para el seguimiento de la generación de señales de cancelación y el acomodamiento del promesa diferida.',
  'resourceAsync.declarativeTitle': 'Causa en vivo: Definición declarativa',
  'resourceAsync.quickSwitchDemo': 'Switch rápido (Trigger Abort)',
  'resourceAsync.activeSearchLogs': 'Real-Time AbortSignal Solicitud de registro de ciclo de vida',
  'resourceAsync.optimisticTitle': 'Ejemplo 1: Actualizaciones optimizadas - Todo Toggle',
  'resourceAsync.optimisticDesc':
    'Actualizar el UI inmediatamente antes de la confirmación del servidor. Si la solicitud del servidor falla, usted puede reactivar el cambio. Esto proporciona retroalimentación instantánea a los usuarios.',
  'resourceAsync.cacheFirstTitle': 'Ejemplo 2: Cache-First Loading',
  'resourceAsync.cacheFirstDesc':
    'Mostrar los datos enjaulados inmediatamente mientras que obtener los datos frescos en el fondo, lo que elimina la carga de las espineras para los usuarios con contenido enjaulado.',
  'resourceAsync.formDraftTitle': 'Ejemplo 3: Borrador de forma - contador con guardar / desechar',
  'resourceAsync.formDraftDesc':
    'Permitir a los usuarios editar los datos localmente antes de guardar al servidor. Pueden guardar cambios o descartarlos recargando desde el servidor.',
  'resourceAsync.nestedTitle': 'Aplicación',
  'resourceAsync.nestedProjects': 'Proyectos',
  'resourceAsync.nestedLoadingItems': 'Cargando artículos...',
  'resourceAsync.nestedRefreshing': 'Refrescando...',
  'resourceAsync.nestedThName': 'Nombre',
  'resourceAsync.nestedThStatus': 'Situación',
  'resourceAsync.nestedThOrg': 'Organización',
  'resourceAsync.nestedThActions': 'Medidas',
  'resourceAsync.nestedLoadOrg': 'Carga Org',
  'resourceAsync.nestedRetry': 'Reintento',
  'resourceAsync.nestedRefreshItems': 'Refrescar los artículos',
  'resourceAsync.nestedLoadAllOrgs': 'Carga todas las orgas',
  'queryResource.title': 'queryResource',
  'queryResource.overview':
    '<code>queryResource</code> proporciona gestión de estado del servidor declarativa, con caché y deduplicación en Angular Signals. Combinada con <code>mutateResource</code> y <code>QueryClient</code>, coordina sondeo periódico de fondo, caché stale-while-revalidate, coalescencia de solicitudes y invalidación por etiqueta.',
  'queryResource.comparisonTitle': 'Cuando usar: queryResource vs. resourceAsync',
  'queryResource.comparisonIntro':
    'Ambos primitivos utilizan Angular Signals para reactivos UI, pero se ocupan de diferentes capas de su arquitectura de aplicación:',
  'queryResource.cardResourceAsyncTitle': 'resourceAsync (Component-Local Async State)',
  'queryResource.cardQueryResourceTitle': 'queryResource (Cache de entidad compartida)',
  'queryResource.scope': 'Ámbito de aplicación',
  'queryResource.cache': 'Cache',
  'queryResource.mutations': 'Mutaciones',
  'queryResource.freshness': 'Frescura',
  'queryResource.polling': 'Polling',
  'queryResource.invalidation': 'Invalidación',
  'queryResource.bestFor': 'Mejor para',
  'queryResource.resourceAsyncScopeDesc': 'Libra estrictamente al ciclo de vida de la única instancia de componentes.',
  'queryResource.resourceAsyncCacheDesc': 'No hay caché global. Destruir el componente destruye los datos.',
  'queryResource.resourceAsyncMutationsDesc': 'Built-in execute() para activadores de un solo-off directo.',
  'queryResource.resourceAsyncBestForDesc':
    'Los estados de presentación de formularios, los filtros locales de búsqueda de tipefore, los puntos de datos aislados de forma modal, las exportaciones de archivos.',
  'queryResource.queryResourceScopeDesc': 'Manejado a nivel mundial a través de rutas, componentes de QueryClient.',
  'queryResource.queryResourceCacheDesc':
    'Las llaves de consulta idénticas comparten peticiones de HTTP en vuelo y caché de memoria.',
  'queryResource.queryResourceFreshnessDesc': 'staleTime Configurable y gcTime (Stale-While-Ralliate).',
  'queryResource.queryResourcePollingDesc':
    'Coordinación pollInterval que respeta la visibilidad de la pestaña automáticamente.',
  'queryResource.queryResourceInvalidationDesc':
    'Autoreajustado a través de la invalidación de etiquetas de mutateResource.',
  'queryResource.queryResourceBestForDesc':
    'Las entidades de servidor (usuarios, tableros, proyectos, estado de cluster) compartieron a través de múltiples vistas.',
  'queryResource.thFeature': 'Caracterización',
  'queryResource.rowPrimaryLayer': 'Capa primaria',
  'queryResource.rowPrimaryLayerResource': 'Estado de asínc local a nivel de componentes',
  'queryResource.rowPrimaryLayerQuery': 'estado del servidor compartido a nivel de todo el cliente',
  'queryResource.rowSharedMemory': 'Cache de memoria compartida',
  'queryResource.badgeNoneComponent': 'Ninguno (a base de componentes)',
  'queryResource.badgeGlobalKey': 'Global de QueryKey',
  'queryResource.rowDeduplication': 'Concurrente solicitud de Deduplicación',
  'queryResource.badgePerInstance': 'Por instancia (switch/exhaust)',
  'queryResource.badgeClientCoalesced': 'Coalesced a todo el mundo',
  'queryResource.rowStaleWhileRevalidate': 'Stale-While-Ralliate',
  'queryResource.badgeManualPreserve': 'Manual (preserveValueOnError)',
  'queryResource.badgeAutoStale': 'Automático a través de staleTime',
  'queryResource.rowBackgroundPolling': 'Polling de fondo',
  'queryResource.badgeNoneBuiltIn': 'Ninguna construcción (o encuesta externa)',
  'queryResource.badgeCoordinatedVisibility': 'Coordinación + Visibilidad Consciente',
  'queryResource.rowTagInvalidation': 'Invalidación basada en las velocidades',
  'queryResource.badgeManualReload': 'Activador de recarga manual',
  'queryResource.badgeAutoMutate': 'Automático a través de mutateResource',
  'queryResource.lifecycleTitle': 'Matriz de estados y señales del ciclo de vida',
  'queryResource.lifecycleIntro':
    'Las consultas gestionan tanto las cargas iniciales como las revalidaciones en segundo plano. Utilice esta matriz para determinar cuándo mostrar spinners de pantalla completa frente a indicadores sutiles de actualización sin bloquear la interacción.',
  'queryResource.matrixState': 'Estado del ciclo de vida',
  'queryResource.matrixStatus': 'status()',
  'queryResource.matrixWhenToUse': 'Cuándo usar e impacto en UI',
  'queryResource.matrixInitialLoad': 'Carga inicial (sin datos previos)',
  'queryResource.matrixInitialLoadUsage':
    'Muestre un spinner o esqueleto principal. La UI aún no tiene datos para mostrar.',
  'queryResource.matrixResolved': 'Resuelto / Inactivo (datos frescos)',
  'queryResource.matrixResolvedUsage': 'Muestre el contenido con normalidad. Ninguna solicitud de red está en curso.',
  'queryResource.matrixRefreshingState': 'Revalidación en segundo plano (SWR / Invalidación)',
  'queryResource.matrixRefreshingUsage':
    '¡NO muestre un spinner de pantalla completa! Muestre los datos existentes y añada una insignia o spinner sutil en la barra superior. Evita parpadeos y pantallas en blanco.',
  'queryResource.matrixInitialError': 'Error inicial (sin datos previos)',
  'queryResource.matrixInitialErrorUsage': 'Muestre una alerta o pantalla de error completa con botón de reintento.',
  'queryResource.matrixRefreshError': 'Error de actualización (con datos en caché)',
  'queryResource.matrixRefreshErrorUsage':
    'Conserve los datos existentes en pantalla y muestre un banner o toast de advertencia flotante.',
  'queryResource.placementTitle': 'Arquitectura: Ubicación en Componentes vs. Servicios',
  'queryResource.loading': 'Cargando…',
  'queryResource.placementIntro':
    '¿Dónde deben residir las consultas? Debido a que <code>queryResource</code> depende de la inyección de dependencias de Angular, funciona perfectamente tanto en componentes como en servicios. Elija la ubicación adecuada según el alcance del estado:',
  'queryResource.thPlacement': 'Ubicación',
  'queryResource.thScopeLifetime': 'Alcance y Ciclo de Vida',
  'queryResource.thStateSharing': 'Compartición de Estado',
  'queryResource.thCoordination': 'Coordinación de Recarga',
  'queryResource.thRecommendation': 'Recomendado Para',
  'queryResource.rowComponentPlacement': 'Ubicación en Componente',
  'queryResource.rowComponentScope': 'Vinculado al inyector del componente; se destruye al desmontar',
  'queryResource.rowComponentSharing': 'Aislado a una sola instancia de componente',
  'queryResource.rowComponentCoord': 'Desencadenadores locales (query.reload())',
  'queryResource.rowComponentRec': 'Vistas aisladas, modales, formularios, pestañas de detalle',
  'queryResource.rowServicePlacement': 'Ubicación en Servicio',
  'queryResource.rowServiceScope': 'Vinculado al inyector del servicio; persiste entre cambios de ruta',
  'queryResource.rowServiceSharing': 'Compartido sincrónicamente entre múltiples componentes y rutas',
  'queryResource.rowServiceCoord': 'Coordinación global mediante acciones de servicio e invalidación de etiquetas',
  'queryResource.rowServiceRec':
    'Sesión de autenticación, selección activa de base de datos/inquilino, maestro-detalle',
  'queryResource.tabServicePatternA': 'Patrón A: Sesión Global de Autenticación (Servicio Raíz)',
  'queryResource.tabServicePatternADesc':
    'Un servicio singleton gestiona currentUser y updateProfile. Múltiples componentes leen el mismo Signal sin Subjects de RxJS ni buses de eventos.',
  'queryResource.tabServicePatternB': 'Patrón B: Maestro-Detalle Parametrizado (Servicio de Característica)',
  'queryResource.tabServicePatternBDesc':
    'Un servicio mantiene activeDatabaseId. Cuando la lista maestra actualiza el Signal de selección, queryResource carga automáticamente los detalles coincidentes.',
  'queryResource.tabComponentPlacement': 'Patrón C: Ubicación en Componente (Vista Aislada)',
  'queryResource.tabComponentPlacementDesc':
    'La ubicación directa en el componente es la opción más limpia cuando los datos son exclusivos de una sola vista, eliminando archivos de servicio innecesarios.',
  'queryResource.simulatedTopbar': 'Barra de Navegación Superior Global',
  'queryResource.simulatedProfile': 'Tarjeta de Perfil de Usuario',
  'queryResource.simulatedMasterList': 'Lista Maestra (Seleccionar Base de Datos)',
  'queryResource.simulatedDetailCard': 'Vista de Detalle (Especificaciones Activas)',
  'queryResource.updateNameBtn': 'Actualizar nombre',
  'queryResource.componentPlacementAdvice':
    'Se recomienda la ubicación en el componente cuando los datos están estrictamente limitados a una vista. No requiere archivos adicionales y se limpia automáticamente al desmontar.',
  'queryResource.demo1Section': 'Coalescencia de solicitudes',
  'queryResource.demo1SectionDesc':
    'Cuando dos o más componentes montan al mismo tiempo y solicitan la misma clave de consulta, <code>QueryClient</code> comparte la solicitud de red única en vuelo. Ambos componentes reciben la misma respuesta con cero tráfico redundante.',
  'queryResource.demo1PlaygroundTitle': 'Componentes independientes comparten solicitudes de red en curso',
  'queryResource.demo1PlaygroundDesc':
    'Simula dos componentes independientes (TopbarStatusComponent y DashboardMetricsComponent) que se montan simultáneamente y solicitan las mismas métricas de clúster. Haga clic en "Reload Query" para verificar que solo se realiza 1 llamada HTTP real.',
  'queryResource.badgeDeduplication': 'Deduplicación',
  'queryResource.actualHttpCalls': 'Llamadas HTTP reales: {0}',
  'queryResource.reloadQuery': 'Recargar consulta',
  'queryResource.widgetATitle': 'Barra de navegación global',
  'queryResource.widgetASubtitle': 'TopbarStatusComponent (Usuarios activos y estado)',
  'queryResource.widgetBTitle': 'Tarjeta de panel principal',
  'queryResource.widgetBSubtitle': 'DashboardMetricsComponent (Carga de CPU y memoria)',
  'queryResource.activeUsers': 'Usuarios activos',
  'queryResource.cpuLoad': 'CPU Load',
  'queryResource.memoryUsage': 'Uso de la memoria',
  'queryResource.status': 'Situación',
  'queryResource.updated': 'Actualizado',
  'queryResource.demo2Section': 'Políticas de frescura y Stale-While-Revalidate',
  'queryResource.demo2SectionDesc':
    "<code>staleTime</code> controla cuánto tiempo permanece los datos en caché actualizados. Si un observador solicita datos mientras están actualizados, se renderizan instantáneamente desde la memoria. Si están vencidos, los datos en caché se muestran inmediatamente mientras un refresco de fondo se ejecuta silenciosamente sin limpiar la interfaz (indicado por <code>status: 'reloading'</code>).",
  'queryResource.focusRefetchNoteTitle': 'Recuperación al enfocar la pestaña',
  'queryResource.focusRefetchNoteBody':
    'Por defecto, refetchOnFocus está deshabilitado en ngx-lift para proteger las APIs empresariales de saturaciones de tráfico. Pase { refetchOnFocus: true } en las opciones de consulta para actualizar automáticamente al volver a la pestaña.',
  'queryResource.configuredStaleTime': 'Configurado staleTime: {0} segundos',
  'queryResource.freshnessBadgeFresh': 'FRESH',
  'queryResource.freshnessBadgeStale': 'STALE',
  'queryResource.networkCalls': 'Llamadas de red: {0}',
  'queryResource.triggerReadReload': 'Trigger Read / Reload',
  'queryResource.revalidatingAlert':
    'Los antecedentes que revalidan en progreso... ¡UI existente sigue siendo interactivo!',
  'queryResource.clusterNodes': 'Nodos de racimo',
  'queryResource.healthyNodes': '{0} / {1} Sano',
  'queryResource.region': 'Región',
  'queryResource.snapshotTime': 'Hora de la instantánea',
  'queryResource.demo3Section': 'Polling coordinado con conciencia de visibilidad',
  'queryResource.demo3SectionDesc':
    'Configure <code>pollInterval</code> para refrescar periódicamente consultas activas. Varios observadores solicitando intervalos diferentes se coordinan a la máxima velocidad. El sondeo se pausa automáticamente cuando la pestaña del navegador está oculta y se reinicia inmediatamente al volver.',
  'queryResource.demo3PlaygroundTitle': 'Polling de fondo',
  'queryResource.demo3PlaygroundDesc':
    'Habilitar la votación y ver el pulso del latido del corazón. Observe que pausa si cambia las pestañas!',
  'queryResource.badgePolling': 'Polling',
  'queryResource.startPolling': 'Inicio Polling (3)',
  'queryResource.stopPolling': 'Detener a Polling',
  'queryResource.totalPollCycles': 'Ciclos de Poll total: {0}',
  'queryResource.ping': 'Ping',
  'queryResource.lastPulse': 'Último Pulso',
  'queryResource.pollingIdleMsg':
    'Polling está ahora inactivo. Haga clic en Inicio Polling para observar controles de fondo coordinados en vivo.',
  'queryResource.demo4Section': 'Mutaciones e invalidación por etiquetas (mutateResource)',
  'queryResource.demo4SectionDesc':
    '<code>mutateResource</code> maneja asíncrono escribe. Tras una mutación exitosa, invalida las etiquetas de juego, causando que todas las consultas activas con esas etiquetas retejan automáticamente los últimos datos del servidor en el fondo.',
  'queryResource.demo4PlaygroundTitle': 'Invalidación basada en velocidades',
  'queryResource.demo4PlaygroundDesc':
    'Añada un nuevo miembro. Al terminar la mutación, usersQuery se reajusta automáticamente en el fondo!',
  'queryResource.badgeMutations': 'Mutaciones',
  'queryResource.addTeamMember': 'Añadir Miembro del Equipo',
  'queryResource.nameLabel': 'Nombre',
  'queryResource.namePlaceholder': 'Por ejemplo, Charlie Brown',
  'queryResource.roleLabel': 'Función',
  'queryResource.rolePlatformEngineer': 'Platform Engineer',
  'queryResource.roleSre': 'Ingeniero de fiabilidad de sitios',
  'queryResource.roleProductDesigner': 'Diseñador de productos',
  'queryResource.addMemberBtn': 'Añadir Miembro',
  'queryResource.savingBtn': 'Salvando...',
  'queryResource.activeMembersTitle': 'Miembros del Equipo Activo',
  'queryResource.thId': 'ID',
  'queryResource.thName': 'Nombre',
  'queryResource.thRole': 'Función',
  'queryResource.diagnosticsSection': 'El desarrollador Diagnóstico',
  'queryResource.diagnosticsSectionDesc':
    'Registre provideQueryDevtools() una vez en app.config.ts para mostrar el botón flotante solo en desarrollo. Inspeccione consultas en el panel inferior mientras usa la aplicación.',
  'queryResource.diagnosticsPlaygroundTitle': 'Panel de consultas',
  'queryResource.diagnosticsPlaygroundDesc':
    'Busque, filtre y ordene consultas; inspeccione datos, errores y tiempos. Recargar ejecuta el cargador seleccionado. Esta vista de documentación también está habilitada en producción.',
  'queryResource.badgeDiagnostics': 'Diagnóstico',
  'queryResource.refreshDiagnostics': 'Refrescar el diagnóstico',
  'queryResource.diagTotalEntries': 'Total de entradas',
  'queryResource.diagActiveQueries': 'Consultas activas',
  'queryResource.diagInactiveQueries': 'Inactivo (GC pendiente)',
  'queryResource.diagPendingRequests': 'Lecturas pendientes',
  'queryResource.diagTotalObservers': 'Total de observadores',
  'queryResource.diagVisibility': 'Visibilidad',
  'queryResource.diagVisible': 'Activo',
  'queryResource.diagHidden': 'Escondido / inactivo',
  'queryResource.thQueryKey': 'Clave de consulta',
  'queryResource.thObservers': 'Observadores',
  'queryResource.thRemainingGc': 'Cuenta atrás de GC',
  'queryResource.thRemainingPoll': 'Siguiente Poll In',
  'queryResource.noQueriesCached': 'No hay entradas de consulta actualmente en caché.',
  'queryResource.apiReference': 'Referencia API',
  'mutateResource.title': 'mutateResource',
  'mutateResource.overview':
    '<code>mutateResource</code> coordina escrituras asincrónicas en el servidor (POST, PUT, PATCH, DELETE) con invalidación automática de caché por etiqueta, estrategias de concurrencia integradas (exhaust, concat, parallel) y señales reactivas de Angular Signals.',
  'mutateResource.featuresTitle': 'Capacidad clave',
  'mutateResource.featuresIntro':
    'A diferencia de las consultas de lectura, que se activan de forma reactiva a partir de los cambios de parámetros, las mutaciones se ejecutan estrictamente a través de la interacción explícita del usuario.',
  'mutateResource.cardTagInvalidationTitle': 'Invalidación automática de la etiqueta',
  'mutateResource.cardTagInvalidationDesc':
    'Invalidar etiquetas en el éxito de escritura para refrescar automáticamente a todos los observadores activos de queryResource a través de la aplicación sin recarga manual de plomería.',
  'mutateResource.cardConcurrencyTitle': 'Conmoneda configurable',
  'mutateResource.cardConcurrencyDesc':
    'Controle los envíos simultáneos con "exhaust" (ignora los clics duplicados o los vincula a la ejecución actual), "concat" (cola FIFO) o "parallel" (valor predeterminado).',
  'mutateResource.cardSignalsTitle': 'Estado reactivo Signals',
  'mutateResource.cardSignalsDesc':
    'Proporciona un valor reactivo, un error, un estado ("idle" | "loading" | "resolved" | "error"), y señales de isLoading optimizadas para el control de cambios OnPush.',
  'mutateResource.cardPromiseTitle': 'Retorno directo de Promise',
  'mutateResource.cardPromiseDesc':
    'La llamada mutate() devuelve un Promise estándar, que permite async / esperar e intentar / capturar sintaxis en los controladores de eventos de componentes.',
  'mutateResource.demo1Section': '1. Invalidación de etiqueta con consultas activas',
  'mutateResource.demo1SectionDesc':
    'La presentación de una mutación invalida las etiquetas de juego, inmediatamente desencadenando refrescos de fondo para cualquier caso activo de queryResource observando esas etiquetas.',
  'mutateResource.demo1PlaygroundTitle': 'Crear la actualización de la solicitud de observación del artículo',
  'mutateResource.demo1PlaygroundDesc':
    'Presentar el formulario para añadir un usuario. Tenga en cuenta cómo la tabla de usuario se actualiza automáticamente a través de la invalidación de etiquetas sin ninguna llamada manual de recarga!',
  'mutateResource.badgeInvalidation': 'Invalidación de la etiqueta',
  'mutateResource.addTeamMember': 'Añadir Miembro del Equipo',
  'mutateResource.nameLabel': 'Nombre',
  'mutateResource.namePlaceholder': 'Por ejemplo, Dana Scully',
  'mutateResource.roleLabel': 'Función',
  'mutateResource.rolePlatformEngineer': 'Platform Engineer',
  'mutateResource.roleSre': 'Ingeniero de fiabilidad de sitios',
  'mutateResource.roleProductDesigner': 'Diseñador de productos',
  'mutateResource.addMemberBtn': 'Añadir Miembro',
  'mutateResource.savingBtn': 'Salvando...',
  'mutateResource.activeMembersTitle': 'Miembros del Equipo Activo',
  'mutateResource.thId': 'ID',
  'mutateResource.thName': 'Nombre',
  'mutateResource.thRole': 'Función',
  'mutateResource.demo2Section': '2. Modos de Conmoneda: escape, concat, y paralelo',
  'mutateResource.demo2SectionDesc':
    'Probar cómo diferentes estrategias de concurrencia manejan clics rápidos en un botón. "exhaust" previene el doble envío accidental descartando o uniendo clics duplicados mientras un mutación está en curso.',
  'mutateResource.demo2PlaygroundTitle': 'Haga clic rápido en Simulación de Conmoneda',
  'mutateResource.demo2PlaygroundDesc':
    'Elija un modo, a continuación, haga clic rápidamente en Trigger 800ms Mutación varias veces para ver cómo se manejan las ejecuciones.',
  'mutateResource.badgeConcurrency': 'Conmoneda',
  'mutateResource.modeLabel': 'Estrategia de divisas',
  'mutateResource.modeExhaust': 'escape (Suelte los clics rápidos duplicados - doble remitente de protección)',
  'mutateResource.modeConcat': 'concat (Queue invocations in sequence)',
  'mutateResource.modeParallel': '(Ejecutar cada invocación de forma independiente)',
  'mutateResource.triggerMutationBtn': 'Trigger 800ms Mutation',
  'mutateResource.totalClicks': 'Total Button Clicks: {0}',
  'mutateResource.actualExecutions': 'Ejecuciones efectivas: {0}',
  'mutateResource.inFlight': 'Actualmente In-Flight: {0}',
  'mutateResource.recentLogs': 'Registro de ejecución',
  'mutateResource.clearLogs': 'Despejado',
  'mutateResource.noLogsYet': 'No mutaciones ejecutadas todavía. Haga clic en el botón de arriba para comenzar.',
  'mutateResource.demo3Section': '3. Reactive Status Signals',
  'mutateResource.demo3SectionDesc':
    '<code>mutateResource</code> gestiona los errores de forma limpia. Cuando un escrito falla, la señal de error está poblada, el estado se vuelve un error, y el Promise devuelto rechaza por el manejo de la prueba / captura.',
  'mutateResource.demo3PlaygroundTitle': 'Estado Signals',
  'mutateResource.demo3PlaygroundDesc':
    'Tire la simulación de fallo y desencadenar la acción para inspeccionar el estado de error reactivo.',
  'mutateResource.badgeError': 'Error de manejo',
  'mutateResource.simulateErrorLabel': 'Simular 500 Error de servidor',
  'mutateResource.saveSettingsBtn': 'Guardar configuración',
  'mutateResource.statusLabel': 'Situación',
  'mutateResource.isLoadingLabel': 'isLoading',
  'mutateResource.errorSuccessMsg': '¡Configuración guardada con éxito!',
  'mutateResource.apiReference': 'Referencia API',
  'injectParams.example1Title': 'Ejemplo 1: Obtener todos los parámetros de la ruta',
  'injectParams.example1Desc':
    'Cuando se llama sin ningún argumento, devuelve una señal que contiene todo el objeto de params:',
  'injectParams.example2Title': 'Ejemplo 2: Consigue un parámetro único',
  'injectParams.example2Desc':
    'Cuando se especifica una clave, devuelve el valor del parámetro correspondiente como una señal:',
  'injectParams.example3Title': 'Ejemplo 3: Parámetros de transformación',
  'injectParams.example3Desc': 'Transformar parámetros utilizando una función transformada:',
  'injectParams.example4Title': 'Ejemplo 4: Transformar con valor inicial',
  'injectParams.example4Desc': 'Transformar parámetros con valor inicial y conversión de tipo:',
  'injectParams.example4Callout':
    'Cuando <code>initialValue</code> se proporciona como un booliano o número, se debe proporcionar la función <code>transform</code> que devuelve el mismo tipo.',
  'injectParams.example5Title': 'Ejemplo 5: Ejemplo de uso completo',
  'injectParams.example5Desc': 'Ejemplo completo que muestra varios patrones de uso:',
  'injectParams.example6Title': 'Ejemplo 6: Inyector personalizado',
  'injectParams.example6Desc':
    'Pasar un <code>Injector</code> personalizado a través de las opciones objetar a acceder a parámetros de ruta fuera de un contexto de inyección ambiente (tales como funciones de hélice compostable interior o servicios dinámicos):',
  'injectParams.title': 'injectParams',
  'injectParams.overview':
    'La función <code>injectParams</code> proporciona una señal reactiva para los parámetros de la ruta, actualizando automáticamente al producirse una navegación.',
  'injectParams.apiSummary': 'Injecta y transforma los parámetros de la ruta como señales reactivas.',
  'injectParams.paramKeyOrTransform':
    'Cuando se proporciona una cadena, devuelve el valor de ese parámetro de ruta. Cuando se proporciona una función, procesa todos los parámetros de la ruta. Si no se permite, devuelve todos los params.',
  'injectParams.paramOptions':
    'Objeto de configuración que contiene función transformada, initialValue, y / o inyector.',
  'injectParams.returnsDesc': 'Una señal que contiene el parámetro de ruta value(s) o resultado transformado.',
  'injectParams.usagePatterns': 'Patrones de uso',
  'injectParams.pattern1': 'Sin argumentos: Devuelve la señal con todos los parámetros de la ruta',
  'injectParams.pattern2':
    'Clave de tracción: Devuelve la señal con valor de parámetro específico (o null if not present)',
  'injectParams.pattern3': 'Función de transformación: Devuelve la señal con parámetros transformados',
  'injectParams.pattern4': 'Con opciones: Permite valor inicial y conversión de tipo',
  'injectQueryParams.title': 'injectQueryParams',
  'injectQueryParams.overview':
    'La función <code>injectQueryParams</code> proporciona una señal reactiva para los parámetros de consulta de la URL.',
  'injectQueryParams.apiSummary': 'Injecta y transforma los parámetros de consulta de la ruta como señales reactivas.',
  'injectQueryParams.paramKeyOrTransform':
    'Cuando se proporciona una cadena, devuelve el valor de ese parámetro de consulta. Cuando se proporciona una función, procesa todos los parámetros de consulta. Si no se permite, devuelve todos los params de consulta.',
  'injectQueryParams.paramOptions':
    'Objeto de configuración que contiene función transformada, initialValue, y / o inyector.',
  'injectQueryParams.returnsDesc': 'Una señal que contiene el parámetro de consulta value(s) o resultado transformado.',
  'injectQueryParams.example1Title': 'Ejemplo 1: Obtener todos los parámetros de búsqueda',
  'injectQueryParams.example1Desc': 'Obtener todos los parámetros de consulta como una señal:',
  'injectQueryParams.example2Title': 'Ejemplo 2: Consigue un solo parámetro de búsqueda',
  'injectQueryParams.example2Desc': 'Obtenga un parámetro de consulta específico por nombre:',
  'injectQueryParams.example3Title': 'Ejemplo 3: Parámetros de búsqueda de transformación',
  'injectQueryParams.example3Desc': 'Transformar parámetros de consulta utilizando una función de transformación:',
  'injectQueryParams.example4Title': 'Ejemplo 4: Transformar con valor inicial',
  'injectQueryParams.example4Desc': 'Transformar parámetros de consulta con un valor inicial y conversión de tipo:',
  'injectQueryParams.example5Title': 'Ejemplo 5: Ejemplo de uso completo',
  'injectQueryParams.example5Desc': 'Ejemplo completo que muestra varios patrones de uso:',
  'injectQueryParams.example6Title': 'Ejemplo 6: Inyector personalizado',
  'injectQueryParams.example6Desc':
    'Pasar un <code>Injector</code> personalizado a través de las opciones objetar a acceder a parámetros de consulta de ruta fuera de un contexto de inyección ambiente (tales como funciones de hélice compostable interior o servicios dinámicos):',
  'createTrigger.title': 'createTrigger',
  'createTrigger.overview':
    'La función <code>createTrigger</code> proporciona una forma de iniciar manualmente recálculos de señales mediante la referencia a la señal de disparador que crea. Similar a un Subject de RxJS, llamar a <code>next()</code> incrementa la señal de contador y notifica los efectos o señales calculadas dependientes.',
  'createTrigger.apiSummary':
    'Crea una señal de disparador que puede usarse para iniciar manualmente recálculos de señales.',
  'createTrigger.propValue': 'Una señal que devuelve el número de veces que el gatillo ha sido llamado (comienza a 0).',
  'createTrigger.propNext': 'Un método para activar la actualización de la señal.',
  'createTrigger.returnsDesc': 'Un objeto que expone la señal de valor y el método de gatillo next().',
  'createTrigger.example1': 'Ejemplo 1: Uso básico',
  'createTrigger.example1Desc': 'Crear un gatillo y utilizarlo para activar manualmente los recálculos de señal:',
  'createTrigger.example2': 'Ejemplo 2: Efecto condicional',
  'createTrigger.example2Desc':
    'Utilice el valor del gatillo condicionalmente para evitar que se ejecute a partir de la inicialización:',
  'createTrigger.btnSeeConsole': 'Ver Registro de Consola',
  'createTrigger.callout':
    "Inicialmente, <code>createTrigger's value()</code> devuelve 0. Cada vez que <code>next</code> es explícitamente llamado, el valor añade 1.",
  'pageContainer.title': 'Contenedor de página',
  'pageContainer.overview':
    'El componente <code>cll-page-container</code> proporciona una envoltura estándar y responsive para páginas en aplicaciones Clarity. Encapsula tipografía uniforme de títulos, padding fluido y espaciado consistente, mientras ofrece un slot de proyección de contenido para vistas, tarjetas, formularios y cuadros de grillas arbitrarias.',
  'pageContainer.example1': 'Ejemplo 1: Contenedor de página básica',
  'pageContainer.example1Desc':
    'Establecer un título obligatorio y los elementos de vista arbitraria del proyecto en la ranura de página principal.',
  'pageContainer.example1Badge': 'Page Shell',
  'pageContainer.example2': 'Ejemplo 2: Spacing personalizado',
  'pageContainer.example2Desc':
    'Pasar el diseño Clarity o clases de utilidad personalizada a customClass para controlar la densidad de diseño.',
  'pageContainer.example2Badge': 'Responsable',
  'pageContainer.example3': 'Ejemplo 3: HTML dinámico Markup en el título de página',
  'pageContainer.example3Desc':
    'La entrada de título se realiza a través de innerHTML, permitiendo etiquetas, indicadores de estado, o etiquetas directamente en la cabecera.',
  'pageContainer.example3Badge': 'Título HTML',
  'pageContainer.demoUserManagement': 'Gestión de usuarios',
  'pageContainer.demoBodyContent':
    'Contenido del cuerpo de página que se ha convertido dentro de la ranura predeterminada.',
  'pageContainer.demoClusterSettings': 'Configuración de grupos',
  'pageContainer.demoConfigured': 'Configurado con clases de estilo personalizado.',
  'pageContainer.demoAuditLog': "Registro de auditoría <span class='badge badge-info'>Live</span>",
  'pageContainer.demoLogStream': 'Las entradas de registro fluyen aquí en tiempo real.',
  'pageContainer.apiSummary': 'Envoltura estándar de página con márgenes responsivos y tipografía de encabezado.',
  'pageContainer.inputTitle':
    'El título que se muestra en la parte superior del contenedor. Renovado a través de innerHTML.',
  'pageContainer.inputCustomClass': 'Otras clases CSS se aplican directamente al elemento raíz del contenedor.',
  'pageContainer.contentProjectionDesc':
    'Ranura predeterminada <ng-content /> para colocar todo el contenido de página principal por debajo del título.',
  'alert.title': 'Alerta',
  'alert.overview':
    'Las alertas son barras que llaman la atención del usuario hacia mensajes importantes. Los elementos visuales como iconos y colores indican el tipo y la urgencia de la información que se comunica. Utiliza alertas para proporcionar información crítica que requiere atención inmediata dentro del contexto actual.',
  'alert.example1': 'Ejemplo 1: Mostrar respuesta al error API',
  'alert.example1Desc':
    'Al mostrar respuestas de error de APIs, utilice la entrada de error para pasar detalles de error. La alerta muestra el mensaje de error del objeto de respuesta o se remonta a HttpErrorResponse.',
  'alert.example1Badge': 'Error API',
  'alert.example2': 'Ejemplo 2: Mostrar contenido personalizado',
  'alert.example2Desc':
    'El contenido se realiza utilizando innerHTML, permitiendo un formato rico e incrustado de etiquetas HTML a través de diversos niveles de alerta.',
  'alert.example2Badge': 'Texto rico',
  'alert.example3': 'Ejemplo 3: Proyección de contenido',
  'alert.example3Desc':
    'El componente de alerta es compatible con la proyección de contenido a través de contenido ng-, lo que permite la inclusión de estructuras HTML complejas y componentes infantiles.',
  'alert.example3Badge': 'ng-contenido',
  'alert.example4': 'Ejemplo 4: Sising compacto (isSmall)',
  'alert.example4Desc':
    'Utilice la entrada isSmall para mostrar una alerta compacta eficiente desde el espacio para cajones y pequeños contenedores.',
  'alert.example4Badge': 'Pacto',
  'alert.example5': 'Ejemplo 5: Alertas de peso ligero',
  'alert.example5Desc':
    'Utilice alertas ligeras sin fronteras dentro de tarjetas, mesas, y diseños de estado anidados.',
  'alert.example5Badge': 'Ligero',
  'alert.example6': 'Ejemplo 6: Alertas de nivel de apelación',
  'alert.example6Desc':
    'Coloque alertas de alta prioridad a nivel de vídeo en la parte superior de todo contenido y navegación.',
  'alert.example6Badge': 'Nivel de apelación',
  'alert.apiSummary':
    'Componente de alerta que muestra mensajes importantes con diversos tipos y estilos del tema Clarity.',
  'alert.inputAlertType':
    'Uno de los valores: "info", "warning", "success", "danger", "neutral", "loading", "unknown".',
  'alert.inputIsAppLevel':
    'Bandera booleana para alertas de nivel de vídeo que se muestran en la parte superior de la vista.',
  'alert.inputIsSmall': 'Bandera booleana para un tamaño compacto en recipientes apretados o cajones.',
  'alert.inputIsLightweight': 'Bandera booleana para un estilo ligero sin fronteras.',
  'alert.inputError': 'Un HttpErrorResponse o un objeto de error para mostrar detalles de error.',
  'alert.inputContent':
    'Una cadena que contiene el contenido del mensaje de alerta. Apoye las etiquetas HTML a través de innerHTML.',
  'alert.contentProjectionDesc':
    'El componente admite proyección de contenido ng- para estructuras HTML complejas y componentes Angular.',
  'alert.projectionNotice': 'Múltiples errores se enumeran a continuación mediante proyección de contenido:',
  'alert.errUndefined': 'No se puede leer sin definir.',
  'alert.errObject': 'No se puede cargar un objeto.',
  'alert.serverDown': 'El servidor está abajo.',
  'alert.contentSuccess': 'Tengo un contenido exitoso.',
  'alert.contentInfo': 'Tengo un contenido de información',
  'alert.contentWarning': 'Tengo un contenido de advertencia',
  'alert.contentDanger': 'Tengo un contenido de peligro.',
  'alert.contentHtml': '<strong>Hello world</strong>, me gusta clr-lift!',
  'alert.contentSmall': 'Tengo una pequeña alerta.',
  'alert.contentNeutral': 'Yo tengo un contenido neutral',
  'alert.contentLoading': 'Tengo un contenido de carga',
  'alert.contentUnknown': 'Tengo un contenido desconocido.',
  'alert.contentAppLevel': 'Alerta de nivel de aplicación de entrada de contenido',
  'alert.contentAppProjection': 'Alerta de nivel de aplicación de la proyección',
  'alert.btnView': 'Ver',
  'callout.title': 'Callout',
  'callout.overview':
    'El componente <code>cll-callout</code> muestra una caja de notificación informativa diseñada para resaltar notas importantes, consejos, advertencias o instrucciones previas con una visualización responsive de iconos y conciencia del tema.',
  'callout.example1': 'Ejemplo 1: Callout Informacional Básico',
  'callout.example1Desc':
    'Proyecto mensajes de texto simples o más destacados utilizando proyección de contenido predeterminada.',
  'callout.example2': 'Ejemplo 2: Listas y enlaces',
  'callout.example2Desc':
    'Los Callouts manejan listas formateadas e hiperenlaces externos sin problemas, tanto en modo ligero como oscuro.',
  'callout.example3': 'Ejemplo 3: Contenido rico con cabezas y placas',
  'callout.example3Desc':
    'Componer las cabeceras, los párrafos descriptivos, y las placas Clarity dentro del contenedor de proyección de llamada.',
  'callout.example1Note': 'Tenga en cuenta que todos los cambios de configuración surten efecto inmediatamente.',
  'callout.example2Theme': 'Apoya los temas de luz y oscuridad automáticamente.',
  'callout.example2Docs': 'Para más detalles, consulte la documentación del Sistema de Diseño Clarity.',
  'callout.example3Tip': 'Pro Tip for Production Deployments',
  'callout.example3DescText':
    'Garantizar que los límites de los recursos se configuran explícitamente antes de activar el proceso de despliegue.',
  'callout.example3LabelDeployment': 'Despliegue',
  'callout.example3LabelValidated': 'Validada',
  'themeToggle.title': 'Toggle temático',
  'themeToggle.overview':
    'El componente <code>cll-theme-toggle</code> y el <code>ThemeService</code> permiten cambiar de forma fluida entre los modos claro y oscuro de Clarity con reactividad mediante Signal y persistencia en localStorage.',
  'themeToggle.callout':
    'El botón de palanca hace automáticamente un icono de luna en modo luz y un icono de sol en modo oscuro, incluyendo puntas de herramientas localizadas y anuncios de etiqueta de aria-accesibles.',
  'themeToggle.example1Badge': 'Toggle interactivo',
  'themeToggle.example1Desc':
    'Haga clic en el botón de palanca para cambiar temas y observar la emisión de eventos reactivos:',
  'themeToggle.currentTheme': 'Tema actual Signal:',
  'themeToggle.inspectorTitle': 'Tema Signal Inspector',
  'themeToggle.inspectorDesc': 'Estado vivo sincronizado con document.body y localStorage',
  'themeToggle.example2Badge': 'Control programático',
  'themeToggle.example2Desc':
    'Utilice ThemeService para leer el tema actual de forma reactiva o programática, establecer un tema específico:',
  'themeToggle.setLight': 'Set Light Theme',
  'themeToggle.setDark': 'Set Dark Tema',
  'themeToggle.example3': 'Ejemplo 3: Selectores CSS / SCSS para el juego de temas',
  'themeToggle.example3Desc':
    'Componentes y estilos globales pueden apuntar a un tema de cds- = a un oscuro en el cuerpo o a través de: host-context([cds-theme="dark"]):',
  'themeToggle.serviceSummary':
    'Servicio injectable que se ofrece en raíz para la gestión del estado del tema de aplicación.',
  'spinner.title': 'Spinner',
  'spinner.overview':
    'Un spinner es un indicador visual de un proceso en curso iniciado por el usuario. Clarity tiene dos tipos de spinners, cada uno con su propio caso de uso: <strong>Spinners de página</strong> para rastrear el progreso de una operación relacionada con toda una página, y <strong>Spinners en línea</strong> para rastrear el progreso de una operación relacionada con un componente específico.',
  'spinner.example1': 'Ejemplo 1: Espinor predeterminado',
  'spinner.example1Desc': 'El deslizador predeterminado está centrado, grande, y tiene una pantalla de bloque.',
  'spinner.example2': 'Ejemplo 2: Variaciones de tamaño',
  'spinner.example2Desc':
    'Los spinners se pueden mostrar en diferentes tamaños: grandes (predeterminados), medio, y pequeños.',
  'spinner.example3': 'Ejemplo 3: Opciones de alineación',
  'spinner.example3Desc': 'Control de la alineación del spinner a través de la entrada central.',
  'spinner.example4': 'Ejemplo 4: Styling personalizado',
  'spinner.example4Desc': 'Aplicar clases de CSS personalizadas al spinner para un estilo adicional.',
  'spinner.example5': 'Ejemplo 5: Inline Spinner',
  'spinner.example5Desc':
    'Utilice la entrada en línea para mostrar el spinner como un elemento de bloque de línea, útil para alinear las espineras dentro del texto u otros elementos de línea.',
  'spinner.large': 'Grande (por defecto):',
  'spinner.medium': 'Mediano:',
  'spinner.small': 'Pequeño:',
  'spinner.centered': 'Encendido (por defecto):',
  'spinner.leftAligned': 'Alineados de izquierda:',
  'spinner.loading': 'Cargando...',
  'tooltip.title': 'Punto de herramientas',
  'tooltip.overview':
    'El componente Tooltip proporciona una forma flexible para mostrar información adicional, pistas o contenido interactivo. Soporta acciones de hover y copia dentro del contenido del popover, opciones de retraso configurables, posicionamiento automático, atrapamiento de enfoque para accesibilidad, interacción al hacer clic fuera, operaciones con teclado y soporte para modo oscuro.',
  'tooltip.example1': 'Ejemplo 1: punta de herramientas básica',
  'tooltip.example1Desc':
    'En este uso, usted puede simplemente añadir una punta de herramientas especificando el contenido directamente o a través de la directiva de atributos cllTooltipContent. Configuración adicional como el retraso de la piel y la anchura se puede personalizar según sus requisitos.',
  'tooltip.example2': 'Ejemplo 2: punta de herramientas con contenido dinámico',
  'tooltip.example2Desc':
    'Toolphip acepta el contenido dinámico proporcionado a través de plantillas Angular. Puede especificar las plantillas utilizando plantilla ng-y ligarlas al componente de toolphip para la visualización dinámica.',
  'tooltip.example3': 'Ejemplo 3: Creación de componentes dinámicos',
  'tooltip.example3Desc':
    'La punta de herramientas puede hacer componentes Angular creados dinámicamente utilizando ComponentRef o tipo de componente.',
  'tooltip.example4': 'Ejemplo 4: Posiciones de punta de herramientas',
  'tooltip.example4Desc': 'Apoya 12 orientaciones de colocación diferentes con detección inteligente de colisión.',
  'tooltip.apiSummary':
    'Directiva para agregar funcionalidad de tooltip a elementos con posicionamiento automático y detección de colisión.',
  'tooltip.basic1': 'Nota de herramientas básica 1',
  'tooltip.basic2': 'Punto de herramientas básico 2 con Delay 500ms',
  'tooltip.empty': 'Contenido vacío Won no mostrar punta de herramientas',
  'tooltip.templateHover': 'Ejemplo TemplateRef Hover',
  'tooltip.templateText': 'Una gran punta de herramientas:',
  'tooltip.templateCallout': 'También puedes poner un componente dentro de la plantilla ng-',
  'tooltip.contextCallout':
    'cllTooltipContentContext es opcional, es el contexto pasado a la plantilla ng- durante la creación de la vista.',
  'tooltip.componentRefHover': 'Ejemplo de ref componente',
  'toast.title': 'Tostada',
  'toast.overview':
    'Los mensajes Toast sirven como una forma amigable para comunicar eventos de prioridad media que los usuarios pueden desear consultar más tarde. Estos mensajes aparecen temporalmente en la pantalla y pueden almacenarse en un panel de notificaciones hasta que se cierren o expiren.',
  'toast.example1': 'Ejemplo 1: Contenedor de tostado de configuración',
  'toast.example1Desc':
    'Para implementar mensajes tostados, importar ToastContainerComponent desde clr-lift e incluir <cll-toast-container [timeoutSeconds]="8" /> en su componente raíz.',
  'toast.example2': 'Ejemplo 2: Crear tostada con addToast',
  'toast.example2Desc':
    'Utilice addToast para pasar un objeto tostado con propiedades requeridas (título y descripción) y configuraciones opcionales.',
  'toast.example3': 'Ejemplo 3: Shorthand APIs',
  'toast.example3Desc':
    'Se proporcionan cuatro niveles más cortos de APIs para crear tostadas con tipos de estado distintos:',
  'toast.serviceSummary': 'Servicio de creación y gestión de notificaciones de tostadas.',
  'toast.guidelinesTitle': 'Directrices de uso',
  'toast.doTitle': 'Haz:',
  'toast.do1':
    'Proporcione navegación: Incluya un enlace o ubicación para que los usuarios puedan navegar desde el brindis.',
  'toast.do2':
    'Utilice Timestamps Relativos: Visualice los sellos de tiempo relativos al usuario (por ejemplo, hace 1 hora en lugar de una fecha absoluta).',
  'toast.do3':
    'Mantener los títulos cortos: Utilice un título corto, sucinto (máx 35 caracteres) que transmite el mensaje de alto nivel rápidamente.',
  'toast.do4':
    'Descripciones consumibles: Mantener descripciones concisas (máx. 156 caracteres) para un fácil consumo.',
  'toast.dontTitle': 'No:',
  'toast.dont1': 'Utilice más cerca como una acción: Hacer clic en el botón de cierre debe cerrar el brindis.',
  'toast.dont2':
    'Overcrowd Actions: Limit brindis messages to a maximum of 2 actions; priorize the most important ones.',
  'toast.dont3':
    'Incluir identificadores de objetos en el título: Evitar el uso de identificadores de objetos en el título; utilizarlos sólo en la descripción.',
  'toast.dont4': 'Añadir Icons: Para mantener la claridad, no añadir iconos a los mensajes de tostado.',
  'toast.dont5':
    'Mostrar las tostadas irrelevantes: Visualizar las tostadas sólo cuando la información sigue siendo relevante para el usuario.',
  'toast.optionsTitle': 'Interfaz ToastOptions',
  'toast.containerSummary':
    'Componente de contenedores que tiene todas las notificaciones de tostadas. Debe aparecer sólo una vez en su aplicación.',
  'multiAlerts.title': 'Alertas (Múltiples)',
  'multiAlerts.overview':
    'Frecuentemente es necesario mostrar múltiples alertas, especialmente aquellas de nivel de aplicación ubicadas en la parte superior. La biblioteca clr-lift ofrece dos herramientas esenciales: <code>AlertContainerComponent</code> y <code>AlertService</code> para agregar, eliminar y gestionar alertas de forma programática.',
  'multiAlerts.example1': 'Ejemplo 1: Contenedor de alerta de configuración',
  'multiAlerts.example1Desc':
    'Importar AlertContainerComponent e incluir <cll-alert-container /> por encima de la etiqueta de cabecera Clarity dentro del contenedor principal.',
  'multiAlerts.example2': 'Ejemplo 2: Uso básico',
  'multiAlerts.example2Desc':
    'Importar AlertService y utilizar sus métodos addAlert(), deleteAlert(), o clearAlerts() para la gestión efectiva de alertas.',
  'multiAlerts.example3': 'Ejemplo 3: Uso avanzado con elementos interactivos',
  'multiAlerts.example3Desc':
    'Coloque elementos interactivos (como botones o enlaces) en cualquier posición dentro de su mensaje utilizando contenido con targetSelector, o proporcione botones de acción estructurados.',
  'multiAlerts.example4': 'Ejemplo 4: Demo interactivo',
  'multiAlerts.example4Desc':
    'Trate de añadir diferentes tipos de alertas y alertas de limpieza utilizando los botones siguientes:',
  'multiAlerts.serviceSummary': 'Servicio de gestión de alertas múltiples programáticamente.',
  'multiAlerts.alertTypeTitle': 'Tipo de alerta',
  'multiAlerts.containerSummary':
    'Componente de contenedores que muestra todas las alertas. Debe colocarse por encima de la etiqueta de cabecera Clarity dentro del contenedor principal.',
  'fileReader.title': 'Reader de archivos',
  'fileReader.overview':
    'El componente <code>FileReaderComponent</code> te permite fácilmente explorar y leer el contenido de archivos de texto. Soporta la selección de archivos, la lectura del contenido como texto plano o cadena codificada en base64, la validación del tamaño del archivo y emite eventos cuando se seleccionan o eliminan archivos.',
  'fileReader.example1': 'Ejemplo 1: Reader de archivos básico',
  'fileReader.example1Desc': 'Uso básico con integración de control de forma:',
  'fileReader.example2': 'Ejemplo 2: Reader de archivos de certificado con validación',
  'fileReader.example2Desc': 'lector de archivos con validación de certificado y pantalla de señal de certificado:',
  'fileReader.apiSummary': 'Componente para explorar y leer el contenido de archivos con soporte de validación.',
  'fileReader.feature1': 'Navegación y selección de archivos',
  'fileReader.feature2': 'La lectura de contenido como texto claro o cadena codificada base64',
  'fileReader.feature3': 'Valoración de tamaño de archivo',
  'fileReader.feature4': 'Tratamiento de errores de separación de contenido',
  'fileReader.feature5': 'Integración de control de formularios',
  'keyValueInputs.title': 'Indicaciones de valor clave',
  'keyValueInputs.overview':
    'El componente <code>KeyValueInputsComponent</code> es un componente Angular diseñado para facilitar la entrada de pares clave-valor. Proporciona un formulario dinámico que permite a los usuarios agregar, editar y eliminar pares clave-valor con integración de FormArray, validación en tiempo real y navegación inteligente con teclado.',
  'keyValueInputs.example1': 'Ejemplo 1: Uso básico',
  'keyValueInputs.example1Desc':
    'Crear un formulario con un FormArray y utilizar KeyValueInputsComponent para gestionar pares de valor clave:',
  'keyValueInputs.example2': 'Ejemplo 2: Demo interactivo',
  'keyValueInputs.example2Desc': 'Trate de añadir, editar, y eliminar pares de valor clave en el siguiente formulario:',
  'keyValueInputs.callout':
    'Explora cómo el KeyValueInputsComponent aprovecha el UniqueValidator para realizar validación contra los controles clave. Haga clic aquí para saber cómo se aplica la singularidad en los campos de entrada clave.',
  'keyValueInputs.formOutput': 'Su producción de valor de forma:',
  'keyValueInputs.keyHelper': 'clave de la propiedad del tiempo de ejecución',
  'keyValueInputs.valueHelper': 'valor de propiedad del tiempo de ejecución',
  'keyValueInputs.addText': 'añadir valor clave',
  'keyValueInputs.apiSummary':
    'Componente para gestionar entradas dinámicas de pares clave-valor en formularios Angular.',
  'statusIndicator.title': 'Indicador de estado',
  'statusIndicator.overview':
    'El componente <code>StatusIndicatorComponent</code> muestra un indicador de estado con un icono y texto. Soporta varios tipos de estado (error, éxito, advertencia, desconocido, inactivo, pendiente), tamaños personalizables de iconos y herramientas de tooltip opcionales para proporcionar contexto adicional.',
  'statusIndicator.example1': 'Ejemplo 1: Uso básico',
  'statusIndicator.example1Desc': 'Mostrar indicadores de estado con diferentes tipos de estado y tamaños de icono:',
  'statusIndicator.example2': 'Ejemplo 2: Con punta de herramientas',
  'statusIndicator.example2Desc':
    'Añadir consejos de herramientas a los indicadores de estado para más información contextual:',
  'statusIndicator.types': 'Tipos de estado',
  'statusIndicator.iconSizeTshirt': 'Tamaño del icono (T-Shirt Sizing)',
  'statusIndicator.iconSizeNumber': 'Tamaño del icono (Número)',
  'statusIndicator.statusError': 'Error',
  'statusIndicator.statusSuccess': 'El éxito',
  'statusIndicator.statusWarning': 'Aviso',
  'statusIndicator.statusUnknown': 'Desconocido',
  'statusIndicator.statusInactive': 'Inactivo',
  'statusIndicator.statusPending': 'Pendiente',
  'statusIndicator.tooltipError': 'describir la razón de error',
  'statusIndicator.tooltipSuccess': 'El estado es el éxito',
  'statusIndicator.tooltipWarning': 'estado es advertencia',
  'statusIndicator.tooltipUnknown': 'estado desconocido',
  'statusIndicator.tooltipInactive': 'estado inactivo',
  'statusIndicator.tooltipPending': 'algunos de los que están pendientes',
  'statusIndicator.apiSummary': 'Componente para mostrar indicadores de estado con iconos y texto.',
  'certificate.title': 'Signpost de certificado (Viewer)',
  'certificate.overview':
    'El componente <code>CertificateSignpostComponent</code>, un componente Angular, interpreta una cadena PEM, mostrando el contenido del certificado con un clic en el icono del certificado. Integrado de forma fluida con Clarity, este componente muestra detalles críticos como el estado del certificado, el período de validez, la información del emisor y los valores de hash.',
  'certificate.example1': 'Ejemplo 1: Parsing Raw PEM',
  'certificate.example1Desc': 'Parte y muestra una cadena de certificado PEM cruda:',
  'certificate.example2': 'Ejemplo 2: Parsing PEM (Base64 codificado)',
  'certificate.example2Desc':
    'Cuando las cadenas PEM están codificadas Base64, agarra pemEncoded para descodificar antes de despegar:',
  'idleDetection.utilOverview':
    'La detección de inactividad es el proceso de monitorear la actividad del usuario y determinar cuándo un usuario se vuelve inactivo. Esto es particularmente útil para aplicaciones que requieren que los usuarios permanezcan autenticados, ya que permite que el sistema tome las acciones adecuadas cuando un usuario deja de interactuar con la aplicación, como advertirlo de un vencimiento inminente o autologuearlo después de un período de inactividad.',
  'idleDetection.utilOverviewDesc':
    'El Servicio de Detección de Idle ofrece duraciones de inactividad y de tiempo configurables, reinicio automático de la actividad del usuario, emisión de eventos para fases de inactividad y de tiempo, y apoyo reactivo de programación a través de observables RxJS.',
  'idleDetection.utilExample1Title': 'Ejemplo 1: Configurar detección de Idle a nivel mundial',
  'idleDetection.utilExample1Desc':
    'Configurar duraciones inactivas y de tiempo a nivel mundial utilizando la clase de configuración:',
  'idleDetection.utilPhaseCallout':
    'Hay dos fases de detección ociosa: <strong>fase de detección de idle-</strong> y la <strong>fase de eliminación del tiempo</strong>.',
  'idleDetection.utilPhase1':
    '<strong>Fase de detección de inactividad</strong>: Supongamos que configure <code>idleDurationInSeconds</code> a 5 * 60 (5 minutos). Desde el momento en que no haya ninguna acción en el sitio, entrará en esta fase. Después de 5 minutos, la detección de inactividad terminará, indicando que ha estado inactivo durante mucho tiempo. Puede suscribirse al <code>onIdleEnd()</code> observable, que emitirá en este momento. Una vez que esta fase se complete, entrará en la segunda fase.',
  'idleDetection.utilPhase2':
    '<strong>Fase de tiempo-out</strong>: Cuando entre en esta fase, el conteo regresivo comienza inmediatamente desde el valor de <code>timeoutDurationInSeconds</code>. Puede suscribirse al <code>onCountDown()</code> observable para obtener el valor del conteo regresivo. Cuando el conteo regresivo llega a 0, la <strong>fase de tiempo-out</strong> terminará. Puede suscribirse al <code>onTimeoutEnd()</code> observable para saber cuándo termina la <strong>fase de tiempo-out</strong>. En este punto, puede deslogear al usuario o realizar otras acciones.',
  'idleDetection.utilExample2Title': 'Ejemplo 2: Configuración del módulo',
  'idleDetection.utilExample2Desc': 'Proporcione la configuración en su NgModule:',
  'idleDetection.utilExample3Title': 'Ejemplo 3: Configuración de aplicación independiente',
  'idleDetection.utilExample3Desc': 'Proporcione la configuración en una aplicación independiente:',
  'idleDetection.utilExample4Title': 'Ejemplo 4: Utilice IdleDetectionService en el componente',
  'idleDetection.utilExample4Desc':
    'Suscríbete al servicio, observable, para reaccionar ante acontecimientos inactivos:',
  'idleDetection.utilExample5Title': 'Ejemplo 5: Utilice IdleDetectionComponent',
  'idleDetection.utilExample5Desc':
    'Proporcionamos un componente en <code>clr-lift</code> que muestra un diálogo de Clarity cuando el usuario está inactivo. El diálogo aparecerá cuando termine la fase de detección de inactividad y comience a contar regresivo. Una vez que el conteo regresivo termine, puede conectarse al manejador de <code>timeout</code> en su componente para realizar logica personalizada, como limpiar el token de localStorage y redirigir al usuario a la página de inicio de sesión.',
  'idleDetection.utilExample5ParamDesc':
    'Los parámetros <code>idleDurationInSeconds</code> y <code>timeoutDurationInSeconds</code> son opcionales. Al pasar estos parámetros, sobreescribirán la configuración pasada por <code>provideIdleDetectionConfig</code>.',
  'idleDetection.utilDialogPreview': 'El diálogo parece a continuación:',
  'idleDetection.title': 'Detección de Idle',
  'idleDetection.overview':
    'El componente <code>cll-idle-detection</code> monitorea la inactividad del usuario a través de eventos del DOM (movimiento del ratón, teclas, desplazamientos y toques). Cuando el tiempo de inactividad expire, abre un diálogo de conteo regresivo accesible de Clarity y emite un evento de (timeout).',
  'idleDetection.example1': 'Ejemplo 1: Simulación interactiva de diálogo de Idle',
  'idleDetection.example1Desc':
    'Inicie una simulación rápida de 3-segunda para ver el modal de cuenta atrás de Clarity en acción:',
  'idleDetection.example2': 'Ejemplo 2: Configuración global con provideIdleDetectionConfig',
  'idleDetection.example2Desc':
    'Define los intervalos de aplicación predeterminados, a gran escala, inactivos y de tiempo en appConfig utilizando provideIdleDetectionConfig.',
  'idleDetection.apiSummary':
    'Componente de diálogo de Clarity que muestra el conteo regresivo de tiempo de sesión en caso de inactividad.',
  'idleDetection.inputIdleDuration':
    'Duración de la inactividad en segundos antes de que se muestre el modal de cuenta atrás. Sobrepasa la configuración global si se especifica.',
  'idleDetection.callout':
    'El modal incluye un &quot; Mantenme firmado &quot; En acción que reinicia a todos los timers tras la interacción del usuario. Si el usuario no responde, el evento (Timout) dispara para permitir un registro seguro o redirección de la ruta.',
  'idleDetection.inputTimeoutDuration':
    'Duración de la fase de cuenta atrás en segundos antes de que se produzca el tiempo de sesión. Sobrepasa la configuración global si se especifica.',
  'idleDetection.outputTimeout': 'Emite vacío cuando la cuenta atrás llega a 0 sin reconocimiento del usuario.',
  'idleDetection.serviceSummary':
    'Servicio de seguimiento de la actividad del usuario y detección de períodos inactivos.',
  'idleDetection.methodSetConfig':
    'Establece la configuración de detección inactiva. Sobreescribe la configuración global si está disponible.',
  'idleDetection.methodStartWatching': 'Se está monitoreando la actividad del usuario para la detección inactiva.',
  'idleDetection.methodClearTimers': 'Limpia todos los tiempos activos y deja de monitorizar.',
  'idleDetection.methodOnIdleEnd':
    'Observable que emite cuando la fase de inactividad termina y comienza la cuenta atrás.',
  'idleDetection.methodOnTimeoutEnd': 'Observable que emite cuando el tiempo de cuenta atrás termina.',
  'idleDetection.methodOnCountDown': 'Observable que emite los segundos restantes durante la fase de cuenta atrás.',
  'datagridUtil.title': 'Datagrid Utilities',
  'datagridUtil.overview':
    'El componente de datagrid de Clarity emite un estado cada vez que un usuario interactúa con la paginación, filtros o ordenamiento. Para facilitar la integración con solicitudes de API, convertToHttpParams convierte el estado del datagrid en un objeto de consulta preparado para HttpParams.',
  'datagridUtil.example1': 'Ejemplo 1: Uso de convertToHttpParams',
  'datagridUtil.example1Desc':
    'La función convertToHttpParams transforma un estado Clarity Datagrid en un objeto PageQuery adecuado para HttpParams.',
  'datagridUtil.apiSummary':
    'Convierte un objeto de estado de Clarity Datagrid en un objeto PageQuery adecuado para HttpParams en solicitudes de API.',
  'datagridUtil.paramState':
    'El objeto de estado Clarity Datagrid que contiene información de pasión, clasificación e filtro. Puede ser nulo para la carga inicial.',
  'datagridUtil.returnsDesc':
    'Un objeto PageQuery que contiene página, pageSize, dirección de tipo, y cadenas de filtro en formato FIQL.',
  'datagridUtil.propPage': 'El número de página basado en 1 para la pasión.',
  'datagridUtil.propPageSize': 'El número de artículos a mostrar por página.',
  'datagridUtil.propSortAsc': 'El nombre de campo para ordenar en orden ascendente.',
  'datagridUtil.propSortDesc': 'El nombre de campo para ordenar en orden descendente.',
  'datagridUtil.propFilter': 'La expresión de filtro formateada en formato FIQL.',
  'dgState.overview':
    'El operador <code>dgState</code> es un operador de RxJS diseñado para gestionar las transformaciones de estado de Clarity Datagrid con debounce inteligente y filtrado de duplicados. Evalúa los cambios en los filtros del datagrid y maneja los eventos de desencadenamiento de API de manera eficiente. Cuando los filtros se modifican, el operador introduce un retraso de 500 ms antes de iniciar la llamada a la API, evitando solicitudes excesivas durante una escritura rápida. Para acciones como ordenamiento o paginación, se inicia la llamada a la API inmediatamente sin retraso. El operador también proporciona un parámetro opcional para controlar el uso de <code>distinctUntilChanged</code>. Cuando está habilitado (predeterminado: <code>true</code>), asegura que no se inicie una llamada a la API si el estado del datagrid permanece igual, evitando solicitudes redundantes.',
  'dgState.example1Title': 'Ejemplo 1: Uso básico',
  'dgState.example1Desc':
    'Utilice <code>dgState</code> en su oleoducto observable para gestionar los cambios de estado de datagrid de forma eficiente:',
  'dgState.example1DataDesc':
    'Supongamos que tenemos un API que devuelve la siguiente forma de datos para un datagrid impulsado por serveros:',
  'dgState.example2Title': 'Ejemplo 2: Ejecución de plantillas con seguridad de tipo',
  'dgState.example2Desc': 'Utilice tubo asíntico con <code>@if</code> para mejorar la seguridad de tipo:',
  'dgState.example3Title': 'Ejemplo 3: Ejecución de plantillas alternativas',
  'dgState.example3Desc': 'Utilice el tubo asíntico directamente en su plantilla:',
  'dgState.example4Title': 'Ejemplo 4: Ejemplo en vivo',
  'dgState.example4Desc':
    'A continuación se muestra un ejemplo de trabajo de un datagrid impulsado por serveros que utiliza el operador <code>dgState</code>:',
  'dgState.calloutPrefix': 'Se puede usar el ',
  'dgState.calloutSuffix':
    ' función de utilidad para convertir el estado de datagrid en parámetros HTTP. Ver la documentación para más detalles.',
  'dgState.apiDesc':
    'Operador RxJS para el manejo de transformaciones de estado Clarity Datagrid con un comportamiento de denuncia y opcional distinctUntilChanged.',
  'dgState.paramDesc':
    '<em> (Opcional) </em> Ya sea para permitir el filtrado distinctUntilChanged. Adultos a <code>true</code>. Cuando <code>true</code>, suprime estados duplicados. Cuando <code>false</code>, permite que API llame incluso a estados idénticos.',
  'dgState.returnsDesc': 'Una función de operador que transforma las emisiones del estado de Datagrid.',
  'dgState.behavior1':
    'Ajuste un descuento de 500ms cuando los filtros cambian (para evitar llamadas excesivas de API durante el mecanizado rápido)',
  'dgState.behavior2': 'Hace que API llame rápidamente a la clasificación o a acciones de pasividad (sin desembarque)',
  'dgState.behavior3':
    'Opcionalmente filtra estados consecutivos duplicados cuando <code>enableDistinctUntilChanged</code> es <code>true</code>',
  'dgState.behavior4': 'Se encuentra con un estado nulo para manejar los escenarios de carga inicial',
  'timelineWizard.title': 'Timeline Wizard',
  'timelineWizard.overview':
    'El componente TimelineWizard facilita la construcción de wizards multietapa basados en cronogramas en aplicaciones Angular. Cada paso está representado por un componente dedicado que extiende TimelineBaseComponent, soportando navegación de pasos, validación asincrónica y renderizado dinámico de componentes.',
  'timelineWizard.example1': 'Ejemplo 1: Configuración básica del mago',
  'timelineWizard.example1Desc':
    'En el siguiente ejemplo, el asistente comprende cuatro pasos distintos. El array timelineSteps define el orden secuencial de cada paso. Tres pasos implican entrada de forma, y el paso final resume los datos.',
  'timelineWizard.example2': 'Ejemplo 2: Componente básico de paso',
  'timelineWizard.example2Desc':
    'Cada componente de paso extiende TimelineBaseComponent, especificando el tipo de paso pertinente e inicializando el FormGroup.',
  'timelineWizard.example3': 'Ejemplo 3: Mapping de datos personalizado',
  'timelineWizard.example3Desc':
    'Cuando su modelo FormGroup difiere de la estructura timelineSteps, sobrepase formValueToData y dataToFormValue para mapear bidireccional.',
  'timelineWizard.example4': 'Ejemplo 4: Mapping avanzado de datos con entradas de valor clave',
  'timelineWizard.example4Desc':
    'Caso de uso avanzado que muestra la integración dataToFormValue y formValueToData con KeyValueInputsComponent:',
  'timelineWizard.example4Callout':
    'Para más información sobre KeyValueInputsComponent, visite la página de documentación de entradas de valor clave.',
  'timelineWizard.example5': 'Ejemplo 5: Paso de revisión con API Submission',
  'timelineWizard.example5Desc':
    'Consolidar los datos de los pasos anteriores utilizando TimelineWizardService y anular next$ para construir su flujo API de presentación.',
  'timelineWizard.example5Callout':
    'Puede personalizar el next$ observable en cualquier paso, permitiendo tanto operaciones sincronizadas como asíncronas como peticiones HTTP.',
  'timelineWizard.componentSummary':
    'El principal componente responsable de la gestión del asistente de línea de tiempo.',
  'timelineWizard.baseSummary':
    'La clase base para todos los componentes de paso dentro del asistente de línea de tiempo. Proporciona propiedades esenciales y métodos para gestionar los pasos de asistente.',
  'timelineWizard.stepSummary':
    'Interfaz que define las propiedades de un paso en la configuración del asistente de línea de tiempo.',
  'timelineWizard.serviceSummary':
    'Un servicio que gestiona el estado y los datos del asistente de línea de tiempo a través de los componentes de paso.',
  'timelineWizard.playgroundTitle': 'Despliegue interactivo Mago Playground',
  'timelineWizard.playgroundDesc':
    'Navegar paso a paso a través de la configuración del operador, escalar el servicio, Propiedades a tiempo de ejecución (editor de valor clave), y confirmación final.',
  'timelineWizard.playgroundBadge': 'Flujo de trabajo de la empresa',
  'timelineWizard.requiredInfo': 'Información requerida',
  'timelineWizard.configureOperator': 'Configurar operador',
  'timelineWizard.configureService': 'Servicio de Configurar',
  'timelineWizard.configureRuntimeProperties': 'Configurar propiedades a tiempo de ejecución',
  'timelineWizard.name': 'Nombre',
  'timelineWizard.namespace': 'Namespace',
  'timelineWizard.cpu': 'CPU',
  'timelineWizard.replicas': 'Respuestas',
  'timelineWizard.url': 'URL',
  'poll.overview':
    'El operador <code>poll</code> es un operador personalizado de RxJS que simplifica el proceso de sondar APIs para mantener los datos actualizados. Permite que los desarrolladores creen observables que emitan datos periódicamente en intervalos especificados, abstrayendo la complejidad de gestionar intervalos de sondeo y solicitudes de API. Este operador es especialmente útil cuando se requieren actualizaciones en tiempo real pero el servidor no soporta notificaciones por push (WebSockets, Server-Sent Events, etc.). Integra fácilmente con otros operadores de RxJS, permitiendo a los desarrolladores construir pipelines reactivos para manejar flujos de datos.',
  'poll.example1Title': 'Ejemplo 1: Polling básico',
  'poll.example1Desc':
    'Los datos de poll a un intervalo especificado. La función de votación es compatible con Promise, Observable, o valores primitivos:',
  'poll.example2Title': 'Ejemplo 2: Poll Hasta que la condición es Met',
  'poll.example2Desc':
    'Utilice operadores de RxJS como <code>takeWhile</code> para dejar de votar cuando se cumpla una condición:',
  'poll.example2Callout':
    'Puede añadir <code>takeUntil</code>, <code>takeWhile</code>, u otros operadores RxJS para controlar cuando termine la votación.',
  'poll.example3Title': 'Ejemplo 3: Poll con initialValue',
  'poll.example3Desc':
    "Por defecto, el resultado inicial del sondeo es <code>&#123;status: 'loading', isLoading: true, error: null, data: null&#125;</code>, lo cual es conveniente para mostrar un indicador de carga. Sin embargo, en algunos casos, puede que no desee mostrar un indicador de carga. Puede establecer <code>initialValue</code> en cualquier valor que desee:",
  'poll.example4Title': 'Ejemplo 4: Defier Polling',
  'poll.example4Desc':
    'Por defecto, la votación comienza de inmediato. Utilice la opción <code>delay</code> para demorar el comienzo de la votación:',
  'poll.example4AltDesc':
    'Alternativamente, puedes empezar a votar después de una acción de usuario, combinando <code>poll</code> con otros operadores RxJS:',
  'poll.btnStartPolling': 'Inicio Polling (Ver Consola)',
  'poll.example5Title': 'Ejemplo 5: Refresque de fuerza',
  'poll.example5Desc':
    'Use el observable <code>forceRefresh</code> o el señal para desencadenar la ejecución de <code>pollingFn</code> cuando sea necesario, como en respuesta a acciones del usuario. El valor emitido por <code>forceRefresh</code> se pasará como entrada a <code>paramsBuilder</code> (si se proporciona) o directamente a <code>pollingFn</code>.',
  'poll.example5SignalTitle': 'Reembolso de fuerza basado en Signalh',
  'poll.example5SignalDesc':
    '<code>forceRefresh</code> acepta directamente Angular Signals. Si se producen múltiples actualizaciones mientras está en curso una solicitud, <code>exhaustMap</code> baja los activadores intermedios, pero preserva el parámetro más reciente para la siguiente garrapata programada.',
  'poll.btnRapidFilters': 'Cambios de filtro rápido (quemador 3x)',
  'poll.example6Title': 'Ejemplo 6: Ejemplo avanzado - Datagrid con Polling',
  'poll.example6Desc':
    'Además, cada vez que haya un cambio en la entrada, desencadenar filtrado, clasificación, o pasión, el API será llamado rápidamente, acompañado de un spinner que indica la carga.',
  'poll.searchByFirstName': 'Buscar por Primer Nombre',
  'poll.apiDesc':
    'Los datos de Polls a un intervalo especificado y se pueden activar manualmente. Devuelve un observable que emite el resultado como un objeto AsyncState.',
  'poll.paramPollingFn': 'Una función que devuelve un valor de Observable, Promise, o primitivo.',
  'poll.paramInterval': 'El intervalo en millisegundos entre cada encuesta.',
  'poll.paramForceRefresh': 'Una Observable o Signal que desencadena un refresco manual.',
  'poll.paramParamsBuilder':
    'Una función que construye parámetros para la función de votación basada en el valor forceRefresh.',
  'poll.paramInitialValue': 'Un valor inicial AsyncState.',
  'poll.paramDelay': 'Detener en millisegundos antes de comenzar la primera encuesta.',
  'poll.returnsDesc':
    'Un Observable que emite objetos AsyncState<Data> con las propiedades status, isLoading, error y data.',
  'createAsyncState.overview':
    'El operador <code>createAsyncState</code> transforma un observable de tipo <code>T</code> en un observable de <code>AsyncState&lt;T&gt;</code>, encapsulando los estados de carga, error y datos en una estructura estándar. Esto elimina la necesidad de gestionar variables separadas para los estados de carga, errores y datos, haciendo que su código sea más organizado y mantenible.',
  'createAsyncState.interfaceStructure': 'La estructura de interfaz <code>AsyncState</code> que el operador devuelve:',
  'createAsyncState.example1Title': 'Ejemplo 1: Solicitud simple',
  'createAsyncState.example1Desc': 'Manejar una única solicitud API con los estados de carga y error:',
  'createAsyncState.example2Title': 'Ejemplo 2: Con Callbacks',
  'createAsyncState.example2Desc': 'Añada efectos secundarios para el éxito y los escenarios de error:',
  'createAsyncState.example3Title': 'Ejemplo 3: Proporcionando initialValue',
  'createAsyncState.example3Desc':
    'En escenarios donde usted tiene datos iniciales (por ejemplo, desde el estado de la ruta), usted puede proporcionar un valor inicial para evitar mostrar un spinner de carga. Esto es útil al navegar de una lista a una página de detalles donde usted ya tiene algunos datos:',
  'createAsyncState.example3Callout':
    "Al proporcionar <code>initialValue</code>, establezca <code>status: 'idle'</code> y <code>isLoading: false</code> para evitar que aparezca el spinner de carga. Los datos se actualizarán sin problemas cuando la llamada API termine.",
  'createAsyncState.example4Title': 'Ejemplo 4: Solicitudes de dependencia',
  'createAsyncState.example4Desc': 'Encadena múltiples peticiones utilizando <code>switchMap</code>:',
  'createAsyncState.example5Title': 'Ejemplo 5: Uso de la placa',
  'createAsyncState.example5Desc': 'Utilice el tubo asíntico en plantillas para manejar diferentes estados:',
  'createAsyncState.apiSummary': 'Transforma un Observable de tipo T en un Observable de AsyncState<T, E>.',
  'createAsyncState.paramObserver':
    'Función de Callback u objeto observador para el manejo de los efectos secundarios cuando el observable emite valores o errores.',
  'createAsyncState.paramInitialValue':
    'El valor inicial de AsyncState que debe utilizarse antes de que el observable emita su primer valor.',
  'createAsyncState.returnsDesc': 'Una función que transforma un flujo observable en un estado asíncrono.',
  'createAsyncState.stateStatus':
    'Seguimiento de estado detallado: "idle" | "loading" | "reloading" | "resolved" | "error".',
  'createAsyncState.stateIsLoading':
    'Indica si hay una operación de carga en curso (true cuando status es "loading" o "reloading").',
  'createAsyncState.stateError': 'Detalles de error si la operación asíncrona falló, o es nula.',
  'createAsyncState.stateData': 'Datos emitidos por el observable, o nulos.',
  'resourceAsync.paramSourceFn':
    'Una función reactiva que devuelve un valor Observable, Promise, o un valor sincronizado.',
  'resourceAsync.paramOptions': 'Opciones de configuración para el recurso.',
  'resourceAsync.propInitialValue': 'El valor inicial antes de que la primera búsqueda termine.',
  'resourceAsync.propLazy': 'Si es verdadero, inicia en el estado "idle" y espera que se llame reload().',
  'resourceAsync.propBehavior':
    'Gestión de ejecuciones simultáneas: "switch" cancela la ejecución anterior; "exhaust" ignora las nuevas. Valor predeterminado: "switch".',
  'resourceAsync.propOnError': 'El controlador de errores de llamada que puede proporcionar valores de retroceso.',
  'resourceAsync.propThrowOnError': 'Si es verdad, los errores se tiran en lugar de almacenarse en señal de error.',
  'resourceAsync.propOnSuccess': 'Callback invocó cuando la operación termina con éxito.',
  'resourceAsync.propOnLoading': 'Callback invocó cuando la operación comenzó a cargar.',
  'resourceAsync.returnsDesc':
    'Un objeto ResourceRef<T, E> expone valor, error, estado, isLoading, y métodos de mutación.',
  'spinner.apiSummary': 'Componente para mostrar indicadores de carga con tamaños y alineaciones personalizables.',
  'spinner.inputSize': 'Determina el tamaño de la espina:',
  'spinner.inputCenter': 'El eje es un elemento de bloque. Pasar falso para desactivar el cínter.',
  'spinner.inputInline': 'Especifica si el spinner debe ser mostrado como un elemento de bloqueo inline-.',
  'spinner.inputCustomClass': 'Una cadena de clases CSS adicionales que se aplican al espinor.',
  'callout.apiSummary': 'Un componente de alerta basado en el Sistema de Diseño Clarity.',
  'callout.contentProjectionDesc':
    'Proporciona una ranura <ng-content /> predeterminada para hacer contenido HTML personalizado, texto, listas, y componentes.',
  'callout.responsiveTitle': 'Comportamiento responsable',
  'callout.responsiveDesc':
    'El icono decorativo está oculto en pantallas más estrechas que 576px y muestra automáticamente en pantallas más amplias.',
  'callout.themingTitle': 'Teleming',
  'callout.themingDesc':
    'Inherits Clarity theme context and respects Þcds-theme = dark ready for contrasting background, border, and link times.',
  'certificate.pemNote':
    'PEM es un formato de archivo que a menudo se utiliza para almacenar claves criptográficas, certificados, y otros datos seguros. Los archivos PEM suelen tener extensiones como .pem, .crt, .cer, y .key.',
  'certificate.apiSummary': 'Componente para mostrar información de certificado en una señal de Clarity.',
  'certificate.clickIcon': 'Haga clic en el icono del certificado de abajo para ver los detalles del certificado:',
  'certificate.clickCert': 'Haga clic en el icono del certificado:',
  'certificate.inputPem': 'La cadena de certificado PEM-formateada para inspeccionar.',
  'certificate.inputPemEncoded': 'Si la cadena PEM está codificada base64-codificada.',
  'certificate.inputPosition': 'Posición de la señal relativa al icono del gatillo.',
  'certificate.inputShowIcon': 'Un valor booleano para gestionar la visibilidad del icono de estado de certificado.',
  'isPromise.overview':
    'La <code>isPromise</code> es una función de tipo guardado de TypeScript que determina si un valor arbitrario es un <code>Promise</code> o un <code>PromiseLike</code> (un objeto o función que contiene un método <code>then</code> llamable). Permite verificar y acotar el tipo de forma segura en tiempo de ejecución sin lanzar errores en valores nulos o primitivos.',
  'isPromise.callout':
    'Útiles en los cargadores de recursos asíncrónicos, operadores a medida, y servicio flexible APIs que aceptan valores estáticos inmediatos o promesas asíncronas.',
  'isPromise.example1Title': 'Ejemplo 1: Matriz de evaluación de valor interactivo',
  'isPromise.example1Desc':
    'Observe los tipos de datos comunes de JavaScript a tiempo de ejecución, así como los objetos que permiten:',
  'isPromise.thDescription': 'Descripción',
  'isPromise.thExpression': 'Expresión evaluada',
  'isPromise.thResult': 'Resultado isPromise()',
  'isPromise.example2Title': 'Ejemplo 2: Patrón de corte de tipo seguro',
  'isPromise.example2Desc':
    'En TypeScript, el control con <code>if (isPromise(val))</code> limita automáticamente el tipo dentro del bloque:',
  'isPromise.apiSummary': 'Función de tipo guardado de TypeScript que verifica contratos de PromiseLike.',
  'isPromise.paramObj': 'El valor de inspeccionar.',
  'isPromise.returnsDesc':
    'verdad si la entrada es no-null, es un objeto o función, e implementa un método llamable entonces; falso de otra forma.',
  'isEmpty.overview':
    'La <code>isEmpty</code> es una función utilidad que verifica si una cadena, objeto o array está vacío. Devuelve <code>true</code> para valores vacíos y <code>false</code> para valores no vacíos.',
  'isEmpty.example1Title': 'Ejemplo 1: Uso básico',
  'isEmpty.example1Desc': 'Compruebe si varios tipos de valores están vacíos:',
  'isEmpty.example2Title': 'Ejemplo 2: Casos de uso común',
  'isEmpty.example2Desc': 'Utilice <code>isEmpty</code> en lógica condicional:',
  'isEmpty.apiSummary': 'Verifica si una cadena, objeto o array está vacío.',
  'isEmpty.paramValue': 'El valor para comprobar. Puede ser una cadena, objeto, matriz, u otro valor.',
  'isEmpty.returnsDesc':
    'verdadero si el valor está vacío (cadena vacía, objeto vacío, matriz vacía, nula, o no definida), falso de otra forma.',
  'isEqual.overview':
    'La <code>isEqual</code> es una función utilidad que realiza una comparación de igualdad profunda entre dos valores. Compara valores primitivos, arrays y objetos de forma recursiva para determinar si son estructuralmente iguales, sin importar la igualdad por referencia.',
  'isEqual.example1Title': 'Ejemplo 1: Uso básico',
  'isEqual.example1Desc': 'Compare varios tipos de valores para la igualdad profunda:',
  'isEqual.example2Title': 'Ejemplo 2: Comparación de objetos profundos',
  'isEqual.example2Desc': 'Compare los objetos anidados y los rayos:',
  'isEqual.apiSummary': 'Realiza una comparación de igualdad profunda entre dos valores.',
  'isEqual.paramValue1': 'El primer valor a comparar.',
  'isEqual.paramValue2': 'El segundo valor a comparar.',
  'isEqual.returnsDesc':
    'verdad si los valores son profundamente iguales, falsos de otra forma. Se hace una comparación recursiva para objetos y rayos.',
  'differenceInDays.overview':
    'La <code>differenceInDays</code> es una función utilidad que calcula el número de días enteros entre dos fechas. Simplifica cálculos de fechas en JavaScript al aceptar tipos de entrada flexibles. El primer parámetro representa la fecha de referencia desde la cual se mide la diferencia, y el segundo parámetro indica la fecha a comparar con respecto a la fecha de referencia. Ambos parámetros aceptan <code>Date</code> objects, números que representan milisegundos desde el epoch Unix, o cadenas que se pueden parsear con el constructor <code>Date</code>.',
  'differenceInDays.example1Title': 'Ejemplo 1: Calcular días entre fechas',
  'differenceInDays.example1Desc':
    'Calcular el número de días enteros entre dos fechas utilizando diferentes tipos de entrada:',
  'differenceInDays.example2Title': 'Ejemplo 2: Calcular días de hoy',
  'differenceInDays.example2Desc': 'Calcular el número de días desde hoy hasta una fecha específica:',
  'differenceInDays.apiSummary': 'Calcula el número de días enteros entre dos fechas.',
  'differenceInDays.paramDateLeft':
    'La fecha de referencia. Puede ser un objeto de fecha, un sello de tiempo (millisegundos), o una cadena de fecha parseable.',
  'differenceInDays.paramDateRight':
    'La fecha para comparar con la fecha de referencia. Acepta los mismos tipos que dateLeft.',
  'differenceInDays.returnsDesc':
    'El número de días enteros entre las dos fechas. Devuelve un número positivo si dateLeft es más tarde que dateRight, y negativo si dateLeft es más temprano.',
  'pickBy.overview':
    'Las funciones utilidad <code>pickBy</code> y <code>omitBy</code> permiten crear nuevos objetos seleccionando o excluyendo propiedades basándose en una función predicada. <code>pickBy</code> crea un objeto compuesto por propiedades que satisfacen una condición dada, mientras que <code>omitBy</code> es el opuesto, creando un objeto compuesto por propiedades que no satisfacen la condición.',
  'pickBy.example1Title': 'Ejemplo 1: pickBy',
  'pickBy.example1Desc': 'Crear un objeto compuesto de propiedades de objeto que satisfagan una condición dada:',
  'pickBy.example2Title': 'Ejemplo 2: omitBy',
  'pickBy.example2Desc':
    '<code>omitBy</code> es lo contrario de <code>pickBy</code>, creando un objeto compuesto de propiedades que no satisfagan la condición dada.',
  'pickBy.apiSummary': 'Crea un objeto compuesto por propiedades del objeto que satisfacen una condición dada.',
  'pickBy.paramObject': 'El objeto fuente para elegir propiedades de.',
  'pickBy.paramPredicate':
    'Una función que determina cuáles propiedades a incluir. Retorna verdadero a incluir, falso a excluir.',
  'pickBy.returnsDesc': 'Un nuevo objeto que contenga sólo las propiedades que satisfagan el predicado.',
  'omitBy.apiSummary': 'Crea un objeto compuesto por propiedades del objeto que no satisfacen una condición dada.',
  'omitBy.paramObject': 'El objeto fuente a omitir propiedades de.',
  'omitBy.paramPredicate':
    'Una función que determina cuáles propiedades para omitir. Devuelve verdadero a omitir, falso para retener.',
  'omitBy.returnsDesc': 'Un nuevo objeto que contiene sólo las propiedades que no satisfacen el predicado.',
  'url.title': 'URL Utilities',
  'url.overview':
    'ngx-lift proporciona varias funciones utilidad para trabajar con URLs: <code>isIP</code> y <code>isFQDN</code> para verificar tipos de nombres de host, <code>isURL</code> para validar URLs, y <code>isHttps</code> para verificar el protocolo HTTPS. Estas utilidades son útiles para validación de URLs, comprobaciones de seguridad y lógica condicional basada en propiedades de URL.',
  'url.example1': 'Ejemplo 1: Compruebe el tipo de nombre de huésped (isIP ref isFQDN)',
  'url.example1Desc':
    'Compruebe si un nombre de hostname URL es una dirección IP o un nombre de dominio totalmente calificado (FQDN):',
  'url.example1Callout':
    'Puede utilizar el constructor <code>URL</code> para obtener el nombre de hostname, pero recuerde usar try-catch para el manejo de errores.',
  'url.example2': 'Ejemplo 2: Validar URLs (isURL-isHttps)',
  'url.example2Desc':
    '<code>isURL</code> se utiliza para verificar si un URL es válido. <code>isHttps</code> se utiliza para comprobar si el URL comienza con https.',
  'url.example2Callout': 'También proveemos tubo <code>isHttps</code> para su uso en plantillas.',
  'url.isIPSummary': 'Comprueba si un nombre de huésped es una dirección IP.',
  'url.isFQDNSummary': 'Comprueba si un nombre de hostname es un nombre de dominio totalmente calificado (FQDN).',
  'url.isURLSummary': 'Comprueba si una cadena es un URL válido.',
  'url.isHttpsSummary': 'Comprueba si una cadena URL utiliza el protocolo HTTPS.',
  'urlValidator.title': 'urlValidator-httpsValidator',
  'urlValidator.overview':
    'Las funciones <code>urlValidator</code> y <code>httpsValidator</code> son validadores de Angular utilizados para verificar si una cadena dada cumple con patrones específicos de URL. La <code>urlValidator</code> valora URLs que comienzan con http o https, mientras que la <code>httpsValidator</code> valora únicamente URLs con HTTPS.',
  'urlValidator.example1': 'Ejemplo 1: URL Validador',
  'urlValidator.example1Desc': 'Validar URLs que comienza con http o https:',
  'urlValidator.example2': 'Ejemplo 2: HTTPS Validador',
  'urlValidator.example2Desc': 'Validar sólo HTTPS URLs:',
  'urlValidator.example3': 'Ejemplo 3: Ejemplo completo de forma',
  'urlValidator.example3Desc': 'Ejemplo completo con ambos validadores en forma reactiva:',
  'urlValidator.urlLabel': 'URL',
  'urlValidator.urlHelper': 'Proporcione un URL válido',
  'urlValidator.urlError': 'Por favor, introduzca un URL válido (empezando por https o http)',
  'urlValidator.httpsLabel': 'HTTPS-solo URL',
  'urlValidator.httpsHelper': 'Proporcione un https URL',
  'urlValidator.httpsError': 'Por favor, introduzca un https URL',
  'urlValidator.summary': 'Validador Angular que verifica si una cadena es un URL válido empezando por http o https.',
  'urlValidator.httpsSummary': 'Validador Angular que verifica si una cadena es un HTTPS válido URL.',
  'urlValidator.returns':
    'Una función de validador que devuelve {invalidUrl: verdadero} si el URL es inválido, o nulo si es válido.',
  'urlValidator.httpsReturns':
    'Una función de validador que devuelve {invalidUrl: verdadero} si el URL no es HTTPS, o es nulo si es válido.',
  'startWithTap.overview':
    'El operador <code>startWithTap</code> ejecuta una llamada asincrónica antes de cada suscripción al Observable de origen. A diferencia de operaciones tap eagaras o código de inicialización de pipeline, construir el pipeline no ejecuta la llamada asincrónica hasta que ocurre una suscripción. Cualquier excepción en la llamada asincrónica entra al canal de error del Observable.',
  'startWithTap.callout':
    'Ideal para activar los efectos laterales de inicialización, fijar indicadores de carga, reiniciar errores anteriores, o registrar los sellos de tiempo de envío inmediatamente cuando se suscribe un flujo Observable.',
  'startWithTap.example1Title': 'Ejemplo 1: Despacho interactivo de solicitud con indicador de carga',
  'startWithTap.example1Desc':
    'Haga clic en Trigger Request para suscribirse a un simulado 900ms retrasado Observable. <code>startWithTap</code> corre de forma sincronizada en el momento de la suscripción para activar el spinner de carga:',
  'startWithTap.btnTrigger': 'Trigger Request',
  'startWithTap.btnClearLog': 'Despejado',
  'startWithTap.fetchingData': 'Fetching data...',
  'startWithTap.loadedPayload': 'Carga útil cargada:',
  'startWithTap.example2Title': 'Ejemplo 2: Ejecución de pipelina diferida',
  'startWithTap.example2Desc':
    'La llamada se aplaza hasta el tiempo de suscripción, lo que significa que los flujos reutilizables o las tuberías compartidas pueden definirse antes de tiempo sin ejecutar los efectos secundarios prematuramente:',
  'startWithTap.apiSummary': 'El operador MonoTypeOperatorFunction ejecuta un callback al suscribirse.',
  'startWithTap.paramCallback':
    'Función ejecutada de forma sincronizada antes de que la fuente Observable comience a emitir.',
  'startWithTap.returnsDesc':
    'Una función de operador RxJS que ejecuta la llamada a la suscripción y devuelve la fuente Observable sin cambios.',
  'switchMapWithAsyncState.overview':
    'El operador <code>switchMapWithAsyncState</code> combina las funcionalidades del <code>switchMap</code> y del <code>createAsyncState</code> en un solo operador. Está especialmente diseñado para escenarios donde se necesita disparar una solicitud a un API basada en acciones del usuario (como clics en un botón) y pasar de manera suave entre flujos. Creando una estructura <code>AsyncState</code> para encapsular la respuesta del API, este operador ofrece una aproximación eficiente y fluida para gestionar operaciones asincrónicas.',
  'switchMapWithAsyncState.example1Title': 'Ejemplo 1: Filtro Usuarios por Género',
  'switchMapWithAsyncState.example1Desc':
    'Seleccionar un género diferente polulará la lista de usuarios en consecuencia:',
  'switchMapWithAsyncState.example2Title': 'Ejemplo 2: Presentación de forma con estado de carga',
  'switchMapWithAsyncState.example2Desc':
    'Presentar el formulario utilizando <code>switchMapWithAsyncState</code> y <code>toSignal</code>. La presentación siempre emitirá un error porque el API está diseñado para simular un error.',
  'switchMapWithAsyncState.apiSummary':
    'Combina switchMap y createAsyncState para transformar un flujo de observables en AsyncState mientras se pasa a un nuevo observable interno.',
  'switchMapWithAsyncState.paramProject':
    'Una función que recibe cada valor de la fuente observable y devuelve un Observable, Promise, u otro ObservableInput.',
  'switchMapWithAsyncState.returnsDesc':
    'Una observable que emite AsyncState<R> objetos, manipulación automática de carga, error, y estados de datos.',
  'combineLatestEager.overview':
    'El operador RxJS <code>combineLatest</code> requiere que todos los fuentes emitan al menos una vez, lo cual puede ser problemático cuando se usan fuentes <code>Subject</code> que pueden no emitir inicialmente. <code>combineLatestEager</code> extiende <code>combineLatest</code> al agregar automáticamente <code>startWith(null)</code> para cada <code>Subject</code> en los fuentes, asegurando que el observable combinado se inicialice correctamente. También puedes establecer el segundo parámetro a <code>true</code> para agregar <code>startWith(null)</code> para todos los observables de fuente, lo cual es útil cuando se manejan muchos observables y no se garantiza la emisión inicial.',
  'combineLatestEager.example1Title': 'Ejemplo 1: Uso básico',
  'combineLatestEager.example1Desc': 'Combine observables, incluidos los sujetos que no puedan emitir inicialmente:',
  'combineLatestEager.example2Title': 'Ejemplo 2: Ejemplo completo con placa',
  'combineLatestEager.example2Desc':
    'Ejemplo completo que muestra cómo usar combineLatestEager con tubo asíntico en plantillas:',
  'combineLatestEager.apiSummary':
    'Combina múltiples observables con emisión eagar, automáticamente manejando fuentes que no emiten valores iniciales.',
  'combineLatestEager.paramSources': 'Una matriz o un objeto de diccionario de observables a combinar.',
  'combineLatestEager.paramStartWithAll':
    '(Opcional) Cuando es cierto, apesta startWith(null) para todas las fuentes, no sólo para los sujetos.',
  'combineLatestEager.returnsDesc':
    'Una observable que emite un conjunto u objeto que contiene los últimos valores de todas las fuentes.',
  'distinctOnChange.overview':
    'El operador <code>distinctOnChange</code> mejora los observables de RxJS al no solo prevenir emisiones duplicadas (como <code>distinctUntilChanged</code>) sino también ejecutar una función de devolución de llamada cuando un valor cambia. Esto es útil en escenarios donde se necesitan realizar efectos secundarios, como mostrar una notificación de toast, cuando un valor cambia después de la emisión inicial.',
  'distinctOnChange.example1Title': 'Ejemplo 1: Uso básico',
  'distinctOnChange.example1Desc': 'Ejecutar una llamada cuando se encuentran valores distintos:',
  'distinctOnChange.example2Title': 'Ejemplo 2: Con el comparador personalizado',
  'distinctOnChange.example2Desc': 'Utilice una función de comparación personalizada para determinar la igualdad:',
  'distinctOnChange.apiSummary':
    'Devuelve un observable que emite valores distintos y consecutivos y ejecuta una función de devolución de llamada cada vez que el valor cambia.',
  'distinctOnChange.paramCallback':
    'Función para ejecutar cuando el valor cambia. Recibe los valores anteriores y actuales.',
  'distinctOnChange.paramComparator':
    '(Opcional) Función para determinar si dos valores se consideran iguales. Defiende a la estricta igualdad (= = =).',
  'distinctOnChange.returnsDesc': 'Una observable que emite valores distintos y ejecuta la llamada a los cambios.',
  'logger.overview':
    'El operador <code>logger</code> es una función utilitaria para observables de RxJS que simplifica el registro de valores emitidos utilizando diferentes métodos del console. Este operador es útil para depuración y monitoreo del comportamiento de tus observables durante el desarrollo.',
  'logger.example1Title': 'Ejemplo 1: Registro básico',
  'logger.example1Desc': 'Valores emitidos mediante console.log:',
  'logger.example2Title': 'Ejemplo 2: Registro de la tabla',
  'logger.example2Desc': 'Valores emitidos mediante console.table para una mejor visualización:',
  'logger.example3Title': 'Ejemplo 3: Otros métodos de consola',
  'logger.example3Desc': 'Utilice otros métodos de consola como advertencia, error, o información:',
  'logger.apiSummary':
    'Un operador de depuración que registra las emisiones en la consola utilizando varios métodos de console.',
  'logger.paramMethod':
    'Opcional: método de consola: "log" | "table" | "warn" | "error" | "info" | "debug". Predeterminado: "log".',
  'logger.returnsDesc': 'Una observable que pasa a través de todos los valores mientras los enciende a la consola.',
  'kubernetesPagination.overview':
    'El operador <code>aggregatePaginatedKubernetesResources</code> y la función <code>fetchPaginatedKubernetesResources</code> automatizan la paginación del lado del cliente para APIs REST de Kubernetes. Inspeccionan el token <code>metadata.continue</code> en las respuestas entrantes, solicitan páginas consecutivas recursivamente hasta que se recuperen todas las páginas, normalizan elementos faltantes o nulos de forma segura y agrupan todos los recursos en un único <code>KubernetesList&lt;T&gt;</code>.',
  'kubernetesPagination.callout':
    'Las API de Kubernetes devuelven colecciones paginadas con un token <code>continue</code> en los metadatos cuando el total de registros supera el <code>limit</code> solicitado. Este operador gestiona todas las solicitudes mediante un único flujo Observable.',
  'kubernetesPagination.example1Title': 'Ejemplo 1: Kubernetes Interactivo',
  'kubernetesPagination.example1Desc':
    'Haga clic en &quot; Fetch Pagated Pods &quot; para desencadenar múltiples páginas automatizadas a través de tres páginas Kubernetes API:',
  'kubernetesPagination.btnFetchPods': 'Fetch Paginated Pods',
  'kubernetesPagination.fetchingPages': 'Páginas de contacto (continuar la muestra)...',
  'kubernetesPagination.pagesFetched': 'Páginas alcanzadas recursivamente:',
  'kubernetesPagination.aggregationComplete': 'Completa de agregación',
  'kubernetesPagination.totalResources': 'Total de recursos:',
  'kubernetesPagination.thPodName': 'Nombre',
  'kubernetesPagination.thNamespace': 'Namespace',
  'kubernetesPagination.thStatus': 'Situación',
  'kubernetesPagination.thPodIp': 'Pod IP',
  'kubernetesPagination.example2Title': 'Ejemplo 2: Self-Contened Fetch function',
  'kubernetesPagination.example2Desc':
    'Utilice <code>fetchPaginatedKubernetesResources</code> cuando desee iniciar y paginar en una sola llamada de función sin construir la Observable inicial manualmente:',
  'kubernetesPagination.aggregateSummary':
    'El operador RxJS que transforma una respuesta inicial de la lista Kubernetes Observable en una lista agregada que contiene artículos de todas las páginas.',
  'kubernetesPagination.fetchSummary':
    'Función de conveniencia que inicia y paga los recursos de Kubernetes en una sola llamada.',
  'kubernetesPagination.paramHttp': 'Angular HttpClient utilizado para solicitar páginas posteriores.',
  'kubernetesPagination.paramEndpoint': 'REST URL del recurso Kubernetes.',
  'kubernetesPagination.paramInitialParams': 'Parámetros de consulta (por ejemplo, límite).',
  'k8sRetryBackoff.configSummary': 'Configuración opcional compartida por el operador y la factoría del interceptor.',
  'k8sRetryBackoff.paramMaxAttempts':
    'Total de intentos incluyendo la petición inicial. Establezca en 1 para deshabilitar reintentos.',
  'k8sRetryBackoff.errorShape':
    'Acepta HttpErrorResponse o un objeto con forma <code>{ status, headers?, error? }</code>, incluyendo una cadena JSON en <code>error</code>. Native fetch no rechaza en HTTP 429: verifica la respuesta y adapta su estado, encabezados y cuerpo analizado. Axios expone estos elementos bajo <code>error.response</code>; adapta los antes de llamar al helper. El helper calcula solo un retraso.',
  'k8sRetryBackoffInterceptor.overrideRules':
    'null utiliza los incumplimientos de interceptor; los falsos deshabilitan las repruebas. Los rebasamientos de Contexto se fusionan con los incumplimientos globales o de fábrica. GET/HEAD/OPTIONS/PUT/DELETE sean elegibles por incumplimiento; POST/PATCH requieren un explícito retryMethods desmontar y poner fin a la idempotencia.',
  'k8sRetryBackoffInterceptor.overrideSimulation':
    'Pruebe una sonda que falla en su primer 429, o una lectura de carga que recibe dos 429 antes de tener éxito. La lectura personalizada usa maxAttempts: 10 y un retardo de respaldo de 200ms; esto permite como máximo nueve reintentos.',
  'k8sRetryBackoffInterceptor.btnWorkloads': 'Probar lectura de carga (10 intentos)',
  'k8sRetryBackoffInterceptor.btnProbe': 'Probar sonda rápida (Exclusión)',
  'k8sRetryBackoff.overview':
    'El operador RxJS <code>retryOnK8sBackoff</code> implementa un reintentamiento automático con retraso para respuestas HTTP 429 (<code>TooManyRequests</code>) de Kubernetes apiserver (como cuando el apiserver watch cache está siendo inicializado con "storage is (re)initializing"). Solo HTTP 429 desencadena un reintentamiento; todos los otros errores (4xx, 5xx, fallos de red) se propagan inmediatamente y sin cambios al suscriptor.',
  'k8sRetryBackoff.callout':
    '<strong>Operator vs. Interceptor: </strong> El operador controla tuberías Observable específicas. El interceptor aplica 429 repruebas a través de métodos HttpClient elegibles; los escritos requieren idempotencia verificada.',
  'k8sRetryBackoff.diffTitle': 'Comparación arquitectónica: Operador vs. Interceptor',
  'k8sRetryBackoff.diffDesc':
    'Ambas herramientas comparten el mismo motor de resolución de retardos de reintento, pero cumplen funciones complementarias:',
  'k8sRetryBackoff.diffColFeature': 'Característica',
  'k8sRetryBackoff.diffColOperator': 'retryOnK8sBackoff (Operador)',
  'k8sRetryBackoff.diffColInterceptor': 'k8sRetryBackoffInterceptor (Interceptor)',
  'k8sRetryBackoff.diffScope': 'Alcance',
  'k8sRetryBackoff.diffScopeOp':
    'Local: Se aplica selectivamente a Observables específicos mediante <code>.pipe(retryOnK8sBackoff(...))</code>.',
  'k8sRetryBackoff.diffScopeInt': 'Global: Automática en todas las peticiones Angular HttpClient',
  'k8sRetryBackoff.diffUseCases': 'Casos de uso objetivo',
  'k8sRetryBackoff.diffUseCasesOp':
    'Flujos de sondeo, trabajadores en segundo plano u observables que no son de HttpClient.',
  'k8sRetryBackoff.diffUseCasesInt':
    'Microservicio Kubernetes estándar / integraciones SPA que requieren resiliencia mundial',
  'k8sRetryBackoff.diffConfig': 'Configuración y exclusión',
  'k8sRetryBackoff.diffConfigOp':
    'Pasado directamente al operador: <code>retryOnK8sBackoff({ maxAttempts, fallbackDelayMs })</code>',
  'k8sRetryBackoff.diffConfigInt':
    'Global en <code>app.config.ts</code> o per-request a través de <code>HttpContextToken</code>',
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
  'k8sRetryBackoff.logTitle': 'Registros de ejecución:',
  'k8sRetryBackoff.btnClearLogs': 'Limpiar registros',
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
  'k8sRetryBackoff.apiSummary':
    'Operador RxJS que reintenta las respuestas HTTP 429 de Kubernetes utilizando retrasos proporcionados por el servidor o un retraso de respaldo.',
  'k8sRetryBackoff.paramConfig': 'Configuración opcional de intentos máximos y retardo de respaldo.',
  'k8sRetryBackoff.delaySummary':
    'Ayuda a la función que extrae el retraso de retracción en millisegundos de una respuesta de error Kubernetes 429, o devuelve nulo si no es repudiable.',
  'k8sRetryBackoff.paramError': 'El error a inspeccionar (HttpErrorResponse u objeto con status/headers/error).',
  'k8sRetryBackoff.paramFallbackDelay': 'Retardo de respaldo en milisegundos si la respuesta no incluye indicación.',
  'k8sRetryBackoffInterceptor.overview':
    '<code>k8sRetryBackoffInterceptor</code> automatiza el reintentamiento de respuestas HTTP 429 de Kubernetes para métodos idempotentes. Respeta Retry-After y detalles.retryAfterSeconds, con retraso exponencial, jitter, presupuestos de espera y deshabilitación de HttpContext. POST/PATCH requieren un opt-in explícito.',
  'k8sRetryBackoffInterceptor.callout':
    '<strong>Protección global con sobrescrituras de solicitud:</strong> Registra el interceptador una vez en <code>app.config.ts</code> para proteger todos los puntos finales. Para solicitudes individuales que deben omitir el reintentamiento o usar límites personalizados, establece el token de contexto <code>K8S_RETRY_BACKOFF_CONFIG</code> en la llamada a <code>HttpClient</code>. Para el control local del pipeline, consulta el operador <code>retryOnK8sBackoff</code>.',
  'k8sRetryBackoffInterceptor.example1Title': 'Ejemplo 1: Registro global de interceptor y simulador interactivo',
  'k8sRetryBackoffInterceptor.example1Desc':
    'Registre el interceptor globalmente en app.config.ts. Todas las peticiones estándar de HttpClient se reintentan automáticamente en HTTP 429:',
  'k8sRetryBackoffInterceptor.selectMode': 'Modo de contexto del interceptor:',
  'k8sRetryBackoffInterceptor.modeDefault':
    'Interceptor global predeterminado (Reintenta 429 con retardo de 1 s, luego 200 OK)',
  'k8sRetryBackoffInterceptor.modeCustom': 'HttpContext (maxAttempts: 2, base: 400ms, igual jitter)',
  'k8sRetryBackoffInterceptor.modeDisabled':
    'Discapacitados a través de HttpContext (K8S _ RETRY _ BACKOFF _ CONFIG: falso)',
  'k8sRetryBackoffInterceptor.btnSend': 'Enviar petición interceptada',
  'k8sRetryBackoffInterceptor.example2Title': 'Ejemplo 2: Personalización por petición y exclusión con HttpContext',
  'k8sRetryBackoffInterceptor.example2Desc':
    'Utilice K8S_RETRY_BACKOFF_CONFIG en HttpContext para configurar límites personalizados o desactivar reintentos en comprobaciones rápidas:',
  'k8sRetryBackoffInterceptor.apiSummary':
    'Interceptor HTTP funcional que aplica retry-on-backoff a respuestas HTTP 429 de Kubernetes.',
  'k8sRetryBackoffInterceptor.factorySummary':
    'Función de fábrica creando un HttpInterceptorFn con configuración de respaldo por defecto personalizada.',
  'k8sRetryBackoffInterceptor.paramDefaultConfig':
    'Configuración predeterminada aplicada a todas las peticiones a menos que se anule mediante HttpContext.',
  'k8sRetryBackoffInterceptor.tokenSummary':
    'HttpContextToken para configurar o desactivar el retroceso de reintento para una petición individual.',
  'ifValidator.overview':
    'ngx-lift proporciona funciones útiles para crear validadores condicionales en Angular Reactive Forms. Los validadores condicionales permiten aplicar funciones de validación especificadas basadas en una condición dada. Hay dos funciones principales exportadas: <code>ifValidator</code> para validadores sincrónicos y <code>ifAsyncValidator</code> para validadores asíncronos.',
  'ifValidator.example1Title': 'Ejemplo 1: Validador obligatorio',
  'ifValidator.example1Desc':
    'Requerir una entrada de la razón y una entrada de correo electrónico sólo cuando se selecciona la opción &quot; Lo siento &quot;. El validador requerido se aplica al control de entrada de texto sólo cuando se elige la opción &quot; Lo siento &quot;.',
  'ifValidator.question': '¿Te gusta esta herramienta?',
  'ifValidator.optLike': 'Por supuesto',
  'ifValidator.optUnlike': 'Lo siento.',
  'ifValidator.emailHelper': 'El campo sólo se requiere cuando usted elige Lo siento',
  'ifValidator.invalidEmail': 'Correo electrónico no válido',
  'ifValidator.reasonLabel': 'Motivo por el que no te gusta',
  'ifValidator.autoRevalidationTitle': 'Revalidación automática:',
  'ifValidator.autoRevalidationDesc':
    'Por defecto, Angular solo reevalúa los validadores de un control cuando el valor propio del control cambia. Pareja con <code>revalidateOnChange([email, reason], choice)</code> o pasa un <code>Signal&lt;boolean&gt;</code> con <code>revalidateOnChange</code> para activar automáticamente la revalidación cada vez que la fuente de la condición se actualice!',
  'ifValidator.example2Title': 'Ejemplo 2: ifAsyncValidator',
  'ifValidator.example2Desc':
    '<code>ifAsyncValidator</code> comparte similitudes con <code>ifValidator</code>, pero difiere en que acepta dos parámetros: la condición y una función AsyncValidation, diseñado específicamente para el manejo de operaciones asíncronas.',
  'ifValidator.apiSummary':
    'Crea un validador condicional que aplica funciones de validación basadas en una condición.',
  'ifValidator.paramCondition':
    'Función que devuelve verdadero para aplicar trueValidatorFn, o falso para aplicar falseValidatorFn.',
  'ifValidator.paramTrueValidatorFn': 'Validador function(s) aplicado cuando la condición es verdadera.',
  'ifValidator.paramFalseValidatorFn': '(Opcional) Validador function(s) aplicado cuando la condición es falsa.',
  'ifAsyncValidator.apiSummary':
    'Crea un validador asíncrono condicional que aplica una función de validación asíncrona basada en una condición.',
  'ifAsyncValidator.paramCondition': 'Función que determina si debe aplicarse el validador asíntico.',
  'ifAsyncValidator.paramAsyncValidatorFn':
    'La función de validador async para ejecutar cuando la condición es verdadera.',
  'intersectionValidator.overview':
    'El <code>intersectionValidator</code> es un validador personalizado para Angular Forms diseñado para asegurar que dos controles de formulario no tengan valores superpuestos. Por ejemplo, podrías tener dos listas de elementos y querer asegurarte de que no contengan duplicados. Cuando haya cualquier superposición entre los arrays, ambos campos y el formulario tendrán el error <code>{intersection: true}</code>.',
  'intersectionValidator.example1Title': 'Ejemplo 1: Validar los rayos no superpuestos',
  'intersectionValidator.example1Desc':
    'Asegurarse de que no se solapen los nombres incluidos y los nombres excluidos. Ambos campos deben volver a los rayos.',
  'intersectionValidator.includedNamespaces': 'Namespaces incluidos',
  'intersectionValidator.excludedNamespaces': 'Namespaces excluidos',
  'intersectionValidator.overlapError': 'Los Namespaces incluidos y los Namespaces excluidos no pueden superponerse',
  'intersectionValidator.overlapAlert': 'Los Namespaces incluidos y los Namespaces excluidos tienen superposiciones',
  'intersectionValidator.returnsDesc':
    "Una función de validador que devuelve <code>{intersection: true}</code> si los rayos se solapan, o <code>null</code> si no. Puede comprobar este error en la forma accediendo a <code>form.errors?.['intersection']</code>.",
  'intersectionValidator.apiSummary':
    'Valida que dos controles de formulario con valores de array no contengan elementos superpuestos.',
  'intersectionValidator.paramArray1Key': 'El nombre del control de primera forma.',
  'intersectionValidator.paramArray2Key': 'El nombre de la segunda forma de control.',
  'uniqueValidator.overview':
    'El <code>uniqueValidator</code> es un validador personalizado para Angular Forms diseñado para verificar la unicidad a través de múltiples campos dentro de un <code>FormArray</code> o <code>FormGroup</code>. Asegura que el valor de cada control sea único entre todos los otros controles dentro del array o grupo.',
  'uniqueValidator.example1Title': 'Ejemplo 1: Array de FormControls',
  'uniqueValidator.example1Desc':
    'Si usted tiene un conjunto de FormControls individuales y quiere garantizar la singularidad, adjunte <code>UniqueValidator.unique()</code> a la FormArray que desea validar.',
  'uniqueValidator.calloutSameValue':
    'Escriba el mismo valor a continuación de los controles y ver el efecto cuando se borre.',
  'uniqueValidator.controlLabel': 'Control',
  'uniqueValidator.controlHelper': 'El valor de control debe ser único',
  'uniqueValidator.duplicated': 'Duplicado',
  'uniqueValidator.example2Title': 'Ejemplo 2: Array of FormGroups with Key-Valour Pairs',
  'uniqueValidator.example2Desc':
    'En una situación más compleja, imagina que tienes un array de <code>FormGroups</code>, cada uno conteniendo pares clave-valor como <code>FormControls</code>. Quieres asegurarte de que los valores de los controles clave (abajo a la izquierda) sean únicos a través de todos los grupos. Para este caso, puedes pasar un selector de control como argumento de <code>UniqueValidator.unique(controlSelector)</code>.',
  'uniqueValidator.keyCallout':
    'Escriba el mismo valor por debajo de los controles clave y ver el efecto cuando se borre.',
  'uniqueValidator.keyPlaceholder': 'control clave',
  'uniqueValidator.keyHelper': 'el control clave debe ser único',
  'uniqueValidator.valuePlaceholder': 'control de valor',
  'uniqueValidator.valueHelper': 'control de valor no tiene validación',
  'uniqueValidator.returnsDesc':
    'Una función de validador que devuelve <code>{notUnique: true}</code> si se encuentran valores duplicados, o <code>null</code> si todos los valores son únicos.',
  'uniqueValidator.usageNotes': 'Notas de uso',
  'uniqueValidator.usageNotesDesc':
    'Trigger el método de control de <code>updateValueAndValidity()</code> según sea necesario para revalidar cuando los valores cambian.',
  'uniqueValidator.apiSummary': 'Valida la unicidad a través de controles de FormArray o valores de array.',
  'uniqueValidator.paramKey':
    '(Opcional) La clave de propiedad para comprobar la singularidad de los artículos de objeto. Si se omite, controla la igualdad primitiva.',
  'dateRangeValidator.overview':
    'El <code>dateRangeValidator</code> es un validador personalizado que valida que una fecha esté dentro de un rango especificado. Soporta la validación tanto para valores de fecha únicamente como para valores de fecha y hora, con límites inclusivos o excluyentes configurables y comparación opcional de tiempo.',
  'dateRangeValidator.example1Title': 'Ejemplo 1: Validación de Rango de Fecha',
  'dateRangeValidator.example1Desc':
    'Valida que una fecha esté entre una fecha mínima y una fecha máxima. Esta configuración asegura que la fecha seleccionada esté entre el 1 de septiembre de 2024 y el 15 de septiembre de 2024 (excluyente), ignorando los componentes de tiempo. El 15 de septiembre no es válido ya que <code>maxInclusive</code> es falso.',
  'dateRangeValidator.example2Title': 'Ejemplo 2: Seleccione una fecha de futuro',
  'dateRangeValidator.example2Desc':
    'A continuación, el ejemplo permite seleccionar una fecha futura e incluir hoy. Para incluir el <code>minDate</code>, configurar <code>minInclusive</code> a <code>true</code>.',
  'dateRangeValidator.expiresRawLabel': 'Fecha de caducidad (entrada de Raw HTML)',
  'dateRangeValidator.minDateError': 'La fecha no puede ser más temprana que {{ minDate }}',
  'dateRangeValidator.futureDaysLabel': 'Futuro 5 días (entrada de fecha de Clarity)',
  'dateRangeValidator.invalidDate': 'La fecha es inválida',
  'dateRangeValidator.maxDateError': 'La fecha no puede ser más tarde que {{ maxDate }}',
  'dateRangeValidator.clarityMax': 'La fecha es demasiado tarde (validación de claridad)',
  'dateRangeValidator.clarityMin': 'La fecha es demasiado temprana (validación de claridad)',
  'dateRangeValidator.minMaxCallout':
    'Podríamos usar el patrón <code>min</code> y <code>max</code> para validar el rango. Sin embargo, esta validación no fallará al escribir un número como 12 o una cadena como 12hhi.',
  'dateRangeValidator.example3Title': 'Ejemplo 3: Validación de la fecha y del intervalo de tiempo',
  'dateRangeValidator.example3Desc':
    'Para validar tanto la fecha como la hora, establece <code>compareTime</code> en verdadero. Con la configuración siguiente, la fecha y la hora seleccionadas deben estar entre el 1 de septiembre de 2024 a las 12 del mediodía UTC y el 2 de septiembre de 2024 a las 12 del mediodía UTC, considerando los componentes de tiempo.',
  'dateRangeValidator.dateTimeExpires': 'Fecha de caducidad',
  'dateRangeValidator.dateTimeMinError': 'La fecha no puede ser más temprana que {{ minDate }}',
  'dateRangeValidator.dateTimeMaxError': 'La fecha no puede ser más tarde que {{ maxDate }}',
  'dateRangeValidator.returnsDesc': 'Una función de validador que se puede utilizar con Angular Reactive Forms.',
  'dateRangeValidator.validationErrors': 'Errores de validación',
  'dateRangeValidator.errInvalidDate':
    'Volvió cuando la fecha es inválida (por ejemplo, 2023-13-01) o el mundo de hola',
  'dateRangeValidator.errMinDate':
    'Volvió cuando la fecha seleccionada es más temprana o igual a la fecha mínima permitida. El valor de error es la fecha mínima permitida formateada como cadena ISO.',
  'dateRangeValidator.errMaxDate':
    'Returned when the selected date is later than or equal to the maximum allowed date. The error value is the maximum allowed date formateed as an ISO string.',
  'dateRangeValidator.apiSummary':
    'Valida que un valor de fecha esté dentro de un rango especificado de minDate y/o maxDate.',
  'dateRangeValidator.paramOptions': 'DateRangeOptions configuración minDate, maxDate, e inclusividad banderas.',
  'dateRangeValidator.optMinDate': 'Fecha mínima aceptable.',
  'dateRangeValidator.optMaxDate': 'Fecha máxima aceptable.',
  'dateRangeValidator.optMinInclusive': 'Ya sea que la fecha mínima sea inclusiva, los defectos a la verdad.',
  'dateRangeValidator.optMaxInclusive': 'Ya sea que la fecha máxima sea inclusiva.',
  'rangePipe.overview':
    'El <code>range</code> pipe genera un array de números dentro de un rango especificado, lo que lo hace ideal para crear opciones de desplegable, controles de paginación o cualquier escenario que requiera secuencias numéricas en plantillas. Cuando se trabaje con plantillas de Angular, puede ser necesario generar un array de números para la iteración. Por ejemplo, si tienes el número 20 y quieres crear un array desde 1 hasta 20 para mostrar en una lista de desplegable, la directiva <code>@for</code> de Angular no puede iterar directamente sobre un número. Aunque podrías generar este array en TypeScript, hay casos en los que generar el array directamente en la plantilla es más conveniente.',
  'rangePipe.callout1':
    'El tubo <code>range</code> crea un conjunto de números (positivos y / o negativos) que progresan desde el comienzo hasta <strong>but not including, end</strong>.',
  'rangePipe.callout2': 'Se utiliza un paso de -1 si se especifica un comienzo negativo sin un final o un paso.',
  'rangePipe.callout3':
    'Si no se especifica el fin, está establecido para empezar con el comienzo, entonces se establece a 0.',
  'rangePipe.callout4':
    'También está disponible una función de utilidad <code>range</code> para su uso en TypeScript, que puede importarse de <code>ngx-lift</code>.',
  'rangePipe.example1Title': 'Ejemplo 1: Rango básico',
  'rangePipe.example1Desc': 'Generar rayos con diferentes valores de inicio y final:',
  'rangePipe.example2Title': 'Ejemplo 2: Con valor de paso',
  'rangePipe.example2Desc': 'Generar rayos con un valor de paso personalizado:',
  'rangePipe.example3Title': 'Ejemplo 3: Array reverso',
  'rangePipe.example3Desc': 'Generar rayos en orden inverso:',
  'rangePipe.example4Title': 'Ejemplo 4: Selección de caída',
  'rangePipe.example4Desc':
    'Generar opciones de conteo CPU para un descenso. Esto es útil al mostrar una lista de computadoras con un número máximo de conteos CPU variable y permitir a los usuarios seleccionar un rango CPU.',
  'rangePipe.cpuLabel': 'Elija el recuento CPU',
  'rangePipe.cpuOption': '{{ count }} CPU(s)',
  'rangePipe.returnsDesc': 'Una gama de números dentro del rango especificado.',
  'rangePipe.apiSummary': 'Pipe de Angular que genera un array de números dentro de un rango especificado.',
  'rangePipe.paramValue':
    'Array especificando el fin, el comienzo, el fin, el comienzo, el fin, el paso, o el comienzo, el final, el paso, el integrador.',
  'isHttpsPipe.overview':
    'El <code>isHttps</code> es un pipe de Angular que verifica si una cadena de URL utiliza el protocolo HTTPS. Es útil para renderizado condicional, validación o comprobaciones de seguridad en plantillas. También existe una función utilitaria <code>isHttps</code> disponible para su uso en TypeScript.',
  'isHttpsPipe.example1Title': 'Ejemplo 1: Uso básico',
  'isHttpsPipe.example1Desc': 'Compruebe si un URL utiliza el protocolo HTTPS:',
  'isHttpsPipe.example2Title': 'Ejemplo 2: Renovación condicional',
  'isHttpsPipe.example2Desc': 'Los componentes de render condicionalmente basados en el estado HTTPS:',
  'isHttpsPipe.example3Title': 'Ejemplo 3: Validación de seguridad',
  'isHttpsPipe.example3Desc': 'Visualizar indicadores de seguridad basados en el protocolo:',
  'isHttpsPipe.apiSummary': 'Pipe de Angular que verifica si una cadena de URL utiliza el protocolo HTTPS.',
  'isHttpsPipe.paramValue': 'La cadena URL para comprobar.',
  'isHttpsPipe.returnsDesc': 'verdadero si el URL utiliza el protocolo HTTPS, falso de otra forma.',
  'arrayJoinPipe.overview':
    'El <code>arrayJoin</code> es un pipe de Angular que une los elementos de un array en una cadena utilizando un separador especificado. Proporciona una forma conveniente para mostrar los datos de un array como cadenas separadas por comas o con delimitadores personalizados en plantillas.',
  'arrayJoinPipe.example1Title': 'Ejemplo 1: Uso básico',
  'arrayJoinPipe.example1Desc': 'Únete a los elementos de la matriz con el separador de coma predeterminado:',
  'arrayJoinPipe.example2Title': 'Ejemplo 2: Separadores personalizados',
  'arrayJoinPipe.example2Desc': 'Utilice separadores diferentes para varios casos de uso:',
  'arrayJoinPipe.example3Title': 'Ejemplo 3: Archivos numéricos',
  'arrayJoinPipe.example3Desc': 'Únete a los rayos numéricos con diferentes separadores:',
  'arrayJoinPipe.apiSummary':
    'Pipe de Angular que une los elementos de un array en una cadena utilizando un separador especificado.',
  'arrayJoinPipe.paramValue': 'La matriz a unirse. Si no es una matriz, devuelve el valor as- es.',
  'arrayJoinPipe.paramSeparator': '(Opcional) La cadena de separador a utilizar entre elementos.',
  'arrayJoinPipe.returnsDesc':
    'Una cadena que contiene los elementos de la matriz unida, o el valor original, si no un matriz.',
  'maskPipe.overview':
    'El <code>mask</code> es un pipe de Angular diseñado para enmascarar datos sensibles de cadena reemplazando los caracteres con asteriscos, mientras preserva un número configurable de caracteres al inicio y final. Es ideal para oscurecer información sensible en interfaces de usuario, como números de tarjetas de crédito, números de teléfono o claves API.',
  'maskPipe.example1Title': 'Ejemplo 1: Uso básico',
  'maskPipe.example1Desc':
    'Máscara cadenas sensibles con configuración predeterminada (6 caracteres visibles al principio y al final):',
  'maskPipe.example2Title': 'Ejemplo 2: Opciones de enmascaramiento personalizado',
  'maskPipe.example2Desc': 'Personalizar el número de caracteres visibles al principio y al final de la cadena:',
  'maskPipe.example3Title': 'Ejemplo 3: Máscara de tarjeta de crédito',
  'maskPipe.example3Desc': 'Máscara números de tarjeta de crédito mientras muestra los últimos 4 dígitos:',
  'maskPipe.example4Title': 'Ejemplo 4: Máscara',
  'maskPipe.example4Desc': 'Visualizar / ocultar datos sensibles:',
  'maskPipe.maskingConditions': 'Condiciones de enmascaramiento',
  'maskPipe.conditionsDesc': 'El tubo se aplica en función de las siguientes condiciones:',
  'maskPipe.cond1':
    'La longitud de la cadena de entrada debe ser mayor que la suma de <code>unmaskedPrefixLength</code> y <code>unmaskedSuffixLength</code>.',
  'maskPipe.cond2': '<code>unmaskedPrefixLength</code> y <code>unmaskedSuffixLength</code> no deben ser negativos.',
  'maskPipe.cond3': 'La opción <code>masked</code> debe ser <code>true</code>.',
  'maskPipe.condFallback': 'Si no se cumple alguna de estas condiciones, la cadena original se devuelve sin cambios.',
  'maskPipe.apiSummary':
    'Pipe de Angular que enmascara datos sensibles de cadena reemplazando los caracteres con asteriscos.',
  'maskPipe.paramValue': 'La cadena de entrada a ser enmascarada.',
  'maskPipe.paramOptions': 'Opciones de configuración para el comportamiento de enmascaramiento.',
  'maskPipe.returnsDesc':
    'La cadena enmascarada, o la cadena original si enmascarada está desactivada o la cadena es demasiado corta.',
  'maskPipe.optUnmaskedPrefixLength': 'Número de caracteres que dejar sin enmascarar al principio. Deficientes a 6.',
  'maskPipe.optUnmaskedSuffixLength': 'Número de caracteres que dejar sin enmascarar al final. Adultos a 6.',
  'maskPipe.optMaskChar': 'Caracter utilizado para enmascarar.',
  'maskPipe.optEnabled': 'Si la enmascarada está habilitada, los defectos son ciertos.',
  'byteConverterPipe.overview':
    'El <code>byteConverter</code> convierte valores numéricos de bytes en cadenas de tamaño de archivo human-readable (por ejemplo, "1.5 MB", "2.3 GB") con formato localizable. Automáticamente maneja la conversión de unidades (BYTE, KB, MB, GB, TB) y admite internacionalización con traducciones para múltiples idiomas incluyendo inglés, francés, chino, japonés, coreano, alemán, español, italiano, portugués y ruso.',
  'byteConverterPipe.example1Title': 'Ejemplo 1: Uso básico',
  'byteConverterPipe.example1Desc': 'Convertir valores byte en formato human-legible:',
  'byteConverterPipe.example2Title': 'Ejemplo 2: Visualización del tamaño del archivo',
  'byteConverterPipe.example2Desc': 'Mostrar tamaños de archivos en un formato fácil de usar:',
  'byteConverterPipe.example3Title': 'Ejemplo 3: Conversiones de diferentes unidades',
  'byteConverterPipe.example3Desc': 'El tubo se convierte automáticamente a la unidad adecuada:',
  'byteConverterPipe.languageSupport': 'Apoyo a los idiomas',
  'byteConverterPipe.languageSupportDesc':
    'El pipe utiliza la identificación de localidad de la aplicación <code>LOCALE_ID</code> para determinar la traducción adecuada de las unidades. Los idiomas soportados incluyen inglés, francés, chino (simplificado y tradicional), japonés, coreano, alemán, español, italiano, portugués (Brasil) y ruso. Si el idioma del navegador no está soportado, el inglés sirve como predeterminado.',
  'byteConverterPipe.i18nCallout':
    'Para configurar el soporte locale, consulte la documentación <a href="https://angular.io/guide/i18n" target="_blank">Angular i18n </a>.',
  'byteConverterPipe.apiSummary':
    'Pipe de Angular que convierte un número de bytes en una cadena formateada human-readable con formato localizable.',
  'byteConverterPipe.paramValue':
    '(Opcional) El número de bytes a convertir. Retorna nulo si es nulo, no definido, o NaN.',
  'byteConverterPipe.returnsDesc':
    'Una cadena formateada con la unidad adecuada (B, KB, MB, GB, TB) basada en la localización, o nula si es inválida.',
  'datagridUtil.transformDesc':
    'La función convierte el estado de datagrid Clarity (que contiene información de pasión, clasificación e filtro) en un objeto PageQuery. Aquí está un ejemplo de la transformación:',
  'datagridUtil.inputTitle': 'Input: Clarity Datagrid State',
  'datagridUtil.outputTitle': 'Producto: Objeto PageQuery',
  'datagridUtil.usageDesc':
    'Utilice convertToHttpParams en su componente para convertir el estado de datagrid para las peticiones de API:',
  'common.save': 'Guardar',
  'common.submit': 'Enviar',
  'statusIndicator.inputIconStatus': 'Estado representado por el icono.',
  'statusIndicator.inputIconSize': 'Tamaño del icono, incluyendo sm, md, lg o una cadena de tamaño del píxel.',
  'statusIndicator.inputTooltip': 'Texto opcional que se muestra en hover o focus.',
  'statusIndicator.inputTooltipPosition': 'Posición de punta de herramientas relativa a su gatillo.',
  'tooltip.componentTypeExample': 'Contenido de tipo de componente',
  'idleDetection.configIdleDuration': 'Los segundos de inactividad antes de que comience la cuenta atrás.',
  'idleDetection.configTimeoutDuration': 'Duración de la cuenta atrás en segundos antes de la hora de salida.',
  'playground.copyFailed': 'Error al copiar. Seleccione y copie el código manualmente.',
  'header.partialLanguage': 'Traducción parcial; los textos faltantes se muestran en inglés.',
  'form.masterPassword': 'Contraseña maestra',
  'form.masterPasswordRequired': 'La contraseña maestra es obligatoria.',
  'grid.refresh': 'Actualizar',
  'grid.firstName': 'Nombre',
  'grid.lastName': 'Apellido',
  'grid.email': 'Correo electrónico',
  'home.claritySetup':
    'Para obtener orientación sobre el establecimiento de Clarity Design System en su proyecto, consulte el',
  'home.clarityDocumentation': 'Documentación del Sistema de Diseño Clarity',
  'resourceAsync.useResource': 'Utilice resourceAsync cuando:',
  'resourceAsync.useComputed': 'Utilice computedAsync cuando:',
  'resourceAsync.preferMutation':
    'Para el servidor escribe, prefiera mutateResource. Las presentaciones de Legacy execute() deben poner perezoso: verdadero, reactivo: falso y comportamiento: escape.',
  'resourceAsync.useRead': 'Administrar operaciones de lectura local (GET), con reload() para reajustar.',
  'resourceAsync.useLocal':
    'Manejar un estado local optimista, valores encadenados o proyectos de forma con set() / update().',
  'resourceAsync.useManual': 'Activar o reactivar de forma explícita una operación con reload(), execute() o reset().',
  'resourceAsync.useStatus': 'Camina inactiva, carga, recarga, resuelto, error y estados locales.',
  'resourceAsync.useLazy': 'Defiende la ejecución inicial con carga perezosa.',
  'resourceAsync.useCancel':
    'Cancún reemplazó los textos con cambio o supresión de operaciones superpuestas con escape.',
  'resourceAsync.useComputedReactive':
    'Recompute automáticamente los datos asínicos cuando las dependencias de la señal cambian.',
  'resourceAsync.useComputedConcurrency': 'Elija el cambio, fusión, concat o escape de forma explícita.',
  'resourceAsync.useComputedValue': 'Exponga una sola señal, con un error explícito o una política throwOnError.',
  'resourceAsync.apiSummary':
    'Crea un recurso reactivo local con estado asincrónico, cancelación, ejecución explícita y actualizaciones locales.',
  'resourceAsync.errorValuePolicy':
    'Cuando ocurre un error, el valor anterior se borra de forma predeterminada. Use preserveValueOnError: true para conservarlo.',
  'resourceAsync.notLoaded': 'Sin cargar',
  'resourceAsync.noData': 'Sin datos',
  'resourceAsync.lastUpdated': 'Última actualización',
  'resourceAsync.topicTitle': 'Tema / Título',
  'resourceAsync.keyConcepts': 'Conceptos clave:',
  'resourceAsync.patternBenefits': 'Beneficios del patrón:',
  'spinner.inputDecorative': 'Decorativo por defecto. Establezca falso para anunciar la carga como un estado.',
  'spinner.inputLabel': 'Etiqueta de estado localizada; incumple el mensaje de carga de construcción.',
  'fileReader.inputControlId': 'ID de la entrada nativa, para asociación con una etiqueta de forma.',
  'fileReader.inputAcceptFiles': 'Este componente lee texto, no archivos binarios arbitrarios.',
  'fileReader.inputEncoded': 'Indica si el contenido devuelto se codifica en Base64.',
  'fileReader.inputTextEncoding':
    'UTF-8 por defecto; elegir latin1 cuando consume las cadenas de base heredada 64 byte.',
  'fileReader.inputMaxSize': 'Tamaño máximo en MiB. Se rechazan archivos ampliados antes de leer.',
  'fileReader.inputDisabled': 'Desactivar la selección de archivos y su eliminación.',
  'fileReader.outputChange': 'Emite texto o base64 después de una selección de archivos exitosa.',
  'k8sRetryBackoff.paramJitter':
    'La estrategia de un jitter, igual espera entre la mitad y el techo exponencial completo.',
  'k8sRetryBackoff.paramHintJitter': 'Más espera aleatoria después de una pista de servidor, en millisegundos.',
  'k8sRetryBackoff.paramMaxDelay': 'Una pista más larga del servidor deja de retomar sin acortar la pista.',
  'k8sRetryBackoff.paramWaitBudget':
    'El presupuesto acumulado de espera programada, excluye el tiempo dedicado a las solicitudes de red.',
  'k8sRetryBackoff.paramMethods': 'POST / PATCH requieren un opt-in explícito e idempotencia endpoint.',
  'k8sRetryBackoff.paramRandom':
    'Fuente aleatoria que devuelve un número finito en más de 0, 1), para la programación determinista.',
  'k8sRetryBackoff.retryContract':
    'Valores predeterminados: cinco intentos, retroalimentación exponencial con jitter igual, hasta 250 ms extra en indicadores del servidor, 30 segundos por espera y 60 segundos de espera programada total. Indicadores de tamaño grande detienen los intentos. Los interceptores repiten métodos idempotentes por predeterminado; POST/PATCH requieren un garantía del endpoint.',
  'k8sRetryBackoff.paramMinDelay':
    'Mínimo espera a cada estrategia de jitter; no puede superar maxDelayMs. Las puntas de servidor están inalteradas.',
  'k8sRetryBackoff.paramStatuses':
    'Estatus HTTP elegible. Otros errores se propagan sin cambios; los estatos adicionales requieren revisión final.',
  'k8sRetryBackoff.paramPredicate':
    'Filtro de error adicional, aplicado después de la comprobación de estado. No permite POST / PATCH por sí mismo.',
  'k8sRetryBackoff.paramLogRetries':
    'Habilitar la reinvestigación después de que el retraso pase los controles presupuestarios de espera.',
  'k8sRetryBackoff.paramLabel':
    'Etiqueta de registro. Las etiquetas de interceptor generadas omiten las cuerdas de consulta y los fragmentos; las etiquetas personalizadas de redacto.',
  'k8sRetryBackoff.paramLogger':
    'Función de registro opcional que recibe attempt, maxRetries, delayMs, error y label. Oculte los datos sensibles de los errores; los fallos del registro no detienen los reintentos.',
  'k8sRetryBackoffInterceptor.postDefault': 'POST: por defecto (no hay retracción)',
  'k8sRetryBackoffInterceptor.postOptIn': 'POST: Kubernetes opt-in explícito',
  'k8sRetryBackoffInterceptor.postGateway': 'POST: puerta 429 (rechazada)',
  'demoApi.key-value-inputs-demo.inputs.formArray':
    'La instancia FormArray del componente padre utilizada para gestionar los pares clave-valor.',
  'demoApi.key-value-inputs-demo.inputs.data':
    'Datos iniciales para prellenar el formulario con pares clave-valor existentes.',
  'demoApi.key-value-inputs-demo.inputs.uniqueKey':
    'Establezca en <code>true</code> para habilitar la validación de clave única. Utiliza <code>UniqueValidator</code> de ngx-lift.',
  'demoApi.key-value-inputs-demo.inputs.keyHelper': 'Texto auxiliar para el campo de entrada de clave.',
  'demoApi.key-value-inputs-demo.inputs.valueHelper': 'Texto auxiliar para el campo de entrada de valor.',
  'demoApi.key-value-inputs-demo.inputs.addText': 'Texto para el botón "Añadir par clave-valor".',
  'demoApi.key-value-inputs-demo.inputs.inputSize': 'Tamaño de los campos de entrada.',
  'demoApi.key-value-inputs-demo.inputs.buttonClass':
    'Clase personalizada para aplicar al botón "Añadir par clave-valor".',
  'demoApi.key-value-inputs-demo.inputs.smartMode':
    'Si se establece en <code>true</code>, el componente creará automáticamente un par clave-valor cuando no haya campos de entrada clave-valor.',
  'demoApi.key-value-inputs-demo.inputs.keyPattern':
    'Si el control de clave necesita pasar un patrón de regex personalizado. Puedes pasar un objeto con dos claves: <code>regex</code> y <code>message</code>. La propiedad <code>message</code> es opcional.',
  'demoApi.key-value-inputs-demo.inputs.valuePattern':
    'Similar a <code>keyPattern</code>, pero utilizada para la validación del control de valor.',
  'demoApi.key-value-inputs-demo.outputs.removeKeyValue':
    'Evento emitido cuando se elimina un par clave-valor. Proporciona el índice del par eliminado.',
  'demoApi.key-value-inputs-demo.outputs.addKeyValue': 'Evento emitido cuando se agrega un nuevo par clave-valor.',
  'demoApi.multi-alerts-demo.methods.addAlert(options: Alert)': 'Agrega una alerta con las opciones especificadas.',
  'demoApi.multi-alerts-demo.methods.deleteAlert(id: symbol)': 'Elimina una alerta por su ID.',
  'demoApi.multi-alerts-demo.methods.clearAlerts()': 'Limpia todas las alertas.',
  'demoApi.multi-alerts-demo.alertProperties.content': 'El mensaje de la alerta. Se admite el formato HTML seguro.',
  'demoApi.multi-alerts-demo.alertProperties.alertType': 'El tipo de alerta.',
  'demoApi.multi-alerts-demo.alertProperties.actions':
    'Botones nativos. Cada acción proporciona <code>label: string</code> y <code>onClick: () => void</code>.',
  'demoApi.multi-alerts-demo.alertProperties.isAppLevel': '¿Es una alerta de nivel de aplicación?',
  'demoApi.multi-alerts-demo.alertProperties.targetSelector':
    'El selector (ID, clase, etc.) de un elemento clickeable (botón, enlace, etc.) dentro del contenido de la alerta.',
  'demoApi.multi-alerts-demo.alertProperties.onTargetClick':
    'La función de devolución de llamada se ejecuta cuando se hace clic en el elemento que coincide con <code>targetSelector</code> dentro del contenido del aviso.',
  'demoApi.theme-toggle-demo.componentInputs.lang':
    'Código de idioma explícito para herramientas de herramientas localizadas.',
  'demoApi.theme-toggle-demo.componentOutputs.changeTheme':
    "Emite <code>ClarityTheme</code> ('light' | 'dark') cada vez que el tema se alternan.",
  'demoApi.theme-toggle-demo.serviceProperties.theme': "Tema activo actual ('light' | 'dark').",
  'demoApi.theme-toggle-demo.serviceMethods.setTheme(newTheme: ClarityTheme)':
    'Establece el tema, lo persiste en almacenamiento y actualiza el DOM.',
  'demoApi.timeline-wizard-demo.wizardInputs.timelineSteps':
    'Una matriz de <code>TimelineStep</code> objetos que representan los pasos del asistente.',
  'demoApi.timeline-wizard-demo.wizardInputs.live':
    'Controla si se destruyen los componentes de paso al hacer clic en los botones previo/siguiente.',
  'demoApi.timeline-wizard-demo.wizardInputs.confirmButtonText':
    'El texto para el botón "Finalizar" en el último paso.',
  'demoApi.timeline-wizard-demo.wizardOutputs.confirmed':
    'Emite todos los datos de los pasos anteriores cuando se hace clic en el botón de finalización en el último paso.',
  'demoApi.timeline-wizard-demo.wizardOutputs.canceled': 'Emite cuando el asistente se cancela.',
  'demoApi.timeline-wizard-demo.wizardOutputs.finished': 'Emite cuando el asistente se completa con éxito.',
  'demoApi.timeline-wizard-demo.wizardMethods.cancel()':
    'Cancela el asistente y emite el evento <code>canceled</code>.',
  'demoApi.timeline-wizard-demo.wizardMethods.nextStep()': 'Mueve al siguiente paso del asistente.',
  'demoApi.timeline-wizard-demo.wizardMethods.previousStep()': 'Mueve al paso anterior del asistente.',
  'demoApi.timeline-wizard-demo.baseProperties.allStepsData':
    'Una matriz que contiene los datos de todos los pasos del asistente. Disponible como una propiedad de entrada, accesible en <code>ngOnInit</code> y en otros hooks de ciclo de vida posterior.',
  'demoApi.timeline-wizard-demo.baseProperties.currentStepData':
    'Los datos del paso actual o <code>null</code> si no están disponibles. Disponible como una propiedad de entrada, accesible en <code>ngOnInit</code> y en otros hooks de ciclo de vida posterior.',
  'demoApi.timeline-wizard-demo.baseProperties.form':
    'El grupo de formularios asociado al paso. Establezca en <code>null</code> para pasos sin formulario. Sobrescriba esta propiedad en su componente de paso.',
  'demoApi.timeline-wizard-demo.baseProperties.next$':
    'Un observable que emite cuando se hace clic en el botón "Siguiente". Sobrescriba este método para realizar acciones personalizadas, como llamadas a APIs.',
  'demoApi.timeline-wizard-demo.baseProperties.stepInvalid': 'Indica si el formulario del paso es inválido.',
  'demoApi.timeline-wizard-demo.baseMethods.formValueToData()':
    'Convierte el valor del formulario del paso en datos. Sobrescriba este método si la estructura de su formulario no coincide con la estructura de los datos del paso.',
  'demoApi.timeline-wizard-demo.baseMethods.dataToFormValue(data)':
    'Convierte los datos del paso en el valor del formulario que puede usarse para <code>patchValue</code>. Sobrescriba este método si la estructura de su formulario no coincide con la estructura de los datos del paso.',
  'demoApi.timeline-wizard-demo.stepProperties.state':
    "El estado del paso de la secuencia de tiempo (por ejemplo, 'no-iniciado', 'actual', 'éxito', 'error').",
  'demoApi.timeline-wizard-demo.stepProperties.header': 'La cabecera del paso de la secuencia de tiempo.',
  'demoApi.timeline-wizard-demo.stepProperties.title':
    'El título del paso de la secuencia de tiempo, que actúa como un identificador (debe ser único). Puede usarse para buscar datos del paso mediante <code>getStepData</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.id':
    'El identificador del paso de la secuencia de tiempo, que actúa como un identificador principal. Si no se proporciona el identificador, se usará el título como identificador en su lugar. Puede usarse para buscar datos del paso mediante <code>getStepData</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.description': 'La descripción del paso de la secuencia de tiempo.',
  'demoApi.timeline-wizard-demo.stepProperties.component':
    'El componente Angular asociado al paso de la secuencia de tiempo. Debe heredar de <code>TimelineBaseComponent</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.data':
    'Datos del paso, que se convertirán en datos del formulario por el componente de secuencia de tiempo y se pasarán al componente del paso como <code>currentStepData</code>.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStepIndex': 'Obtener el índice del paso actual.',
  'demoApi.timeline-wizard-demo.serviceProperties.isFirstStep': 'Verificar si el paso actual es el primer paso.',
  'demoApi.timeline-wizard-demo.serviceProperties.isLastStep': 'Verificar si el paso actual es el último paso.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStep': 'Obtener el objeto del paso actual.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStepData': 'Obtén los datos del paso actual.',
  'demoApi.timeline-wizard-demo.serviceProperties.allStepsData':
    'Obtén los datos de todos los pasos para revisión. Devuelve un array con identificadores y datos de los pasos.',
  'demoApi.timeline-wizard-demo.serviceMethods.getStepData<T>(key: string)':
    'Obtén los datos de un paso específico mediante su id o título. Devuelve <code>null</code> si el paso no se encuentra.',
  'demoApi.toast-demo.methods.addToast(options: ToastOptions)':
    'Crea un mensaje de notificación con las opciones especificadas.',
  'demoApi.toast-demo.methods.success(options: ToastOptions)':
    'Crea una notificación de éxito con las opciones especificadas.',
  'demoApi.toast-demo.methods.info(options: ToastOptions)':
    'Crea una notificación de información con las opciones especificadas.',
  'demoApi.toast-demo.methods.warning(options: ToastOptions)':
    'Crea una notificación de advertencia con las opciones especificadas.',
  'demoApi.toast-demo.methods.error(options: ToastOptions)':
    'Crea una notificación de error con las opciones especificadas.',
  'demoApi.toast-demo.toastOptions.title': 'El título del mensaje de notificación.',
  'demoApi.toast-demo.toastOptions.description': 'La descripción del mensaje de notificación.',
  'demoApi.toast-demo.toastOptions.toastType': 'El tipo de notificación.',
  'demoApi.toast-demo.toastOptions.date': 'Una marca de tiempo relativa (por ejemplo, "1 hora atrás").',
  'demoApi.toast-demo.toastOptions.manualClosable': 'Si la notificación puede cerrarse manualmente.',
  'demoApi.toast-demo.toastOptions.timeoutSeconds':
    'El número de segundos antes de que la notificación se cierre automáticamente. Si no se proporciona, se usa el valor predeterminado del contenedor.',
  'demoApi.toast-demo.toastOptions.primaryButtonText': 'Texto para el botón de acción principal.',
  'demoApi.toast-demo.toastOptions.primaryButtonClick':
    'Función de devolución de llamada para el clic en el botón principal.',
  'demoApi.toast-demo.toastOptions.secondaryButtonText': 'Texto para el botón de acción secundario.',
  'demoApi.toast-demo.toastOptions.secondaryButtonClick':
    'Función de devolución de llamada para el clic en el botón secundario.',
  'demoApi.toast-demo.toastOptions.closed': 'Función de devolución de llamada llamada cuando el toast se cierra.',
  'demoApi.toast-demo.containerInputs.timeoutSeconds': 'Tiempo de espera predeterminado en segundos para los toasts.',
  'demoApi.toast-demo.containerInputs.manualClosable': 'Si los toasts pueden cerrarse manualmente por defecto.',
  'demoApi.toast-demo.containerInputs.topOffset': 'Distancia desde el top de la pantalla en píxeles.',
  'demoApi.tooltip-demo.inputs.cllTooltip':
    'Contenido simple de tipo cadena para la herramienta de ayuda. Puede usarse como abreviatura para <code>cllTooltipContent</code>.',
  'demoApi.tooltip-demo.inputs.cllTooltipContent':
    'El contenido a mostrar en la herramienta de ayuda. Puede ser una cadena, una referencia de plantilla, una referencia de componente o un tipo de componente.',
  'demoApi.tooltip-demo.inputs.cllTooltipContentContext':
    'Objeto de contexto para pasar a la plantilla cuando se utiliza <code>TemplateRef</code> como contenido.',
  'demoApi.tooltip-demo.inputs.cllTooltipWidth': 'Ancho de la herramienta de ayuda en píxeles.',
  'demoApi.tooltip-demo.inputs.cllTooltipPosition':
    "Posición de la herramienta de ayuda en relación con el elemento. Las opciones incluyen 'tooltip-top-right', 'tooltip-top-left', etc.",
  'demoApi.tooltip-demo.inputs.cllTooltipHideDelay':
    'Retraso en milisegundos antes de ocultar la herramienta de ayuda después de salir del ratón.',
  'demoApi.mutate-resource.mutateResourceApiProps.mutation':
    'Función asíncrona o observable ejecutando la operación de escritura en el lado del servidor.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.invalidateTags':
    'Etiquetas para invalidar al escribir con éxito. Programa inmediatamente refetches para consultas activas.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.concurrency':
    'Estrategia para llamadas superpuestas: paralelo (predeterminado), exhaust (conecta en el momento de la escritura), concat (cola).',
  'demoApi.mutate-resource.mutateResourceApiProps.options.injector':
    'Inyectora Angular explícita opcional para la registración de señales fuera del contexto de inyección.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.client':
    'Sobrescritura opcional de QueryClient (predeterminado es el token QUERY_CLIENT).',
  'demoApi.mutate-resource.mutateResourceRefApiProps.value':
    'Señal que contiene el resultado más reciente de la resolución exitosa de una mutación.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.error':
    'Señal que contiene el último error de mutación, o null cuando está saludable.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.status': 'Estado detallado del ciclo de vida de la mutación.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.isLoading':
    'Verdadero mientras se ejecuta la operación de mutación.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.mutate(args)':
    'Dispara la mutación con argumentos y devuelve un Promise que se resuelve con el resultado o la rechazo.',
  'demoApi.query-resource.queryResourceApiProps.definition':
    'Fábrica reactiva con un cargador de Observable o Promise, o undefined para deshabilitar.',
  'demoApi.query-resource.queryResourceApiProps.options.pollInterval':
    'Milisegundos entre solicitudes completadas. Coordinado entre todos los observadores activos.',
  'demoApi.query-resource.queryResourceApiProps.options.injector':
    'Inyectador Angular opcional para la registración de señales fuera del contexto de inyección.',
  'demoApi.query-resource.queryResourceApiProps.options.client':
    'Sobrescritura opcional de QueryClient (predeterminado es el token QUERY_CLIENT).',
  'demoApi.query-resource.queryResourceDefinitionProps.key':
    'Array de valores JSON-compatibles que únicamente identifican la consulta (por ejemplo, ["user", id]).',
  'demoApi.query-resource.queryResourceDefinitionProps.loader':
    'Cargador de datos que recibe { abortSignal, refresh }. Las lecturas de Observable se completan automáticamente después de la primera emisión.',
  'demoApi.query-resource.queryResourceDefinitionProps.tags':
    'Etiquetas opcionales para la invalidación de caché (por ejemplo, [{ type: "users" }]).',
  'demoApi.query-resource.queryResourceDefinitionProps.staleTime':
    'Duración en milisegundos antes de que los datos en caché sean considerados vencidos.',
  'demoApi.query-resource.queryResourceDefinitionProps.gcTime':
    'Duración en milisegundos (predeterminado 5 minutos) para conservar consultas no utilizadas en la caché.',
  'demoApi.query-resource.queryResourceDefinitionProps.cancelOnNoObservers':
    'Si se debe abortar una solicitud en transito si todos los observadores se desmontan antes de la completación.',
  'demoApi.query-resource.queryResourceRefApiProps.value':
    'Señal que mantiene los datos de la consulta resuelta más recientemente.',
  'demoApi.query-resource.queryResourceRefApiProps.error':
    'Señal que mantiene el último error, o null cuando está sano.',
  'demoApi.query-resource.queryResourceRefApiProps.status':
    'Estado detallado: "idle" | "loading" | "reloading" | "resolved" | "error".',
  'demoApi.query-resource.queryResourceRefApiProps.isLoading': 'true cuando status es "loading" o "reloading".',
  'demoApi.query-resource.queryResourceRefApiProps.isStale':
    'Indica si los datos se han invalidado o si ha vencido su período de vigencia staleTime.',
  'demoApi.query-resource.queryResourceRefApiProps.hasValue()':
    "Valor de predicado de narrowing del tipo 'value()' para excluir undefined cuando los datos válidos están presentes.",
  'demoApi.query-resource.queryResourceRefApiProps.reload()':
    'Inicia una actualización en segundo plano sin borrar los datos existentes (status: "reloading").',
  'demoApi.query-resource.queryResourceRefApiProps.execute()':
    'Mantiene una búsqueda fresca inmediata y devuelve una promesa que se resuelve con el resultado.',
  'demoApi.query-resource.queryResourceRefApiProps.destroy()':
    'Deshace este observador sin cancelar consultas compartidas si otros observadores permanecen.',
  'demoApi.resource-async.definitionProperties.params':
    'Función de captura puramente reactiva de parámetros. Las lecturas de señal aquí se registran.',
  'demoApi.resource-async.definitionProperties.loader':
    'Fabrica que recibe los últimos parámetros y el contexto.abortSignal. Las lecturas de señal aquí no se registran.',
  'demoApi.resource-async.optionsProperties.defaultValue':
    'Valor predeterminado antes de la primera búsqueda; garantiza que value() devuelva T (nunca undefined). Aliado para initialValue.',
  'demoApi.resource-async.optionsProperties.preserveValueOnError':
    'Mantiene el último valor recibido o local cuando ocurre un error.',
  'demoApi.resource-async.optionsProperties.reactive':
    'Si los parámetros o fuentes de dependencia desencadenan una re-ejecución automática.',
  'demoApi.resource-async.optionsProperties.injector':
    'Inyector personalizado opcional si se llama fuera de un contexto de inyección ambiental.',
  'demoApi.resource-async.optionsProperties.equal': 'Comparador personalizado pasado a la señal computada subyacente.',
  'demoApi.resource-async.returnsProperties.value': 'El valor actual del recurso.',
  'demoApi.resource-async.returnsProperties.error': 'El error actual, si existe.',
  'demoApi.resource-async.returnsProperties.status':
    "El estado actual: 'idle' | 'loading' | 'reloading' | 'resolved' | 'local' | 'error'.",
  'demoApi.resource-async.returnsProperties.isLoading':
    "Señal que devuelve true si cualquier operación de búsqueda está en curso ('loading' o 'reloading').",
  'demoApi.resource-async.returnsProperties.isIdle':
    "Señal que devuelve true si el recurso está en estado 'idle' (nunca se ha buscado).",
  'demoApi.resource-async.returnsProperties.hasValue()':
    "Valor de estrechamiento de predicado de tipo 'value()' para excluir undefined cuando sea verdadero.",
  'demoApi.resource-async.returnsProperties.reload()':
    'Desencadenar manualmente una actualización del recurso. Ideal para consultas (GET).',
  'demoApi.resource-async.returnsProperties.execute()':
    'Desencadenar manualmente la ejecución devolviendo un Promise awaitable. Ideal para mutaciones (POST/PUT/DELETE).',
  'demoApi.resource-async.returnsProperties.set()':
    'Actualizar manualmente el valor del recurso, pasando el estado a "local".',
  'demoApi.resource-async.returnsProperties.update()':
    'Actualizar el valor del recurso utilizando una función de actualización, pasando el estado a "local".',
  'demoApi.resource-async.returnsProperties.reset()':
    "Restablecer el recurso a su estado inicial de 'idle' y cancelar operaciones en curso.",
  'demoApi.resource-async.returnsProperties.destroy()':
    'Detener permanentemente la observación y cancelar el trabajo pendiente.',
  'demoApi.date-range-validator.optionsProperties.compareTime': '¿Comparar el tiempo también? Predeterminado es falso.',
  'certificate.loading': 'Cargando certificado…',
  'certificate.loadFailed':
    'No se pudieron cargar los detalles del certificado. Actualiza la página e inténtalo de nuevo.',
  'fileReader.validationUnavailable':
    'No se pudo cargar la validación del certificado. Actualiza la página e inténtalo de nuevo.',
  'queryExamples.failureTitle': 'Errores y recuperación',
  'queryExamples.failureIntro': 'Conserva los datos válidos, limita las lecturas y recupera solo lo que falló.',
  'queryExamples.initialFailure': 'Error en la primera lectura',
  'queryExamples.initialFailureMessage': 'Aún no hay datos. Reintenta esta lectura.',
  'queryExamples.refreshFailure': 'Error de actualización con datos conservados',
  'queryExamples.refreshFailureMessage': 'La actualización falló. Se muestra el último resultado correcto.',
  'queryExamples.failureData': 'Último valor correcto: {0}',
  'queryExamples.retryRead': 'Reintentar lectura',
  'queryExamples.failRefresh': 'Hacer fallar una actualización',
  'queryExamples.failObserver': 'Simular error del observador',
  'queryExamples.automaticRetry': 'Reintentos automáticos limitados',
  'queryExamples.retryIntro': 'Dos errores temporales y luego éxito. Los lectores comparten un ciclo de reintentos.',
  'queryExamples.startRetry': 'Iniciar reintento Observable',
  'queryExamples.startPromise': 'Iniciar reintento Promise',
  'queryExamples.deadline': 'Plazo de lectura lógica',
  'queryExamples.deadlineIntro': 'Esta lectura nunca emite datos. El plazo libera su suscripción.',
  'queryExamples.startDeadline': 'Iniciar lectura bloqueada',
  'queryExamples.deadlineMessage': 'La lectura agotó el plazo. Puedes reintentar.',
  'queryExamples.canceledReads': 'Suscripciones canceladas: {0}',
  'queryExamples.partialFailure': '2. Fallo parcial de lista y recuperación granular',
  'queryExamples.mutationFailure': 'Error de escritura',
  'queryExamples.mutationIntro':
    'Las escrituras no se reintentan automáticamente. Esta simulación rechaza antes de aplicar la escritura.',
  'queryExamples.failWrite': 'Enviar escritura fallida',
  'queryExamples.submitWrite': 'Enviar escritura',
  'queryExamples.writeMessage': 'La escritura falló. Se conserva tu entrada.',
  'queryExamples.failureEvents': 'Errores finales de lectura: {0}; diagnósticos del observador: {1}',
  'queryExamples.isInitialErrorDescription': 'True cuando la lectura falla sin datos correctos previos.',
  'queryExamples.isRefreshErrorDescription': 'True cuando falla la actualización y se conservan datos correctos.',
  'queryExamples.updatedAtDescription': 'Marca de tiempo de la última lectura correcta.',
  'queryExamples.failureCountDescription': 'Intentos fallidos de la lectura lógica actual; cero tras el éxito.',
  'queryExamples.failureReasonDescription': 'Último error de intento o error final de plazo.',
  'queryExamples.nextRetryAtDescription':
    'Marca de tiempo del próximo reintento; null durante la lectura o al terminar.',
  'queryExamples.retryDescription': 'Política opcional de reintentos limitados. Desactivada por defecto.',
  'queryExamples.deadlineDescription': 'Plazo total con esperas; false desactiva un plazo heredado.',
  'queryExamples.recoveryFocusDescription':
    'Activar actualización de lecturas observadas y obsoletas al recuperar el foco.',
  'queryExamples.recoveryReconnectDescription':
    'Activar actualización de lecturas observadas y obsoletas al reconectar.',
  'queryExamples.title': 'Consultas con Observable en la práctica',
  'queryExamples.intro':
    'Estos ejemplos usan HttpClient con una API simulada local. Cambie de inquilino para ver datos y cachés independientes.',
  'queryExamples.tenant': 'Inquilino',
  'queryExamples.tenantA': 'Inquilino A',
  'queryExamples.tenantB': 'Inquilino B',
  'queryExamples.parallel': '1. Solicitudes paralelas independientes',
  'queryExamples.health': 'Estado',
  'queryExamples.refresh': 'Actualizar inquilino',
  'queryExamples.fail': 'Hacer fallar la próxima consulta',
  'queryExamples.tenantError': 'La consulta del inquilino falló; los datos en caché siguen disponibles.',
  'queryExamples.retry': 'Reintentar inquilino',
  'queryExamples.dependent': '2. Solicitud dependiente y actualización tras cambios',
  'queryExamples.databases': 'Bases de datos',
  'queryExamples.gate':
    'La consulta espera los datos del inquilino. Los datos en caché siguen disponibles durante la actualización.',
  'queryExamples.name': 'Nombre de la base de datos',
  'queryExamples.create': 'Crear base de datos',
  'queryExamples.createError': 'La creación falló. Reintente la operación.',
  'queryExamples.databaseError': 'La actualización de las bases de datos falló.',
  'queryExamples.retryDatabases': 'Reintentar bases de datos',
  'queryExamples.snapshot': 'observeQueryObservable: {0}, {1} bases de datos',
  'queryExamples.service': '3. Tres consumidores comparten una solicitud',
  'queryExamples.serviceIntro':
    'fetchQueryObservable devuelve un resultado y finaliza. observeQueryObservable emite instantáneas de caché continuamente.',
  'queryExamples.mount': 'Mostrar widgets del servicio',
  'queryExamples.refreshWidgets': 'Actualizar widgets del servicio',
  'queryExamples.widget': 'Widget {0}: inquilino {1}, {2}',
  'queryExamples.counts': 'Número de solicitudes HTTP:',
  'queryExamples.dynamic': '1. Consultas paralelas dinámicas',
  'queryExamples.dynamicIntro':
    'queryResources asigna los ID seleccionados a observadores independientes. Reordenar conserva los observadores; eliminar un ID libera su observador.',
  'queryExamples.one': 'Solo inquilino A',
  'queryExamples.both': 'Ambos inquilinos',
  'queryExamples.reverse': 'Invertir orden',
  'queryExamples.empty': 'Borrar selección',
  'queryExamples.databaseA': 'Base de datos del inquilino A',
  'queryExamples.databaseB': 'Base de datos del inquilino B',
  'queryExamples.initialLoadingDescription': 'True durante la carga sin datos disponibles.',
  'queryExamples.refreshingDescription': 'True durante la actualización conservando la caché.',
  'queryResources.k8sComparisonTitle': '3. Monitorización de flota: Agregación masiva vs. Colección reactiva granular',
  'queryResources.k8sComparisonDesc':
    'Comparación de dos patrones arquitectónicos para supervisar la salud de clústeres Kubernetes distribuidos: Agregación masiva monolítica (queryResource + forkJoin) frente a Colección de consultas granular (queryResources).',
  'queryResources.traditionalTab': 'Enfoque 1: Agregación masiva (queryResource)',
  'queryResources.traditionalDesc':
    'Agrega toda la flota en una única llamada de red. Bloqueo de cabecera: el clúster más lento (APAC Edge @ 1200ms) retrasa la visualización de todos los demás.',
  'queryResources.granularTab': 'Enfoque 2: Colección granular (queryResources)',
  'queryResources.granularDesc':
    'Crea consultas reactivas independientes por clúster. Los clústeres rápidos se renderizan al instante (US-East @ 150ms). Cada clúster puede recargarse de forma aislada.',
  'queryResources.refreshFleet': 'Actualizar toda la flota',
  'queryResources.refreshCluster': 'Actualizar clúster',
  'queryResources.clusterName': 'Nombre del clúster',
  'queryResources.providerRegion': 'Proveedor / Región',
  'queryResources.activeNodes': 'Nodos activos',
  'queryResources.healthStatus': 'Estado',
  'queryResources.latency': 'Latencia',
  'queryResources.actions': 'Acciones',
  'queryResources.revalidatingNotice':
    'Revalidando flota en segundo plano... Los datos existentes permanecen interactivos.',
  'queryResources.headOfLineWarning':
    'Bloqueo de cabecera activo: los 4 clústeres esperan al más lento (APAC Edge ~1200ms). Si un clúster falla, toda la instantánea falla a menos que se aísle manualmente.',
  'queryResources.progressiveNotice':
    'Renderizado progresivo activo: los clústeres rápidos (US-East 150ms, EU-Central 280ms) se muestran interactivos inmediatamente mientras se cargan los enlaces más lentos.',
  'queryResources.comparisonTableTitle': 'Dimensiones arquitectónicas',
  'queryResources.dimTitle': 'Dimensión',
  'queryResources.dimArch': 'Patrón arquitectónico',
  'queryResources.dimArchTraditional': 'forkJoin monolítico / Endpoint agregador',
  'queryResources.dimArchGranular': 'Colección reactiva independiente (queryResources)',
  'queryResources.dimLatency': 'Latencia y renderizado',
  'queryResources.dimLatencyTraditional': 'Bloqueo de cabecera: la interfaz espera al clúster más lento',
  'queryResources.dimLatencyGranular': 'Renderizado progresivo: cada clúster se muestra tan pronto como se recibe',
  'queryResources.dimIsolation': 'Aislamiento de fallos',
  'queryResources.dimIsolationTraditional': 'Todo o nada: un fallo bloquea toda la flota',
  'queryResources.dimIsolationGranular': 'Aislamiento total: un fallo en un clúster no afecta a los demás',
  'queryResources.dimIdentity': 'Claves de caché e identidad',
  'queryResources.dimIdentityTraditional': 'Una única clave monolítica para todos los datos',
  'queryResources.dimIdentityGranular': 'Clave atómica individual por entidad de clúster',
  'queryResources.dimReload': 'Granularidad de recarga',
  'queryResources.dimReloadTraditional': 'Solo recarga de flota completa (desperdicio de ancho de banda)',
  'queryResources.dimReloadGranular': 'Recarga granular por clúster o mediante etiquetas de flota',
  'queryResources.dimCache': 'Reutilización de caché',
  'queryResources.dimCacheTraditional': 'No compartible con vistas de detalle individuales',
  'queryResources.dimCacheGranular': 'Reutilización fluida entre vistas de flota y detalle de clúster',
  'queryResources.prosConsTitle': 'Ventajas y desventajas',
  'queryResources.prosTraditional': 'Fácil cuando el backend ya expone una API agregada; exactamente un viaje de red.',
  'queryResources.consTraditional':
    'Mala experiencia de usuario por acoplamiento de latencia; fallos en cascada; inadecuado para paneles con acciones individuales.',
  'queryResources.prosGranular':
    'Excelente experiencia de usuario gracias a la carga progresiva; aislamiento de errores; acciones granulares y reutilización de caché.',
  'queryResources.consGranular':
    'Mayor cantidad de solicitudes HTTP si la flota es muy grande (se recomienda paginación o división en lotes).',
  'queryResource.thFailures': 'Intentos fallidos',
  'queryResource.thNextRetry': 'Próximo reintento',
  'queryGuide.selection': 'Herramientas relacionadas:',
  'queryGuide.basic': '1. Empezar con una lectura en caché',
  'queryGuide.basicIntro':
    'Capture el inquilino una vez, úselo en key y loader y lea las señales del resultado. Al actualizar se conserva el último valor correcto.',
  'queryGuide.configure': 'Configuración de la aplicación',
  'queryGuide.collectionIntro':
    'Use queryResources para listas cambiantes de lecturas independientes. Cada entrada tiene su propio resultado en caché, estado de carga y controles de recuperación.',
  'queryGuide.empty': 'No hay elementos seleccionados ni lecturas activas de la colección.',
  'queryGuide.partialIntro':
    'Una fila falla mientras la otra sigue disponible. Reintente solo la fila fallida sin volver a consultar las correctas.',
  'queryGuide.collectionContract':
    'La colección es una señal de referencias ordenadas. Reordenar conserva las referencias; eliminar oculta las filas de inmediato y libera observadores al ejecutar el effect. Se rechazan claves canónicas duplicadas.',
  'queryGuide.collectionLimits':
    'Use un tipo de datos por colección y filtre los elementos que no estén listos. Las solicitudes se ejecutan en paralelo sin límite de concurrencia; pagine o limite las selecciones grandes. maxEntries no elimina entradas activas o pendientes.',
  'queryGuide.namingTitle': 'Nombres de referencias de consultas y mutaciones',
  'queryGuide.namingHandles':
    'Use <code>userQuery</code> para una consulta, <code>tenantQueries</code> para una colección y <code>createMutation</code> para una escritura. Reserve <code>user</code> o <code>tenant</code> para los datos resueltos.',

  'computedAsync.failSource': 'Provocar fallo de la fuente',
  'computedAsync.recoverSource': 'Recuperar la fuente',
  'computedAsync.readSignal': 'Leer signal',
  'computedAsync.lastRead': 'Última lectura',
  'computedAsync.notRead': 'Aún no se ha leído',
  'computedAsync.readError': 'La lectura lanzó un error; no se devolvió ningún valor correcto.',
  'computedAsync.readDemoHint':
    'Provoque un fallo y lea el signal. Recupere la fuente y vuelva a leer para comprobar la recuperación.',
};
