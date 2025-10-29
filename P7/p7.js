use("mflix");
//Ejercicio 1

db.users.insertMany([
  { name: "Carla Sa", email: "carlasa@gmail.com", password: "12345" },
  { name: "Vivi Li", email: "vivili@gmail.com", password: "67890" },
  { name: "Juan Jamon", email: "juanjamon@gmail.com", password: "12345" },
  { name: "Laura Pep", email: "laurapep@gmail.com", password: "qwerty" },
  { name: "Sue Carton", email: "suecarton@gmail.com", password: "asdfg" },
]);

db.comments.insertMany([
  {
    name: "Carla Sa",
    email: "carlasa@gmail.com",
    movie_id: ObjectId("573a1390f29313caabcd4132"),
    text: "horrible",
  },
  {
    name: "Vivi Li",
    email: "vivili@gmail.com",
    movie_id: ObjectId("573a1390f29313caabcd4132"),
    text: "me gustó, la volvería a ver",
  },
  {
    name: "Juan Jamon",
    email: "juanjamon@gmail.com",
    movie_id: ObjectId("573a1390f29313caabcd4132"),
    text: "no entendí nada",
  },
  {
    name: "Laura Pep",
    email: "laurapep@gmail.com",
    movie_id: ObjectId("573a1390f29313caabcd4132"),
    text: "era mejor la original",
  },
  {
    name: "Sue Carton",
    email: "suecarton@gmail.com",
    movie_id: ObjectId("573a1390f29313caabcd4132"),
    text: "uhmm actuali",
  },
]);


//Ejercicio 2

db.movies
  .find(
    {
      year: { $gte: "1990", $lte: "1999"},
      "imdb.rating": { $type: "double" },
    },
    { title: 1, year: 1, cast: 1, directors: 1, "imdb.rating": 1 }
  )
  .sort({ "imdb.rating": -1 })
  .limit(10)
  .forEach(printjson);

//La pelicula con mayor rating tiene 9 puntos
