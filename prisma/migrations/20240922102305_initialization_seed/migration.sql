INSERT INTO "Action"
(id, "name", description, "createdAt", "updatedAt", "createdById", "updatedById")
VALUES(0, 'all', 'Can invoke', 'NOW()', 'NOW()', NULL, NULL);

INSERT INTO "Action"
( "name", description, "createdAt", "updatedAt", "createdById", "updatedById")
VALUES('user.read', 'Read all users', 'NOW()', 'NOW()', NULL, NULL);

INSERT INTO "Action"
( "name", description, "createdAt", "updatedAt", "createdById", "updatedById")
VALUES('user.write', 'Create, update, delete all users', 'NOW()', 'NOW()', NULL, NULL);

INSERT INTO "Action"
( "name", description, "createdAt", "updatedAt", "createdById", "updatedById")
VALUES('bookmark.read', 'Read all bookmarks', 'NOW()', 'NOW()', NULL, NULL);

INSERT INTO "Action"
( "name", description, "createdAt", "updatedAt", "createdById", "updatedById")
VALUES('bookmark.write', 'Create, update, delete all bookmarks', 'NOW()', 'NOW()', NULL, NULL);

INSERT INTO "Role"
(id, "name", description, "actionsIds", "createdAt", "updatedAt", "createdById", "updatedById")
VALUES(0, 'System', 'System User', '{0}', 'NOW()', 'NOW()', NULL, NULL);

INSERT INTO "Role"
("name", description, "actionsIds", "createdAt", "updatedAt", "createdById", "updatedById")
VALUES('Admin', 'Admin User', '{1, 2, 3, 4}', 'NOW()', 'NOW()', NULL, NULL);

INSERT INTO "Role"
("name", description, "actionsIds", "createdAt", "updatedAt", "createdById", "updatedById")
VALUES('User', 'Normal user. No Actions means they can only access their resources', NULL, 'NOW()', 'NOW()', NULL, NULL);