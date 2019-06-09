

CREATE TABLE Categories (
	cID			INT		IDENTITY(1,1)	PRIMARY KEY ,
	cName		TEXT	NOT NULL,
);

CREATE TABLE Points(
	pID			    INT		IDENTITY(1,1) PRIMARY KEY,
	pName		    TEXT	NOT NULL,
	details		    TEXT	NOT NULL,
	cID			    INT		NOT NULL FOREIGN KEY REFERENCES Categories(cID)	ON UPDATE CASCADE ON DELETE CASCADE,
	pRank		    FLOAT	default 3,
	picture		    TEXT	,
	viewed_counter  int     default 0
);

CREATE TABLE Questions (
	qID			INT		IDENTITY(1,1) PRIMARY KEY ,
	question	TEXT	NOT NULL,
);

CREATE TABLE Users (
	uName		varchar(8)	NOT NULL PRIMARY KEY ,
	pass		varchar(10)	NOT NULL,
	fName		TEXT		NOT NULL,
	lName		TEXT		NOT NULL,
	city		TEXT		NOT NULL,
	country		TEXT		NOT NULL,
	email		TEXT		NOT NULL,
);

CREATE TABLE Users_Categories (
    uName		varchar(8)		FOREIGN KEY REFERENCES Users(uName)		    ON UPDATE CASCADE ON DELETE CASCADE,
    cID			INT		        FOREIGN KEY REFERENCES Categories(cID)		ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(uName, cID)
);

CREATE TABLE Users_Questions (
    uName		varchar(8)		FOREIGN KEY REFERENCES Users(uName)		    ON UPDATE CASCADE ON DELETE CASCADE,
    qID     	INT			    FOREIGN KEY REFERENCES Questions(qID)       ON UPDATE CASCADE ON DELETE CASCADE,
    answer		TEXT		    NOT NULL
    PRIMARY KEY(uName, qID)
);


CREATE TABLE Users_Points (
	uName		varchar(8)		FOREIGN KEY REFERENCES Users(uName)		ON UPDATE CASCADE ON DELETE CASCADE,
	pID			INT		        FOREIGN KEY REFERENCES Points(pID)		ON UPDATE CASCADE ON DELETE CASCADE,
	insertTime  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
	savePosition INT            DEFAULT 0
	PRIMARY KEY(uName, pID)
);


CREATE TABLE Reviews (
	uName		varchar(8)	FOREIGN KEY REFERENCES Users(uName)		ON UPDATE CASCADE ON DELETE CASCADE,
	pID			INT		    FOREIGN KEY REFERENCES Points(pID)		ON UPDATE CASCADE ON DELETE CASCADE,
	content		TEXT	    ,
	score		INT		    NOT NULL,
	time_stamp  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT  SCORE_CON   check (score between 1 and 5),
	PRIMARY KEY(uName, pID)
);






