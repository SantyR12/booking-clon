// src/SortStrategy.js

// Interfaz (Clase Base)
class SortStrategy {
    sort(hotels) {
        throw new Error("El método 'sort' debe ser implementado por las subclases.");
    }
}

// 1. Estrategia: Ordenar por Precio
export class SortByPriceStrategy extends SortStrategy {
    sort(hotels) {
        // Usa el operador de propagación para crear una copia y evitar mutar el original
        return [...hotels].sort((a, b) => a.price - b.price);
    }
}

// 2. Estrategia: Ordenar por Puntuación
export class SortByRatingStrategy extends SortStrategy {
    sort(hotels) {
        return [...hotels].sort((a, b) => {
            // Criterio principal: rating (mayor a menor)
            if (b.rating !== a.rating) {
                return b.rating - a.rating;
            }
            // Criterio de desempate: número de reseñas (mayor a menor)
            return b.reviews - a.reviews;
        });
    }
}

// 3. Estrategia: Mejor Valor (Ejemplo complejo)
export class SortByBestValueStrategy extends SortStrategy {
    // Algoritmo: (rating * 5) / price
    sort(hotels) {
        return [...hotels].sort((a, b) => {
            const scoreA = (a.rating * 5) / a.price;
            const scoreB = (b.rating * 5) / b.price;
            return scoreB - scoreA; // Mayor score es mejor
        });
    }
}