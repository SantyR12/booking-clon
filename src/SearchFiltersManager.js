// Implementación del Patrón Singleton
// Esta lógica asegura que solo se pueda crear una instancia de la clase, garantizando la unicidad del estado.
// Clase que maneja el estado de los filtros de búsqueda
// Este estado se actualiza cuando se realizan cambios en los filtros
// Se puede acceder a través de la propiedad getState() y actualizar con updateState()      
// Esto permite que el estado sea manejado de manera centralizada y que sea visible a través de un provider
// Esto permite que los componentes puedan acceder al estado de manera reactiva y actualizada           

class SearchFiltersManager {
    constructor() {
        if (SearchFiltersManager.instance) {
            return SearchFiltersManager.instance;
        }

        this.state = {
            destination: 'Barcelona',
            dates: '2024-01-01 / 2024-01-07',
            guests: 2,
            appliedFilters: ['wifi', 'pool'], // Almacena solo los activados
            currentSort: 'price_asc'
        };

        SearchFiltersManager.instance = this;
    }

    // Aqui el metodo se utiliza para actualizar cualquier parte del estado
    updateState(newState) {
        this.state = { ...this.state, ...newState };
        console.log('Filtros Actualizados:', this.state);
        // Aquí se podría emitir un evento global si fuera necesario
    }

    getState() {
        return this.state;
    }
}

// se exporta la instancia única
export const filtersManager = new SearchFiltersManager();