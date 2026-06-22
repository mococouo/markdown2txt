const els = {
    markdownInput: document.getElementById('markdown-input'),
    txtOutput: document.getElementById('txt-output'),
    languageSelect: document.getElementById('language-select'),
    dropArea: document.getElementById('drop-area'),
    fileUpload: document.getElementById('file-upload'),
    pasteBtn: document.getElementById('paste-btn'),
    sampleBtn: document.getElementById('sample-btn'),
    convertBtn: document.getElementById('convert-btn'),
    copyBtn: document.getElementById('copy-btn'),
    downloadBtn: document.getElementById('download-btn'),
    downloadAllBtn: document.getElementById('download-all-btn'),
    downloadZipBtn: document.getElementById('download-zip-btn'),
    clearInputBtn: document.getElementById('clear-input-btn'),
    clearFilesBtn: document.getElementById('clear-files-btn'),
    fileList: document.getElementById('file-list'),
    statusBar: document.getElementById('status-bar'),
    activeFileLabel: document.getElementById('active-file-label'),
    inputStats: document.getElementById('input-stats'),
    outputStats: document.getElementById('output-stats'),
    keepLinks: document.getElementById('keep-links'),
    keepCode: document.getElementById('keep-code'),
    removeFrontmatter: document.getElementById('remove-frontmatter'),
    autoConvert: document.getElementById('auto-convert'),
    themeBtn: document.getElementById('theme-btn'),
    presetSelect: document.getElementById('preset-select'),
    helpBtn: document.getElementById('help-btn'),
    helpDialog: document.getElementById('help-dialog'),
    helpClose: document.getElementById('help-close'),
    segments: [...document.querySelectorAll('.segment')],
};

const languageMeta = {
    en: { label: 'English', htmlLang: 'en', dir: 'ltr' },
    zh: { label: '简体中文', htmlLang: 'zh-CN', dir: 'ltr' },
    'zh-TW': { label: '繁體中文', htmlLang: 'zh-TW', dir: 'ltr' },
    ja: { label: '日本語', htmlLang: 'ja', dir: 'ltr' },
    ko: { label: '한국어', htmlLang: 'ko', dir: 'ltr' },
    es: { label: 'Español', htmlLang: 'es', dir: 'ltr' },
    pt: { label: 'Português', htmlLang: 'pt', dir: 'ltr' },
    th: { label: 'ไทย', htmlLang: 'th', dir: 'ltr' },
    he: { label: 'עברית', htmlLang: 'he', dir: 'rtl' },
    ru: { label: 'Русский', htmlLang: 'ru', dir: 'ltr' },
    ar: { label: 'العربية', htmlLang: 'ar', dir: 'rtl' },
    fr: { label: 'Français', htmlLang: 'fr', dir: 'ltr' },
    de: { label: 'Deutsch', htmlLang: 'de', dir: 'ltr' },
    it: { label: 'Italiano', htmlLang: 'it', dir: 'ltr' },
    hi: { label: 'हिन्दी', htmlLang: 'hi', dir: 'ltr' },
    id: { label: 'Bahasa Indonesia', htmlLang: 'id', dir: 'ltr' },
    vi: { label: 'Tiếng Việt', htmlLang: 'vi', dir: 'ltr' },
    tr: { label: 'Türkçe', htmlLang: 'tr', dir: 'ltr' },
    pl: { label: 'Polski', htmlLang: 'pl', dir: 'ltr' },
    nl: { label: 'Nederlands', htmlLang: 'nl', dir: 'ltr' },
};

const state = {
    lang: localStorage.getItem('markdown2txt-lang') || 'en',
    mode: 'normal',
    files: [],
    activeFileId: null,
    manualLabelKey: 'manualInput',
    theme: 'light',
};

const settingKeys = {
    mode: 'markdown2txt-mode',
    keepLinks: 'markdown2txt-keep-links',
    keepCode: 'markdown2txt-keep-code',
    removeFrontmatter: 'markdown2txt-remove-frontmatter',
    autoConvert: 'markdown2txt-auto-convert',
    theme: 'markdown2txt-theme',
};

const validModes = ['normal', 'clean', 'structured'];

const translations = {
    en: {
        appTitle: 'Markdown to TXT',
        appSubtitle: 'Offline converter · Batch ready · Privacy first',
        languageLabel: 'Language',
        paste: 'Paste',
        openFiles: 'Open files',
        sample: 'Sample',
        settingsAria: 'Conversion settings',
        modeTitle: 'Conversion style',
        modeNormal: 'Standard',
        modeClean: 'Clean',
        modeStructured: 'Structured',
        rulesTitle: 'Output rules',
        keepLinks: 'Keep link URLs',
        keepCode: 'Keep code blocks',
        removeFrontmatter: 'Remove front matter',
        autoConvert: 'Auto convert while typing',
        fileQueue: 'File queue',
        clear: 'Clear',
        dropTitle: 'Drop Markdown files here',
        dropSubtitle: 'Supports .md, .markdown and .txt files',
        manualInput: 'Manual input',
        clipboardContent: 'Clipboard content',
        sampleContent: 'Sample content',
        convert: 'Convert',
        copyResult: 'Copy result',
        convertTitle: 'Convert (Ctrl+Enter)',
        copyTitle: 'Copy result (Ctrl+Shift+C)',
        downloadCurrent: 'Download current',
        downloadAll: 'Download all',
        downloadZip: 'Download ZIP',
        themeToggle: 'Toggle theme',
        helpTitle: 'Keyboard shortcuts',
        presetTitle: 'Preset',
        presetNone: '— Custom —',
        presetAi: 'AI dataset cleaning',
        presetArchive: 'Documentation archive',
        presetPublish: 'Publishing',
        presetApplied: ({ name }) => `Preset applied: ${name}`,
        removeFile: 'Remove file',
        fileRemoved: 'File removed',
        zipDownloaded: ({ count }) => `Downloaded ZIP with ${count} files`,
        skipToInput: 'Skip to input',
        helpConvert: 'Convert',
        helpCopy: 'Copy result',
        helpDownload: 'Download current',
        helpToggle: 'Toggle this help',
        helpClose2: 'Close dialog',
        inputPlaceholder: 'Paste Markdown here, or drop files to start converting',
        outputPlaceholder: 'Converted TXT will appear here',
        privacyNote: 'Everything is processed locally in your browser',
        ready: 'Ready',
        switchedMode: ({ mode }) => `Switched to ${mode} mode`,
        clipboardEmpty: 'Clipboard is empty',
        pastedConverted: 'Pasted and converted',
        clipboardBlocked: 'Clipboard access blocked. Paste manually instead.',
        sampleLoaded: 'Sample loaded',
        unsupportedFiles: 'Choose .md, .markdown or .txt files',
        fileTooLarge: ({ name }) => `File too large (max 5MB): ${name}`,
        loadedFiles: ({ count, rejected }) => `Loaded ${count} file${count === 1 ? '' : 's'}${rejected ? `, skipped ${rejected}` : ''}`,
        readFailed: ({ error }) => `Failed to read file: ${error}`,
        converted: ({ ms }) => `Converted · ${ms}ms`,
        noCopy: 'Nothing to copy',
        resultCopied: 'Result copied',
        fallbackCopied: 'Copied with compatibility mode',
        noDownload: 'Nothing to download',
        downloaded: ({ file }) => `Downloaded ${file}`,
        batchDownloaded: ({ count }) => `Merged ${count} files into one download`,
        currentCleared: 'Current content cleared',
        filesCleared: 'File queue cleared',
        codeStart: ({ lang }) => `--- Code${lang ? ` ${lang}` : ''} start ---`,
        codeEnd: '--- Code end ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} chars · ${lines} lines · ${words} words · ${minutes} min`,
    },
    zh: {
        appTitle: 'Markdown 转 TXT',
        appSubtitle: '本地离线转换 · 批量处理 · 隐私优先',
        languageLabel: '语言',
        paste: '粘贴',
        openFiles: '打开文件',
        sample: '示例',
        settingsAria: '转换设置',
        modeTitle: '转换样式',
        modeNormal: '标准',
        modeClean: '纯净',
        modeStructured: '结构化',
        rulesTitle: '输出规则',
        keepLinks: '保留链接地址',
        keepCode: '保留代码块内容',
        removeFrontmatter: '移除 front matter',
        autoConvert: '输入时自动转换',
        fileQueue: '文件队列',
        clear: '清空',
        dropTitle: '拖入 Markdown 文件',
        dropSubtitle: '支持 .md、.markdown、.txt，可多选',
        manualInput: '手动输入',
        clipboardContent: '剪贴板内容',
        sampleContent: '示例内容',
        convert: '转换',
        copyResult: '复制结果',
        convertTitle: '转换（Ctrl+Enter）',
        copyTitle: '复制结果（Ctrl+Shift+C）',
        downloadCurrent: '下载当前',
        downloadAll: '下载全部',
        downloadZip: '下载 ZIP',
        themeToggle: '切换主题',
        helpTitle: '快捷键',
        presetTitle: '预设',
        presetNone: '— 自定义 —',
        presetAi: 'AI 数据清洗',
        presetArchive: '文档归档',
        presetPublish: '发布',
        presetApplied: ({ name }) => `已应用预设：${name}`,
        removeFile: '移除文件',
        fileRemoved: '已移除文件',
        zipDownloaded: ({ count }) => `已下载 ZIP，含 ${count} 个文件`,
        skipToInput: '跳到输入框',
        helpConvert: '转换',
        helpCopy: '复制结果',
        helpDownload: '下载当前',
        helpToggle: '切换此帮助',
        helpClose2: '关闭对话框',
        inputPlaceholder: '在这里粘贴 Markdown，或拖入文件开始转换',
        outputPlaceholder: '转换结果会显示在这里',
        privacyNote: '所有内容只在浏览器本地处理',
        ready: '就绪',
        switchedMode: ({ mode }) => `已切换为${mode}模式`,
        clipboardEmpty: '剪贴板为空',
        pastedConverted: '已粘贴并转换',
        clipboardBlocked: '无法读取剪贴板，请手动粘贴',
        sampleLoaded: '已载入示例',
        unsupportedFiles: '请选择 .md、.markdown 或 .txt 文件',
        fileTooLarge: ({ name }) => `文件过大（最大 5MB）：${name}`,
        loadedFiles: ({ count, rejected }) => `已加载 ${count} 个文件${rejected ? `，跳过 ${rejected} 个不支持文件` : ''}`,
        readFailed: ({ error }) => `读取文件失败：${error}`,
        converted: ({ ms }) => `转换完成 · ${ms}ms`,
        noCopy: '没有可复制的内容',
        resultCopied: '结果已复制',
        fallbackCopied: '已尝试使用兼容模式复制',
        noDownload: '没有可下载的内容',
        downloaded: ({ file }) => `已下载 ${file}`,
        batchDownloaded: ({ count }) => `已合并下载 ${count} 个文件`,
        currentCleared: '已清空当前内容',
        filesCleared: '文件队列已清空',
        codeStart: ({ lang }) => `--- 代码${lang ? ` ${lang}` : ''}开始 ---`,
        codeEnd: '--- 代码结束 ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} 字 · ${lines} 行 · ${words} 词 · ${minutes} 分钟`,
    },
};

function withFallback(overrides) {
    return { ...translations.en, ...overrides };
}

