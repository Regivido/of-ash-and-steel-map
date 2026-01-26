// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ
// ============================================

// Константы для карты
const IMAGE_BOUNDS = [[0, 0], [800, 800]];
const IMAGE_URL = 'assets/worldmap.png';

// Глобальные переменные
let map;
let allMarkers = [];
let markersByFilter = {
    'Алтари': [], 'Бижутерия': [], 'Жуки': [], 'Записки': [], 
    'Квестовые предметы': [], 'Ключи': [], 'Книги': [], 'Книги Древних': [],
    'Костры': [], 'Места для отдыха': [], 'Места для рыбалки': [], 'НПС': [],
    'Обелиски': [], 'Опасные противники': [], 'Пещеры': [], 'Предметы': [],
    'Ремесло': [], 'Рецепты': [], 'Рудные жилы': [], 'Сундуки': [],
    'Телепорты': [], 'Точки исследования': [], 'Травы': [], 'Характеристики': [],
    'Хряк контрабандистов': [], 'Мои метки': []
};

// Состояния
let filterStates = {};
let subfilters = {
    'Бижутерия': ['Правые кольца', 'Левые кольца', 'Амулеты'],
    'Характеристики': ['Сила', 'Ловкость', 'Выносливость', 'Проницательность', 'Крепкость', 'Свободные очки', 'Навыки']
};
let subfilterStates = {};

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
    { name: 'Квестовые предметы', color: '#4CAF50', icon: 'assets/unknown.png', hasSubfilters: false },
    { name: 'Ключи', color: '#4CAF50', icon: 'assets/key.png', hasSubfilters: false },
    { name: 'Книги', color: '#4CAF50', icon: 'assets/book.png', hasSubfilters: false },
    { name: 'Книги Древних', color: '#4CAF50', icon: 'assets/ancient_book.png', hasSubfilters: false },
    { name: 'Костры', color: '#4CAF50', icon: 'assets/fire.png', hasSubfilters: false },
    { name: 'Места для отдыха', color: '#4CAF50', icon: 'assets/rest.png', hasSubfilters: false },
    { name: 'Места для рыбалки', color: '#4CAF50', icon: 'assets/fishing.png', hasSubfilters: false },
    { name: 'НПС', color: '#4CAF50', icon: 'assets/npc.png', hasSubfilters: false },
    { name: 'Обелиски', color: '#4CAF50', icon: 'assets/obelisk.png', hasSubfilters: false },
    { name: 'Опасные противники', color: '#4CAF50', icon: 'assets/monster.png', hasSubfilters: false },
    { name: 'Пещеры', color: '#4CAF50', icon: 'assets/cave.png', hasSubfilters: false },
    { name: 'Предметы', color: '#4CAF50', icon: 'assets/item.png', hasSubfilters: false },
    { name: 'Ремесло', color: '#4CAF50', icon: 'assets/craft.png', hasSubfilters: false },
    { name: 'Рецепты', color: '#4CAF50', icon: 'assets/recipe.png', hasSubfilters: false },
    { name: 'Рудные жилы', color: '#4CAF50', icon: 'assets/ore.png', hasSubfilters: false },
    { name: 'Сундуки', color: '#4CAF50', icon: 'assets/chest.png', hasSubfilters: false },
    { name: 'Телепорты', color: '#4CAF50', icon: 'assets/teleport.png', hasSubfilters: false },
    { name: 'Точки исследования', color: '#4CAF50', icon: 'assets/complite.png', hasSubfilters: false },
    { name: 'Травы', color: '#4CAF50', icon: 'assets/herb.png', hasSubfilters: false },
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
    map.setView([400, 400], 1);
    
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

/**
 * Инициализация иконок маркеров
 */
