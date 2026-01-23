// Для изображения 4096x4096 (квадрат) используем одинаковые значения
const imageBounds = [[0, 0], [800, 800]]; // [lat, lng]

    map = L.map('map', {
    crs: L.CRS.Simple, // Простейшая система координат без искажений
    maxBounds: imageBounds, // Не даёт выйти за границы
    maxZoom: 5,
    minZoom: 0,
    doubleClickZoom: false,
    });
    map.removeControl(map.zoomControl);

// ===== КОД ДЛЯ ЗАГРУЗКИ МЕТОК ИЗ CSV =====

// Глобальные переменные
let allMarkers = []; // Все маркеры
let markersByFilter = { // Маркеры по фильтрам
    'Алтари': [],
    'Бижутерия': [],
    'Жуки': [],
    'Записки': [],
    'Квестовые предметы': [],
    'Ключи': [],
    'Книги': [],
    'Книги Древних': [],
    'Костры': [],
    'Места для отдыха': [],
    'Места для рыбалки': [],
    'НПС': [],
    'Обелиски': [],
    'Опасные противники': [],
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
let filterStates = {}; // Состояние фильтров

// Функция создания иконок
function addIconToFilter(filterName, iconPath) {
    markerIcons[filterName] = L.icon({
        iconUrl: iconPath,
        iconSize: [40, 40], // размер иконки
        iconAnchor: [20, 20], // точка привязки (центр по горизонтали, низ по вертикали)
        popupAnchor: [0, -40], // расположение попапа
        tooltipAnchor: [10, -20] // расположение тултипа
    });
    
    console.log(`Иконка добавлена для фильтра: ${filterName}`);
}

// Иконка по умолчанию для всех меток
const markerIcons = {
    'default': L.icon({
        iconUrl: 'assets/Unknown.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -40],
        tooltipAnchor: [10, -20]
    }),
};

// Добавляем иконки
addIconToFilter('Алтари', 'assets/altar.png');
addIconToFilter('Бижутерия', 'assets/jewelry.png');
addIconToFilter('Жуки', 'assets/beetle.png');
addIconToFilter('Записки', 'assets/note.png');
addIconToFilter('Квестовые предметы', 'assets/unknown.png');
addIconToFilter('Ключи', 'assets/key.png');
addIconToFilter('Книги', 'assets/book.png');
addIconToFilter('Книги Древних', 'assets/ancient_book.png');
addIconToFilter('Костры', 'assets/fire.png');
addIconToFilter('Места для отдыха', 'assets/rest.png');
addIconToFilter('Места для рыбалки', 'assets/fishing.png');
addIconToFilter('НПС', 'assets/npc.png');
addIconToFilter('Обелиски', 'assets/obelisk.png');
addIconToFilter('Опасные противники', 'assets/monster.png');
addIconToFilter('Пещеры', 'assets/cave.png');
addIconToFilter('Предметы', 'assets/item.png');
addIconToFilter('Ремесло', 'assets/craft.png');
addIconToFilter('Рецепты', 'assets/recipe.png');
addIconToFilter('Рудные жилы', 'assets/ore.png');
addIconToFilter('Сундуки', 'assets/chest.png');
addIconToFilter('Телепорты', 'assets/teleport.png');
addIconToFilter('Точки исследования', 'assets/complite.png');
addIconToFilter('Травы', 'assets/herb.png');
addIconToFilter('Характеристики', 'assets/stats.png');
addIconToFilter('Хряк контрабандистов', 'assets/pig.png');
addIconToFilter('Мои метки', 'assets/marker.png');

// Инициализация видимости меток при загрузке
function initializeMarkersVisibility() {
    // Сначала скрываем все маркеры
    allMarkers.forEach(marker => {
        if (map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    });
    
    // Затем показываем только те, у которых есть включенные фильтры
    updateAllMarkersVisibility();
}

// Функция загрузки CSV
async function loadMarkersFromCSV() {
    try {
        const response = await fetch('tags.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        
        // Парсим CSV
        const markersData = parseCSV(csvText);
        
        // Создаем маркеры на карте
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
        // Если файл не найден, создаем тестовые метки
        createTestMarkers();
        initializeMarkersVisibility();
    }
}

// Парсер CSV
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const markers = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line === ',,,,' || line.startsWith('#') || i === 0) continue;
        
        // Парсим строку CSV (учтены запятые в кавычках)
        const match = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
        if (!match || match.length < 4) continue;
        
        const name = match[0].replace(/"/g, '').trim();
        const filtersStr = match[1].replace(/"/g, '').trim();
        const x = parseFloat(match[2]);
        const y = parseFloat(match[3]);
        const comment = match[4] ? match[4].replace(/"/g, '').trim() : '';
        
        if (name && !isNaN(x) && !isNaN(y)) {
            // Разбиваем фильтры (разделитель ";")
            const filters = filtersStr.split(';').map(f => f.trim()).filter(f => f);
            
            markers.push({
                Название: name,
                Фильтры: filters,
                X: x,
                Y: y,
                Комментарий: comment
            });
        }
    }
    
    return markers;
}

// Функция для закрытия всех активных тултипов
function closeAllTooltips() {
    allMarkers.forEach(marker => {
        if (marker.isTooltipActive) {
            marker.closeTooltip();
            // Флаг сбросится в обработчике tooltipclose
        }
    });
}

// Создание маркера на карте
function createMarker(data) {
    let iconToUse = markerIcons['default'];
    // Проверяем, есть ли у метки фильтр с соответствующей иконкой
    for (const filter of data.Фильтры) {
        if (markerIcons[filter]) {
            iconToUse = markerIcons[filter];
            break; // Используем первую найденную иконку
        }
    }
    const marker = L.marker([data.Y, data.X], {
        icon: iconToUse,
        riseOnHover: true,
        bubblingMouseEvents: false
    }).addTo(map);
    
    const commentText = data.Комментарий 
        ? `<p>${data.Комментарий}</p>`
        : '';
    
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
    
    // Переменная для tooltip (создадим при первом клике)
    let tooltip = null;
    
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
    
    // Сохраняем данные в маркере
    marker.markerData = data;
    marker.filters = data.Фильтры;
    
    // Добавляем в глобальные массивы
    allMarkers.push(marker);
    
    // Распределяем по фильтрам
    data.Фильтры.forEach(filter => {
        if (!markersByFilter[filter]) {
            markersByFilter[filter] = [];
        }
        markersByFilter[filter].push(marker);
    });
    
    return marker;
}

// Тестовые метки (если CSV не загрузится)
function createTestMarkers() {
    const testData = [
        { Название: 'Забытый Край', Фильтры: ['Точки исследования'], X: 182, Y: 552, Комментарий: '' },
        { Название: 'Холмистая долина', Фильтры: ['Точки исследования'], X: 228, Y: 410, Комментарий: 'На носу корабля' },
        { Название: 'Зарытый сундук', Фильтры: ['Сундуки', 'Характеристики'], X: 184, Y: 621, Комментарий: '' }
    ];
    
    testData.forEach(data => createMarker(data));
}

// ===== ОБНОВЛЕНИЕ ФИЛЬТРОВ ДЛЯ РАБОТЫ С CSV =====

// Обновляем функцию setupFilterToggle в FiltersToggleControl
function setupFilterToggle(checkbox, checkmark, filterName) {
    filterStates[filterName] = true;
    
    checkbox.onclick = function() {
        filterStates[filterName] = !filterStates[filterName];
        
        if (filterStates[filterName]) {
            checkmark.classList.add('active');
            checkbox.classList.add('active');
            showFilteredMarkers(filterName);
        } else {
            checkmark.classList.remove('active');
            checkbox.classList.remove('active');
            hideFilteredMarkers(filterName);
        }
        
        // Обновляем состояние "Все фильтры"
        updateAllFiltersCheckbox();
        
        L.DomEvent.stopPropagation(checkbox);
    };
}

// Функция для обновления состояния чекбокса "Все фильтры"
function updateAllFiltersCheckbox() {
    const allFiltersCheckbox = document.querySelector('.filter-checkbox[title*="Все фильтры"]');
    const allFiltersCheckmark = document.querySelector('.filter-checkbox[title*="Все фильтры"] .filter-checkmark');
    
    if (!allFiltersCheckbox || !allFiltersCheckmark) return;
    
    // Проверяем, все ли обычные фильтры включены
    const allEnabled = Object.keys(filterStates).every(
        filterName => filterStates[filterName]
    );
    
    if (allEnabled) {
        allFiltersCheckmark.classList.add('active');
        allFiltersCheckbox.classList.add('active');
    } else {
        allFiltersCheckmark.classList.remove('active');
        allFiltersCheckbox.classList.remove('active');
    }
}

// Показать метки с определенным фильтром
// Функция для проверки, включен ли фильтр
function isFilterEnabled(filterName) {
    return filterStates[filterName] === true;
}


// Функция для обновления видимости всех маркеров
function updateAllMarkersVisibility() {
    allMarkers.forEach(marker => {
        if (!marker.filters || marker.filters.length === 0) {
            // Если у маркера нет фильтров, всегда показываем
            if (!map.hasLayer(marker)) {
                marker.addTo(map);
            }
            return;
        }
        
        // Проверяем, есть ли хоть один включенный фильтр у маркера
        const hasEnabledFilter = marker.filters.some(filter => isFilterEnabled(filter));
        
        if (hasEnabledFilter) {
            // Если есть хотя бы один включенный фильтр - показываем
            if (!map.hasLayer(marker)) {
                marker.addTo(map);
            }
        } else {
            // Если нет включенных фильтров - скрываем
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        }
    });
}

// Упрощенные функции для фильтров
function showFilteredMarkers(filterName) {
    console.log(`Показаны метки с фильтром: ${filterName}`);
    
    // Закрываем все тултипы при изменении фильтров
    closeAllTooltips();
    
    updateAllMarkersVisibility();
    setTimeout(updateAllFiltersCheckbox, 10);
}

function hideFilteredMarkers(filterName) {
    console.log(`Скрыты метки с фильтром: ${filterName}`);
    
    // Закрываем все тултипы при изменении фильтров
    closeAllTooltips();
    
    updateAllMarkersVisibility();
    setTimeout(updateAllFiltersCheckbox, 10);
}

// ===== ЗАГРУЗКА CSV ПРИ ЗАПУСКЕ =====

// Добавьте вызов этой функции в конце script.js, перед закрывающими тегами
loadMarkersFromCSV();

    // Расположение кнопок зума
L.control.zoom({
    position: 'topright'
}).addTo(map);

const imageUrl = 'assets/worldmap.png'; // Путь к изображению карты

L.imageOverlay(imageUrl, imageBounds).addTo(map);

       map.setView([800, 100], 1);

// ===== КОД ДЛЯ ПЕРЕКЛЮЧАТЕЛЯ КООРДИНАТ =====

// Создаем кастомный контрол для переключателя
const CoordsToggleControl = L.Control.extend({
    options: {
        position: 'topright'
    },
    
    onAdd: function(map) {
    // Создаем вертикальный контейнер вместо панели
    const togglesContainer = L.DomUtil.create('div', 'toggles-container');
    
    // === ПЕРВЫЙ ПЕРЕКЛЮЧАТЕЛЬ: Координаты (верхний) ===
    const coordsGroup = L.DomUtil.create('div', 'toggle-group', togglesContainer);
    
    // Подпись для координат
    const coordsLabel = L.DomUtil.create('span', 'coords-label', coordsGroup);
    coordsLabel.textContent = "Координаты:";
    
    // Контейнер для переключателя координат
    const coordsContainer = L.DomUtil.create('div', 'coords-toggle-control', coordsGroup);
    coordsContainer.title = "Показать/скрыть координаты курсора";
    
    // Галочка для координат
    const coordsCheckmark = L.DomUtil.create('div', 'checkmark', coordsContainer);
    
    // === ВТОРОЙ ПЕРЕКЛЮЧАТЕЛЬ: Скрыть пройденные (нижний) ===
    const hiddenGroup = L.DomUtil.create('div', 'toggle-group', togglesContainer);
    
    // Подпись для второго переключателя
    const hiddenLabel = L.DomUtil.create('span', 'hidden-label', hiddenGroup);
    hiddenLabel.textContent = "Скрыть отмеченные:";
    
    // Контейнер для второго переключателя
    const hiddenContainer = L.DomUtil.create('div', 'hidden-toggle-control', hiddenGroup);
    hiddenContainer.title = "Скрыть уже отмеченные";
    
    // Галочка для второго переключателя
    const hiddenCheckmark = L.DomUtil.create('div', 'hidden-checkmark', hiddenContainer);
    
    // === ЛОГИКА ПЕРВОГО ПЕРЕКЛЮЧАТЕЛЯ (координаты) ===
    let coordsEnabled = false;
    const coordsDisplay = document.getElementById('coordsDisplay');
    
    const updateCoordinates = (e) => {
        if (!coordsEnabled) return;
        coordsDisplay.textContent = 
            `Координаты: [${Math.round(e.latlng.lng)}, ${Math.round(e.latlng.lat)}]`;
        coordsDisplay.classList.remove('hidden');
    };
    
    // Обработчик клика для координат
    coordsContainer.onclick = function() {
        coordsEnabled = !coordsEnabled;
        
        if (coordsEnabled) {
            coordsCheckmark.classList.add('active');
            coordsContainer.classList.add('active');
            coordsDisplay.classList.remove('hidden');
            coordsDisplay.textContent = "Координаты: включены";
            map.on('mousemove', updateCoordinates);
        } else {
            coordsCheckmark.classList.remove('active');
            coordsContainer.classList.remove('active');
            coordsDisplay.textContent = "Координаты: отключены";
            setTimeout(() => {
                coordsDisplay.classList.add('hidden');
            }, 1000);
            map.off('mousemove', updateCoordinates);
        }
        
        L.DomEvent.stopPropagation(coordsContainer);
    };
    
    // === ЛОГИКА ВТОРОГО ПЕРЕКЛЮЧАТЕЛЯ (скрыть пройденные) ===
    let hideCompletedEnabled = false;
    
    // Обработчик клика для второго переключателя
    hiddenContainer.onclick = function() {
        hideCompletedEnabled = !hideCompletedEnabled;
        
        if (hideCompletedEnabled) {
            hiddenCheckmark.classList.add('active');
            hiddenContainer.classList.add('active');
            console.log("Режим 'Скрыть отмеченные' включен");
        } else {
            hiddenCheckmark.classList.remove('active');
            hiddenContainer.classList.remove('active');
            console.log("Режим 'Скрыть отмеченные' выключен");
        }
        
        L.DomEvent.stopPropagation(hiddenContainer);
    };
    
    // Инициализация отслеживания координат
    map.on('mousemove', updateCoordinates);
    
    return togglesContainer;
}
});

// ===== КОД ДЛЯ ФИЛЬТРОВ МЕТОК =====

// Создаем кастомный контрол для фильтров
const FiltersToggleControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    
    onAdd: function(map) {
        // Создаем вертикальный контейнер для фильтров
        const filtersContainer = L.DomUtil.create('div', 'filters-container');
        
        // Добавляем фиксированный заголовок с иконкой
        const title = L.DomUtil.create('div', 'filters-title', filtersContainer);
        
        // Текст заголовка
        const titleText = L.DomUtil.create('span', 'filters-title-text', title);
        titleText.textContent = "Фильтры меток";
        
        // Иконка стрелки
        const arrowIcon = L.DomUtil.create('span', 'filters-arrow', title);
        arrowIcon.innerHTML = 'свернуть';
        
        // Создаем контейнер для контента с прокруткой
        const filtersContent = L.DomUtil.create('div', 'filters-content', filtersContainer);
        
        // Создаем панель для фильтров
        const filtersPanel = L.DomUtil.create('div', 'filters-panel', filtersContent);
        
        const filtersConfig = [
            { name: 'Все фильтры', color: '#2196F3', special: true, icon: null },
            { name: 'Алтари', color: '#4CAF50', icon: 'assets/altar.png' },
            { name: 'Бижутерия', color: '#4CAF50', icon: 'assets/jewelry.png' },
            { name: 'Жуки', color: '#4CAF50', icon: 'assets/beetle.png' },
            { name: 'Записки', color: '#4CAF50', icon: 'assets/note.png' },
            { name: 'Квестовые предметы', color: '#4CAF50', icon: 'assets/unknown.png' },
            { name: 'Ключи', color: '#4CAF50', icon: 'assets/key.png' },
            { name: 'Книги', color: '#4CAF50', icon: 'assets/book.png' },
            { name: 'Книги Древних', color: '#4CAF50', icon: 'assets/ancient_book.png' },
            { name: 'Костры', color: '#4CAF50', icon: 'assets/fire.png' },
            { name: 'Места для отдыха', color: '#4CAF50', icon: 'assets/rest.png' },
            { name: 'Места для рыбалки', color: '#4CAF50', icon: 'assets/fishing.png' },
            { name: 'НПС', color: '#4CAF50', icon: 'assets/npc.png' },
            { name: 'Обелиски', color: '#4CAF50', icon: 'assets/obelisk.png' },
            { name: 'Опасные противники', color: '#4CAF50', icon: 'assets/monster.png' },
            { name: 'Пещеры', color: '#4CAF50', icon: 'assets/cave.png' },
            { name: 'Предметы', color: '#4CAF50', icon: 'assets/item.png' },
            { name: 'Ремесло', color: '#4CAF50', icon: 'assets/craft.png' },
            { name: 'Рецепты', color: '#4CAF50', icon: 'assets/recipe.png' },
            { name: 'Рудные жилы', color: '#4CAF50', icon: 'assets/ore.png' },
            { name: 'Сундуки', color: '#4CAF50', icon: 'assets/chest.png' },
            { name: 'Телепорты', color: '#4CAF50', icon: 'assets/teleport.png' },
            { name: 'Точки исследования', color: '#4CAF50', icon: 'assets/complite.png' },
            { name: 'Травы', color: '#4CAF50', icon: 'assets/herb.png' },
            { name: 'Характеристики', color: '#4CAF50', icon: 'assets/stats.png' },            
            { name: 'Хряк контрабандистов', color: '#4CAF50', icon: 'assets/pig.png' },
            { name: 'Мои метки', color: '#4CAF50', icon: 'assets/marker.png' }
        ];

        // Инициализируем состояния ВСЕХ фильтров
        filtersConfig.forEach(filter => {
            filterStates[filter.name] = true; // Все фильтры по умолчанию включены
        });

        // Хранилище для элементов фильтров
        const filterElements = {};
        
        // Создаем фильтры динамически внутри панели
        filtersConfig.forEach(filter => {
            const filterGroup = L.DomUtil.create('div', 'filter-group', filtersPanel);
            
            // Контейнер для иконки и названия
            const labelContainer = L.DomUtil.create('div', 'filter-label-container', filterGroup);
            
            // Добавляем иконку фильтра, если она указана
            if (filter.icon) {
                const filterIcon = L.DomUtil.create('img', 'filter-icon', labelContainer);
                filterIcon.src = filter.icon;
                filterIcon.alt = filter.name;
                filterIcon.title = filter.name;
            }
            
            const filterLabel = L.DomUtil.create('span', 'filter-label', labelContainer);
            filterLabel.textContent = filter.name;
            
            const filterCheckbox = L.DomUtil.create('div', 'filter-checkbox active', filterGroup);
            filterCheckbox.title = `Показать/скрыть ${filter.name}`;
            
            if (!filter.special) {
                filterStates[filter.name] = true;
            }
            
            // Меняем цвет галочки
            const filterCheckmark = L.DomUtil.create('div', 'filter-checkmark active', filterCheckbox);
            filterCheckmark.style.color = filter.color;
            
            // Сохраняем элемент для дальнейшего использования
            filterElements[filter.name] = {
                checkbox: filterCheckbox,
                checkmark: filterCheckmark,
                isSpecial: filter.special || false
            };
            
            // Для обычных фильтров используем стандартную функцию
            if (!filter.special) {
                setupFilterToggle(filterCheckbox, filterCheckmark, filter.name);
            } else {
                // Для "Все фильтры" используем специальную функцию
                setupAllFiltersToggle(filterCheckbox, filterCheckmark, filterElements, filtersConfig);
            }
        });
        
        // Добавляем обработчик клика на заголовок для сворачивания/разворачивания
        title.addEventListener('click', function(e) {
            const isCollapsed = filtersContent.classList.contains('collapsed');
            
            if (isCollapsed) {
                // Разворачиваем
                filtersContent.classList.remove('collapsed');
                arrowIcon.innerHTML = 'свернуть';
            } else {
                // Сворачиваем
                filtersContent.classList.add('collapsed');
                arrowIcon.innerHTML = 'развернуть';
            }
            
            L.DomEvent.stopPropagation(e);
        });

        return filtersContainer;
    }
});

// Функция для переключения "Все фильтры"
function setupAllFiltersToggle(checkbox, checkmark, filterElements, filtersConfig) {
    checkbox.onclick = function() {
        // Определяем, нужно ли включать или выключать все фильтры
        const allCurrentlyEnabled = Object.keys(filterStates).every(
            filterName => filterStates[filterName]
        );
        const enableAll = !allCurrentlyEnabled;
        
        // Обновляем состояние "Все фильтры"
        if (enableAll) {
            checkmark.classList.add('active');
            checkbox.classList.add('active');
        } else {
            checkmark.classList.remove('active');
            checkbox.classList.remove('active');
        }
        
        // Обновляем все остальные фильтры
        filtersConfig.forEach(filter => {
            if (filter.special) return; // Пропускаем "Все фильтры"
            
            const element = filterElements[filter.name];
            if (element) {
                // Обновляем состояние
                filterStates[filter.name] = enableAll;
                
                // Обновляем визуальное состояние
                if (enableAll) {
                    element.checkmark.classList.add('active');
                    element.checkbox.classList.add('active');
                    showFilteredMarkers(filter.name);
                } else {
                    element.checkmark.classList.remove('active');
                    element.checkbox.classList.remove('active');
                    hideFilteredMarkers(filter.name);
                }
            }
        });
        
        L.DomEvent.stopPropagation(checkbox);
    };
}

// Добавляем контрол на карту
const coordsToggleControl = new CoordsToggleControl();
coordsToggleControl.addTo(map);

// Добавляем контрол фильтров на карту
const filtersToggleControl = new FiltersToggleControl();
filtersToggleControl.addTo(map);

// Загружаем метки после полной инициализации карты
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        loadMarkersFromCSV();
        // Добавляем задержку для гарантии создания контейнера фильтров
        setTimeout(enableFilterScroll, 100);
    }, 500);
});