Object.assign(translations, {
    'zh-TW': withFallback({
        appTitle: 'Markdown 轉 TXT',
        appSubtitle: '本機離線轉換 · 支援批次 · 隱私優先',
        languageLabel: '語言',
        paste: '貼上',
        openFiles: '開啟檔案',
        sample: '範例',
        settingsAria: '轉換設定',
        modeTitle: '轉換樣式',
        modeNormal: '標準',
        modeClean: '純淨',
        modeStructured: '結構化',
        rulesTitle: '輸出規則',
        keepLinks: '保留連結網址',
        keepCode: '保留程式碼區塊',
        removeFrontmatter: '移除 front matter',
        autoConvert: '輸入時自動轉換',
        fileQueue: '檔案佇列',
        clear: '清除',
        dropTitle: '將 Markdown 檔案拖曳到這裡',
        dropSubtitle: '支援 .md、.markdown 和 .txt',
        manualInput: '手動輸入',
        clipboardContent: '剪貼簿內容',
        sampleContent: '範例內容',
        convert: '轉換',
        copyResult: '複製結果',
        convertTitle: '轉換（Ctrl+Enter）',
        copyTitle: '複製結果（Ctrl+Shift+C）',
        downloadCurrent: '下載目前結果',
        downloadAll: '下載全部',
        downloadZip: '下載 ZIP',
        themeToggle: '切換主題',
        helpTitle: '鍵盤快速鍵',
        presetTitle: '預設',
        presetNone: '— 自訂 —',
        presetAi: 'AI 資料清洗',
        presetArchive: '文件歸檔',
        presetPublish: '發布',
        presetApplied: ({ name }) => `已套用預設：${name}`,
        removeFile: '移除檔案',
        fileRemoved: '已移除檔案',
        zipDownloaded: ({ count }) => `已下載 ZIP，含 ${count} 個檔案`,
        skipToInput: '跳到輸入框',
        helpConvert: '轉換',
        helpCopy: '複製結果',
        helpDownload: '下載目前結果',
        helpToggle: '切換此說明',
        helpClose2: '關閉對話框',
        inputPlaceholder: '在這裡貼上 Markdown，或拖曳檔案開始轉換',
        outputPlaceholder: '轉換後的 TXT 會顯示在這裡',
        privacyNote: '所有內容都只在你的瀏覽器本機處理',
        ready: '就緒',
        unsupportedFiles: '請選擇 .md、.markdown 或 .txt 檔案',
        converted: ({ ms }) => `轉換完成 · ${ms}ms`,
        noCopy: '沒有可複製的內容',
        resultCopied: '結果已複製',
        noDownload: '沒有可下載的內容',
        currentCleared: '目前內容已清除',
        filesCleared: '檔案佇列已清除',
        codeStart: ({ lang }) => `--- 程式碼${lang ? ` ${lang}` : ''}開始 ---`,
        codeEnd: '--- 程式碼結束 ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} 字 · ${lines} 行 · ${words} 詞 · ${minutes} 分鐘`,
    }),
    ja: withFallback({
        appTitle: 'Markdown to TXT',
        appSubtitle: 'オフライン変換 · 一括処理 · プライバシー重視',
        languageLabel: '言語',
        paste: '貼り付け',
        openFiles: 'ファイルを開く',
        sample: 'サンプル',
        settingsAria: '変換設定',
        modeTitle: '変換スタイル',
        modeNormal: '標準',
        modeClean: 'クリーン',
        modeStructured: '構造化',
        rulesTitle: '出力ルール',
        keepLinks: 'リンクURLを保持',
        keepCode: 'コードブロックを保持',
        removeFrontmatter: 'front matterを削除',
        autoConvert: '入力中に自動変換',
        fileQueue: 'ファイルキュー',
        clear: 'クリア',
        dropTitle: 'Markdownファイルをここにドロップ',
        dropSubtitle: '.md、.markdown、.txt に対応',
        manualInput: '手動入力',
        clipboardContent: 'クリップボード内容',
        sampleContent: 'サンプル内容',
        convert: '変換',
        copyResult: '結果をコピー',
        convertTitle: '変換（Ctrl+Enter）',
        copyTitle: '結果をコピー（Ctrl+Shift+C）',
        downloadCurrent: '現在の結果をダウンロード',
        downloadAll: 'すべてダウンロード',
        downloadZip: 'ZIP をダウンロード',
        themeToggle: 'テーマ切替',
        helpTitle: 'キーボードショートカット',
        presetTitle: 'プリセット',
        presetNone: '— カスタム —',
        presetAi: 'AI データ清洗',
        presetArchive: 'ドキュメント保管',
        presetPublish: '公開',
        presetApplied: ({ name }) => `プリセットを適用：${name}`,
        removeFile: 'ファイルを削除',
        fileRemoved: 'ファイルを削除しました',
        zipDownloaded: ({ count }) => `${count} ファイルの ZIP をダウンロードしました`,
        skipToInput: '入力欄へ移動',
        helpConvert: '変換',
        helpCopy: '結果をコピー',
        helpDownload: '現在の結果をダウンロード',
        helpToggle: 'このヘルプの切替',
        helpClose2: 'ダイアログを閉じる',
        inputPlaceholder: 'Markdownを貼り付けるか、ファイルをドロップしてください',
        outputPlaceholder: '変換されたTXTがここに表示されます',
        privacyNote: 'すべてブラウザ内でローカル処理されます',
        ready: '準備完了',
        unsupportedFiles: '.md、.markdown、.txt ファイルを選択してください',
        converted: ({ ms }) => `変換完了 · ${ms}ms`,
        noCopy: 'コピーする内容がありません',
        resultCopied: '結果をコピーしました',
        noDownload: 'ダウンロードする内容がありません',
        currentCleared: '現在の内容をクリアしました',
        filesCleared: 'ファイルキューをクリアしました',
        codeStart: ({ lang }) => `--- コード${lang ? ` ${lang}` : ''}開始 ---`,
        codeEnd: '--- コード終了 ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} 文字 · ${lines} 行 · ${words} 語 · ${minutes} 分`,
    }),
    ko: withFallback({
        appTitle: 'Markdown to TXT',
        appSubtitle: '오프라인 변환 · 일괄 처리 · 개인정보 우선',
        languageLabel: '언어',
        paste: '붙여넣기',
        openFiles: '파일 열기',
        sample: '샘플',
        settingsAria: '변환 설정',
        modeTitle: '변환 스타일',
        modeNormal: '표준',
        modeClean: '깔끔하게',
        modeStructured: '구조화',
        rulesTitle: '출력 규칙',
        keepLinks: '링크 URL 유지',
        keepCode: '코드 블록 유지',
        removeFrontmatter: 'front matter 제거',
        autoConvert: '입력 중 자동 변환',
        fileQueue: '파일 목록',
        clear: '지우기',
        dropTitle: 'Markdown 파일을 여기에 놓기',
        dropSubtitle: '.md, .markdown, .txt 지원',
        manualInput: '직접 입력',
        clipboardContent: '클립보드 내용',
        sampleContent: '샘플 내용',
        convert: '변환',
        copyResult: '결과 복사',
        convertTitle: '변환（Ctrl+Enter）',
        copyTitle: '결과 복사（Ctrl+Shift+C）',
        downloadCurrent: '현재 결과 다운로드',
        downloadAll: '전체 다운로드',
        downloadZip: 'ZIP 다운로드',
        themeToggle: '테마 전환',
        helpTitle: '키보드 단축키',
        presetTitle: '프리셋',
        presetNone: '— 사용자 정의 —',
        presetAi: 'AI 데이터 정제',
        presetArchive: '문서 보관',
        presetPublish: '출판',
        presetApplied: ({ name }) => `프리셋 적용: ${name}`,
        removeFile: '파일 제거',
        fileRemoved: '파일이 제거되었습니다',
        zipDownloaded: ({ count }) => `${count}개 파일의 ZIP을 다운로드했습니다`,
        skipToInput: '입력란으로 이동',
        helpConvert: '변환',
        helpCopy: '결과 복사',
        helpDownload: '현재 결과 다운로드',
        helpToggle: '이 도움말 전환',
        helpClose2: '대화상자 닫기',
        inputPlaceholder: 'Markdown을 붙여넣거나 파일을 놓아 변환을 시작하세요',
        outputPlaceholder: '변환된 TXT가 여기에 표시됩니다',
        privacyNote: '모든 내용은 브라우저에서 로컬로 처리됩니다',
        ready: '준비됨',
        unsupportedFiles: '.md, .markdown 또는 .txt 파일을 선택하세요',
        converted: ({ ms }) => `변환 완료 · ${ms}ms`,
        noCopy: '복사할 내용이 없습니다',
        resultCopied: '결과가 복사되었습니다',
        noDownload: '다운로드할 내용이 없습니다',
        currentCleared: '현재 내용이 지워졌습니다',
        filesCleared: '파일 목록이 지워졌습니다',
        codeStart: ({ lang }) => `--- 코드${lang ? ` ${lang}` : ''} 시작 ---`,
        codeEnd: '--- 코드 끝 ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars}자 · ${lines}줄 · ${words}단어 · ${minutes}분`,
    }),
    es: withFallback({
        appTitle: 'Markdown a TXT',
        appSubtitle: 'Conversor sin conexión · Listo para lotes · Privacidad primero',
        languageLabel: 'Idioma',
        paste: 'Pegar',
        openFiles: 'Abrir archivos',
        sample: 'Ejemplo',
        settingsAria: 'Ajustes de conversión',
        modeTitle: 'Estilo de conversión',
        modeNormal: 'Estándar',
        modeClean: 'Limpio',
        modeStructured: 'Estructurado',
        rulesTitle: 'Reglas de salida',
        keepLinks: 'Mantener URL de enlaces',
        keepCode: 'Mantener bloques de código',
        removeFrontmatter: 'Quitar front matter',
        autoConvert: 'Convertir al escribir',
        fileQueue: 'Cola de archivos',
        clear: 'Limpiar',
        dropTitle: 'Suelta archivos Markdown aquí',
        dropSubtitle: 'Admite .md, .markdown y .txt',
        manualInput: 'Entrada manual',
        clipboardContent: 'Contenido del portapapeles',
        sampleContent: 'Contenido de ejemplo',
        convert: 'Convertir',
        copyResult: 'Copiar resultado',
        convertTitle: 'Convertir (Ctrl+Enter)',
        copyTitle: 'Copiar resultado (Ctrl+Shift+C)',
        downloadCurrent: 'Descargar actual',
        downloadAll: 'Descargar todo',
        downloadZip: 'Descargar ZIP',
        themeToggle: 'Cambiar tema',
        helpTitle: 'Atajos de teclado',
        presetTitle: 'Preset',
        presetNone: '— Personalizado —',
        presetAi: 'Limpieza de datos IA',
        presetArchive: 'Archivo de documentación',
        presetPublish: 'Publicación',
        presetApplied: ({ name }) => `Preset aplicado: ${name}`,
        removeFile: 'Quitar archivo',
        fileRemoved: 'Archivo quitado',
        zipDownloaded: ({ count }) => `ZIP descargado con ${count} archivos`,
        skipToInput: 'Ir a la entrada',
        helpConvert: 'Convertir',
        helpCopy: 'Copiar resultado',
        helpDownload: 'Descargar actual',
        helpToggle: 'Alternar esta ayuda',
        helpClose2: 'Cerrar diálogo',
        inputPlaceholder: 'Pega Markdown aquí o suelta archivos para convertir',
        outputPlaceholder: 'El TXT convertido aparecerá aquí',
        privacyNote: 'Todo se procesa localmente en tu navegador',
        ready: 'Listo',
        unsupportedFiles: 'Elige archivos .md, .markdown o .txt',
        converted: ({ ms }) => `Convertido · ${ms}ms`,
        noCopy: 'Nada que copiar',
        resultCopied: 'Resultado copiado',
        noDownload: 'Nada que descargar',
        currentCleared: 'Contenido actual limpiado',
        filesCleared: 'Cola de archivos limpiada',
        codeStart: ({ lang }) => `--- Inicio de código${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- Fin de código ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} caracteres · ${lines} líneas · ${words} palabras · ${minutes} min`,
    }),
    pt: withFallback({
        appTitle: 'Markdown para TXT',
        appSubtitle: 'Conversor offline · Pronto para lotes · Privacidade em primeiro lugar',
        languageLabel: 'Idioma',
        paste: 'Colar',
        openFiles: 'Abrir arquivos',
        sample: 'Exemplo',
        settingsAria: 'Configurações de conversão',
        modeTitle: 'Estilo de conversão',
        modeNormal: 'Padrão',
        modeClean: 'Limpo',
        modeStructured: 'Estruturado',
        rulesTitle: 'Regras de saída',
        keepLinks: 'Manter URLs dos links',
        keepCode: 'Manter blocos de código',
        removeFrontmatter: 'Remover front matter',
        autoConvert: 'Converter ao digitar',
        fileQueue: 'Fila de arquivos',
        clear: 'Limpar',
        dropTitle: 'Solte arquivos Markdown aqui',
        dropSubtitle: 'Suporta .md, .markdown e .txt',
        manualInput: 'Entrada manual',
        clipboardContent: 'Conteúdo da área de transferência',
        sampleContent: 'Conteúdo de exemplo',
        convert: 'Converter',
        copyResult: 'Copiar resultado',
        convertTitle: 'Converter (Ctrl+Enter)',
        copyTitle: 'Copiar resultado (Ctrl+Shift+C)',
        downloadCurrent: 'Baixar atual',
        downloadAll: 'Baixar tudo',
        downloadZip: 'Baixar ZIP',
        themeToggle: 'Alternar tema',
        helpTitle: 'Atalhos de teclado',
        presetTitle: 'Predefinição',
        presetNone: '— Personalizado —',
        presetAi: 'Limpeza de dados IA',
        presetArchive: 'Arquivo de documentação',
        presetPublish: 'Publicação',
        presetApplied: ({ name }) => `Predefinição aplicada: ${name}`,
        removeFile: 'Remover arquivo',
        fileRemoved: 'Arquivo removido',
        zipDownloaded: ({ count }) => `ZIP baixado com ${count} arquivos`,
        skipToInput: 'Ir para a entrada',
        helpConvert: 'Converter',
        helpCopy: 'Copiar resultado',
        helpDownload: 'Baixar atual',
        helpToggle: 'Alternar esta ajuda',
        helpClose2: 'Fechar diálogo',
        inputPlaceholder: 'Cole Markdown aqui ou solte arquivos para converter',
        outputPlaceholder: 'O TXT convertido aparecerá aqui',
        privacyNote: 'Tudo é processado localmente no seu navegador',
        ready: 'Pronto',
        unsupportedFiles: 'Escolha arquivos .md, .markdown ou .txt',
        converted: ({ ms }) => `Convertido · ${ms}ms`,
        noCopy: 'Nada para copiar',
        resultCopied: 'Resultado copiado',
        noDownload: 'Nada para baixar',
        currentCleared: 'Conteúdo atual limpo',
        filesCleared: 'Fila de arquivos limpa',
        codeStart: ({ lang }) => `--- Início do código${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- Fim do código ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} caracteres · ${lines} linhas · ${words} palavras · ${minutes} min`,
    }),
    th: withFallback({
        appTitle: 'Markdown เป็น TXT',
        appSubtitle: 'แปลงแบบออฟไลน์ · รองรับหลายไฟล์ · ให้ความสำคัญกับความเป็นส่วนตัว',
        languageLabel: 'ภาษา',
        paste: 'วาง',
        openFiles: 'เปิดไฟล์',
        sample: 'ตัวอย่าง',
        settingsAria: 'การตั้งค่าการแปลง',
        modeTitle: 'รูปแบบการแปลง',
        modeNormal: 'มาตรฐาน',
        modeClean: 'สะอาด',
        modeStructured: 'มีโครงสร้าง',
        rulesTitle: 'กฎเอาต์พุต',
        keepLinks: 'เก็บ URL ของลิงก์',
        keepCode: 'เก็บบล็อกโค้ด',
        removeFrontmatter: 'ลบ front matter',
        autoConvert: 'แปลงอัตโนมัติขณะพิมพ์',
        fileQueue: 'คิวไฟล์',
        clear: 'ล้าง',
        dropTitle: 'วางไฟล์ Markdown ที่นี่',
        dropSubtitle: 'รองรับ .md, .markdown และ .txt',
        manualInput: 'ป้อนเอง',
        clipboardContent: 'เนื้อหาคลิปบอร์ด',
        sampleContent: 'เนื้อหาตัวอย่าง',
        convert: 'แปลง',
        copyResult: 'คัดลอกผลลัพธ์',
        convertTitle: 'แปลง (Ctrl+Enter)',
        copyTitle: 'คัดลอกผลลัพธ์ (Ctrl+Shift+C)',
        downloadCurrent: 'ดาวน์โหลดไฟล์ปัจจุบัน',
        downloadAll: 'ดาวน์โหลดทั้งหมด',
        downloadZip: 'ดาวน์โหลด ZIP',
        themeToggle: 'สลับธีม',
        helpTitle: 'ทางลัดแป้นพิมพ์',
        presetTitle: 'พรีเซ็ต',
        presetNone: '— กำหนดเอง —',
        presetAi: 'การทำความสะอาดข้อมูล AI',
        presetArchive: 'การเก็บถาวรเอกสาร',
        presetPublish: 'การเผยแพร่',
        presetApplied: ({ name }) => `ใช้พรีเซ็ต: ${name}`,
        removeFile: 'ลบไฟล์',
        fileRemoved: 'ลบไฟล์แล้ว',
        zipDownloaded: ({ count }) => `ดาวน์โหลด ZIP ที่มี ${count} ไฟล์`,
        skipToInput: 'ข้ามไปยังช่องป้อนข้อมูล',
        helpConvert: 'แปลง',
        helpCopy: 'คัดลอกผลลัพธ์',
        helpDownload: 'ดาวน์โหลดไฟล์ปัจจุบัน',
        helpToggle: 'สลับความช่วยเหลือนี้',
        helpClose2: 'ปิดกล่องโต้ตอบ',
        inputPlaceholder: 'วาง Markdown ที่นี่ หรือลากไฟล์มาเริ่มแปลง',
        outputPlaceholder: 'TXT ที่แปลงแล้วจะแสดงที่นี่',
        privacyNote: 'ทุกอย่างประมวลผลในเบราว์เซอร์ของคุณเท่านั้น',
        ready: 'พร้อม',
        unsupportedFiles: 'เลือกไฟล์ .md, .markdown หรือ .txt',
        converted: ({ ms }) => `แปลงแล้ว · ${ms}ms`,
        noCopy: 'ไม่มีเนื้อหาให้คัดลอก',
        resultCopied: 'คัดลอกผลลัพธ์แล้ว',
        noDownload: 'ไม่มีเนื้อหาให้ดาวน์โหลด',
        currentCleared: 'ล้างเนื้อหาปัจจุบันแล้ว',
        filesCleared: 'ล้างคิวไฟล์แล้ว',
        codeStart: ({ lang }) => `--- เริ่มโค้ด${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- จบโค้ด ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} อักขระ · ${lines} บรรทัด · ${words} คำ · ${minutes} นาที`,
    }),
    he: withFallback({
        appTitle: 'Markdown ל-TXT',
        appSubtitle: 'ממיר לא מקוון · מוכן לאצווה · פרטיות תחילה',
        languageLabel: 'שפה',
        paste: 'הדבק',
        openFiles: 'פתח קבצים',
        sample: 'דוגמה',
        settingsAria: 'הגדרות המרה',
        modeTitle: 'סגנון המרה',
        modeNormal: 'רגיל',
        modeClean: 'נקי',
        modeStructured: 'מובנה',
        rulesTitle: 'כללי פלט',
        keepLinks: 'שמור כתובות קישורים',
        keepCode: 'שמור בלוקי קוד',
        removeFrontmatter: 'הסר front matter',
        autoConvert: 'המר בזמן הקלדה',
        fileQueue: 'תור קבצים',
        clear: 'נקה',
        dropTitle: 'גרור קבצי Markdown לכאן',
        dropSubtitle: 'תומך ב-.md, .markdown ו-.txt',
        manualInput: 'קלט ידני',
        clipboardContent: 'תוכן הלוח',
        sampleContent: 'תוכן לדוגמה',
        convert: 'המר',
        copyResult: 'העתק תוצאה',
        convertTitle: 'המר (Ctrl+Enter)',
        copyTitle: 'העתק תוצאה (Ctrl+Shift+C)',
        downloadCurrent: 'הורד נוכחי',
        downloadAll: 'הורד הכול',
        downloadZip: 'הורד ZIP',
        themeToggle: 'החלף ערכת נושא',
        helpTitle: 'קיצורי מקלדת',
        presetTitle: 'פריסט',
        presetNone: '— מותאם אישית —',
        presetAi: 'ניקוי נתונים לבינה מלאכותית',
        presetArchive: 'ארכיון תיעוד',
        presetPublish: 'פרסום',
        presetApplied: ({ name }) => `פריסט הוחל: ${name}`,
        removeFile: 'הסר קובץ',
        fileRemoved: 'הקובץ הוסר',
        zipDownloaded: ({ count }) => `הורד ZIP עם ${count} קבצים`,
        skipToInput: 'דלג לקלט',
        helpConvert: 'המר',
        helpCopy: 'העתק תוצאה',
        helpDownload: 'הורד נוכחי',
        helpToggle: 'החלף עזרה זו',
        helpClose2: 'סגור דיאלוג',
        inputPlaceholder: 'הדבק Markdown כאן או גרור קבצים להמרה',
        outputPlaceholder: 'TXT מומר יופיע כאן',
        privacyNote: 'הכול מעובד מקומית בדפדפן שלך',
        ready: 'מוכן',
        unsupportedFiles: 'בחר קבצי .md, .markdown או .txt',
        converted: ({ ms }) => `הומר · ${ms}ms`,
        noCopy: 'אין מה להעתיק',
        resultCopied: 'התוצאה הועתקה',
        noDownload: 'אין מה להוריד',
        currentCleared: 'התוכן הנוכחי נוקה',
        filesCleared: 'תור הקבצים נוקה',
        codeStart: ({ lang }) => `--- תחילת קוד${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- סוף קוד ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} תווים · ${lines} שורות · ${words} מילים · ${minutes} דק׳`,
    }),
    ru: withFallback({
        appTitle: 'Markdown в TXT',
        appSubtitle: 'Офлайн-конвертер · Пакетная обработка · Приватность прежде всего',
        languageLabel: 'Язык',
        paste: 'Вставить',
        openFiles: 'Открыть файлы',
        sample: 'Пример',
        settingsAria: 'Настройки конвертации',
        modeTitle: 'Стиль конвертации',
        modeNormal: 'Стандартный',
        modeClean: 'Чистый',
        modeStructured: 'Структурный',
        rulesTitle: 'Правила вывода',
        keepLinks: 'Сохранять URL ссылок',
        keepCode: 'Сохранять блоки кода',
        removeFrontmatter: 'Удалять front matter',
        autoConvert: 'Автоконвертация при вводе',
        fileQueue: 'Очередь файлов',
        clear: 'Очистить',
        dropTitle: 'Перетащите Markdown-файлы сюда',
        dropSubtitle: 'Поддерживает .md, .markdown и .txt',
        manualInput: 'Ручной ввод',
        clipboardContent: 'Содержимое буфера',
        sampleContent: 'Пример содержимого',
        convert: 'Конвертировать',
        copyResult: 'Копировать результат',
        convertTitle: 'Конвертировать (Ctrl+Enter)',
        copyTitle: 'Копировать результат (Ctrl+Shift+C)',
        downloadCurrent: 'Скачать текущий',
        downloadAll: 'Скачать всё',
        downloadZip: 'Скачать ZIP',
        themeToggle: 'Переключить тему',
        helpTitle: 'Горячие клавиши',
        presetTitle: 'Пресет',
        presetNone: '— Свой —',
        presetAi: 'Очистка данных для ИИ',
        presetArchive: 'Архив документации',
        presetPublish: 'Публикация',
        presetApplied: ({ name }) => `Пресет применён: ${name}`,
        removeFile: 'Удалить файл',
        fileRemoved: 'Файл удалён',
        zipDownloaded: ({ count }) => `ZIP с ${count} файлами скачан`,
        skipToInput: 'Перейти к вводу',
        helpConvert: 'Конвертировать',
        helpCopy: 'Копировать результат',
        helpDownload: 'Скачать текущий',
        helpToggle: 'Показать эту справку',
        helpClose2: 'Закрыть окно',
        inputPlaceholder: 'Вставьте Markdown или перетащите файлы',
        outputPlaceholder: 'Преобразованный TXT появится здесь',
        privacyNote: 'Всё обрабатывается локально в вашем браузере',
        ready: 'Готово',
        unsupportedFiles: 'Выберите файлы .md, .markdown или .txt',
        converted: ({ ms }) => `Преобразовано · ${ms}ms`,
        noCopy: 'Нечего копировать',
        resultCopied: 'Результат скопирован',
        noDownload: 'Нечего скачивать',
        currentCleared: 'Текущее содержимое очищено',
        filesCleared: 'Очередь файлов очищена',
        codeStart: ({ lang }) => `--- Начало кода${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- Конец кода ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} симв. · ${lines} строк · ${words} слов · ${minutes} мин`,
    }),
    ar: withFallback({
        appTitle: 'Markdown إلى TXT',
        appSubtitle: 'محول دون اتصال · جاهز للدفعات · الخصوصية أولاً',
        languageLabel: 'اللغة',
        paste: 'لصق',
        openFiles: 'فتح ملفات',
        sample: 'مثال',
        settingsAria: 'إعدادات التحويل',
        modeTitle: 'نمط التحويل',
        modeNormal: 'قياسي',
        modeClean: 'نظيف',
        modeStructured: 'منظم',
        rulesTitle: 'قواعد الإخراج',
        keepLinks: 'الاحتفاظ بروابط URL',
        keepCode: 'الاحتفاظ بكتل الكود',
        removeFrontmatter: 'إزالة front matter',
        autoConvert: 'تحويل تلقائي أثناء الكتابة',
        fileQueue: 'قائمة الملفات',
        clear: 'مسح',
        dropTitle: 'أسقط ملفات Markdown هنا',
        dropSubtitle: 'يدعم .md و .markdown و .txt',
        manualInput: 'إدخال يدوي',
        clipboardContent: 'محتوى الحافظة',
        sampleContent: 'محتوى تجريبي',
        convert: 'تحويل',
        copyResult: 'نسخ النتيجة',
        convertTitle: 'تحويل (Ctrl+Enter)',
        copyTitle: 'نسخ النتيجة (Ctrl+Shift+C)',
        downloadCurrent: 'تنزيل الحالي',
        downloadAll: 'تنزيل الكل',
        downloadZip: 'تنزيل ZIP',
        themeToggle: 'تبديل السمة',
        helpTitle: 'اختصارات لوحة المفاتيح',
        presetTitle: 'إعداد مسبق',
        presetNone: '— مخصص —',
        presetAi: 'تنظيف بيانات الذكاء الاصطناعي',
        presetArchive: 'أرشفة الوثائق',
        presetPublish: 'نشر',
        presetApplied: ({ name }) => `تم تطبيق الإعداد: ${name}`,
        removeFile: 'إزالة ملف',
        fileRemoved: 'تمت إزالة الملف',
        zipDownloaded: ({ count }) => `تم تنزيل ZIP بـ ${count} ملفات`,
        skipToInput: 'تخطٍ إلى الإدخال',
        helpConvert: 'تحويل',
        helpCopy: 'نسخ النتيجة',
        helpDownload: 'تنزيل الحالي',
        helpToggle: 'تبديل هذه المساعدة',
        helpClose2: 'إغلاق الحوار',
        inputPlaceholder: 'الصق Markdown هنا أو أسقط ملفات لبدء التحويل',
        outputPlaceholder: 'سيظهر TXT المحول هنا',
        privacyNote: 'تتم المعالجة محلياً داخل متصفحك',
        ready: 'جاهز',
        unsupportedFiles: 'اختر ملفات .md أو .markdown أو .txt',
        converted: ({ ms }) => `تم التحويل · ${ms}ms`,
        noCopy: 'لا يوجد ما يمكن نسخه',
        resultCopied: 'تم نسخ النتيجة',
        noDownload: 'لا يوجد ما يمكن تنزيله',
        currentCleared: 'تم مسح المحتوى الحالي',
        filesCleared: 'تم مسح قائمة الملفات',
        codeStart: ({ lang }) => `--- بداية الكود${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- نهاية الكود ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} حرف · ${lines} سطر · ${words} كلمة · ${minutes} دقيقة`,
    }),
    fr: withFallback({
        appTitle: 'Markdown vers TXT',
        appSubtitle: 'Convertisseur hors ligne · Prêt pour le lot · Confidentialité d’abord',
        languageLabel: 'Langue',
        paste: 'Coller',
        openFiles: 'Ouvrir des fichiers',
        sample: 'Exemple',
        settingsAria: 'Paramètres de conversion',
        modeTitle: 'Style de conversion',
        modeNormal: 'Standard',
        modeClean: 'Net',
        modeStructured: 'Structuré',
        rulesTitle: 'Règles de sortie',
        keepLinks: 'Conserver les URL',
        keepCode: 'Conserver les blocs de code',
        removeFrontmatter: 'Supprimer le front matter',
        autoConvert: 'Convertir pendant la saisie',
        fileQueue: 'File de fichiers',
        clear: 'Effacer',
        dropTitle: 'Déposez des fichiers Markdown ici',
        dropSubtitle: 'Prend en charge .md, .markdown et .txt',
        manualInput: 'Saisie manuelle',
        clipboardContent: 'Contenu du presse-papiers',
        sampleContent: 'Contenu d’exemple',
        convert: 'Convertir',
        copyResult: 'Copier le résultat',
        convertTitle: 'Convertir (Ctrl+Enter)',
        copyTitle: 'Copier le résultat (Ctrl+Shift+C)',
        downloadCurrent: 'Télécharger actuel',
        downloadAll: 'Tout télécharger',
        downloadZip: 'Télécharger ZIP',
        themeToggle: 'Changer de thème',
        helpTitle: 'Raccourcis clavier',
        presetTitle: 'Préréglage',
        presetNone: '— Personnalisé —',
        presetAi: 'Nettoyage de données IA',
        presetArchive: 'Archive de documentation',
        presetPublish: 'Publication',
        presetApplied: ({ name }) => `Préréglage appliqué : ${name}`,
        removeFile: 'Retirer le fichier',
        fileRemoved: 'Fichier retiré',
        zipDownloaded: ({ count }) => `ZIP téléchargé avec ${count} fichiers`,
        skipToInput: 'Aller à la saisie',
        helpConvert: 'Convertir',
        helpCopy: 'Copier le résultat',
        helpDownload: 'Télécharger actuel',
        helpToggle: 'Afficher cette aide',
        helpClose2: 'Fermer la boîte de dialogue',
        inputPlaceholder: 'Collez Markdown ici ou déposez des fichiers à convertir',
        outputPlaceholder: 'Le TXT converti apparaîtra ici',
        privacyNote: 'Tout est traité localement dans votre navigateur',
        ready: 'Prêt',
        unsupportedFiles: 'Choisissez des fichiers .md, .markdown ou .txt',
        converted: ({ ms }) => `Converti · ${ms}ms`,
        noCopy: 'Rien à copier',
        resultCopied: 'Résultat copié',
        noDownload: 'Rien à télécharger',
        currentCleared: 'Contenu actuel effacé',
        filesCleared: 'File de fichiers effacée',
        codeStart: ({ lang }) => `--- Début du code${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- Fin du code ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} caractères · ${lines} lignes · ${words} mots · ${minutes} min`,
    }),
    de: withFallback({
        appTitle: 'Markdown zu TXT',
        appSubtitle: 'Offline-Konverter · Stapelbereit · Datenschutz zuerst',
        languageLabel: 'Sprache',
        paste: 'Einfügen',
        openFiles: 'Dateien öffnen',
        sample: 'Beispiel',
        settingsAria: 'Konvertierungseinstellungen',
        modeTitle: 'Konvertierungsstil',
        modeNormal: 'Standard',
        modeClean: 'Sauber',
        modeStructured: 'Strukturiert',
        rulesTitle: 'Ausgaberegeln',
        keepLinks: 'Link-URLs behalten',
        keepCode: 'Codeblöcke behalten',
        removeFrontmatter: 'Front Matter entfernen',
        autoConvert: 'Beim Tippen konvertieren',
        fileQueue: 'Dateiliste',
        clear: 'Leeren',
        dropTitle: 'Markdown-Dateien hier ablegen',
        dropSubtitle: 'Unterstützt .md, .markdown und .txt',
        manualInput: 'Manuelle Eingabe',
        clipboardContent: 'Zwischenablageinhalt',
        sampleContent: 'Beispielinhalt',
        convert: 'Konvertieren',
        copyResult: 'Ergebnis kopieren',
        convertTitle: 'Konvertieren (Ctrl+Enter)',
        copyTitle: 'Ergebnis kopieren (Ctrl+Shift+C)',
        downloadCurrent: 'Aktuelle Datei laden',
        downloadAll: 'Alles herunterladen',
        downloadZip: 'ZIP herunterladen',
        themeToggle: 'Design wechseln',
        helpTitle: 'Tastenkürzel',
        presetTitle: 'Voreinstellung',
        presetNone: '— Benutzerdefiniert —',
        presetAi: 'KI-Datenbereinigung',
        presetArchive: 'Dokumentationsarchiv',
        presetPublish: 'Veröffentlichung',
        presetApplied: ({ name }) => `Voreinstellung angewendet: ${name}`,
        removeFile: 'Datei entfernen',
        fileRemoved: 'Datei entfernt',
        zipDownloaded: ({ count }) => `ZIP mit ${count} Dateien heruntergeladen`,
        skipToInput: 'Zur Eingabe springen',
        helpConvert: 'Konvertieren',
        helpCopy: 'Ergebnis kopieren',
        helpDownload: 'Aktuelle Datei laden',
        helpToggle: 'Diese Hilfe umschalten',
        helpClose2: 'Dialog schließen',
        inputPlaceholder: 'Markdown hier einfügen oder Dateien ablegen',
        outputPlaceholder: 'Konvertiertes TXT erscheint hier',
        privacyNote: 'Alles wird lokal in Ihrem Browser verarbeitet',
        ready: 'Bereit',
        unsupportedFiles: 'Wählen Sie .md-, .markdown- oder .txt-Dateien',
        converted: ({ ms }) => `Konvertiert · ${ms}ms`,
        noCopy: 'Nichts zu kopieren',
        resultCopied: 'Ergebnis kopiert',
        noDownload: 'Nichts herunterzuladen',
        currentCleared: 'Aktueller Inhalt geleert',
        filesCleared: 'Dateiliste geleert',
        codeStart: ({ lang }) => `--- Code-Anfang${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- Code-Ende ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} Zeichen · ${lines} Zeilen · ${words} Wörter · ${minutes} Min`,
    }),
    it: withFallback({
        appTitle: 'Markdown in TXT',
        appSubtitle: 'Convertitore offline · Pronto per batch · Privacy prima di tutto',
        languageLabel: 'Lingua',
        paste: 'Incolla',
        openFiles: 'Apri file',
        sample: 'Esempio',
        settingsAria: 'Impostazioni di conversione',
        modeTitle: 'Stile di conversione',
        modeNormal: 'Standard',
        modeClean: 'Pulito',
        modeStructured: 'Strutturato',
        rulesTitle: 'Regole di output',
        keepLinks: 'Mantieni URL dei link',
        keepCode: 'Mantieni blocchi di codice',
        removeFrontmatter: 'Rimuovi front matter',
        autoConvert: 'Converti durante la digitazione',
        fileQueue: 'Coda file',
        clear: 'Cancella',
        dropTitle: 'Rilascia file Markdown qui',
        dropSubtitle: 'Supporta .md, .markdown e .txt',
        manualInput: 'Input manuale',
        clipboardContent: 'Contenuto degli appunti',
        sampleContent: 'Contenuto di esempio',
        convert: 'Converti',
        copyResult: 'Copia risultato',
        convertTitle: 'Converti (Ctrl+Enter)',
        copyTitle: 'Copia risultato (Ctrl+Shift+C)',
        downloadCurrent: 'Scarica corrente',
        downloadAll: 'Scarica tutto',
        downloadZip: 'Scarica ZIP',
        themeToggle: 'Cambia tema',
        helpTitle: 'Scorciatoie da tastiera',
        presetTitle: 'Preset',
        presetNone: '— Personalizzato —',
        presetAi: 'Pulizia dati IA',
        presetArchive: 'Archivio documentazione',
        presetPublish: 'Pubblicazione',
        presetApplied: ({ name }) => `Preset applicato: ${name}`,
        removeFile: 'Rimuovi file',
        fileRemoved: 'File rimosso',
        zipDownloaded: ({ count }) => `ZIP scaricato con ${count} file`,
        skipToInput: 'Vai all’input',
        helpConvert: 'Converti',
        helpCopy: 'Copia risultato',
        helpDownload: 'Scarica corrente',
        helpToggle: 'Mostra questa guida',
        helpClose2: 'Chiudi finestra',
        inputPlaceholder: 'Incolla Markdown qui o rilascia file per convertire',
        outputPlaceholder: 'Il TXT convertito apparirà qui',
        privacyNote: 'Tutto viene elaborato localmente nel browser',
        ready: 'Pronto',
        unsupportedFiles: 'Scegli file .md, .markdown o .txt',
        converted: ({ ms }) => `Convertito · ${ms}ms`,
        noCopy: 'Niente da copiare',
        resultCopied: 'Risultato copiato',
        noDownload: 'Niente da scaricare',
        currentCleared: 'Contenuto attuale cancellato',
        filesCleared: 'Coda file cancellata',
        codeStart: ({ lang }) => `--- Inizio codice${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- Fine codice ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} caratteri · ${lines} righe · ${words} parole · ${minutes} min`,
    }),
    hi: withFallback({
        appTitle: 'Markdown से TXT',
        appSubtitle: 'ऑफलाइन कनवर्टर · बैच तैयार · गोपनीयता पहले',
        languageLabel: 'भाषा',
        paste: 'पेस्ट',
        openFiles: 'फ़ाइलें खोलें',
        sample: 'नमूना',
        settingsAria: 'रूपांतरण सेटिंग्स',
        modeTitle: 'कन्वर्ज़न शैली',
        modeNormal: 'मानक',
        modeClean: 'साफ',
        modeStructured: 'संरचित',
        rulesTitle: 'आउटपुट नियम',
        keepLinks: 'लिंक URL रखें',
        keepCode: 'कोड ब्लॉक रखें',
        removeFrontmatter: 'front matter हटाएँ',
        autoConvert: 'टाइप करते समय बदलें',
        fileQueue: 'फ़ाइल कतार',
        clear: 'साफ करें',
        dropTitle: 'Markdown फ़ाइलें यहाँ छोड़ें',
        dropSubtitle: '.md, .markdown और .txt समर्थित',
        manualInput: 'मैनुअल इनपुट',
        clipboardContent: 'क्लिपबोर्ड सामग्री',
        sampleContent: 'नमूना सामग्री',
        convert: 'बदलें',
        copyResult: 'परिणाम कॉपी करें',
        convertTitle: 'बदलें (Ctrl+Enter)',
        copyTitle: 'परिणाम कॉपी करें (Ctrl+Shift+C)',
        downloadCurrent: 'वर्तमान डाउनलोड करें',
        downloadAll: 'सब डाउनलोड करें',
        downloadZip: 'ZIP डाउनलोड करें',
        themeToggle: 'थीम बदलें',
        helpTitle: 'कीबोर्ड शॉर्टकट',
        presetTitle: 'प्रीसेट',
        presetNone: '— कस्टम —',
        presetAi: 'AI डेटा सफाई',
        presetArchive: 'दस्तावेज़ संग्रह',
        presetPublish: 'प्रकाशन',
        presetApplied: ({ name }) => `प्रीसेट लागू: ${name}`,
        removeFile: 'फ़ाइल हटाएँ',
        fileRemoved: 'फ़ाइल हटाई गई',
        zipDownloaded: ({ count }) => `${count} फ़ाइलों के साथ ZIP डाउनलोड हुआ`,
        skipToInput: 'इनपुट पर जाएँ',
        helpConvert: 'बदलें',
        helpCopy: 'परिणाम कॉपी करें',
        helpDownload: 'वर्तमान डाउनलोड करें',
        helpToggle: 'यह सहायता टॉगल करें',
        helpClose2: 'संवाद बंद करें',
        inputPlaceholder: 'Markdown यहाँ पेस्ट करें या फ़ाइलें छोड़ें',
        outputPlaceholder: 'रूपांतरित TXT यहाँ दिखेगा',
        privacyNote: 'सब कुछ आपके ब्राउज़र में स्थानीय रूप से संसाधित होता है',
        ready: 'तैयार',
        unsupportedFiles: '.md, .markdown या .txt फ़ाइलें चुनें',
        converted: ({ ms }) => `रूपांतरित · ${ms}ms`,
        noCopy: 'कॉपी करने के लिए कुछ नहीं',
        resultCopied: 'परिणाम कॉपी हुआ',
        noDownload: 'डाउनलोड करने के लिए कुछ नहीं',
        currentCleared: 'वर्तमान सामग्री साफ हुई',
        filesCleared: 'फ़ाइल कतार साफ हुई',
        codeStart: ({ lang }) => `--- कोड प्रारंभ${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- कोड समाप्त ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} अक्षर · ${lines} पंक्तियाँ · ${words} शब्द · ${minutes} मिनट`,
    }),
    id: withFallback({
        appTitle: 'Markdown ke TXT',
        appSubtitle: 'Konverter offline · Siap batch · Privasi utama',
        languageLabel: 'Bahasa',
        paste: 'Tempel',
        openFiles: 'Buka file',
        sample: 'Contoh',
        settingsAria: 'Pengaturan konversi',
        modeTitle: 'Gaya konversi',
        modeNormal: 'Standar',
        modeClean: 'Bersih',
        modeStructured: 'Terstruktur',
        rulesTitle: 'Aturan keluaran',
        keepLinks: 'Simpan URL tautan',
        keepCode: 'Simpan blok kode',
        removeFrontmatter: 'Hapus front matter',
        autoConvert: 'Konversi saat mengetik',
        fileQueue: 'Antrean file',
        clear: 'Bersihkan',
        dropTitle: 'Jatuhkan file Markdown di sini',
        dropSubtitle: 'Mendukung .md, .markdown dan .txt',
        manualInput: 'Input manual',
        clipboardContent: 'Konten papan klip',
        sampleContent: 'Konten contoh',
        convert: 'Konversi',
        copyResult: 'Salin hasil',
        convertTitle: 'Konversi (Ctrl+Enter)',
        copyTitle: 'Salin hasil (Ctrl+Shift+C)',
        downloadCurrent: 'Unduh saat ini',
        downloadAll: 'Unduh semua',
        downloadZip: 'Unduh ZIP',
        themeToggle: 'Ganti tema',
        helpTitle: 'Pintasan keyboard',
        presetTitle: 'Preset',
        presetNone: '— Kustom —',
        presetAi: 'Pembersihan data AI',
        presetArchive: 'Arsip dokumentasi',
        presetPublish: 'Penerbitan',
        presetApplied: ({ name }) => `Preset diterapkan: ${name}`,
        removeFile: 'Hapus file',
        fileRemoved: 'File dihapus',
        zipDownloaded: ({ count }) => `ZIP dengan ${count} file diunduh`,
        skipToInput: 'Lompat ke input',
        helpConvert: 'Konversi',
        helpCopy: 'Salin hasil',
        helpDownload: 'Unduh saat ini',
        helpToggle: 'Alihkan bantuan ini',
        helpClose2: 'Tutup dialog',
        inputPlaceholder: 'Tempel Markdown di sini atau jatuhkan file untuk konversi',
        outputPlaceholder: 'TXT yang dikonversi akan muncul di sini',
        privacyNote: 'Semua diproses secara lokal di browser Anda',
        ready: 'Siap',
        unsupportedFiles: 'Pilih file .md, .markdown atau .txt',
        converted: ({ ms }) => `Dikonversi · ${ms}ms`,
        noCopy: 'Tidak ada yang disalin',
        resultCopied: 'Hasil disalin',
        noDownload: 'Tidak ada yang diunduh',
        currentCleared: 'Konten saat ini dibersihkan',
        filesCleared: 'Antrean file dibersihkan',
        codeStart: ({ lang }) => `--- Awal kode${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- Akhir kode ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} karakter · ${lines} baris · ${words} kata · ${minutes} mnt`,
    }),
    vi: withFallback({
        appTitle: 'Markdown sang TXT',
        appSubtitle: 'Chuyển đổi ngoại tuyến · Hỗ trợ hàng loạt · Ưu tiên riêng tư',
        languageLabel: 'Ngôn ngữ',
        paste: 'Dán',
        openFiles: 'Mở tệp',
        sample: 'Mẫu',
        settingsAria: 'Cài đặt chuyển đổi',
        modeTitle: 'Kiểu chuyển đổi',
        modeNormal: 'Chuẩn',
        modeClean: 'Gọn',
        modeStructured: 'Có cấu trúc',
        rulesTitle: 'Quy tắc đầu ra',
        keepLinks: 'Giữ URL liên kết',
        keepCode: 'Giữ khối mã',
        removeFrontmatter: 'Xóa front matter',
        autoConvert: 'Tự chuyển khi nhập',
        fileQueue: 'Hàng đợi tệp',
        clear: 'Xóa',
        dropTitle: 'Thả tệp Markdown vào đây',
        dropSubtitle: 'Hỗ trợ .md, .markdown và .txt',
        manualInput: 'Nhập thủ công',
        clipboardContent: 'Nội dung khay nhớ tạm',
        sampleContent: 'Nội dung mẫu',
        convert: 'Chuyển đổi',
        copyResult: 'Sao chép kết quả',
        convertTitle: 'Chuyển đổi (Ctrl+Enter)',
        copyTitle: 'Sao chép kết quả (Ctrl+Shift+C)',
        downloadCurrent: 'Tải tệp hiện tại',
        downloadAll: 'Tải tất cả',
        downloadZip: 'Tải ZIP',
        themeToggle: 'Chuyển chủ đề',
        helpTitle: 'Phím tắt',
        presetTitle: 'Cài đặt sẵn',
        presetNone: '— Tùy chỉnh —',
        presetAi: 'Làm sạch dữ liệu AI',
        presetArchive: 'Lưu trữ tài liệu',
        presetPublish: 'Xuất bản',
        presetApplied: ({ name }) => `Đã áp dụng cài đặt: ${name}`,
        removeFile: 'Xóa tệp',
        fileRemoved: 'Đã xóa tệp',
        zipDownloaded: ({ count }) => `Đã tải ZIP với ${count} tệp`,
        skipToInput: 'Đến ô nhập',
        helpConvert: 'Chuyển đổi',
        helpCopy: 'Sao chép kết quả',
        helpDownload: 'Tải tệp hiện tại',
        helpToggle: 'Bật/tắt trợ giúp',
        helpClose2: 'Đóng hộp thoại',
        inputPlaceholder: 'Dán Markdown vào đây hoặc thả tệp để chuyển đổi',
        outputPlaceholder: 'TXT sau chuyển đổi sẽ hiển thị ở đây',
        privacyNote: 'Mọi thứ được xử lý cục bộ trong trình duyệt',
        ready: 'Sẵn sàng',
        unsupportedFiles: 'Chọn tệp .md, .markdown hoặc .txt',
        converted: ({ ms }) => `Đã chuyển · ${ms}ms`,
        noCopy: 'Không có gì để sao chép',
        resultCopied: 'Đã sao chép kết quả',
        noDownload: 'Không có gì để tải',
        currentCleared: 'Đã xóa nội dung hiện tại',
        filesCleared: 'Đã xóa hàng đợi tệp',
        codeStart: ({ lang }) => `--- Bắt đầu mã${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- Kết thúc mã ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} ký tự · ${lines} dòng · ${words} từ · ${minutes} phút`,
    }),
    tr: withFallback({
        appTitle: 'Markdown TXT’ye',
        appSubtitle: 'Çevrimdışı dönüştürücü · Toplu iş hazır · Gizlilik öncelikli',
        languageLabel: 'Dil',
        paste: 'Yapıştır',
        openFiles: 'Dosyaları aç',
        sample: 'Örnek',
        settingsAria: 'Dönüştürme ayarları',
        modeTitle: 'Dönüştürme stili',
        modeNormal: 'Standart',
        modeClean: 'Temiz',
        modeStructured: 'Yapılandırılmış',
        rulesTitle: 'Çıktı kuralları',
        keepLinks: 'Bağlantı URL’lerini koru',
        keepCode: 'Kod bloklarını koru',
        removeFrontmatter: 'Front matter kaldır',
        autoConvert: 'Yazarken dönüştür',
        fileQueue: 'Dosya kuyruğu',
        clear: 'Temizle',
        dropTitle: 'Markdown dosyalarını buraya bırakın',
        dropSubtitle: '.md, .markdown ve .txt desteklenir',
        manualInput: 'Elle giriş',
        clipboardContent: 'Pano içeriği',
        sampleContent: 'Örnek içerik',
        convert: 'Dönüştür',
        copyResult: 'Sonucu kopyala',
        convertTitle: 'Dönüştür (Ctrl+Enter)',
        copyTitle: 'Sonucu kopyala (Ctrl+Shift+C)',
        downloadCurrent: 'Geçerli olanı indir',
        downloadAll: 'Tümünü indir',
        downloadZip: 'ZIP indir',
        themeToggle: 'Tema değiştir',
        helpTitle: 'Klavye kısayolları',
        presetTitle: 'Ön ayar',
        presetNone: '— Özel —',
        presetAi: 'AI veri temizleme',
        presetArchive: 'Belgelendirme arşivi',
        presetPublish: 'Yayın',
        presetApplied: ({ name }) => `Ön ayar uygulandı: ${name}`,
        removeFile: 'Dosyayı kaldır',
        fileRemoved: 'Dosya kaldırıldı',
        zipDownloaded: ({ count }) => `${count} dosyalı ZIP indirildi`,
        skipToInput: 'Girişe git',
        helpConvert: 'Dönüştür',
        helpCopy: 'Sonucu kopyala',
        helpDownload: 'Geçerli olanı indir',
        helpToggle: 'Bu yardımı aç/kapat',
        helpClose2: 'Pencereyi kapat',
        inputPlaceholder: 'Markdown’u buraya yapıştırın veya dosyaları bırakın',
        outputPlaceholder: 'Dönüştürülen TXT burada görünür',
        privacyNote: 'Her şey tarayıcınızda yerel olarak işlenir',
        ready: 'Hazır',
        unsupportedFiles: '.md, .markdown veya .txt dosyaları seçin',
        converted: ({ ms }) => `Dönüştürüldü · ${ms}ms`,
        noCopy: 'Kopyalanacak bir şey yok',
        resultCopied: 'Sonuç kopyalandı',
        noDownload: 'İndirilecek bir şey yok',
        currentCleared: 'Geçerli içerik temizlendi',
        filesCleared: 'Dosya kuyruğu temizlendi',
        codeStart: ({ lang }) => `--- Kod başlangıcı${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- Kod sonu ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} karakter · ${lines} satır · ${words} kelime · ${minutes} dk`,
    }),
    pl: withFallback({
        appTitle: 'Markdown do TXT',
        appSubtitle: 'Konwerter offline · Obsługa wsadowa · Prywatność przede wszystkim',
        languageLabel: 'Język',
        paste: 'Wklej',
        openFiles: 'Otwórz pliki',
        sample: 'Przykład',
        settingsAria: 'Ustawienia konwersji',
        modeTitle: 'Styl konwersji',
        modeNormal: 'Standardowy',
        modeClean: 'Czysty',
        modeStructured: 'Strukturalny',
        rulesTitle: 'Reguły wyjścia',
        keepLinks: 'Zachowaj adresy URL',
        keepCode: 'Zachowaj bloki kodu',
        removeFrontmatter: 'Usuń front matter',
        autoConvert: 'Konwertuj podczas pisania',
        fileQueue: 'Kolejka plików',
        clear: 'Wyczyść',
        dropTitle: 'Upuść pliki Markdown tutaj',
        dropSubtitle: 'Obsługuje .md, .markdown i .txt',
        manualInput: 'Wpis ręczny',
        clipboardContent: 'Zawartość schowka',
        sampleContent: 'Przykładowa zawartość',
        convert: 'Konwertuj',
        copyResult: 'Kopiuj wynik',
        convertTitle: 'Konwertuj (Ctrl+Enter)',
        copyTitle: 'Kopiuj wynik (Ctrl+Shift+C)',
        downloadCurrent: 'Pobierz bieżący',
        downloadAll: 'Pobierz wszystko',
        downloadZip: 'Pobierz ZIP',
        themeToggle: 'Przełącz motyw',
        helpTitle: 'Skróty klawiaturowe',
        presetTitle: 'Preset',
        presetNone: '— Niestandardowy —',
        presetAi: 'Czyszczenie danych AI',
        presetArchive: 'Archiwum dokumentacji',
        presetPublish: 'Publikacja',
        presetApplied: ({ name }) => `Zastosowano preset: ${name}`,
        removeFile: 'Usuń plik',
        fileRemoved: 'Plik usunięty',
        zipDownloaded: ({ count }) => `Pobrano ZIP z ${count} plikami`,
        skipToInput: 'Przejdź do wprowadzania',
        helpConvert: 'Konwertuj',
        helpCopy: 'Kopiuj wynik',
        helpDownload: 'Pobierz bieżący',
        helpToggle: 'Przełącz tę pomoc',
        helpClose2: 'Zamknij okno',
        inputPlaceholder: 'Wklej Markdown tutaj lub upuść pliki, aby konwertować',
        outputPlaceholder: 'Skonwertowany TXT pojawi się tutaj',
        privacyNote: 'Wszystko jest przetwarzane lokalnie w przeglądarce',
        ready: 'Gotowe',
        unsupportedFiles: 'Wybierz pliki .md, .markdown lub .txt',
        converted: ({ ms }) => `Skonwertowano · ${ms}ms`,
        noCopy: 'Nie ma nic do skopiowania',
        resultCopied: 'Wynik skopiowany',
        noDownload: 'Nie ma nic do pobrania',
        currentCleared: 'Bieżąca zawartość wyczyszczona',
        filesCleared: 'Kolejka plików wyczyszczona',
        codeStart: ({ lang }) => `--- Początek kodu${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- Koniec kodu ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} znaków · ${lines} wierszy · ${words} słów · ${minutes} min`,
    }),
    nl: withFallback({
        appTitle: 'Markdown naar TXT',
        appSubtitle: 'Offline converter · Batch-klaar · Privacy eerst',
        languageLabel: 'Taal',
        paste: 'Plakken',
        openFiles: 'Bestanden openen',
        sample: 'Voorbeeld',
        settingsAria: 'Conversie-instellingen',
        modeTitle: 'Conversiestijl',
        modeNormal: 'Standaard',
        modeClean: 'Schoon',
        modeStructured: 'Gestructureerd',
        rulesTitle: 'Uitvoerregels',
        keepLinks: 'Link-URL’s behouden',
        keepCode: 'Codeblokken behouden',
        removeFrontmatter: 'Front matter verwijderen',
        autoConvert: 'Converteren tijdens typen',
        fileQueue: 'Bestandswachtrij',
        clear: 'Wissen',
        dropTitle: 'Sleep Markdown-bestanden hierheen',
        dropSubtitle: 'Ondersteunt .md, .markdown en .txt',
        manualInput: 'Handmatige invoer',
        clipboardContent: 'Klembordinhoud',
        sampleContent: 'Voorbeeldinhoud',
        convert: 'Converteren',
        copyResult: 'Resultaat kopiëren',
        convertTitle: 'Converteren (Ctrl+Enter)',
        copyTitle: 'Resultaat kopiëren (Ctrl+Shift+C)',
        downloadCurrent: 'Huidige downloaden',
        downloadAll: 'Alles downloaden',
        downloadZip: 'ZIP downloaden',
        themeToggle: 'Thema wisselen',
        helpTitle: 'Sneltoetsen',
        presetTitle: 'Voorinstelling',
        presetNone: '— Aangepast —',
        presetAi: 'AI-gegevensreiniging',
        presetArchive: 'Documentatiearchief',
        presetPublish: 'Publicatie',
        presetApplied: ({ name }) => `Voorinstelling toegepast: ${name}`,
        removeFile: 'Bestand verwijderen',
        fileRemoved: 'Bestand verwijderd',
        zipDownloaded: ({ count }) => `ZIP met ${count} bestanden gedownload`,
        skipToInput: 'Naar invoer springen',
        helpConvert: 'Converteren',
        helpCopy: 'Resultaat kopiëren',
        helpDownload: 'Huidige downloaden',
        helpToggle: 'Deze help in-/uitschakelen',
        helpClose2: 'Dialoog sluiten',
        inputPlaceholder: 'Plak Markdown hier of sleep bestanden om te converteren',
        outputPlaceholder: 'Geconverteerde TXT verschijnt hier',
        privacyNote: 'Alles wordt lokaal in je browser verwerkt',
        ready: 'Klaar',
        unsupportedFiles: 'Kies .md-, .markdown- of .txt-bestanden',
        converted: ({ ms }) => `Geconverteerd · ${ms}ms`,
        noCopy: 'Niets te kopiëren',
        resultCopied: 'Resultaat gekopieerd',
        noDownload: 'Niets te downloaden',
        currentCleared: 'Huidige inhoud gewist',
        filesCleared: 'Bestandswachtrij gewist',
        codeStart: ({ lang }) => `--- Code-begin${lang ? ` ${lang}` : ''} ---`,
        codeEnd: '--- Code-einde ---',
        charsLines: ({ chars, lines, words, minutes }) => `${chars} tekens · ${lines} regels · ${words} woorden · ${minutes} min`,
    }),
});

