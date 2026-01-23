// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ
// ============================================

// Константы для карты
const IMAGE_BOUNDS = [[0, 0], [800, 800]];
const IMAGE_URL = 'assets/worldmap.webp';

// Глобальные переменные
let map;
let allMarkers = [];
let markersByFilter = {
    'Алтари': [],
    'Бижутерия': [],
    'Жуки': [],
    'Записки': [], 
    'Ключи': [],
    'Книги': [],
    'Книги Древних': [],
    'Костры': [],
    'Легендарное оружие': [],
    'Места для отдыха': [],
    'Места для рыбалки': [],
    'НИП': [],
    'Обелиски': [],
    'Опасные противники': [],
    'Особые': [],
    'Пещеры': [],
    'Предметы': [],
    'Ремесло': [],
    'Рецепты': [],
    'Рудные жилы': [],
    'Сундуки': [],
    'Телепорты': [],
    'Точки исследования': [],
    'Травы': [],
    'Характеристики': [],
    'Хряк контрабандистов': [],
    'Мои метки': []
};
let subfilters = {
    'Бижутерия': ['Правые кольца', 'Левые кольца', 'Амулеты'],
    'НИП': ['Квестодатели', 'Торговцы', 'Учителя созидания', 'Учителя выживания', 'Учителя войны', 'Другие'],
    'Опасные противники': ['Альфа', 'Квестовые монстры'],
    'Особые': ['Головоломки', 'Квестовые вещи', 'Неизвестно'],
    'Ремесло': ['Алхимия', 'Верстаки', 'Заточка', 'Ковка', 'Плавильня', 'Укрепление', 'Шкуры', 'Ювелир'],
    'Рудные жилы': ['Железные', 'Золотые', 'Кристаллические', 'Угольные'],
    'Сундуки': ['Взломать', 'Копать', 'Шифр'],
    'Травы': ['Бык', 'Здравица', 'Зорька', 'Ловчанка', 'Мул', 'Лунный побег'],
    'Характеристики': ['Сила', 'Ловкость', 'Выносливость', 'Проницательность', 'Крепкость', 'Свободные очки', 'Навыки']
};
// Состояния
let filterStates = {};
let subfilterStates = {};
// Хранилище состояний "отмечено" для маркеров
let markedMarkers = {};
let hideCompletedEnabled = false;
// Состояния инструментов
let coordsEnabled = false;

// Режим создания меток
let createMarkersMode = false;
let userMarkers = [];

// Счетчик для уникальных ID пользовательских меток
let userMarkerCounter = 0;

// Элементы DOM
const filterElements = {};
const subfilterElements = {};

// Иконки маркеров
const markerIcons = {
    'default': L.icon({
        iconUrl: 'assets/Unknown.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
        tooltipAnchor: [15, 0]
    })
};

// Конфигурации
const filtersConfig = [
    { name: 'Все фильтры', color: '#2196F3', special: true, icon: null },
    { name: 'Алтари', color: '#4CAF50', icon: 'assets/altar.png', hasSubfilters: false },
    { name: 'Бижутерия', color: '#4CAF50', icon: 'assets/jewelry.png', hasSubfilters: true },
    { name: 'Жуки', color: '#4CAF50', icon: 'assets/beetle.png', hasSubfilters: false },
    { name: 'Записки', color: '#4CAF50', icon: 'assets/note.png', hasSubfilters: false },
    { name: 'Ключи', color: '#4CAF50', icon: 'assets/key.png', hasSubfilters: false },
    { name: 'Книги', color: '#4CAF50', icon: 'assets/book.png', hasSubfilters: false },
    { name: 'Книги Древних', color: '#4CAF50', icon: 'assets/ancient_book.png', hasSubfilters: false },
    { name: 'Костры', color: '#4CAF50', icon: 'assets/fire.png', hasSubfilters: false },
    { name: 'Легендарное оружие', color: '#4CAF50', icon: 'assets/legend.png', hasSubfilters: false },
    { name: 'Места для отдыха', color: '#4CAF50', icon: 'assets/rest.png', hasSubfilters: false },
    { name: 'Места для рыбалки', color: '#4CAF50', icon: 'assets/fishing.png', hasSubfilters: false },
    { name: 'НИП', color: '#4CAF50', icon: 'assets/npc.png', hasSubfilters: true },
    { name: 'Обелиски', color: '#4CAF50', icon: 'assets/obelisk.png', hasSubfilters: false },
    { name: 'Опасные противники', color: '#4CAF50', icon: 'assets/monster.png', hasSubfilters: true },
    { name: 'Особые', color: '#4CAF50', icon: 'assets/unknown.png', hasSubfilters: true },
    { name: 'Пещеры', color: '#4CAF50', icon: 'assets/cave.png', hasSubfilters: false },
    { name: 'Предметы', color: '#4CAF50', icon: 'assets/item.png', hasSubfilters: false },
    { name: 'Ремесло', color: '#4CAF50', icon: 'assets/craft.png', hasSubfilters: false },
    { name: 'Рецепты', color: '#4CAF50', icon: 'assets/recipe.png', hasSubfilters: false },
    { name: 'Рудные жилы', color: '#4CAF50', icon: 'assets/ore.png', hasSubfilters: true },
    { name: 'Сундуки', color: '#4CAF50', icon: 'assets/chest.png', hasSubfilters: true },
    { name: 'Телепорты', color: '#4CAF50', icon: 'assets/teleport.png', hasSubfilters: false },
    { name: 'Точки исследования', color: '#4CAF50', icon: 'assets/complite.png', hasSubfilters: false },
    { name: 'Травы', color: '#4CAF50', icon: 'assets/herb.png', hasSubfilters: true },
    { name: 'Характеристики', color: '#4CAF50', icon: 'assets/stats.png', hasSubfilters: true },
    { name: 'Хряк контрабандистов', color: '#4CAF50', icon: 'assets/pig.png', hasSubfilters: false },
    { name: 'Мои метки', color: '#4CAF50', icon: 'assets/marker.png', hasSubfilters: false }
];

const specialMarksConfig = [
    { name: 'Король жуков', description: 'Появляется после раздавливания 20 жуков. Даст Зелье Умения', completed: false, hasSubmarks: false, submarks: [] },
    { name: 'Бонус за еду +СИЛ', description: 'После съедания 20 единиц', completed: false, hasSubmarks: true, submarks: ['Свежие булочки с мясом', 'Пирожки с яблоком', 'Мощное мясное рагу'] },
    { name: 'Бонус за еду +ЛВК', description: 'После съедания 20 единиц', completed: false, hasSubmarks: true, submarks: ['Красные яблоки', 'Пирожки с капустой', 'Пирожки с коричневиком', 'Пирог с синькой', 'Мощное рыбное рагу'] },
    { name: 'Бонус за еду +ВЫН', description: 'После съедания 20 единиц', completed: false, hasSubmarks: true, submarks: ['Риони и помидоры', 'Ржёнка', 'Свежие булочки с картошкой'] },
    { name: 'Бонус за еду +ПРЦ', description: 'После съедания 20 единиц', completed: false, hasSubmarks: true, submarks: ['Морковь', 'Пирожки с грибами'] },
    { name: 'Бонус за еду +КРП', description: 'После съедания 20 Мясо со специями', completed: false, hasSubmarks: false, submarks: [] }
];

let specialMarksStates = {};
let specialSubmarksStates = {};

// ============================================
// ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ КАРТЫ
// ============================================

/**
 * Инициализация карты Leaflet
 */
function initMap() {
    map = L.map('map', {
        crs: L.CRS.Simple,
        maxBounds: IMAGE_BOUNDS,
        maxZoom: 5,
        minZoom: 0,
        doubleClickZoom: false,
    });
    
    // Добавляем изображение карты
    L.imageOverlay(IMAGE_URL, IMAGE_BOUNDS).addTo(map);
    
    // Настраиваем контролы
    map.removeControl(map.zoomControl);
    L.control.zoom({ position: 'topright' }).addTo(map);
    
    // Инициализация иконок
    initMarkerIcons();
    
    // Инициализация состояний
    initAllStates();
    
    // Загружаем сохраненное состояние карты
    loadMapState();
    
    // Настраиваем обработчики событий
    setupEventListeners();
}

function checkMapImage() {
    console.log('Проверка загрузки карты...');
    
    // Проверяем разные форматы
    const formats = [
        'assets/worldmap.webp',
        'assets/worldmap.png',
        'assets/worldmap.jpg'
    ];
    
    formats.forEach(url => {
        const img = new Image();
        img.onload = () => console.log(`✅ ${url} - доступен`);
        img.onerror = () => console.log(`❌ ${url} - не доступен`);
        img.src = url;
    });
}

/**
 * Инициализация иконок маркеров
 */
function initMarkerIcons() {
    const iconConfigs = {
        'Алтари': 'assets/altar.png',
        'Бижутерия': 'assets/jewelry.png',
        'Жуки': 'assets/beetle.png',
        'Записки': 'assets/note.png',
        'Ключи': 'assets/key.png',
        'Книги': 'assets/book.png',
        'Книги Древних': 'assets/ancient_book.png',
        'Костры': 'assets/fire.png',
        'Легендарное оружие': 'assets/legend.png',
        'Места для отдыха': 'assets/rest.png',
        'Места для рыбалки': 'assets/fishing.png',
        'НПС': 'assets/npc.png',
        'Обелиски': 'assets/obelisk.png',
        'Опасные противники': 'assets/monster.png',
        'Особые': 'assets/unknown.png',        
        'Пещеры': 'assets/cave.png',
        'Предметы': 'assets/item.png',
        'Ремесло': 'assets/craft.png',
        'Рецепты': 'assets/recipe.png',
        'Рудные жилы': 'assets/ore.png',
        'Сундуки': 'assets/chest.png',
        'Телепорты': 'assets/teleport.png',
        'Точки исследования': 'assets/complite.png',
        'Травы': 'assets/herb.png',
        'Характеристики': 'assets/stats.png',
        'Хряк контрабандистов': 'assets/pig.png',
        'Мои метки': 'assets/marker.png'
    };
    
    Object.entries(iconConfigs).forEach(([filterName, iconPath]) => {
        markerIcons[filterName] = L.icon({
            iconUrl: iconPath,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -20],
            tooltipAnchor: [15, 0]
        });
    });
}

/**
 * Настройка обработчиков событий карты
 */
function setupEventListeners() {
    // Сохранение состояния карты
    map.on('moveend', saveMapState);
    map.on('zoomend', saveMapState);
    
    // Клик по карте - закрытие тултипов
    map.on('click', function(e) {
        const target = e.originalEvent.target;
        const isMarker = target.closest('.leaflet-marker-icon');
        const isTooltip = target.closest('.clicked-tooltip');
        const isCheckbox = target.closest('.tooltip-mark-checkbox');
        const isLabel = target.closest('.tooltip-mark-label');
        const isFiltersPanel = target.closest('.filters-container');
        const isSpecialMarksPanel = target.closest('.special-marks-container');
        const isToolsPanel = target.closest('.tools-container');
        
        // В режиме создания меток - создаем новую метку
        if (createMarkersMode && !isMarker && !isTooltip && !isCheckbox && !isLabel && 
            !isFiltersPanel && !isSpecialMarksPanel && !isToolsPanel) {
            createMarkerDialog(e.latlng);
            return;
        }
        
        // Закрываем тултипы только при клике вне элементов интерфейса
        if (!isMarker && !isTooltip && !isCheckbox && !isLabel && 
            !isFiltersPanel && !isSpecialMarksPanel && !isToolsPanel) {
            closeAllTooltips();
        }
    });
    
    // Закрытие тултипов по клавише ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeAllTooltips();
        }
    });
    
    // Сохранение перед закрытием страницы
    window.addEventListener('beforeunload', function() {
        saveMapState();
        saveFilterStates();
        saveSpecialMarksStates();
        saveToolsStates();
        saveMarkedMarkers();
    });
    
    // Периодическое сохранение
    setInterval(function() {
        saveMapState();
        saveFilterStates();
        saveSpecialMarksStates();
        saveToolsStates();
        saveMarkedMarkers();
    }, 30000);
}

// ============================================
// РАБОТА С СОСТОЯНИЯМИ (LOCALSTORAGE)
// ============================================

/**
 * Сохранение состояния карты (позиция и зум)
 */
function saveMapState() {
    try {
        const center = map.getCenter();
        const zoom = map.getZoom();
        
        const mapState = {
            lat: center.lat,
            lng: center.lng,
            zoom: zoom,
            timestamp: Date.now()
        };
        
        localStorage.setItem('mapViewState', JSON.stringify(mapState));
    } catch (error) {
        console.error('Ошибка сохранения состояния карты:', error);
    }
}

/**
 * Загрузка состояния карты
 */
