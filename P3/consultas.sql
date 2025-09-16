-- Ejercicio 1
SELECT
    city.Name as "City",
    country.Name as "Country",
    country.Region,
    country.GovernmentForm
FROM
    country
    INNER JOIN city ON city.CountryCode = country.Code
ORDER BY
    city.Population DESC
LIMIT 10;

-- Ejercicio 2
SELECT
    country.Name as "Country",
    city.Name as "Capital"
FROM
    country
    LEFT JOIN city ON city.ID = country.Capital
ORDER BY
    city.Population ASC
LIMIT 10;

-- Ejercicio 3
SELECT
    country.Name as "Country",
    country.Continent,
    countrylanguage.Language
FROM
    country
    INNER JOIN countrylanguage ON countrylanguage.IsOfficial = "T"
    AND countrylanguage.CountryCode = country.Code;

-- Ejercicio 4
SELECT
    city.Name as "Capital",
    country.Name as "Country"
FROM
    country
    INNER JOIN city ON city.ID = country.Capital
ORDER BY
    country.SurfaceArea DESC
LIMIT
    20;

-- Ejercicio 5
SELECT
    city.Name as "Country",
    countrylanguage.Language,
    countrylanguage.Percentage
FROM
    city
    INNER JOIN countrylanguage ON countrylanguage.IsOfficial = "T"
    AND countrylanguage.CountryCode = city.CountryCode
ORDER BY
    city.Population DESC;

-- Ejercicio 6
SELECT
    Name as "Country"
FROM
    (
        SELECT
            Name
        FROM
            country
        WHERE
            Population >= 100
        ORDER BY
            Population DESC
        LIMIT
            10
    ) as max_pop
UNION
SELECT
    Name as "Country"
FROM
    (
        SELECT
            Name
        FROM
            country
        WHERE
            Population >= 100
        ORDER BY
            Population ASC
        LIMIT
            10
    ) as min_pop;

-- Ejercicio 7
SELECT
    Name as "Country"
FROM
    (
        SELECT
            country.Name,
            countrylanguage.Language
        FROM
            country
            INNER JOIN countrylanguage ON countrylanguage.CountryCode = country.Code
            AND countrylanguage.IsOfficial = "T"
        WHERE
            countrylanguage.Language = "English"
    ) as eng_lang
INTERSECT
SELECT
    Name as "Country"
FROM
    (
        SELECT
            country.Name,
            countrylanguage.Language
        FROM
            country
            INNER JOIN countrylanguage ON countrylanguage.CountryCode = country.Code
            AND countrylanguage.IsOfficial = "T"
        WHERE
            countrylanguage.Language = "French"
    ) as fre_lang;

-- INTERSECT no funciona en todas las versiones de MySQL
-- Versión ATP optimizada
-- SELECT
--     country.Name AS "Country"
-- FROM
--     country
--     INNER JOIN countrylanguage ON countrylanguage.CountryCode = country.Code
--     AND countrylanguage.IsOfficial = "T"
-- WHERE
--     countrylanguage.Language IN ('English', 'French')
-- GROUP BY
--     country.Name
-- HAVING
--     COUNT(DISTINCT countrylanguage.Language) = 2;

-- Ejercicio 8
SELECT
    Name as "Country"
FROM
    (
        SELECT DISTINCT
            country.Name
        FROM
            country
            INNER JOIN countrylanguage ON countrylanguage.CountryCode = country.Code
        WHERE
            countrylanguage.Language = "English"
            AND countrylanguage.Percentage > 0
    ) as eng_speakers
EXCEPT
SELECT
    Name as "Country"
FROM
    (
        SELECT DISTINCT
            country.Name
        FROM
            country
            INNER JOIN countrylanguage ON countrylanguage.CountryCode = country.Code
            AND countrylanguage.IsOfficial = "T"
        WHERE
            countrylanguage.Language = "Spanish"
            AND countrylanguage.Percentage > 0
    ) as spa_lang;

-- EXCEPT tampoco anda en todos lados
-- Consulta optimizada
-- SELECT DISTINCT
--     country.Name AS "Country"
-- FROM
--     country
--     INNER JOIN countrylanguage cl1 ON cl1.CountryCode = country.Code
-- WHERE
--     cl1.Language = 'English'
--     AND cl1.Percentage > 0
--     AND country.Name NOT IN (
--         SELECT
--             country.Name
--         FROM
--             country
--             INNER JOIN countrylanguage cl2 ON cl2.CountryCode = country.Code
--         WHERE
--             cl2.Language = 'Spanish'
--             AND cl2.Percentage > 0
--     );


-- Parte 2
-- 1) ¿Devuelven los mismos valores las siguientes consultas? ¿Por qué?
-- Sí, devuelven lo mismo. La primera filtra directamente como condición
-- del join que el pais sea argentina
-- La segunda filtra con el join todos los paises y después muestra los que 
-- son = 'Argentina'
-- SELECT city.Name, country.Name
-- FROM city
-- INNER JOIN country ON city.CountryCode = country.Code AND country.Name =
-- 'Argentina';
-- SELECT city.Name, country.Name
-- FROM city
-- INNER JOIN country ON city.CountryCode = country.Code
-- WHERE country.Name = 'Argentina';

-- 2) ¿Y si en vez de INNER JOIN fuera un LEFT JOIN?
-- SELECT city.Name, country.Name
-- FROM city
-- LEFT JOIN country ON city.CountryCode = country.Code AND country.Name =
-- 'Argentina';
-- SELECT city.Name, country.Name
-- FROM city
-- LEFT JOIN country ON city.CountryCode = country.Code
-- WHERE country.Name = 'Argentina';

-- La primera consulta devuelve todas las ciudades además de las de Argentina, 
-- solo que las que no son de Argentina, no devuelve el pais
-- Esto es porque muestra todo lo de city y lo de country que cumpla con tenes country.Name = 'Argentina'
-- La segunda consulta funciona igual que un INNER JOIN