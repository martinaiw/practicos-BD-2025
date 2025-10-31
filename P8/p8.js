use("mflix");

//Ejercicio 1 - Cantidad de cines (theaters) por estado.
db.theaters.aggregate([
  { $group: { _id: "$location.address.state", count: { $sum: 1 } } },
  { $project: { state: "$_id", count: 1, _id: 0 } }, //cambio el documento y renombro _id como state para que despues se imprima state: 'KA' y no se muestre id
  { $sort: { state: 1 } },
]);

// Ejercicio 2 - Cantidad de estados con al menos dos cines (theaters) registrados.
db.theaters.aggregate([
  { $group: { _id: "$location.address.state", count: { $sum: 1 } } },
  { $match: { count: { $gte: 2 } } },
  { $count: "estados con al menos 2 cines" },
]);

// Ejercicio 3 - Cantidad de películas dirigidas por "Louis Lumière".
// Se puede responder sin pipeline de agregación, realizar ambas queries.
db.movies.aggregate([
  { $match: { directors: "Louis Lumière" } },
  { $count: "peliculas dirigidas por Louis Lumière" },
]);
db.movies.find({ directors: { $eq: "Louis Lumière" } }).count();

// Ejercicio 4 - Cantidad de películas estrenadas en los años 50 (desde 1950 hasta 1959).
// Se puede responder sin pipeline de agregación, realizar ambas queries.
db.movies.aggregate([
  { $match: { year: { $gte: 1950, $lte: 1959 } } },
  { $count: "cantidad de peliculas estrenadas entre 1950 y 1959" },
]);
db.movies.find({ year: { $gte: 1950, $lte: 1959 } }).count();

// Ejercicio 5 - Listar los 10 géneros con mayor cantidad de películas
// (tener en cuenta que las películas pueden tener más de un género).
// Devolver el género y la cantidad de películas. Hint: unwind puede ser de utilidad
db.movies.aggregate([
  { $unwind: "$genres" }, //separo el arreglo Genres de cada documento
  { $group: { _id: "$genres", count: { $sum: 1 } } }, //agrupo por genero y cuento cuantas veces aparece cada uno
  { $sort: { count: -1 } }, // ordeno de mayor a menor
  { $limit: 10 }, // muestro solo 10
  { $project: { _id: 0, Genero: "$_id", Cantidad: "$count" } }, // formateo la salida, no muestro id, el id de la agrupacion ahora es Genero y count es Cantidad
]);

// Ejercicio 6 - Top 10 de usuarios con mayor cantidad de comentarios,
// mostrando Nombre, Email y Cantidad de Comentarios.
db.comments.aggregate([
  { $group: { _id: { email: "$email", name: "$name" }, count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 },
  {
    $project: {
      _id: 0,
      Nombre: "$_id.name",
      Email: "$_id.email",
      "Cantidad de comentarios": "$count",
    },
  },
]);

// Ejercicio 7 - Ratings de IMDB promedio, mínimo y máximo
// por año de las películas estrenadas en los años 80 (desde 1980 hasta 1989),
// ordenados de mayor a menor por promedio del año.
db.movies.aggregate([
  {
    $match: { year: { $gte: 1980, $lte: 1989 }, "imdb.rating": { $ne: null } },
  },
  {
    $group: {
      _id: "$year", //agrupa por año las estadisticas
      promedio: { $avg: "$imdb.rating" },
      minimo: { $min: "$imdb.rating" },
      maximo: { $max: "$imdb.rating" },
    },
  },
  { $sort: { promedio: -1 } },
]);

//Ejercicio 8 - Título, año y cantidad de comentarios de las 10 películas con más comentarios.
db.movies.aggregate([
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "movie_id",
      as: "movie_comments",
    },
  },
  {
    $addFields: {
      commentCount: { $size: "$movie_comments" },
    },
  },
  { $sort: { commentCount: -1 } },
  { $limit: 10 },
  {
    $project: {
      _id: 0,
      Titulo: "$title",
      Año: "$year",
      "Cantidad de comentarios": "$commentCount",
    },
  },
]);