function loadMapState() {
    try {
        const saved = localStorage.getItem('mapViewState');
        if (saved) {
            const mapState = JSON.parse(saved);
            
            if (mapState.lat && mapState.lng && mapState.zoom !== undefined) {
                map.setView([mapState.lat, mapState.lng], mapState.zoom, {
                    animate: false
                });
                console.log('Состояние карты восстановлено:', mapState);
                return true;
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки состояния карты:', error);
    }
    return false;
}

/**
 * Сохранение состояний фильтров
 */
function saveFilterStates() {
    const statesToSave = {
        filterStates: filterStates,
        subfilterStates: subfilterStates
    };
    localStorage.setItem('mapFilterStates', JSON.stringify(statesToSave));
}

/**
 * Загрузка состояний фильтров
 */
function loadFilterStates() {
    const saved = localStorage.getItem('mapFilterStates');
    if (saved) {
        try {
            const states = JSON.parse(saved);
            
            if (states.filterStates) {
                Object.assign(filterStates, states.filterStates);
            }
            
            if (states.subfilterStates) {
                Object.assign(subfilterStates, states.subfilterStates);
            }
            
            console.log('Состояния фильтров загружены из localStorage');
            return true;
        } catch (error) {
            console.error('Ошибка загрузки состояний фильтров:', error);
        }
    }
    
    // Если сохраненных состояний нет, инициализируем значениями из конфига
    console.log('Состояния фильтров не найдены, инициализируем из конфига');
    filtersConfig.forEach(filter => {
        if (!filter.special && !subfilters[filter.name] && filterStates[filter.name] === undefined) {
            filterStates[filter.name] = true;
        }
    });
    
    // Инициализируем подфильтры
    Object.keys(subfilters).forEach(parentFilter => {
        subfilters[parentFilter].forEach(subfilter => {
            if (subfilterStates[subfilter] === undefined) {
                subfilterStates[subfilter] = true;
            }
        });
    });
    
    return false;
}

/**
 * Сохранение состояний особых меток
 */
function saveSpecialMarksStates() {
    const statesToSave = {
        specialMarksStates: specialMarksStates,
        specialSubmarksStates: specialSubmarksStates
    };
    localStorage.setItem('specialMarksStates', JSON.stringify(statesToSave));
}

/**
 * Загрузка состояний особых меток
 */
function loadSpecialMarksStates() {
    const saved = localStorage.getItem('specialMarksStates');
    if (saved) {
        try {
            const states = JSON.parse(saved);
            
            if (states.specialMarksStates) {
                Object.assign(specialMarksStates, states.specialMarksStates);
            }
            
            if (states.specialSubmarksStates) {
                Object.assign(specialSubmarksStates, states.specialSubmarksStates);
            }
            
            console.log('Состояния особых меток загружены');
            return true;
        } catch (error) {
            console.error('Ошибка загрузки состояний особых меток:', error);
        }
    }
    return false;
}

/**
 * Сохранение состояний инструментов
 */
function saveToolsStates() {
    const statesToSave = {
        coordsEnabled: coordsEnabled,
        hideCompletedEnabled: hideCompletedEnabled
    };
    localStorage.setItem('toolsStates', JSON.stringify(statesToSave));
}

/**
 * Загрузка состояний инструментов
 */
function loadToolsStates() {
    const saved = localStorage.getItem('toolsStates');
    if (saved) {
        try {
            const states = JSON.parse(saved);
            
            if (states.coordsEnabled !== undefined) {
                coordsEnabled = states.coordsEnabled;
            }
            
            if (states.hideCompletedEnabled !== undefined) {
                hideCompletedEnabled = states.hideCompletedEnabled;
            }
            
            console.log('Состояния инструментов загружены:', states);
            return true;
        } catch (error) {
            console.error('Ошибка загрузки состояний инструментов:', error);
        }
    }
    
    // Значения по умолчанию
    coordsEnabled = false;
    hideCompletedEnabled = false;
    
    console.log('Состояния инструментов не найдены, установлены значения по умолчанию');
    return false;
}

/**
 * Сохранение пользовательских меток
 */
function saveUserMarkers() {
    try {
        const markersToSave = userMarkers.map(marker => ({
            id: marker.customId,
            name: marker.markerData.Название,
            filters: marker.markerData.ОсновныеФильтры,
            subfilters: marker.markerData.Подфильтры,
            allFilters: marker.markerData.ВсеФильтрыВПорядке,
            x: marker.markerData.X,
            y: marker.markerData.Y,
            comment: marker.markerData.Комментарий || '',
            isMarked: markedMarkers[marker.customId] || false
        }));
        
        localStorage.setItem('userMarkers', JSON.stringify(markersToSave));
        console.log('Пользовательские метки сохранены:', markersToSave.length);
    } catch (error) {
        console.error('Ошибка сохранения пользовательских меток:', error);
    }
}

/**
 * Загрузка пользовательских меток
 */
function loadUserMarkers() {
    try {
        const saved = localStorage.getItem('userMarkers');
        if (saved) {
            const markersData = JSON.parse(saved);
            
            // Обновляем счетчик
            markersData.forEach(data => {
                const idParts = data.id.split('_');
                const counterPart = parseInt(idParts[idParts.length - 1]);
                if (!isNaN(counterPart) && counterPart >= userMarkerCounter) {
                    userMarkerCounter = counterPart + 1;
                }
            });
            
            markersData.forEach(data => {
                // Создаем объект данных маркера в том же формате, что и из CSV
                const markerData = {
                    Название: data.name,
                    ОсновныеФильтры: data.filters || ['Мои метки'],
                    Подфильтры: data.subfilters || [],
                    ВсеФильтрыВПорядке: data.allFilters || ['Мои метки'],
                    X: data.x,
                    Y: data.y,
                    Комментарий: data.comment || ''
                };
                
                // Создаем маркер с правильным ID
                const marker = createUserMarker(markerData, data.id);
                
                // Восстанавливаем состояние "отмечено"
                if (data.isMarked) {
                    markedMarkers[data.id] = true;
                    // Обновляем внешний вид
                    setTimeout(() => {
                        updateMarkerAppearance(marker, true);
                    }, 100);
                }
            });
            
            console.log('Пользовательские метки загружены:', markersData.length);
            
            // ОБНОВЛЯЕМ ВИДИМОСТЬ ПОСЛЕ ЗАГРУЗКИ
            setTimeout(() => {
                updateAllMarkersVisibility();
            }, 200);
        }
    } catch (error) {
        console.error('Ошибка загрузки пользовательских меток:', error);
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ СОСТОЯНИЙ
// ============================================

/**
 * Инициализация всех состояний приложения
 */
function initAllStates() {
    // Сначала загружаем сохраненные состояния
    loadFilterStates();
    loadSpecialMarksStates();
    loadToolsStates();
    
    // Инициализация состояний фильтров (только если не загружены из localStorage)
    filtersConfig.forEach(filter => {
        if (filterStates[filter.name] === undefined && !filter.special && !subfilters[filter.name]) {
            filterStates[filter.name] = true;
        }
    });
    
    // Инициализация состояний подфильтров
    Object.keys(subfilters).forEach(parentFilter => {
        subfilters[parentFilter].forEach(subfilter => {
            if (subfilterStates[subfilter] === undefined) {
                subfilterStates[subfilter] = true;
            }
        });
    });
    
    specialMarksConfig.forEach(mark => {
        if (specialMarksStates[mark.name] === undefined) {
            specialMarksStates[mark.name] = mark.completed;
        }
        
        if (mark.hasSubmarks && mark.submarks) {
            mark.submarks.forEach(submark => {
                const fullName = `${mark.name} - ${submark}`;
                if (specialSubmarksStates[fullName] === undefined) {
                    specialSubmarksStates[fullName] = false;
                }
            });
        }
    });
}

// ============================================
// ЗАГРУЗКА И ОТОБРАЖЕНИЕ МЕТОК
// ============================================

/**
 * Загрузка меток из JSON файла
 */
async function loadMarkersFromJSON() {
    try {
        const response = await fetch('tags.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markersData = await response.json();
        
        console.log(`Загрузка JSON: найдено ${markersData.length} записей`);
        
        // Очищаем предыдущие маркеры
        allMarkers = [];
        markersByFilter = {
        'Алтари': [], 'Бижутерия': [], 'Жуки': [], 'Записки': [], 
        'Квестовые предметы': [], 'Ключи': [], 'Книги': [], 'Книги Древних': [],
        'Костры': [], 'Легендарное оружие': [], 'Места для отдыха': [], 'Места для рыбалки': [],
        'НИП': [], 'Обелиски': [], 'Опасные противники': [], 'Пещеры': [],
        'Предметы': [], 'Ремесло': [], 'Рецепты': [], 'Рудные жилы': [],
        'Сундуки': [], 'Телепорты': [], 'Точки исследования': [], 'Травы': [],
        'Характеристики': [], 'Хряк контрабандистов': [], 'Мои метки': []
        };
        
        // Создаем маркеры
        markersData.forEach((data, index) => {
            if (data.Название && !isNaN(data.X) && !isNaN(data.Y)) {
                console.log(`Создание маркера ${index + 1}: ${data.Название}`);
                createMarkerFromJSON(data);
            }
        });
        
        console.log(`Создано ${allMarkers.length} маркеров из JSON`);
        
        // Инициализируем видимость
        initializeMarkersVisibility();
        
    } catch (error) {
        console.error('Ошибка загрузки JSON:', error);
        console.log('Создаю тестовые метки...');
        createTestMarkers();
        
        initializeMarkersVisibility();
    }
}

/**
 * Создание маркера на карте
 */
function createMarkerFromJSON(data) {
    let iconToUse = markerIcons['default'];
    
    // Используем поле "Иконка" для определения иконки
    if (data.Иконка) {
        if (markerIcons[data.Иконка]) {
            iconToUse = markerIcons[data.Иконка];
        } else {
            // Пробуем найти среди подфильтров
            for (const [parentFilter, subfilterList] of Object.entries(subfilters)) {
                if (subfilterList.includes(data.Иконка) && markerIcons[parentFilter]) {
                    iconToUse = markerIcons[parentFilter];
                    break;
                }
            }
        }
    }
    
    const marker = L.marker([data.Y, data.X], {
        icon: iconToUse,
        riseOnHover: true,
        bubblingMouseEvents: false
    });
    
    // Используем ID из JSON или генерируем новый
    const markerId = data.ID || generateMarkerId(data);
    marker.customId = markerId;
    
    // Popup для наведения
    const popupContent = `
        <div style="padding: 0 4px; font-size: 14px; font-weight: bold; white-space: nowrap; color: white;">
            ${data.Название}
        </div>
    `;
    
    const popup = L.popup({
        closeOnClick: false,
        autoClose: false,
        closeButton: false,
        className: 'hover-popup',
        closeOnEscapeKey: false
    }).setContent(popupContent);
    
    marker.bindPopup(popup);
    
    // Подготавливаем данные в нужном формате
    const markerData = {
        Название: data.Название,
        ОсновныеФильтры: data.ОсновныеФильтры || [],
        Подфильтры: data.Подфильтры || [],
        ВсеФильтрыВПорядке: buildAllFilters(data),
        X: data.X,
        Y: data.Y,
        Комментарий: data.Комментарий || ''
    };
    
    // Настраиваем обработчики событий
    let tooltip = null;
    setupMarkerEventHandlers(marker, markerData, tooltip);
    
    // Сохраняем данные в маркере
    marker.markerData = markerData;
    marker.mainFilters = data.ОсновныеФильтры || [];
    marker.subfilters = data.Подфильтры || [];
    
    // Добавляем в глобальные массивы
    allMarkers.push(marker);
    
    // Распределяем по фильтрам
    if (data.ОсновныеФильтры) {
        data.ОсновныеФильтры.forEach(filter => {
            if (!markersByFilter[filter]) {
                markersByFilter[filter] = [];
            }
            markersByFilter[filter].push(marker);
        });
    }
    
    if (data.Подфильтры) {
        data.Подфильтры.forEach(subfilter => {
            if (!markersByFilter[subfilter]) {
                markersByFilter[subfilter] = [];
            }
            markersByFilter[subfilter].push(marker);
        });
    }
    
    return marker;
}

/**
 * Строим массив "ВсеФильтрыВПорядке" из данных JSON
 */
function buildAllFilters(data) {
    const allFilters = [];
    
    // Добавляем основной фильтр для иконки первым
    if (data.Иконка && !allFilters.includes(data.Иконка)) {
        allFilters.push(data.Иконка);
    }
    
    // Добавляем основные фильтры
    if (data.ОсновныеФильтры) {
        data.ОсновныеФильтры.forEach(filter => {
            if (!allFilters.includes(filter)) {
                allFilters.push(filter);
            }
        });
    }
    
    // Добавляем подфильтры
    if (data.Подфильтры) {
        data.Подфильтры.forEach(subfilter => {
            if (!allFilters.includes(subfilter)) {
                allFilters.push(subfilter);
            }
        });
    }
    
    return allFilters;
}

/**
 * Загрузка состояния отмеченных маркеров
 */
function loadMarkedMarkers() {
    console.log('Функция loadMarkedMarkers() вызвана');
    
    try {
        const saved = localStorage.getItem('markedMarkers');
        console.log('Данные из localStorage:', saved);
        
        if (saved) {
            markedMarkers = JSON.parse(saved);
            
            console.log(`Загружено состояние для ${Object.keys(markedMarkers).length} отмеченных маркеров`);
            
            // Применяем состояние к существующим маркерам
            allMarkers.forEach(marker => {
                const markerId = marker.customId;
                if (markedMarkers[markerId]) {
                    console.log(`Применяем отмеченное состояние к маркеру ${markerId}`);
                    updateMarkerAppearance(marker, true);
                }
            });
        } else {
            console.log('Нет сохраненных данных об отмеченных маркерах');
            markedMarkers = {};
        }
    } catch (error) {
        console.error('Ошибка загрузки отмеченных маркеров:', error);
        markedMarkers = {};
    }
}

/**
 * Снять все отметки с маркеров
 */
function clearAllMarkedMarkers() {
    console.log('Снимаем все отметки с маркеров...');
    
    // Проверяем, есть ли вообще отмеченные маркеры
    const markedCount = Object.keys(markedMarkers).filter(id => markedMarkers[id]).length;
    if (markedCount === 0) {
        alert('Нет отмеченных меток для снятия.');
        return;
    }
    
    // Снимаем отметки со всех маркеров
    allMarkers.forEach(marker => {
        const markerId = marker.customId;
        if (markedMarkers[markerId]) {
            // Обновляем состояние
            markedMarkers[markerId] = false;
            
            // Обновляем внешний вид маркера, если он на карте
            if (map.hasLayer(marker)) {
                updateMarkerAppearance(marker, false);
            }
            
            // Закрываем открытый тултип, если он активен
            if (marker.isTooltipActive) {
                marker.closeTooltip();
                marker.isTooltipActive = false;
                const element = marker.getElement();
                if (element) {
                    element.classList.remove('tooltip-active');
                }
            }
        }
    });

    // Также снимаем отметки с пользовательских меток в их данных
    userMarkers.forEach(marker => {
        const markerId = marker.customId;
        if (markedMarkers[markerId]) {
            markedMarkers[markerId] = false;
            updateMarkerAppearance(marker, false);
        }
    });
    
    // Сохраняем обновленное состояние
    saveMarkedMarkers();
    saveUserMarkers();
    
    // Обновляем видимость маркеров (на случай если включен режим скрытия отмеченных)
    updateAllMarkersVisibility();
    closeAllTooltips();
    
    // Показываем сообщение об успехе
    alert(`Все отметки сняты!`);
    console.log(`Сняты отметки с ${markedCount} маркеров`);
}

/**
 * Сохранение состояния отмеченных маркеров
 */
function saveMarkedMarkers() {
    try {
        localStorage.setItem('markedMarkers', JSON.stringify(markedMarkers));
        console.log(`Сохранено ${Object.keys(markedMarkers).length} отмеченных маркеров`);
    } catch (error) {
        console.error('Ошибка сохранения отмеченных маркеров:', error);
    }
}

/**
 * Обновление внешнего вида маркера
 */
function updateMarkerAppearance(marker, isMarked) {
    const iconElement = marker.getElement();
    if (!iconElement) {
        // Если элемента нет, маркер не на карте - ничего не делаем
        return;
    }
    
    if (isMarked) {
        iconElement.classList.add('marked');
        // Скрываем только если включен режим скрытия отмеченных
        if (hideCompletedEnabled) {
            iconElement.style.display = 'none';
        } else {
            iconElement.style.display = '';
        }
    } else {
        iconElement.classList.remove('marked');
        iconElement.style.display = '';
    }
}

/**
 * Обновление состояния чекбокса в тултипе
 */
function updateTooltipCheckbox(markerId) {
    // Находим активный тултип
    const tooltip = document.querySelector('.clicked-tooltip');
    if (!tooltip) return;
    
    const checkboxElement = tooltip.querySelector('.tooltip-mark-checkbox');
    if (!checkboxElement) return;
    
    const isMarked = markedMarkers[markerId] || false;
    
    // Обновляем визуальное состояние чекбокса
    if (isMarked) {
        checkboxElement.style.background = 'rgba(76, 175, 80, 0.2)';
        checkboxElement.style.borderColor = '#4CAF50';
        checkboxElement.innerHTML = '<div style="color: #4CAF50; font-size: 12px; font-weight: bold;">✓</div>';
    } else {
        checkboxElement.style.background = 'rgba(255, 255, 255, 0.1)';
        checkboxElement.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        checkboxElement.innerHTML = '';
    }
}


/**
 * Настройка обработчиков событий для маркера
 */
function setupMarkerEventHandlers(marker, data, tooltip) {
    // Наведение - открываем popup
    marker.on('mouseover', function() {
        if (!this.isTooltipActive) {
            this.openPopup();
        }
    });
    
    // Уход курсора - закрываем popup
    marker.on('mouseout', function() {
        if (!this.isTooltipActive) {
            this.closePopup();
        }
    });
    
    // Клик - создаем/открываем tooltip
    marker.on('click', function(e) {
        if (e.originalEvent) {
            e.originalEvent.stopPropagation();
            e.originalEvent.stopImmediatePropagation();
        }
        
        // В режиме создания меток - ничего не делаем
        if (createMarkersMode) {
            return false;
        }

        // Если этот маркер уже активен - закрываем его
        if (this.isTooltipActive) {
            this.closeTooltip();
            this.isTooltipActive = false;
            const element = this.getElement();
            if (element) {
                element.classList.remove('tooltip-active');
            }
            return false;
        }
        
        // Закрываем все другие тултипы
        closeAllTooltips();
        
        // Получаем актуальное состояние маркера
        const markerId = this.customId;
        const isMarked = markedMarkers[markerId] || false;
        const commentText = data.Комментарий ? `<p>${data.Комментарий}</p>` : '';
        
        // Создаем HTML для тултипа с актуальным состоянием чекбокса
        const tooltipContent = `
            <div style="max-width: 250px; padding: 10px; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h4 style="margin: 0; color: white; font-size: 15px; flex: 1;">
                        ${data.Название}
                    </h4>
                </div>
                ${commentText ? `
                    <div style="
                        border-top: 1px solid rgba(255, 255, 255, 0.3);
                        padding-top: 8px;
                        font-size: 13px;
                        color: white;
                        line-height: 1.4;
                        margin-bottom: 10px;
                    ">
                        ${commentText}
                    </div>
                ` : ''}
                
                <!-- Чекбокс "Отмечено" внизу тултипа -->
                <div id="mark-checkbox-${markerId}" style="
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding-top: 8px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 8px;
                ">
                    <div class="tooltip-mark-checkbox" 
                         data-marker-id="${markerId}"
                         style="
                             width: 16px;
                             height: 16px;
                             background: ${isMarked ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
                             border: 2px solid ${isMarked ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)'};
                             border-radius: 4px;
                             cursor: pointer;
                             display: flex;
                             align-items: center;
                             justify-content: center;
                             transition: all 0.2s ease;
                         ">
                        ${isMarked ? `
                            <div style="
                                color: #4CAF50;
                                font-size: 12px;
                                font-weight: bold;
                            ">✓</div>
                        ` : ''}
                    </div>
                    <span class="tooltip-mark-label" 
                          data-marker-id="${markerId}"
                          style="
                              color: #d0d0d0;
                              font-size: 12px;
                              font-family: Arial, sans-serif;
                              cursor: pointer;
                          ">
                        Отмечено
                    </span>
                </div>
            </div>
        `;
        
        // Если тултип уже существует, обновляем его содержимое
        if (tooltip) {
            tooltip.setContent(tooltipContent);
        } else {
            // Создаем новый тултип
            tooltip = L.tooltip({
                permanent: true,
                direction: 'auto',
                opacity: 0.95,
                className: 'clicked-tooltip',
                interactive: true
            }).setContent(tooltipContent);
            
            marker.bindTooltip(tooltip);
        }
        
        // Открываем tooltip
        this.openTooltip();
        this.closePopup();
        
        // Добавляем обработчики событий для чекбокса
        setTimeout(() => {
            setupCheckboxListeners(markerId);
        }, 10);
        
        return false;
    });
    
    // Обработчики событий tooltip
    marker.on('tooltipopen', function() {
        this.isTooltipActive = true;
        const element = this.getElement();
        if (element) {
            element.classList.add('tooltip-active');
        }
    });
    
    marker.on('tooltipclose', function() {
        this.isTooltipActive = false;
        const element = this.getElement();
        if (element) {
            element.classList.remove('tooltip-active');
        }
    });
    
    // Инициализируем состояние
    marker.isTooltipActive = false;
}

/**
 * Настройка обработчиков событий для чекбокса в тултипе
 */
function setupCheckboxListeners(markerId) {
    const tooltip = document.querySelector('.clicked-tooltip');
    if (!tooltip) return;
    
    const checkbox = tooltip.querySelector(`[data-marker-id="${markerId}"] .tooltip-mark-checkbox`);
    const label = tooltip.querySelector(`[data-marker-id="${markerId}"] .tooltip-mark-label`);
    
    if (!checkbox || !label) return;
    
    // Обработчик для чекбокса
    checkbox.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        toggleMarkerMarked(markerId, this);
    }, true);
    
    // Обработчик для метки
    label.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        const checkbox = this.parentElement.querySelector('.tooltip-mark-checkbox');
        if (checkbox) {
            toggleMarkerMarked(markerId, checkbox);
        }
    }, true);
}

/**
 * Обновить видимость маркера при изменении его состояния "отмечено"
 */
function updateMarkerVisibilityOnMarkedChange(markerId) {
    const marker = allMarkers.find(m => m.customId === markerId);
    if (!marker) return;
    
    const shouldBeVisible = shouldMarkerBeVisible(marker);
    const isOnMap = map.hasLayer(marker);
    
    if (shouldBeVisible && !isOnMap) {
        marker.addTo(map);
        // Обновляем внешний вид
        const isMarked = markedMarkers[markerId] || false;
        updateMarkerAppearance(marker, isMarked);
    } else if (!shouldBeVisible && isOnMap) {
        map.removeLayer(marker);
    }
}

/**
 * Переключение состояния "Отмечено" для маркера
 */
function toggleMarkerMarked(markerId, checkboxElement) {
    console.log(`toggleMarkerMarked вызван для маркера ${markerId}`);
    
    // Находим маркер по customId
    const marker = allMarkers.find(m => m.customId === markerId);
    if (!marker) {
        console.error(`Маркер с ID ${markerId} не найден`);
        return;
    }
    
    const isCurrentlyMarked = markedMarkers[markerId] || false;
    const newState = !isCurrentlyMarked;
    
    console.log(`Текущее состояние: ${isCurrentlyMarked}, новое состояние: ${newState}`);
    
    // Обновляем состояние
    markedMarkers[markerId] = newState;
    
    // Обновляем внешний вид маркера
    updateMarkerAppearance(marker, newState);
    
    // Обновляем чекбокс в тултипе
    if (checkboxElement) {
        if (newState) {
            checkboxElement.style.background = 'rgba(76, 175, 80, 0.2)';
            checkboxElement.style.borderColor = '#4CAF50';
            checkboxElement.innerHTML = '<div style="color: #4CAF50; font-size: 12px; font-weight: bold;">✓</div>';
        } else {
            checkboxElement.style.background = 'rgba(255, 255, 255, 0.1)';
            checkboxElement.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            checkboxElement.innerHTML = '';
        }
    }
    
    // Проверяем, нужно ли изменить видимость маркера
    const shouldBeVisible = shouldMarkerBeVisible(marker);
    const isOnMap = map.hasLayer(marker);
    
    if (shouldBeVisible && !isOnMap) {
        marker.addTo(map);
        // После добавления на карту обновляем внешний вид
        updateMarkerAppearance(marker, newState);
    } else if (!shouldBeVisible && isOnMap) {
        map.removeLayer(marker);
    }
    
    // Сохраняем состояние
    saveMarkedMarkers();
    console.log(`Сохранено состояние маркера ${markerId}: ${newState}`);
}

/**
 * Глобальная функция для переключения состояния "Отмечено" (для совместимости)
 */
window.toggleMarkerMarked = function(markerId, checkboxElement, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    
    toggleMarkerMarked(markerId, checkboxElement);
};

/**
 * Создание тестовых меток
 */
function createTestMarkers() {
    const testData = [
        {
            ID: "228_410_Холмистая_долина",
            Название: "Холмистая долина",
            Иконка: "Точки исследования",
            Подфильтры: [],
            ОсновныеФильтры: ["Точки исследования"],
            X: 228,
            Y: 410,
            Комментарий: "На носу корабля",
            Карта: "worldmap"
        },
        {
            ID: "184_621_Сундук_(копать)",
            Название: "Сундук (копать)",
            Иконка: "Копать",
            Подфильтры: ["Копать","Ловкость"],
            ОсновныеФильтры: ["Сундуки", "Характеристики"],
            X: 184,
            Y: 621,
            Комментарий: "Зелье ловкости<br>Отмычки",
            Карта: "worldmap"
        },
        {
            ID: "300_300_Тестовая_метка",
            Название: "Тестовая метка",
            Иконка: "Неизвестно",
            Подфильтры: ["Неизвестно"],
            ОсновныеФильтры: ["Особые"],
            X: 300,
            Y: 300,
            Комментарий: "Если ты видишь эту метку,<br>значит JSON не прогрузился",
            Карта: "worldmap"
        }
    ];
    
    testData.forEach(data => {
        createMarkerFromJSON(data);
    });
}

// ============================================
// УПРАВЛЕНИЕ ВИДИМОСТЬЮ МЕТОК
// ============================================

/**
 * Инициализация видимости меток при загрузке
 */
function initializeMarkersVisibility() {
    allMarkers.forEach(marker => {
        if (map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    });
    
    updateAllMarkersVisibility();
}

/**
 * Обновление видимости всех маркеров
 */
function updateAllMarkersVisibility() {
    closeAllTooltips();
    
    allMarkers.forEach(marker => {
        const shouldBeVisible = shouldMarkerBeVisible(marker);
        const isOnMap = map.hasLayer(marker);
        
        if (shouldBeVisible) {
            if (!isOnMap) {
                marker.addTo(map);
            }
            // После добавления на карту обновляем внешний вид
            const markerId = marker.customId;
            if (markedMarkers[markerId]) {
                updateMarkerAppearance(marker, true);
            }
        } else {
            if (isOnMap) {
                map.removeLayer(marker);
            }
        }
    });
}

/**
 * Проверка, должен ли маркер быть видимым
 */
function shouldMarkerBeVisible(marker) {
    const markerId = marker.customId;
    const isMarked = markedMarkers[markerId] || false;
    
    // Если включен режим "Скрыть отмеченные" и маркер отмечен
    if (hideCompletedEnabled && isMarked) {
        return false;
    }
    
    // Проверяем пользовательские метки
    if (marker.isUserMarker) {
        // Проверяем фильтр "Мои метки"
        const myMarksEnabled = filterStates['Мои метки'] === true;
        if (!myMarksEnabled) {
            // Закрываем тултип если он открыт
            if (marker.isTooltipActive) {
                marker.closeTooltip();
                marker.isTooltipActive = false;
                const element = marker.getElement();
                if (element) {
                    element.classList.remove('tooltip-active');
                }
            }
            return false;
        }
        return true;
    }
    
    // Если у маркера открыт тултип, закрываем его при скрытии маркера
    if (marker.isTooltipActive) {
        marker.closeTooltip();
        marker.isTooltipActive = false;
        const element = marker.getElement();
        if (element) {
            element.classList.remove('tooltip-active');
        }
    }
    
    // Если у маркера нет фильтров, всегда показываем
    if ((!marker.mainFilters || marker.mainFilters.length === 0) && 
        (!marker.subfilters || marker.subfilters.length === 0)) {
        return true;
    }
    
    // Проверяем основные фильтры маркера
    if (marker.mainFilters && marker.mainFilters.length > 0) {
        for (const mainFilter of marker.mainFilters) {
            if (filterStates[mainFilter] === true) {
                if (subfilters[mainFilter] && subfilters[mainFilter].length > 0) {
                    const hasVisibleSubfilter = marker.subfilters && 
                        marker.subfilters.some(subfilter => 
                            subfilters[mainFilter].includes(subfilter) && 
                            subfilterStates[subfilter] === true
                        );
                    
                    if (hasVisibleSubfilter) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
    }
    
    // Проверяем отдельные подфильтры
    if (marker.subfilters && marker.subfilters.length > 0) {
        for (const subfilter of marker.subfilters) {
            if (subfilterStates[subfilter] === true) {
                return true;
            }
        }
    }
    
    return false;
}

/**
 * Закрытие всех активных тултипов
 */
function closeAllTooltips() {
    allMarkers.forEach(marker => {
        if (marker.isTooltipActive) {
            marker.closeTooltip();
            marker.isTooltipActive = false;
            const element = marker.getElement();
            if (element) {
                element.classList.remove('tooltip-active');
            }
        }
    });
    
    // Также закрываем все тултипы пользовательских меток
    userMarkers.forEach(marker => {
        if (marker.isTooltipActive) {
            marker.closeTooltip();
            marker.isTooltipActive = false;
            const element = marker.getElement();
            if (element) {
                element.classList.remove('tooltip-active');
            }
        }
    });
}

/**
 * Создание пользовательской метки
 */
function createUserMarker(data, customId = null) {
    const markerId = customId || `user_marker_${Date.now()}_${userMarkerCounter++}`;
    
    // Используем иконку для "Мои метки"
    const iconToUse = markerIcons['Мои метки'] || markerIcons['default'];
    
    const marker = L.marker([data.Y, data.X], {
        icon: iconToUse,
        riseOnHover: true,
        bubblingMouseEvents: false,
        isUserMarker: true // Добавляем флаг для идентификации
    });
    
    // Сохраняем кастомный ID
    marker.customId = markerId;
    
    // Popup для наведения
    const popupContent = `
        <div style="padding: 0 4px; font-size: 14px; font-weight: bold; white-space: nowrap; color: white;">
            ${data.Название}
        </div>
    `;
    
    const popup = L.popup({
        closeOnClick: false,
        autoClose: false,
        closeButton: false,
        className: 'hover-popup',
        closeOnEscapeKey: false
    }).setContent(popupContent);
    
    marker.bindPopup(popup);
    
    // Сохраняем данные
    marker.markerData = data;
    marker.mainFilters = data.ОсновныеФильтры || ['Мои метки'];
    marker.subfilters = data.Подфильтры || [];
    marker.isUserMarker = true; // Флаг пользовательской метки
    
    // Добавляем обработчики событий - ВАЖНО: вызываем функцию настройки обработчиков
    setupUserMarkerEventHandlers(marker, data);
    
    // Инициализируем состояние
    marker.isTooltipActive = false;
    
    // Добавляем в массивы
    allMarkers.push(marker);
    userMarkers.push(marker);
    
    // Добавляем в фильтры
    data.ОсновныеФильтры.forEach(filter => {
        if (!markersByFilter[filter]) {
            markersByFilter[filter] = [];
        }
        markersByFilter[filter].push(marker);
    });
    
    // Также добавляем подфильтры
    data.Подфильтры.forEach(subfilter => {
        if (!markersByFilter[subfilter]) {
            markersByFilter[subfilter] = [];
        }
        markersByFilter[subfilter].push(marker);
    });
    
    // Добавляем на карту если видима
    if (shouldMarkerBeVisible(marker)) {
        marker.addTo(map);
    }
    
    return marker;
}

/**
 * Настройка обработчиков для пользовательских меток
 */
function setupUserMarkerEventHandlers(marker, data) {
    // Наведение - открываем popup
    marker.on('mouseover', function() {
        if (!this.isTooltipActive) {
            this.openPopup();
        }
    });
    
    // Уход курсора - закрываем popup
    marker.on('mouseout', function() {
        if (!this.isTooltipActive) {
            this.closePopup();
        }
    });
    
    // Клик - в режиме создания удаляем метку, в обычном режиме показываем тултип
    marker.on('click', function(e) {
        if (e.originalEvent) {
            e.originalEvent.stopPropagation();
            e.originalEvent.stopImmediatePropagation();
        }
        
        // В режиме создания меток - предлагаем удалить
        if (createMarkersMode && this.isUserMarker) {
            if (confirm(`Удалить метку "${data.Название}"?`)) {
                deleteUserMarker(this.customId);
            }
            return false;
        }
        
        // В обычном режиме - показываем тултип
        if (!createMarkersMode) {
            // Если этот маркер уже активен - закрываем его
            if (this.isTooltipActive) {
                this.closeTooltip();
                this.isTooltipActive = false;
                const element = this.getElement();
                if (element) {
                    element.classList.remove('tooltip-active');
                }
                return false;
            }
            
            // Закрываем все другие тултипы
            closeAllTooltips();
            
            // Получаем актуальное состояние маркера
            const markerId = this.customId;
            const isMarked = markedMarkers[markerId] || false;
            const commentText = data.Комментарий ? `<p>${data.Комментарий}</p>` : '';
            
            // Создаем HTML для тултипа
            const tooltipContent = `
                <div style="max-width: 250px; padding: 10px; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <h4 style="margin: 0; color: white; font-size: 15px; flex: 1;">
                            ${data.Название}
                        </h4>
                    </div>
                    ${commentText ? `
                        <div style="
                            border-top: 1px solid rgba(255, 255, 255, 0.3);
                            padding-top: 8px;
                            font-size: 13px;
                            color: white;
                            line-height: 1.4;
                            margin-bottom: 10px;
                        ">
                            ${commentText}
                        </div>
                    ` : ''}
                    
                    <!-- Чекбокс "Отмечено" внизу тултипа -->
                    <div id="mark-checkbox-${markerId}" style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding-top: 8px;
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                        margin-top: 8px;
                    ">
                        <div class="tooltip-mark-checkbox" 
                             data-marker-id="${markerId}"
                             style="
                                 width: 16px;
                                 height: 16px;
                                 background: ${isMarked ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
                                 border: 2px solid ${isMarked ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)'};
                                 border-radius: 4px;
                                 cursor: pointer;
                                 display: flex;
                                 align-items: center;
                                 justify-content: center;
                                 transition: all 0.2s ease;
                             ">
                            ${isMarked ? `
                                <div style="
                                    color: #4CAF50;
                                    font-size: 12px;
                                    font-weight: bold;
                                ">✓</div>
                            ` : ''}
                        </div>
                        <span class="tooltip-mark-label" 
                              data-marker-id="${markerId}"
                              style="
                                  color: #d0d0d0;
                                  font-size: 12px;
                                  font-family: Arial, sans-serif;
                                  cursor: pointer;
                              ">
                            Отмечено
                        </span>
                    </div>
                </div>
            `;
            
            // Создаем tooltip
            const tooltip = L.tooltip({
                permanent: true,
                direction: 'auto',
                opacity: 0.95,
                className: 'clicked-tooltip',
                interactive: true
            }).setContent(tooltipContent);
            
            marker.bindTooltip(tooltip);
            
            // Открываем tooltip
            this.openTooltip();
            this.closePopup();
            
            // Добавляем обработчики событий для чекбокса
            setTimeout(() => {
                setupCheckboxListeners(markerId);
            }, 10);
        }
        
        return false;
    });
    
    // Обработчики событий tooltip
    marker.on('tooltipopen', function() {
        this.isTooltipActive = true;
        const element = this.getElement();
        if (element) {
            element.classList.add('tooltip-active');
        }
    });
    
    marker.on('tooltipclose', function() {
        this.isTooltipActive = false;
        const element = this.getElement();
        if (element) {
            element.classList.remove('tooltip-active');
        }
    });
    
    // Инициализируем состояние
    marker.isTooltipActive = false;
}

/**
 * Удаление пользовательской метки
 */
function deleteUserMarker(markerId) {
    // Находим маркер
    const markerIndex = userMarkers.findIndex(m => m.customId === markerId);
    if (markerIndex === -1) return;
    
    const marker = userMarkers[markerIndex];
    
    // Удаляем с карты
    if (map.hasLayer(marker)) {
        map.removeLayer(marker);
    }
    
    // Удаляем из всех массивов
    userMarkers.splice(markerIndex, 1);
    
    const allMarkerIndex = allMarkers.findIndex(m => m.customId === markerId);
    if (allMarkerIndex !== -1) {
        allMarkers.splice(allMarkerIndex, 1);
    }
    
    // Удаляем из фильтров
    marker.mainFilters.forEach(filter => {
        if (markersByFilter[filter]) {
            const filterIndex = markersByFilter[filter].findIndex(m => m.customId === markerId);
            if (filterIndex !== -1) {
                markersByFilter[filter].splice(filterIndex, 1);
            }
        }
    });
    
    // Удаляем состояние "отмечено"
    if (markedMarkers[markerId]) {
        delete markedMarkers[markerId];
    }
    
    // Сохраняем изменения
    saveUserMarkers();
    saveMarkedMarkers();
    
    console.log(`Пользовательская метка ${markerId} удалена`);
}

/**
 * Очистка записей об удаленных метках
 */
function cleanupGhostMarkedMarkers() {
    console.log('Очистка записей об удаленных метках...');
    
    let cleanupCount = 0;
    
    // Проходим по всем отмеченным маркерам
    Object.keys(markedMarkers).forEach(markerId => {
        // Ищем маркер во всех источниках
        const inAllMarkers = allMarkers.some(m => m.customId === markerId);
        const inUserMarkers = userMarkers.some(m => m.customId === markerId);
        
        // Если маркер не найден нигде - удаляем запись
        if (!inAllMarkers && !inUserMarkers) {
            delete markedMarkers[markerId];
            cleanupCount++;
            console.log(`Удалена запись об удаленной метке: ${markerId}`);
        }
    });
    
    if (cleanupCount > 0) {
        saveMarkedMarkers();
        console.log(`Очищено ${cleanupCount} записей об удаленных метках`);
    } else {
        console.log('Записей об удаленных метках не найдено');
    }
    
    return cleanupCount;
}

/**
 * Диалог создания новой метки
 */
function createMarkerDialog(latlng) {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
    `;
    
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: rgba(30, 33, 40, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 10px;
        padding: 20px;
        width: 500px;
        max-width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        color: white;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;
    
    dialog.innerHTML = `
        <h3 style="margin-top: 0; color: #4CAF50; text-align: center;">Создать новую метку</h3>
        <div style="margin-bottom: 15px; font-size: 12px; color: #aaa; text-align: center;">
            Координаты: [${Math.round(latlng.lng)}, ${Math.round(latlng.lat)}]
        </div>
        
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #ddd; font-size: 14px;">
                Название <span style="color: #ff5757;">*</span>
            </label>
            <input type="text" id="marker-name" 
                   style="width: 96%; padding: 10px; background: rgba(255,255,255,0.1); 
                          border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; 
                          color: white; font-size: 14px;" 
                   placeholder="Введите название метки" autofocus>
        </div>
        
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #ddd; font-size: 14px;">
                Фильтры (для экспорта)
            </label>
            <input type="text" id="marker-filters" 
                   style="width: 96%; padding: 10px; background: rgba(255,255,255,0.1); 
                          border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; 
                          color: white; font-size: 14px;" 
                   placeholder="Например: Сундуки; Ловкость">
            <div style="font-size: 11px; color: #aaa; margin-top: 5px;">
                Разделяйте фильтры точкой с запятой. Все созданные метки считаются только как "Мои метки"!
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #ddd; font-size: 14px;">
                Комментарий
            </label>
            <textarea id="marker-comment" 
                      style="width: 96%; padding: 10px; background: rgba(255,255,255,0.1); 
                             border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; 
                             color: white; font-size: 14px; height: 80px; resize: vertical;" 
                      placeholder="Дополнительная информация (необязательно). Ставьте <br> для новой строки."></textarea>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="cancel-marker" style="
                padding: 10px 20px;
                background: rgba(255, 87, 87, 0.1);
                border: 1px solid rgba(255, 87, 87, 0.3);
                border-radius: 5px;
                color: #ff5757;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            ">Отмена</button>
            <button id="save-marker" style="
                padding: 10px 20px;
                background: rgba(76, 175, 80, 0.2);
                border: 1px solid #4CAF50;
                border-radius: 5px;
                color: #4CAF50;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.2s ease;
            ">Создать метку</button>
        </div>
    `;
    
    modal.appendChild(dialog);
    document.body.appendChild(modal);
    
    // Обработчики кнопок
    dialog.querySelector('#cancel-marker').onclick = function() {
        document.body.removeChild(modal);
    };
    
    dialog.querySelector('#save-marker').onclick = function() {
        const nameInput = dialog.querySelector('#marker-name');
        const filtersInput = dialog.querySelector('#marker-filters');
        const commentInput = dialog.querySelector('#marker-comment');
        
        const name = nameInput.value.trim();
        
        if (!name) {
            alert('Пожалуйста, введите название метки');
            nameInput.focus();
            return;
        }
        
        // Парсим фильтры
        const filtersText = filtersInput.value.trim();
        let filtersArray = ['Мои метки']; // Всегда добавляем "Мои метки"
        
        if (filtersText) {
            const customFilters = filtersText.split(';')
                .map(f => f.trim())
                .filter(f => f && f !== 'Мои метки');
            filtersArray = [...filtersArray, ...customFilters];
        }
        
        // Создаем данные маркера
        const markerData = {
            Название: name,
            ОсновныеФильтры: ['Мои метки'],
            Подфильтры: [],
            ВсеФильтрыВПорядке: filtersArray,
            X: Math.round(latlng.lng),
            Y: Math.round(latlng.lat),
            Комментарий: commentInput.value.trim() || ''
        };
        
        // Создаем маркер
        createUserMarker(markerData);
        
        // Сохраняем
        saveUserMarkers();
        
        // Обновляем видимость
        updateAllMarkersVisibility();
        
        // Закрываем диалог
        document.body.removeChild(modal);
    };
    
    // Закрытие по ESC
    const closeHandler = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', closeHandler);
        }
    };
    document.addEventListener('keydown', closeHandler);
}

/**
 * Управление курсором в режиме создания меток
 */
function updateCreateModeCursor() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    if (createMarkersMode) {
        // Устанавливаем курсор-крестик для карты
        mapContainer.style.cursor = 'crosshair';
        
        // Устанавливаем курсор для всех маркеров
        allMarkers.forEach(marker => {
            const element = marker.getElement();
            if (element) {
                element.style.cursor = 'pointer';
            }
        });
    } else {
        // Возвращаем обычный курсор
        mapContainer.style.cursor = '';
        
        // Возвращаем обычные курсоры для маркеров
        allMarkers.forEach(marker => {
            const element = marker.getElement();
            if (element) {
                element.style.cursor = '';
            }
        });
    }
}

/**
 * Экспорт пользовательских меток в JSON файл
 */
function exportUserMarkersToJSON() {
    if (userMarkers.length === 0) {
        alert('Нет пользовательских меток для экспорта');
        return;
    }
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: rgba(30, 33, 40, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 10px;
        padding: 20px;
        width: 450px;
        max-width: 90%;
        color: white;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;
    
    dialog.innerHTML = `
        <h3 style="margin-top: 0; color: #4CAF50; text-align: center;">Экспорт пользовательских меток</h3>
        <div style="margin-bottom: 15px; font-size: 13px; color: #aaa; text-align: center;">
            Всего меток для экспорта: <strong style="color: white;">${userMarkers.length}</strong>
        </div>
        <div style="margin-bottom: 20px; font-size: 12px; color: #aaa; text-align: center;">
            Выберите действие для экспорта ваших меток
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            <!-- Зеленая кнопка - Экспортировать JSON -->
            <button id="export-only-btn" style="
                padding: 12px 20px;
                background: rgba(76, 175, 80, 0.15);
                border: 1px solid #4CAF50;
                border-radius: 6px;
                color: #4CAF50;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s ease;
            ">
                <span style="font-size: 16px;">📁</span>
                Экспортировать JSON
            </button>
            
            <div style="font-size: 11px; color: #aaa; text-align: center; margin: 0 10px;">
                Экспортирует все метки в JSON файл без удаления
            </div>
            
            <!-- Желтая кнопка - Экспортировать и удалить -->
            <button id="export-delete-btn" style="
                padding: 12px 20px;
                background: rgba(255, 193, 7, 0.15);
                border: 1px solid #FFC107;
                border-radius: 6px;
                color: #FFC107;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s ease;
            ">
                <span style="font-size: 16px;">⚠️</span>
                Экспортировать и удалить метки
            </button>
            
            <div style="font-size: 11px; color: #ff9800; text-align: center; margin: 0 10px;">
                Экспортирует метки в JSON и затем удаляет их с карты
            </div>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="cancel-export" style="
                padding: 10px 20px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                color: #d0d0d0;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            ">Отмена</button>
        </div>
    `;
    
    modal.appendChild(dialog);
    document.body.appendChild(modal);
    
    // Эффекты при наведении для кнопок
    const exportOnlyBtn = dialog.querySelector('#export-only-btn');
    const exportDeleteBtn = dialog.querySelector('#export-delete-btn');
    const cancelBtn = dialog.querySelector('#cancel-export');
    
    exportOnlyBtn.addEventListener('mouseover', function() {
        this.style.background = 'rgba(76, 175, 80, 0.25)';
        this.style.transform = 'translateY(-1px)';
    });
    
    exportOnlyBtn.addEventListener('mouseout', function() {
        this.style.background = 'rgba(76, 175, 80, 0.15)';
        this.style.transform = 'translateY(0)';
    });
    
    exportDeleteBtn.addEventListener('mouseover', function() {
        this.style.background = 'rgba(255, 193, 7, 0.25)';
        this.style.transform = 'translateY(-1px)';
    });
    
    exportDeleteBtn.addEventListener('mouseout', function() {
        this.style.background = 'rgba(255, 193, 7, 0.15)';
        this.style.transform = 'translateY(0)';
    });
    
    cancelBtn.addEventListener('mouseover', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
    
    cancelBtn.addEventListener('mouseout', function() {
        this.style.background = 'rgba(255, 255, 255, 0.1)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });
    
    // Функция для экспорта JSON
    const performJSONExport = (shouldDelete = false, formatted = false) => {
        // Обрабатываем каждую метку
        const markersData = userMarkers.map(marker => {
            const data = marker.markerData;
            const markerId = `${data.X}_${data.Y}_${data.Название.replace(/\s+/g, '_')}`;
            const allFilters = data.ВсеФильтрыВПорядке || [];
            const filteredFilters = allFilters.filter(filter => filter !== 'Мои метки');
            let iconfilter = '';
            if (filteredFilters.length > 0) {
                iconfilter = filteredFilters[0];
            } 
            // Разделяем на фильтры и подфильтры
            const filters = [];
            const newsubfilters = [];
            
            filteredFilters.forEach(filterName => {
                let isSubfilter = false;
                for (const [parentFilter, subfilterList] of Object.entries(subfilters)) {
                    if (subfilterList.includes(filterName)) {
                        newsubfilters.push(filterName);
                        isSubfilter = true;
                        
                        if (!filters.includes(parentFilter)) {
                            filters.push(parentFilter);
                        }
                        break;
                    }
                }
                if (!isSubfilter && filterName !== 'Мои метки' && !filters.includes(filterName)) {
                    filters.push(filterName);
                }
            });
            
            // Создаем объект метки
            return {
                ID: markerId,
                Название: data.Название,
                Иконка: iconfilter,
                Подфильтры: newsubfilters,
                ОсновныеФильтры: filters,
                X: data.X,
                Y: data.Y,
                Комментарий: data.Комментарий || '',
                Карта: 'worldmap'
            };
        });
        
        // Создаем финальный JSON объект
        const exportData = markersData;
        
        // Конвертируем в JSON строку
        let jsonContent;
        if (formatted) {
            // Красивое форматирование с отступами
            jsonContent = JSON.stringify(exportData, null, 2);
        } else {
            // Компактный JSON (меньше размер)
            jsonContent = JSON.stringify(exportData);
        }
        
        // Создаем Blob и ссылку для скачивания
        const blob = new Blob([jsonContent], { 
            type: 'application/json;charset=utf-8' 
        });
        const url = URL.createObjectURL(blob);
        
        // Создаем временную ссылку для скачивания
        const link = document.createElement('a');
        link.setAttribute('href', url);
        
        // Генерируем имя файла с датой
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const timeStr = date.getHours().toString().padStart(2, '0') + 
                       date.getMinutes().toString().padStart(2, '0');
        link.setAttribute('download', `мои_метки_${dateStr}_${timeStr}.json`);
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Освобождаем память
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        // Если нужно удалить метки после экспорта
        if (shouldDelete) {
            // Запоминаем количество меток для сообщения
            const markersCount = userMarkers.length;
            
            // Подтверждение для удаления
            if (confirm(`Вы уверены, что хотите удалить ${markersCount} меток после экспорта? Это действие нельзя отменить.`)) {
                // Удаляем все пользовательские метки
                while (userMarkers.length > 0) {
                    const marker = userMarkers[0];
                    deleteUserMarker(marker.customId);
                }
                
                // Обновляем видимость
                updateAllMarkersVisibility();
                
                // Сохраняем изменения
                saveUserMarkers();
                
                console.log(`Экспортировано и удалено ${markersCount} меток`);
                setTimeout(() => {
                    alert(`Экспортировано и удалено ${markersCount} меток`);
                }, 300);
            }
        } else {
            const formatText = formatted ? ' (форматированный)' : '';
            console.log(`Экспортировано ${userMarkers.length} меток в JSON${formatText}`);
            setTimeout(() => {
                alert(`Экспортировано ${userMarkers.length} меток в файл JSON${formatText}`);
            }, 300);
        }
    };
    
    // Обработчики кнопок
    exportOnlyBtn.onclick = function() {
        // Просто экспорт JSON без удаления (компактный)
        performJSONExport(false, false);
        document.body.removeChild(modal);
    };
    
    exportDeleteBtn.onclick = function() {
        // Экспорт JSON с удалением (компактный)
        performJSONExport(true, false);
        document.body.removeChild(modal);
    };
    
    cancelBtn.onclick = function() {
        document.body.removeChild(modal);
    };
    
    // Закрытие по ESC
    const closeHandler = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', closeHandler);
        }
    };
    document.addEventListener('keydown', closeHandler);
}

// ============================================
// УПРАВЛЕНИЕ ФИЛЬТРАМИ
// ============================================

/**
 * Показать метки с определенным фильтром
 */
function showFilteredMarkers(filterName) {
    filterStates[filterName] = true;
    closeAllTooltips();
    updateAllMarkersVisibility();
    updateFilterCheckboxState(filterName);
    updateAllFiltersCheckbox();
    saveFilterStates();
}

/**
 * Скрыть метки с определенным фильтром
 */
function hideFilteredMarkers(filterName) {
    filterStates[filterName] = false;
    closeAllTooltips();
    updateAllMarkersVisibility();
    updateFilterCheckboxState(filterName);
    updateAllFiltersCheckbox();
    saveFilterStates();
}

/**
 * Показать метки с подфильтром
 */
function showSubfilteredMarkers(subfilterName) {
    subfilterStates[subfilterName] = true;
    closeAllTooltips();
    
    const parentFilter = getParentFilterForSubfilter(subfilterName);
    if (parentFilter) {
        updateFilterCheckboxState(parentFilter);
        updateAllMarkersVisibility();
    }
    
    updateAllFiltersCheckbox();
    saveFilterStates();
}

/**
 * Скрыть метки с подфильтром
 */
function hideSubfilteredMarkers(subfilterName) {
    subfilterStates[subfilterName] = false;
    closeAllTooltips();
    
    const parentFilter = getParentFilterForSubfilter(subfilterName);
    if (parentFilter) {
        updateFilterCheckboxState(parentFilter);
        updateAllMarkersVisibility();
    }
    
    updateAllFiltersCheckbox();
    saveFilterStates();
}

/**
 * Поиск родительского фильтра для подфильтра
 */
function getParentFilterForSubfilter(subfilterName) {
    for (const [parentFilter, subfilterList] of Object.entries(subfilters)) {
        if (subfilterList.includes(subfilterName)) {
            return parentFilter;
        }
    }
    return null;
}

/**
 * Включение всех подфильтров
 */
function enableAllSubfilters(parentFilter) {
    if (!subfilters[parentFilter]) return;
    
    subfilters[parentFilter].forEach(subfilterName => {
        subfilterStates[subfilterName] = true;
        
        const subfilterElement = subfilterElements[subfilterName];
        if (subfilterElement) {
            subfilterElement.checkmark.classList.add('active');
            subfilterElement.checkbox.classList.add('active');
        }
    });
    
    updateAllMarkersVisibility();
    updateAllFiltersCheckbox();
}

/**
 * Выключение всех подфильтров
 */
function disableAllSubfilters(parentFilter) {
    if (!subfilters[parentFilter]) return;
    
    subfilters[parentFilter].forEach(subfilterName => {
        subfilterStates[subfilterName] = false;
        
        const subfilterElement = subfilterElements[subfilterName];
        if (subfilterElement) {
            subfilterElement.checkmark.classList.remove('active');
            subfilterElement.checkbox.classList.remove('active');
        }
    });
    
    updateAllMarkersVisibility();
    updateAllFiltersCheckbox();
}

// ============================================
// ОБНОВЛЕНИЕ СОСТОЯНИЙ ЭЛЕМЕНТОВ
// ============================================

/**
 * Обновление состояния чекбокса фильтра
 */
function updateFilterCheckboxState(filterName) {
    const filterElement = filterElements[filterName];
    if (!filterElement) return;
    
    const { checkbox, checkmark } = filterElement;
    
    // Убираем все предыдущие состояния
    checkbox.classList.remove('active', 'partial');
    checkmark.classList.remove('active');
    
    const hasSubfilters = subfilters[filterName] && subfilters[filterName].length > 0;
    
    if (!hasSubfilters) {
        if (filterStates[filterName]) {
            checkbox.classList.add('active');
            checkmark.classList.add('active');
        }
        return;
    }
    
    // Считаем включенные подфильтры
    const enabledSubfilters = subfilters[filterName].filter(
        subfilter => subfilterStates[subfilter] === true
    ).length;
    const totalSubfilters = subfilters[filterName].length;
    
    // Обновляем состояние родительского фильтра
    if (enabledSubfilters === 0) {
        filterStates[filterName] = false;
    } else if (enabledSubfilters === totalSubfilters) {
        filterStates[filterName] = true;
    } else {
        filterStates[filterName] = true;
    }
    
    // Обновляем визуальное состояние
    if (enabledSubfilters === 0) {
        // Ничего не делаем - состояние "выключено"
    } else if (enabledSubfilters === totalSubfilters) {
        checkbox.classList.add('active');
        checkmark.classList.add('active');
    } else {
        checkbox.classList.add('partial');
        checkbox.classList.add('active');
    }
    
    updateAllMarkersVisibility();
}

/**
 * Обновление состояния чекбокса "Все фильтры"
 */
function updateAllFiltersCheckbox() {
    const allFiltersCheckbox = document.querySelector('.filter-checkbox[title*="Все фильтры"]');
    const allFiltersCheckmark = document.querySelector('.filter-checkbox[title*="Все фильтры"] .filter-checkmark');
    
    if (!allFiltersCheckbox || !allFiltersCheckmark) return;
    
    const regularFilters = Object.keys(filterStates).filter(
        filterName => !filterName.includes('Все фильтры') && 
                     !Object.values(subfilters).flat().includes(filterName)
    );
    
    const allEnabled = regularFilters.every(filterName => {
        if (subfilters[filterName] && subfilters[filterName].length > 0) {
            const allSubfiltersEnabled = subfilters[filterName].every(
                subfilter => subfilterStates[subfilter] === true
            );
            return filterStates[filterName] === true && allSubfiltersEnabled;
        } else {
            return filterStates[filterName] === true;
        }
    });
    
    if (allEnabled) {
        allFiltersCheckmark.classList.add('active');
        allFiltersCheckbox.classList.add('active');
    } else {
        allFiltersCheckmark.classList.remove('active');
        allFiltersCheckbox.classList.remove('active');
    }
}

// ============================================
// СОЗДАНИЕ ЭЛЕМЕНТОВ ИНТЕРФЕЙСА
// ============================================

/**
 * Настройка переключателя фильтра
 */
function setupFilterToggle(checkbox, checkmark, filterName, filterElement) {
    if (filterStates[filterName] === undefined) {
        filterStates[filterName] = true;
    }
    
    updateFilterCheckboxState(filterName);
    
    checkbox.onclick = function(e) {
        const newState = !filterStates[filterName];
        filterStates[filterName] = newState;
        
        if (newState) {
            if (subfilters[filterName]) {
                enableAllSubfilters(filterName);
            }
        } else {
            if (subfilters[filterName]) {
                disableAllSubfilters(filterName);
            }
        }
        
        updateFilterCheckboxState(filterName);
        updateAllMarkersVisibility();
        updateAllFiltersCheckbox();
        saveFilterStates();
        
        L.DomEvent.stopPropagation(e);
        e.preventDefault();
        closeAllTooltips();
    };
    
    filterElements[filterName] = { checkbox, checkmark, element: filterElement };
}

/**
 * Настройка переключателя "Все фильтры"
 */
function setupAllFiltersToggle(checkbox, checkmark, filterElements, filtersConfig) {
    const allRegularFilters = filtersConfig.filter(f => !f.special);
    const allEnabled = allRegularFilters.every(filter => {
        if (!filter.hasSubfilters) {
            return filterStates[filter.name] === true;
        } else {
            return subfilters[filter.name].every(
                subfilter => subfilterStates[subfilter] === true
            );
        }
    });
    
    // УСТАНАВЛИВАЕМ ВИЗУАЛЬНОЕ СОСТОЯНИЕ ПРИ ИНИЦИАЛИЗАЦИИ
    if (allEnabled) {
        checkmark.classList.add('active');
        checkbox.classList.add('active');
    } else {
        checkmark.classList.remove('active');
        checkbox.classList.remove('active');
    }

    checkbox.onclick = function() {
        const allRegularFilters = filtersConfig.filter(f => !f.special);
        const allEnabled = allRegularFilters.every(filter => {
            if (!filter.hasSubfilters) {
                return filterStates[filter.name] === true;
            } else {
                return subfilters[filter.name].every(
                    subfilter => subfilterStates[subfilter] === true
                );
            }
        });
        
        const enableAll = !allEnabled;
        
        if (enableAll) {
            checkmark.classList.add('active');
            checkbox.classList.add('active');
        } else {
            checkmark.classList.remove('active');
            checkbox.classList.remove('active');
        }
        
        filtersConfig.forEach(filter => {
            if (filter.special) return;
            
            const element = filterElements[filter.name];
            if (element) {
                filterStates[filter.name] = enableAll;
                
                if (enableAll) {
                    enableAllSubfilters(filter.name);
                    showFilteredMarkers(filter.name);
                } else {
                    disableAllSubfilters(filter.name);
                    hideFilteredMarkers(filter.name);
                }
                
                updateFilterCheckboxState(filter.name);
            }
        });
        closeAllTooltips();
        saveFilterStates();
        L.DomEvent.stopPropagation(checkbox);
    };
}

/**
 * Заполнение контейнера подфильтрами
 */
function fillSubfiltersContainer(parentFilter, container) {
    if (!subfilters[parentFilter]) return;
    
    subfilters[parentFilter].forEach(subfilterName => {
        if (subfilterStates[subfilterName] === undefined) {
            subfilterStates[subfilterName] = true;
        }
        
        const subfilterGroup = L.DomUtil.create('div', 'subfilter-group', container);
        const subfilterLabelContainer = L.DomUtil.create('div', 'subfilter-label-container', subfilterGroup);
        const subfilterLabel = L.DomUtil.create('span', 'subfilter-label', subfilterLabelContainer);
        subfilterLabel.textContent = subfilterName;
        subfilterLabel.style.fontSize = '12px';
        subfilterLabel.style.color = 'rgba(208, 208, 208, 0.9)';
        subfilterLabel.style.paddingLeft = '10px';
        
        const subfilterCheckbox = L.DomUtil.create('div', 'subfilter-checkbox', subfilterGroup);
        subfilterCheckbox.title = `Показать/скрыть ${subfilterName}`;
        
        const subfilterCheckmark = L.DomUtil.create('div', 'subfilter-checkmark', subfilterCheckbox);
        
        if (subfilterStates[subfilterName]) {
            subfilterCheckbox.classList.add('active');
            subfilterCheckmark.classList.add('active');
        }
        
        subfilterCheckmark.style.color = '#4CAF50';
        
        subfilterElements[subfilterName] = {
            checkbox: subfilterCheckbox,
            checkmark: subfilterCheckmark,
            parentFilter: parentFilter
        };
        
        subfilterCheckbox.onclick = function(e) {
            const newState = !subfilterStates[subfilterName];
            subfilterStates[subfilterName] = newState;
            
            if (newState) {
                subfilterCheckmark.classList.add('active');
                subfilterCheckbox.classList.add('active');
                showSubfilteredMarkers(subfilterName);
            } else {
                subfilterCheckmark.classList.remove('active');
                subfilterCheckbox.classList.remove('active');
                hideSubfilteredMarkers(subfilterName);
            }
            
            saveFilterStates();
            L.DomEvent.stopPropagation(e);
            e.preventDefault();
        };
    });
}

// ============================================
// КАСТОМНЫЕ КОНТРОЛЫ
// ============================================

/**
 * Контрол для панели инструментов
 */
const ToolsControl = L.Control.extend({
    options: {
        position: 'topright'
    },
    
    onAdd: function(map) {
        const toolsContainer = L.DomUtil.create('div', 'tools-container');
        
        // Заголовок
        const title = L.DomUtil.create('div', 'tools-title', toolsContainer);
        const titleText = L.DomUtil.create('span', 'tools-title-text', title);
        titleText.textContent = "Инструменты";
        const arrowIcon = L.DomUtil.create('span', 'tools-arrow', title);
        arrowIcon.innerHTML = 'развернуть';
        
        // Контейнер для содержимого
        const toolsContent = L.DomUtil.create('div', 'tools-content collapsed', toolsContainer);
        const toolsPanel = L.DomUtil.create('div', 'tools-panel', toolsContent);
        
        // === СОЗДАЕМ ИНСТРУМЕНТЫ ===
        
        // 1. Переключатель координат (перенесен из CoordsToggleControl)
        const coordsGroup = L.DomUtil.create('div', 'tool-group', toolsPanel);
        
        // Заголовок с иконкой для координат
        const coordsRow = L.DomUtil.create('div', 'tool-row', coordsGroup);
        coordsRow.style.display = 'flex';
        coordsRow.style.alignItems = 'center';
        coordsRow.style.justifyContent = 'space-between';
        coordsRow.style.width = '100%';
        
        const coordsClickableArea = L.DomUtil.create('div', 'tool-clickable-area', coordsRow);
        coordsClickableArea.style.display = 'flex';
        coordsClickableArea.style.alignItems = 'center';
        coordsClickableArea.style.flex = '1';
        
        const coordsLabel = L.DomUtil.create('span', 'tool-label', coordsClickableArea);
        coordsLabel.textContent = "Координаты";
        
        const coordsCheckbox = L.DomUtil.create('div', 'tool-checkbox', coordsRow);
        coordsCheckbox.title = "Показать/скрыть координаты курсора";
        
        const coordsCheckmark = L.DomUtil.create('div', 'tool-checkmark', coordsCheckbox);
        
        // 2. Переключатель "Скрыть отмеченные"
        const hideCompletedGroup = L.DomUtil.create('div', 'tool-group', toolsPanel);
        
        const hideCompletedRow = L.DomUtil.create('div', 'tool-row', hideCompletedGroup);
        hideCompletedRow.style.display = 'flex';
        hideCompletedRow.style.alignItems = 'center';
        hideCompletedRow.style.justifyContent = 'space-between';
        hideCompletedRow.style.width = '100%';
        
        const hideClickableArea = L.DomUtil.create('div', 'tool-clickable-area', hideCompletedRow);
        hideClickableArea.style.display = 'flex';
        hideClickableArea.style.alignItems = 'center';
        hideClickableArea.style.flex = '1';
        
        const hideLabel = L.DomUtil.create('span', 'tool-label', hideClickableArea);
        hideLabel.textContent = "Скрыть отмеченные";
        
        const hideCheckbox = L.DomUtil.create('div', 'tool-checkbox', hideCompletedRow);
        hideCheckbox.title = "Скрывать отмеченные метки";
        
        const hideCheckmark = L.DomUtil.create('div', 'tool-checkmark', hideCheckbox);

        // 3. Переключатель "Создать/удалить метки"
        const createMarkersGroup = L.DomUtil.create('div', 'tool-group', toolsPanel);
            
        const createMarkersRow = L.DomUtil.create('div', 'tool-row', createMarkersGroup);
        createMarkersRow.style.display = 'flex';
        createMarkersRow.style.alignItems = 'center';
        createMarkersRow.style.justifyContent = 'space-between';
        createMarkersRow.style.width = '100%';
            
        const createClickableArea = L.DomUtil.create('div', 'tool-clickable-area', createMarkersRow);
        createClickableArea.style.display = 'flex';
        createClickableArea.style.alignItems = 'center';
        createClickableArea.style.flex = '1';
            
        const createLabel = L.DomUtil.create('span', 'tool-label', createClickableArea);
        createLabel.textContent = "Создать/удалить метки";
            
        const createCheckbox = L.DomUtil.create('div', 'tool-checkbox', createMarkersRow);
        createCheckbox.title = "Режим создания и удаления пользовательских меток";
            
        const createCheckmark = L.DomUtil.create('div', 'tool-checkmark', createCheckbox);

        // Устанавливаем начальное состояние
        if (createMarkersMode) {
            createCheckmark.classList.add('active');
            createCheckbox.classList.add('active');
            document.body.style.cursor = 'crosshair';
        }

        // Обработчик для переключателя
        createCheckbox.onclick = function() {
            createMarkersMode = !createMarkersMode;
            
            if (createMarkersMode) {
                createCheckmark.classList.add('active');
                createCheckbox.classList.add('active');
                
                // Включаем режим создания
                updateCreateModeCursor();
                
                // В режиме создания закрываем все тултипы
                closeAllTooltips();
                
                updateAllMarkersVisibility();
            } else {
                createCheckmark.classList.remove('active');
                createCheckbox.classList.remove('active');
                
                // Выключаем режим создания
                updateCreateModeCursor();
                
                // Возвращаем видимость всех меток
                updateAllMarkersVisibility();
            }
            
            saveToolsStates();
            L.DomEvent.stopPropagation(this);
        };

        // 4. Кнопка "Снять все отметки"
        const clearAllMarksGroup = L.DomUtil.create('div', 'tool-group', toolsPanel);
        
        const clearAllButton = L.DomUtil.create('div', 'tool-button', clearAllMarksGroup);
        clearAllButton.textContent = "Снять все отметки";
        clearAllButton.title = "Сбросить все отмеченные метки";
        clearAllButton.style.cssText = `
            width: 85%;
            padding: 8px 12px;
            background: rgba(255, 87, 87, 0.1);
            border: 1px solid rgba(255, 87, 87, 0.3);
            border-radius: 4px;
            color: #ff5757;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 5px;
            transition: all 0.2s ease;
        `;
        
        // Эффекты при наведении
        clearAllButton.addEventListener('mouseover', function() {
            this.style.background = 'rgba(255, 87, 87, 0.2)';
            this.style.borderColor = '#ff5757';
        });
        
        clearAllButton.addEventListener('mouseout', function() {
            this.style.background = 'rgba(255, 87, 87, 0.1)';
            this.style.borderColor = 'rgba(255, 87, 87, 0.3)';
        });
        
        clearAllButton.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите снять все отметки? Это действие нельзя отменить.')) {
                clearAllMarkedMarkers();
            }
            L.DomEvent.stopPropagation(this);
        });

        // 5. Кнопка "Экспортировать мои метки"
        const exportGroup = L.DomUtil.create('div', 'tool-group', toolsPanel);

        const exportButton = L.DomUtil.create('div', 'tool-button', exportGroup);
        exportButton.textContent = "Экспортировать метки";
        exportButton.title = "Экспортировать все мои метки в JSON файл";
        exportButton.style.cssText = `
            width: 85%;
            padding: 8px 12px;
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
            border-radius: 4px;
            color: #4CAF50;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 5px;
            transition: all 0.2s ease;
        `;

        // Эффекты при наведении для зеленой кнопки
        exportButton.addEventListener('mouseover', function() {
            this.style.background = 'rgba(76, 175, 80, 0.2)';
            this.style.borderColor = '#4CAF50';
        });

        exportButton.addEventListener('mouseout', function() {
            this.style.background = 'rgba(76, 175, 80, 0.1)';
            this.style.borderColor = 'rgba(76, 175, 80, 0.3)';
        });

        exportButton.addEventListener('click', function() {
            exportUserMarkersToJSON();
            L.DomEvent.stopPropagation(this);
        });
        
        // === ЛОГИКА ПЕРЕКЛЮЧАТЕЛЕЙ ===
        
        const coordsDisplay = document.getElementById('coordsDisplay');
        
        const updateCoordinates = (e) => {
            if (!coordsEnabled) return;
            coordsDisplay.textContent = 
                `Координаты: [${Math.round(e.latlng.lng)}, ${Math.round(e.latlng.lat)}]`;
            coordsDisplay.classList.remove('hidden');
        };
        
        if (coordsEnabled) {
            coordsCheckmark.classList.add('active');
            coordsCheckbox.classList.add('active');
        }
        
        if (hideCompletedEnabled) {
            hideCheckmark.classList.add('active');
            hideCheckbox.classList.add('active');
        }
        
        coordsCheckbox.onclick = function() {
            coordsEnabled = !coordsEnabled;
            
            if (coordsEnabled) {
                coordsCheckmark.classList.add('active');
                coordsCheckbox.classList.add('active');
                coordsDisplay.classList.remove('hidden');
                coordsDisplay.textContent = "Координаты: включены";
                map.on('mousemove', updateCoordinates);
            } else {
                coordsCheckmark.classList.remove('active');
                coordsCheckbox.classList.remove('active');
                coordsDisplay.textContent = "Координаты: отключены";
                setTimeout(() => {
                    coordsDisplay.classList.add('hidden');
                }, 1000);
                map.off('mousemove', updateCoordinates);
            }
            
            saveToolsStates();            
            L.DomEvent.stopPropagation(this);
        };
        
        hideCheckbox.onclick = function() {
            hideCompletedEnabled = !hideCompletedEnabled;
            
            if (hideCompletedEnabled) {
                hideCheckmark.classList.add('active');
                hideCheckbox.classList.add('active');
                console.log("Режим 'Скрыть отмеченные' включен");
            } else {
                hideCheckmark.classList.remove('active');
                hideCheckbox.classList.remove('active');
                console.log("Режим 'Скрыть отмеченные' выключен");
            }
            
            // Обновляем видимость всех маркеров
            updateAllMarkersVisibility();
            closeAllTooltips();
            
            saveToolsStates();
            L.DomEvent.stopPropagation(this);
        };
        
        // Инициализация отслеживания координат
        map.on('mousemove', updateCoordinates);
        
        // Обработчик клика на заголовок для сворачивания/разворачивания
        title.addEventListener('click', function(e) {
            togglePanel('tools');
            L.DomEvent.stopPropagation(e);
    });
        
        return toolsContainer;
    }
});

// Добавляем метод togglePanel в прототип ToolsControl
ToolsControl.prototype.togglePanel = function(panelType) {
    const toolsContent = document.querySelector('.tools-content');
    const toolsArrow = document.querySelector('.tools-arrow');
    
    if (!toolsContent || !toolsArrow) return;
    
    const isCollapsed = toolsContent.classList.contains('collapsed');
    
    if (isCollapsed) {
        toolsContent.classList.remove('collapsed');
        toolsArrow.innerHTML = 'свернуть';
    } else {
        toolsContent.classList.add('collapsed');
        toolsArrow.innerHTML = 'развернуть';
    }
};

/**
 * Контрол для фильтров меток
 */
const FiltersToggleControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    
    onAdd: function(map) {
        const filtersContainer = L.DomUtil.create('div', 'filters-container');
        const title = L.DomUtil.create('div', 'filters-title', filtersContainer);
        const titleText = L.DomUtil.create('span', 'filters-title-text', title);
        titleText.textContent = "Фильтры меток";
        const arrowIcon = L.DomUtil.create('span', 'filters-arrow', title);
        arrowIcon.innerHTML = 'свернуть';
        
        const filtersContent = L.DomUtil.create('div', 'filters-content', filtersContainer);
        const filtersPanel = L.DomUtil.create('div', 'filters-panel', filtersContent);
        
        filtersConfig.forEach(filter => {
            const filterGroup = L.DomUtil.create('div', 'filter-group', filtersPanel);
            const filterRow = L.DomUtil.create('div', 'filter-row', filterGroup);
            filterRow.style.display = 'flex';
            filterRow.style.alignItems = 'center';
            filterRow.style.justifyContent = 'space-between';
            filterRow.style.width = '100%';
            
            const clickableArea = L.DomUtil.create('div', 'filter-clickable-area', filterRow);
            clickableArea.style.display = 'flex';
            clickableArea.style.alignItems = 'center';
            clickableArea.style.flex = '1';
            clickableArea.style.cursor = filter.hasSubfilters ? 'pointer' : 'default';
            
            if (filter.icon) {
                const filterIcon = L.DomUtil.create('img', 'filter-icon', clickableArea);
                filterIcon.src = filter.icon;
                filterIcon.alt = filter.name;
                filterIcon.title = filter.name;
                filterIcon.style.width = '30px';
                filterIcon.style.height = '30px';
                filterIcon.style.marginRight = '8px';
                filterIcon.style.objectFit = 'contain';
            }
            
            const filterLabel = L.DomUtil.create('span', 'filter-label', clickableArea);
            filterLabel.textContent = filter.name;
            
            if (filter.hasSubfilters) {
                const arrow = L.DomUtil.create('span', 'filter-arrow', clickableArea);
                arrow.innerHTML = '▼';
                arrow.style.marginLeft = '8px';
                arrow.style.fontSize = '10px';
                arrow.style.transition = 'transform 0.2s ease';
                arrow.style.color = 'rgba(255, 255, 255, 0.5)';
            }
            
            const filterCheckbox = L.DomUtil.create('div', 'filter-checkbox active', filterRow);
            filterCheckbox.title = `Показать/скрыть ${filter.name}`;
            
            if (!filter.special && filterStates[filter.name] === undefined) {
                filterStates[filter.name] = true;
            }
            
            const filterCheckmark = L.DomUtil.create('div', 'filter-checkmark active', filterCheckbox);
            filterCheckmark.style.color = filter.color;
            
            filterElements[filter.name] = {
                checkbox: filterCheckbox,
                checkmark: filterCheckmark,
                isSpecial: filter.special || false
            };
            
            if (!filter.special) {
                setupFilterToggle(filterCheckbox, filterCheckmark, filter.name, filterGroup);
            } else {
                setupAllFiltersToggle(filterCheckbox, filterCheckmark, filterElements, filtersConfig);
            }
            
            let subfiltersContainer = null;
            
            if (filter.hasSubfilters) {
                subfiltersContainer = L.DomUtil.create('div', 'subfilters-container', filterGroup);
                subfiltersContainer.style.display = 'none';
                fillSubfiltersContainer(filter.name, subfiltersContainer);
                
                clickableArea.onclick = function(e) {
                    const arrow = this.querySelector('.filter-arrow');
                    if (subfiltersContainer.style.display === 'none') {
                        subfiltersContainer.style.display = 'block';
                        if (arrow) arrow.style.transform = 'rotate(180deg)';
                    } else {
                        subfiltersContainer.style.display = 'none';
                        if (arrow) arrow.style.transform = 'rotate(0deg)';
                    }
                    L.DomEvent.stopPropagation(e);
                };
            }
        });
        
        title.addEventListener('click', function(e) {
            togglePanel('filters');
            L.DomEvent.stopPropagation(e);
        });
        
        return filtersContainer;
    }
});

/**
 * Контрол для особых меток
 */
const SpecialMarksControl = L.Control.extend({
    options: {
        position: 'bottomleft'
    },
    
    onAdd: function(map) {
        const specialMarksContainer = L.DomUtil.create('div', 'special-marks-container');
        const title = L.DomUtil.create('div', 'special-marks-title', specialMarksContainer);
        const titleText = L.DomUtil.create('span', 'special-marks-title-text', title);
        titleText.textContent = "Особые метки";
        const arrowIcon = L.DomUtil.create('span', 'special-marks-arrow', title);
        arrowIcon.innerHTML = 'развернуть';
        
        const specialMarksContent = L.DomUtil.create('div', 'special-marks-content collapsed', specialMarksContainer);
        const specialMarksPanel = L.DomUtil.create('div', 'special-marks-panel', specialMarksContent);
        
        specialMarksConfig.forEach(mark => {
            if (specialMarksStates[mark.name] === undefined) {
                specialMarksStates[mark.name] = mark.completed;
            }
            
            const markGroup = L.DomUtil.create('div', 'special-mark-group', specialMarksPanel);
            const markRow = L.DomUtil.create('div', 'special-mark-row', markGroup);
            markRow.style.display = 'flex';
            markRow.style.alignItems = 'center';
            markRow.style.justifyContent = 'space-between';
            markRow.style.width = '100%';
            
            const clickableArea = L.DomUtil.create('div', 'special-mark-clickable-area', markRow);
            clickableArea.style.display = 'flex';
            clickableArea.style.alignItems = 'center';
            clickableArea.style.flex = '1';
            
            if (mark.hasSubmarks && mark.submarks && mark.submarks.length > 0) {
                clickableArea.style.cursor = 'pointer';
            }
            
            const markLabel = L.DomUtil.create('span', 'special-mark-label', clickableArea);
            markLabel.textContent = mark.name;
            markLabel.title = mark.description;
            
            if (mark.hasSubmarks && mark.submarks && mark.submarks.length > 0) {
                const arrow = L.DomUtil.create('span', 'special-mark-arrow', clickableArea);
                arrow.innerHTML = '▼';
                arrow.style.marginLeft = '8px';
                arrow.style.fontSize = '10px';
                arrow.style.transition = 'transform 0.2s ease';
                arrow.style.color = 'rgba(255, 255, 255, 0.5)';
            }
            
            const markCheckbox = L.DomUtil.create('div', 'special-mark-checkbox', markRow);
            markCheckbox.title = `Отметить как выполненное`;
            
            const markCheckmark = L.DomUtil.create('div', 'special-mark-checkmark', markCheckbox);
            
            updateSpecialMarkCheckboxState(mark.name);
            
            markCheckbox.onclick = function(e) {
                const newState = !specialMarksStates[mark.name];
                specialMarksStates[mark.name] = newState;
                
                if (newState && mark.hasSubmarks && mark.submarks) {
                    mark.submarks.forEach(submark => {
                        const fullSubmarkName = `${mark.name} - ${submark}`;
                        specialSubmarksStates[fullSubmarkName] = true;
                    });
                } else if (!newState && mark.hasSubmarks && mark.submarks) {
                    mark.submarks.forEach(submark => {
                        const fullSubmarkName = `${mark.name} - ${submark}`;
                        specialSubmarksStates[fullSubmarkName] = false;
                    });
                }
                
                updateSpecialMarkCheckboxState(mark.name);
                saveSpecialMarksStates();
                
                L.DomEvent.stopPropagation(e);
                e.preventDefault();
            };
            
            let submarksContainer = null;
            
            if (mark.hasSubmarks && mark.submarks && mark.submarks.length > 0) {
                submarksContainer = L.DomUtil.create('div', 'submarks-container', markGroup);
                submarksContainer.style.display = 'none';
                
                mark.submarks.forEach(submarkName => {
                    const fullSubmarkName = `${mark.name} - ${submarkName}`;
                    if (specialSubmarksStates[fullSubmarkName] === undefined) {
                        specialSubmarksStates[fullSubmarkName] = false;
                    }
                    
                    const submarkGroup = L.DomUtil.create('div', 'submark-group', submarksContainer);
                    const submarkLabelContainer = L.DomUtil.create('div', 'submark-label-container', submarkGroup);
                    const submarkLabel = L.DomUtil.create('span', 'submark-label', submarkLabelContainer);
                    submarkLabel.textContent = submarkName;
                    
                    const submarkCheckbox = L.DomUtil.create('div', 'submark-checkbox', submarkGroup);
                    submarkCheckbox.title = `Отметить как выполненное`;
                    
                    const submarkCheckmark = L.DomUtil.create('div', 'submark-checkmark', submarkCheckbox);
                    
                    if (specialSubmarksStates[fullSubmarkName]) {
                        submarkCheckbox.classList.add('active');
                        submarkCheckmark.classList.add('active');
                    }
                    
                    submarkCheckbox.onclick = function(e) {
                        const newState = !specialSubmarksStates[fullSubmarkName];
                        specialSubmarksStates[fullSubmarkName] = newState;
                        
                        if (newState) {
                            submarkCheckmark.classList.add('active');
                            submarkCheckbox.classList.add('active');
                        } else {
                            submarkCheckmark.classList.remove('active');
                            submarkCheckbox.classList.remove('active');
                        }
                        
                        updateSpecialMarkCheckboxState(mark.name);
                        saveSpecialMarksStates();
                        
                        L.DomEvent.stopPropagation(e);
                        e.preventDefault();
                    };
                });
                
                if (mark.hasSubmarks) {
                    clickableArea.onclick = function(e) {
                        if (e.target.closest('.special-mark-checkbox')) return;
                        
                        const arrow = this.querySelector('.special-mark-arrow');
                        if (submarksContainer.style.display === 'none') {
                            submarksContainer.style.display = 'block';
                            if (arrow) arrow.style.transform = 'rotate(180deg)';
                        } else {
                            submarksContainer.style.display = 'none';
                            if (arrow) arrow.style.transform = 'rotate(0deg)';
                        }
                        L.DomEvent.stopPropagation(e);
                    };
                }
            }
        });
        
        title.addEventListener('click', function(e) {
            togglePanel('special');
            L.DomEvent.stopPropagation(e);
        });
        
        return specialMarksContainer;
    }
});

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

/**
 * Управление видимостью панелей
 */
function togglePanel(panelType) {
    const filtersContent = document.querySelector('.filters-content');
    const filtersArrow = document.querySelector('.filters-arrow');
    const specialMarksContent = document.querySelector('.special-marks-content');
    const specialMarksArrow = document.querySelector('.special-marks-arrow');
    const toolsContent = document.querySelector('.tools-content');
    const toolsArrow = document.querySelector('.tools-arrow');
    
    if (panelType === 'filters') {
        if (!filtersContent || !filtersArrow) return;
        
        const isCollapsed = filtersContent.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Разворачиваем фильтры
            filtersContent.classList.remove('collapsed');
            filtersArrow.innerHTML = 'свернуть';
            
            // Сворачиваем особые метки, если они открыты
            if (specialMarksContent && !specialMarksContent.classList.contains('collapsed')) {
                specialMarksContent.classList.add('collapsed');
                if (specialMarksArrow) specialMarksArrow.innerHTML = 'развернуть';
            }
            
            // Панель инструментов остается как есть (не трогаем)
        } else {
            // Сворачиваем фильтры
            filtersContent.classList.add('collapsed');
            filtersArrow.innerHTML = 'развернуть';
        }
    } else if (panelType === 'special') {
        if (!specialMarksContent || !specialMarksArrow) return;
        
        const isCollapsed = specialMarksContent.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Разворачиваем особые метки
            specialMarksContent.classList.remove('collapsed');
            specialMarksArrow.innerHTML = 'свернуть';
            
            // Сворачиваем фильтры, если они открыты
            if (filtersContent && !filtersContent.classList.contains('collapsed')) {
                filtersContent.classList.add('collapsed');
                if (filtersArrow) filtersArrow.innerHTML = 'развернуть';
            }
            
            // Панель инструментов остается как есть
        } else {
            // Сворачиваем особые метки
            specialMarksContent.classList.add('collapsed');
            specialMarksArrow.innerHTML = 'развернуть';
        }
    } else if (panelType === 'tools') {
        if (!toolsContent || !toolsArrow) return;
        
        const isCollapsed = toolsContent.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Разворачиваем инструменты
            toolsContent.classList.remove('collapsed');
            toolsArrow.innerHTML = 'свернуть';
            
            // Панель инструментов независима, не сворачиваем другие панели
        } else {
            // Сворачиваем инструменты
            toolsContent.classList.add('collapsed');
            toolsArrow.innerHTML = 'развернуть';
        }
    }
}

/**
 * Обновление состояния чекбокса особой метки
 */
function updateSpecialMarkCheckboxState(markName) {
    const allMarkLabels = document.querySelectorAll('.special-mark-label');
    let markElement = null;
    
    allMarkLabels.forEach(label => {
        if (label.textContent === markName) {
            markElement = label.closest('.special-mark-group');
        }
    });
    
    if (!markElement) return;
    
    const checkbox = markElement.querySelector('.special-mark-checkbox');
    const checkmark = markElement.querySelector('.special-mark-checkmark');
    
    if (!checkbox || !checkmark) return;
    
    checkbox.classList.remove('active', 'partial');
    checkmark.classList.remove('active');
    
    const markConfig = specialMarksConfig.find(mark => mark.name === markName);
    if (!markConfig) return;
    
    // Если нет подметок - обычная логика
    if (!markConfig.hasSubmarks || !markConfig.submarks || markConfig.submarks.length === 0) {
        if (specialMarksStates[markName]) {
            checkbox.classList.add('active');
            checkmark.classList.add('active');
        }
        return;
    }
    
    let enabledSubmarks = 0;
    let totalSubmarks = 0;
    
    if (markConfig.submarks && markConfig.submarks.length > 0) {
        totalSubmarks = markConfig.submarks.length;
        enabledSubmarks = markConfig.submarks.filter(
            submark => specialSubmarksStates[`${markName} - ${submark}`] === true
        ).length;
    }
    
    // ОБНОВЛЯЕМ СОСТОЯНИЕ РОДИТЕЛЬСКОЙ МЕТКИ
    if (enabledSubmarks === 0) {
        specialMarksStates[markName] = false;
    } else if (enabledSubmarks === totalSubmarks) {
        specialMarksStates[markName] = true;
    } else {
        specialMarksStates[markName] = true; // Частичное состояние
    }
    
    // ОБНОВЛЯЕМ ВИЗУАЛЬНОЕ СОСТОЯНИЕ
    if (enabledSubmarks === 0) {
        // Состояние "выключено" - ничего не добавляем
    } else if (enabledSubmarks === totalSubmarks) {
        checkbox.classList.add('active');
        checkmark.classList.add('active');
    } else {
        // Частичное состояние
        checkbox.classList.add('partial');
        checkbox.classList.add('active');
        checkmark.classList.add('active'); // Добавляем active для checkmark тоже
    }
    
    // ОБНОВЛЯЕМ ПОДМЕТКИ (ВИЗУАЛЬНО)
    if (markConfig.submarks) {
        markConfig.submarks.forEach(submarkName => {
            const fullName = `${markName} - ${submarkName}`;
            const allSubmarkLabels = document.querySelectorAll('.submark-label');
            
            allSubmarkLabels.forEach(label => {
                if (label.textContent === submarkName) {
                    const submarkElement = label.closest('.submark-group');
                    if (submarkElement) {
                        const subCheckbox = submarkElement.querySelector('.submark-checkbox');
                        const subCheckmark = submarkElement.querySelector('.submark-checkmark');
                        
                        if (subCheckbox && subCheckmark) {
                            if (specialSubmarksStates[fullName]) {
                                subCheckbox.classList.add('active');
                                subCheckmark.classList.add('active');
                            } else {
                                subCheckbox.classList.remove('active');
                                subCheckmark.classList.remove('active');
                            }
                        }
                    }
                }
            });
        });
    }
    
    saveSpecialMarksStates();
}

/**
 * Включение прокрутки панели инструментов
 */
function enableToolsScroll() {
    const toolsContainer = document.querySelector('.tools-container');
    const toolsContent = document.querySelector('.tools-content');
    
    if (!toolsContainer || !toolsContent) return;
    
    toolsContent.addEventListener('wheel', function(e) {
        if (this.classList.contains('collapsed')) return;
        
        this.scrollTop += e.deltaY;
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        
        return false;
    }, { passive: false, capture: true });
    
    toolsContainer.addEventListener('mouseover', function() {
        map.scrollWheelZoom.disable();
    });
    
    toolsContainer.addEventListener('mouseout', function() {
        map.scrollWheelZoom.enable();
    });
    
    const toolsTitle = document.querySelector('.tools-title');
    if (toolsTitle) {
        toolsTitle.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
    }
}

/**
 * Включение прокрутки фильтров
 */
function enableFilterScroll() {
    const filtersContainer = document.querySelector('.filters-container');
    const filtersContent = document.querySelector('.filters-content');
    
    if (!filtersContainer || !filtersContent) return;
    
    filtersContent.addEventListener('wheel', function(e) {
        if (this.classList.contains('collapsed')) return;
        
        this.scrollTop += e.deltaY;
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        
        return false;
    }, { passive: false, capture: true });
    
    filtersContainer.addEventListener('mouseover', function() {
        map.scrollWheelZoom.disable();
    });
    
    filtersContainer.addEventListener('mouseout', function() {
        map.scrollWheelZoom.enable();
    });
    
    const filtersTitle = document.querySelector('.filters-title');
    if (filtersTitle) {
        filtersTitle.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
    }
}

/**
 * Включение прокрутки особых меток
 */
function enableSpecialMarksScroll() {
    const specialMarksContainer = document.querySelector('.special-marks-container');
    const specialMarksContent = document.querySelector('.special-marks-content');
    
    if (!specialMarksContainer || !specialMarksContent) return;
    
    specialMarksContent.addEventListener('wheel', function(e) {
        if (this.classList.contains('collapsed')) return;
        
        this.scrollTop += e.deltaY;
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        
        return false;
    }, { passive: false, capture: true });
    
    specialMarksContainer.addEventListener('mouseover', function() {
        map.scrollWheelZoom.disable();
    });
    
    specialMarksContainer.addEventListener('mouseout', function() {
        map.scrollWheelZoom.enable();
    });
    
    const specialMarksTitle = document.querySelector('.special-marks-title');
    if (specialMarksTitle) {
        specialMarksTitle.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
    }
}

// ============================================
// ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ
// ============================================

/**
 * Основная функция инициализации приложения
 */
function initializeApp() {
    console.log('Инициализация приложения...');
    
    // Проверяем карту
    checkMapImage();
    
    // Загрузка сохраненных состояний
    loadFilterStates();
    loadSpecialMarksStates();
    loadToolsStates();
    
    // Инициализация карты
    initMap();
    
    // Добавление контролов на карту
    const toolsControl = new ToolsControl();
    toolsControl.addTo(map);
    
    const filtersToggleControl = new FiltersToggleControl();
    filtersToggleControl.addTo(map);
    
    const specialMarksControl = new SpecialMarksControl();
    specialMarksControl.addTo(map);
    
    // Загрузка меток - сначала CSV
    setTimeout(() => {
        loadMarkersFromJSON();
        loadMarkedMarkers();
        // Загружаем пользовательские метки после CSV
        setTimeout(() => {
            loadUserMarkers();
            cleanupGhostMarkedMarkers();
            
            // Настройка прокрутки
            setTimeout(() => {
                enableFilterScroll();
                enableSpecialMarksScroll();
                enableToolsScroll(); 
                
                // Обновление состояний интерфейса
                Object.keys(filterElements).forEach(filterName => {
                    updateFilterCheckboxState(filterName);
                });
                
                Object.keys(subfilterElements).forEach(subfilterName => {
                    const element = subfilterElements[subfilterName];
                    if (element) {
                        if (subfilterStates[subfilterName]) {
                            element.checkmark.classList.add('active');
                            element.checkbox.classList.add('active');
                        } else {
                            element.checkmark.classList.remove('active');
                            element.checkbox.classList.remove('active');
                        }
                    }
                });
                
                updateAllMarkersVisibility();
                updateAllFiltersCheckbox();
                setTimeout(() => {
                    specialMarksConfig.forEach(mark => {
                        updateSpecialMarkCheckboxState(mark.name);
                    });
                }, 100);
            }, 300);
        }, 200);
    }, 100);
}

// ============================================
// ДЕЛЕГИРОВАНИЕ СОБЫТИЙ ДЛЯ ЧЕКБОКСОВ В ТУЛТИПАХ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Используем делегирование событий для чекбоксов в тултипах
    document.addEventListener('click', function(e) {
        // Проверяем, был ли клик по чекбоксу "Отмечено"
        const checkbox = e.target.closest('.tooltip-mark-checkbox');
        const label = e.target.closest('.tooltip-mark-label');
        
        if (checkbox || label) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
            
            // Находим ближайший тултип
            const tooltip = e.target.closest('.clicked-tooltip');
            if (!tooltip) return;
            
            // Находим маркер по data-marker-id
            const markerId = checkbox ? checkbox.getAttribute('data-marker-id') : 
                           label ? label.getAttribute('data-marker-id') : null;
            
            if (!markerId) {
                console.error('Не найден markerId');
                return;
            }
            
            // Находим соответствующий маркер среди ВСЕХ маркеров
            let activeMarker = allMarkers.find(marker => marker.customId === markerId);
            
            // Если не найдено среди всех маркеров, ищем среди пользовательских
            if (!activeMarker) {
                activeMarker = userMarkers.find(marker => marker.customId === markerId);
            }
            
            if (!activeMarker) {
                console.error(`Маркер с ID ${markerId} не найден среди ${allMarkers.length} маркеров и ${userMarkers.length} пользовательских маркеров`);
                return;
            }
            
            const isCurrentlyMarked = markedMarkers[markerId] || false;
            const newState = !isCurrentlyMarked;
            
            // Обновляем состояние
            markedMarkers[markerId] = newState;
            
            // Обновляем внешний вид маркера
            updateMarkerAppearance(activeMarker, newState);
            
            // Обновляем чекбокс
            const checkboxElement = tooltip.querySelector('.tooltip-mark-checkbox');
            if (checkboxElement) {
                if (newState) {
                    checkboxElement.style.background = 'rgba(76, 175, 80, 0.2)';
                    checkboxElement.style.borderColor = '#4CAF50';
                    checkboxElement.innerHTML = '<div style="color: #4CAF50; font-size: 12px; font-weight: bold;">✓</div>';
                } else {
                    checkboxElement.style.background = 'rgba(255, 255, 255, 0.1)';
                    checkboxElement.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    checkboxElement.innerHTML = '';
                }
            }
            
            // Сохраняем состояние
            saveMarkedMarkers();
            saveUserMarkers(); // Также сохраняем пользовательские метки
            
            return false;
        }
    }, true);
    
    // Предотвращаем закрытие при клике на сам тултип
    document.addEventListener('click', function(e) {
        if (e.target.closest('.clicked-tooltip')) {
            e.stopPropagation();
        }
    }, true);
});

// Запуск приложения
document.addEventListener('DOMContentLoaded', initializeApp);