const samples = {
    en: `---
title: Markdown to TXT sample
tags: [demo, offline]
---

# Weekly project update

> Focus: turn Markdown notes into clean plain text for sharing and archiving.

## Done

- [x] Supports **bold**, *emphasis* and \`inline code\`
- [x] Keeps links: [Project page](https://github.com/example/markdown2txt)
- [x] Converts tables

| Area | Status | Notes |
| --- | --- | --- |
| Converter | Done | Works offline |
| Batch | Done | Multiple files |

\`\`\`js
console.log('Markdown to TXT');
\`\`\`
`,
    zh: `---
title: Markdown 转 TXT 示例
tags: [demo, offline]
---

# 项目周报

> 本周重点：把 Markdown 内容整理成可复制、可归档的纯文本。

## 已完成

- [x] 支持 **加粗**、*强调*、\`行内代码\`
- [x] 链接保留：[项目地址](https://github.com/example/markdown2txt)
- [x] 表格转换

| 模块 | 状态 | 备注 |
| --- | --- | --- |
| 转换 | 完成 | 可离线使用 |
| 批量 | 完成 | 支持多文件 |

\`\`\`js
console.log('Markdown to TXT');
\`\`\`
`,
};

function init() {
    populateLanguageSelect();
    restoreSettings();
    applyTheme(getStoredTheme(), false);
    bindEvents();
    setLanguage(state.lang, false);
    updateStats();
    updateStatus(t('ready'));
}

