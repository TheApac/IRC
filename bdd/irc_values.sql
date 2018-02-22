
INSERT INTO `Role`(`Name` , `RenamingChannel`, `DeletingChannel`)
VALUES
('owner', TRUE, TRUE),
('admin', TRUE, TRUE),
('user', FALSE, FALSE),
('advanced-user', TRUE, FALSE);
