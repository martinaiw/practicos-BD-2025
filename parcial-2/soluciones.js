// 1.  Calcular el rating promedio por país. Listar el país, rating promedio, y cantidad de
// rating.  Listar  en  orden  descendente  por  rating  promedio.  Usar  el  campo
// “review_scores.review_scores_rating” para calcular el rating promedio.

//no entendí qué piden con cantidad de rating :/
db.listingsAndReviews.aggregate([
  {
    $group: {
      _id: "$address.country",
      rating_promedio: { $avg: "$review_scores.review_scores_rating" },
    },
  },
  { $project: { _id: 0, country: "$_id", rating_promedio: 1 } },
  { $sort: { rating_promedio: -1 } },
]);

// 2.  Listar los 20 alojamientos que tienen las reviews más recientes. Listar el id, nombre,
// fecha de la última review, y cantidad de reviews del alojamiento. Listar en orden
// descendente por cantidad de reviews.
// HINT: $first pueden ser de utilidad.

db.listingsAndReviews.aggregate([
  { $sort: { "reviews.date ": -1 } },
  {
    $group: {
      _id: "$_id",
      most_recent_review: { $first: "$reviews.date" },
      total_reviews: { $sum: "reviews" },
    },
  },
  { $count: "total_reviews" },
  {
    $project: {
      _id: 1,
      name: "$name",
      most_recent_review: 1,
      total_reviews: "$total_reviews",
    },
  },
  { $sort: { total_reviews: -1 } },
  { $limit: 20 },
]);

// 3.  Crear la vista “top10_most_common_amenities” con información de los 10 amenities
// que  aparecen  con  más  frecuencia.  El  resultado  debe  mostrar  el  amenity  y  la
// cantidad de veces que aparece cada amenity.
db.createView("top10_most_common_amenities", "listingsAndReviews", [
  { $unwind: "$amenities" },
  { $group: { _id: "$amenities", quantity: { $sum: 1 } } },
  { $sort: { quantity: -1 } },
  { $project: { _id: 0, Amenity: "$_id", Quantity: "$quantity" } },
  { $limit: 10 },
]);

// 4.  Actualizar  los  alojamientos  de  Brazil  que  tengan  un  rating  global
// (“review_scores.review_scores_rating”)  asignado,  agregando  el  campo
// "quality_label" que clasifique el alojamiento como
// “High” (si el rating global es mayor o  igual  a  90),
// “Medium”  (si  el  rating global es mayor o igual a 70),
// “Low” (valor por defecto) calidad.
// HINTS: (i) para actualizar se puede usar pipeline de agregación. (ii) El operador $cond o $switch pueden ser de utilidad.
db.listingsAndReviews.updateMany(
  {
    "address.country": { $eq: "Brazil" },
    "review_scores.review_scores_rating": { $exists: true },
  },

  [
    {
      $addFields: {
        quality_label: {
          $switch: {
            branches: [
              {
                case: {
                  $gte: ["$review_scores.review_scores_rating", 90],
                },
                then: "High",
              },
              {
                case: {
                  $gte: ["$review_scores.review_scores_rating", 70],
                },
                then: "Medium",
              },
            ],
            default: "Low",
          },
        },
      },
    },
  ]
);

/*db.listingsAndReviews.aggregate([
  { $match: { "address.country": { $eq: "Brazil" } } },
  { $project: { _id: 0, name: 1, "address.country": 1, quality_label: 1 ,"review_scores.review_scores_rating":1 } },
]);
*/

// 5.  (a)  Especificar  reglas  de  validación  en  la  colección  listingsAndReviews  a  los
// siguientes  campos  requeridos:  name,  address,  amenities,  review_scores,  and
// reviews ( y todos sus campos anidados). Inferir los tipos y otras restricciones que
// considere adecuados para especificar las reglas a partir de los documentos de la
// colección.

