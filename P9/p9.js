// Ejercicio 1 - Especificar en la colección users las siguientes reglas de validación:
// El campo name (requerido) debe ser un string con un máximo de 30 caracteres, email (requerido)
// debe ser un string que matchee con la expresión regular: "^(.*)@(.*)\\.(.{2,4})$" ,
// password (requerido) debe ser un string con al menos 50 caracteres.

db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password"],
      properties: {
        name: {
          bsonType: "string",
          maxLength: 30,
        },
        email: {
          bsonType: "string",
          pattern: "^(.*)@(.*)\\.(.{2,4})$",
        },
        password: {
          bsonType: "string",
          minLength: 50,
        },
      },
    },
  },
});

db.users.insertMany(
  // 5 INSERTS VÁLIDOS
  {
    name: "Alex Smith",
    email: "alex.smith@empresa.com",
    password: "p".repeat(50),
  },
  {
    name: "Maria Lopez",
    email: "maria@mail.net",
    password: "clavemuysegura".repeat(4) + "12345678901234",
  },
  {
    name: "Carlos Gomez",
    email: "carlos.gomez@sitio.co",
    password:
      "estaEsUnaClaveSuperLargaYSeguraParaCumplirConElMinimoDeCincuentaCaracteres",
  },
  {
    name: "Daniela Rodriguez",
    email: "daniela.r@servidor.info",
    password: "a".repeat(30) + "b".repeat(20),
  },
  {
    name: "Elias Torres",
    email: "elias@torres.ar",
    password:
      "UnaContrasenaQueDebeTenerMasDeCincuentaCaracteresParaSerValidaEnLaBaseDeDatosDeUsuarios2025!",
  },

  // 5 INSERTS INVÁLIDOS
  {
    name: "Fanny",
    email: "fanny@correo",
    password: "valida".repeat(10),
  },
  {
    name: "Gaston",
    email: "gaston@correo.es",
    password: "p".repeat(49),
  },
  {
    name: "EsteNombreTieneMasDe30Caracteres",
    email: "largo@correo.com",
    password: "valida".repeat(10),
  },
  {
    name: "Hugo",
    password: "valida".repeat(10),
  },
  {
    email: "invalido@gmail.com",
    password: "valida".repeat(10),
  }
);

// Ejercicio 2 - Obtener metadata de la colección users que garantice que las reglas
// de validación fueron correctamente aplicadas.
db.getCollectionInfos({ name: "users" });

// Ejercicio 3 - Especificar en la colección theaters las siguientes reglas de validación:
// El campo theaterId (requerido) debe ser un int y location (requerido) debe ser un object con:
//      a - un campo address (requerido) que sea un object con campos street1, city, state y
//          zipcode todos de tipo string y requeridos
//      b - un campo geo (no requerido) que sea un object con un campo type, con valores
//          posibles “Point” o null y coordinates que debe ser una lista de 2 doubles
// Por último, estas reglas de validación no deben prohibir la inserción o actualización de
// documentos que no las cumplan sino que solamente deben advertir.

db.runCommand({
  collMod: "theaters",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["theaterId", "location"],
      properties: {
        theaterId: {
          bsonType: "int",
        },
        location: {
          bsonType: "object",
          required: ["address"],
          properties: {
            address: {
              bsonType: "object",
              required: ["street1", "city", "state", "zipcode"],
              properties: {
                street1: { bsonType: "string" },
                city: { bsonType: "string" },
                state: { bsonType: "string" },
                zipcode: { bsonType: "string" },
              },
            },
            geo: {
              bsonType: "object",
              properties: {
                type: {
                  enum: ["Point", null],
                },
                coordinates: {
                  bsonType: "array",
                  items: { bsonType: "double" },
                  minItems: 2,
                  maxItems: 2,
                },
              },
            },
          },
        },
      },
    },
  },
  validationLevel: "moderate",
  validationAction: "warn",
});

// Ejercicio 4 - Especificar en la colección movies las siguientes reglas de validación:
// El campo title (requerido) es de tipo string, year (requerido) int con mínimo en 1900 y máximo
// en 3000, y que tanto cast, directors, countries, como genres sean arrays de strings sin duplicados.
// Hint: Usar el constructor NumberInt() para especificar valores enteros a la hora de insertar documentos.
// Recordar que mongo shell es un intérprete javascript y en javascript los literales numéricos
// son de tipo Number (double).
db.runCommand({
  collMod: "movies",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "year"],
      properties: {
        title: {
          bsonType: "string",
        },
        year: {
          bsonType: "int",
          minimum: 1900,
          maximum: 3000,
        },
        cast: {
          bsonType: "array",
          uniqueItems: true,
          items: { bsonType: "string" },
        },
        directors: {
          bsonType: "array",
          uniqueItems: true,
          items: { bsonType: "string" },
        },
        countries: {
          bsonType: "array",
          uniqueItems: true,
          items: { bsonType: "string" },
        },
        genres: {
          bsonType: "array",
          uniqueItems: true,
          items: { bsonType: "string" },
        },
      },
    },
  },
});

