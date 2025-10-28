// El archivo implementa el patrón Strategy para ordenar listas de hoteles según diferentes criterios.
// En la siguiente clase, implementamos tres estrategias de ordenamiento: ordenar por precio,
//  ordenar por puntuación y ordenar por mejor valor
// el metodo sort es una funcion que ordena los elementos de una coleccion 
class SortStrategy {  //claase abstracta
    sort(hotels) {
        throw new Error("El método 'sort' debe ser implementado por las subclases.");
    }
}

// esta es la primera estrategia, ordena por precio
// donde se usa el operador de propagación para crear una copia y evitar mutar el original
export class SortByPriceStrategy extends SortStrategy {
    sort(hotels) {
        return [...hotels].sort((a, b) => a.price - b.price);
    }
}

// esta es la segunda estrategia, ordena por puntuación
// donde se usa el operador de propagación para crear una copia y evitar mutar el original
// en la cual se compara la puntuación y el número de reseñas
export class SortByRatingStrategy extends SortStrategy {
    sort(hotels) {
        return [...hotels].sort((a, b) => {
            if (b.rating !== a.rating) {
                return b.rating - a.rating;
            }
            return b.reviews - a.reviews;
        });
    }
}

// esta es la tercera estrategia, ordena por mejor valor
// donde se usa el operador de propagación para crear una copia y evitar mutar el original
// en la cual se calcula el score de cada hotel y se compara con el de otro
export class SortByBestValueStrategy extends SortStrategy {
    sort(hotels) {
        return [...hotels].sort((a, b) => {
            const scoreA = (a.rating * 5) / a.price;
            const scoreB = (b.rating * 5) / b.price;
            return scoreB - scoreA; 
        });
    }
}