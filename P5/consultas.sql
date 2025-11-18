-- Ejercicio 1: Cree una tabla de `directors` con las columnas: Nombre, Apellido, Número de Películas.
CREATE TABLE IF NOT EXISTS directors (
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    total_films INT
);

-- Ejercicio 2: El top 5 de actrices y actores de la tabla `actor` que tienen la mayor experiencia 
-- (i.e. el mayor número de películas filmadas) son también directores de las películas en las que participaron. 
-- Basados en esta información, inserten, utilizando una subquery, los valores correspondientes en la tabla `directors`.
INSERT INTO
    directors (first_name, last_name, total_films)
SELECT
    actor.first_name,
    actor.last_name,
    total_films
FROM
    (
        SELECT
            film_actor.actor_id,
            count(film_id) AS total_films
        FROM
            film_actor
        GROUP BY
            film_actor.actor_id
        ORDER BY
            total_films DESC
        LIMIT
            5
    ) AS top_5
    INNER JOIN actor
WHERE
    actor.actor_id = top_5.actor_id;

-- Ejercicio 3: Agregue una columna `premium_customer` que tendrá un valor 'T' o 'F' de acuerdo a 
--si el cliente es "premium" o no. Por defecto ningún cliente será premium.
ALTER TABLE
    customer
ADD
    premium_customer CHAR DEFAULT 'F';

-- Ejercicio 4: Modifique la tabla `customer`. Marque con 'T' en la columna `premium_customer` 
-- de los 10 clientes con mayor dinero gastado en la plataforma.
UPDATE
    customer
    JOIN (
        SELECT
            payment.customer_id
        FROM
            payment
        GROUP BY
            payment.customer_id
        ORDER BY
            sum(payment.amount) DESC
        LIMIT
            10
    ) AS top_10 ON customer.customer_id = top_10.customer_id
SET
    customer.premium_customer = 'T';

-- Ejercicio 5: Listar, ordenados por cantidad de películas (de mayor a menor), los distintos ratings de las películas existentes 
--(Hint: rating se refiere en este caso a la clasificación según edad: G, PG, R, etc).
SELECT
    rating,
    count(film_id) AS films
FROM
    film
GROUP BY
    rating
ORDER BY
    films DESC;

-- Ejercicio 6: ¿Cuáles fueron la primera y última fecha donde hubo pagos?
(
    SELECT
        payment_date
    FROM
        payment
    ORDER BY
        payment_date ASC
    LIMIT
        1
)
UNION
(
    SELECT
        payment_date
    FROM
        payment
    ORDER BY
        payment_date DESC
    LIMIT
        1
);

-- Ejercicio 7: Calcule, por cada mes, el promedio de pagos (Hint: vea la manera de extraer el nombre del mes de una fecha).
SELECT
    MONTHNAME(payment_date) AS MONTH,
    AVG(amount) AS average
FROM
    payment
GROUP BY
    MONTH;

-- Ejercicio 8: Listar los 10 distritos que tuvieron mayor cantidad de 
-- alquileres (con la cantidad total de alquileres).
SELECT
    address.district,
    count(*) AS rentals
FROM
    address
    LEFT JOIN (
        SELECT
            customer.address_id
        FROM
            rental
            INNER JOIN customer ON customer.customer_id = rental.customer_id
    ) AS customer_rentals ON (customer_rentals.address_id = address.address_id)
GROUP BY
    address.district
ORDER BY
    rentals DESC
LIMIT
    10;

-- Ejercicio 9: Modifique la tabla `inventory` agregando una columna `stock` que sea un número entero y represente la cantidad 
-- de copias de una misma película que tiene determinada tienda. El número por defecto debería ser 5 copias.
ALTER TABLE
    inventory
ADD
    stock INT DEFAULT 5;

-- Ejercicio 10: Cree un trigger `update_stock` que, cada vez que se agregue un nuevo registro a la tabla `rental`, 
-- haga un update en la tabla `inventory` restando una copia al stock de la película rentada 
-- (Hint: revisar que el `rental` no tiene información directa sobre la tienda, sino sobre el cliente, 
-- que está asociado a una tienda en particular).
DELIMITER / / CREATE TRIGGER update_stock
AFTER
INSERT
    ON rental FOR EACH ROW BEGIN
UPDATE
    inventory
SET
    stock = stock - 1
WHERE
    NEW.inventory_id = inventory.inventory_id
    AND inventory.stock > 0;

END / / DELIMITER;

-- Ejercicio 11: Cree una tabla `fines` que tenga dos campos: `rental_id` y `amount`. 
-- El primero es una clave foránea a la tabla `rental` y el segundo es un valor numérico con dos decimales.
DROP TABLE IF EXISTS fines;

CREATE TABLE IF NOT EXISTS fines (
    rental_id INT,
    amount DECIMAL(20, 2),
    FOREIGN KEY (rental_id) REFERENCES rental(rental_id)
);

DESCRIBE fines;

-- Ejercicio 12: Cree un procedimiento `check_date_and_fine` que 
-- revise la tabla `rental` y cree un registro en la tabla `fines` por cada `rental` 
-- cuya devolución (`return_date`) haya tardado más de 3 días (comparación con `rental_date`). 
-- El valor de la multa será el número de días de retraso multiplicado por 1.5.
DELIMITER / / CREATE PROCEDURE check_date_and_fine () BEGIN
INSERT INTO
    fines(rental_id, amount)
SELECT
    rental.rental_id,
    DATEDIFF(
        rental.return_date,
        DATE_ADD(rental.rental_date, INTERVAL 3 DAY)
    ) * 1.5
FROM
    rental
WHERE
    DATEDIFF(rental.return_date, rental.rental_date) > 3;

END / / DELIMITER;

CALL check_date_and_fine ();

SELECT
    *
FROM
    fines;

-- Ejercicio 13: Crear un rol `employee` que tenga acceso de inserción, eliminación y 
-- actualización a la tabla `rental`.
CREATE ROLE employee;

GRANT INSERT, DELETE, UPDATE ON rental to employee;

-- Ejercicio 14: Revocar el acceso de eliminación a `employee` y crear un rol `administrator` que 
-- tenga todos los privilegios sobre la BD `sakila`.

REVOKE DELETE ON rental FROM employee;

CREATE ROLE administrator;
GRANT ALL PRIVILEGES ON sakila.* to administrator;

-- Ejercicio 15: Crear dos roles de empleado. A uno asignarle los permisos de `employee` 
-- y al otro de `administrator`.

CREATE ROLE empleado1, empleado2;
GRANT employee TO empleado1;
GRANT administrator TO empleado2;
