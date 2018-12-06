



CREATE DATABASE domain;

CREATE TABLE user(
    id varchar(50) not null,
    pw varchar(50) not null,
    point int(10) not null,
    PRIMARY KEY(id)
);

CREATE TABLE itemdes(
  itemID int(10) not null,
  category varchar(200),
  keyword varchar(200),
  picture varchar(200), 
  name varchar(200),
  leftQuan int(20),
  deposit int(20),
  lenderID varchar(50) not null,
  policy varchar(200),
  term int(20),
  location varchar(200),
  rentalFee0 int(20),
  rentalFee1 int(20),
  rentalFee2 int(20),
  rentalFee3 int(20),
  rentalFee4 int(20),
  PRIMARY KEY(itemID),
  FOREIGN KEY(lenderID) REFERENCES user(id)
);


CREATE TABLE item(
  sn int(10) not null,
  status int(10) not null,
  PRIMARY KEY(sn)
);

CREATE TABLE itemdes_item(
  itemID int(10) not null,
  sn int(10) not null,
  borrowable int(2) not null,
  PRIMARY KEY(itemID,sn),
  FOREIGN KEY(itemID) REFERENCES itemdes(itemID),
  FOREIGN KEY(sn) REFERENCES item(sn)
);

CREATE TABLE rentalservice(
  rentalID int(10) not null,
  rentalFee int(10) not null,
  rentalTerm int(10) not null,
  borrowingLocation varchar(100) not null,
  datetime datetime,
  borrowerID varchar(100) not null,
  PRIMARY KEY(rentalID),
  FOREIGN KEY(borrowerID) REFERENCES user(id)
)

CREATE TABLE rentalitemlist(
  rentalID int(10) not null,
  sn int(10) not null,
  PRIMARY KEY(rentalID,sn),
  FOREIGN KEY(rentalID) REFERENCES rentalservice(rentalID),
  FOREIGN KEY(sn) REFERENCES item(sn)
)



INSERT INTO user VALUES('lender','1234',1000);