function getStoredTheme() {
    const stored = localStorage.getItem(settingKeys.theme);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme, persist = true) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (els.themeBtn) {
        els.themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    if (persist) {
        localStorage.setItem(settingKeys.theme, theme);
    }
}

function toggleTheme() {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

function restoreSettings() {
    const savedMode = localStorage.getItem(settingKeys.mode);
    if (savedMode && validModes.includes(savedMode)) {
        state.mode = savedMode;
    }
    setMode(state.mode, false);

    [
        { el: els.keepLinks, key: settingKeys.keepLinks, def: true },
        { el: els.keepCode, key: settingKeys.keepCode, def: true },
        { el: els.removeFrontmatter, key: settingKeys.removeFrontmatter, def: true },
        { el: els.autoConvert, key: settingKeys.autoConvert, def: true },
    ].forEach((item) => {
        const saved = localStorage.getItem(item.key);
        item.el.checked = saved === null ? item.def : saved === '1';
    });
}

function populateLanguageSelect() {
    els.languageSelect.innerHTML = Object.entries(languageMeta).map(([code, meta]) => {
        return `<option value="${escapeAttribute(code)}">${escapeHtml(meta.label)}</option>`;
    }).join('');
}

function bindEvents() {
    els.languageSelect.addEventListener('change', () => {
        setLanguage(els.languageSelect.value);
    });

    els.segments.forEach((segment) => {
        segment.addEventListener('click', () => {
            setMode(segment.dataset.mode);
            runConversion();
        });
    });

    [els.keepLinks, els.keepCode, els.removeFrontmatter, els.autoConvert].forEach((input) => {
        input.addEventListener('change', () => {
            localStorage.setItem(
                input === els.keepLinks ? settingKeys.keepLinks
                    : input === els.keepCode ? settingKeys.keepCode
                    : input === els.removeFrontmatter ? settingKeys.removeFrontmatter
                    : settingKeys.autoConvert,
                input.checked ? '1' : '0'
            );
            if (input !== els.autoConvert) {
                runConversion();
            }
        });
    });

    els.markdownInput.addEventListener('input', () => {
        const activeFile = getActiveFile();
        if (activeFile) {
            activeFile.content = els.markdownInput.value;
        }
        if (els.autoConvert.checked) {
            scheduleConversion();
        } else {
            updateStats();
        }
    });

    els.convertBtn.addEventListener('click', runConversion);
    els.pasteBtn.addEventListener('click', pasteFromClipboard);
    els.sampleBtn.addEventListener('click', loadSample);
    els.copyBtn.addEventListener('click', copyResult);
    els.downloadBtn.addEventListener('click', downloadCurrent);
    els.downloadAllBtn.addEventListener('click', downloadAll);
    els.clearInputBtn.addEventListener('click', clearCurrentInput);
    els.clearFilesBtn.addEventListener('click', clearFiles);
    els.fileUpload.addEventListener('change', (event) => handleFiles(event.target.files));
    els.themeBtn.addEventListener('click', toggleTheme);
    els.presetSelect.addEventListener('change', () => applyPreset(els.presetSelect.value));
    els.helpBtn.addEventListener('click', openHelp);
    els.helpClose.addEventListener('click', closeHelp);
    els.downloadZipBtn.addEventListener('click', downloadZip);

    els.dropArea.addEventListener('click', () => els.fileUpload.click());
    els.dropArea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            els.fileUpload.click();
        }
    });
    els.dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        els.dropArea.classList.add('active');
    });
    els.dropArea.addEventListener('dragleave', () => els.dropArea.classList.remove('active'));
    els.dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        event.stopPropagation();
        els.dropArea.classList.remove('active');
        handleFiles(event.dataTransfer.files);
    });

    document.addEventListener('dragover', (event) => {
        if (event.target === els.dropArea || els.dropArea.contains(event.target)) {
            return;
        }
        event.preventDefault();
        els.dropArea.classList.add('active');
    });
    document.addEventListener('drop', (event) => {
        if (event.target === els.dropArea || els.dropArea.contains(event.target)) {
            return;
        }
        event.preventDefault();
        els.dropArea.classList.remove('active');
        if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
            handleFiles(event.dataTransfer.files);
        }
    });

    els.fileList.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('.file-remove');
        if (removeBtn) {
            event.stopPropagation();
            removeFile(removeBtn.dataset.removeId);
            return;
        }
        const item = event.target.closest('.file-item');
        if (!item) {
            return;
        }
        state.activeFileId = item.dataset.fileId;
        renderFileList();
        showActiveFile();
    });

    els.fileList.addEventListener('keydown', (event) => {
        const item = event.target.closest('.file-item');
        if (!item) {
            return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            state.activeFileId = item.dataset.fileId;
            renderFileList();
            showActiveFile();
        }
    });

    let dragSourceId = null;
    els.fileList.addEventListener('dragstart', (event) => {
        const item = event.target.closest('.file-item');
        if (!item) {
            return;
        }
        dragSourceId = item.dataset.fileId;
        event.dataTransfer.effectAllowed = 'move';
        item.classList.add('dragging');
    });
    els.fileList.addEventListener('dragend', (event) => {
        const item = event.target.closest('.file-item');
        if (item) {
            item.classList.remove('dragging');
        }
        dragSourceId = null;
        els.fileList.querySelectorAll('.file-item').forEach((el) => el.classList.remove('drag-over'));
    });
    els.fileList.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        const item = event.target.closest('.file-item');
        if (!item || item.dataset.fileId === dragSourceId) {
            return;
        }
        els.fileList.querySelectorAll('.file-item').forEach((el) => el.classList.remove('drag-over'));
        item.classList.add('drag-over');
    });
    els.fileList.addEventListener('drop', (event) => {
        event.preventDefault();
        const targetItem = event.target.closest('.file-item');
        if (!targetItem || !dragSourceId) {
            return;
        }
        const targetId = targetItem.dataset.fileId;
        if (targetId === dragSourceId) {
            return;
        }
        reorderFiles(dragSourceId, targetId);
    });

    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            runConversion();
        }
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'c') {
            event.preventDefault();
            copyResult();
        }
        if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'd') {
            event.preventDefault();
            downloadCurrent();
        }
        if (event.key === '?' && !event.ctrlKey && !event.metaKey && !isTypingTarget(event.target)) {
            event.preventDefault();
            openHelp();
        }
        if (event.key === 'Escape' && els.helpDialog && els.helpDialog.open) {
            closeHelp();
        }
    });
}

