export const ptBRTranslations: Record<string, string> = {
  'docsLearn.resourceTitle': 'Carregar dados quando um sinal muda',
  'docsLearn.basics': 'Fundamentos',
  'docsLearn.recipes': 'Exemplos práticos',
  'docsLearn.localState': 'Estado local',
  'docsLearn.nested': 'Recursos aninhados',
  'docsLearn.reference': 'Referência',
  'docsLearn.gridTitle': 'Experimente uma tabela controlada pelo servidor',
  'docsLearn.gridIntro':
    'dgState prepara eventos do Clarity Datagrid para requisições ao servidor, atrasa alterações de filtros e pode ignorar estados duplicados.',
  'docsLearn.gridTry': 'Altere filtros ou páginas e atualize. A prévia chama randomuser.me; o total é simulado.',
  'docsLearn.gridModel':
    'A tabela emite estado; dgState atrasa mudanças de filtros em 500 ms. switchMap substitui a requisição anterior. Atualizar usa um gatilho separado.',
  'docsLearn.resourceModel':
    'Sinais lidos na função fonte tornam-se dependências. No comportamento switch padrão, uma mudança cancela a assinatura anterior e inicia uma nova leitura. Cada recurso mantém seu próprio valor.',
  'docsLearn.computedTitle': 'Seu primeiro valor derivado assíncrono',
  'docsLearn.computedModel':
    'Clique para alterar a entrada. Após 300 ms, o valor será entrada × 10. computedAsync retorna um sinal de valor; não fornece sinais de carregamento ou erro de recurso. O temporizador simula trabalho assíncrono.',
  'docsLearn.nextValue': 'Próximo valor',

  'queryDocs.cache': 'Atualidade do cache e atualização',
  'queryDocs.cacheIntro':
    'Uma chave identifica dados compartilhados em um QueryClient. Atualidade, atividade das requisições e duração dos observadores respondem a perguntas diferentes.',
  'queryDocs.chooseComputed':
    'Use para um valor derivado assíncrono quando um signal de valor for suficiente. Prefira computed() para derivação síncrona.',
  'queryDocs.chooseMutation':
    'Use para gravações no servidor enviadas explicitamente. Não é necessária uma chave de consulta; adicione tags de invalidação quando outras visualizações precisarem atualizar.',
  'queryDocs.chooseObservable':
    'Use fetchQueryObservable para uma leitura finita em cache em um fluxo RxJS; observeQueryObservable emite instantâneos do cache compartilhado e mantém um observador.',
  'queryDocs.chooseQuery':
    'Use um observador para uma leitura compartilhada em cache. Uma resposta contendo um array continua sendo uma consulta.',
  'queryDocs.chooseResource':
    'Use para estado assíncrono independente, substituições locais ou fluxos contínuos sem cache compartilhado por chave.',
  'queryDocs.choosing': 'Escolher uma API assíncrona',
  'queryDocs.choosingIntro':
    'Escolha conforme a operação e a responsabilidade pelo estado. Um botão Atualizar ainda faz uma leitura; um clique não transforma uma operação em mutação.',
  'queryDocs.clientReference':
    'QueryClient gerencia entradas compartilhadas. fetchQuery lê dados; invalidateTags marca dependências como desatualizadas e atualiza as ativas; removeQueries remove entradas correspondentes. Consulte os contratos públicos para parâmetros e adaptadores.',
  'queryDocs.defaults':
    'Padrões: staleTime = 0; gcTime = 300,000 ms. Consulta periódica, novas tentativas, prazos e atualização por foco ou reconexão ficam desativados sem configuração.',
  'queryDocs.devtools': 'Ferramentas de consultas',
  'queryDocs.excerpt':
    'Trecho de campos do componente. Importe o serviço e as definições acima; a demonstração de mutação contém o fluxo completo de tabela e resumo.',
  'queryDocs.fetching': 'Buscar dados · queryResource',
  'queryDocs.freshness':
    'staleTime mede a atualidade desde a última resposta bem-sucedida. Ao expirar, os dados ficam desatualizados; a expiração sozinha não inicia uma requisição.',
  'queryDocs.independent': 'Leituras independentes · queryResources',
  'queryDocs.independentClocks':
    'Os dois relógios são independentes: dados não utilizados podem continuar atuais e dados ativos podem estar desatualizados. Observadores que retornam podem reutilizar os dados retidos.',
  'queryDocs.invalidation':
    'Gravações bem-sucedidas invalidam as tags selecionadas. Consultas ativas buscam novamente; entradas inativas ficam desatualizadas. A invalidação não exclui os dados.',
  'queryDocs.keyIdentity':
    'Inclua na chave todos os parâmetros que alteram a resposta e o escopo de autorização. Capture os valores reativos uma vez e reutilize-os na chave e no loader.',
  'queryDocs.keys': 'Chaves e invalidação',
  'queryDocs.keysIntro':
    'Chaves identificam dados. Tags descrevem quais leituras em cache uma gravação bem-sucedida afeta. Elas têm finalidades diferentes.',
  'queryDocs.organization': 'Organizar consultas',
  'queryDocs.organizationIntro':
    'Extraia definições quando vários consumidores precisarem dos mesmos dados. Mantenha o transporte em team.service.ts, identidade e tags em team.queries.ts e observadores junto aos consumidores.',
  'queryDocs.overview': 'Visão geral',
  'queryDocs.overviewIntro':
    'O estado do servidor são dados pertencentes a um servidor. Estas ferramentas os carregam, compartilham leituras entre componentes e sincronizam visualizações em cache após gravações.',
  'queryDocs.overviewRead': 'Carregue uma equipe, exiba os dados, altere o ID selecionado e recupere-se de erros.',
  'queryDocs.overviewWrite':
    'Salve o nome de uma equipe, observe os estados de espera e erro e atualize as visualizações em cache afetadas.',
  'queryDocs.prerequisites':
    'Comece com componentes e signals do Angular. Entenda uma consulta antes de escolher políticas de cache ou organizar uma funcionalidade.',
  'queryDocs.reference': 'Referência da API',
  'queryDocs.referenceIntro':
    'Consulte assinaturas e tabelas exatas de estados e opções abaixo. Siga os guias para explicações ou tarefas práticas.',
  'queryDocs.refreshControls':
    'reload() inicia uma atualização em segundo plano e retorna um booleano. execute() retorna uma Promise de uma leitura nova. Ambos ignoram dados já concluídos e compartilham o trabalho pendente válido.',
  'queryDocs.retention':
    'gcTime controla a retenção após a saída do último observador. A remoção aguarda as requisições pendentes terminarem. Observadores ativos mantêm seus dados.',
  'queryDocs.saving': 'Salvar alterações · mutateResource',
  'queryDocs.tagIdentity':
    'Uma tag é um objeto com type e scope/id opcionais. A mutação seleciona tags correspondentes; omitir scope não significa todos os escopos.',
  'queryDocs.triggers':
    'Dados desatualizados podem ser atualizados ao serem observados novamente. Atualização manual e invalidação solicitam dados novos; consulta periódica e recuperação por foco ou reconexão exigem configuração.',
  'queryDocs.writeBoundary':
    'Uma gravação bem-sucedida pode ser seguida por falha na sincronização do cache. Verifique invalidationError e atualize as leituras; não repita a gravação bem-sucedida para reparar o cache.',
  'queryLearn.collectionExplain':
    'Selecione os dois IDs, inverta a ordem e limpe a seleção. Chaves mantidas preservam seus observadores; itens removidos os liberam. Cada linha tem seus próprios estados de carregamento, erro e atualização.',
  'queryLearn.collectionIntro':
    'Use queryResource quando uma requisição retorna uma lista. Use queryResources quando uma coleção variável precisa de uma consulta separada para cada item.',
  'queryLearn.fixture':
    'Este exemplo completo usa um temporizador local para simular latência e falhas. Abra TypeScript para copiar o componente; HTML mostra o mesmo template compilado.',
  'queryLearn.httpSetup':
    'Para HTTP, forneça HttpClient em app.config.ts e substitua o loader simulado por http.get<Team>(url), usando um ID capturado. O cliente raiz não precisa de registro adicional.',
  'queryLearn.readError': 'A leitura falhou. Desative a falha simulada e atualize para tentar novamente.',
  'queryLearn.readExplain':
    'key identifica os dados; loader os busca. Os signals lidos na definição selecionam os dados. value() expõe o resultado; isInitialLoading() indica carregamento sem dados.',
  'queryLearn.readExplainTitle': 'Entenda a primeira leitura',
  'queryLearn.readIntro':
    'queryResource carrega dados e expõe resultado, carregamento e erros como signals do Angular. Componentes com a mesma chave compartilham dados em cache e uma requisição em andamento.',
  'queryLearn.readSteps':
    'Carregue Equipe A, escolha Equipe B e atualize. Ative a falha e atualize novamente: a equipe permanece visível. Desative a falha e atualize para recuperar.',
  'queryLearn.readTitle': 'Sua primeira consulta',
  'queryLearn.refreshExplain':
    'isRefreshing() indica uma leitura em andamento com dados anteriores visíveis. error() expõe a falha; isRefreshError() distingue uma falha com dados retidos.',
  'queryLearn.saved': 'Salvo',
  'queryLearn.simulateFailure': 'Simular falha',
  'queryLearn.teamA': 'Equipe A',
  'queryLearn.teamB': 'Equipe B',
  'queryLearn.writeError':
    'Não foi possível salvar. Sua entrada foi preservada; desative a falha simulada e salve novamente.',
  'queryLearn.writeExplain':
    'mutate(args) envia o valor e retorna uma Promise. isLoading() controla a espera; error() informa a falha. Comece sem tags; adicione-as quando uma gravação bem-sucedida precisar atualizar leituras em cache.',
  'queryLearn.writeExplainTitle': 'Entenda o primeiro salvamento',
  'queryLearn.writeIntro':
    'mutateResource executa uma gravação no servidor quando você chama mutate(). Expõe signals de espera, resultado e erro para o formulário responder ao resultado.',
  'queryLearn.writeSteps':
    'Digite um nome e salve. Ative a falha e salve novamente; depois desative-a e tente outra vez. O formulário bloqueia o envio durante uma gravação.',
  'queryLearn.writeTitle': 'Seu primeiro salvamento',
  'toSignalForm.savedProfile': 'Perfil salvo',
  'queryResource.projectRevision': 'Versão da resposta',
  'queryResource.activeUser': 'Usuário atual',
  'queryResource.engineLabel': 'Mecanismo',
  'queryResource.computeLabel': 'Recursos',
  'queryOwnership.title': 'Chaves e tags por domínio',
  'queryOwnership.definitions':
    'Mantenha observadores nos componentes. Importe definições completas e fábricas de tags do domínio responsável; inclua o escopo e todos os parâmetros que alteram a resposta nas chaves.',
  'queryOwnership.refactoring':
    'Use exportações compartilhadas em vez de repetir strings. Antes de alterar ou excluir uma definição, encontre todas as referências, coordene com o domínio responsável e verifique as leituras e gravações afetadas.',
  'queryOwnership.noCache':
    'Chaves também identificam solicitações e estado compartilhados. staleTime: 0 torna os dados obsoletos; gcTime: 0 remove entradas sem uso após as solicitações terminarem. Use resourceAsync para estado independente sem chave. Mutações não precisam de chave.',
  'queryOwnership.naming':
    'invalidateTags aceita um array ou uma função (result, args) executada apenas após sucesso. Retorne [] para ignorar a invalidação.',
  'queryOwnership.journey':
    'Adicione membros: tabela e resumo compartilham uma solicitação por atualização. Feche o resumo, adicione novamente e reabra. Os dados e a contagem de solicitações da equipe B não mudam.',
  'queryOwnership.closeSummary': 'Fechar resumo',
  'queryOwnership.openSummary': 'Abrir resumo',
  'queryOwnership.summary': 'Resumo da equipe A',
  'queryOwnership.teamAReads': 'Solicitações da equipe A',
  'queryOwnership.otherScope': 'Membros da equipe B (outro escopo)',
  'queryOwnership.teamBReads': 'Solicitações da equipe B',
  'header.selectLanguage': 'Selecionar idioma',
  'header.openGitHub': 'Abrir no GitHub',
  'header.codeLicensed': 'Código sob licença',
  'nav.signalUtils': 'Utilitários de Signal',
  'nav.queryMutation': 'Consultas e estado do servidor',
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
  'nav.differenceInDays': 'differenceInDays',
  'nav.badgeNew': 'NEW',
  'nav.badgeUpdated': 'UPDATED',
  'nav.badgePopular': 'POPULAR',
  'nav.badgeCore': 'CORE',
  'home.ngxLift.title': 'ngx-lift',
  'home.ngxLift.subtitle': 'Ajudar o seu fluxo de desenvolvimento <code>modern</code> Angular',
  'home.ngxLift.supportMatrix': 'Matriz de suporte à versão',
  'home.ngxLift.thVersion': 'Versão ngx-lift',
  'home.ngxLift.thNgVersion': 'Versão Angular',
  'home.ngxLift.utilityTitle': 'Funções da Utilidade',
  'home.ngxLift.utilityDesc':
    'Funções de utilidade abrangentes concebidas para acelerar as tarefas comuns de desenvolvimento',
  'home.ngxLift.rxjsTitle': 'Operadores RxJS',
  'home.ngxLift.rxjsDesc':
    'Operadores especializados que simplificam operações reativas complexas e aumentam a manutenção dos códigos',
  'home.ngxLift.signalTitle': 'Utilitários Signal',
  'home.ngxLift.signalDesc': 'Utilitários com base em sinais poderosos que complementam Angular¥s Signals API',
  'home.clrLift.title': 'clr-lift',
  'home.clrLift.subtitle': 'Extensão Clarity Sistema de Design com componentes, utilitários e operadores reutilizáveis',
  'home.clrLift.supportMatrix': 'Matriz de suporte à versão',
  'home.clrLift.thVersion': 'Versão clr-lift',
  'home.clrLift.thNgVersion': 'Versão Angular',
  'home.clrLift.utilitiesTitle': 'Utilitários',
  'home.clrLift.utilitiesDesc':
    'Utilitários especializados projetados para componentes Clarity que simplificam as tarefas e operações comuns, oferecendo uma experiência sem costura para o desenvolvimento',
  'home.clrLift.rxjsTitle': 'Operadores RxJS',
  'home.clrLift.rxjsDesc':
    'Operadores RxJS aprimorados que estendem a funcionalidade Clarity. O operador <code>dgState</code> simplifica a gestão do estado de dados, oferecendo uma abordagem intuitiva e eficiente para trabalhar com datagreds Clarity.',
  'home.clrLift.componentsTitle': 'Componentes',
  'home.clrLift.componentsDesc':
    'Componentes prontos para a produção construídos sobre o Sistema de Design Clarity, incluindo notificações torradas, alertas, chamadas, recipiente para a página, luta temática, e mais',
  'home.clrLift.tipPeer':
    'Em alguns casos, a <strong>instalação de força</strong> pode ser exigido se as dependências para peer (clr / angulares) especificarem um Angular versão que o seu projecto.',
  'home.clrLift.tipSkipLib':
    'Se você não estiver usando a última versão Angular, considere a definição <code>skipLibCheck: true</code> em tsconfig.json para evitar erros potenciais para construir.',
  'home.clrLift.tipIcon':
    'Assegure-se que os ícones Clarity são importados corretamente usando <code>ClarityIcons.addIcons(...)</code>.',
  'common.examples': 'Exemplos',
  'common.apiReference': 'Referência da API',
  'common.overview': 'Visão Geral',
  'common.parameters': 'Parâmetros',
  'common.returns': 'Retornos',
  'rockStar.todayIs': 'Hoje é...',
  'rockStar.whoIsStar': 'Quem é a nossa estrela rock hoje?',
  'rockStar.unveil': 'Desvelar',
  'common.signature': 'Assinatura',
  'common.description': 'Descrição',
  'common.clear': 'Limpar',
  'common.basicUsage': 'Uso básico',
  'common.inputs': 'Entradas (Inputs)',
  'common.outputs': 'Saídas (Outputs)',
  'common.type': 'Tipo',
  'common.default': 'Padrão',
  'common.contentProjection': 'Projeção de conteúdo',
  'common.example': 'Exemplo',
  'common.example1': 'Exemplo 1: Uso básico',
  'common.example2': 'Exemplo 2: Com operador pipe RxJS',
  'common.example3': 'Exemplo 3: Lidar com código assíncrono',
  'common.example4': 'Exemplo 4: Injetor desacoplado',
  'common.methods': 'Métodos',
  'common.selector': 'Seletor',
  'common.behaviors': 'Comportamentos',
  'common.behavior': 'Comportamento',
  'common.features': 'Recursos',
  'common.properties': 'Propriedades',
  'common.validationErrors': 'Erros de validação',
  'common.usageNotes': 'Notas de uso',
  'common.liveDemo': 'Demonstração ao vivo',
  'common.required': 'Obrigatório',
  'common.refresh': 'Atualizar',
  'common.firstName': 'Primeiro nome',
  'common.lastName': 'Sobrenome',
  'common.email': 'E-mail',
  'common.gender': 'Gênero',
  'common.male': 'Masculino',
  'common.female': 'Feminino',
  'common.name': 'Nome',
  'common.noDataFound': 'Nenhum dado encontrado',
  'common.noItems': 'Nenhum item',
  'common.paginationOf': '{0} - {1} de {2} itens',
  'common.seeUiBehavior': 'Clique para ver o comportamento UI',
  'filterUsers.selectGender': 'Seleccione o género para carregar os usuárioes',
  'fileReader.file': 'Ficheiro',
  'fileReader.readSuccess': 'O conteúdo do arquivo foi lido com sucesso',
  'fileReader.submitAndLog': 'Enviar e visualizar o registro da consola',
  'fileReader.caBundle': 'Bundle CA',
  'fileReader.showCertificate': 'Mostrar o certificado:',
  'fileReader.exceedLimit': 'Exceou o tamanho máximo do arquivo ({0} MB).',
  'multiAlerts.addStandard': 'Adicionar um Alerta Normal',
  'multiAlerts.addInlineBtn': 'Adicionar um Alerta com o Botão Inline',
  'multiAlerts.addAction': 'Adicionar um Alerta com a Acção',
  'multiAlerts.clearAll': 'Limpar todas as Alertas',
  'toast.successBtn': 'Tostas de sucesso',
  'toast.infoBtn': 'Tostas para a Informação',
  'toast.errorBtn': 'Tosta de Erro',
  'toast.warningBtn': 'Tostas de alerta',
  'idleDetection.startSimulation': 'Iniciar a Simulação Rápida (Idle-3)',
  'idleDetection.stopSimulation': 'Parar a Simulação',
  'idleDetection.simActive': 'Simulação Activa:',
  'idleDetection.sessionStatus': 'Estado:',
  'idleDetection.totalTimeouts': 'Timeouts totais:',
  'idleDetection.yes': 'Sim.',
  'idleDetection.no': 'Não',
  'resourceAsync.userN': 'Usuário {0}',
  'resourceAsync.reload': 'Reload',
  'resourceAsync.regUsernamePlaceholder': 'Indique o nome do usuário (3- 20 caracteres)',
  'resourceAsync.regUsernameError': 'Usuário tem que ser 3-20 caracteres',
  'resourceAsync.regEmailPlaceholder': 'Introduza o seu e-mail',
  'resourceAsync.regEmailError': 'Por favor, insira um e-mail válido',
  'resourceAsync.regPasswordPlaceholder': 'Indique a senha (min 8 caracteres)',
  'resourceAsync.regPasswordError': 'A senha deve ser pelo menos 8 caracteres',
  'resourceAsync.loadingTodo': 'A carregar tudo...',
  'resourceAsync.loadTodo': 'Carregar tudo',
  'resourceAsync.saving': 'A salvar...',
  'resourceAsync.resetFromServer': 'Reiniciar a partir do Server',
  'resourceAsync.loadUserCacheFirst': 'Usar a Carga (Cache- First)',
  'resourceAsync.fromCache': 'De Cache',
  'resourceAsync.updating': 'A actualizar...',
  'resourceAsync.loadCounter': 'Contador de Carga',
  'resourceAsync.unsavedChanges': 'Alterações sem salvação - Contador foi modificado localmente',
  'resourceAsync.saveToServer': 'Gravar para o Server',
  'resourceAsync.discardChanges': 'Descartar as Alterações',
  'playground.beginner': 'Iniciante',
  'playground.intermediate': 'Intermediário',
  'playground.advanced': 'Avançado',
  'playground.copy': 'Copiar',
  'playground.copied': 'Copiado',
  'playground.viewCode': 'Ver código',
  'playground.hideCode': 'Ocultar código',
  'playground.stackedLayout': 'Layout empilhado',
  'playground.splitLayout': 'Layout lado a lado',
  'inspector.liveState': 'Ao vivo Signal State',
  'inspector.rawJson': 'JSON de estado bruto',
  'inspector.hideJson': 'Ocultar JSON',
  'mergeFrom.overview':
    'A função <code>mergeFrom</code> mescla os valores de Observables ou Signals e emite o último valor. Ela também permite modificar o valor emitido usando operadores RxJS antes de ser emitido. Embora seja similar a <code>merge()</code>, ela também leva em conta Signals. <code>mergeFrom</code> é similar a <code>combineFrom</code>, mas em vez de emitir um valor combinado, emite o último valor emitido usando o operador merge em vez de combineLatest.',
  'mergeFrom.example1Desc': 'Mesclar múltiplos signals ou observables:',
  'mergeFrom.example2Desc': 'Passe um operador pipe RxJS para manipular os valores emitidos:',
  'mergeFrom.example3Desc':
    'Use a opção <code>startWith</code> ou <code>initialValue</code> para lidar com observables assíncronos:',
  'mergeFrom.example4Desc':
    'Passe um <code>Injector</code> customizado via objeto de opções para criar um sinal mesclado:',
  'mergeFrom.apiSummary':
    'Mescla múltiplos Observables ou Signals em um único Signal que emite o último valor de qualquer fonte, similar a <code>merge</code>, mas com suporte a Signal.',
  'mergeFrom.paramSources':
    'Um objeto ou array de Observables ou Signals para se fundir. Quando um objeto for fornecido, o resultado vai ser um objeto com as mesmas chaves.',
  'mergeFrom.paramOperator': 'Um operador de tubo RxJS para manipular os valores emitidos antes que sejam emitidos.',
  'mergeFrom.paramOptions': 'Opções de configuração, incluindo initialValue e injector.',
  'mergeFrom.returnsDesc': 'Um Signal que emite o valor combinado / resultante da fusão como fontes emitem.',
  'toSignalForm.pageTitle': 'Forma reativa Signals (toSignalForm)',
  'toSignalForm.bannerTitle': 'Bigging Angular Forms reactive para moderno Signals',
  'toSignalForm.bannerDesc':
    '<code>toSignalForm</code> envolve instâncias padrão de Angular <code>FormGroup</code> com sinais reativos, vinculações declarativas (<code>bindIf</code>, <code>bindDisabled</code>), revalidação entre controles e valores sanitizados de submissão (<code>submitValue</code>)—mantendo 100% de compatibilidade comClarity contêineres de formulário e Angular validadores.',
  'toSignalForm.quickTitle': 'Nível 1: Quickstart Form Signals',
  'toSignalForm.quickBadge': '30- Second Hell World',
  'toSignalForm.quickDesc':
    'Aprender as bases: envolver um FormGroup com toSignalForm, ler os valores reativamente através dos sinais, e desativar ações com sf.invalid().',
  'toSignalForm.username': 'Nome do usuário',
  'toSignalForm.usernamePlaceholder': 'Pelo menos 3 caracteres',
  'toSignalForm.usernameRequired': 'É exigido o nome do usuário.',
  'toSignalForm.usernameMinLength': 'Deve ser pelo menos 3 caracteres.',
  'toSignalForm.email': 'Endereço de e-mail',
  'toSignalForm.emailPlaceholder': 'name @ domain.com',
  'toSignalForm.emailRequired': 'Um e-mail é exigido.',
  'toSignalForm.emailInvalid': 'Por favor, insira um endereço de e-mail válido.',
  'toSignalForm.receiveUpdates': 'Recuperar as Atualizações de e-mail',
  'toSignalForm.saveProfile': 'Gravar o Perfil',
  'toSignalForm.reset': 'Redefinir',
  'toSignalForm.quickFormState': 'Forma rápida Signal State',
  'toSignalForm.quickFormStateDesc': 'Signals atualização sincronizada como você digitar o formulário acima',
  'toSignalForm.enterpriseTitle': 'Nível 2: Empresa Showcase - Cloud Database Provisioning',
  'toSignalForm.enterpriseBadge': 'Especificação Real-World Completa',
  'toSignalForm.enterpriseDesc':
    'Presença complexa em multicontrole, sondagem por aparelho assíncrono por resourceAsync, atualizações em cascatas, e fechaduras condicionais para autoescala.',
  'toSignalForm.enterpriseState': 'Formulário Empresarial ao vivo Signals',
  'toSignalForm.enterpriseStateDesc':
    'Monitora validação de formulário, bloqueios de auto-escalamento e status de provisionamento do backend em tempo real',
  'toSignalForm.region': 'Região / Appliance',
  'toSignalForm.regionSelect': 'Seleccione a região-alvo...',
  'toSignalForm.regionUSWest': 'US-Oeste (nuvem v2 - HA-Multizona)',
  'toSignalForm.regionApEast': 'Ásia-Pacífico (nuvem regional - zona múltipla HA para PG Eu... MySQL)',
  'toSignalForm.regionEuCentral': 'Europa Central (Região Legacy - Apenas zona-single-)',
  'toSignalForm.regionRequired': 'É necessária a região de implantação.',
  'toSignalForm.regionHelper':
    'Totalmente verifica as capacidades dos aparelhos regionais através do <code>computedAsync</code>.',
  'toSignalForm.multiZoneSupported': '✓ Suporte a HA em múltiplas Zonas',
  'toSignalForm.singleZoneOnly': 'Apenas a zona-single- (HA acatado)',
  'toSignalForm.engine': 'Motor de Base de Dados',
  'toSignalForm.enginePostgres': 'PostgreSQL',
  'toSignalForm.engineMysql': 'MySQL',
  'toSignalForm.engineSqlServer': 'Servidor SQL',
  'toSignalForm.engineRequired': 'Sistema de base de dados exigido.',
  'toSignalForm.engineHelper':
    'Opções abaixo são reativamente derivadas a partir do <code>sf.fields.engine.value</code>.',
  'toSignalForm.haTopology': 'Topologia HA multizona',
  'toSignalForm.haCrossAz': 'Disponibilidade entre Zonas',
  'toSignalForm.haDedicated': 'Hosts Dedicados para a Antiguidade',
  'toSignalForm.haRequired': 'HA topologia é necessária.',
  'toSignalForm.haHelper': 'Totalmente montada pelo <code>sf.bindIf(isMultiZoneSupported, ...)</code>.',
  'toSignalForm.replicaCount': 'Contagem Node réplicas',
  'toSignalForm.replicaRequired': 'A contagem de réplicas é necessária.',
  'toSignalForm.replicaMin': '2 réplicas mínimas para a zona múltipla HA.',
  'toSignalForm.replicaMax': 'Máximo 5 réplicas permitidas.',
  'toSignalForm.replicaHelper': 'Os valores são preservados em toda a região guinchos.',
  'toSignalForm.version': 'Versão do Motor',
  'toSignalForm.versionSelect': 'Seleccione a versão',
  'toSignalForm.versionRequired': 'A versão para o motor é necessária.',
  'toSignalForm.versionHelper': 'Repõe automaticamente a primeira versão disponível quando o motor muda.',
  'toSignalForm.clusterName': 'Nome do Registador',
  'toSignalForm.clusterNamePlaceholder': 'por exemplo, a compra-db- primária',
  'toSignalForm.clusterNameRequired': 'É necessário o nome do emblema.',
  'toSignalForm.clusterNameMinLength': 'Deve ser pelo menos quatro caracteres.',
  'toSignalForm.clusterNameHelper':
    'Délay de 400ms e verificação assíncrona contra nomes reservados (prod-db, test-cluster, etc.).',
  'toSignalForm.clusterNameChecking': 'A verificar a disponibilidade para o nome... (debuuncted 400ms)',
  'toSignalForm.autoScaling': 'Armazenagem Auto-escala',
  'toSignalForm.autoScalingHelper':
    'Quando ativado, a entrada de armazenamento manual é automaticamente desativa e reiniciar para 250 GB.',
  'toSignalForm.storageGb': 'Armazenamento atribuído (GB)',
  'toSignalForm.storageGbRequired': 'É necessário o tamanho da armazenamento.',
  'toSignalForm.storageGbMin': 'A dotação mínima é de 20 GB.',
  'toSignalForm.storageGbHelper':
    "Acerta-se por <code>sf.bindDisabled('storageGb', () =&gt; autoScaling(), &#123; resetOnDisable: true, resetValue: 250 &#125;)</code>.",
  'toSignalForm.storageLocked': 'Scaling Automático (Deficiente, bloqueado para 250 GB)',
  'toSignalForm.storageManual': '← Acesso Manual Permitido',
  'toSignalForm.authMode': 'Modo de Autenticação',
  'toSignalForm.authSql': 'Utilizador Nativo para a Base de Dados',
  'toSignalForm.authWindows': 'Enterprise Directory / Windows Auth',
  'toSignalForm.authModeRequired': 'É necessário o modo de autenticação.',
  'toSignalForm.authModeHelper':
    'Seleccionando a base de dados Usuário Native monta a senha para obter a confirmação com a retenção da memória.',
  'toSignalForm.password': 'Senha-Mestre',
  'toSignalForm.passwordPlaceholder': '3 carateres',
  'toSignalForm.passwordRequired': 'Senha-mestre é necessária.',
  'toSignalForm.passwordMinLength': 'Deve ser pelo menos 8 caracteres.',
  'toSignalForm.confirmPassword': 'Confirmar a Senha',
  'toSignalForm.confirmPasswordPlaceholder': 'Repetir a senha-mestre',
  'toSignalForm.confirmPasswordRequired': 'É necessária a confirmação da senha.',
  'toSignalForm.passwordMismatch': 'As palavras-passe não correspondem.',
  'toSignalForm.confirmPasswordHelper':
    'Revalidada automaticamente quando a Senha-Mestre for alterada pelo <code>sf.revalidate</code>.',
  'toSignalForm.tlsCert': 'Certificado TLS / SSL',
  'toSignalForm.certManaged': 'Plataforma Auto- Geração',
  'toSignalForm.certCustom': 'Certificado Empresarial Personalizado',
  'toSignalForm.certRequired': 'É exigido o tipo de certificado.',
  'toSignalForm.certHelper':
    'Modo personalizado monta dinamicamente a entrada do certificado e mantém o texto dactilografado em rotações.',
  'toSignalForm.tlsChain': 'Cadeia de Certificados PEM',
  'toSignalForm.tlsChainPlaceholder': '-- ---BEGIN CERTIFICATE-- ---... -- ---END CERTIFICATE-- ---',
  'toSignalForm.tlsChainRequired': 'A cadeia dos certificados é necessária.',
  'toSignalForm.tlsChainMinLength': 'Um certificado deve ter pelo menos vinte caracteres.',
  'toSignalForm.tlsChainHelper':
    'Digite um pouco de texto, mudem para o Auto-gerado e mudem para trás: o texto é preservado!',
  'toSignalForm.createCluster': 'Criar um Registador',
  'toSignalForm.resetForm': 'Redefinir o Formulário',
  'toSignalForm.submitting': 'A apresentar o pedido para o depósito para controlar o avião... (simulação dos anos 60)',
  'toSignalForm.successTitle': '(ID: {0})',
  'toSignalForm.simulatedResponse': 'Resposta à infra- estrutura simulada recebida em 1.0 segundo:',
  'toSignalForm.diagnosticsTitle': 'Diagnóstico Signal em tempo real',
  'toSignalForm.clusterNameState': 'Nome do Cluster (sf.fields.clusterName)',
  'toSignalForm.value': 'Valor:',
  'toSignalForm.debounced': 'Detido (400ms):',
  'toSignalForm.valid': 'Válido:',
  'toSignalForm.touched': 'Tocada:',
  'toSignalForm.errors': 'Erros:',
  'toSignalForm.sqlCredState': 'SQL Credence State',
  'toSignalForm.authModeLabel': 'Modo Auth:',
  'toSignalForm.controlsAttached': 'Controlos anexados:',
  'toSignalForm.passwordValid': 'Válida para Senha:',
  'toSignalForm.passwordErrors': 'Erros de Senha:',
  'toSignalForm.confirmValid': 'Confirmar a Válida:',
  'toSignalForm.confirmErrors': 'Confirmar erros:',
  'toSignalForm.sanitizedPayload': 'Envio-pagador sanitário (sf.submitValue)',
  'toSignalForm.sanitizedDesc':
    'Auto- omitem UI- somente <code>confirmPassword</code> e omitem o <code>password</code> desligado no auth Windows.',
  'toSignalForm.patternsTitle': 'Padrões Especializados em Arquitectura',
  'toSignalForm.pattern1Title': 'Padrão 1: Árvores em campo (bindIf)',
  'toSignalForm.pattern1Desc':
    'Monta ou desmonta um grupo de controles relacionados (como credenciais de banco de dados) juntos com base em uma condição reativa. Controles desmontados são automaticamente excluídos da validação e dos payloads do backend, e seu input é preservado durante as switches quando <code>preserveValue: true</code> é configurado.',
  'toSignalForm.pattern2Title': 'Padrão 2: Desactivação reactiva Auto-redefinição (bindDisabled)',
  'toSignalForm.pattern2Desc':
    'Vincula o estado habilitado/deshabilitado de um controle diretamente a um sinal booleano ou função getter reativa (<code>() =&gt; boolean</code>). Ele suporta chaves de controle tipadas fortemente, controles de <code>sf.controls.&lt;name&gt;</code> aprimorados diretamente e instâncias de <code>AbstractControl</code>. Padrão é <code>emitEvent: true</code> para garantir que os sinais de status reativo sejam atualizados de forma síncrona, e suporta opcionalmente resetar ao desabilitar com uma <code>resetValue</code> tipada fortemente.',
  'toSignalForm.pattern3Title': 'Padrão 3: Emissões Sanizadas (sf.submitValue)',
  'toSignalForm.pattern3Desc':
    'Resolve a tensão entre <code>form.value</code> (que descarta controles desabilitados) e <code>form.getRawValue()</code> (que descarta campos UI apenas, como <code>confirmPassword</code>). <code>sf.submitValue()</code> fornece um sinal reativo contínuo que sempre é sanitizado e pronto para submissão ou <code>resourceAsync</code>.',
  'toSignalForm.pattern4Title': 'Padrão 4: Vaguagem em Característica Asíncrona (computedAsync + bindIf)',
  'toSignalForm.pattern4Desc':
    'Em aplicações em nuvem e empresariais, campos de formulário disponíveis frequentemente dependem de capacidades regionais ou bandeiras de funcionalidade resolvidas assimetricamente a partir de endpoints API. <code>computedAsync</code> deriva um sinal reativo <code>Signal&lt;boolean&gt;</code> a partir da região selecionada e do motor, que é passado diretamente para <code>sf.bindIf</code> para montar ou desmontar controles de capacidade em tempo real.',
  'toSignalForm.pattern5Title': 'Pattern 5: Cascads-updates para a mudança (sf.watch)',
  'toSignalForm.pattern5Desc':
    'Quando um controle de formulário altera e desencadeia atualizações em cascata em outro controle (por exemplo, resetar versões disponíveis quando o motor do banco de dados muda), você pode usar o padrão tradicional RxJS <code>valueChanges.pipe(takeUntilDestroyed())</code> ou a utilidade de sinal primeiro <code>sf.controls.&lt;name&gt;.watch()</code> / <code>sf.watch()</code>. <code>watch</code> opera dentro de um Angular <code>effect()</code> com isolamento automático <code>untracked</code>, evitando erros de escrita de sinal <code>NG0600</code> enquanto elimina a necessidade de desmontagem manual de assinaturas.',
  'toSignalForm.apiReferenceTitle': 'API Referência',
  'toSignalForm.apiToSignalFormTitle': 'toSignalForm(form, options?)',
  'toSignalForm.apiBindIfTitle': 'sf.bindIf(control, condition, options?) / bindControlIf',
  'toSignalForm.apiBindDisabledTitle': 'sf.bindDisabled(control, condition, options?) / bindControlDisabled',
  'toSignalForm.apiRevalidateTitle': 'sf.revalidate(target, sources, options?) / revalidateOnChange',
  'toSignalForm.apiPropForm': 'A instância Angular FormGroup para envolver-se com sinais reativos e ligantes.',
  'toSignalForm.apiPropOmit': 'Controle os nomes para omitir a partir de submitValue payloads.',
  'toSignalForm.apiPropEmitEvent': 'Se o estado / valor muda, emitir eventos de controle Angular.',
  'toSignalForm.apiPropValue': 'Sinal reativo do valor da forma atual.',
  'toSignalForm.apiPropStatus':
    'Sinal reativo do status global da forma (VALIDEu...INVALIDEu...PENDINGEu...DISABLED(2).',
  'toSignalForm.apiPropValid': 'Sinal informático que indica se o formulário é válido.',
  'toSignalForm.apiPropInvalid': 'Sinal computado que indica se o formulário é inválido.',
  'toSignalForm.apiPropSubmitValue': 'Carga autorizada sem controle desactivado, omitido ou sem montagens.',
  'toSignalForm.apiPropIsSubmitting':
    'Corroboração de sinal para a escrita, se uma operação de submissão sínc estiver em-voo.',
  'toSignalForm.apiBindIfControl': 'Nome ou instância do controle para montarem / desmontarem condicionalmente.',
  'toSignalForm.apiBindIfCondition': 'Sinal booleano ou prever se o comando é montado.',
  'toSignalForm.apiBindIfPreserveValue':
    'Preserve o valor de controle em memória em ciclos para desmontarem / remontarem.',
  'toSignalForm.apiBindIfDefaultValue': 'Valor por omissão atribuído ao montarem ou reinstalarem o controle.',
  'toSignalForm.apiBindIfEmitEvent': 'Se a adição / remoção de controle emite o valor FormGroup e eventos de status.',
  'toSignalForm.apiBindDisabledControl': 'Controle-alvo que tem o estado habilitado / desativado ligado.',
  'toSignalForm.apiBindDisabledCondition':
    'Sinal booleano ou predicar retornando verdadeiro para desativar, falso para ativar.',
  'toSignalForm.apiBindDisabledResetOnDisable':
    'Reinstale automaticamente o valor de controle ao entrar em estado desativado.',
  'toSignalForm.apiBindDisabledResetValue':
    'Valor específico para reiniciar quando o resetOnDisable estiver ativo; defaults para controlar inicial / nulo.',
  'toSignalForm.apiBindDisabledEmitEvent': 'Se a activação / desactivação altera o valor / estado dos eventos.',
  'toSignalForm.apiRevalidateTarget': 'Controle-alvo para reavaliar a validação sobre as alterações-fonte.',
  'toSignalForm.apiRevalidateSources':
    'Um ou mais controles de dependência, cujo valor / status altera, desencadeia a revalidação-alvo.',
  'toSignalForm.apiRevalidateOnlyIfTouched':
    'Apenas desencadeia a revalidação do alvo se o alvo for tocado pelo usuário.',
  'toSignalForm.apiRevalidateOnlyIfDirty': 'Apenas desencadeia a revalidação-alvo se o alvo for modificado (sujo).',
  'computedAsync.title': 'computedAsync',
  'computedAsync.overview':
    'A função <code>computedAsync</code> calcula valores a partir de Promises, Observables ou valores comuns. Ela permite escolher a estratégia de combinação dos fluxos (switch, merge, concat, exhaust) e definir um valor inicial. Forneça uma função que retorne uma Promise, um Observable ou um valor comum; o resultado é um <code>Signal</code> com o valor calculado.',
  'computedAsync.example1': 'Exemplo 1: Funciona com Promises',
  'computedAsync.example1Desc': 'Computir os valores a partir do Promises:',
  'computedAsync.example2': 'Exemplo 2: Funciona com Observables',
  'computedAsync.example2Desc':
    'Quando retorna um Observable, ele é automaticamente suscrito e será desinscrito quando o componente for destruído ou quando a computação for reativada. No exemplo seguinte, se o userId mudar, a computação anterior será cancelada (incluindo quaisquer chamadas em andamento de API), e uma nova computação será iniciada.',
  'computedAsync.example3': 'Exemplo 3: Obras com Valores Regulares',
  'computedAsync.example3Desc':
    'Isso permite a devolução de valores regulares (aqueles que não consistem em Promises ou Observables) da função de callback. A função de callback executa na fila de tarefas micro, portanto, não emitirá o valor imediatamente (por padrão, ela retorna undefined). Para emitir o valor imediatamente, você pode utilizar a opção requireSync dentro do objeto de opções do segundo argumento.',
  'computedAsync.example4': 'Exemplo 4: Funciona com initialValue',
  'computedAsync.example4Desc':
    'Se desejamos estabelecer um valor inicial para o valor calculado, podemos fornecê-lo como o segundo argumento dentro do objeto opções.',
  'computedAsync.example5': 'Exemplo 5: Funciona com requireSync',
  'computedAsync.example5Desc':
    'Se tivermos um Observable que emite o valor de forma síncrona, podemos utilizar a opção requireSync para garantir a emissão imediata do valor. Essa característica também é útil para garantir que o tipo <code>signal</code> exclua undefined por padrão (<code>Signal<T></code> em vez de <code>Signal<T | undefined></code>).',
  'computedAsync.example6': 'Exemplo 6: Trabalhar com o Operador createAsyncState',
  'computedAsync.example6Desc':
    'No exemplo abaixo, temos um <code>Signal</code> que representa o estado de uma chamada API. Nós usamos o operador <code>computedAsync</code> e <code>createAsyncState</code> para calcular o estado da chamada API com base no <code>userId</code>.',
  'computedAsync.example7': 'Exemplo 7: Behaviors (switch, juge, concat, escape)',
  'computedAsync.example7Desc':
    'Por padrão, <code>computedAsync</code> emprega o comportamento switch. Caso você queira alterar esse comportamento, você pode fornecer a opção de comportamento dentro do objeto segunda opção de argumento.',
  'computedAsync.behaviorSwitch': 'switch (por omissão)',
  'computedAsync.behaviorSwitchDesc':
    'Ao querer cancelar a computação anterior, o comportamento do interruptor é utilizado, que é o padrão. Se um novo cálculo for acionado antes que o anterior termine, o primeiro vai ser terminado.',
  'computedAsync.behaviorMerge': 'fundir',
  'computedAsync.behaviorMergeDesc':
    'Para manter a computação anterior, o comportamento da fusão é empregado. Se um novo cálculo for iniciado antes que o anterior for finalizado, o primeiro é preservado enquanto o primeiro for iniciado.',
  'computedAsync.behaviorConcat': 'concat',
  'computedAsync.behaviorConcatDesc':
    'Se a preservação da computação prévia for desejada juntamente com a espera para a sua finalização antes de iniciar a nova, o comportamento concat é escolhido.',
  'computedAsync.behaviorExhaust': 'gases de escape',
  'computedAsync.behaviorExhaustDesc':
    'Em casos em que a desconsideração da nova computação enquanto a anterior permanece em andamento é necessário, o comportamento dos gases de escape é selecionado.',
  'computedAsync.example8': 'Exemplo 8: Usar com o Valor Computado Anterior',
  'computedAsync.example8Desc':
    'Caso haja a necessidade de utilizar o valor anteriormente calculado na computação posterior, pode-se acedê-la dentro da função callback como primeiro argumento.',
  'computedAsync.example9': 'Exemplo 9: Carga inicial dos dados',
  'computedAsync.example9Desc': 'Carga inicial aos usuárioes quando o componente for carregado:',
  'computedAsync.refresh': 'Actualizar',
  'computedAsync.learnTrigger': 'Aprender <a href="{0}"><code>createTrigger</code> aqui</a>.',
  'computedAsync.example10': 'Exemplo 10: Carga dos Dados Quando o Botão Clicks',
  'computedAsync.example10Desc': 'Carregar os usuários somente quando um botão for clicado:',
  'computedAsync.loadUsers': 'Carregar os Usuários',
  'computedAsync.example11': 'Exemplo 11: Erro ao lidar com onError',
  'computedAsync.example11Desc':
    'Usar o callback <code>onError</code> para lidar com erros graciosamente e fornecer valores fallback. Quando o <code>onError</code> devolve um valor, o sinal irá emitir esse valor em vez de lançar um erro:',
  'computedAsync.onErrorCallout':
    'O callback <code>onError</code> retorna um valor alternativo do tipo T. Inclua <code>undefined</code> explicitamente em T se necessário. Falhas não tratadas e exceções do callback são lançadas ao ler o signal; nunca se tornam dados de sucesso.',
  'computedAsync.example12': 'Exemplo 12: Erros são lançados na leitura por padrão',
  'computedAsync.example12Desc':
    'Falhas não tratadas são lançadas ao ler o signal. Capture a leitura ou use <code>onError</code> para retornar um valor alternativo tipado.',
  'computedAsync.throwOnErrorCallout':
    '<code>throwOnError: true</code> executa <code>onError</code> para efeitos colaterais e ainda lança o erro; o retorno é ignorado. <code>throwOnError: false</code> não é mais suportado.',
  'computedAsync.example13': 'Exemplo 13: Toque em Interligar com o Cancelamento de Solicitação (Resiliência em Fluxo)',
  'computedAsync.example13Desc':
    'Em multi- tab UIs, as telhas para comutação rapidamente podem despoletar as solicitações simultâneas quando as solicitações para o voo são abortadas ou falharem (por exemplo, cancelamentos para a navegação pelo navegador).',
  'computedAsync.tabResilienceBefore':
    'Antes da correção <strong>Before Fix:</strong> Um erro interno (como uma solicitação cancelada de HTTP) propagaria através de <code>switchAll</code> e permanentemente terminaria a assinatura externa do observable. O UI ficaria preso em carregamento para sempre e nunca carregaria as próximas abas.',
  'computedAsync.tabResilienceAfter':
    '<strong>After Fix: </strong> O erro interno é capturado e manuseado com segurança, mantendo o fluxo externo vivo. Mudar para qualquer guia ou reiniciar imediatamente pegadas e exibe novos dados!',
  'computedAsync.tabActiveDirectory': 'Active Directory',
  'computedAsync.tabBackupLocations': 'Locais de Back-up',
  'computedAsync.tabCertificates': 'Certificados',
  'computedAsync.tabSimulateAborted': 'Simular o Pedido Abortado',
  'computedAsync.tabNotice':
    'Observe: mesmo depois que este pedido em falso abortado, o fluxo permanece vivo! Clique em qualquer guia acima para vê-la recupera sem costura.',
  'computedAsync.example14': 'Exemplo 14: Injetor dissociado',
  'computedAsync.example14Desc':
    'Ao passar um <code>injector</code> opcional para o objeto opções, o <code>computedAsync</code> pode ser instalado fora de um contexto de injeção ambiente, por exemplo, dentro das funções compostable helper, serviços personalizados ou métodos funcionais dinâmicos:',
  'computedAsync.apiSummary':
    'Calcula valores a partir de Promises, Observables ou valores regulares, retornando um Signal que emite o valor calculado.',
  'computedAsync.paramComputation':
    'A função que devolve um Promise, Observable ou o valor regular. A função recebe o valor calculado anterior como primeiro argumento facultativo.',
  'computedAsync.paramOptions': 'Opções de configuração para a computação async.',
  'computedAsync.propInitialValue': 'O valor inicial para o sinal calculado antes que a computação termine.',
  'computedAsync.propRequireSync': 'Se for verdade, requer que a computação emita-se sincronicamente.',
  'computedAsync.propBehavior':
    'Estratégia para processar vários cálculos: "switch", "merge", "concat" ou "exhaust". Padrão: "switch".',
  'computedAsync.propOnError': 'Erro callback handler que recebeu erros a partir das operações async.',
  'computedAsync.propThrowOnError': 'Se for verdade, erros serão lançados e propagarem-se.',
  'computedAsync.returnsDesc': 'Um Signal que emite o valor calculado.',
  'combineFrom.title': 'combineFrom',
  'combineFrom.overview':
    'A função <code>combineFrom</code> aceita um array ou objeto de Observables ou Signals e produz um Signal que emite o valor agregado dessas fontes. Similar a <code>combineLatest</code>, mas suporta naturalmente Signals. Suporta injetores personalizados e valores iniciais.',
  'combineFrom.example1': 'Exemplo 1: Uso básico',
  'combineFrom.example1Desc': 'Combine múltiplos sinais ou observáveis:',
  'combineFrom.example2': 'Exemplo 2: Com o Operador RxJS Pipe',
  'combineFrom.example2Desc': 'Passar um operador de tubo RxJS para manipular os valores emitidos:',
  'combineFrom.example3': 'Exemplo 3: Manejar o Código Asíncrono',
  'combineFrom.example3Desc':
    'Usar a opção <code>startWith</code> ou <code>initialValue</code> para lidar com observáveis async:',
  'combineFrom.example4': 'Exemplo 4: Exemplo real - Dados Filtrados',
  'combineFrom.example4Desc':
    'Combine os critérios de busca com um recurso API para realizar a filtragem e a triagem ao lado dos clientes:',
  'combineFrom.example5': 'Exemplo 5: Iniciação Deduplicada',
  'combineFrom.example5Desc':
    'Deduplicar a emissão inicial do sinal. Fontes separadas ainda pode produzir combinações intermediárias; use computed() para derivação sincronal-only.',
  'combineFrom.apiSummary':
    'Combina fontes de Observable e Signal com semânticas de combineLatest e deduplação por fonte.',
  'combineFrom.paramSources':
    'Um objeto ou array de Observables ou Signals para combinar. Quando um objeto for fornecido, o resultado vai ser um objeto com as mesmas chaves.',
  'combineFrom.paramOperator': 'Um operador de tubo RxJS para manipular os valores emitidos antes que sejam emitidos.',
  'combineFrom.paramOptions': 'Opções de configuração, incluindo initialValue e injector.',
  'combineFrom.returnsDesc':
    'Um sinal que emite um array ou objeto (dependendo do tipo de entrada) que contém os últimos valores a partir de todos os observáveis e sinais-fonte.',
  'resourceAsync.title': 'resourceAsync',
  'resourceAsync.overview':
    'A função <code>resourceAsync</code> cria um recurso reativo que gerencia operações assíncronas com rastreamento de estado completo. Funciona com qualquer operação assíncrona (Observable, Promise ou valor síncrono). Fornece cancelamento automático de solicitações, capacidade de recarregar manualmente e rastreamento de status granular.',
  'resourceAsync.basicSection': 'Exemplos básicos',
  'resourceAsync.intermediateSection': 'Exemplos Intermédios',
  'resourceAsync.whenToUseSection': 'Quando utilizar',
  'resourceAsync.advancedSection': 'WritableResourceRef - Gestão Local',
  'resourceAsync.nestedSection': 'Padrão avançado: Recursos Nested',
  'resourceAsync.example1': 'Exemplo 1: Cervejaria reativa básica com rastreação autodependente',
  'resourceAsync.example1Desc':
    'Cria um recurso que recupera automaticamente os dados e reinventas sempre que as dependências mudam. Qualquer sinal lido dentro da função-fonte torna-se uma dependência reativa.',
  'resourceAsync.example2': 'Exemplo 2: Carga Láctea',
  'resourceAsync.example2Desc':
    'Utilize o <code>lazy: true</code> para adiar o carregamento até que o <code>reload()</code> seja chamado. O recurso vai começar em estado inactivo e vai para a obtenção dos dados até que seja explicitamente acionado:',
  'resourceAsync.loadUsers': 'Carregar os Usuários',
  'resourceAsync.notLoadedIdle': 'Ainda não carregado (sem carga)',
  'resourceAsync.example3': 'Exemplo 3: Valor inicial',
  'resourceAsync.example3Desc': 'Fornecer um valor inicial para exibir antes que a primeira obtenção termine:',
  'resourceAsync.example3Callout':
    'Usuário ao navegar a partir de uma lista para a página de detalhes onde você já tem alguns dados para exibir imediatamente.',
  'resourceAsync.example4': 'Exemplo 4: Manuseio de Erro com o Fallback e Propagação de Erro',
  'resourceAsync.example4Desc':
    'Manuseie erros com o callback <code>onError</code> para fornecer valores de fallback ou use o <code>throwOnError: true</code> para propagarem erros:',
  'resourceAsync.triggerFallback': 'Pedido para o Trigger (vai cair)',
  'resourceAsync.showingFallback': 'A mostrar o usuário para trás após o erro',
  'resourceAsync.errorPropagation': 'Propagação de Erro',
  'resourceAsync.example5': 'Exemplo 5: Mutações com execute() - Formulário de Registro do Usuário',
  'resourceAsync.example5Desc':
    "Para mutações (POST/PUT/DELETE), use o método <code>execute()</code> em vez do <code>reload()</code>. O <code>execute()</code> retorna uma <code>Promise&lt;T&gt;</code> awaitável que resolve no valor exato escrito em <code>resource.value()</code>, limpa valores obsoletos e erros ao reexecutar e é seguro para chamadas 'fire-and-forget' sem rejeições não gerenciadas.",
  'resourceAsync.regUsername': 'Nome do usuário',
  'resourceAsync.regEmail': 'E-mail',
  'resourceAsync.regPassword': 'Senha',
  'resourceAsync.regSubmit': 'Registo',
  'resourceAsync.example6': 'Exemplo 6: Comportamentos (interruptor, escape)',
  'resourceAsync.example6Desc': 'Controle como múltiplas solicitações simultâneas são manuseadas:',
  'resourceAsync.example7': 'Exemplo 7: Tracking para o estado',
  'resourceAsync.example7Desc':
    'Acesso a informações sobre o estado granular com o sinal <code>status()</code>. Use <code>computed()</code> para o estado derivado:',
  'resourceAsync.example8': 'Exemplo 8: Definição declarativa para a Propagação AbortSignal',
  'resourceAsync.example8Desc':
    '<code>resourceAsync</code> suporta definição declarativa via <code>ResourceAsyncDefinition&lt;P, T&gt;</code> com <code>params</code> e <code>loader</code>, propagando <code>context.abortSignal</code> para rastreamento de geração de sinal de cancelamento e resolução de promise adiada.',
  'resourceAsync.declarativeTitle': 'Toque ao vivo: definição declarativa',
  'resourceAsync.quickSwitchDemo': 'Interface Rápida (Trigger Abort)',
  'resourceAsync.activeSearchLogs': 'Log de Sinal de Abandono e Ciclo de Solicitação em Tempo Real',
  'resourceAsync.optimisticTitle': 'Exemplo 1: Atualizações Otimistas - Toque Toggle',
  'resourceAsync.optimisticDesc':
    'Atualize o UI imediatamente antes da confirmação do servidor. Se o pedido do servidor falhar, você pode reverter a alteração. Isto fornece feedback instantâneo aos usuários.',
  'resourceAsync.cacheFirstTitle': 'Exemplo 2: Cache- Primeira Carga',
  'resourceAsync.cacheFirstDesc':
    'Mostrar os dados em cache imediatamente enquanto obter dados frescos ao fundo. Isto elimina o carregamento para os usuários com o conteúdo em cache.',
  'resourceAsync.formDraftTitle': 'Exemplo 3: Formar o Draft - Contador com Gravar / Descartar',
  'resourceAsync.formDraftDesc':
    'Permitir que os usuários editem os dados a nível local antes de gravar para o servidor. Eles podem gravar as alterações ou eliminá-los recarregando a partir do servidor.',
  'resourceAsync.nestedTitle': 'Implementação',
  'resourceAsync.nestedProjects': 'Projectos',
  'resourceAsync.nestedLoadingItems': 'A carregar itens...',
  'resourceAsync.nestedRefreshing': 'Estamos a refrescar...',
  'resourceAsync.nestedThName': 'Nome',
  'resourceAsync.nestedThStatus': 'Estatuto',
  'resourceAsync.nestedThOrg': 'Organização',
  'resourceAsync.nestedThActions': 'Acções',
  'resourceAsync.nestedLoadOrg': 'Carregar a Ordem',
  'resourceAsync.nestedRetry': 'Repetir',
  'resourceAsync.nestedRefreshItems': 'Actualizar os Itens',
  'resourceAsync.nestedLoadAllOrgs': 'Carregar Todos os Órgãos',
  'queryResource.title': 'queryResource',
  'queryResource.overview':
    '<code>queryResource</code> gerencia o estado do servidor de forma declarativa em Angular Signals, com cache e deduplicação. Em conjunto com <code>mutateResource</code> e <code>QueryClient</code>, coordena consultas periódicas em segundo plano, cache stale-while-revalidate, agrupamento de solicitações simultâneas e invalidação por tag.',
  'queryResource.comparisonTitle': 'Quando utilizar: queryResource vs. resourceAsync',
  'queryResource.comparisonIntro':
    'Ambos os primitivos usam o Angular Signals para as ligações reativas ao UI, mas abordam diferentes camadas da sua arquitectura de aplicativos:',
  'queryResource.cardResourceAsyncTitle': 'resourceAsync (Component- Local Async State)',
  'queryResource.cardQueryResourceTitle': 'queryResource (Casche-Entidade para o Server Partilhado)',
  'queryResource.scope': 'Âmbito',
  'queryResource.cache': 'Cache',
  'queryResource.mutations': 'Mutações',
  'queryResource.freshness': 'Freshness',
  'queryResource.polling': 'Alcatrão',
  'queryResource.invalidation': 'Invalidação',
  'queryResource.bestFor': 'Melhor para',
  'queryResource.resourceAsyncScopeDesc': 'Enrole-se estritamente para o ciclo de vida da instância de um componente.',
  'queryResource.resourceAsyncCacheDesc': 'Sem cache global, destruir o componente destruir os dados.',
  'queryResource.resourceAsyncMutationsDesc': 'Built-in execute() para detonadores únicos.',
  'queryResource.resourceAsyncBestForDesc':
    'Form submission states, filtros locais de busca tipo frente, getches de dados modali-isolados, exportação de arquivos.',
  'queryResource.queryResourceScopeDesc': 'Managed global through roadings ċcompoints by QueryClient.',
  'queryResource.queryResourceCacheDesc':
    'Chaves de consulta idênticas compartilhar em-voo HTTP pedidos e cache de memória.',
  'queryResource.queryResourceFreshnessDesc':
    'Tempo de expiração configurável e tempo de coleta (Stale-While-Revalidate).',
  'queryResource.queryResourcePollingDesc':
    'Coordenado pollInterval que respeita a visibilidade da guia automaticamente.',
  'queryResource.queryResourceInvalidationDesc': 'Auto-reinventado por invalidação por tag a partir da mutateResource.',
  'queryResource.queryResourceBestForDesc':
    'Entidades de servidor (usuários, painéis, projetos, estado-cluster) compartilhados em várias vistas.',
  'queryResource.thFeature': 'Característica',
  'queryResource.rowPrimaryLayer': 'Camada primária',
  'queryResource.rowPrimaryLayerResource': 'Sistema local de nível-componente',
  'queryResource.rowPrimaryLayerQuery': 'Sistema de servidor compartilhado para clientes',
  'queryResource.rowSharedMemory': 'Cache-memória partilhada',
  'queryResource.badgeNoneComponent': 'Nenhum (componente-ligado)',
  'queryResource.badgeGlobalKey': 'Global por QueryKey',
  'queryResource.rowDeduplication': 'Deduplicação Concurso para Solicitação',
  'queryResource.badgePerInstance': 'Por instância (switch/exhaust)',
  'queryResource.badgeClientCoalesced': 'Coalesced Client- wide',
  'queryResource.rowStaleWhileRevalidate': 'Stale- while- Revalidar',
  'queryResource.badgeManualPreserve': 'Manual (preserveValueOnError)',
  'queryResource.badgeAutoStale': 'Automático por staleTime',
  'queryResource.rowBackgroundPolling': 'Contexto',
  'queryResource.badgeNoneBuiltIn': 'Nenhum built-in (ou built externo)',
  'queryResource.badgeCoordinatedVisibility': 'Cuidados Coordenados + Visibilidade',
  'queryResource.rowTagInvalidation': 'Invalidação baseada em Tag-',
  'queryResource.badgeManualReload': 'Dispositivo de recarga manual',
  'queryResource.badgeAutoMutate': 'Automático por mutateResource',
  'queryResource.lifecycleTitle': 'Matriz de estados e sinais do ciclo de vida',
  'queryResource.lifecycleIntro':
    'As consultas gerenciam tanto carregamentos iniciais quanto revalidações em segundo plano. Use esta matriz para saber quando exibir spinners em tela cheia versus indicadores sutis de atualização sem travar a interface. A matriz pressupõe um valor bem-sucedido definido. hasValue() retorna false para um resultado undefined.',
  'queryResource.matrixState': 'Estado do ciclo de vida',
  'queryResource.matrixStatus': 'status()',
  'queryResource.matrixWhenToUse': 'Quando usar & comportamento na UI',
  'queryResource.matrixInitialLoad': 'Carregamento inicial (sem dados prévios)',
  'queryResource.matrixInitialLoadUsage':
    'Exiba um spinner central ou tela de skeleton. A UI ainda não tem dados para renderizar.',
  'queryResource.matrixResolved': 'Resolvido / Ocioso (dados atualizados)',
  'queryResource.matrixResolvedUsage': 'Exiba o conteúdo normalmente. Nenhuma requisição de rede está em andamento.',
  'queryResource.matrixRefreshingState': 'Revalidação em segundo plano (SWR / Invalidação)',
  'queryResource.matrixRefreshingUsage':
    'NÃO exiba um spinner em tela cheia! Mantenha os dados existentes visíveis e adicione um badge ou spinner sutil no topo. Evita piscamento e tela branca.',
  'queryResource.matrixInitialError': 'Erro inicial (sem dados prévios)',
  'queryResource.matrixInitialErrorUsage': 'Exiba uma tela de erro completa ou alerta com botão de repetição.',
  'queryResource.matrixRefreshError': 'Erro de atualização (com dados em cache)',
  'queryResource.matrixRefreshErrorUsage':
    'Mantenha os dados existentes na tela e exiba um toast flutuante ou banner de aviso.',
  'queryResource.placementTitle': 'Arquitetura: Posicionamento em Componentes vs. Serviços',
  'queryResource.loading': 'Carregando…',
  'queryResource.placementIntro':
    'Onde as consultas devem residir? Como o <code>queryResource</code> depende da injeção de dependências do Angular, ele opera perfeitamente em componentes e serviços. Escolha o posicionamento ideal com base no escopo e compartilhamento de estado:',
  'queryResource.thPlacement': 'Posicionamento',
  'queryResource.thScopeLifetime': 'Escopo e Ciclo de Vida',
  'queryResource.thStateSharing': 'Compartilhamento de Estado',
  'queryResource.thCoordination': 'Coordenação de Recarregamento',
  'queryResource.thRecommendation': 'Recomendado Para',
  'queryResource.rowComponentPlacement': 'Posicionamento em Componente',
  'queryResource.rowComponentScope': 'Vinculado ao injetor do componente; destruído ao desmontar',
  'queryResource.rowComponentSharing': 'Isolado a uma única instância de componente',
  'queryResource.rowComponentCoord': 'Gatilhos locais (query.reload())',
  'queryResource.rowComponentRec': 'Visualizações isoladas, modais, formulários, abas de detalhes',
  'queryResource.rowServicePlacement': 'Posicionamento em Serviço',
  'queryResource.rowServiceScope': 'Vinculado ao injetor do serviço; persiste através de navegações de rota',
  'queryResource.rowServiceSharing': 'Compartilhado sincronicamente entre múltiplos componentes e rotas',
  'queryResource.rowServiceCoord': 'Coordenação global via métodos de serviço e invalidação de tags',
  'queryResource.rowServiceRec': 'Sessão de autenticação, seleção ativa de banco/inquilino, mestre-detalhe',
  'queryResource.tabServicePatternA': 'Padrão A: Sessão de Autenticação Global (Serviço Raiz)',
  'queryResource.tabServicePatternADesc':
    'Um serviço singleton gerencia currentUser e updateProfile. Múltiplos componentes leem o mesmo Signal sem Subjects do RxJS ou barramentos de eventos.',
  'queryResource.tabServicePatternB': 'Padrão B: Mestre-Detalhe Parametrizado (Serviço de Recurso)',
  'queryResource.tabServicePatternBDesc':
    'Um serviço gerencia activeDatabaseId. Quando a lista mestra atualiza a seleção, o queryResource carrega automaticamente as especificações correspondentes.',
  'queryResource.tabComponentPlacement': 'Padrão C: Posicionamento em Componente (Visualização Isolada)',
  'queryResource.tabComponentPlacementDesc':
    'O posicionamento direto no componente é a abordagem mais direta quando os dados pertencem a uma única tela, dispensando arquivos de serviço extras.',
  'queryResource.simulatedTopbar': 'Navegação Superior Global',
  'queryResource.simulatedProfile': 'Cartão de Perfil do Usuário',
  'queryResource.simulatedMasterList': 'Lista Mestra (Selecionar Banco de Dados)',
  'queryResource.simulatedDetailCard': 'Visualização de Detalhes (Especificações)',
  'queryResource.updateNameBtn': 'Atualizar nome',
  'queryResource.componentPlacementAdvice':
    'O posicionamento em componente é recomendado quando os dados estão estritamente contidos em uma única tela. Ele se integra nativamente a inputs Signal input() e é limpo automaticamente ao desmontar.',
  'queryResource.demo1Section': 'Solicitação Coalescing',
  'queryResource.demo1SectionDesc':
    'Quando dois ou mais componentes montarem ao mesmo tempo e solicitarem a mesma chave de consulta, o <code>QueryClient</code> compartilha o primeiro pedido em rede de voo. Ambos os componentes recebem a mesma resposta exacta com tráfego redundante zero.',
  'queryResource.demo1PlaygroundTitle': 'Componentes independentes compartilham requisições de rede em andamento',
  'queryResource.demo1PlaygroundDesc':
    'Simula dois componentes independentes (TopbarStatusComponent e DashboardMetricsComponent) montados simultaneamente solicitando as mesmas métricas de cluster. Clique em "Recarregar consulta" para verificar que apenas 1 chamada HTTP real é realizada.',
  'queryResource.badgeDeduplication': 'Deduplicação',
  'queryResource.actualHttpCalls': 'Chamadas HTTP reais: {0}',
  'queryResource.reloadQuery': 'Recarregar consulta',
  'queryResource.widgetATitle': 'Barra de navegação global',
  'queryResource.widgetASubtitle': 'TopbarStatusComponent (Usuários ativos e status)',
  'queryResource.widgetBTitle': 'Cartão do painel principal',
  'queryResource.widgetBSubtitle': 'DashboardMetricsComponent (Carga de CPU e memória)',
  'queryResource.activeUsers': 'Usuários Activos',
  'queryResource.cpuLoad': 'Carga CPU',
  'queryResource.memoryUsage': 'Utilização da Memória',
  'queryResource.status': 'Estatuto',
  'queryResource.updated': 'Actualizado',
  'queryResource.demo2Section': 'Stale-While-Revalidate e políticas de frescor',
  'queryResource.demo2SectionDesc':
    "<code>staleTime</code> controla por quanto tempo os dados em cache permanecem frescos. Se um observador solicitar dados enquanto estão frescos, exibe instantaneamente a partir da memória. Se estiverem obsoletos, os dados em cache são exibidos imediatamente enquanto um refresh em segundo plano executa silenciosamente sem limpar a interface (indicado por <code>status: 'reloading'</code>).",
  'queryResource.focusRefetchNoteTitle': 'Recuperação ao focar a aba (refetchOnFocus)',
  'queryResource.focusRefetchNoteBody':
    'Por padrão, refetchOnFocus fica desativado no ngx-lift para proteger APIs corporativas contra picos de tráfego. Passe { refetchOnFocus: true } nas opções da consulta para atualizar automaticamente ao retornar à aba.',
  'queryResource.configuredStaleTime': 'Configurado staleTime: {0} segundos',
  'queryResource.freshnessBadgeFresh': 'FRESH',
  'queryResource.freshnessBadgeStale': 'STALE',
  'queryResource.networkCalls': 'Chamadas para a rede: {0}',
  'queryResource.triggerReadReload': 'Trigger Read / Reload',
  'queryResource.revalidatingAlert': 'Contexto revalidante em progresso... o UI existente permanece interativo!',
  'queryResource.clusterNodes': 'Nodes-aglomerados',
  'queryResource.healthyNodes': '{0} / {1} Healthy',
  'queryResource.region': 'Região',
  'queryResource.snapshotTime': 'Tempo para o Striptease',
  'queryResource.demo3Section': 'Polimento coordenado com Sensibilização para Visibilidade',
  'queryResource.demo3SectionDesc':
    'Configure <code>pollInterval</code> para atualizar periodicamente consultas ativas. Vários observadores solicitando intervalos diferentes são coordenados na taxa mais rápida. O polling automaticamente pausa quando a aba do navegador está oculta e reinicia imediatamente ao retornar.',
  'queryResource.demo3PlaygroundTitle': 'Contexto',
  'queryResource.demo3PlaygroundDesc':
    'Active a polinização e cuidado com o pulso cardíaco. Observe-o que faz a pausa, se mudar as mãos!',
  'queryResource.badgePolling': 'Alcatrão',
  'queryResource.startPolling': 'Toque inicial (3)',
  'queryResource.stopPolling': 'Parar o Polling',
  'queryResource.totalPollCycles': 'Ciclos de Poll Total: {0}',
  'queryResource.ping': 'Ping',
  'queryResource.lastPulse': 'Última Pulsação',
  'queryResource.pollingIdleMsg':
    'A polling é actualmente inactiva. Clique em Iniciar a polling para observar as verificações ao vivo coordenadas sobre o fundo.',
  'queryResource.demo4Section': 'Mutações e invalidação por tags (mutateResource)',
  'queryResource.demo4SectionDesc':
    '<code>mutateResource</code> manuseou as mensagens assíncronas. Após a mutação bem-sucedida, invalida as tags correspondentes, fazendo com que todas as consultas ativas com essas tags para reobter automaticamente os últimos dados do servidor em segundo plano.',
  'queryResource.demo4PlaygroundTitle': 'Invalidação baseada em Tag-',
  'queryResource.demo4PlaygroundDesc': 'Ao terminar a mutação, o usersQuery recupera-se automaticamente ao fundo!',
  'queryResource.badgeMutations': 'Mutações',
  'queryResource.addTeamMember': 'Adicionar o Membro da Equipa',
  'queryResource.nameLabel': 'Nome',
  'queryResource.namePlaceholder': 'por exemplo Charlie Brown',
  'queryResource.roleLabel': 'Papel',
  'queryResource.rolePlatformEngineer': 'Engenheiro da Plataforma',
  'queryResource.roleSre': 'Engenheiro para a Confiabilidade do Site',
  'queryResource.roleProductDesigner': 'Designer de produtos',
  'queryResource.addMemberBtn': 'Adicionar Membro',
  'queryResource.savingBtn': 'A salvar...',
  'queryResource.activeMembersTitle': 'Membros da Equipa Activa',
  'queryResource.thId': 'ID',
  'queryResource.thName': 'Nome',
  'queryResource.thRole': 'Papel',
  'queryResource.diagnosticsSection': 'Sistema de diagnóstico para o desenvolvedor',
  'queryResource.diagnosticsSectionDesc':
    'Registre provideQueryDevtools() uma vez em app.config.ts para exibir o botão flutuante apenas em desenvolvimento. Inspecione consultas no painel inferior enquanto usa o aplicativo.',
  'queryResource.diagnosticsPlaygroundTitle': 'Painel de consultas',
  'queryResource.diagnosticsPlaygroundDesc':
    'Pesquise, filtre e ordene consultas; inspecione dados em cache, erros e tempos. Buscar novamente executa o carregador selecionado. Esta prévia da documentação também está ativa em produção.',
  'queryResource.badgeDiagnostics': 'Diagnóstico',
  'queryResource.refreshDiagnostics': 'Recuperar o Diagnóstico',
  'queryResource.diagTotalEntries': 'Total de Entradas',
  'queryResource.diagActiveQueries': 'Intervenções Activas',
  'queryResource.diagInactiveQueries': 'Inative (GC Penning)',
  'queryResource.diagPendingRequests': 'Leituras pendentes',
  'queryResource.diagTotalObservers': 'Observadores totais',
  'queryResource.diagVisibility': 'Visibilidade',
  'queryResource.diagVisible': 'Active',
  'queryResource.diagHidden': 'Escondido / Inactivo',
  'queryResource.thQueryKey': 'Chave da Cervejaria',
  'queryResource.thObservers': 'Observadores',
  'queryResource.thRemainingGc': 'Contagem regressiva GC',
  'queryResource.thRemainingPoll': 'Próximo Poll In',
  'queryResource.noQueriesCached': 'Não existem itens de consulta actualmente em cache.',
  'queryResource.apiReference': 'API Referência',
  'mutateResource.title': 'mutateResource',
  'mutateResource.overview':
    '<code>mutateResource</code> coordena escritas assíncronas no servidor (POST, PUT, PATCH, DELETE) com invalidação de cache baseada em tag automática, estratégias de concorrência integradas (exhaust, concat, parallel) e sinais reativos de Angular.',
  'mutateResource.featuresTitle': 'Capacidade-Chave',
  'mutateResource.featuresIntro':
    'Diferente das perguntas somente-read- que desencadeiam reativamente a partir das alterações dos parâmetros, as mutações rodam rigorosamente sobre a interação explícita dos usuários.',
  'mutateResource.cardTagInvalidationTitle': 'Invalidação automática da marca',
  'mutateResource.cardTagInvalidationDesc':
    'Invalidar as tags sobre o sucesso em escrever para atualizar automaticamente todos os observadores queryResource ativos em toda a aplicação sem recarregar a canalização manualmente.',
  'mutateResource.cardConcurrencyTitle': 'Contagem configurável',
  'mutateResource.cardConcurrencyDesc':
    'Controle os envios simultâneos com "exhaust" (ignora cliques duplicados ou os associa à execução em andamento), "concat" (fila FIFO) ou "parallel" (padrão).',
  'mutateResource.cardSignalsTitle': 'Estado reactivo Signals',
  'mutateResource.cardSignalsDesc':
    'Fornece sinais reativos para value, error, status ("idle" | "loading" | "resolved" | "error") e isLoading, otimizados para a detecção de alterações OnPush.',
  'mutateResource.cardPromiseTitle': 'Devolve o Promise Direct',
  'mutateResource.cardPromiseDesc':
    'A chamada mutate() devolve um Promise padrão, permitindo que o async / aguardem e tente / pegue a sintaxe em manipuladores de eventos componentes.',
  'mutateResource.demo1Section': '1. Invalidação de tag com perguntas ativas',
  'mutateResource.demo1SectionDesc':
    'A submissão de uma mutação invalida as tags que combinam, desencadeando-as imediatamente para qualquer instância queryResource ativa que observe as tags.',
  'mutateResource.demo1PlaygroundTitle': 'Criar o Item Observar a Atualização da Consulta',
  'mutateResource.demo1PlaygroundDesc':
    'Emitir o formulário para adicionar um usuário. Observe como a tabela de usuário actualiza automaticamente através da invalidação da tag sem qualquer recarga manual das chamadas!',
  'mutateResource.badgeInvalidation': 'Invalidação da Marca',
  'mutateResource.addTeamMember': 'Adicionar o Membro da Equipa',
  'mutateResource.nameLabel': 'Nome',
  'mutateResource.namePlaceholder': 'por exemplo Dana Scully',
  'mutateResource.roleLabel': 'Papel',
  'mutateResource.rolePlatformEngineer': 'Engenheiro da Plataforma',
  'mutateResource.roleSre': 'Engenheiro para a Confiabilidade do Site',
  'mutateResource.roleProductDesigner': 'Designer de produtos',
  'mutateResource.addMemberBtn': 'Adicionar Membro',
  'mutateResource.savingBtn': 'A salvar...',
  'mutateResource.activeMembersTitle': 'Membros da Equipa Activa',
  'mutateResource.thId': 'ID',
  'mutateResource.thName': 'Nome',
  'mutateResource.thRole': 'Papel',
  'mutateResource.demo2Section': '3. Modos de Contagem: escape, concat, e paralelo',
  'mutateResource.demo2SectionDesc':
    'Teste como diferentes estratégias de concorrência lidam com cliques rápidos em botões. "exhaust" previne submissões acidentais duplas descartando ou unindo cliques duplicados enquanto uma mutação está em andamento.',
  'mutateResource.demo2PlaygroundTitle': 'Rápida Simulação para a Contagem',
  'mutateResource.demo2PlaygroundDesc':
    'Escolha um modo, em seguida, rapidamente clique em (Trigger 800ms Mutation) várias vezes para ver como as execuções são manuseadas.',
  'mutateResource.badgeConcurrency': 'Contornos',
  'mutateResource.modeLabel': 'Estratégia para a Condição',
  'mutateResource.modeExhaust': 'escape (baixar cliques duplicados rápidos - guarda-entrega dupla)',
  'mutateResource.modeConcat': 'concat (Novuas em sequência)',
  'mutateResource.modeParallel': 'paralelo (Executar cada invocação independente)',
  'mutateResource.triggerMutationBtn': 'Mutação Trigger 800ms',
  'mutateResource.totalClicks': 'Total de clicks para botões: {0}',
  'mutateResource.actualExecutions': 'Execuções Actuais: {0}',
  'mutateResource.inFlight': 'Atualmente em-voo: {0}',
  'mutateResource.recentLogs': 'Registos de execução',
  'mutateResource.clearLogs': 'Limpar o Registro',
  'mutateResource.noLogsYet': 'Ainda sem mutações realizadas. Clique no botão acima para começar.',
  'mutateResource.demo3Section': '2. Recuperação reativa do status Signals',
  'mutateResource.demo3SectionDesc':
    '<code>mutateResource</code> gerencia erros separadamente. Quando uma gravação falha, o sinal de erro recebe o erro, status passa a "error" e a Promise retornada é rejeitada para tratamento com try/catch.',
  'mutateResource.demo3PlaygroundTitle': 'Status Signals Hult Recuperação',
  'mutateResource.demo3PlaygroundDesc':
    'Activa a simulação da falha e activa a ação para inspeccionar o estado de erro reactivo.',
  'mutateResource.badgeError': 'Manuseio de Erro',
  'mutateResource.simulateErrorLabel': 'Simular um Erro para o Servidor 500',
  'mutateResource.saveSettingsBtn': 'Gravar a Configuração',
  'mutateResource.statusLabel': 'Estatuto',
  'mutateResource.isLoadingLabel': 'isLoading',
  'mutateResource.errorSuccessMsg': 'Configuração salva com sucesso!',
  'mutateResource.apiReference': 'API Referência',
  'injectParams.example1Title': 'Exemplo 1: Obter Todos os Parâmetros da Rota',
  'injectParams.example1Desc':
    'Quando chamadas sem quaisquer argumentos, devolve um sinal que contém o objeto completo:',
  'injectParams.example2Title': 'Exemplo 2: obter o Parâmetro Único',
  'injectParams.example2Desc':
    'Quando uma tecla é especificada, devolve o valor do parâmetro correspondente como um sinal:',
  'injectParams.example3Title': 'Exemplo 3: Transformar Parâmetros',
  'injectParams.example3Desc': 'Transformar parâmetros usando uma função de transformação:',
  'injectParams.example4Title': 'Exemplo 4: Transformar-se com o Valor Inicial',
  'injectParams.example4Desc': 'Transformar parâmetros com um valor inicial e conversão tipo:',
  'injectParams.example4Callout':
    'Quando o <code>initialValue</code> for fornecido como um booleano ou como um número, a função <code>transform</code> tem que ser fornecido devolvendo o mesmo tipo.',
  'injectParams.example5Title': 'Exemplo 5: Exemplo completo de uso',
  'injectParams.example5Desc': 'Um exemplo completo que mostra vários padrões de uso:',
  'injectParams.example6Title': 'Exemplo 6: Injector Custom',
  'injectParams.example6Desc':
    'Transmitir um <code>Injector</code> personalizado através dos objetivos das opções para acessar parâmetros da rota fora de um contexto de injeção ambiente (como funções compostable helper ou serviços dinâmicos):',
  'injectParams.title': 'injectParams',
  'injectParams.overview':
    'A função <code>injectParams</code> fornece um sinal reativo para os parâmetros da rota, atualizando automaticamente ao ocorrer navegação.',
  'injectParams.apiSummary': 'Injecta e transforma os parâmetros da rota como sinais reativos.',
  'injectParams.paramKeyOrTransform':
    'Quando um string é fornecido, devolve o valor desse parâmetro de rota. Quando uma função é fornecida, processa todos os parâmetros de rota. Quando omitido, devolve todas as compasso.',
  'injectParams.paramOptions':
    'objeto de configuração que contém a função de transformação, initialValue, e / ou injector.',
  'injectParams.returnsDesc': 'Um sinal que contenha o parâmetro de rota value(s) ou o resultado transformado.',
  'injectParams.usagePatterns': 'Padrões de Uso',
  'injectParams.pattern1': 'Sem argumentos: Devolve o sinal com todos os parâmetros da rota',
  'injectParams.pattern2':
    'Chave-passo: Devolve o sinal com o valor específico dos parâmetros (ou nulo se não estiver disponível)',
  'injectParams.pattern3': 'Transformar a função: Devolve o sinal com os parâmetros transformados',
  'injectParams.pattern4': 'Com as opções: Permite a conversão inicial e tipo',
  'injectQueryParams.title': 'injectQueryParams',
  'injectQueryParams.overview':
    'A função <code>injectQueryParams</code> fornece um sinal reativo para os parâmetros da consulta da URL.',
  'injectQueryParams.apiSummary': 'Injecta e transforma os parâmetros da consulta da rota como sinais reativos.',
  'injectQueryParams.paramKeyOrTransform':
    'Quando um string é fornecido, devolve o valor desse parâmetro de consulta. Quando uma função é fornecida, ele processa todos os parâmetros de consulta. Se for omitido, devolve todas as mensagens de consulta.',
  'injectQueryParams.paramOptions':
    'objeto de configuração que contém a função de transformação, initialValue, e / ou injector.',
  'injectQueryParams.returnsDesc':
    'Um sinal que contenha o parâmetro de consulta value(s) ou o resultado transformado.',
  'injectQueryParams.example1Title': 'Exemplo 1: Obter Todos os Parâmetros da Cervejaria',
  'injectQueryParams.example1Desc': 'Obter todos os parâmetros da consulta como um sinal:',
  'injectQueryParams.example2Title': 'Exemplo 2: obter o Parâmetro Único da Cervejaria',
  'injectQueryParams.example2Desc': 'Obter um parâmetro específico para a consulta pelo nome:',
  'injectQueryParams.example3Title': 'Exemplo 3: Transformar Parâmetros da Cervejaria',
  'injectQueryParams.example3Desc': 'Transformar parâmetros de consulta usando uma função de transformação:',
  'injectQueryParams.example4Title': 'Exemplo 4: Transformar-se com o Valor Inicial',
  'injectQueryParams.example4Desc': 'Transformar parâmetros de consulta com um valor inicial e conversão tipo:',
  'injectQueryParams.example5Title': 'Exemplo 5: Exemplo completo de uso',
  'injectQueryParams.example5Desc': 'Um exemplo completo que mostra vários padrões de uso:',
  'injectQueryParams.example6Title': 'Exemplo 6: Injector Custom',
  'injectQueryParams.example6Desc':
    'Transmitir um <code>Injector</code> personalizado através das opções objeto para acessar parâmetros de consulta para a rota fora de um contexto de injeção ambiente (como funções rotativas ou serviços dinâmicos):',
  'createTrigger.title': 'createTrigger',
  'createTrigger.overview':
    'A função <code>createTrigger</code> fornece uma forma de iniciar manualmente recálculos de sinal por meio de referência ao sinal de gatilho que ela cria. Similar a um Subject do RxJS, chamar <code>next()</code> incrementa o sinal de contador e notifica os efeitos dependentes ou os sinais computados.',
  'createTrigger.apiSummary':
    'Cria um sinal de gatilho que pode ser usado para iniciar manualmente recálculos de sinal.',
  'createTrigger.propValue': 'Um sinal que devolve o número de vezes que o gatilho foi chamado (começa em 0).',
  'createTrigger.propNext': 'Um método para desencadear a atualização do sinal.',
  'createTrigger.returnsDesc': 'Um objeto que expõe o sinal de valor e o método de activação next().',
  'createTrigger.example1': 'Exemplo 1: Uso básico',
  'createTrigger.example1Desc': 'Crie um gatilho e use-o para despoletar manualmente as re- computações do sinal:',
  'createTrigger.example2': 'Exemplo 2: Efeito Condicional',
  'createTrigger.example2Desc': 'Usar o valor-gatilho condicionalmente para evitar a inicialização:',
  'createTrigger.btnSeeConsole': 'Ver o Registo da Consola',
  'createTrigger.callout':
    "Inicialmente, o <code>createTrigger's value()</code> devolve 0. Sempre que o <code>next</code> for explicitamente chamado, o valor adiciona 1.",
  'pageContainer.title': 'Contentor da Página',
  'pageContainer.overview':
    'O componente <code>cll-page-container</code> fornece uma shell padronizada, responsiva e uniforme para aplicações Clarity. Ele encapsula tipografia uniforme de título, padding fluido e espaçamento consistente, enquanto oferece uma slot de projeção de conteúdo para vistas, cartões, formulários e grade arbitrárias.',
  'pageContainer.example1': 'Exemplo 1: Contentor básico da página',
  'pageContainer.example1Desc': 'Defina um título obrigatório e elementos de visão arbitrária para a página principal.',
  'pageContainer.example1Badge': 'Chave da Página',
  'pageContainer.example2': 'Exemplo 2: Espaçamento Custom Maxima Largura',
  'pageContainer.example2Desc':
    'Passe o layout Clarity ou as classes de utilidade personalizadas para customClass para controlar a densidade de layout.',
  'pageContainer.example2Badge': 'Resposta',
  'pageContainer.example3': 'Exemplo 3: Dinâmica HTML Markup em Título da Página',
  'pageContainer.example3Desc':
    'A entrada-título renderiza através innerHTML, permitindo distintivos, indicadores de status ou tags diretamente no cabeçalho.',
  'pageContainer.example3Badge': 'Título HTML',
  'pageContainer.demoUserManagement': 'Gestão do Usuário',
  'pageContainer.demoBodyContent': 'Page conteúdo do corpo renderizado dentro da ranhura padrão.',
  'pageContainer.demoClusterSettings': 'Configuração do Registador',
  'pageContainer.demoConfigured': 'Configurado com as aulas de estilo personalizado.',
  'pageContainer.demoAuditLog': "Registo de Auditoria <span class='badge badge-info'>Vivo</span>",
  'pageContainer.demoLogStream': 'Registar as entradas que fluem aqui em tempo real.',
  'pageContainer.apiSummary': 'Wrapper padronizado de página com margens responsivas e tipografia de header.',
  'pageContainer.inputTitle': 'O título exibido no alto do recipiente. Renderou-se por innerHTML.',
  'pageContainer.inputCustomClass': 'Classes adicionais CSS aplicadas diretamente ao elemento root do recipiente.',
  'pageContainer.contentProjectionDesc':
    'Slot <ng-content /> por omissão para colocar todo o conteúdo da página principal abaixo do título.',
  'alert.title': 'Alerta',
  'alert.overview':
    'Alertas são bandeiras que chamam a atenção do usuário para mensagens importantes. Elementos visuais como ícones e cores indicam o tipo e a urgência da informação sendo comunicada. Use alertas para fornecer informações críticas que exigem atenção imediata dentro do contexto atual.',
  'alert.example1': 'Exemplo 1: Mostrar a resposta ao erro API',
  'alert.example1Desc':
    'Ao apresentar as respostas a erros a partir do APIs, use a entrada de erros para passar detalhes a erros. O alerta mostra a mensagem de erro a partir do objeto de resposta ou vai para o HttpErrorResponse.',
  'alert.example1Badge': 'Erro API',
  'alert.example2': 'Exemplo 2: Mostrar o Conteúdo Personalizado',
  'alert.example2Desc':
    'O conteúdo é renderizado usando innerHTML, permitindo a formação rica e as tags HTML embarcadas em vários níveis de alerta.',
  'alert.example2Badge': 'Texto rico',
  'alert.example3': 'Exemplo 3: Projecção de Conteúdo',
  'alert.example3Desc':
    'O componente de alerta suporta projeção de conteúdo via ng-content, permitindo a inclusão de estruturas HTML complexas e componentes filhos.',
  'alert.example3Badge': 'ng- teor',
  'alert.example4': 'Exemplo 4: Conceito compacto (isSmall)',
  'alert.example4Desc': 'Utilize a entrada isSmall para exibir um alerta compacto para gavetas e pequenos recipientes.',
  'alert.example4Badge': 'Compact',
  'alert.example5': 'Exemplo 5: Alertas em peso-luz',
  'alert.example5Desc':
    'Usar alertas sem limites sem restrições dentro dos cartões, tabelas, e layouts status aninhados.',
  'alert.example5Badge': 'Peso-leve',
  'alert.example6': 'Exemplo 6: Ajustas App- Level',
  'alert.example6Desc':
    'Colocar alertas para alto nível-prioridade para o alto nível em todo o conteúdo e a navegação.',
  'alert.example6Badge': 'App- Level',
  'alert.apiSummary':
    'Componente de alerta que exibe mensagens importantes com vários tipos e estilos do tema Clarity.',
  'alert.inputAlertType': 'Um dos valores: "info", "warning", "success", "danger", "neutral", "loading", "unknown".',
  'alert.inputIsAppLevel': 'Bandeira booleana para alertas ao nível app- exibido no alto da viewport.',
  'alert.inputIsSmall': 'Bandeira booleana para o dimensionamento compacto em recipientes ou gavetas apertados.',
  'alert.inputIsLightweight': 'Bandeira booleana para estilo leve sem fronteiras.',
  'alert.inputError': 'Um HttpErrorResponse ou objeto de erro para exibir detalhes de erros.',
  'alert.inputContent':
    'Um texto que contém o conteúdo da mensagem de alerta. Suporta as tags HTML através do innerHTML.',
  'alert.contentProjectionDesc':
    'O componente suporta projeção via ng-content para estruturas HTML complexas e componentes Angular.',
  'alert.projectionNotice': 'Múltiplos erros são listados como abaixo por projeção de conteúdo:',
  'alert.errUndefined': 'Não é possível ler indefinido.',
  'alert.errObject': 'Não é possível carregar um objeto.',
  'alert.serverDown': 'O servidor está em baixo',
  'alert.contentSuccess': 'Eu sou um conteúdo bem-sucedido',
  'alert.contentInfo': 'Eu sou um conteúdo info',
  'alert.contentWarning': 'Eu sou um conteúdo de alerta',
  'alert.contentDanger': 'Eu sou um teor em perigo',
  'alert.contentHtml': '<strong>Hell world </strong>, Eu gosto clr-lift!',
  'alert.contentSmall': 'Eu sou um pequeno alerta',
  'alert.contentNeutral': 'Eu sou um conteúdo neutro',
  'alert.contentLoading': 'Eu sou um conteúdo para carregamento',
  'alert.contentUnknown': 'Eu sou um conteúdo desconhecido',
  'alert.contentAppLevel': 'Alerta nível App a partir da entrada de conteúdo',
  'alert.contentAppProjection': 'Alerta para o nível da aplicação a partir da projecção',
  'alert.btnView': 'Ver',
  'callout.title': 'Callot',
  'callout.overview':
    'O componente <code>cll-callout</code> exibe uma caixa de notificação informativa projetada para destacar notas importantes, dicas, avisos ou instruções prévias com exibição de ícones responsiva e consciência do tema.',
  'callout.example1': 'Exemplo 1: Callot básico para a informação',
  'callout.example1Desc': 'Projectar mensagens simples ou destaques usando a projeção predefinida para o conteúdo.',
  'callout.example2': 'Exemplo 2: Listas e Ligações',
  'callout.example2Desc':
    'Os callouts manipulam as listas formatadas e as hiperligações externas sem problemas, tanto em modo luz como em modo escuro.',
  'callout.example3': 'Exemplo 3: Teor rico com cabeçalhos e distintivos',
  'callout.example3Desc':
    'Compor cabeçalhos, parágrafos descritivos e distintivos Clarity dentro do recipiente para projeção.',
  'callout.example1Note': 'Por favor, note que todas as alterações de configuração têm efeito imediatamente.',
  'callout.example2Theme': 'Suporta tanto temas claros como obscuros automaticamente.',
  'callout.example2Docs': 'Para obter mais detalhes, confira a documentação Clarity Design System.',
  'callout.example3Tip': 'Dica pro para a implantação da produção',
  'callout.example3DescText':
    'Assegurar que os limites dos recursos são explicitamente configurados antes de desencadear o processo rollout.',
  'callout.example3LabelDeployment': 'Implementação',
  'callout.example3LabelValidated': 'Validades',
  'themeToggle.title': 'Toque em Tema',
  'themeToggle.overview':
    'O componente <code>cll-theme-toggle</code> e o <code>ThemeService</code> permitem a troca de temas entre o modo claro e escuro do Clarity com reatividade de sinal e persistência no localStorage.',
  'themeToggle.callout':
    'O botão rotativo torna-se automaticamente um ícone lunar em modo luz e um ícone sol em modo escuro, incluindo dicas de ferramentas localizadas e anúncios acessíveis para a marca-aria.',
  'themeToggle.example1Badge': 'Toque Interactivo',
  'themeToggle.example1Desc': 'Clique no botão rotativo para alterar os temas e observar a emissão reativa:',
  'themeToggle.currentTheme': 'Tema actual Signal:',
  'themeToggle.inspectorTitle': 'Tema Inspetor Signal',
  'themeToggle.inspectorDesc': 'Sistema ao vivo sincronizado com document.body e localStorage',
  'themeToggle.example2Badge': 'Controlo Programático',
  'themeToggle.example2Desc':
    'Utilize o ThemeService para ler o tema actual reactivamente ou programaticamente definir um tema específico:',
  'themeToggle.setLight': 'Defina o Tema da Luz',
  'themeToggle.setDark': 'Ajustar o Tema das Trevas',
  'themeToggle.example3': 'Exemplo 3: CSS / SCSS Selectores para o Estibordo Tema',
  'themeToggle.example3Desc':
    'Componentes e estilos globais podem alvo [cds-theme="dark"] no corpo ou via :host-context([cds-theme="dark"]):',
  'themeToggle.serviceSummary': 'Serviço inconcebível fornecido em root para a gestão do estado-tema da aplicação.',
  'spinner.title': 'Spinner',
  'spinner.overview':
    'Um spinner é um indicador visual de um processo em andamento iniciado pelo usuário. O Clarity possui dois tipos de spinners, cada um com seu próprio caso de uso: <strong>Spinners de página</strong> para rastrear o progresso de uma operação relacionada a toda a página, e <strong>Spinners em linha</strong> para rastrear o progresso de uma operação relacionada a um componente específico.',
  'spinner.example1': 'Exemplo 1: Spinner por Predefinição',
  'spinner.example1Desc': 'A rolagem por omissão é centrada, grande, e tem um tela em bloco.',
  'spinner.example2': 'Exemplo 2: Variações Tamanho',
  'spinner.example2Desc': 'Os rotores podem ser exibidos em tamanhos diferentes: grandes (padrão), médios e pequenos.',
  'spinner.example3': 'Exemplo 3: Opções para Alinhamento',
  'spinner.example3Desc': 'Controle o alinhamento da rolagem usando a entrada central.',
  'spinner.example4': 'Exemplo 4: Custom Styling',
  'spinner.example4Desc': 'Aplique as categorias CSS personalizadas para a rolagem para o estilo adicional.',
  'spinner.example5': 'Exemplo 5: Interligar o Spinner',
  'spinner.example5Desc':
    'Usar a entrada em linha para exibir a rolagem como um elemento inline-block, útil para alinharem os spinners dentro de texto ou outros elementos inline.',
  'spinner.large': 'Grande (por omissão):',
  'spinner.medium': 'Meio:',
  'spinner.small': 'Pequena:',
  'spinner.centered': 'Centrado (por omissão):',
  'spinner.leftAligned': 'Alinhamento à esquerda:',
  'spinner.loading': 'A carregar...',
  'tooltip.title': 'Tooltip',
  'tooltip.overview':
    'O componente Tooltip fornece uma forma flexível de exibir informações adicionais, dicas ou conteúdo interativo. Ele suporta ações de pausa e cópia dentro do popover do conteúdo, opções de atraso configuráveis, posicionamento automático, rastreamento de foco para acessibilidade, interação ao clicar fora, operações com teclado e suporte ao modo escuro.',
  'tooltip.example1': 'Exemplo 1: Dica Básica',
  'tooltip.example1Desc':
    'Neste uso, você pode simplesmente adicionar uma dica para a ferramenta especificando o conteúdo diretamente ou através da Diretiva cllTooltipContent. configurações adicionais como o atraso para esconder e a largura podem ser personalizadas como por suas necessidades.',
  'tooltip.example2': 'Exemplo 2: Dica-ferramentas com conteúdo dinâmico',
  'tooltip.example2Desc':
    'O tooltip aceita conteúdo dinâmico fornecido por templates Angular. Você pode especificar templates usando ng-template e vinculá-los ao componente tooltip para exibição dinâmica.',
  'tooltip.example3': 'Exemplo 3: Criação de Componente Dinâmico',
  'tooltip.example3Desc': 'Tooltip pode criar componentes Angular usando ComponentRef ou tipo de componente.',
  'tooltip.example4': 'Exemplo 4: Posições em Tooltip',
  'tooltip.example4Desc': 'Apoia 12 diferentes orientações para a colocação com detecção inteligente de colisões.',
  'tooltip.apiSummary':
    'Diretiva para adicionar funcionalidade de Tooltip a elementos com posicionamento automático e detecção de colisão.',
  'tooltip.basic1': 'Dica Básica para a Tooltip 1',
  'tooltip.basic2': 'Dica básica 2 com o atraso 500ms',
  'tooltip.empty': 'Content Von Vazio Show Tooltip',
  'tooltip.templateHover': 'TemplateRef Example Hover',
  'tooltip.templateText': 'Um bom ponto para ferramentas:',
  'tooltip.templateCallout': 'Você também pode colocar um componente dentro de ng-template',
  'tooltip.contextCallout':
    'cllTooltipContentContext é opcional, é o contexto passado para o ng-template durante a criação da vista.',
  'tooltip.componentRefHover': 'Exemplo de Ref do Componente',
  'toast.title': 'Tostas',
  'toast.overview':
    'As mensagens Toast servem como uma forma amigável para comunicar eventos de prioridade média que os usuários podem desejar referenciar mais tarde. Essas mensagens aparecem temporariamente na tela e podem ser armazenadas em um painel de notificações até que sejam fechadas ou expiradas.',
  'toast.example1': 'Exemplo 1: Configuração Toast Container',
  'toast.example1Desc':
    'Para implementar mensagens torradas, importem ToastContainerComponent a partir de clr-lift e incluem <cll-toast-container [timeoutSeconds]="8" /> em seu componente root.',
  'toast.example2': 'Exemplo 2: Criar torrado com addToast',
  'toast.example2Desc':
    'Use addToast para passar um objeto torrado com as propriedades necessárias (título e descrição) e configurações opcionais.',
  'toast.example3': 'Exemplo 3: Shortard APIs',
  'toast.example3Desc': 'São fornecidos quatro curtos APIs para criar torradas com diferentes tipos de status:',
  'toast.serviceSummary': 'Serviço para a criação e gestão de notificações torradas.',
  'toast.guidelinesTitle': 'Orientações para a utilização',
  'toast.doTitle': 'Faça:',
  'toast.do1': 'Fornecer Navegação: Inclua um elo ou local para que os usuários para navegar a partir do torrado.',
  'toast.do2':
    'Usar calendários relativos: Mostrar calendários em relação ao usuário (por exemplo, há 1 hora atrás em vez de uma data absoluta).',
  'toast.do3':
    'Manter títulos curtos: Usar um título curto, sucinto (max 35 caracteres) que transmite a mensagem alto-nível rapidamente.',
  'toast.do4': 'Descrição para o consumo: Mantenha as descrições concisas (max 156 caracteres) para fácil consumo.',
  'toast.dontTitle': 'Não:',
  'toast.dont1': 'Usar o fecho como ação: Clicando o botão fecho deve fechar o torrado.',
  'toast.dont2':
    'Ações sobre-multidão: Limitar as mensagens torradas a um máximo de 2 ações; priorizar as mais importantes.',
  'toast.dont3':
    'Inclua identificadores de objeto em Título: evite usar identificadores de objeto no título; use-os somente na descrição.',
  'toast.dont4': 'Adicionar Ícones: Para manter clareza, evitar adicionar ícones para as mensagens torradas.',
  'toast.dont5':
    'Mostrar os Tostas Irrelevantes: Mostrar os Tostas somente quando a informação ainda for relevante para o usuário.',
  'toast.optionsTitle': 'Interface ToastOptions',
  'toast.containerSummary':
    'Componente Container que possui todas as notificações torradas. Deve aparecer apenas uma vez em seu aplicativo.',
  'multiAlerts.title': 'Alertas (Múltiplas)',
  'multiAlerts.overview':
    'Frequentemente, há a necessidade de exibir múltiplos alertas, especialmente aqueles no nível de aplicação posicionados no topo. A biblioteca clr-lift oferece duas ferramentas essenciais: <code>AlertContainerComponent</code> e <code>AlertService</code> para adicionar, remover e gerenciar alertas de forma programática.',
  'multiAlerts.example1': 'Exemplo 1: Contentor de alerta para a configuração',
  'multiAlerts.example1Desc':
    'Importar AlertContainerComponent e incluir <cll-alert-container /> sobre a tag cabeçalho Clarity dentro do recipiente principal.',
  'multiAlerts.example2': 'Exemplo 2: Uso básico',
  'multiAlerts.example2Desc':
    'Importar AlertService e utilizar os seus métodos addAlert(), deleteAlert() ou clearAlerts() para a gestão eficaz das alertas.',
  'multiAlerts.example3': 'Exemplo 3: Uso avançado com elementos interativos',
  'multiAlerts.example3Desc':
    'Colocar elementos interativos (como botões ou links) em qualquer posição dentro da mensagem usando o conteúdo com targetSelector, ou fornecer botões de ação estruturados.',
  'multiAlerts.example4': 'Exemplo 4: Demonstração Interactiva',
  'multiAlerts.example4Desc':
    'Tente adicionar diferentes tipos de alertas e alertas para a compensação usando os botões abaixo:',
  'multiAlerts.serviceSummary': 'Serviço para a gestão de alertas múltiplos programáticos.',
  'multiAlerts.alertTypeTitle': 'Tipo de Alerta',
  'multiAlerts.containerSummary':
    'Componente do recipiente que apresenta todos os alertas. Deve ser colocado sobre a tag cabeçalho Clarity dentro do recipiente principal.',
  'fileReader.title': 'Leitor de Ficheiros',
  'fileReader.overview':
    'O componente <code>FileReaderComponent</code> permite que você facilmente navegue e leia o conteúdo de arquivos de texto. Ele suporta a seleção de arquivos, leitura do conteúdo como texto plano ou string codificada em base64, validação do tamanho do arquivo e emite eventos quando arquivos são selecionados ou removidos.',
  'fileReader.example1': 'Exemplo 1: Leitor básico de arquivos',
  'fileReader.example1Desc': 'Uso básico com integração para controle de formulário:',
  'fileReader.example2': 'Exemplo 2: Leitor de arquivos certificado com Validação',
  'fileReader.example2Desc':
    'Leitor de arquivos com a validação do certificado e a visualização do sinal do certificado:',
  'fileReader.apiSummary': 'Componente para navegar e ler o conteúdo de arquivos com suporte a validação.',
  'fileReader.feature1': 'Navegação e selecção dos arquivos',
  'fileReader.feature2': 'Leitura de conteúdo como texto ou string codificado pelo base64',
  'fileReader.feature3': 'Válvula para o tamanho do arquivo',
  'fileReader.feature4': 'Tratamento de erros para processamento de conteúdo',
  'fileReader.feature5': 'Integração para o controle dos formulários',
  'keyValueInputs.title': 'Valor-Chave Entradas',
  'keyValueInputs.overview':
    'O componente <code>KeyValueInputsComponent</code> é um componente Angular projetado para facilitar a entrada de pares de chave-valor. Ele fornece um formulário dinâmico que permite aos usuários adicionar, editar e remover pares de chave-valor com integração com FormArray, validação em tempo real e navegação inteligente com teclado.',
  'keyValueInputs.example1': 'Exemplo 1: Uso básico',
  'keyValueInputs.example1Desc':
    'Criar um formulário com um FormArray e usar KeyValueInputsComponent para gerenciar pares-valor-chave:',
  'keyValueInputs.example2': 'Exemplo 2: Demonstração Interactiva',
  'keyValueInputs.example2Desc': 'Tente adicionar, editar e remover pares-valor-chave no formulário abaixo:',
  'keyValueInputs.callout':
    'Explore como o KeyValueInputsComponent permite que o UniqueValidator faça a validação contra controles-chave. Clique aqui para saber como a unicidade é executada em campos-chave para entrada.',
  'keyValueInputs.formOutput': 'A saída para o seu valor de formulário:',
  'keyValueInputs.keyHelper': 'Correr a chave para a propriedade a tempo',
  'keyValueInputs.valueHelper': 'Correr o valor da propriedade em tempo',
  'keyValueInputs.addText': 'adicionar o valor-chave',
  'keyValueInputs.apiSummary':
    'Componente para gerenciar entradas dinâmicas de pares de chave-valor em formulários Angular.',
  'statusIndicator.title': 'Indicador de estado',
  'statusIndicator.overview':
    'O componente <code>StatusIndicatorComponent</code> exibe um indicador de status com um ícone e texto. Ele suporta vários tipos de status (erro, sucesso, aviso, desconhecido, inativo, pendente), tamanhos personalizáveis de ícone e opções de dica para contexto adicional.',
  'statusIndicator.example1': 'Exemplo 1: Uso básico',
  'statusIndicator.example1Desc':
    'Mostrar os indicadores de status com diferentes tipos de status e tamanhos dos ícones:',
  'statusIndicator.example2': 'Exemplo 2: Com a Dica da Tooltip',
  'statusIndicator.example2Desc':
    'Adicione as dicas aos indicadores de status para obter informações contextuais adicionais:',
  'statusIndicator.types': 'Tipos de Estatal',
  'statusIndicator.iconSizeTshirt': 'Tamanho do Ícone (T- Camisa a Toque)',
  'statusIndicator.iconSizeNumber': 'Tamanho do Ícone (Número)',
  'statusIndicator.statusError': 'Erro',
  'statusIndicator.statusSuccess': 'Sucesso',
  'statusIndicator.statusWarning': 'Aviso',
  'statusIndicator.statusUnknown': 'Desconhecido',
  'statusIndicator.statusInactive': 'Inactividade',
  'statusIndicator.statusPending': 'Pendência',
  'statusIndicator.tooltipError': 'descrever a razão para o erro',
  'statusIndicator.tooltipSuccess': 'status is success',
  'statusIndicator.tooltipWarning': 'status is alert',
  'statusIndicator.tooltipUnknown': 'estado desconhecido',
  'statusIndicator.tooltipInactive': 'estado inactivo',
  'statusIndicator.tooltipPending': 'alguns que estão pendentes acontecem',
  'statusIndicator.apiSummary': 'Componente para exibir indicadores de status com ícones e texto.',
  'certificate.title': 'Sinal para o certificado (Visor)',
  'certificate.overview':
    'O componente <code>CertificateSignpostComponent</code>, um componente Angular, interpreta uma string PEM, exibindo o conteúdo do certificado com um clique no ícone do certificado. Integrado de forma suave com o Clarity, esse componente exibe detalhes cruciais, como o status do certificado, o período de validade, as informações do emissor e os valores de hash.',
  'certificate.example1': 'Exemplo 1: Parsing Raw PEM',
  'certificate.example1Desc': 'Analise e exiba a cadeia de certificado PEM crua:',
  'certificate.example2': 'Exemplo 2: Parsing PEM (Base64 codificado)',
  'certificate.example2Desc':
    'Quando as cordas PEM são codificadas pelo BAS64, rodem o pemEncoded para decodificar-se antes da separação:',
  'idleDetection.utilOverview':
    'Detecção de inatividade é o processo de monitorar a atividade do usuário e determinar quando o usuário se torna inativo. Isso é particularmente útil para aplicações que exigem que os usuários permaneçam autenticados, pois permite que o sistema tome ações apropriadas quando o usuário para de interagir com a aplicação, como alertar o usuário sobre um tempo de expiração iminente ou automaticamente logar o usuário de volta após um período de inatividade.',
  'idleDetection.utilOverviewDesc':
    'O serviço IDle Detection dispõe de durações sem fim e sem tempo configuráveis, reinicialização automática sobre a actividade do usuário, emissão de eventos para as fases sem fim e sem tempo, e suporte reativo à programação através dos observáveis RxJS.',
  'idleDetection.utilExample1Title': 'Exemplo 1: Configurar a Detecção de Idle Globalmente',
  'idleDetection.utilExample1Desc': 'Configurar a duração sem fim e sem tempo global usando a classe de configuração:',
  'idleDetection.utilPhaseCallout':
    'Há duas fases de detecção indevida: a <strong>fase de detecção da idle-</strong> e a <strong>fase de timing out</strong>.',
  'idleDetection.utilPhase1':
    '<strong>Fase de detecção de inatividade</strong>: Suponha que você configure <code>idleDurationInSeconds</code> para 5 * 60 (5 minutos). A partir do momento em que não houver nenhuma ação no site, você entra nessa fase. Após 5 minutos, a detecção de inatividade termina, indicando que você esteve inativo por um longo tempo. Você pode se inscrever no <code>onIdleEnd()</code> observable, que emitirá nesse momento. Uma vez que essa fase seja concluída, você entrará na segunda fase.',
  'idleDetection.utilPhase2':
    '<strong>Fase de tempo limite</strong>: Quando você entra nessa fase, o contador começa imediatamente a partir do valor de <code>timeoutDurationInSeconds</code>. Você pode se inscrever no <code>onCountDown()</code> observable para obter o valor do contador. Quando o contador atingir 0, a <strong>fase de tempo limite</strong> terminará. Você pode se inscrever no <code>onTimeoutEnd()</code> observable para saber quando a <strong>fase de tempo limite</strong> termina. Nesse momento, você pode logar o usuário ou executar outras ações.',
  'idleDetection.utilExample2Title': 'Exemplo 2: Configuração do Módulo',
  'idleDetection.utilExample2Desc': 'Fornecer a configuração em seu NgModule:',
  'idleDetection.utilExample3Title': 'Exemplo 3: Configuração da App em autônoma',
  'idleDetection.utilExample3Desc': 'Fornecer a configuração em um aplicativo autônomo:',
  'idleDetection.utilExample4Title': 'Exemplo 4: Usar o IdleDetectionService em Componente',
  'idleDetection.utilExample4Desc': 'Inscreva-se para o serviço Observáveis para reagir a eventos sem fim:',
  'idleDetection.utilExample5Title': 'Exemplo 5: Usar IdleDetectionComponent',
  'idleDetection.utilExample5Desc':
    'Oferecemos um componente em <code>clr-lift</code> que exibe um diálogo modal Clarity quando o usuário está inativo. O diálogo aparecerá quando a fase de detecção de inatividade terminar e começar a contar down. Uma vez que o contador termine, você pode hookar no <code>timeout</code> handler em seu componente para executar logica personalizada, como limpar o token localStorage e redirecionar o usuário para a página de login.',
  'idleDetection.utilExample5ParamDesc':
    'Os parâmetros <code>idleDurationInSeconds</code> e <code>timeoutDurationInSeconds</code> são opcionais. Quando estes parâmetros são passados, eles vão substituir a configuração passada pelo <code>provideIdleDetectionConfig</code>.',
  'idleDetection.utilDialogPreview': 'A janela parece-se com a seguinte:',
  'idleDetection.title': 'Detecção do Idle',
  'idleDetection.overview':
    'O componente <code>cll-idle-detection</code> monitora a inatividade do usuário em eventos DOM (movimento do mouse, teclas, rolagens e toque). Quando o período de inatividade expirar, ele abre um diálogo de contagem down acessível Clarity e emite um evento (timeout).',
  'idleDetection.example1': 'Exemplo 1: Simulação Interativa da Janela de Idle',
  'idleDetection.example1Desc':
    'Inicie uma rápida simulação de 3 segundos para visualizar o modal de contagem regressiva Clarity em ação:',
  'idleDetection.example2': 'Exemplo 2: Configuração Global com provideIdleDetectionConfig',
  'idleDetection.example2Desc':
    'Defina a aplicação por omissão em intervalos sem fim e sem tempo em appConfig usando provideIdleDetectionConfig.',
  'idleDetection.apiSummary':
    'Componente de diálogo modal Clarity exibindo a contagem down de expiração de sessão em inatividade.',
  'idleDetection.inputIdleDuration':
    'A duração da inatividade em segundos antes que o modal para contagem regressiva seja exibido.',
  'idleDetection.callout':
    'O modal inclui uma ação para Me manter-se em série que reinstala todos os horários sobre a interação do usuário. Se o usuário não responder, o evento (timeout) dispara para para permitir o logout seguro ou redirecionarem a rota.',
  'idleDetection.inputTimeoutDuration': 'A duração da fase contagem regressiva em segundos antes da sessão ocorrer.',
  'idleDetection.outputTimeout':
    'Emite um vazio quando a contagem regressiva chegar a 0 sem o reconhecimento do usuário.',
  'idleDetection.serviceSummary':
    'Serviço para a monitorização da actividade dos usuárioes e a detecção dos períodos sem actividade.',
  'idleDetection.methodSetConfig':
    'Ajusta a configuração de detecção sem fim. Substitua a configuração global se for fornecida.',
  'idleDetection.methodStartWatching': 'Começa a monitorizar a actividade do usuário para a detecção sem fim.',
  'idleDetection.methodClearTimers': 'Limpa todos os horários ativos e para o monitoramento.',
  'idleDetection.methodOnIdleEnd': 'Observable que emite quando a fase ociosa termina e a contagem regressiva começa.',
  'idleDetection.methodOnTimeoutEnd': 'Observable que emite quando o tempo para a contagem regressiva termina.',
  'idleDetection.methodOnCountDown':
    'Observable que emite os segundos restantes durante a fase de contagem regressiva.',
  'datagridUtil.title': 'Utilitários para o Datagred',
  'datagridUtil.overview':
    'O componente de datagrid Clarity emite um estado sempre que o usuário interage com paginação, filtros ou ordenação. Para facilitar a integração com solicitações de API, convertToHttpParams transforma o estado do datagrid em um objeto de consulta pronto para HttpParams.',
  'datagridUtil.example1': 'Exemplo 1: Usar convertToHttpParams',
  'datagridUtil.example1Desc':
    'A função convertToHttpParams transforma um estado Clarity Datagred em um objeto PageQuery adequado para HttpParams.',
  'datagridUtil.apiSummary':
    'Transforma um objeto de estado do Clarity Datagrid em um objeto PageQuery adequado para HttpParams em solicitações de API.',
  'datagridUtil.paramState':
    'O objeto de estado Clarity Datagred que contém a paginação, a triagem e as informações sobre o filtro. Pode ser nulo para a carga inicial.',
  'datagridUtil.returnsDesc':
    'Um objeto PageQuery que contém a página, pageSize, para definir a direção e para filtrar as cordas em formato FIQL.',
  'datagridUtil.propPage': 'Um primeiro número para a paginação.',
  'datagridUtil.propPageSize': 'O número de itens a exibir por página.',
  'datagridUtil.propSortAsc': 'O nome de campo para classificar em ordem crescente.',
  'datagridUtil.propSortDesc': 'Um nome para a ordem decrescente.',
  'datagridUtil.propFilter': 'A expressão do filtro formatado em formato FIQL.',
  'dgState.overview':
    'O operador <code>dgState</code> é um operador RxJS projetado para gerenciar as transformações de estado do Clarity Datagrid com debounce inteligente e filtragem de duplicatas. Ele avalia os alterações no estado do datagrid de filtros e lida com eventos de API de forma eficiente. Quando os filtros são modificados, o operador introduz um debounce de 500ms antes de iniciar a chamada de API, evitando solicitações excessivas durante tipagem rápida. Para ações como ordenação ou paginação, a chamada de API é feita imediatamente sem atraso. O operador também fornece um parâmetro opcional para controlar o uso do <code>distinctUntilChanged</code>. Quando habilitado (padrão: <code>true</code>), ele assegura que nenhuma chamada de API seja iniciada se o estado do datagrid permanecer o mesmo, evitando solicitações redundantes.',
  'dgState.example1Title': 'Exemplo 1: Uso básico',
  'dgState.example1Desc':
    'Usar o <code>dgState</code> em seu oleoduto observável para gerenciar as alterações do estado de dados com eficiência:',
  'dgState.example1DataDesc':
    'Assume que temos um API a retornar a seguinte forma de dados para um software a serviço:',
  'dgState.example2Title': 'Exemplo 2: Implementação do modelo com segurança tipo',
  'dgState.example2Desc': 'Usar o tubo async com <code>@if</code> para melhor segurança tipo:',
  'dgState.example3Title': 'Exemplo 3: Implementação alternativa do modelo',
  'dgState.example3Desc': 'Utilize o tubo async diretamente em seu modelo:',
  'dgState.example4Title': 'Exemplo 4: Um exemplo ao vivo',
  'dgState.example4Desc':
    'A seguir, há um exemplo funcional de um datagred a serviço usando o operador <code>dgState</code>:',
  'dgState.calloutPrefix': 'Você pode usar o ',
  'dgState.calloutSuffix':
    ' a função utilitário para converter o estado de dados em parâmetros HTTP. Veja a documentação para obter mais detalhes.',
  'dgState.apiDesc':
    'Operador RxJS para lidar com as transformações do estado Clarity Datagred com debuuncing e o comportamento opcional distinctUntilChanged.',
  'dgState.paramDesc':
    '<em> (Opcional) </em> Se para ativar a filtragem distinctUntilChanged. Predefinições para <code>true</code>. Quando <code>true</code>, suprime estados duplicados. Quando <code>false</code>, permite que API chama mesmo para estados idênticos.',
  'dgState.returnsDesc': 'Uma função para o operador que transforma as emissões do estado da Datagred.',
  'dgState.behavior1':
    'Adiciona um deboche 500 ms quando os filtros mudam (para evitar chamadas API excessivas durante a digitalização rápida)',
  'dgState.behavior2': 'Faz chamadas API rapidamente para ações de triagem ou paginação (sem debuult)',
  'dgState.behavior3':
    'Opcionalmente, filtros para fora estados consecutivos duplicados quando <code>enableDistinctUntilChanged</code> é <code>true</code>',
  'dgState.behavior4': 'Começa com um estado nulo para lidar com cenários de carga inicial',
  'timelineWizard.title': 'Feiticeiro para o Tempo',
  'timelineWizard.overview':
    'O componente TimelineWizard facilita a construção de wizards multi-etapa baseados em cronologia em aplicações Angular. Cada etapa é representada por um componente dedicado que estende TimelineBaseComponent, suportando navegação entre etapas, validação assíncrona e renderização dinâmica de componentes.',
  'timelineWizard.example1': 'Exemplo 1: Configuração Básica do Feiticeiro',
  'timelineWizard.example1Desc':
    'No exemplo a seguir, o assistente conta com quatro passos distintos. A array timelineSteps define a ordem sequencial de cada passo. Três passos incluem entrada em formulário, e a etapa final resume os dados.',
  'timelineWizard.example2': 'Exemplo 2: Componente básico para o passo',
  'timelineWizard.example2Desc':
    'Cada componente passo estende-se TimelineBaseComponent, especificando o tipo passo pertinente e inicializando o FormGroup.',
  'timelineWizard.example3': 'Exemplo 3: Mapeamento personalizado dos dados',
  'timelineWizard.example3Desc':
    'Quando o seu modelo FormGroup difere da estrutura timelineSteps, rodem formValueToData e dataToFormValue para mapeamento bidirecional.',
  'timelineWizard.example4': 'Exemplo 4: Mapeamento avançado dos dados com as entradas-valor para o teclado',
  'timelineWizard.example4Desc':
    'Caso de uso avançado que mostra a integração dataToFormValue e formValueToData com KeyValueInputsComponent:',
  'timelineWizard.example4Callout':
    'Para saber mais sobre KeyValueInputsComponent, por favor, visite a página de documentação Key Value Inputs.',
  'timelineWizard.example5': 'Exemplo 5: Revisão passo com a submissão API',
  'timelineWizard.example5Desc':
    'Consolidar dados a partir dos passos prévios usando TimelineWizardService e sobrepor next$ para construir a sua transmissão API stream.',
  'timelineWizard.example5Callout':
    'Você pode personalizar o next$ observável em qualquer passo, permitindo tanto operações síncronas como assíncronas, como as solicitações HTTP.',
  'timelineWizard.componentSummary': 'O componente principal responsável por gerir a linha temporal.',
  'timelineWizard.baseSummary':
    'A classe base para todos os componentes passo dentro da linha do tempo assistente. Ele fornece as propriedades e métodos essenciais para a gestão dos passos assistente.',
  'timelineWizard.stepSummary':
    'Interface que define as propriedades de um passo na configuração do assistente-linha temporal.',
  'timelineWizard.serviceSummary':
    'Um serviço que administra o estado e os dados do assistente-linha temporal em componentes passo-a-passo.',
  'timelineWizard.playgroundTitle': 'Playground para o Assistente Interativo para a Implementação',
  'timelineWizard.playgroundDesc':
    'Navegue passo-a-passo através da configuração para o operador, escala de serviço, Propriedades para a Corrida (editor-valor-chave), e a confirmação final.',
  'timelineWizard.playgroundBadge': 'Fluxo de Trabalho Empresarial',
  'timelineWizard.requiredInfo': 'Informação requerida',
  'timelineWizard.configureOperator': 'Configurar o Operador',
  'timelineWizard.configureService': 'Configurar o Serviço',
  'timelineWizard.configureRuntimeProperties': 'Configurar as Propriedades para a Corrida',
  'timelineWizard.name': 'Nome',
  'timelineWizard.namespace': 'Espaço dos nomes',
  'timelineWizard.cpu': 'CPU',
  'timelineWizard.replicas': 'réplicas',
  'timelineWizard.url': 'URL',
  'poll.overview':
    'O operador <code>poll</code> é um operador personalizado RxJS que simplifica o processo de consultar APIs para manter os dados atualizados. Ele permite que os desenvolvedores criem observáveis que emitem dados periodicamente em intervalos especificados, abstrair a complexidade de gerenciar intervalos de consulta e solicitações de API. Esse operador é especialmente útil quando atualizações em tempo real são necessárias, mas o servidor não suportar notificações por push (WebSockets, Server-Sent Events, etc.). Ele integra-se de forma suave com outros operadores RxJS, permitindo que os desenvolvedores construam pipelines reativos para lidar com fluxos de dados.',
  'poll.example1Title': 'Exemplo 1: Polling básico',
  'poll.example1Desc':
    'Dados sobre o poll em um intervalo especificado. A função polling suporta Promise, Observable ou valores primitivos:',
  'poll.example2Title': 'Exemplo 2: Poll Toll Condition is Met',
  'poll.example2Desc':
    'Usar os operadores RxJS como <code>takeWhile</code> para parar a polinização quando uma condição for cumprida:',
  'poll.example2Callout':
    'Você pode adicionar <code>takeUntil</code>, <code>takeWhile</code> ou outros operadores RxJS para controlar quando a polinização terminar.',
  'poll.example3Title': 'Exemplo 3: Poll com initialValue',
  'poll.example3Desc':
    "Por padrão, o resultado inicial do poll é <code>&#123;status: 'loading', isLoading: true, error: null, data: null&#125;</code>, o que é conveniente para exibir um indicador de carregamento. No entanto, em alguns casos, você pode não querer exibir um indicador de carregamento. Você pode definir <code>initialValue</code> para qualquer valor que deseje:",
  'poll.example4Title': 'Exemplo 4: Defender o Polling',
  'poll.example4Desc':
    'Por padrão, a polinização começa imediatamente. Use a opção <code>delay</code> para adiar o início da polinização:',
  'poll.example4AltDesc':
    'Em alternativa, você pode começar a polinização após a ação do usuário combinando <code>poll</code> com outros operadores RxJS:',
  'poll.btnStartPolling': 'Toque inicial (Ver Console)',
  'poll.example5Title': 'Exemplo 5: Reforce a força',
  'poll.example5Desc':
    'Use o <code>forceRefresh</code> observable ou sinal para disparar a execução do <code>pollingFn</code> sempre que necessário, como em resposta a ações do usuário. O valor emitido pelo <code>forceRefresh</code> será passado como entrada para o <code>paramsBuilder</code> (se fornecido) ou diretamente para o <code>pollingFn</code>.',
  'poll.example5SignalTitle': 'SignalRefresque a força com base em Parâmetros',
  'poll.example5SignalDesc':
    '<code>forceRefresh</code> aceita diretamente Angular Signals. Se ocorrerem múltiplas atualizações enquanto um pedido estiver em andamento, <code>exhaustMap</code> reduz os gatilhos intermédios, mas preserva o mais recente parâmetro para o próximo carrapato agendado.',
  'poll.btnRapidFilters': 'Alterações rápidas ao filtro (Burst 3x)',
  'poll.example6Title': 'Exemplo 6: Um exemplo avançado - Datagred com o Polling',
  'poll.example6Desc':
    'O datagred abaixo vai atualizar-se automaticamente a cada 10 segundos. Além disso, sempre que há uma mudança na entrada, desencadeando a filtragem, a triagem ou a paginação, o API vai ser rapidamente chamado, acompanhado por um rodante que indica o carregamento.',
  'poll.searchByFirstName': 'Procurar pelo primeiro nome',
  'poll.apiDesc':
    'Os dados dos pólos em um intervalo especificado e pode ser acionado manualmente. Devolve um observável que emite o resultado como um objeto AsyncState.',
  'poll.paramPollingFn': 'A função que devolve um Observable, Promise ou valor primitivo.',
  'poll.paramInterval': 'O intervalo em milissegundos entre cada sondagem.',
  'poll.paramForceRefresh': 'Um Observable ou Signal que desencadeia uma atualização manual.',
  'poll.paramParamsBuilder': 'Uma função que constrói parâmetros para a função polling com base no valor forceRefresh.',
  'poll.paramInitialValue': 'Um valor inicial AsyncState.',
  'poll.paramDelay': 'Atrase em millissegundos antes de iniciar a primeira sondagem.',
  'poll.returnsDesc':
    'Um observável que emite AsyncState<Data> objectos com estatuto; isLoading, erros e propriedades dos dados.',
  'createAsyncState.overview':
    'O operador <code>createAsyncState</code> transforma um observable do tipo <code>T</code> em um observable do tipo <code>AsyncState&lt;T&gt;</code>, encapsulando os estados de carregamento, erro e dados em uma estrutura padronizada. Isso elimina a necessidade de gerenciar variáveis separadas para estados de carregamento, erros e dados, tornando o código mais organizado e mantenedor.',
  'createAsyncState.interfaceStructure': 'A estrutura da interface <code>AsyncState</code> que o operador devolve:',
  'createAsyncState.example1Title': 'Exemplo 1: Solicitação simples',
  'createAsyncState.example1Desc': 'Lidar com um único pedido API com os estados de carregamento e erro:',
  'createAsyncState.example2Title': 'Exemplo 2: Com callbacks',
  'createAsyncState.example2Desc': 'Adicionar efeitos secundários para cenários de sucesso e erros:',
  'createAsyncState.example3Title': 'Exemplo 3: Fornecer initialValue',
  'createAsyncState.example3Desc':
    'Em cenários onde você tem dados iniciais (por exemplo, a partir do estado da rota), você pode fornecer um valor inicial para evitar a visualização de um rodante de carregamento. Isto é útil ao navegar a partir de uma lista para uma página de detalhes onde você já tem alguns dados:',
  'createAsyncState.example3Callout':
    "Ao fornecer <code>initialValue</code>, definir <code>status: 'idle'</code> e <code>isLoading: false</code> para evitar que a rolagem de carga apareça. Os dados serão atualizados sem restrições quando a chamada API terminar.",
  'createAsyncState.example4Title': 'Exemplo 4: Solicitações Dependentes',
  'createAsyncState.example4Desc': 'Corrida múltiplas solicitações usando <code>switchMap</code>:',
  'createAsyncState.example5Title': 'Exemplo 5: Uso do modelo',
  'createAsyncState.example5Desc': 'Usar o tubo async em modelos para lidar com diferentes estados:',
  'createAsyncState.apiSummary': 'Transforma um Observable do tipo T em um Observable de AsyncState<T, E>.',
  'createAsyncState.paramObserver':
    'Função ou objeto observador para lidar com os efeitos colaterais quando o observável emite valores ou erros.',
  'createAsyncState.paramInitialValue':
    'O valor inicial AsyncState a utilizar antes que o observável emita o primeiro valor.',
  'createAsyncState.returnsDesc': 'Uma função que transforma um fluxo observável em um estado assíncrono.',
  'createAsyncState.stateStatus': 'Acompanha o status: "idle" | "loading" | "reloading" | "resolved" | "error".',
  'createAsyncState.stateIsLoading':
    'Indica se há uma operação de carregamento em andamento (true quando status é "loading" ou "reloading").',
  'createAsyncState.stateError': 'Erro detalha se a operação assíncrona falhou ou nula.',
  'createAsyncState.stateData': 'Dados emitidos pelo observável ou nulo.',
  'resourceAsync.paramSourceFn': 'A função reativa que devolve um valor Observable, Promise ou síncrono.',
  'resourceAsync.paramOptions': 'Opções de configuração para o recurso.',
  'resourceAsync.propInitialValue': 'Valor inicial antes que a primeira obtenção termine.',
  'resourceAsync.propLazy': 'Se true, inicia no estado "idle" e aguarda uma chamada a reload().',
  'resourceAsync.propBehavior':
    'Comportamento em execuções simultâneas: "switch" cancela a execução anterior; "exhaust" ignora novas execuções. Padrão: "switch".',
  'resourceAsync.propOnError': 'Erro callback handler que pode fornecer valores fallback.',
  'resourceAsync.propThrowOnError': 'Se for verdade, erros são lançados em vez de armazenados em sinal de erro.',
  'resourceAsync.propOnSuccess': 'Callback invocado quando a operação for concluída com sucesso.',
  'resourceAsync.propOnLoading': 'Callback invocado quando a operação começar a carregar.',
  'resourceAsync.returnsDesc':
    'Um objeto ResourceRef<T, E> que expõe value, error, status, isLoading e métodos de alteração.',
  'spinner.apiSummary':
    'Componente para exibir indicadores de carregamento com tamanhos e alinhamentos personalizáveis.',
  'spinner.inputSize': 'Determina o tamanho spinner:',
  'spinner.inputCenter': 'Centra a rolagem como um elemento-bloco. Passe falso para desativar a concentração.',
  'spinner.inputInline': 'Especifica se o spinner deve ser exibido como um elemento inline-block.',
  'spinner.inputCustomClass': 'Um conjunto de categorias CSS adicionais para se aplicar ao rodante.',
  'callout.apiSummary': 'Um componente de destaque baseado no Sistema de Design Clarity.',
  'callout.contentProjectionDesc':
    'Fornece um slot <ng-content /> padrão para tornar o conteúdo HTML personalizado, texto, listas e componentes.',
  'callout.responsiveTitle': 'Comportamento Responsável',
  'callout.responsiveDesc':
    'O ícone decorativo está escondido em telas mais estreitas que 576px e exibe-se automaticamente em telas mais amplas.',
  'callout.themingTitle': 'Teming',
  'callout.themingDesc':
    'Inherits Clarity contexto tema e respeita a cds- tema = horny para contrasting fundo, borda, e estilos de elo.',
  'certificate.pemNote':
    'PEM significa Privacidade Enhançado Mail. Ele é um formato de arquivo que é muitas vezes usado para armazenar chaves criptográficas, certificados, e outros dados seguros. PEM arquivos tipicamente têm extensões como .sem, .crt, .cer, e .key.',
  'certificate.apiSummary': 'Componente para exibir informações de certificado em um sinal de Clarity.',
  'certificate.clickIcon': 'Clique no ícone do certificado abaixo para ver os detalhes do certificado:',
  'certificate.clickCert': 'Clique no ícone do certificado:',
  'certificate.inputPem': 'A cadeia PEM-formatado certificado para inspecionar.',
  'certificate.inputPemEncoded': 'Se a cadeia PEM fornecida for codificada com base em 64-codificado.',
  'certificate.inputPosition': 'Posição da mensagem em relação ao ícone-gatilho.',
  'certificate.inputShowIcon': 'Um valor booleano para gerenciar a visibilidade do ícone status do certificado.',
  'isPromise.overview':
    'A função utilitária <code>isPromise</code> é um guarda de tipo TypeScript que determina se um valor arbitrário é uma <code>Promise</code> ou <code>PromiseLike</code> (um objeto ou função que contém um método callable <code>then</code>). Ela permite verificar e encurtar o tipo de forma segura na execução, sem lançar erros em valores nulos ou primitivos.',
  'isPromise.callout':
    'Usuário em carregadores de recursos assíncronos, operadores personalizados e serviço flexível APIs que aceitam ou valores estáticos imediatos ou promessas assíncronas.',
  'isPromise.example1Title': 'Exemplo 1: Matriz Interativa para Avaliação de Valor',
  'isPromise.example1Desc':
    'Observar a verificação tipo-tempo-em-execução em todos os tipos comuns de dados JavaScript e objetos thable:',
  'isPromise.thDescription': 'Descrição',
  'isPromise.thExpression': 'Expressão Avaliada',
  'isPromise.thResult': 'Resultado isPromise()',
  'isPromise.example2Title': 'Exemplo 2: Tipo seguro padrão de alinhamento',
  'isPromise.example2Desc':
    'No TypeScript, a verificação com <code>if (isPromise(val))</code> reduz o tipo automaticamente para dentro do bloco:',
  'isPromise.apiSummary': 'Função de guardamento de tipo TypeScript que verifica contratos de PromiseLike.',
  'isPromise.paramObj': 'O valor a inspeccionar.',
  'isPromise.returnsDesc':
    'Verdadeiro se o input não é nulo, é um objeto ou função e implementa um método then callable; falso caso contrário.',
  'isEmpty.overview':
    'A função utilitária <code>isEmpty</code> verifica se uma string, objeto ou array está vazia. Retorna <code>true</code> para valores vazios e <code>false</code> para valores não vazios.',
  'isEmpty.example1Title': 'Exemplo 1: Uso básico',
  'isEmpty.example1Desc': 'Verifique se existem vários tipos de valores em vazio:',
  'isEmpty.example2Title': 'Exemplo 2: Casos comuns para uso',
  'isEmpty.example2Desc': 'Usar o <code>isEmpty</code> em lógica condicional:',
  'isEmpty.apiSummary': 'Verifica se uma string, objeto ou array está vazia.',
  'isEmpty.paramValue': 'O valor a verificar. Pode ser um string, objeto, array ou outro valor.',
  'isEmpty.returnsDesc':
    'true se o valor estiver vazio (em linha vazia, objeto vazio, array vazio, nulo ou indefinido), falso em contrário.',
  'isEqual.overview':
    'A função utilitária <code>isEqual</code> realiza uma verificação de igualdade profunda entre dois valores. Ela compara valores primitivos, arrays e objetos recursivamente para determinar se eles são estruturalmente iguais, independentemente da igualdade de referência.',
  'isEqual.example1Title': 'Exemplo 1: Uso básico',
  'isEqual.example1Desc': 'Comparar diversos tipos de valores para a igualdade profunda:',
  'isEqual.example2Title': 'Exemplo 2: Comparação de objetos profundos',
  'isEqual.example2Desc': 'Comparar objetos aninhados e arrays:',
  'isEqual.apiSummary': 'Realiza uma verificação de igualdade profunda entre dois valores.',
  'isEqual.paramValue1': 'O primeiro valor a comparar.',
  'isEqual.paramValue2': 'O segundo valor a comparar.',
  'isEqual.returnsDesc':
    'verdade, se os valores são profundamente iguais, falso ou mesmo falso. Executa a comparação recursiva para objetos e arrays.',
  'differenceInDays.overview':
    'A função utilitária <code>differenceInDays</code> calcula o número de dias inteiros entre duas datas. Ela simplifica cálculos de data em JavaScript ao aceitar tipos de entrada flexíveis. O primeiro parâmetro representa a data de referência a partir da qual a diferença é medida, e o segundo parâmetro denota a data a ser comparada com a data de referência. Ambos os parâmetros aceitam <code>Date</code> objetos, números representando milissegundos desde o epoch Unix ou strings que podem ser interpretadas pelo construtor <code>Date</code>.',
  'differenceInDays.example1Title': 'Exemplo 1: Calcular os dias entre datas',
  'differenceInDays.example1Desc':
    'Calcular o número de dias completos entre duas datas usando diferentes tipos de entrada:',
  'differenceInDays.example2Title': 'Exemplo 2: Calcular os dias a partir de hoje',
  'differenceInDays.example2Desc': 'Calcular o número de dias a partir de hoje para uma data específica:',
  'differenceInDays.apiSummary': 'Calcula o número de dias inteiros entre duas datas.',
  'differenceInDays.paramDateLeft':
    'A data de referência. Pode ser um objeto Data, relógio (milissegundos), ou um string para data para a conta.',
  'differenceInDays.paramDateRight':
    'A data para comparar-se com a data de referência. Aceita-se os mesmos tipos que o dateLeft.',
  'differenceInDays.returnsDesc':
    'O número de dias completos entre as duas datas. Devolve um número positivo se dateLeft for mais tarde que dateRight, e negativo se dateLeft for anteriormente.',
  'pickBy.overview':
    'As funções utilitárias <code>pickBy</code> e <code>omitBy</code> permitem criar novos objetos selecionando ou excluindo propriedades com base em uma função predicado. A <code>pickBy</code> cria um objeto composto por propriedades que satisfazem uma condição dada, enquanto a <code>omitBy</code> é a oposta, criando um objeto composto por propriedades que não satisfazem a condição.',
  'pickBy.example1Title': 'Exemplo 1: pickBy',
  'pickBy.example1Desc': 'Criar um objeto composto por propriedades que satisfaça uma certa condição:',
  'pickBy.example2Title': 'Exemplo 2: omitBy',
  'pickBy.example2Desc':
    '<code>omitBy</code> é o oposto ao <code>pickBy</code>, criando um objeto composto por propriedades que não satisfazem a condição indicada.',
  'pickBy.apiSummary': 'Cria um objeto composto por propriedades do objeto que satisfazem uma condição dada.',
  'pickBy.paramObject': 'O objeto-fonte para escolher as propriedades.',
  'pickBy.paramPredicate':
    'A função que determina as propriedades a incluir. Devolve o verdadeiro a incluir, falso a excluir.',
  'pickBy.returnsDesc': 'Um novo objeto que contém apenas as propriedades que satisfazem o predicado.',
  'omitBy.apiSummary': 'Cria um objeto composto por propriedades do objeto que não satisfazem uma condição dada.',
  'omitBy.paramObject': 'O objeto-fonte para omitir as propriedades a partir.',
  'omitBy.paramPredicate':
    'A função que determina que propriedades para omitir. Devolve a verdade para omitir, falso para manter.',
  'omitBy.returnsDesc': 'Um objeto novo que contenha apenas as propriedades que não satisfazem o predicado.',
  'url.title': 'Utilitários URL',
  'url.overview':
    'O ngx-lift fornece várias funções utilitárias para trabalhar com URLs: <code>isIP</code> e <code>isFQDN</code> para verificar tipos de nome de host, <code>isURL</code> para validar URLs e <code>isHttps</code> para verificar o protocolo HTTPS. Essas utilidades são úteis para validação de URLs, verificações de segurança e lógica condicional baseada em propriedades de URL.',
  'url.example1': 'Exemplo 1: Validar o domínio com isFQDN',
  'url.example1Desc':
    'Verifique se um nome-anfitrião URL é um endereço IP ou um nome-domínio totalmente qualificado (FQDN):',
  'url.example1Callout':
    'Você pode usar o construtor <code>URL</code> para obter o nome da máquina, mas lembre-se de usar o try-catch para lidar com erros.',
  'url.example2': 'Exemplo 2: Validar HTTPS com isHttps',
  'url.example2Desc':
    '<code>isURL</code> é utilizado para verificar se um URL é válido. <code>isHttps</code> é utilizado para verificar se o URL começa com https.',
  'url.example2Callout': 'Nós também fornecemos o tubo <code>isHttps</code> para uso em modelos.',
  'url.isIPSummary': 'Verificar se um nome da máquina é um endereço IP.',
  'url.isFQDNSummary': 'Assinale se um nome-máquina é um nome-domínio totalmente qualificado (FQDN).',
  'url.isURLSummary': 'Verificar se um string é um URL válido.',
  'url.isHttpsSummary': 'Verifique se a cadeia URL usa o protocolo HTTPS.',
  'urlValidator.title': 'urlValidator Eu... httpsValidator',
  'urlValidator.overview':
    'As funções <code>urlValidator</code> e <code>httpsValidator</code> são validadores Angular usados para verificar se uma string dada segue padrões específicos de URL. A <code>urlValidator</code> valida URLs que começam com http ou https, enquanto a <code>httpsValidator</code> valida apenas URLs HTTPS.',
  'urlValidator.example1': 'Exemplo 1: Validades URL',
  'urlValidator.example1Desc': 'Valida URLs que começam com http:// ou https://:',
  'urlValidator.example2': 'Exemplo 2: Validades HTTPS',
  'urlValidator.example2Desc': 'Validades apenas HTTPS URLs:',
  'urlValidator.example3': 'Exemplo 3: Um exemplo completo',
  'urlValidator.example3Desc': 'Um exemplo completo com ambos os validadores numa forma reactiva:',
  'urlValidator.urlLabel': 'URL',
  'urlValidator.urlHelper': 'Fornecer um URL válido',
  'urlValidator.urlError': 'Por favor, insira um URL válido (a começar pelo https ou http)',
  'urlValidator.httpsLabel': 'HTTPS- somente URL',
  'urlValidator.httpsHelper': 'Fornecer um https URL',
  'urlValidator.httpsError': 'Por favor, insira um https URL',
  'urlValidator.summary': 'validante Angular que verifica se um string é um URL válido a começar com http ou https.',
  'urlValidator.httpsSummary': 'validante Angular que verifica se um string é um HTTPS válido URL.',
  'urlValidator.returns': 'Um validante que devolve {invalidUrl: true} se o URL for inválido ou nulo se for válido.',
  'urlValidator.httpsReturns':
    'Um validante que devolve {invalidUrl: true} se o URL não for HTTPS ou nulo se for válido.',
  'startWithTap.overview':
    'O operador <code>startWithTap</code> executa uma callback síncrona antes de cada subscrição ao Observable de origem começar a emitir. Diferente de operadores tap ansiosos ou código de inicialização de pipeline, a construção do pipeline não executa a callback até que uma subscrição ocorra. Qualquer exceção na callback entra no canal de erro do Observable.',
  'startWithTap.callout':
    'Ideal para a inicialização dos efeitos secundários, a definição dos indicadores de carregamento, a reinstalação dos erros prévios ou a gravação dos prazos para a entrega dos pedidos imediatamente quando um fluxo Observable for subscrito.',
  'startWithTap.example1Title': 'Exemplo 1: Interactive Solicitação Dispatch com Indicador de Carga',
  'startWithTap.example1Desc':
    'Clique em Trigger Solicitação para se inscrever a um 900ms simulado Observable atrasado. <code>startWithTap</code> roda sincronicamente no momento da assinatura para ligar o rodante de carregamento:',
  'startWithTap.btnTrigger': 'Pedido para o Trigger',
  'startWithTap.btnClearLog': 'Limpar o Registro',
  'startWithTap.fetchingData': 'A obter os dados...',
  'startWithTap.loadedPayload': 'Carga (loaded payload):',
  'startWithTap.example2Title': 'Exemplo 2: Divised Pipeline Execution',
  'startWithTap.example2Desc':
    'A callback é adiada até que o tempo de assinatura, o que significa que as correntes reutilizáveis ou as condutas compartilhadas podem ser definidas antecipadamente sem a execução dos efeitos colaterais prematuramente:',
  'startWithTap.apiSummary': 'Operador MonoTypeOperatorFunction executando uma callback ao se inscrever.',
  'startWithTap.paramCallback': 'Função executada sincronicamente antes que a fonte Observable comece a emitir.',
  'startWithTap.returnsDesc':
    'Um operador RxJS função que executa o callback sobre a assinatura e devolve a fonte Observable inalterada.',
  'switchMapWithAsyncState.overview':
    'O operador <code>switchMapWithAsyncState</code> combina as funcionalidades do <code>switchMap</code> e <code>createAsyncState</code> em um único operador. É especialmente concebido para cenários em que é necessário disparar uma requisição a um API com base em ações do usuário (como cliques em botões) e passar naturalmente entre fluxos. Ao criar uma estrutura <code>AsyncState</code> para encapsular a resposta do API, este operador oferece uma abordagem eficiente e suave para gerenciar operações assíncronas.',
  'switchMapWithAsyncState.example1Title': 'Exemplo 1: Filtrar Usuários por Gênero',
  'switchMapWithAsyncState.example1Desc':
    'A selecção de um género diferente irá popular a lista de usuário em conformidade:',
  'switchMapWithAsyncState.example2Title': 'Exemplo 2: Apresentação de Formulários com o Estado de Carga',
  'switchMapWithAsyncState.example2Desc':
    'Enviar o formulário usando <code>switchMapWithAsyncState</code> e <code>toSignal</code>. A submissão vai sempre emitir um erro, porque o API foi projetado para simular um erro.',
  'switchMapWithAsyncState.apiSummary':
    'Combina switchMap e createAsyncState para transformar um fluxo de observable em AsyncState ao alternar para um novo observable interno.',
  'switchMapWithAsyncState.paramProject':
    'A função que recebe cada valor a partir da fonte observável e devolve um Observable, Promise ou outra ObservableInput.',
  'switchMapWithAsyncState.returnsDesc':
    'Um observável que emite AsyncState<R> objetos, lidar automaticamente com o carregamento, erros e estados de dados.',
  'combineLatestEager.overview':
    'O operador RxJS <code>combineLatest</code> exige que todos os fontes emitem pelo menos uma vez, o que pode ser problemático quando os fontes são <code>Subject</code> que podem não emitir inicialmente. <code>combineLatestEager</code> estende <code>combineLatest</code> ao automaticamente adicionar <code>startWith(null)</code> para cada <code>Subject</code> nos fontes, garantindo que o observable combinado inicialize corretamente. Você também pode definir o segundo parâmetro para <code>true</code> para adicionar <code>startWith(null)</code> para todos os observáveis de fonte, o que é útil quando se está lidando com muitos observáveis onde as emissões iniciais não são garantidas.',
  'combineLatestEager.example1Title': 'Exemplo 1: Uso básico',
  'combineLatestEager.example1Desc': 'Combine observáveis, incluindo indivíduos que podem não emitir inicialmente:',
  'combineLatestEager.example2Title': 'Exemplo 2: Exemplo completo com modelo',
  'combineLatestEager.example2Desc':
    'Um exemplo completo que mostra como usar o combineLatestEager com o tubo async em modelos:',
  'combineLatestEager.apiSummary':
    'Combina múltiplos observáveis com emissão antecipada, automaticamente lidando com fontes que não emitem valores iniciais.',
  'combineLatestEager.paramSources': 'Um array ou objeto dicionário de observáveis para combinar.',
  'combineLatestEager.paramStartWithAll':
    '(Opcional) Quando for verdade, anexa startWith(null) para todas as fontes, não apenas Sujeitos.',
  'combineLatestEager.returnsDesc':
    'Um observável que emite um array ou objeto que contém os últimos valores de todas as fontes.',
  'distinctOnChange.overview':
    'O operador <code>distinctOnChange</code> melhora os observáveis RxJS ao não apenas prevenir emissões duplicadas (como <code>distinctUntilChanged</code>) mas também executar uma função de callback quando um valor muda. Isso é útil em cenários onde é necessário realizar efeitos colaterais, como exibir uma notificação toast, quando um valor muda após a emissão inicial.',
  'distinctOnChange.example1Title': 'Exemplo 1: Uso básico',
  'distinctOnChange.example1Desc': 'Executar um callback quando são encontrados valores distintos:',
  'distinctOnChange.example2Title': 'Exemplo 2: Com o Comparador Personalizado',
  'distinctOnChange.example2Desc': 'Usar uma função comparadora personalizada para determinar a igualdade:',
  'distinctOnChange.apiSummary':
    'Retorna um observable que emite valores distintos contíguos e executa uma callback sempre que o valor muda.',
  'distinctOnChange.paramCallback': 'Função a executar quando o valor muda. Recebe os valores anterior e actual.',
  'distinctOnChange.paramComparator':
    '(Opcional) Função para determinar se dois valores são considerados iguais. Predefinições para a igualdade estrita (= = =).',
  'distinctOnChange.returnsDesc': 'Um observável que emite valores distintos e executa o callback sobre as mudanças.',
  'logger.overview':
    'O operador <code>logger</code> é uma função utilitária para observáveis RxJS que simplifica o log de valores emitidos usando diferentes funções do console. Este operador é útil para depuração e monitoramento do comportamento dos observáveis durante o desenvolvimento.',
  'logger.example1Title': 'Exemplo 1: Registro básico',
  'logger.example1Desc': 'Registar os valores emitidos usando o consol.log:',
  'logger.example2Title': 'Exemplo 2: Registamento da Mesa',
  'logger.example2Desc': 'Registar os valores emitidos usando o consol.table para melhor visualização:',
  'logger.example3Title': 'Exemplo 3: Outros Métodos para a Consola',
  'logger.example3Desc': 'Usar outros métodos como advertir, erros ou informações:',
  'logger.apiSummary': 'Um operador de depuração que loga as emissões no console usando diferentes métodos do console.',
  'logger.paramMethod':
    'Opcional: método do console: "log" | "table" | "warn" | "error" | "info" | "debug". Padrão: "log".',
  'logger.returnsDesc': 'Um observável que passa por todos os valores enquanto as vai para a consola.',
  'kubernetesPagination.overview':
    'O operador <code>aggregatePaginatedKubernetesResources</code> e a função <code>fetchPaginatedKubernetesResources</code> automatizam a paginação do lado do cliente para APIs REST de Kubernetes. Eles inspecionam o token <code>metadata.continue</code> nas respostas entrantes, solicitam páginas consecutivas recursivamente até que todas as páginas sejam recuperadas, normalizam itens ausentes ou nulos de forma segura e aglomeram todos os recursos em um único <code>KubernetesList&lt;T&gt;</code>.',
  'kubernetesPagination.callout':
    'As APIs Kubernetes retornam coleções paginadas com um token <code>continue</code> no metadado da resposta quando o número total de registros excede o limite solicitado. Este operador lida com o loop de múltiplas solicitações de forma suave por trás de um único fluxo de Observable.',
  'kubernetesPagination.example1Title': 'Exemplo 1: Traversal Pagado Interativo Kubernetes',
  'kubernetesPagination.example1Desc':
    'Clique em &apos; Fetch Pagined Pods &apos; para detonar a obtenção automatizada de múltiplas páginas em três rodadas Kubernetes API páginas:',
  'kubernetesPagination.btnFetchPods': 'Procurar Pods Paginados',
  'kubernetesPagination.fetchingPages': 'A obter as páginas (continue a token)...',
  'kubernetesPagination.pagesFetched': 'Páginas pegadas recursivamente:',
  'kubernetesPagination.aggregationComplete': 'Agregação Completa',
  'kubernetesPagination.totalResources': 'Total dos recursos:',
  'kubernetesPagination.thPodName': 'Nome do CódigoName',
  'kubernetesPagination.thNamespace': 'Espaço dos nomes',
  'kubernetesPagination.thStatus': 'Estatuto',
  'kubernetesPagination.thPodIp': 'Pod IP',
  'kubernetesPagination.example2Title': 'Exemplo 2: Função para obter self- Contente',
  'kubernetesPagination.example2Desc':
    'Utilize o <code>fetchPaginatedKubernetesResources</code> quando quiser iniciar e pagar em uma única chamada sem construir o Observable inicial manualmente:',
  'kubernetesPagination.aggregateSummary':
    'RxJS operador que transforma um primeiro Kubernetes resposta à lista Observable numa lista agregada que contenha itens a partir de todas as páginas.',
  'kubernetesPagination.fetchSummary':
    'Função de conveniência que inicia e paga recursos Kubernetes em uma única chamada.',
  'kubernetesPagination.paramHttp': 'Angular HttpClient utilizado para solicitar as páginas subsequentes.',
  'kubernetesPagination.paramEndpoint': 'REST URL do recurso Kubernetes.',
  'kubernetesPagination.paramInitialParams': 'Parâmetros da quilha (por exemplo, limite).',
  'k8sRetryBackoff.configSummary':
    'Configuração opcional compartilhada pelo operador e pela fábrica de interceptadores.',
  'k8sRetryBackoff.paramMaxAttempts':
    'Total de tentativas incluindo a requisição inicial. Defina como 1 para desativar repetições.',
  'k8sRetryBackoff.errorShape':
    'Aceita HttpErrorResponse ou um objeto com a forma <code>{ status, headers?, error? }</code>, incluindo uma string JSON no <code>error</code>. O fetch nativo não rejeita em HTTP 429: verifique a resposta e adapte seu status, headers e corpo analisado. O Axios expõe esses dados sob <code>error.response</code>; adapte-os antes de chamar a função. A função calcula apenas um atraso.',
  'k8sRetryBackoffInterceptor.overrideRules':
    'as sobreposições de Contexto se fundem com as default global ou fábrica. GET / HEAD / OPTIONS / PUT / DELETE são elegíveis por padrão; POST / PATCH requer um overrod explícito retryMethods e idempotência para o fim.',
  'k8sRetryBackoffInterceptor.overrideSimulation':
    'Teste uma sonda que falha no primeiro 429 ou uma leitura de carga que recebe dois 429 antes de ter sucesso. A leitura customizada usa maxAttempts: 10 e 200ms de atraso padrão, permitindo até nove repetições.',
  'k8sRetryBackoffInterceptor.btnWorkloads': 'Testar leitura de carga (10 tentativas)',
  'k8sRetryBackoffInterceptor.btnProbe': 'Testar sonda rápida (Exclusão)',
  'k8sRetryBackoff.overview':
    'O operador RxJS <code>retryOnK8sBackoff</code> implementa reintentos automatizados com backoff para respostas HTTP 429 (<code>TooManyRequests</code>) do Kubernetes apiserver (como quando o apiserver watch cache está sendo inicializado com "storage is (re)initializing"). Apenas as respostas HTTP 429 desencadeiam um retry; todos os outros erros (4xx, 5xx, falhas de rede) são propagados imediatamente e sem alteração para o subscriptor.',
  'k8sRetryBackoff.callout':
    '<strong>Operador vs. Interceptor:</strong> O operador controla específicos Observable o interceptor aplica 429 retentações em todo o elegível HttpClient métodos; a escrita requer idepotência verificada.',
  'k8sRetryBackoff.diffTitle': 'Comparação arquitetural: Operador vs. Interceptador',
  'k8sRetryBackoff.diffDesc':
    'Ambas as ferramentas compartilham o mesmo mecanismo de cálculo de atraso de repetição, mas desempenham papéis complementares:',
  'k8sRetryBackoff.diffColFeature': 'Recurso',
  'k8sRetryBackoff.diffColOperator': 'retryOnK8sBackoff (Operador)',
  'k8sRetryBackoff.diffColInterceptor': 'k8sRetryBackoffInterceptor (Interceptador)',
  'k8sRetryBackoff.diffScope': 'Escopo',
  'k8sRetryBackoff.diffScopeOp':
    'Local: Aplicado seletivamente a Observables específicos via <code>.pipe(retryOnK8sBackoff(...))</code>.',
  'k8sRetryBackoff.diffScopeInt': 'Global: Automático em todas as solicitações Angular HttpClient',
  'k8sRetryBackoff.diffUseCases': 'Casos de uso principais',
  'k8sRetryBackoff.diffUseCasesOp': 'Streams de polling, tarefas em segundo plano ou observables fora do HttpClient.',
  'k8sRetryBackoff.diffUseCasesInt': 'Um microserviço Kubernetes-padrão / integração SPA requer resiliência global',
  'k8sRetryBackoff.diffConfig': 'Configuração e Exclusão',
  'k8sRetryBackoff.diffConfigOp':
    'Passado diretamente ao operador: <code>retryOnK8sBackoff({ maxAttempts, fallbackDelayMs })</code>',
  'k8sRetryBackoff.diffConfigInt':
    'Global em <code>app.config.ts</code> ou por solicitação via <code>HttpContextToken</code>',
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
  'k8sRetryBackoff.logTitle': 'Registros de execução:',
  'k8sRetryBackoff.btnClearLogs': 'Limpar registros',
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
  'k8sRetryBackoff.apiSummary':
    'Operador RxJS que reintenta respostas de Kubernetes 429 usando atrasos fornecidos pelo servidor ou backoff de fallback.',
  'k8sRetryBackoff.paramConfig': 'Configuração opcional para tentativas máximas e atraso padrão.',
  'k8sRetryBackoff.delaySummary':
    'Função Ajudante que extrai o atraso retentor em milissegundos a partir de uma resposta de erro Kubernetes 429, ou devolve nulo se não for retentável.',
  'k8sRetryBackoff.paramError': 'O erro a ser inspecionado (HttpErrorResponse ou objeto com status/headers/error).',
  'k8sRetryBackoff.paramFallbackDelay':
    'Atraso padrão em milissegundos se a resposta não fornecer indicação de repetição.',
  'k8sRetryBackoffInterceptor.overview':
    '<code>k8sRetryBackoffInterceptor</code> automatiza o retry de respostas de Kubernetes 429 para métodos idempotentes. Ele honra Retry-After e detalhes.retryAfterSeconds, com backoff exponencial, jitter, orçamentos de espera e opt-out de HttpContext. POST/PATCH exigem opt-in explícito.',
  'k8sRetryBackoffInterceptor.callout':
    '<strong>Proteção Global com Sobrescrituras de Solicitação:</strong> Registre o interceptor uma vez em <code>app.config.ts</code> para proteger todos os endpoints. Para solicitações individuais que devem ignorar o retry ou usar limites personalizados, defina o token de contexto <code>K8S_RETRY_BACKOFF_CONFIG</code> na chamada de <code>HttpClient</code>. Para controle local no pipeline, veja o operador <code>retryOnK8sBackoff</code>.',
  'k8sRetryBackoffInterceptor.example1Title': 'Exemplo 1: Registro global do interceptador e simulador',
  'k8sRetryBackoffInterceptor.example1Desc':
    'Registre o interceptador globalmente em app.config.ts. Todas as chamadas HttpClient ganham repetição automática em HTTP 429:',
  'k8sRetryBackoffInterceptor.selectMode': 'Modo de contexto do interceptador:',
  'k8sRetryBackoffInterceptor.modeDefault': 'Interceptador global padrão (Repete 429 com atraso de 1s, depois 200 OK)',
  'k8sRetryBackoffInterceptor.modeCustom': 'Custom HttpContext (maxAttempts: 2, base: 400ms, jitter igual)',
  'k8sRetryBackoffInterceptor.modeDisabled':
    'Deficiente através da HttpContext (K8S _ RETRE _ BACKOFF _ CONFIG: falso)',
  'k8sRetryBackoffInterceptor.btnSend': 'Enviar requisição interceptada',
  'k8sRetryBackoffInterceptor.example2Title': 'Exemplo 2: Personalização por requisição e exclusão com HttpContext',
  'k8sRetryBackoffInterceptor.example2Desc':
    'Use K8S_RETRY_BACKOFF_CONFIG no HttpContext para definir limites personalizados ou desativar repetições em verificações de saúde:',
  'k8sRetryBackoffInterceptor.apiSummary':
    'Interceptador HTTP funcional que aplica retry-on-backoff a respostas HTTP 429 do Kubernetes.',
  'k8sRetryBackoffInterceptor.factorySummary':
    'Função da fábrica que cria um HttpInterceptorFn com a configuração padrão padrão para o backoff.',
  'k8sRetryBackoffInterceptor.paramDefaultConfig':
    'Configuração padrão aplicada a todas as requisições, exceto quando sobrescrita via HttpContext.',
  'k8sRetryBackoffInterceptor.tokenSummary':
    'HttpContextToken para configurar ou desativar a repetição em requisições individuais.',
  'ifValidator.overview':
    'O ngx-lift fornece funções úteis para criar validadores condicionais em Formulários Reativos do Angular. Validadores condicionais permitem aplicar funções específicas de validação com base em uma condição dada. Existem duas funções principais exportadas: <code>ifValidator</code> para validadores síncronos e <code>ifAsyncValidator</code> para validadores assíncronos.',
  'ifValidator.example1Title': 'Exemplo 1: Validades Condicionais necessárias',
  'ifValidator.example1Desc':
    'Solicitar um input para a razão e um input para o e-mail somente quando a opção para o perdão for selecionada. O validante exigido é aplicado ao controle para a entrada para o texto somente quando a opção para o perdão para o perdão for escolhida.',
  'ifValidator.question': 'Gostas desta ferramenta?',
  'ifValidator.optLike': 'Claro.',
  'ifValidator.optUnlike': 'Desculpe.',
  'ifValidator.emailHelper': 'Campo exigido somente quando você escolher o perdão',
  'ifValidator.invalidEmail': 'Um e-mail inválido',
  'ifValidator.reasonLabel': 'Razão por que você não gosta',
  'ifValidator.autoRevalidationTitle': 'Válvula automática:',
  'ifValidator.autoRevalidationDesc':
    'Por padrão, o Angular só reavalia os validadores de um controle quando o próprio valor do controle muda. Associe-se com <code>revalidateOnChange([email, reason], choice)</code> ou passe um <code>Signal&lt;boolean&gt;</code> com <code>revalidateOnChange</code> para automaticamente disparar a revalidação sempre que a fonte da condição atualize!',
  'ifValidator.example2Title': 'Exemplo 2: ifAsyncValidator',
  'ifValidator.example2Desc':
    '<code>ifAsyncValidator</code> compartilha semelhanças com <code>ifValidator</code>, porém difere em que aceita dois parâmetros: a condição e uma função AsyncValidation, projetado especificamente para lidar com operações assíncronas.',
  'ifValidator.apiSummary': 'Cria um validador condicional que aplica funções de validação com base em uma condição.',
  'ifValidator.paramCondition':
    'Função que retorna true para aplicar trueValidatorFn, ou falso para aplicar falseValidatorFn.',
  'ifValidator.paramTrueValidatorFn': 'Validator function(s) aplicado quando a condição é verdadeira.',
  'ifValidator.paramFalseValidatorFn': '(Opcional) Validator function(s) aplicado quando a condição é falsa.',
  'ifAsyncValidator.apiSummary':
    'Cria um validador condicional assíncrono que aplica uma função de validação assíncrona com base em uma condição.',
  'ifAsyncValidator.paramCondition': 'Função que determina se o validante sínc deve ser aplicado.',
  'ifAsyncValidator.paramAsyncValidatorFn': 'A função validante sínc para executar quando a condição for verdadeira.',
  'intersectionValidator.overview':
    'O <code>intersectionValidator</code> é um validador personalizado do Angular Forms projetado para garantir que dois controles de forma não tenham valores sobrepostos. Por exemplo, você pode ter duas listas de itens e querer garantir que não contenham nenhum duplicado. Quando houver qualquer sobreposição entre os arrays, ambos os campos e o formulário terão o erro <code>{intersection: true}</code>.',
  'intersectionValidator.example1Title': 'Exemplo 1: Validades para as matrizes sem sobrelocações',
  'intersectionValidator.example1Desc':
    'Assegurar que as mensagens incluídas e as mensagens excluídas não se sobrepõem. Ambos os campos devem voltar arrays.',
  'intersectionValidator.includedNamespaces': 'Namespace incluído',
  'intersectionValidator.excludedNamespaces': 'Níveis excluídos',
  'intersectionValidator.overlapError': 'Não se pode sobrepor-se aos nomes incluídos e aos nomes excluídos',
  'intersectionValidator.overlapAlert': 'Os chapeamentos incluem-se e os chapeados excluídos sobrepõem-se',
  'intersectionValidator.returnsDesc':
    "Um validante que devolve <code>{intersection: true}</code> se as matrizes se sobrepõem, ou <code>null</code> se eles não o fizerem. Você pode verificar para obter esse erro no formulário ao acessar <code>form.errors?.['intersection']</code>.",
  'intersectionValidator.apiSummary':
    'Valida que dois controles de forma com valores de array não contenham elementos sobrepostos.',
  'intersectionValidator.paramArray1Key': 'O nome do primeiro formulário-controle.',
  'intersectionValidator.paramArray2Key': 'O nome da segunda forma, o controle.',
  'uniqueValidator.overview':
    'O <code>uniqueValidator</code> é um validador personalizado do Angular Forms projetado para verificar a unicidade em múltiplas campos dentro de um <code>FormArray</code> ou <code>FormGroup</code>. Garante que o valor de cada controle seja único entre todos os outros controles dentro do array ou grupo.',
  'uniqueValidator.example1Title': 'Exemplo 1: Array of FormControls',
  'uniqueValidator.example1Desc':
    'Se você tem um conjunto de FormControls individual e deseja garantir a singularidade, anexe <code>UniqueValidator.unique()</code> ao FormArray que você deseja validar.',
  'uniqueValidator.calloutSameValue': 'Digite o mesmo valor em controles abaixo e veja o efeito quando embreagem.',
  'uniqueValidator.controlLabel': 'Controlo',
  'uniqueValidator.controlHelper': 'O valor de controle deve ser único',
  'uniqueValidator.duplicated': 'Duplicado',
  'uniqueValidator.example2Title': 'Exemplo 2: Array de FormGroups com Pares Chave-Valor',
  'uniqueValidator.example2Desc':
    'Em uma cena mais complexa, imagine que você tenha um array de <code>FormGroups</code>, cada um contendo pares de chave-valor como <code>FormControls</code>. Você quer garantir a unicidade dos valores dos controles de chave (abaixo dos controles da esquerda) em todos os grupos. Para esse caso, você pode passar um seletor de controle como argumento do <code>UniqueValidator.unique(controlSelector)</code>.',
  'uniqueValidator.keyCallout': 'Digite o mesmo valor em abaixo controles-chave e veja o efeito quando embraiar.',
  'uniqueValidator.keyPlaceholder': 'controle-chave',
  'uniqueValidator.keyHelper': 'o controle-chave deve ser único',
  'uniqueValidator.valuePlaceholder': 'controle de valor',
  'uniqueValidator.valueHelper': 'o controle de valor não tem validação',
  'uniqueValidator.returnsDesc':
    'Um validante que devolve <code>{notUnique: true}</code> se os valores duplicados são encontrados, ou <code>null</code> se todos os valores são únicos.',
  'uniqueValidator.usageNotes': 'Notas de Utilização',
  'uniqueValidator.usageNotesDesc':
    'Trigger o controle método <code>updateValueAndValidity()</code> como necessário para revalidar quando os valores mudam.',
  'uniqueValidator.apiSummary': 'Valida a unicidade em controles de FormArray ou valores de array.',
  'uniqueValidator.paramKey':
    '(Opcional) Chave de propriedade para verificar a singularidade para itens objeto. Se omitido, verifica a igualdade primitiva.',
  'dateRangeValidator.overview':
    'O <code>dateRangeValidator</code> é um validador personalizado que valida que uma data esteja dentro de um intervalo especificado. Ele suporta a validação tanto para valores de data apenas quanto para valores de data e hora, com limites inclusivos/exclusivos configuráveis e comparação opcional de tempo.',
  'dateRangeValidator.example1Title': 'Exemplo 1: Validação da faixa de datas',
  'dateRangeValidator.example1Desc':
    'Valide que uma data esteja entre uma data mínima e uma data máxima. Essa configuração assegura que a data selecionada esteja entre 1º de setembro de 2024 e 15º de setembro de 2024 (exclusive), ignorando os componentes de tempo. O 15º de setembro não é válido pois <code>maxInclusive</code> é falso.',
  'dateRangeValidator.example2Title': 'Exemplo 2: Selecione uma data futura',
  'dateRangeValidator.example2Desc':
    'A seguir, o exemplo permite selecionar uma data futura e incluir hoje. Para incluir o <code>minDate</code>, definir <code>minInclusive</code> para <code>true</code>.',
  'dateRangeValidator.expiresRawLabel': 'Data-limite (entrada em bruto HTML)',
  'dateRangeValidator.minDateError': 'A data não pode ser anterior ao {{ minDate }}',
  'dateRangeValidator.futureDaysLabel': '5 dias para o futuro (entrada para a data Clarity)',
  'dateRangeValidator.invalidDate': 'A data é inválida',
  'dateRangeValidator.maxDateError': 'A data não pode ser posterior ao {{ maxDate }}',
  'dateRangeValidator.clarityMax': 'A data é demasiado tarde (validação da clareza)',
  'dateRangeValidator.clarityMin': 'A data é demasiado precoce (validação da clareza)',
  'dateRangeValidator.minMaxCallout':
    'Podemos usar o padrão <code>min</code> e <code>max</code> para validar o alcance. No entanto, esta validação não vai falhar ao escrever um número como 12 ou um string como 12hell.',
  'dateRangeValidator.example3Title': 'Exemplo 3: Validades para a data e a faixa horária',
  'dateRangeValidator.example3Desc':
    'Para validar tanto a data quanto o horário, defina <code>compareTime</code> como verdadeiro. Com a configuração abaixo, a data e o horário selecionados devem estar entre 1º de setembro de 2024 às 12h UTC e 2º de setembro de 2024 às 12h UTC, considerando os componentes de tempo.',
  'dateRangeValidator.dateTimeExpires': 'Data-limite',
  'dateRangeValidator.dateTimeMinError': 'A data não pode ser anterior a {{ minDate }}',
  'dateRangeValidator.dateTimeMaxError': 'A data não pode ser posterior ao {{ maxDate }}',
  'dateRangeValidator.returnsDesc': 'Um validante que pode ser usado com Angular Forms Reactive.',
  'dateRangeValidator.validationErrors': 'Erros de Validades',
  'dateRangeValidator.errInvalidDate': 'Retornado quando a data é inválida (ex: "2023-13-01" ou "hello world")',
  'dateRangeValidator.errMinDate':
    'Devolvido quando a data seleccionada for anterior ou igual à data mínima autorizada. O valor de erro é a data mínima autorizada formatada como uma cadeia ISO.',
  'dateRangeValidator.errMaxDate':
    'Devolvida quando a data seleccionada for posterior ou igual à data máxima autorizada. O valor de erro é a data máxima autorizada formatada como uma cadeia ISO.',
  'dateRangeValidator.apiSummary':
    'Valida que um valor de data esteja dentro de um intervalo especificado de minDate e/ou maxDate.',
  'dateRangeValidator.paramOptions': 'DateRangeOptions configurando as bandeiras minDate, maxDate e inclusividade.',
  'dateRangeValidator.optMinDate': 'Data mínima aceitável.',
  'dateRangeValidator.optMaxDate': 'Data máxima aceitável.',
  'dateRangeValidator.optMinInclusive': 'Se a data mínima é inclusiva.',
  'dateRangeValidator.optMaxInclusive': 'Se a data máxima é inclusiva. Predefinições para a verdade.',
  'rangePipe.overview':
    'O <code>range</code> pipe gera um array de números dentro de um intervalo especificado, tornando-o ideal para criar opções de dropdown, controles de paginação ou qualquer cenário que exija sequências numéricas em modelos. Ao trabalhar com modelos Angular, você pode precisar gerar um array de números para iteração. Por exemplo, se você tiver o número 20 e quiser criar um array de 1 a 20 para exibir em uma lista de dropdown, o diretiva <code>@for</code> do Angular não pode iterar diretamente sobre um número. Embora você possa gerar esse array em TypeScript, existem casos em que gerar o array diretamente no modelo é mais conveniente.',
  'rangePipe.callout1':
    'O tubo <code>range</code> cria um conjunto de números (positivos e / ou negativos) que progredem desde o início até, <strong>, sem incluir, o fim </strong>.',
  'rangePipe.callout2': 'Um passo de -1 é utilizado se um começo negativo for especificado sem um fim ou passo.',
  'rangePipe.callout3': 'Se o fim não for especificado, ele vai começar com o começo, em seguida, definir para 0.',
  'rangePipe.callout4':
    'Um utilitário <code>range</code> também está disponível para uso em TypeScript, que pode ser importado a partir de <code>ngx-lift</code>.',
  'rangePipe.example1Title': 'Exemplo 1: Gama Básica',
  'rangePipe.example1Desc': 'Gerar arrays com diferentes valores-limite e fim:',
  'rangePipe.example2Title': 'Exemplo 2: Com valor-passo',
  'rangePipe.example2Desc': 'Gerar arrays com um valor-passo personalizado:',
  'rangePipe.example3Title': 'Exemplo 3: Array reverso',
  'rangePipe.example3Desc': 'Gerar arrays em ordem inversa:',
  'rangePipe.example4Title': 'Exemplo 4: Seleção para baixar',
  'rangePipe.example4Desc':
    'Gerar as opções para a contagem CPU para um downloaddown. Isto é útil ao exibir uma lista de computadores com a contagem CPU máxima variável e que permite aos usuários selecionar a faixa CPU.',
  'rangePipe.cpuLabel': 'Escolha a contagem CPU',
  'rangePipe.cpuOption': '{{ count }} CPU(s)',
  'rangePipe.returnsDesc': 'Um conjunto de números dentro da faixa especificada.',
  'rangePipe.apiSummary': 'Pipe Angular que gera um array de números dentro de um intervalo especificado.',
  'rangePipe.paramValue':
    'Array especificando o fim, o começo, o fim, o começo, o fim, o passo ou o começo, o fim, o passo, inclusive.',
  'isHttpsPipe.overview':
    'O <code>isHttps</code> é um pipe do Angular que verifica se uma string de URL utiliza o protocolo HTTPS. É útil para renderização condicional, validação ou verificações de segurança em templates. Também existe uma função utilitária <code>isHttps</code> disponível para uso em TypeScript.',
  'isHttpsPipe.example1Title': 'Exemplo 1: Uso básico',
  'isHttpsPipe.example1Desc': 'Verifique se um URL utiliza o protocolo HTTPS:',
  'isHttpsPipe.example2Title': 'Exemplo 2: Renderação Condicional',
  'isHttpsPipe.example2Desc': 'Transmissão condicionalmente componentes com base no status HTTPS:',
  'isHttpsPipe.example3Title': 'Exemplo 3: Validades em Segurança',
  'isHttpsPipe.example3Desc': 'Mostrar os indicadores de segurança com base no protocolo:',
  'isHttpsPipe.apiSummary': 'Pipe do Angular que verifica se uma string de URL utiliza o protocolo HTTPS.',
  'isHttpsPipe.paramValue': 'A cadeia URL para verificar.',
  'isHttpsPipe.returnsDesc': 'verdadeiro se o URL usa o protocolo HTTPS, falso em contrário.',
  'arrayJoinPipe.overview':
    'O <code>arrayJoin</code> é um pipe do Angular que une os elementos de um array em uma string usando um separador especificado. Fornece uma forma conveniente de exibir dados de array como strings separadas por vírgula ou com delimitadores personalizados em templates.',
  'arrayJoinPipe.example1Title': 'Exemplo 1: Uso básico',
  'arrayJoinPipe.example1Desc': 'Junte-se a elementos array com o separador comma padrão:',
  'arrayJoinPipe.example2Title': 'Exemplo 2: Separadores personalizados',
  'arrayJoinPipe.example2Desc': 'Usar diferentes separadores para diversos casos de uso:',
  'arrayJoinPipe.example3Title': 'Exemplo 3: arrays numéricos',
  'arrayJoinPipe.example3Desc': 'Junte-se a arrays numéricos com diferentes separadores:',
  'arrayJoinPipe.apiSummary':
    'Pipe do Angular que une elementos de um array em uma string usando um separador especificado.',
  'arrayJoinPipe.paramValue': 'A array a juntar-se. Se não for um array, devolve o valor a-is.',
  'arrayJoinPipe.paramSeparator': '(Opcional) A cadeia separadora para usar entre elementos.',
  'arrayJoinPipe.returnsDesc': 'Um string que contém os elementos da array, ou o valor original, se não um array.',
  'maskPipe.overview':
    'O <code>mask</code> é um pipe do Angular projetado para mascarar dados sensíveis de string substituindo caracteres por asteriscos, enquanto preserva um número configurável de caracteres no início e no final. É ideal para obscurecer informações sensíveis em interfaces de usuário, como números de cartão de crédito, números de telefone ou chaves API.',
  'maskPipe.example1Title': 'Exemplo 1: Uso básico',
  'maskPipe.example1Desc':
    'Cordas sensíveis a mascarar com as definições predefinidas (6 caracteres visíveis no início e fim):',
  'maskPipe.example2Title': 'Exemplo 2: Opções para Máscaras Personalizadas',
  'maskPipe.example2Desc': 'Personalize o número de caracteres visíveis no início e fim da cadeia:',
  'maskPipe.example3Title': 'Exemplo 3: Máscaras para cartões de crédito',
  'maskPipe.example3Desc': 'Máscara números de cartão de crédito enquanto mostra os últimos 4 dígitos:',
  'maskPipe.example4Title': 'Exemplo 4: Toque em Máscaras',
  'maskPipe.example4Desc': 'Mostrar / esconder, condicionalmente, os dados sensíveis:',
  'maskPipe.maskingConditions': 'Condições para o mascaramento',
  'maskPipe.conditionsDesc': 'O tubo aplica-se ao mascaramento com base nas seguintes condições:',
  'maskPipe.cond1':
    'O comprimento da cadeia de entrada deve ser maior que a soma de <code>unmaskedPrefixLength</code> e <code>unmaskedSuffixLength</code>.',
  'maskPipe.cond2': '<code>unmaskedPrefixLength</code> e <code>unmaskedSuffixLength</code> não devem ser negativos.',
  'maskPipe.cond3': 'A opção <code>masked</code> tem que ser <code>true</code>.',
  'maskPipe.condFallback': 'Se alguma destas condições não for cumprida, a cadeia original é devolvida sem alterações.',
  'maskPipe.apiSummary':
    'Pipe do Angular que mascara dados sensíveis de string substituindo caracteres por asteriscos.',
  'maskPipe.paramValue': 'A cadeia de entrada a ser mascarada.',
  'maskPipe.paramOptions': 'Opções de configuração para mascarar o comportamento.',
  'maskPipe.returnsDesc':
    'A cadeia mascarada, ou a cadeia original, se o mascaramento for desativado ou a cadeia for demasiado curta.',
  'maskPipe.optUnmaskedPrefixLength':
    'Número de caracteres para deixar sem mascaramento no início. Predefinições para 6.',
  'maskPipe.optUnmaskedSuffixLength': 'Número de caracteres para deixar sem mascaramento no fim. Predefinições para 6.',
  'maskPipe.optMaskChar': 'Caracteres usados para mascarar.',
  'maskPipe.optEnabled': 'De saber se o mascaramento está habilitado.',
  'byteConverterPipe.overview':
    'O <code>byteConverter</code> é um pipe que converte valores numéricos de bytes em strings de tamanho de arquivo legível (ex: "1.5 MB", "2.3 GB") com formatação consciente do local. Ele trata automaticamente a conversão de unidades (BYTE, KB, MB, GB, TB) e suporta internacionalização com traduções para múltiplas línguas, incluindo inglês, francês, chinês, japonês, coreano, alemão, espanhol, italiano, português e russo.',
  'byteConverterPipe.example1Title': 'Exemplo 1: Uso básico',
  'byteConverterPipe.example1Desc': 'Converter valores byte para formato human- legíveis:',
  'byteConverterPipe.example2Title': 'Exemplo 2: Mostrar o Tamanho do Ficheiro',
  'byteConverterPipe.example2Desc': 'Mostrar o tamanho dos arquivos em um formato fácil para o usuário:',
  'byteConverterPipe.example3Title': 'Exemplo 3: Diferentes Conversões para as Unidades',
  'byteConverterPipe.example3Desc': 'O tubo converte-se automaticamente para a unidade adequada:',
  'byteConverterPipe.languageSupport': 'Suporte à Linguagem',
  'byteConverterPipe.languageSupportDesc':
    'O pipe utiliza a identificação do local da aplicação <code>LOCALE_ID</code> para determinar as traduções apropriadas das unidades. As línguas suportadas incluem inglês, francês, chinês (simplificado e tradicional), japonês, coreano, alemão, espanhol, italiano, português (Brasil) e russo. Se o idioma do navegador não for suportado, o inglês é o padrão.',
  'byteConverterPipe.i18nCallout':
    'Para configurar o suporte locale, consulte o <a href="https://angular.io/guide/i18n" target="_blank">Angular Documentação i18n</a>.',
  'byteConverterPipe.apiSummary':
    'Pipe do Angular que converte um número de bytes em uma formatação de string legível com formatação consciente do local.',
  'byteConverterPipe.paramValue':
    '(Opcional) O número de bytes para converter. Devolve nulo se nulo, indefinido ou NaN.',
  'byteConverterPipe.returnsDesc':
    'Um string formatado com unidade adequada (B, KB, MB, GB, TB) com base em locale ou nula, se inválida.',
  'datagridUtil.transformDesc':
    'A função converte o estado de datagred Clarity (que contém a paginação, a classificação e as informações sobre o filtro) em um objeto PageQuery. Aqui vai um exemplo da transformação:',
  'datagridUtil.inputTitle': 'Fonte: Clarity Datagred State',
  'datagridUtil.outputTitle': 'Resultado: PageQuery Object',
  'datagridUtil.usageDesc':
    'Utilize convertToHttpParams em seu componente para converter o estado de dados para as solicitações API:',
  'common.save': 'Salvar',
  'common.submit': 'Enviar',
  'statusIndicator.inputIconStatus': 'Estado representado pelo ícone.',
  'statusIndicator.inputIconSize': 'Tamanho do ícone, incluindo sm, md, lg ou um cabeçalho tamanho pixel.',
  'statusIndicator.inputTooltip': 'Texto facultativo exibido em hover ou foco.',
  'statusIndicator.inputTooltipPosition': 'Posição da ponta em relação ao seu gatilho.',
  'tooltip.componentTypeExample': 'Teor em tipo de componente',
  'idleDetection.configIdleDuration': 'Os segundos da inatividade antes que a contagem regressiva comece.',
  'idleDetection.configTimeoutDuration': 'A contagem regressiva em segundos antes do fim do tempo.',
  'playground.copyFailed': 'Falha ao copiar. Selecione e copie o código manualmente.',
  'header.partialLanguage': 'Tradução parcial; textos não traduzidos são exibidos em inglês.',
  'form.masterPassword': 'Senha mestra',
  'form.masterPasswordRequired': 'A senha mestra é obrigatória.',
  'grid.refresh': 'Atualizar',
  'grid.firstName': 'Primeiro nome',
  'grid.lastName': 'Sobrenome',
  'grid.email': 'E-mail',
  'home.claritySetup':
    'Para aconselhamento sobre a constituição do Sistema de Design Clarity em seu projeto, consulte o',
  'home.clarityDocumentation': 'Documentação sobre Sistema de Design Clarity',
  'resourceAsync.useResource': 'Usar o resourceAsync quando:',
  'resourceAsync.useComputed': 'Usar o computedAsync quando:',
  'resourceAsync.preferMutation':
    'Para o servidor escreve, prefira mutateResource. Legacy execute() submissões devem definir preguiçoso: verdadeiro, reativo: falso e comportamento: escape.',
  'resourceAsync.useRead': 'Manejar as operações locais para a leitura (GET), com reload() para a recaptação.',
  'resourceAsync.useLocal':
    'Gerencie o estado local otimista, os valores em cache ou os rascunhos em formato set() / update().',
  'resourceAsync.useManual': 'Active ou reinicie uma operação com reload(), execute() ou reset().',
  'resourceAsync.useStatus': 'Trace sem carga, recarregamento, resolução, erros e estados locais.',
  'resourceAsync.useLazy': 'Defender a execução inicial com carregamento preguiçoso.',
  'resourceAsync.useCancel':
    'Cancelar as leituras substituídas com o interruptor ou suprimir as operações sobrepostas com o escape.',
  'resourceAsync.useComputedReactive':
    'Recalcular automaticamente os dados async quando as dependências dos sinais mudam.',
  'resourceAsync.useComputedConcurrency':
    'Escolha o comportamento para o interruptor, para a fusão, para o concat ou para o escape explicitamente.',
  'resourceAsync.useComputedValue': 'Expõe um sinal único, com um erro explícito fallback ou política throwOnError.',
  'resourceAsync.apiSummary':
    'Cria um recurso reativo local com estado assíncrono, cancelamento, execução explícita e atualizações locais.',
  'resourceAsync.errorValuePolicy':
    'Quando ocorre um erro, o valor anterior é apagado por padrão. Use preserveValueOnError: true para mantê-lo.',
  'resourceAsync.notLoaded': 'Não carregado',
  'resourceAsync.noData': 'Sem dados',
  'resourceAsync.lastUpdated': 'Última actualização',
  'resourceAsync.topicTitle': 'Toque / Título',
  'resourceAsync.keyConcepts': 'Conceitos-chave:',
  'resourceAsync.patternBenefits': 'Benefícios-padrão:',
  'spinner.inputDecorative': 'Decorativa por padrão. Defina falso para anunciar a carga como um status.',
  'spinner.inputLabel': 'Marca de estado localizada; as falhas para a mensagem built-in loading.',
  'fileReader.inputControlId': 'ID da entrada nativa, para a associação com um rótulo-formulário.',
  'fileReader.inputAcceptFiles':
    'Tipos de arquivo de texto aceites. Este componente lê o texto, não arquivos binário arbitrários.',
  'fileReader.inputEncoded': 'Emitir o texto como base 64 quando activado.',
  'fileReader.inputTextEncoding': 'UTF-8 por padrão; escolher o latin1 ao consumir as cordas byte legado.',
  'fileReader.inputMaxSize': 'Tamanho máximo em MiB. Arquivos oversized são rejeitados antes da leitura.',
  'fileReader.inputDisabled': 'Desactivar a selecção e a remoção dos arquivos.',
  'fileReader.outputChange': 'Emitir texto ou base 64 após a selecção bem-sucedida dos arquivos.',
  'k8sRetryBackoff.paramJitter':
    'estratégia jitter sem fim. Um jitter igual espera entre a metade e o teto exponencial completo.',
  'k8sRetryBackoff.paramHintJitter': 'Esperar ao acaso adicional depois que a dica do servidor, em milissegundos.',
  'k8sRetryBackoff.paramMaxDelay':
    'Um mínimo de espera individual. Um sinal mais longo para as tentativas sem diminuir a sugestão.',
  'k8sRetryBackoff.paramWaitBudget': 'Orçamento para a espera acumulado; excluem o tempo gasto em pedidos em rede.',
  'k8sRetryBackoff.paramMethods':
    'O método Interceptor- only permite a lista. POST / PATCH requer a idempotência explícita para o opt-in e para o fim.',
  'k8sRetryBackoff.paramRandom':
    'Fonte Random retornando um número finito em ¥0, 1), para o agendamento determinístico.',
  'k8sRetryBackoff.retryContract':
    'Padrões: cinco tentativas, fallback exponencial com jitter igual, até 250ms extra em dicas do servidor, 30 segundos por espera e 60 segundos de espera total agendada. Dicas grandes interrompem as tentativas. Interceptores tentam métodos idempotentes por padrão; POST/PATCH exigem um garantia de endpoint.',
  'k8sRetryBackoff.paramMinDelay': 'A espera mínima para cada estratégia jitter; não pode exceder o maxDelayMs.',
  'k8sRetryBackoff.paramStatuses':
    'Estatos HTTP elegíveis. Outros erros propagam-se inalterados; statos adicionais requerem revisão para o fim.',
  'k8sRetryBackoff.paramPredicate':
    'Filtro de erro adicional, aplicado após a verificação do estado. Não permite o POST / PATCH por si mesmo.',
  'k8sRetryBackoff.paramLogRetries':
    'Activar retentarem o registro depois que o atraso passar as verificações sobre o orçamento para a espera.',
  'k8sRetryBackoff.paramLabel':
    'Rótulo de registro. As etiquetas interceptoras geradas omitem as cordas e os fragmentos da consulta; repact as etiquetas personalizadas.',
  'k8sRetryBackoff.paramLogger':
    'Função de registro opcional que recebe attempt, maxRetries, delayMs, error e label. Oculte dados sensíveis dos erros; falhas no registro não interrompem as novas tentativas.',
  'k8sRetryBackoffInterceptor.postDefault': 'POST: default (sem retry)',
  'k8sRetryBackoffInterceptor.postOptIn': 'POST: opção explícita de Kubernetes',
  'k8sRetryBackoffInterceptor.postGateway': 'POST: gateway 429 (rejeitado)',
  'demoApi.key-value-inputs-demo.inputs.formArray':
    'A instância FormArray do componente pai usada para gerenciar os pares chave-valor.',
  'demoApi.key-value-inputs-demo.inputs.data':
    'Dados iniciais para preencher o formulário com pares chave-valor existentes.',
  'demoApi.key-value-inputs-demo.inputs.uniqueKey':
    'Defina como <code>true</code> para habilitar a validação de chave única. Usa <code>UniqueValidator</code> do ngx-lift.',
  'demoApi.key-value-inputs-demo.inputs.keyHelper': 'Texto auxiliar para o campo de entrada da chave.',
  'demoApi.key-value-inputs-demo.inputs.valueHelper': 'Texto auxiliar para o campo de entrada do valor.',
  'demoApi.key-value-inputs-demo.inputs.addText': 'Texto para o botão "Adicionar par chave-valor".',
  'demoApi.key-value-inputs-demo.inputs.inputSize': 'Tamanho dos campos de entrada.',
  'demoApi.key-value-inputs-demo.inputs.buttonClass':
    'Classe personalizada a aplicar ao botão "Adicionar par chave-valor".',
  'demoApi.key-value-inputs-demo.inputs.smartMode':
    'Se definido para <code>true</code>, o componente criar automaticamente um par chave-valor quando não houver campos de entrada de chave-valor.',
  'demoApi.key-value-inputs-demo.inputs.keyPattern':
    'Se a controle de chave precisa passar um padrão de regex personalizado. Você pode passar um objeto com duas chaves: <code>regex</code> e <code>message</code>. A propriedade <code>message</code> é opcional.',
  'demoApi.key-value-inputs-demo.inputs.valuePattern':
    'Similar a <code>keyPattern</code>, mas usada para validação de controle de valor.',
  'demoApi.key-value-inputs-demo.outputs.removeKeyValue':
    'Evento emitido quando um par chave-valor é removido. Fornece o índice do par removido.',
  'demoApi.key-value-inputs-demo.outputs.addKeyValue': 'Evento emitido quando um novo par chave-valor é adicionado.',
  'demoApi.multi-alerts-demo.methods.addAlert(options: Alert)': 'Adiciona uma nova alerta com as opções especificadas.',
  'demoApi.multi-alerts-demo.methods.deleteAlert(id: symbol)': 'Exclui uma alerta por seu ID.',
  'demoApi.multi-alerts-demo.methods.clearAlerts()': 'Limpa todas as alertas.',
  'demoApi.multi-alerts-demo.alertProperties.content': 'A mensagem da alerta. Formatação de HTML seguro é suportada.',
  'demoApi.multi-alerts-demo.alertProperties.alertType': 'O tipo da alerta.',
  'demoApi.multi-alerts-demo.alertProperties.actions':
    'Botões nativos. Cada ação fornece <code>label: string</code> e <code>onClick: () => void</code>.',
  'demoApi.multi-alerts-demo.alertProperties.isAppLevel': 'Se esta é uma alerta de nível de aplicação.',
  'demoApi.multi-alerts-demo.alertProperties.targetSelector':
    'O seletor (ID, classe, etc.) de um elemento clicável (botão, link, etc.) em qualquer lugar dentro do conteúdo da alerta.',
  'demoApi.multi-alerts-demo.alertProperties.onTargetClick':
    'Callback executado quando o elemento que corresponde a <code>targetSelector</code> dentro do conteúdo da alerta é clicado.',
  'demoApi.theme-toggle-demo.componentInputs.lang': 'Código de linguagem explícito para tooltips localizados.',
  'demoApi.theme-toggle-demo.componentOutputs.changeTheme':
    "Emite <code>ClarityTheme</code> ('light' | 'dark') sempre que o tema é alternado.",
  'demoApi.theme-toggle-demo.serviceProperties.theme': "Tema ativo atual ('light' | 'dark').",
  'demoApi.theme-toggle-demo.serviceMethods.setTheme(newTheme: ClarityTheme)':
    'Define o tema, persiste para armazenamento e atualiza o DOM.',
  'demoApi.timeline-wizard-demo.wizardInputs.timelineSteps':
    'Uma array de objetos <code>TimelineStep</code> representando os passos no wizard.',
  'demoApi.timeline-wizard-demo.wizardInputs.live':
    'Controla se é destruído o componente do passo quando se clica nos botões prev/next.',
  'demoApi.timeline-wizard-demo.wizardInputs.confirmButtonText': 'O texto do botão "Finish" no último passo.',
  'demoApi.timeline-wizard-demo.wizardOutputs.confirmed':
    'Emite todos os dados dos passos anteriores quando o botão "Finish" é clicado no último passo.',
  'demoApi.timeline-wizard-demo.wizardOutputs.canceled': 'Emite quando o wizard é cancelado.',
  'demoApi.timeline-wizard-demo.wizardOutputs.finished': 'Emite quando o wizard é concluído com sucesso.',
  'demoApi.timeline-wizard-demo.wizardMethods.cancel()': 'Cancela o wizard e emite o evento <code>canceled</code>.',
  'demoApi.timeline-wizard-demo.wizardMethods.nextStep()': 'Mova para o próximo passo no wizard.',
  'demoApi.timeline-wizard-demo.wizardMethods.previousStep()': 'Mova para o passo anterior no wizard.',
  'demoApi.timeline-wizard-demo.baseProperties.allStepsData':
    'Uma array contendo os dados de todos os passos do wizard. Disponível como uma propriedade de entrada, acessível em <code>ngOnInit</code> e em hooks de ciclo de vida posteriores.',
  'demoApi.timeline-wizard-demo.baseProperties.currentStepData':
    'Os dados do passo atual ou <code>null</code> se não estiver disponível. Disponível como uma propriedade de entrada, acessível em <code>ngOnInit</code> e em hooks de ciclo de vida posteriores.',
  'demoApi.timeline-wizard-demo.baseProperties.form':
    'O grupo de formulário associado ao passo. Defina como <code>null</code> para passos sem formulário. Sobrepõa essa propriedade em seu componente de passo.',
  'demoApi.timeline-wizard-demo.baseProperties.next$':
    'Um observable que emite quando o botão "Próximo" é clicado. Sobrepõa para realizar ações personalizadas, como chamadas a APIs.',
  'demoApi.timeline-wizard-demo.baseProperties.stepInvalid': 'Indica se o formulário do passo é inválido.',
  'demoApi.timeline-wizard-demo.baseMethods.formValueToData()':
    'Converte o valor do formulário do passo para dados. Sobrepõa esse método se a estrutura do formulário não corresponder à estrutura dos dados do passo.',
  'demoApi.timeline-wizard-demo.baseMethods.dataToFormValue(data)':
    'Converte dados do passo para o valor do formulário que pode ser usado para <code>patchValue</code>. Sobrepõa esse método se a estrutura do formulário não corresponder à estrutura dos dados do passo.',
  'demoApi.timeline-wizard-demo.stepProperties.state':
    "O estado do passo da linha de tempo (por exemplo, 'não-iniciado', 'atual', 'sucesso', 'erro').",
  'demoApi.timeline-wizard-demo.stepProperties.header': 'O cabeçalho do passo da linha de tempo.',
  'demoApi.timeline-wizard-demo.stepProperties.title':
    'O título do passo da linha de tempo, atuando como um identificador (deve ser único). Pode ser usado para encontrar dados do passo via <code>getStepData</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.id':
    'O identificador do passo da linha de tempo, atuando como um identificador primário. Se o identificador não for fornecido, será usado o título como identificador em vez disso. Pode ser usado para encontrar dados do passo via <code>getStepData</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.description': 'A descrição do passo da linha de tempo.',
  'demoApi.timeline-wizard-demo.stepProperties.component':
    'O componente Angular associado ao passo da linha de tempo. Deve estender <code>TimelineBaseComponent</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.data':
    'Dados do passo, que serão convertidos para dados do formulário pelo componente da linha de tempo e passados para o componente do passo como <code>currentStepData</code>.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStepIndex': 'Obtenha o índice do passo atual.',
  'demoApi.timeline-wizard-demo.serviceProperties.isFirstStep': 'Verifique se o passo atual é o primeiro passo.',
  'demoApi.timeline-wizard-demo.serviceProperties.isLastStep': 'Verifique se o passo atual é o último passo.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStep': 'Obtenha o objeto do passo atual.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStepData': 'Obtenha os dados do passo atual.',
  'demoApi.timeline-wizard-demo.serviceProperties.allStepsData':
    'Obtenha todos os dados dos passos para revisão. Retorna um array com identificadores e dados dos passos.',
  'demoApi.timeline-wizard-demo.serviceMethods.getStepData<T>(key: string)':
    'Obtenha os dados de um passo específico por seu id ou título. Retorna <code>null</code> se o passo não for encontrado.',
  'demoApi.toast-demo.methods.addToast(options: ToastOptions)': 'Crie um toast com as opções especificadas.',
  'demoApi.toast-demo.methods.success(options: ToastOptions)': 'Crie um toast de sucesso com as opções especificadas.',
  'demoApi.toast-demo.methods.info(options: ToastOptions)': 'Crie um toast de informação com as opções especificadas.',
  'demoApi.toast-demo.methods.warning(options: ToastOptions)': 'Crie um toast de aviso com as opções especificadas.',
  'demoApi.toast-demo.methods.error(options: ToastOptions)': 'Crie um toast de erro com as opções especificadas.',
  'demoApi.toast-demo.toastOptions.title': 'O título da mensagem do toast.',
  'demoApi.toast-demo.toastOptions.description': 'A descrição da mensagem do toast.',
  'demoApi.toast-demo.toastOptions.toastType': 'O tipo de toast.',
  'demoApi.toast-demo.toastOptions.date': 'Um timestamp relativo (ex: "1hr ago").',
  'demoApi.toast-demo.toastOptions.manualClosable': 'Se o toast pode ser fechado manualmente.',
  'demoApi.toast-demo.toastOptions.timeoutSeconds':
    'O número de segundos antes que o toast feche automaticamente. Se não fornecido, usa o valor padrão do container.',
  'demoApi.toast-demo.toastOptions.primaryButtonText': 'Texto para o botão de ação principal.',
  'demoApi.toast-demo.toastOptions.primaryButtonClick': 'Função de callback para o clique no botão principal.',
  'demoApi.toast-demo.toastOptions.secondaryButtonText': 'Texto para o botão de ação secundária.',
  'demoApi.toast-demo.toastOptions.secondaryButtonClick': 'Função de callback para o clique no botão secundário.',
  'demoApi.toast-demo.toastOptions.closed': 'Função de callback chamada quando o toast é fechado.',
  'demoApi.toast-demo.containerInputs.timeoutSeconds': 'Timeout padrão em segundos para toasts.',
  'demoApi.toast-demo.containerInputs.manualClosable': 'Se os toasts podem ser fechados manualmente por padrão.',
  'demoApi.toast-demo.containerInputs.topOffset': 'Distância da parte superior da tela em pixels.',
  'demoApi.tooltip-demo.inputs.cllTooltip':
    'Conteúdo simples de string para o tooltip. Pode ser usado como abreviação para <code>cllTooltipContent</code>.',
  'demoApi.tooltip-demo.inputs.cllTooltipContent':
    'O conteúdo a exibir no tooltip. Pode ser uma string, referência de modelo, referência de componente ou tipo de componente.',
  'demoApi.tooltip-demo.inputs.cllTooltipContentContext':
    'Objeto de contexto passado para o template quando se usa <code>TemplateRef</code> como conteúdo.',
  'demoApi.tooltip-demo.inputs.cllTooltipWidth': 'Largura do tooltip em pixels.',
  'demoApi.tooltip-demo.inputs.cllTooltipPosition':
    "Posição do tooltip em relação ao elemento. As opções incluem 'tooltip-top-right', 'tooltip-top-left', etc.",
  'demoApi.tooltip-demo.inputs.cllTooltipHideDelay':
    'Atraso em milissegundos antes de esconder o tooltip após o mouse sair.',
  'demoApi.mutate-resource.mutateResourceApiProps.mutation':
    'Função assíncrona ou observável executando a operação de escrita no lado do servidor.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.invalidateTags':
    'Tags para invalidar após uma escrita bem-sucedida. Agende imediatamente rebuscas para consultas ativas.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.concurrency':
    'Estratégia para chamadas sobrepostas: paralelo (padrão), exhaust (junta chamadas em andamento), concat (fila).',
  'demoApi.mutate-resource.mutateResourceApiProps.options.injector':
    'Injetor Angular opcional explícito para registro de sinal fora do contexto de injeção.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.client':
    'Sobrescritura opcional do QueryClient (padrão é o token QUERY_CLIENT).',
  'demoApi.mutate-resource.mutateResourceRefApiProps.value':
    'Sinal com o resultado mais recente de uma mutação com sucesso.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.error':
    'Sinal com o erro mais recente de uma mutação, ou nulo quando está saudável.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.status': 'Status de ciclo de vida da mutação granular.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.isLoading':
    'Verdadeiro enquanto a operação de mutação está em execução.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.mutate(args)':
    'Trigger a mutação com argumentos e retorna uma Promise que se resolve com o resultado ou rejeição.',
  'demoApi.query-resource.queryResourceApiProps.definition':
    'Fábrica reativa com um carregador de Observable ou Promise, ou undefined para desativar.',
  'demoApi.query-resource.queryResourceApiProps.options.pollInterval':
    'Milissegundos entre requisições concluídas. Coordenado entre todos os observadores ativos.',
  'demoApi.query-resource.queryResourceApiProps.options.injector':
    'Injetor Angular opcional para registro de sinal fora do contexto de injeção.',
  'demoApi.query-resource.queryResourceApiProps.options.client':
    'Sobrescritura opcional do QueryClient (padrão é o token QUERY_CLIENT).',
  'demoApi.query-resource.queryResourceDefinitionProps.key':
    'Array de valores JSON-compatíveis que unicamente identificam a consulta (ex: ["usuario", id]).',
  'demoApi.query-resource.queryResourceDefinitionProps.loader':
    'Carregador de dados recebendo { abortSignal, refresh }. Os Observable automaticamente completam após a primeira emissão.',
  'demoApi.query-resource.queryResourceDefinitionProps.tags':
    'Tags opcionais para invalidação de cache (ex: [{ tipo: "usuarios" }]).',
  'demoApi.query-resource.queryResourceDefinitionProps.staleTime':
    'Duração em milissegundos antes que os dados em cache sejam considerados obsoletos.',
  'demoApi.query-resource.queryResourceDefinitionProps.gcTime':
    'Duração em milissegundos (padrão 5 minutos) para manter consultas não usadas no cache.',
  'demoApi.query-resource.queryResourceDefinitionProps.cancelOnNoObservers':
    'Se abortar uma requisição em trânsito se todos os observadores desmontarem antes da conclusão.',
  'demoApi.query-resource.queryResourceRefApiProps.value':
    'Sinal com os dados da consulta mais recente e resolvida com sucesso.',
  'demoApi.query-resource.queryResourceRefApiProps.error': 'Sinal com o último erro, ou nulo quando está saudável.',
  'demoApi.query-resource.queryResourceRefApiProps.status':
    'Status detalhado: "idle" | "loading" | "reloading" | "resolved" | "error".',
  'demoApi.query-resource.queryResourceRefApiProps.isLoading': 'true quando status é "loading" ou "reloading".',
  'demoApi.query-resource.queryResourceRefApiProps.isStale':
    'Indica se os dados foram invalidados ou se o período de validade staleTime expirou.',
  'demoApi.query-resource.queryResourceRefApiProps.hasValue()':
    'Valor de predicado de narração do tipo para excluir undefined quando os dados válidos estiverem presentes.',
  'demoApi.query-resource.queryResourceRefApiProps.reload()':
    'Inicia uma atualização em segundo plano sem apagar os dados existentes (status: "reloading").',
  'demoApi.query-resource.queryResourceRefApiProps.execute()':
    'Força uma busca fresca imediata e retorna um Promise que se resolve com o resultado.',
  'demoApi.query-resource.queryResourceRefApiProps.destroy()':
    'Desconecta este observador sem cancelar consultas compartilhadas se outros observadores permanecerem.',
  'demoApi.resource-async.definitionProperties.params':
    'Função de captura puramente reativa de parâmetros. As leituras de sinal aqui são rastreadas.',
  'demoApi.resource-async.definitionProperties.loader':
    'Carregador que recebe os parâmetros e abortSignal e retorna uma Promise, um Observable ou um valor síncrono.',
  'demoApi.resource-async.optionsProperties.defaultValue':
    'Valor padrão antes da primeira busca; garante que value() retorne T (nunca undefined). Alias para initialValue.',
  'demoApi.resource-async.optionsProperties.preserveValueOnError':
    'Mantém o último valor recebido ou local quando um erro ocorrer.',
  'demoApi.resource-async.optionsProperties.reactive':
    'Se os parâmetros ou fontes de dependência provocam reexecução automática.',
  'demoApi.resource-async.optionsProperties.injector':
    'Injetor personalizado opcional se for chamado fora de um contexto de injeção ambiental.',
  'demoApi.resource-async.optionsProperties.equal':
    'Comparador personalizado passado para o sinal computado subjacente.',
  'demoApi.resource-async.returnsProperties.value': 'O valor atual do recurso.',
  'demoApi.resource-async.returnsProperties.error': 'O erro atual, se houver.',
  'demoApi.resource-async.returnsProperties.status':
    "O status atual: 'idle' | 'loading' | 'reloading' | 'resolved' | 'local' | 'error'.",
  'demoApi.resource-async.returnsProperties.isLoading':
    "Sinal que retorna verdadeiro se qualquer operação de fetch estiver em andamento ('loading' ou 'reloading').",
  'demoApi.resource-async.returnsProperties.isIdle':
    "Sinal que retorna verdadeiro se o recurso estiver no estado 'idle' (nunca foi buscado).",
  'demoApi.resource-async.returnsProperties.hasValue()':
    'Valor de predição de tipo para excluir undefined quando for verdadeiro.',
  'demoApi.resource-async.returnsProperties.reload()':
    'Trigger manual de reload do recurso. Ideal para consultas (GET).',
  'demoApi.resource-async.returnsProperties.execute()':
    'Trigger manual de execução retornando uma Promise awaitável. Ideal para mutações (POST/PUT/DELETE).',
  'demoApi.resource-async.returnsProperties.set()':
    'Atualiza manualmente o valor do recurso, passando o status para "local".',
  'demoApi.resource-async.returnsProperties.update()':
    'Atualiza o valor do recurso usando uma função de atualizador, passando o status para "local".',
  'demoApi.resource-async.returnsProperties.reset()':
    "Reseta o recurso para seu estado inicial de 'idle' e cancela operações em andamento.",
  'demoApi.resource-async.returnsProperties.destroy()':
    'Parar permanentemente a observação e cancelar tarefas pendentes.',
  'demoApi.date-range-validator.optionsProperties.compareTime': 'Se quer comparar o tempo também. Padrão é false.',
  'certificate.loading': 'Carregando certificado…',
  'certificate.loadFailed':
    'Não foi possível carregar os detalhes do certificado. Atualize a página e tente novamente.',
  'fileReader.validationUnavailable':
    'Não foi possível carregar a validação do certificado. Atualize a página e tente novamente.',
  'queryExamples.failureTitle': 'Falhas e recuperação',
  'queryExamples.failureIntro': 'Mantenha os dados válidos, limite as leituras e recupere apenas o que falhou.',
  'queryExamples.initialFailure': 'Falha na primeira leitura',
  'queryExamples.initialFailureMessage': 'Ainda não há dados. Tente esta leitura novamente.',
  'queryExamples.refreshFailure': 'Falha de atualização com dados mantidos',
  'queryExamples.refreshFailureMessage': 'A atualização falhou. Exibindo o último resultado bem-sucedido.',
  'queryExamples.failureData': 'Último valor bem-sucedido: {0}',
  'queryExamples.retryRead': 'Repetir leitura',
  'queryExamples.failRefresh': 'Fazer uma atualização falhar',
  'queryExamples.failObserver': 'Simular erro do observador',
  'queryExamples.automaticRetry': 'Repetições automáticas limitadas',
  'queryExamples.retryIntro':
    'Duas falhas temporárias e depois sucesso. As leituras compartilham um ciclo de tentativas.',
  'queryExamples.startRetry': 'Iniciar repetição Observable',
  'queryExamples.startPromise': 'Iniciar repetição Promise',
  'queryExamples.deadline': 'Prazo de leitura lógica',
  'queryExamples.deadlineIntro': 'Esta leitura nunca emite dados. O prazo libera sua assinatura.',
  'queryExamples.startDeadline': 'Iniciar leitura travada',
  'queryExamples.deadlineMessage': 'A leitura excedeu o prazo. Você pode tentar novamente.',
  'queryExamples.canceledReads': 'Assinaturas canceladas: {0}',
  'queryExamples.partialFailure': '2. Falha parcial da lista e recuperação granular',
  'queryExamples.mutationFailure': 'Falha de gravação',
  'queryExamples.mutationIntro':
    'Gravações não são repetidas automaticamente. Esta simulação rejeita antes de aplicar a gravação.',
  'queryExamples.failWrite': 'Enviar gravação com falha',
  'queryExamples.submitWrite': 'Enviar gravação',
  'queryExamples.writeMessage': 'A gravação falhou. Sua entrada foi mantida.',
  'queryExamples.failureEvents': 'Erros finais de leitura: {0}; diagnósticos do observador: {1}',
  'queryExamples.isInitialErrorDescription': 'True quando a leitura falha sem dados bem-sucedidos anteriores.',
  'queryExamples.isRefreshErrorDescription': 'True quando a atualização falha mantendo dados bem-sucedidos.',
  'queryExamples.updatedAtDescription': 'Marca de tempo da última leitura bem-sucedida.',
  'queryExamples.failureCountDescription': 'Tentativas com falha na leitura atual; zero após sucesso.',
  'queryExamples.failureReasonDescription': 'Última falha de tentativa ou erro final de prazo.',
  'queryExamples.nextRetryAtDescription':
    'Marca de tempo da próxima tentativa; null durante a leitura ou após conclusão.',
  'queryExamples.retryDescription': 'Política opcional de tentativas limitadas. Desativada por padrão.',
  'queryExamples.deadlineDescription': 'Prazo total com esperas; false desativa um prazo herdado.',
  'queryExamples.recoveryFocusDescription':
    'Ativar atualização de leituras observadas desatualizadas ao recuperar o foco.',
  'queryExamples.recoveryReconnectDescription':
    'Ativar atualização de leituras observadas desatualizadas após reconexão.',
  'queryExamples.title': 'Consultas Observable na prática',
  'queryExamples.intro':
    'Estes exemplos usam HttpClient com uma API simulada local. Troque de locatário para ver dados e caches independentes.',
  'queryExamples.tenant': 'Locatário',
  'queryExamples.tenantA': 'Locatário A',
  'queryExamples.tenantB': 'Locatário B',
  'queryExamples.parallel': '1. Solicitações paralelas independentes',
  'queryExamples.health': 'Estado',
  'queryExamples.refresh': 'Atualizar locatário',
  'queryExamples.fail': 'Falhar a próxima consulta',
  'queryExamples.tenantError': 'A consulta falhou; os dados em cache continuam disponíveis.',
  'queryExamples.retry': 'Tentar locatário novamente',
  'queryExamples.dependent': '2. Solicitação dependente e atualização após alterações',
  'queryExamples.databases': 'Bancos de dados',
  'queryExamples.gate': 'A consulta aguarda os dados do locatário. O cache continua disponível durante a atualização.',
  'queryExamples.name': 'Nome do banco de dados',
  'queryExamples.create': 'Criar banco de dados',
  'queryExamples.createError': 'A criação falhou. Tente novamente.',
  'queryExamples.databaseError': 'A atualização dos bancos de dados falhou.',
  'queryExamples.retryDatabases': 'Tentar bancos de dados novamente',
  'queryExamples.snapshot': 'observeQueryObservable: {0}, {1} bancos de dados',
  'queryExamples.service': '3. Três consumidores compartilham uma solicitação',
  'queryExamples.serviceIntro':
    'fetchQueryObservable retorna um resultado e termina. observeQueryObservable envia estados do cache continuamente.',
  'queryExamples.mount': 'Exibir widgets do serviço',
  'queryExamples.refreshWidgets': 'Atualizar widgets do serviço',
  'queryExamples.widget': 'Widget {0}: locatário {1}, {2}',
  'queryExamples.counts': 'Quantidade de solicitações HTTP:',
  'queryExamples.dynamic': '1. Consultas paralelas dinâmicas',
  'queryExamples.dynamicIntro':
    'queryResources mapeia os IDs selecionados para observadores independentes. Reordenar mantém os observadores; remover um ID libera seu observador.',
  'queryExamples.one': 'Somente locatário A',
  'queryExamples.both': 'Ambos os locatários',
  'queryExamples.reverse': 'Inverter ordem',
  'queryExamples.empty': 'Limpar seleção',
  'queryExamples.databaseA': 'Banco de dados do locatário A',
  'queryExamples.databaseB': 'Banco de dados do locatário B',
  'queryExamples.initialLoadingDescription': 'True durante o carregamento sem dados disponíveis.',
  'queryExamples.refreshingDescription': 'True durante a atualização mantendo os dados em cache.',
  'queryResources.k8sComparisonTitle': '3. Monitoramento de frota: Agregação em lote vs. Coleção reativa granular',
  'queryResources.k8sComparisonDesc':
    'Comparação de dois padrões arquiteturais para monitorar a integridade de clusters Kubernetes distribuídos: Agregação em lote monolítica (queryResource + forkJoin) vs. Coleção de consultas granular (queryResources).',
  'queryResources.traditionalTab': 'Abordagem 1: Agregação em lote (queryResource)',
  'queryResources.traditionalDesc':
    'Agrega toda a frota em uma única chamada de rede. Bloqueio Head-of-Line: o cluster mais lento (APAC Edge @ 1200ms) atrasa a exibição de todos os outros clusters.',
  'queryResources.granularTab': 'Abordagem 2: Coleção granular (queryResources)',
  'queryResources.granularDesc':
    'Cria consultas reativas independentes por cluster. Clusters rápidos são renderizados imediatamente (US-East @ 150ms). Cada cluster pode ser recarregado isoladamente.',
  'queryResources.refreshFleet': 'Atualizar toda a frota',
  'queryResources.refreshCluster': 'Atualizar cluster',
  'queryResources.clusterName': 'Nome do cluster',
  'queryResources.providerRegion': 'Provedor / Região',
  'queryResources.activeNodes': 'Nós ativos',
  'queryResources.healthStatus': 'Estado de integridade',
  'queryResources.latency': 'Latência',
  'queryResources.actions': 'Ações',
  'queryResources.revalidatingNotice':
    'Revalidando frota em segundo plano... Os dados existentes permanecem interativos.',
  'queryResources.headOfLineWarning':
    'Bloqueio Head-of-Line ativo: todos os 4 clusters aguardam o mais lento (APAC Edge ~1200ms). Se um cluster falhar, todo o snapshot falha, a menos que haja tratamento de erro isolado.',
  'queryResources.progressiveNotice':
    'Renderização progressiva ativa: clusters rápidos (US-East 150ms, EU-Central 280ms) aparecem interativos instantaneamente enquanto as conexões mais lentas continuam carregando.',
  'queryResources.comparisonTableTitle': 'Dimensões arquiteturais comparadas',
  'queryResources.dimTitle': 'Dimensão',
  'queryResources.dimArch': 'Padrão arquitetural',
  'queryResources.dimArchTraditional': 'forkJoin monolítico / Endpoint agregador',
  'queryResources.dimArchGranular': 'Coleção reativa independente (queryResources)',
  'queryResources.dimLatency': 'Latência e renderização',
  'queryResources.dimLatencyTraditional': 'Bloqueio Head-of-Line: a interface aguarda pelo cluster mais lento',
  'queryResources.dimLatencyGranular': 'Renderização progressiva: cada cluster é exibido assim que chega',
  'queryResources.dimIsolation': 'Isolamento de falhas',
  'queryResources.dimIsolationTraditional': 'Tudo ou nada: uma falha bloqueia a frota inteira',
  'queryResources.dimIsolationGranular': 'Isolamento total: a falha de um cluster não afeta os demais',
  'queryResources.dimIdentity': 'Chaves de cache e identidade',
  'queryResources.dimIdentityTraditional': 'Uma única chave monolítica para todos os dados',
  'queryResources.dimIdentityGranular': 'Chave atômica individual por entidade de cluster',
  'queryResources.dimReload': 'Granularidade de recarga',
  'queryResources.dimReloadTraditional': 'Apenas recarga completa da frota (desperdício de largura de banda)',
  'queryResources.dimReloadGranular': 'Recarga precisa por cluster ou por tags de frota',
  'queryResources.dimCache': 'Reutilização de cache',
  'queryResources.dimCacheTraditional': 'Não compartilhável com páginas de detalhes individuais',
  'queryResources.dimCacheGranular': 'Reutilização transparente entre a visualização da frota e os detalhes do cluster',
  'queryResources.prosConsTitle': 'Prós e contras',
  'queryResources.prosTraditional':
    'Simples quando o backend já oferece uma API agregada; exatamente uma viagem de ida e volta na rede.',
  'queryResources.consTraditional':
    'Experiência do usuário prejudicada pelo acoplamento de latência; falhas em cascata; inadequado para painéis com ações individuais.',
  'queryResources.prosGranular':
    'Excelente responsividade através de carregamento progressivo; isolamento de erros; ações direcionadas e reuso de cache.',
  'queryResources.consGranular':
    'Maior contagem de solicitações HTTP em frotas muito grandes (paginação recomendada para milhares de nós).',
  'queryResource.thFailures': 'Tentativas malsucedidas',
  'queryResource.thNextRetry': 'Próxima tentativa',
  'queryGuide.selection': 'Ferramentas relacionadas:',
  'queryGuide.basic': '1. Comece com uma leitura em cache',
  'queryGuide.basicIntro':
    'Capture o tenant uma vez, use-o em key e loader e leia os sinais do resultado. A atualização mantém o último valor obtido com sucesso.',
  'queryGuide.configure': 'Configuração da aplicação',
  'queryGuide.collectionIntro':
    'Use queryResources para listas variáveis de leituras independentes. Cada entrada tem seu resultado em cache, estado de carregamento e ações de recuperação.',
  'queryGuide.empty': 'Nenhum item selecionado. Não há leituras ativas da coleção.',
  'queryGuide.partialIntro':
    'Uma linha falha enquanto a outra permanece disponível. Tente novamente apenas a linha com falha.',
  'queryGuide.collectionContract':
    'A coleção é um sinal de referências ordenadas. Reordenar preserva referências; remover oculta as linhas imediatamente e libera observadores na execução do effect. Chaves canônicas duplicadas são rejeitadas.',
  'queryGuide.collectionLimits':
    'Use um tipo de dados por coleção e filtre itens que não estejam prontos. As solicitações iniciam em paralelo sem limite de concorrência; pagine ou limite seleções grandes. maxEntries não remove entradas ativas ou pendentes.',
  'queryGuide.namingTitle': 'Nomes de referências de consultas e mutações',
  'queryGuide.namingHandles':
    'Use <code>userQuery</code> para uma consulta, <code>tenantQueries</code> para uma coleção e <code>createMutation</code> para uma escrita. Reserve <code>user</code> ou <code>tenant</code> para os dados resolvidos.',

  'computedAsync.failSource': 'Provocar falha na fonte',
  'computedAsync.recoverSource': 'Recuperar fonte',
  'computedAsync.readSignal': 'Ler signal',
  'computedAsync.lastRead': 'Última leitura',
  'computedAsync.notRead': 'Ainda não foi lido',
  'computedAsync.readError': 'A leitura lançou um erro; nenhum valor de sucesso foi retornado.',
  'computedAsync.readDemoHint':
    'Provoque uma falha na fonte e leia o signal. Recupere a fonte e leia novamente para verificar a recuperação.',
};