db.runCommand({
  collMod: "listingsAndReviews",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "address", "amenities", "review_scores", "reviews"],
      properties: {
        name: {
          bsonType: "string",
        },
        amenities: {
          bsonType: "array",
          items: { bsonType: "string" },
        },
        address: {
          bsonType: "object",
          required: [
            "street",
            "suburb",
            "government_area",
            "market",
            "country",
            "country_code",
            "location",
          ],
          properties: {
            street: { bsonType: "string" },
            suburb: { bsonType: "string" },
            government_area: { bsonType: "string" },
            market: { bsonType: "string" },
            country: { bsonType: "string" },
            country_code: { bsonType: "string" },
            location: {
              bsonType: "object",
              required: ["type", "coordinates", "is_location_exact"],
              properties: {
                type: { bsonType: "string" },
                coordinates: {
                  bsonType: "array",
                  items: { bsonType: "decimal" },
                },
                is_location_exact: { bsonType: "bool" },
              },
            },
          },
        },
        review_scores: {
          bsonType: "object",
          required: [
            "review_scores_accuracy",
            "review_scores_cleanliness",
            "review_scores_checkin",
            "review_scores_communication",
            "review_scores_location",
            "review_scores_value",
            "review_scores_rating",
          ],
          properties: {
            review_scores_accuracy: { bsonType: "int", maximum: 10 },
            review_scores_cleanliness: { bsonType: "int", maximum: 10 },
            review_scores_checkin: { bsonType: "int", maximum: 10 },
            review_scores_communication: {
              bsonType: "int",
              maximum: 10,
            },
            review_scores_location: { bsonType: "int", maximum: 10 },
            review_scores_value: { bsonType: "int", maximum: 10 },
            review_scores_rating: { bsonType: "int" },
          },
        },
        reviews: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: [
              "_id",
              "date",
              "listing_id",
              "reviewer_id",
              "reviewer_name",
              "comments",
            ],
            properties: {
              _id: { bsonType: "int" },
              date: { bsonType: "date" },
              listing_id: { bsonType: "int" },
              reviewer_id: { bsonType: "int" },
              reviewer_name: { bsonType: "string" },
              comments: { bsonType: "string" },
            },
          },
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "warn",
});

// (b)  Testear  la  regla  de validación generando dos casos de fallas en la regla de
// validación y un caso de éxito en la regla de validación. Aclarar en la entrega cuales
// son los casos y por qué fallan y cuales cumplen la regla de validación. Los casos no
// deben  ser  triviales,  es  decir  los  ejemplos  deben  contener  todos  los  campos
// especificados en la regla

db.listingsAndReviews.insertOne({
  name: "Cabana Bay Resort",
  amenities: ["TV", "Pool", "Washer"],
  address: {
    street: "Buena Vista Lake, Orlando, Florida",
    suburb: "",
    government_area: "Orlando, Florida",
    market: "Florida",
    country: "United States",
    country_code: "US",
    location: {
      type: "Point",
      coordinates: [-8.61308, 41.1413],
      is_location_exact: true,
    },
  },
  review_scores: {
    review_scores_accuracy: 9,
    review_scores_cleanliness: 9,
    review_scores_checkin: 10,
    review_scores_communication: 10,
    review_scores_location: 10,
    review_scores_value: 9,
    review_scores_rating: 70,
  },
  reviews: [
    {
      _id: "58634741",
      date: ISODate("2025-01-03T05:00:00.000Z"),
      listing_id: "10006546",
      reviewer_id: "51483345",
      reviewer_name: "Martina",
      comments: "Lindo lugar",
    },
  ],
});

//acá debería fallar coordinates con strings en el arreglo,
db.listingsAndReviews.insertOne({
  name: "Casa Rosa",
  amenities: ["TV", "Pool", "Washer"],
  address: {
    street: "Calle de las casas, Cordoba",
    suburb: "",
    government_area: "Cordoba, Argentina",
    market: "Cordoba",
    country: "Argentina",
    country_code: "AR",
    location: {
      type: "Point",
      coordinates: ["punto1", "punto2"],
      is_location_exact: true,
    },
  },
  review_scores: {
    review_scores_accuracy: null,
    review_scores_cleanliness: null,
    review_scores_checkin: null,
    review_scores_communication: null,
    review_scores_location: null,
    review_scores_value: null,
    review_scores_rating: null,
  },
  reviews: [
    {
      _id: "58634741",
      date: ISODate("2025-01-03T05:00:00.000Z"),
      listing_id: "10006546",
      reviewer_id: "51483345",
      reviewer_name: "Martina",
      comments: "Lindo lugar",
    },
  ],
});

//acá debería fallar amenities con un entero, suburb vacío, review_scores_rating vacío
db.listingsAndReviews.insertOne({
  name: "Flores Duplex",
  amenities: 123,
  address: {
    street: "Buena Vista Lake, Orlando, Florida",
    suburb: null,
    government_area: "Orlando, Florida",
    market: "Florida",
    country: "United States",
    country_code: "US",
    location: {
      type: "Point",
      coordinates: [-8.61308, 41.1413],
      is_location_exact: true,
    },
  },
  review_scores: {
    review_scores_accuracy: 9,
    review_scores_cleanliness: 9,
    review_scores_checkin: 10,
    review_scores_communication: 10,
    review_scores_location: 10,
    review_scores_value: 9,
    review_scores_rating: null,
  },
  reviews: [
    {
      _id: "58634741",
      date: ISODate("2025-01-03T05:00:00.000Z"),
      listing_id: "10006546",
      reviewer_id: "51483345",
      reviewer_name: "Martina",
      comments: "Lindo lugar",
    },
  ],
});
