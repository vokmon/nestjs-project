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

-- INSERT INTO "User"
-- (id, email, "password", "firstName", "lastName", "createdAt", "updatedAt", "createdById", "updatedById", "roleId")
-- VALUES('c3a46189-14d8-4c00-96c1-d38aa1e0ee04', 'system@system.com', '$argon2id$v=19$m=65536,t=3,p=4$/wLOoxG6GDz+hjo3vKgGdQ$7CLjh/NN2xehdE43TWb0kWXN4rQyPx3nIbRzgiSzi6c', 'System', 'Account', '2024-09-24 12:47:37.463', '2024-09-24 12:47:37.463', NULL, NULL, 0);
-- INSERT INTO "User"
-- (id, email, "password", "firstName", "lastName", "createdAt", "updatedAt", "createdById", "updatedById", "roleId")
-- VALUES('8c760a80-17f0-44e8-8c79-1d5a9f43f92f', 'admin@system.com', '$argon2id$v=19$m=65536,t=3,p=4$ARfSM5DZsiRvBXrHJnknrA$fN85k9JPwXXSWYZ8CCl8tQQSEJZSAwQSf/kU05B69b0', 'Admin', 'Account', '2024-09-24 12:48:57.572', '2024-09-24 12:48:57.572', NULL, NULL, 1);