CREATE TABLE
	IF NOT EXISTS continent (
		Name VARCHAR(150) NOT NULL PRIMARY KEY,
		Area INT,
		PercentTotalMass DECIMAL(5, 2),
		MostPopulousCity INT,
		FOREIGN KEY (MostPopulousCity) REFERENCES city (ID)
	) ENGINE = InnoDB;