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
};

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
        downloadCurrent: 'Download current',
        downloadAll: 'Download all',
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
        charsLines: ({ chars, lines }) => `${chars} chars · ${lines} lines`,
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
        downloadCurrent: '下载当前',
        downloadAll: '下载全部',
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
        charsLines: ({ chars, lines }) => `${chars} 字 · ${lines} 行`,
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
        downloadCurrent: '下載目前結果',
        downloadAll: '下載全部',
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
        charsLines: ({ chars, lines }) => `${chars} 字 · ${lines} 行`,
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
        downloadCurrent: '現在の結果をダウンロード',
        downloadAll: 'すべてダウンロード',
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
        charsLines: ({ chars, lines }) => `${chars} 文字 · ${lines} 行`,
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
        downloadCurrent: '현재 결과 다운로드',
        downloadAll: '전체 다운로드',
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
        charsLines: ({ chars, lines }) => `${chars}자 · ${lines}줄`,
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
        downloadCurrent: 'Descargar actual',
        downloadAll: 'Descargar todo',
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
        charsLines: ({ chars, lines }) => `${chars} caracteres · ${lines} líneas`,
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
        downloadCurrent: 'Baixar atual',
        downloadAll: 'Baixar tudo',
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
        charsLines: ({ chars, lines }) => `${chars} caracteres · ${lines} linhas`,
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
        downloadCurrent: 'ดาวน์โหลดไฟล์ปัจจุบัน',
        downloadAll: 'ดาวน์โหลดทั้งหมด',
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
        charsLines: ({ chars, lines }) => `${chars} อักขระ · ${lines} บรรทัด`,
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
        downloadCurrent: 'הורד נוכחי',
        downloadAll: 'הורד הכול',
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
        charsLines: ({ chars, lines }) => `${chars} תווים · ${lines} שורות`,
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
        downloadCurrent: 'Скачать текущий',
        downloadAll: 'Скачать всё',
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
        charsLines: ({ chars, lines }) => `${chars} симв. · ${lines} строк`,
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
        downloadCurrent: 'تنزيل الحالي',
        downloadAll: 'تنزيل الكل',
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
        charsLines: ({ chars, lines }) => `${chars} حرف · ${lines} سطر`,
    }),
    fr: withFallback({
        appTitle: 'Markdown vers TXT',
        appSubtitle: 'Convertisseur hors ligne · Prêt pour le lot · Confidentialité d’abord',
        languageLabel: 'Langue',
        paste: 'Coller',
        openFiles: 'Ouvrir des fichiers',
        sample: 'Exemple',
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
        convert: 'Convertir',
        copyResult: 'Copier le résultat',
        downloadCurrent: 'Télécharger actuel',
        downloadAll: 'Tout télécharger',
        privacyNote: 'Tout est traité localement dans votre navigateur',
        ready: 'Prêt',
        charsLines: ({ chars, lines }) => `${chars} caractères · ${lines} lignes`,
    }),
    de: withFallback({
        appTitle: 'Markdown zu TXT',
        appSubtitle: 'Offline-Konverter · Stapelbereit · Datenschutz zuerst',
        languageLabel: 'Sprache',
        paste: 'Einfügen',
        openFiles: 'Dateien öffnen',
        sample: 'Beispiel',
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
        convert: 'Konvertieren',
        copyResult: 'Ergebnis kopieren',
        downloadCurrent: 'Aktuelle Datei laden',
        downloadAll: 'Alles herunterladen',
        privacyNote: 'Alles wird lokal in Ihrem Browser verarbeitet',
        ready: 'Bereit',
        charsLines: ({ chars, lines }) => `${chars} Zeichen · ${lines} Zeilen`,
    }),
    it: withFallback({
        appTitle: 'Markdown in TXT',
        appSubtitle: 'Convertitore offline · Pronto per batch · Privacy prima di tutto',
        languageLabel: 'Lingua',
        paste: 'Incolla',
        openFiles: 'Apri file',
        sample: 'Esempio',
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
        convert: 'Converti',
        copyResult: 'Copia risultato',
        downloadCurrent: 'Scarica corrente',
        downloadAll: 'Scarica tutto',
        privacyNote: 'Tutto viene elaborato localmente nel browser',
        ready: 'Pronto',
        charsLines: ({ chars, lines }) => `${chars} caratteri · ${lines} righe`,
    }),
    hi: withFallback({
        appTitle: 'Markdown से TXT',
        appSubtitle: 'ऑफलाइन कनवर्टर · बैच तैयार · गोपनीयता पहले',
        languageLabel: 'भाषा',
        paste: 'पेस्ट',
        openFiles: 'फ़ाइलें खोलें',
        sample: 'नमूना',
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
        convert: 'बदलें',
        copyResult: 'परिणाम कॉपी करें',
        downloadCurrent: 'वर्तमान डाउनलोड करें',
        downloadAll: 'सब डाउनलोड करें',
        privacyNote: 'सब कुछ आपके ब्राउज़र में स्थानीय रूप से संसाधित होता है',
        ready: 'तैयार',
        charsLines: ({ chars, lines }) => `${chars} अक्षर · ${lines} पंक्तियाँ`,
    }),
    id: withFallback({
        appTitle: 'Markdown ke TXT',
        appSubtitle: 'Konverter offline · Siap batch · Privasi utama',
        languageLabel: 'Bahasa',
        paste: 'Tempel',
        openFiles: 'Buka file',
        sample: 'Contoh',
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
        convert: 'Konversi',
        copyResult: 'Salin hasil',
        downloadCurrent: 'Unduh saat ini',
        downloadAll: 'Unduh semua',
        privacyNote: 'Semua diproses secara lokal di browser Anda',
        ready: 'Siap',
        charsLines: ({ chars, lines }) => `${chars} karakter · ${lines} baris`,
    }),
    vi: withFallback({
        appTitle: 'Markdown sang TXT',
        appSubtitle: 'Chuyển đổi ngoại tuyến · Hỗ trợ hàng loạt · Ưu tiên riêng tư',
        languageLabel: 'Ngôn ngữ',
        paste: 'Dán',
        openFiles: 'Mở tệp',
        sample: 'Mẫu',
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
        convert: 'Chuyển đổi',
        copyResult: 'Sao chép kết quả',
        downloadCurrent: 'Tải tệp hiện tại',
        downloadAll: 'Tải tất cả',
        privacyNote: 'Mọi thứ được xử lý cục bộ trong trình duyệt',
        ready: 'Sẵn sàng',
        charsLines: ({ chars, lines }) => `${chars} ký tự · ${lines} dòng`,
    }),
    tr: withFallback({
        appTitle: 'Markdown TXT’ye',
        appSubtitle: 'Çevrimdışı dönüştürücü · Toplu iş hazır · Gizlilik öncelikli',
        languageLabel: 'Dil',
        paste: 'Yapıştır',
        openFiles: 'Dosyaları aç',
        sample: 'Örnek',
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
        convert: 'Dönüştür',
        copyResult: 'Sonucu kopyala',
        downloadCurrent: 'Geçerli olanı indir',
        downloadAll: 'Tümünü indir',
        privacyNote: 'Her şey tarayıcınızda yerel olarak işlenir',
        ready: 'Hazır',
        charsLines: ({ chars, lines }) => `${chars} karakter · ${lines} satır`,
    }),
    pl: withFallback({
        appTitle: 'Markdown do TXT',
        appSubtitle: 'Konwerter offline · Obsługa wsadowa · Prywatność przede wszystkim',
        languageLabel: 'Język',
        paste: 'Wklej',
        openFiles: 'Otwórz pliki',
        sample: 'Przykład',
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
        convert: 'Konwertuj',
        copyResult: 'Kopiuj wynik',
        downloadCurrent: 'Pobierz bieżący',
        downloadAll: 'Pobierz wszystko',
        privacyNote: 'Wszystko jest przetwarzane lokalnie w przeglądarce',
        ready: 'Gotowe',
        charsLines: ({ chars, lines }) => `${chars} znaków · ${lines} wierszy`,
    }),
    nl: withFallback({
        appTitle: 'Markdown naar TXT',
        appSubtitle: 'Offline converter · Batch-klaar · Privacy eerst',
        languageLabel: 'Taal',
        paste: 'Plakken',
        openFiles: 'Bestanden openen',
        sample: 'Voorbeeld',
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
        convert: 'Converteren',
        copyResult: 'Resultaat kopiëren',
        downloadCurrent: 'Huidige downloaden',
        downloadAll: 'Alles downloaden',
        privacyNote: 'Alles wordt lokaal in je browser verwerkt',
        ready: 'Klaar',
        charsLines: ({ chars, lines }) => `${chars} tekens · ${lines} regels`,
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
    bindEvents();
    setLanguage(state.lang, false);
    updateStats();
    updateStatus(t('ready'));
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

    [els.keepLinks, els.keepCode, els.removeFrontmatter].forEach((input) => {
        input.addEventListener('change', runConversion);
    });

    els.markdownInput.addEventListener('input', () => {
        const activeFile = getActiveFile();
        if (activeFile) {
            activeFile.content = els.markdownInput.value;
        }
        if (els.autoConvert.checked) {
            runConversion();
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
        els.dropArea.classList.remove('active');
        handleFiles(event.dataTransfer.files);
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
    });
}

function setMode(mode) {
    state.mode = mode;
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

async function handleFiles(fileList) {
    const files = [...fileList].filter(isSupportedFile);
    const rejectedCount = fileList.length - files.length;

    if (!files.length) {
        updateStatus(t('unsupportedFiles'), 'error');
        return;
    }

    try {
        const loadedFiles = await Promise.all(files.map(readFileAsText));
        state.files = loadedFiles.map((file, index) => ({
            id: `${Date.now()}-${index}-${file.name}`,
            name: file.name,
            content: file.content,
            output: '',
        }));
        state.activeFileId = state.files[0].id;
        renderFileList();
        showActiveFile();
        convertAllFiles();
        updateStatus(t('loadedFiles', { count: files.length, rejected: rejectedCount }), 'success');
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
        return `<button class="file-item${activeClass}" data-file-id="${escapeAttribute(file.id)}">
            <span class="file-name">${escapeHtml(file.name)}</span>
            <span class="file-meta">${meta}</span>
        </button>`;
    }).join('');

    els.fileList.querySelectorAll('.file-item').forEach((item) => {
        item.addEventListener('click', () => {
            state.activeFileId = item.dataset.fileId;
            renderFileList();
            showActiveFile();
        });
    });
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

    if (state.files.length) {
        convertAllFiles();
    } else {
        els.txtOutput.value = convertMarkdown(els.markdownInput.value);
    }

    if (activeFile) {
        els.txtOutput.value = activeFile.output;
    }

    updateStats();
    const elapsed = Math.max(1, Math.round(performance.now() - start));
    updateStatus(t('converted', { ms: elapsed }), 'success');
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

function markdownToText(markdown, options) {
    let text = normalizeText(markdown);
    const codeBlocks = [];

    if (options.removeFrontmatter) {
        text = text.replace(/^---\n[\s\S]*?\n---\n?/, '');
    }

    text = text.replace(/```([\w-]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
        if (!options.keepCode) {
            return '\n';
        }
        const token = `@@CODE_BLOCK_${codeBlocks.length}@@`;
        codeBlocks.push(formatCodeBlock(code, lang, options.mode));
        return `\n${token}\n`;
    });

    text = text
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|li|tr|h[1-6])>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, options.keepLinks ? '$1 ($2)' : '$1')
        .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
        .replace(/^\s*\|?(\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/gm, '')
        .replace(/^\s*\|(.+)\|\s*$/gm, (_, row) => row.split('|').map((cell) => cell.trim()).join('\t'))
        .replace(/`([^`]+)`/g, '$1')
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        .replace(/~~(.*?)~~/g, '$1')
        .replace(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/gm, (match, title) => formatHeading(title, match, options.mode))
        .replace(/^\s{0,3}>\s?/gm, options.mode === 'structured' ? '| ' : '')
        .replace(/^\s*[-*+]\s+\[[ xX]\]\s+/gm, options.mode === 'clean' ? '' : '- ')
        .replace(/^\s*[-*+]\s+/gm, options.mode === 'clean' ? '' : '- ')
        .replace(/^\s*\d+\.\s+/gm, options.mode === 'clean' ? '' : (match) => match.trim() + ' ');

    codeBlocks.forEach((code, index) => {
        text = text.replace(`@@CODE_BLOCK_${index}@@`, code);
    });

    return decodeHtmlEntities(cleanupText(text, options.mode));
}

function normalizeText(text) {
    return String(text || '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}

function formatHeading(title, raw, mode) {
    const cleanTitle = title.trim();
    if (mode !== 'structured') {
        return cleanTitle;
    }
    const level = (raw.match(/^(\s{0,3}#{1,6})/) || ['#'])[0].trim().length;
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
        return cleanCode;
    }
    return `${t('codeStart', { lang })}\n${cleanCode}\n${t('codeEnd')}`;
}

function cleanupText(text, mode) {
    let output = text
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

    if (mode === 'structured') {
        output = output.replace(/\n{3,}/g, '\n\n');
    }

    return output;
}

function decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
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
    els.activeFileLabel.textContent = getManualLabel();
    renderFileList();
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
    return t('charsLines', { chars, lines });
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

window.addEventListener('load', init);
