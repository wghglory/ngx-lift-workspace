export const ruTranslations: Record<string, string> = {
  'docsLearn.resourceTitle': 'Загружать данные при изменении сигнала',
  'docsLearn.basics': 'Основы',
  'docsLearn.recipes': 'Практические примеры',
  'docsLearn.localState': 'Локальное состояние',
  'docsLearn.nested': 'Вложенные ресурсы',
  'docsLearn.reference': 'Справочник',
  'docsLearn.gridTitle': 'Попробуйте таблицу с серверными данными',
  'docsLearn.gridIntro':
    'dgState подготавливает события Clarity Datagrid для запросов к серверу, задерживает изменения фильтров и может пропускать повторные состояния.',
  'docsLearn.gridTry':
    'Измените фильтры или страницу, затем обновите. Пример обращается к randomuser.me; общее число записей имитируется.',
  'docsLearn.gridModel':
    'Таблица передает состояние; dgState задерживает изменения фильтров на 500 мс. switchMap заменяет предыдущий запрос. Обновление использует отдельный триггер.',
  'docsLearn.resourceModel':
    'Сигналы, прочитанные в функции-источнике, становятся зависимостями. При стандартном поведении switch изменение отменяет предыдущую подписку и начинает новое чтение. Каждый ресурс хранит собственное значение.',
  'docsLearn.computedTitle': 'Ваше первое асинхронное производное значение',
  'docsLearn.computedModel':
    'Нажмите, чтобы изменить входное значение. Через 300 мс результат станет равен входному значению × 10. computedAsync возвращает сигнал значения без сигналов загрузки или ошибки ресурса. Таймер имитирует асинхронную работу.',
  'docsLearn.nextValue': 'Следующее значение',

  'queryDocs.cache': 'Актуальность кеша и обновление',
  'queryDocs.cacheIntro':
    'Ключ запроса определяет общие данные в одном QueryClient. Актуальность, выполнение запросов и время жизни наблюдателей — разные характеристики.',
  'queryDocs.chooseComputed':
    'Используйте для асинхронно производного значения, когда достаточно signal значения. Для синхронного вычисления предпочитайте computed().',
  'queryDocs.chooseMutation':
    'Используйте для явно отправляемых записей на сервер. Ключ запроса не нужен; добавьте теги инвалидации для обновления других представлений.',
  'queryDocs.chooseObservable':
    'Используйте fetchQueryObservable для одного конечного кешированного чтения в RxJS; observeQueryObservable выдаёт снимки общего кеша и владеет наблюдателем.',
  'queryDocs.chooseQuery':
    'Используйте одного наблюдателя для общего кешированного чтения. Ответ с массивом остаётся одним запросом.',
  'queryDocs.chooseResource':
    'Используйте для независимого асинхронного состояния, локальных переопределений или потоков без общего кеша по ключам.',
  'queryDocs.choosing': 'Выбор асинхронного API',
  'queryDocs.choosingIntro':
    'Выбирайте по операции и владельцу состояния. Кнопка обновления по-прежнему выполняет чтение; нажатие не превращает операцию в мутацию.',
  'queryDocs.clientReference':
    'QueryClient владеет общими записями. fetchQuery читает данные; invalidateTags помечает зависимости устаревшими и обновляет активные записи; removeQueries удаляет совпавшие записи. Параметры и адаптеры описаны в публичных контрактах исходного кода.',
  'queryDocs.defaults':
    'По умолчанию: staleTime = 0; gcTime = 300,000 ms. Опрос, повторные попытки, предельные сроки и обновление при фокусе или подключении отключены без настройки.',
  'queryDocs.devtools': 'Инструменты запросов',
  'queryDocs.excerpt':
    'Фрагмент полей компонента. Импортируйте указанные сервис и определения; демонстрация мутации содержит полный сценарий с таблицей и сводкой.',
  'queryDocs.fetching': 'Загрузка данных · queryResource',
  'queryDocs.freshness':
    'staleTime отсчитывает актуальность от последнего успешного ответа. По истечении данные устаревают; само истечение не запускает запрос.',
  'queryDocs.independent': 'Независимые чтения · queryResources',
  'queryDocs.independentClocks':
    'Эти два отсчёта независимы: неиспользуемые данные могут оставаться свежими, а активные — устареть. Вернувшиеся наблюдатели могут использовать сохранённые данные.',
  'queryDocs.invalidation':
    'Успешные записи инвалидируют выбранные теги. Активные запросы загружаются заново; неактивные записи устаревают. Инвалидация не удаляет данные.',
  'queryDocs.keyIdentity':
    'Включайте в ключ все параметры, меняющие ответ, и область авторизации. Фиксируйте реактивные значения один раз и используйте их и в ключе, и в loader.',
  'queryDocs.keys': 'Ключи и инвалидация',
  'queryDocs.keysIntro':
    'Ключи определяют данные. Теги описывают кешированные чтения, затронутые успешной записью. Их назначение различается.',
  'queryDocs.organization': 'Организация запросов',
  'queryDocs.organizationIntro':
    'Выносите определения, когда одни данные нужны нескольким потребителям. Храните транспорт в team.service.ts, идентичность и теги в team.queries.ts, а наблюдатели — рядом с потребителями.',
  'queryDocs.overview': 'Обзор',
  'queryDocs.overviewIntro':
    'Серверное состояние — это данные, принадлежащие серверу. Эти инструменты загружают их, разделяют чтение между компонентами и синхронизируют кешированные представления после записи.',
  'queryDocs.overviewRead':
    'Загрузите команду, отобразите данные, измените выбранный ID и восстановитесь после ошибки.',
  'queryDocs.overviewWrite':
    'Сохраните имя команды, проследите ожидание и ошибки, затем обновите затронутые кешированные представления.',
  'queryDocs.prerequisites':
    'Начните с компонентов и signals Angular. Разберитесь с запросом, прежде чем выбирать правила кеширования или структуру функциональности.',
  'queryDocs.reference': 'Справочник API',
  'queryDocs.referenceIntro':
    'Ниже доступны сигнатуры и точные таблицы состояний и параметров. Для объяснения или практического сценария перейдите к руководствам.',
  'queryDocs.refreshControls':
    'reload() запускает фоновое обновление и возвращает логическое значение. execute() возвращает Promise свежего чтения. Оба обходят готовые данные и присоединяются к допустимому выполняющемуся запросу.',
  'queryDocs.retention':
    'gcTime определяет хранение после ухода последнего наблюдателя. Очистка ждёт завершения выполняющихся запросов. Активные наблюдатели сохраняют данные.',
  'queryDocs.saving': 'Сохранение изменений · mutateResource',
  'queryDocs.tagIdentity':
    'Тег — объект с type и необязательными scope/id. Мутация выбирает совпадающие теги; отсутствие scope не означает все области.',
  'queryDocs.triggers':
    'Устаревшие данные могут обновиться при повторном наблюдении. Ручное обновление и инвалидация запрашивают свежие данные; опрос и восстановление при фокусе или подключении требуют настройки.',
  'queryDocs.writeBoundary':
    'После успешной записи синхронизация кеша может завершиться ошибкой. Проверьте invalidationError и обновите чтения; не повторяйте успешную запись ради исправления кеша.',
  'queryLearn.collectionExplain':
    'Выберите оба ID, измените порядок и очистите выбор. Сохранившиеся ключи удерживают наблюдателей; удалённые элементы освобождают их. У каждой строки свои состояния загрузки, ошибки и обновления.',
  'queryLearn.collectionIntro':
    'Используйте queryResource, если один запрос возвращает список. Используйте queryResources, если изменяющейся коллекции нужен отдельный запрос для каждого элемента.',
  'queryLearn.fixture':
    'Этот полный пример использует локальный таймер для имитации задержек и сбоев сервера. Откройте TypeScript для копирования компонента; HTML показывает тот же компилируемый шаблон.',
  'queryLearn.httpSetup':
    'Для HTTP предоставьте HttpClient в app.config.ts и замените имитацию на http.get<Team>(url) с зафиксированным ID. Корневой клиент не требует дополнительной регистрации.',
  'queryLearn.readError': 'Чтение не удалось. Отключите имитацию сбоя и обновите для повторной попытки.',
  'queryLearn.readExplain':
    'key задаёт данные; loader получает их. Signals, прочитанные в определении, выбирают данные. value() предоставляет результат; isInitialLoading() означает загрузку без данных.',
  'queryLearn.readExplainTitle': 'Как работает первое чтение',
  'queryLearn.readIntro':
    'queryResource загружает данные и предоставляет результат, загрузку и ошибки как signals Angular. Компоненты с одним ключом разделяют кеш и выполняющийся запрос.',
  'queryLearn.readSteps':
    'Загрузите Команду A, выберите Команду B и обновите. Включите сбой и обновите снова: команда останется видимой. Отключите сбой и обновите для восстановления.',
  'queryLearn.readTitle': 'Ваш первый запрос',
  'queryLearn.refreshExplain':
    'isRefreshing() означает чтение при сохранении предыдущих данных на экране. error() сообщает сбой; isRefreshError() выделяет сбой с сохранёнными данными.',
  'queryLearn.saved': 'Сохранено',
  'queryLearn.simulateFailure': 'Имитировать сбой',
  'queryLearn.teamA': 'Команда A',
  'queryLearn.teamB': 'Команда B',
  'queryLearn.writeError':
    'Сохранение не удалось. Введённые данные сохранены; отключите имитацию сбоя и сохраните снова.',
  'queryLearn.writeExplain':
    'mutate(args) отправляет значение и возвращает Promise. isLoading() управляет ожиданием; error() сообщает ошибку записи. Начните без тегов; добавьте их для обновления кешированных чтений после успешной записи.',
  'queryLearn.writeExplainTitle': 'Как работает первое сохранение',
  'queryLearn.writeIntro':
    'mutateResource выполняет запись на сервер при вызове mutate(). Signals ожидания, результата и ошибки позволяют форме отражать итог операции.',
  'queryLearn.writeSteps':
    'Введите имя и сохраните. Включите сбой и сохраните снова, затем отключите его и повторите. Форма блокирует отправку, пока запись выполняется.',
  'queryLearn.writeTitle': 'Ваше первое сохранение',
  'toSignalForm.savedProfile': 'Сохранённый профиль',
  'queryResource.projectRevision': 'Версия ответа',
  'queryResource.activeUser': 'Текущий пользователь',
  'queryResource.engineLabel': 'Движок',
  'queryResource.computeLabel': 'Ресурсы',
  'queryOwnership.title': 'Ключи и теги на уровне домена',
  'queryOwnership.definitions':
    'Оставляйте наблюдателей в компонентах. Импортируйте полные определения запросов и фабрики тегов из домена-владельца; включайте в ключи область и все параметры, влияющие на ответ.',
  'queryOwnership.refactoring':
    'Используйте общие экспорты вместо повторения строк. Перед изменением или удалением определения найдите все ссылки, согласуйте действия с ответственным доменом и проверьте затронутые операции чтения и записи.',
  'queryOwnership.noCache':
    'Ключи также определяют общие запросы и состояние. staleTime: 0 делает данные устаревшими; gcTime: 0 удаляет неиспользуемые записи после завершения запросов. Для независимого состояния без ключа используйте resourceAsync. Мутациям ключ не нужен.',
  'queryOwnership.naming':
    'invalidateTags принимает массив или функцию (result, args), вызываемую только после успеха. Верните [] для пропуска инвалидации.',
  'queryOwnership.journey':
    'Добавьте участников: таблица и сводка разделяют один запрос при обновлении. Закройте сводку, добавьте ещё участника и откройте её. Данные и число запросов команды B не меняются.',
  'queryOwnership.closeSummary': 'Закрыть сводку',
  'queryOwnership.openSummary': 'Открыть сводку',
  'queryOwnership.summary': 'Сводка команды A',
  'queryOwnership.teamAReads': 'Запросы команды A',
  'queryOwnership.otherScope': 'Участники команды B (другая область)',
  'queryOwnership.teamBReads': 'Запросы команды B',
  'header.selectLanguage': 'Выберите язык',
  'header.openGitHub': 'Открыть на GitHub',
  'header.codeLicensed': 'Код под лицензией',
  'nav.signalUtils': 'Утилиты сигналов',
  'nav.queryMutation': 'Запросы и серверное состояние',
  'nav.operators': 'Операторы',
  'nav.interceptors': 'Интерцепторы',
  'nav.validators': 'Валидаторы',
  'nav.pipes': 'Пайпы',
  'nav.utilities': 'Утилиты',
  'nav.components': 'Компоненты',
  'nav.pageContainer': 'Контейнер страницы',
  'nav.timelineWizard': 'Мастер временной шкалы',
  'nav.alert': 'Оповещение',
  'nav.multiAlerts': 'Оповещения (Несколько)',
  'nav.callout': 'Выноска',
  'nav.spinner': 'Спиннер',
  'nav.toast': 'Тост-уведомление',
  'nav.tooltip': 'Подсказка',
  'nav.themeToggle': 'Переключение темы',
  'nav.fileReader': 'Чтение файлов',
  'nav.keyValueInputs': 'Ввод ключ-значение',
  'nav.statusIndicator': 'Индикатор состояния',
  'nav.idleDetection': 'Определение неактивности',
  'nav.certificate': 'Просмотр сертификатов',
  'nav.datagrid': 'Таблица данных',
  'nav.byteConverter': 'Конвертер байтов',
  'nav.mask': 'Маска',
  'nav.arrayJoin': 'Объединение массива',
  'nav.range': 'Диапазон',
  'nav.isHttps': 'Проверка Https',
  'nav.differenceInDays': 'differenceInDays',
  'nav.badgeNew': 'НОВОЕ',
  'nav.badgeUpdated': 'ОБНОВЛЕНО',
  'nav.badgePopular': 'ПОПУЛЯРНОЕ',
  'nav.badgeCore': 'ЯДРО',
  'home.start': 'Начало работы',
  'home.prerequisite': 'Инструкции рассчитаны на Angular 21. Начните с существующего автономного приложения Angular.',
  'home.ngxLift.setup':
    'Установите ngx-lift и выберите задачу. Для HTTP-примеров нужен provideHttpClient(); для локальных сигналов и таймеров он не нужен.',
  'home.clrLift.setup':
    'Добавьте глобальные стили Clarity и импортируйте используемые автономные компоненты. Начните с уведомления ниже, затем перейдите к руководству по компоненту.',
  'home.ngxLift.title': 'ngx-lift',
  'home.ngxLift.subtitle': 'Усилить свой рабочий поток разработки <code>modern</code> Angular',
  'home.ngxLift.supportMatrix': 'Матрица поддержки версии',
  'home.ngxLift.thVersion': 'Версия ngx-lift',
  'home.ngxLift.thNgVersion': 'Версия Angular',
  'home.ngxLift.utilityTitle': 'Служебные функции',
  'home.ngxLift.utilityDesc':
    'Комплексные функции коммунального обслуживания, призванные ускорить решение общих задач в области развития',
  'home.ngxLift.rxjsTitle': 'Операторы RxJS',
  'home.ngxLift.rxjsDesc':
    'Специализированные операторы, упрощающие сложные операции по реагированию и повышающие устойчивость кодов',
  'home.ngxLift.signalTitle': 'Коммунальные услуги Signal',
  'home.ngxLift.signalDesc': 'Устройства на основе сигнала, которые дополняют Angular Signals API',
  'home.clrLift.title': 'clr-lift',
  'home.clrLift.subtitle':
    'Расширение проектной системы Clarity с многоразовыми компонентами, коммунальными службами и операторами',
  'home.clrLift.supportMatrix': 'Матрица поддержки версии',
  'home.clrLift.thVersion': 'Версия clr-lift',
  'home.clrLift.thNgVersion': 'Версия Angular',
  'home.clrLift.utilitiesTitle': 'Коммунальные услуги',
  'home.clrLift.utilitiesDesc':
    'Специализированные коммунальные услуги, предназначенные для компонентов Clarity, которые упрощают общие задачи и операции, обеспечивая беспрепятственный опыт разработки',
  'home.clrLift.rxjsTitle': 'Операторы RxJS',
  'home.clrLift.rxjsDesc':
    'Усовершенствованные операторы RxJS, расширяющие функциональность Clarity. Оператор <code>dgState</code> упорядочивает систему государственного управления данными, обеспечивая интуитивный и эффективный подход к работе с Clarity datagrids.',
  'home.clrLift.componentsTitle': 'Компоненты',
  'home.clrLift.componentsDesc':
    'Производственные компоненты, созданные на базе системы проектирования Clarity, включая уведомления о тостах, предупреждения, звонки, контейнер для страниц, тематическое манёвр и т.д.',
  'home.clrLift.tipPeer':
    'В некоторых случаях может потребоваться установка <strong>Force </strong>, если &#64;clr/angular spects concerned concerned Angular version, чем ваш проект.',
  'home.clrLift.tipSkipLib':
    'Если вы не используете последнюю версию Angular, подумайте о постановке <code>skipLibCheck: true</code> в tsconfig.json, чтобы избежать возможных ошибок в создании.',
  'home.clrLift.tipIcon':
    'Обеспечивать, чтобы значки Clarity импортировались правильно с использованием <code>ClarityIcons.addIcons(...)</code>.',
  'common.examples': 'Примеры',
  'common.apiReference': 'Справочник API',
  'common.overview': 'Обзор',
  'common.parameters': 'Параметры',
  'common.returns': 'Возвращает',
  'rockStar.todayIs': 'Сегодня',
  'rockStar.whoIsStar': 'Кто наша сегодняшняя рок-звезда?',
  'rockStar.unveil': 'Откройте',
  'common.signature': 'Сигнатура',
  'common.description': 'Описание',
  'common.clear': 'Очистить',
  'common.basicUsage': 'Базовое использование',
  'common.inputs': 'Входные свойства (Inputs)',
  'common.outputs': 'Выходные события (Outputs)',
  'common.type': 'Тип',
  'common.default': 'По умолчанию',
  'common.contentProjection': 'Проекция контента (Content Projection)',
  'common.example': 'Пример',
  'common.example1': 'Пример 1: Базовое использование',
  'common.example2': 'Пример 2: С RxJS Pipe оператором',
  'common.example3': 'Пример 3: Асинхронный код',
  'common.example4': 'Пример 4: Отдельный Injector',
  'common.methods': 'Методы',
  'common.selector': 'Селектор',
  'common.behaviors': 'Стратегии поведения',
  'common.behavior': 'Поведение',
  'common.features': 'Основные возможности',
  'common.properties': 'Свойства',
  'common.validationErrors': 'Ошибки валидации',
  'common.usageNotes': 'Примечания по использованию',
  'common.liveDemo': 'Интерактивная демонстрация',
  'common.required': 'Обязательно',
  'common.refresh': 'Обновить',
  'common.firstName': 'Имя',
  'common.lastName': 'Фамилия',
  'common.email': 'Электронная почта',
  'common.gender': 'Пол',
  'common.male': 'Мужской',
  'common.female': 'Женский',
  'common.name': 'Имя',
  'common.noDataFound': 'Данные не найдены',
  'common.noItems': 'Нет элементов',
  'common.paginationOf': '{0} - {1} из {2} элементов',
  'common.seeUiBehavior': 'Нажмите, чтобы увидеть поведение интерфейса',
  'filterUsers.selectGender': 'Выбор пола для загрузки пользователей',
  'fileReader.file': 'Файл',
  'fileReader.readSuccess': 'Содержание файла успешно считывается',
  'fileReader.submitAndLog': 'Введите и просмотрите журнал консолей',
  'fileReader.caBundle': 'CA Связка',
  'fileReader.showCertificate': 'Показать сертификат:',
  'fileReader.exceedLimit': 'Превышение максимального размера файла ({0} MB).',
  'multiAlerts.addStandard': 'Добавить стандартную сигнализацию',
  'multiAlerts.addInlineBtn': 'Добавить сигнал тревоги с встроенной кнопкой',
  'multiAlerts.addAction': 'Добавить сигнал тревоги с действием',
  'multiAlerts.clearAll': 'Очистить все предупреждения',
  'toast.successBtn': 'Тост успеха',
  'toast.infoBtn': 'Тост с информацией',
  'toast.errorBtn': 'Тост с ошибкой',
  'toast.warningBtn': 'Предупреждающий тост',
  'idleDetection.startSimulation': 'Запуск быстрой имитации (3s Idle)',
  'idleDetection.stopSimulation': 'Остановить имитации',
  'idleDetection.simActive': 'Моделирование Активно:',
  'idleDetection.sessionStatus': 'Статус:',
  'idleDetection.totalTimeouts': 'Общие сроки:',
  'idleDetection.yes': 'Есть.',
  'idleDetection.no': 'Нет',
  'resourceAsync.userN': 'Пользователь {0}',
  'resourceAsync.reload': 'Перезагрузить',
  'resourceAsync.regUsernamePlaceholder': 'Введите имя пользователя (3-20 шаров)',
  'resourceAsync.regUsernameError': 'Имя пользователя должно быть 3-20 символов',
  'resourceAsync.regEmailPlaceholder': 'Введите свой email',
  'resourceAsync.regEmailError': 'Введите действительную электронную почту',
  'resourceAsync.regPasswordPlaceholder': 'Введите пароль (мин. 8 шаров)',
  'resourceAsync.regPasswordError': 'Пароль должен иметь по меньшей мере 8 знаков',
  'resourceAsync.loadingTodo': 'Загрузка...',
  'resourceAsync.loadTodo': 'Загрузить тодо',
  'resourceAsync.saving': 'Спасаю...',
  'resourceAsync.resetFromServer': 'Перезагрузить из сервера',
  'resourceAsync.loadUserCacheFirst': 'Загрузить пользователя (каша-первая)',
  'resourceAsync.fromCache': 'Из Кэша',
  'resourceAsync.updating': 'Обновление...',
  'resourceAsync.loadCounter': 'Счетчик нагрузки',
  'resourceAsync.unsavedChanges': 'Несохраненные изменения - счетчик был изменен на месте',
  'resourceAsync.saveToServer': 'Сохранить в сервер',
  'resourceAsync.discardChanges': 'Отключить изменения',
  'playground.beginner': 'Начальный',
  'playground.intermediate': 'Средний',
  'playground.advanced': 'Продвинутый',
  'playground.copy': 'Копировать',
  'playground.copied': 'Скопировано',
  'playground.viewCode': 'Показать код',
  'playground.hideCode': 'Скрыть код',
  'playground.stackedLayout': 'Вертикальный вид',
  'playground.splitLayout': 'Вид бок о бок',
  'inspector.liveState': 'Состояние сигналов онлайн',
  'inspector.rawJson': 'Исходный JSON',
  'inspector.hideJson': 'Скрыть JSON',
  'mergeFrom.overview':
    'Функция <code>mergeFrom</code> объединяет значения Observables или Signals и отправляет последнее значение. Она также позволяет модифицировать отправленное значение с помощью операторов RxJS перед тем, как оно будет отправлено. Хотя она похожа на <code>merge()</code>, она также учитывает Signals. <code>mergeFrom</code> похожа на <code>combineFrom</code>, но вместо отправки совмещённого значения она отправляет последнее отправленное значение с использованием оператора merge, а не combineLatest.',
  'mergeFrom.example1Desc': 'Объединение нескольких сигналов или observables:',
  'mergeFrom.example2Desc': 'Передача RxJS pipe оператора для изменения выдаваемых значений:',
  'mergeFrom.example3Desc':
    'Используйте <code>startWith</code> или <code>initialValue</code> для асинхронных observables:',
  'mergeFrom.example4Desc':
    'Передайте пользовательский <code>Injector</code> для создания объединенного сигнала вне контекста внедрения:',
  'mergeFrom.apiSummary':
    'Объединяет несколько Observables или Signals в один Signal, который отправляет последнее значение из любого источника, аналогично <code>merge</code>, но с поддержкой Signals.',
  'mergeFrom.paramSources':
    'Объект или массив Observables или Signals для слияния. При наличии объекта результатом будет объект с теми же ключами.',
  'mergeFrom.paramOperator': 'Оператор трубопровода RxJS для манипулирования излучаемыми значениями до их выброса.',
  'mergeFrom.paramOptions': 'Параметры, включая initialValue и инжектор.',
  'mergeFrom.returnsDesc':
    'Signal, который излучает комбинированную/суммарную величину в качестве источников выбросов.',
  'toSignalForm.pageTitle': 'Реактивные сигналы форм и привязки (toSignalForm)',
  'toSignalForm.bannerTitle': 'Связывание Angular Reactive Forms и современных сигналов',
  'toSignalForm.bannerDesc':
    '<code>toSignalForm</code> обёртывает стандартные Angular <code>FormGroup</code> инстансы с реактивными сигналами, декларативными связями (<code>bindIf</code>, <code>bindDisabled</code>), перекрёстной проверке полей, и очищёнными значениями отправки (<code>submitValue</code>) — сохраняя 100% совместимость с контейнерами форм Clarity и Angular валидаторами.',
  'toSignalForm.quickTitle': 'Уровень 1: Быстрый старт с сигналами форм',
  'toSignalForm.quickBadge': '30-секундный Hello World',
  'toSignalForm.quickDesc':
    'Основы: оберните FormGroup с помощью toSignalForm, считывайте значения реактивно через сигналы и блокируйте действия с sf.invalid().',
  'toSignalForm.username': 'Имя пользователя',
  'toSignalForm.usernamePlaceholder': 'Не менее 3 символов',
  'toSignalForm.usernameRequired': 'Имя пользователя обязательно.',
  'toSignalForm.usernameMinLength': 'Должно быть не менее 3 символов.',
  'toSignalForm.email': 'Адрес эл. почты',
  'toSignalForm.emailPlaceholder': 'name@domain.com',
  'toSignalForm.emailRequired': 'Эл. почта обязательна.',
  'toSignalForm.emailInvalid': 'Пожалуйста, введите действительный адрес эл. почты.',
  'toSignalForm.receiveUpdates': 'Получать обновления по эл. почте',
  'toSignalForm.saveProfile': 'Сохранить профиль',
  'toSignalForm.reset': 'Сбросить',
  'toSignalForm.quickFormState': 'Состояние сигналов быстрой формы',
  'toSignalForm.quickFormStateDesc': 'Сигналы обновляются синхронно по мере ввода в форме выше',
  'toSignalForm.enterpriseTitle': 'Уровень 2: Enterprise Showcase - Подготовка облачной БД',
  'toSignalForm.enterpriseBadge': 'Реальная спецификация',
  'toSignalForm.enterpriseDesc':
    'Сложное наличие полей, асинхронная проверка через resourceAsync, каскадные обновления версий и блокировки масштабирования.',
  'toSignalForm.enterpriseState': 'Онлайн сигналы Enterprise-формы',
  'toSignalForm.enterpriseStateDesc':
    'Отслеживает валидацию формы, блокировки автомасштабирования и статус подготовки бэкенда в реальном времени',
  'toSignalForm.region': 'Регион развертывания / Узел',
  'toSignalForm.regionSelect': 'Выберите целевой регион...',
  'toSignalForm.regionUSWest': 'US West (Cloud v2 - Multi-Zone HA поддерживается)',
  'toSignalForm.regionApEast': 'Азиатско-Тихоокеанский регион (региональная облако - многозонная HA для PG и MySQL)',
  'toSignalForm.regionEuCentral': 'Центральная Европа (Леганский регион - только одна зона)',
  'toSignalForm.regionRequired': 'Регион развертывания обязателен.',
  'toSignalForm.regionHelper': 'Асинхронно проверяет возможности регионального узла через <code>computedAsync</code>.',
  'toSignalForm.multiZoneSupported': '✓ Поддерживается многозонная HA',
  'toSignalForm.singleZoneOnly': 'Только одна зона (HA заблокирована)',
  'toSignalForm.engine': 'СУБД',
  'toSignalForm.enginePostgres': 'PostgreSQL',
  'toSignalForm.engineMysql': 'MySQL',
  'toSignalForm.engineSqlServer': 'SQL Сервер',
  'toSignalForm.engineRequired': 'СУБД обязательна.',
  'toSignalForm.engineHelper': 'Опции ниже реактивно выводятся из <code>sf.fields.engine.value</code>.',
  'toSignalForm.haTopology': 'Multi-Zone HA Топология',
  'toSignalForm.haCrossAz': 'Зона трансграничной пригодности',
  'toSignalForm.haDedicated': 'Специальные хостинги против родства',
  'toSignalForm.haRequired': 'Требуется топология HA.',
  'toSignalForm.haHelper': 'Динамическая установка <code>sf.bindIf(isMultiZoneSupported, ...)</code>.',
  'toSignalForm.replicaCount': 'Количество репликов узла',
  'toSignalForm.replicaRequired': 'Требуется пересчёт реплики.',
  'toSignalForm.replicaMin': 'Не менее 2 копий для мультизоны HA.',
  'toSignalForm.replicaMax': 'Допускаются максимум 5 копий.',
  'toSignalForm.replicaHelper': 'Ценности сохраняются по всему региону.',
  'toSignalForm.version': 'Версия двигателя',
  'toSignalForm.versionSelect': 'Выбрать версию',
  'toSignalForm.versionRequired': 'Требуется версия двигателя.',
  'toSignalForm.versionHelper': 'Автоматически перезапускается в первую имеющуюся версию при изменении двигателя.',
  'toSignalForm.clusterName': 'Название кластера',
  'toSignalForm.clusterNamePlaceholder': 'Например, выставление счетов-дБ-первичное',
  'toSignalForm.clusterNameRequired': 'Требуется название кластера.',
  'toSignalForm.clusterNameMinLength': 'Должно быть по крайней мере четыре персонажа.',
  'toSignalForm.clusterNameHelper':
    'Дебюнсированные 400 мс & асинхронно проверялись по зарезервированным названиям (прод-дб, испытательный блок и т.д.).',
  'toSignalForm.clusterNameChecking': 'Проверка наличия имени... (выпущено 400 мс)',
  'toSignalForm.autoScaling': 'Автоматическое расширение',
  'toSignalForm.autoScalingHelper':
    'При включении ручное хранение автоматически отключается и перезапускается на 250 GB.',
  'toSignalForm.storageGb': 'Расквартированное хранение (GB)',
  'toSignalForm.storageGbRequired': 'Требуется размер хранилища.',
  'toSignalForm.storageGbMin': 'Минимальное распределение - 20 GB.',
  'toSignalForm.storageGbHelper':
    "Свяжитесь через <code>sf.bindDisabled('storageGb', () =&gt; autoScaling(), &#123; resetOnDisable: true, resetValue: 250 &#125;)</code>.",
  'toSignalForm.storageLocked': ':: Автокассетное управление (инвалид, заблокировано на 250 GB)',
  'toSignalForm.storageManual': 'Разрешено распределение вручную',
  'toSignalForm.authMode': 'Режим аутентизации',
  'toSignalForm.authSql': 'Местный пользователь базы данных',
  'toSignalForm.authWindows': 'Общеорганизационный справочник/ &quot; Windows Out &quot;',
  'toSignalForm.authModeRequired': 'Требуется режим аутентификации.',
  'toSignalForm.authModeHelper':
    'Выбор местного пользователя базы данных монтирует пароль & подтверждение с сохранением памяти.',
  'toSignalForm.password': 'Главный пароль',
  'toSignalForm.passwordPlaceholder': 'Минус 8 символов',
  'toSignalForm.passwordRequired': 'Требуется главный пароль.',
  'toSignalForm.passwordMinLength': 'Должно быть, 8 символов.',
  'toSignalForm.confirmPassword': 'Подтвердить пароль',
  'toSignalForm.confirmPasswordPlaceholder': 'Повторить главный пароль',
  'toSignalForm.confirmPasswordRequired': 'Требуется подтверждение пароля.',
  'toSignalForm.passwordMismatch': 'Пароли не совпадают.',
  'toSignalForm.confirmPasswordHelper':
    'Автоматически повторится, когда Мастер Пароль изменится через <code>sf.revalidate</code>.',
  'toSignalForm.tlsCert': 'Сертификат TLS / SSL',
  'toSignalForm.certManaged': 'Платформа Auto-Generation',
  'toSignalForm.certCustom': 'Индивидуальный сертификат предприятия',
  'toSignalForm.certRequired': 'Требуется тип свидетельства.',
  'toSignalForm.certHelper':
    'Обычный режим динамическо монтирует ввод сертификата и сохраняет напечатанный текст попеременно.',
  'toSignalForm.tlsChain': 'Цепочка сертификатов PEM',
  'toSignalForm.tlsChainPlaceholder': 'BEGIN CERTIFICATE--------END CERTIFICATE-----',
  'toSignalForm.tlsChainRequired': 'Требуется цепочка сертификатов.',
  'toSignalForm.tlsChainMinLength': 'Свидетельство должно иметь не менее 20 знаков.',
  'toSignalForm.tlsChainHelper': 'Введите текст, переключите на "Auto-Generated" и переключите назад: текст сохранен!',
  'toSignalForm.createCluster': 'Создать кластер',
  'toSignalForm.resetForm': 'Перезагрузить форму',
  'toSignalForm.submitting': 'Подача запроса о предоставлении кластеров на контрольную плоскость... (1.0 симуляция)',
  'toSignalForm.successTitle': 'Запрашиваемые клетки (ID: {0})',
  'toSignalForm.simulatedResponse': 'Имитированный ответ, полученный в 1,0 секунды:',
  'toSignalForm.diagnosticsTitle': 'Диагностика Signal в режиме реального времени',
  'toSignalForm.clusterNameState': 'Государство названия кластера (sf.fields.clusterName)',
  'toSignalForm.value': 'Значение:',
  'toSignalForm.debounced': 'Дебунс (400 мс):',
  'toSignalForm.valid': 'Действительно:',
  'toSignalForm.touched': 'Прикоснувшись:',
  'toSignalForm.errors': 'Ошибка:',
  'toSignalForm.sqlCredState': 'SQL Государство, подтверждающее полномочия',
  'toSignalForm.authModeLabel': 'Режим аут:',
  'toSignalForm.controlsAttached': 'Прилагаемые механизмы контроля:',
  'toSignalForm.passwordValid': 'Действительный пароль:',
  'toSignalForm.passwordErrors': 'Ошибка паролей:',
  'toSignalForm.confirmValid': 'Подтверждаю действительность:',
  'toSignalForm.confirmErrors': 'Подтверждение ошибок:',
  'toSignalForm.sanitizedPayload': 'Рационализованная рабочая нагрузка на представление документации (Sf.submitValue)',
  'toSignalForm.sanitizedDesc':
    'Auto-omits UI-только <code>confirmPassword</code> и опущенный <code>password</code> на Windows auth.',
  'toSignalForm.patternsTitle': 'Специализированные архитектурные шаблоны',
  'toSignalForm.pattern1Title': 'Шаблон 1: Условное добавление полей с bindIf',
  'toSignalForm.pattern1Desc':
    'Привязывает группу связанных контролов (например, данные базы данных) вместе на основе реактивного условия. Отсоединённые контролы автоматически исключаются из проверки и отправки на сервер, и их ввод сохраняется при переключении, когда <code>preserveValue: true</code> настроен.',
  'toSignalForm.pattern2Title': 'Шаблон 2: Условное отключение с bindDisabled',
  'toSignalForm.pattern2Desc':
    'Привязывает состояние включения/выключения контрола напрямую к булевскому сигналу или реактивному получателю функции (<code>() =&gt; boolean</code>). Поддерживает сильнотипизированные ключи контролов, прямые <code>sf.controls.&lt;name&gt;</code> улучшенные контролы и <code>AbstractControl</code> инстансы. По умолчанию <code>emitEvent: true</code> для обеспечения синхронного обновления реактивных сигналов статуса, и поддерживает опциональное сброс при отключении с сильнотипизированным <code>resetValue</code>.',
  'toSignalForm.pattern3Title': 'Шаблон 3: Отправка значения через submitValue',
  'toSignalForm.pattern3Desc':
    'Решает противоречие между <code>form.value</code> (который исключает отключенные контролы) и <code>form.getRawValue()</code> (который выдает UI-поле, например, <code>confirmPassword</code>). <code>sf.submitValue()</code> предоставляет реактивный сигнал, который всегда очищен и готов к отправке или <code>resourceAsync</code>.',
  'toSignalForm.pattern4Title': 'Шаблон 4: Асинхронные данные с computedAsync и bindIf',
  'toSignalForm.pattern4Desc':
    'В облаке и в корпоративных приложениях, доступные поля форм часто зависят от региональных возможностей или флагов функций, разрешенных асинхронно из API-концовок. <code>computedAsync</code> производит реактивный <code>Signal&lt;boolean&gt;</code> из выбранного региона и движка, который передаётся напрямую в <code>sf.bindIf</code> для привязки или отвязки возможностей контролей в режиме реального времени.',
  'toSignalForm.pattern5Title': 'Шаблон 5: Паритет контейнеров форм Clarity',
  'toSignalForm.pattern5Desc':
    'Когда изменение контрола формы запускает цепную обновление в другом контроле (например, сброс доступных версий при изменении движка базы данных), можно использовать традиционный паттерн RxJS <code>valueChanges.pipe(takeUntilDestroyed())</code> или утилиту сигнал-в-начале <code>sf.controls.&lt;name&gt;.watch()</code> / <code>sf.watch()</code>. <code>watch</code> работает внутри Angular <code>effect()</code> с автоматической <code>untracked</code> изоляцией, предотвращая ошибки <code>NG0600</code> при записи сигналов, при этом убирая ручное разрушение подписок.',
  'toSignalForm.apiReferenceTitle': 'API Ссылка',
  'toSignalForm.apiToSignalFormTitle': 'toSignalForm (форма, опции?)',
  'toSignalForm.apiBindIfTitle': 'sf.bindIf (контроль, состояние, параметры?) / bindControlIf',
  'toSignalForm.apiBindDisabledTitle': 'sf.bindDisabled (контроль, состояние, параметры?) / bindControlDisabled',
  'toSignalForm.apiRevalidateTitle': '/ revalidateOnChange',
  'toSignalForm.apiPropForm': 'Пример Angular FormGroup, чтобы обернуться реактивными сигналами и связками.',
  'toSignalForm.apiPropOmit': 'Контролировать имена для исключения из полезной нагрузки submitValue.',
  'toSignalForm.apiPropEmitEvent':
    'Вне зависимости от того, происходят ли изменения в состоянии/значении изменения в контрольной деятельности Angular.',
  'toSignalForm.apiPropValue': 'Реактивный сигнал текущей формы.',
  'toSignalForm.apiPropStatus': 'Реактивный сигнал общего состояния формы (VALID) (INVALID), PENDING (DISABLED).',
  'toSignalForm.apiPropValid': 'Вычисленный сигнал, указывающий, является ли форма действительной.',
  'toSignalForm.apiPropInvalid': 'Вычисленный сигнал, указывающий, является ли форма недействительной.',
  'toSignalForm.apiPropSubmitValue':
    'Санитарная полезная нагрузка, за исключением отключенных, опущенных или немонтированных органов управления.',
  'toSignalForm.apiPropIsSubmitting': 'Сигнал, отслеживающий, находится ли асинковая подача в полете.',
  'toSignalForm.apiBindIfControl':
    'Наименование или пример органа управления, предназначенного для установки/отключения условно.',
  'toSignalForm.apiBindIfCondition':
    'Булевой сигнал или основной сигнал, определяющий, установлен ли орган управления.',
  'toSignalForm.apiBindIfPreserveValue':
    'Сохраняет контрольное значение в памяти в течение неустановленных/надбавленных циклов.',
  'toSignalForm.apiBindIfDefaultValue':
    'По умолчанию присвоенное значение при установке или повторном включении органа управления.',
  'toSignalForm.apiBindIfEmitEvent': 'Выделяет ли контрольное добавление/выброс значения и статус FormGroup.',
  'toSignalForm.apiBindDisabledControl':
    'Контроль за целью, срабатывающее/нетрудоспособное состояние которого связано.',
  'toSignalForm.apiBindDisabledCondition':
    'Булевой сигнал или основной сигнал, возвращающийся к отключению, неверный для возможности.',
  'toSignalForm.apiBindDisabledResetOnDisable':
    'Автоматически переустанавливает контрольное значение при входе в состояние инвалидности.',
  'toSignalForm.apiBindDisabledResetValue':
    'Удельное значение возврата, когда resetOnDisable активирован; по умолчанию контролируется начальный/ноль.',
  'toSignalForm.apiBindDisabledEmitEvent':
    'Вне зависимости от того, изменяют ли возможности/изменяют ли они значение/статус.',
  'toSignalForm.apiRevalidateTarget':
    'Предназначенный контроль для повторной оценки достоверности данных при изменении источников.',
  'toSignalForm.apiRevalidateSources':
    'Один или несколько механизмов контроля на иждивенцев, изменение стоимости/статуса которых приводит к повторному подтверждению цели.',
  'toSignalForm.apiRevalidateOnlyIfTouched':
    'Повторная проверка цели только в том случае, если цель была затронута пользователем.',
  'toSignalForm.apiRevalidateOnlyIfDirty':
    'Повторное утверждение цели только в том случае, если цель была изменена (грязно).',
  'computedAsync.title': 'computedAsync',
  'computedAsync.overview':
    'Функция <code>computedAsync</code> — универсальная утилита, позволяющая вычислять значения из Promises, Observables или обычных значений. Она предоставляет гибкость в поведении вычисления через выборочные стратегии сглаживания (switch, merge, concat, exhaust) и присвоение начального значения. Для использования <code>computedAsync</code> нужно предоставить функцию, возвращающую Promise, Observable или обычное значение. Она затем возвращает <code>Signal</code>, отправляющий вычисленное значение.',
  'computedAsync.example1': 'Пример 1: Работа с Promises',
  'computedAsync.example1Desc': 'Вычислить значения из Promises:',
  'computedAsync.example2': 'Пример 2: Работа с Observables',
  'computedAsync.example2Desc':
    'Когда возвращается Observable, он автоматически подписывается и будет отписываться при уничтожении компонента или при повторном запуске вычисления. В следующем примере, если userId меняется, предыдущее вычисление будет отменено (включая любые активные API-запросы), и будет запущено новое вычисление.',
  'computedAsync.example3': 'Пример 3: Работа с обычными значениями',
  'computedAsync.example3Desc':
    'Это позволяет возвращать обычные значения (те, которые не состоят из Promises или Observables) из функции обратного вызова. Функция обратного вызова выполняется в микротаске, поэтому она не будет сразу отправлять значение (по умолчанию возвращает undefined). Чтобы сразу отправить значение, можно использовать опцию requireSync в объекте второго аргумента.',
  'computedAsync.example4': 'Пример 4: Работа с initialValue',
  'computedAsync.example4Desc':
    'Если мы хотим установить исходное значение расчетного значения, мы можем представить его в качестве второго аргумента в объекте опционов.',
  'computedAsync.example5': 'Пример 5: Работа с requireSync',
  'computedAsync.example5Desc':
    'Если у нас есть Observable, который синхронно отправляет значение, мы можем использовать опцию requireSync, чтобы гарантировать немедленную отправку значения. Эта функция также полезна для обеспечения типа <code>signal</code>, чтобы он исключал undefined по умолчанию (<code>Signal<T></code> вместо <code>Signal<T | undefined></code>).',
  'computedAsync.example6': 'Пример 6: Работа с оператором createAsyncState',
  'computedAsync.example6Desc':
    'В нижеприведённом примере у нас есть <code>Signal</code>, который представляет состояние вызова API. Мы используем <code>computedAsync</code> и <code>createAsyncState</code> для расчета состояния вызова API на основе <code>userId</code>.',
  'computedAsync.example7': 'Пример 7: Похищения (размещение, слияние, конкат, выхлопные газы)',
  'computedAsync.example7Desc':
    'По умолчанию, <code>computedAsync</code> использует поведение переключателя. Если вы хотите изменить это поведение, вы можете предоставить опцию поведения в рамках второго опции аргументации.',
  'computedAsync.behaviorSwitch': 'переключатель (по умолчанию)',
  'computedAsync.behaviorSwitchDesc':
    'При желании отменить предварительные вычисления используется поведение переключателя, что является по умолчанию. Если новые вычисления приводятся в действие до завершения предыдущего вычисления, то первое будет прекращено.',
  'computedAsync.behaviorMerge': 'объединиться',
  'computedAsync.behaviorMergeDesc':
    'Для сохранения предыдущих вычислений используется поведение слияния. Если новое вычисление начинается до завершения предыдущего, то первое сохраняется, пока начинается второе.',
  'computedAsync.behaviorConcat': 'concat',
  'computedAsync.behaviorConcatDesc':
    'Если требуется сохранение предварительного расчета вместе с ожиданием его завершения до начала нового, то выбирается поведение конкат.',
  'computedAsync.behaviorExhaust': 'Выхлопы',
  'computedAsync.behaviorExhaustDesc':
    'В тех случаях, когда необходимо не учитывать новые расчеты, пока предыдущий остается в силе, определяется поведение отработавших газов.',
  'computedAsync.example8': 'Пример 8: Использование с предыдущей расчетной стоимостью',
  'computedAsync.example8Desc':
    'Если возникнет необходимость использовать ранее рассчитанное значение в последующих расчетах, то доступ к нему можно получить в рамках функции обратного вызова в качестве первого аргумента.',
  'computedAsync.example9': 'Пример 9: Первоначально загрузка данных',
  'computedAsync.example9Desc': 'Первоначально загружать пользователей, когда компоненты загружаются:',
  'computedAsync.refresh': 'Обновить',
  'computedAsync.learnTrigger': 'Подробнее о <a href="{0}"><code>createTrigger</code></a>.',
  'computedAsync.example10': 'Пример 10: Загрузка данных, когда кликает кнопка',
  'computedAsync.example10Desc': 'Загрузить пользователей только при нажатии на кнопку:',
  'computedAsync.loadUsers': 'Загрузить пользователей',
  'computedAsync.example11': 'Пример 11: Обработка ошибок с onError',
  'computedAsync.example11Desc':
    'Используйте звонок <code>onError</code> для грациозной обработки ошибок и создания запасных значений. Когда <code>onError</code> возвращает значение, сигнал излучает это значение вместо того, чтобы запустить ошибку:',
  'computedAsync.onErrorCallout':
    'Обработчик <code>onError</code> возвращает резервное значение типа T. При необходимости явно включите <code>undefined</code> в T. Необработанные ошибки и исключения обработчика выбрасываются при чтении signal и никогда не становятся успешными данными.',
  'computedAsync.example12': 'Пример 12: По умолчанию ошибка выбрасывается при чтении',
  'computedAsync.example12Desc':
    'Необработанные ошибки выбрасываются при чтении signal. Перехватите ошибку чтения или верните типизированное резервное значение через <code>onError</code>.',
  'computedAsync.throwOnErrorCallout':
    '<code>throwOnError: true</code> выполняет <code>onError</code> для побочных эффектов и всё равно выбрасывает ошибку; возвращаемое значение игнорируется. <code>throwOnError: false</code> больше не поддерживается.',
  'computedAsync.example13': 'Пример 13: Переключение вкладок с отменой запроса (устойчивость потока)',
  'computedAsync.example13Desc':
    'В многотабличном UIs, быстро переключая вкладки, можно вызвать параллельные запросы в тех случаях, когда запросы в ходе полета отменяются или отменяются (например, отмена браузера).',
  'computedAsync.tabResilienceBefore':
    '<strong>Перед исправлением:</strong> Внутренняя ошибка (например, отмененный HTTP-запрос) будет распространяться через <code>switchAll</code> и навсегда завершать внешнюю подписку на observable. Интерфейс остался в режиме загрузки вечно и никогда не мог загрузить последующие вкладки.',
  'computedAsync.tabResilienceAfter':
    '<strong> После Фикс:</strong> Внутренняя ошибка безопасно поймана и обработана, сохраняя внешний поток в живом состоянии. Переключаясь на любую вкладку или перепробуя немедленно получает и отображает новые данные!',
  'computedAsync.tabActiveDirectory': 'Активный каталог',
  'computedAsync.tabBackupLocations': 'Резервные пункты',
  'computedAsync.tabCertificates': 'Сертификаты',
  'computedAsync.tabSimulateAborted': 'Имитировать аннулированный запрос',
  'computedAsync.tabNotice':
    'Заметьте: даже после этого смоделированного отказа запроса поток остается живым! Нажмите на любую вкладку выше, чтобы убедиться, что он беспрепятственно восстанавливается.',
  'computedAsync.example14': 'Пример 14: Разъединенный инжектор',
  'computedAsync.example14Desc':
    'Проходя факультативную <code>injector</code> в опционном объекте, <code>computedAsync</code> может быть мгновенным снаружи окружающего инжекторного контекста - например, внутри композиторных функций, таможенных служб или динамических методов завода:',
  'computedAsync.apiSummary':
    'Вычисляет значения из Promises, Observables или обычных значений, возвращая Signal, который отправляет вычисленное значение.',
  'computedAsync.paramComputation':
    'Функция, которая возвращает Promise, Observable или обычное значение. Функция получает предыдущее расчетное значение в качестве факультативного первого аргумента.',
  'computedAsync.paramOptions': 'Параметры для расчета асинков.',
  'computedAsync.propInitialValue': 'Начальное значение расчетного сигнала до завершения расчетов.',
  'computedAsync.propRequireSync': 'Если это так, то необходимо, чтобы вычисления излучали синхронно.',
  'computedAsync.propBehavior':
    'Стратегия обработки нескольких вычислений: "switch", "merge", "concat" или "exhaust". По умолчанию: "switch".',
  'computedAsync.propOnError': 'Перезвон оператора ошибки, получающего ошибки от асинковых операций.',
  'computedAsync.propThrowOnError': 'Если это так, то ошибки будут выбрасываться и распространяться.',
  'computedAsync.returnsDesc': 'Signal излучает расчетное значение.',
  'combineFrom.title': 'combineFrom',
  'combineFrom.overview':
    'Функция <code>combineFrom</code> принимает массив или объект Observables или Signals и производит Signal, который отправляет агрегированное значение из этих источников. Похожа на <code>combineLatest</code>, но плавно поддерживает Signals. Поддерживает кастомные инжекторы и начальные значения.',
  'combineFrom.example1': 'Пример 1: Базовое использование',
  'combineFrom.example1Desc': 'Сочетание нескольких сигналов или наблюдаемых сигналов:',
  'combineFrom.example2': 'Пример 2: Оператор трубопровода RxJS',
  'combineFrom.example2Desc': 'Передай оператору трубы RxJS, чтобы манипулировать значениями выбросов:',
  'combineFrom.example3': 'Пример 3: Подменить асинхронный код',
  'combineFrom.example3Desc':
    'Использовать <code>startWith</code> или <code>initialValue</code> опцию для обработки наблюдаемых асинков:',
  'combineFrom.example4': 'Пример 4: Реальный пример - фильтрованные данные',
  'combineFrom.example4Desc': 'Сочетать критерии поиска с ресурсом API для фильтрации и сортировки клиента:',
  'combineFrom.example5': 'Пример 5: Дублирование инициализации и эксплицитный инжектор',
  'combineFrom.example5Desc':
    'Улучшает первоначальный уровень выбросов сигнала. Отдельные источники все еще могут генерировать промежуточные комбинации; использование вычислений () для синхронизации сигналов.',
  'combineFrom.apiSummary':
    'Сочетает Observable и Signal источники с semantics combineLatest и дедупликацией по каждому источнику.',
  'combineFrom.paramSources':
    'Объект или массив Observables или Signals для комбинирования. При наличии объекта результатом будет объект с теми же ключами.',
  'combineFrom.paramOperator': 'Оператор трубопровода RxJS для манипулирования излучаемыми значениями до их выброса.',
  'combineFrom.paramOptions': 'Параметры, включая initialValue и инжектор.',
  'combineFrom.returnsDesc':
    'Сигнал, испускающий массив или объект (в зависимости от типа ввода), содержащий последние значения из всех наблюдаемых источников и сигналов.',
  'resourceAsync.title': 'resourceAsync',
  'resourceAsync.overview':
    'Функция <code>resourceAsync</code> создаёт реактивный ресурс для асинхронных операций с полным отслеживанием состояния. Поддерживает Observable, Promise и синхронные значения, автоматически отменяет устаревшие запросы и позволяет вручную перезагружать данные.',
  'resourceAsync.basicSection': 'Основные примеры',
  'resourceAsync.intermediateSection': 'Промежуточные примеры',
  'resourceAsync.whenToUseSection': 'Когда использовать',
  'resourceAsync.advancedSection': 'WritableResourceRef - Управление местными штатами',
  'resourceAsync.nestedSection': 'Усовершенствованный шаблон: ресурсы',
  'resourceAsync.example1': 'Пример 1: Базовый химически активный запрос с автоматическим отслеживанием зависимости',
  'resourceAsync.example1Desc':
    'Создание ресурса, который автоматически приносит данные и перезадаёт их при изменении зависимости. Любой считываемый внутри исходной функции сигнал становится реактивной зависимостью.',
  'resourceAsync.example2': 'Пример 2: Ленивая погрузка',
  'resourceAsync.example2Desc':
    'Используйте <code>lazy: true</code>, чтобы отложить загрузку до вызова <code>reload()</code>. Ресурс начинается в режиме холостого хода и не будет получать данные, пока он не активирован:',
  'resourceAsync.loadUsers': 'Загрузить пользователей',
  'resourceAsync.notLoadedIdle': 'Еще не загружен (идл)',
  'resourceAsync.example3': 'Пример 3: Начальное значение',
  'resourceAsync.example3Desc': 'Представить первоначальное значение для отображения перед первым заполнением:',
  'resourceAsync.example3Callout':
    'Полезно при плавании от списка до страницы, где у вас уже есть некоторые данные для немедленного отображения.',
  'resourceAsync.example4': 'Пример 4: Обработка ошибок с прокачиванием и прокачиванием ошибок',
  'resourceAsync.example4Desc':
    'Погружайтесь в погрешности с звонком <code>onError</code> для получения запасных значений, или используйте <code>throwOnError: true</code> для распространения ошибок:',
  'resourceAsync.triggerFallback': 'Запрос об организации операции (запасной пункт)',
  'resourceAsync.showingFallback': 'Показывать запасной пользователь после ошибки',
  'resourceAsync.errorPropagation': 'Ошибка пропелагации',
  'resourceAsync.example5': 'Пример 5: Мутации с выполнением () - Форма регистрации пользователей',
  'resourceAsync.example5Desc':
    'Для изменений (POST/PUT/DELETE) используйте метод <code>execute()</code> вместо <code>reload()</code>. <code>execute()</code> возвращает awaitable <code>Promise&lt;T&gt;</code>, которая разрешается в точное значение, записанное в <code>resource.value()</code>, очищает устаревшие значения и ошибки при повторном выполнении, и безопасна для вызовов fire-and-forget без неперехваченных отклонений.',
  'resourceAsync.regUsername': 'Имя пользователя',
  'resourceAsync.regEmail': 'Электронная почта',
  'resourceAsync.regPassword': 'Пароль',
  'resourceAsync.regSubmit': 'Регистрация',
  'resourceAsync.example6': 'Пример 6: Похищения (выбросы, выхлопные газы)',
  'resourceAsync.example6Desc': 'Контроль за тем, как выполняются многочисленные параллельные запросы:',
  'resourceAsync.example7': 'Пример 7: Отслеживание состояния',
  'resourceAsync.example7Desc':
    'Доступ к информации о гранулярном состоянии с сигналом <code>status()</code>. Используйте <code>computed()</code> для производного состояния:',
  'resourceAsync.example8': 'Пример 8: Разъяснение определения & AbortSignal',
  'resourceAsync.example8Desc':
    '<code>resourceAsync</code> поддерживает декларативное определение через <code>ResourceAsyncDefinition&lt;P, T&gt;</code> с <code>params</code> и <code>loader</code>, распространяет <code>context.abortSignal</code> для отслеживания генерации отмены и размещения отложенных промисов.',
  'resourceAsync.declarativeTitle': 'В прямом эфире: декларативное определение & аннулирование',
  'resourceAsync.quickSwitchDemo': 'Быстрый переключатель (прекращение работы)',
  'resourceAsync.activeSearchLogs': 'В режиме реального времени AbortSignal & Запрашивать журнал жизненного цикла',
  'resourceAsync.optimisticTitle': 'Пример 1: Оптимистические обновления - панель инструментов Тодо',
  'resourceAsync.optimisticDesc':
    'Обновить UI непосредственно перед подтверждением сервера. Если запрос сервера не работает, вы можете вернуть изменение. Это обеспечивает мгновенную обратную связь для пользователей.',
  'resourceAsync.cacheFirstTitle': 'Пример 2: Первая погрузка кэша',
  'resourceAsync.cacheFirstDesc':
    'Незамедлительно показывать данные в тайнике, получая свежие данные на заднем фоне. Это устраняет загрузку винтовок для пользователей с кадрами.',
  'resourceAsync.formDraftTitle': 'Пример 3: Проект формы - счетчик с сохранением/разглашением',
  'resourceAsync.formDraftDesc':
    'Позволить пользователям редактировать данные на месте, прежде чем сохранять их на сервере. Они могут сохранить изменения или выбросить их путем перезагрузки с сервера.',
  'resourceAsync.nestedTitle': 'Осуществление & Демо',
  'resourceAsync.nestedProjects': 'Проекты',
  'resourceAsync.nestedLoadingItems': 'Загрузка...',
  'resourceAsync.nestedRefreshing': 'Обновляю...',
  'resourceAsync.nestedThName': 'Имя',
  'resourceAsync.nestedThStatus': 'Статус',
  'resourceAsync.nestedThOrg': 'Организация работы',
  'resourceAsync.nestedThActions': 'Меры',
  'resourceAsync.nestedLoadOrg': 'Загрузить орбиту',
  'resourceAsync.nestedRetry': 'Повторить',
  'resourceAsync.nestedRefreshItems': 'Обновить',
  'resourceAsync.nestedLoadAllOrgs': 'Загрузить все обряды',
  'queryResource.title': 'queryResource',
  'queryResource.overview':
    '<code>queryResource</code> декларативно управляет состоянием сервера в Angular Signals, используя кэш и дедупликацию. Вместе с <code>mutateResource</code> и <code>QueryClient</code> поддерживает фоновый периодический опрос, кэширование stale-while-revalidate, объединение одновременных запросов и инвалидацию по тегам.',
  'queryResource.comparisonTitle': 'Когда использовать: queryResource против resourceAsync',
  'queryResource.comparisonIntro':
    'Оба примитива используют Angular Signals для реактивных UI, но они касаются различных слоев вашей архитектуры приложения:',
  'queryResource.cardResourceAsyncTitle': 'resourceAsync (Компонент-местная Асинкская область)',
  'queryResource.cardQueryResourceTitle': 'queryResource (общий сервер и составный кэш)',
  'queryResource.scope': 'Сфера применения',
  'queryResource.cache': 'Кэш',
  'queryResource.mutations': 'Мутации',
  'queryResource.freshness': 'Свежесть',
  'queryResource.polling': 'Голосование',
  'queryResource.invalidation': 'Недействительность',
  'queryResource.bestFor': 'Лучший для',
  'queryResource.resourceAsyncScopeDesc': 'Привязывается строго к жизненному циклу отдельного компонента.',
  'queryResource.resourceAsyncCacheDesc': 'Уничтожение компонента уничтожает данные.',
  'queryResource.resourceAsyncMutationsDesc': 'Встроенная функция () для прямых одноразовых спусковых устройств.',
  'queryResource.resourceAsyncBestForDesc':
    'Данные о представлении формы, местные поисковые фильтры типа &quot; холдинг &quot; , наборы данных по видам транспорта, экспорт файлов.',
  'queryResource.queryResourceScopeDesc': 'Глобальное управление маршрутами и компонентами QueryClient.',
  'queryResource.queryResourceCacheDesc': 'Совпадающие клавиатуры в полёте HTTP запрашивают и хранят память.',
  'queryResource.queryResourceFreshnessDesc': 'Конфигурируемый staleTime и gcTime (Stale-fight-Revalidate).',
  'queryResource.queryResourcePollingDesc':
    'Скоординировано pollInterval, которое автоматически уважает видимость вкладок.',
  'queryResource.queryResourceInvalidationDesc': 'Автомобильная очистка с помощью метки от mutateResource.',
  'queryResource.queryResourceBestForDesc':
    'Серверные структуры (пользователи, приборные панели, проекты, состояние кластеров) делятся различными видами информации.',
  'queryResource.thFeature': 'Особенности',
  'queryResource.rowPrimaryLayer': 'Первичный слой',
  'queryResource.rowPrimaryLayerResource': 'Местная асинхронная система на уровне компонентов',
  'queryResource.rowPrimaryLayerQuery': 'Общее состояние сервера',
  'queryResource.rowSharedMemory': 'Кэш общей памяти',
  'queryResource.badgeNoneComponent': 'Нет (обязательно)',
  'queryResource.badgeGlobalKey': 'Глобальный лейбл QueryKey',
  'queryResource.rowDeduplication': 'Совпадающий запрос',
  'queryResource.badgePerInstance': 'Для каждого экземпляра (switch/exhaust)',
  'queryResource.badgeClientCoalesced': 'Уголь',
  'queryResource.rowStaleWhileRevalidate': 'Затмение, в то же время - изменение',
  'queryResource.badgeManualPreserve': 'Руководство (preserveValueOnError)',
  'queryResource.badgeAutoStale': 'Автоматически через staleTime',
  'queryResource.rowBackgroundPolling': 'Справочная информация',
  'queryResource.badgeNoneBuiltIn': 'Нет встроенного (или внешнего опроса)',
  'queryResource.badgeCoordinatedVisibility': 'Скоординированная + Осознанная видимость',
  'queryResource.rowTagInvalidation': 'Неверность на основе метки',
  'queryResource.badgeManualReload': 'Спусковой механизм ручной перегрузки',
  'queryResource.badgeAutoMutate': 'Автоматически через mutateResource',
  'queryResource.lifecycleTitle': 'Матрица состояний жизненного цикла и сигналов',
  'queryResource.lifecycleIntro':
    'Запросы управляют как начальной загрузкой, так и фоновой повторной валидацией. Используйте эту матрицу, чтобы определить, когда следует показывать полноэкранный индикатор загрузки, а когда — ненавязчивый индикатор обновления без блокировки интерфейса. Матрица предполагает определённое успешное значение. hasValue() возвращает false для результата undefined.',
  'queryResource.matrixState': 'Состояние жизненного цикла',
  'queryResource.matrixStatus': 'status()',
  'queryResource.matrixWhenToUse': 'Когда использовать и поведение UI',
  'queryResource.matrixInitialLoad': 'Первоначальная загрузка (нет данных)',
  'queryResource.matrixInitialLoadUsage':
    'Отобразите основной спиннер или скелетон. В интерфейсе ещё нет данных для показа.',
  'queryResource.matrixResolved': 'Завершено / В кэше',
  'queryResource.matrixResolvedUsage':
    'Отображайте содержимое как обычно; данные доступны и могут быть актуальными или устаревшими.',
  'queryResource.matrixRefreshingState': 'Фоновая ревалидация (SWR / Инвалидация)',
  'queryResource.matrixRefreshingUsage':
    'НЕ показывайте полноэкранный спиннер! Сохраняйте существующие данные на экране и добавьте аккуратный бейдж или маленький спиннер в заголовке. Предотвращает мерцание и пустые экраны.',
  'queryResource.matrixInitialError': 'Начальная ошибка (нет данных)',
  'queryResource.matrixInitialErrorUsage': 'Отобразите полный экран с ошибкой или предупреждение с кнопкой повтора.',
  'queryResource.matrixRefreshError': 'Ошибка обновления (кэш сохранен)',
  'queryResource.matrixRefreshErrorUsage':
    'Сохраняйте данные на экране и покажите всплывающее уведомление (toast) или предупреждающий баннер.',
  'queryResource.placementTitle': 'Архитектура: размещение в компоненте vs в сервисе',
  'queryResource.loading': 'Загрузка…',
  'queryResource.placementIntro':
    'Где должны объявляться запросы? Поскольку <code>queryResource</code> работает в контексте внедрения зависимостей Angular, он поддерживается как в компонентах, так и в сервисах. Выберите подходящее размещение в зависимости от области видимости данных:',
  'queryResource.thPlacement': 'Размещение',
  'queryResource.thScopeLifetime': 'Область и жизненный цикл',
  'queryResource.thStateSharing': 'Общий доступ к состоянию',
  'queryResource.thCoordination': 'Координация повторных запросов',
  'queryResource.thRecommendation': 'Рекомендуется для',
  'queryResource.rowComponentPlacement': 'Размещение в компоненте',
  'queryResource.rowComponentScope': 'Привязано к инжектору компонента; удаляется при размонтировании',
  'queryResource.rowComponentSharing': 'Изолировано в рамках одного экземпляра компонента',
  'queryResource.rowComponentCoord': 'Локальные триггеры (query.reload())',
  'queryResource.rowComponentRec': 'Изолированные экраны, модальные окна, формы, вкладки деталей',
  'queryResource.rowServicePlacement': 'Размещение в сервисе',
  'queryResource.rowServiceScope': 'Привязано к инжектору сервиса; сохраняется между маршрутами',
  'queryResource.rowServiceSharing': 'Синхронно разделяется между множеством компонентов и маршрутов',
  'queryResource.rowServiceCoord': 'Глобальная координация через методы сервиса и инвалидацию тегов',
  'queryResource.rowServiceRec': 'Сессия аутентификации, активный выбор базы данных, master-detail',
  'queryResource.tabServicePatternA': 'Паттерн A: Глобальная сессия аутентификации (Root Service)',
  'queryResource.tabServicePatternADesc':
    'Синглтон-сервис управляет currentUser и updateProfile. Несколько компонентов читают один и тот же Signal без RxJS Subject или шин событий.',
  'queryResource.tabServicePatternB': 'Паттерн B: Параметризованный Master-Detail (Feature Service)',
  'queryResource.tabServicePatternBDesc':
    'Сервис хранит activeDatabaseId. Когда список обновляет Signal выбора, queryResource автоматически подгружает детальные спецификации.',
  'queryResource.tabComponentPlacement': 'Паттерн C: Размещение в компоненте (Изолированный экран)',
  'queryResource.tabComponentPlacementDesc':
    'Прямое размещение в компоненте является наиболее чистым подходом, если данные нужны только одному экрану.',
  'queryResource.simulatedTopbar': 'Глобальная панель навигации (Topbar)',
  'queryResource.simulatedProfile': 'Карточка профиля пользователя',
  'queryResource.simulatedMasterList': 'Список Master (выбор базы данных)',
  'queryResource.simulatedDetailCard': 'Экран Detail (активные характеристики)',
  'queryResource.updateNameBtn': 'Обновить имя',
  'queryResource.componentPlacementAdvice':
    'Размещение в компоненте рекомендуется, когда данные строго ограничены одним экраном. Не требует отдельных файлов сервисов и мгновенно очищается при размонтировании.',
  'queryResource.demo1Section': 'Просьба об использовании угля и его осложнении',
  'queryResource.demo1SectionDesc':
    'Когда два или более компонентов монтируются одновременно и запрашивают один и тот же ключ запроса, <code>QueryClient</code> делит один запрос на влетную сеть. Оба компонента получают тот же ответ с нулевым избыточным движением.',
  'queryResource.demo1PlaygroundTitle': 'Независимые компоненты разделяют выполняющиеся сетевые запросы',
  'queryResource.demo1PlaygroundDesc':
    'Имитирует два независимых компонента (TopbarStatusComponent и DashboardMetricsComponent), которые монтируются одновременно и запрашивают одинаковые метрики кластера. Нажмите «Перезагрузка запроса», чтобы убедиться, что выполняется только 1 реальный HTTP-запрос.',
  'queryResource.badgeDeduplication': 'Дедупликация',
  'queryResource.actualHttpCalls': 'Реальные HTTP-вызовы: {0}',
  'queryResource.reloadQuery': 'Перезагрузка запроса',
  'queryResource.widgetATitle': 'Глобальная панель навигации',
  'queryResource.widgetASubtitle': 'TopbarStatusComponent (Активные пользователи и статус)',
  'queryResource.widgetBTitle': 'Основная карточка дашборда',
  'queryResource.widgetBSubtitle': 'DashboardMetricsComponent (Загрузка CPU и память)',
  'queryResource.activeUsers': 'Активные пользователи',
  'queryResource.cpuLoad': 'CPU Загрузка',
  'queryResource.memoryUsage': 'Использование памяти',
  'queryResource.status': 'Статус',
  'queryResource.updated': 'Обновление',
  'queryResource.demo2Section': 'Stale-While-Revalidate и политики свежести',
  'queryResource.demo2SectionDesc':
    "<code>staleTime</code> контролирует, насколько долго кэшированные данные остаются свежими. Если наблюдатель запрашивает данные, когда они свежие, они мгновенно отображаются из памяти. Если устаревшие, кэшированные данные отображаются сразу, пока выполняется фоновая перезагрузка без очистки UI (обозначается <code>status: 'reloading'</code>).",
  'queryResource.focusRefetchNoteTitle': 'Обновление при возврате на вкладку (refetchOnFocus)',
  'queryResource.focusRefetchNoteBody':
    'По умолчанию refetchOnFocus отключен в ngx-lift для защиты корпоративных сервисов от резких всплесков трафика. Передайте { refetchOnFocus: true } в опциях запроса для автоматического обновления при возврате на вкладку.',
  'queryResource.configuredStaleTime': 'Настройка staleTime: {0} секунд',
  'queryResource.freshnessBadgeFresh': 'FRESH',
  'queryResource.freshnessBadgeStale': 'STALE',
  'queryResource.networkCalls': 'Сетевые звонки: {0}',
  'queryResource.triggerReadReload': 'Читать/ перезагрузить',
  'queryResource.revalidatingAlert': 'История, подтверждающая, что существует UI, остается интерактивной!',
  'queryResource.clusterNodes': 'Кластерные узлы',
  'queryResource.healthyNodes': '{0} / {1} Здоровый',
  'queryResource.region': 'Регион',
  'queryResource.snapshotTime': 'Время снимков',
  'queryResource.demo3Section': 'Скоординированное проведение опросов с повышением информированности общественности',
  'queryResource.demo3SectionDesc':
    'Настройте <code>pollInterval</code>, чтобы периодически обновлять активные запросы. Несколько наблюдателей с разными интервалами синхронизируются с максимальной скоростью. Периодический опрос автоматически приостанавливается, когда вкладка браузера скрыта, и возобновляется сразу, когда вкладка возвращается.',
  'queryResource.demo3PlaygroundTitle': 'Справочная информация',
  'queryResource.demo3PlaygroundDesc':
    'Включите опрос и смотрите пульс сердцебиения. Заметьте, что он останавливается, если вы переключаете вкладки!',
  'queryResource.badgePolling': 'Голосование',
  'queryResource.startPolling': 'Начать голосование (3-е)',
  'queryResource.stopPolling': 'Остановить голосование',
  'queryResource.totalPollCycles': 'Общие циклы голосования: {0}',
  'queryResource.ping': 'Пинг',
  'queryResource.lastPulse': 'Последний импульс',
  'queryResource.pollingIdleMsg': 'Щелчок "Start Polling" для наблюдения за скоординированными проверками фона.',
  'queryResource.demo4Section': 'Мутации и инвалидация по тегам (mutateResource)',
  'queryResource.demo4SectionDesc':
    '<code>mutateResource</code> обрабатывает асинхронные записи. После успешной мутации она отменяет совпадающие метки, в результате чего все активные запросы с этими метками автоматически передают последние данные сервера на фоне.',
  'queryResource.demo4PlaygroundTitle': 'Неверность на основе метки',
  'queryResource.demo4PlaygroundDesc': 'После завершения мутации usersQuery автоматически возвращается на задний план!',
  'queryResource.badgeMutations': 'Мутации',
  'queryResource.addTeamMember': 'Добавить члена группы',
  'queryResource.nameLabel': 'Имя',
  'queryResource.namePlaceholder': 'Например, Чарли Браун',
  'queryResource.roleLabel': 'Роль',
  'queryResource.rolePlatformEngineer': 'Инженер платформы',
  'queryResource.roleSre': 'Инженер по обеспечению надежности объекта',
  'queryResource.roleProductDesigner': 'Проектировщик продукта',
  'queryResource.addMemberBtn': 'Добавить член',
  'queryResource.savingBtn': 'Спасаю...',
  'queryResource.activeMembersTitle': 'Активные члены группы',
  'queryResource.thId': 'ID',
  'queryResource.thName': 'Имя',
  'queryResource.thRole': 'Роль',
  'queryResource.diagnosticsSection': 'Инспектор диагностики и кэша разработчиков',
  'queryResource.diagnosticsSectionDesc':
    'Зарегистрируйте provideQueryDevtools() один раз в app.config.ts для плавающей кнопки только в режиме разработки. Просматривайте запросы внизу, продолжая работать с приложением.',
  'queryResource.diagnosticsPlaygroundTitle': 'Панель запросов',
  'queryResource.diagnosticsPlaygroundDesc':
    'Ищите, фильтруйте и сортируйте запросы; изучайте данные, ошибки и таймеры. Повторная загрузка запускает выбранный загрузчик. Этот пример документации также включён в production.',
  'queryResource.badgeDiagnostics': 'Диагностика',
  'queryResource.refreshDiagnostics': 'Обновить диагноз',
  'queryResource.diagTotalEntries': 'Всего',
  'queryResource.diagActiveQueries': 'Активные запросы',
  'queryResource.diagInactiveQueries': 'Неактивный (GC ожидает)',
  'queryResource.diagPendingRequests': 'Незавершенные чтения',
  'queryResource.diagTotalObservers': 'Всего наблюдателей',
  'queryResource.diagVisibility': 'Видимость',
  'queryResource.diagVisible': 'Активные',
  'queryResource.diagHidden': 'Скрытые/неактивные',
  'queryResource.thQueryKey': 'Запрашиваемый ключ',
  'queryResource.thObservers': 'Наблюдатели',
  'queryResource.thRemainingGc': 'GC Отсчет',
  'queryResource.thRemainingPoll': 'Следующий опрос',
  'queryResource.noQueriesCached': 'В настоящее время в кэше нет записей запросов.',
  'queryResource.apiReference': 'API Ссылка',
  'mutateResource.title': 'mutateResource',
  'mutateResource.overview':
    '<code>mutateResource</code> синхронизирует асинхронные записи на сервере (POST, PUT, PATCH, DELETE) с автоматическим устареванием кэша на основе тегов, встроенным стратегиямConcurrency (exhaust, concat, parallel) и реактивным Angular Signals.',
  'mutateResource.featuresTitle': 'Ключевые возможности',
  'mutateResource.featuresIntro':
    'В отличие от запросов только для чтения, которые срабатывают в ответ на изменения параметров, мутации происходят строго при явном взаимодействии пользователей.',
  'mutateResource.cardTagInvalidationTitle': 'Автоматическое нарушение метки',
  'mutateResource.cardTagInvalidationDesc':
    'Неверные метки при успешном записи, чтобы автоматически освежить все активные наблюдатели queryResource по всей заявке без ручной перезагрузки водопровода.',
  'mutateResource.cardConcurrencyTitle': 'Конфигурируемая валюта',
  'mutateResource.cardConcurrencyDesc':
    'Управляйте одновременными отправками с помощью "exhaust" (игнорирует повторные нажатия или связывает их с текущим выполнением), "concat" (очередь FIFO) или "parallel" (по умолчанию).',
  'mutateResource.cardSignalsTitle': 'Реактивное государство Signals',
  'mutateResource.cardSignalsDesc':
    'Предоставляет реактивное значение, ошибку, состояние ("idle" | "loading" | "resolved" | "error") и сигналы isLoading, оптимизированные для OnPush детекции изменений.',
  'mutateResource.cardPromiseTitle': 'Прямое возвращение Promise',
  'mutateResource.cardPromiseDesc':
    'Звонок мутата () возвращает стандарт Promise, разрешая асинк/авеню и пробу/прилов синтаксиса в составных процессорах.',
  'mutateResource.demo1Section': '1. Неверность тага с активными запросами',
  'mutateResource.demo1SectionDesc':
    'Представление мутации отменяет совпадающие метки, немедленно инициируя обновление фона для любых активных случаев queryResource, наблюдающих эти метки.',
  'mutateResource.demo1PlaygroundTitle': 'Создать обновлённый пункт & Заметить запрос',
  'mutateResource.demo1PlaygroundDesc':
    'Заметьте, как таблица пользователя обновляется автоматически посредством метки недействительным без ручной перезагрузки звонков!',
  'mutateResource.badgeInvalidation': 'Неверность метки',
  'mutateResource.addTeamMember': 'Добавить члена группы',
  'mutateResource.nameLabel': 'Имя',
  'mutateResource.namePlaceholder': 'например, Дана Скалли',
  'mutateResource.roleLabel': 'Роль',
  'mutateResource.rolePlatformEngineer': 'Инженер платформы',
  'mutateResource.roleSre': 'Инженер по обеспечению надежности объекта',
  'mutateResource.roleProductDesigner': 'Проектировщик продукта',
  'mutateResource.addMemberBtn': 'Добавить член',
  'mutateResource.savingBtn': 'Спасаю...',
  'mutateResource.activeMembersTitle': 'Активные члены группы',
  'mutateResource.thId': 'ID',
  'mutateResource.thName': 'Имя',
  'mutateResource.thRole': 'Роль',
  'mutateResource.demo2Section': '3. Валютные режимы: выхлопные газы, конкат и параллельные',
  'mutateResource.demo2SectionDesc':
    'Тестирование, как разные стратегииConcurrency обрабатывают быстрые клики по кнопке. "exhaust" предотвращает случайные двойные отправки, отбрасывая или соединяя дублирующие клики, пока изменение не завершено.',
  'mutateResource.demo2PlaygroundTitle': 'Быстрый нажмите & конвалентный имитация',
  'mutateResource.demo2PlaygroundDesc':
    'Выберите режим, затем быстро нажмите "Trigger 800ms Mutation" несколько раз, чтобы увидеть, как применяются казни.',
  'mutateResource.badgeConcurrency': 'Валюта',
  'mutateResource.modeLabel': 'Валютная стратегия',
  'mutateResource.modeExhaust': 'Выхлопные газы (быстро повторяющиеся щелчки - двойная предохранитель)',
  'mutateResource.modeConcat': 'concat (последовательность ссылок на Quee)',
  'mutateResource.modeParallel': 'Параллельное (Оценить каждую ссылку отдельно)',
  'mutateResource.triggerMutationBtn': 'Переключение 800 мс',
  'mutateResource.totalClicks': 'Общее число щелчков: {0}',
  'mutateResource.actualExecutions': 'Фактические казни: {0}',
  'mutateResource.inFlight': 'В настоящее время рейс: {0}',
  'mutateResource.recentLogs': 'Журнал выполнения',
  'mutateResource.clearLogs': 'Очистить журнал',
  'mutateResource.noLogsYet': 'Никаких мутации пока не выполнено. Нажмите кнопку выше, чтобы начать.',
  'mutateResource.demo3Section': '2. Реактивное состояние Signals & Восстановление ошибок',
  'mutateResource.demo3SectionDesc':
    '<code>mutateResource</code> исправляет ошибки в чистом виде. Когда запись не работает, сигнал ошибки нагружается, статус становится "error", и возвращаемый Promise отказывается от обработки проб/прилова.',
  'mutateResource.demo3PlaygroundTitle': '& Выход из строя Signals',
  'mutateResource.demo3PlaygroundDesc':
    'Зафиксировать симуляцию неисправности и активировать действие, чтобы проверить состояние реактивной ошибки.',
  'mutateResource.badgeError': 'Обработка ошибок',
  'mutateResource.simulateErrorLabel': 'Имитировать ошибку 500 серверов',
  'mutateResource.saveSettingsBtn': 'Сохранить конфигурацию',
  'mutateResource.statusLabel': 'Статус',
  'mutateResource.isLoadingLabel': 'isLoading',
  'mutateResource.errorSuccessMsg': 'Конфигурация успешно сохранена!',
  'mutateResource.apiReference': 'API Ссылка',
  'injectParams.example1Title': 'Пример 1: получить все параметры маршрута',
  'injectParams.example1Desc':
    'Когда звонят без каких-либо аргументов, возвращают сигнал, содержащий весь объект парамов:',
  'injectParams.example2Title': 'Пример 2: Получение единого параметра',
  'injectParams.example2Desc': 'При указании ключа возвращает значение соответствующего параметра в качестве сигнала:',
  'injectParams.example3Title': 'Пример 3: Параметры преобразования',
  'injectParams.example3Desc': 'Преобразовать параметры с использованием функции преобразования:',
  'injectParams.example4Title': 'Пример 4: Преобразование с первоначальным значением',
  'injectParams.example4Desc': 'Преобразование параметров с первоначальным значением и преобразованием типа:',
  'injectParams.example4Callout':
    'Когда <code>initialValue</code> предоставляется в качестве булевого или числа, функция <code>transform</code> должна быть предусмотрена для возврата того же типа.',
  'injectParams.example5Title': 'Пример 5: Пример полного использования',
  'injectParams.example5Desc': 'Полный пример различных моделей использования:',
  'injectParams.example6Title': 'Пример 6: Обычный инжектор',
  'injectParams.example6Desc':
    'Передай заказ <code>Injector</code> через опционный объект для доступа к параметрам маршрута вне окружающего контекста впрыска (таким, как внутренние функции композитора или динамические услуги):',
  'injectParams.title': 'injectParams',
  'injectParams.overview':
    'Функция <code>injectParams</code> предоставляет реактивный сигнал для параметров маршрута, автоматически обновляется при навигации.',
  'injectParams.apiSummary': 'Инжектирует и преобразует параметры маршрута в реактивные сигналы.',
  'injectParams.paramKeyOrTransform':
    'При наличии строки возвращает значение этого параметра маршрута. При наличии функции она обрабатывает все параметры маршрута. Если опущено, возвращает все парамы.',
  'injectParams.paramOptions': 'Настройка объекта, содержащего функцию преобразования, initialValue и/или инжектор.',
  'injectParams.returnsDesc': 'Сигнал, содержащий значение(я) параметра(ов) маршрута или преобразуемый результат.',
  'injectParams.usagePatterns': 'Использование схем',
  'injectParams.pattern1': 'Нет аргументов: возвращает сигнал со всеми параметрами маршрута',
  'injectParams.pattern2': 'Строка: возвращает сигнал с конкретным значением параметра (или null, если он отсутствует)',
  'injectParams.pattern3': 'Преобразование функции: возвращающий сигнал с преобразованными параметрами',
  'injectParams.pattern4': 'С вариантами: позволяет преобразовывать первоначальное значение и тип',
  'injectQueryParams.title': 'injectQueryParams',
  'injectQueryParams.overview':
    'Функция <code>injectQueryParams</code> предоставляет реактивный сигнал для параметров URL-запроса.',
  'injectQueryParams.apiSummary': 'Инжектирует и преобразует параметры запроса URL в реактивные сигналы.',
  'injectQueryParams.paramKeyOrTransform':
    'При предоставлении строки возвращает значение этого параметра запроса. При предоставлении функции она обрабатывает все параметры запроса. Если опущено, возвращает все параметры запроса.',
  'injectQueryParams.paramOptions':
    'Настройка объекта, содержащего функцию преобразования, initialValue и/или инжектор.',
  'injectQueryParams.returnsDesc': 'Сигнал, содержащий значение(я) параметра запроса или преобразуемый результат.',
  'injectQueryParams.example1Title': 'Пример 1: Получить все параметры запроса',
  'injectQueryParams.example1Desc': 'Выбрать все параметры запроса как сигнал:',
  'injectQueryParams.example2Title': 'Пример 2: получить единый параметр запроса',
  'injectQueryParams.example2Desc': 'Выбрать конкретный параметр запроса по имени:',
  'injectQueryParams.example3Title': 'Пример 3: Параметры запроса трансформации',
  'injectQueryParams.example3Desc': 'Преобразовать параметры запроса с помощью функции преобразования:',
  'injectQueryParams.example4Title': 'Пример 4: Преобразование с первоначальным значением',
  'injectQueryParams.example4Desc':
    'Преобразовать параметры запроса с первоначальным значением и преобразованием типа:',
  'injectQueryParams.example5Title': 'Пример 5: Пример полного использования',
  'injectQueryParams.example5Desc': 'Полный пример различных моделей использования:',
  'injectQueryParams.example6Title': 'Пример 6: Обычный инжектор',
  'injectQueryParams.example6Desc':
    'Передай заказ <code>Injector</code> через опционный объект для доступа к параметрам запроса маршрута вне окружающего контекста впрыска (например, внутри композиторных функций или динамических услуг):',
  'createTrigger.title': 'createTrigger',
  'createTrigger.overview':
    'Функция <code>createTrigger</code> предоставляет способ вручную инициировать пересчет сигналов, ссылаясь на сигнал, который она создает. Подобно RxJS Subject, вызов <code>next()</code> увеличивает счетчик сигнала и уведомляет зависимости эффекты или вычисляемые сигналы.',
  'createTrigger.apiSummary':
    'Создает сигнал триггера, который можно использовать для вручную инициирования пересчета сигналов.',
  'createTrigger.propValue': 'Сигнал, который возвращает количество умноженных на спусковой крючок (начинается на 0).',
  'createTrigger.propNext': 'Метод активации обновления сигнала.',
  'createTrigger.returnsDesc': 'Объект, обнажающий сигнал ценности, и следующий () пусковой метод.',
  'createTrigger.example1': 'Пример 1: Базовое использование',
  'createTrigger.example1Desc':
    'Создать спусковой механизм и использовать его для ручной инициирования повторных компьютерных сигналов:',
  'createTrigger.example2': 'Пример 2: Условное воздействие',
  'createTrigger.example2Desc':
    'Для предотвращения прогона при инициализации использовать условное значение пускового сигнала:',
  'createTrigger.btnSeeConsole': 'Смотрите журнал Console',
  'createTrigger.callout':
    "Первоначально <code>createTrigger's value()</code> возвращает 0. Когда <code>next</code> прямо называется, значение добавляет 1.",
  'pageContainer.title': 'Стр. Контейнер',
  'pageContainer.overview':
    'Компонент <code>cll-page-container</code> предоставляет стандартизированный, респонсивный оболочку страницы для Clarity-приложений. Он включает унифицированный типографию заголовков, гибкую паддинг и постоянное пространство, а также предоставляет slot для проекции произвольных видов, карточек, форм и сеток.',
  'pageContainer.example1': 'Пример 1: Контейнер основной страницы',
  'pageContainer.example1Desc':
    'Введите обязательные заголовки и элементы произвольного просмотра проекта в основной срез страницы.',
  'pageContainer.example1Badge': 'Строка',
  'pageContainer.example2': 'Пример 2: Обычные пробеги и максимальные расстояния',
  'pageContainer.example2Desc':
    'Сдавать Clarity дизайн или специальные классы полезности customClass для контроля плотности компоновки.',
  'pageContainer.example2Badge': 'Ответные',
  'pageContainer.example3': 'Пример 3: Динамическая разметка HTML в названии страницы',
  'pageContainer.example3Desc':
    'Ввод заголовков производится через innerHTML, разрешая значки, индикаторы состояния или метки непосредственно в заголовке.',
  'pageContainer.example3Badge': 'HTML Название',
  'pageContainer.demoUserManagement': 'Управление пользователями',
  'pageContainer.demoBodyContent': 'Нажмите на содержимое тела, переведенное внутри фильтра по умолчанию.',
  'pageContainer.demoClusterSettings': 'Параметры кластера',
  'pageContainer.demoConfigured': 'Настроиться с классом стилизации.',
  'pageContainer.demoAuditLog': "Ревизионный журнал <span class='badge badge-info'>Live</span>",
  'pageContainer.demoLogStream': 'Вход записей в реальном времени.',
  'pageContainer.apiSummary':
    'Стандартизированный оболочек страницы с респонсивными отступами и типографией заголовка.',
  'pageContainer.inputTitle': 'Заголовок, показываемый в верхней части контейнера.innerHTML].',
  'pageContainer.inputCustomClass':
    'Дополнительные классы CSS применяются непосредственно к корневому элементу контейнера.',
  'pageContainer.contentProjectionDesc':
    'Заголовок <ng-content /> для того, чтобы поместить все основные страницы под заголовком.',
  'alert.title': 'Тревога',
  'alert.overview':
    'Оповещения — это баннеры, которые привлекают внимание пользователя к важным сообщениям. Визуальные элементы, такие как иконки и цвета, указывают на тип и срочность информации, передаваемой. Используйте оповещения для предоставления критической информации, требующей немедленного внимания пользователя в текущем контексте.',
  'alert.example1': 'Пример 1: Показать ответ на ошибку API',
  'alert.example1Desc':
    'При отображении ответов на ошибку с APIs, используйте входные данные ошибки для передачи данных об ошибке. Напоминание отображает сообщение об ошибке от объекта ответа или возвращается на HttpErrorResponse.',
  'alert.example1Badge': 'Ошибка API',
  'alert.example2': 'Пример 2: Показать конкретное содержание',
  'alert.example2Desc':
    'Содержимое транслируется с помощью innerHTML, что позволяет иметь богатую форматировку и встроенные метки HTML по различным уровням оповещения.',
  'alert.example2Badge': 'Богатый текст',
  'alert.example3': 'Пример 3: Прогноз содержания',
  'alert.example3Desc':
    'Компонент оповещения поддерживает проекцию контента с помощью нг-содержания, что позволяет включать сложные конструкции HTML и детские компоненты.',
  'alert.example3Badge': 'Н-содержание',
  'alert.example4': 'Пример 4: Компактная калибровка (isSmall)',
  'alert.example4Desc':
    'Используйте isSmall для отображения пространственно-эффективного компактного оповещения для ящиков и малых контейнеров.',
  'alert.example4Badge': 'Соглашение',
  'alert.example5': 'Пример 5: Оповещение о легком весе',
  'alert.example5Desc': 'Используйте безграничные лёгкие сигналы тревоги внутри карт, столов и гнезденых схем статуса.',
  'alert.example5Badge': 'Легкий вес',
  'alert.example6': 'Пример 6: Оповещение об уровне',
  'alert.example6Desc': 'Поместить высокоприоритетные предупреждения на самом верху всего контента и навигации.',
  'alert.example6Badge': 'Уровень',
  'alert.apiSummary': 'Компонент оповещений, отображающий важные сообщения с различными типами и стилями темы Clarity.',
  'alert.inputAlertType': 'Одно из значений: "info", "warning", "success", "danger", "neutral", "loading", "unknown".',
  'alert.inputIsAppLevel': 'Булевой флаг для оповещения об уровне приложения выставлен на вершине портала просмотра.',
  'alert.inputIsSmall': 'Булевой флаг для компактной калибровки в плотных контейнерах или ящиках.',
  'alert.inputIsLightweight': 'Булевой флаг за легкую стилизацию без границ.',
  'alert.inputError': 'HttpErrorResponse или объект ошибки для отображения деталей ошибки.',
  'alert.inputContent': 'Строка, содержащая содержание уведомления. Поддерживает HTML теги через innerHTML.',
  'alert.contentProjectionDesc':
    'Компонент поддерживает прогноз нг-содержания для сложных конструкций HTML и компонентов Angular.',
  'alert.projectionNotice': 'Множественные ошибки перечислены ниже в разбивке по содержанию прогноза:',
  'alert.errUndefined': 'Невозможно прочитать неопределённо.',
  'alert.errObject': 'Невозможно загрузить объект.',
  'alert.serverDown': 'Сервер выключен',
  'alert.contentSuccess': 'Я успешный контент.',
  'alert.contentInfo': 'Я содержание информации.',
  'alert.contentWarning': 'Я предупредительный контент.',
  'alert.contentDanger': 'Я опасный человек.',
  'alert.contentHtml': '<strong>Hello world</strong>, я люблю clr-lift!',
  'alert.contentSmall': 'Я маленькая тревога.',
  'alert.contentNeutral': 'Я нейтральный контент',
  'alert.contentLoading': 'Я загружен.',
  'alert.contentUnknown': 'Я неизвестный контент.',
  'alert.contentAppLevel': 'Оповещение об уровне приложения из вводимого контента',
  'alert.contentAppProjection': 'Оповещение об уровне приложения из проекции',
  'alert.btnView': 'Вид',
  'callout.title': 'Звонок',
  'callout.overview':
    'Компонент <code>cll-callout</code> отображает информационный блок, предназначенный для подчеркивания важных заметок, советов, предупреждений или инструкций по предварительным условиям с откликами на мобильные устройства и осознанием темы.',
  'callout.example1': 'Пример 1: базовый информационный звонок',
  'callout.example1Desc':
    'Простые текстовые сообщения или основные моменты проекта с использованием проекции контента по умолчанию.',
  'callout.example2': 'Пример 2: Перечни и ссылки',
  'callout.example2Desc':
    'Звонки обеспечивают бесперебойное оформление списков и внешних гиперссылок как в светлом, так и в темном режиме.',
  'callout.example3': 'Пример 3: Богатое содержание заголовков и штампов',
  'callout.example3Desc':
    'Сформулировать заголовки, описательные пункты и значки Clarity в контейнере проекции вызова.',
  'callout.example1Note': 'Просьба иметь в виду, что все изменения конфигурации вступают в силу незамедлительно.',
  'callout.example2Theme': 'Поддерживает как светлую, так и темную тематику автоматически.',
  'callout.example2Docs': 'Для более подробной информации проверьте документацию о проектировании системы Clarity.',
  'callout.example3Tip': '&lt; &lt; Про Тип &gt; &gt; для производственных целей',
  'callout.example3DescText': 'Обеспечить четкую конфигурацию лимитов ресурсов до инициирования процесса внедрения.',
  'callout.example3LabelDeployment': 'Развертывание',
  'callout.example3LabelValidated': 'Подтвержденные',
  'themeToggle.title': 'Панель темы',
  'themeToggle.exercise':
    'Смените тему и перезагрузите: ThemeService сохраняет cds-theme в localStorage и применяет к body. Элементы управления используют один сервис. changeTheme сообщает о переключении компонента, а не о вызовах сервиса.',
  'themeToggle.overview':
    'Компонент <code>cll-theme-toggle</code> и <code>ThemeService</code> обеспечивают плавный переход между темами Clarity в темных и светлых режимах с реактивностью сигнала и сохранением в localStorage.',
  'themeToggle.callout':
    'Кнопка "Togggle" автоматически превращает значок луны в светлый режим и икону солнца в темный режим, включая локализованные подсказки инструментов и доступные объявления с надписью "aria".',
  'themeToggle.example1Badge': 'Интерактивная панель инструментов',
  'themeToggle.example1Desc':
    'Нажмите на кнопку &quot; Тогглл &quot; для переключения тем и наблюдения за реакционными выбросами:',
  'themeToggle.currentTheme': 'Текущая тема Signal:',
  'themeToggle.inspectorTitle': 'Тема Signal Инспектор',
  'themeToggle.inspectorDesc': 'Прямое состояние синхронизировано с документом. Тело и localStorage',
  'themeToggle.example2Badge': 'Программный контроль',
  'themeToggle.example2Desc':
    'Используйте ThemeService, чтобы прочитать текущую тему реактивно или программно установить конкретную тему:',
  'themeToggle.setLight': 'Указать тему света',
  'themeToggle.setDark': 'Настроить темную тему',
  'themeToggle.example3': 'Пример 3: CSS / SCSS Выборы темы',
  'themeToggle.example3Desc':
    'Компоненты и глобальные стили могут нацеливаться [кдс-тема="тема"] на тело или через: "призрак-контекст" ([кд-тема="тема"]):',
  'themeToggle.serviceSummary':
    'Инъецируемая услуга, предоставляемая в корне для управления тематическим состоянием приложения.',
  'spinner.title': 'Спиннер',
  'spinner.overview':
    'Крутилка — это визуальный индикатор процесса, инициированного пользователем. Clarity имеет два типа крутилок, каждая из которых предназначена для определенного случая: <strong>Крутилки страницы</strong> для отслеживания прогресса операции, связанной с целой страницой, и <strong>Крутилки встроенные</strong> для отслеживания прогресса операции, связанной с конкретным компонентом.',
  'spinner.example1': 'Пример 1: По умолчанию',
  'spinner.example1Desc': 'По умолчанию спиннер центрирован, велик и имеет блок-показ.',
  'spinner.example2': 'Пример 2: Изменения размеров',
  'spinner.example2Desc': 'На дисплее можно показывать различные размеры: большие (по умолчанию), средние и малые.',
  'spinner.example3': 'Пример 3: Варианты согласования',
  'spinner.example3Desc': 'Контролировать регулировку спиннера с помощью ввода в центр.',
  'spinner.example4': 'Пример 4: Обычный стиль',
  'spinner.example4Desc': 'Примените к спиннеру специальные классы CSS для дополнительного стилинга.',
  'spinner.example5': 'Пример 5: Встроенный винт',
  'spinner.example5Desc':
    'Используйте встроенный ввод для отображения встроенного винта в качестве элемента встроенного блока, полезного для согласования вращенцев в рамках текста или других встроенных элементов.',
  'spinner.large': 'Большой (по умолчанию):',
  'spinner.medium': 'Средний:',
  'spinner.small': 'Небольшие:',
  'spinner.centered': 'Центрировано (по умолчанию):',
  'spinner.leftAligned': 'Левоприсоединяющиеся:',
  'spinner.loading': 'Загрузка...',
  'tooltip.title': 'Подсказка',
  'tooltip.overview':
    'Компонент подсказки предоставляет гибкий способ отображения дополнительной информации, советов или интерактивного содержания. Он поддерживает действия мыши и копирования внутри попапа, настраиваемые задержки, автоматическое расположение, захват фокуса для доступности, взаимодействие за пределами клика, операции клавиатуры и поддержку темного режима.',
  'tooltip.example1': 'Пример 1: Основные подсказки',
  'tooltip.example1Desc':
    'В этом использовании вы можете просто добавить подсказку, указывая содержание напрямую или через директиву cllTooltipContent. Дополнительные конфигурации, такие, как запаздывание сокрытия и ширина, могут быть адаптированы по вашим требованиям.',
  'tooltip.example2': 'Пример 2: Набор инструментов с динамическим содержанием',
  'tooltip.example2Desc':
    'Набор инструментов принимает динамическое содержание, предоставляемое в шаблонах Angular. Вы можете указать шаблоны с помощью нг-темплата и привязать их к компоненту инструментов для динамического отображения.',
  'tooltip.example3': 'Пример 3: Динамическое создание компонентов',
  'tooltip.example3Desc':
    'Подсказка может передавать динамическо созданные компоненты Angular с использованием ComponentRef или типа компонента.',
  'tooltip.example4': 'Пример 4: Положение наконечника',
  'tooltip.example4Desc': 'Поддерживает 12 различных направлений размещения с разумным обнаружением столкновения.',
  'tooltip.apiSummary':
    'Директивы для добавления функциональности подсказки к элементам с автоматическим расположением и детекцией столкновения.',
  'tooltip.basic1': 'Основные положения 1',
  'tooltip.basic2': 'Основной набор 2 с задержкой в 500 мс',
  'tooltip.empty': 'Пустой контент не покажет подсказку',
  'tooltip.templateHover': 'TemplateRef Пример Hover',
  'tooltip.templateText': 'Отличная подсказка:',
  'tooltip.templateCallout': 'Вы также можете поместить компонент внутри нг-темплата',
  'tooltip.contextCallout':
    'cllTooltipContentContext является факультативным, это контекст передается на нг-темплат во время создания просмотра.',
  'tooltip.componentRefHover': 'Пример компонента',
  'toast.title': 'Тост',
  'toast.overview':
    'Сообщения о тосте служат удобным способом для передачи событий средней приоритетности, которые пользователи могут захотеть ссылаться на позже. Эти сообщения временно отображаются на экране и могут быть сохранены в панель уведомлений, пока не будут закрыты или истекут.',
  'toast.example1': 'Пример 1: Тостный контейнер',
  'toast.example1Desc':
    'Чтобы реализовать сообщения toast, импортируйте ToastContainerComponent из clr-lift и включите <cll-toast-container [timeoutSeconds]="8" /> в вашу корневую компоненту.',
  'toast.example2': 'Пример 2: Создать тост с addToast',
  'toast.example2Desc':
    'Использовать addToast для передачи тоста с требуемыми свойствами (название и описание) и факультативными конфигурациями.',
  'toast.example3': 'Пример 3: Короткий APIs',
  'toast.example3Desc': 'Для создания тостов с различными типами статуса предусмотрены четыре коротких APIs:',
  'toast.serviceSummary': 'Услуги по подготовке и обработке уведомлений о тостах.',
  'toast.guidelinesTitle': 'Руководящие принципы использования',
  'toast.doTitle': 'Сделайте:',
  'toast.do1':
    'Обеспечение навигации: включить ссылку или местоположение, на которое пользователи могут ориентироваться с тоста.',
  'toast.do2':
    'Использовать относительные временные отметки: Показать временные отметки по отношению к пользователю (например, "1 час назад" вместо абсолютной даты).',
  'toast.do3':
    'Сохранить заголовки Коротко: используйте короткое сжатое название (макс. 35 знаков), которое быстро передает сообщение высокого уровня.',
  'toast.do4': 'Описание судна: Сохранять сжатые описания (максимум 156 знаков) для легкого употребления.',
  'toast.dontTitle': 'Нет:',
  'toast.dont1': 'Нажмите кнопку &quot; Закрыть &quot; как действие: нажатие на кнопку &quot; Закрыть &quot; .',
  'toast.dont2':
    'Перегруженные действия: ограничить число тостов максимум двумя действиями; определить приоритетность наиболее важных из них.',
  'toast.dont3':
    'Включить идентификаторы объекта в заголовок: избегать использования идентификаторов объекта в заголовке; использовать их только в описании.',
  'toast.dont4': 'Добавить значки: Чтобы сохранить ясность, не добавлять значки к тостам.',
  'toast.dont5':
    'Показать неотносимые тосты: Показать тосты только в том случае, если информация по-прежнему актуальна для пользователя.',
  'toast.optionsTitle': 'Интерфэйс ToastOptions',
  'toast.containerSummary':
    'Контейнерный компонент, который содержит все уведомления о тосте, должен появиться только один раз в вашем заявлении.',
  'multiAlerts.title': 'Оповещения (множественные)',
  'multiAlerts.overview':
    'Часто возникает необходимость отображения нескольких оповещений, особенно тех, которые находятся на уровне приложения и расположены в верхней части. Библиотека clr-lift предоставляет два основных инструмента: <code>AlertContainerComponent</code> и <code>AlertService</code>, чтобы добавлять, удалять и управлять оповещениями программно.',
  'multiAlerts.example1': 'Пример 1: Контейнер оповещения',
  'multiAlerts.example1Desc':
    'Импортировать AlertContainerComponent и включить <cll-alert-container /> над заголовком Clarity в главный контейнер.',
  'multiAlerts.example2': 'Пример 2: Базовое использование',
  'multiAlerts.example2Desc':
    'Импорт AlertService и использование его методов addAlert(), deleteAlert() или clearAlerts() для эффективного управления предупреждениями.',
  'multiAlerts.example3': 'Пример 3: Усовершенствованное использование с интерактивными элементами',
  'multiAlerts.example3Desc':
    'Поместите интерактивные элементы (такие, как кнопки или ссылки) в любом месте в вашем сообщении с использованием контента targetSelector или предоставьте структурированные кнопки действия.',
  'multiAlerts.example4': 'Пример 4: Интерактивная демоция',
  'multiAlerts.example4Desc':
    'Попробуйте добавить различные типы предупреждений и очистить сигналы с помощью следующих кнопок:',
  'multiAlerts.serviceSummary': 'Программно-программное обеспечение работы с несколькими предупреждениями.',
  'multiAlerts.alertTypeTitle': 'Тип оповещения',
  'multiAlerts.containerSummary':
    'Контейнерный компонент, который отображает все сигналы тревоги, должен быть расположен над заголовком Clarity в главном контейнере.',
  'fileReader.title': 'Читатель файла',
  'fileReader.firstTask':
    'Выберите текстовый файл, затем очистите форму. Выбор обязателен; ограничения и ошибки сертификатов показаны в следующем примере.',
  'fileReader.overview':
    'Компонент <code>FileReaderComponent</code> позволяет легко просматривать и читать содержимое текстовых файлов. Он поддерживает выбор файлов, чтение содержимого как plain text или base64-кодированной строки, проверку размера файла и отправку событий при выборе или удалении файлов.',
  'fileReader.example1': 'Пример 1: Читатель основного файла',
  'fileReader.example1Desc': 'Базовое использование с встроенной системой управления формой:',
  'fileReader.example2': 'Пример 2: Чтение файла сертификата с проверкой',
  'fileReader.example2Desc':
    'Читатель файла с подтверждением подлинности сертификата и отображением знака свидетельства:',
  'fileReader.apiSummary': 'Компонент для просмотра и чтения содержимого файлов с поддержкой валидации.',
  'fileReader.feature1': 'Просмотр и отбор файлов',
  'fileReader.feature2': 'Чтение содержания в виде простого текста или базовой 64 закодированной строки',
  'fileReader.feature3': 'Подтверждение размера файла',
  'fileReader.feature4': 'Обработка погрешностей содержания',
  'fileReader.feature5': 'Интеграция в систему контроля формы',
  'keyValueInputs.title': 'Ключевое значение',
  'keyValueInputs.overview':
    'Компонент <code>KeyValueInputsComponent</code> — это Angular-компонент, предназначенный для ввода пар ключ-значение. Он предоставляет динамическую форму, позволяющую пользователям добавлять, редактировать и удалять пары ключ-значение с интеграцией FormArray, реальном проверке и умном навигации клавиатуры.',
  'keyValueInputs.example1': 'Пример 1: Базовое использование',
  'keyValueInputs.example1Desc':
    'Создать форму с FormArray и использовать KeyValueInputsComponent для управления парами ключевых значений:',
  'keyValueInputs.example2': 'Пример 2: Интерактивная демография',
  'keyValueInputs.example2Desc':
    'Попробуйте добавить, редактировать и удалить пары ключевых значений в следующей форме:',
  'keyValueInputs.callout':
    'Изучайте, как KeyValueInputsComponent использует UniqueValidator для подтверждения достоверности от ключевых контрольных механизмов. Нажмите здесь, чтобы узнать, как уникальность обеспечивается в ключевых входных полях.',
  'keyValueInputs.formOutput': 'Выпуск в вашей форме:',
  'keyValueInputs.keyHelper': 'Ключ к имуществу в период эксплуатации',
  'keyValueInputs.valueHelper': 'Стоимость имущества',
  'keyValueInputs.addText': 'добавить ключевую ценность',
  'keyValueInputs.apiSummary': 'Компонент для управления динамическими парами ключ-значение в Angular-формах.',
  'statusIndicator.title': 'Показатель состояния',
  'statusIndicator.overview':
    'Компонент <code>StatusIndicatorComponent</code> отображает индикатор состояния с иконкой и текстом. Он поддерживает различные типы состояний (ошибка, успех, предупреждение, неизвестно, неактивно, в ожидании), настраиваемые размеры иконок и опциональные подсказки для дополнительного контекста.',
  'statusIndicator.example1': 'Пример 1: Базовое использование',
  'statusIndicator.example1Desc': 'Показывать показатели состояния с различными типами статуса и размерами значков:',
  'statusIndicator.example2': 'Пример 2: С подсказкой',
  'statusIndicator.example2Desc':
    'Добавить подсказки к показателям состояния для дополнительной контекстуальной информации:',
  'statusIndicator.types': 'Типы статуса',
  'statusIndicator.iconSizeTshirt': 'Размер икона (фигурная калибровка)',
  'statusIndicator.iconSizeNumber': 'Размер значков (число)',
  'statusIndicator.statusError': 'Ошибка',
  'statusIndicator.statusSuccess': 'Успех',
  'statusIndicator.statusWarning': 'Внимание',
  'statusIndicator.statusUnknown': 'Неизвестно',
  'statusIndicator.statusInactive': 'Неактивные',
  'statusIndicator.statusPending': 'Ожидается',
  'statusIndicator.tooltipError': 'описать причину ошибки',
  'statusIndicator.tooltipSuccess': 'status - это успех',
  'statusIndicator.tooltipWarning': 'статус - предупреждение',
  'statusIndicator.tooltipUnknown': 'неизвестное состояние',
  'statusIndicator.tooltipInactive': 'неактивный статус',
  'statusIndicator.tooltipPending': 'некоторые из них не были выполнены',
  'statusIndicator.apiSummary': 'Компонент для отображения индикаторов состояния с иконками и текстом.',
  'certificate.title': 'Сигнал свидетельства (Viewer)',
  'certificate.overview':
    'Компонент <code>CertificateSignpostComponent</code>, являющийся Angular-компонентом, интерпретирует строку PEM, отображая содержимое сертификата с нажатием на иконку сертификата. Интегрировано с Clarity, этот компонент отображает важные детали, такие как статус сертификата, срок действия, информацию о выдаче и значения хэшей.',
  'certificate.example1': 'Пример 1: Обработка необработанных PEM',
  'certificate.example1Desc': 'Обработать и показать неочищенную строку сертификата PEM:',
  'certificate.example2': 'Пример 2: Партия PEM (Баз64 Закодировано)',
  'certificate.example2Desc':
    'Когда строки PEM закодированы в базе64, тоггл pemEncoded для расшифровки перед расшифровкой:',
  'idleDetection.utilOverview':
    'Обнаружение бездействия — это процесс мониторинга активности пользователя и определения, когда пользователь становится неактивным. Это особенно полезно для приложений, требующих, чтобы пользователи оставались авторизованными, так как позволяет системе принять соответствующие действия при прекращении взаимодействия с приложением, например, предупредить пользователя о приближающемся таймауте или автоматически выйти из системы после длительного периода бездействия.',
  'idleDetection.utilOverviewDesc':
    'Служба обнаружения "Idle" обеспечивает функциональную холостую и временную продолжительность, автоматическую перезагрузку деятельности пользователя, выбросы в результате событий на фазах холостого хода и времени, а также поддержку реактивного программирования через RxJS, наблюдаемые.',
  'idleDetection.utilExample1Title': 'Пример 1: Настроить обнаружение холостого хода на глобальном уровне',
  'idleDetection.utilExample1Desc':
    'Настроить продолжительность холостого хода и времени выхода во всем мире с использованием класса конфигурации:',
  'idleDetection.utilPhaseCallout':
    'Существует два этапа обнаружения холостого хода: фаза обнаружения <strong>idle </strong> и фаза <strong>timeout </strong>.',
  'idleDetection.utilPhase1':
    '<strong>Фаза обнаружения бездействия</strong>: Предположим, вы настроили <code>idleDurationInSeconds</code> на 5 * 60 (5 минут). С момента, когда на сайте не происходит никаких действий, вы вступаете в эту фазу. Через 5 минут фаза обнаружения бездействия завершается, что означает, что вы были бездействие длительное время. Вы можете подписаться на <code>onIdleEnd()</code> observable, который будет излучать в этот момент. После завершения этой фазы вы войдете во вторую фазу.',
  'idleDetection.utilPhase2':
    '<strong>Фаза таймаута</strong>: При входе в эту фазу начинается отсчет сразу с значения <code>timeoutDurationInSeconds</code>. Вы можете подписаться на <code>onCountDown()</code> observable, чтобы получить значение отсчета. Когда отсчет достигнет 0, фаза таймаута завершится. Вы можете подписаться на <code>onTimeoutEnd()</code> observable, чтобы узнать, когда фаза таймаута завершится. В этот момент вы можете выйти из системы или выполнить другие действия.',
  'idleDetection.utilExample2Title': 'Пример 2: Конфигурация модуля',
  'idleDetection.utilExample2Desc': 'Представьте конфигурацию NgModule:',
  'idleDetection.utilExample3Title': 'Пример 3: Конфигурация отдельного приложения',
  'idleDetection.utilExample3Desc': 'Представить конфигурацию отдельного приложения:',
  'idleDetection.utilExample4Title': 'Пример 4: Использование IdleDetectionService в компоненте',
  'idleDetection.utilExample4Desc': 'Подписывайте на наблюдения сервиса, чтобы реагировать на праздные события:',
  'idleDetection.utilExample5Title': 'Пример 5: Использовать IdleDetectionComponent',
  'idleDetection.utilExample5Desc':
    'Мы предоставляем компонент в <code>clr-lift</code>, который отображает Clarity модальное окно, когда пользователь бездействует. Диалог будет появляться, когда фаза обнаружения бездействия завершится и начнет отсчет. После завершения отсчета вы можете использовать <code>timeout</code> обработчик в вашем компоненте, чтобы выполнить пользовательскую логику, например, очистить localStorage токен и перенаправить пользователя на страницу входа.',
  'idleDetection.utilExample5ParamDesc':
    'Параметры <code>idleDurationInSeconds</code> и <code>timeoutDurationInSeconds</code> факультативно. Когда эти параметры будут переданы, они перезапишут конфигурацию, <code>provideIdleDetectionConfig</code>.',
  'idleDetection.utilDialogPreview': 'Диалог выглядит следующим образом:',
  'idleDetection.title': 'Обнаружение холостого хода',
  'idleDetection.exercise':
    'Запустите и не трогайте страницу 3 секунды. Предупреждение отсчитывает 10 секунд. Активность не закрывает открытое предупреждение; подтвердите явно. Остановка освобождает таймеры.',
  'idleDetection.overview':
    'Компонент <code>cll-idle-detection</code> мониторит бездействие пользователя в событиях DOM (движение мыши, клавиши, прокрутка, касание). Когда время бездействия истекает, он открывает доступный Clarity диалог отсчета и излучает событие (таймаут).',
  'idleDetection.example1': 'Пример 1: Интерактивный диалоговый имитацион',
  'idleDetection.example1Desc': 'Начать 3-секундное моделирование для просмотра режима отсчёта Clarity в действии:',
  'idleDetection.example2': 'Пример 2: Глобальная конфигурация с provideIdleDetectionConfig',
  'idleDetection.example2Desc':
    'Определить промежутки времени и холостого хода в appConfig с использованием provideIdleDetectionConfig.',
  'idleDetection.apiSummary': 'Clarity модальное окно, отображающее отсчет таймаута на бездействие.',
  'idleDetection.inputIdleDuration': 'Продолжительность бездействия за секунды до отображения режима отсчета.',
  'idleDetection.callout':
    'Запустите и не трогайте страницу 3 секунды. Предупреждение отсчитывает 10 секунд. Активность не закрывает открытое предупреждение; подтвердите явно. Остановка освобождает таймеры.',
  'idleDetection.inputTimeoutDuration': 'Продолжительность этапа отсчёта за секунды до начала сессии.',
  'idleDetection.outputTimeout': 'Эмиты пусты, когда обратный отсчет достигает 0 без распознавания пользователя.',
  'idleDetection.serviceSummary':
    'Услуги по контролю за деятельностью пользователей и выявлению периодов холостого хода.',
  'idleDetection.methodSetConfig':
    'Устанавливает конфигурацию для обнаружения холостого хода. Перезаписать глобальную конфигурацию, если она представлена.',
  'idleDetection.methodStartWatching':
    'Начать мониторинг деятельности пользователей для обнаружения в режиме холостого хода.',
  'idleDetection.methodClearTimers': 'Очистить все активные таймеры и прекратить наблюдение.',
  'idleDetection.methodOnIdleEnd':
    'Observable, который излучает, когда фаза холостого хода заканчивается и начинается отсчет.',
  'idleDetection.methodOnTimeoutEnd': 'Observable, который излучает, когда отсчет времени заканчивается.',
  'idleDetection.methodOnCountDown': 'Observable, который излучает оставшиеся секунды на фазе отсчёта.',
  'datagridUtil.title': 'Коммунальные услуги',
  'datagridUtil.overview':
    'Clarity datagrid излучает состояние при взаимодействии пользователя с пагинацией, фильтрами или сортировкой. Для обеспечения плавного интегрирования с API запросами, convertToHttpParams преобразует состояние datagrid в объект запроса, готовый для HttpParams.',
  'datagridUtil.example1': 'Пример 1: Использование convertToHttpParams',
  'datagridUtil.example1Desc':
    'Функция convertToHttpParams преобразует состояние Clarity Datagrid в объект PageQuery, пригодный для HttpParams.',
  'datagridUtil.apiSummary':
    'Преобразует состояние Clarity Datagrid в объект PageQuery, подходящий для HttpParams в API запросах.',
  'datagridUtil.paramState':
    'Объект состояния Clarity Datagrid, содержащий информацию о pagination, сортировке и фильтре. Может быть нулевым для начальной нагрузки.',
  'datagridUtil.returnsDesc':
    'Объект PageQuery содержит страницу, pageSize, сортирует направление и фильтрует строки в формате FIQL.',
  'datagridUtil.propPage': '1-й номер страницы для пагинации.',
  'datagridUtil.propPageSize': 'Количество позиций, подлежащих вывешиванию на страницу.',
  'datagridUtil.propSortAsc': 'Имя поля для сортировки в восходящем порядке.',
  'datagridUtil.propSortDesc': 'Имя поля для сортировки в нисходящем порядке.',
  'datagridUtil.propFilter': 'Выражение фильтра в формате FIQL.',
  'dgState.overview':
    'Оператор <code>dgState</code> — это RxJS оператор, предназначенный для управления преобразованием состояния Clarity Datagrid с умным дебьюнингом и фильтрацией дубликатов. Он оценивает изменения в фильтрах datagrid и эффективно управляет событиями запуска API. При изменении фильтров, оператор вводит задержку 500 мс перед запуском API-запроса, предотвращая избыточные запросы при быстром вводе. Для действий, таких как сортировка или пагинация, API-запрос выполняется сразу без задержки. Оператор также предоставляет опциональный параметр для контроля использования <code>distinctUntilChanged</code>. При включении (по умолчанию: <code>true</code>), он гарантирует, что API-запрос не будет запущен, если состояние datagrid останется тем же, предотвращая избыточные запросы.',
  'dgState.example1Title': 'Пример 1: Базовое использование',
  'dgState.example1Desc':
    'Используйте <code>dgState</code> в вашем наблюдаемом трубопроводе для эффективного регулирования изменений состояния данных:',
  'dgState.example1DataDesc':
    'Предположим, что у нас есть API, возвращающий следующую форму данных для серверного набора данных:',
  'dgState.example2Title': 'Пример 2: Внедрение шаблона с обеспечением безопасности типа',
  'dgState.example2Desc': 'Использовать асинковую трубу с <code>@if</code> для повышения безопасности типа:',
  'dgState.example3Title': 'Пример 3: Внедрение альтернативной типовой модели',
  'dgState.example3Desc': 'Используйте асинковую трубу непосредственно в вашем шаблоне:',
  'dgState.example4Title': 'Пример 4: Пример жизни',
  'dgState.example4Desc':
    'Ниже приводится рабочий пример приложения данных на сервере с использованием оператора <code>dgState</code>:',
  'dgState.calloutPrefix': 'Можешь использовать ',
  'dgState.calloutSuffix':
    ' полезная функция для преобразования состояния данных в параметры HTTP. Более подробную информацию см. в документации.',
  'dgState.apiDesc':
    'RxJS оператор для обработки Clarity Datagrid изменений состояния с разоблачением и факультативным поведением distinctUntilChanged.',
  'dgState.paramDesc':
    '<em> (факультативное) </em> Если можно фильтровать distinctUntilChanged. По умолчанию <code>true</code>. Когда <code>true</code>, подавляет дублирующие состояния. Когда <code>false</code>, позволяет API вызывать даже идентичные состояния.',
  'dgState.returnsDesc': 'Функция оператора, преобразующая уровень выбросов в режиме Datagrid.',
  'dgState.behavior1':
    'Добавляет 500 мс дебунса при смене фильтров (чтобы избежать чрезмерных звонков API во время быстрого печатания)',
  'dgState.behavior2': 'Задаёт API звонки для сортировки или пагинации (отсутствует дебют)',
  'dgState.behavior3':
    'Факультативно отфильтровать дублирующие друг друга состояния, когда <code>enableDistinctUntilChanged</code> - <code>true</code>',
  'dgState.behavior4': 'Начинается с нулевого состояния для работы с первоначальными сценариями нагрузки',
  'timelineWizard.title': 'Волшебник времени',
  'timelineWizard.overview':
    'Компонент TimelineWizard позволяет строить таймлайн-ориентированные многошаговые вспомогательные средства в Angular-приложениях. Каждый шаг представлен отдельным компонентом, расширяющим TimelineBaseComponent, поддерживающим навигацию по шагам, асинхронную валидацию и динамическую отрисовку компонентов.',
  'timelineWizard.example1': 'Пример 1: Настройка основного волшебника',
  'timelineWizard.example1Desc':
    'В нижеследующем примере волшебник состоит из четырех отдельных этапов. В массиве timelineSteps определяется последовательность каждого шага. Три шага включают ввод формы, и последний этап резюмирует данные.',
  'timelineWizard.example2': 'Пример 2: Базовая ступеньная часть',
  'timelineWizard.example2Desc':
    'Каждый ступенчатый компонент расширяет TimelineBaseComponent, указывая соответствующий тип шага и инициализируя FormGroup.',
  'timelineWizard.example3': 'Пример 3: Картирование конкретных данных',
  'timelineWizard.example3Desc':
    'Когда ваша модель FormGroup отличается от структуры timelineSteps, отменяет formValueToData и dataToFormValue для двунаправленного картирования.',
  'timelineWizard.example4': 'Пример 4: Усовершенствованное картирование данных с вводом ключей-видов',
  'timelineWizard.example4Desc':
    'Вариант усовершенствованного использования, показывающий, что dataToFormValue и formValueToData интегрированы с KeyValueInputsComponent:',
  'timelineWizard.example4Callout':
    'Чтобы больше узнать о KeyValueInputsComponent, посетите страницу документации Key Value Income.',
  'timelineWizard.example5': 'Пример 5: Этап пересмотра с представлением API',
  'timelineWizard.example5Desc':
    'Объединить данные по предыдущим этапам с использованием TimelineWizardService и переключить следующий доллар для построения потока API.',
  'timelineWizard.example5Callout':
    'Вы можете настроить следующий доллар, наблюдаемый на любом этапе, что позволит как синхронным, так и асинхронным операциям, таким как HTTP запроса.',
  'timelineWizard.componentSummary': 'Главный компонент, ответственный за управление волшебством временны́х рамок.',
  'timelineWizard.baseSummary':
    'Базовый класс для всех ступеней в волшебстве времени. Он обеспечивает основные свойства и методы управления волшебными шагами.',
  'timelineWizard.stepSummary': 'Интерфейс, определяющий свойства шага в конфигурации волшебства времени.',
  'timelineWizard.serviceSummary':
    'Служба, которая управляет состоянием и данными волшебника времени по всем ступеням.',
  'timelineWizard.playgroundTitle': 'Волшебник Интерактивного развертывания',
  'timelineWizard.playgroundDesc':
    'Навигировать поэтапно с помощью конфигурации оператора, масштабирования сервиса, Свойства &quot; Runtime &quot; ( &quot; Редактор ключей &quot; ) и окончательного подтверждения.',
  'timelineWizard.playgroundBadge': 'Поток работы предприятия',
  'timelineWizard.requiredInfo': 'Требуемая информация',
  'timelineWizard.configureOperator': 'Оператор настройки',
  'timelineWizard.configureService': 'Настроить сервис',
  'timelineWizard.configureRuntimeProperties': 'Настройка Свойств времени запуска',
  'timelineWizard.name': 'Имя',
  'timelineWizard.namespace': 'Пространство имени',
  'timelineWizard.cpu': 'CPU',
  'timelineWizard.replicas': 'Реплика',
  'timelineWizard.url': 'URL',
  'poll.start': 'Запустить',
  'poll.stop': 'Остановить',
  'poll.overview':
    'Оператор <code>poll</code> — это пользовательский RxJS оператор, упрощающий процесс периодического запроса API для поддержания актуальности данных. Он позволяет разработчикам создавать наблюдаемые, которые периодически излучают данные на заданных интервалах, абстрагируя сложность управления интервалами запросов и API-запросами. Этот оператор особенно полезен, когда требуется реальное время обновления, но сервер не поддерживает уведомления (WebSockets, Server-Sent Events и т.д.). Он интегрируется плавно с другими RxJS операторами, позволяя разработчикам строить реактивные потоки для обработки потоков данных.',
  'poll.example1Title': 'Пример 1: Базовая перепись',
  'poll.example1Desc':
    'Данные опроса за определенный интервал времени. Функция голосования поддерживает Promise, Observable, или примитивные значения:',
  'poll.example2Title': 'Пример 2: Загрязнение до тех пор, пока не будет установлено условие',
  'poll.example2Desc':
    'Использовать операторов RxJS, таких как <code>takeWhile</code>, чтобы прекратить голосование при соблюдении условия:',
  'poll.example2Callout':
    'Вы можете добавить <code>takeUntil</code>, <code>takeWhile</code> или другие операторы RxJS для контроля по окончании голосования.',
  'poll.example3Title': 'Пример 3: Опрос с initialValue',
  'poll.example3Desc':
    "По умолчанию, начальный результат poll — <code>&#123;status: 'loading', isLoading: true, error: null, data: null&#125;</code>, что удобно для отображения индикатора загрузки. Однако в некоторых случаях вы можете не хотеть отображать индикатор загрузки. Вы можете установить <code>initialValue</code> на любое значение, которое вы хотите:",
  'poll.example4Title': 'Пример 4: Перенос результатов опроса',
  'poll.example4Desc':
    'По умолчанию голосование начинается немедленно. Используйте вариант <code>delay</code>, чтобы отложить начало голосования:',
  'poll.example4AltDesc':
    'В качестве альтернативы вы можете начать опрос после действия пользователя, объединив <code>poll</code> с другими операторами RxJS:',
  'poll.btnStartPolling': 'Начинайте голосование (см. Консоле)',
  'poll.example5Title': 'Пример 5: Обновить силу',
  'poll.example5Desc':
    'Используйте <code>forceRefresh</code> observable или сигнал, чтобы запускать <code>pollingFn</code> в необходимые моменты, например, в ответ на действия пользователя. Значение, излучаемое <code>forceRefresh</code>, будет передаваться как входной параметр <code>paramsBuilder</code> (если предоставлен), или напрямую в <code>pollingFn</code>.',
  'poll.example5SignalTitle': 'Удержание сил на базе Signal',
  'poll.example5SignalDesc':
    '<code>forceRefresh</code> непосредственно принимает Angular Signals. Если несколько обновлений происходят во время выполнения запроса, <code>exhaustMap</code> сбрасывает промежуточные спусковые импульсы, но сохраняет новый параметр для следующего запланированного клеща.',
  'poll.btnRapidFilters': 'Быстрое изменение фильтра (отверстие 3x)',
  'poll.example6Title': 'Пример 6: Усовершенствованный пример - Datagrid с зачисткой',
  'poll.example6Desc':
    'Данные будут автоматически обновляться каждые 10 секунд. Кроме того, в случае изменения входа, инициирования фильтрации, сортировки или pagination API будет незамедлительно вызываться, сопровождаемый спиннером, указывающим на загрузку.',
  'poll.searchByFirstName': 'Поиск по имени',
  'poll.apiDesc':
    'Проверяет данные через определенный интервал времени и может включаться вручную. Возвращает наблюдаемое, которое излучает результат как объект AsyncState.',
  'poll.paramPollingFn': 'Функция, которая возвращает Observable, Promise, или примитивное значение.',
  'poll.paramInterval': 'Интервал в миллисекундах между каждым опросом.',
  'poll.paramForceRefresh': 'Observable или Signal, которые запускают ручное обновление.',
  'poll.paramParamsBuilder':
    'Функция, которая устанавливает параметры для функции голосования на основе значения forceRefresh.',
  'poll.paramInitialValue': 'Начальное значение AsyncState.',
  'poll.paramDelay': 'Задержка в миллисекундах до начала первого опроса.',
  'poll.returnsDesc':
    'Видимо, что излучает объекты AsyncState<Data> со статусом, isLoading, погрешности и свойства данных.',
  'createAsyncState.overview':
    'Оператор <code>createAsyncState</code> преобразует наблюдаемое типа <code>T</code> в наблюдаемое типа <code>AsyncState&lt;T&gt;</code>, упаковывая состояния загрузки, ошибок и данных в стандартизированную структуру. Это устраняет необходимость в отдельных переменных для состояний загрузки, ошибок и данных, делая код более организованным и поддерживаемым.',
  'createAsyncState.interfaceStructure': 'Структура интерфейса <code>AsyncState</code>, которую оператор возвращает:',
  'createAsyncState.example1Title': 'Пример 1: Простой запрос',
  'createAsyncState.example1Desc': 'В одном запросе API с погрузкой и погрешностью говорится:',
  'createAsyncState.example2Title': 'Пример 2: С ответами на звонки',
  'createAsyncState.example2Desc': 'Добавить побочные эффекты для сценариев успеха и ошибок:',
  'createAsyncState.example3Title': 'Пример 3: Предоставление initialValue',
  'createAsyncState.example3Desc':
    'В сценариях, когда у вас есть первоначальные данные (например, от состояния маршрута), вы можете предоставить первоначальную величину, чтобы избежать показа спинера нагрузки. Это полезно при плавании от списка до подробной страницы, на которой вы уже имеете некоторые данные:',
  'createAsyncState.example3Callout':
    "При предоставлении <code>initialValue</code> установить <code>status: 'idle'</code> и <code>isLoading: false</code> для предотвращения появления вибратора загрузки. Данные будут обновляться бесперебойно, когда вызов API будет завершен.",
  'createAsyncState.example4Title': 'Пример 4: Зависящие запросы',
  'createAsyncState.example4Desc': 'Несколько запросов с использованием <code>switchMap</code>:',
  'createAsyncState.example5Title': 'Пример 5: Использование шаблона',
  'createAsyncState.example5Desc': 'Используйте асинковую трубу в шаблонах для разных состояний:',
  'createAsyncState.apiSummary': 'Преобразует Observable типа T в Observable типа AsyncState<T, E>.',
  'createAsyncState.paramObserver':
    'Функция вызова или наблюдательный объект для обработки побочных эффектов, когда наблюдаемые значения или ошибки излучают.',
  'createAsyncState.paramInitialValue':
    'Первоначальное значение AsyncState должно использоваться до того, как наблюдаемое значение излучает его первое значение.',
  'createAsyncState.returnsDesc': 'Функция, которая преобразует наблюдаемый поток в асинхронное состояние.',
  'createAsyncState.stateStatus':
    'Гранularный отслеживание состояния: "idle" | "loading" | "reloading" | "resolved" | "error".',
  'createAsyncState.stateIsLoading':
    'Указывает, выполняется ли загрузка (true, когда status равен "loading" или "reloading").',
  'createAsyncState.stateError': 'Ошибка, если асинхронная операция не сработала, или нет.',
  'createAsyncState.stateData': 'Данные, излучаемые наблюдаемым или нулевым.',
  'resourceAsync.paramSourceFn': 'Реактивная функция, которая возвращает Observable, Promise, или синхронное значение.',
  'resourceAsync.paramOptions': 'Варианты конфигурации ресурсов.',
  'resourceAsync.propInitialValue': 'Начальное значение перед первой доставкой.',
  'resourceAsync.propLazy': 'Если true, начинается в состоянии "idle" и ждет вызова reload().',
  'resourceAsync.propBehavior':
    'Поведение при одновременных выполнениях: "switch" отменяет предыдущее выполнение; "exhaust" игнорирует новые. По умолчанию: "switch".',
  'resourceAsync.propOnError': 'Обратный звонок оператора ошибки, который может дать запасные значения.',
  'resourceAsync.propThrowOnError': 'Если это так, то ошибки забрасываются, а не хранятся в сигнале об ошибке.',
  'resourceAsync.propOnSuccess': 'В случае успешного завершения операции используется ссылка на звонок.',
  'resourceAsync.propOnLoading': 'Перезвони, когда начнутся операции.',
  'resourceAsync.returnsDesc':
    'Объект ResourceRef<T, E> с полями value, error, status, isLoading и методами изменения.',
  'spinner.apiSummary': 'Компонент для отображения индикаторов загрузки с настраиваемыми размерами и выравниванием.',
  'spinner.inputSize': 'Определяется размер шпиндера: "lg" (по умолчанию), "md" или "sm".',
  'spinner.inputCenter':
    'Центрирует индикатор загрузки как блочный элемент. Передайте false, чтобы отключить центрирование.',
  'spinner.inputInline': 'Указывает, должен ли шпиндер быть показан как элемент встроенного блока.',
  'spinner.inputCustomClass': 'Строка дополнительных классов CSS для приложения к шпиндеру.',
  'callout.apiSummary': 'Компонент с подсказкой, реализованный на основе системы Clarity Design System.',
  'callout.contentProjectionDesc':
    'Обеспечивает по умолчанию <ng-content /> Отрезок для оформления HTML содержание, текст, перечни и компоненты.',
  'callout.responsiveTitle': 'Ответное поведение',
  'callout.responsiveDesc':
    'Декоративный значок скрыт на экранах меньше 576px и автоматически отображается на более широких экранах.',
  'callout.themingTitle': 'Их зовут',
  'callout.themingDesc':
    "Наследует тематический контекст Clarity и уважает [cds-thema='tark'] для контрастного фона, границы и стиля связи.",
  'certificate.pemNote':
    'PEM означает Security Update Mail. Это формат файла, который часто используется для хранения криптографических ключей, сертификатов и других защищенных данных. Файлы PEM обычно имеют расширения как .pem, .crt, .cer, и .key.',
  'certificate.apiSummary': 'Компонент для отображения информации о сертификате в Clarity signpost.',
  'certificate.clickIcon': 'Нажмите значок сертификата ниже для просмотра деталей сертификата:',
  'certificate.clickCert': 'Нажмите на значок сертификата:',
  'certificate.inputPem': 'Сертификатная строка PEM должна быть инспектирована.',
  'certificate.inputPemEncoded': 'Находится ли установленная строка PEM в базе 64.',
  'certificate.inputPosition': 'Расположение указателя по отношению к иконе спускового устройства.',
  'certificate.inputShowIcon': 'Булевое значение для управления видимостью значка статуса сертификата.',
  'isPromise.overview':
    'Утилитарная функция <code>isPromise</code> является TypeScript-тип-гард, которая определяет, является ли произвольное значение <code>Promise</code> или <code>PromiseLike</code> (объект или функция, содержащая callable <code>then</code> метод). Она позволяет безопасно проверять типы в времени выполнения и узаконивать типы без ошибок при работе с null или примитивными значениями.',
  'isPromise.callout':
    'Полезно для асинхронных погрузчиков ресурсов, операторов по заказу и гибкого сервиса APIs, которые принимают либо непосредственные статические значения, либо асинхронные обещания.',
  'isPromise.example1Title': 'Пример 1: Матрица интерактивной оценки ценности',
  'isPromise.example1Desc': 'Проверку типа в режиме работы по общим типам данных JavaScript и последующим объектам:',
  'isPromise.thDescription': 'Описание',
  'isPromise.thExpression': 'Оцененное выражение',
  'isPromise.thResult': 'isPromise() Результат',
  'isPromise.example2Title': 'Пример 2: Безопасный способ сокращения типа',
  'isPromise.example2Desc':
    'В TypeScript проверка с <code>if (isPromise(val))</code> автоматически сужает тип внутри блока:',
  'isPromise.apiSummary': 'Тип-гардовая функция TypeScript, проверяющая договоры PromiseLike.',
  'isPromise.paramObj': 'Цена, которую нужно проверить.',
  'isPromise.returnsDesc':
    'Действительно, если вход не является ножом, является объектом или функцией и осуществляет поддающийся вызову метод; в противном случае он не соответствует действительности.',
  'isEmpty.overview':
    'Утилитарная функция <code>isEmpty</code> проверяет, является ли строка, объект или массив пустым. Она возвращает <code>true</code> для пустых значений и <code>false</code> для непустых значений.',
  'isEmpty.example1Title': 'Пример 1: Базовое использование',
  'isEmpty.example1Desc': 'Проверить, пусты ли различные типы значений:',
  'isEmpty.example2Title': 'Пример 2: Случаи общего использования',
  'isEmpty.example2Desc': 'Использовать <code>isEmpty</code> в условной логике:',
  'isEmpty.apiSummary': 'Проверяет, является ли строка, объект или массив пустым.',
  'isEmpty.paramValue': 'Значение для проверки. Может быть струна, объект, массив или другое значение.',
  'isEmpty.returnsDesc':
    'Действительно, если значение является пустым (пустые строки, пустой объект, пустой массив, нулевой или неопределённый), ложное в противном случае.',
  'isEqual.overview':
    'Утилитарная функция <code>isEqual</code> проводит глубокую проверку равенства между двумя значениями. Она рекурсивно сравнивает примитивные значения, массивы и объекты, чтобы определить, являются ли они структурно равными, независимо от равенства по ссылке.',
  'isEqual.example1Title': 'Пример 1: Базовое использование',
  'isEqual.example1Desc': 'Сравнить различные типы ценностей для глубокого равенства:',
  'isEqual.example2Title': 'Пример 2: Глубокое сопоставление объекта',
  'isEqual.example2Desc': 'Сравните гнезданные объекты и массивы:',
  'isEqual.apiSummary': 'Проводит глубокую проверку равенства между двумя значениями.',
  'isEqual.paramValue1': 'Первое значение для сравнения.',
  'isEqual.paramValue2': 'Второе значение для сравнения.',
  'isEqual.returnsDesc':
    'Верно, если значения глубоко равны, в противном случае ложны. Проводит рекурсивное сопоставление для объектов и массивов.',
  'differenceInDays.overview':
    'Утилитарная функция <code>differenceInDays</code> рассчитывает количество целых дней между двумя датами. Она упрощает вычисления с датами в JavaScript, принимая гибкие типы входных данных. Первый параметр представляет собой ссылочную дату, от которой производится вычисление разницы, а второй параметр обозначает дату, которую нужно сравнить с ссылочной датой. Оба параметра принимают <code>Date</code> объекты, числа, представляющие миллисекунды с Unix-эпохи, или строки, которые можно распознать конструктором <code>Date</code>.',
  'differenceInDays.example1Title': 'Пример 1: Рассчитать дни между датами',
  'differenceInDays.example1Desc':
    'Рассчитать количество полных дней между двумя датами с использованием различных типов входных данных:',
  'differenceInDays.example2Title': 'Пример 2: Расчет дней с сегодняшнего дня',
  'differenceInDays.example2Desc': 'Рассчитать количество дней с сегодняшнего дня по конкретную дату:',
  'differenceInDays.apiSummary': 'Рассчитывает количество целых дней между двумя датами.',
  'differenceInDays.paramDateLeft':
    'Исходная дата. Может быть объект даты, тайма (млн. секунд) или нарисованная строка даты.',
  'differenceInDays.paramDateRight':
    'Дата для сопоставления с контрольной датой. Принимает те же типы, что и dateLeft.',
  'differenceInDays.returnsDesc':
    'Количество полных дней между двумя датами. Возвращает положительное число, если dateLeft позже dateRight, и отрицательное, если dateLeft раньше.',
  'pickBy.overview':
    'Утилитарные функции <code>pickBy</code> и <code>omitBy</code> позволяют создавать новые объекты, выбирая или исключая свойства на основе предикатной функции. <code>pickBy</code> создает объект, состоящий из свойств, удовлетворяющих заданному условию, в то время как <code>omitBy</code> наоборот, создает объект, состоящий из свойств, не удовлетворяющих условию.',
  'pickBy.example1Title': 'Пример 1: pickBy',
  'pickBy.example1Desc': 'Создать объект, состоящий из свойств объекта, удовлетворяющих данному состоянию:',
  'pickBy.example2Title': 'Пример 2: omitBy',
  'pickBy.example2Desc':
    '<code>omitBy</code> является противоположной <code>pickBy</code>, создавая объект, состоящий из свойств, которые не удовлетворяют данному состоянию.',
  'pickBy.apiSummary': 'Создает объект, состоящий из свойств объекта, удовлетворяющих заданному условию.',
  'pickBy.paramObject': 'Источник объекта, из которого можно выбрать свойства.',
  'pickBy.paramPredicate':
    'Функция, которая определяет, какие свойства включать. Возвращение действительно включает, не соответствует исключению.',
  'pickBy.returnsDesc': 'Новый объект, содержащий только свойства, удовлетворяющие основному элементу.',
  'omitBy.apiSummary': 'Создает объект, состоящий из свойств объекта, не удовлетворяющих заданному условию.',
  'omitBy.paramObject': 'Источник заявляет о том, что следует опустить свойства.',
  'omitBy.paramPredicate':
    'Функция, которая определяет, какие свойства следует опустить. Возвращение верно опущено, неверно для сохранения.',
  'omitBy.returnsDesc': 'Новый объект, содержащий только свойства, которые не удовлетворяют основному элементу.',
  'url.title': 'Коммунальные услуги URL',
  'url.overview':
    'ngx-lift предоставляет несколько утилит для работы с URL: <code>isIP</code> и <code>isFQDN</code> для проверки типов хостов, <code>isURL</code> для проверки URL, и <code>isHttps</code> для проверки протокола HTTPS. Эти утилиты полезны для проверки URL, проверок безопасности и условного логического программирования, основанным на свойствах URL.',
  'url.example1': 'Пример 1: Проверьте имя узла (isIP и isFQDN)',
  'url.example1Desc':
    'Проверить, является ли имя сервера URL адресом IP или полностью квалифицированным доменным именем (FQDN):',
  'url.example1Callout':
    'Вы можете использовать <code>URL</code>, чтобы получить имя хозяина, но не забывайте использовать пробный прилов для обработки ошибок.',
  'url.example2': 'Пример 2: Проверка URLs (isURL и isHttps)',
  'url.example2Desc':
    '<code>isURL</code> используется для проверки действительности URL. <code>isHttps</code> используется для проверки того, начинается ли URL с https.',
  'url.example2Callout': 'Мы также предоставляем <code>isHttps</code> трубу для использования в шаблонах.',
  'url.isIPSummary': 'Проверяет, является ли имя носителя адресом IP.',
  'url.isFQDNSummary': 'Проверяет, является ли имя носителя полностью квалифицированным доменным именем (FQDN).',
  'url.isURLSummary': 'Проверяет, является ли строчка действительной URL.',
  'url.isHttpsSummary': 'Проверяет, использует ли струна URL протокол HTTPS.',
  'urlValidator.title': 'urlValidator & httpsValidator',
  'urlValidator.firstTask':
    'Введите https://example.com, затем неверный адрес и уберите фокус. Исправьте адрес для устранения ошибки. Пустые значения недопустимы; следующий пример ограничивает протокол.',
  'urlValidator.overview':
    'Функции <code>urlValidator</code> и <code>httpsValidator</code> являются Angular-валидаторами, проверяющими, соответствует ли заданная строка определенным паттернам URL. <code>urlValidator</code> проверяет URL, начинающийся с http или https, в то время как <code>httpsValidator</code> проверяет только HTTPS-URL.',
  'urlValidator.example1': 'Пример 1: Проверочный прибор URL',
  'urlValidator.example1Desc': 'Проверка URLs, начинающаяся с http или https:',
  'urlValidator.example2': 'Пример 2: Вертикальный прибор HTTPS',
  'urlValidator.example2Desc': 'Одобрить только HTTPS URLs:',
  'urlValidator.example3': 'Пример 3: Пример полной формы',
  'urlValidator.example3Desc': 'Полный пример с обоими действительными в ответной форме:',
  'urlValidator.urlLabel': 'URL',
  'urlValidator.urlHelper': 'Предоставить действительный URL',
  'urlValidator.urlError': 'Введите действительный URL (начиная с https или http)',
  'urlValidator.httpsLabel': 'HTTPS - только URL',
  'urlValidator.httpsHelper': 'Предоставление https URL',
  'urlValidator.httpsError': 'Введите https URL',
  'urlValidator.summary':
    'Angular действительный, проверяющий, является ли струна действительной URL начиная с http или https.',
  'urlValidator.httpsSummary': 'Angular действительный действительный HTTPS URL.',
  'urlValidator.returns':
    'Функция действительности, которая возвращает {invalidUrl: правда}, если URL недействителен, или недействительным, если действительны.',
  'urlValidator.httpsReturns':
    'Функция действительности, которая возвращает {invalidUrl: правда}, если URL не HTTPS или недействительным, если это действительно.',
  'startWithTap.overview':
    'Утилитарный оператор <code>startWithTap</code> выполняет синхронный вызов обратного вызова перед каждой подпиской на исходный Observable. В отличие от активных tap-операций или кода инициализации потока, построение потока не выполняет вызов обратного вызова до подписки. Любые исключения, возникшие в вызове обратного вызова, попадают в канал ошибок Observable.',
  'startWithTap.callout':
    'Идеал для инициирования побочных эффектов инициализации, установки индикаторов нагрузки, восстановления предыдущих ошибок или регистрации временных штемпелей запроса отправки немедленно, когда подписывается поток Observable.',
  'startWithTap.example1Title': 'Пример 1: Интерактивное направление запроса с помощью индикатора нагрузки',
  'startWithTap.example1Desc':
    'Нажмите "Triger Request" для подписки на смоделированную 900ms задержанную Observable. <code>startWithTap</code> одновременно работает в момент подписки, чтобы включить спиннер загрузки:',
  'startWithTap.btnTrigger': 'Запрос',
  'startWithTap.btnClearLog': 'Очистить журнал',
  'startWithTap.fetchingData': 'Сбор данных...',
  'startWithTap.loadedPayload': 'Загруженная полезная нагрузка:',
  'startWithTap.example2Title': 'Пример 2: Отсроченное выполнение трубопровода',
  'startWithTap.example2Desc':
    'Обратный звонок откладывается до времени подписки, что означает, что рестораны или совместные трубопроводы могут быть определены заранее без преждевременного осуществления побочных эффектов:',
  'startWithTap.apiSummary': 'RxJS оператор MonoTypeOperatorFunction, выполняющий вызов обратного вызова при подписке.',
  'startWithTap.paramCallback': 'Функция выполняется синхронно до того, как источник Observable начинает излучать.',
  'startWithTap.returnsDesc':
    'Функция оператора RxJS, которая выполняет вызов при подписке и возвращает источник Observable без изменений.',
  'switchMapWithAsyncState.overview':
    'Оператор <code>switchMapWithAsyncState</code> объединяет функциональность <code>switchMap</code> и <code>createAsyncState</code> в один оператор. Он специально разработан для сценариев, когда необходимо запускать запрос API на основе действий пользователя (например, клика по кнопке), и плавно переключаться между потоками. Создавая структуру <code>AsyncState</code> для encapsulation ответа API, этот оператор предоставляет плавный и эффективный способ управления асинхронными операциями.',
  'switchMapWithAsyncState.example1Title': 'Пример 1: Пользователи фильтров с разбивкой по полу',
  'switchMapWithAsyncState.example1Desc':
    'Выбор другого пола позволит соответствующим образом составить список пользователей:',
  'switchMapWithAsyncState.example2Title': 'Пример 2: Представление формы в погрузочном государстве',
  'switchMapWithAsyncState.example2Desc':
    'Отправьте форму с использованием <code>switchMapWithAsyncState</code> и <code>toSignal</code>. Представление всегда излучает ошибку, потому что API предназначен для моделирования ошибки.',
  'switchMapWithAsyncState.apiSummary':
    'Объединяет switchMap и createAsyncState для преобразования потока observable в AsyncState при переключении на новый внутренний observable.',
  'switchMapWithAsyncState.paramProject':
    'Функция, которая получает каждое значение от источника наблюдаемого и возвращает Observable, Promise или другие ObservableInput.',
  'switchMapWithAsyncState.returnsDesc':
    'Видимо, что излучает объекты AsyncState<R>, автоматически обрабатывает погрузку, погрешность и данные.',
  'combineLatestEager.overview':
    'Оператор RxJS <code>combineLatest</code> требует, чтобы все источники выдали хотя бы одно значение, что может быть проблематично при использовании источников <code>Subject</code>, которые могут не выдавать значения вначале. <code>combineLatestEager</code> расширяет <code>combineLatest</code>, автоматически добавляя <code>startWith(null)</code> для каждого <code>Subject</code> в источниках, обеспечивая корректную инициализацию объединенного observable. Также можно установить второй параметр в <code>true</code>, чтобы добавить <code>startWith(null)</code> для всех исходных observables, что полезно, когда нужно обрабатывать много observables, где первые эмиссии не гарантированы.',
  'combineLatestEager.example1Title': 'Пример 1: Базовое использование',
  'combineLatestEager.example1Desc': 'Заметные данные, включая предметы, которые могут не выделяться первоначально:',
  'combineLatestEager.example2Title': 'Пример 2: Полный пример с шаблоном',
  'combineLatestEager.example2Desc':
    'Полный пример, показывающий, как использовать combineLatestEager с асинковой трубой в шаблонах:',
  'combineLatestEager.apiSummary':
    'Объединяет несколько observables с эагерной эмиссией, автоматически обрабатывает источники, которые не выделяют начальные значения.',
  'combineLatestEager.paramSources': 'Серия или словарь объектов наблюдаемых для комбинирования.',
  'combineLatestEager.paramStartWithAll':
    '(Вариант) Когда это так, добавляется startWith(null) для всех источников, а не только субъектов. По умолчанию.',
  'combineLatestEager.returnsDesc':
    'Видимо, что излучает массив или объект, содержащий последние значения из всех источников.',
  'distinctOnChange.overview':
    'Оператор <code>distinctOnChange</code> улучшает observables RxJS, не только предотвращая дублирование эмиссий (в отличие от <code>distinctUntilChanged</code>), но и выполняет вызов обратного вызова при изменении значения. Это полезно в сценариях, где нужно выполнять побочные эффекты, например, отображать уведомление toast, когда значение изменится после первой эмиссии.',
  'distinctOnChange.example1Title': 'Пример 1: Базовое использование',
  'distinctOnChange.example1Desc': 'Выполнить обратный вызов при обнаружении различных значений:',
  'distinctOnChange.example2Title': 'Пример 2: С помощью обычного компаратора',
  'distinctOnChange.example2Desc': 'Для определения равенства использовать функцию индивидуального компаратора:',
  'distinctOnChange.apiSummary':
    'Возвращает observable, который эмитирует различные непрерывные значения и выполняет вызов обратного вызова при изменении значения.',
  'distinctOnChange.paramCallback':
    'Функция для выполнения при изменении стоимости. Получает предыдущие и текущие значения.',
  'distinctOnChange.paramComparator': '(Факультативная) функция определения того, считаются ли две величины равными.',
  'distinctOnChange.returnsDesc': 'Видимо, что излучает различные значения и выполняет вызов на изменения.',
  'logger.overview':
    'Оператор <code>logger</code> — это полезная функция для observables RxJS, которая упрощает логирование эмитируемых значений с использованием различных функций консоли. Этот оператор полезен для отладки и мониторинга поведения ваших observables в процессе разработки.',
  'logger.example1Title': 'Пример 1: Базовая осадка',
  'logger.example1Desc': 'Журнал излучаемых значений с использованием консоли.log:',
  'logger.example2Title': 'Пример 2: Журналирование таблиц',
  'logger.example2Desc':
    'Излучаемые значения в журналах с использованием консольной таблицы для улучшения визуализации:',
  'logger.example3Title': 'Пример 3: Другие методы консоля',
  'logger.example3Desc': 'Используйте другие методы консоли, такие, как предупреждение, ошибка или информация:',
  'logger.apiSummary':
    'Отладочный оператор, который логирует эмиссии в консоль с использованием различных методов консоли.',
  'logger.paramMethod':
    'Необязательно: метод консоли: "log" | "table" | "dir" | "count" | "debug". По умолчанию: "log".',
  'logger.returnsDesc': 'Видимая, которая проходит через все ценности, забирая их до консоли.',
  'kubernetesPagination.overview':
    'Оператор <code>aggregatePaginatedKubernetesResources</code> и функция <code>fetchPaginatedKubernetesResources</code> автоматизируют клиентскую пагинацию для REST-API Kubernetes. Они проверяют параметр <code>metadata.continue</code> в входящих ответах, рекурсивно запрашивают следующие страницы, пока не будут получены все страницы, нормализуют отсутствующие или null-значения безопасно, и агрегируют все ресурсы в один общий <code>KubernetesList&lt;T&gt;</code>.',
  'kubernetesPagination.callout':
    'Kubernetes-API возвращают пагинированные коллекции с токеном <code>continue</code> в метаданных ответа, когда общее количество записей превышает запрашиваемое значение <code>limit</code>. Этот оператор обрабатывает всю многократную последовательность запросов плавно за один поток observable.',
  'kubernetesPagination.example1Title': 'Пример 1: Интерактивная траверсная система Kubernetes',
  'kubernetesPagination.example1Desc':
    'Нажмите "Petch Paginated Pods" для запуска автоматизированной многостраничной работы с тремя имитирующими страницами Kubernetes API:',
  'kubernetesPagination.btnFetchPods': 'Возьмите опухоли',
  'kubernetesPagination.fetchingPages': 'Написание страниц (продолжающий символ)...',
  'kubernetesPagination.pagesFetched': 'Страницы получены рекурсивно:',
  'kubernetesPagination.aggregationComplete': 'Агрегация завершена',
  'kubernetesPagination.totalResources': 'Общий объем ресурсов:',
  'kubernetesPagination.thPodName': 'Название',
  'kubernetesPagination.thNamespace': 'Пространство имени',
  'kubernetesPagination.thStatus': 'Статус',
  'kubernetesPagination.thPodIp': 'Под IP',
  'kubernetesPagination.example2Title': 'Пример 2: Функция самосохранения',
  'kubernetesPagination.example2Desc':
    'Использовать <code>fetchPaginatedKubernetesResources</code>, когда вы хотите запустить и запустить в один вызов функции без создания первоначального Observable вручную:',
  'kubernetesPagination.aggregateSummary':
    'RxJS оператор, который преобразует первоначальный ответ Kubernetes-лист Observable в агрегированный список, содержащий элементы со всех страниц.',
  'kubernetesPagination.fetchSummary':
    'Функция координации, которая инициирует и растягивает ресурсы Kubernetes в один звонок.',
  'kubernetesPagination.paramHttp': 'Angular HttpClient используется для запроса последующих страниц.',
  'kubernetesPagination.paramEndpoint': 'REST URL ресурс Kubernetes.',
  'kubernetesPagination.paramInitialParams': 'Параметры запроса (например, предел).',
  'k8sRetryBackoff.configSummary': 'Опциональная конфигурация, разделяемая оператором и фабрикой интерцептора.',
  'k8sRetryBackoff.paramMaxAttempts':
    'Общее количество попыток, включая начальный запрос. Установите 1 для отключения повторов.',
  'k8sRetryBackoff.errorShape':
    'Принимает HttpErrorResponse или объект, имеющий форму <code>{ status, headers?, error? }</code>, включая JSON-строку в <code>error</code>. Native fetch не отклоняется на HTTP 429: проверяйте ответ и адаптируйте его статус, заголовки и разобранный тело. Axios предоставляет эти данные под <code>error.response</code>; адаптируйте их перед вызовом помощника. Помощник вычисляет задержку только.',
  'k8sRetryBackoffInterceptor.overrideRules':
    'null использует настройки интерцептора по умолчанию; false отключает повторы. Настройки контекста объединяются с глобальными настройками или настройками фабрики. По умолчанию разрешены GET/HEAD/OPTIONS/PUT/DELETE; для POST/PATCH требуется явная настройка retryMethods и подтверждённая идемпотентность операции.',
  'k8sRetryBackoffInterceptor.overrideSimulation':
    'Проверьте пробу, которая немедленно завершается сбоем при первом 429, или чтение рабочей нагрузки, которое успешно завершается после двух ответов 429. Настраиваемое чтение использует maxAttempts: 10 и резервную задержку 200 мс, допуская до 9 повторных попыток.',
  'k8sRetryBackoffInterceptor.btnWorkloads': 'Тест чтения нагрузки (10 попыток)',
  'k8sRetryBackoffInterceptor.btnProbe': 'Тест быстрой пробы (Исключение)',
  'k8sRetryBackoff.firstTask':
    'Обновление отправляет один модельный GET. Сначала приходит HTTP 429 с Retry-After: 1; минимум через секунду повтор возвращает HTTP 200. Вывод показывает состояние и число попыток. Затем изучите настройку и другие сценарии.',
  'k8sRetryBackoff.overview':
    'RxJS оператор <code>retryOnK8sBackoff</code> реализует автоматическую повторную отправку с задержкой для ответов HTTP 429 («TooManyRequests») Kubernetes apiserver (например, когда apiserver watch cache запускается с «storage is (re)initializing»). Только HTTP 429 запускает повторную отправку; все другие ошибки (4xx, 5xx, сбои в сети) немедленно и без изменений передаются подписчику.',
  'k8sRetryBackoff.callout':
    '<strong>Оператор и интерцептор:</strong> Оператор управляет отдельными цепочками Observable. Интерцептор повторяет запросы HttpClient при HTTP 429 только для разрешённых методов; для операций записи необходимо подтвердить идемпотентность.',
  'k8sRetryBackoff.diffTitle': 'Архитектурное сравнение: Оператор vs Интерцептор',
  'k8sRetryBackoff.diffDesc':
    'Оба инструмента используют один и тот же механизм вычисления задержки, но решают взаимодополняющие задачи:',
  'k8sRetryBackoff.diffColFeature': 'Характеристика',
  'k8sRetryBackoff.diffColOperator': 'retryOnK8sBackoff (Оператор)',
  'k8sRetryBackoff.diffColInterceptor': 'k8sRetryBackoffInterceptor (Интерцептор)',
  'k8sRetryBackoff.diffScope': 'Область действия',
  'k8sRetryBackoff.diffScopeOp':
    'Локальная: Применяется выборочно к отдельным Observable через <code>.pipe(retryOnK8sBackoff(...))</code>.',
  'k8sRetryBackoff.diffScopeInt': 'Глобальная: Автоматически перехватывает все исходящие HTTP-запросы приложения.',
  'k8sRetryBackoff.diffUseCases': 'Сценарии использования',
  'k8sRetryBackoff.diffUseCasesOp': 'Потоки опроса, фоновые задачи или Observable вне HttpClient.',
  'k8sRetryBackoff.diffUseCasesInt':
    'Базовая защита для всех вызовов REST/Kubernetes без изменения отдельных сервисов.',
  'k8sRetryBackoff.diffConfig': 'Конфигурация и отключение',
  'k8sRetryBackoff.diffConfigOp':
    'Передаётся непосредственно оператору: <code>retryOnK8sBackoff({ maxAttempts, fallbackDelayMs })</code>',
  'k8sRetryBackoff.diffConfigInt':
    'Глобально в <code>app.config.ts</code> или для отдельного запроса через <code>HttpContextToken</code>',
  'k8sRetryBackoff.example1Title': 'Пример 1: Интерактивный симулятор и использование в пайплайне',
  'k8sRetryBackoff.example1Desc':
    'Имитируйте ответы Kubernetes API и наблюдайте за задержками и обработкой ошибок с retryOnK8sBackoff (с примером кода ниже):',
  'k8sRetryBackoff.selectScenario': 'Выберите сценарий ответа:',
  'k8sRetryBackoff.scenarioHeader': '429 (Заголовок Retry-After: 1)',
  'k8sRetryBackoff.scenarioBody': '429 (JSON-тело details.retryAfterSeconds: 1.5)',
  'k8sRetryBackoff.scenarioFallback': '429 (Без заголовка, резервная задержка 1 с)',
  'k8sRetryBackoff.scenarioNon429': '500 Internal Server Error (Без повторов, мгновенная ошибка)',
  'k8sRetryBackoff.scenarioExhausted': '5x подряд 429 (Исчерпаны максимальные попытки)',
  'k8sRetryBackoff.btnSimulate': 'Имитировать запрос и повторить',
  'k8sRetryBackoff.logTitle': 'Журнал выполнения:',
  'k8sRetryBackoff.btnClearLogs': 'Очистить журнал',
  'k8sRetryBackoff.example2Title': 'Пример 2: Отдельная функция извлечения задержки (getK8sRetryDelayMs)',
  'k8sRetryBackoff.example2Desc':
    'Используйте getK8sRetryDelayMs для извлечения задержки в пользовательских циклах повторов или Promise:',
  'k8sRetryBackoff.sampleErrorLabel': 'Пример ошибочного ответа:',
  'k8sRetryBackoff.helperHeader': '429 (Retry-After: 3 с)',
  'k8sRetryBackoff.helperBody': '429 (retryAfterSeconds: 2 с)',
  'k8sRetryBackoff.helperFallback': '429 (Без подсказки, резерв 1 с)',
  'k8sRetryBackoff.helperNon429': '500 (Ошибка не 429)',
  'k8sRetryBackoff.btnExtractDelay': 'Извлечь задержку (getK8sRetryDelayMs)',
  'k8sRetryBackoff.retryableError': 'Повторяемый откат 429 Kubernetes',
  'k8sRetryBackoff.nonRetryableError': 'Неповторяемая ошибка',
  'k8sRetryBackoff.apiSummary':
    'RxJS оператор, который повторно отправляет ответы Kubernetes 429 с задержкой, предоставленной сервером или с падающей задержкой.',
  'k8sRetryBackoff.paramConfig': 'Опциональная конфигурация максимального числа попыток и резервной задержки.',
  'k8sRetryBackoff.delaySummary': 'Извлекает задержку в миллисекундах из объекта ошибки или возвращает null.',
  'k8sRetryBackoff.paramError': 'Проверяемая ошибка (HttpErrorResponse или объект с полями status/headers/error).',
  'k8sRetryBackoff.paramFallbackDelay': 'Резервная задержка в миллисекундах, если в ответе нет указаний.',
  'k8sRetryBackoffInterceptor.overview':
    '<code>k8sRetryBackoffInterceptor</code> автоматически повторяет ответы Kubernetes 429 для идемпотентных методов. Он уважает Retry-After и детали.retryAfterSeconds, с экспоненциальной падающей задержкой, шумом, бюджетом задержки и выключением HttpContext. POST/PATCH требуют явного включения.',
  'k8sRetryBackoffInterceptor.callout':
    '<strong>Глобальная защита с перезаписью запросов:</strong> Регистрируйте интерсептор один раз в <code>app.config.ts</code>, чтобы защитить все конечные точки. Для отдельных запросов, которые должны пропустить повторную отправку или использовать пользовательские лимиты, установите <code>K8S_RETRY_BACKOFF_CONFIG</code> контекстный токен на вызов <code>HttpClient</code>. Для локального контроля потока вместо этого, посмотрите <code>retryOnK8sBackoff</code> оператор.',
  'k8sRetryBackoffInterceptor.example1Title': 'Пример 1: Глобальная регистрация интерцептора и симулятор',
  'k8sRetryBackoffInterceptor.example1Desc':
    'Зарегистрируйте интерцептор глобально в app.config.ts, чтобы повторять допустимые идемпотентные запросы HttpClient при HTTP 429.',
  'k8sRetryBackoffInterceptor.selectMode': 'Режим контекста интерцептора:',
  'k8sRetryBackoffInterceptor.modeDefault': 'Интерцептор по умолчанию (Повтор 429 через 1 с, затем 200 OK)',
  'k8sRetryBackoffInterceptor.modeCustom':
    'Настройки HttpContext: maxAttempts: 2, базовая задержка: 400 мс, equal jitter',
  'k8sRetryBackoffInterceptor.modeDisabled': 'Отключено через HttpContext (HttpContextToken = false, мгновенный сбой)',
  'k8sRetryBackoffInterceptor.btnSend': 'Отправить перехваченный запрос',
  'k8sRetryBackoffInterceptor.example2Title':
    'Пример 2: Настройка для отдельных запросов и отключение через HttpContext',
  'k8sRetryBackoffInterceptor.example2Desc':
    'Используйте K8S_RETRY_BACKOFF_CONFIG в HttpContext для настройки лимитов или отключения повторов для быстрых проверок:',
  'k8sRetryBackoffInterceptor.apiSummary':
    'Функциональный HTTP-интерсептор, который применяет повторные попытки при откатах к HTTP-ответам 429 Kubernetes.',
  'k8sRetryBackoffInterceptor.factorySummary': 'Создает интерцептор с пользовательскими настройками по умолчанию.',
  'k8sRetryBackoffInterceptor.paramDefaultConfig':
    'Конфигурация по умолчанию для всех запросов, если не переопределена через HttpContext.',
  'k8sRetryBackoffInterceptor.tokenSummary':
    'HttpContextToken для настройки или отключения повторов для конкретного запроса.',
  'ifValidator.firstTask':
    'Отрицательный ответ делает почту и причину обязательными. Заполните их и измените ответ: ошибки обязательности исчезнут, но формат почты продолжит проверяться.',
  'ifValidator.overview':
    'ngx-lift предоставляет утилитарные функции для создания условных валидаторов в Angular Reactive Forms. Условные валидаторы позволяют применять указанные функции валидации в зависимости от заданного условия. Выводятся две основные функции: <code>ifValidator</code> для синхронных валидаторов и <code>ifAsyncValidator</code> для асинхронных валидаторов.',
  'ifValidator.example1Title': 'Пример 1: Требуемый кондиционный аттестационный элемент',
  'ifValidator.example1Desc':
    'Требуют указания причин и ввода по электронной почте только в том случае, если выбран вариант "извините". Требуемый действительный действительный элемент применяется к управлению текстовым вводом только в том случае, если выбран вариант "извините".',
  'ifValidator.question': 'Тебе нравится этот инструмент?',
  'ifValidator.optLike': 'Конечно.',
  'ifValidator.optUnlike': 'Простите.',
  'ifValidator.emailHelper': 'Поле требуется только когда вы выбираете Прости',
  'ifValidator.invalidEmail': 'Неверная электронная почта',
  'ifValidator.reasonLabel': 'Почему ты не любишь',
  'ifValidator.autoRevalidationTitle': 'Автоматическое подтверждение:',
  'ifValidator.autoRevalidationDesc':
    'По умолчанию Angular пересматривает валидаторы контроля только при изменении значения самого контроля. Сочетайте с <code>revalidateOnChange([email, reason], choice)</code> или передайте <code>Signal&lt;boolean&gt;</code> с <code>revalidateOnChange</code>, чтобы автоматически запускать перепроверку при обновлении источника условия!',
  'ifValidator.example2Title': 'Пример 2: ifAsyncValidator',
  'ifValidator.example2Desc':
    '<code>ifAsyncValidator</code> имеет сходство с <code>ifValidator</code>, но отличается в том, что он принимает два параметра: состояние и функцию AsyncValidation, специально предназначенную для обработки асинхронных операций.',
  'ifValidator.apiSummary': 'Создает условный валидатор, который применяет функции валидации в зависимости от условия.',
  'ifValidator.paramCondition':
    'Функция, которая возвращает верно для trueValidatorFn, или ложная для falseValidatorFn.',
  'ifValidator.paramTrueValidatorFn':
    'Функция (функции) подтверждения достоверности, применяемая (используемые) при наличии реального состояния.',
  'ifValidator.paramFalseValidatorFn':
    '(Факультативная) функция (функции) подтверждения достоверности, применяемая (используемые) в случае ложного состояния.',
  'ifAsyncValidator.apiSummary':
    'Создает условный асинхронный валидатор, который применяет асинхронную функцию валидации в зависимости от условия.',
  'ifAsyncValidator.paramCondition': 'Функция определения того, следует ли применять асинхронизатор.',
  'ifAsyncValidator.paramAsyncValidatorFn':
    'Функция асинкового действительных значений должна выполняться в том случае, когда состояние соответствует действительности.',
  'intersectionValidator.firstTask':
    'Выберите одинаковое пространство имён в обоих списках, чтобы увидеть ошибку группы. Оставьте выбор в каждом списке и устраните пересечение.',
  'intersectionValidator.overview':
    'Оператор <code>intersectionValidator</code> — это пользовательский валидатор Angular Forms, предназначенный для обеспечения того, чтобы два контроля формы не содержали пересекающихся значений. Например, у вас может быть два списка элементов, и вы хотите, чтобы они не содержали повторяющихся элементов. При наличии пересечения между массивами оба поля и форма будут иметь <code>{intersection: true}</code> ошибку.',
  'intersectionValidator.example1Title': 'Пример 1: Проверка неперекрывающих ретрансляторов',
  'intersectionValidator.example1Desc': 'Обе поля должны возвращать массивы.',
  'intersectionValidator.includedNamespaces': 'Включены пространства для имён',
  'intersectionValidator.excludedNamespaces': 'Исключенные промежутки',
  'intersectionValidator.overlapError': 'Включает именовые и исключаемые пространства не могут перекрываться',
  'intersectionValidator.overlapAlert': 'Включены именовые и исключаемые пространства имеют частичное совпадение',
  'intersectionValidator.returnsDesc':
    "Функция действительности, которая возвращает <code>{intersection: true}</code>, если массивы пересекаются, или <code>null</code>, если они не работают. Вы можете проверить на эту ошибку в форме через <code>form.errors?.['intersection']</code>.",
  'intersectionValidator.apiSummary':
    'Проверяет, что два массивовых контроля формы не содержат пересекающихся элементов.',
  'intersectionValidator.paramArray1Key': 'Название первого органа управления.',
  'intersectionValidator.paramArray2Key': 'Название второго органа управления.',
  'uniqueValidator.firstTask':
    'Введите одинаковый текст в оба поля и уберите фокус, чтобы увидеть ошибку дубликата. Измените одно значение и снова уберите фокус. Очистка сбрасывает оба значения.',
  'uniqueValidator.overview':
    'Оператор <code>uniqueValidator</code> — это пользовательский валидатор Angular Forms, предназначенный для проверки уникальности по нескольким полям в <code>FormArray</code> или <code>FormGroup</code>. Он обеспечивает, что значение каждого контроля уникально среди всех других контролов в массиве или группе.',
  'uniqueValidator.example1Title': 'Пример 1: Установка FormControls',
  'uniqueValidator.example1Desc':
    'Если у вас есть ряд отдельных FormControls и хотите обеспечить уникальность, прикрепите <code>UniqueValidator.unique()</code> к FormArray, которую вы хотите подтвердить.',
  'uniqueValidator.calloutSameValue':
    'Введите такое же значение в нижних органах управления и увидите эффект в размытом состоянии.',
  'uniqueValidator.controlLabel': 'Контроль',
  'uniqueValidator.controlHelper': 'Контрольное значение должно быть уникальным',
  'uniqueValidator.duplicated': 'Дублирование',
  'uniqueValidator.example2Title': 'Пример 2: Устройство FormGroups с парами ключей-видов',
  'uniqueValidator.example2Desc':
    'В более сложной ситуации представьте, что у вас есть массив <code>FormGroups</code>, каждый из которых содержит пары ключ-значение в виде <code>FormControls</code>. Вы хотите, чтобы значения контролов ключей (ниже, в левой части) были уникальны в рамках всех групп. Для этой цели можно передать контролер как аргумент функции <code>UniqueValidator.unique(controlSelector)</code>.',
  'uniqueValidator.keyCallout':
    'Введите такое же значение в нижних органах управления и увидите эффект в размытом состоянии.',
  'uniqueValidator.keyPlaceholder': 'контроль ключа',
  'uniqueValidator.keyHelper': 'контроль ключа должен быть уникальным',
  'uniqueValidator.valuePlaceholder': 'контроль стоимости',
  'uniqueValidator.valueHelper': 'Проверка достоверности результатов контроля стоимости не проводилась',
  'uniqueValidator.returnsDesc':
    'Функция действительности, которая возвращает <code>{notUnique: true}</code>, если найдены дублирующие значения, или <code>null</code>, если все значения являются уникальными.',
  'uniqueValidator.usageNotes': 'Примечания по использованию',
  'uniqueValidator.usageNotesDesc':
    'Переключите метод управления <code>updateValueAndValidity()</code>, необходимый для повторной проверки при изменении значений.',
  'uniqueValidator.apiSummary': 'Проверяет уникальность по контрольным элементам FormArray или по значениям массива.',
  'uniqueValidator.paramKey':
    '(Вариант) Ключ имущества для проверки уникальности объектов. Если опущено, проверяется примитивное равенство.',
  'dateRangeValidator.firstTask':
    'Выберите дату от завтра до пяти дней от сегодня включительно. Даты вне диапазона и пустые обязательные значения недопустимы.',
  'dateRangeValidator.overview':
    'Оператор <code>dateRangeValidator</code> — это пользовательский валидатор, проверяющий, что дата попадает в заданный диапазон. Он поддерживает проверку для значений только даты и даты-времени, с настраиваемыми границами включительно/исключительно и возможным сравнением времени.',
  'dateRangeValidator.example1Title': 'Пример 1: Проверка дальности',
  'dateRangeValidator.example1Desc':
    'Проверяет, что дата находится между минимальной и максимальной датой. Эта настройка гарантирует, что выбранная дата должна находиться между 1 сентября 2024 года и 15 сентября 2024 года (исключительно), игнорируя компоненты времени. 15 сентября не является допустимой, так как <code>maxInclusive</code> установлена в false.',
  'dateRangeValidator.example2Title': 'Пример 2: Выберите будущую дату',
  'dateRangeValidator.example2Desc':
    'Включает <code>minDate</code>, устанавливает <code>minInclusive</code> на <code>true</code>.',
  'dateRangeValidator.expiresRawLabel': 'Дата истечения срока действия (Raw HTML вход)',
  'dateRangeValidator.minDateError': 'Дата не может быть раньше {{ minDate }}',
  'dateRangeValidator.futureDaysLabel': 'Будущие 5 дней (Clarity Дата ввода)',
  'dateRangeValidator.invalidDate': 'Дата недействима',
  'dateRangeValidator.maxDateError': 'Дата не может быть позже {{ maxDate }}',
  'dateRangeValidator.clarityMax': 'Дата слишком запоздалая (подтверждение ясности)',
  'dateRangeValidator.clarityMin': 'Дата слишком рано (подтверждение ясности)',
  'dateRangeValidator.minMaxCallout':
    'Мы можем использовать схему <code>min</code> и <code>max</code> для подтверждения диапазона. Однако это подтверждение не потерпит неудачу при напечатке числа типа 12 или строки, как 12 hello.',
  'dateRangeValidator.example3Title': 'Пример 3: Проверка сроков и временных интервалов',
  'dateRangeValidator.example3Desc':
    'Чтобы проверить и дату, и время, установите <code>compareTime</code> в true. С использованием следующей настройки, выбранная дата и время должны находиться между 1 сентября 2024 года в полдень UTC и 2 сентября 2024 года в полдень UTC, учитывая компоненты времени.',
  'dateRangeValidator.dateTimeExpires': 'Дата истечения срока действия',
  'dateRangeValidator.dateTimeMinError': 'Дата и время не могут быть раньше {{ minDate }}',
  'dateRangeValidator.dateTimeMaxError': 'Дата и время не могут быть позже {{ maxDate }}',
  'dateRangeValidator.returnsDesc': 'Функция разрешителя, которая может использоваться с реактивными формами Angular.',
  'dateRangeValidator.validationErrors': 'Ошибки проверки',
  'dateRangeValidator.errInvalidDate':
    'Возвращение, когда дата недействительна (например, "2023-13-01" или "приветственный мир")',
  'dateRangeValidator.errMinDate':
    'Возвращено, когда выбранная дата была раньше или равна минимальной допустимой дате. Значение погрешности является минимальной допустимой датой, оформленной как строка ISO.',
  'dateRangeValidator.errMaxDate':
    'Вернуто, когда выбранная дата будет позднее или равна максимально допустимой дате. Погрешность является максимальной допустимой датой, оформленной как строка ISO.',
  'dateRangeValidator.apiSummary': 'Проверяет, что значение даты находится в заданном диапазоне minDate и/или maxDate.',
  'dateRangeValidator.paramOptions': 'DateRangeOptions, конфигурирует minDate, maxDate и флаги инклюзивности.',
  'dateRangeValidator.optMinDate': 'Минимальная приемлемая дата.',
  'dateRangeValidator.optMaxDate': 'Максимальная приемлемая дата.',
  'dateRangeValidator.optMinInclusive': 'Является ли минимальная дата инклюзивной. Погрешности верности.',
  'dateRangeValidator.optMaxInclusive': 'Является ли максимальная дата инклюзивной. Погрешности верности.',
  'rangePipe.overview':
    'Оператор <code>range</code> генерирует массив чисел в заданном диапазоне, что делает его идеальным для создания выпадающих списков, пагинационных элементов или любых сценариев, требующих числовых последовательностей в шаблонах. При работе с Angular-шаблонами может потребоваться генерировать массив чисел для итерации. Например, если у вас есть число 20, и вы хотите создать массив от 1 до 20 для отображения в выпадающем списке, Angular-директива <code>@for</code> не может напрямую итерироваться по числу. Хотя можно сгенерировать этот массив в TypeScript, в некоторых случаях более удобно создавать массив напрямую в шаблоне.',
  'rangePipe.callout1':
    'Трубопровод <code>range</code> создает набор чисел (положительный и/или отрицательный), прогрессирующих от начала до <strong>, но не включая энд</strong>.',
  'rangePipe.callout2': 'Если отрицательный запуск указан без конца или шага, то используется ступень -1.',
  'rangePipe.callout3': 'Если конец не указан, то он установлен для начала, затем установлен на 0.',
  'rangePipe.callout4':
    'Функция <code>range</code> также доступна для использования в TypeScript, которая может быть импортирована из <code>ngx-lift</code>.',
  'rangePipe.example1Title': 'Пример 1: Базовый диапазон',
  'rangePipe.example1Desc': 'Создать массивы с различными стартовыми и конечными значениями:',
  'rangePipe.example2Title': 'Пример 2: С ступенчатым значением',
  'rangePipe.example2Desc': 'Генерировать массивы с заказным значением шага:',
  'rangePipe.example3Title': 'Пример 3: Обратная стрелка',
  'rangePipe.example3Desc': 'Генерировать массивы в обратном порядке:',
  'rangePipe.example4Title': 'Пример 4: Выбор сбрасывания',
  'rangePipe.example4Desc':
    'Генерировать CPU опции подсчета для выпадения. Это полезно, когда отображается список компьютеров с различными максимальными значениями CPU и позволяет пользователям выбрать диапазон CPU.',
  'rangePipe.cpuLabel': 'Выберите число CPU',
  'rangePipe.cpuOption': '{{ count }} CPU',
  'rangePipe.returnsDesc': 'Диапазон чисел в указанном диапазоне.',
  'rangePipe.apiSummary': 'Angular-оператор, генерирующий массив чисел в заданном диапазоне.',
  'rangePipe.paramValue':
    'Строка с указанием [конца], [запуска, конца], [запуска, конца, шага] или [запуска, конца, шага, инклюзивного].',
  'isHttpsPipe.overview':
    'Пайп <code>isHttps</code> — это Angular-пайп, который проверяет, использует ли строка URL протокол HTTPS. Он полезен для условного отображения, валидации или проверок безопасности в шаблонах. Также доступна соответствующая <code>isHttps</code> полезная функция для использования в TypeScript.',
  'isHttpsPipe.example1Title': 'Пример 1: Базовое использование',
  'isHttpsPipe.example1Desc': 'Проверить, использует ли URL протокол HTTPS:',
  'isHttpsPipe.example2Title': 'Пример 2: Условное проведение торгов',
  'isHttpsPipe.example2Desc': 'Условно передают компоненты на основе статуса HTTPS:',
  'isHttpsPipe.example3Title': 'Пример 3: Проверка надежности безопасности',
  'isHttpsPipe.example3Desc': 'Показывать показатели безопасности на основе протокола:',
  'isHttpsPipe.apiSummary': 'Angular-пайп, который проверяет, использует ли строка URL протокол HTTPS.',
  'isHttpsPipe.paramValue': 'Строка URL для проверки.',
  'isHttpsPipe.returnsDesc': 'Верно, если URL использует протокол HTTPS, в противном случае.',
  'arrayJoinPipe.overview':
    'Пайп <code>arrayJoin</code> — это Angular-пайп, который соединяет элементы массива в строку с использованием указанного разделителя. Он предоставляет удобный способ отображения данных массива как запятосоединенных или с пользовательским разделителем строк в шаблонах.',
  'arrayJoinPipe.example1Title': 'Пример 1: Базовое использование',
  'arrayJoinPipe.example1Desc': 'Объединить элементы массива с разделителем запятой по умолчанию:',
  'arrayJoinPipe.example2Title': 'Пример 2: Разъединители',
  'arrayJoinPipe.example2Desc': 'Использовать различные сепараторы для различных случаев использования:',
  'arrayJoinPipe.example3Title': 'Пример 3: Числовые снаряды',
  'arrayJoinPipe.example3Desc': 'Присоединиться к цифровым массивам с различными сепараторами:',
  'arrayJoinPipe.apiSummary':
    'Angular-пайп, который соединяет элементы массива в строку с использованием указанного разделителя.',
  'arrayJoinPipe.paramValue': 'Интервал для присоединения. Если не массив, возвращает значение как есть.',
  'arrayJoinPipe.paramSeparator': '(Вариант) Строка сепаратора для использования между элементами.',
  'arrayJoinPipe.returnsDesc':
    'Строка, содержащая соединенные элементы массива, или первоначальное значение, если не массив.',
  'maskPipe.overview':
    'Пайп <code>mask</code> — это Angular-пайп, предназначенный для маскирования чувствительных строковых данных, заменяя символы звездочками, при этом сохраняя configurable количество символов в начале и конце. Он идеален для скрытия чувствительной информации в пользовательском интерфейсе, таких как номера кредитных карт, телефонные номера или API-ключи.',
  'maskPipe.example1Title': 'Пример 1: Базовое использование',
  'maskPipe.example1Desc':
    'Струны, чувствительные к маске, с настройками по умолчанию (6 символов, видимых в начале и конце):',
  'maskPipe.example2Title': 'Пример 2: Обычные варианты маскировки',
  'maskPipe.example2Desc': 'Настроить число видимых символов в начале и конце строки:',
  'maskPipe.example3Title': 'Пример 3: Маскирование кредитных карт',
  'maskPipe.example3Desc': 'Номера маковых кредитных карт при показе последних 4 цифр:',
  'maskPipe.example4Title': 'Пример 4: Маскирование полотна',
  'maskPipe.example4Desc': 'Условно показываемые/скрытые чувствительные данные:',
  'maskPipe.maskingConditions': 'Условия маскировки',
  'maskPipe.conditionsDesc': 'Трубка маскируется при следующих условиях:',
  'maskPipe.cond1':
    'Длина входных строк должна быть больше суммы <code>unmaskedPrefixLength</code> и <code>unmaskedSuffixLength</code>.',
  'maskPipe.cond2':
    '<code>unmaskedPrefixLength</code> и <code>unmaskedSuffixLength</code> не должны быть отрицательными.',
  'maskPipe.cond3': 'Опция <code>masked</code> должна быть <code>true</code>.',
  'maskPipe.condFallback':
    'Если какое-либо из этих условий не выполнено, оригинальная строка возвращается без изменений.',
  'maskPipe.apiSummary':
    'Angular-пайп, который маскирует чувствительные строкиовые данные, заменяя символы звездочками.',
  'maskPipe.paramValue': 'Вводная нить будет маскирована.',
  'maskPipe.paramOptions': 'Параметры для маскировки поведения.',
  'maskPipe.returnsDesc': 'Строка в маске или оригинальная, если маскировка отключена или струна слишком коротка.',
  'maskPipe.optUnmaskedPrefixLength':
    'Число персонажей, которые должны остаться незамеченными в начале. По умолчанию 6.',
  'maskPipe.optUnmaskedSuffixLength': 'Число персонажей, которые оставляют незамеченными в конце. По умолчанию 6.',
  'maskPipe.optMaskChar': 'Символ, используемый для маскировки.',
  'maskPipe.optEnabled': 'Можно ли маскировать. Погрешности верны.',
  'byteConverterPipe.overview':
    'Пайп <code>byteConverter</code> преобразует числовые значения байтов в человекочитаемые строки размеров файлов (например, «1,5 МБ», «2,3 ГБ») с локализацией. Он автоматически управляет преобразованием единиц (BYTE, KB, MB, GB, TB) и поддерживает локализацию с переводами на несколько языков, включая английский, французский, китайский, японский, корейский, немецкий, испанский, итальянский, португальский и русский.',
  'byteConverterPipe.example1Title': 'Пример 1: Базовое использование',
  'byteConverterPipe.example1Desc': 'Преобразование байтовых значений в считываемый человеком формат:',
  'byteConverterPipe.example2Title': 'Пример 2: Показать размер файла',
  'byteConverterPipe.example2Desc': 'Показывать размеры файлов в удобном для пользователя формате:',
  'byteConverterPipe.example3Title': 'Пример 3: Преобразование различных единиц',
  'byteConverterPipe.example3Desc': 'Трубка автоматически преобразуется в соответствующую единицу:',
  'byteConverterPipe.languageSupport': 'Языковая поддержка',
  'byteConverterPipe.languageSupportDesc':
    'Пайп использует идентификатор локали приложения <code>LOCALE_ID</code>, чтобы определить соответствующие переводы единиц. Поддерживаемые языки включают английский, французский, китайский (упрощённый и традиционный), японский, корейский, немецкий, испанский, итальянский, португальский (Бразилия) и русский. Если язык браузера не поддерживается, английский используется по умолчанию.',
  'byteConverterPipe.i18nCallout':
    'Чтобы настроить локальную поддержку, см. <a href="https://angular.io/guide/i18n" target="_blank">Angular i18n documents </a>.',
  'byteConverterPipe.apiSummary':
    'Angular-пайп, который преобразует количество байтов в человекочитаемую строку с локализацией.',
  'byteConverterPipe.paramValue':
    '(Вариант) Количество байтов для преобразования. Возвращение нулевой, если нулевой, неопределённой, или NaN.',
  'byteConverterPipe.returnsDesc':
    'Форматирование строки с соответствующей единицей (B, KB, MB, GB, TB) на основе локальной или нулевой, если она недействительна.',
  'datagridUtil.transformDesc':
    'Функция преобразует состояние данных Clarity (содержащее информацию о пагинации, сортировке и фильтрации) в объект PageQuery. Вот пример преобразования:',
  'datagridUtil.inputTitle': 'Ввод: Clarity Datagrid State',
  'datagridUtil.outputTitle': 'Вывод: объект PageQuery',
  'datagridUtil.usageDesc':
    'Используйте convertToHttpParams в вашем компоненте для преобразования состояния данных для запросов API:',
  'common.save': 'Сохранить',
  'common.submit': 'Отправить',
  'statusIndicator.inputIconStatus': 'Статус представлен значком.',
  'statusIndicator.inputIconSize': 'Размер икон, включая sm, md, lg, размер пикселя.',
  'statusIndicator.inputTooltip':
    'Факультативный текст, показываемый в режиме &quot; навес &quot; или &quot; фокус &quot; .',
  'statusIndicator.inputTooltipPosition': 'Положение наконечника по отношению к его курку.',
  'tooltip.componentTypeExample': 'Содержание элемента',
  'idleDetection.configIdleDuration': 'Секунды бездеятельности до начала отсчёта.',
  'idleDetection.configTimeoutDuration': 'Время отсчёта за секунды до отсчёта времени.',
  'playground.copyFailed': 'Не удалось скопировать. Выделите и скопируйте код вручную.',
  'header.partialLanguage': 'Перевод неполный; отсутствующий текст отображается на английском.',
  'form.masterPassword': 'Мастер-пароль',
  'form.masterPasswordRequired': 'Мастер-пароль обязателен для заполнения.',
  'grid.refresh': 'Обновить',
  'grid.firstName': 'Имя',
  'grid.lastName': 'Фамилия',
  'grid.email': 'Электронная почта',
  'home.claritySetup': 'Руководство по созданию системы проектирования Clarity в вашем проекте см.',
  'home.clarityDocumentation': 'Документация проектной системы Clarity',
  'resourceAsync.useResource': 'Использовать resourceAsync, когда:',
  'resourceAsync.useComputed': 'Использовать computedAsync, когда:',
  'resourceAsync.preferMutation':
    'Для сервера предпочтите mutateResource. Наследие выполняет() представления должны быть ленивыми: правда, реакция: ложное и поведение: выхлопы.',
  'resourceAsync.useRead': 'Управление местными считывающими операциями (GET) с перезагрузкой () для перезагрузки.',
  'resourceAsync.useLocal':
    'Управление оптимистичными местными штатами, кэшированными значениями или составлением проектов с набором ()/обновлением ().',
  'resourceAsync.useManual':
    'Прямо запустить или перезапустить операцию с перезагрузкой(), выполнить() или перезагрузить().',
  'resourceAsync.useStatus':
    'Погружаться в пустую дорожку, загружать, перезагружать, разрешать, погрешность и местные штаты.',
  'resourceAsync.useLazy': 'Первичная казнь с ленивой погрузкой.',
  'resourceAsync.useCancel':
    'Отменить слова &lt; &lt; переключателем &gt; &gt; или &lt; &lt; компенсацией перекрывающихся операций с отработавшими газами &gt; &gt; .',
  'resourceAsync.useComputedReactive':
    'Автоматически перепроверять данные асинхронизации при изменении зависимости сигнала.',
  'resourceAsync.useComputedConcurrency': 'Выбрать выключатель, слияние, конкат или поведение отработавших газов.',
  'resourceAsync.useComputedValue': 'Введите один сигнал с явной ошибкой или политикой throwOnError.',
  'resourceAsync.apiSummary':
    'Создает локальную реактивную ресурс с асинхронным состоянием, отменой, явным выполнением и локальными обновлениями.',
  'resourceAsync.errorValuePolicy':
    'При ошибке предыдущее значение по умолчанию очищается. Используйте preserveValueOnError: true, чтобы сохранить его.',
  'resourceAsync.notLoaded': 'Не загружается',
  'resourceAsync.noData': 'Данные отсутствуют',
  'resourceAsync.lastUpdated': 'Последнее обновление',
  'resourceAsync.topicTitle': 'Тема/название',
  'resourceAsync.keyConcepts': 'Основные концепции:',
  'resourceAsync.patternBenefits': 'Преимущества модели:',
  'spinner.inputDecorative':
    'По умолчанию используется как декоративный элемент. Установите false, чтобы объявлять загрузку как состояние.',
  'spinner.inputLabel': 'Локализованная метка состояния; по умолчанию используется встроенное сообщение о загрузке.',
  'fileReader.inputControlId': 'ID входного кода, для связи с лейблом формы.',
  'fileReader.inputAcceptFiles':
    'Приемлемые типы текстовых файлов. Этот компонент читает текст, а не произвольные двоичные файлы.',
  'fileReader.inputEncoded': 'Эмит СМС в качестве базы 64 при включении.',
  'fileReader.inputTextEncoding': 'UTF-8 по умолчанию; выбирает латин1 при потреблении наследных струн базы 64.',
  'fileReader.inputMaxSize': 'Максимальный размер в MiB. Избыточные файлы отклоняются до прочтения.',
  'fileReader.inputDisabled': 'Отключить отбор и удаление файлов.',
  'fileReader.outputChange': 'Текст или база 64 после успешного выбора файла.',
  'k8sRetryBackoff.paramJitter': 'Равная дурацкая стратегия ждет от половины до полного экспоненциального потолка.',
  'k8sRetryBackoff.paramHintJitter': 'Дополнительные случайные ожидания после намека сервера, в миллисекунды.',
  'k8sRetryBackoff.paramMaxDelay': 'Подсказка от сервера более продолжительная, не сокращая подсказки.',
  'k8sRetryBackoff.paramWaitBudget': 'Совокупный бюджет ожидания; исключая время, затраченное на сетевые запросы.',
  'k8sRetryBackoff.paramMethods':
    'Разрешенный список только для метода перехвата. POST/PATCH требует явно выраженного согласия и конечных точек.',
  'k8sRetryBackoff.paramRandom': 'Случайный источник возвращает конечное число в [0, 1] для детерминистского графика.',
  'k8sRetryBackoff.retryContract':
    'Значения по умолчанию: пять попыток, экспоненциальный падающий механизм с одинаковым смещением, до 250 мс дополнительного времени на подсказки сервера, 30 секунд на ожидание и 60 секунд общего времени запланированных ожиданий. Подсказки, превышающие размер, останавливают повторные попытки. Интерсепторы повторно выполняют идемпотентные методы по умолчанию; POST/PATCH требуют гарантии на стороне сервера.',
  'k8sRetryBackoff.paramMinDelay':
    'Минимальное запасное ожидание каждой стратегии драки; не может превышать maxDelayMs. Намеки сервера остаются неизменными.',
  'k8sRetryBackoff.paramStatuses':
    'Статусы HTTP. Другие ошибки распространяются без изменений; дополнительные статусы требуют пересмотра конечных точек.',
  'k8sRetryBackoff.paramPredicate':
    'Дополнительный фильтр ошибки, применяемый после проверки состояния. Он не позволяет POST/PATCH самостоятельно.',
  'k8sRetryBackoff.paramLogRetries':
    'Предоставить возможность повторной обработки данных после задержки с проверкой бюджета ожидания.',
  'k8sRetryBackoff.paramLabel':
    'Наклейка журнала. Генерированные наклейки перехватчика опускают строки запросов и фрагменты; отредактируют индивидуальные наклейки.',
  'k8sRetryBackoff.paramLogger':
    'Необязательная функция журналирования получает attempt, maxRetries, delayMs, error и label. Скрывайте конфиденциальные данные ошибок; ошибки журналирования не останавливают повторные попытки.',
  'k8sRetryBackoffInterceptor.postDefault': 'POST: по умолчанию (без повторной попытки)',
  'k8sRetryBackoffInterceptor.postOptIn': 'POST: прямой вариант Kubernetes',
  'k8sRetryBackoffInterceptor.postGateway': 'POST: вход 429 (отклонён)',
  'demoApi.key-value-inputs-demo.inputs.formArray':
    'Пример данных из родительского компонента, используемый для управления парами ключ-значение.',
  'demoApi.key-value-inputs-demo.inputs.data':
    'Начальные данные для предзаполнения формы с существующими парами ключ-значение.',
  'demoApi.key-value-inputs-demo.inputs.uniqueKey':
    'Установите <code>true</code>, чтобы включить проверку уникальности ключа. Использует <code>UniqueValidator</code> из ngx-lift.',
  'demoApi.key-value-inputs-demo.inputs.keyHelper': 'Помощниковая текст для поля ввода ключа.',
  'demoApi.key-value-inputs-demo.inputs.valueHelper': 'Помощниковая текст для поля ввода значения.',
  'demoApi.key-value-inputs-demo.inputs.addText': 'Кнопка «Добавить пару ключ-значение».',
  'demoApi.key-value-inputs-demo.inputs.inputSize': 'Размер полей ввода.',
  'demoApi.key-value-inputs-demo.inputs.buttonClass':
    'Пользовательский класс для применения к кнопке «Добавить пару ключ-значение».',
  'demoApi.key-value-inputs-demo.inputs.smartMode':
    'Если установлено в <code>true</code>, компонент автоматически создаст одну пару ключ-значение, если нет полей ввода ключ-значение.',
  'demoApi.key-value-inputs-demo.inputs.keyPattern':
    'Если для контроля ключа нужно передать пользовательский регулярный выражение. Можно передать объект с двумя ключами: <code>regex</code> и <code>message</code>. Свойство <code>message</code> является необязательным.',
  'demoApi.key-value-inputs-demo.inputs.valuePattern':
    'Аналогично <code>keyPattern</code>, но используется для проверки валидности значения.',
  'demoApi.key-value-inputs-demo.outputs.removeKeyValue':
    'Событие, которое происходит, когда пара ключ-значение удаляется. Предоставляет индекс удаленной пары.',
  'demoApi.key-value-inputs-demo.outputs.addKeyValue':
    'Событие, которое происходит, когда добавляется новая пара ключ-значение.',
  'demoApi.multi-alerts-demo.methods.addAlert(options: Alert)': 'Добавляет новый alert с указанными опциями.',
  'demoApi.multi-alerts-demo.methods.deleteAlert(id: symbol)': 'Удаляет alert по его ID.',
  'demoApi.multi-alerts-demo.methods.clearAlerts()': 'Очищает все alerts.',
  'demoApi.multi-alerts-demo.alertProperties.content': 'Сообщение alerts. Поддерживается безопасная форматировка HTML.',
  'demoApi.multi-alerts-demo.alertProperties.alertType': 'Тип alerts.',
  'demoApi.multi-alerts-demo.alertProperties.actions':
    'Нативные кнопки. Каждое действие предоставляет <code>label: string</code> и <code>onClick: () => void</code>.',
  'demoApi.multi-alerts-demo.alertProperties.isAppLevel': 'Является ли это alerts на уровне приложения.',
  'demoApi.multi-alerts-demo.alertProperties.targetSelector':
    'Селектор (ID, класс и т.п.) кликабельного элемента (кнопка, ссылка и т.п.) в любом месте содержимого alerts.',
  'demoApi.multi-alerts-demo.alertProperties.onTargetClick':
    'Функция обратного вызова выполняется, когда элемент, соответствующий <code>targetSelector</code>, внутри содержимого alert, кликается.',
  'demoApi.theme-toggle-demo.componentInputs.lang': 'Язык, явно указанный для локализованных подсказок.',
  'demoApi.theme-toggle-demo.componentOutputs.changeTheme':
    "Регулярно отправляет <code>ClarityTheme</code> ('light' | 'dark') при изменении темы.",
  'demoApi.theme-toggle-demo.serviceProperties.theme': "Текущая активная тема ('light' | 'dark').",
  'demoApi.theme-toggle-demo.serviceMethods.setTheme(newTheme: ClarityTheme)':
    'Устанавливает тему, сохраняет в хранилище и обновляет DOM.',
  'demoApi.timeline-wizard-demo.wizardInputs.timelineSteps':
    'Массив объектов <code>TimelineStep</code>, представляющих шаги в воркшопе.',
  'demoApi.timeline-wizard-demo.wizardInputs.live':
    'Контролирует, следует ли уничтожать компоненты шагов при нажатии кнопок prev/next.',
  'demoApi.timeline-wizard-demo.wizardInputs.confirmButtonText': 'Текст для кнопки "Завершить" на последнем шаге.',
  'demoApi.timeline-wizard-demo.wizardOutputs.confirmed':
    'Отправляет данные всех предыдущих шагов при нажатии кнопки завершения на последнем шаге.',
  'demoApi.timeline-wizard-demo.wizardOutputs.canceled': 'Отправляет событие, когда воркшоп отменяется.',
  'demoApi.timeline-wizard-demo.wizardOutputs.finished': 'Отправляет событие, когда воркшоп успешно завершен.',
  'demoApi.timeline-wizard-demo.wizardMethods.cancel()': 'Отменяет воркшоп и отправляет событие <code>canceled</code>.',
  'demoApi.timeline-wizard-demo.wizardMethods.nextStep()': 'Переходит к следующему шагу в воркшопе.',
  'demoApi.timeline-wizard-demo.wizardMethods.previousStep()': 'Переходит к предыдущему шагу в воркшопе.',
  'demoApi.timeline-wizard-demo.baseProperties.allStepsData':
    'Массив, содержащий данные всех шагов воркшопа. Доступен как входное свойство, доступен в <code>ngOnInit</code> и позже в жизненных циклах.',
  'demoApi.timeline-wizard-demo.baseProperties.currentStepData':
    'Данные текущего шага или <code>null</code>, если они недоступны. Доступны как входное свойство, доступны в <code>ngOnInit</code> и позже в жизненных циклах.',
  'demoApi.timeline-wizard-demo.baseProperties.form':
    'Форма группы, связанная с шагом. Установите <code>null</code> для шагов без формы. Перезапишите это свойство в вашем компоненте шага.',
  'demoApi.timeline-wizard-demo.baseProperties.next$':
    'Наблюдаемое, которое отправляет сигнал при нажатии кнопки "Next". Перезапишите его, чтобы выполнять пользовательские действия, такие как вызов API.',
  'demoApi.timeline-wizard-demo.baseProperties.stepInvalid': 'Обозначает, является ли форма шага недействительной.',
  'demoApi.timeline-wizard-demo.baseMethods.formValueToData()':
    'Преобразует значение формы шага в данные. Перезапишите этот метод, если структура формы не соответствует структуре данных шага.',
  'demoApi.timeline-wizard-demo.baseMethods.dataToFormValue(data)':
    'Преобразует данные шага в значение формы, которое можно использовать для <code>patchValue</code>. Перезапишите этот метод, если структура формы не соответствует структуре данных шага.',
  'demoApi.timeline-wizard-demo.stepProperties.state':
    "Состояние шага временной линии (например, 'not-started', 'current', 'success', 'error').",
  'demoApi.timeline-wizard-demo.stepProperties.header': 'Заголовок шага временной линии.',
  'demoApi.timeline-wizard-demo.stepProperties.title':
    'Название шага временной линии, действующее как идентификатор (должно быть уникальным). Может быть использовано для поиска данных шага через <code>getStepData</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.id':
    'Идентификатор шага временной линии, действующий как основной идентификатор. Если идентификатор не предоставлен, будет использовано название вместо него. Может быть использовано для поиска данных шага через <code>getStepData</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.description': 'Описание шага временной линии.',
  'demoApi.timeline-wizard-demo.stepProperties.component':
    'Angular-компонент, связанный с шагом временной линии. Должен наследовать <code>TimelineBaseComponent</code>.',
  'demoApi.timeline-wizard-demo.stepProperties.data':
    'Данные шага, которые будут преобразованы в данные формы компонентом временной линии и переданы компоненту шага как <code>currentStepData</code>.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStepIndex': 'Получение индекса текущего шага.',
  'demoApi.timeline-wizard-demo.serviceProperties.isFirstStep': 'Проверка, является ли текущий шаг первым шагом.',
  'demoApi.timeline-wizard-demo.serviceProperties.isLastStep': 'Проверка, является ли текущий шаг последним шагом.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStep': 'Получение объекта текущего шага.',
  'demoApi.timeline-wizard-demo.serviceProperties.currentStepData': 'Получить данные текущего шага.',
  'demoApi.timeline-wizard-demo.serviceProperties.allStepsData':
    'Получить данные всех шагов, подлежащих проверке. Возвращает массив идентификаторов шагов и данных.',
  'demoApi.timeline-wizard-demo.serviceMethods.getStepData<T>(key: string)':
    'Получить данные конкретного шага по его id или названию. Возвращает <code>null</code>, если шаг не найден.',
  'demoApi.toast-demo.methods.addToast(options: ToastOptions)': 'Создать тост с указанными опциями.',
  'demoApi.toast-demo.methods.success(options: ToastOptions)': 'Создать успешный тост с указанными опциями.',
  'demoApi.toast-demo.methods.info(options: ToastOptions)': 'Создать информационный тост с указанными опциями.',
  'demoApi.toast-demo.methods.warning(options: ToastOptions)': 'Создать предупредительный тост с указанными опциями.',
  'demoApi.toast-demo.methods.error(options: ToastOptions)': 'Создать ошибочный тост с указанными опциями.',
  'demoApi.toast-demo.toastOptions.title': 'Заголовок сообщения тоста.',
  'demoApi.toast-demo.toastOptions.description': 'Описание сообщения тоста.',
  'demoApi.toast-demo.toastOptions.toastType': 'Тип тоста.',
  'demoApi.toast-demo.toastOptions.date': 'Соответствующее время (например, "1hr ago").',
  'demoApi.toast-demo.toastOptions.manualClosable': 'Можно ли вручную закрыть тост.',
  'demoApi.toast-demo.toastOptions.timeoutSeconds':
    'Количество секунд, через которое тост автоматически закрывается. Если не указано, используется значение по умолчанию контейнера.',
  'demoApi.toast-demo.toastOptions.primaryButtonText': 'Текст для основного действия кнопки.',
  'demoApi.toast-demo.toastOptions.primaryButtonClick': 'Функция обратного вызова при нажатии на основную кнопку.',
  'demoApi.toast-demo.toastOptions.secondaryButtonText': 'Текст для кнопки второстепенного действия.',
  'demoApi.toast-demo.toastOptions.secondaryButtonClick':
    'Функция обратного вызова для клика по кнопке второстепенного действия.',
  'demoApi.toast-demo.toastOptions.closed': 'Функция обратного вызова, вызываемая при закрытии toast.',
  'demoApi.toast-demo.containerInputs.timeoutSeconds': 'Значение по умолчанию времени ожидания в секундах для toasts.',
  'demoApi.toast-demo.containerInputs.manualClosable': 'Можно ли закрывать toasts вручную по умолчанию.',
  'demoApi.toast-demo.containerInputs.topOffset': 'Расстояние от верхнего края экрана в пикселях.',
  'demoApi.tooltip-demo.inputs.cllTooltip':
    'Простая строка содержимого для tooltip. Может использоваться как сокращение для <code>cllTooltipContent</code>.',
  'demoApi.tooltip-demo.inputs.cllTooltipContent':
    'Содержимое, которое отображается в tooltip. Может быть строкой, шаблоном, ссылкой на компонент или типом компонента.',
  'demoApi.tooltip-demo.inputs.cllTooltipContentContext':
    'Объект контекста, передаваемый шаблону при использовании <code>TemplateRef</code> как содержимого.',
  'demoApi.tooltip-demo.inputs.cllTooltipWidth': 'Ширина tooltip в пикселях.',
  'demoApi.tooltip-demo.inputs.cllTooltipPosition':
    "Позиция tooltip относительно элемента. Варианты включают 'tooltip-top-right', 'tooltip-top-left' и т. д.",
  'demoApi.tooltip-demo.inputs.cllTooltipHideDelay':
    'Задержка в миллисекундах перед скрытием tooltip после выхода мыши.',
  'demoApi.mutate-resource.mutateResourceApiProps.mutation':
    'Асинхронная функция или observable, выполняющая серверную операцию записи.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.invalidateTags':
    'Теги, которые должны быть недействительны после успешной записи. Немедленно планирует повторные запросы для активных запросов.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.concurrency':
    'Стратегия для пересечений вызовов: параллельный (по умолчанию), исчерпывающий (соединяют в процессе), конкатенация (очередная).',
  'demoApi.mutate-resource.mutateResourceApiProps.options.injector':
    'Вариативный явный Angular Injector для регистрации сигнала вне контекста инъекции.',
  'demoApi.mutate-resource.mutateResourceApiProps.options.client':
    'Вариативный персонализированный QueryClient (по умолчанию QUERY_CLIENT token).',
  'demoApi.mutate-resource.mutateResourceRefApiProps.value':
    'Сигнал, содержащий последний успешно разрешенный результат мутации.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.error':
    'Сигнал, содержащий последний ошибку мутации, или null, если система в порядке.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.status': 'Тонкий статус жизненного цикла мутации.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.isLoading': 'Истина, пока выполняется операция мутации.',
  'demoApi.mutate-resource.mutateResourceRefApiProps.mutate(args)':
    'Запускает мутацию с аргументами и возвращает Promise, завершающийся результатом или отказом.',
  'demoApi.query-resource.queryResourceApiProps.definition':
    'Реактивная фабрика с загрузчиком Observable или Promise; undefined отключает ресурс.',
  'demoApi.query-resource.queryResourceApiProps.options.pollInterval':
    'Миллисекунды между завершенными запросами. Синхронизировано между всеми активными наблюдателями.',
  'demoApi.query-resource.queryResourceApiProps.options.injector':
    'Вариативный персонализированный Angular Injector для регистрации сигнала вне контекста инъекции.',
  'demoApi.query-resource.queryResourceApiProps.options.client':
    'Вариативный персонализированный QueryClient (по умолчанию QUERY_CLIENT token).',
  'demoApi.query-resource.queryResourceDefinitionProps.key':
    'Массив JSON-совместимых значений, уникально идентифицирующих запрос (например, ["user", id]).',
  'demoApi.query-resource.queryResourceDefinitionProps.loader':
    'Функция получения данных, принимающая { abortSignal, refresh }. Наблюдаемые чтения автоматически завершаются после первого эмиссия.',
  'demoApi.query-resource.queryResourceDefinitionProps.tags':
    'Вариативные теги для недействительности кэша (например, [{ type: "users" }]).',
  'demoApi.query-resource.queryResourceDefinitionProps.staleTime':
    'Продолжительность в миллисекундах, до которой данные из кэча считаются устаревшими.',
  'demoApi.query-resource.queryResourceDefinitionProps.gcTime':
    'Продолжительность в миллисекундах (по умолчанию 5 минут) для хранения непримененных запросов в кэше.',
  'demoApi.query-resource.queryResourceDefinitionProps.cancelOnNoObservers':
    'Включает ли отмену в пути передачи запроса, если все наблюдатели удаляются до завершения.',
  'demoApi.query-resource.queryResourceRefApiProps.value':
    'Сигнал, содержащий последние успешно разрешенные данные запроса.',
  'demoApi.query-resource.queryResourceRefApiProps.error':
    'Сигнал, содержащий последнюю ошибку, или null, когда состояние здоровое.',
  'demoApi.query-resource.queryResourceRefApiProps.status':
    'Гранularный статус: "idle" | "loading" | "reloading" | "resolved" | "error".',
  'demoApi.query-resource.queryResourceRefApiProps.isLoading': 'Истинно, когда состояние "loading" или "reloading".',
  'demoApi.query-resource.queryResourceRefApiProps.isStale':
    'Истинно, когда данные превысили staleTime или были недействительны из-за мутации.',
  'demoApi.query-resource.queryResourceRefApiProps.hasValue()':
    'Значение узкого типа предиката narrowing value() для исключения undefined, когда есть действительные данные.',
  'demoApi.query-resource.queryResourceRefApiProps.reload()':
    'Срабатывает фоновый обновления без очистки существующих данных (состояние: "reloading").',
  'demoApi.query-resource.queryResourceRefApiProps.execute()':
    'Силует немедленное свежее получение и возвращает Promise, завершающийся результатом.',
  'demoApi.query-resource.queryResourceRefApiProps.destroy()':
    'Отсоединяет этот наблюдатель без отмены общих запросов, если другие наблюдатели остаются.',
  'demoApi.resource-async.definitionProperties.params':
    'Пусть реактивный чистый параметр функция захвата. Сигналы чтения здесь отслеживаются.',
  'demoApi.resource-async.definitionProperties.loader':
    'Фабрика, получает последний параметры и context.abortSignal. Сигналы чтения здесь не отслеживаются.',
  'demoApi.resource-async.optionsProperties.defaultValue':
    'Значение по умолчанию до первого получения; гарантирует, что value() возвращает T (никогда undefined). Алиас для initialValue.',
  'demoApi.resource-async.optionsProperties.preserveValueOnError':
    'Сохраняет последнее полученное или локальное значение при возникновении ошибки.',
  'demoApi.resource-async.optionsProperties.reactive':
    'Нужно ли параметры/источники зависимостей запускать автоматическое повторное выполнение.',
  'demoApi.resource-async.optionsProperties.injector':
    'Опциональный кастомный инжектор, если вызывается вне контекста ведения инъекции.',
  'demoApi.resource-async.optionsProperties.equal':
    'Кастомный сравнительный компаратор, переданный подлежащему computed signal.',
  'demoApi.resource-async.returnsProperties.value': 'Текущее значение ресурса.',
  'demoApi.resource-async.returnsProperties.error': 'Текущая ошибка, если она есть.',
  'demoApi.resource-async.returnsProperties.status':
    "Текущее состояние: 'idle' | 'loading' | 'reloading' | 'resolved' | 'local' | 'error'.",
  'demoApi.resource-async.returnsProperties.isLoading':
    "Сигнал, возвращающий true, если выполняется любая операция получения ('loading' или 'reloading').",
  'demoApi.resource-async.returnsProperties.isIdle':
    "Сигнал, возвращающий true, если ресурс находится в состоянии 'idle' (никогда не загружался).",
  'demoApi.resource-async.returnsProperties.hasValue()':
    'Значение узкого приведения типа для value(), чтобы исключить undefined при true.',
  'demoApi.resource-async.returnsProperties.reload()':
    'Ручное запуск перезагрузки ресурса. Идеально для запросов (GET).',
  'demoApi.resource-async.returnsProperties.execute()':
    'Ручное запуск выполнения, возвращающий awaitable Promise. Идеально для изменений (POST/PUT/DELETE).',
  'demoApi.resource-async.returnsProperties.set()':
    'Ручное обновление значения ресурса, переходящее состояние в "local".',
  'demoApi.resource-async.returnsProperties.update()':
    'Обновление значения ресурса с использованием функции обновления, переходящее состояние в "local".',
  'demoApi.resource-async.returnsProperties.reset()':
    "Сброс ресурса в исходное состояние 'idle' и отмена в процессе операций.",
  'demoApi.resource-async.returnsProperties.destroy()':
    'Постоянно остановить наблюдение и отменить запланированные задачи.',
  'demoApi.date-range-validator.optionsProperties.compareTime': 'Нужно ли сравнивать время. По умолчанию false.',
  'certificate.loading': 'Загрузка сертификата…',
  'certificate.loadFailed': 'Не удалось загрузить сведения о сертификате. Обновите страницу и повторите попытку.',
  'fileReader.validationUnavailable':
    'Не удалось загрузить проверку сертификата. Обновите страницу и повторите попытку.',
  'queryExamples.failureTitle': 'Ошибки и восстановление',
  'queryExamples.failureIntro':
    'Сохраняйте успешные данные, ограничивайте чтение и повторяйте только сбойные операции.',
  'queryExamples.initialFailure': 'Ошибка первого чтения',
  'queryExamples.initialFailureMessage': 'Данных пока нет. Повторите чтение.',
  'queryExamples.refreshFailure': 'Ошибка обновления с сохранением данных',
  'queryExamples.refreshFailureMessage': 'Обновление не удалось. Показан последний успешный результат.',
  'queryExamples.failureData': 'Последнее успешное значение: {0}',
  'queryExamples.retryRead': 'Повторить чтение',
  'queryExamples.failRefresh': 'Вызвать ошибку обновления',
  'queryExamples.failObserver': 'Смоделировать ошибку наблюдателя',
  'queryExamples.automaticRetry': 'Ограниченные автоматические повторы',
  'queryExamples.retryIntro': 'Две временные ошибки, затем успех. Читатели используют общий цикл повторов.',
  'queryExamples.startRetry': 'Запустить повторы Observable',
  'queryExamples.startPromise': 'Запустить повторы Promise',
  'queryExamples.deadline': 'Срок логического чтения',
  'queryExamples.deadlineIntro': 'Это чтение не выдаёт данные. По истечении срока подписка освобождается.',
  'queryExamples.startDeadline': 'Запустить зависшее чтение',
  'queryExamples.deadlineMessage': 'Срок чтения истёк. Можно повторить.',
  'queryExamples.canceledReads': 'Отменённых подписок: {0}',
  'queryExamples.partialFailure': '2. Частичная ошибка списка и гранулярное восстановление',
  'queryExamples.mutationFailure': 'Ошибка записи',
  'queryExamples.mutationIntro':
    'Записи не повторяются автоматически. Эта имитация отклоняет запрос до применения записи.',
  'queryExamples.failWrite': 'Отправить сбойную запись',
  'queryExamples.submitWrite': 'Отправить запись',
  'queryExamples.writeMessage': 'Запись не удалась. Введённые данные сохранены.',
  'queryExamples.failureEvents': 'Итоговых ошибок чтения: {0}; диагностик наблюдателя: {1}',
  'queryExamples.isInitialErrorDescription': 'True при ошибке чтения без ранее успешных данных.',
  'queryExamples.isRefreshErrorDescription': 'True при ошибке обновления с сохранёнными успешными данными.',
  'queryExamples.updatedAtDescription': 'Время последнего успешного чтения.',
  'queryExamples.failureCountDescription': 'Неудачные попытки текущего чтения; после успеха ноль.',
  'queryExamples.failureReasonDescription': 'Последняя ошибка попытки или итоговая ошибка срока.',
  'queryExamples.nextRetryAtDescription': 'Время следующего повтора; null при чтении или после завершения.',
  'queryExamples.retryDescription': 'Необязательная ограниченная политика повторов. По умолчанию отключена.',
  'queryExamples.deadlineDescription': 'Общий срок с ожиданием повторов; false отключает унаследованный срок.',
  'queryExamples.recoveryFocusDescription': 'Включить обновление наблюдаемых устаревших данных при фокусе.',
  'queryExamples.recoveryReconnectDescription':
    'Включить обновление наблюдаемых устаревших данных после восстановления связи.',
  'queryExamples.title': 'Observable-запросы на практике',
  'queryExamples.intro':
    'Примеры используют HttpClient с локальным тестовым API. Переключайте арендаторов, чтобы увидеть отдельные данные и кэши.',
  'queryExamples.tenant': 'Арендатор',
  'queryExamples.tenantA': 'Арендатор A',
  'queryExamples.tenantB': 'Арендатор B',
  'queryExamples.parallel': '1. Независимые параллельные запросы',
  'queryExamples.health': 'Состояние',
  'queryExamples.refresh': 'Обновить арендатора',
  'queryExamples.fail': 'Вызвать ошибку следующего запроса',
  'queryExamples.tenantError': 'Запрос арендатора завершился ошибкой; кэш доступен.',
  'queryExamples.retry': 'Повторить запрос арендатора',
  'queryExamples.dependent': '2. Зависимый запрос и обновление после изменений',
  'queryExamples.databases': 'Базы данных',
  'queryExamples.gate': 'Запрос баз данных ожидает данные арендатора. Кэш доступен во время обновления.',
  'queryExamples.name': 'Имя базы данных',
  'queryExamples.create': 'Создать базу данных',
  'queryExamples.createError': 'Не удалось создать. Повторите операцию.',
  'queryExamples.databaseError': 'Не удалось обновить базы данных.',
  'queryExamples.retryDatabases': 'Повторить запрос баз данных',
  'queryExamples.snapshot': 'observeQueryObservable: {0}, баз данных: {1}',
  'queryExamples.service': '3. Три потребителя сервиса используют один запрос',
  'queryExamples.serviceIntro':
    'fetchQueryObservable возвращает один результат и завершается. observeQueryObservable постоянно передаёт состояние кэша.',
  'queryExamples.mount': 'Показать виджеты сервиса',
  'queryExamples.refreshWidgets': 'Обновить виджеты сервиса',
  'queryExamples.widget': 'Виджет {0}: арендатор {1}, {2}',
  'queryExamples.counts': 'Количество HTTP-запросов:',
  'queryExamples.dynamic': '1. Динамические параллельные запросы',
  'queryExamples.dynamicIntro':
    'queryResources сопоставляет выбранные ID независимым наблюдателям. Перестановка сохраняет их; удаление ID освобождает наблюдателя.',
  'queryExamples.one': 'Только арендатор A',
  'queryExamples.both': 'Оба арендатора',
  'queryExamples.reverse': 'Обратный порядок',
  'queryExamples.empty': 'Очистить выбор',
  'queryExamples.databaseA': 'База данных арендатора A',
  'queryExamples.databaseB': 'База данных арендатора B',
  'queryExamples.initialLoadingDescription': 'True при загрузке без доступных данных.',
  'queryExamples.refreshingDescription': 'True при обновлении с сохранением кэша.',
  'queryResources.k8sComparisonTitle':
    '3. Мониторинг флота: Массовая агрегация против Гранулярной реактивной коллекции',
  'queryResources.k8sComparisonDesc':
    'Сравнение двух архитектурных шаблонов для мониторинга распределенных кластеров Kubernetes: Монолитная агрегация (queryResource + forkJoin) против Гранулярной коллекции запросов (queryResources).',
  'queryResources.traditionalTab': 'Подход 1: Массовая агрегация (queryResource)',
  'queryResources.traditionalDesc':
    'Агрегирует состояние всего флота в одном монолитном сетевом запросе. Блокировка Head-of-Line: самый медленный кластер (APAC Edge @ 1200ms) задерживает отображение всех остальных кластеров.',
  'queryResources.granularTab': 'Подход 2: Гранулярная коллекция (queryResources)',
  'queryResources.granularDesc':
    'Создает независимые реактивные запросы для каждого кластера. Быстрые кластеры отображаются мгновенно (US-East @ 150ms). Каждый кластер можно перезагрузить изолированно.',
  'queryResources.refreshFleet': 'Обновить весь флот',
  'queryResources.refreshCluster': 'Обновить кластер',
  'queryResources.clusterName': 'Имя кластера',
  'queryResources.providerRegion': 'Провайдер / Регион',
  'queryResources.activeNodes': 'Активные узлы',
  'queryResources.healthStatus': 'Состояние',
  'queryResources.latency': 'Задержка',
  'queryResources.actions': 'Действия',
  'queryResources.revalidatingNotice': 'Фоновая ревалидация флота... Существующие данные остаются интерактивными.',
  'queryResources.headOfLineWarning':
    'Блокировка Head-of-Line активна: все 4 кластера ждут самый медленный (APAC Edge ~1200ms). В случае ошибки одного кластера сбоит весь снимок (если нет изолированной обработки).',
  'queryResources.progressiveNotice':
    'Прогрессивный рендеринг активен: быстрые кластеры (US-East 150ms, EU-Central 280ms) отображаются интерактивно сразу по поступлению, пока медленные продолжают загружаться.',
  'queryResources.comparisonTableTitle': 'Сравнение архитектурных параметров',
  'queryResources.dimTitle': 'Параметр',
  'queryResources.dimArch': 'Архитектурный шаблон',
  'queryResources.dimArchTraditional': 'Монолитный forkJoin / Агрегирующий эндпоинт',
  'queryResources.dimArchGranular': 'Независимая реактивная коллекция (queryResources)',
  'queryResources.dimLatency': 'Задержка и отрисовка',
  'queryResources.dimLatencyTraditional': 'Блокировка Head-of-Line: весь интерфейс ждет самый медленный кластер',
  'queryResources.dimLatencyGranular': 'Прогрессивный рендеринг: каждый кластер отображается сразу по прибытии данных',
  'queryResources.dimIsolation': 'Изоляция сбоев',
  'queryResources.dimIsolationTraditional': 'Все или ничего: одна ошибка блокирует весь флот',
  'queryResources.dimIsolationGranular': 'Полная изоляция: сбой отдельного кластера не затрагивает остальные',
  'queryResources.dimIdentity': 'Ключи кэша и идентичность',
  'queryResources.dimIdentityTraditional': 'Один монолитный ключ для всех данных',
  'queryResources.dimIdentityGranular': 'Индивидуальный атомарный ключ для каждой сущности кластера',
  'queryResources.dimReload': 'Гранулярность обновления',
  'queryResources.dimReloadTraditional': 'Только полное обновление флота (нерациональный расход трафика)',
  'queryResources.dimReloadGranular': 'Точечное обновление отдельных кластеров или по тегам флота',
  'queryResources.dimCache': 'Повторное использование кэша',
  'queryResources.dimCacheTraditional': 'Невозможно разделить между общим списком и детальной страницей кластера',
  'queryResources.dimCacheGranular': 'Бесшовное переиспользование между списком флота и карточкой кластера',
  'queryResources.prosConsTitle': 'Преимущества и компромиссы',
  'queryResources.prosTraditional':
    'Простота реализации, если бэкенд уже предоставляет агрегированный API; строго один сетевой запрос.',
  'queryResources.consTraditional':
    'Ухудшение пользовательского опыта из-за связи по задержке; каскадные сбои; не подходит для панелей с индивидуальными действиями.',
  'queryResources.prosGranular':
    'Максимальная отзывчивость благодаря постепенной загрузке; надежная изоляция ошибок; точечное управление и общий кэш.',
  'queryResources.consGranular':
    'Большее число HTTP-запросов при огромных флотах (рекомендуется пагинация при тысячах элементов).',
  'queryResource.thFailures': 'Неудачные попытки',
  'queryResource.thNextRetry': 'Следующая попытка',
  'queryGuide.selection': 'Связанные инструменты:',
  'queryGuide.basic': '1. Начните с чтения из кеша',
  'queryGuide.basicIntro':
    'Зафиксируйте арендатора один раз, используйте его в key и loader и читайте сигналы результата. Обновление сохраняет последнее успешное значение.',
  'queryGuide.configure': 'Конфигурация приложения',
  'queryGuide.collectionIntro':
    'Используйте queryResources для изменяемого списка независимых запросов. Каждый элемент имеет свой результат в кеше, состояние загрузки и действия восстановления.',
  'queryGuide.empty': 'Элементы не выбраны. Активных запросов коллекции нет.',
  'queryGuide.partialIntro':
    'Ошибка одной строки не мешает другой. Повторите только неудачный запрос, не загружая успешные строки заново.',
  'queryGuide.collectionContract':
    'Коллекция — сигнал упорядоченных ссылок на запросы. Перестановка сохраняет ссылки; удаление сразу скрывает строки и освобождает наблюдателей при выполнении effect. Повторяющиеся канонические ключи отклоняются.',
  'queryGuide.collectionLimits':
    'Используйте один тип данных в коллекции и отфильтровывайте неготовые элементы. Запросы запускаются параллельно без ограничения одновременности; большие списки разбивайте на страницы или ограничивайте выбор. maxEntries не удаляет активные или незавершенные записи.',
  'queryGuide.namingTitle': 'Имена ссылок на запросы и мутации',
  'queryGuide.namingHandles':
    'Используйте <code>userQuery</code> для одного запроса, <code>tenantQueries</code> для коллекции и <code>createMutation</code> для записи. Имена <code>user</code> или <code>tenant</code> оставляйте для полученных данных.',

  'computedAsync.failSource': 'Вызвать ошибку источника',
  'computedAsync.recoverSource': 'Восстановить источник',
  'computedAsync.readSignal': 'Прочитать signal',
  'computedAsync.lastRead': 'Последнее чтение',
  'computedAsync.notRead': 'Ещё не прочитано',
  'computedAsync.readError': 'При чтении выброшена ошибка; успешное значение не возвращено.',
  'computedAsync.readDemoHint':
    'Вызовите ошибку источника и прочитайте signal. Восстановите источник и прочитайте снова для проверки восстановления.',
};
