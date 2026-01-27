// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ
// ============================================

// Константы для карты
const IMAGE_BOUNDS = [[0, 0], [800, 800]];
const IMAGE_URL = 'assets/worldmap.webp';

// Глобальные переменные
let map;
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
// Конфигурация слоёв (карт)
const layersConfig = [
    {
        id: 'worldmap',
        name: 'Основной мир',
        imageUrl: 'assets/worldmap.webp',
        bounds: [[0, 0], [800, 800]],
        icon: 'assets/worldmap-icon.png',
        minZoom: 0,
        maxZoom: 5,
        defaultZoom: 0
    },
    {
        id: 'greyshaft-city',
        name: 'Грейшафт-Сити',
        imageUrl: 'assets/greyshaft-city.png',
        bounds: [[0, 0], [800, 800]],
        icon: 'assets/greyshaft-icon.png',
        minZoom: 0,
        maxZoom: 3,
        defaultZoom: 0
    }
];
// Глобальные переменные для слоёв
let currentLayer = 'worldmap';
let layerImageOverlays = {};
let markersByLayer = {
    'worldmap': [],
    'greyshaft-city': []
};
let userMarkersByLayer = {
    'worldmap': [],
    'greyshaft-city': []
};
let markedMarkersByLayer = {
    'worldmap': {},
    'greyshaft-city': {}
};

// ============================================
// ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ КАРТЫ
// ============================================

/**
 * Инициализация карты Leaflet
 */
function initMap() {
    // Получаем конфиг текущего слоя
    const currentLayerConfig = layersConfig.find(l => l.id === currentLayer);
    
    map = L.map('map', {
        crs: L.CRS.Simple,
        maxBounds: currentLayerConfig ? currentLayerConfig.bounds : IMAGE_BOUNDS,
        maxZoom: currentLayerConfig ? currentLayerConfig.maxZoom : 5,
        minZoom: currentLayerConfig ? currentLayerConfig.minZoom : 0,
        doubleClickZoom: false,
    });
    
    // Настраиваем контролы
    map.removeControl(map.zoomControl);
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Добавляем изображение карты (будет обновлено в initLayers)
    L.imageOverlay(IMAGE_URL, IMAGE_BOUNDS).addTo(map);
    
    // Устанавливаем вид по умолчанию для текущего слоя
    const defaultZoom = currentLayerConfig ? currentLayerConfig.defaultZoom : 0;
    map.setView([400, 400], defaultZoom);
    
    // Инициализация иконок
    initMarkerIcons();
    
    // Инициализация состояний
    initAllStates();
    
    // Загружаем сохраненное состояние карты
    loadMapState();
    
    // Настраиваем обработчики событий
    setupEventListeners();
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
        'НИП': 'assets/npc.png',
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
        saveUserMarkers();
    });
    
    // Периодическое сохранение
    setInterval(function() {
        saveMapState();
        saveFilterStates();
        saveSpecialMarksStates();
        saveToolsStates();
        saveMarkedMarkers();
        saveUserMarkers();
    }, 30000);
}

// ============================================
// УПРАВЛЕНИЕ СЛОЯМИ
// ============================================

/**
 * Инициализация всех слоёв
 */
function initLayers() {
    layersConfig.forEach(layer => {
        // Создаем ImageOverlay для каждого слоя
        const imageOverlay = L.imageOverlay(layer.imageUrl, layer.bounds);
        layerImageOverlays[layer.id] = imageOverlay;
        
        // Скрываем все слои кроме текущего
        if (layer.id !== currentLayer) {
            // Просто не добавляем на карту
        } else {
            imageOverlay.addTo(map);
        }
    });
}

/**
 * Переключение на другой слой
 */
function switchLayer(layerId) {
    if (currentLayer === layerId) return;
    
    // Сохраняем состояние текущего слоя (только отмеченные метки)
    saveCurrentLayerState();
    
    // Сохраняем состояние карты текущего слоя
    saveMapState();
    
    // Скрываем метки текущего слоя
    hideCurrentLayerMarkers();
    
    // Меняем текущий слой
    map.setZoom(0);
    const oldLayer = currentLayer;
    currentLayer = layerId;
    
    // Очищаем markersByFilter
    clearMarkersByFilter();
    
    // Обновляем изображение карты (с новыми параметрами и зумом)
    updateMapImage();
    
    // Загружаем состояние нового слоя (только отмеченные метки)
    loadLayerState(layerId);
    
    // Теперь заполняем markersByFilter для нового слоя
    populateMarkersByFilter();
    
    // Обновляем видимость всех маркеров нового слоя
    updateAllMarkersVisibility();
    
    // Сохраняем выбор слоя
    saveCurrentLayer();
    
    console.log(`Переключен слой с ${oldLayer} на ${layerId}`);
}

/**
 * Обновление изображения карты при переключении слоя
 */
function updateMapImage() {
    // Получаем конфиг нового слоя
    const layerConfig = layersConfig.find(l => l.id === currentLayer);
    if (!layerConfig) return;
    
    // Удаляем текущий ImageOverlay
    if (layerImageOverlays[currentLayer]) {
        map.removeLayer(layerImageOverlays[currentLayer]);
    }
    
    // Добавляем новый ImageOverlay
    const newLayer = layerImageOverlays[currentLayer];
    if (newLayer) {
        newLayer.addTo(map);
        
        // Устанавливаем новые параметры карты
        map.setMaxBounds(layerConfig.bounds);
        map.setMaxZoom(layerConfig.maxZoom);
        map.setMinZoom(layerConfig.minZoom);
        
        // Устанавливаем зум по умолчанию
        map.setZoom(layerConfig.defaultZoom);
        
        // Центрируем карту
        map.fitBounds(layerConfig.bounds);
    }
}

/**
 * Контрол для кнопки переключения карты
 */
const MapSwitchControl = L.Control.extend({
    options: {
        position: 'bottomright'
    },
    
    onAdd: function(map) {
        const switchButton = L.DomUtil.create('div', 'map-switch-button');
        
        // Создаем текстовый элемент
        const switchText = L.DomUtil.create('div', 'map-switch-text', switchButton);
        switchText.textContent = 'Сменить карту';
        
        // Обработчик клика
        switchButton.onclick = function(e) {
            // Находим следующий слой
            const currentIndex = layersConfig.findIndex(l => l.id === currentLayer);
            const nextIndex = (currentIndex + 1) % layersConfig.length;
            const nextLayer = layersConfig[nextIndex];
            
            // Переключаемся на следующий слой
            switchLayer(nextLayer.id);
            
            // Можно показать всплывающее сообщение на кнопке
            switchText.textContent = 'Карта изменена';
            setTimeout(() => {
                switchText.textContent = 'Сменить карту';
            }, 1000);
            
            L.DomEvent.stopPropagation(e);
        };
        
        return switchButton;
    }
});

/**
 * Сохранение состояния текущего слоя
 */
function saveCurrentLayerState() {
    
    // Сохраняем состояние отмеченных меток текущего слоя
    markedMarkersByLayer[currentLayer] = { ...markedMarkers };
    
    // Сохраняем состояние инструментов
    saveToolsStates();
}

/**
 * Загрузка состояния слоя
 */
