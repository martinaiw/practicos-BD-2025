-- Ejercicio 1: Listar el nombre de la ciudad y el nombre del país de todas las ciudades que pertenezcan a países con una población menor a 10000 habitantes.
SELECT
    city.Name AS "City",
    country.Name AS "Country"
FROM
    city
    INNER JOIN country ON city.CountryCode = country.Code
WHERE
    country.Population < 10000;

-- Ejercicio 2: Listar todas aquellas ciudades cuya población sea mayor que la población promedio entre todas las ciudades.
SELECT
    city.Name AS "City"
FROM
    city
WHERE
    city.Population > ALL (
        SELECT
            AVG(city.Population)
        FROM
            city
    );

-- Ejercicio 3: Listar todas aquellas ciudades no asiáticas cuya población sea igual o mayor a la población total de algún país de Asia.
SELECT
    city.Name
FROM
    city
    INNER JOIN country ON city.CountryCode = country.Code
WHERE
    country.Continent NOT IN ("Asia")
    AND city.Population >= SOME (
        SELECT
            Population
        FROM
            country
        WHERE
            country.Continent = "Asia"
    );

-- Ejercicio 4: Listar aquellos países junto a sus idiomas no oficiales, que superen en porcentaje de hablantes a cada uno de los idiomas oficiales del país.
SELECT
    c.Name,
    cl.Language
FROM
    country AS c
    INNER JOIN countrylanguage AS cl ON c.Code = cl.CountryCode
WHERE
    cl.IsOfficial = "F"
    AND cl.Percentage > ALL (
        SELECT
            cl2.Percentage
        FROM
            countrylanguage AS cl2
        WHERE
            cl2.CountryCode = c.code
            AND cl2.IsOfficial = "T"
    );

-- Ejercicio 5: Listar (sin duplicados) aquellas regiones que tengan países con una superficie menor a 1000 km2 y exista (en el país) al menos una ciudad con más de 100000 habitantes. (Hint: Esto puede resolverse con o sin una subquery, intenten encontrar ambas respuestas).
SELECT
    co.Region
FROM
    country AS co
    INNER JOIN city AS ci ON co.Code = ci.CountryCode
WHERE
    co.SurfaceArea < 1000
    AND ci.Population > 100000;

SELECT
    co.Region
FROM
    country AS co
WHERE
    co.SurfaceArea < 1000
    AND (
        SELECT
            Population
        FROM
            city
        WHERE
            Population > 100000
    );

-- Ejercicio 6: Listar el nombre de cada país con la cantidad de habitantes de su ciudad más poblada. (Hint: Hay dos maneras de llegar al mismo resultado. Usando consultas escalares o usando agrupaciones, encontrar ambas).
SELECT
    Name,
    (
        SELECT
            MAX(Population)
        FROM
            city
        WHERE
            city.CountryCode = country.Code
    ) AS 'Most populated city'
FROM
    country
ORDER BY
    Name ASC
LIMIT
    10;

SELECT
    country.Name,
    MAX(city.Population)
FROM
    country
    JOIN city ON country.Code = city.CountryCode
GROUP BY
    country.Name
ORDER BY
    country.Name
LIMIT
    10;

-- Ejercicio 7: Listar aquellos países y sus lenguajes no oficiales cuyo porcentaje de hablantes sea mayor al promedio de hablantes de los lenguajes oficiales.
SELECT
    (
        SELECT
            Name
        FROM
            country
        WHERE
            country.Code = countrylanguage.CountryCode
    ) AS 'Country',
    Language
FROM
    countrylanguage
WHERE
    IsOfficial = 'F'
    AND Percentage > (
        SELECT
            AVG(Percentage)
        FROM
            countrylanguage
        WHERE
            IsOfficial = 'T'
    );

-- Ejercicio 8: Listar la cantidad de habitantes por continente ordenado en forma descendente.
SELECT
    Continent,
    SUM(Population) AS total_population_per_continent
FROM
    country
GROUP BY
    Continent
ORDER BY
    total_population_per_continent DESC;

-- Ejercicio 9: Listar el promedio de esperanza de vida (LifeExpectancy) por continente con una esperanza de vida entre 40 y 70 años.
SELECT
    Continent,
    AVG(LifeExpectancy) AS avg
FROM
    country
GROUP BY
    Continent
HAVING
    avg BETWEEN 40
    AND 70
ORDER BY
    Continent;

-- Ejercicio 10: Listar la cantidad máxima, mínima, promedio y suma de habitantes por continente.
SELECT
    Continent,
    SUM(Population) AS sum,
    AVG(Population) AS avg,
    MAX(Population) AS max,
    MIN(Population) AS min
FROM
    country
GROUP BY
    Continent
ORDER BY
    Continent DESC;