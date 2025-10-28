import { filtersManager } from './src/SearchFiltersManager.js';
import { HotelProviderFacade } from './src/HotelProviderFacade.js';
import { ResultsList } from './src/ResultsList.js';
import { 
    SortByPriceStrategy, 
    SortByRatingStrategy, 
    SortByBestValueStrategy 
} from './src/SortStrategy.js';

// Importación de módulos: Se traen las clases y el objeto Singleton necesarios para el funcionamiento de la aplicación.

// Inicialización de componentes
const facade = new HotelProviderFacade();
// Se crea una instancia de la Fachada, que simplifica el acceso a los diferentes servicios de hoteles.
const resultsList = new ResultsList('results-list');
// Se crea una instancia de la clase que gestiona y renderiza la lista de resultados en el elemento con ID 'results-list'.

// Mapeo para instanciar la estrategia correcta
const sortStrategiesMap = {
    'price_asc': SortByPriceStrategy,
    'rating_desc': SortByRatingStrategy,
    'best_value': SortByBestValueStrategy,
};
// Este objeto mapea los valores del select de ordenamiento de la UI a las clases de Estrategia correspondientes.

// Manejo de Eventos (Patron Singleton)

// Función para actualizar los filtros de la UI al Singleton
const updateFilters = () => {
    const destination = document.getElementById('destination').value;
    const dates = document.getElementById('dates').value;
    // Se obtienen los valores de los campos de destino y fechas.
    // Asegúrate de que guests sea un número (puede ser NaN si el input está vacío)
    const guests = parseInt(document.getElementById('guests').value) || 1;
// Se obtiene el número de huéspedes y se asegura que sea un número válido, por defecto 1.
 
     // Obtener las amenidades seleccionadas (Checkbox)
    const appliedFilters = Array.from(document.querySelectorAll('input[name="amenity"]:checked'))
                        .map(checkbox => checkbox.value);
    // Se recopilan las amenidades seleccionadas de los checkboxes.
    
    const currentSort = document.getElementById('sort-select').value;
     // Se obtiene la opción de ordenamiento seleccionada por el usuario.

    // Actualizar el estado del Singleton
    filtersManager.updateState({ 
        destination, 
        dates, 
        guests, 
        appliedFilters, 
        currentSort 
    });
    // Se usa el patrón Singleton (a través de filtersManager) para almacenar de forma centralizada
    //  y única el estado actual de todos los filtros y el ordenamiento.
};

const performSearch = async () => {
    //  FIX CRÍTICO: Sincronizar el Singleton justo antes de buscar
    updateFilters(); 
    // Se llama a updateFilters para asegurar que el Singleton refleje el estado más reciente de la UI justo antes de iniciar la búsqueda.

    document.getElementById('search-button').textContent = 'Buscando...';
    document.getElementById('search-button').disabled = true;
    // Se actualiza la UI para indicar que la búsqueda está en curso y se deshabilita el botón para evitar múltiples peticiones.

    // 1. Obtener el estado actual del Singleton (con los filtros más recientes)
    const currentFilters = filtersManager.getState();
    console.log('Iniciando búsqueda con filtros:', currentFilters);
    // Se recuperan los filtros del Singleton.

    // 2. Usar la Fachada (Facade)
    try {
        const hotels = await facade.search(currentFilters);
        // Se invoca el método search de la Fachada para iniciar la búsqueda asíncrona de hoteles.

        // 3. Establecer los hoteles en la lista
        resultsList.setHotels(hotels);
        // Se le pasan los resultados de la búsqueda al componente de la lista de resultados.

        // 4. Aplicar la estrategia de ordenamiento actual y renderizar
        const SortClass = sortStrategiesMap[currentFilters.currentSort];
        // Se obtiene la clase de Estrategia de ordenamiento basada en el valor del Singleton.
        resultsList.setSortStrategy(new SortClass());
        // Se establece la nueva estrategia de ordenamiento en el componente ResultsList (patrón Strategy).
        resultsList.render();
        // Se renderiza la lista de hoteles (la cual usa la estrategia de ordenamiento recién establecida).

    } catch (error) {
        console.error("Error fatal en la búsqueda:", error);
        document.getElementById('results-list').innerHTML = '<p class="placeholder-text error">Hubo un error al conectar con los servicios de búsqueda.</p>';
 // Manejo de errores: Si falla la búsqueda, se muestra un mensaje de error en la lista de resultados.
    } finally {
        document.getElementById('search-button').textContent = 'Buscar Hoteles';
        document.getElementById('search-button').disabled = false;
        // Se restablece el texto y el estado del botón de búsqueda al finalizar la operación (éxito o error).
}
};



// 1. Evento para el botón de Búsqueda
document.getElementById('search-button').addEventListener('click', performSearch);
// Asigna la función performSearch al evento de clic del botón de búsqueda.

// 2. Evento para los inputs (Solo actualiza el Singleton, no dispara búsqueda)
document.getElementById('filter-inputs').addEventListener('change', updateFilters);
// Asigna la función updateFilters para mantener sincronizado el estado del Singleton cada vez que un filtro cambia, sin iniciar una nueva búsqueda.

// 3. Evento para el ordenamiento (Actualiza Singleton y re-renderiza sin buscar de nuevo)
document.getElementById('sort-select').addEventListener('change', () => {
    updateFilters();
    // Se actualiza el Singleton con la nueva opción de ordenamiento.
    const currentSort = filtersManager.getState().currentSort;
    const SortClass = sortStrategiesMap[currentSort];
// Se obtiene la clase de Estrategia basada en el nuevo ordenamiento.
    resultsList.setSortStrategy(new SortClass());
    
    resultsList.render();
    // Se re-renderiza la lista de resultados, aplicando el nuevo ordenamiento sin necesidad de hacer una nueva petición HTTP.
});


// Ejecutar una búsqueda inicial al cargar la página
document.addEventListener('DOMContentLoaded', () => {   
    updateFilters(); // Carga el estado inicial del DOM al Singleton
     // Se sincroniza el estado inicial de la UI al Singleton antes de la primera búsqueda.
     performSearch();
 // Se dispara la búsqueda inicial al terminar de cargar el DOM.
});