function loadLayerState(layerId) {    
    // Загружаем состояние отмеченных маркеров
    const layerMarkedMarkers = markedMarkersByLayer[layerId];
    if (layerMarkedMarkers) {
        // Очищаем текущие отмеченные маркеры
        markedMarkers = {};
        // Копируем отмеченные маркеры из слоя
        Object.assign(markedMarkers, layerMarkedMarkers);
    } else {
        markedMarkers = {};
    }
    
    // Обновляем видимость маркеров нового слоя
    updateAllMarkersVisibility();
    
    // Обновляем состояния UI
    updateAllUIStates();
}

/**
 * Инициализация состояний фильтров для нового слоя
 */
function initFilterStatesForLayer() {
    filtersConfig.forEach(filter => {
        if (!filter.special && !subfilters[filter.name] && filterStates[filter.name] === undefined) {
            filterStates[filter.name] = true;
        }
    });
}

function initSubfilterStatesForLayer() {
    Object.keys(subfilters).forEach(parentFilter => {
        subfilters[parentFilter].forEach(subfilter => {
            if (subfilterStates[subfilter] === undefined) {
                subfilterStates[subfilter] = true;
            }
        });
    });
}

function initSpecialMarksStatesForLayer() {
    specialMarksConfig.forEach(mark => {
        if (specialMarksStates[mark.name] === undefined) {
            specialMarksStates[mark.name] = mark.completed;
        }
    });
}

