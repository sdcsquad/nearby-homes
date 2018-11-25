DROP KEYSPACE IF EXISTS neighborhood;
DROP TABLE IF EXISTS neighborhood.homes;
CREATE KEYSPACE IF NOT EXISTS neighborhood WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1};
USE neighborhood;
CREATE TABLE IF NOT EXISTS neighborhood.homes (home_id int PRIMARY KEY, home_name text, dateOfPosting text, status text, numberOfLikes int, numberOfBathroom int, numberOfBedroom int, homeValue int, sqft int, streetName text, cityName text, stateName text, zipCode int, homeImage text);
COPY neighborhood.homes (home_id, home_name, dateOfPosting, status, numberOfLikes, numberOfBathroom, numberOfBedroom, homeValue, sqft, streetName, cityName, stateName, zipCode, homeImage) FROM '/Users/alexsheehan/Development/hackreactor/sdc/nearby-homes/database/homes.tsv' WITH DELIMITER = '\t' AND HEADER = false;
CREATE INDEX zip_index on neighborhood.homes (zipcode);
