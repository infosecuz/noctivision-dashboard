import { Language } from './types';

type TranslationKey = 
  | 'app.title'
  | 'app.subtitle'
  | 'mode.basic'
  | 'mode.expert'
  | 'status.running'
  | 'status.idle'
  | 'status.paused'
  | 'status.error'
  | 'status.connecting'
  | 'status.disconnected'
  | 'status.valid'
  | 'status.invalid'
  | 'status.captcha'
  | 'status.mfa'
  | 'kpi.total'
  | 'kpi.rate'
  | 'kpi.queue'
  | 'kpi.workers'
  | 'kpi.latency'
  | 'upload.title'
  | 'upload.dropzone'
  | 'upload.button'
  | 'upload.accepted'
  | 'upload.deduped'
  | 'upload.disabled'
  | 'upload.error'
  | 'results.title'
  | 'results.empty'
  | 'results.loading'
  | 'results.time'
  | 'results.domain'
  | 'results.url'
  | 'results.login'
  | 'results.password'
  | 'results.status'
  | 'results.message'
  | 'results.latency'
  | 'results.actions'
  | 'results.viewDetails'
  | 'results.showPassword'
  | 'filters.title'
  | 'filters.status'
  | 'filters.errorType'
  | 'filters.domain'
  | 'filters.search'
  | 'filters.latency'
  | 'filters.dateRange'
  | 'filters.clear'
  | 'filters.apply'
  | 'export.title'
  | 'export.csv'
  | 'export.json'
  | 'export.server'
  | 'export.client'
  | 'stats.title'
  | 'stats.window'
  | 'stats.avgLatency'
  | 'stats.p50'
  | 'stats.p90'
  | 'stats.p99'
  | 'stats.topErrors'
  | 'stats.series'
  | 'stats.downloadCsv'
  | 'admin.title'
  | 'admin.token'
  | 'admin.tokenPlaceholder'
  | 'admin.tokenMissing'
  | 'admin.workers'
  | 'admin.start'
  | 'admin.pause'
  | 'admin.continue'
  | 'admin.stop'
  | 'admin.queue'
  | 'admin.drain'
  | 'admin.resume'
  | 'admin.clear'
  | 'admin.cleanup'
  | 'admin.reset'
  | 'admin.resetConfirm'
  | 'admin.domains'
  | 'admin.domainLimit'
  | 'admin.playwright'
  | 'admin.concurrency'
  | 'admin.apply'
  | 'admin.delete'
  | 'admin.set'
  | 'activity.title'
  | 'activity.empty'
  | 'nocti.title'
  | 'nocti.placeholder'
  | 'nocti.ask'
  | 'nocti.thinking'
  | 'nocti.contexts'
  | 'nocti.close'
  | 'live.auto'
  | 'live.websocket'
  | 'live.sse'
  | 'live.off'
  | 'settings.baseUrl'
  | 'settings.apiUrl'
  | 'settings.noctiUrl'
  | 'common.confirm'
  | 'common.cancel'
  | 'common.save'
  | 'common.close'
  | 'common.refresh'
  | 'common.perPage'
  | 'error.unauthorized'
  | 'error.network'
  | 'error.unknown';

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    'app.title': 'NoctiVision',
    'app.subtitle': 'Credential Validation Monitor',
    'mode.basic': 'Basic',
    'mode.expert': 'Expert',
    'status.running': 'Running',
    'status.idle': 'Idle',
    'status.paused': 'Paused',
    'status.error': 'Error',
    'status.connecting': 'Connecting...',
    'status.disconnected': 'Disconnected',
    'status.valid': 'Valid',
    'status.invalid': 'Invalid',
    'status.captcha': 'Captcha',
    'status.mfa': 'MFA',
    'kpi.total': 'Total',
    'kpi.rate': 'Rate/min',
    'kpi.queue': 'Queue',
    'kpi.workers': 'Workers',
    'kpi.latency': 'Avg Latency',
    'upload.title': 'Upload',
    'upload.dropzone': 'Drop .txt file here or click to browse',
    'upload.button': 'Upload',
    'upload.accepted': 'Accepted',
    'upload.deduped': 'Deduplicated',
    'upload.disabled': 'Uploads disabled (drain active)',
    'upload.error': 'Upload failed',
    'results.title': 'Results',
    'results.empty': 'No results yet',
    'results.loading': 'Loading...',
    'results.time': 'Time',
    'results.domain': 'Domain',
    'results.url': 'URL',
    'results.login': 'Login',
    'results.password': 'Password',
    'results.status': 'Status',
    'results.message': 'Message',
    'results.latency': 'Latency',
    'results.actions': 'Actions',
    'results.viewDetails': 'View Details',
    'results.showPassword': 'Show Password',
    'filters.title': 'Filters',
    'filters.status': 'Status',
    'filters.errorType': 'Error Type',
    'filters.domain': 'Domain',
    'filters.search': 'Search URL/Login/Message',
    'filters.latency': 'Latency (ms)',
    'filters.dateRange': 'Date Range',
    'filters.clear': 'Clear',
    'filters.apply': 'Apply',
    'export.title': 'Export',
    'export.csv': 'CSV',
    'export.json': 'JSON',
    'export.server': 'Server Export',
    'export.client': 'Client Export',
    'stats.title': 'Statistics',
    'stats.window': 'Window',
    'stats.avgLatency': 'Avg Latency',
    'stats.p50': 'P50',
    'stats.p90': 'P90',
    'stats.p99': 'P99',
    'stats.topErrors': 'Top Error Domains',
    'stats.series': 'Time Series',
    'stats.downloadCsv': 'Download CSV',
    'admin.title': 'Admin Controls',
    'admin.token': 'Admin Token',
    'admin.tokenPlaceholder': 'Enter admin token...',
    'admin.tokenMissing': 'Admin token required',
    'admin.workers': 'Workers',
    'admin.start': 'Start',
    'admin.pause': 'Pause',
    'admin.continue': 'Continue',
    'admin.stop': 'Stop',
    'admin.queue': 'Queue',
    'admin.drain': 'Drain',
    'admin.resume': 'Resume',
    'admin.clear': 'Clear',
    'admin.cleanup': 'Cleanup',
    'admin.reset': 'Reset DB',
    'admin.resetConfirm': 'Are you sure? This will delete all data!',
    'admin.domains': 'Domain Limits',
    'admin.domainLimit': 'Concurrency Limit',
    'admin.playwright': 'Playwright',
    'admin.concurrency': 'Concurrency',
    'admin.apply': 'Apply',
    'admin.delete': 'Delete',
    'admin.set': 'Set',
    'activity.title': 'Activity Log',
    'activity.empty': 'No activity yet',
    'nocti.title': 'Nocti AI Assistant',
    'nocti.placeholder': 'Ask Nocti anything...',
    'nocti.ask': 'Ask',
    'nocti.thinking': 'Thinking...',
    'nocti.contexts': 'Related Contexts',
    'nocti.close': 'Close',
    'live.auto': 'Auto',
    'live.websocket': 'WebSocket',
    'live.sse': 'SSE',
    'live.off': 'Off',
    'settings.baseUrl': 'Base URL',
    'settings.apiUrl': 'API URL',
    'settings.noctiUrl': 'Nocti AI URL',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.close': 'Close',
    'common.refresh': 'Refresh',
    'common.perPage': 'per page',
    'error.unauthorized': 'Invalid or missing admin token',
    'error.network': 'Network error',
    'error.unknown': 'Unknown error occurred',
  },
  ru: {
    'app.title': 'NoctiVision',
    'app.subtitle': 'Монитор валидации учётных данных',
    'mode.basic': 'Базовый',
    'mode.expert': 'Эксперт',
    'status.running': 'Работает',
    'status.idle': 'Простой',
    'status.paused': 'Пауза',
    'status.error': 'Ошибка',
    'status.connecting': 'Подключение...',
    'status.disconnected': 'Отключено',
    'status.valid': 'Валидный',
    'status.invalid': 'Невалидный',
    'status.captcha': 'Капча',
    'status.mfa': 'MFA',
    'kpi.total': 'Всего',
    'kpi.rate': 'Скорость/мин',
    'kpi.queue': 'Очередь',
    'kpi.workers': 'Воркеры',
    'kpi.latency': 'Ср. задержка',
    'upload.title': 'Загрузка',
    'upload.dropzone': 'Перетащите .txt файл сюда или нажмите для выбора',
    'upload.button': 'Загрузить',
    'upload.accepted': 'Принято',
    'upload.deduped': 'Дедуплицировано',
    'upload.disabled': 'Загрузка отключена (активен дренаж)',
    'upload.error': 'Ошибка загрузки',
    'results.title': 'Результаты',
    'results.empty': 'Пока нет результатов',
    'results.loading': 'Загрузка...',
    'results.time': 'Время',
    'results.domain': 'Домен',
    'results.url': 'URL',
    'results.login': 'Логин',
    'results.password': 'Пароль',
    'results.status': 'Статус',
    'results.message': 'Сообщение',
    'results.latency': 'Задержка',
    'results.actions': 'Действия',
    'results.viewDetails': 'Детали',
    'results.showPassword': 'Показать пароль',
    'filters.title': 'Фильтры',
    'filters.status': 'Статус',
    'filters.errorType': 'Тип ошибки',
    'filters.domain': 'Домен',
    'filters.search': 'Поиск URL/Логин/Сообщение',
    'filters.latency': 'Задержка (мс)',
    'filters.dateRange': 'Период',
    'filters.clear': 'Очистить',
    'filters.apply': 'Применить',
    'export.title': 'Экспорт',
    'export.csv': 'CSV',
    'export.json': 'JSON',
    'export.server': 'Серверный экспорт',
    'export.client': 'Клиентский экспорт',
    'stats.title': 'Статистика',
    'stats.window': 'Окно',
    'stats.avgLatency': 'Ср. задержка',
    'stats.p50': 'P50',
    'stats.p90': 'P90',
    'stats.p99': 'P99',
    'stats.topErrors': 'Топ ошибок по доменам',
    'stats.series': 'Временной ряд',
    'stats.downloadCsv': 'Скачать CSV',
    'admin.title': 'Управление',
    'admin.token': 'Токен админа',
    'admin.tokenPlaceholder': 'Введите токен...',
    'admin.tokenMissing': 'Требуется токен админа',
    'admin.workers': 'Воркеры',
    'admin.start': 'Старт',
    'admin.pause': 'Пауза',
    'admin.continue': 'Продолжить',
    'admin.stop': 'Стоп',
    'admin.queue': 'Очередь',
    'admin.drain': 'Дренаж',
    'admin.resume': 'Возобновить',
    'admin.clear': 'Очистить',
    'admin.cleanup': 'Очистка',
    'admin.reset': 'Сброс БД',
    'admin.resetConfirm': 'Вы уверены? Все данные будут удалены!',
    'admin.domains': 'Лимиты доменов',
    'admin.domainLimit': 'Лимит параллелизма',
    'admin.playwright': 'Playwright',
    'admin.concurrency': 'Параллелизм',
    'admin.apply': 'Применить',
    'admin.delete': 'Удалить',
    'admin.set': 'Установить',
    'activity.title': 'Журнал активности',
    'activity.empty': 'Нет активности',
    'nocti.title': 'Nocti AI Ассистент',
    'nocti.placeholder': 'Спросите Nocti что угодно...',
    'nocti.ask': 'Спросить',
    'nocti.thinking': 'Думаю...',
    'nocti.contexts': 'Связанные контексты',
    'nocti.close': 'Закрыть',
    'live.auto': 'Авто',
    'live.websocket': 'WebSocket',
    'live.sse': 'SSE',
    'live.off': 'Выкл',
    'settings.baseUrl': 'Базовый URL',
    'settings.apiUrl': 'URL API',
    'settings.noctiUrl': 'URL Nocti AI',
    'common.confirm': 'Подтвердить',
    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
    'common.close': 'Закрыть',
    'common.refresh': 'Обновить',
    'common.perPage': 'на странице',
    'error.unauthorized': 'Неверный или отсутствующий токен',
    'error.network': 'Ошибка сети',
    'error.unknown': 'Произошла неизвестная ошибка',
  },
  uz: {
    'app.title': 'NoctiVision',
    'app.subtitle': 'Hisob maʼlumotlarini tekshirish monitori',
    'mode.basic': 'Oddiy',
    'mode.expert': 'Ekspert',
    'status.running': 'Ishlayapti',
    'status.idle': 'Kutish',
    'status.paused': 'Toʻxtatildi',
    'status.error': 'Xato',
    'status.connecting': 'Ulanmoqda...',
    'status.disconnected': 'Uzilgan',
    'status.valid': 'Yaroqli',
    'status.invalid': 'Yaroqsiz',
    'status.captcha': 'Captcha',
    'status.mfa': 'MFA',
    'kpi.total': 'Jami',
    'kpi.rate': 'Tezlik/min',
    'kpi.queue': 'Navbat',
    'kpi.workers': 'Ishchilar',
    'kpi.latency': "O'rtacha kechikish",
    'upload.title': 'Yuklash',
    'upload.dropzone': '.txt faylni bu yerga tashlang yoki tanlash uchun bosing',
    'upload.button': 'Yuklash',
    'upload.accepted': 'Qabul qilindi',
    'upload.deduped': 'Takrorlanganlar',
    'upload.disabled': "Yuklash o'chirilgan (drain faol)",
    'upload.error': 'Yuklash xatosi',
    'results.title': 'Natijalar',
    'results.empty': 'Hali natijalar yoʻq',
    'results.loading': 'Yuklanmoqda...',
    'results.time': 'Vaqt',
    'results.domain': 'Domen',
    'results.url': 'URL',
    'results.login': 'Login',
    'results.password': 'Parol',
    'results.status': 'Holat',
    'results.message': 'Xabar',
    'results.latency': 'Kechikish',
    'results.actions': 'Amallar',
    'results.viewDetails': 'Batafsil',
    'results.showPassword': 'Parolni koʻrsatish',
    'filters.title': 'Filtrlar',
    'filters.status': 'Holat',
    'filters.errorType': 'Xato turi',
    'filters.domain': 'Domen',
    'filters.search': 'URL/Login/Xabar qidirish',
    'filters.latency': 'Kechikish (ms)',
    'filters.dateRange': 'Sana oraligʻi',
    'filters.clear': 'Tozalash',
    'filters.apply': 'Qoʻllash',
    'export.title': 'Eksport',
    'export.csv': 'CSV',
    'export.json': 'JSON',
    'export.server': 'Server eksporti',
    'export.client': 'Klient eksporti',
    'stats.title': 'Statistika',
    'stats.window': 'Oyna',
    'stats.avgLatency': "O'rtacha kechikish",
    'stats.p50': 'P50',
    'stats.p90': 'P90',
    'stats.p99': 'P99',
    'stats.topErrors': 'Eng koʻp xatoli domenlar',
    'stats.series': 'Vaqt qatori',
    'stats.downloadCsv': 'CSV yuklab olish',
    'admin.title': 'Boshqaruv',
    'admin.token': 'Admin tokeni',
    'admin.tokenPlaceholder': 'Tokenni kiriting...',
    'admin.tokenMissing': 'Admin tokeni kerak',
    'admin.workers': 'Ishchilar',
    'admin.start': 'Boshlash',
    'admin.pause': 'Toʻxtatish',
    'admin.continue': 'Davom etish',
    'admin.stop': 'Toʻxtatish',
    'admin.queue': 'Navbat',
    'admin.drain': 'Drain',
    'admin.resume': 'Davom',
    'admin.clear': 'Tozalash',
    'admin.cleanup': 'Tozalash',
    'admin.reset': 'DB qayta tiklash',
    'admin.resetConfirm': "Ishonchingiz komilmi? Barcha ma'lumotlar o'chiriladi!",
    'admin.domains': 'Domen limitlari',
    'admin.domainLimit': 'Parallellik limiti',
    'admin.playwright': 'Playwright',
    'admin.concurrency': 'Parallellik',
    'admin.apply': 'Qoʻllash',
    'admin.delete': 'Oʻchirish',
    'admin.set': "O'rnatish",
    'activity.title': 'Faoliyat jurnali',
    'activity.empty': 'Hali faoliyat yoʻq',
    'nocti.title': 'Nocti AI Yordamchi',
    'nocti.placeholder': "Nocti'dan nimani so'rasangiz bo'ladi...",
    'nocti.ask': "So'rash",
    'nocti.thinking': 'Oʻylamoqda...',
    'nocti.contexts': 'Bogʻliq kontekstlar',
    'nocti.close': 'Yopish',
    'live.auto': 'Avto',
    'live.websocket': 'WebSocket',
    'live.sse': 'SSE',
    'live.off': "O'chiq",
    'settings.baseUrl': 'Asosiy URL',
    'settings.apiUrl': 'API URL',
    'settings.noctiUrl': 'Nocti AI URL',
    'common.confirm': 'Tasdiqlash',
    'common.cancel': 'Bekor qilish',
    'common.save': 'Saqlash',
    'common.close': 'Yopish',
    'common.refresh': 'Yangilash',
    'common.perPage': 'sahifada',
    'error.unauthorized': "Noto'g'ri yoki yo'q token",
    'error.network': 'Tarmoq xatosi',
    'error.unknown': "Noma'lum xato yuz berdi",
  },
};

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key] || translations.en[key] || key;
}

export function getNextLanguage(current: Language): Language {
  const order: Language[] = ['uz', 'en', 'ru'];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
}

export const languageNames: Record<Language, string> = {
  uz: "O'zbek",
  en: 'English',
  ru: 'Русский',
};
