insert into Questions
(question)
values
('What is your dogs name?'),
('What is your favorite movie?');

insert into Users
VALUES
    ('a','a','a','a','a','a','a',1,'a'),
    ('b','b','b','b','b','b','b',2,'b');

insert into Users_Categories
VALUES
('a',1),
('a',2),
('b',1),
('b',2);

insert into Users_Points
(uName, pID)
VALUES
('a', 10);

insert into Reviews
(uName, pID, content, score)
VALUES
('a', 10, 'I am Groot', 4),
('b', 10, 'I am Groot', 3);
