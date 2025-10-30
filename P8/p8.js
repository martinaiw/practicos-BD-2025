use("mflix");

//Ejercicio 1 - Cantidad de cines (theaters) por estado.
db.theaters.aggregate([
  { $group: { _id: "$location.address.state", count: { $sum: 1 } } },
  { $project: { state: "$_id", count: 1, _id: 0 } }, //cambio el documento y renombro _id como state para que despues se imprima state: 'KA' y no se muestre id
  { $sort: { state: 1 } },
]);
