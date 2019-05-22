CREATE TABLE Categories (
	cID			INT		IDENTITY(1,1)	PRIMARY KEY ,
	cName		TEXT	NOT NULL,
);

CREATE TABLE Points(
	pID			INT		IDENTITY(1,1) PRIMARY KEY,
	pName		TEXT	NOT NULL,
	details		TEXT	NOT NULL,
	cID			INT		NOT NULL FOREIGN KEY REFERENCES Categories(cID)	ON UPDATE CASCADE ON DELETE CASCADE,
	pRank		FLOAT	default 3,
	picture		IMAGE	,
);

CREATE TABLE Questions (
	qID			INT		IDENTITY(1,1) PRIMARY KEY ,
	question	TEXT	NOT NULL,
);

CREATE TABLE Users (
	uName		varchar(20)	NOT NULL PRIMARY KEY ,
	pass		TEXT		NOT NULL,
	fName		TEXT		NOT NULL,
	lName		TEXT		NOT NULL,
	city		TEXT		NOT NULL,
	country		TEXT		NOT NULL,
	email		TEXT		NOT NULL,
	question	INT			FOREIGN KEY REFERENCES Questions(qID) ON UPDATE CASCADE ON DELETE CASCADE,
	answer		TEXT		NOT NULL,
);

CREATE TABLE Users_Categories (
    uName		varchar(20)		FOREIGN KEY REFERENCES Users(uName)		    ON UPDATE CASCADE ON DELETE CASCADE,
    cID			INT		        FOREIGN KEY REFERENCES Categories(cID)		ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(uName, cID)
);

CREATE TABLE Users_Points (
	uName		varchar(20)		FOREIGN KEY REFERENCES Users(uName)		ON UPDATE CASCADE ON DELETE CASCADE,
	pID			INT		        FOREIGN KEY REFERENCES Points(pID)		ON UPDATE CASCADE ON DELETE CASCADE,
	insertTime  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
	savePosition INT            IDENTITY(1,1)
	PRIMARY KEY(uName, pID)
);


CREATE TABLE Reviews (
	uName		varchar(20)	FOREIGN KEY REFERENCES Users(uName)		ON UPDATE CASCADE ON DELETE CASCADE,
	pID			INT		    FOREIGN KEY REFERENCES Points(pID)		ON UPDATE CASCADE ON DELETE CASCADE,
	content		TEXT	    ,
	score		INT		    NOT NULL,
	CONSTRAINT SCORE_CON check (score between 1 and 5),
	PRIMARY KEY(uName, pID)

);




