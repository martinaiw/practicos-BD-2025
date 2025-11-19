-- Ejercicio 1: Devuelva la oficina con mayor número de empleados.
SELECT
    *
FROM
    offices
WHERE
    officeCode = (
        SELECT
            officeCode
        FROM
            employees
        GROUP BY
            officeCode
        ORDER BY
            count(*) DESC
        LIMIT
            1
    );


-- Ejercicio 2: ¿Cuál es el promedio de órdenes hechas por oficina? 
-- ¿Qué oficina vendió la mayor cantidad de productos?
SELECT
    avg(count) AS averageSalesPerOffice
FROM
    (
        SELECT
            count(*) AS count
        FROM
            offices
            JOIN employees ON employees.officeCode = offices.officeCode
            JOIN customers ON customers.salesRepEmployeeNumber = employees.employeeNumber
            JOIN orders ON orders.customerNumber = customers.customerNumber
        GROUP BY
            offices.officeCode
    ) AS salesPerOffice;


SELECT
    offices.officeCode,
    count(*)           AS productsSold
FROM
    offices
    JOIN employees ON employees.officeCode = offices.officeCode
    JOIN customers ON customers.salesRepEmployeeNumber = employees.employeeNumber
    JOIN orders ON orders.customerNumber = customers.customerNumber
GROUP BY
    offices.officeCode
ORDER BY
    count(*) DESC
LIMIT
    1;


-- Ejercicio 3: Devolver el valor promedio, máximo y mínimo de pagos que se hacen por mes.
SELECT
    MONTHNAME(paymentDate) AS MONTH,
    avg(amount),
    max(amount),
    min(amount)
FROM
    payments
GROUP BY
    MONTH
ORDER BY
    MONTH(paymentDate);


-- Ejercicio 4: Crear un procedimiento "Update Credit" en donde se modifique el límite de 
-- crédito de un cliente con un valor pasado por parámetro.
DELIMITER / /
CREATE PROCEDURE Update_Credit (
    IN newCreditLimit decimal(10, 2),
    IN customerID INT
) BEGIN
UPDATE customers
SET
    creditLimit = newCreditLimit
WHERE
    customers.customerNumber = customerID;


END / / DELIMITER;


-- Ejercicio 5: Cree una vista "Premium Customers" que devuelva el top 10 de clientes que más 
-- dinero han gastado en la plataforma. La vista deberá devolver el nombre del cliente, la ciudad 
-- y el total gastado por ese cliente en la plataforma.
CREATE VIEW
    Premium_Customers AS
SELECT
    customers.customerName,
    customers.city,
    SUM(payments.amount)   AS total_spent
FROM
    customers
    JOIN payments ON customers.customerNumber = payments.customerNumber
GROUP BY
    customers.customerNumber,
    customers.city
ORDER BY
    total_spent DESC
LIMIT
    10;


-- Ejercicio 6: Cree una función "employee of the month" que tome un mes y un año y devuelva el empleado
-- (nombre y apellido) cuyos clientes hayan efectuado la mayor cantidad de órdenes en ese mes.
DELIMITER / /
CREATE FUNCTION employee_of_the_month (p_month INT, p_year YEAR) RETURNS VARCHAR(100) reads SQL data BEGIN DECLARE result VARCHAR(100);


SELECT
    CONCAT_WS(" ", e.firstName, e.lastName) INTO result
FROM
    employees e
    JOIN customers c ON e.employeeNumber = c.salesRepEmployeeNumber
    JOIN orders o ON c.customerNumber = o.customerNumber
WHERE
    YEAR(o.orderDate) = p_year
    AND MONTH(o.orderDate) = p_month
GROUP BY
    e.employeeNumber
ORDER BY
    count(*) DESC
LIMIT
    1;


RETURN result;


END / / DELIMITER;


-- Ejercicio 7: Crear una nueva tabla "Product Refillment". Deberá tener una relación varios a uno con "products" y los campos: `refillmentID`, `productCode`, `orderDate`, `quantity`.
DROP TABLE productRefillment;


CREATE TABLE IF NOT EXISTS
    productRefillment (
        refillmentID INT NOT NULL AUTO_INCREMENT,
        productCode VARCHAR(15),
        orderDate DATE,
        quantity INT,
        PRIMARY KEY (refillmentID, productCode),
        FOREIGN KEY (productCode) REFERENCES products (productCode)
    );


DESCRIBE productRefillment;


-- Ejercicio 8: Definir un trigger "Restock Product" que esté pendiente de los cambios efectuados en 
-- `orderdetails` y cada vez que se agregue una nueva orden revise la cantidad de productos 
-- pedidos (`quantityOrdered`) y compare con la cantidad en stock (`quantityInStock`) y, si es menor a 10, 
-- genere un pedido en la tabla "Product Refillment" por 10 nuevos productos.
DELIMITER / /
CREATE TRIGGER restockProduct AFTER
INSERT
    ON orderdetails FOR EACH ROW BEGIN IF(
        EXISTS (
            SELECT
                1
            FROM
                products
            WHERE
                new.productCode = products.productCode
                AND products.quantityInStock - new.quantityInStock < 10
        )
    ) THEN
INSERT INTO
    productRefillment (productCode, orderDate, quantity)
VALUES
    (new.productCode, CURRENT_TIMESTAMP(), 10);


END IF;


END / / DELIMITER;


-- Ejercicio 9: Crear un rol "Empleado" en la BD que establezca accesos de lectura a todas las 
-- tablas y accesos de creación de vistas.
CREATE ROLE Empleado;


GRANT
SELECT
,
CREATE VIEW
    ON classicmodels.* TO Empleado;


-- Consulta adicional 1: Encontrar, para cada cliente de aquellas ciudades que comienzan por 'N', 
-- la menor y la mayor diferencia en días entre las fechas de sus pagos. No mostrar el id del cliente, 
-- sino su nombre y el de su contacto.
SELECT
    customerName,
    contactFirstName,
    MAX(paymentDateDiff),
    MIN(paymentDateDiff)
FROM
    customers
    JOIN (
        SELECT
            DATEDIFF(p1.paymentDate, p2.paymentDate) AS paymentDateDiff,
            p1.customerNumber
        FROM
            payments AS p1
            JOIN payments AS p2 ON p1.customerNumber = p2.customerNumber
        WHERE
            p1.paymentDate > p2.paymentDate
    ) AS diffs ON customers.customerNumber = diffs.customerNumber
WHERE
    city LIKE 'N%'
GROUP BY
    customerName,
    contactFirstName,
    customers.customerNumber;


-- Consulta adicional 2: Encontrar el nombre y la cantidad vendida total de los 10 productos más vendidos 
-- que, a su vez, representen al menos el 4% del total de productos, contando unidad por unidad, de todas 
-- las órdenes donde intervienen. No utilizar LIMIT.
SELECT
    p.productName,
    SUM(od.quantityOrdered) as soldUnits
FROM
    orderdetails AS od
    JOIN products as p ON p.productCode = od.productCode
HAVING
    soldUnits >= 0.04 * (
        SELECT
            SUM(quantityOrdered) as totalSoldUnits
        FROM
            orderdetails
    )
WHERE
    10 > (
        SELECT
            COUNT(DISTINCT t2.productName)
        FROM
            orderdetails as t2
        WHERE
            t2.soldUnits > t1.soldUnits
    )
GROUP BY
    p.productCode
ORDER BY
    soldUnits DESC

    --!!!!INCOMPLETO, está duraso este ej