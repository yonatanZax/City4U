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
    ('bruce','bruce','Bruce','Banner','Boston','Bolivia','bruce@fake.com'),
    ('tony','tony','Tony','Stark','New York','USA','tony@fake.com'),
    ('natasha','natasha','Natasha','Romonov','New York','USA','natasha@fake.com'),
    ('thor','thor','Thor','Son of Odin','Asgard','USA','thor@fake.com'),
    ('steve','steve','Steve','Rogers','New York','USA','steve@fake.com');

insert into Users_Categories
VALUES
('a',1),
('a',2),
('bruce',3),
('bruce',2),
('tony',4),
('tony',2),
('natasha',3),
('natasha',4),
('thor',1),
('thor',3),
('steve',1),
('steve',4);


insert into Users_Questions
VALUES
('a',1, 'answer'),
('a',2, 'answer'),
('bruce',2, 'answer'),
('bruce',4, 'answer'),
('tony',2, 'answer'),
('tony',1, 'answer'),
('natasha',2, 'answer'),
('natasha',4, 'answer'),
('thor',1, 'answer'),
('thor',3, 'answer'),
('steve',2, 'answer'),
('steve',4, 'answer');


insert into Users_Points
(uName, pID)
VALUES
('a', 10),
('a', 11),
('bruce', 17),
('bruce', 26),
('tony', 19),
('tony', 18),
('natasha', 14),
('natasha', 12),
('thor', 24),
('thor', 28),
('steve', 29),
('steve', 22);

-- insert into Users_Points
-- (uName, pID)
-- VALUES
-- ('a', 11);

insert into Reviews
(uName, pID, content, score)
VALUES
('a', 10, 'I am Groot', 3),
('a', 11, 'I am Groot', 3),
('bruce', 12, 'I am Groot', 3),
('steve', 14, 'I am Groot', 3),
('steve', 16, 'I am Groot', 3),
('tony', 18, 'I am Groot', 3),
('natasha', 20, 'I am Groot', 3),
('tony', 22, 'I am Groot', 3),
('thor', 23, 'I am Groot', 3),
('a', 25, 'I am Groot', 3),
('bruce', 28, 'I am Groot', 3),
('bruce', 10, 'I am Groot', 3);
