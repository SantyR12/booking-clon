// src/SearchFiltersManager.js
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

    // Método para actualizar cualquier parte del estado
    updateState(newState) {
        this.state = { ...this.state, ...newState };
        console.log('Filtros Actualizados:', this.state);
        // Aquí se podría emitir un evento global si fuera necesario
    }

    getState() {
        return this.state;
    }
}

// Exportamos la instancia única
export const filtersManager = new SearchFiltersManager();