function isTypingTarget(target) {
    return target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.tagName === 'SELECT');
}

const presets = {
    ai: { mode: 'clean', keepLinks: false, keepCode: false, removeFrontmatter: true, autoConvert: true },
    archive: { mode: 'structured', keepLinks: true, keepCode: true, removeFrontmatter: true, autoConvert: true },
    publish: { mode: 'normal', keepLinks: true, keepCode: false, removeFrontmatter: true, autoConvert: true },
};

function applyPreset(name) {
    const preset = presets[name];
    if (!preset) {
        return;
    }
    setMode(preset.mode);
    els.keepLinks.checked = preset.keepLinks;
    els.keepCode.checked = preset.keepCode;
    els.removeFrontmatter.checked = preset.removeFrontmatter;
    els.autoConvert.checked = preset.autoConvert;
    Object.entries({
        [settingKeys.mode]: preset.mode,
        [settingKeys.keepLinks]: preset.keepLinks ? '1' : '0',
        [settingKeys.keepCode]: preset.keepCode ? '1' : '0',
        [settingKeys.removeFrontmatter]: preset.removeFrontmatter ? '1' : '0',
        [settingKeys.autoConvert]: preset.autoConvert ? '1' : '0',
    }).forEach(([k, v]) => localStorage.setItem(k, v));
    runConversion();
    updateStatus(t('presetApplied', { name: t('preset' + (name ? name.charAt(0).toUpperCase() + name.slice(1) : 'None')) }), 'success');
}