function initSpecialSubmarksStatesForLayer() {
    specialMarksConfig.forEach(mark => {
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

/**
 * Обновление всех состояний UI
 */
function updateAllUIStates() {
    // Обновляем фильтры
    Object.keys(filterElements).forEach(filterName => {
        updateFilterCheckboxState(filterName);
    });
    
    // Обновляем подфильтры
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
    
    // Обновляем особые метки
    specialMarksConfig.forEach(mark => {
        updateSpecialMarkCheckboxState(mark.name);
    });
    
    // Обновляем чекбокс "Все фильтры"
    updateAllFiltersCheckbox();
}

/**
 * Скрытие маркеров текущего слоя
 */
function hideCurrentLayerMarkers() {
    // Скрываем обычные маркеры
    if (markersByLayer[currentLayer]) {
        markersByLayer[currentLayer].forEach(marker => {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        });
    }
    
    // Скрываем пользовательские метки
    if (userMarkersByLayer[currentLayer]) {
        userMarkersByLayer[currentLayer].forEach(marker => {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        });
    }
    
    // Закрываем все тултипы
    closeAllTooltips();
}

/**
 * Сохранение выбранного слоя
 */
function saveCurrentLayer() {
    localStorage.setItem('currentLayer', currentLayer);
}

/**
 * Загрузка выбранного слоя
 */
function loadCurrentLayer() {
    const saved = localStorage.getItem('currentLayer');
    if (saved && layersConfig.some(l => l.id === saved)) {
        currentLayer = saved;
        return true;
    }
    return false;
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С МАРКЕРАМИ
// ============================================

/**
 * Получить все маркеры текущего слоя (обычные + пользовательские)
 */
function getAllMarkersForCurrentLayer() {
    const regularMarkers = markersByLayer[currentLayer] || [];
    const userMarkers = userMarkersByLayer[currentLayer] || [];
    return [...regularMarkers, ...userMarkers];
}

/**
 * Получить все маркеры по ID слоя
 */
function getAllMarkersForLayer(layerId) {
    const regularMarkers = markersByLayer[layerId] || [];
    const userMarkers = userMarkersByLayer[layerId] || [];
    return [...regularMarkers, ...userMarkers];
}

/**
 * Найти маркер по ID во всех слоях
 */
function findMarkerById(markerId) {
    // Ищем во всех слоях
    for (const layerId in markersByLayer) {
        const marker = markersByLayer[layerId]?.find(m => m.customId === markerId);
        if (marker) return { marker, layer: layerId, isUserMarker: false };
    }
    
    // Ищем в пользовательских метках
    for (const layerId in userMarkersByLayer) {
        const marker = userMarkersByLayer[layerId]?.find(m => m.customId === markerId);
        if (marker) return { marker, layer: layerId, isUserMarker: true };
    }
    
    return null;
}

// ============================================
// РАБОТА С СОСТОЯНИЯМИ (LOCALSTORAGE)
// ============================================

/**
 * Сохранение состояния карты
 */
function saveMapState() {
    try {
        const center = map.getCenter();
        const zoom = map.getZoom();
        
        const mapState = {
            lat: center.lat,
            lng: center.lng,
            zoom: zoom,
            timestamp: Date.now(),
            layer: currentLayer
        };
        
        // Сохраняем отдельно для каждого слоя
        localStorage.setItem(`mapViewState_${currentLayer}`, JSON.stringify(mapState));
    } catch (error) {
        console.error('Ошибка сохранения состояния карты:', error);
    }
}

/**
 * Загрузка состояния карты для текущего слоя
 */
function loadMapState() {
    try {
        const saved = localStorage.getItem(`mapViewState_${currentLayer}`);
        if (saved) {
            const mapState = JSON.parse(saved);
            
            // Проверяем, что состояние для правильного слоя
            if (mapState.layer !== currentLayer) {
                return false;
            }
            
            if (mapState.lat && mapState.lng && mapState.zoom !== undefined) {
                map.setView([mapState.lat, mapState.lng], mapState.zoom, {
                    animate: false
                });
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
        // Сохраняем метки для каждого слоя
        layersConfig.forEach(layer => {
            const layerMarkers = userMarkersByLayer[layer.id] || [];
            const markersToSave = layerMarkers.map(marker => {
                const data = marker.markerData;
                return {
                    id: marker.customId,
                    name: data.Название,
                    filters: data.ОсновныеФильтры,
                    subfilters: data.Подфильтры,
                    allFilters: data.ВсеФильтрыВПорядке,
                    x: data.X,
                    y: data.Y,
                    comment: data.Комментарий || '',
                    layer: data.Карта || layer.id, // Явно сохраняем слой
                    isMarked: markedMarkersByLayer[layer.id]?.[marker.customId] || false
                };
            });
            
            localStorage.setItem(`userMarkers_${layer.id}`, JSON.stringify(markersToSave));
        });
    } catch (error) {
        console.error('Ошибка сохранения пользовательских меток:', error);
    }
}

/**
 * Загрузка пользовательских меток
 */
function loadUserMarkers() {
    try {
        layersConfig.forEach(layer => {
            const saved = localStorage.getItem(`userMarkers_${layer.id}`);
            if (saved) {
                const markersData = JSON.parse(saved);
                
                markersData.forEach(data => {
                    // ВАЖНО: Проверяем, что данные содержат информацию о слое
                    // Если нет - используем слой из ключа localStorage
                    const markerLayer = data.layer || data.Карта || layer.id;
                    
                    // Создаем объект данных маркера
                    const markerData = {
                        Название: data.name,
                        ОсновныеФильтры: data.filters || ['Мои метки'],
                        Подфильтры: data.subfilters || [],
                        ВсеФильтрыВПорядке: data.allFilters || ['Мои метки'],
                        X: data.x,
                        Y: data.y,
                        Комментарий: data.comment || '',
                        Карта: markerLayer // Явно указываем слой
                    };
                    
                    // Создаем маркер с правильным ID
                    const marker = createUserMarker(markerData, data.id);
                    
                    // Восстанавливаем состояние "отмечено"
                    if (data.isMarked) {
                        if (!markedMarkersByLayer[markerLayer]) {
                            markedMarkersByLayer[markerLayer] = {};
                        }
                        markedMarkersByLayer[markerLayer][data.id] = true;
                        
                        // Обновляем внешний вид если на текущем слое
                        if (markerLayer === currentLayer) {
                            setTimeout(() => {
                                updateMarkerAppearance(marker, true);
                            }, 100);
                        }
                    }
                });
                
            }
        });
        
        // ОБНОВЛЯЕМ ВИДИМОСТЬ ПОСЛЕ ЗАГРУЗКИ
        setTimeout(() => {
            updateAllMarkersVisibility();
        }, 200);
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
    // Проверяем, для какого слоя эта метка
    const markerLayer = data.Карта || 'worldmap';
    
    // Если метка не для текущего слоя, пропускаем создание на карте
    const addToMap = markerLayer === currentLayer;
    
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
    marker.layer = markerLayer; // Сохраняем информацию о слое
    
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
        Комментарий: data.Комментарий || '',
        Карта: markerLayer // Сохраняем слой
    };
    
    // Настраиваем обработчики событий
    let tooltip = null;
    setupMarkerEventHandlers(marker, markerData, tooltip);
    
    // Сохраняем данные в маркере
    marker.markerData = markerData;
    marker.mainFilters = data.ОсновныеФильтры || [];
    marker.subfilters = data.Подфильтры || [];
    marker.isUserMarker = false;
    
    // Добавляем в массив слоя
    if (!markersByLayer[markerLayer]) {
        markersByLayer[markerLayer] = [];
    }
    markersByLayer[markerLayer].push(marker);
    
    // Распределяем по фильтрам (для текущего слоя)
    if (markerLayer === currentLayer && data.ОсновныеФильтры) {
        data.ОсновныеФильтры.forEach(filter => {
            if (!markersByFilter[filter]) {
                markersByFilter[filter] = [];
            }
            markersByFilter[filter].push(marker);
        });
    }
    
    if (markerLayer === currentLayer && data.Подфильтры) {
        data.Подфильтры.forEach(subfilter => {
            if (!markersByFilter[subfilter]) {
                markersByFilter[subfilter] = [];
            }
            markersByFilter[subfilter].push(marker);
        });
    }
    
    // Добавляем на карту если видим и для текущего слоя
    if (addToMap && shouldMarkerBeVisible(marker)) {
        marker.addTo(map);
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
    
    try {
        // Инициализируем структуры для всех слоев
        layersConfig.forEach(layer => {
            if (!markedMarkersByLayer[layer.id]) {
                markedMarkersByLayer[layer.id] = {};
            }
        });
        
        // Загружаем для каждого слоя
        layersConfig.forEach(layer => {
            const saved = localStorage.getItem(`markedMarkers_${layer.id}`);
            
            if (saved) {
                try {
                    const layerMarkedMarkers = JSON.parse(saved);
                    
                    // Фильтруем некорректные записи
                    const validMarkedMarkers = {};
                    Object.entries(layerMarkedMarkers).forEach(([markerId, isMarked]) => {
                        if (typeof isMarked === 'boolean') {
                            validMarkedMarkers[markerId] = isMarked;
                        }
                    });
                    
                    markedMarkersByLayer[layer.id] = validMarkedMarkers;
                                        
                    // Если это текущий слой, применяем состояние
                    if (layer.id === currentLayer) {
                        markedMarkers = { ...validMarkedMarkers };
                        
                        // Применяем состояние к существующим маркерам текущего слоя
                        const allCurrentMarkers = getAllMarkersForCurrentLayer();
                        allCurrentMarkers.forEach(marker => {
                            const markerId = marker.customId;
                            if (markedMarkers[markerId]) {
                                updateMarkerAppearance(marker, true);
                            }
                        });
                    }
                } catch (parseError) {
                    console.error(`Ошибка парсинга данных для слоя ${layer.id}:`, parseError);
                    markedMarkersByLayer[layer.id] = {};
                }
            } else {
                markedMarkersByLayer[layer.id] = {};
            }
        });
    } catch (error) {
        console.error('Общая ошибка загрузки отмеченных маркеров:', error);
        // Инициализируем для всех слоев
        layersConfig.forEach(layer => {
            markedMarkersByLayer[layer.id] = {};
        });
        markedMarkers = {};
    }
}

/**
 * Снять все отметки с маркеров
 */
function clearAllMarkedMarkers() {
    console.log('Снимаем все отметки с маркеров на всех слоях...');
    
    // Подсчитываем общее количество отмеченных меток на всех слоях
    let totalMarkedCount = 0;
    layersConfig.forEach(layer => {
        const layerMarked = markedMarkersByLayer[layer.id] || {};
        totalMarkedCount += Object.keys(layerMarked).filter(id => layerMarked[id]).length;
    });
    
    if (totalMarkedCount === 0) {
        alert('Нет отмеченных меток для снятия.');
        return;
    }
    
    if (!confirm(`Вы уверены, что хотите снять ВСЕ отметки (${totalMarkedCount} меток)? Это действие нельзя отменить.`)) {
        return;
    }
    
    // 1. Снимаем отметки на текущем слое
    const allCurrentMarkers = getAllMarkersForCurrentLayer();
    allCurrentMarkers.forEach(marker => {
        const markerId = marker.customId;
        if (markedMarkers[markerId]) {
            markedMarkers[markerId] = false;
            updateMarkerAppearance(marker, false);
            
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
    
    // 2. Снимаем отметки на всех слоях в структурах данных
    layersConfig.forEach(layer => {
        const layerId = layer.id;
        
        // Очищаем отмеченные метки в структуре данных
        markedMarkersByLayer[layerId] = {};
        
        // Обновляем видимость меток, если это текущий слой
        if (layerId === currentLayer) {
            markedMarkers = {};
        }
        
        // Для каждого маркера этого слоя обновляем внешний вид
        const allLayerMarkers = getAllMarkersForLayer(layerId);
        allLayerMarkers.forEach(marker => {
            if (marker.isTooltipActive) {
                marker.closeTooltip();
                marker.isTooltipActive = false;
            }
        });
    });
    
    // 3. Сохраняем изменения
    saveMarkedMarkers();
    saveUserMarkers(); // Также сохраняем пользовательские метки
    
    // 4. Обновляем видимость маркеров на текущем слое
    updateAllMarkersVisibility();
    closeAllTooltips();
    
    // 5. Показываем сообщение об успехе
    alert(`Все отметки сняты!`);
    console.log(`Сняты все отметки на всех слоях. Всего: ${totalMarkedCount} меток`);
}

/**
 * Сохранение состояния отмеченных маркеров
 */
function saveMarkedMarkers() {
    try {
        // Убедимся, что у всех слоев есть структуры данных
        layersConfig.forEach(layer => {
            if (!markedMarkersByLayer[layer.id]) {
                markedMarkersByLayer[layer.id] = {};
            }
        });
        
        // Сохраняем для каждого слоя
        layersConfig.forEach(layer => {
            const layerMarkedMarkers = markedMarkersByLayer[layer.id] || {};
            localStorage.setItem(`markedMarkers_${layer.id}`, JSON.stringify(layerMarkedMarkers));
        });
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
    const tooltip = document.querySelector('.clicked-tooltip');
    if (!tooltip) return;
    
    const checkboxElement = tooltip.querySelector('.tooltip-mark-checkbox');
    if (!checkboxElement) return;
    
    const isMarked = markedMarkers[markerId] || false;
    
    if (isMarked) {
        checkboxElement.classList.add('checked');
        checkboxElement.innerHTML = '<div class="marker-tooltip-checkmark">✓</div>';
    } else {
        checkboxElement.classList.remove('checked');
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
            <div class="marker-tooltip-container">
                <div class="marker-tooltip-header">
                    <h4 class="marker-tooltip-title">
                        ${data.Название}
                    </h4>
                </div>
                ${commentText ? `
                    <div class="marker-tooltip-comment">
                        ${commentText}
                    </div>
                ` : ''}
                
                <div id="mark-checkbox-${markerId}" class="marker-tooltip-checkbox-area">
                    <div class="tooltip-mark-checkbox marker-tooltip-checkbox ${isMarked ? 'checked' : ''}" 
                        data-marker-id="${markerId}">
                        ${isMarked ? `
                            <div class="marker-tooltip-checkmark">✓</div>
                        ` : ''}
                    </div>
                    <span class="tooltip-mark-label marker-tooltip-label" 
                        data-marker-id="${markerId}">
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
    // Находим маркер во всех слоях
    const markerInfo = findMarkerById(markerId);
    if (!markerInfo) return;
    
    const { marker, layer } = markerInfo;
    
    // Проверяем, принадлежит ли маркер текущему слою
    if (layer !== currentLayer) return;
    
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
    
    // Находим маркер во всех слоях
    const markerInfo = findMarkerById(markerId);
    if (!markerInfo) {
        console.error(`Маркер с ID ${markerId} не найден`);
        return;
    }
    
    const { marker, layer } = markerInfo;
    
    // Проверяем, принадлежит ли маркер текущему слою
    if (layer !== currentLayer) {
        console.warn(`Маркер ${markerId} принадлежит слою ${layer}, а текущий слой ${currentLayer}`);
        return;
    }
    
    const isCurrentlyMarked = markedMarkers[markerId] || false;
    const newState = !isCurrentlyMarked;
    
    // Обновляем состояние в текущем слое
    markedMarkers[markerId] = newState;
    
    // Обновляем состояние в структуре слоя
    if (!markedMarkersByLayer[layer]) {
        markedMarkersByLayer[layer] = {};
    }
    markedMarkersByLayer[layer][markerId] = newState;
    
    // Обновляем внешний вид маркера
    updateMarkerAppearance(marker, newState);
    
    // Обновляем чекбокс в тултипе
    if (checkboxElement) {
        if (newState) {
            checkboxElement.classList.add('checked');
            checkboxElement.innerHTML = '<div class="marker-tooltip-checkmark">✓</div>';
        } else {
            checkboxElement.classList.remove('checked');
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

/**
 * Инициализация структур данных для слоёв
 */
function initLayerDataStructures() {
    layersConfig.forEach(layer => {
        // Инициализируем массивы маркеров
        if (!markersByLayer[layer.id]) {
            markersByLayer[layer.id] = [];
        }
        if (!userMarkersByLayer[layer.id]) {
            userMarkersByLayer[layer.id] = [];
        }
        // Инициализируем состояния ОТМЕЧЕННЫХ МЕТОК по слоям
        if (!markedMarkersByLayer[layer.id]) {
            markedMarkersByLayer[layer.id] = {};
        }
    });
}

// ============================================
// УПРАВЛЕНИЕ ВИДИМОСТЬЮ МЕТОК
// ============================================

/**
 * Инициализация видимости меток при загрузке
 */
function initializeMarkersVisibility() {
    const allCurrentMarkers = getAllMarkersForCurrentLayer();
    allCurrentMarkers.forEach(marker => {
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
    
    // Получаем все маркеры текущего слоя
    const allCurrentMarkers = getAllMarkersForCurrentLayer();
    
    allCurrentMarkers.forEach(marker => {
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
    // Проверяем, принадлежит ли маркер текущему слою
    if (marker.layer !== currentLayer) {
        return false;
    }
    
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
 * Очистка массива markersByFilter при смене слоя
 */
function clearMarkersByFilter() {
    Object.keys(markersByFilter).forEach(key => {
        markersByFilter[key] = [];
    });
}

/**
 * Заполнение markersByFilter для текущего слоя
 */
function populateMarkersByFilter() {
    clearMarkersByFilter();
    
    // Добавляем обычные маркеры текущего слоя
    const regularMarkers = markersByLayer[currentLayer] || [];
    regularMarkers.forEach(marker => {
        if (marker.mainFilters) {
            marker.mainFilters.forEach(filter => {
                if (!markersByFilter[filter]) {
                    markersByFilter[filter] = [];
                }
                markersByFilter[filter].push(marker);
            });
        }
        
        if (marker.subfilters) {
            marker.subfilters.forEach(subfilter => {
                if (!markersByFilter[subfilter]) {
                    markersByFilter[subfilter] = [];
                }
                markersByFilter[subfilter].push(marker);
            });
        }
    });
    
    // Добавляем пользовательские метки текущего слоя
    const userMarkers = userMarkersByLayer[currentLayer] || [];
    userMarkers.forEach(marker => {
        if (marker.mainFilters) {
            marker.mainFilters.forEach(filter => {
                if (!markersByFilter[filter]) {
                    markersByFilter[filter] = [];
                }
                markersByFilter[filter].push(marker);
            });
        }
        
        if (marker.subfilters) {
            marker.subfilters.forEach(subfilter => {
                if (!markersByFilter[subfilter]) {
                    markersByFilter[subfilter] = [];
                }
                markersByFilter[subfilter].push(marker);
            });
        }
    });
}

/**
 * Закрытие всех активных тултипов
 */
function closeAllTooltips() {
    // Получаем все маркеры текущего слоя
    const allCurrentMarkers = getAllMarkersForCurrentLayer();
    
    allCurrentMarkers.forEach(marker => {
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
    // Определяем слой - берем из данных или используем текущий
    const markerLayer = data.Карта || currentLayer;
    
    const markerId = customId || `user_marker_${Date.now()}_${userMarkerCounter++}`;
    
    // Используем иконку для "Мои метки"
    const iconToUse = markerIcons['Мои метки'] || markerIcons['default'];
    
    const marker = L.marker([data.Y, data.X], {
        icon: iconToUse,
        riseOnHover: true,
        bubblingMouseEvents: false,
        isUserMarker: true
    });
    
    marker.customId = markerId;
    marker.layer = markerLayer; // Сохраняем слой
    marker.isUserMarker = true;
    
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
    
    // Сохраняем данные с указанием слоя
    marker.markerData = {
        ...data,
        Карта: markerLayer // Явно указываем слой
    };
    marker.mainFilters = data.ОсновныеФильтры || ['Мои метки'];
    marker.subfilters = data.Подфильтры || [];
    
    // Добавляем обработчики событий
    setupUserMarkerEventHandlers(marker, marker.markerData);
    
    // Инициализируем состояние
    marker.isTooltipActive = false;
    
    // Добавляем в массив слоя
    if (!userMarkersByLayer[markerLayer]) {
        userMarkersByLayer[markerLayer] = [];
    }
    userMarkersByLayer[markerLayer].push(marker);
    
    // Добавляем в фильтры только если это текущий слой
    if (markerLayer === currentLayer) {
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
                <div class="marker-tooltip-container">
                    <div class="marker-tooltip-header">
                        <h4 class="marker-tooltip-title">
                            ${data.Название}
                        </h4>
                    </div>
                    ${commentText ? `
                        <div class="marker-tooltip-comment">
                            ${commentText}
                        </div>
                    ` : ''}
                    
                    <div id="mark-checkbox-${markerId}" class="marker-tooltip-checkbox-area">
                        <div class="tooltip-mark-checkbox marker-tooltip-checkbox ${isMarked ? 'checked' : ''}" 
                            data-marker-id="${markerId}">
                            ${isMarked ? `
                                <div class="marker-tooltip-checkmark">✓</div>
                            ` : ''}
                        </div>
                        <span class="tooltip-mark-label marker-tooltip-label" 
                            data-marker-id="${markerId}">
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
    // Находим метку во всех слоях
    let foundMarker = null;
    let foundLayer = null;
    let markerIndex = -1;
    
    for (const layerId in userMarkersByLayer) {
        const layerMarkers = userMarkersByLayer[layerId];
        if (!layerMarkers) continue;
        
        const layerIndex = layerMarkers.findIndex(m => m.customId === markerId);
        if (layerIndex !== -1) {
            foundMarker = layerMarkers[layerIndex];
            foundLayer = layerId;
            markerIndex = layerIndex;
            break;
        }
    }
    
    if (!foundMarker) return;
    
    // Удаляем с карты если виден
    if (map.hasLayer(foundMarker)) {
        map.removeLayer(foundMarker);
    }
    
    // Удаляем из массива слоя
    userMarkersByLayer[foundLayer].splice(markerIndex, 1);
    
    // Удаляем из фильтров (только если это текущий слой)
    if (foundLayer === currentLayer) {
        foundMarker.mainFilters.forEach(filter => {
            if (markersByFilter[filter]) {
                const filterIndex = markersByFilter[filter].findIndex(m => m.customId === markerId);
                if (filterIndex !== -1) {
                    markersByFilter[filter].splice(filterIndex, 1);
                }
            }
        });
    }
    
    // Удаляем состояние "отмечено"
    if (markedMarkersByLayer[foundLayer] && markedMarkersByLayer[foundLayer][markerId]) {
        delete markedMarkersByLayer[foundLayer][markerId];
    }
    if (foundLayer === currentLayer && markedMarkers[markerId]) {
        delete markedMarkers[markerId];
    }
    
    // Сохраняем изменения
    saveUserMarkers();
    saveMarkedMarkers();
}

/**
 * Очистка записей об удаленных метках
 */
function cleanupGhostMarkedMarkers() {
    console.log('Очистка записей об удаленных метках...');
    
    let cleanupCount = 0;
    
    // Проходим по всем слоям
    layersConfig.forEach(layer => {
        const layerMarkedMarkers = markedMarkersByLayer[layer.id];
        if (!layerMarkedMarkers) return;
        
        // Получаем все маркеры слоя
        const allLayerMarkers = getAllMarkersForLayer(layer.id);
        
        // Проходим по всем отмеченным маркерам слоя
        Object.keys(layerMarkedMarkers).forEach(markerId => {
            // Ищем маркер в маркерах слоя
            const markerExists = allLayerMarkers.some(m => m.customId === markerId);
            
            // Если маркер не найден - удаляем запись
            if (!markerExists) {
                delete layerMarkedMarkers[markerId];
                cleanupCount++;
            }
        });
        
        // Сохраняем обновленный слой
        markedMarkersByLayer[layer.id] = layerMarkedMarkers;
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
    // Собираем все доступные фильтры и подфильтры
    const allAvailableFilters = new Set();
    const filtersTree = {}; // Дерево фильтров: {фильтр: [подфильтры]}
    
    // Основные фильтры (кроме "Мои метки")
    filtersConfig.forEach(filter => {
        if (!filter.special && filter.name !== 'Мои метки') {
            allAvailableFilters.add(filter.name);
            filtersTree[filter.name] = [];
        }
    });
    
    // Подфильтры
    Object.entries(subfilters).forEach(([parent, subfilterList]) => {
        if (filtersTree[parent]) { // Если родительский фильтр существует
            filtersTree[parent] = subfilterList;
            subfilterList.forEach(subfilter => {
                allAvailableFilters.add(subfilter);
            });
        }
    });
    
    // Преобразуем в массив и сортируем
    const sortedFilters = Array.from(allAvailableFilters).sort();
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'create-marker-dialog-overlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'create-marker-dialog';
    
    dialog.innerHTML = `
        <h3 class="create-marker-dialog-title">Создать новую метку</h3>
        <div class="coordinates-info">
            Координаты: [${Math.round(latlng.lng)}, ${Math.round(latlng.lat)}]
        </div>
        
        <div class="dialog-layout">
            <!-- Левая панель: дерево фильтров -->
            <div class="filters-tree-panel">
                <label class="filters-tree-label">
                    📋 Все фильтры
                </label>
                <div id="filters-tree" class="filters-tree-container">
                    <!-- Дерево фильтров будет здесь -->
                </div>
                <div class="filters-tree-tip">
                    <strong>💡 Подсказка:</strong> Нажмите на фильтр или подфильтр, чтобы добавить его к метке
                </div>
            </div>
            
            <!-- Правая панель: форма создания метки -->
            <div class="create-form-panel">
                <div class="form-group">
                    <label class="form-label">
                        Название <span style="color: #ff5757;">*</span>
                    </label>
                    <input type="text" id="marker-name" class="form-input" placeholder="Введите название метки" autofocus>
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        Фильтры (для экспорта)
                    </label>
                    
                    <!-- Чипсы выбранных фильтров -->
                    <div id="filter-chips-container" class="filter-chips-container"></div>
                    
                    <!-- Поиск фильтров -->
                    <div class="search-container">
                        <input type="text" id="filter-search" class="search-input" placeholder="Поиск фильтров...">
                        <div id="search-results" class="search-results"></div>
                    </div>
                    
                    <div class="search-info">
                        <strong>Информация:</strong><br>
                        • Выберите фильтры из дерева слева или используйте поиск<br>
                        • Все созданные метки считаются как <span style="color: #4CAF50; font-weight: bold;">"Мои метки"</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px; flex: 1;">
                    <label class="form-label">
                        Комментарий
                    </label>
                    <textarea id="marker-comment" class="form-textarea" placeholder="Дополнительная информация (необязательно). Ставьте <br> для новой строки."></textarea>
                </div>
            </div>
        </div>
        
        <div class="dialog-buttons">
            <button id="cancel-marker" class="cancel-button">Отмена</button>
            <button id="save-marker" class="save-button">Создать метку</button>
        </div>
    `;
    
    modal.appendChild(dialog);
    document.body.appendChild(modal);
    
    // Элементы
    const nameInput = dialog.querySelector('#marker-name');
    const filterSearch = dialog.querySelector('#filter-search');
    const searchResults = dialog.querySelector('#search-results');
    const filterChipsContainer = dialog.querySelector('#filter-chips-container');
    const filtersTreeContainer = dialog.querySelector('#filters-tree');
    
    // Массив выбранных фильтров
    let selectedFilters = [];
    
    // Функция для создания элемента дерева фильтров
    function createFilterTreeItem(filterName, isSubfilter = false, parentName = '') {
        const item = document.createElement('div');
        item.className = 'filter-tree-item';
        item.dataset.filterName = filterName;
        item.dataset.isSubfilter = isSubfilter;
        if (parentName) item.dataset.parentName = parentName;
        
        item.className = 'filter-tree-item' + (isSubfilter ? ' subfilter' : '');
        if (selectedFilters.includes(filterName)) {
            item.classList.add('selected');
        }
        
        // Текст фильтра
        const textSpan = document.createElement('span');
        textSpan.textContent = filterName;
        
        // Иконка статуса
        const statusIcon = document.createElement('span');
        statusIcon.innerHTML = selectedFilters.includes(filterName) ? '✓' : '+';
        statusIcon.className = 'tree-item-status';
        if (selectedFilters.includes(filterName)) {
            statusIcon.classList.add('selected');
        }
        
        item.appendChild(textSpan);
        item.appendChild(statusIcon);
        
        // Эффекты при наведении
        item.addEventListener('mouseover', () => {
            item.classList.add('hover');
            if (selectedFilters.includes(filterName)) {
                item.classList.add('selected-hover');
                statusIcon.classList.add('selected-hover');
            }
        });

        item.addEventListener('mouseout', () => {
            item.classList.remove('hover');
            if (selectedFilters.includes(filterName)) {
                item.classList.remove('selected-hover');
                statusIcon.classList.remove('selected-hover');
            }
        });
                
                // Обработчик клика
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleFilter(filterName);
                });
                
                return item;
            }
    
    // Функция для построения дерева фильтров
    function buildFilterTree() {
        filtersTreeContainer.innerHTML = '';
        
        // Сортируем фильтры по алфавиту
        const sortedMainFilters = Object.keys(filtersTree).sort();
        
        sortedMainFilters.forEach(mainFilter => {
            // Основной фильтр
            const mainFilterItem = createFilterTreeItem(mainFilter, false);
            filtersTreeContainer.appendChild(mainFilterItem);
            
            // Подфильтры (если есть)
            const subfilters = filtersTree[mainFilter];
            if (subfilters && subfilters.length > 0) {
                subfilters.sort().forEach(subfilter => {
                    const subfilterItem = createFilterTreeItem(subfilter, true, mainFilter);
                    filtersTreeContainer.appendChild(subfilterItem);
                });
                
                // Добавляем разделитель между группами фильтров
                if (sortedMainFilters.indexOf(mainFilter) !== sortedMainFilters.length - 1) {
                    const separator = document.createElement('div');
                    separator.className = 'filters-tree-separator';
                    filtersTreeContainer.appendChild(separator);
                }
            }
        });
    }
    
    // Функция для создания чипса фильтра
    function createFilterChip(filterName) {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        
        // Текст фильтра
        const chipText = document.createElement('span');
        chipText.textContent = filterName;
        chipText.style.marginRight = '6px';
        
        // Кнопка удаления
        const removeBtn = document.createElement('span');
        removeBtn.innerHTML = '✕';
        removeBtn.className = 'remove-filter-chip';
        
        // Обработчик удаления
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFilter(filterName);
        });
        
        chip.appendChild(chipText);
        chip.appendChild(removeBtn);
        
        return chip;
    }
    
    // Функция для обновления отображения чипсов
    function updateFilterChips() {
        // Очищаем контейнер
        filterChipsContainer.innerHTML = '';
        
        // Если нет выбранных фильтров, показываем заглушку
        if (selectedFilters.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'filters-chips-placeholder';
            placeholder.textContent = 'Нет выбранных фильтров';
            filterChipsContainer.appendChild(placeholder);
        } else {
            // Добавляем чипсы
            selectedFilters.forEach(filter => {
                const chip = createFilterChip(filter);
                filterChipsContainer.appendChild(chip);
            });
        }
    }
    
    // Функция переключения фильтра
    function toggleFilter(filterName) {
        const index = selectedFilters.indexOf(filterName);
        
        if (index !== -1) {
            // Удаляем фильтр
            selectedFilters.splice(index, 1);
        } else {
            // Добавляем фильтр
            selectedFilters.push(filterName);
        }
        
        // Обновляем отображение
        updateFilterChips();
        buildFilterTree();
    }
    
    // Функция поиска фильтров
    function searchFilters(query) {
        searchResults.innerHTML = '';
        
        if (!query.trim()) {
            searchResults.style.display = 'none';
            return;
        }
        
        const queryLower = query.toLowerCase();
        const results = [];
        
        // Ищем в основных фильтрах
        Object.keys(filtersTree).forEach(mainFilter => {
            if (mainFilter.toLowerCase().includes(queryLower) && !selectedFilters.includes(mainFilter)) {
                results.push({ name: mainFilter, type: 'main' });
            }
            
            // Ищем в подфильтрах
            const subfilters = filtersTree[mainFilter];
            if (subfilters) {
                subfilters.forEach(subfilter => {
                    if (subfilter.toLowerCase().includes(queryLower) && !selectedFilters.includes(subfilter)) {
                        results.push({ name: subfilter, type: 'sub', parent: mainFilter });
                    }
                });
            }
        });
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div style="padding: 10px; color: #aaa; font-size: 12px; text-align: center;">
                    Фильтры не найдены
                </div>
            `;
            searchResults.style.display = 'block';
            return;
        }
        
        // Группируем результаты
        const groupedResults = {};
        results.forEach(result => {
            const group = result.type === 'main' ? 'Основные фильтры' : `Подфильтры (${result.parent})`;
            if (!groupedResults[group]) {
                groupedResults[group] = [];
            }
            groupedResults[group].push(result);
        });
        
        // Создаем элементы результатов
        Object.keys(groupedResults).sort().forEach(group => {
            // Заголовок группы
            const groupHeader = document.createElement('div');
            groupHeader.className = 'search-group-header';
            groupHeader.textContent = group;
            searchResults.appendChild(groupHeader);
            
            // Элементы группы
            groupedResults[group].forEach(result => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                
                // Текст с подсветкой
                const textSpan = document.createElement('span');
                const filterName = result.name;
                const lowerName = filterName.toLowerCase();
                const index = lowerName.indexOf(queryLower);
                
                if (index !== -1) {
                    const before = filterName.substring(0, index);
                    const match = filterName.substring(index, index + query.length);
                    const after = filterName.substring(index + query.length);
                    textSpan.innerHTML = `${before}<span style="color: #4CAF50; font-weight: bold;">${match}</span>${after}`;
                } else {
                    textSpan.textContent = filterName;
                }
                
                // Иконка добавления
                const addIcon = document.createElement('span');
                addIcon.innerHTML = '+';
                addIcon.className = 'search-add-icon';
                
                item.appendChild(textSpan);
                item.appendChild(addIcon);
                
                // Обработчик клика
                item.addEventListener('click', () => {
                    toggleFilter(result.name);
                    filterSearch.value = '';
                    searchResults.style.display = 'none';
                });
                
                searchResults.appendChild(item);
            });
        });
        
        searchResults.style.display = 'block';
    }
    
    // Обработчик поиска
    let searchTimeout;
    filterSearch.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchFilters(this.value);
        }, 200);
    });
    
    // Скрываем результаты поиска при клике вне
    document.addEventListener('click', function(e) {
        if (!searchResults.contains(e.target) && e.target !== filterSearch) {
            searchResults.style.display = 'none';
        }
    });
    
    // Обработчики клавиш для поиска
    filterSearch.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchResults.style.display = 'none';
            this.value = '';
        }
        if (e.key === 'Enter' && searchResults.style.display === 'block') {
            const firstResult = searchResults.querySelector('div:not([style*="background: rgba(0, 0, 0, 0.3)"])');
            if (firstResult) {
                firstResult.click();
                e.preventDefault();
            }
        }
    });
    
    // Инициализация
    buildFilterTree();
    updateFilterChips();
    
    // Обработчики кнопок
    dialog.querySelector('#cancel-marker').onclick = function() {
        document.body.removeChild(modal);
    };
    
    dialog.querySelector('#save-marker').onclick = function() {
        const name = nameInput.value.trim();
        const comment = dialog.querySelector('#marker-comment').value.trim();
        
        if (!name) {
            alert('Пожалуйста, введите название метки');
            nameInput.focus();
            return;
        }
        
        // Формируем массив фильтров
        let filtersArray = ['Мои метки']; // Всегда добавляем "Мои метки" первым
        
        // Добавляем выбранные фильтры
        if (selectedFilters.length > 0) {
            filtersArray = [...filtersArray, ...selectedFilters];
        }
        
        // Определяем подфильтры
        const subfiltersArray = selectedFilters.filter(filter => {
            for (const parent in subfilters) {
                if (subfilters[parent].includes(filter)) {
                    return true;
                }
            }
            return false;
        });
        
        // Определяем основные фильтры (включая "Мои метки")
        const mainFiltersArray = ['Мои метки']; // Всегда добавляем "Мои метки"
        
        selectedFilters.forEach(filter => {
            // Если это не подфильтр, то это основной фильтр
            let isSubfilter = false;
            for (const parent in subfilters) {
                if (subfilters[parent].includes(filter)) {
                    isSubfilter = true;
                    break;
                }
            }
            
            if (!isSubfilter) {
                mainFiltersArray.push(filter);
            }
        });
        
        // Создаем данные маркера с указанием текущего слоя
        const markerData = {
            Название: name,
            ОсновныеФильтры: mainFiltersArray,
            Подфильтры: subfiltersArray,
            ВсеФильтрыВПорядке: filtersArray,
            X: Math.round(latlng.lng),
            Y: Math.round(latlng.lat),
            Комментарий: comment || '',
            Карта: currentLayer // Явно указываем текущий слой
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
        
        // Получаем ВСЕ маркеры текущего слоя (обычные + пользовательские)
        const allCurrentMarkers = getAllMarkersForCurrentLayer();
        
        // Устанавливаем курсор для всех маркеров текущего слоя
        allCurrentMarkers.forEach(marker => {
            const element = marker.getElement();
            if (element) {
                element.style.cursor = 'pointer';
            }
        });
    } else {
        // Возвращаем обычный курсор
        mapContainer.style.cursor = '';
        
        // Возвращаем обычные курсоры для маркеров текущего слоя
        const allCurrentMarkers = getAllMarkersForCurrentLayer();
        allCurrentMarkers.forEach(marker => {
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
    // Получаем пользовательские метки текущего слоя
    const currentUserMarkers = userMarkersByLayer[currentLayer] || [];
    
    if (currentUserMarkers.length === 0) {
        alert('Нет пользовательских меток для экспорта');
        return;
    }
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'create-marker-dialog-overlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'export-dialog';
    
    dialog.innerHTML = `
       <h3 class="export-dialog-title">Экспорт пользовательских меток</h3>
        <div class="export-info">
            Текущий слой: <strong style="color: white;">${getCurrentLayerName()}</strong><br>
            Всего меток для экспорта: <strong style="color: white;">${currentUserMarkers.length}</strong>
        </div>
        <div style="margin-bottom: 20px; font-size: 12px; color: #aaa; text-align: center;">
            Выберите действие для экспорта ваших меток
        </div>
        
        <div class="export-actions">
            <!-- Зеленая кнопка - Экспортировать JSON -->
            <button id="export-only-btn" class="export-button export-json-button">
                <span style="font-size: 16px;">📁</span>
                Экспортировать JSON
            </button>
            
            <div class="export-note">
                Экспортирует метки текущего слоя в JSON файл без удаления
            </div>
            
            <!-- Желтая кнопка - Экспортировать и удалить -->
            <button id="export-delete-btn" class="export-button export-delete-button">
                <span style="font-size: 16px;">⚠️</span>
                Экспортировать и удалить метки
            </button>
            
            <div class="warning-note">
                Экспортирует метки текущего слоя в JSON и затем удаляет их с карты
            </div>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="cancel-export" class="export-cancel-button">Отмена</button>
        </div>
    `;
    
    modal.appendChild(dialog);
    document.body.appendChild(modal);
    
    // Эффекты при наведении для кнопок
    const exportOnlyBtn = dialog.querySelector('#export-only-btn');
    const exportDeleteBtn = dialog.querySelector('#export-delete-btn');
    const cancelBtn = dialog.querySelector('#cancel-export');
    
    // Функция для экспорта JSON (обновленная для работы с currentUserMarkers)
    const performJSONExport = (shouldDelete = false, formatted = false) => {
        // Обрабатываем каждую метку текущего слоя
        const markersData = currentUserMarkers.map(marker => {
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
                Карта: data.Карта || currentLayer
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
        
        // Генерируем имя файла с датой и именем слоя
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const timeStr = date.getHours().toString().padStart(2, '0') + 
                       date.getMinutes().toString().padStart(2, '0');
        const layerName = getCurrentLayerName().replace(/\s+/g, '_');
        link.setAttribute('download', `мои_метки_${layerName}_${dateStr}_${timeStr}.json`);
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Освобождаем память
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        // Если нужно удалить метки после экспорта
        if (shouldDelete) {
            // Запоминаем количество меток для сообщения
            const markersCount = currentUserMarkers.length;
            
            // Подтверждение для удаления
            if (confirm(`Вы уверены, что хотите удалить ${markersCount} меток текущего слоя после экспорта? Это действие нельзя отменить.`)) {
                // Удаляем все пользовательские метки текущего слоя
                // Создаем копию массива, так как оригинальный будет изменяться
                const markersToDelete = [...currentUserMarkers];
                
                markersToDelete.forEach(marker => {
                    deleteUserMarker(marker.customId);
                });
                
                // Обновляем видимость
                updateAllMarkersVisibility();
                
                // Сохраняем изменения
                saveUserMarkers();
                
                console.log(`Экспортировано и удалено ${markersCount} меток слоя ${currentLayer}`);
                setTimeout(() => {
                    alert(`Экспортировано и удалено ${markersCount} меток слоя ${getCurrentLayerName()}`);
                }, 300);
            }
        } else {
            const formatText = formatted ? ' (форматированный)' : '';
            const layerName = getCurrentLayerName();
            console.log(`Экспортировано ${currentUserMarkers.length} меток слоя ${currentLayer} в JSON${formatText}`);
            setTimeout(() => {
                alert(`Экспортировано ${currentUserMarkers.length} меток слоя "${layerName}" в файл JSON${formatText}`);
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

/**
 * Получить отображаемое имя текущего слоя
 */
function getCurrentLayerName() {
    const layerConfig = layersConfig.find(l => l.id === currentLayer);
    return layerConfig ? layerConfig.name : currentLayer;
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
 * Создание элемента для отображения координат
 */
function createCoordsDisplay() {
    const coordsDisplay = document.createElement('div');
    coordsDisplay.id = 'coordsDisplay';
    coordsDisplay.className = 'coords-display hidden';
    coordsDisplay.textContent = 'Координаты: отключены';    
    document.body.appendChild(coordsDisplay);
    return coordsDisplay;
}

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
        subfilterLabel.className += ' subfilter-label-text';
        
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

/**
 * Создание элемента для отображения координат
 */
function createCoordsDisplay() {
    const coordsDisplay = document.createElement('div');
    coordsDisplay.id = 'coordsDisplay';
    coordsDisplay.className = 'coords-display hidden';
    coordsDisplay.textContent = 'Координаты: отключены';
    
    document.body.appendChild(coordsDisplay);
    return coordsDisplay;
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
        
        // 1. Переключатель координат
        const coordsGroup = L.DomUtil.create('div', 'tool-group', toolsPanel);
        const coordsRow = L.DomUtil.create('div', 'tool-row', coordsGroup);
        const coordsClickableArea = L.DomUtil.create('div', 'tool-clickable-area', coordsRow);
        const coordsLabel = L.DomUtil.create('span', 'tool-label', coordsClickableArea);
        coordsLabel.textContent = "Координаты";
        const coordsCheckbox = L.DomUtil.create('div', 'tool-checkbox', coordsRow);
        coordsCheckbox.title = "Показать/скрыть координаты курсора";
        const coordsCheckmark = L.DomUtil.create('div', 'tool-checkmark', coordsCheckbox);
        
        // 2. Переключатель "Скрыть отмеченные"
        const hideCompletedGroup = L.DomUtil.create('div', 'tool-group', toolsPanel);   
        const hideCompletedRow = L.DomUtil.create('div', 'tool-row', hideCompletedGroup);
        const hideClickableArea = L.DomUtil.create('div', 'tool-clickable-area', hideCompletedRow);
        const hideLabel = L.DomUtil.create('span', 'tool-label', hideClickableArea);
        hideLabel.textContent = "Скрыть отмеченные";
        const hideCheckbox = L.DomUtil.create('div', 'tool-checkbox', hideCompletedRow);
        hideCheckbox.title = "Скрывать отмеченные метки";
        const hideCheckmark = L.DomUtil.create('div', 'tool-checkmark', hideCheckbox);

        // 3. Переключатель "Создать/удалить метки"
        const createMarkersGroup = L.DomUtil.create('div', 'tool-group', toolsPanel);    
        const createMarkersRow = L.DomUtil.create('div', 'tool-row', createMarkersGroup);
        const createClickableArea = L.DomUtil.create('div', 'tool-clickable-area', createMarkersRow);
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
        
        const clearAllButton = L.DomUtil.create('div', 'tool-button clear-all', clearAllMarksGroup);
        clearAllButton.textContent = "Снять все отметки";
        clearAllButton.title = "Сбросить все отмеченные метки";
        
        clearAllButton.addEventListener('click', function() {
            clearAllMarkedMarkers();
            L.DomEvent.stopPropagation(this);
        });

        // 5. Кнопка "Экспортировать мои метки"
        const exportGroup = L.DomUtil.create('div', 'tool-group', toolsPanel);
        const exportButton = L.DomUtil.create('div', 'tool-button', exportGroup);
        exportButton.textContent = "Экспортировать метки";
        exportButton.title = "Экспортировать все мои метки в JSON файл";

        exportButton.addEventListener('click', function() {
            exportUserMarkersToJSON();
            L.DomEvent.stopPropagation(this);
        });
        
        // === ЛОГИКА ПЕРЕКЛЮЧАТЕЛЕЙ ===
        
        const coordsDisplay = document.getElementById('coordsDisplay');
        
        const updateCoordinates = (e) => {
            if (!coordsEnabled) return;
            
            const coordsDisplay = document.getElementById('coordsDisplay');
            if (!coordsDisplay) return;
            
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
            } else {
                hideCheckmark.classList.remove('active');
                hideCheckbox.classList.remove('active');
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
            const clickableArea = L.DomUtil.create('div', 'filter-clickable-area', filterRow);
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
            const clickableArea = L.DomUtil.create('div', 'special-mark-clickable-area', markRow);
            
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
    
    // Создаем элемент для координат
    createCoordsDisplay();

    // Инициализируем структуры данных для слоёв
    initLayerDataStructures();
    
    // Загружаем выбранный слой
    loadCurrentLayer();
    
    // Инициализация карты
    initMap();
    
    // Инициализация слоёв
    initLayers();
    
    // Добавление контролов на карту
    const mapSwitchControl = new MapSwitchControl();
    mapSwitchControl.addTo(map);
    
    const toolsControl = new ToolsControl();
    toolsControl.addTo(map);
    
    const filtersToggleControl = new FiltersToggleControl();
    filtersToggleControl.addTo(map);
    
    const specialMarksControl = new SpecialMarksControl();
    specialMarksControl.addTo(map);
    
    // Загрузка меток
    setTimeout(() => {
        loadMarkersFromJSON();
        loadMarkedMarkers();
        // Загружаем пользовательские метки
        setTimeout(() => {
            loadUserMarkers();
            cleanupGhostMarkedMarkers();
            
            // Заполняем markersByFilter для текущего слоя
            populateMarkersByFilter();
            
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
            
            // Находим маркер
            const markerInfo = findMarkerById(markerId);
            if (!markerInfo) {
                console.error(`Маркер с ID ${markerId} не найден`);
                return;
            }
            
            const { marker, layer } = markerInfo;
            
            // Проверяем, принадлежит ли маркер текущему слою
            if (layer !== currentLayer) {
                console.warn(`Маркер ${markerId} принадлежит слою ${layer}, игнорируем клик`);
                return;
            }
            
            const isCurrentlyMarked = markedMarkers[markerId] || false;
            const newState = !isCurrentlyMarked;
            
            // Обновляем состояние
            markedMarkers[markerId] = newState;
            
            // Обновляем состояние в слое
            if (!markedMarkersByLayer[layer]) {
                markedMarkersByLayer[layer] = {};
            }
            markedMarkersByLayer[layer][markerId] = newState;
            
            // Обновляем внешний вид маркера
            updateMarkerAppearance(marker, newState);
            
            // Обновляем чекбокс
            const checkboxElement = tooltip.querySelector('.tooltip-mark-checkbox');
            if (checkboxElement) {
                if (newState) {
                    checkboxElement.classList.add('checked');
                    checkboxElement.innerHTML = '<div class="marker-tooltip-checkmark">✓</div>';
                } else {
                    checkboxElement.classList.remove('checked');
                    checkboxElement.innerHTML = '';
                }
            }
            
            // Сохраняем состояние
            saveMarkedMarkers();
            saveUserMarkers();
            
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