function initMarkerIcons() {
    const iconConfigs = {
        'Алтари': 'assets/altar.png',
        'Бижутерия': 'assets/jewelry.png',
        'Жуки': 'assets/beetle.png',
        'Записки': 'assets/note.png',
        'Квестовые предметы': 'assets/unknown.png',
        'Ключи': 'assets/key.png',
        'Книги': 'assets/book.png',
        'Книги Древних': 'assets/ancient_book.png',
        'Костры': 'assets/fire.png',
        'Места для отдыха': 'assets/rest.png',
        'Места для рыбалки': 'assets/fishing.png',
        'НПС': 'assets/npc.png',
        'Обелиски': 'assets/obelisk.png',
        'Опасные противники': 'assets/monster.png',
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
        const isTooltip = target.closest('.leaflet-tooltip');
        const isTooltipContent = target.closest('.clicked-tooltip');
        const isFiltersPanel = target.closest('.filters-container');
        const isSpecialMarksPanel = target.closest('.special-marks-container');
        
        if (!isMarker && !isTooltip && !isTooltipContent && !isFiltersPanel && !isSpecialMarksPanel) {
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
    window.addEventListener('beforeunload', saveMapState);
    
    // Периодическое сохранение
    setInterval(saveMapState, 30000);
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
        console.log('Состояние карты сохранено:', mapState);
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

// ============================================
// ИНИЦИАЛИЗАЦИЯ СОСТОЯНИЙ
// ============================================

/**
 * Инициализация всех состояний приложения
 */
function initAllStates() {
    // Сначала загружаем сохраненные состояния
    loadFilterStates();
    
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
    
    // Инициализация состояний особых меток
    loadSpecialMarksStates(); // Сначала загружаем сохраненные
    
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
 * Загрузка меток из CSV файла
 */
async function loadMarkersFromCSV() {
    try {
        const response = await fetch('tags.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const markersData = parseCSV(csvText);
        
        markersData.forEach(data => {
            if (data.Название && !isNaN(data.X) && !isNaN(data.Y)) {
                createMarker(data);
            }
        });
        
        console.log(`Загружено ${allMarkers.length} меток из CSV`);
        initializeMarkersVisibility();
        
    } catch (error) {
        console.error('Ошибка загрузки CSV:', error);
        console.log('Создаю тестовые метки...');
        createTestMarkers();
        initializeMarkersVisibility();
    }
}

/**
 * Парсинг CSV данных
 */
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const markers = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line === ',,,,' || line.startsWith('#') || i === 0) continue;
        
        const match = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
        if (!match || match.length < 4) continue;
        
        const name = match[0].replace(/"/g, '').trim();
        const subfiltersStr = match[1].replace(/"/g, '').trim();
        const x = parseFloat(match[2]);
        const y = parseFloat(match[3]);
        const comment = match[4] ? match[4].replace(/"/g, '').trim() : '';
        
        if (name && !isNaN(x) && !isNaN(y)) {
            const markerFilters = subfiltersStr.split(';').map(f => f.trim()).filter(f => f);
            const mainFilters = [];
            const subfiltersList = [];
            
            markerFilters.forEach(filterName => {
                let isSubfilter = false;
                
                for (const [parentFilter, subfilterList] of Object.entries(subfilters)) {
                    if (subfilterList.includes(filterName)) {
                        if (!mainFilters.includes(parentFilter)) {
                            mainFilters.push(parentFilter);
                        }
                        subfiltersList.push(filterName);
                        isSubfilter = true;
                        break;
                    }
                }
                
                if (!isSubfilter && !mainFilters.includes(filterName)) {
                    mainFilters.push(filterName);
                }
            });
            
            markers.push({
                Название: name,
                ОсновныеФильтры: mainFilters,
                Подфильтры: subfiltersList,
                ВсеФильтрыВПорядке: markerFilters,
                X: x,
                Y: y,
                Комментарий: comment
            });
        }
    }
    
    return markers;
}

/**
 * Создание маркера на карте
 */
function createMarker(data) {
    let iconToUse = markerIcons['default'];
    
    if (data.ВсеФильтрыВПорядке && data.ВсеФильтрыВПорядке.length > 0) {
        const firstFilter = data.ВсеФильтрыВПорядке[0];
        
        if (markerIcons[firstFilter]) {
            iconToUse = markerIcons[firstFilter];
        } else {
            for (const [parentFilter, subfilterList] of Object.entries(subfilters)) {
                if (subfilterList.includes(firstFilter) && markerIcons[parentFilter]) {
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
    
    // Переменная для tooltip
    let tooltip = null;
    
    // Обработчики событий маркера
    setupMarkerEventHandlers(marker, data, tooltip);
    
    // Сохраняем данные в маркере
    marker.markerData = data;
    marker.mainFilters = data.ОсновныеФильтры || [];
    marker.subfilters = data.Подфильтры || [];
    
    // Добавляем в глобальные массивы
    allMarkers.push(marker);
    
    // Распределяем по фильтрам
    data.ОсновныеФильтры.forEach(filter => {
        if (!markersByFilter[filter]) {
            markersByFilter[filter] = [];
        }
        markersByFilter[filter].push(marker);
    });
    
    data.Подфильтры.forEach(subfilter => {
        if (!markersByFilter[subfilter]) {
            markersByFilter[subfilter] = [];
        }
        markersByFilter[subfilter].push(marker);
    });
    
    return marker;
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
        
        // Создаем tooltip если еще не создан
        if (!tooltip) {
            const commentText = data.Комментарий ? `<p>${data.Комментарий}</p>` : '';
            const tooltipContent = `
                <div style="max-width: 250px; padding: 10px;">
                    <h4 style="margin: 0; color: white; font-size: 15px;">
                        ${data.Название}
                    </h4>
                    ${commentText ? `
                        <div style="
                            border-top: 1px solid rgba(255, 255, 255, 0.8);
                            font-size: 13px;
                            color: white;
                            line-height: 1.4;
                        ">
                            ${commentText}
                        </div>
                    ` : ''}
                </div>
            `;
            
            tooltip = L.tooltip({
                permanent: true,
                direction: 'auto',
                opacity: 0.95,
                className: 'clicked-tooltip',
                interactive: true
            }).setContent(tooltipContent);
            
            // Обработчик клика для тултипа
            tooltip.on('click', function(e) {
                e.originalEvent.stopPropagation();
                e.originalEvent.stopImmediatePropagation();
                e.stopPropagation();
                return false;
            });

            marker.bindTooltip(tooltip);
        }
        
        // Открываем tooltip
        this.openTooltip();
        this.closePopup();
        
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
 * Создание тестовых меток
 */
function createTestMarkers() {
    const testData = [
        { Название: 'Холмистая долина', Фильтры: ['Точки исследования'], Подфильтры: ['Точки исследования'], X: 228, Y: 410, Комментарий: 'На носу корабля' },
        { Название: 'Зарытый сундук', Фильтры: ['Сундуки', 'Характеристики'], Подфильтры: ['Сундуки', 'Характеристики'], X: 184, Y: 621, Комментарий: '' },
        { Название: 'Золотое кольцо', Фильтры: ['Бижутерия'], Подфильтры: ['Правое кольцо'], X: 300, Y: 300, Комментарий: '' }
    ];
    
    testData.forEach(data => {
        const processedData = {
            ...data,
            ОсновныеФильтры: data.Фильтры,
            ВсеФильтрыВПорядке: [...data.Фильтры, ...data.Подфильтры]
        };
        createMarker(processedData);
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
        if (shouldMarkerBeVisible(marker)) {
            if (!map.hasLayer(marker)) {
                marker.addTo(map);
            }
        } else {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        }
    });
}

/**
 * Проверка, должен ли маркер быть видимым
 */
function shouldMarkerBeVisible(marker) {
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
        }
    });
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
        hideCheckbox.title = "Скрыть уже отмеченные";
        
        const hideCheckmark = L.DomUtil.create('div', 'tool-checkmark', hideCheckbox);
        
        // === ЛОГИКА ПЕРЕКЛЮЧАТЕЛЕЙ ===
        
        let coordsEnabled = false;
        const coordsDisplay = document.getElementById('coordsDisplay');
        
        const updateCoordinates = (e) => {
            if (!coordsEnabled) return;
            coordsDisplay.textContent = 
                `Координаты: [${Math.round(e.latlng.lng)}, ${Math.round(e.latlng.lat)}]`;
            coordsDisplay.classList.remove('hidden');
        };
        
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
            
            L.DomEvent.stopPropagation(this);
        };
        
        let hideCompletedEnabled = false;
        
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
    
    // Загрузка сохраненных состояний
    loadFilterStates();
    loadSpecialMarksStates();

    // Инициализация карты
    initMap();
    
    // Добавление контролов на карту
    const toolsControl = new ToolsControl();
    toolsControl.addTo(map);
    
    const filtersToggleControl = new FiltersToggleControl();
    filtersToggleControl.addTo(map);
    
    const specialMarksControl = new SpecialMarksControl();
    specialMarksControl.addTo(map);
    
    // Загрузка меток
    setTimeout(() => {
        loadMarkersFromCSV();
    }, 100);
    
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
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', initializeApp);