// Ejercicio 9 - Crear una vista con los 5 géneros con mayor cantidad de comentarios, junto con la cantidad de comentarios.
db.createView("genres_with_most_comments", "movies", [
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "movie_id",
      as: "comentarios",
    },
  },
  { $unwind: "$genres" },
  {
    $addFields: {
      commentCount: { $size: "$comentarios" },
    },
  },
  {
    $group: {
      _id: "$genres",
      commentCount: { $sum: { $size: "$comentarios" } },
    },
  },
  { $sort: { commentCount: -1 } },
  { $limit: 5 },
  {
    $project: {
      _id: 0,
      Genero: "$_id",
      "Cantidad de comentarios": "$commentCount",
    },
  },
]);

db.genres_with_most_comments.find();

// Ejercicio 10 - Listar los actores (cast) que trabajaron en 2 o más películas dirigidas
// por "Jules Bass". Devolver el nombre de estos actores junto con la lista de películas
// (solo título y año) dirigidas por “Jules Bass” en las que trabajaron.
//    Hint1: addToSet
//    Hint2: {'name.2': {$exists: true}} permite filtrar arrays con al menos 2 elementos, entender por qué.
//    Hint3: Puede que tu solución no use Hint1 ni Hint2 e igualmente sea correcta

db.movies.aggregate([
  {
    $match: { directors: "Jules Bass" }, // filtro todas las pelis dirigidas por jules bass
  },
  { $unwind: "$cast" }, // separo el arreglo de actores
  {
    $group: {
      // junto todo los documentos sueltos
      _id: "$cast", // creo un grupo para cada actor, el _id es el criterio para agrupar
      movies: {
        //creo un nuevo campo movies que tiene titulo y año de la pelicula
        $addToSet: { title: "$title", year: "$year" }, // guardo sin repetir año y titlo de cada pelicula de ese actor
      },
    },
  },
  { $match: { "movies.1": { $exists: true } } }, //chequeo que haya >=2 peliculas, ese movies es el que creé arriba en $group
  {
    $project: {
      _id: 0,
      Actor: "$_id",
      Pelicula: "$movies",
    },
  },
]);

// Ejercicio 11 - Listar los usuarios que realizaron comentarios durante el
// mismo mes de lanzamiento de la película comentada, mostrando Nombre, Email,
// fecha del comentario, título de la película, fecha de lanzamiento.
// HINT: usar $lookup con multiple condiciones

db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movies",
    },
  },
  { $unwind: "$movies" },
  {
    $addFields: {
      fecha_pelicula: {
        mes: { $month: "$movies.released" },
        anio: { $year: "$movies.released" },
      },
      fecha_comentario: { mes: { $month: "$date" }, anio: { $year: "$date" } },
    },
  },
  {
    $match: {
      $expr: {
        $eq: ["$fecha_pelicula", "$fecha_comentario"],
      },
    },
  },
  {
    $project: {
      _id: 0,
      name: "$name",
      email: "$email",
      date: "$date",
      movie: "$movies.title",
      launching_date: "$movies.released",
    },
  },
]);

// Ejercicio 12 - Listar el id y nombre de los restaurantes junto con su
// puntuación máxima, mínima y la suma total. Se puede asumir que el restaurant_id es único.
//   a- Resolver con $group y accumulators.
//   b- Resolver con expresiones sobre arreglos (por ejemplo, $sum) pero sin $group.
//   c- Resolver como en el punto b) pero usar $reduce para calcular la puntuación total.
//   d- Resolver con find.

db.restaurants.aggregate([
  { $unwind: "$grades" },
  {
    $group: {
      _id: { id: "$_id", nombre: "$name" },
      max: { $max: "$grades.score" },
      min: { $min: "$grades.score" },
      total: { $sum: "$grades.score" },
    },
  },
  {
    $project: {
      _id: 0,
      Restaurant: "$_id.nombre",
      "Puntaje maximo": "$max",
      "Puntaje minimo": "$min",
      "Suma total": "$total",
    },
  },
]);

// Ejercicio 13 - Actualizar los datos de los restaurantes añadiendo dos campos nuevos.
//      "average_score": con la puntuación promedio
//      "grade": con "A" si "average_score" está entre 0 y 13,
//          con "B" si "average_score" está entre 14 y 27
//          con "C" si "average_score" es mayor o igual a 28
//  Se debe actualizar con una sola query.
//       HINT1. Se puede usar pipeline de agregación con la operación update
//       HINT2. El operador $switch o $cond pueden ser de ayuda.
