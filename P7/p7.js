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
      year: { $gte: "1990", $lte: "1999" },
      "imdb.rating": { $type: "double" },
    },
    { title: 1, year: 1, cast: 1, directors: 1, "imdb.rating": 1 }
  )
  .sort({ "imdb.rating": -1 })
  .limit(10)
  .forEach(printjson);

//La pelicula con mayor rating tiene 9 puntos

//Ejercicio 3
db.comments
  .find(
    {
      movie_id: { $eq: ObjectId("573a1399f29313caabcee886") },
      date: {
        $gte: ISODate("2014-01-01T00:00:00Z"),
        $lte: ISODate("2016-12-31T23:59:59Z"),
      },
    },
    { name: 1, email: 1, text: 1, date: 1 }
  )
  .sort({ date: -1 })
  .forEach((doc) => printjson(doc));

db.comments
  .find(
    {
      movie_id: { $eq: ObjectId("573a1399f29313caabcee886") },
      date: {
        $gte: ISODate("2014-01-01T00:00:00Z"),
        $lte: ISODate("2016-12-31T23:59:59Z"),
      },
    },
    { name: 0, email: 0, text: 0, date: 0, _id: 0 }
  )
  .count();

//Ejercicio 4
db.comments
  .find(
    { email: "patricia_good@fakegmail.com" },
    { _id: 0, name: 1, movie_id: 1, text: 1, date: 1 }
  )
  .sort({ date: -1 })
  .limit(3);

//Ejercicio 5
db.movies
  .find(
    {
      genres: { $all: ["Drama", "Action"] },
      languages: { $size: 1 },
      $or: [{ "imdb.rating": { $gt: 9 } }, { runtime: { $gte: 180 } }],
    },
    { _id: 0, title: 1, languages: 1, genres: 1, released: 1, "imdb.votes": 1 }
  )
  .sort({ released: -1 }, { "imdb.votes": -1 }, { _id: 1 });

//Ejercicio 6
db.theaters
  .find(
    {
      "location.address.state": { $in: ["CA", "NY", "TX"] },
      "location.address.city": /^F/,
    },
    {
      theaterId: 1,
      "location.address.state": 1,
      "location.address.city": 1,
      "locations.geo.coordinates": 1,
    }
  )
  .sort({ "location.address.state": -1 }, { "location.address.city": -1 });

//Ejercicio 7

db.comments.updateOne(
  { _id: ObjectId("5b72236520a3277c015b3b73") },
  { $set: { text: "mi mejor comentario", date: new Date() } }
);
db.comments.findOne({ _id: ObjectId("5b72236520a3277c015b3b73") });