function openHelp() {
    if (els.helpDialog && typeof els.helpDialog.showModal === 'function') {
        els.helpDialog.showModal();
    }
}

function closeHelp() {
    if (els.helpDialog && els.helpDialog.open) {
        els.helpDialog.close();
    }
}

function setMode(mode, persist = true) {
    if (!validModes.includes(mode)) {
        mode = 'normal';
    }
    state.mode = mode;
    if (persist) {
        localStorage.setItem(settingKeys.mode, mode);
    }
    els.segments.forEach((segment) => {
        const active = segment.dataset.mode === mode;
        segment.classList.toggle('active', active);
        segment.setAttribute('aria-checked', String(active));
    });
    updateStatus(t('switchedMode', { mode: getModeLabel(mode) }));
}

function getModeLabel(mode) {
    return {
        normal: t('modeNormal'),
        clean: t('modeClean'),
        structured: t('modeStructured'),
    }[mode] || mode;
}

function setLanguage(lang, persist = true) {
    state.lang = translations[lang] ? lang : 'en';
    if (persist) {
        localStorage.setItem('markdown2txt-lang', state.lang);
    }
    const meta = languageMeta[state.lang] || languageMeta.en;
    document.documentElement.lang = meta.htmlLang;
    document.documentElement.dir = meta.dir;
    document.title = t('appTitle');
    els.languageSelect.value = state.lang;

    document.querySelectorAll('[data-i18n]').forEach((node) => {
        node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
        node.setAttribute('placeholder', t(node.dataset.i18nPlaceholder));
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((node) => {
        node.setAttribute('aria-label', t(node.dataset.i18nAriaLabel));
    });
    document.querySelectorAll('[data-i18n-title]').forEach((node) => {
        node.setAttribute('title', t(node.dataset.i18nTitle));
    });

    if (!getActiveFile()) {
        els.activeFileLabel.textContent = getManualLabel();
    }
    if (els.txtOutput.value || els.markdownInput.value) {
        runConversion();
    } else {
        updateStats();
        updateStatus(t('ready'));
    }
    renderFileList();
}

function t(key, params = {}) {
    const value = (translations[state.lang] && translations[state.lang][key]) || translations.en[key] || key;
    return typeof value === 'function' ? value(params) : value;
}

async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        if (!text.trim()) {
            updateStatus(t('clipboardEmpty'), 'error');
            return;
        }
        setEditorContent(text, 'clipboardContent');
        runConversion();
        updateStatus(t('pastedConverted'), 'success');
    } catch (error) {
        els.markdownInput.focus();
        updateStatus(t('clipboardBlocked'), 'error');
    }
}

