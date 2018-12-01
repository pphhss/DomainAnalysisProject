



CREATE DATABASE domain;

CREATE TABLE user(
    id varchar(50) not null,
    pw varchar(50) not null,
    point int(10) not null,
    PRIMARY KEY(id)
);


INSERT INTO user VALUES('lender','1234',1000);