// Ejercicio 5 - Crear una colección userProfiles con las siguientes reglas de validación:
// Tenga un campo user_id (requerido) de tipo “objectId”, un campo language (requerido) con
// alguno de los siguientes valores [ “English”, “Spanish”, “Portuguese” ] y un campo
// favorite_genres (no requerido) que sea un array de strings sin duplicados.
db.createCollection("userProfiles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      requires: ["user_id", "language"],
      properties: {
        user_id: { bsonType: "objectId" },
        language: { enum: ["English", "Spanish", "Portuguese"] },
        favorite_genres: {
          bsonType: "array",
          items: { bsonType: "string" },
          uniqueItems: true,
        },
      },
    },
  },
});

//MODELADO DE DATOS
// Ejercicio 6 - Identificar los distintos tipos de relaciones (One-To-One, One-To-Many) en
// las colecciones movies y comments. Determinar si se usó documentos anidados o referencias
// en cada relación y justificar la razón.

/* 
MOVIES
{
  _id: ObjectId('573a1390f29313caabcd4132'),
  title: 'Carmencita',
  year: 1894,
  runtime: 1,
  cast: [ 'Carmencita' ],
  poster: 'http://ia.media-imdb.com',
  plot: 'Performing on what looks like a small wooden stage' 
  fullplot: 'Performing on what looks like a small' 
  lastupdated: '2015-08-26 00:03:45.040000000',
  type: 'movie',
  directors: [ 'William K.L. Dickson' ],
  imdb: { rating: 5.9, votes: 1032, id: 1 },
  countries: [ 'USA' ],
  rated: 'NOT RATED',
  genres: [ 'Documentary', 'Short' ]
}

COMMENTS
{
  _id: ObjectId('5a9427648b0beebeb69579cc'),
  name: 'Andrea Le',
  email: 'andrea_le@fakegmail.com',
  movie_id: ObjectId('573a1390f29313caabcd418c'),
  text: 'Rem officiis eaque repellendus amet eos doloribus. Porro dolor voluptatum voluptates neque culpa molestias. Voluptate unde nulla temporibus ullam.',
  date: ISODate('2012-03-26T23:20:16.000Z')
} 
Movies - Comments (One-To-Many), una pelicula puede tener muchos comentarios pero un comentario pertenece a una sola pelicula
Se usa una referencia al id de la pelicula en lugar de guardar todos los comentarios dentro de cada película
*/

// Ejercicio 7 - Dado el diagrama de la base de datos shop junto con las
// queries más importantes.
// Queries
//  1- Listar el id, titulo, y precio de los libros y sus categorías de un autor en particular
//  2- Cantidad de libros por categorías
//  3- Listar el nombre y dirección entrega y el monto total
//     (quantity * price) de sus pedidos para un order_id dado.

// Crear el modelo de datos aplicndo modelado aniado y referencias.
// Se deben responder las queries de manera eficiente: eficiente => no usar $lookup

/* Colecciones
orders: id, delivery_name, delivery_address, cc_name, cc_number, cc_expiry
order_details: id, book_id (books), title, author, quantity, price, order_id (orders)
books: book_id, title, author, price, category_id (category)
categories: category_id, category_name

*/

use("shop");

db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        order_id: { bsonType: "long" },
        delivery_name: { bsonType: "string", maxLength: 70 },
        delivery_address: { bsonType: "string", maxLength: 70 },
        cc_name: { bsonType: "string", maxLength: 70 },
        cc_number: { bsonType: "string", maxLength: 32 },
        cc_expiry: { bsonType: "string", maxLength: 20 },
      },
    },
  },
});
db.createCollection("order_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        id: { bsonType: "long" },
        book_id: { bsonType: "int" },
        title: { bsonType: "string", maxLength: 70 },
        author: { bsonType: "string", maxLength: 70 },
        quantity: { bsonType: "int" },
        price: { bsonType: "double" },
        order_id: { bsonType: "long" },
      },
    },
  },
});
db.createCollection("books", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        book_id: { bsonType: "int" },
        title: { bsonType: "string", maxLength: 70 },
        author: { bsonType: "string", maxLength: 70 },
        price: { bsonType: "double" },
        categories: { bsonType: "array", items: { bsonType: "string" } },
      },
    },
  },
});

db.books.find(
  { author: "George Orwell" },
  { _id: 0, book_id: 1, title: 1, price: 1, categories: 1 }
);

db.books.aggregate([
  { $unwind: "$categories" },
  { $group: { _id: "$categories", count: { $sum: 1 } } },
  { $project: { _id: 0, Categorias: "$_id", Cantidad: "$count" } },
]);

db.orders.aggregate([
  {
    $lookup: {
      from: "order_details",
      localField: "order_id",
      foreignField: "order_id",
      as: "order_details",
    },
  },
  { $unwind: "$order_details" },
  {
    $group: {
      _id: "$order_id",
      delivery_name: { $first: "$delivery_name" },
      delivery_address: { $first: "$delivery_address" },
      costo: {
        $sum: {
          $multiply: ["$order_details.quantity", "$order_details.price"],
        },
      }, //multiply no acumula, x eso usamos sum
    },
  },
  {
    $project: {
      _id: 0,
      order_id: "$_id",
      delivery_name: 1,
      delivery_address: 1,
      costo: 1,
    },
  },
]);
