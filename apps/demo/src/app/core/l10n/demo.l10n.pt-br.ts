export const ptBRTranslations: Record<string, string> = {
  'header.selectLanguage': 'Selecionar idioma',
  'header.openGitHub': 'Abrir no GitHub',
  'header.codeLicensed': 'Código sob licença',

  'nav.signalUtils': 'Utilitários de Signal',
  'nav.queryMutation': 'Query & Mutation',
  'nav.operators': 'Operadores',
  'nav.interceptors': 'Interceptadores',
  'nav.validators': 'Validadores',
  'nav.pipes': 'Pipes',
  'nav.utilities': 'Utilitários',
  'nav.components': 'Componentes',
  'nav.pageContainer': 'Contêiner de página',
  'nav.timelineWizard': 'Assistente de linha do tempo',
  'nav.alert': 'Alerta',
  'nav.multiAlerts': 'Alertas (Múltiplos)',
  'nav.callout': 'Destaque',
  'nav.spinner': 'Spinner',
  'nav.toast': 'Toast',
  'nav.tooltip': 'Tooltip',
  'nav.themeToggle': 'Alternar tema',
  'nav.fileReader': 'Leitor de arquivos',
  'nav.keyValueInputs': 'Entradas chave-valor',
  'nav.statusIndicator': 'Indicador de status',
  'nav.idleDetection': 'Detecção de inatividade',
  'nav.certificate': 'Visualizador de certificado',
  'nav.datagrid': 'Tabela de dados',
  'nav.byteConverter': 'Conversor de bytes',
  'nav.mask': 'Máscara',
  'nav.arrayJoin': 'Junção de array',
  'nav.range': 'Intervalo',
  'nav.isHttps': 'É Https',
  'nav.differenceInDays': 'Diferença em dias',
  'nav.badgeNew': 'NOVO',
  'nav.badgeUpdated': 'ATUALIZADO',
  'nav.badgePopular': 'POPULAR',
  'nav.badgeCore': 'PRINCIPAL',

  'common.examples': 'Exemplos',
  'common.apiReference': 'Referência da API',
  'common.overview': 'Visão geral',
  'common.parameters': 'Parâmetros',
  'common.returns': 'Retornos',
  'common.signature': 'Assinatura',
  'common.description': 'Descrição',
  'common.basicUsage': 'Uso básico',
  'common.example': 'Exemplo',
  'common.example1': 'Exemplo 1: Uso básico',
  'common.example2': 'Exemplo 2: Com operador pipe RxJS',
  'common.example3': 'Exemplo 3: Lidar com código assíncrono',
  'common.example4': 'Exemplo 4: Injetor desacoplado',

  'playground.beginner': 'Iniciante',
  'playground.intermediate': 'Intermediário',
  'playground.advanced': 'Avançado',
  'playground.copy': 'Copiar',
  'playground.copied': 'Copiado',
  'playground.viewCode': 'Ver código',
  'playground.hideCode': 'Ocultar código',
  'playground.stackedLayout': 'Layout empilhado',
  'playground.splitLayout': 'Layout lado a lado',

  'inspector.liveState': 'Estado do sinal em tempo real',
  'inspector.rawJson': 'JSON de estado bruto',

  'mergeFrom.overview':
    'A função <code>mergeFrom</code> mescla os valores de Observables ou Signals e emite o valor mais recente. Ela também permite modificar o valor emitido usando operadores RxJS antes de ser emitido.',
  'mergeFrom.example1Desc': 'Mesclar múltiplos signals ou observables:',
  'mergeFrom.example2Desc': 'Passe um operador pipe RxJS para manipular os valores emitidos:',
  'mergeFrom.example3Desc':
    'Use a opção <code>startWith</code> ou <code>initialValue</code> para lidar com observables assíncronos:',
  'mergeFrom.example4Desc':
    'Passe um <code>Injector</code> customizado via objeto de opções para criar um sinal mesclado:',
  'mergeFrom.apiSummary': 'Mescla múltiplos Observables ou Signals em um único Signal.',

  // k8sRetryBackoff Operator (pt-BR)
  'k8sRetryBackoff.configSummary':
    'Configuração opcional compartilhada pelo operador e pela fábrica de interceptadores.',
  'k8sRetryBackoff.paramMaxAttempts':
    'Total de tentativas incluindo a requisição inicial. Defina como 1 para desativar repetições.',
  'k8sRetryBackoff.errorShape':
    'Aceita HttpErrorResponse ou um objeto no formato <code>{ status, headers?, error? }</code>, incluindo string JSON em <code>error</code>. O fetch nativo não rejeita em HTTP 429: verifique a Response e adapte status, headers e corpo analisado. O Axios fornece esses dados sob <code>error.response</code>; adapte-os antes de chamar a função auxiliar. O utilitário calcula apenas o atraso.',
  'k8sRetryBackoffInterceptor.overrideRules':
    '<code>null</code> utiliza os valores padrão do interceptador; <code>false</code> desativa repetições. A fábrica mescla a configuração por requisição com seus valores padrão. Este interceptador trata qualquer HTTP 429 do HttpClient independentemente da URL ou método HTTP; desative explicitamente para requisições que devem falhar imediatamente.',
  'k8sRetryBackoffInterceptor.overrideSimulation':
    'Teste uma sonda que falha no primeiro 429 ou uma leitura de carga que recebe dois 429 antes de ter sucesso. A leitura customizada usa maxAttempts: 10 e 200ms de atraso padrão, permitindo até nove repetições.',
  'k8sRetryBackoffInterceptor.btnWorkloads': 'Testar leitura de carga (10 tentativas)',
  'k8sRetryBackoffInterceptor.btnProbe': 'Testar sonda rápida (Exclusão)',

  'k8sRetryBackoff.overview':
    '<code>retryOnK8sBackoff</code> é um operador de repetição RxJS projetado especificamente para os <strong>limites de taxa da API do Kubernetes (HTTP 429 Too Many Requests)</strong>. Ele prioriza dinamicamente o cabeçalho HTTP <code>Retry-After</code> ou o campo <code>details.retryAfterSeconds</code> retornado pelos servidores de API do Kubernetes, utilizando um atraso configurável caso nenhum seja fornecido.',
  'k8sRetryBackoff.callout':
    'Procurando proteção de repetição global para todas as chamadas <code>HttpClient</code>? Confira o <a href="/ngx-lift/interceptors/k8sRetryBackoff"><code>k8sRetryBackoffInterceptor</code></a> para um interceptador funcional sem necessidade de configuração por requisição.',
  'k8sRetryBackoff.diffTitle': 'Comparação arquitetural: Operador vs. Interceptador',
  'k8sRetryBackoff.diffDesc':
    'Ambas as ferramentas compartilham o mesmo mecanismo de cálculo de atraso de repetição, mas desempenham papéis complementares:',
  'k8sRetryBackoff.diffColFeature': 'Recurso',
  'k8sRetryBackoff.diffColOperator': 'retryOnK8sBackoff (Operador)',
  'k8sRetryBackoff.diffColInterceptor': 'k8sRetryBackoffInterceptor (Interceptador)',
  'k8sRetryBackoff.diffScope': 'Escopo',
  'k8sRetryBackoff.diffScopeOp':
    'Local: Aplicado seletivamente a Observables específicos via <code>.pipe(retryOnK8sBackoff(...))</code>.',
  'k8sRetryBackoff.diffScopeInt':
    'Global: Intercepta automaticamente todas as requisições HTTP enviadas pela aplicação.',
  'k8sRetryBackoff.diffUseCases': 'Casos de uso principais',
  'k8sRetryBackoff.diffUseCasesOp': 'Streams de polling, tarefas em segundo plano ou observables fora do HttpClient.',
  'k8sRetryBackoff.diffUseCasesInt':
    'Proteção padrão em todas as chamadas REST/Kubernetes sem alterar serviços individuais.',
  'k8sRetryBackoff.diffConfig': 'Configuração e Exclusão',
  'k8sRetryBackoff.diffConfigOp': 'Configurado por stream via argumento do operador.',
  'k8sRetryBackoff.diffConfigInt':
    'Configurado globalmente no <code>app.config.ts</code>; sobrescrito ou desativado por requisição via <code>HttpContext</code>.',
  'k8sRetryBackoff.example1Title': 'Exemplo 1: Simulador interativo e uso na pipeline',
  'k8sRetryBackoff.example1Desc':
    'Simule várias respostas da API do Kubernetes e veja como o retryOnK8sBackoff calcula o atraso, acompanhado do código:',
  'k8sRetryBackoff.selectScenario': 'Selecionar cenário de resposta:',
  'k8sRetryBackoff.scenarioHeader': '429 (Cabeçalho Retry-After: 1)',
  'k8sRetryBackoff.scenarioBody': '429 (Corpo JSON details.retryAfterSeconds: 1.5)',
  'k8sRetryBackoff.scenarioFallback': '429 (Sem cabeçalho, atraso padrão de 1s)',
  'k8sRetryBackoff.scenarioNon429': '500 Internal Server Error (Não repetível, falha imediata)',
  'k8sRetryBackoff.scenarioExhausted': '5x 429 consecutivos (Esgota tentativas máximas)',
  'k8sRetryBackoff.btnSimulate': 'Simular requisição e repetir',
  'k8sRetryBackoff.btnClearLogs': 'Limpar registros',
  'k8sRetryBackoff.logTitle': 'Registros de execução:',
  'k8sRetryBackoff.example2Title': 'Exemplo 2: Função utilitária independente (getK8sRetryDelayMs)',
  'k8sRetryBackoff.example2Desc':
    'Utilize getK8sRetryDelayMs para extrair atrasos de repetição diretamente em loops customizados ou promises:',
  'k8sRetryBackoff.sampleErrorLabel': 'Exemplo de resposta de erro:',
  'k8sRetryBackoff.helperHeader': '429 (Retry-After: 3s)',
  'k8sRetryBackoff.helperBody': '429 (retryAfterSeconds: 2s)',
  'k8sRetryBackoff.helperFallback': '429 (Sem indicação, 1s padrão)',
  'k8sRetryBackoff.helperNon429': '500 (Erro não-429)',
  'k8sRetryBackoff.btnExtractDelay': 'Extrair atraso (getK8sRetryDelayMs)',
  'k8sRetryBackoff.retryableError': 'Recuo 429 repetível do Kubernetes',
  'k8sRetryBackoff.nonRetryableError': 'Erro não repetível',
  'k8sRetryBackoff.apiSummary': 'Repete um Observable em HTTP 429 respeitando as indicações do Kubernetes.',
  'k8sRetryBackoff.paramConfig': 'Configuração opcional para tentativas máximas e atraso padrão.',
  'k8sRetryBackoff.delaySummary':
    'Extrai o atraso em milissegundos de um objeto de erro, ou retorna null se não for repetível.',
  'k8sRetryBackoff.paramError': 'O erro a ser inspecionado (HttpErrorResponse ou objeto com status/headers/error).',
  'k8sRetryBackoff.paramFallbackDelay':
    'Atraso padrão em milissegundos se a resposta não fornecer indicação de repetição.',

  // k8sRetryBackoffInterceptor (pt-BR)
  'k8sRetryBackoffInterceptor.overview':
    '<code>k8sRetryBackoffInterceptor</code> é um interceptador HTTP funcional do Angular (<code>HttpInterceptorFn</code>). Ele oferece proteção global automática contra <strong>HTTP 429 (Too Many Requests)</strong> analisando os cabeçalhos <code>Retry-After</code> e o campo <code>details.retryAfterSeconds</code>.',
  'k8sRetryBackoffInterceptor.callout':
    'Precisa de controle em nível de stream isolado ou polling em segundo plano? Veja o operador <a href="/ngx-lift/operators/k8sRetryBackoff"><code>retryOnK8sBackoff</code></a>.',
  'k8sRetryBackoffInterceptor.example1Title': 'Exemplo 1: Registro global do interceptador e simulador',
  'k8sRetryBackoffInterceptor.example1Desc':
    'Registre o interceptador globalmente em app.config.ts. Todas as chamadas HttpClient ganham repetição automática em HTTP 429:',
  'k8sRetryBackoffInterceptor.selectMode': 'Modo de contexto do interceptador:',
  'k8sRetryBackoffInterceptor.modeDefault': 'Interceptador global padrão (Repete 429 com atraso de 1s, depois 200 OK)',
  'k8sRetryBackoffInterceptor.modeCustom': 'HttpContext personalizado (Atraso padrão de 400ms)',
  'k8sRetryBackoffInterceptor.modeDisabled':
    'Desativado via HttpContext (HttpContextToken = false, falha imediatamente)',
  'k8sRetryBackoffInterceptor.btnSend': 'Enviar requisição interceptada',
  'k8sRetryBackoffInterceptor.example2Title': 'Exemplo 2: Personalização por requisição e exclusão com HttpContext',
  'k8sRetryBackoffInterceptor.example2Desc':
    'Use K8S_RETRY_BACKOFF_CONFIG no HttpContext para definir limites personalizados ou desativar repetições em verificações de saúde:',
  'k8sRetryBackoffInterceptor.apiSummary':
    'Interceptador HTTP funcional que repete respostas HTTP 429 com atraso do Kubernetes.',
  'k8sRetryBackoffInterceptor.factorySummary':
    'Cria um interceptador funcional com configurações padrão personalizadas.',
  'k8sRetryBackoffInterceptor.tokenSummary':
    'HttpContextToken para configurar ou desativar a repetição em requisições individuais.',
  'k8sRetryBackoffInterceptor.paramDefaultConfig':
    'Configuração padrão aplicada a todas as requisições, exceto quando sobrescrita via HttpContext.',
  'header.partialLanguage': 'Tradução parcial; textos não traduzidos são exibidos em inglês.',
};
