-- Ejercicio 1
SELECT Name, Region FROM country ORDER BY Name ASC;

-- Ejercicio 2
SELECT Name, Population FROM country ORDER BY Population DESC LIMIT 1,10;

-- Ejercicio 3
SELECT Name, Region, SurfaceArea, GovernmentForm FROM country ORDER BY SurfaceArea ASC LIMIT 1,10;

-- Ejercicio 4
SELECT Name, GovernmentForm FROM country WHERE GovernmentForm NOT LIKE '%Republic%' AND GovernmentForm NOT LIKE '%Fede&' AND GovernmentForm
NOT LIKE '%Indep%';

-- Ejercicio 5
SELECT Language, Percentage FROM countrylanguage WHERE IsOfficial = 'T' ORDER BY Language ASC;

-- Ejercicio 6
SELECT Language, Percentage FROM countrylanguage WHERE CountryCode='AIA'; --para ver lo que hay antes de actualizar
UPDATE countrylanguage SET Percentage = 100.0 WHERE CountryCode = 'AIA';
SELECT Language, Percentage FROM countrylanguage WHERE CountryCode='AIA'; --para ver lo que hay despues de actualizar

-- Ejercicio 7
SELECT Name FROM city WHERE District = 'Córdoba' AND CountryCode = 'ARG';

-- Ejercicio 8
SELECT Name FROM city WHERE District = 'Córdoba' AND CountryCode != 'ARG'; --para ver lo que hay antes de borrar
DELETE FROM city WHERE District = 'Córdoba' AND CountryCode != 'ARG';
SELECT Name FROM city WHERE District = 'Córdoba' AND CountryCode != 'ARG'; --para ver lo que hay despues de borrar

-- Ejercicio 9
SELECT Name, HeadOfState FROM country WHERE HeadOfState LIKE '%John%';

-- Ejercicio 10
SELECT Name, Population FROM country WHERE Population/1000000 > 35 AND Population/1000000 < 45 ORDER BY Population
DESC;

-- Ejercicio 11

--El campo country.Continent repite información ya contenida en la tabla continent. (El nombre del continente)
--En continent.MostPopulousCity se almacena el nombre de la ciudad en texto, lo que duplica información que ya existe en city.
--La relación country.Capital y city.CountryCode puede generar redundancia si no se valida consistencia.
--En countrylanguage podrían cargarse idiomas repetidos con distinta escritura si no se normaliza el valor.

