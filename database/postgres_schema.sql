DROP DATABASE neighborhood;
CREATE DATABASE neighborhood;
\c neighborhood;

DROP SCHEMA neighborhood;
CREATE SCHEMA if not exists neighborhood;

DROP TABLE neighborhood.homes;
CREATE TABLE if not exists neighborhood.homes (
  home_id INT NOT NULL PRIMARY KEY,
  home_name TEXT NOT NULL,
  dateOfPosting TEXT NOT NULL,
  status TEXT NOT NULL,
  numberOfLikes INT NOT NULL,
  numberOfBathroom INT NOT NULL,
  numberOfBedroom INT NOT NULL,
  homeValue INT NOT NULL,
  sqft INT NOT NULL,
  streetName TEXT NOT NULL,
  cityName TEXT NOT NULL,
  stateName TEXT NOT NULL,
  zipCode INT NOT NULL,
  homeImage TEXT NOT NULL
);

\COPY neighborhood.homes(home_id, home_name, dateOfPosting, status, numberOfLikes, numberOfBathroom, numberOfBedroom, homeValue, sqft, streetName, cityName, stateName, zipCode, homeImage) FROM '/Users/alexsheehan/Development/hackreactor/sdc/nearby-homes/database/homes1.tsv'

CREATE INDEX zip_index ON neighborhood.homes (zipcode);
