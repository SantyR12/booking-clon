// app.js
import { filtersManager } from './src/SearchFiltersManager.js';
import { HotelProviderFacade } from './src/HotelProviderFacade.js';
import { ResultsList } from './src/ResultsList.js';
import { 
    SortByPriceStrategy, 
    SortByRatingStrategy, 
    SortByBestValueStrategy 
} from './src/SortStrategy.js';

// Inicialización de componentes
const facade = new HotelProviderFacade();
const resultsList = new ResultsList('results-list');

// Mapeo para instanciar la estrategia correcta
const sortStrategiesMap = {
    'price_asc': SortByPriceStrategy,
    'rating_desc': SortByRatingStrategy,
    'best_value': SortByBestValueStrategy,
};

// ===================================
// Manejo de Eventos (Actualización del Singleton)
// ===================================

// Función para actualizar los filtros de la UI al Singleton
const updateFilters = () => {
    const destination = document.getElementById('destination').value;
    const dates = document.getElementById('dates').value;
    // Asegúrate de que guests sea un número (puede ser NaN si el input está vacío)
    const guests = parseInt(document.getElementById('guests').value) || 1;
    
    // Obtener las amenidades seleccionadas (Checkbox)
    const appliedFilters = Array.from(document.querySelectorAll('input[name="amenity"]:checked'))
                                .map(checkbox => checkbox.value);
    
    const currentSort = document.getElementById('sort-select').value;

    // Actualizar el estado del Singleton
    filtersManager.updateState({ 
        destination, 
        dates, 
        guests, 
        appliedFilters, 
        currentSort 
    });
};


// ===================================
// Lógica de Búsqueda
// ===================================

const performSearch = async () => {
    // 🎯 FIX CRÍTICO: Sincronizar el Singleton justo antes de buscar
    updateFilters(); 
    
    document.getElementById('search-button').textContent = 'Buscando...';
    document.getElementById('search-button').disabled = true;

    // 1. Obtener el estado actual del Singleton (con los filtros más recientes)
    const currentFilters = filtersManager.getState();
    console.log('Iniciando búsqueda con filtros:', currentFilters);

    // 2. Usar la Fachada (Facade)
    try {
        const hotels = await facade.search(currentFilters);
        
        // 3. Establecer los hoteles en la lista
        resultsList.setHotels(hotels);

        // 4. Aplicar la estrategia de ordenamiento actual y renderizar
        const SortClass = sortStrategiesMap[currentFilters.currentSort];
        resultsList.setSortStrategy(new SortClass());
        resultsList.render();

    } catch (error) {
        console.error("Error fatal en la búsqueda:", error);
        document.getElementById('results-list').innerHTML = '<p class="placeholder-text error">Hubo un error al conectar con los servicios de búsqueda.</p>';
    } finally {
        document.getElementById('search-button').textContent = 'Buscar Hoteles';
        document.getElementById('search-button').disabled = false;
    }
};


// 1. Evento para el botón de Búsqueda
document.getElementById('search-button').addEventListener('click', performSearch);

// 2. Evento para los inputs (Solo actualiza el Singleton, no dispara búsqueda)
document.getElementById('filter-inputs').addEventListener('change', updateFilters);

// 3. Evento para el ordenamiento (Actualiza Singleton y re-renderiza sin buscar de nuevo)
document.getElementById('sort-select').addEventListener('change', () => {
    updateFilters();
    const currentSort = filtersManager.getState().currentSort;
    const SortClass = sortStrategiesMap[currentSort];
    resultsList.setSortStrategy(new SortClass());
    resultsList.render();
});


// Ejecutar una búsqueda inicial al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    updateFilters(); // Carga el estado inicial del DOM al Singleton
    performSearch();
});

// Nota: Recuerda usar <script type="module" src="app.js"></script> en tu HTML