function loadSample() {
    setEditorContent(samples[state.lang] || samples.en, 'sampleContent');
    runConversion();
    updateStatus(t('sampleLoaded'), 'success');
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

async function handleFiles(fileList) {
    const files = [...fileList].filter(isSupportedFile);
    const rejectedCount = fileList.length - files.length;
    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    const validFiles = files.filter((f) => f.size <= MAX_FILE_SIZE);

    if (oversized.length) {
        updateStatus(t('fileTooLarge', { name: oversized[0].name }), 'error');
    }

    if (!validFiles.length) {
        if (!oversized.length) {
            updateStatus(t('unsupportedFiles'), 'error');
        }
        return;
    }

    try {
        const loadedFiles = await Promise.all(validFiles.map(readFileAsText));
        const baseIndex = state.files.length;
        const newFiles = loadedFiles.map((file, index) => ({
            id: `${Date.now()}-${baseIndex + index}-${file.name}`,
            name: file.name,
            content: file.content,
            output: '',
        }));
        state.files = state.files.concat(newFiles);
        if (!state.activeFileId || !getActiveFile()) {
            state.activeFileId = newFiles[0].id;
        }
        renderFileList();
        showActiveFile();
        convertAllFiles();
        updateStatus(t('loadedFiles', { count: validFiles.length, rejected: rejectedCount }), 'success');
    } catch (error) {
        updateStatus(t('readFailed', { error: error.message }), 'error');
    } finally {
        els.fileUpload.value = '';
    }
}

function isSupportedFile(file) {
    return /\.(md|markdown|txt)$/i.test(file.name);
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, content: String(reader.result || '') });
        reader.onerror = () => reject(new Error(file.name));
        reader.readAsText(file);
    });
}

function renderFileList() {
    if (!state.files.length) {
        els.fileList.innerHTML = '';
        return;
    }

    els.fileList.innerHTML = state.files.map((file) => {
        const activeClass = file.id === state.activeFileId ? ' active' : '';
        const meta = formatStats(file.content);
        return `<div class="file-item${activeClass}" data-file-id="${escapeAttribute(file.id)}" draggable="true" role="button" tabindex="0">
            <span class="file-name">${escapeHtml(file.name)}</span>
            <span class="file-meta">${meta}</span>
            <button class="file-remove" data-remove-id="${escapeAttribute(file.id)}" aria-label="${t('removeFile')}" title="${t('removeFile')}">×</button>
        </div>`;
    }).join('');
}

function showActiveFile() {
    const activeFile = getActiveFile();
    if (activeFile) {
        els.markdownInput.value = activeFile.content;
        els.txtOutput.value = activeFile.output || convertMarkdown(activeFile.content);
        activeFile.output = els.txtOutput.value;
        els.activeFileLabel.textContent = activeFile.name;
    } else {
        els.activeFileLabel.textContent = getManualLabel();
    }
    updateStats();
}

function getActiveFile() {
    return state.files.find((file) => file.id === state.activeFileId) || null;
}

function removeFile(fileId) {
    state.files = state.files.filter((file) => file.id !== fileId);
    if (state.activeFileId === fileId) {
        state.activeFileId = state.files.length ? state.files[0].id : null;
        showActiveFile();
    }
    renderFileList();
    updateStatus(t('fileRemoved'));
}

function reorderFiles(sourceId, targetId) {
    const sourceIndex = state.files.findIndex((f) => f.id === sourceId);
    const targetIndex = state.files.findIndex((f) => f.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
        return;
    }
    const [moved] = state.files.splice(sourceIndex, 1);
    state.files.splice(targetIndex, 0, moved);
    renderFileList();
}

function setEditorContent(content, labelKey) {
    state.activeFileId = null;
    state.manualLabelKey = labelKey;
    els.markdownInput.value = content;
    els.activeFileLabel.textContent = getManualLabel();
    renderFileList();
    updateStats();
}

function getManualLabel() {
    return t(state.manualLabelKey || 'manualInput');
}

function runConversion() {
    const start = performance.now();
    const activeFile = getActiveFile();

    if (activeFile) {
        convertAllFiles();
    } else {
        els.txtOutput.value = convertMarkdown(els.markdownInput.value);
    }

    updateStats();
    const elapsed = Math.max(1, Math.round(performance.now() - start));
    updateStatus(t('converted', { ms: elapsed }), 'success');
}

let conversionTimer = null;
function scheduleConversion() {
    if (conversionTimer) {
        clearTimeout(conversionTimer);
    }
    conversionTimer = setTimeout(() => {
        conversionTimer = null;
        runConversion();
    }, 200);
}

function convertAllFiles() {
    state.files.forEach((file) => {
        file.output = convertMarkdown(file.content);
    });
    const activeFile = getActiveFile();
    if (activeFile) {
        els.txtOutput.value = activeFile.output;
    }
    renderFileList();
}

function convertMarkdown(markdown) {
    const options = {
        keepLinks: els.keepLinks.checked,
        keepCode: els.keepCode.checked,
        removeFrontmatter: els.removeFrontmatter.checked,
        mode: state.mode,
    };
    return markdownToText(markdown, options);
}

const inlineHtmlAllowlist = ['kbd', 'sup', 'sub', 'abbr', 'cite', 'b', 'i', 'em', 'strong', 'code', 'span', 'mark', 'small', 'u', 's', 'var', 'samp'];

function markdownToText(markdown, options) {
    const ctx = {
        text: normalizeText(markdown),
        options,
        codeBlocks: [],
        footnotes: [],
        mathBlocks: [],
    };

    const pipeline = [
        stripFrontmatter,
        extractCodeBlocks,
        extractMath,
        stripHtmlComments,
        stripAdmonitions,
        stripFootnoteDefinitions,
        convertAutoLinks,
        stripDisallowedHtml,
        convertImages,
        convertLinks,
        convertReferenceLinks,
        convertTables,
        stripInlineCode,
        stripEmphasis,
        stripStrikethrough,
        convertHeadings,
        convertBlockquotes,
        convertTaskLists,
        convertUnorderedLists,
        convertOrderedLists,
        convertDefinitionLists,
        reinsertMath,
        reinsertCodeBlocks,
    ];

    pipeline.forEach((step) => { ctx.text = step(ctx); });
    return cleanupText(ctx.text, options.mode);
}

function stripFrontmatter(ctx) {
    if (!ctx.options.removeFrontmatter) {
        return ctx.text;
    }
    return ctx.text.replace(/^---\n[\s\S]*?\n---\n?/, '');
}

