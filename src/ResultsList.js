// src/ResultsList.js
import { SortByPriceStrategy } from './SortStrategy.js';

export class ResultsList {
    constructor(containerElementId) {
        this.container = document.getElementById(containerElementId);
        this.hotels = [];
        // Por defecto, usa la estrategia de ordenar por precio
        this.sortStrategy = new SortByPriceStrategy(); 
    }

    setHotels(hotels) {
        this.hotels = hotels;
    }

    // Requisito clave: Método para cambiar dinámicamente el algoritmo de ordenamiento
    setSortStrategy(strategy) {
        this.sortStrategy = strategy;
    }

    render() {
        // Limpiar la lista anterior
        this.container.innerHTML = ''; 

        if (this.hotels.length === 0) {
            this.container.innerHTML = '<p class="placeholder-text">No se encontraron hoteles con los filtros aplicados.</p>';
            return;
        }

        // 1. Aplicar la estrategia de ordenamiento actual
        const sortedHotels = this.sortStrategy.sort(this.hotels);

        // 2. Renderizar los resultados
        sortedHotels.forEach(hotel => {
            const card = document.createElement('div');
            card.classList.add('hotel-card');
            
            // Usando Template Literals para un HTML limpio
            card.innerHTML = `
                <div class="hotel-image">
                    <img src="${hotel.ImageUrl}" alt="${hotel.name}">
                 </div>
                <div class="hotel-info">

                    <h3>${hotel.name}</h3>
                    <p>⭐ <span class="hotel-rating">${hotel.rating}</span> (${hotel.reviews} reseñas)</p>
                    <p>Filtros: ${hotel.amenities.join(', ')}</p>
                    <small>Fuente: ${hotel.provider}</small>
                </div>
                <div class="hotel-price-details">
                    <span class="hotel-price">$${hotel.price}</span>
                    <small>por noche</small>
                </div>
            `;
            this.container.appendChild(card);
        });
    }
}