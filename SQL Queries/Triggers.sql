CREATE or alter TRIGGER insertUserPoints
    on Users_Points
    AFTER INSERT
    as BEGIN
    UPDATE Users_Points set savePosition = 1 + (select max(Users_Points.savePosition)
                                            FROM Users_Points, inserted
                                            WHERE (Users_Points.uName = inserted.uName AND Users_Points.pID = inserted.pID));
end


-- CREATE TRIGGER pointsRank
--     on Reviews
--     AFTER INSERT, DELETE
--     as begin
--         IF EXISTS (SELECT 1 FROM inserted)
--             BEGIN
--                 UPDATE Points
--                 SET Points.pRank = (
--                     SELECT AVG(Reviews.score)
--                     From Reviews, inserted
--                     WHERE (Reviews.pID = inserted.pID)
--                 )
--                 WHERE (Points.pID = inserted.pID)
--             END
--
--         IF EXISTS (SELECT 1 FROM deleted)
--             BEGIN
--                 UPDATE Points
--                 SET Points.pRank = (
--                     SELECT AVG(Reviews.score)
--                     From Reviews, deleted
--                     WHERE (Reviews.pID = deleted.pID)
--                 )
--                 WHERE (Points.pID = deleted.pID)
--             END
-- end