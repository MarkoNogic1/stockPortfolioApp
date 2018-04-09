DROP database if EXISTS DatabaseProject_Winter2017;
DROP database if EXISTS Test_StocksDB;

CREATE database Test_StocksDB;

USE Test_StocksDB;

CREATE TABLE User_Information(
	username varchar(45) NOT NULL,
    email varchar(45) NOT NULL,
    pass  BINARY(60) NOT NULL,
    
	PRIMARY KEY(username)
 );

CREATE TABLE Users(

	username varchar(45) NOT NULL,
    fname varchar(45) NOT NULL,
    lname varchar(45) NOT NULL,
    
    PRIMARY KEY(username)
);

