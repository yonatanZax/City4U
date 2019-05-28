insert into Questions
(question)
values
('What is your dogs name?'),
('What is your favorite movie?'),
('What is your favorite color?'),
('In what city were you born?');

insert into Users
VALUES
    ('a','a','a','a','a','a','a'),
    ('b','b','b','b','b','b','b');

insert into Users_Categories
VALUES
('a',1),
('a',2),
('b',1),
('b',2);

insert into Users_Questions
VALUES
('a',1, 'answer'),
('a',2, 'answer'),
('b',1, 'answer'),
('b',2, 'answer');


insert into Users_Points
(uName, pID)
VALUES
('a', 10);

insert into Users_Points
(uName, pID)
VALUES
('a', 11);

insert into Reviews
(uName, pID, content, score)
VALUES
('a', 10, 'I am Groot', 3),
('b', 10, 'I am Groot', 3);
