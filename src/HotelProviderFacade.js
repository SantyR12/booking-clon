// src/HotelProviderFacade.js

// Clase que simula una API de proveedor
class ProviderAPI {
    constructor(name, delay = 500) {
        this.name = name;
        this.delay = delay;
        // Datos de ejemplo: cada proveedor podría tener un formato ligeramente distinto
        this.mockData = [
            { id: 101, name: "Hotel A de " + name, price: 120, rating: 4.5, reviews: 250, amenities: ['wifi', 'pool'], ImageUrl: 'https://picsum.photos/id/193/200/300' },
            { id: 102, name: "Hotel B de " + name, price: 80, rating: 3.8, reviews: 120, amenities: ['wifi', 'parking'], ImageUrl: 'https://picsum.photos/id/221/200/300' },
            { id: 103, name: "Hotel C de " + name, price: 200, rating: 4.9, reviews: 500, amenities: ['wifi', 'pool', 'pet_friendly'], ImageUrl: 'https://picsum.photos/id/234/200/300' },
        ];
    }

    // Método que simula una llamada asíncrona (usa Promise)
    fetch(filters) {
        return new Promise((resolve, reject) => {
            console.log(`[${this.name}] Consultando con filtros:`, filters);

            // Simulación de error (ej. 1 de cada 5 llamadas falla)
            if (Math.random() < 0.2) {
                setTimeout(() => reject(new Error(`[${this.name}] Error de conexión o timeout.`)), this.delay);
                return;
            }

            // Aplicar filtros de amenidades (simulado)
            const filteredResults = this.mockData.filter(hotel => {
                const anemitiesMatch = filters.appliedFilters.every(appliedFilters => hotel.amenities.includes(appliedFilters)

            );
            return  anemitiesMatch;    
            }); 

            setTimeout(() => {
                // Simulación de estructura de respuesta estandarizada
                const standardResults = filteredResults.map(hotel => ({
                    ...hotel,
                    provider: this.name,
                }));
                resolve(standardResults);
            }, this.delay);
        });     
    }
}

export class HotelProviderFacade {
    constructor() {
        // Usamos un Array para la lista de APIs conectables
        this.providers = [];

        // Añadimos proveedores iniciales
        this.addProvider(new ProviderAPI("API HotelChain", 400));
        this.addProvider(new ProviderAPI("API BookingAggregator", 700));
    }

    // Requisito clave: hacer la Fachada "conectable" (pluggable)
    addProvider(providerAPI) {
        this.providers.push(providerAPI);
        console.log(`Proveedor añadido: ${providerAPI.name}`);
    }

    /**
     * @param {object} filters Los filtros obtenidos del SearchFiltersManager
     * @returns {Promise<Array>} Promesa que resuelve con la lista unificada y filtrada de hoteles
     */
    async search(filters) {
        console.log('--- Buscando en todos los proveedores ---');
        
        // 1. Crear un Array de Promesas de búsqueda
        const searchPromises = this.providers.map(provider => provider.fetch(filters));

        let allResults = [];
        let errors = [];

        // 2. Usar Promise.allSettled para manejar errores y unificar resultados
        // Promise.allSettled espera que TODAS las promesas terminen (éxito o fracaso)
        const results = await Promise.allSettled(searchPromises);

        // 3. Procesar y unificar resultados
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                // El resultado es un Array, usamos el operador de propagación (...) para unificar
                allResults.push(...result.value);
            } else {
                errors.push(result.reason); // Manejo de errores
                console.error('Error de proveedor:', result.reason.message);
            }
        });

        console.log(`Búsqueda finalizada. Hoteles encontrados: ${allResults.length}. Errores: ${errors.length}.`);
        // Opcional: eliminar duplicados si los ids fueran globales (para simplificar, no lo haremos aquí)
        return allResults;
    }
}