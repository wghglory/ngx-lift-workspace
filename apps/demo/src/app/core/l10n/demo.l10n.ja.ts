export const jaTranslations: Record<string, string> = {
  'header.selectLanguage': '言語を選択',
  'header.openGitHub': 'GitHub で開く',
  'header.codeLicensed': 'ライセンス：',

  'nav.signalUtils': 'Signal ユーティリティ',
  'nav.queryMutation': 'Query & Mutation',
  'nav.operators': 'オペレーター',
  'nav.interceptors': 'インターセプター',
  'nav.validators': 'バリデーター',
  'nav.pipes': 'パイプ',
  'nav.utilities': 'ユーティリティ',
  'nav.components': 'コンポーネント',
  'nav.pageContainer': 'ページコンテナ',
  'nav.timelineWizard': 'タイムラインウィザード',
  'nav.alert': 'アラート',
  'nav.multiAlerts': '複数アラート',
  'nav.callout': 'コールアウト',
  'nav.spinner': 'スピナー',
  'nav.toast': 'トースト',
  'nav.tooltip': 'ツールチップ',
  'nav.themeToggle': 'テーマ切り替え',
  'nav.fileReader': 'ファイルリーダー',
  'nav.keyValueInputs': 'キー・値入力',
  'nav.statusIndicator': '状態インジケーター',
  'nav.idleDetection': 'アイドル検出',
  'nav.certificate': '証明書ビューア',
  'nav.datagrid': 'データグリッド',
  'nav.byteConverter': 'バイト変換',
  'nav.mask': 'マスク',
  'nav.arrayJoin': '配列結合',
  'nav.range': '範囲',
  'nav.isHttps': 'Https 判定',
  'nav.differenceInDays': '日数差',
  'nav.badgeNew': '新規',
  'nav.badgeUpdated': '更新',
  'nav.badgePopular': '人気',
  'nav.badgeCore': 'コア',

  'common.examples': '使用例',
  'common.apiReference': 'API リファレンス',
  'common.overview': '概要',
  'common.parameters': 'パラメーター',
  'common.returns': '戻り値',
  'common.signature': 'シグネチャ',
  'common.description': '説明',
  'common.basicUsage': '基本的な使い方',
  'common.example': '例',
  'common.example1': '例 1: 基本的な使い方',
  'common.example2': '例 2: RxJS パイプオペレーターの使用',
  'common.example3': '例 3: 非同期コードの処理',
  'common.example4': '例 4: 分離されたインジェクター',

  'playground.beginner': '初級',
  'playground.intermediate': '中級',
  'playground.advanced': '上級',
  'playground.copy': 'コピー',
  'playground.copied': 'コピー完了',
  'playground.viewCode': 'コードを表示',
  'playground.hideCode': 'コードを非表示',
  'playground.stackedLayout': '縦積みレイアウト',
  'playground.splitLayout': '左右分割レイアウト',

  'inspector.liveState': 'リアルタイム Signal 状態',
  'inspector.rawJson': '未加工の JSON 状態',

  'mergeFrom.overview':
    '<code>mergeFrom</code> 関数は Observable または Signal の値をマージし、最新の値を発行します。発行前に RxJS オペレーターを使用して値を変更することもできます。',
  'mergeFrom.example1Desc': '複数の Signal または Observable をマージする：',
  'mergeFrom.example2Desc': 'RxJS パイプオペレーターを渡して発行された値を操作する：',
  'mergeFrom.example3Desc':
    '<code>startWith</code> または <code>initialValue</code> オプションを使用して非同期 Observable を処理する：',
  'mergeFrom.example4Desc':
    'オプションオブジェクト経由でカスタム <code>Injector</code> を渡してマージされた Signal を作成する：',
  'mergeFrom.apiSummary': '複数の Observable または Signal を単一の Signal にマージします。',

  // k8sRetryBackoff Operator (ja)
  'k8sRetryBackoff.configSummary': 'オペレーターとインターセプターファクトリで共有されるオプション設定。',
  'k8sRetryBackoff.paramMaxAttempts': '初回リクエストを含む最大試行回数。1 に設定するとリトライが無効になります。',
  'k8sRetryBackoff.errorShape':
    'HttpErrorResponse または <code>{ status, headers?, error? }</code> の形式のオブジェクト（<code>error</code> 内の JSON 文字列を含む）を受け入れます。ネイティブ fetch は HTTP 429 で reject しないため、Response を確認して status、headers、解析済み body を変換してください。Axios はこれらを <code>error.response</code> に格納するため、ヘルパーを呼び出す前に変換してください。ヘルパーは遅延のみを計算します。',
  'k8sRetryBackoffInterceptor.overrideRules':
    '<code>null</code> はインターセプターのデフォルトを使用し、<code>false</code> はリトライを無効化します。ファクトリはリクエストごとの設定をデフォルトとマージします。このインターセプターは URL や HTTP メソッドに関係なくすべての HttpClient 429 を処理するため、即座に失敗させる必要があるリクエストではオプトアウトしてください。',
  'k8sRetryBackoffInterceptor.overrideSimulation':
    '最初の 429 で即座に失敗するプローブや、成功する前に 2 回の 429 を受信するワークロード読み取りを試すことができます。カスタム読み取りは maxAttempts: 10 と 200ms のフォールバックを使用し、最大 9 回のリトライを許可します。',
  'k8sRetryBackoffInterceptor.btnWorkloads': 'ワークロード読み取りテスト (10回試行)',
  'k8sRetryBackoffInterceptor.btnProbe': '高速プローブテスト (オプトアウト)',

  'k8sRetryBackoff.overview':
    '<code>retryOnK8sBackoff</code> は、<strong>Kubernetes API のレート制限 (HTTP 429 Too Many Requests)</strong> 専用に設計された RxJS リトライオペレーターです。Kubernetes API サーバーから返される <code>Retry-After</code> HTTP ヘッダーまたは <code>details.retryAfterSeconds</code> フィールドを優先して遅延し、どちらも提供されていない場合は設定可能なフォールバック遅延を使用します。',
  'k8sRetryBackoff.callout':
    'すべての <code>HttpClient</code> 呼び出しにグローバルなリトライ保護が必要ですか？リクエストごとの配線が不要な <a href="/ngx-lift/interceptors/k8sRetryBackoff"><code>k8sRetryBackoffInterceptor</code></a> をご覧ください。',
  'k8sRetryBackoff.diffTitle': 'アーキテクチャ比較：Operator と Interceptor',
  'k8sRetryBackoff.diffDesc': '両ツールは同じリトライ遅延計算ロジックを共有していますが、適用範囲と役割が異なります：',
  'k8sRetryBackoff.diffColFeature': '機能',
  'k8sRetryBackoff.diffColOperator': 'retryOnK8sBackoff (オペレーター)',
  'k8sRetryBackoff.diffColInterceptor': 'k8sRetryBackoffInterceptor (インターセプター)',
  'k8sRetryBackoff.diffScope': '適用範囲',
  'k8sRetryBackoff.diffScopeOp':
    'ローカル：<code>.pipe(retryOnK8sBackoff(...))</code> で指定した特定の Observable にのみ適用。',
  'k8sRetryBackoff.diffScopeInt': 'グローバル：アプリケーション内のすべての送信 HTTP リクエストを自動インターセプト。',
  'k8sRetryBackoff.diffUseCases': '主なユースケース',
  'k8sRetryBackoff.diffUseCasesOp': 'ポーリングストリーム、バックグラウンド処理、HttpClient 以外の Observable。',
  'k8sRetryBackoff.diffUseCasesInt':
    '個別サービスを変更することなく、すべての REST/Kubernetes 呼び出しに適用する基本保護。',
  'k8sRetryBackoff.diffConfig': '設定とオプトアウト',
  'k8sRetryBackoff.diffConfigOp': 'オペレーター引数を通じてストリームごとにインライン設定。',
  'k8sRetryBackoff.diffConfigInt':
    '<code>app.config.ts</code> でグローバル設定し、<code>HttpContext</code> でリクエスト単位の上書きや無効化が可能。',
  'k8sRetryBackoff.example1Title': '例 1：インタラクティブ・シミュレーターとパイプライン利用',
  'k8sRetryBackoff.example1Desc':
    'さまざまな Kubernetes API レスポンスをシミュレートし、retryOnK8sBackoff による遅延解決やエラー伝播を確認できます（コード例併記）：',
  'k8sRetryBackoff.selectScenario': 'レスポンスシナリオを選択：',
  'k8sRetryBackoff.scenarioHeader': '429 (Retry-After: 1 ヘッダー)',
  'k8sRetryBackoff.scenarioBody': '429 (details.retryAfterSeconds: 1.5 JSON ボディ)',
  'k8sRetryBackoff.scenarioFallback': '429 (ヘッダーなし、1秒フォールバック遅延)',
  'k8sRetryBackoff.scenarioNon429': '500 Internal Server Error (リトライ不可、即座にエラー)',
  'k8sRetryBackoff.scenarioExhausted': '429 連続5回 (最大試行回数の超過)',
  'k8sRetryBackoff.btnSimulate': 'リクエストをシミュレートしてリトライ',
  'k8sRetryBackoff.btnClearLogs': 'ログを消去',
  'k8sRetryBackoff.logTitle': '実行ログ：',
  'k8sRetryBackoff.example2Title': '例 2：スタンドアロン遅延抽出ヘルパー (getK8sRetryDelayMs)',
  'k8sRetryBackoff.example2Desc':
    '独自のリトライループや Promise 内で Kubernetes バックオフ遅延を抽出するには getK8sRetryDelayMs を直接使用します：',
  'k8sRetryBackoff.sampleErrorLabel': 'サンプルのエラーレスポンス：',
  'k8sRetryBackoff.helperHeader': '429 (Retry-After: 3秒)',
  'k8sRetryBackoff.helperBody': '429 (retryAfterSeconds: 2秒)',
  'k8sRetryBackoff.helperFallback': '429 (ヒントなし、1秒フォールバック)',
  'k8sRetryBackoff.helperNon429': '500 (非429エラー)',
  'k8sRetryBackoff.btnExtractDelay': '遅延を抽出 (getK8sRetryDelayMs)',
  'k8sRetryBackoff.retryableError': 'リトライ可能な Kubernetes 429 バックオフ',
  'k8sRetryBackoff.nonRetryableError': 'リトライ不可のエラー',
  'k8sRetryBackoff.apiSummary': 'Kubernetes のバックオフ指示に従って HTTP 429 時に Observable をリトライします。',
  'k8sRetryBackoff.paramConfig': '最大試行回数およびフォールバック遅延のオプション設定。',
  'k8sRetryBackoff.delaySummary':
    'エラーオブジェクトからバックオフ遅延（ミリ秒）を抽出します（リトライ不可時は null）。',
  'k8sRetryBackoff.paramError': '検査対象のエラー (HttpErrorResponse または status/headers/error を持つオブジェクト)。',
  'k8sRetryBackoff.paramFallbackDelay': 'レスポンスにリトライ指示がない場合のフォールバック遅延 (ミリ秒)。',

  // k8sRetryBackoffInterceptor (ja)
  'k8sRetryBackoffInterceptor.overview':
    '<code>k8sRetryBackoffInterceptor</code> は Angular 関数型 HTTP インターセプター (<code>HttpInterceptorFn</code>) です。<code>Retry-After</code> ヘッダーや <code>details.retryAfterSeconds</code> を自動解析し、<strong>HTTP 429 (Too Many Requests)</strong> に対するグローバルな保護を提供します。',
  'k8sRetryBackoffInterceptor.callout':
    '特定のストリーム単位のリトライやポーリング制御が必要ですか？専用オペレーター <a href="/ngx-lift/operators/k8sRetryBackoff"><code>retryOnK8sBackoff</code></a> をご覧ください。',
  'k8sRetryBackoffInterceptor.example1Title': '例 1：グローバル登録とインタラクティブ・シミュレーター',
  'k8sRetryBackoffInterceptor.example1Desc':
    'app.config.ts でインターセプターを登録すると、すべての HttpClient コールが HTTP 429 時に自動リトライされます：',
  'k8sRetryBackoffInterceptor.selectMode': 'インターセプターコンテキストモード：',
  'k8sRetryBackoffInterceptor.modeDefault': 'デフォルトのグローバル保護 (429 を1秒遅延でリトライ後、200 OK)',
  'k8sRetryBackoffInterceptor.modeCustom': 'カスタム HttpContext (400ms のフォールバック遅延)',
  'k8sRetryBackoffInterceptor.modeDisabled': 'HttpContext で無効化 (HttpContextToken = false、即座に失敗)',
  'k8sRetryBackoffInterceptor.btnSend': 'インターセプト対象リクエストを送信',
  'k8sRetryBackoffInterceptor.example2Title': '例 2：リクエスト単位のカスタマイズとオプトアウト',
  'k8sRetryBackoffInterceptor.example2Desc':
    'HttpContext で K8S_RETRY_BACKOFF_CONFIG を設定し、個別の上書きやヘルスチェック時のリトライ無効化を行えます：',
  'k8sRetryBackoffInterceptor.apiSummary':
    'Kubernetes バックオフを用いて HTTP 429 レスポンスをリトライする関数型インターセプター。',
  'k8sRetryBackoffInterceptor.factorySummary': 'カスタムデフォルト設定を持つインターセプターを生成するファクトリ関数。',
  'k8sRetryBackoffInterceptor.tokenSummary':
    'リクエスト単位でリトライ設定を上書きまたは無効化するための HttpContextToken。',
  'k8sRetryBackoffInterceptor.paramDefaultConfig':
    'HttpContext で上書きされない限りすべてのリクエストに適用されるデフォルト設定。',
  'header.partialLanguage': '一部のみ翻訳されています。未翻訳の文章は英語で表示されます。',
};