function extractCodeBlocks(ctx) {
    return ctx.text.replace(/```([\w-]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
        if (!ctx.options.keepCode) {
            return '\n';
        }
        const token = `\uE003${ctx.codeBlocks.length}\uE004`;
        ctx.codeBlocks.push(formatCodeBlock(code, lang, ctx.options.mode));
        return `\n${token}\n`;
    });
}

function extractMath(ctx) {
    return ctx.text
        .replace(/\$\$([\s\S]*?)\$\$/g, (_, body) => {
            const token = `\uE005${ctx.mathBlocks.length}\uE006`;
            ctx.mathBlocks.push(formatMathBlock(body, ctx.options.mode));
            return `\n${token}\n`;
        })
        .replace(/\$([^$\n]+?)\$/g, (_, body) => {
            const token = `\uE005${ctx.mathBlocks.length}\uE006`;
            ctx.mathBlocks.push(formatMathInline(body, ctx.options.mode));
            return token;
        });
}

function stripHtmlComments(ctx) {
    return ctx.text.replace(/<!--[\s\S]*?-->/g, '');
}

function stripAdmonitions(ctx) {
    return ctx.text.replace(/^[ \t]{0,3}!!![ \t]+(?:\[[^\]]+\][ \t]+)?(\w+)[^\n]*\n([ \t]+.*(?:\n[ \t]+.*)*)/gm, (_, type, body) => `[${type}] ${body.replace(/^[ \t]+/gm, '').trim()}`);
}

function stripFootnoteDefinitions(ctx) {
    let text = ctx.text.replace(/^[ \t]{0,3}\[\^[^\]]+\]:[ \t]+.*(?:\n[ \t]+.*)*$/gm, (match) => {
        ctx.footnotes.push(match.replace(/^[ \t]{0,3}\[\^([^\]]+)\]:[ \t]+/, '').trim());
        return '';
    });
    text = text.replace(/\[\^[^\]]+\]/g, '');
    return text;
}

function convertAutoLinks(ctx) {
    return ctx.text.replace(/<(https?:\/\/[^>\s]+)>/g, ctx.options.keepLinks ? '$1' : '');
}

function stripDisallowedHtml(ctx) {
    return ctx.text
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|li|tr|h[1-6]|ul|ol|blockquote|pre|table|thead|tbody)>/gi, '\n')
        .replace(new RegExp(`<\\/?(?!${inlineHtmlAllowlist.join('|')})[a-zA-Z][^>]*>`, 'g'), '');
}

function convertImages(ctx) {
    return ctx.text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
}

function convertLinks(ctx) {
    return ctx.text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, ctx.options.keepLinks ? '$1 ($2)' : '$1');
}

function convertReferenceLinks(ctx) {
    return ctx.text
        .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
        .replace(/^[ \t]{0,3}\[[^\]]+\]:[ \t]+.*$/gm, '');
}

function convertTables(ctx) {
    return ctx.text
        .replace(/^[ \t]*\|?([ \t]*:?-{3,}:?[ \t]*\|)+[ \t]*:?-{3,}:?[ \t]*\|?[ \t]*$/gm, '')
        .replace(/^[ \t]*\|(.+)\|[ \t]*$/gm, (_, row) => row.split('|').map((cell) => cell.trim()).join('\t'));
}

function stripInlineCode(ctx) {
    return ctx.text.replace(/`([^`]+)`/g, '$1');
}

function stripEmphasis(ctx) {
    return ctx.text
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2');
}

function stripStrikethrough(ctx) {
    return ctx.text.replace(/~~(.*?)~~/g, '$1');
}

function convertHeadings(ctx) {
    return ctx.text.replace(/^[ \t]{0,3}#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/gm, (match, title) => formatHeading(title, match, ctx.options.mode));
}

function convertBlockquotes(ctx) {
    if (ctx.options.mode === 'structured') {
        return ctx.text.replace(/^[ \t]{0,3}>[ \t]?/gm, '| ');
    }
    return ctx.text.replace(/^[ \t]{0,3}>[ \t]?/gm, '');
}

function convertTaskLists(ctx) {
    return ctx.text.replace(/^([ \t]*)[-*+][ \t]+\[[ xX]\][ \t]+/gm, (_, indent) => ctx.options.mode === 'clean' ? `${indent}` : `${indent}- `);
}

function convertUnorderedLists(ctx) {
    return ctx.text.replace(/^([ \t]*)[-*+][ \t]+/gm, (_, indent) => ctx.options.mode === 'clean' ? `${indent}` : `${indent}- `);
}

function convertOrderedLists(ctx) {
    return ctx.text.replace(/^([ \t]*)(\d+)\.[ \t]+/gm, (_, indent, num) => ctx.options.mode === 'clean' ? `${indent}` : `${indent}${num}. `);
}

function convertDefinitionLists(ctx) {
    return ctx.text.replace(/^([^\n]+)\n:[ \t]+(.+)$/gm, (_, term, def) => `${term}: ${def}`);
}

function reinsertMath(ctx) {
    ctx.mathBlocks.forEach((math, index) => {
        ctx.text = ctx.text.split(`\uE005${index}\uE006`).join(math);
    });
    return ctx.text;
}

function reinsertCodeBlocks(ctx) {
    ctx.codeBlocks.forEach((code, index) => {
        ctx.text = ctx.text.split(`\uE003${index}\uE004`).join(code);
    });
    return ctx.text;
}

function normalizeText(text) {
    return String(text || '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}

function formatHeading(title, raw, mode) {
    const cleanTitle = title.trim();
    if (mode !== 'structured') {
        return cleanTitle;
    }
    const level = (raw.match(/^([ \t]{0,3}#{1,6})/) || ['#'])[0].trim().length;
    if (level === 1) {
        return `\n${cleanTitle}\n${'='.repeat(cleanTitle.length)}`;
    }
    if (level === 2) {
        return `\n${cleanTitle}\n${'-'.repeat(cleanTitle.length)}`;
    }
    return `\n${'#'.repeat(Math.min(level, 6))} ${cleanTitle}`;
}

function formatCodeBlock(code, lang, mode) {
    const cleanCode = code.replace(/\n+$/, '');
    if (!cleanCode.trim()) {
        return '';
    }
    if (mode === 'clean') {
        return `\n${cleanCode}\n`;
    }
    return `${t('codeStart', { lang })}\n${cleanCode}\n${t('codeEnd')}`;
}

function formatMathBlock(body, mode) {
    const clean = body.replace(/^\n+|\n+$/g, '');
    if (mode === 'clean') {
        return `\n${clean}\n`;
    }
    return `\n--- Math ---\n${clean}\n--- Math end ---\n`;
}

function formatMathInline(body, mode) {
    if (mode === 'clean') {
        return body;
    }
    return body;
}

function cleanupText(text, mode) {
    let output = text
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/(\S)[ \t]{2,}/g, '$1 ')
        .trim();

    if (mode === 'structured') {
        output = output.replace(/\n{3,}/g, '\n\n');
    }

    return output;
}

async function copyResult() {
    const text = els.txtOutput.value;
    if (!text.trim()) {
        updateStatus(t('noCopy'), 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        updateStatus(t('resultCopied'), 'success');
    } catch (error) {
        els.txtOutput.select();
        document.execCommand('copy');
        updateStatus(t('fallbackCopied'), 'success');
    }
}

function downloadCurrent() {
    const text = els.txtOutput.value;
    if (!text.trim()) {
        updateStatus(t('noDownload'), 'error');
        return;
    }
    const activeFile = getActiveFile();
    const fileName = activeFile ? toTxtName(activeFile.name) : 'markdown-converted.txt';
    downloadText(fileName, text);
    updateStatus(t('downloaded', { file: fileName }), 'success');
}

function downloadAll() {
    if (state.files.length <= 1) {
        downloadCurrent();
        return;
    }
    const content = state.files.map((file) => {
        const output = file.output || convertMarkdown(file.content);
        return `===== ${file.name} =====\n\n${output}`;
    }).join('\n\n');
    downloadText('markdown2txt-batch.txt', content);
    updateStatus(t('batchDownloaded', { count: state.files.length }), 'success');
}

function downloadZip() {
    if (!state.files.length) {
        updateStatus(t('noDownload'), 'error');
        return;
    }
    const entries = state.files.map((file) => ({
        name: toTxtName(file.name),
        content: file.output || convertMarkdown(file.content),
    }));
    const zipBytes = buildZip(entries);
    const blob = new Blob([zipBytes], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'markdown2txt-batch.zip';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    updateStatus(t('zipDownloaded', { count: entries.length }), 'success');
}

function buildZip(entries) {
    const fileRecords = [];
    const centralRecords = [];
    let offset = 0;
    const encoder = new TextEncoder();

    entries.forEach((entry) => {
        const nameBytes = encoder.encode(entry.name);
        const dataBytes = encoder.encode(entry.content);
        const crc = crc32(dataBytes);
        const localHeader = new Uint8Array(30 + nameBytes.length);
        const localView = new DataView(localHeader.buffer);
        localView.setUint32(0, 0x04034b50, true);
        localView.setUint16(4, 20, true);
        localView.setUint16(6, 0, true);
        localView.setUint16(8, 0, true);
        localView.setUint16(10, 0, true);
        localView.setUint16(12, 0, true);
        localView.setUint32(14, crc, true);
        localView.setUint32(18, dataBytes.length, true);
        localView.setUint32(22, dataBytes.length, true);
        localView.setUint16(26, nameBytes.length, true);
        localView.setUint16(28, 0, true);
        localHeader.set(nameBytes, 30);

        const centralHeader = new Uint8Array(46 + nameBytes.length);
        const centralView = new DataView(centralHeader.buffer);
        centralView.setUint32(0, 0x02014b50, true);
        centralView.setUint16(4, 20, true);
        centralView.setUint16(6, 20, true);
        centralView.setUint16(8, 0, true);
        centralView.setUint16(10, 0, true);
        centralView.setUint16(12, 0, true);
        centralView.setUint16(14, 0, true);
        centralView.setUint32(16, crc, true);
        centralView.setUint32(20, dataBytes.length, true);
        centralView.setUint32(24, dataBytes.length, true);
        centralView.setUint16(28, nameBytes.length, true);
        centralView.setUint16(30, 0, true);
        centralView.setUint16(32, 0, true);
        centralView.setUint16(34, 0, true);
        centralView.setUint32(36, 0, true);
        centralView.setUint32(42, offset, true);
        centralHeader.set(nameBytes, 46);

        fileRecords.push(localHeader, dataBytes);
        centralRecords.push(centralHeader);
        offset += localHeader.length + dataBytes.length;
    });

    const centralBytes = concatUint8(centralRecords);
    const endRecord = new Uint8Array(22);
    const endView = new DataView(endRecord.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(8, entries.length, true);
    endView.setUint16(10, entries.length, true);
    endView.setUint32(12, centralBytes.length, true);
    endView.setUint32(16, offset, true);

    return concatUint8([...fileRecords, centralBytes, endRecord]);
}

function concatUint8(arrays) {
    let total = 0;
    arrays.forEach((a) => { total += a.length; });
    const result = new Uint8Array(total);
    let pos = 0;
    arrays.forEach((a) => { result.set(a, pos); pos += a.length; });
    return result;
}

const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c >>> 0;
    }
    return table;
})();

function crc32(bytes) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

function downloadText(fileName, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function toTxtName(fileName) {
    return fileName.replace(/\.(md|markdown|txt)$/i, '') + '.txt';
}

function clearCurrentInput() {
    const activeFile = getActiveFile();
    if (activeFile) {
        activeFile.content = '';
        activeFile.output = '';
    }
    els.markdownInput.value = '';
    els.txtOutput.value = '';
    updateStats();
    renderFileList();
    updateStatus(t('currentCleared'));
}

function clearFiles() {
    state.files = [];
    state.activeFileId = null;
    state.manualLabelKey = 'manualInput';
    els.markdownInput.value = '';
    els.txtOutput.value = '';
    els.activeFileLabel.textContent = getManualLabel();
    renderFileList();
    updateStats();
    updateStatus(t('filesCleared'));
}

function updateStats() {
    els.inputStats.textContent = formatStats(els.markdownInput.value);
    els.outputStats.textContent = formatStats(els.txtOutput.value);
}

function formatStats(text) {
    const value = String(text || '');
    const chars = value.length;
    const lines = value ? value.split('\n').length : 0;
    const words = countWords(value);
    const minutes = Math.max(1, Math.round(words / 200));
    return t('charsLines', { chars, lines, words, minutes });
}

function countWords(text) {
    const value = String(text || '').trim();
    if (!value) {
        return 0;
    }
    const cjk = (value.match(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
    const others = (value.match(/[a-zA-Z0-9]+/g) || []).length;
    return cjk + others;
}

function updateStatus(message, type = '') {
    els.statusBar.textContent = message;
    els.statusBar.className = type;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#096;');
}

window.addEventListener('load', () => {
    init();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
});