function enableFilterScroll() {
    const filtersContainer = document.querySelector('.filters-container');
    const filtersContent = document.querySelector('.filters-content');
    
    if (!filtersContainer || !filtersContent) return;
    
    // Обработчик колесика мыши для области контента
    filtersContent.addEventListener('wheel', function(e) {
        // Проверяем, не свернут ли контейнер
        if (this.classList.contains('collapsed')) return;
        
        // Прокручиваем контейнер контента
        this.scrollTop += e.deltaY;
        
        // Всегда останавливаем событие от распространения
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        
        return false;
    }, { passive: false, capture: true });
    
    // Также отключаем прокрутку карты когда курсор над фильтрами
    filtersContainer.addEventListener('mouseover', function() {
        map.scrollWheelZoom.disable();
    });
    
    filtersContainer.addEventListener('mouseout', function() {
        map.scrollWheelZoom.enable();
    });
    
    // Обработчик для заголовка (чтобы не прокручивалась карта при клике)
    const filtersTitle = document.querySelector('.filters-title');
    if (filtersTitle) {
        filtersTitle.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
    }
}

// Обработчик клика по карте
map.on('click', function(e) {
    const target = e.originalEvent.target;
    const isMarker = target.closest('.leaflet-marker-icon');
    const isTooltip = target.closest('.leaflet-tooltip');
    
    // Если клик по tooltip - ничего не делаем
    if (isTooltip) {
        return;
    }
    
    // Если клик по маркеру - это обрабатывается в маркере
    if (isMarker) {
        return;
    }
    
    // Если клик по пустой области - закрываем все тултипы
    closeAllTooltips();
});

// Закрытие тултипов по клавише ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeAllTooltips();
    }
});

// Вызовите после загрузки страницы
document.addEventListener('DOMContentLoaded', enableFilterScroll);