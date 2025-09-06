CREATE TABLE
	IF NOT EXISTS country (
		Code VARCHAR(150) NOT NULL PRIMARY KEY,
		Name VARCHAR(150),
		Continent VARCHAR(150),
		Region VARCHAR(150),
		SurfaceArea INT,
		IndepYear INT,
		Population INT,
		LifeExpectancy INT,
		GNP INT,
		GNPOld INT,
		LocalName VARCHAR(150),
		GovernmentForm VARCHAR(150),
		HeadOfState VARCHAR(150),
		Capital INT,
		Code2 VARCHAR(150)
	);

CREATE TABLE
	IF NOT EXISTS city (
		ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		Name VARCHAR(150),
		CountryCode VARCHAR(150),
		District VARCHAR(150),
		Population INT,
		FOREIGN KEY (CountryCode) REFERENCES country (Code)
	) ENGINE = InnoDB;

CREATE TABLE
	IF NOT EXISTS countrylanguage (
		CountryCode VARCHAR(150) NOT NULL,
		Language VARCHAR(150) NOT NULL,
		IsOfficial VARCHAR(1),
		Percentage DECIMAL(5, 2),
		FOREIGN KEY (CountryCode) REFERENCES country (Code),
		PRIMARY KEY (CountryCode, Language)
	) ENGINE = InnoDB;