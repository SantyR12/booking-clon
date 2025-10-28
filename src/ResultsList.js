import { SortByPriceStrategy } from './SortStrategy.js';

// Este srchivo muestra los resultados de la búsqueda y se implementa con la siguiente clase, actuando como contexto del patron strategy
// esta clase matiene la liste de hoteles y la estrategia de ordenamiento actual y delega el ordenamiento a la estrategia elegida antes
// de renderiza la vista

export class ResultsList {
    constructor(containerElementId) {
        this.container = document.getElementById(containerElementId);
        this.hotels = [];
        // aqui se usa la estrategia de ordenar por precio
        this.sortStrategy = new SortByPriceStrategy(); 
    }

    setHotels(hotels) {
        this.hotels = hotels;
    }

    // Este metod es clave para el patrón Strategy, ya que permite cambiar el algoritmo de ordenamiento en tiempo real
    // Por ejemplo, en app.js, cuando el usuario selecciona una opción en un menú desplegable, se instancia una nueva estrategia (como SortByRatingStrategy) y se pasa a setSortStrategy()
    setSortStrategy(strategy) {
        this.sortStrategy = strategy;
    }

    render() {
        // Limpiar el contener y verifica si hay hoteles que mostrar y usa la estrategia actual para ordenar la lista antes de generar tarjetas
        this.container.innerHTML = ''; 

        if (this.hotels.length === 0) {
            this.container.innerHTML = '<p class="placeholder-text">No se encontraron hoteles con los filtros aplicados.</p>';
            return;
        }

        // Aqui se aplica la estrategia de ordenamiento actual
        const sortedHotels = this.sortStrategy.sort(this.hotels);

        // Aqui se renderiza los resultados
        sortedHotels.forEach(hotel => {
            const card = document.createElement('div');
            card.classList.add('hotel-card');
            
            // Aqui se usa Template Literals para un HTML limpio
            card.innerHTML = `
                <div class="hotel-image">
                    <img src="${hotel.ImageUrl}" alt="${hotel.name}">
                </div>
                <div class="hotel-info">

                    <h3>${hotel.name}</h3>
                    <div class="hotel-price-details">
                    <span class="hotel-price"> $${hotel.price}</span>
                    <small> por noche</small>
                    </div>
                    <p>⭐ <span class="hotel-rating">${hotel.rating}</span> (${hotel.reviews} reseñas)</p>
                    <p>Filtros: ${hotel.amenities.join(', ')}</p>

                </div>

            `;
            this.container.appendChild(card);
        });
    }
}