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
